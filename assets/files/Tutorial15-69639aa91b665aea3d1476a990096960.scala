//> using scala "2.13"
//> using lib "ch.unibas.cs.gravis::scalismo-ui:0.90.0"

import scalismo.common.{PointId, UnstructuredPointsDomain}
import scalismo.geometry._
import scalismo.io.{LandmarkIO, MeshIO, StatisticalModelIO}
import scalismo.mesh.TriangleMesh
import scalismo.sampling.algorithms.MetropolisHastings
import scalismo.sampling.evaluators.ProductEvaluator
import scalismo.sampling.proposals.MixtureProposal
import scalismo.sampling.loggers.AcceptRejectLogger
import scalismo.sampling.{DistributionEvaluator, ProposalGenerator, TransitionProbability}
import scalismo.statisticalmodel.{
  MultivariateNormalDistribution,
  PointDistributionModel,
  PointDistributionModel3D
}
import scalismo.transformations.{
  RigidTransformation,
  Rotation3D,
  Translation3D,
  TranslationAfterRotation,
  TranslationAfterRotation3D
}

import scalismo.utils.Memoize

import scalismo.ui.api.ScalismoUI
import breeze.linalg.{DenseMatrix, DenseVector}

object Tutorial15 extends App {

  implicit val rng = scalismo.utils.Random(42)
  scalismo.initialize()

  val ui = ScalismoUI()

  val model =
    StatisticalModelIO.readStatisticalTriangleMeshModel3D(new java.io.File("datasets/bfm.h5")).get

  val modelGroup = ui.createGroup("model")
  val modelView = ui.show(modelGroup, model, "model")
  modelView.referenceView.opacity = 0.5

  val modelLms =
    LandmarkIO.readLandmarksJson[_3D](new java.io.File("datasets/modelLM_mcmc.json")).get
  val modelLmViews = ui.show(modelGroup, modelLms, "modelLandmarks")
  modelLmViews.foreach(lmView => lmView.color = java.awt.Color.BLUE)

  val targetGroup = ui.createGroup("target")

  val targetLms =
    LandmarkIO.readLandmarksJson3D(new java.io.File("datasets/targetLM_mcmc.json")).get
  val targetLmViews = ui.show(targetGroup, targetLms, "targetLandmarks")
  modelLmViews.foreach(lmView => lmView.color = java.awt.Color.RED)

  val modelLmIds = modelLms.map(l => model.mean.pointSet.pointId(l.point).get)
  val targetPoints = targetLms.map(l => l.point)

  val correspondences = modelLmIds
    .zip(targetPoints)
    .map(modelIdWithTargetPoint => {
      val (modelId, targetPoint) = modelIdWithTargetPoint
      (modelId, targetPoint)
    })

  case class Parameters(
      translationParameters: EuclideanVector[_3D],
      rotationParameters: (Double, Double, Double),
      modelCoefficients: DenseVector[Double],
      noiseStddev: Double
  )

  case class Sample(generatedBy: String, parameters: Parameters, rotationCenter: Point[_3D]) {
    def poseTransformation: TranslationAfterRotation[_3D] = {
      val translation = Translation3D(parameters.translationParameters)
      val rotation = Rotation3D(
        parameters.rotationParameters._1,
        parameters.rotationParameters._2,
        parameters.rotationParameters._3,
        rotationCenter
      )
      TranslationAfterRotation3D(translation, rotation)
    }
  }

  case class PriorEvaluator(model: PointDistributionModel[_3D, TriangleMesh])
      extends DistributionEvaluator[Sample] {

    val translationPrior = breeze.stats.distributions.Gaussian(0.0, 5.0)
    val rotationPrior = breeze.stats.distributions.Gaussian(0, 0.1)
    val noisePrior = breeze.stats.distributions.LogNormal(0, 0.25)

    override def logValue(sample: Sample): Double = {
      model.gp.logpdf(sample.parameters.modelCoefficients) +
        translationPrior.logPdf(sample.parameters.translationParameters.x) +
        translationPrior.logPdf(sample.parameters.translationParameters.y) +
        translationPrior.logPdf(sample.parameters.translationParameters.z) +
        rotationPrior.logPdf(sample.parameters.rotationParameters._1) +
        rotationPrior.logPdf(sample.parameters.rotationParameters._2) +
        rotationPrior.logPdf(sample.parameters.rotationParameters._3) +
        noisePrior.logPdf(sample.parameters.noiseStddev)
    }
  }

