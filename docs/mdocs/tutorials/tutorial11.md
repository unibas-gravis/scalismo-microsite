---
layout: docs
title: Rigid alignment
section: "tutorials"
---

{% include head.html %}

# Model fitting with Iterative Closest Points

The goal in this tutorial is to non-rigidly fit a shape model to a target surface using Iterative Closest Points (ICP) 
in order to establish correspondences among two surfaces. 

##### Related resources

The following resources from our [online course](https://www.futurelearn.com/courses/statistical-shape-modelling) may provide
some helpful context for this tutorial:

- Model-fitting and correspondence [(Video)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250371)
- Model-fitting and the registration problem [(Article)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250372)

##### Preparation

As in the previous tutorials, we start by importing some commonly used objects and initializing the system. 

```scala mdoc:silent
import scalismo.geometry._
import scalismo.common._
import scalismo.ui.api._
import scalismo.mesh._
import scalismo.statisticalmodel.MultivariateNormalDistribution
import scalismo.numerics.UniformMeshSampler3D
import scalismo.io.{MeshIO, StatisticalModelIO, LandmarkIO}
import breeze.linalg.{DenseMatrix, DenseVector}

scalismo.initialize()
implicit val rng = scalismo.utils.Random(42)

val ui = ScalismoUI()
```


### Problem setup

Let's load and visualize a target mesh; I.e. a mesh, which we want to fit with our model, as well as 
a statistical shape model.

```scala mdoc:silent
val targetMesh = MeshIO.readMesh(new java.io.File("datasets/target.stl")).get
val model = StatisticalModelIO.readStatisticalMeshModel(new java.io.File("datasets/bfm.h5")).get

val targetGroup = ui.createGroup("targetGroup")
val targetMeshView = ui.show(targetGroup, targetMesh, "targetMesh")

val modelGroup = ui.createGroup("modelGroup")
val modelView = ui.show(modelGroup, model, "model")
```

As you can see in the 3D scene, the instance of the model taht we are currently displaying (the mean), 
does not resemble the target face. The goal in shape model fitting is to find an 
instance of our shape model, which resembles at best the given target face.
As we will see, a good fit directly leads to a way of establishing correspondences between the points of our model and the points 
of the target shape. 

### Iterative Closest Points (ICP) and GP regression

In a previous tutorial, we introduced rigid ICP to find the best rigid transformation between two meshes. 
We recall that the main steps of the algorithms are as follows:

1. Find **candidate** correspondences between the mesh to be aligned and the target one, 
   by attributing the closest point on the target mesh as a candidate.
2. Solve for the best rigid transform between the moving mesh and the target mesh using Procrustes analysis.
3. Transform the moving mesh using the retrieved transform 
4. Loop to step 1 if the result is not aligned with the target (or if we didn't reach the limit number of iterations)

The non-rigid ICP algorithm, which we can use for model fitting, will perform exactly the same steps. 
However, instead of finding a rigid transformation in step 2, it finds a non-rigid one, using 
Gaussian process regression.


We start by first selecting the points for which we want to find the correspondences. We choose uniformly distributed
 points on the surface, which we can obtain as follows:

```scala mdoc:silent
val sampler = UniformMeshSampler3D(model.referenceMesh, numberOfPoints = 5000)
val points : Seq[Point[_3D]] = sampler.sample.map(pointWithProbability => pointWithProbability._1) // we only want the points
``` 

Instead of working directly with the points, it is easier to work with the point ids of the sampled points: 
```scala mdoc:silent
val ptIds = points.map(point => model.referenceMesh.pointSet.findClosestPoint(point).id)
```

As in the previous tutorial, we write the method ```attributeCorrespondences```, which finds for each 
point of interest the closest point on the target.

```scala mdoc:silent
def attributeCorrespondences(movingMesh: TriangleMesh[_3D], ptIds : Seq[PointId]) : Seq[(PointId, Point[_3D])] = {
  ptIds.map{ id : PointId => 
    val pt = movingMesh.pointSet.point(id)
    val closestPointOnMesh2 = targetMesh.pointSet.findClosestPoint(pt).point
    (id, closestPointOnMesh2)
  } 
}
```

We can now use the correspondences we found to compute a Gaussian process regression. 

```scala mdoc:silent

val correspondences = attributeCorrespondences(model.mean, ptIds)

val littleNoise = MultivariateNormalDistribution(DenseVector.zeros[Double](3), DenseMatrix.eye[Double](3))

def fitModel(correspondences: Seq[(PointId, Point[_3D])]) : TriangleMesh[_3D] = { 
  val regressionData = correspondences.map(correspondence => 
    (correspondence._1, correspondence._2, littleNoise)
  )
  val posterior = model.posterior(regressionData.toIndexedSeq)
  posterior.mean
}

val fit = fitModel(correspondences)
val resultGroup = ui.createGroup("results")
val fitResultView = ui.show(resultGroup, fit, "fit")
```

While this one fitting iteration does not bring the points where we would like them to have, we are already 
a step closer. As in the Rigid ICP case, we now iterate the procedure.

```scala mdoc
def nonrigidICP(movingMesh: TriangleMesh[_3D], ptIds : Seq[PointId], numberOfIterations : Int) : TriangleMesh[_3D] = {
  if (numberOfIterations == 0) movingMesh
  else {
    val correspondences = attributeCorrespondences(movingMesh, ptIds)     
    val transformed = fitModel(correspondences)
        
    nonrigidICP(transformed, ptIds, numberOfIterations - 1)
  }
}
```

Repeating the fitting steps iteratively for 20 times results in a good fit of our model
```scala mdoc:silent
val finalFit = nonrigidICP( model.mean, ptIds, 20)

ui.show(resultGroup, finalFit, "final fit")
```

```scala mdoc:invisible
ui.close()
```