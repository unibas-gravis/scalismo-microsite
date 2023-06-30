---
id: tutorial01
title: Hello Scalismo!
---

The goal in this tutorial is to present the most important data structures, as well as the visualization capabilities of Scalismo.

##### Related resources

The ressources from week 1 of our [online course](https://shapemodelling.cs.unibas.ch/ssm-course/) may provide helpful context for this tutorial.

To run the code from this tutorial, download the following Scala file:
- [Tutorial01.scala](./Tutorial01.scala)

## Imports and Scalismo initialization

```scala mdoc:invisible
//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"
```

Before we start with writing actual Scalismo code, we import all 
objects that we will need in this tutorial. 

```scala mdoc:silent

// Basic geometric primitives
import scalismo.geometry.*
import scalismo.common.PointId

// Geometric objects
import scalismo.mesh.{TriangleMesh, TriangleId}
import scalismo.mesh.TriangleId
import scalismo.image.{DiscreteImage, DiscreteImage3D}
import scalismo.statisticalmodel.PointDistributionModel 

// IO Methods
import scalismo.io.*

// Visualization
import scalismo.ui.api.*

// File object from java
import java.io.File

// Choosing seeding mechanism for random number generator
import scalismo.utils.Random.FixedSeed.randBasis

``` 

```scala mdoc:invisible emptyLines:1
object Tutorial1 extends App:
```


Before we can start working with Scalismo objects, we need to initialize Scalismo. 
```scala mdoc:silent emptyLines:1
  scalismo.initialize()

```

The call to ```scalismo.initialize``` loads native C++ libraries such as [vtk](https://www.vtk.org). 

As we progress, you will see that we create various objects in Scalismo. To better understand and manipulate these objects, we need to visualize them. This is where [Scalismo-ui](https://github.com/unibas-gravis/scalismo-ui) comes into play. Scalismo-ui is a dedicated visualization library, designed to work seamlessly with Scalismo.

We can load an instance of the Graphical User Interface, which we name ```ui``` as follows:

```scala mdoc:silent emptyLines:0
  val ui = ScalismoUI()
```

## Meshes (surface data)

The first fundamental data structure we discuss is the triangle mesh,
which is defined in the package ```scalismo.mesh```.
Meshes can be read from a file using the method ```readMesh``` from the ```MeshIO```:
```scala mdoc:silent emptyLines:2
  val mesh: TriangleMesh[_3D] = MeshIO.readMesh(new java.io.File("datasets/Paola.ply")).get
```
In Scalismo, the show method of the ui object is used for visualization. 
It's common to group different visualizations of an object. 
We'll demonstrate this by creating a new group and adding our mesh to it:

```scala mdoc:silent emptyLines:1
  val paolaGroup = ui.createGroup("paola")
  val meshView = ui.show(paolaGroup, mesh, "Paola")
```

Once the mesh is rendered in the "Scalismo Viewer's 3D view", you can manipulate it in several ways:

* Rotate: Click and drag with the left mouse button.
* Translate: Click and drag with the middle mouse button.
* Scale: Click the right mouse button and drag up or down.

Mac users should refer to their specific mouse or trackpad instructions to replicate these actions. Note that the RC, X, Y, and Z buttons in the 3D view can be used to recenter the camera on the object.

#### Anatomy of a Triangle mesh

A 3D Triangle Mesh in Scalismo is composed of a pointSet, a collection of 3D points, 
and a list of triangle cells. Individual points can be accessed via their point IDs. 
The following code snippet demonstrates how to retrieve the first point in the mesh:

```scala mdoc:silent emptyLines:1
  println("first point " + mesh.pointSet.point(PointId(0)))
```

Similarly, we can access the triangles using their IDs. Here's how you can get the first triangle:

```scala mdoc:silent
  println("first cell " + mesh.triangulation.triangle(TriangleId(0)))
```

The first cell is a triangle made up of the first, second, and third points of the mesh. 
It's important to note that the cell refers to the identifiers of the points (their indices in the point sequence), 
not their geometric positions.

We can visualize not just the mesh but also the individual points forming it:

Instead of visualizing the mesh, we can also display the points forming the mesh.

```scala mdoc:silent
  val pointCloudView = ui.show(paolaGroup, mesh.pointSet, "pointCloud")
```

Executing this will add a new element to the scene, a point cloud named "pointCloud".

*Note: Be aware that visualizing the full point cloud might impact performance depending on your computer's specifications.*

For a neat and organized 3D scene, objects can be removed either directly from the user interface (by right-clicking the object's name) or programmatically by invoking remove on the corresponding view object:

```scala mdoc:silent
  pointCloudView.remove()
```

## Points and Vectors

Transformations of point sets are a common aspect of modelling in Scalismo. To understand how to manipulate point positions, we need to explore two fundamental classes: `Point` and `EuclideanVector`.

We define points by specifying their coordinates:

```scala mdoc:silent emptyLines:1
  val p1: Point[_3D] = Point3D(4.0, 5.0, 6.0)
  val p2: Point[_3D] = Point3D(1.0, 2.0, 3.0)
```
The difference between two points is a ```EuclideanVector```

```scala mdoc:silent 
  val v1: EuclideanVector[_3D] = Point3D(4.0, 5.0, 6.0) - Point3D(1.0, 2.0, 3.0)
```

Adding a point to a vector results in a new point:

```scala mdoc:silent
  val p3: Point[_3D] = p1 + v1
```
A point can be converted into a vector:

```scala mdoc:silent
  val v2: EuclideanVector[_3D] = p1.toVector
```
And a vector can be converted into a point:
```scala mdoc:silent
  val v3: Point[_3D] = v1.toPoint
```

*Note: The type of the expression is a parametric type `Point[_3D]`, where the type parameter `_3D` denotes the dimensionality. This pattern is consistent in Scalismo. The object constructor includes the dimensionality in its name (like `Point3D`, `TriangleMesh3D`), and the returned Type is the parametric type (such as `Point[_3D]` or `TriangleMesh[_3D]`). This system allows the creation of generic code that's independent of the objects' dimensionality.*

To illustrate these concepts, let's compute the center of mass for a sequence of points:

```scala mdoc:silent
  val pointList = Seq(
      Point3D(4.0, 5.0, 6.0),
      Point3D(1.0, 2.0, 3.0),
      Point3D(14.0, 15.0, 16.0),
      Point3D(7.0, 8.0, 9.0),
      Point3D(10.0, 11.0, 12.0)
    )
```

In a first step, we treat all the points as displacement vectors (the displacement of the points from the origin)
```scala mdoc:silent
  val vectors = pointList.map { (p: Point[_3D]) => p - Point3D(0, 0, 0) } // use map to turn points into vectors
```
Next, we compute the average displacement by averaging all the vectors:
```scala mdoc:silent
  val vectorSum = vectors.reduce { (v1, v2) => v1 + v2 } // sum up all vectors in the collection
  val centerV: EuclideanVector[_3D] = vectorSum * (1.0 / pointList.length) // divide the sum by the number of points
```

And finally we treat the average displacement again as a point in space.
```scala mdoc:silent
  val center = Point3D(0, 0, 0) + centerV
```

## Scalar Images

In Scalismo, a discrete scalar image, such as a gray level image, is represented as a function mapping a discrete domain of points to a scalar value.

Let's read a 3D image (an MRI of a human head ) and display it:

```scala mdoc:silent emptyLines:1
  val image: DiscreteImage[_3D, Short] = ImageIO.read3DScalarImage[Short](File("datasets/PaolaMRI.vtk")).get
  val imageView = ui.show(paolaGroup, image, "mri")
```

*Note: Depending on your scene's viewpoint, it may initially appear as if the image isn't displaying. If that's the case, rotate the scene and adjust the slice positions as instructed below.*

To view different image slices in the viewer, select "Scene" (the top node in the scene tree graph) and use the X, Y, Z sliders.

Furthermore, the visualization perspective for the 3D scene can be adjusted via the

*View -> Perspective* menu.

### Scalar Image domain

As mentioned above, an image is a function defined on a (discrete) domain. In the case of an image, 
the domain is defined by its origin (a point), the spacing between voxels, and the size (number of voxels). 

```scala mdoc emptyLines:2
  val origin: Point[_3D] = image.domain.origin
  val spacing: EuclideanVector[_3D] = image.domain.spacing
  val size: IntVector[_3D] = image.domain.size
```

### Scalar image values

The other important part of a discrete image is the values associated with the domain points

```scala mdoc:silent emptyLines:1
  val values : Iterator[Short] = image.values
```
This provides an iterator of scalar values of type `Short`, as encoded in the image we've read.
Note that the choice of providing an iterator is deliberate. For large images, the number of 
values can be huge and it is often best, to consume them one by one instead of having all of 
them in memory at the same time. 


Let's look at the first 10 values of the image:

```scala mdoc
  println(image.values.take(10).toSeq)
```

The point *origin* corresponds to the grid point with index (0,0,0). Hence, the same value can be obtained by accessing the image at this index :
```scala mdoc
  image(IntVector3D(0,0,0))
```

Naturally, the number of scalar values should be equal to the number of points

```scala mdoc:silent
  image.values.size == image.domain.pointSet.numberOfPoints
```

Notice that you can check the intensity value at a particular point position in the image, by maintaining the Ctrl key pressed and hovering over the image. The intensity value will then be displayed in the lower left corner of the Scalismo viewer window.

### Creating scalar images

Discrete scalar images are essentially a mapping between points and values. Therefore, we can generate such images programmatically.

In the following example, we'll create a new image defined on the same domain as the original image, but with artificially created values. We're going to apply a threshold to an MRI image, replacing all values above 300 with 0.


```scala mdoc:silent emptyLines:1
  val threshValues = image.values.map { (v: Short) => if (v <= 300) v else 0.toShort }
  val thresholdedImage: DiscreteImage[_3D, Short] = DiscreteImage3D[Short](image.domain, threshValues.toIndexedSeq)
  ui.show(paolaGroup, thresholdedImage, "thresh")
```
*Note: We need to write 0.toShort or 0 : Short in order to ensure that the ```threshValues``` have type ```Short``` and not ```Int```.*

There is, however, a more concise way to write the above code: using the map method. The map method applies an operation to all values. By using this method, we can simply write:

```scala mdoc:silent
  val thresholdedImage2 = image.map(v => if (v <= 300) v else 0.toShort)
```

## Point Distribution Models

Finally, we look at Statistical Shape Models, which in Scalismo come in the form of Point Distribution Models (PDMs).


PDMs can be read by calling ```readStatisticalTriangleMeshModel3D```

```scala mdoc:silent emptyLines:1
  val faceModel: PointDistributionModel[_3D, TriangleMesh] = StatisticalModelIO.readStatisticalTriangleMeshModel3D(File("datasets/bfm.h5")).get
  val faceModelView = ui.show(faceModel, "faceModel")
```

### Sampling in the UI

*Exercise: Sample random instances of faces by using the graphical tools in the scene pane : click on the "model" tree node and then the "Random" button*

*Exercise: click a landmark on a position of the face model, e.g. chin or eye corner.. (use the toggle button "LM" in the toolbar to activate landmark clicking). Rename this landmark and call it *noseLM*. Now continue sampling from the model. What happens to the selected point?*

As you can see, a new instance of the face model is displayed each time along with the corresponding landmark point. Notice how the position of the landmark point changes in space while it keeps the same "meaning" on the face (eye corner, tip of nose ..)


### Sampling programmatically

Sampling in the ui is useful for getting a visual impression of the variability of a model. But more often we want to
sample from a model programmatically. We can obtain a sample from the model, by calling the ```sample method```:

```scala mdoc:silent emptyLines:1
  val randomFace: TriangleMesh[_3D] = faceModel.sample()
```

**Exercise:** Visualize a few randomly generated meshes in the ui.


##### Retrieving objects from Scalismo-ui

This is a good opportunity to demonstrate how we can programmatically retrieve objects that were manually added in Scalismo-ui. A typical use case might be if we manually identified a landmark (like our noseLM) on one of the visualized objects and now we want to utilize it in our program. We can accomplish this using the filter method of the UI object, which operates as follows:

```scala mdoc:silent
  val matchingLandmarkViews : Seq[LandmarkView] = ui.filter[LandmarkView](paolaGroup, (l : LandmarkView) => l.name == "noseLM")
  val matchingLandmarks : Seq[Landmark[_3D]] = matchingLandmarkViews.map(lmView => lmView.landmark)
```

The `filter` method is quite versatile. The type parameter (specified inside []) designates the type of view object we are looking for. In this case, we are only interested in landmarks, hence we specify the type `LandmarkView`. We pass the group where we want to search for an object as the first argument. The second argument is a predicate function that will be executed for all objects in the group of the correct type. Here, we instruct filter to match all objects with the name "noseLM". The filter method then returns a sequence of view objects that match this predicate. To obtain the corresponding Scalismo object, we call the landmark method on the view object. We can do this for all landmark view objects in the sequence using the familiar map function.

Finally, we can retrieve the id and position of the matched landmark as follows:

```scala
  val landmarkId : String = matchingLandmarks.head.id
  val landmarkPosition : Point[_3D] = matchingLandmarks.head.point
```

*Note: We can retrieve all other types of objects visualized in Scalismo-ui in exactly the same manner. This includes images, meshes, point clouds, etc.*


```scala mdoc:invisible emptyLines:1
  ui.close()
```


##### Related resources:

* [Scala-code for this tutorial](Tutorial01.scala)