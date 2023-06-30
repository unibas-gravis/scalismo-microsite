//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"
import scalismo.geometry.*
import scalismo.common.*
import scalismo.transformations.*
import scalismo.common.interpolation.*
import scalismo.ui.api.*
import scalismo.io.MeshIO
import scalismo.mesh.TriangleMesh

import java.io.File

import scalismo.utils.Random.FixedSeed.randBasis

object Tutorial3 extends App:

  scalismo.initialize()

  val ui = ScalismoUI()

  val dsGroup = ui.createGroup("datasets")

  val meshFiles = new File("datasets/testFaces/").listFiles.take(3) // take first 3 files
  val (meshes, meshViews) = meshFiles
    .map(meshFile => {
      val mesh = MeshIO.readMesh(meshFile).get // load mesh
      val meshView = ui.show(dsGroup, mesh, "mesh") // visualize it
      (mesh, meshView) // return a tuple of the mesh and the associated view
    })
    .unzip // take the tuples apart, to get a sequence of meshes and one of meshViews
  val reference = meshes.head
  val deformations: IndexedSeq[EuclideanVector[_3D]] =
    reference.pointSet.pointIds
      .map(id => meshes(1).pointSet.point(id) - reference.pointSet.point(id))
      .toIndexedSeq
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

    val deformationsForId = meshes.map(mesh => { // loop through meshes
      (mesh.pointSet.point(id) - reference.pointSet.point(id)) * (1.0 / nMeshes)
    })
    deformationsForId.reduce(_ + _) // sum the deformations
  })

  val meanDeformationField = DiscreteField3D(reference, meanDeformations.toIndexedSeq)
  val continuousMeanDeformationField =
    meanDeformationField.interpolate(TriangleMeshInterpolator3D())
  val meanTransformation =
    Transformation((pt: Point[_3D]) => pt + continuousMeanDeformationField(pt))
  val meanMesh = reference.transform(meanTransformation)
  ui.show(dsGroup, meanMesh, "mean mesh")
  ui.close()
