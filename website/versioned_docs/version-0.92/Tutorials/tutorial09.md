---
id: tutorial09
title: Shape completion using GP regression
---

In this tutorial we will show how GP regression can be used to predict missing parts of a shape.

##### Related resources

To enhance your understanding of this tutorial, we recommend the following resources from our [online course](https://shapemodelling.cs.unibas.ch/ssm-course/):

- Covariance functions [(Video)](https://shapemodelling.cs.unibas.ch/ssm-course/week4/step4-2)
- Enlarging the flexibility of statistical shape models [(Article)](https://shapemodelling.cs.unibas.ch/ssm-course/week4/step4-7)
- The regression problem [(Article)](https://shapemodelling.cs.unibas.ch/ssm-course/week5/step5-2)
- Gaussian process regression [(Video)](https://shapemodelling.cs.unibas.ch/ssm-course/week5/step5-3)
- Posterior models for different kernels [(Article)](https://shapemodelling.cs.unibas.ch/ssm-course/week5/step5-4)


To run the code from this tutorial, download the following Scala file:
- [Tutorial09.scala](./Tutorial09.scala)


##### Preparation

As in the previous tutorials, we start by importing some commonly used objects and initializing the system.

```scala
import scalismo.geometry.*
import scalismo.common.*
import scalismo.common.interpolation.TriangleMeshInterpolator3D
import scalismo.mesh.*
import scalismo.io.{StatisticalModelIO, MeshIO, LandmarkIO}
import scalismo.statisticalmodel.*
import scalismo.numerics.UniformMeshSampler3D
import scalismo.kernels.*
import breeze.linalg.{DenseMatrix, DenseVector}

import scalismo.ui.api.*

import java.io.File

import scalismo.utils.Random.FixedSeed.randBasis
```


```scala
  scalismo.initialize()

  val ui = ScalismoUI()
```

We also load a dataset that we want to reconstruct. In this case, it's a face without nose:

```scala
  val noseless = MeshIO.readMesh(File("datasets/noseless.ply")).get

  val targetGroup = ui.createGroup("target")
  ui.show(targetGroup, noseless,"noseless")
```

Finally, we also load the face model.
```scala
  val smallModel = StatisticalModelIO.readStatisticalTriangleMeshModel3D(File("datasets/model.h5")).get
```

## Enlarging the flexibility of a shape model

The model, which we just loaded, was built from only a small dataset. Therefore, the chances that it manages to
reconstruct the missing nose properly are rather slim.

To augment the shape variability of the model, we introduce some additional smooth shape deformations, modeled by a GP with a symmetric Gaussian kernel. This approach should be familiar from previous tutorials.

```scala
  val scalarValuedKernel = GaussianKernel3D(70, scaleFactor = 3)

  case class XmirroredKernel(kernel: PDKernel[_3D]) extends PDKernel[_3D]:
      override def domain = EuclideanSpace3D
      override def k(x: Point[_3D], y: Point[_3D]) = kernel(Point(x(0) * -1f, x(1), x(2)), y)  

  def symmetrizeKernel(kernel: PDKernel[_3D]): MatrixValuedPDKernel[_3D] = 
    val xmirrored = XmirroredKernel(kernel)
    val k1 = DiagonalKernel(kernel, 3)
    val k2 = DiagonalKernel(xmirrored * -1f, xmirrored, xmirrored)
    k1 + k2  

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

The mew model should now possess greater flexibility while still preserving the typical face-specific deformations.

It's worth noting that this step is primarily motivated by the fact that we only have 10 face examples available to construct the model. However, even when sufficient data is available, it might still be beneficial to slightly increase the flexibility of a model before attempting to reconstruct missing parts. This affords the model some extra flexibility to account for bias in the data and explain minor shape variations that were not prominent in the dataset.

Equipped with our new model, we will perform the reconstruction in three steps:

1. We'll fit the face model to the given partial face using Gaussian process regression.
2. We'll restrict the model to the nose part by marginalizing and then select a suitable nose shape.
3. We'll choose a suitable nose from the model.

As previously discussed, to perform GP regression, we need observations of the deformation vectors at certain points. In the next code, we'll load and visualize some landmarks:

```scala
  val referenceLandmarks = LandmarkIO.readLandmarksJson3D(File("datasets/modelLandmarks.json")).get
  val referencePoints : Seq[Point[_3D]] = referenceLandmarks.map(lm => lm.point)
  val referenceLandmarkViews = referenceLandmarks.map(lm => ui.show(modelGroup, lm, s"lm-${lm.id}"))


  val noselessLandmarks = LandmarkIO.readLandmarksJson3D(File("datasets/noselessLandmarks.json")).get
  val noselessPoints : Seq[Point[_3D]] = noselessLandmarks.map(lm => lm.point)
  val noselessLandmarkViews = noselessLandmarks.map(lm => ui.show(targetGroup, lm, s"lm-${lm.id}"))
```

These correspondences define how each selected point of the
model should be deformed to its corresponding point on the target mesh.
In other words, we **observed** a few deformation vectors at
the selected model points. We use these deformation vectors and build
a deformation field:

```scala
  val domain = UnstructuredPointsDomain3D(referencePoints.toIndexedSeq)
  val deformations = (0 until referencePoints.size).map(i => noselessPoints(i) - referencePoints(i) )
  val defField = DiscreteField3D(domain, deformations)
  ui.show(modelGroup, defField, "partial_Field")
```

We can now perform GP regression and retrieve the rest of the deformation field fitting our observations:

```scala
  val littleNoise = MultivariateNormalDistribution(DenseVector.zeros[Double](3), DenseMatrix.eye[Double](3) * 0.5)

  val regressionData = for ((refPoint, noselessPoint) <- referencePoints zip noselessPoints) yield
    val refPointId = model.reference.pointSet.findClosestPoint(refPoint).id
    (refPointId, noselessPoint, littleNoise)  

  val posterior = model.posterior(regressionData.toIndexedSeq)

  val posteriorGroup = ui.createGroup("posterior-model")
  ui.show(posteriorGroup, posterior, "posterior")
```
