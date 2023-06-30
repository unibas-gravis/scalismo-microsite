//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"

import scalismo.io.StatisticalModelIO
import scalismo.io.LandmarkIO
import scalismo.ui.api.ScalismoUI
import scalismo.geometry.*
import scalismo.common.PointId
import scalismo.common.interpolation.TriangleMeshInterpolator3D
import scalismo.common.UnstructuredPointsDomain
import scalismo.common.interpolation.NearestNeighborInterpolator3D
import scalismo.common.UnstructuredPointsDomain1D
import scalismo.common.UnstructuredPointsDomain3D
import scalismo.statisticalmodel.PointDistributionModel
import scalismo.statisticalmodel.MultivariateNormalDistribution

import scalismo.mesh.TriangleMesh
import scalismo.transformations.*

import scalismo.sampling.*
import scalismo.sampling.proposals.*
import scalismo.sampling.parameters.*
import scalismo.sampling.evaluators.*
import scalismo.sampling.loggers.MHSampleLogger
import scalismo.sampling.algorithms.MetropolisHastings

import breeze.linalg.DenseVector
import breeze.linalg.DenseMatrix

import java.io.File

import breeze.stats.distributions.Rand.FixedSeed.randBasis
import scalismo.utils.Random.FixedSeed.randBasis

