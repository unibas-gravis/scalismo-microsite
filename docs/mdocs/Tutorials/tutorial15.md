---
id: tutorial15
title: Model fitting using MCMC - Fitting a shape model
---

In this tutorial we show how the MCMC framework, which was introduced in the previous
tutorial, can be used for shape model fitting.

We will illustrate it by computing a posterior of a shape model,
given a set of corresponding landmark pairs. This is the same setup that we have
discussed in the tutorial about Gaussian process regression. The difference is,
that here we will also allow for rotation and translation of the model. In this setting,
it is not possible anymore to compute the posterior analytically. Rather, our only hope are approximation methods, such as
using Markov-chain monte carlo methods.

In this tutorial we show not only a working example, but also how to make it
computationally efficient. Making the individual parts as efficient as possible is
important in sampling approaches, as we need to produce many samples to get accurate
estimates.

##### Related resources

Week 3 of our [online course](https://shapemodelling.cs.unibas.ch/probabilistic-fitting-course/) on shape model fitting may provide helpful context for this tutorial.

To run the code from this tutorial, download the following Scala file:
- [Tutorial15.scala](./Tutorial15.scala)

```scala mdoc:invisible
//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"
```

##### Preparation


As in the previous tutorials, we start by importing some commonly used objects and
initializing the system.

```scala mdoc:silent emptyLines:2
import scalismo.io.StatisticalModelIO
import scalismo.io.LandmarkIO
import scalismo.ui.api.ScalismoUI
import scalismo.geometry.*
import scalismo.common.PointId
import scalismo.common.interpolation.TriangleMeshInterpolator3D
import scalismo.common.UnstructuredPointsDomain
import scalismo.common.interpolation.NearestNeighborInterpolator3D
import scalismo.common.UnstructuredPointsDomain1D
import scalismo.common.UnstructuredPointsDomain3D
import scalismo.statisticalmodel.PointDistributionModel
import scalismo.statisticalmodel.MultivariateNormalDistribution

import scalismo.mesh.TriangleMesh
import scalismo.transformations.*


import scalismo.sampling.*
import scalismo.sampling.proposals.*
import scalismo.sampling.parameters.*
import scalismo.sampling.evaluators.*
import scalismo.sampling.loggers.MHSampleLogger
import scalismo.sampling.algorithms.MetropolisHastings

import breeze.linalg.DenseVector
import breeze.linalg.DenseMatrix

import java.io.File

import breeze.stats.distributions.Rand.FixedSeed.randBasis
import scalismo.utils.Random.FixedSeed.randBasis
```


```scala mdoc:invisible emptyLines:2
object Tutorial15 extends App:
```

```scala mdoc:silent emptyLines:2
  scalismo.initialize()

  val ui = ScalismoUI()
```

### Loading and visualizing the data

In a first step, we load and visualize all the data that we need.
First, we load the statistical model:

```scala mdoc:silent emptyLines:2
  val model = StatisticalModelIO.readStatisticalTriangleMeshModel3D(File("datasets/bfm.h5")).get

  val modelGroup = ui.createGroup("model")
  val modelView = ui.show(modelGroup, model, "model")
  modelView.referenceView.opacity = 0.5
```

In this example, we will fit the model such that a set of model landmarks, coincide
with a set of landmark points defined on a target face. We load and visualize the corresponding landmark data:

```scala mdoc:silent emptyLines:2
  val modelLms = LandmarkIO.readLandmarksJson[_3D](new java.io.File("datasets/modelLM_mcmc.json")).get
  val modelLmViews = ui.show(modelGroup, modelLms, "modelLandmarks")
  modelLmViews.foreach(lmView => lmView.color = java.awt.Color.BLUE)

  val targetGroup = ui.createGroup("target")

  val targetLms = LandmarkIO.readLandmarksJson3D(new java.io.File("datasets/targetLM_mcmc.json")).get
  val targetLmViews = ui.show(targetGroup, targetLms, "targetLandmarks")
  modelLmViews.foreach(lmView => lmView.color = java.awt.Color.RED)
```

The modelPoints (which are actually points on the reference mesh defining the model) and the 
target points are assumed to be in correspondence. To highlight this, we zip them together, 
such that the corresponding points are stored as a tuple. 
```scala mdoc:silent emptyLines:2
  val modelPoints = modelLms.map(l => l.point)
  val targetPoints = targetLms.map(l => l.point)
  val correspondences = modelPoints.zip(targetPoints)
```

In any shape modelling application, it is important to correctly set up the center of rotation. 
Usually we take this to be the center of mass of the model mean. 

```scala mdoc:silent emptyLines:2
  def computeCenterOfMass(mesh: TriangleMesh[_3D]): Point[_3D] = 
      val normFactor = 1.0 / mesh.pointSet.numberOfPoints
      mesh.pointSet.points.foldLeft(Point(0, 0, 0))((sum, point) => sum + point.toVector * normFactor)

  val rotationCenter = computeCenterOfMass(model.mean)
```


### The parameter class

In this example, we want to model the posterior $$p(\theta | D)$$, where
the parameters $$\theta =( t, r, \alpha)$$ consist of the translation parameters
$$t=(t_x, t_y, t_z)$$, the rotation parameters $$r = (\phi, \psi, \omega)$$,
represented as Euler angles as well a shape model coefficients $$\alpha = (\alpha_1, \ldots, \alpha_n)$$.
As this combination of parameters is very common in shape modelling, Scalismo already provides
a corresponding parameter class, called ```PoseAndShapeParameters```. 
We need, however, to define any additional parameters that we want to model by ourselves. 

```scala mdoc:silent emptyLines:2
  case class Parameters(poseAndShapeParameters : PoseAndShapeParameters, 
                        noiseStddev : Double
                      )
```

The class `PoseAndShapeParameters` class is defined as part of Scalismo. In this tutorial, 
we add an other parameter, namely the `noiseStddev`, which regulates the noise that we expect
on the observations. To be able to derive proposals for such a user defined parameter class, we 
need to provide conversion methods that tell scalismo how to convert the parameters to and from 
a tuple. We will also add a convenience method to extract the pose transformation from the 
parameters. 
```scala mdoc:silent empytLines:2
  object Parameters:

      implicit object parameterConversion
          extends ParameterConversion[
            Tuple2[PoseAndShapeParameters, Double],
            Parameters
          ]:
        def from(p: Parameters): Tuple2[PoseAndShapeParameters, Double] =
          (p.poseAndShapeParameters, p.noiseStddev)
        def to(t: Tuple2[PoseAndShapeParameters, Double]): Parameters =
          Parameters(t._1, t._2)      

      def poseTransformationForParameters(
          translationParameters: TranslationParameters,
          rotationParameters: RotationParameters,
          centerOfRotation: Point[_3D]
      ): TranslationAfterRotation[_3D] = 
        TranslationAfterRotation3D(
          Translation3D(translationParameters.translationVector),
          Rotation3D(rotationParameters.angles, centerOfRotation)
        )
```

### Evaluators: Modelling the target density

As in the previous tutorial, we represent the unnormalized posterior distribution
as the product of prior and likelihood:
$$p(\theta | D) \propto p(\theta) p(D | \theta)$$,
where $$D$$ denotes the data (i.e. the corresponding landmark points) and $$\theta$$
are our parameters.

As a prior over the shape parameters is given by the shape model. For the
translation and rotation, we assume a zero-mean normal distribution. As the standard deviation
characterizing the noise needs to be positive, we use a lognormal distribution.:

```scala mdoc:silent emptyLines:2
  case class PriorEvaluator(model: PointDistributionModel[_3D, TriangleMesh])
      extends MHDistributionEvaluator[Parameters]:

    val translationPrior = breeze.stats.distributions.Gaussian(0.0, 5.0)
    val rotationPrior = breeze.stats.distributions.Gaussian(0, 0.1)
    val noisePrior = breeze.stats.distributions.LogNormal(0, 0.25)

    override def logValue(sample: MHSample[Parameters]): Double = 
      val poseAndShapeParameters = sample.parameters.poseAndShapeParameters
      val translationParameters = poseAndShapeParameters.translationParameters
      val rotationParameters = poseAndShapeParameters.rotationParameters

      model.gp.logpdf(poseAndShapeParameters.shapeParameters.coefficients) +
        translationPrior.logPdf(translationParameters.translationVector.x) +
        translationPrior.logPdf(translationParameters.translationVector.y) +
        translationPrior.logPdf(translationParameters.translationVector.z) +
        rotationPrior.logPdf(rotationParameters.angles._1) +
        rotationPrior.logPdf(rotationParameters.angles._2) +
        rotationPrior.logPdf(rotationParameters.angles._3) +
        noisePrior.logPdf(sample.parameters.noiseStddev)
```

To compute the likelihood $$p(D | \theta)$$ we need to determine where 
 the landmark points on the model are mapped under the transformation 
given by the parameters $\theta$. The distance between these mapped
model points and the target points determine the likelihood. 
As we only need to map the landmark points, it is computationally more
efficient to restrict the model to these points first, and then only 
to deform these points rather than all the points of the model. 

```scala mdoc:silent emptyLines:2
 
  case class CorrespondenceEvaluator(
      model: PointDistributionModel[_3D, TriangleMesh],
      rotationCenter: Point[_3D],
      correspondences: Seq[(Point[_3D], Point[_3D])]
  ) extends MHDistributionEvaluator[Parameters]:

    // we extract the points and build a model from only the points
    val (refPoints, targetPoints) = correspondences.unzip

    val newDomain = UnstructuredPointsDomain3D(refPoints.toIndexedSeq)
    val modelOnLandmarkPoints = model.newReference(newDomain, NearestNeighborInterpolator3D())
    
    override def logValue(sample: MHSample[Parameters]): Double = 

      val poseTransformation = Parameters.poseTransformationForParameters(
        sample.parameters.poseAndShapeParameters.translationParameters,
        sample.parameters.poseAndShapeParameters.rotationParameters,
        rotationCenter
      )
      
      val modelCoefficients = sample.parameters.poseAndShapeParameters.shapeParameters.coefficients
      val currentModelInstance =
        modelOnLandmarkPoints.instance(modelCoefficients).transform(poseTransformation)

      
      val lmUncertainty = MultivariateNormalDistribution(
        DenseVector.zeros[Double](3),
        DenseMatrix.eye[Double](3) * sample.parameters.noiseStddev
      )

      val likelihoods = for ((pointOnInstance, targetPoint) <- currentModelInstance.pointSet.points.zip(targetPoints)) yield 
        val observedDeformation = targetPoint - pointOnInstance
        lmUncertainty.logpdf(observedDeformation.toBreezeVector)
      

      val loglikelihood = likelihoods.sum
      loglikelihood
```


#### The posterior evaluator

Given these evaluators, we can now build the computationally efficient version of
our target density $$p(\theta | D)$$

```scala mdoc:silent emptyLines:2
  val likelihoodEvaluator = CorrespondenceEvaluator(model, rotationCenter, correspondences)
  val priorEvaluator = PriorEvaluator(model).cached

  val posteriorEvaluator = ProductEvaluator(priorEvaluator, likelihoodEvaluator)
```

### The proposal generator

As in the previous tutorials, we will use simple random walk proposals.
We will define separate proposals for shape, translation and rotation.
 On one hand, this lets us set the step length (i.e. stddev of the distribution from which we
sample the next step) individually for each group, and thus to incorporate our knowledge
that changes in rotation will be much smaller than the shape changes. On the other hand,
splitting the parameter updates in blocks will increase our chance for the random updates
to be accepted. The reason for this is that when many parameters are updated at one,
chances are high that some of the proposed changes make the new state more unlikely,
and hence increase the chance of the new state being rejected.

We start by defining the basic pose proposals
```scala mdoc:silent emptyLines:2
  val rotationProposal = MHProductProposal(
    GaussianRandomWalkProposal(0.01, "rx").forType[Double],
    GaussianRandomWalkProposal(0.01, "ry").forType[Double],
    GaussianRandomWalkProposal(0.01, "rz").forType[Double]
  ).forType[RotationParameters]

  val translationProposal = MHProductProposal(
    GaussianRandomWalkProposal(1.0, "tx").forType[Double],
    GaussianRandomWalkProposal(1.0, "ty").forType[Double],
    GaussianRandomWalkProposal(1.0, "tz").forType[Double]
  ).forType[TranslationParameters]

```
The next proposal is for updating the shape parameters. We define two 
shape proposals, one for the leading parameters, which adjusts the overall 
shape, and one for the remaining parameters. We can achieve this using
the `.partial` method of the `GaussianRandomWalkProposal`, which will only 
update the components in a given range.
```scala mdoc:silent emptyLines:2
  val shapeProposalLeading =
      GaussianRandomWalkProposal(0.01, "shape-0-5").partial(0 until 5)
        .forType[ShapeParameters]
  val shapeProposalRemaining =
    GaussianRandomWalkProposal(0.01, "shape-6-").partial(6 until model.rank)
      .forType[ShapeParameters]
```

From these building blocks, we can define different proposal for shape and pose, which always
only update a part of the parameters. For better readability, we also give them simpler name, under
which they later appear in the logs. 

```scala mdoc:silent emptyLines:2
  val identTranslationProposal =
    MHIdentityProposal.forType[TranslationParameters]
  val identRotationProposal = MHIdentityProposal.forType[RotationParameters]
  val identShapeProposal = MHIdentityProposal.forType[ShapeParameters]

  val poseAndShapeTranslationOnlyProposal =
    MHProductProposal(
      translationProposal,
      identRotationProposal,
      identShapeProposal
    )
    .forType[PoseAndShapeParameters]
    .relabel("translation-only")
  val poseAndShapeRotationOnlyProposal =
    MHProductProposal(
      identTranslationProposal,
      rotationProposal,
      identShapeProposal
    )
    .forType[PoseAndShapeParameters]
    .relabel("rotation-only")
  val poseAndShapeLeadingShapeOnlyProposal =
    MHProductProposal(
      identTranslationProposal,
      identRotationProposal,
      shapeProposalLeading
    )
    .forType[PoseAndShapeParameters]
    .relabel("shape-leading-only")

  val poseAndShapeRemainingShapeOnlyProposal =
    MHProductProposal(
      identTranslationProposal,
      identRotationProposal,
      shapeProposalRemaining
    )
    .forType[PoseAndShapeParameters]
    .relabel("shape-trailing-only")
```

Using a mixture proposal, we can combine them to one proposal for pose and shape
```scala mdoc:silent emptyLines:2
  val mixturePoseAndShapeProposal = MHMixtureProposal(
    (0.2, poseAndShapeTranslationOnlyProposal),
    (0.2, poseAndShapeRotationOnlyProposal),
    (0.3, poseAndShapeLeadingShapeOnlyProposal),
    (0.3, poseAndShapeRemainingShapeOnlyProposal)
  )
```

Finally, we do the same for the noise proposal to obtain a proposal 
that updates the full parameter vector

```scala mdoc:sielnt emptyLines:2
  val noiseProposal = GaussianRandomWalkProposal(0.1, "noise").forType[Double]
  val identNoiseProposal = MHIdentityProposal.forType[Double]
  val identPoseAndShapeProposal =
    MHIdentityProposal.forType[PoseAndShapeParameters]

  val noiseOnlyProposal =
    MHProductProposal(identPoseAndShapeProposal, noiseProposal)
      .forType[Parameters]
  val poseAndShapeOnlyProposal =
    MHProductProposal(mixturePoseAndShapeProposal, identNoiseProposal)
      .forType[Parameters]
  val fullproposal = MHMixtureProposal(
    (0.9, poseAndShapeOnlyProposal),
    (0.1, noiseOnlyProposal)
  )
```


#### Building the Markov Chain

For running the Markov Chain, we proceed exactly as in the previous tutorial.

```scala mdoc:silent emptyLines:2
  val logger = MHSampleLogger[Parameters]()
  val chain = MetropolisHastings(fullproposal, posteriorEvaluator)

  val initialParameters = Parameters(
    PoseAndShapeParameters(TranslationParameters(EuclideanVector3D(0, 0, 0)),
                            RotationParameters((0.0, 0.0, 0.0)),
                            ShapeParameters(DenseVector.zeros[Double](model.rank))),
    noiseStddev = 1.0)

  val mhIterator = chain.iterator(MHSample(initialParameters, "inital"), logger)
```

In this example we are interested to visualize some samples from the posterior as we run the chain. This can be done
by augmenting the iterator with visualization code:
```scala mdoc:silent emptyLines:2
  val samplingIterator = for ((sample, iteration) <- mhIterator.zipWithIndex) yield 
    println("iteration " + iteration)
    if (iteration % 500 == 0) then
      val poseAndShapeParameters = sample.parameters.poseAndShapeParameters
      val poseTransformation = Parameters.poseTransformationForParameters(poseAndShapeParameters.translationParameters, poseAndShapeParameters.rotationParameters, rotationCenter)
      modelView.shapeModelTransformationView.shapeTransformationView.coefficients =
        poseAndShapeParameters.shapeParameters.coefficients
      modelView.shapeModelTransformationView.poseTransformationView.transformation = poseTransformation
    
    sample
```

Finally, we draw the samples using the chain by consuming the iterator. We drop the first 1000 iterations, as the
chain needs some burn-in time to converge to a equilibrium solution:
```scala mdoc:silent emptyLines:2
  val samples = samplingIterator.drop(1000).take(10000).toIndexedSeq
```


Before working with the results, we check the acceptance ratios to verify that all the proposals work as expected:
```scala mdoc
  println(logger.samples.acceptanceRatios)
```

### Analyzing the results

Once we have the samples, we can now use them to analyze our fit.
For example, we can select the best fit from these samples and visualize it
```scala mdoc:silent emptyLines:2
  val bestSample = samples.maxBy(posteriorEvaluator.logValue)
    
  val bestPoseAndShapeParameters = bestSample.parameters.poseAndShapeParameters
  val bestPoseTransformation = Parameters.poseTransformationForParameters(
      bestPoseAndShapeParameters.translationParameters,
      bestPoseAndShapeParameters.rotationParameters,
      rotationCenter)    
    

  val bestFit = model.instance(bestPoseAndShapeParameters.shapeParameters.coefficients).transform(bestPoseTransformation)
  val resultGroup = ui.createGroup("result")

  ui.show(resultGroup, bestFit, "best fit")
```

The samples allow us to infer much more about the distribution. For example, we could use them to estimate the distribution
of the length of the femur or any other measuremnt of the shape that we are interested. 

### Beyond landmark fitting

We have shown above how Scalismo can be used to perform Bayesian model fitting on the example of fitting 3D landmarks. This example
can easily be extended to other fitting tasks, such as fitting the model to points with unkown correspondences, fitting shapes in surfaces
of fitting a model to an image using an Active Shape Model as a likelihood function. In principle, all that is required is to
 change the likelihood function and rerun the fit.
 In practice, however, as a change in the likelihood function can dramatically change the posterior density, it is often required
 to tune the proposals, such that good convergence can be achieved. Indeed, finding good proposal distributions is the key to
 applying this method successfully. The more prior knowledge about the target distribution we can incorporate into the proposals,
 the faster will the chain converge to the equilibrium distribution.

For more complicated use-cases of this method in image analysis, the interested reader is referred to the paper by S. Schönborn et al.
and references therein:

* Schönborn, Sandro, et al. "Markov chain monte carlo for automated face image analysis." International Journal of Computer Vision 123.2 (2017): 160-183.

```scala mdoc:invisible
  ui.close()
```


