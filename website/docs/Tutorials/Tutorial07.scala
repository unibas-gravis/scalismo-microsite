//> using scala "3.2"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.91.2"
import scalismo.geometry._
import scalismo.common._
import scalismo.common.interpolation.TriangleMeshInterpolator3D
import scalismo.mesh._
import scalismo.io.{StatisticalModelIO, MeshIO}
import scalismo.statisticalmodel._
import scalismo.numerics.UniformMeshSampler3D
import scalismo.kernels._

import scalismo.ui.api._

import breeze.linalg.{DenseMatrix, DenseVector}

object Tutorial7 extends App {
  scalismo.initialize()
  implicit val rng: scalismo.utils.Random = scalismo.utils.Random(42)

  val ui = ScalismoUI()

  val referenceMesh = MeshIO.readMesh(new java.io.File("datasets/lowResPaola.ply")).get

  val modelGroup = ui.createGroup("gp-model")
  val referenceView = ui.show(modelGroup, referenceMesh, "reference")

  val zeroMean = Field(EuclideanSpace3D, (pt: Point[_3D]) => EuclideanVector3D(0, 0, 0))

  case class MatrixValuedGaussianKernel3D(sigma2: Double) extends MatrixValuedPDKernel[_3D]() {

    override def outputDim: Int = 3
    override def domain: Domain[_3D] = EuclideanSpace3D;

    override def k(x: Point[_3D], y: Point[_3D]): DenseMatrix[Double] = {
      DenseMatrix.eye[Double](outputDim) * Math.exp(-(x - y).norm2 / sigma2)
    }
  }

  val scalarValuedGaussianKernel: PDKernel[_3D] = GaussianKernel3D(sigma = 100.0)
  val matrixValuedGaussianKernel = DiagonalKernel3D(
    scalarValuedGaussianKernel,
    scalarValuedGaussianKernel,
    scalarValuedGaussianKernel
  )

  DiagonalKernel3D(scalarValuedGaussianKernel, 3)

  val gp = GaussianProcess3D[EuclideanVector[_3D]](zeroMean, matrixValuedGaussianKernel)

  val sampleGroup = ui.createGroup("samples")
  val sample = gp.sampleAtPoints(referenceMesh)
  ui.show(sampleGroup, sample, "gaussianKernelGP_sample")

  val interpolatedSample = sample.interpolate(TriangleMeshInterpolator3D())
  val deformedMesh = referenceMesh.transform((p: Point[_3D]) => p + interpolatedSample(p))
  ui.show(sampleGroup, deformedMesh, "deformed mesh")

  val lowRankGP = LowRankGaussianProcess.approximateGPCholesky(
    referenceMesh,
    gp,
    relativeTolerance = 0.01,
    interpolator = TriangleMeshInterpolator3D[EuclideanVector[_3D]]()
  )

  val defField: Field[_3D, EuclideanVector[_3D]] = lowRankGP.sample()

  referenceMesh.transform((p: Point[_3D]) => p + defField(p))

  val pdm = PointDistributionModel3D(referenceMesh, lowRankGP)
  val pdmView = ui.show(modelGroup, pdm, "group")

  val pcaModel = StatisticalModelIO
    .readStatisticalTriangleMeshModel3D(new java.io.File("datasets/lowresModel.h5"))
    .get
  val gpSSM = pcaModel.gp.interpolate(TriangleMeshInterpolator3D())

  val covSSM: MatrixValuedPDKernel[_3D] = gpSSM.cov

  val augmentedCov = covSSM + DiagonalKernel(GaussianKernel[_3D](100.0), 3)

  val augmentedGP = GaussianProcess(gpSSM.mean, augmentedCov)

  val lowRankAugmentedGP = LowRankGaussianProcess.approximateGPCholesky(
    referenceMesh,
    augmentedGP,
    relativeTolerance = 0.01,
    interpolator = TriangleMeshInterpolator3D[EuclideanVector[_3D]]()
  )
  val augmentedSSM = PointDistributionModel3D(pcaModel.reference, lowRankAugmentedGP)

  case class ChangePointKernel(
      kernel1: MatrixValuedPDKernel[_3D],
      kernel2: MatrixValuedPDKernel[_3D]
  ) extends MatrixValuedPDKernel[_3D]() {

    override def domain = EuclideanSpace[_3D]
    val outputDim = 3

    def s(p: Point[_3D]) = 1.0 / (1.0 + math.exp(-p(0)))
    def k(x: Point[_3D], y: Point[_3D]) = {
      val sx = s(x)
      val sy = s(y)
      kernel1(x, y) * sx * sy + kernel2(x, y) * (1 - sx) * (1 - sy)
    }
  }

  val gk1 = DiagonalKernel3D(GaussianKernel3D(100.0), 3)
  val gk2 = DiagonalKernel3D(GaussianKernel3D(10.0), 3)
  val changePointKernel = ChangePointKernel(gk1, gk2)
  val gpCP = GaussianProcess3D(zeroMean, changePointKernel)
  val sampleCP = gpCP.sampleAtPoints(referenceMesh)
  ui.show(sampleGroup, sampleCP, "ChangePointKernelGP_sample")

  case class xMirroredKernel(kernel: PDKernel[_3D]) extends PDKernel[_3D] {
    override def domain = kernel.domain
    override def k(x: Point[_3D], y: Point[_3D]) = kernel(Point(x(0) * -1.0, x(1), x(2)), y)
  }

  def symmetrizeKernel(kernel: PDKernel[_3D]): MatrixValuedPDKernel[_3D] = {
    val xmirrored = xMirroredKernel(kernel)
    val k1 = DiagonalKernel(kernel, 3)
    val k2 = DiagonalKernel(xmirrored * -1f, xmirrored, xmirrored)
    k1 + k2
  }

  val symmetrizedGaussian = symmetrizeKernel(GaussianKernel[_3D](100))

  val gpSym = GaussianProcess3D(zeroMean, symmetrizedGaussian)
  val sampleGpSym = gpSym.sampleAtPoints(referenceMesh)

  ui.show(sampleGroup, sampleGpSym, "ChangePointKernelGP_sample")
  ui.close()
}
