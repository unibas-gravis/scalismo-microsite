---
id: tutorial05
title: Gaussian processes, sampling and marginalization
---

In this tutorial, we will delve deeper into how Gaussian processes are represented in Scalismo, 
focusing on the conversion between continuous and discrete representations of the deformation fields.


##### Related resources

To enhance your understanding of this tutorial, we recommend the following resources from our [online course](shapemodelling.cs.unibas.ch/ssm-course/):

- The marginalization property [(Video)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250339)
- Sampling from a shape model [(Article)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250340)

To run the code from this tutorial, download the following Scala file:
- [Tutorial05.scala](./Tutorial05.scala)

##### Preparation


```scala mdoc:invisible
//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92-RC1"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92-RC1,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"
```

As in the previous tutorials, we start by importing some commonly used objects and initializing the system.

```scala mdoc:silent
import scalismo.ui.api.*
import scalismo.geometry.*
import scalismo.common.*
import scalismo.common.interpolation.TriangleMeshInterpolator3D
import scalismo.mesh.*
import scalismo.io.StatisticalModelIO
import scalismo.statisticalmodel.*

import scalismo.utils.Random.FixedSeed.randBasis
```


```scala mdoc:invisible emptyLines:2
object Tutorial5 extends App:
```

```scala mdoc:silent emptyLines:2
    scalismo.initialize()

    val ui = ScalismoUI()
```



#### Discrete and Continuous Gaussian processes

In the previous tutorial, we saw that a Point Distribution Model (PDM) in Scalismo is 
represented as a discrete Gaussian process defined over deformation fields on a reference mesh.

To delve further into our exploration of Gaussian processes, let's start by loading and visualizing an existing PDM, and then extracting its underlying Gaussian process:

```scala mdoc:silent emptyLines:2
    val model = StatisticalModelIO.readStatisticalTriangleMeshModel3D(new java.io.File("datasets/bfm.h5")).get
    val modelGroup = ui.createGroup("modelGroup")
    val ssmView = ui.show(modelGroup, model, "model")

    val gp = model.gp
```


We can generate random samples from the Gaussian process by invoking the sample method on the gp object:

```scala mdoc:silent emptyLines:2
    val sampleDF : DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = model.gp.sample()

    val sampleGroup = ui.createGroup("sample")
    ui.show(sampleGroup, sampleDF, "discreteSample")
```

Observe that the sampled vector field is discrete, meaning it is defined over a finite set of points.
This is always the case when we load a shape model, as we cannot store infinitely many points. 

As shown in the previous tutorial, we could interpolate the sample sampleDF to obtain a continuous version of the deformation field. 
However, a more straightforward approach is to interpolate the Gaussian process directly:

```scala mdoc:silent emptyLines:2
    val contGP = model.gp.interpolate(TriangleMeshInterpolator3D())
```

Now, when we sample from the continuous GP, we receive a vector-valued function, which is defined over the entire 3D space:

```scala mdoc:silent emptyLines:2
    val contSample: Field[_3D, EuclideanVector[_3D]] = contGP.sample()
```

*Attention: While the interpolated Gaussian process is now defined on the entire 3D Space, the interpolation really only makes sense close to the mesh surface*.

## From continuous to discrete: marginalization and discretization

In real-world applications, we seldom work directly with a continuous Gaussian process. Our interest usually lies in the distribution on a finite set of points. 
The key advantage of having a continuous Gaussian process is our ability to extract samples at *any* finite set of points, 
thereby tailoring the discretization according to our application requirements.

This is where the marginalization property of a Gaussian process comes in. It enables us to obtain the distribution for a set of arbitrary points from the 
full Gaussian process. In the following, we obtain the distribution over two points on the eye:

```scala mdoc:silent emptyLines:2
    val referencePointSet = model.reference.pointSet
    val rightEyePt: Point[_3D] = referencePointSet.point(PointId(4281))
    val leftEyePt: Point[_3D] = referencePointSet.point(PointId(11937))
    val marginal : DiscreteGaussianProcess[_3D, UnstructuredPointsDomain, EuclideanVector[_3D]] = contGP.marginal(IndexedSeq(rightEyePt,leftEyePt))
```

The result of marginalization is a discrete Gaussian process. Note that since we have specified individual points, on which
to evaluate the Gaussian process, but not how these points are connected, the resulting
discrete Gaussian process is defined over an ```UnstructuredPointsDomain```. 
To obtain a discrete Gaussian Process with a richer structure, we can use the ```discretize``` method,
which takes as an argument a domain and result in a discrete Gaussian Process defined on that domain.

To obtain the Gaussian Process that we started with again, we can call the ```discretize``` method
with the reference mesh:
```scala mdoc:silent
    val discreteGP : DiscreteGaussianProcess[_3D, TriangleMesh, EuclideanVector[_3D]] = contGP.discretize(model.reference)
```
This mechanism of interpolation followed by discretization gives us the ability to freely change
the resolution of the domain on which the Gaussian process is defined.



## Changing the reference of a point distribution model

Given that a point distribution model is really just a wrapper around a Gaussian process, it
is not surprising that we can apply the same ideas to these models. In particular, we often
wish to change the domain (I.e., the reference) of a point distribution model.
This can be done using the method ```newReference``` of the point distribution model. Under the hood, the method ```newReference```
interpolates the gaussian process and discretizes it with the new reference.

In the following example we use this method to obtain a model which is defined on a low-resolution mesh:

```scala mdoc:silent emptyLines:2
    val lowresMesh = model.reference.operations.decimate(1000)
    val lowResModel = model.newReference(lowresMesh, TriangleMeshInterpolator3D())
```

Other common applications of this method include restricting the model to only a part of the domain or changing between different representations of the object.  
For instance, if we have a representation of a shape in terms of a tetrahedral mesh, we could use `newReference` to obtain a model of only the outer surface of the
mesh. 


## Probability of shapes and deformations:

In data analysis applications, it is often interesting to assess how likely individual model instances are. This information is, for example, 
needed for finding the most likely shape in a model matching a given observation. 

Gaussian processes represent probability distributions. Thus this information is contained in the corresponding density function. 
We can evaluate the (log-) of the density for a given deformation field or shape using the `logpdf` method of the gaussian process. 
Here, this is illustrated for a random sample from a GP:
```scala mdoc:silent emptyLines:2
    val defSample = model.gp.sample()
    model.gp.logpdf(defSample)
```

```scala mdoc:invisible
    ui.close()
```