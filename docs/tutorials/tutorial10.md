---
layout: docs
title: Rigid alignment
section: "tutorials"
---

{% include head.html %}

# Iterative Closest Points for rigid alignment

The goal in this tutorial is to derive an implementation of the classical Iterative Closest Points (ICP) algorithm
in the context of rigid alignment of shapes.


##### Related resources

The following resources from our [online course](https://www.futurelearn.com/courses/statistical-shape-modelling) may provide
some helpful context for this tutorial:

- Superimposing shapes [(Article)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250330)
- Model-fitting and correspondence [(Video)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250371)

##### Preparation

As in the previous tutorials, we start by importing some commonly used objects and initializing the system.

```scala
import scalismo.geometry._
import scalismo.common._
import scalismo.ui.api._
import scalismo.mesh._
import scalismo.registration.LandmarkRegistration
import scalismo.io.{MeshIO}
import scalismo.numerics.UniformMeshSampler3D
import breeze.linalg.{DenseMatrix, DenseVector}

scalismo.initialize()
implicit val rng = scalismo.utils.Random(42)

val ui = ScalismoUI()
```

## Automatic rigid alignment

We start by loading and visualizing two meshes

```scala
val mesh1 = MeshIO.readMesh(new java.io.File("datasets/Paola.ply")).get
val group1 = ui.createGroup("Dataset 1")
val mesh1View = ui.show(group1, mesh1, "mesh1")

val mesh2 = MeshIO.readMesh(new java.io.File("datasets/323.ply")).get
val group2 = ui.createGroup("Dataset 2")
val mesh2View = ui.show(group2, mesh2, "mesh2")
mesh2View.color = java.awt.Color.RED
```

As you can see here, the meshes are not aligned. As in previous tutorials, we could identify corresponding points
to align the meshes. The downside is, that this requires some manual intervention.
In this tutorial we will instead use the Iterative Closest Point (ICP) method to perform this rigid alignment step **automatically**.

### Candidate correspondences

We have seen before that finding the best rigid transformation when given correct correspondences has a closed-form
solution. The problem we are facing here is that we do not have these correspondences. The idea of the ICP algorithm is,
that we can approximate the correspondences, by simply assuming that the corresponding point is always the closest point on
the mesh.

Let's select a few points from the mesh.

```scala
val ptIds = (0 until mesh1.pointSet.numberOfPoints by 50).map(i => PointId(i))
ui.show(group1, ptIds.map(id => mesh1.pointSet.point(id)), "selected")
```

The exact number of points is not important. It is only important that we select points, which are approximately
uniformly distributed over the surface.

In the next step, we find the corresponding points in the other mesh:

```scala
def attributeCorrespondences(movingMesh: TriangleMesh[_3D], ptIds : Seq[PointId]) : Seq[(Point[_3D], Point[_3D])] = {
  ptIds.map{ id : PointId => 
    val pt = movingMesh.pointSet.point(id)
    val closestPointOnMesh2 = mesh2.pointSet.findClosestPoint(pt).point
    (pt, closestPointOnMesh2)
  } 
}
```

Note that we used here not ```mesh1``` directly, but passed the mesh from which we find the closest points as an argument,
which we called the ```MovingMesh```. The reason is, that this will later be iteratively transformed to come closer to our target mesh ```mesh2```.

Let us now visualize the the chosen correspondences:

```scala
val correspondences = attributeCorrespondences(mesh1, ptIds)
val targetPoints = correspondences.map(pointPair => pointPair._2)
ui.show(group2, targetPoints.toIndexedSeq, "correspondences")
```

As expected, the obtained correspondences are clearly not good, as they tend to focus on only one side of the target face.
Nevertheless, we can apply Procrustes analysis based on these correspondences and
retrieve a rigid transformation, which brings us closer to the target.

```scala
val rigidTrans =  LandmarkRegistration.rigid3DLandmarkRegistration(correspondences, center = Point3D(0, 0, 0))
val transformed = mesh1.transform(rigidTrans) 
val alignedMeshView = ui.show(group1, transformed, "aligned?")
alignedMeshView.color = java.awt.Color.GREEN
```

**Well, no surprise here.** Given the poor quality of the candidate correspondences, we obtained a poor rigid alignment.
This said, when considering where we started from, that is the original position, we did get closer to the target.

The second important idea of the ICP algorithm comes is now to **iterate** this steps in the hope that it will converge.
Let's try it out:

```scala
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


```scala
def ICPRigidAlign(movingMesh: TriangleMesh[_3D], ptIds : Seq[PointId], numberOfIterations : Int) : TriangleMesh[_3D] = {
  if (numberOfIterations == 0) movingMesh
  else {
    val correspondences = attributeCorrespondences(movingMesh, ptIds)
    val transform = LandmarkRegistration.rigid3DLandmarkRegistration(correspondences, center = Point(0, 0, 0))
    val transformed = movingMesh.transform(transform) 
        
    ICPRigidAlign(transformed, ptIds, numberOfIterations - 1)
  }
}
```

Let's now run it with 150 iterations:

```scala

val rigidfit = ICPRigidAlign(mesh1, ptIds, 150)
val rigidFitView = ui.show(group1, rigidfit, "ICP_rigid_fit")
rigidFitView.color = java.awt.Color.YELLOW
```

As you can see here, the quality of the candidate correspondences did indeed result in a proper
**automatic** rigid alignment of Paola to the target. One should not forget, however, that the ICP method is
very sensitive to the initial position, and might easily get stuck in a local minimum.

