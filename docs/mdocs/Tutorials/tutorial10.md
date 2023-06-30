---
id: tutorial10
title: Iterative Closest Points for rigid alignment
---

The goal in this tutorial is to derive an implementation of the classical Iterative Closest Points (ICP) algorithm
in the context of rigid alignment of shapes.


##### Related resources

To enhance your understanding of this tutorial, we recommend the following resources from our [online course](https://shapemodelling.cs.unibas.ch/ssm-course/):

- Superimposing shapes [(Article)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250330)
- Model-fitting and correspondence [(Video)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250371)

To run the code from this tutorial, download the following Scala file:
- [Tutorial10.scala](./Tutorial10.scala)

```scala mdoc:invisible
//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"
```

##### Preparation

As in the previous tutorials, we start by importing some commonly used objects and initializing the system.

```scala mdoc:silent
import scalismo.ui.api.*
import scalismo.geometry.*
import scalismo.common.*
import scalismo.mesh.*
import scalismo.registration.LandmarkRegistration
import scalismo.io.{MeshIO}
import scalismo.numerics.UniformMeshSampler3D
import breeze.linalg.{DenseMatrix, DenseVector}

import java.io.File

import scalismo.utils.Random.FixedSeed.randBasis
```


```scala mdoc:invisible emptyLines:2
object Tutorial10 extends App:
```

```scala mdoc:silent empytLines:2
  scalismo.initialize()

  val ui = ScalismoUI()
```

## Automatic rigid alignment

  We start by loading and visualizing two meshes

```scala mdoc:silent empytLines:2
  val mesh1 = MeshIO.readMesh(File("datasets/Paola.ply")).get
  val group1 = ui.createGroup("Dataset 1")
  val mesh1View = ui.show(group1, mesh1, "mesh1")

  val mesh2 = MeshIO.readMesh(File("datasets/323.ply")).get
  val group2 = ui.createGroup("Dataset 2")
  val mesh2View = ui.show(group2, mesh2, "mesh2")
  mesh2View.color = java.awt.Color.RED
```

As you can see here, the meshes are not aligned. Instead of manually identifying corresponding points as we have done in previous tutorials, we'll employ a more automated approach here, specifically using the Iterative Closest Point (ICP) method. This method allows us to automatically perform the rigid alignment, reducing the need for manual adjustments.

### Candidate correspondences

In previous discussions, we found the optimal rigid transformation given a set of correct correspondences. However, this time, we lack those correspondences. This is where the Iterative Closest Point (ICP) algorithm comes in. It approximates correspondences by assuming that the corresponding point is the closest point on the mesh.

First, we'll select some points from our mesh. The exact count isn't critical, but we should aim for an approximate uniform distribution across the surface.

```scala mdoc:silent empytLines:2
  val ptIds = (0 until mesh1.pointSet.numberOfPoints by 50).map(i => PointId(i))
  ui.show(group1, ptIds.map(id => mesh1.pointSet.point(id)), "selected")
```

Next, we identify corresponding points in the other mesh:

```scala mdoc:silent empytLines:2
  def attributeCorrespondences(movingMesh: TriangleMesh[_3D], ptIds : Seq[PointId]) : Seq[(Point[_3D], Point[_3D])] = 
    ptIds.map((id : PointId) =>
      val pt = movingMesh.pointSet.point(id)
      val closestPointOnMesh2 = mesh2.pointSet.findClosestPoint(pt).point
      (pt, closestPointOnMesh2)
    )
```
Here, we didn't use `mesh1` directly, but rather the `movingMesh` argument, which will be iteratively transformed to closely align with our target mesh, `mesh2`.

Let us now visualize these correspondences:

```scala mdoc:silent empytLines:2
  val correspondences = attributeCorrespondences(mesh1, ptIds)
  val targetPoints = correspondences.map(pointPair => pointPair._2)
  ui.show(group2, targetPoints.toIndexedSeq, "correspondences")
```

As expected, the obtained correspondences are clearly not good, as they tend to focus on only one side of the target face. Nevertheless, we can apply Procrustes analysis based on these correspondences and
retrieve a rigid transformation that brings us closer to the target.

```scala mdoc:silent empytLines:2
  val rigidTrans =  LandmarkRegistration.rigid3DLandmarkRegistration(correspondences, center = Point3D(0, 0, 0))
  val transformed = mesh1.transform(rigidTrans)
  val alignedMeshView = ui.show(group1, transformed, "aligned?")
  alignedMeshView.color = java.awt.Color.GREEN
```

As expected, this alignment isn't great, given the poor quality of the candidate correspondences. However, it does bring us closer to the target compared to our initial position.

The second critical aspect of the ICP algorithm is iterative repetition of these steps, as they often converge. Here's how it works:

```scala mdoc:silent empytLines:2
  val newCorrespondences = attributeCorrespondences(transformed, ptIds)
  val newClosestPoints = newCorrespondences.map(pointPair => pointPair._2)
  ui.show(group2, newClosestPoints.toIndexedSeq, "newCandidateCorr")
  val newRigidTransformation =
    LandmarkRegistration.rigid3DLandmarkRegistration(newCorrespondences, center = Point3D(0, 0, 0))
  val newTransformed = transformed.transform(newRigidTransformation)

  val alignedMeshView2 =  ui.show(group2, newTransformed, "aligned??")
  alignedMeshView2.color = java.awt.Color.BLUE
```

As you can see, the candidate correspondences are still clearly wrong,
but start to be more spread around the target face.
Also the resulting rigid transformation seems to bring our mesh a bit closer to the target.

Finally, we change our implementation such that we can perform an arbitrary number of iterations:


```scala mdoc:silent empytLines:2
  def ICPRigidAlign(movingMesh: TriangleMesh[_3D], ptIds : Seq[PointId], numberOfIterations : Int) : TriangleMesh[_3D] = 
    if (numberOfIterations == 0) then 
      movingMesh 
    else 
      val correspondences = attributeCorrespondences(movingMesh, ptIds)
      val transform = LandmarkRegistration.rigid3DLandmarkRegistration(correspondences, center = Point(0, 0, 0))
      val transformed = movingMesh.transform(transform)
      ICPRigidAlign(transformed, ptIds, numberOfIterations - 1)    

```

Let's run it with 150 iterations:

```scala mdoc:silent empytLines:2

  val rigidfit = ICPRigidAlign(mesh1, ptIds, 150)
  val rigidFitView = ui.show(group1, rigidfit, "ICP_rigid_fit")
  rigidFitView.color = java.awt.Color.YELLOW
```

As you can observe, the quality of the candidate correspondences did indeed result in a proper
**automatic** rigid alignment of Paola to the target. One should not forget, however, that the ICP method is
very sensitive to the initial position, and might easily get stuck in a local minimum.


```scala mdoc:invisible
  ui.close()
```
