---
layout: docs
title: Rigid alignment
section: "tutorials"
---

{% include head.html %}

# Hello Scalismo!

The goal in this tutorial is to present the most important data structures, as well as the visualization capabilities of Scalismo.

##### Related resources

The following resources from our [online course](https://www.futurelearn.com/courses/statistical-shape-modelling) may provide
some helpful context for this tutorial:

- What is Scalismo [(Video)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250314)  


## Initializing the system

Before we start, we need to initialize Scalismo by calling:

```scala mdoc:silent
scalismo.initialize()
implicit val rng = scalismo.utils.Random(42)
```

The call to ```scalismo.initialize``` loads all the dependencies to native C++ libraries (such as e.g. [vtk](https://www.vtk.org) or [hdf5](https://www.hdf-group.org)). 
The second call tells scalismo, which source
of randomness to use and at the same time seeds the random number generator appropriately.

Later on we would like to visualize the objects we create. This is done using [Scalismo-ui](https://github.com/unibas-gravis/scalismo-ui) - the visualization library accompanying scalismo. 
We can load an instance of the GUI, which we name here simply ```ui``` as follows:

```scala mdoc:silent
import scalismo.ui.api.ScalismoUI

val ui = ScalismoUI()
```


## Meshes (surface data)

The first fundamental data structure we discuss is the triangle mesh, 
which is defined in the package ```scalismo.mesh```.
In the following we will need access to the following object, which we
now import:
```scala mdoc:silent
import scalismo.mesh.TriangleMesh // the mesh class
import scalismo.io.MeshIO // to read meshes
import scalismo.common.PointId // to refer to points by id
import scalismo.mesh.TriangleId // to refer to triangles by id
import scalismo.geometry._3D // indicates that we work in 3D space
```

Meshes can be read from a file using the method ```readMesh``` from the ```MeshIO```:
```scala mdoc:silent
val mesh : TriangleMesh[_3D] = MeshIO.readMesh(new java.io.File("datasets/Paola.ply")).get
``` 
To visualize any object in Scalismo, we can use the ```show``` method of the ```ui``` object. 
We often want to organize different visualizations of an object in a group. 
We start directly with this practice and 
first create a new group, to which we then add the visualization of the mesh:

```scala mdoc:silent
val paolaGroup = ui.createGroup("paola")
val meshView = ui.show(paolaGroup, mesh, "Paola")
```

Now that the mesh is displayed in the "Scalismo Viewer's 3D view", you can interact with it as follows: 

* to rotate: maintain the left mouse button clicked and drag  
* to shift/translate: maintain the middle mouse button clicked and drag
* to scale: maintain the right mouse button clicked and drag up or down
 
*Note: if you are a Mac user, please find out how to emulate these events using your mouse or trackpad*
*Note also that you can use the *RC*, *X*, *Y* and *Z* buttons in the 3D view to recenter the camera on the displayed object.*

#### Anatomy of a Triangle mesh
A 3D triangle mesh in scalismo consists of a ```pointSet```, which maintains a collection of 3D points and a 
list of triangle cells. We can access individual points using their point id. 
Here we show how we can access the first point in the mesh:

```scala mdoc
println("first point " + mesh.pointSet.point(PointId(0)))
``` 

Similarly, we can access the first triangles as follows:

```scala mdoc
println("first cell " + mesh.triangulation.triangle(TriangleId(0)))
``` 

The first cell is a triangle between the first, second and third points of the mesh.
Notice here that the cell indicates the identifiers of the points (their index in the point sequence)
instead of the geometric position of the points.

Instead of visualizing the mesh, we can also display the points forming the mesh. 

```scala mdoc:silent
val pointCloudView = ui.show(paolaGroup, mesh.pointSet, "pointCloud")
``` 

This should add a new point cloud element to the scene with the name "pointCloud".

*Note: depending on your computer, visualizing the full point cloud may slow down the visualization performance.*

Note that to clean up the 3D scene, you can delete the objects either from the user interface (by right-clicking on the object's name), or programmatically by calling ```remove``` on the corresponding view object :

```scala mdoc:silent
pointCloudView.remove()
``` 

## Points and Vectors

We are very often interested in modelling transformations of point sets. Therefore we need to learn how to manipulate point positions.
The two fundamental classes in this context are ```Point``` and ```EuclideanVector```:
```scala mdoc:silent
import scalismo.geometry.{Point}
import scalismo.geometry.{EuclideanVector}
```

We define points by specifying their coordinates:
``` scala mdoc:silent
val p1 : Point[_3D] = Point(4.0, 5.0, 6.0)
val p2 : Point[_3D] = Point(1.0, 2.0, 3.0)
```
The difference between two points is a ```EuclideanVector```

```scala mdoc:silent
val v1 : EuclideanVector[_3D] = Point(4.0, 5.0, 6.0) - Point(1.0 , 2.0, 3.0) 
```

The sum of a point with a vector yields a new point:
```scala mdoc:silent
val p3 : Point[_3D] = p1 + v1 
```
Points can be converted to vectors:
```scala mdoc:silent
val v2 : EuclideanVector[_3D] = p1.toVector
```
and vice versa:
```scala mdoc:silent
val v3 : Point[_3D] = v1.toPoint 
```

*Remark: Observe that the type of the expression is a parametric type ```Point[_3D]```, where the type parameter ```_3D``` encodes the dimensionality. This pattern holds true for most types in Scalismo. It allows us to write generic code, which is independent of the dimensionality of the space.* 

We put these concepts in practice, and illustrate how we can compute the center of mass, given a sequence of points:

```scala mdoc:silent
val pointList = Seq(Point(4.0, 5.0, 6.0), Point(1.0, 2.0, 3.0), Point(14.0, 15.0, 16.0), Point(7.0, 8.0, 9.0), Point(
10.0, 11.0, 12.0))
```

In a first step, we treat all the points as displacement vectors (the displacement of the points from the origin)
```scala mdoc:silent
val vectors = pointList.map{p : Point[_3D] => p.toVector}  // use map to turn points into vectors
```
The average displacement can be easily computed by averaging all the vectors. 
```scala mdoc:silent 
val vectorSum = vectors.reduce{ (v1, v2) => v1 + v2} // sum up all vectors in the collection
val centerV: EuclideanVector[_3D] = vectorSum * (1.0 / pointList.length ) // divide the sum by the number of points  
```

And finally we treat the average displacement again as a point in space. 
```scala mdoc:silent
val center = centerV.toPoint
```

## Scalar Images

The next important data structure is the (scalar-) image.
A *discrete* scalar image (e.g. gray level image) in Scalismo is simply a function from a discrete domain of points to a scalar value. 

We will need the following imports:
```scala mdoc:silent
import scalismo.io.ImageIO; // to read images
import scalismo.image.{DiscreteScalarImage, DiscreteScalarImage3D} // discrete images
import scalismo.image.ScalarImage // continuous images
import scalismo.geometry.{IntVector, IntVector3D} // represent image indices
```

Let's read and display a 3D image (MRI of a human):

```scala mdoc:silent
val image = ImageIO.read3DScalarImage[Short](new java.io.File("datasets/PaolaMRI.vtk")).get
val imageView = ui.show(paolaGroup, image, "mri")
```

*Note: depending on your view on the scene, it could appear as if the image is not displayed. In this case, make sure to rotate the scene and change the position of the slices as indicated below.*

To visualize the different image slices in the viewer, select "Scene" (the upper node in the scene tree graph) and use the X,Y,Z sliders.

You can also change the way of visualizing the 3D scene under the

*View -> Perspective* menu.

### Scalar Image domain

Let's inspect the domain of the image :

```scala mdoc
val origin : Point[_3D] = image.domain.origin
val spacing : EuclideanVector[_3D] = image.domain.spacing
val size : IntVector[_3D] = image.domain.size  
```

The discrete image domain is a 3-dimensional regular grid of points originating at point (92.5485, -121.926, 135.267), 
with regular spacing of 1.5 mm in each dimension and containing 171, 171, 139 grid slots in the x, y and z directions respectively. 

To better see this, let's display the first 172 points of the image domain 

```scala mdoc:silent
val imagePoints : Iterator[Point[_3D]] = image.domain.points.take(172)
val gridPointsView = ui.show(paolaGroup, imagePoints.toIndexedSeq, "imagePoints")
```

### Scalar image values

The other important part of a discrete image are the values associated with the domain points

```scala mdoc:silent
val values : Iterator[Short] = image.values
```
This is an iterator of scalar values of type ```Short``` as encoded in the read image.

Let's check the first value, which is the value associated with the origin : 

```scala mdoc
image.values.next 
```

The point *origin* corresponds to the grid point with index (0,0,0). Hence, the same value can be obtained by accessing the image at this index :
```scala mdoc
image(IntVector(0,0,0)) 
```

Naturally, the number of scalar values should be equal to the number of point domains 

```scala mdoc:silent
image.values.size == image.domain.points.size
```

Notice that you can check the intensity value at a particular point position in the image, by maintaining the Ctrl key pressed and hovering over the image. The intensity value will then be displayed in the lower left corner of the Scalismo viewer window.

### Creating scalar images

Given that discrete scalar images are a mapping between points and values, 
we can easily create such images programmatically.

Here we create a new image defined on the same domain of points with artificially created values: We threshold an MRI image, where
all the values above 300 are replaced with 0.


```scala mdoc:silent
val threshValues = image.values.map{v :Short => if (v <= 300) v else 0.toShort}
val thresholdedImage : DiscreteScalarImage[_3D, Short] = DiscreteScalarImage[_3D, Short](image.domain, threshValues.toSeq)
ui show(paolaGroup, thresholdedImage, "thresh")
```
*Note: We need to write 0.toShort or 0 : Short in order to ensure that the ```threshValues``` have type ```Short``` and not ```Int```.* 

There is, however, also a more elegant way to write above code. ```DiscreteScalarImage``` supports a ```map``` method, which applies
an operation to all values. Using this method, we can write instead
```scala mdoc:silent
val thresholdedImage2 : DiscreteScalarImage[_3D,Short] = image.map(v => if (v <= 300) v else 0.toShort)
```

## Statistical Mesh Models

Finally, we look at Statistical Shape Models. 

We need the following imports

```scala mdoc:silent
import scalismo.io.StatisticalModelIO // to read statistical shape models
import scalismo.statisticalmodel.StatisticalMeshModel // the statistical shape models
```

Statistical models can be read by calling ```readStatisticalMeshModel``` 
```scala mdoc:silent
val faceModel = StatisticalModelIO.readStatisticalMeshModel(new java.io.File("datasets/bfm.h5")).get
val faceModelView = ui.show(faceModel, "faceModel")
```

### Sampling in the UI

*Exercise: Sample random instances of faces by using the graphical tools in the scene pane : click on the "model" tree node and then the "Random" button*

*Exercise: click a landmark on a position of the face model, e.g. chin or eye corner.. (use the toggle button "LM" in the toolbar to activate landmark clicking). Rename this landmark and call it *noseLM*. Now continue sampling from the model. What happens to the selected point?*

As you can see, a new instance of the face model is displayed each time along with the corresponding landmark point. Notice how the position of the landmark point changes in space while it keeps the same "meaning" on the face (eye corner, tip of nose ..)


### Sampling programmatically

Sampling in the ui is useful for getting a visual impression of the variability of a model. But more often we want to 
sample from a model programmatically. We can obtain a sample from the model, by calling the ```sample method```:
```scala mdoc:silent
val randomFace : TriangleMesh[_3D] = faceModel.sample
```
#### Exercise: Visualize a few randomly generated meshes in the ui. 


##### Retrieving objects from Scalismo-ui

This is a good point to show how objects that we added manually in Scalismo-ui can be retrieved programmatically. A typical example is, 
that we manually clicked a landmark, such as our ```noseLM```, on one of the visualized objects and would like to work with them in our
programs. 
To achieve this we can use the ```filter``` method of the ui object. It works as follows:

```scala mdoc:silent
import scalismo.ui.api.LandmarkView
import scalismo.geometry.Landmark

val matchingLandmarkViews : Seq[LandmarkView] = ui.filter[LandmarkView](paolaGroup, (l : LandmarkView) => l.name == "noseLM")
val matchingLandmarks : Seq[Landmark[_3D]] = matchingLandmarkViews.map(lmView => lmView.landmark)
```

The ```filter``` method is very general. The type parameter (the parameter inside []) indicates the type of ```view``` object we want to 
search for. Here we look only for landmarks, and consequently specify the type ```LandmarkView```. As a first we  pass the group, 
in which we want to search for an object. The second argument is a predicate, which is executed for all objects in the group, of the right type. 
Here we specify, that ```filter``` should match all objects whose name equals "noseLM". Calling the ```filter``` method results in a sequence
of view objects, which match the predicate. To get the matching scalismo object, we call the method ```landmark``` on the view object. 
We can do this for all landmark view objects in the sequence using the familiar ```map``` function.

Finally, we can get the id and position of the matched landmark as follows:
```scala 
val landmarkId : String = matchingLandmarks.head.id
val landmarkPosition : Point[_3D] = matchingLandmarks.head.point
```

*Remark: In exactly the same way we can retrieve all other types of objects, 
which we can visualize in in Scalismo-ui, such as images, meshes, pointClouds, etc.*


```scala mdoc:invisible
ui.close()
```
