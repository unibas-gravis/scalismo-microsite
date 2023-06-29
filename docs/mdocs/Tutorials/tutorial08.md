---
id: tutorial08
title: Posterior shape models
---

In this tutorial we will use Gaussian processes for regression tasks and experiment with the concept of posterior shape models.
This will form the basics for the next tutorial, where we will see how these tools 
can be applied to construct a reconstruction of partial shapes.

##### Related resources

To enhance your understanding of this tutorial, we recommend the following resources from our [online course](shapemodelling.cs.unibas.ch/ssm-course/):

- The regression problem [(Article)](https://shapemodelling.cs.unibas.ch/ssm-course/week5/step5-2)
- Gaussian process regression [(Video)](https://shapemodelling.cs.unibas.ch/ssm-course/week5/step5-3)
- Posterior models for different kernels [(Article)](https://shapemodelling.cs.unibas.ch/ssm-course/week5/step5-4)

To run the code from this tutorial, download the following Scala file:
- [Tutorial08.scala](./Tutorial08.scala)


##### Preparation

```scala mdoc:invisible
//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92-RC1"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92-RC1,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"
```

As in the previous tutorials, we start by importing some commonly used objects and initializing the system.

```scala mdoc:silent emptyLines:2
import scalismo.geometry.*
import scalismo.common.*
import scalismo.common.interpolation.TriangleMeshInterpolator3D
import scalismo.mesh.*
import scalismo.io.{StatisticalModelIO, MeshIO}
import scalismo.statisticalmodel.*
import scalismo.numerics.UniformMeshSampler3D
import scalismo.kernels.*

import scalismo.ui.api.*

import java.io.File

import breeze.linalg.{DenseMatrix, DenseVector}

import scalismo.utils.Random.FixedSeed.randBasis
```

```scala mdoc:invisible emptyLines:2
@main
def tutorial8(): Unit = 
```


```scala mdoc:silent emptyLines:2
    scalismo.initialize()

    val ui = ScalismoUI()
```
We also load and visualize the face model:
```scala mdoc:silent emptyLines:2
    val model = StatisticalModelIO.readStatisticalTriangleMeshModel3D(File("datasets/bfm.h5")).get

    val modelGroup = ui.createGroup("modelGroup")
    val ssmView = ui.show(modelGroup, model, "model")
```


## Fitting observed data using Gaussian process regression

The purpose of constructing statistical models is to utilize them for interpreting data. 
More precisely, given some observed data, we fit the model
to the data and get as a result a distribution over the model parameters.
 In this scenario, our model represents a Gaussian process model of shape deformations, 
 and the data represents observed shape deformations, i.e., deformation vectors from the reference surface.

To illustrate this, let's simulate some data. 
We'll generate a deformation vector at the tip of the nose, mimicking a significantly elongated nose:

```scala mdoc:silent emptyLines:2
    val idNoseTip = PointId(8156)
    val noseTipReference = model.reference.pointSet.point(idNoseTip)
    val noseTipMean = model.mean.pointSet.point(idNoseTip)
    val noseTipDeformation = (noseTipReference - noseTipMean) * 2.0
```

To visualize this deformation, we'll have to define a `DiscreteField` which can then be 
passed to the show method of our ui object:

```scala mdoc:silent emptyLines:2
    val noseTipDomain = UnstructuredPointsDomain3D(IndexedSeq(noseTipReference))
    val noseTipDeformationField = DiscreteField3D(noseTipDomain,  IndexedSeq(noseTipDeformation))

    val observationGroup = ui.createGroup("observation")
    ui.show(observationGroup, noseTipDeformationField, "noseTip")
```

Now let's set up the regression. The Gaussian process model assumes that the deformation is only observed up to some level of uncertainty, which can be modeled using a normal distribution:

```scala mdoc:silent
    val noise = MultivariateNormalDistribution(DenseVector.zeros[Double](3), DenseMatrix.eye[Double](3))
```
In Scalismo, the data for regression is specified by a sequence of triples, consisting of the point of the reference, the corresponding deformation vector, and the noise at that point:

```scala mdoc:silent
    val regressionData = IndexedSeq((noseTipReference, noseTipDeformation, noise))
```

The regression result can be obtained by feeding this data to the regression method of the `GaussianProcess` object:

```scala mdoc:silent emptyLines:2
    val gp : LowRankGaussianProcess[_3D, EuclideanVector[_3D]] = model.gp.interpolate(TriangleMeshInterpolator3D())
    val posteriorGP : LowRankGaussianProcess[_3D, EuclideanVector[_3D]] = LowRankGaussianProcess.regression(gp, regressionData)
```

The regression result is a Gaussian process over the same domain as the original process, 
termed the posterior process. This setup is of crucial importance in Scalismo, leading to a convenience method defined directly on the Gaussian process object, allowing us to write the same in a more succinct manner:

```scala
    gp.posterior(regressionData)
```

Regardless of how we invoke the method, the returned type is a continuous (low rank) Gaussian Process from which we can now sample deformations at any set of points:

```scala mdoc:silent emptyLines:2
    val posteriorSample: DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] =
        posteriorGP.sampleAtPoints(model.reference)
    
    val posteriorSampleGroup = ui.createGroup("posteriorSamples")

    for (i <- 0 until 10) do
        ui.show(posteriorSampleGroup, posteriorSample, "posteriorSample")
```


### Posterior of a StatisticalMeshModel:

As the StatisticalMeshModel is essentially a wrapper around a Gaussian Process (GP), the same posterior functionality is available for statistical mesh models:

```scala mdoc:silent emptyLines:2
    val littleNoise = MultivariateNormalDistribution(
        DenseVector.zeros[Double](3), 
        DenseMatrix.eye[Double](3) * 0.01
        )
    val pointOnLargeNose = noseTipReference + noseTipDeformation
    val discreteTrainingData = IndexedSeq((PointId(8156), pointOnLargeNose, littleNoise))
    val meshModelPosterior: PointDistributionModel[_3D, TriangleMesh] = model.posterior(discreteTrainingData)
```

Notice in this case, since we are working with a discrete Gaussian process, the observed data is specified in terms of the *point identifier* of the nose tip point instead of its 3D coordinates.

Let's visualize the obtained posterior model:

```scala mdoc:silent emptyLines:2
    val posteriorModelGroup = ui.createGroup("posteriorModel")
    ui.show(posteriorModelGroup, meshModelPosterior, "NoseyModel")
```

*Exercise: sample a few random faces from the graphical interface using the random button. Notice how all faces display large noses :) with the tip of the nose remaining close to the selected landmark.*


What we have here is far more than just a single face instance that fits the input data: we have a full normal distribution of shapes that accommodate the observation. The most probable shape, and hence our best fit, is the mean of the posterior.

Upon sampling from the posterior model, we tend to get faces with rather large noses. This is because we chose our observation to be twice the length of the average (mean) deformation at the tip of the nose.


#### Landmark uncertainty:

When specifying the training data for the computation of the posterior GP, we model the uncertainty of the input data. The variance of this noise model greatly influences the resulting posterior distribution. It should always be chosen so that it closely aligns with the real uncertainty of our observation.

To illustrate how this variance influences the posterior, let's perform the posterior computation again, but this time with a noise variance that is 5 times bigger.


```scala mdoc:silent emptyLines:2
    val largeNoise = MultivariateNormalDistribution(DenseVector.zeros[Double](3), DenseMatrix.eye[Double](3) * 5.0)
    val discreteTrainingDataLargeNoise = IndexedSeq((PointId(8156), pointOnLargeNose, largeNoise))
    val discretePosteriorLargeNoise = model.posterior(discreteTrainingDataLargeNoise)
    val posteriorGroupLargeNoise = ui.createGroup("posteriorLargeNoise")
    ui.show(posteriorGroupLargeNoise, discretePosteriorLargeNoise, "NoisyNoseyModel")
```
We observe, that there is now much more variance left in this posterior process.
This is a consequence of the larger uncertainty that was associated with the
observed data.

```scala mdoc:invisible
    ui.close()
```
