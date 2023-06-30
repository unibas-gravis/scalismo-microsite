//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"
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

object Tutorial13 extends App:

  scalismo.initialize()

  val ui = ScalismoUI()
  val asm = ActiveShapeModelIO.readActiveShapeModel(File("datasets/femur-asm.h5")).get
  val modelGroup = ui.createGroup("modelGroup")
  val modelView = ui.show(modelGroup, asm.statisticalModel, "shapeModel")
  val profiles = asm.profiles
  profiles.map(profile =>
    val pointId = profile.pointId
    val distribution = profile.distribution
  )
  val image = ImageIO
    .read3DScalarImage[Short](new java.io.File("datasets/femur-image.nii"))
    .get
    .map(_.toFloat)
  val targetGroup = ui.createGroup("target")

  val imageView = ui.show(targetGroup, image, "image")
  val preprocessedImage = asm.preprocessor(image)
  val point1 = image.domain.origin + EuclideanVector3D(10.0, 10.0, 10.0)
  val profile = asm.profiles.head
  val feature1: DenseVector[Double] =
    asm.featureExtractor(preprocessedImage, point1, asm.statisticalModel.mean, profile.pointId).get
  val point2 = image.domain.origin + EuclideanVector3D(20.0, 10.0, 10.0)
  val featureVec1 =
    asm.featureExtractor(preprocessedImage, point1, asm.statisticalModel.mean, profile.pointId).get
  val featureVec2 =
    asm.featureExtractor(preprocessedImage, point2, asm.statisticalModel.mean, profile.pointId).get

  val probabilityPoint1 = profile.distribution.logpdf(featureVec1)
  val probabilityPoint2 = profile.distribution.logpdf(featureVec2)
  val searchSampler = NormalDirectionSearchPointSampler(numberOfPoints = 100, searchDistance = 3)
  val config = FittingConfiguration(
    featureDistanceThreshold = 3,
    pointDistanceThreshold = 5,
    modelCoefficientBounds = 3
  )
  val rotationCenter = asm.statisticalModel.reference.pointSet.centerOfMass

// we start with the identity transform
  val translationTransformation = Translation3D(EuclideanVector3D(0, 0, 0))
  val rotationTransformation = Rotation3D(0, 0, 0, rotationCenter)
  val initialRigidTransformation =
    TranslationAfterRotation3D(translationTransformation, rotationTransformation)
  val initialModelCoefficients = DenseVector.zeros[Double](asm.statisticalModel.rank)
  val initialTransformation =
    ModelTransformations(initialModelCoefficients, initialRigidTransformation)
  val numberOfIterations = 20
  val asmIterator =
    asm.fitIterator(image, searchSampler, numberOfIterations, config, initialTransformation)
  val asmIteratorWithVisualization = asmIterator.map(it =>
    it match
      case scala.util.Success(iterationResult) =>
        modelView.shapeModelTransformationView.poseTransformationView.transformation =
          iterationResult.transformations.rigidTransform
        modelView.shapeModelTransformationView.shapeTransformationView.coefficients =
          iterationResult.transformations.coefficients
      case scala.util.Failure(error) => System.out.println(error.getMessage)
    it
  )
  val result = asmIteratorWithVisualization.toIndexedSeq.last
  val finalMesh = result.get.mesh
  def likelihoodForMesh(
      asm: ActiveShapeModel,
      mesh: TriangleMesh[_3D],
      preprocessedImage: PreprocessedImage
  ): Double =

    val ids = asm.profiles.ids

    val likelihoods = for (id <- ids) yield
      val profile = asm.profiles(id)
      val profilePointOnMesh = mesh.pointSet.point(profile.pointId)
      // if the feature point is outside the image, we assign it a very low likelihood
      val featureAtPoint = asm
        .featureExtractor(preprocessedImage, profilePointOnMesh, mesh, profile.pointId)
        .getOrElse(-1e10)
      profile.distribution.logpdf(featureAtPoint)

    likelihoods.sum
  val sampleMesh1 = asm.statisticalModel.sample()
  val sampleMesh2 = asm.statisticalModel.sample()
  println("Likelihood for mesh 1 = " + likelihoodForMesh(asm, sampleMesh1, preprocessedImage))
  println("Likelihood for mesh 2 = " + likelihoodForMesh(asm, sampleMesh2, preprocessedImage))
  ui.close()
