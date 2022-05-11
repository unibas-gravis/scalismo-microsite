---
id: tutorial09
title: Shape completion using GP regression
---

In this tutorial we will show how GP regression can be used to predict missing parts of a shape.

##### Related resources

To run the code from this tutorial, download the following Scala file:
- [Tutorial09.scala](./Tutorial09.scala)

```scala mdoc:invisible
//> using scala "2.13"
//> using lib "ch.unibas.cs.gravis::scalismo-ui:0.91-RC4"
```

##### Preparation

As in the previous tutorials, we start by importing some commonly used objects and initializing the system.

```scala mdoc:silent
import scalismo.geometry._
import scalismo.common._
import scalismo.common.interpolation.TriangleMeshInterpolator3D
import scalismo.mesh._
import scalismo.io.{StatisticalModelIO, MeshIO, LandmarkIO}
import scalismo.statisticalmodel._
import scalismo.numerics.UniformMeshSampler3D
import scalismo.kernels._
import breeze.linalg.{DenseMatrix, DenseVector}

import scalismo.ui.api._
```

```scala mdoc:invisible emptyLines:2
object Tutorial9 extends App {
```

```scala mdoc:silent emptyLines:2
scalismo.initialize()
implicit val rng: scalismo.utils.Random = scalismo.utils.Random(42)

val ui = ScalismoUI()
```

We also load a dataset that we want to reconstruct. In this case, it is a face without nose:

```scala mdoc:silent emptyLines:2
val noseless = MeshIO.readMesh(new java.io.File("datasets/noseless.ply")).get

val targetGroup = ui.createGroup("target")
ui.show(targetGroup, noseless,"noseless")
```

Finally, we also load the face model.
```scala mdoc:silent emptyLines:2
val smallModel = StatisticalModelIO.readStatisticalTriangleMeshModel3D(new java.io.File("datasets/model.h5")).get
```

## Enlarging the flexibility of a shape model

The model, which we just loaded, was built from only a small dataset. Therefore, the chances that it manages to
reconstruct the missing nose properly are rather slim.

To increase the shape variability of the model, we add smooth some additional smooth shape deformations,
 modelled by a GP with symmetric Gaussian kernel. The code should be familiar from the previous tutorials.

```scala mdoc:silent emptyLines:2
val scalarValuedKernel = GaussianKernel3D(70) * 10.0

case class XmirroredKernel(kernel: PDKernel[_3D]) extends PDKernel[_3D] {
    override def domain = EuclideanSpace3D
    override def k(x: Point[_3D], y: Point[_3D]) = kernel(Point(x(0) * -1f, x(1), x(2)), y)
}

def symmetrizeKernel(kernel: PDKernel[_3D]): MatrixValuedPDKernel[_3D] = {
  val xmirrored = XmirroredKernel(kernel)
  val k1 = DiagonalKernel(kernel, 3)
  val k2 = DiagonalKernel(xmirrored * -1f, xmirrored, xmirrored)
  k1 + k2
}

val gp = GaussianProcess[_3D, EuclideanVector[_3D]](symmetrizeKernel(scalarValuedKernel))

val lowrankGP = LowRankGaussianProcess.approximateGPCholesky(
      smallModel.reference,
      gp,
      relativeTolerance = 0.5e-1,
      interpolator = TriangleMeshInterpolator3D[EuclideanVector[_3D]]()
)
val model = PointDistributionModel.augmentModel(smallModel, lowrankGP)

val modelGroup = ui.createGroup("face model")
val ssmView = ui.show(modelGroup, model, "model")
```

The new model should now contain much more flexibility, while still preserving the typical face-specific deformations.

*Note: This step here is mainly motivated by the fact that we only have 10 face examples available to build the model. However,
even if sufficient data is available, it might still be a good idea to slighly enlarge the flexibility of a model
before attempting a reconstruction of missing parts. It gives the model some extra slack to account for
bias in the data and explain minor shape variations, which have not been prominent in the dataset*.

Equipped with our new model, we will perform the reconstruction in three steps:

1. We fit the face model to the given partial face using Gaussian process regression.
2. We restrict the model to the nose part by marginalizing and select a suitable nose shape.
3. We choose a suitable nose from the model

As we saw previously, to perform GP regression we need observations of the deformation vectors at some points.
We will discussed in [Tutorial 10](./tutorial10) how such observations can be obtained fully automatically.
Here, we have done this already in a separate step and saved 200 corresponding points as landmarks, which we will now load and visualize:

```scala mdoc:silent emptyLines:2
val referenceLandmarks = LandmarkIO.readLandmarksJson3D(new java.io.File("datasets/modelLandmarks.json")).get
val referencePoints : Seq[Point[_3D]] = referenceLandmarks.map(lm => lm.point)
val referenceLandmarkViews = referenceLandmarks.map(lm => ui.show(modelGroup, lm, s"lm-${lm.id}"))


val noselessLandmarks = LandmarkIO.readLandmarksJson3D(new java.io.File("datasets/noselessLandmarks.json")).get
val noselessPoints : Seq[Point[_3D]] = noselessLandmarks.map(lm => lm.point)
val noselessLandmarkViews = noselessLandmarks.map(lm => ui.show(targetGroup, lm, s"lm-${lm.id}"))
```

These correspondences define how each selected point of the
model should be deformed to its corresponding point on the target mesh.
In other words, we **observed** a few deformation vectors at
the selected model points. We use these deformation vectors and build
a deformation field:

```scala mdoc:silent emptyLines:2
val domain = UnstructuredPointsDomain3D(referencePoints.toIndexedSeq)
val deformations = (0 until referencePoints.size).map(i => noselessPoints(i) - referencePoints(i) )
val defField = DiscreteField3D(domain, deformations)
ui.show(modelGroup, defField, "partial_Field")
```

We can now perform GP regression and retrieve the rest of the deformations fitting our observations:

```scala mdoc:silent emptyLines:2
val littleNoise = MultivariateNormalDistribution(DenseVector.zeros[Double](3), DenseMatrix.eye[Double](3) * 0.5)

val regressionData = for ((refPoint, noselessPoint) <- referencePoints zip noselessPoints) yield {
  val refPointId = model.reference.pointSet.findClosestPoint(refPoint).id
  (refPointId, noselessPoint, littleNoise)
}

val posterior = model.posterior(regressionData.toIndexedSeq)

val posteriorGroup = ui.createGroup("posterior-model")
ui.show(posteriorGroup, posterior, "posterior")
```

With this posterior model, we get a normal distribution of faces satisfying our observations by having the selected characteristic points at the indicated positions.

```scala mdoc:invisible
ui.close()
```

```scala mdoc:invisible
}
```