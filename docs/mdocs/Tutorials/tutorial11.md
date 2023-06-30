---
id: tutorial11
title: Model fitting with Iterative Closest Points
---

To enhance your understanding of this tutorial, we recommend the following resources from our [online course](shapemodelling.cs.unibas.ch/ssm-course/):

##### Related resources

The following resources from our [online course](https://www.futurelearn.com/courses/statistical-shape-modelling) may provide
some helpful context for this tutorial:

- Model-fitting and correspondence [(Video)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250371)
- Model-fitting and the registration problem [(Article)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250372)

To run the code from this tutorial, download the following Scala file:
- [Tutorial11.scala](./Tutorial11.scala)

```scala mdoc:invisible
//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92-RC1"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92-RC1,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"
```


##### Preparation

As in the previous tutorials, we start by importing some commonly used objects and initializing the system.

```scala mdoc:silent
import scalismo.geometry.*
import scalismo.common.*
import scalismo.mesh.*
import scalismo.statisticalmodel.MultivariateNormalDistribution
import scalismo.numerics.UniformMeshSampler3D
import scalismo.io.{MeshIO, StatisticalModelIO, LandmarkIO}

import scalismo.ui.api.*

import breeze.linalg.{DenseMatrix, DenseVector}

import java.io.File

import scalismo.utils.Random.FixedSeed.randBasis
```

```scala mdoc:invisible emptyLines:2
@main
def tutorial11(): Unit = 
```

```scala mdoc:silent
  scalismo.initialize()

  val ui = ScalismoUI()
```


### Problem setup

Let's start by loading and visualizing a target mesh and a statistical shape model.

```scala mdoc:silent emptyLines:2
  val targetMesh = MeshIO.readMesh(File("datasets/target.ply")).get
  val model = StatisticalModelIO.readStatisticalTriangleMeshModel3D(File("datasets/bfm.h5")).get

  val targetGroup = ui.createGroup("targetGroup")
  val targetMeshView = ui.show(targetGroup, targetMesh, "targetMesh")

  val modelGroup = ui.createGroup("modelGroup")
  val modelView = ui.show(modelGroup, model, "model")
```

As you can observe, the current model instance does not resemble the target face. The goal of shape model fitting is to find an instance of our model that closely matches the target face, thus establishing correspondences between model and target points.

The Iterative Closest Points (ICP) algorithm can assist us here. Its main steps include finding candidate correspondences, determining the optimal transform through Procrustes analysis, transforming the moving mesh, and iterating these steps until alignment or reaching the iteration limit.

For model fitting, we'll use non-rigid ICP, which performs the exact same steps but instead of using Procrustes Analysis, it finds a non-rigid transformation using Gaussian process regression.

Let's begin by selecting uniformly distributed points on the surface:

```scala mdoc:silent emptyLines:2
  val sampler = UniformMeshSampler3D(model.reference, numberOfPoints = 5000)
  val points : Seq[Point[_3D]] = sampler.samplePoints()
```

We can now identify the closest point on the target for each point of interest:
```scala mdoc:silent
  val ptIds = points.map(point => model.reference.pointSet.findClosestPoint(point).id)
```

As in the previous tutorial, we write the method ```attributeCorrespondences```, which finds for each
point of interest the closest point on the target.

```scala mdoc:silent emptyLines:2
  def attributeCorrespondences(movingMesh: TriangleMesh[_3D], ptIds : Seq[PointId]) : Seq[(PointId, Point[_3D])] = 
    ptIds.map( (id : PointId) =>
      val pt = movingMesh.pointSet.point(id)
      val closestPointOnMesh2 = targetMesh.pointSet.findClosestPoint(pt).point
      (id, closestPointOnMesh2)
    )  
```

Next, we use these correspondences to compute Gaussian process regression:

```scala mdoc:silent emptyLines:2

  val correspondences = attributeCorrespondences(model.mean, ptIds)

  val littleNoise = MultivariateNormalDistribution(DenseVector.zeros[Double](3), DenseMatrix.eye[Double](3))

  def fitModel(correspondences: Seq[(PointId, Point[_3D])]) : TriangleMesh[_3D] = 
    val regressionData = correspondences.map(correspondence =>
      (correspondence._1, correspondence._2, littleNoise)
    )
    val posterior = model.posterior(regressionData.toIndexedSeq)
    posterior.mean
  

  val fit = fitModel(correspondences)
  val resultGroup = ui.createGroup("results")
  val fitResultView = ui.show(resultGroup, fit, "fit")
```

While this one fitting iteration does not bring the points where we would like them to have, we are already
a step closer. As in the Rigid ICP case, we now iterate the procedure.

```scala mdoc emptyLines:2
  def nonrigidICP(movingMesh: TriangleMesh[_3D], ptIds : Seq[PointId], numberOfIterations : Int) : TriangleMesh[_3D] = 
    if (numberOfIterations == 0) then
      movingMesh 
    else 
      val correspondences = attributeCorrespondences(movingMesh, ptIds)
      val transformed = fitModel(correspondences)

      nonrigidICP(transformed, ptIds, numberOfIterations - 1)    
```

Repeating the fitting steps iteratively for 20 times results in a good fit of our model
```scala mdoc:silent
  val finalFit = nonrigidICP( model.mean, ptIds, 20)

  ui.show(resultGroup, finalFit, "final fit")
```

```scala mdoc:invisible
  ui.close()
```
