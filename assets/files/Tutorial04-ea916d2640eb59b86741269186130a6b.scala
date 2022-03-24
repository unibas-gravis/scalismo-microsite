//> using scala "2.13"
//> using lib "ch.unibas.cs.gravis::scalismo-ui:0.90.0"
import scalismo.geometry._
import scalismo.common._
import scalismo.mesh._
import scalismo.io.{StatismoIO, StatisticalModelIO}
import scalismo.statisticalmodel._
import scalismo.ui.api._

object Tutorial4 extends App {

  scalismo.initialize()
  implicit val rng = scalismo.utils.Random(42)

  val ui = ScalismoUI()
  val faceModel: PointDistributionModel[_3D, TriangleMesh] =
    StatisticalModelIO.readStatisticalTriangleMeshModel3D(new java.io.File("datasets/bfm.h5")).get
  val modelGroup = ui.createGroup("model")
  val sampleGroup = ui.createGroup("samples")

  val meanFace: TriangleMesh[_3D] = faceModel.mean
  ui.show(sampleGroup, meanFace, "meanFace")
  val sampledFace: TriangleMesh[_3D] = faceModel.sample
  ui.show(sampleGroup, sampledFace, "randomFace")
  val reference: TriangleMesh[_3D] = faceModel.reference
  val faceGP: DiscreteLowRankGaussianProcess[_3D, TriangleMesh, EuclideanVector[_3D]] = faceModel.gp
  val meanDeformation: DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = faceGP.mean
  val sampleDeformation: DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = faceGP.sample
  ui.show(sampleGroup, meanDeformation, "meanField")
  ui.close()

}
