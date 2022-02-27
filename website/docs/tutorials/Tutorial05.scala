//> using scala "2.13"
//> using lib "ch.unibas.cs.gravis::scalismo-ui:0.90.0"
import scalismo.ui.api._
import scalismo.geometry._
import scalismo.common._
import scalismo.common.interpolation.TriangleMeshInterpolator3D
import scalismo.mesh._
import scalismo.io.StatisticalModelIO
import scalismo.statisticalmodel._

object Tutorial5 extends App {

  scalismo.initialize()
  implicit val rng = scalismo.utils.Random(42)

  val ui = ScalismoUI()

  val model =
    StatisticalModelIO.readStatisticalTriangleMeshModel3D(new java.io.File("datasets/bfm.h5")).get
  val gp = model.gp

  val modelGroup = ui.createGroup("modelGroup")
  val ssmView = ui.show(modelGroup, model, "model")

  val sampleDF: DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = model.gp.sample

  val sampleGroup = ui.createGroup("sample")
  ui.show(sampleGroup, sampleDF, "discreteSample")

  val interpolator = TriangleMeshInterpolator3D[EuclideanVector[_3D]]()
  val contGP = model.gp.interpolate(interpolator)

  val contSample: Field[_3D, EuclideanVector[_3D]] = contGP.sample

  val fullSample = contGP.sampleAtPoints(model.reference)
  val fullSampleView = ui.show(sampleGroup, fullSample, "fullSample")

  val referencePointSet = model.reference.pointSet
  val rightEyePt: Point[_3D] = referencePointSet.point(PointId(4281))
  val leftEyePt: Point[_3D] = referencePointSet.point(PointId(11937))
  val marginal: DiscreteGaussianProcess[_3D, UnstructuredPointsDomain, EuclideanVector[_3D]] =
    contGP.marginal(IndexedSeq(rightEyePt, leftEyePt))
  val discreteGP: DiscreteGaussianProcess[_3D, TriangleMesh, EuclideanVector[_3D]] =
    contGP.discretize(model.reference)

  val lowresMesh = model.reference.operations.decimate(1000)
  val lowResModel = model.newReference(lowresMesh, TriangleMeshInterpolator3D())

  val defSample = model.gp.sample
  model.gp.pdf(defSample)
  val defSample1 = model.gp.sample
  val defSample2 = model.gp.sample

  val logPDF1 = model.gp.logpdf(defSample1)
  val logPDF2 = model.gp.logpdf(defSample2)

  val moreOrLess = if (logPDF1 > logPDF2) "more" else "less"
  println(s"defSample1 is $moreOrLess likely than defSample2")
  ui.close()

}
