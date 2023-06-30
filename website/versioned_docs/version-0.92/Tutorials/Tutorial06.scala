//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"
import scalismo.ui.api.*

import scalismo.geometry.*
import scalismo.common.*
import scalismo.common.interpolation.TriangleMeshInterpolator3D
import scalismo.mesh.*
import scalismo.io.{StatisticalModelIO, MeshIO}
import scalismo.statisticalmodel.*
import scalismo.registration.*
import scalismo.statisticalmodel.dataset.*
import scalismo.numerics.PivotedCholesky.RelativeTolerance

import java.io.File

import scalismo.utils.Random.FixedSeed.randBasis

object Tutorial6 extends App:
  scalismo.initialize()

  val ui = ScalismoUI()

  val dsGroup = ui.createGroup("datasets")

  val meshFiles = File("datasets/nonAlignedFaces/").listFiles
  val (meshes, meshViews) = meshFiles
    .map(meshFile => {
      val mesh = MeshIO.readMesh(meshFile).get
      val meshView = ui.show(dsGroup, mesh, "mesh")
      (mesh, meshView) // return a tuple of the mesh and the associated view
    })
    .unzip // take the tuples apart, to get a sequence of meshes and one of meshViews

  val reference = meshes.head
  val toAlign: IndexedSeq[TriangleMesh[_3D]] = meshes.tail

  val pointIds = IndexedSeq(2214, 6341, 10008, 14129, 8156, 47775).map(id => PointId(id))
  val refLandmarks = pointIds.map(id => Landmark(s"L_$id", reference.pointSet.point(id)))

  val alignedMeshes = toAlign.map(mesh =>
    val landmarks = pointIds.map { id => Landmark("L_" + id, mesh.pointSet.point(id)) }
    val rigidTrans = LandmarkRegistration.rigid3DLandmarkRegistration(
      landmarks,
      refLandmarks,
      center = Point3D(0, 0, 0)
    )
    mesh.transform(rigidTrans)
  )

  val defFields = alignedMeshes.map(m =>
    val deformationVectors = reference.pointSet.pointIds
      .map((id: PointId) => m.pointSet.point(id) - reference.pointSet.point(id))
      .toIndexedSeq
    DiscreteField3D(reference, deformationVectors)
  )

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
