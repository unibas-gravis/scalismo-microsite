//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"
import scalismo.geometry.*
import scalismo.common.*
import scalismo.mesh.TriangleMesh
import scalismo.transformations.*
import scalismo.io.MeshIO
import scalismo.ui.api.*

import scalismo.utils.Random.FixedSeed.randBasis

import java.io.File

object Tutorial2 extends App:

  scalismo.initialize()

  val ui = ScalismoUI()
  val paolaGroup = ui.createGroup("paola")
  val mesh: TriangleMesh[_3D] = MeshIO.readMesh(File("datasets/Paola.ply")).get
  val meshView = ui.show(paolaGroup, mesh, "Paola")

  val flipTransform = Transformation((p: Point[_3D]) => Point3D(-p.x, p.y, p.z))
  val pt: Point[_3D] = flipTransform(Point3D(1.0, 1.0, 1.0))

  val translation = Translation3D(EuclideanVector3D(100, 0, 0))

  val rotationCenter = Point3D(0.0, 0.0, 0.0)
  val rotation: Rotation[_3D] = Rotation3D(0f, 3.14f, 0f, rotationCenter)

  val pt2: Point[_3D] = rotation(Point(1, 1, 1))

  val translatedPaola: TriangleMesh[_3D] = mesh.transform(translation)
  val paolaMeshTranslatedView = ui.show(paolaGroup, translatedPaola, "translatedPaola")

  val rigidTransform2: RigidTransformation[_3D] = TranslationAfterRotation3D(translation, rotation)

  val paolaTransformedGroup = ui.createGroup("paolaTransformed")
  val paolaTransformed = mesh.transform(rigidTransform2)
  ui.show(paolaTransformedGroup, paolaTransformed, "paolaTransformed")

  val pointIds = Seq(PointId(2213), PointId(14727), PointId(8320), PointId(48182))
  val paolaLandmarks = pointIds.map(pId => Landmark(s"lm-${pId.id}", mesh.pointSet.point(pId)))
  val paolaTransformedLandmarks =
    pointIds.map(pId => Landmark(s"lm-${pId.id}", paolaTransformed.pointSet.point(pId)))

  val paolaLandmarkViews = paolaLandmarks.map(lm => ui.show(paolaGroup, lm, s"${lm.id}"))
  val paolaTransformedLandmarkViews =
    paolaTransformedLandmarks.map(lm => ui.show(paolaTransformedGroup, lm, lm.id))

  import scalismo.registration.LandmarkRegistration

  val bestTransform: RigidTransformation[_3D] = LandmarkRegistration.rigid3DLandmarkRegistration(
    paolaLandmarks,
    paolaTransformedLandmarks,
    center = Point(0, 0, 0)
  )

  val transformedLms = paolaLandmarks.map(lm => lm.transform(bestTransform))
  val landmarkViews = ui.show(paolaGroup, transformedLms, "transformedLMs")

  val alignedPaola = mesh.transform(bestTransform)
  val alignedPaolaView = ui.show(paolaGroup, alignedPaola, "alignedPaola")
  alignedPaolaView.color = java.awt.Color.RED
  ui.close()
