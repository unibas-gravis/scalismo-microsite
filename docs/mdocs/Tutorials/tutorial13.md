---
id: tutorial13
title: Active Shape Model Fitting
---

In this tutorial we show how we can perform active shape model fitting in Scalismo.

##### Related resources

To enhance your understanding of this tutorial, we recommend the following resources from our [online course](shapemodelling.cs.unibas.ch/ssm-course/):

- Fitting models to images [(Video)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250379)

To run the code from this tutorial, download the following Scala file:
- [Tutorial13.scala](./Tutorial13.scala)

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
import scalismo.transformations.*
import scalismo.registration.*
import scalismo.mesh.TriangleMesh
import scalismo.statisticalmodel.asm.*
import scalismo.io.{ActiveShapeModelIO, ImageIO}

import scalismo.ui.api.*
import breeze.linalg.{DenseVector}

import java.io.File

import scalismo.utils.Random.FixedSeed.randBasis
```

```scala mdoc:invisible emptyLines:2
@main
def tutorial12(): Unit = 
```

```scala mdoc:silent emptyLines:2
    scalismo.initialize()

    val ui = ScalismoUI()
```


## Active Shape models in Scalismo

Scalismo provides comprehensive support for Active Shape models. This capability allows us to learn active shape models from a collection of images and their corresponding contours, save these models, and apply them to fit images. In this tutorial, we focus on model fitting, assuming the model has already been built.


The Active Shape Model can be loaded as follows:

```scala mdoc:silent empytLines:2
    val asm = ActiveShapeModelIO.readActiveShapeModel(File("datasets/femur-asm.h5")).get
```

An Active Shape Model instance in Scalismo is a combination of a statistical shape model and an intensity model. The shape model part can be retrieved using the statisticalModel method. Let's visualize this model:

```scala mdoc:silent empytLines:2
    val modelGroup = ui.createGroup("modelGroup")
    val modelView = ui.show(modelGroup, asm.statisticalModel, "shapeModel")
```
The other component of the model, the intensity model, comprises a set of profiles linked to specific vertices of the shape model, designated by the pointId. Each profile has a defined probability distribution, representing the expected intensity variation for that profile.

The following code demonstrates how to access this information:

```scala mdoc:silent empytLines:2
    val profiles = asm.profiles
    profiles.map(profile => 
        val pointId = profile.pointId
        val distribution = profile.distribution
    )
```

#### Identifying Likely Model Correspondences in an Image
The main use of the profile distribution is to locate points in the image that likely correspond to the given profile points in the model. 

Let $p_i$​ denote the i-th profile in the model. We can utilize this information to evaluate the likelihood that a point $x_j$ corresponds to the profile point $p_i$, based on the image intensity patterns $$\rho(x_1), \ldots, \rho(x_n)$$ at these points in an image.

To illustrate, we first load an image:

```scala mdoc:silent empytLines:2
    val image = ImageIO.read3DScalarImage[Short](new java.io.File("datasets/femur-image.nii")).get.map(_.toFloat)
    val targetGroup = ui.createGroup("target")

    val imageView = ui.show(targetGroup, image, "image")
```

Scalismo's ASM implementation can work not only with raw intensities, but also with preprocessed images that have undergone transformations
 such as smoothing or gradient transformations. This preprocessed image can be obtained using the preprocessor method of the asm object:

```scala mdoc:silent empytLines:2
    val preprocessedImage = asm.preprocessor(image)
```

We can now extract features at a given point:
```scala mdoc:silent empytLines:2
    val point1 = image.domain.origin + EuclideanVector3D(10.0, 10.0, 10.0)
    val profile = asm.profiles.head
    val feature1 : DenseVector[Double] = asm.featureExtractor(preprocessedImage, point1, asm.statisticalModel.mean, profile.pointId).get
```
Here we've passed the preprocessed image to the extractor, together with a point in the image where we wish to evaluate the feature vector, a mesh instance, and a mesh point id. The mesh instance and point id are necessary since the feature extractor might opt to extract the feature based on mesh data, such as the normal direction of a line at this point.

We can also assess the likelihood of each point corresponding to a given profile point:

```scala mdoc:silent empytLines:2
    val point2 = image.domain.origin + EuclideanVector3D(20.0, 10.0, 10.0)
    val featureVec1 = asm.featureExtractor(preprocessedImage, point1, asm.statisticalModel.mean, profile.pointId).get
    val featureVec2 = asm.featureExtractor(preprocessedImage, point2, asm.statisticalModel.mean, profile.pointId).get

    val probabilityPoint1 = profile.distribution.logpdf(featureVec1)
    val probabilityPoint2 = profile.distribution.logpdf(featureVec2)
```

Based on this information, we can decide, which point is more likely to correspond to the model point. This idea forms the
basis of the original m Active Shape Model Fitting algorithm.


### The original Active Shape Model Fitting

Scalismo features an implementation of Active Shape Model fitting algorithm, as proposed by [Cootes and Taylor](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.141.3089&rep=rep1&type=pdf).

To configure the fitting process, we need to set up a search method, which searches for a given model point, corresponding  points
in the image. From these points, the most likely point is select and used as as the corresponding point for one iteration of
the algorithm. Once these "candidate correspondences" have been established, the rest of the algorithm works in exactly the same as
the ICP algorithm that we described in the previous tutorials.

One search strategy that is already implemented in Scalismo is to search along
the normal direction of a model point. This behavior is provided by the ```NormalDirectionSearchPointSampler```
```scala mdoc:silent empytLines:2
    val searchSampler = NormalDirectionSearchPointSampler(numberOfPoints = 100, searchDistance = 3)
