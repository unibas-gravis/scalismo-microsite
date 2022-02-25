 import scalismo.sampling.algorithms.MetropolisHastings
 import scalismo.sampling.evaluators.ProductEvaluator
 import scalismo.sampling.loggers.AcceptRejectLogger
 import scalismo.sampling.proposals.MixtureProposal
 import scalismo.sampling.{DistributionEvaluator, ProposalGenerator, TransitionProbability}
 import breeze.stats.distributions.Gaussian
 import breeze.stats.meanAndVariance

 scalismo.initialize()
 implicit val rng = scalismo.utils.Random(42)
  
      val a = 0.2
      val b = 3
      val sigma2 = 0.5
      val errorDist = breeze.stats.distributions.Gaussian(0, sigma2)
      val data = for (x <- 0 until 100) yield {
        (x.toDouble, a * x + b + errorDist.draw())
      }

case class Parameters(a : Double, b:  Double, sigma2 : Double)
case class Sample(parameters : Parameters, generatedBy : String)
trait DistributionEvaluator[A] {
  /** log probability/density of sample */
  def logValue(sample: A): Double
}
case class LikelihoodEvaluator(data : Seq[(Double, Double)]) extends DistributionEvaluator[Sample] {

    override def logValue(theta: Sample): Double = {

      val likelihoods = for ((x, y) <- data) yield {
        val likelihood = breeze.stats.distributions.Gaussian(
          theta.parameters.a * x + theta.parameters.b, theta.parameters.sigma2)

        likelihood.logPdf(y)
      }
      likelihoods.sum
    }
  }

object PriorEvaluator extends DistributionEvaluator[Sample] {

  val priorDistA = breeze.stats.distributions.Gaussian(0, 1)
  val priorDistB = breeze.stats.distributions.Gaussian(0, 10)
  val priorDistSigma = breeze.stats.distributions.LogNormal(0, 0.25)
  override def logValue(theta: Sample): Double = {
    priorDistA.logPdf(theta.parameters.a)
    + priorDistB.logPdf(theta.parameters.b)
    + priorDistSigma.logPdf(theta.parameters.sigma2)
  }
}
  val posteriorEvaluator = ProductEvaluator(PriorEvaluator, LikelihoodEvaluator(data))
trait ProposalGenerator[A] {
  /** draw a sample from this proposal distribution, may depend on current state */
  def propose(current: A): A
}
trait TransitionProbability[A] extends TransitionRatio[A] {
  /** rate of transition from to (log value) */
  def logTransitionProbability(from: A, to: A): Double
}
  case class RandomWalkProposal(stepLengthA: Double, stepLengthB : Double, stepLengthSigma2 : Double)(implicit rng : scalismo.utils.Random)
    extends ProposalGenerator[Sample] with TransitionProbability[Sample] {

    override def propose(sample: Sample): Sample = {
      val newParameters = Parameters(
        a = sample.parameters.a + rng.breezeRandBasis.gaussian(0, stepLengthA).draw(),
        b = sample.parameters.b + rng.breezeRandBasis.gaussian(0, stepLengthB).draw(),
        sigma2 = sample.parameters.sigma2 + rng.breezeRandBasis.gaussian(0, stepLengthSigma2).draw(),
      )

      Sample(newParameters, s"randomWalkProposal ($stepLengthA, $stepLengthB)")
    }

    override def logTransitionProbability(from: Sample, to: Sample) : Double = {

      val stepDistA = breeze.stats.distributions.Gaussian(0, stepLengthA)
      val stepDistB = breeze.stats.distributions.Gaussian(0, stepLengthB)
      val stepDistSigma2 = breeze.stats.distributions.Gaussian(0, stepLengthSigma2)
      val residualA = to.parameters.a - from.parameters.a
      val residualB = to.parameters.b - from.parameters.b
      val residualSigma2 = to.parameters.sigma2 - from.parameters.sigma2
      stepDistA.logPdf(residualA)  + stepDistB.logPdf(residualB) + stepDistSigma2.logPdf(residualSigma2)
    }
  }

val smallStepProposal = RandomWalkProposal(0.01, 0.01, 0.01)
val largeStepProposal = RandomWalkProposal(0.1, 0.1, 0.1)
val generator = MixtureProposal.fromProposalsWithTransition[Sample](
    (0.8, smallStepProposal),
    (0.2, largeStepProposal)
    )
val generator = MixtureProposal.fromProposalsWithTransition[Sample](
    (0.8, smallStepProposal),
    (0.2, largeStepProposal)
    )
val chain = MetropolisHastings(generator, posteriorEvaluator)
val initialSample = Sample(Parameters(0.0, 0.0, 1.0), generatedBy="initial")
val mhIterator = chain.iterator(initialSample)
val samples = mhIterator.drop(5000).take(15000).toIndexedSeq
val meanAndVarianceA = meanAndVariance(samples.map(_.parameters.a))
println(s"Estimates for parameter a: mean = ${meanAndVarianceA.mean}, var = ${meanAndVarianceA.variance}")
val meanAndVarianceB = meanAndVariance(samples.map(_.parameters.b))
println(s"Estimates for parameter b: mean = ${meanAndVarianceB.mean}, var = ${meanAndVarianceB.variance}")
val meanAndVarianceSigma2 = meanAndVariance(samples.map(_.parameters.sigma2))
println(s"Estimates for parameter sigma2: mean = ${meanAndVarianceSigma2.mean}, var = ${meanAndVarianceSigma2.variance}")
trait AcceptRejectLogger[A] {
  def accept(current: A, sample: A, generator: ProposalGenerator[A], evaluator: DistributionEvaluator[A]): Unit

  def reject(current: A, sample: A, generator: ProposalGenerator[A], evaluator: DistributionEvaluator[A]): Unit
}
  class Logger extends AcceptRejectLogger[Sample] {
    private val numAccepted = collection.mutable.Map[String, Int]()
    private val numRejected = collection.mutable.Map[String, Int]()

    override def accept(current: Sample,
                        sample: Sample,
                        generator: ProposalGenerator[Sample],
                        evaluator: DistributionEvaluator[Sample]
                       ): Unit = {
      val numAcceptedSoFar = numAccepted.getOrElseUpdate(sample.generatedBy, 0)
      numAccepted.update(sample.generatedBy, numAcceptedSoFar + 1)
    }

    override def reject(current: Sample,
                          sample: Sample,
                          generator: ProposalGenerator[Sample],
                          evaluator: DistributionEvaluator[Sample]
                         ): Unit = {
      val numRejectedSoFar = numRejected.getOrElseUpdate(sample.generatedBy, 0)
      numRejected.update(sample.generatedBy, numRejectedSoFar + 1)
    }


    def acceptanceRatios() : Map[String, Double] = {
      val generatorNames = numRejected.keys.toSet.union(numAccepted.keys.toSet)
      val acceptanceRatios = for (generatorName <- generatorNames ) yield {
        val total = (numAccepted.getOrElse(generatorName, 0)
                     + numRejected.getOrElse(generatorName, 0)).toDouble
        (generatorName, numAccepted.getOrElse(generatorName, 0) / total)
      }
      acceptanceRatios.toMap
    }
  }
  val logger = new Logger()
  val mhIteratorWithLogging = chain.iterator(initialSample, logger)

  val samples2 = mhIteratorWithLogging.drop(5000).take(15000).toIndexedSeq
  println("acceptance ratio is " +logger.acceptanceRatios())