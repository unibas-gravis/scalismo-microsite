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
import scalismo.geometry._
import scalismo.common._
import scalismo.ui.api._
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
val model = StatisticalModelIO.readStatisticalMeshModel(new java.io.File("datasets/bfm.h5")).get
val gp = model.gp

val modelGroup = ui.createGroup("modelGroup")
val ssmView = ui.show(modelGroup, model, "model")
```

We can retrieve random samples from the Gaussian process by calling ```sample```
on the ```gp``` object:

```scala
val sampleDF : DiscreteField[_3D,UnstructuredPointsDomain[_3D], EuclideanVector[_3D]]
    = model.gp.sample

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
val interpolator = NearestNeighborInterpolator[_3D, EuclideanVector[_3D]]()
val contGP = model.gp.interpolate(interpolator)
```

When we sample now from the continuous GP, we obtain a vector-valued function,
which is defined on the entire 3D Space:

```scala
val contSample: Field[_3D, EuclideanVector[_3D]] = contGP.sample
```

*Attention: While the interpolated Gaussian process is now defined on the entire 3D Space, the interpolation really only makes sense close to the mesh points*.

## From continuous to discrete: marginalization

In practice, we will never work with a continuous Gaussian process directly.
We are always interested in the distribution on a finite set of points.
The real advantage of having a continuous Gaussian process is, that we can
get samples at *any* finite set of points and thereby choosing the discretization
according to the needs of our application.

To illustrate this, we could, for example obtain a sample,
which is defined on all the points of the original reference mesh.

```scala
val fullSample = contGP.sampleAtPoints(model.referenceMesh.pointSet)
val fullSampleView = ui.show(sampleGroup, fullSample, "fullSample")
```

We can also obtain samples which are defined only at a single point:

```scala
fullSampleView.remove()
val singlePointDomain : DiscreteDomain[_3D] =
    UnstructuredPointsDomain(IndexedSeq(model.referenceMesh.pointSet.point(PointId(8156))))
val singlePointSample = contGP.sampleAtPoints(singlePointDomain)
ui.show(sampleGroup, singlePointSample, "singlePointSample")
```

(This should show a vector at the tip of the nose, which, could also be behind the face)

The marginalization property of a Gaussian process makes it possible not only
to obtain samples at an arbitrary set of points, but also the
distribution at these points. We can
obtain this distribution, by calling the method ```marginal```
on the Gaussian process instance:

```scala
val referencePointSet = model.referenceMesh.pointSet
val rightEyePt: Point[_3D] = referencePointSet.point(PointId(4281))
val leftEyePt: Point[_3D] = referencePointSet.point(PointId(11937))
val dom = UnstructuredPointsDomain(IndexedSeq(rightEyePt,leftEyePt))
val marginal : DiscreteGaussianProcess[_3D, UnstructuredPointsDomain[_3D], EuclideanVector[_3D]] = contGP.marginal(dom)
```

The result of marginalization is again a discrete Gaussian process.
Sampling from this new Gaussian process yields a discrete deformation field, which
is defined only at the two points over which we marginalized:

```scala
val sample : DiscreteField[_3D, UnstructuredPointsDomain[_3D], EuclideanVector[_3D]] = marginal.sample
ui.show(sampleGroup, sample, "marginal_sample")
```


It seems that we are back where we started. But note that we have
now choosen a completly different set of points
on which the Gaussian process is defined.
This is important, as we can choose for any application that
discretization of the Gaussian process, which is most useful.


## Marginal of a statistical mesh model

Given that a *StatisticalMeshModel* is in reality just a wrapper
around a GP, it naturally allows for marginalization as well:

```scala
val noseTipModel : StatisticalMeshModel = model.marginal(IndexedSeq(PointId(8156)))
```

Notice in this case, how the passed argument to the marginal function
is an indexed sequence of point **identifiers** instead of a discrete domain.
This is due to the fact that we are marginalizing a discrete Gaussian process.
Since the domain of the GP is already discrete, marginalization in this
case is done by selecting a subset of the discrete domain.
Hence the use of point identifiers instead of 3D coordinates.

Not surprisingly, we can again sample from this nose tip model:

```scala
val tipSample : TriangleMesh[_3D] = noseTipModel.sample
// tipSample: TriangleMesh[_3D] = TriangleMesh3D(
//   scalismo.common.UnstructuredPointsDomain3D@6e15e143,
//   TriangleList(Vector())
// )
println("nb mesh points " + tipSample.pointSet.numberOfPoints)
// nb mesh points 1
```

Given that the marginal model is a *StatisticalMeshModel*, sampling from it
returns a ```TriangleMesh```. When inspecting the points of the
returned sample, we see that it contains only one point, the nose tip.

#### Nose marginal

Let's suppose that we have a full model of the face, but are only
interested in the shape variations around the nose.
Marginalization let's us achieve this easily.
To do so, we extract all points which lie within a specified distance
around the middle of the nose:

```scala
val middleNose = referencePointSet.point(PointId(8152))
val nosePtIDs : Iterator[PointId] = referencePointSet.pointsWithId
  .filter( ptAndId => {  // yields tuples with point and ids
   val (pt, id) = ptAndId
   (pt - middleNose).norm > 40
   })
  .map(ptAndId => ptAndId._2) // extract the id's
```

We can now use the point ids to marginalize our shape model:

```scala
val noseModel = model.marginal(nosePtIDs.toIndexedSeq)
val noseGroup = ui.createGroup("noseModel")
ui.show(noseGroup, noseModel, "noseModel")
```

## Probability of shapes and deformations:

It is often interesting to assess how probable a model instance is.
This can be done in Scalismo by means of the method ```pdf ```
(which stands for probability density function) of the class ```GaussianProcess```
and ```StatisticalMeshModel``` respectively.


```scala
val defSample = noseModel.gp.sample
noseModel.gp.pdf(defSample)
```

The value of the *pdf* is often not interesting as such. But it allows us to compare the likelihood of different instances, by comparing their density value.
For numerical reasons, we usually work with the log probability:

```scala
val defSample1 = noseModel.gp.sample
// defSample1: DiscreteField[_3D, UnstructuredPointsDomain[_3D], EuclideanVector[_3D]] = <function1>
val defSample2 = noseModel.gp.sample
// defSample2: DiscreteField[_3D, UnstructuredPointsDomain[_3D], EuclideanVector[_3D]] = <function1>

val logPDF1 = noseModel.gp.logpdf(defSample1)
// logPDF1: Double = -11.265529462996712
val logPDF2 = noseModel.gp.logpdf(defSample2)
// logPDF2: Double = -17.33330521109113

val moreOrLess = if (logPDF1 > logPDF2) "more" else "less"
// moreOrLess: String = "more"
println(s"defSample1 is $moreOrLess likely than defSample2")
// defSample1 is more likely than defSample2
```

