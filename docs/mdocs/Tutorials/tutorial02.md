---
id: tutorial02
title: Rigid Alignment
---

In this tutorial we show how rigid alignment of shapes can be performed in Scalismo.

##### Related resources

To enhance your understanding of this tutorial, we recommend the following resources from our [online course](shapemodelling.cs.unibas.ch/ssm-course/):

- Learning a model from example data [(Video)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250329)
- Superimposing shapes [(Article)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250330)

To run the code from this tutorial, download the following Scala file:
- [Tutorial02.scala](./Tutorial02.scala)


```scala mdoc:invisible
//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92-RC1"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92-RC1,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"
```

##### Preparation

We start by importing some common objects and initializing the system.

```scala mdoc:silent
import scalismo.geometry.*
import scalismo.common.*
import scalismo.mesh.TriangleMesh
import scalismo.transformations.*
import scalismo.io.MeshIO
import scalismo.ui.api.*

import scalismo.utils.Random.FixedSeed.randBasis

import java.io.File
```

```scala mdoc:invisible emptyLines:2
object Tutorial2 extends App:
```


```scala mdoc:silent emptyLines:1
    scalismo.initialize()
```

### Loading a mesh

We begin by loading and displaying Paola's mesh:

```scala mdoc:silent emptyLines:2
    val ui = ScalismoUI()
    val paolaGroup = ui.createGroup("paola")
    val mesh: TriangleMesh[_3D] = MeshIO.readMesh(File("datasets/Paola.ply")).get
    val meshView = ui.show(paolaGroup, mesh, "Paola")
```

Scalismo provides the functionality to perform geometric transformations on meshes.

### A Quick view on Transformations

A transformation is a function that maps a given point to a new, transformed point. 
The most general way to define a transformation is by specifying the transformation function
explicitly. The following example illustrates this by defining a transformation,
which flips the point along the x axis.


```scala mdoc:silent emptyLines:2
    val flipTransform = Transformation((p: Point[_3D]) => Point3D(-p.x, p.y, p.z))
```

When given a point as an argument, the defined transform will then, not surprisingly, return a new point:

```scala mdoc
    val pt: Point[_3D] = flipTransform(Point3D(1.0, 1.0, 1.0))
```

An important class of transformations are the rigid transformation, I.e. a rotation followed by a translation. Due to their
importance, these transformations are readily defined in scalismo.

A translation can be defined by specifying the translation vector, which is
added to every point:

```scala mdoc:silent emptyLines:2
    val translation = Translation3D(EuclideanVector3D(100, 0, 0))
```

For defining a rotation, we define the 3 [Euler angles](https://en.wikipedia.org/wiki/Euler_angles) , as well as the center of rotation.
```scala mdoc:silent emptyLines:2
    val rotationCenter = Point3D(0.0, 0.0, 0.0)
    val rotation: Rotation[_3D] = Rotation3D(0f, 3.14f, 0f, rotationCenter)
```
This transformation rotates every point with approximately 180 degrees around the Y axis (centered at the origin of the space).

```scala mdoc:silent emptyLines:2
    val pt2: Point[_3D] = rotation(Point(1, 1, 1))
```

The geometric objects in Scalismo, such as point clouds and triangle or tetrahedal meshes, are represented using a set of points. 
These objects all have a method `transform`, which transforms all the points represented by this object simultaneously.
The following example illustrates how a mesh can be moved around in space. 

```scala mdoc:silent emptyLines:2
    val translatedPaola: TriangleMesh[_3D] = mesh.transform(translation)
    val paolaMeshTranslatedView = ui.show(paolaGroup, translatedPaola, "translatedPaola")
```

### Composing transformations

Simple transformations can be composed into more complex ones using the compose method.

```scala
    val rigidTransform1 = CompositeTransformation(translation, rotation)
```

Rigid alignment normalizes the pose of an object with respect to a reference. This is a crucial step in any shape modelling pipeline. 
Therefore, Scalismo provides ready implementations for rigid transformations. 

```scala mdoc:silent  emptyLines:2
    val rigidTransform2 : RigidTransformation[_3D] = TranslationAfterRotation3D(translation, rotation)
```


*Exercise: Apply the rotation transform to the original mesh of Paola and show the result*

*Note: since the rotation is around the origin, you might have to zoom out (hold right click and drag down) to see the result.*


### Rigid alignment

A crucial step in any shape modelling process is the rigid alignment of objects. In other words, we aim to normalize the pose of an object relative to a certain reference.

To demonstrate this process, we'll transform the Paola's mesh using a predefined rigid transformation:

```scala mdoc:silent emptyLines:2
    val paolaTransformedGroup = ui.createGroup("paolaTransformed")
    val paolaTransformed = mesh.transform(rigidTransform2)
    ui.show(paolaTransformedGroup, paolaTransformed, "paolaTransformed")
```

The goal now is to determine the transformation that most effectively aligns the transformed mesh with the original mesh.
Rigid alignment becomes significantly simpler when we know some corresponding points in both shapes. This is typically achieved by 
manually defining landmarks on both meshes. 

In our case, however, we know that the two meshes are, up to a transformation, identical and thus share the same point ids. 
Therefore, we can programmatically identify some corresponding points in both meshes.:

```scala mdoc:silent emptyLines:2
    val pointIds = Seq(PointId(2213), PointId(14727), PointId(8320), PointId(48182))
    val paolaLandmarks = pointIds.map(pId => Landmark(s"lm-${pId.id}", mesh.pointSet.point(pId)))
    val paolaTransformedLandmarks = pointIds.map(pId => Landmark(s"lm-${pId.id}", paolaTransformed.pointSet.point(pId)))

    val paolaLandmarkViews = paolaLandmarks.map(lm => ui.show(paolaGroup, lm, s"${lm.id}"))
    val paolaTransformedLandmarkViews = paolaTransformedLandmarks.map(lm => ui.show(paolaTransformedGroup, lm, lm.id))
```

iven these lists of landmarks, we can employ the `rigid3DLandmarkRegistration` method to derive the optimal rigid transformation from the original set of landmarks:

```scala mdoc:silent emptyLines:2
    import scalismo.registration.LandmarkRegistration

    val bestTransform : RigidTransformation[_3D] = LandmarkRegistration.rigid3DLandmarkRegistration(paolaLandmarks, paolaTransformedLandmarks, center = Point(0, 0, 0))
```

The resulting transformation is the best possible rigid transformation (with rotation center ```Point(0,0,0)```) from ```paolaLandmarks``` to ```paolaTransformedLandmarks```.
Best here means, that it minimizes the mean squared error over the landmark points.

Let's now apply it to the original set of landmarks, to see how well they are transformed :

```scala mdoc:silent emptyLines:2
    val transformedLms = paolaLandmarks.map(lm => lm.transform(bestTransform))
    val landmarkViews = ui.show(paolaGroup, transformedLms, "transformedLMs")
```

Finally, we apply the transformation to the entire mesh:

```scala mdoc:silent emptyLines:2
    val alignedPaola = mesh.transform(bestTransform)
    val alignedPaolaView = ui.show(paolaGroup, alignedPaola, "alignedPaola")
    alignedPaolaView.color = java.awt.Color.RED
```


```scala mdoc:invisible
    ui.close()
```


