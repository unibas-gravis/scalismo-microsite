---
id: tutorial12
title: Parametric, non-rigid registration
---

We have seen how non-rigid ICP can be used to establish correspondences.
In this tutorial we discuss a different approach to model-fitting and non-rigid registration.
We are formulating the registration problem as an optimization problem, which we optimize
using gradient-based optimization.

This registration is more general than ICP, in the sense that it can not only
be used for surface-to-surface registration, but also for image-to-image-registration.
In this tutorial we show the complete work-flow involved in a typical registration task,
from building the Gaussian process model to performing the actual optimization.

##### Related resources

To enhance your understanding of this tutorial, we recommend the following resources from our [online course](https://shapemodelling.cs.unibas.ch/ssm-course/):

- Model-fitting and correspondence [(Video)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250371)

To run the code from this tutorial, download the following Scala file:
- [Tutorial12.scala](./Tutorial12.scala)



##### Preparation

As in the previous tutorials, we start by importing some commonly used objects and initializing the system.

```scala
import scalismo.geometry.*
import scalismo.common.*
import scalismo.common.interpolation.*
import scalismo.mesh.*
import scalismo.registration.*
import scalismo.io.MeshIO
import scalismo.numerics.*
import scalismo.kernels.*
import scalismo.statisticalmodel.*
import breeze.linalg.DenseVector

import scalismo.ui.api.*

import breeze.linalg.{DenseVector}

import java.io.File

import scalismo.utils.Random.FixedSeed.randBasis
```



```scala
  scalismo.initialize()

  val ui = ScalismoUI()
```

## Loading and visualizing a mesh

First, we'll load and visualize the reference mesh that will later serve as the domain for our Gaussian Process model.

```scala
  val referenceMesh = MeshIO.readMesh(File("datasets/quickstart/facemesh.ply")).get

  val modelGroup = ui.createGroup("model")
  val refMeshView = ui.show(modelGroup, referenceMesh, "referenceMesh")
  refMeshView.color = java.awt.Color.RED
```

## Building a Gaussian process shape model

We assume that our reference surface represents an approximately average face.
This justifies the use of a zero-mean Gaussian process. As a covariance function we use a Gaussian kernel and choose to treat the x,y,z component
of the vector field to be uncorrelated (indicated by the use of the ```DiagonalKernel```).

```scala
  val zeroMean = Field(EuclideanSpace3D, (_: Point[_3D]) => EuclideanVector.zeros[_3D])
  val kernel = DiagonalKernel3D(GaussianKernel3D(sigma = 70, scaleFactor = 7), outputDim = 3)
  val gp = GaussianProcess(zeroMean, kernel)
```

To achieve a parametric representation of the Gaussian process, we execute a low-rank approximation:

```scala
  val interpolator = TriangleMeshInterpolator3D[EuclideanVector[_3D]]()
  val lowRankGP = LowRankGaussianProcess.approximateGPCholesky(
      referenceMesh,
      gp,
      relativeTolerance = 0.05,
      interpolator = interpolator)
```

For visualization purposes, we can add this Gaussian process to the model group as a transformation:
```scala
  val gpView = ui.addTransformation(modelGroup, lowRankGP, "gp")
```

This allows us to apply the transformations represented by this GP to all geometric objects in the group. 
We can adjust the parameters in the UI to visualize different transformations, much like what we did with Point Distribution Models in previous tutorials.

Note: The procedure of adding the reference mesh to the scene, followed by a Gaussian process transformation, is what's occurring internally when we visualize Point Distribution Models.

Finally, we can draw random samples to evaluate the effectiveness of our Gaussian process parameters. If the deformations aren't satisfactory, we can adjust the parameters until the results meet our requirements.

## Registration

In the next step we perform the registration to a target mesh.
We start by loading the target mesh and displaying it.

```scala
  val targetGroup = ui.createGroup("target")
  val targetMesh = MeshIO.readMesh(new java.io.File("datasets/quickstart/face-2.ply")).get
  val targetMeshView = ui.show(targetGroup, targetMesh, "targetMesh")
```

To visualize a registration, it's recommended to change the perspective in the graphical user interface to **orthogonal slices**.

In defining a registration, we need to establish four elements:

1. A transformation space to model the potential transformations of the reference surface.
2. A metric to measure the distance between the model (the deformed reference mesh) and the target surface.
3. A regularizer to penalize unlikely transformations.
4. An optimizer.

We typically use a Gaussian process to model possible transformations for non-rigid registration. The Gaussian process we defined earlier is used to set up the transformation space.

```scala
  val transformationSpace = GaussianProcessTransformationSpace(lowRankGP)
```

We use a simple mean squares metric for measuring distances. The metric needs to know about possible transformations (as modeled by the transformation space) and a sampler. The sampler determines where the metric is evaluated. In our case, we choose uniformly sampled points on the reference mesh.

```scala
  val fixedImage = referenceMesh.operations.toDistanceImage
  val movingImage = targetMesh.operations.toDistanceImage
  val sampler = FixedPointsUniformMeshSampler3D(referenceMesh, numberOfPoints = 1000)
  val metric = MeanSquaresMetric(fixedImage, movingImage, transformationSpace, sampler)
```

As an optimizer, we choose an LBFGS Optimizer

```scala
  val optimizer = LBFGSOptimizer(maxNumberOfIterations = 100)
```

And for regularization, we choose to penalize the L2 norm using the L2Regularizer:

```scala
  val regularizer = L2Regularizer(transformationSpace)
```
We're now ready to create Scalismo's registration object.

```scala
  val registration = Registration(metric, regularizer, regularizationWeight = 1e-5, optimizer)
```

Registration is an iterative process. We interact with the registration using an iterator, providing a starting position for the iteration.

```scala
  val initialCoefficients = DenseVector.zeros[Double](lowRankGP.rank)
  val registrationIterator = registration.iterator(initialCoefficients)
```

Before executing the registration, we modify the iterator to print the current objective value in each iteration and update the visualization. This allows us to visually inspect the progress of the registration procedure.

```scala
  val visualizingRegistrationIterator = for ((it, itnum) <- registrationIterator.zipWithIndex) yield 
    println(s"object value in iteration $itnum is ${it.value}")
    gpView.coefficients = it.parameters
    it

```
The actual registration is carried out when we "consume" the iterator. The resulting sequence holds all the intermediate states of the registration, and we usually only care about the final one:

```scala
  val registrationResult = visualizingRegistrationIterator.toSeq.last
```
In the graphical user interface, you should see how the face mesh slowly adapts to the shape of the target mesh. You can obtain the final mesh representation by getting the transform corresponding to the parameters and warping the reference mesh with this transform:

```scala
  val registrationTransformation = transformationSpace.transformationForParameters(registrationResult.parameters)
  val fittedMesh = referenceMesh.transform(registrationTransformation)
```

### Working with the registration result

The fitted mesh is a surface that approximates the target surface. If an exact representation of the target mesh is needed, we can achieve this by defining a projection function, which projects each point onto its closest point on the target.

```scala
  val targetMeshOperations = targetMesh.operations
  val projection = (pt: Point[_3D]) => 
      targetMeshOperations.closestPointOnSurface(pt).point
```

Composing the result of the registration with this projection, will give us a mapping that identifies for each point of the reference mesh the corresponding point of the target mesh.

```scala
  val finalTransformation = registrationTransformation.andThen(projection)
```

To check this last point, we warp the reference mesh with the finalTransform and visualize it. Note that the projected target now coincides with the target mesh..

```scala
  val projectedMesh = referenceMesh.transform(finalTransformation)
  val resultGroup = ui.createGroup("result")
  val projectionView = ui.show(resultGroup, projectedMesh, "projection")
```

### Improving registrations for more complex shapes.

This registration procedure outlined above works reasonably well for simple cases. In complex cases, in particular if you have large
shape variations, you may find it difficult to find a suitable regularization weight. When you choose the regularization weight
large, the procedure will result in a nice and smooth mesh, but fails to closely fit the surface. If you choose it small, it may
result in folds and bad correspondences. In such cases it has proven extremely useful to simply iterate the registration procedure,
with decreasing regularization weights. In the following we illustrate this procedure. We start by defining a case class, which
collects all relevant parameters:

```scala
  case class RegistrationParameters(regularizationWeight: Double, numberOfIterations: Int, numberOfSampledPoints: Int)
```

We put all the registration code into a function, which takes (among others) the registration parameters as an argument.

```scala
  def doRegistration(
      lowRankGP: LowRankGaussianProcess[_3D, EuclideanVector[_3D]],
      referenceMesh: TriangleMesh[_3D],
      targetmesh: TriangleMesh[_3D],
      registrationParameters: RegistrationParameters,
      initialCoefficients: DenseVector[Double]
    ): DenseVector[Double] = 
      val transformationSpace = GaussianProcessTransformationSpace(lowRankGP)
      val fixedImage = referenceMesh.operations.toDistanceImage
      val movingImage = targetMesh.operations.toDistanceImage
      val sampler = FixedPointsUniformMeshSampler3D(
        referenceMesh,
        registrationParameters.numberOfSampledPoints
      )
      val metric = MeanSquaresMetric(
        fixedImage,
        movingImage,
        transformationSpace,
        sampler
      )
      val optimizer = LBFGSOptimizer(registrationParameters.numberOfIterations)
      val regularizer = L2Regularizer(transformationSpace)
      val registration = Registration(
        metric,
        regularizer,
        registrationParameters.regularizationWeight,
        optimizer
      )
      val registrationIterator = registration.iterator(initialCoefficients)
      val visualizingRegistrationIterator = for ((it, itnum) <- registrationIterator.zipWithIndex) yield {
        println(s"object value in iteration $itnum is ${it.value}")
        it
      }
      val registrationResult = visualizingRegistrationIterator.toSeq.last
      registrationResult.parameters
  
```

Finally, we define the parameters and run the registration. Note that for large regularization weights, we sample fewer points on the surface to save some computation time.
This is justified as, a strongly regularized model will not be able to adapt to fine details and hence it is not necessary to have a very accurate sampling of the surface.

```scala
  val registrationParameters = Seq(
      RegistrationParameters(regularizationWeight = 1e-1, numberOfIterations = 20, numberOfSampledPoints = 1000),
      RegistrationParameters(regularizationWeight = 1e-2, numberOfIterations = 30, numberOfSampledPoints = 1000),
      RegistrationParameters(regularizationWeight = 1e-4, numberOfIterations = 40, numberOfSampledPoints = 2000),
      RegistrationParameters(regularizationWeight = 1e-6, numberOfIterations = 50, numberOfSampledPoints = 4000)
    )


  val finalCoefficients = registrationParameters.foldLeft(initialCoefficients)((modelCoefficients, regParameters) =>
      doRegistration(lowRankGP, referenceMesh, targetMesh, regParameters, modelCoefficients)
    )

```

From this point we use the procedure described above to work with the registration result.