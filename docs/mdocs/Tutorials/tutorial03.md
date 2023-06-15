---
id: tutorial03
title: From meshes to deformation fields
---


This tutorial aims to demonstrate the process of computing and visualizing the deformation field that represent the shape differences between two meshes. 

##### Related resources

To enhance your understanding of this tutorial, we recommend the following resources from our [online course](shapemodelling.cs.unibas.ch/ssm-course/):

- Modelling Shape Deformations [(Video)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250326)

To run the code from this tutorial, download the following Scala file:
- [Tutorial03.scala](./Tutorial03.scala)

##### Preparation

```scala mdoc:invisible
//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92-RC1"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92-RC1,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"
```

Similar to the prior tutorials, our first step involves importing frequently utilized objects and initializing the system.

```scala mdoc:silent
import scalismo.geometry.*
import scalismo.common.*
import scalismo.transformations.*
import scalismo.common.interpolation.*
import scalismo.ui.api.*
import scalismo.io.MeshIO
import scalismo.mesh.TriangleMesh

import java.io.File

import scalismo.utils.Random.FixedSeed.randBasis
```

```scala mdoc:invisible emptyLines:2
@main
def tutorial3(): Unit = 
```

```scala mdoc:silent emptyLines:2
  scalismo.initialize()

  val ui = ScalismoUI()
```

Let's read a number of meshes and visualize them:
```scala mdoc:silent

  val dsGroup = ui.createGroup("datasets")

  val meshFiles = new File("datasets/testFaces/").listFiles.take(3) // take first 3 files
  val (meshes, meshViews) = meshFiles.map(meshFile => {
    val mesh = MeshIO.readMesh(meshFile).get // load mesh
    val meshView = ui.show(dsGroup, mesh, "mesh") // visualize it
    (mesh, meshView) // return a tuple of the mesh and the associated view
  }).unzip // take the tuples apart, to get a sequence of meshes and one of meshViews
```

### Representing meshes as deformations

In the following we show how we can represent a mesh as a reference mesh plus a deformation field. This is possible
because the meshes are all in correspondence; I.e. they all have the same number of points and points with the same id in the meshes represent
the same point/region in the mesh.

We consider the first mesh as the reference mesh:

```scala mdoc:silent
  val reference = meshes.head 
```

Given that a mesh is in correspondence with this reference, it can be expressed as a deformation field. 
This deformation field is defined on the reference mesh, implying that the points of the reference mesh 
represent the domain on which the deformation field is formulated.

The deformations can be computed by taking the difference between the corresponding
point of the mesh and the reference:
```scala mdoc:silent
  val deformations : IndexedSeq[EuclideanVector[_3D]] =
    reference.pointSet.pointIds.map (
        id =>  meshes(1).pointSet.point(id) - reference.pointSet.point(id)
    ).toIndexedSeq
```

From these deformations, we can then create a ```DiscreteVectorField```:

```scala mdoc:silent
  val deformationField: DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = DiscreteField3D(reference, deformations)
```

Similar to images, the deformation vector corresponding to a specific point id in a *DiscreteVectorField* can be retrieved through its point id:

```scala mdoc
  deformationField(PointId(0))
```

In Scalismo-ui, this deformation field can be visualized using the standard show command:

```scala mdoc:silent
  val deformationFieldView = ui.show(dsGroup, deformationField, "deformations")
```

The visualization reveals that the deformation vectors indeed point from the reference to face_1. 
To enhance this effect, we must remove face2 from the UI and make the reference transparent:

```scala mdoc:silent
  meshViews(2).remove()
  meshViews(0).opacity = 0.3
```

*Exercise: generate the rest of the deformation fields that represent the rest of the faces in the dataset and display them.*


### Deformation fields over continuous domains:

The deformation field calculated in the previous section is discrete, as it is only defined over the mesh points. 
Considering that the real-world objects we are modelling are continuous, and the discretization of our meshes is relatively arbitrary, this is not ideal. 
In Scalismo, we prefer working with continuous domains. When we have an object in Scalismo defined on a discrete domain, 
we can achieve a continuous representation by using interpolation.

To convert our deformation field into a continuous deformation field, we need to define an `Interpolator` and call the `interpolate` method:

```scala mdoc:silent
  val interpolator = TriangleMeshInterpolator3D[EuclideanVector[_3D]]()
  val continuousDeformationField : Field[_3D, EuclideanVector[_3D]] = deformationField.interpolate(interpolator)
```

The `TriangleMeshInterpolator` utilized here identifies the nearest point on the surface for each point in Euclidean space and uses the corresponding deformation as the deformation at that point. 
The point on the surface is obtained through barycentric interpolation of the corresponding vertex points. 
As a result of the interpolation, we get a deformation field over the entire real space, which can be evaluated at any 3D point:

```scala mdoc
  continuousDeformationField(Point3D(-100,-100,-100))
```

Note: This method is general and any discrete object in Scalismo can be interpolated. All objects defined on discrete domains support interpolation using the `NearestNeighborInterpolator`. 
For most domains, however, more specialized interpolators are defined. For instance, to interpolate an image, we can use efficient linear or b-spline interpolation schemes.


### The mean deformation and the mean mesh

The mean shape of a set of meshes often needs to be computed in shape analysis. 
This is equivalent to calculating the mean deformation, denoted as $$\overine{u}$$, and applying this deformation to the mean mesh.

Let's compute the mean deformation. We achieve this by calculating the sample mean of the deformations at each point in our deformation fields:

```scala mdoc:silent

  val nMeshes = meshes.length
  val meanDeformations = reference.pointSet.pointIds.map(id => {

    val deformationsForId = meshes.map(mesh => { // loop through meshes
      (mesh.pointSet.point(id) - reference.pointSet.point(id)) * (1.0 / nMeshes)
    })
    deformationsForId.reduce(_ + _) // sum the deformations
  })

  val meanDeformationField = DiscreteField3D(reference, meanDeformations.toIndexedSeq)
```

To create the mean mesh, we apply the deformation to each point of the reference mesh. 
We achieve this by first generating a transformation from the deformation field, which can then be used to map every point of the reference to its mean position:

```scala mdoc:silent
  val continuousMeanDeformationField = meanDeformationField.interpolate(TriangleMeshInterpolator3D())
  val meanTransformation = Transformation((pt : Point[_3D]) => pt + continuousMeanDeformationField(pt))
```

To get the mean mesh, we simply apply this transformation to the reference mesh:
```scala mdoc:silent
  val meanMesh = reference.transform(meanTransformation)
```

Finally, we display the result:
```scala mdoc:silent
  ui.show(dsGroup, meanMesh, "mean mesh")
```


```scala mdoc:invisible
  ui.close()
```

