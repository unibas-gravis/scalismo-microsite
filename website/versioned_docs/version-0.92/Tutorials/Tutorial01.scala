//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"

// Basic geometric primitives
import scalismo.geometry.*
import scalismo.common.PointId

// Geometric objects
import scalismo.mesh.{TriangleMesh, TriangleId}
import scalismo.mesh.TriangleId
import scalismo.image.{DiscreteImage, DiscreteImage3D}
import scalismo.statisticalmodel.PointDistributionModel

// IO Methods
import scalismo.io.*

// Visualization
import scalismo.ui.api.*

// File object from java
import java.io.File

// Choosing seeding mechanism for random number generator
import scalismo.utils.Random.FixedSeed.randBasis

object Tutorial1 extends App:

  scalismo.initialize()

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
  val vectors = pointList.map { (p: Point[_3D]) =>
    p - Point3D(0, 0, 0)
  } // use map to turn points into vectors
  val vectorSum = vectors.reduce { (v1, v2) => v1 + v2 } // sum up all vectors in the collection
  val centerV: EuclideanVector[_3D] =
    vectorSum * (1.0 / pointList.length) // divide the sum by the number of points
  val center = Point3D(0, 0, 0) + centerV

  val image: DiscreteImage[_3D, Short] =
    ImageIO.read3DScalarImage[Short](File("datasets/PaolaMRI.vtk")).get
  val imageView = ui.show(paolaGroup, image, "mri")
  val origin: Point[_3D] = image.domain.origin
  val spacing: EuclideanVector[_3D] = image.domain.spacing
  val size: IntVector[_3D] = image.domain.size

  val values: Iterator[Short] = image.values
  println(image.values.take(10).toSeq)
  image(IntVector3D(0, 0, 0))
  image.values.size == image.domain.pointSet.numberOfPoints

  val threshValues = image.values.map { (v: Short) => if (v <= 300) v else 0.toShort }
  val thresholdedImage: DiscreteImage[_3D, Short] =
    DiscreteImage3D[Short](image.domain, threshValues.toIndexedSeq)
  ui.show(paolaGroup, thresholdedImage, "thresh")
  val thresholdedImage2 = image.map(v => if (v <= 300) v else 0.toShort)

  val faceModel: PointDistributionModel[_3D, TriangleMesh] =
    StatisticalModelIO.readStatisticalTriangleMeshModel3D(File("datasets/bfm.h5")).get
  val faceModelView = ui.show(faceModel, "faceModel")

  val randomFace: TriangleMesh[_3D] = faceModel.sample()
  val matchingLandmarkViews: Seq[LandmarkView] =
    ui.filter[LandmarkView](paolaGroup, (l: LandmarkView) => l.name == "noseLM")
  val matchingLandmarks: Seq[Landmark[_3D]] = matchingLandmarkViews.map(lmView => lmView.landmark)

  ui.close()
