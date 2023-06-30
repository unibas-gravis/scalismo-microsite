//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"
import scalismo.geometry.*
import scalismo.common.*
import scalismo.mesh.*
import scalismo.io.StatisticalModelIO
import scalismo.statisticalmodel.*
import scalismo.ui.api.*

import java.io.File

import scalismo.utils.Random.FixedSeed.randBasis

object Tutorial4 extends App:

  scalismo.initialize()

  val ui = ScalismoUI()
  val faceModel: PointDistributionModel[_3D, TriangleMesh] =
    StatisticalModelIO.readStatisticalTriangleMeshModel3D(new java.io.File("datasets/bfm.h5")).get
  val modelGroup = ui.createGroup("model")
  val sampleGroup = ui.createGroup("samples")

  val meanFace: TriangleMesh[_3D] = faceModel.mean
  ui.show(sampleGroup, meanFace, "meanFace")

  val sampledFace: TriangleMesh[_3D] = faceModel.sample()
  ui.show(sampleGroup, sampledFace, "randomFace")
  val reference: TriangleMesh[_3D] = faceModel.reference
  val faceGP: DiscreteLowRankGaussianProcess[_3D, TriangleMesh, EuclideanVector[_3D]] = faceModel.gp
  val meanDeformation: DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = faceGP.mean
  val sampleDeformation: DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = faceGP.sample()
  ui.show(sampleGroup, meanDeformation, "meanField")
  ui.show(modelGroup, reference, "referenceFace")
  ui.close()
