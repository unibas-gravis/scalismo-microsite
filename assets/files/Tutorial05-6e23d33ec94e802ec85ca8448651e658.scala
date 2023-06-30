//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"
import scalismo.ui.api.*
import scalismo.geometry.*
import scalismo.common.*
import scalismo.common.interpolation.TriangleMeshInterpolator3D
import scalismo.mesh.*
import scalismo.io.StatisticalModelIO
import scalismo.statisticalmodel.*

import scalismo.utils.Random.FixedSeed.randBasis

object Tutorial5 extends App:

  scalismo.initialize()

  val ui = ScalismoUI()

  val model =
    StatisticalModelIO.readStatisticalTriangleMeshModel3D(new java.io.File("datasets/bfm.h5")).get
  val modelGroup = ui.createGroup("modelGroup")
  val ssmView = ui.show(modelGroup, model, "model")

  val gp = model.gp

  val sampleDF: DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = model.gp.sample()

  val sampleGroup = ui.createGroup("sample")
  ui.show(sampleGroup, sampleDF, "discreteSample")

  val contGP = model.gp.interpolate(TriangleMeshInterpolator3D())

  val contSample: Field[_3D, EuclideanVector[_3D]] = contGP.sample()

  val referencePointSet = model.reference.pointSet
  val rightEyePt: Point[_3D] = referencePointSet.point(PointId(4281))
  val leftEyePt: Point[_3D] = referencePointSet.point(PointId(11937))
  val marginal: DiscreteGaussianProcess[_3D, UnstructuredPointsDomain, EuclideanVector[_3D]] =
    contGP.marginal(IndexedSeq(rightEyePt, leftEyePt))
  val discreteGP: DiscreteGaussianProcess[_3D, TriangleMesh, EuclideanVector[_3D]] =
    contGP.discretize(model.reference)

  val lowresMesh = model.reference.operations.decimate(1000)
  val lowResModel = model.newReference(lowresMesh, TriangleMeshInterpolator3D())

  val defSample = model.gp.sample()
  model.gp.logpdf(defSample)
  ui.close()