  def marginalizeModelForCorrespondences(
      model: PointDistributionModel[_3D, TriangleMesh],
      correspondences: Seq[(PointId, Point[_3D])]
  ): (PointDistributionModel[_3D, UnstructuredPointsDomain], Seq[(PointId, Point[_3D])]) = {

    val (modelIds, _) = correspondences.unzip
    val marginalizedModel = model.marginal(modelIds.toIndexedSeq)
    val newCorrespondences = correspondences.map(idWithTargetPoint => {
      val (id, targetPoint) = idWithTargetPoint
      val modelPoint = model.reference.pointSet.point(id)
      val newId = marginalizedModel.reference.pointSet.findClosestPoint(modelPoint).id
      (newId, targetPoint)
    })
    (marginalizedModel, newCorrespondences)
  }

  case class CorrespondenceEvaluator(
      model: PointDistributionModel[_3D, TriangleMesh],
      correspondences: Seq[(PointId, Point[_3D])]
  ) extends DistributionEvaluator[Sample] {

    val (marginalizedModel, newCorrespondences) =
      marginalizeModelForCorrespondences(model, correspondences)

    override def logValue(sample: Sample): Double = {

      val lmUncertainty = MultivariateNormalDistribution(
        DenseVector.zeros[Double](3),
        DenseMatrix.eye[Double](3) * sample.parameters.noiseStddev
      )

      val currModelInstance = marginalizedModel
        .instance(sample.parameters.modelCoefficients)
        .transform(sample.poseTransformation)

      val likelihoods = newCorrespondences.map(correspondence => {
        val (id, targetPoint) = correspondence
        val modelInstancePoint = currModelInstance.pointSet.point(id)
        val observedDeformation = targetPoint - modelInstancePoint

        lmUncertainty.logpdf(observedDeformation.toBreezeVector)
      })

      val loglikelihood = likelihoods.sum
      loglikelihood
    }
  }

  case class CachedEvaluator[A](evaluator: DistributionEvaluator[A])
      extends DistributionEvaluator[A] {
    val memoizedLogValue = Memoize(evaluator.logValue, 10)

    override def logValue(sample: A): Double = {
      memoizedLogValue(sample)
    }
  }

  val likelihoodEvaluator = CachedEvaluator(CorrespondenceEvaluator(model, correspondences))
  val priorEvaluator = CachedEvaluator(PriorEvaluator(model))

  val posteriorEvaluator = ProductEvaluator(priorEvaluator, likelihoodEvaluator)

  case class ShapeUpdateProposal(paramVectorSize: Int, stddev: Double)
      extends ProposalGenerator[Sample]
      with TransitionProbability[Sample] {

    val perturbationDistr = new MultivariateNormalDistribution(
      DenseVector.zeros(paramVectorSize),
      DenseMatrix.eye[Double](paramVectorSize) * stddev * stddev
    )

    override def propose(sample: Sample): Sample = {
      val perturbation = perturbationDistr.sample()
      val newParameters =
        sample.parameters.copy(modelCoefficients =
          sample.parameters.modelCoefficients + perturbationDistr.sample
        )
      sample.copy(generatedBy = s"ShapeUpdateProposal ($stddev)", parameters = newParameters)
    }

    override def logTransitionProbability(from: Sample, to: Sample) = {
      val residual = to.parameters.modelCoefficients - from.parameters.modelCoefficients
      perturbationDistr.logpdf(residual)
    }
  }

