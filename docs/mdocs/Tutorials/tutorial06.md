---
id: tutorial06
title: Building a shape model from data
---

The goal in this tutorial is to learn how to build a Point Distribution Model
from meshes in correspondence. 

##### Related resources

To enhance your understanding of this tutorial, we recommend the following resources from our [online course](https://shapemodelling.cs.unibas.ch/ssm-course/):

- Learning a model from example data [(Video)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250329)

To run the code from this tutorial, download the following Scala file:
- [Tutorial06.scala](./Tutorial06.scala)


##### Preparation

```scala mdoc:invisible
//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"
```

As in the previous tutorials, we start by importing some commonly used objects and initializing the system.

```scala mdoc:silent
import scalismo.ui.api.*

import scalismo.geometry.*
import scalismo.common.*
import scalismo.common.interpolation.TriangleMeshInterpolator3D
import scalismo.mesh.*
import scalismo.io.{StatisticalModelIO, MeshIO}
import scalismo.statisticalmodel.*
import scalismo.registration.*
import scalismo.statisticalmodel.dataset.*
import scalismo.numerics.PivotedCholesky.RelativeTolerance

import java.io.File

import scalismo.utils.Random.FixedSeed.randBasis
```

```scala mdoc:invisible emptyLines:2
object Tutorial6 extends App:
```

```scala mdoc:silent
  scalismo.initialize()

  val ui = ScalismoUI()
```

### Loading and preprocessing a dataset:

Let's proceed to load (and visualize) a collection of face meshes. We aim to use these meshes to model the variation in shape:

```scala mdoc:silent emptyLines:2
  val dsGroup = ui.createGroup("datasets")

  val meshFiles = File("datasets/nonAlignedFaces/").listFiles
  val (meshes, meshViews) = meshFiles.map(meshFile => {
    val mesh = MeshIO.readMesh(meshFile).get
    val meshView = ui.show(dsGroup, mesh, "mesh")
    (mesh, meshView) // return a tuple of the mesh and the associated view
  }).unzip // take the tuples apart, to get a sequence of meshes and one of meshViews
```

What you'll notice immediately is that the meshes are not in alignment. However, something less obvious but crucial for this tutorial is that the meshes are in correspondence. This means that for every point on one of the face meshes (be it the corner of an eye, the tip of a nose, and so on), we can pinpoint the matching point on the other meshes. These corresponding points are identified by the same point ID.

*Exercise: verify that the meshes are indeed in correspondence by displaying a few corresponding points.*

#### Rigidly aligning the data:

To analyze shape variations, we must remove variations caused by relative spatial displacements of the shapes, such as rotation and translation. We can accomplish this by choosing one of the meshes as a reference and aligning the rest of the datasets to it. In this instance, we'll simply use the first mesh in the list as our reference and align all the others to it.

```scala mdoc:silent emptyLines:2
  val reference = meshes.head
  val toAlign : IndexedSeq[TriangleMesh[_3D]] = meshes.tail
```

Since our dataset is in correspondence, we are able to specify a set of point identifiers. These allow us to locate corresponding points across the different meshes.

```scala mdoc:silent emptyLines:2
  val pointIds = IndexedSeq(2214, 6341, 10008, 14129, 8156, 47775).map(id => PointId(id))
  val refLandmarks = pointIds.map(id => 
    Landmark(s"L_$id", reference.pointSet.point(id))
  ) 
```
After locating the landmark positions on the reference, we iterate on each remaining data item, identify the corresponding landmark points and then rigidly align the mesh to the reference.

```scala mdoc:silent emptyLines:2
  val alignedMeshes = toAlign.map(mesh =>
    val landmarks = pointIds.map{id => Landmark("L_"+id, mesh.pointSet.point(id))}
    val rigidTrans = LandmarkRegistration.rigid3DLandmarkRegistration(landmarks, refLandmarks, center = Point3D(0,0,0))
    mesh.transform(rigidTrans)
  )
```
Now, the sequence `alignedMeshes`  holds the face meshes that have been aligned with the reference mesh.

*Exercise: verify visually that at least the first element of the aligned dataset is indeed aligned to the reference.*



### Building a discrete Gaussian process from data

Once we have a set of meshes that correspond and are aligned to our reference, 
we can convert the dataset into a set of deformation fields.
 From these fields, we can then construct our model:

```scala mdoc:silent emptyLines:2
  val defFields = alignedMeshes.map( m =>
    val deformationVectors = reference.pointSet.pointIds.map( (id : PointId) =>
        m.pointSet.point(id) - reference.pointSet.point(id)
    ).toIndexedSeq
    DiscreteField3D(reference, deformationVectors)
  )
```

From these deformation fields, we can learn the shape variations by invoking the `createUsingPCA` method of the `DiscreteLowRankGaussianProcess` class. Note that the deformation fields need to be interpolated, so we can confirm they are defined on all points of the reference mesh. Once we have the deformation fields, we can build and visualize the Point Distribution Model:

```scala mdoc:silent emptyLines:2
  val continuousFields = defFields.map(f => f.interpolate(TriangleMeshInterpolator3D()) )
  val gp = DiscreteLowRankGaussianProcess.createUsingPCA(
    reference,
    continuousFields, RelativeTolerance(1e-8)
  )
  val model = PointDistributionModel(gp)
  val modelGroup = ui.createGroup("model")
  val ssmView = ui.show(modelGroup, model, "model")
```

Notice that when we visualize this mesh model in Scalismo-ui,
it generates a GaussianProcessTransformation and the reference mesh in the
Scene Tree of Scalismo-ui.


*Exercise: display the mean deformation field of the returned Gaussian Process.*

*Exercise: sample and display a few deformation fields from this GP.*

*Exercise: using the GP's *cov* method, evaluate the sample covariance between two close points on the right cheek first, and a point on the nose and one on the cheek second. What does the data tell you?*


### A simpler method to build a model

Executing all the operations above every time we want to construct a PCA model from a set of 
files containing corresponding meshes can be repetitive. 
Hence, Scalismo offers a simpler implementation via the `DataCollection` data structure.

The `DataCollection` class in Scalismo lets you group together a dataset of corresponding meshes to facilitate collective operations on these sets.

We can create a `DataCollection` by providing a reference mesh and a sequence of meshes that correspond to this reference.

```scala mdoc:silent emptyLines:2
  val dc = DataCollection.fromTriangleMesh3DSequence(reference, alignedMeshes)
```

Now that we have our data collection, we can construct a shape model as follows:

```scala mdoc:silent emptyLines:2
  val modelFromDataCollection = PointDistributionModel.createUsingPCA(dc)

  val modelGroup2 = ui.createGroup("modelGroup2")
  ui.show(modelGroup2, modelFromDataCollection, "ModelDC")
```

There is a technique known as *Generalized Procrustes Analysis (GPA)* that can further 
improve the alignment of the data. It functions by computing the mean of a set of 
corresponding surfaces, rigidly aligning all the surfaces to this mean, and iterating 
this process until the changes in the computed mean are below a specific threshold. 
In Scalismo, this alignment procedure is defined on data collections, and we can use it as follows:

```scala mdoc:silent emptyLines:2
  val dcWithGPAAlignedShapes = DataCollection.gpa(dc)
  val modelFromDataCollectionGPA = PointDistributionModel.createUsingPCA(dcWithGPAAlignedShapes)

  val modelGroup3 = ui.createGroup("modelGroup3")
  ui.show(modelGroup3, modelFromDataCollectionGPA, "ModelDCGPA")
```



```scala mdoc:invisible
  ui.close();
```

