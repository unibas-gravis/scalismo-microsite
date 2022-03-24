---
id: tutorial14
title: Model fitting using MCMC - The basic framework
---

In this tutorial we show how Bayesian model fitting using Markov Chain Monte Carlo can be done in Scalismo. To be able
to focus on the main components of the framework instead of technical details, we start in this tutorial with a simple toy example, namely 
1D Bayesian linear regression. The application to 3D shape modelling is discussed in depth in the next tutorial.


##### Related resources

Week 2 of our [online course](https://shapemodelling.cs.unibas.ch/probabilistic-fitting-course/) on shape model fitting may provide some helpful context for this tutorial.

To run the code from this tutorial, download the following Scala file:
- [Tutorial14.scala](./Tutorial14.scala)

```scala mdoc:invisible
//> using scala "2.13"
//> using lib "ch.unibas.cs.gravis::scalismo-ui:0.91-RC3"
```

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


```scala mdoc:silent emptyLines:2
import scalismo.sampling.MHSample
import scalismo.sampling.MHDistributionEvaluator
import scalismo.sampling.evaluators.ProductEvaluator
import scalismo.sampling.MHProposalGenerator
import scalismo.sampling.proposals.GaussianRandomWalkProposal
import scalismo.sampling.proposals.MHProductProposal
import scalismo.sampling.ParameterConversion
import scalismo.sampling.algorithms.MetropolisHastings
import scalismo.sampling.loggers.MHSampleLogger
import scalismo.sampling.proposals.MHMixtureProposal
import scalismo.sampling.proposals.MHIdentityProposal
import breeze.stats.meanAndVariance
```

```scala mdoc:invisible emptyLines:2
object Tutorial14 extends App {
```


```scala mdoc:silent emptyLines:2
 scalismo.initialize()
 implicit val rng : scalismo.utils.Random = scalismo.utils.Random(42)

// We need this line to seed breeze's random number generator
implicit val randBasisBreeze : breeze.stats.distributions.RandBasis = rng.breezeRandBasis
```
To make the setup simple, we generate artificial data, which follows exactly our assumptions. In this way we will be able to see
how well we estimated the parameters.

```scala mdoc:silent empytLines:2
  
      val a = 0.2
      val b = 3
      val sigma2 = 0.5
      val errorDist = breeze.stats.distributions.Gaussian(0, sigma2)(rng.breezeRandBasis)
      val data = for (x <- 0 until 100) yield {
        (x.toDouble, a * x + b + errorDist.draw())
      }

```

Before we discuss the two main components, the *Evaluator* and *Proposal generator* in detail, we first define a class for representing
the parameters $$\theta = (a, b, \sigma^2)$$:
```scala mdoc:silent empytLines:2
case class Parameters(a : Double, b:  Double, sigma2 : Double)
```
To be able to make use of the proposal generators that Scalismo provides, we will also need to define a conversion object, which 
tells Scalismo how our parameters can be converted to a tuple and back. 

```scala mdoc:silent emptyLines:2
implicit object tuple3ParameterConversion extends ParameterConversion[Tuple3[Double, Double, Double], Parameters] {
    def from(p: Parameters): Tuple3[Double, Double, Double] = (p.a, p.b, p.sigma2)
    def to(t: Tuple3[Double, Double, Double]): Parameters = Parameters(a = t._1, b = t._2, sigma2 = t._3)
  }
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

```scala mdoc:silent empytLines:2
  case class LikelihoodEvaluator(data: Seq[(Double, Double)])
      extends MHDistributionEvaluator[Parameters] {

    override def logValue(theta: MHSample[Parameters]): Double = {

      val likelihoods = for ((x, y) <- data) yield {
        val likelihood = breeze.stats.distributions.Gaussian(
          theta.parameters.a * x + theta.parameters.b,
          theta.parameters.sigma2
        )

        likelihood.logPdf(y)
      }
      likelihoods.sum
    }
  }
```
Notice that we work in Scalismo with log probabilities, and hence the product in above formula
becomes a sum.

In a similar way, we encode the prior distribution:
```scala mdoc:silent empytLines:2

  object PriorEvaluator extends MHDistributionEvaluator[Parameters] {

    val priorDistA = breeze.stats.distributions.Gaussian(0, 1)
    val priorDistB = breeze.stats.distributions.Gaussian(0, 10)
    val priorDistSigma = breeze.stats.distributions.LogNormal(0, 0.25)

    override def logValue(theta: MHSample[Parameters]): Double = {
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

Now that the evaluators are in place, our next task is to set up the proposal distributions. 
In Scalismo, we can define a proposal distribution by implementing concrete subclasses, of the 
following class 
```scala
abstract class MHProposalGenerator[A]  {
   def propose(current: A): A
   def logTransitionProbability(from: A, to: A): Double
}
```
The type ```A``` refers to the type of the parameters that we are using. The `propose` method takes the current
parameters and, based on their values, proposes a new one. The method `logTransitionProbability` yields the 
logProbability of transitioning from the state represented by the parameter values ```from``` to the state represented
by the parameter values in ```to```. 

Fortunately, we usually do not have to implement these methods by ourselves. Scalismo already provides some proposal generators, 
which can be flexibly combined to build up more powerful generators. 

The most generic one is the `GaussianRandomWalkProposal`, which takes the given parameters and perturbs them by adding an increment from a 
zero-mean Gaussian with given standard deviation. The following codes defines a proposal for each of our parameter vectors.
```scala mdoc:silent emptyLines:2
  val genA = GaussianRandomWalkProposal(0.01, "rw-a-0.1").forType[Double]
  val genB = GaussianRandomWalkProposal(0.05, "rw-b-0.5").forType[Double]
  val genSigma = GaussianRandomWalkProposal(0.01, "rw-sigma-0.01").forType[Double]
```
As we expect the distribution to have more variability in the value of $b$ than $a$, we choose the values for the step size (standard deviation)
accordingly. We also provide a tag when defining a proposal generator. This is helpful for debugging and optimizing the chain. 
Finally, note also that we explicitly specified a type (here `Double`) of the specified sample. 

We can now combine these individual proposal generators to a proposal generator for our Parameter class as follows:
```scala mdoc:silent emptyLines:2
 val parameterGenerator = MHProductProposal(genA, genB, genSigma).forType[Parameters]
``` 

It might also be a good idea to sometimes only vary the noise ```genSigma``` but not the other parameters. To achieve this, we introduce another proposal, 
the ```MHIdentityProposal```. As the name suggests, it does not do anything, but simply returns the same parameters it gets passed. 
While this does not sound very useful by itself, by combining it with other proposals we can achieve our goal:
```scala mdoc:silent emptyLines:2
  val identProposal = MHIdentityProposal.forType[Double]
  val noiseOnlyGenerator = MHProductProposal(identProposal, identProposal, genSigma).forType[Parameters]
```

We have now two different generators, which generate new parameters given a current set of parameter values. A good strategy is to sometimes vary all the parameters, and sometimes only the noise. This can be done using a ```MHMixtureProposal```:
```scala mdoc:silent emptyLines:2
  val mixtureGenerator = MHMixtureProposal((0.1, noiseOnlyGenerator), (0.9, parameterGenerator))
```
In this case we use the `noiseOnlyGenerator` 10% of the times and the ```parameterGenerator``` 90% of the times. 

#### Building the Markov Chain

Now that we have all the components set up, we can assemble the Markov Chain.
```scala mdoc:silent empytLines:2
val chain = MetropolisHastings(mixtureGenerator, posteriorEvaluator)
```
 
To be able to diagnose the chain, in case of problems, we also instantiate a logger, which logs all the 
accepted and rejected samples. 
```scala mdoc:silent emptyLines:2
val logger = MHSampleLogger[Parameters]()
```

The Markov chain has to start somewhere. We define the starting point by defining an initial sample.

```scala mdoc:silent empytLines:2
val initialSample = MHSample(Parameters(0.0, 0.0, 1.0), generatedBy="initial")
```
To drive the sampling generation, we define an interator, which we initialize with the initial sample. 
We also provide the logger as an argument. 

```scala mdoc:silent emptyLines:2
val mhIterator = chain.iterator(initialSample, logger)
```

Our initial parameters might be far away from a high-probability area of our target
density. Therefore it might take a few hundred or even a few thousand iterations before the produced samples
start to follow the required distribution. We therefore have to drop the
samples in this burn-in phase, before we use the samples:
```scala mdoc:silent
val samples = mhIterator.drop(1000).take(5000).toIndexedSeq
```
As we have generated synthetic data, we can check if the expected value, computed
from this samples, really corresponds to the parameters from which we sampled
our data:
```scala mdoc:silent empytLines:2
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

The logger that we defined for the chain stored all the accepted and rejected samples. We can use this
to get interesting diagnostics. 

For example, we can check how often the individual samples got accepted.
```scala mdoc:silent empytLines:2
  println("Acceptance ratios: " +logger.samples.acceptanceRatios)
```

When running this code we see that the acceptance ratio of the proposal where we vary all the parameters, is around 0.12. 
The proposal, which only changes the noise value has, as expected, a much higher acceptance ratio of aroun 0.75. 

Sometimes it happens that a chain is efficient in the early stages (the burn-in phase), but many samples get rejected in later stages. 
To diagnose such situations, we can compute the acceptance ratios also only for the last $n$ samples:

```scala mdoc:silent empytLines:2
println("acceptance ratios over the last 100 samples: " +logger.samples.takeLast(100).acceptanceRatios)
```

Such diagnostics helps us to spot when a proposal is not effective and gives us an indication how to tune our sampler
to achieve optimal performance. 

```scala mdoc:invisible
}
```