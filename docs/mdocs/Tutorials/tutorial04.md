---
id: tutorial04
title: Gaussian processes and Point Distribution Models
---

With this tutorial we aim at illuminating the relationship between Point Distribution Models (PDM) and Gaussian Processes.


##### Related resources

To enhance your understanding of this tutorial, we recommend the following resources from our [online course](https://shapemodelling.cs.unibas.ch/ssm-course/):

- Learning a model from example data [(Video)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250329)

To run the code from this tutorial, download the following Scala file:
- [Tutorial04.scala](./Tutorial04.scala)

##### Preparation

```scala mdoc:invisible
//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"
```

As in the previous tutorials, we start by importing some commonly used objects and initializing the system.

```scala mdoc:silent
import scalismo.geometry.*
import scalismo.common.*
import scalismo.mesh.*
import scalismo.io.StatisticalModelIO
import scalismo.statisticalmodel.*
import scalismo.ui.api.*

import java.io.File

import scalismo.utils.Random.FixedSeed.randBasis
```

```scala mdoc:invisible emptyLines:2
object Tutorial4 extends App:
```

```scala mdoc:silent emptyLines:2
    scalismo.initialize()

    val ui = ScalismoUI()
```



## Gaussian Processes and Point Distribution Models

We start by loading and visualizing a shape model (or PDM) of faces :

```scala mdoc:silent
    val faceModel : PointDistributionModel[_3D, TriangleMesh] = StatisticalModelIO.readStatisticalTriangleMeshModel3D(new java.io.File("datasets/bfm.h5")).get
    val modelGroup = ui.createGroup("model")
```

This model represents a **probability distribution of face meshes**.

While we cannot visualize this distribution directly, we can get a visual impression of the space of faces this distribution represents
by visualizing the mean and some random samples:

```scala mdoc:silent
    val sampleGroup = ui.createGroup("samples")

    val meanFace : TriangleMesh[_3D] = faceModel.mean
    ui.show(sampleGroup, meanFace, "meanFace")

    val sampledFace : TriangleMesh[_3D] = faceModel.sample()
    ui.show(sampleGroup, sampledFace, "randomFace")
```


#### The GP behind the PDM:

In Scalismo, a Point Distribution Model (PDM) is represented as a triangle mesh (called the reference mesh) 
on which a Gaussian Process over deformation fields is defined:

```scala mdoc:silent
    val reference : TriangleMesh[_3D] = faceModel.reference
    val faceGP : DiscreteLowRankGaussianProcess[_3D, TriangleMesh, EuclideanVector[_3D]] = faceModel.gp
```

Here, the Gaussian Process' type signature might seem intimidating but it can be easily understood if we remember that a Gaussian Process is a distribution over functions. 
The type signature informs us that:

* It is a DiscreteGaussianProcess, meaning the functions, which the process models, are defined on a discrete, finite set of points.
* It is defined in 3D Space (indicated by the type parameter _3D).
* Its domain of the modeled functions is a TriangleMesh.
* The values of the modeled functions are vectors (precisely, they are of type EuclideanVector).
* It is represented using a low-rank approximation. We will discuss this in detail later.

Consequently, when we draw samples or obtain the mean from the Gaussian Process, we expect to obtain functions with a matching signature. This is indeed the case:

```scala mdoc:silent
    val meanDeformation : DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = faceGP.mean
    val sampleDeformation : DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = faceGP.sample()
```

Let's visualize the mean deformation:
```scala mdoc:silent
    ui.show(sampleGroup, meanDeformation, "meanField")
```

*Exercise : make everything invisible in the 3D scene, except for "meanField" and "meanFace". Now zoom in (right click and drag) on the vector field. Where are the tips of the vectors ending?*

To find out where the vectors start from, let's display the face model's reference mesh :

```scala mdoc:silent
    ui.show(modelGroup, reference, "referenceFace")
```

*Exercise : Zoom in on the scene and observe the deformation field. Where are the vectors starting.*

The mean deformation field of the Gaussian Process contained in our face model is a deformation from the reference mesh of the model into the mean face mesh. 
Thus, when we call faceModel.mean, we are:

1. Obtaining the mean deformation field by calling `faceModel.gp.mean`.
2. Using the mean deformation field to deform the reference mesh (`faceModel.referenceMesh`) into the triangle mesh representing the mean face.

Similarly, when sampling randomly from the face model:

3. A random deformation field is sampled (faceModel.gp.sample).
4. The deformation field is applied to the reference mesh to obtain a random face mesh.

*Exercise : Perform the 2 steps above in order to sample a random face (that is sample a random deformation first, then use it to warp the reference mesh).*

```scala mdoc:invisible
    ui.close()
```
