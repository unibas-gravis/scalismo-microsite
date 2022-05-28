//> using scala "2.13"
//> using lib "ch.unibas.cs.gravis::scalismo-ui:0.90.0"

// Basic geometric primitives
import scalismo.geometry.{_3D, Point, Point3D}
import scalismo.geometry.{EuclideanVector}
import scalismo.geometry.{IntVector, IntVector3D}
import scalismo.geometry.Landmark

import scalismo.common.PointId

// Geometric objects
import scalismo.mesh.TriangleMesh
import scalismo.mesh.TriangleId
import scalismo.image.{DiscreteImage, DiscreteImage3D}
import scalismo.statisticalmodel.PointDistributionModel

// IO Methods
import scalismo.io.ImageIO;
import scalismo.io.StatisticalModelIO
import scalismo.io.{MeshIO, StatisticalModelIO}

// Visualization
import scalismo.ui.api.ScalismoUI
import scalismo.ui.api.LandmarkView

object Tutorial1 extends App {

  scalismo.initialize()
  implicit val rng = scalismo.utils.Random(42)

  val ui = ScalismoUI()

  val mesh: TriangleMesh[_3D] = MeshIO.readMesh(new java.io.File("datasets/Paola.ply")).get

  val paolaGroup = ui.createGroup("paola")
  val meshView = ui.show(paolaGroup, mesh, "Paola")

  println("first point " + mesh.pointSet.point(PointId(0)))
  println("first cell " + mesh.triangulation.triangle(TriangleId(0)))
  val pointCloudView = ui.show(paolaGroup, mesh.pointSet, "pointCloud")
  pointCloudView.remove()

  val p1: Point[_3D] = Point3D(4.0, 5.0, 6.0)
  val p2: Point[_3D] = Point3D(1.0, 2.0, 3.0)
  val v1: EuclideanVector[_3D] = Point3D(4.0, 5.0, 6.0) - Point3D(1.0, 2.0, 3.0)
  val p3: Point[_3D] = p1 + v1
  val v2: EuclideanVector[_3D] = p1.toVector
  val v3: Point[_3D] = v1.toPoint
  val pointList = Seq(
    Point3D(4.0, 5.0, 6.0),
    Point3D(1.0, 2.0, 3.0),
    Point3D(14.0, 15.0, 16.0),
    Point3D(7.0, 8.0, 9.0),
    Point3D(10.0, 11.0, 12.0)
  )
  val vectors = pointList.map { p: Point[_3D] => p.toVector } // use map to turn points into vectors
  val vectorSum = vectors.reduce { (v1, v2) => v1 + v2 } // sum up all vectors in the collection
  val centerV: EuclideanVector[_3D] =
    vectorSum * (1.0 / pointList.length) // divide the sum by the number of points
  val center = centerV.toPoint

  val image: DiscreteImage[_3D, Short] =
    ImageIO.read3DScalarImage[Short](new java.io.File("datasets/PaolaMRI.vtk")).get
  val imageView = ui.show(paolaGroup, image, "mri")
  val origin: Point[_3D] = image.domain.origin
  val spacing: EuclideanVector[_3D] = image.domain.spacing
  val size: IntVector[_3D] = image.domain.size
  val imagePoints: Iterator[Point[_3D]] = image.domain.pointSet.points.take(172)
  val gridPointsView = ui.show(paolaGroup, imagePoints.toIndexedSeq, "imagePoints")

  val values: Iterator[Short] = image.values
  image.values.next
  image(IntVector(0, 0, 0))
  image.values.size == image.domain.pointSet.numberOfPoints

  val threshValues = image.values.map { v: Short => if (v <= 300) v else 0.toShort }
  val thresholdedImage: DiscreteImage[_3D, Short] =
    DiscreteImage3D[Short](image.domain, threshValues.toIndexedSeq)
  ui show (paolaGroup, thresholdedImage, "thresh")
  val thresholdedImage2 = image.map(v => if (v <= 300) v else 0.toShort)

  val faceModel: PointDistributionModel[_3D, TriangleMesh] =
    StatisticalModelIO.readStatisticalTriangleMeshModel3D(new java.io.File("datasets/bfm.h5")).get
  val faceModelView = ui.show(faceModel, "faceModel")

  val randomFace: TriangleMesh[_3D] = faceModel.sample
  val matchingLandmarkViews: Seq[LandmarkView] =
    ui.filter[LandmarkView](paolaGroup, (l: LandmarkView) => l.name == "noseLM")
  val matchingLandmarks: Seq[Landmark[_3D]] = matchingLandmarkViews.map(lmView => lmView.landmark)
  ui.close()
}