```

In addition to the search strategy, we can specify some additional configuration parameters to control the fitting process:
```scala mdoc:silent empytLines:2
    val config = FittingConfiguration(featureDistanceThreshold = 3, pointDistanceThreshold = 5, modelCoefficientBounds = 3)
```
The first parameter determines how far away (as measured by the mahalanobis distance) an intensity feature can be, such that it is still
chosen as corresponding. The ```pointDistanceThreshold``` does the same for the distance of the points; I.e. in this  case points which are
more than 5 standard deviations aways are not chosen as corresponding points. The last parameters determines how
large coefficients of the model can become in the fitting process. Whenever a model parameter is larger than this threshold,
it will be set back to this maximal value. This introduces a regularization into the fitting, which prevents the shape
from becoming too unlikely.

The ASM fitting algorithm optimizes both the pose (as defined by a rigid transformation) and the shape.
In order to allow it to optimize the rotation, it is important that we choose a rotation center, which is approximately
the center of mass of the model:

```scala mdoc:silent empytLines:2
    val rotationCenter = asm.statisticalModel.reference.pointSet.centerOfMass
```

To initialize the fitting process, we also need to set up the initial transformation:
```scala mdoc:silent

// we start with the identity transform
    val translationTransformation = Translation3D(EuclideanVector3D(0, 0, 0))
    val rotationTransformation = Rotation3D(0, 0, 0, rotationCenter)
    val initialRigidTransformation = TranslationAfterRotation3D(translationTransformation, rotationTransformation)
    val initialModelCoefficients = DenseVector.zeros[Double](asm.statisticalModel.rank)
    val initialTransformation = ModelTransformations(initialModelCoefficients, initialRigidTransformation)
```

To start the fitting, we obtain an iterator, which we subsequently use to drive the iteration.
```scala mdoc:silent empytLines:2
    val numberOfIterations = 20
    val asmIterator = asm.fitIterator(image, searchSampler, numberOfIterations, config, initialTransformation)
```

Especially in a debugging phase, we visualize the result in every iteration is useful. The following code shows,
how to obtain a new iterator, which updates the pose transformation and model coefficients in the ```ui```
in every iteration:
```scala mdoc:silent empytLines:2
    val asmIteratorWithVisualization = asmIterator.map(it => 
        it match 
        case scala.util.Success(iterationResult) => 
            modelView.shapeModelTransformationView.poseTransformationView.transformation = iterationResult.transformations.rigidTransform
            modelView.shapeModelTransformationView.shapeTransformationView.coefficients = iterationResult.transformations.coefficients        
        case scala.util.Failure(error) => System.out.println(error.getMessage)    
        it
    )
```

To run the fitting, and get the result, we finally consume the iterator:
```scala mdoc:silent empytLines:2
    val result = asmIteratorWithVisualization.toIndexedSeq.last
    val finalMesh = result.get.mesh
```

## Evaluating the likelihood of a model instance under the image

In the preceding section, we utilized the intensity distribution to pinpoint the best image point corresponding 
to a specific model point. However, there are instances when we're also want to determine how accurately a model fits an image. 
To calculate this, we can enhance the previous method to compute the likelihood for all profile points in an Active Shape Model.

Given the model instance, we can identify the position of each profile point in the current instance, evaluate its likelihood, and then calculate the joint likelihood for all profiles. Assuming independence, the joint probability is simply the multiplication of the probabilities at each individual profile point. To avoid extreme values, we employ log probabilities (turning the product into a sum).

```scala mdoc:silent empytLines:2
    def likelihoodForMesh(asm : ActiveShapeModel, mesh : TriangleMesh[_3D], preprocessedImage: PreprocessedImage) : Double = 

        val ids = asm.profiles.ids

        val likelihoods = for (id <- ids) yield 
            val profile = asm.profiles(id)
            val profilePointOnMesh = mesh.pointSet.point(profile.pointId)
            // if the feature point is outside the image, we assign it a very low likelihood
            val featureAtPoint = asm.featureExtractor(preprocessedImage, profilePointOnMesh, mesh, profile.pointId).getOrElse(-1e10)
            profile.distribution.logpdf(featureAtPoint)
        
        likelihoods.sum    
```

This method allows us to compute for each mesh, represented by the model, how likely it is to correspond
to the given image.
```scala mdoc:silent empytLines:2
    val sampleMesh1 = asm.statisticalModel.sample()
    val sampleMesh2 = asm.statisticalModel.sample()
    println("Likelihood for mesh 1 = " + likelihoodForMesh(asm, sampleMesh1, preprocessedImage))
    println("Likelihood for mesh 2 = " + likelihoodForMesh(asm, sampleMesh2, preprocessedImage))
```

This information is all that is need to write probabilistic fitting methods methods using Markov Chain Monte Carlo
methods, which will be discussed in a later tutorial.

```scala mdoc:invisible empytLines:2
    ui.close()
```