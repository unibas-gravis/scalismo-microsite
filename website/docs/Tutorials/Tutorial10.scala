//> using scala "3.2"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.91.2"
import scalismo.ui.api._
import scalismo.geometry._
import scalismo.common._
import scalismo.mesh._
import scalismo.registration.LandmarkRegistration
import scalismo.io.{MeshIO}
import scalismo.numerics.UniformMeshSampler3D
import breeze.linalg.{DenseMatrix, DenseVector}

object Tutorial10 extends App {
  scalismo.initialize()
  implicit val rng: scalismo.utils.Random = scalismo.utils.Random(42)

  val ui = ScalismoUI()
  val mesh1 = MeshIO.readMesh(new java.io.File("datasets/Paola.ply")).get
  val group1 = ui.createGroup("Dataset 1")
  val mesh1View = ui.show(group1, mesh1, "mesh1")

  val mesh2 = MeshIO.readMesh(new java.io.File("datasets/323.ply")).get
  val group2 = ui.createGroup("Dataset 2")
  val mesh2View = ui.show(group2, mesh2, "mesh2")
  mesh2View.color = java.awt.Color.RED
  val ptIds = (0 until mesh1.pointSet.numberOfPoints by 50).map(i => PointId(i))
  ui.show(group1, ptIds.map(id => mesh1.pointSet.point(id)), "selected")
  def attributeCorrespondences(
      movingMesh: TriangleMesh[_3D],
      ptIds: Seq[PointId]
  ): Seq[(Point[_3D], Point[_3D])] = {
    ptIds.map { (id: PointId) =>
      val pt = movingMesh.pointSet.point(id)
      val closestPointOnMesh2 = mesh2.pointSet.findClosestPoint(pt).point
      (pt, closestPointOnMesh2)
    }
  }
  val correspondences = attributeCorrespondences(mesh1, ptIds)
  val targetPoints = correspondences.map(pointPair => pointPair._2)
  ui.show(group2, targetPoints.toIndexedSeq, "correspondences")
  val rigidTrans =
    LandmarkRegistration.rigid3DLandmarkRegistration(correspondences, center = Point3D(0, 0, 0))
  val transformed = mesh1.transform(rigidTrans)
  val alignedMeshView = ui.show(group1, transformed, "aligned?")
  alignedMeshView.color = java.awt.Color.GREEN
  val newCorrespondences = attributeCorrespondences(transformed, ptIds)
  val newClosestPoints = newCorrespondences.map(pointPair => pointPair._2)
  ui.show(group2, newClosestPoints.toIndexedSeq, "newCandidateCorr")
  val newRigidTransformation =
    LandmarkRegistration.rigid3DLandmarkRegistration(newCorrespondences, center = Point3D(0, 0, 0))
  val newTransformed = transformed.transform(newRigidTransformation)

  val alignedMeshView2 = ui.show(group2, newTransformed, "aligned??")
  alignedMeshView2.color = java.awt.Color.BLUE
  def ICPRigidAlign(
      movingMesh: TriangleMesh[_3D],
      ptIds: Seq[PointId],
      numberOfIterations: Int
  ): TriangleMesh[_3D] = {
    if (numberOfIterations == 0) movingMesh
    else {
      val correspondences = attributeCorrespondences(movingMesh, ptIds)
      val transform =
        LandmarkRegistration.rigid3DLandmarkRegistration(correspondences, center = Point(0, 0, 0))
      val transformed = movingMesh.transform(transform)
//
      ICPRigidAlign(transformed, ptIds, numberOfIterations - 1)
    }
  }

  val rigidfit = ICPRigidAlign(mesh1, ptIds, 150)
  val rigidFitView = ui.show(group1, rigidfit, "ICP_rigid_fit")
  rigidFitView.color = java.awt.Color.YELLOW
  ui.close()
}
