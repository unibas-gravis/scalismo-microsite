---
id: tutorial06
title: Building a shape model from data
---

The goal in this tutorial is to learn how to build a Statistical Shape Model
from meshes in correspondence. Furthermore, we discuss the importance of rigid alignment while doing so.


##### Related resources

To enhance your understanding of this tutorial, we recommend the following resources from our [online course](shapemodelling.cs.unibas.ch/ssm-course/):

- Learning a model from example data [(Video)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250329)

To run the code from this tutorial, download the following Scala file:
- [Tutorial06.scala](./Tutorial06.scala)


##### Preparation

```scala mdoc:invisible
//> using scala "3.2"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.91.2"
```

As in the previous tutorials, we start by importing some commonly used objects and initializing the system.

```scala mdoc:silent
import scalismo.ui.api._

import scalismo.geometry._
import scalismo.common._
import scalismo.common.interpolation.TriangleMeshInterpolator3D
import scalismo.mesh._
import scalismo.io.{StatisticalModelIO, MeshIO}
import scalismo.statisticalmodel._
import scalismo.registration._
import scalismo.statisticalmodel.dataset._
import scalismo.numerics.PivotedCholesky.RelativeTolerance
```

```scala mdoc:invisible emptyLines:2
object Tutorial6 extends App {
```

```scala mdoc:silent
scalismo.initialize()
implicit val rng: scalismo.utils.Random = scalismo.utils.Random(42)

val ui = ScalismoUI()
```

### Loading and preprocessing a dataset:

Let us load (and visualize) a set of face meshes based on which we would like to model shape variation:

```scala mdoc:silent emptyLines:2
val dsGroup = ui.createGroup("datasets")

val meshFiles = new java.io.File("datasets/nonAlignedFaces/").listFiles
val (meshes, meshViews) = meshFiles.map(meshFile => {
  val mesh = MeshIO.readMesh(meshFile).get
  val meshView = ui.show(dsGroup, mesh, "mesh")
  (mesh, meshView) // return a tuple of the mesh and the associated view
}) .unzip // take the tuples apart, to get a sequence of meshes and one of meshViews
```

You immediately see that the meshes are not aligned. What you cannot see, but is
 very important for this tutorial, is
that the meshes are **in correspondence**.
This means that for every point on one of the face meshes
(corner of eye, tip of nose, ...), we can identify the corresponding point on
other meshes.  Corresponding points are identified by the same point id.

*Exercise: verify that the meshes are indeed in correspondence by displaying a few corresponding points.*

#### Rigidly aligning the data:

In order to study shape variations, we need to eliminate variations due to
relative spatial displacement of the shapes (rotation and translation).
This can be achieved by selecting one of the meshes as a reference,
to which the rest of the datasets are aligned.
In this example here, we simply take the first mesh in the list as a reference and align all the others.

```scala mdoc:silent emptyLines:2
val reference = meshes.head
val toAlign : IndexedSeq[TriangleMesh[_3D]] = meshes.tail
```

Given that our dataset is in correspondence, we can specify a set of point
identifiers, to locate corresponding points on the meshes.

```scala mdoc:silent emptyLines:2
val pointIds = IndexedSeq(2214, 6341, 10008, 14129, 8156, 47775)
val refLandmarks = pointIds.map{id => Landmark(s"L_$id", reference.pointSet.point(PointId(id))) }
```
After locating the landmark positions on the reference, we iterate on each remaining data item, identify the corresponding landmark points and then rigidly align the mesh to the reference.

```scala mdoc:silent emptyLines:2
val alignedMeshes = toAlign.map { mesh =>
  val landmarks = pointIds.map{id => Landmark("L_"+id, mesh.pointSet.point(PointId(id)))}
  val rigidTrans = LandmarkRegistration.rigid3DLandmarkRegistration(landmarks, refLandmarks, center = Point(0,0,0))
  mesh.transform(rigidTrans)
}
```
Now, the IndexedSeq of triangle meshes *alignedMeshes* contains the faces that are aligned to the reference mesh.

*Exercise: verify visually that at least the first element of the aligned dataset is indeed aligned to the reference.*



### Building a discrete Gaussian process from data

Now that we have a set of meshes, which are in correspondence and aligned
to our reference, we can turn the dataset into a set of deformation fields,
from which we then build the model:

```scala mdoc:silent emptyLines:2
val defFields = alignedMeshes.map{ m =>
    val deformationVectors = reference.pointSet.pointIds.map{ (id : PointId) =>
        m.pointSet.point(id) - reference.pointSet.point(id)
    }.toIndexedSeq
    DiscreteField3D(reference, deformationVectors)
}
```

Learning the shape variations from this deformation fields is
done by calling the method ```createUsingPCA``` of the
```DiscreteLowRankGaussianProcess``` class.
Note that the deformation fields need to be interpolated, such that we are sure that they are defined on
all the points of the reference mesh. Once we have the deformation fields, we can build and
visualize the Point Distribution Model:

```scala mdoc:silent emptyLines:2
val continuousFields = defFields.map(f => f.interpolate(TriangleMeshInterpolator3D()) )
val gp = DiscreteLowRankGaussianProcess.createUsingPCA(reference,
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


### An easier way to build a model.

Performing all the operations above every time we want to build a PCA model
from a set of files containing meshes in correspondence can be tedious.
Therefore, Scalismo provides a more easy to use implementation via the
*DataCollection* data structure.


The *DataCollection* class in Scalismo allows grouping together a dataset of meshes in correspondence,
in order to make collective operations on such sets easier.

We can create a *DataCollection* by providing a reference mesh, and
a sequence of meshes, which are in correspondence with this reference.

```scala mdoc:silent emptyLines:2
val dc = DataCollection.fromTriangleMesh3DSequence(reference, alignedMeshes)
```

Now that we have our data collection, we can build a shape model as follows:

```scala mdoc:silent emptyLines:2
val modelFromDataCollection = PointDistributionModel.createUsingPCA(dc)

val modelGroup2 = ui.createGroup("modelGroup2")
ui.show(modelGroup2, modelFromDataCollection, "ModelDC")
```

There is a technique called *Generalized Procrustes Analysis (GPA)*, which can 
improve the alignment of the data even better. It works by computing
the mean of a set of surfaces in correspondence, aligning all the surfaces rigidly
to this mean, and then iterating this procedure until the changes in the 
computed mean are below a certain threshold. In Scalismo, this alignment
procedure is defined on data collections. We can use it as follows:

```scala mdoc:silent emptyLines:2
val dcWithGPAAlignedShapes = DataCollection.gpa(dc)
val modelFromDataCollectionGPA = PointDistributionModel.createUsingPCA(dcWithGPAAlignedShapes)

val modelGroup3 = ui.createGroup("modelGroup3")
ui.show(modelGroup3, modelFromDataCollectionGPA, "ModelDCGPA")
```



```scala mdoc:invisible
ui.close();
```

```scala mdoc:invisible
}
```