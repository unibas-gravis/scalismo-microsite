---
id: tutorial8
title: Posterior shape models
---

In this tutorial we will use Gaussian processes for regression tasks and experiment with the concept of posterior shape models.
This will form the basics for the next tutorial, where we will see how these tools can be applied to construct a
reconstruction of partial shapes.

##### Related resources

The following resources from our [online course](https://www.futurelearn.com/courses/statistical-shape-modelling) may provide
some helpful context for this tutorial:

- The regression problem [(Article)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250360)
- Gaussian process regression [(Video)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250361)
- Posterior models for different kernels [(Article)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250362)

##### Preparation

As in the previous tutorials, we start by importing some commonly used objects and initializing the system.

```scala mdoc:silent
import scalismo.geometry._
import scalismo.common._
import scalismo.common.interpolation.TriangleMeshInterpolator3D
import scalismo.mesh._
import scalismo.io.{StatisticalModelIO, MeshIO}
import scalismo.statisticalmodel._
import scalismo.numerics.UniformMeshSampler3D
import scalismo.kernels._

import scalismo.ui.api._
import breeze.linalg.{DenseMatrix, DenseVector}

scalismo.initialize()
implicit val rng = scalismo.utils.Random(42)

val ui = ScalismoUI()
```


We also load and visualize the face model:
```scala mdoc:silent
val model = StatisticalModelIO.readStatisticalTriangleMeshModel3D(new java.io.File("datasets/bfm.h5")).get

val modelGroup = ui.createGroup("modelGroup")
val ssmView = ui.show(modelGroup, model, "model")
```


## Fitting observed data using Gaussian process regression

The reason we build statistical models is that we want to use them
for explaining data. More precisely, given some observed data, we fit the model
to the data and get as a result a distribution over the model parameters.
In our case, the model is a Gaussian process model of shape deformations, and the data are observed shape deformations; I.e. deformation vectors from the reference surface.

To illustrate this process, we simulate some data. We generate
a deformation vector at the tip of the nose, which corresponds ot a really long
nose:

```scala mdoc:silent
val idNoseTip = PointId(8156)
val noseTipReference = model.reference.pointSet.point(idNoseTip)
val noseTipMean = model.mean.pointSet.point(idNoseTip)
val noseTipDeformation = (noseTipReference - noseTipMean) * 2.0
```

To visualize this deformation, we need to define a ```DiscreteField```, which can then be passed to the show
method of our ```ui``` object.
```scala mdoc:silent
val noseTipDomain = UnstructuredPointsDomain3D(IndexedSeq(noseTipReference))
val noseTipDeformationField = DiscreteField3D(noseTipDomain,  IndexedSeq(noseTipDeformation))

val observationGroup = ui.createGroup("observation")
ui.show(observationGroup, noseTipDeformationField, "noseTip")
```

In the next step we set up the regression. The Gaussian process model assumes that the deformation
is observed only up to some uncertainty,
which can be modelled using a normal distribution.
```scala mdoc:silent
val noise = MultivariateNormalDistribution(DenseVector.zeros[Double](3), DenseMatrix.eye[Double](3))
```
In Scalismo, the data for the regression is specified by a sequence of triples, consisting of the point of the reference, the
 corresponding deformation vector, as well as the noise at that point:
```scala mdoc:silent
val regressionData = IndexedSeq((noseTipReference, noseTipDeformation, noise))
```

We can now obtain the regression result by feeding this data to the method ```regression``` of the ```GaussianProcess``` object:

```scala mdoc:silent
val gp : LowRankGaussianProcess[_3D, EuclideanVector[_3D]] = model.gp.interpolate(TriangleMeshInterpolator3D())
val posteriorGP : LowRankGaussianProcess[_3D, EuclideanVector[_3D]] = LowRankGaussianProcess.regression(gp, regressionData)
```

Note that the result of the regression is again a Gaussian process, over the same domain as the original process. We call this the *posterior process*.
This construction is very important in Scalismo. Therefore, we have a convenience method defined directly on the Gaussian process object. We could write the same in
the more succinctly:

```scala mdoc:silent
gp.posterior(regressionData)
```

Independently of how you call the method, the returned type is a continuous (low rank) Gaussian Process from which we can now sample deformations at any set of points:

```scala mdoc:silent
val posteriorSample: DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] =
    posteriorGP.sampleAtPoints(model.reference)
val posteriorSampleGroup = ui.createGroup("posteriorSamples")
for (i <- 0 until 10) {
    ui.show(posteriorSampleGroup, posteriorSample, "posteriorSample")
}
```


### Posterior of a StatisticalMeshModel:

Given that the StatisticalMeshModel is merely a wrapper around a GP, the same posterior functionality is available for statistical mesh models:

```scala mdoc:silent
val littleNoise = MultivariateNormalDistribution(DenseVector.zeros[Double](3), DenseMatrix.eye[Double](3) * 0.01)
val pointOnLargeNose = noseTipReference + noseTipDeformation
val discreteTrainingData = IndexedSeq((PointId(8156), pointOnLargeNose, littleNoise))
val meshModelPosterior: PointDistributionModel[_3D, TriangleMesh] = model.posterior(discreteTrainingData)
```

Notice in this case, since we are working with a discrete Gaussian process, the observed data is specified in terms of the *point identifier* of the nose tip point instead of its 3D coordinates.

Let's visualize the obtained posterior model:

```scala mdoc:silent
val posteriorModelGroup = ui.createGroup("posteriorModel")
ui.show(posteriorModelGroup, meshModelPosterior, "NoseyModel")
```

*Exercise: sample a few random faces from the graphical interface using the random button. Notice how all faces display large noses :) with the tip of the nose remaining close to the selected landmark.*


Here again we obtain much more than just a single face instance fitting the input data: we get a full normal distribution of shapes fitting the observation. The **most probable** shape, and hence our best fit, is the **mean** of the posterior.

We notice by sampling from the posterior model that we tend to get faces with rather large noses. This is since we chose our observation to be twice the length of the
average (mean) deformation at the tip of the nose.


#### Landmark uncertainty:

When we are specifying the training data for the posterior GP computation,
we model the uncertainty of the input data. The variance of this
noise model has a large influence on the resulting posterior distribution.
We should choose it always such that it corresponds as closely as possible to
the real uncertainty of our observation.

To see how this variance influences the posterior, we perform the posterior computation again with,
this time, a 5 times bigger noise variance.


```scala mdoc:silent
val largeNoise = MultivariateNormalDistribution(DenseVector.zeros[Double](3), DenseMatrix.eye[Double](3) * 5.0)
val discreteTrainingDataLargeNoise = IndexedSeq((PointId(8156), pointOnLargeNose, largeNoise))
val discretePosteriorLargeNoise = model.posterior(discreteTrainingDataLargeNoise)
val posteriorGroupLargeNoise = ui.createGroup("posteriorLargeNoise")
ui.show(posteriorGroupLargeNoise, discretePosteriorLargeNoise, "NoisyNoseyModel")
```
We observe, that there is now much more variance left in this posterior process,
which is a consequence of the larger uncertainty that was associated with the
observed data.


```scala mdoc:invisible
ui.close
```
