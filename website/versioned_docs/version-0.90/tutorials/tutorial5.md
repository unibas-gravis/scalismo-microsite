---
id: tutorial5
title: Gaussian processes, sampling and marginalization
---

In this tutorial we will experiment with sampling and marginalization of
Gaussian processes. Furthermore, we will learn how to compare the
likelihood of instances of our model.


##### Related resources

The following resources from our [online course](https://www.futurelearn.com/courses/statistical-shape-modelling) may provide
some helpful context for this tutorial:

- The marginalization property [(Video)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250339)
- Sampling from a shape model [(Article)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250340)


##### Preparation

As in the previous tutorials, we start by importing some commonly used objects and initializing the system.

```scala
import scalismo.ui.api._
import scalismo.geometry._
import scalismo.common._
import scalismo.common.interpolation.TriangleMeshInterpolator3D
import scalismo.mesh._
import scalismo.io.StatisticalModelIO
import scalismo.statisticalmodel._

scalismo.initialize()
implicit val rng = scalismo.utils.Random(42)

val ui = ScalismoUI()
```


#### Discrete and Continuous Gaussian processes

We have seen in the last tutorial that a Point Distribution Model (PDM)
is represented in Scalismo as a (discrete) Gaussian process over deformation fields,
defined on a reference mesh.

To continue our exploration of Gaussian processes, we therefore start
by loading (and visualizing) an existing PDM and retrieve its underlying
Gaussian process

```scala
val model = StatisticalModelIO.readStatisticalTriangleMeshModel3D(new java.io.File("datasets/bfm.h5")).get
val gp = model.gp

val modelGroup = ui.createGroup("modelGroup")
val ssmView = ui.show(modelGroup, model, "model")
```


We can retrieve random samples from the Gaussian process by calling ```sample```
on the ```gp``` object:

```scala
val sampleDF : DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = model.gp.sample

val sampleGroup = ui.createGroup("sample")
ui.show(sampleGroup, sampleDF, "discreteSample")
```

Note that the sampled vector field is **discrete**; I.e. is
defined over a **discrete set of points**.
This is due to the fact that our Gaussian Process is stored in a file
and was therefore discretized over the points of the reference mesh.

As seen in the previous tutorial, we could interpolate the
sample ```sampleDf``` to obtain a continuous version of the deformation field.
A more convenient approach is, however, to interpolate the
Gaussian process directly:

```scala
val interpolator = TriangleMeshInterpolator3D[EuclideanVector[_3D]]()
val contGP = model.gp.interpolate(interpolator)
```

When we sample now from the continuous GP, we obtain a vector-valued function,
which is defined on the entire 3D Space:

```scala
val contSample: Field[_3D, EuclideanVector[_3D]] = contGP.sample
```

*Attention: While the interpolated Gaussian process is now defined on the entire 3D Space, the interpolation really only makes sense close to the mesh points*.

## From continuous to discrete: marginalization and discretization

In practice, we will never work with a continuous Gaussian process directly.
We are always interested in the distribution on a finite set of points.
The real advantage of having a continuous Gaussian process is, that we can
get samples at *any* finite set of points and thereby choosing the discretization
according to the needs of our application.

To illustrate this, we could, for example obtain a sample,
which is defined on all the points of the original reference mesh.

```scala
val fullSample = contGP.sampleAtPoints(model.reference)
val fullSampleView = ui.show(sampleGroup, fullSample, "fullSample")
```

The marginalization property of a Gaussian process makes it possible not only
to obtain samples at an arbitrary set of points, but also the
distribution at these points. We can
obtain this distribution, by calling the method ```marginal```
on the Gaussian process instance:

```scala
val referencePointSet = model.reference.pointSet
val rightEyePt: Point[_3D] = referencePointSet.point(PointId(4281))
val leftEyePt: Point[_3D] = referencePointSet.point(PointId(11937))
val marginal : DiscreteGaussianProcess[_3D, UnstructuredPointsDomain, EuclideanVector[_3D]] = contGP.marginal(IndexedSeq(rightEyePt,leftEyePt))
```

The result of marginalization is again a discrete Gaussian process. As we have specified individual points, on which
to evaluate the Gaussian process, but not how these points are connected, the resulting
discrete Gaussian process is defined over an ```UnstructuredPointsDomain```.
To obtain a discrete Gaussian Process with a richer structure, we can use the ```discretize``` method,
which takes as an argument a domain and result in a discrete Gaussian Process defined on that domain.

To obtain the Gaussian Process that we started with again, we can call the ```discretize``` method
with the reference mesh:

```scala
val discreteGP : DiscreteGaussianProcess[_3D, TriangleMesh, EuclideanVector[_3D]] = contGP.discretize(model.reference)
```

This mechanism of interpolation followed by discretization gives us the ability to freely change
the resolution of the domain on which the Gaussian process is defined.


## Changing the reference of a point distribution model

Given that a point distribution model is really just a wrapper around a Gaussian process, it
is not surprising that we can apply the same ideas to these models. In particular, we often
would like to change the domain (I.e., the reference) of a point distribution model.
This can be done using the method ```newReference``` of the point distribution model. Under the hood, the method ```newReference```
interpolates the gaussian process and discretizes it with the new reference.

In the following example we use this method to obtain a model which is defined on a low-resolution mesh:

```scala
val lowresMesh = model.reference.operations.decimate(1000)
val lowResModel = model.newReference(lowresMesh, TriangleMeshInterpolator3D())
```

Other common applications of this method include restricting the model to only a part of the domain.

## Probability of shapes and deformations:

It is often interesting to assess how probable a model instance is.
This can be done in Scalismo by means of the method ```pdf ```
(which stands for probability density function) of the class ```GaussianProcess```
and ```StatisticalMeshModel``` respectively.


```scala
val defSample = model.gp.sample
model.gp.pdf(defSample)
```

The value of the *pdf* is often not interesting as such. But it allows us to compare the likelihood of different instances, by comparing their density value.
For numerical reasons, we usually work with the log probability:

```scala
val defSample1 = model.gp.sample
// defSample1: DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = <function1>
val defSample2 = model.gp.sample
// defSample2: DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = <function1>

val logPDF1 = model.gp.logpdf(defSample1)
// logPDF1: Double = -12.599680420141278
val logPDF2 = model.gp.logpdf(defSample2)
// logPDF2: Double = -12.300955026410005

val moreOrLess = if (logPDF1 > logPDF2) "more" else "less"
// moreOrLess: String = "less"
println(s"defSample1 is $moreOrLess likely than defSample2")
// defSample1 is less likely than defSample2
```

