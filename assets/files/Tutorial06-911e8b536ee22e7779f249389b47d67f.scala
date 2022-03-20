//> using scala "2.13"
//> using lib "ch.unibas.cs.gravis::scalismo-ui:0.91-RC1"
import scalismo.ui.api._

import scalismo.geometry._
import scalismo.common._
import scalismo.common.interpolation.TriangleMeshInterpolator3D
import scalismo.mesh._
import scalismo.io.{StatisticalModelIO, MeshIO}
import scalismo.statisticalmodel._
import scalismo.registration._
import scalismo.statisticalmodel.dataset._
import scalismo.numerics.PivotedCholesky.RelativeTolerance

object Tutorial6 extends App {
  scalismo.initialize()
  implicit val rng: scalismo.utils.Random = scalismo.utils.Random(42)

  val ui = ScalismoUI()

  val dsGroup = ui.createGroup("datasets")

  val meshFiles = new java.io.File("datasets/nonAlignedFaces/").listFiles
  val (meshes, meshViews) = meshFiles
    .map(meshFile => {
      val mesh = MeshIO.readMesh(meshFile).get
      val meshView = ui.show(dsGroup, mesh, "mesh")
      (mesh, meshView) // return a tuple of the mesh and the associated view
    })
    .unzip // take the tuples apart, to get a sequence of meshes and one of meshViews

  val reference = meshes.head
  val toAlign: IndexedSeq[TriangleMesh[_3D]] = meshes.tail

  val pointIds = IndexedSeq(2214, 6341, 10008, 14129, 8156, 47775)
  val refLandmarks = pointIds.map { id =>
    Landmark(s"L_$id", reference.pointSet.point(PointId(id)))
  }

  val alignedMeshes = toAlign.map { mesh =>
    val landmarks = pointIds.map { id => Landmark("L_" + id, mesh.pointSet.point(PointId(id))) }
    val rigidTrans = LandmarkRegistration.rigid3DLandmarkRegistration(
      landmarks,
      refLandmarks,
      center = Point(0, 0, 0)
    )
    mesh.transform(rigidTrans)
  }

  val defFields = alignedMeshes.map { m =>
    val deformationVectors = reference.pointSet.pointIds.map { (id: PointId) =>
      m.pointSet.point(id) - reference.pointSet.point(id)
    }.toIndexedSeq
    DiscreteField3D(reference, deformationVectors)
  }

  val continuousFields = defFields.map(f => f.interpolate(TriangleMeshInterpolator3D()))
  val gp = DiscreteLowRankGaussianProcess.createUsingPCA(
    reference,
    continuousFields,
    RelativeTolerance(1e-8)
  )
  val model = PointDistributionModel(gp)
  val modelGroup = ui.createGroup("model")
  val ssmView = ui.show(modelGroup, model, "model")

  val dc = DataCollection.fromTriangleMesh3DSequence(reference, alignedMeshes)

  val modelFromDataCollection = PointDistributionModel.createUsingPCA(dc)

  val modelGroup2 = ui.createGroup("modelGroup2")
  ui.show(modelGroup2, modelFromDataCollection, "ModelDC")

  val dcWithGPAAlignedShapes = DataCollection.gpa(dc)
  val modelFromDataCollectionGPA = PointDistributionModel.createUsingPCA(dcWithGPAAlignedShapes)

  val modelGroup3 = ui.createGroup("modelGroup3")
  ui.show(modelGroup3, modelFromDataCollectionGPA, "ModelDCGPA")
  ui.close();
}
