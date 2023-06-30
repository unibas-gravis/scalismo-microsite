//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"
// api functions for scalismo-ui
import scalismo.ui.api.*

// some objects and readers from scalismo
import scalismo.io.*
import scalismo.geometry.*
import scalismo.transformations.*

// some other things needed in the examples
import java.io.File
import java.awt.Color
import breeze.linalg.DenseVector
import breeze.stats.distributions.Gaussian

import java.io.File

import breeze.stats.distributions.Rand.FixedSeed.randBasis
import scalismo.utils.Random.FixedSeed.randBasis

object ScalismoUIIntroduction extends App:
  val ui = ScalismoUI()
  val group = ui.createGroup("object-1")
  val mesh = MeshIO.readMesh(new java.io.File("./datasets/Paola.ply")).get
  val meshView = ui.show(group, mesh, "mesh")
  meshView.color = Color.RED
  meshView.opacity = 1.0
  ui.setVisibility(meshView, Viewport._3dOnly)
  ui.setVisibility(meshView, Viewport.all)
  val landmarkViews = ui.filter[LandmarkView](group, (v: LandmarkView) => true)
  for (landmarkView <- landmarkViews) do
    landmarkView.color = Color.RED
    println(landmarkView.landmark.point)
  val flip = Transformation((p: Point[_3D]) => Point3D(p.x, -p.y, p.z))
  val transformationView = ui.addTransformation(group, flip, "flip")
  transformationView.remove()
  group.remove()
  val ssm = StatisticalModelIO.readStatisticalTriangleMeshModel3D(new File("datasets/bfm.h5")).get
  val ssmGroup = ui.createGroup("shape-model")
  val ssmView = ui.show(ssmGroup, ssm, "ssm")
  val randCoeffs = DenseVector.rand[Double](ssm.rank, Gaussian(0, 1))
  ssmView.shapeModelTransformationView.shapeTransformationView.coefficients = randCoeffs
  val group2 = ui.createGroup("object-2")
  val image = ImageIO.read3DScalarImage[Short](new File("./datasets/PaolaMRI.vtk")).get
  val imageView = ui.show(group2, image, "mri-image")
  ui.close()
