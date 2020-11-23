---
id: tutorial3
title: From meshes to deformation fields
---

*In this tutorial, we show how the deformation fields that relate two meshes can be computed and visualized.*

##### Related resources

The following resources from our [online course](https://www.futurelearn.com/courses/statistical-shape-modelling) may provide
some helpful context for this tutorial:

- Modelling Shape Deformations [(Video)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250326)


##### Preparation

As in the previous tutorials, we start by importing some commonly used objects and initializing the system.

```scala mdoc:silent
import scalismo.geometry._
import scalismo.common._
import scalismo.transformations._
import scalismo.io.MeshIO
import scalismo.mesh.TriangleMesh
import scalismo.common.interpolation._
import scalismo.common.interpolation.TriangleMeshInterpolator3D
import scalismo.ui.api._

scalismo.initialize()
implicit val rng = scalismo.utils.Random(42)

val ui = ScalismoUI()
```

We will also load three meshes and visualize them in Scalismo-ui.
```scala mdoc:silent
import scalismo.io.MeshIO

val dsGroup = ui.createGroup("datasets")

val meshFiles = new java.io.File("datasets/testFaces/").listFiles.take(3)
val (meshes, meshViews) = meshFiles.map(meshFile => {
    val mesh = MeshIO.readMesh(meshFile).get
    val meshView = ui.show(dsGroup, mesh, "mesh")
    (mesh, meshView) // return a tuple of the mesh and the associated view
}).unzip // take the tuples apart, to get a sequence of meshes and one of meshViews

```

### Representing meshes as deformations

In the following we show how we can represent a mesh as a reference mesh plus a deformation field. This is possible
because the meshes are all in correspondence; I.e. they all have the same number of points and points with the same id in the meshes represent
the same point/region in the mesh.

Let's say *face_0*, is the reference mesh:

```scala mdoc:silent
val reference = meshes.head // face_0 is our reference
```
Now any mesh, which is in correspondence with this reference, can be represented as a deformation field.
The deformation field is defined on this reference mesh; I.e. the points of
the reference mesh are the domain on which the deformation field is defined.

The deformations can be computed by taking the difference between the corresponding
point of the mesh and the reference:
```scala mdoc:silent
val deformations : IndexedSeq[EuclideanVector[_3D]] =
    reference.pointSet.pointIds.map {
         id =>  meshes(1).pointSet.point(id) - reference.pointSet.point(id)
    }.toIndexedSeq
```

From these deformations, we can then create a ```DiscreteVectorField```:

```scala mdoc:silent
val deformationField: DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = DiscreteField3D(reference, deformations)
```

As for images, the deformation vector associated with a particular point id in a *DiscreteVectorField* can be retrieved via its point id:

```scala mdoc
deformationField(PointId(0))
```

We can visualize this deformation field in Scalismo-ui using the usual ```show```
command:

```scala mdoc:silent
val deformationFieldView = ui.show(dsGroup, deformationField, "deformations")
```
We can see that the deformation vectors indeed point from the reference to *face_1*.
To see the effect better we need to remove *face2* from the ui,
make the reference transparent

```scala mdoc:silent
meshViews(2).remove()
meshViews(0).opacity = 0.3
```

*Exercise: generate the rest of the deformation fields that represent the rest of the faces in the dataset and display them.*


### Deformation fields over continuous domains:

The deformation field that we computed above is discrete as it is
defined only over the mesh points. Since the real-world objects that we
model are continuous, and the discretization of our meshes is rather
arbitrary, this is not ideal. In Scalismo we usually prefer to work with
continuous domains.
Whenever we have an object in Scalismo, which is defined on a discrete domain,
we can obtain a continuous representation, by means
of interpolation.

To turn our deformation field into a continuous deformation field, we need to define an ```Interpolator``` and call the ```interpolate```
method:
```scala mdoc:silent
val interpolator = TriangleMeshInterpolator3D[EuclideanVector[_3D]]()
val continuousDeformationField : Field[_3D, EuclideanVector[_3D]] = deformationField.interpolate(interpolator)
```

```The TriangleMeshInterpolator``` that we use here finds interpolates by finding for each point in the Euclidean space the closest
point on the surface and uses the corresponding deformation as the deformation at the given point. The point on the
surface is in turn obtained by barycentric interpolation of the corresponding vertex points. As a result of the interpolation,
we obtain a deformation field over the entire real space, which can be evaluated at any 3D Point:

```scala mdoc
continuousDeformationField(Point3D(-100,-100,-100))
```

*Remark: This approach is general: Any discrete object in Scalismo can be interpolated.
If we don't know anything about the structure of the domain, we can use the ```NearestNeighborInterpolator```.
For most domain, however, more specialised interpolators are defined. To interpolate an image for example,
we can use efficient linear or b-spline interpolation schemes.*


### The mean deformation and the mean mesh

Given a set of meshes, we are often interested to compute mesh that represents the mean shape.
This is equivalent to computing the mean deformation $$\overline{u}$$, and to apply this deformation to them mean mesh.

To compute the mean deformation, we compute for each point in our mesh the sample mean of the
deformations at this point in the deformation fields:

```scala mdoc:silent

val nMeshes = meshes.length

val meanDeformations = reference.pointSet.pointIds.map( id => {

  var meanDeformationForId = EuclideanVector3D(0, 0, 0)

  val meanDeformations = meshes.foreach (mesh => { // loop through meshes
    val deformationAtId = mesh.pointSet.point(id) - reference.pointSet.point(id)
    meanDeformationForId += deformationAtId * (1.0 / nMeshes)
  })

  meanDeformationForId
})

val meanDeformationField = DiscreteField3D(reference, meanDeformations.toIndexedSeq)
```

We can now apply the deformation to every point of the reference mesh, to obtain the mean mesh.
To do this, the easiest way is to first genenerate a transformation from the deformation field, which
we can use to map every point of the reference to its mean:
```scala mdoc:silent
val continuousMeanDeformationField = meanDeformationField.interpolate(TriangleMeshInterpolator3D())

val meanTransformation = Transformation((pt : Point[_3D]) => pt + continuousMeanDeformationField(pt))
```

To obtain the mean mesh, we simply apply this transformation to the reference mesh:
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