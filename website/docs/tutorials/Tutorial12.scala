//> using scala "2.13"
//> using lib "ch.unibas.cs.gravis::scalismo-ui:0.91-RC3"
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

object Tutorial12 extends App {

  scalismo.initialize()
  implicit val rng: scalismo.utils.Random = scalismo.utils.Random(42)

  val ui = ScalismoUI()

  val referenceMesh = MeshIO.readMesh(new java.io.File("datasets/quickstart/facemesh.ply")).get

  val modelGroup = ui.createGroup("model")
  val refMeshView = ui.show(modelGroup, referenceMesh, "referenceMesh")
  refMeshView.color = java.awt.Color.RED

  val zeroMean = Field(EuclideanSpace3D, (_: Point[_3D]) => EuclideanVector.zeros[_3D])
  val kernel = DiagonalKernel3D(GaussianKernel3D(sigma = 70) * 50.0, outputDim = 3)
  val gp = GaussianProcess(zeroMean, kernel)

  val interpolator = TriangleMeshInterpolator3D[EuclideanVector[_3D]]()
  val lowRankGP = LowRankGaussianProcess.approximateGPCholesky(
    referenceMesh,
    gp,
    relativeTolerance = 0.05,
    interpolator = interpolator
  )

  val gpView = ui.addTransformation(modelGroup, lowRankGP, "gp")

  val targetGroup = ui.createGroup("target")
  val targetMesh = MeshIO.readMesh(new java.io.File("datasets/quickstart/face-2.ply")).get
  val targetMeshView = ui.show(targetGroup, targetMesh, "targetMesh")

  val transformationSpace = GaussianProcessTransformationSpace(lowRankGP)

  val fixedImage = referenceMesh.operations.toDistanceImage
  val movingImage = targetMesh.operations.toDistanceImage
  val sampler = FixedPointsUniformMeshSampler3D(referenceMesh, numberOfPoints = 1000)
  val metric = MeanSquaresMetric(fixedImage, movingImage, transformationSpace, sampler)

  val optimizer = LBFGSOptimizer(maxNumberOfIterations = 100)

  val regularizer = L2Regularizer(transformationSpace)

  val registration = Registration(metric, regularizer, regularizationWeight = 1e-5, optimizer)

  val initialCoefficients = DenseVector.zeros[Double](lowRankGP.rank)
  val registrationIterator = registration.iterator(initialCoefficients)

  val visualizingRegistrationIterator =
    for ((it, itnum) <- registrationIterator.zipWithIndex) yield {
      println(s"object value in iteration $itnum is ${it.value}")
      gpView.coefficients = it.parameters
      it
    }

  val registrationResult = visualizingRegistrationIterator.toSeq.last

  val registrationTransformation =
    transformationSpace.transformationForParameters(registrationResult.parameters)
  val fittedMesh = referenceMesh.transform(registrationTransformation)

  val targetMeshOperations = targetMesh.operations
  val projection = (pt: Point[_3D]) => {
    targetMeshOperations.closestPointOnSurface(pt).point
  }

  val finalTransformation = registrationTransformation.andThen(projection)

  val projectedMesh = referenceMesh.transform(finalTransformation)
  val resultGroup = ui.createGroup("result")
  val projectionView = ui.show(resultGroup, projectedMesh, "projection")

  case class RegistrationParameters(
      regularizationWeight: Double,
      numberOfIterations: Int,
      numberOfSampledPoints: Int
  )

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
    val visualizingRegistrationIterator =
      for ((it, itnum) <- registrationIterator.zipWithIndex) yield {
        println(s"object value in iteration $itnum is ${it.value}")
        it
      }
    val registrationResult = visualizingRegistrationIterator.toSeq.last
    registrationResult.parameters
  }

  val registrationParameters = Seq(
    RegistrationParameters(
      regularizationWeight = 1e-1,
      numberOfIterations = 20,
      numberOfSampledPoints = 1000
    ),
    RegistrationParameters(
      regularizationWeight = 1e-2,
      numberOfIterations = 30,
      numberOfSampledPoints = 1000
    ),
    RegistrationParameters(
      regularizationWeight = 1e-4,
      numberOfIterations = 40,
      numberOfSampledPoints = 2000
    ),
    RegistrationParameters(
      regularizationWeight = 1e-6,
      numberOfIterations = 50,
      numberOfSampledPoints = 4000
    )
  )

  val finalCoefficients =
    registrationParameters.foldLeft(initialCoefficients)((modelCoefficients, regParameters) =>
      doRegistration(lowRankGP, referenceMesh, targetMesh, regParameters, modelCoefficients)
    )

  ui.close()
}