  case class RotationUpdateProposal(stddev: Double)
      extends ProposalGenerator[Sample]
      with TransitionProbability[Sample] {
    val perturbationDistr =
      new MultivariateNormalDistribution(
        DenseVector.zeros[Double](3),
        DenseMatrix.eye[Double](3) * stddev * stddev
      )
    def propose(sample: Sample): Sample = {
      val perturbation = perturbationDistr.sample
      val newRotationParameters = (
        sample.parameters.rotationParameters._1 + perturbation(0),
        sample.parameters.rotationParameters._2 + perturbation(1),
        sample.parameters.rotationParameters._3 + perturbation(2)
      )
      val newParameters = sample.parameters.copy(rotationParameters = newRotationParameters)
      sample.copy(generatedBy = s"RotationUpdateProposal ($stddev)", parameters = newParameters)
    }
    override def logTransitionProbability(from: Sample, to: Sample) = {
      val residual = DenseVector(
        to.parameters.rotationParameters._1 - from.parameters.rotationParameters._1,
        to.parameters.rotationParameters._2 - from.parameters.rotationParameters._2,
        to.parameters.rotationParameters._3 - from.parameters.rotationParameters._3
      )
      perturbationDistr.logpdf(residual)
    }
  }

  case class TranslationUpdateProposal(stddev: Double)
      extends ProposalGenerator[Sample]
      with TransitionProbability[Sample] {

    val perturbationDistr =
      new MultivariateNormalDistribution(
        DenseVector.zeros(3),
        DenseMatrix.eye[Double](3) * stddev * stddev
      )

    def propose(sample: Sample): Sample = {
      val newTranslationParameters =
        sample.parameters.translationParameters + EuclideanVector.fromBreezeVector(
          perturbationDistr.sample()
        )
      val newParameters = sample.parameters.copy(translationParameters = newTranslationParameters)
      sample.copy(generatedBy = s"TranlationUpdateProposal ($stddev)", parameters = newParameters)
    }

    override def logTransitionProbability(from: Sample, to: Sample) = {
      val residual = to.parameters.translationParameters - from.parameters.translationParameters
      perturbationDistr.logpdf(residual.toBreezeVector)
    }
  }

  case class NoiseStddevUpdateProposal(stddev: Double)(implicit rng: scalismo.utils.Random)
      extends ProposalGenerator[Sample]
      with TransitionProbability[Sample] {

    val perturbationDistr = breeze.stats.distributions.Gaussian(0, stddev)(rng.breezeRandBasis)

    def propose(sample: Sample): Sample = {
      val newSigma = sample.parameters.noiseStddev + perturbationDistr.sample()
      val newParameters = sample.parameters.copy(noiseStddev = newSigma)
      sample.copy(generatedBy = s"NoiseStddevUpdateProposal ($stddev)", parameters = newParameters)
    }

    override def logTransitionProbability(from: Sample, to: Sample) = {
      val residual = to.parameters.noiseStddev - from.parameters.noiseStddev
      perturbationDistr.logPdf(residual)
    }
  }

  val shapeUpdateProposal = ShapeUpdateProposal(model.rank, 0.1)
  val rotationUpdateProposal = RotationUpdateProposal(0.01)
  val translationUpdateProposal = TranslationUpdateProposal(1.0)
  val noiseStddevUpdateProposal = NoiseStddevUpdateProposal(0.1)

  val generator = MixtureProposal.fromProposalsWithTransition(
    (0.5, shapeUpdateProposal),
    (0.2, rotationUpdateProposal),
    (0.2, translationUpdateProposal),
    (0.1, noiseStddevUpdateProposal)
  )

  class Logger extends AcceptRejectLogger[Sample] {
    private val numAccepted = collection.mutable.Map[String, Int]()
    private val numRejected = collection.mutable.Map[String, Int]()

    override def accept(
        current: Sample,
        sample: Sample,
        generator: ProposalGenerator[Sample],
        evaluator: DistributionEvaluator[Sample]
    ): Unit = {
      val numAcceptedSoFar = numAccepted.getOrElseUpdate(sample.generatedBy, 0)
      numAccepted.update(sample.generatedBy, numAcceptedSoFar + 1)
    }