object Tutorial15 extends App:

  scalismo.initialize()

  val ui = ScalismoUI()

  val model = StatisticalModelIO.readStatisticalTriangleMeshModel3D(File("datasets/bfm.h5")).get

  val modelGroup = ui.createGroup("model")
  val modelView = ui.show(modelGroup, model, "model")
  modelView.referenceView.opacity = 0.5

  val modelLms =
    LandmarkIO.readLandmarksJson[_3D](new java.io.File("datasets/modelLM_mcmc.json")).get
  val modelLmViews = ui.show(modelGroup, modelLms, "modelLandmarks")
  modelLmViews.foreach(lmView => lmView.color = java.awt.Color.BLUE)

  val targetGroup = ui.createGroup("target")

  val targetLms =
    LandmarkIO.readLandmarksJson3D(new java.io.File("datasets/targetLM_mcmc.json")).get
  val targetLmViews = ui.show(targetGroup, targetLms, "targetLandmarks")
  modelLmViews.foreach(lmView => lmView.color = java.awt.Color.RED)

  val modelPoints = modelLms.map(l => l.point)
  val targetPoints = targetLms.map(l => l.point)
  val correspondences = modelPoints.zip(targetPoints)

  def computeCenterOfMass(mesh: TriangleMesh[_3D]): Point[_3D] =
    val normFactor = 1.0 / mesh.pointSet.numberOfPoints
    mesh.pointSet.points.foldLeft(Point(0, 0, 0))((sum, point) => sum + point.toVector * normFactor)

  val rotationCenter = computeCenterOfMass(model.mean)

  case class Parameters(poseAndShapeParameters: PoseAndShapeParameters, noiseStddev: Double)
  object Parameters:

    implicit object parameterConversion
        extends ParameterConversion[
          Tuple2[PoseAndShapeParameters, Double],
          Parameters
        ]:
      def from(p: Parameters): Tuple2[PoseAndShapeParameters, Double] =
        (p.poseAndShapeParameters, p.noiseStddev)
      def to(t: Tuple2[PoseAndShapeParameters, Double]): Parameters =
        Parameters(t._1, t._2)

    def poseTransformationForParameters(
        translationParameters: TranslationParameters,
        rotationParameters: RotationParameters,
        centerOfRotation: Point[_3D]
    ): TranslationAfterRotation[_3D] =
      TranslationAfterRotation3D(
        Translation3D(translationParameters.translationVector),
        Rotation3D(rotationParameters.angles, centerOfRotation)
      )

  case class PriorEvaluator(model: PointDistributionModel[_3D, TriangleMesh])
      extends MHDistributionEvaluator[Parameters]:

    val translationPrior = breeze.stats.distributions.Gaussian(0.0, 5.0)
    val rotationPrior = breeze.stats.distributions.Gaussian(0, 0.1)
    val noisePrior = breeze.stats.distributions.LogNormal(0, 0.25)

    override def logValue(sample: MHSample[Parameters]): Double =
      val poseAndShapeParameters = sample.parameters.poseAndShapeParameters
      val translationParameters = poseAndShapeParameters.translationParameters
      val rotationParameters = poseAndShapeParameters.rotationParameters

      model.gp.logpdf(poseAndShapeParameters.shapeParameters.coefficients) +
        translationPrior.logPdf(translationParameters.translationVector.x) +
        translationPrior.logPdf(translationParameters.translationVector.y) +
        translationPrior.logPdf(translationParameters.translationVector.z) +
        rotationPrior.logPdf(rotationParameters.angles._1) +
        rotationPrior.logPdf(rotationParameters.angles._2) +
        rotationPrior.logPdf(rotationParameters.angles._3) +
        noisePrior.logPdf(sample.parameters.noiseStddev)

  case class CorrespondenceEvaluator(
      model: PointDistributionModel[_3D, TriangleMesh],
      rotationCenter: Point[_3D],
      correspondences: Seq[(Point[_3D], Point[_3D])]
  ) extends MHDistributionEvaluator[Parameters]:

    // we extract the points and build a model from only the points
    val (refPoints, targetPoints) = correspondences.unzip

    val newDomain = UnstructuredPointsDomain3D(refPoints.toIndexedSeq)
    val modelOnLandmarkPoints = model.newReference(newDomain, NearestNeighborInterpolator3D())

    override def logValue(sample: MHSample[Parameters]): Double =

      val poseTransformation = Parameters.poseTransformationForParameters(
        sample.parameters.poseAndShapeParameters.translationParameters,
        sample.parameters.poseAndShapeParameters.rotationParameters,
        rotationCenter
      )

      val modelCoefficients = sample.parameters.poseAndShapeParameters.shapeParameters.coefficients
      val currentModelInstance =
        modelOnLandmarkPoints.instance(modelCoefficients).transform(poseTransformation)

      val lmUncertainty = MultivariateNormalDistribution(
        DenseVector.zeros[Double](3),
        DenseMatrix.eye[Double](3) * sample.parameters.noiseStddev
      )

      val likelihoods =
        for (
          (pointOnInstance, targetPoint) <- currentModelInstance.pointSet.points.zip(targetPoints)
        ) yield
          val observedDeformation = targetPoint - pointOnInstance
          lmUncertainty.logpdf(observedDeformation.toBreezeVector)

      val loglikelihood = likelihoods.sum
      loglikelihood

  val likelihoodEvaluator = CorrespondenceEvaluator(model, rotationCenter, correspondences)
  val priorEvaluator = PriorEvaluator(model).cached

  val posteriorEvaluator = ProductEvaluator(priorEvaluator, likelihoodEvaluator)

  val rotationProposal = MHProductProposal(
    GaussianRandomWalkProposal(0.01, "rx").forType[Double],
    GaussianRandomWalkProposal(0.01, "ry").forType[Double],
    GaussianRandomWalkProposal(0.01, "rz").forType[Double]
  ).forType[RotationParameters]

  val translationProposal = MHProductProposal(
    GaussianRandomWalkProposal(1.0, "tx").forType[Double],
    GaussianRandomWalkProposal(1.0, "ty").forType[Double],
    GaussianRandomWalkProposal(1.0, "tz").forType[Double]
  ).forType[TranslationParameters]

  val shapeProposalLeading =
    GaussianRandomWalkProposal(0.01, "shape-0-5")
      .partial(0 until 5)
      .forType[ShapeParameters]
  val shapeProposalRemaining =
    GaussianRandomWalkProposal(0.01, "shape-6-")
      .partial(6 until model.rank)
      .forType[ShapeParameters]

  val identTranslationProposal =
    MHIdentityProposal.forType[TranslationParameters]
  val identRotationProposal = MHIdentityProposal.forType[RotationParameters]
  val identShapeProposal = MHIdentityProposal.forType[ShapeParameters]

  val poseAndShapeTranslationOnlyProposal =
    MHProductProposal(
      translationProposal,
      identRotationProposal,
      identShapeProposal
    )
      .forType[PoseAndShapeParameters]
      .relabel("translation-only")
  val poseAndShapeRotationOnlyProposal =
    MHProductProposal(
      identTranslationProposal,
      rotationProposal,
      identShapeProposal
    )
      .forType[PoseAndShapeParameters]
      .relabel("rotation-only")
  val poseAndShapeLeadingShapeOnlyProposal =
    MHProductProposal(
      identTranslationProposal,
      identRotationProposal,
      shapeProposalLeading
    )
      .forType[PoseAndShapeParameters]
      .relabel("shape-leading-only")

  val poseAndShapeRemainingShapeOnlyProposal =
    MHProductProposal(
      identTranslationProposal,
      identRotationProposal,
      shapeProposalRemaining
    )
      .forType[PoseAndShapeParameters]
      .relabel("shape-trailing-only")

  val mixturePoseAndShapeProposal = MHMixtureProposal(
    (0.2, poseAndShapeTranslationOnlyProposal),
    (0.2, poseAndShapeRotationOnlyProposal),
    (0.3, poseAndShapeLeadingShapeOnlyProposal),
    (0.3, poseAndShapeRemainingShapeOnlyProposal)
  )
  val noiseProposal = GaussianRandomWalkProposal(0.1, "noise").forType[Double]
  val identNoiseProposal = MHIdentityProposal.forType[Double]
  val identPoseAndShapeProposal =
    MHIdentityProposal.forType[PoseAndShapeParameters]

  val noiseOnlyProposal =
    MHProductProposal(identPoseAndShapeProposal, noiseProposal)
      .forType[Parameters]
  val poseAndShapeOnlyProposal =
    MHProductProposal(mixturePoseAndShapeProposal, identNoiseProposal)
      .forType[Parameters]
  val fullproposal = MHMixtureProposal(
    (0.9, poseAndShapeOnlyProposal),
    (0.1, noiseOnlyProposal)
  )

  val logger = MHSampleLogger[Parameters]()
  val chain = MetropolisHastings(fullproposal, posteriorEvaluator)

  val initialParameters = Parameters(
    PoseAndShapeParameters(
      TranslationParameters(EuclideanVector3D(0, 0, 0)),
      RotationParameters((0.0, 0.0, 0.0)),
      ShapeParameters(DenseVector.zeros[Double](model.rank))
    ),
    noiseStddev = 1.0
  )

  val mhIterator = chain.iterator(MHSample(initialParameters, "inital"), logger)

  val samplingIterator = for ((sample, iteration) <- mhIterator.zipWithIndex) yield
    println("iteration " + iteration)
    if (iteration % 500 == 0) then
      val poseAndShapeParameters = sample.parameters.poseAndShapeParameters
      val poseTransformation = Parameters.poseTransformationForParameters(
        poseAndShapeParameters.translationParameters,
        poseAndShapeParameters.rotationParameters,
        rotationCenter
      )
      modelView.shapeModelTransformationView.shapeTransformationView.coefficients =
        poseAndShapeParameters.shapeParameters.coefficients
      modelView.shapeModelTransformationView.poseTransformationView.transformation =
        poseTransformation

    sample

  val samples = samplingIterator.drop(1000).take(10000).toIndexedSeq
  println(logger.samples.acceptanceRatios)

  val bestSample = samples.maxBy(posteriorEvaluator.logValue)

  val bestPoseAndShapeParameters = bestSample.parameters.poseAndShapeParameters
  val bestPoseTransformation = Parameters.poseTransformationForParameters(
    bestPoseAndShapeParameters.translationParameters,
    bestPoseAndShapeParameters.rotationParameters,
    rotationCenter
  )

  val bestFit = model
    .instance(bestPoseAndShapeParameters.shapeParameters.coefficients)
    .transform(bestPoseTransformation)
  val resultGroup = ui.createGroup("result")

  ui.show(resultGroup, bestFit, "best fit")
  ui.close()
