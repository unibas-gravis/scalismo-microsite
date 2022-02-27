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

The following resources from our [online course](https://www.futurelearn.com/courses/statistical-shape-modelling) may provide
some helpful context for this tutorial:

- Model-fitting and correspondence [(Video)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250371)

To run the code from this tutorial, download the following Scala file:
- [Tutorial12.scala](./Tutorial12.scala)

```scala mdoc:invisible
//> using scala "2.13"
//> using lib "ch.unibas.cs.gravis::scalismo-ui:0.90.0"
```


##### Preparation

As in the previous tutorials, we start by importing some commonly used objects and initializing the system.

```scala mdoc:silent
import scalismo.geometry._
import scalismo.common._
import scalismo.common.interpolation._
import scalismo.mesh._
import scalismo.registration._
import scalismo.io.MeshIO
import scalismo.numerics._
import scalismo.kernels._
import scalismo.statisticalmodel._
import breeze.linalg.DenseVector

import scalismo.ui.api._

import breeze.linalg.{DenseVector}
```


```scala mdoc:invisible emptyLines:2
object Tutorial12 extends App {
```

```scala mdoc:silent emptyLines:2
scalismo.initialize()
implicit val rng = scalismo.utils.Random(42)

val ui = ScalismoUI()
```

## Loading and visualizing a mesh

We start by loading and visualizing the reference mesh, which we will later use as the
domain for our Gaussian Process model.

```scala mdoc:silent emptyLines:2
val referenceMesh = MeshIO.readMesh(new java.io.File("datasets/quickstart/facemesh.ply")).get


val modelGroup = ui.createGroup("model")
val refMeshView = ui.show(modelGroup, referenceMesh, "referenceMesh")
refMeshView.color = java.awt.Color.RED
```

## Building a Gaussian process shape model

We assume that our reference surface represents an approximately average face.
This justifies the use of a zero-mean Gaussian process. As a covariance function we use a Gaussian kernel and choose to treat the x,y,z component
of the vector field to be uncorrelated (indicated by the use of the ```DiagonalKernel```).

```scala mdoc:silent emptyLines:2
val zeroMean = Field(EuclideanSpace3D, (_: Point[_3D]) => EuclideanVector.zeros[_3D])
val kernel = DiagonalKernel3D(GaussianKernel3D(sigma = 70) * 50.0, outputDim = 3)
val gp = GaussianProcess(zeroMean, kernel)
```

We then perform a low-rank approximation, to get a parametric representation of the
Gaussian process:

```scala mdoc:silent emptyLines:2
val interpolator = TriangleMeshInterpolator3D[EuclideanVector[_3D]]()
val lowRankGP = LowRankGaussianProcess.approximateGPCholesky(
    referenceMesh,
    gp,
    relativeTolerance = 0.05,
    interpolator = interpolator)
```

To visualize the effect of this Gaussian process, we add it to the
model group as a transformation.
```scala mdoc:silent emptyLines:2
val gpView = ui.addTransformation(modelGroup, lowRankGP, "gp")
```

This has the effect, that the transformations represented by this GP,
are applied to all the geometric objects, which are present in the group.
In this case, it is the mean of the Gaussian process, which is applied to
the reference mesh we loaded previously. By changing the parameters in the
ui, we can visualize different transformations, as we did previously
for statistical shape models.

*Note: Adding the reference mesh to the scene, followed by a Gaussian process transformation
is indeed what happend internally, we visualized Statistical Shape Models in the
previous tutorials*

Having visualized the Gaussian process, we can now draw random samples,
to assess whether out choice of parameters of the Gaussian process leads to
reasonable deformations. If not, we adjust the parameters until we are happy
with the deformations that are modelled.

## Registration

In the next step we perform the registration to a target mesh.
We start by loading the target mesh and displaying it.

```scala mdoc:silent emptyLines:2
val targetGroup = ui.createGroup("target")
val targetMesh = MeshIO.readMesh(new java.io.File("datasets/quickstart/face-2.ply")).get
val targetMeshView = ui.show(targetGroup, targetMesh, "targetMesh")
```

*To visualize a registration, it is best to change the perspective in the graphical user interface to "orthogonal slices". You can find this functionality in the "View -> Perspective" menu.*

To define a registration, we need to define four things:
1. a `transformation space` that models the possible transformations of the reference surface (or the ambient space)
2. a `metric` to measure the distance between the model (the deformed reference mesh) an the target surface.
3. a `regularizer`, which penalizes unlikely transformations.
4. an `optimizer`.

For non-rigid registration we usually model the possible transformations using a Gaussian process. We use the Gaussian process that
we have defined above to define the transformation space.

```scala mdoc:silent emptyLines:2
val transformationSpace = GaussianProcessTransformationSpace(lowRankGP)
```

As a metric, we use a simple mean squares metric. Currently, all metrics that are available in scalismo are implemented as
image to image metrics. These can, however, easily be used for surface registration by representing the surface as  a distance image.
In addition to the images, the metric also needs to know the possible transformations (as modelled by the transformation space) and
a sampler. The sampler determines the points where the metric is evaluated. In our case we choose uniformely sampled points on the
reference mesh.

```scala mdoc:silent emptyLines:2
val fixedImage = referenceMesh.operations.toDistanceImage
val movingImage = targetMesh.operations.toDistanceImage
val sampler = FixedPointsUniformMeshSampler3D(referenceMesh, numberOfPoints = 1000)
val metric = MeanSquaresMetric(fixedImage, movingImage, transformationSpace, sampler)
```

As an optimizer, we choose an LBFGS Optimizer

```scala mdoc:silent emptyLines:2
val optimizer = LBFGSOptimizer(maxNumberOfIterations = 100)
```

and for regularization we choose to penalize the L2 norm using the `L2Regularizer`:

```scala mdoc:silent emptyLines:2
val regularizer = L2Regularizer(transformationSpace)
```

We are now ready to define Scalismo's registration object.

```scala mdoc:silent emptyLines:2
val registration = Registration(metric, regularizer, regularizationWeight = 1e-5, optimizer)
```

Registration is an iterative process. Consequently, we work with the registration using an iterator. We obtain an iterator by
calling the `iterator` method, where we also provide a starting position for the iteration (which is in this case the zero vector):

```scala mdoc:silent emptyLines:2
val initialCoefficients = DenseVector.zeros[Double](lowRankGP.rank)
val registrationIterator = registration.iterator(initialCoefficients)
```

Before running the registration, we change the iterator such that it prints in each iteration to current objective value,
and updates the visualization. This lets us visually inspect the progress of the registration procedure.

```scala mdoc:silent emptyLines:2
val visualizingRegistrationIterator = for ((it, itnum) <- registrationIterator.zipWithIndex) yield {
  println(s"object value in iteration $itnum is ${it.value}")
  gpView.coefficients = it.parameters
  it
}
```

Note that the above code does not yet run the registration. It simply returns a new iterator, which augments
the original iteration with visualization. The actual registration is executed once we "consume" the iterator.
This can, for example be achieved by converting it to a sequence. The resulting sequence holds all the intermediate
states of the registration. We are usually only interested in the last one:

```scala mdoc:silent emptyLines:2
val registrationResult = visualizingRegistrationIterator.toSeq.last
```

You should see in the graphical user interface, how the face mesh slowly adapts to the shape of the target mesh.

The final mesh representation can be obtained by obtaining the transform corresponding to the parameters and to
warp the reference mesh with this tranform:

```scala mdoc:silent emptyLines:2
val registrationTransformation = transformationSpace.transformationForParameters(registrationResult.parameters)
val fittedMesh = referenceMesh.transform(registrationTransformation)
```

### Working with the registration result

The fittedMesh that we obtained above is a surface that approximates the target surface.  It corresponds to the best representation of the target in the model. For most tasks, this approximation is sufficient.
However, sometimes, we need an exact representation of the target mesh. This can be achieved by defining a projection function, which projects each point onto its closest point on the target.

```scala mdoc:silent emptyLines:2
val targetMeshOperations = targetMesh.operations
val projection = (pt: Point[_3D]) => {
    targetMeshOperations.closestPointOnSurface(pt).point
}
```

Composing the result of the registration with this projection, will give us a mapping that identifies for each point of the reference mesh the corresponding point of the target mesh.

```scala mdoc:silent emptyLines:2
val finalTransformation = registrationTransformation.andThen(projection)
```

To check this last point, we warp the reference mesh with the finalTransform and visualize it. Note that the projected target now coincides with the target mesh..

```scala mdoc:silent emptyLines:2
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

```scala mdoc:silent emptyLines:2
case class RegistrationParameters(regularizationWeight: Double, numberOfIterations: Int, numberOfSampledPoints: Int)
```

We put all the registration code into a function, which takes (among others) the registration parameters as an argument.

```scala mdoc:silent emptyLines:2
def doRegistration(
    lowRankGP: LowRankGaussianProcess[_3D, EuclideanVector[_3D]],
    referenceMesh: TriangleMesh[_3D],
    targetmesh: TriangleMesh[_3D],
    registrationParameters: RegistrationParameters,
    initialCoefficients: DenseVector[Double]
  ): DenseVector[Double] = {
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
}
```

Finally, we define the parameters and run the registration. Note that for large regularization weights, we sample fewer points on the surface to save some computation time.
This is justified as, a strongly regularized model will not be able to adapt to fine details and hence it is not necessary to have a very accurate sampling of the surface.

```scala mdoc:silent emptyLines:2
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
```scala mdoc:invisible
ui.close()
```

```scala mdoc:invisible
}
```