    override def reject(
        current: Sample,
        sample: Sample,
        generator: ProposalGenerator[Sample],
        evaluator: DistributionEvaluator[Sample]
    ): Unit = {
      val numRejectedSoFar = numRejected.getOrElseUpdate(sample.generatedBy, 0)
      numRejected.update(sample.generatedBy, numRejectedSoFar + 1)
    }

    def acceptanceRatios(): Map[String, Double] = {
      val generatorNames = numRejected.keys.toSet.union(numAccepted.keys.toSet)
      val acceptanceRatios = for (generatorName <- generatorNames) yield {
        val total = (numAccepted.getOrElse(generatorName, 0)
          + numRejected.getOrElse(generatorName, 0)).toDouble
        (generatorName, numAccepted.getOrElse(generatorName, 0) / total)
      }
      acceptanceRatios.toMap
    }
  }

  def computeCenterOfMass(mesh: TriangleMesh[_3D]): Point[_3D] = {
    val normFactor = 1.0 / mesh.pointSet.numberOfPoints
    mesh.pointSet.points.foldLeft(Point(0, 0, 0))((sum, point) => sum + point.toVector * normFactor)
  }

  val initialParameters = Parameters(
    translationParameters = EuclideanVector(0, 0, 0),
    rotationParameters = (0.0, 0.0, 0.0),
    modelCoefficients = DenseVector.zeros[Double](model.rank),
    noiseStddev = 1.0
  )

  val initialSample = Sample("initial", initialParameters, computeCenterOfMass(model.mean))

  val chain = MetropolisHastings(generator, posteriorEvaluator)
  val logger = new Logger()
  val mhIterator = chain.iterator(initialSample, logger)

  val samplingIterator = for ((sample, iteration) <- mhIterator.zipWithIndex) yield {
    println("iteration " + iteration)
    if (iteration % 500 == 0) {
      modelView.shapeModelTransformationView.shapeTransformationView.coefficients =
        sample.parameters.modelCoefficients
      modelView.shapeModelTransformationView.poseTransformationView.transformation =
        sample.poseTransformation
    }
    sample
  }

  val samples = samplingIterator.drop(1000).take(10000).toIndexedSeq
  println(logger.acceptanceRatios())

  val bestSample = samples.maxBy(posteriorEvaluator.logValue)
  val bestFit =
    model.instance(bestSample.parameters.modelCoefficients).transform(bestSample.poseTransformation)
  val resultGroup = ui.createGroup("result")
  ui.show(resultGroup, bestFit, "best fit")

  def computeMean(
      model: PointDistributionModel[_3D, UnstructuredPointsDomain],
      id: PointId
  ): Point[_3D] = {
    var mean = EuclideanVector(0, 0, 0)
    for (sample <- samples) yield {
      val modelInstance = model.instance(sample.parameters.modelCoefficients)
      val pointForInstance = modelInstance.transform(sample.poseTransformation).pointSet.point(id)
      mean += pointForInstance.toVector
    }
    (mean * 1.0 / samples.size).toPoint
  }

  def computeCovarianceFromSamples(
      model: PointDistributionModel[_3D, UnstructuredPointsDomain],
      id: PointId,
      mean: Point[_3D]
  ): SquareMatrix[_3D] = {
    var cov = SquareMatrix.zeros[_3D]
    for (sample <- samples) yield {
      val modelInstance = model.instance(sample.parameters.modelCoefficients)
      val pointForInstance = modelInstance.transform(sample.poseTransformation).pointSet.point(id)
      val v = pointForInstance - mean
      cov += v.outer(v)
    }
    cov * (1.0 / samples.size)
  }

  val (marginalizedModel, newCorrespondences) =
    marginalizeModelForCorrespondences(model, correspondences)
  for ((id, _) <- newCorrespondences) {
    val meanPointPosition = computeMean(marginalizedModel, id)
    println(s"expected position for point at id $id  = $meanPointPosition")
    val cov = computeCovarianceFromSamples(marginalizedModel, id, meanPointPosition)
    println(
      s"posterior variance computed  for point at id (shape and pose) $id  = ${cov(0, 0)}, ${cov(1, 1)}, ${cov(2, 2)}"
    )
  }
  ui.close()
}
