//> using scala "2.13"
//> using lib "ch.unibas.cs.gravis::scalismo-ui:0.91-RC1"
import scalismo.geometry._
import scalismo.common._
import scalismo.transformations._
import scalismo.io.MeshIO
import scalismo.mesh.TriangleMesh
import scalismo.common.interpolation._
import scalismo.common.interpolation.TriangleMeshInterpolator3D
import scalismo.ui.api._

object Tutorial3 extends App {

  scalismo.initialize()
  implicit val rng: scalismo.utils.Random = scalismo.utils.Random(42)

  val ui = ScalismoUI()
  import scalismo.io.MeshIO

  val dsGroup = ui.createGroup("datasets")

  val meshFiles = new java.io.File("datasets/testFaces/").listFiles.take(3)
  val (meshes, meshViews) = meshFiles
    .map(meshFile => {
      val mesh = MeshIO.readMesh(meshFile).get
      val meshView = ui.show(dsGroup, mesh, "mesh")
      (mesh, meshView) // return a tuple of the mesh and the associated view
    })
    .unzip // take the tuples apart, to get a sequence of meshes and one of meshViews

  val reference = meshes.head // face_0 is our reference
  val deformations: IndexedSeq[EuclideanVector[_3D]] =
    reference.pointSet.pointIds.map { id =>
      meshes(1).pointSet.point(id) - reference.pointSet.point(id)
    }.toIndexedSeq
  val deformationField: DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] =
    DiscreteField3D(reference, deformations)
  deformationField(PointId(0))
  val deformationFieldView = ui.show(dsGroup, deformationField, "deformations")
  meshViews(2).remove()
  meshViews(0).opacity = 0.3
  val interpolator = TriangleMeshInterpolator3D[EuclideanVector[_3D]]()
  val continuousDeformationField: Field[_3D, EuclideanVector[_3D]] =
    deformationField.interpolate(interpolator)
  continuousDeformationField(Point3D(-100, -100, -100))

  val nMeshes = meshes.length

  val meanDeformations = reference.pointSet.pointIds.map(id => {

    var meanDeformationForId = EuclideanVector3D(0, 0, 0)

    val meanDeformations = meshes.foreach(mesh => { // loop through meshes
      val deformationAtId = mesh.pointSet.point(id) - reference.pointSet.point(id)
      meanDeformationForId += deformationAtId * (1.0 / nMeshes)
    })

    meanDeformationForId
  })

  val meanDeformationField = DiscreteField3D(reference, meanDeformations.toIndexedSeq)
  val continuousMeanDeformationField =
    meanDeformationField.interpolate(TriangleMeshInterpolator3D())

  val meanTransformation =
    Transformation((pt: Point[_3D]) => pt + continuousMeanDeformationField(pt))
  val meanMesh = reference.transform(meanTransformation)
  ui.show(dsGroup, meanMesh, "mean mesh")
  ui.close()

}
