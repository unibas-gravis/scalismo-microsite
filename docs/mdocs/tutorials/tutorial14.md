---
id: tutorial14
title: Model fitting using MCMC - The basic framework
---

In this tutorial we show how Bayesian model fitting using Markov Chain Monte Carlo can be done in Scalismo. To be able
to focus on the main components of the framework instead of technical details, we start in this tutorial with a simple toy example, namely 
1D Bayesian linear regression. The application to 3D shape modelling is discussed in depth in the next tutorial.


##### Related resources

Week 2 of our [online course](https://shapemodelling.cs.unibas.ch/probabilistic-fitting-course/) on shape model fitting may provide some helpful context for this tutorial.


### Problem setting

In a Bayesian linear regression an outcome variable $$y$$ is modelled a linear function of the explanatory variable $x$. 
The normal linear model assumes that the distribution of $$y$$ is a normal distribution with a mean $$a \cdot x + b$$ and variance $$\sigma^2$$. 
$$
y \sim N(a \cdot x + b, \sigma^2 ).
$$

In the following we will denote the unknown parameters $$a$$, $$b$$ and $$\sigma^2$$ by $$\theta$$; I.e. $$\theta = (a, b, \sigma^2)$$. 
The inference problem is to estimate the parameters $$\theta$$, given observations $$X=(x_1, \ldots, x_n)$$ and $$Y=(y_1, \ldots, y_n)$$. 
This is done by computing the posterior distribution:
$$
p(\theta | Y, X) = \frac{p(Y | \theta, X)p(\theta)}{\int P(Y | \theta, X)p(\theta) \, d\theta} 
$$

The likelihood term $$p(Y | \theta, X)$$ is given by the normal distribution $$N(a \cdot x + b,\sigma^2)$$ define above. Hence the likelihood of observing the data $X, Y$ is
$$
\prod_{i=1}^n p(y_i | \theta, x_i) = \prod_{i=1}^n N(y_i | a \cdot x_i + b, \sigma^2)
$$

As prior distribution $$p(\theta)$$ we define 
$$
a \sim N(0, 5) \\
b \sim N(0, 10) \\
\sigma^2 \sim logNormal(0, 0.25)
$$

### Metropolis Hastings Algorithm

The way we approach such an inference problem in Scalismo is by using the
Metropolis-Hastings algorithm. The Metropolis-Hastings algorithm allows us to
draw samples from any distribution, given that the unnormalized distribution can be evaluated point-wise. This requirement is
easy to fulfill for all shape modelling applications.

For setting up the Metropolis-Hastings algorithm, we need two things:
1. The (unnormalized) target distribution, from which we want to sample. In our case this is the posterior distribution $$p(\theta \mid Y, X))$$. In Scalismo
the corresponding class is called the ```DistributionEvaluator```.
2. A proposal distribution $$Q(\theta' \mid \theta)$$, which generates for a given sample $$\theta$$ a new sample $$\theta'$$.

The Metropolis Hastings algorithm introduces an ingenious scheme for accepting
and rejecting the samples from this proposal distribution, based on their probability under the target density,
such that the resulting sequence of samples is guaranteed to be distributed according to the
target distribution.
In practice, the algorithm works as follows: It uses the proposal generator to perturb a given sample $$\theta$$ to obtain a new sample $$\theta'$$.  Then it checks, using the evaluator, which of the two samples, $$\theta$$ or $$\theta'$$ is more likely and
uses this ratio as a basis for rejecting or accepting the new sample.


### Implementation in Scalismo

##### Preparation

As in the previous tutorials, we start by importing some commonly used objects and initializing the system.


```scala mdoc:silent
 import scalismo.sampling.algorithms.MetropolisHastings
 import scalismo.sampling.evaluators.ProductEvaluator
 import scalismo.sampling.loggers.AcceptRejectLogger
 import scalismo.sampling.proposals.MixtureProposal
 import scalismo.sampling.{DistributionEvaluator, ProposalGenerator, TransitionProbability}
 import breeze.stats.distributions.Gaussian
 import breeze.stats.meanAndVariance

 scalismo.initialize()
 implicit val rng = scalismo.utils.Random(42)
```
To make the setup simple, we generate artificial data, which follows exactly our assumptions. In this way we will be able to see
how well we estimated the parameters.

```scala mdoc:silent
  
      val a = 0.2
      val b = 3
      val sigma2 = 0.5
      val errorDist = breeze.stats.distributions.Gaussian(0, sigma2)
      val data = for (x <- 0 until 100) yield {
        (x.toDouble, a * x + b + errorDist.draw())
      }

```

Before we discuss the two main components, the *Evaluator* and *Proposal generator* in detail, we first define a class for representing
the parameters $$\theta = (a, b, \sigma^2)$$:
```scala mdoc:silent
case class Parameters(a : Double, b:  Double, sigma2 : Double)
```

We introduce a further class to represent a sample from the chain. A sample is
simply a set of parameters together with a tag, which helps us to keep track later
on, which proposal generator generated the sample:
```scala mdoc:silent
case class Sample(parameters : Parameters, generatedBy : String)
```

#### Evaluators: Modelling the target density

In Scalismo, the target density is represented by classes, which we will refer to
as *Evaluators*. Any Evaluator is a subclass of the class ```DistributionEvalutor```,
which is defined in Scalismo as follows:
```scala
trait DistributionEvaluator[A] {
  /** log probability/density of sample */
  def logValue(sample: A): Double
}
```
*Note: This trait is already defined in Scalismo, don't paste it into your code.*

We see that the only thing we need to define is the log probability of a sample.

In our case, we will define separate evaluators for the prior distribution $$p(\theta)$$ and
  the likelihood $$p(Y | \theta, X)$$.

The likelihood function, defined above, can be implemented as follows:

```scala mdoc:silent
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
```
Notice that we work in Scalismo with log probabilities, and hence the product in above formula
becomes a sum.

In a similar way, we encode the prior distribution:
```scala mdoc:silent

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
```

The target density (i.e. the posterior distribution) can be computed by
taking the product of the prior and the likelihood.
```scala mdoc:silent
  val posteriorEvaluator = ProductEvaluator(PriorEvaluator, LikelihoodEvaluator(data))
```
Note that the posteriorEvaluator represents the unnormalized posterior, as we did
not normalize by the probability of the data $$p(y)$$.

#### The proposal generator

In Scalismo, a proposal generator is defined by extending the trait
*ProposalGenerator*, which is defined as follows
```scala
trait ProposalGenerator[A] {
  /** draw a sample from this proposal distribution, may depend on current state */
  def propose(current: A): A
}
```

In order to be able to use a proposal generator in the Metropolis-Hastings algorithm,
we also need to implement the trait ```TransitionProbability```:
```scala
trait TransitionProbability[A] extends TransitionRatio[A] {
  /** rate of transition from to (log value) */
  def logTransitionProbability(from: A, to: A): Double
}
```
*Note: The above traits are already defined in Scalismo, don't paste them into your code.*

We use here one of the simples possible proposals, namely a *random walk proposal*. This is a proposal
which updates the current state by taking a step of random length in a random direction. For simplicity, 
we update all three parameters together:

```scala mdoc:silent
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

```
*Remark: the second constructor argument ```implicit rng : scalismo.utils.Random```
is used to automatically pass the globally defined random generator object to the
class. If we always use this random generator to generate our random numbers, we can obtain reproducible runs,
by seeding this random generator at the beginning of our program.*

Let's define two random walk proposals with different step length:

```scala mdoc:silent
val smallStepProposal = RandomWalkProposal(0.01, 0.01, 0.01)
val largeStepProposal = RandomWalkProposal(0.1, 0.1, 0.1)
```

Varying the step length allow us to sometimes take large step, in order to explore the global
landscape, and sometimes smaller steps, to explore a local environment. We can combine these proposal into a
```MixtureProposal```, which chooses the individual proposals with a given
probability. Here We choose to take the large step 20% of the time, and the smaller
steps 80% of the time:

```scala mdoc:silent
val generator = MixtureProposal.fromProposalsWithTransition[Sample](
    (0.8, smallStepProposal),
    (0.2, largeStepProposal)
    )
```


#### Building the Markov Chain

Now that we have all the components set up, we can assemble the Markov Chain.
```scala mdoc:silent
val chain = MetropolisHastings(generator, posteriorEvaluator)
```

To run the chain, we obtain an iterator,
which we then consume to drive the sampling generation. To obtain the iterator, we need to specify the initial
sample:

```scala mdoc:silent
val initialSample = Sample(Parameters(0.0, 0.0, 1.0), generatedBy="initial")
val mhIterator = chain.iterator(initialSample)
```

Our initial parameters might be far away from a high-probability area of our target
density. Therefore it might take a few hundred or even a few thousand iterations before the produced samples
start to follow the required distribution. We therefore have to drop the
samples in this burn-in phase, before we use the samples:
```scala mdoc:silent
val samples = mhIterator.drop(5000).take(15000).toIndexedSeq
```
As we have generated synthetic data, we can check if the expected value, computed
from this samples, really corresponds to the parameters from which we sampled
our data:
```scala mdoc:silent
val meanAndVarianceA = meanAndVariance(samples.map(_.parameters.a))
println(s"Estimates for parameter a: mean = ${meanAndVarianceA.mean}, var = ${meanAndVarianceA.variance}")
val meanAndVarianceB = meanAndVariance(samples.map(_.parameters.b))
println(s"Estimates for parameter b: mean = ${meanAndVarianceB.mean}, var = ${meanAndVarianceB.variance}")
val meanAndVarianceSigma2 = meanAndVariance(samples.map(_.parameters.sigma2))
println(s"Estimates for parameter sigma2: mean = ${meanAndVarianceSigma2.mean}, var = ${meanAndVarianceSigma2.variance}")
```

In the next tutorial, we see an example of how the exact same  mechanism can be used for
fitting shape models. Before we discuss this, we should, however, spend some time
to discuss how the chain can be debugged in case something goes wrong.
You can safely skip this section and come back to it later if you first want to
see a practical example.

#### Debugging the Markov chain


Sometimes a chain does not work as expected. The reason is usually that our proposals
are not suitable for the target distribution. To diagnose the
behaviour of the chain we can introduce a logger. To write a logger, we need to extend
 the trait ```AcceptRejectLogger```, which is defined as follows:

```scala
trait AcceptRejectLogger[A] {
  def accept(current: A, sample: A, generator: ProposalGenerator[A], evaluator: DistributionEvaluator[A]): Unit

  def reject(current: A, sample: A, generator: ProposalGenerator[A], evaluator: DistributionEvaluator[A]): Unit
}
```
*Note: This trait is already defined in Scalismo, don't paste it into your code.*

The two methods, ```accept``` and ```reject``` are called whenever a sample is
accepted or rejected. We can overwrite these methods to implement our debugging code.


The following, very simple logger counts all the accepted and rejected samples and
computes the acceptance ratio. This acceptance ratio is a simple, but already useful
indicator to diagnose if all proposal generators function as expected.

```scala mdoc:silent
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
```

To use the logger, we simply rerun the chain, but pass the logger now as
    a second argument to the ```iterator``` method:
```scala mdoc:silent
  val logger = new Logger()
  val mhIteratorWithLogging = chain.iterator(initialSample, logger)

  val samples2 = mhIteratorWithLogging.drop(5000).take(15000).toIndexedSeq
```

We can now check how often the individual samples got accepted.
```scala mdoc
  println("acceptance ratio is " +logger.acceptanceRatios())
```
We see that the acceptance ratio of the random walk proposal, which takes the
smaller step is quite high, but that the larger step is often rejected. We might
therefore want to reduce this step size slightly, as a proposal that is so often
rejected is not very efficient.

In more complicated applications, this type of debugging is crucial for obtaining
efficient fitting algorithms.
