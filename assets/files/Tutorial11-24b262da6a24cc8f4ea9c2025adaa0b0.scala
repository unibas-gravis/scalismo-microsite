//> using scala "3.3"
//> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0"
// !!! if you are working on a Mac with M1 or M2 processor, use the following import instead !!!
// //> using dep "ch.unibas.cs.gravis::scalismo-ui:0.92.0,exclude=ch.unibas.cs.gravis%vtkjavanativesmacosimpl"
import scalismo.geometry.*
import scalismo.common.*
import scalismo.mesh.*
import scalismo.statisticalmodel.MultivariateNormalDistribution
import scalismo.numerics.UniformMeshSampler3D
import scalismo.io.{MeshIO, StatisticalModelIO, LandmarkIO}

import scalismo.ui.api.*

import breeze.linalg.{DenseMatrix, DenseVector}

import java.io.File

import scalismo.utils.Random.FixedSeed.randBasis

object Tutorial11 extends App:
  scalismo.initialize()

  val ui = ScalismoUI()

  val targetMesh = MeshIO.readMesh(File("datasets/target.ply")).get
  val model = StatisticalModelIO.readStatisticalTriangleMeshModel3D(File("datasets/bfm.h5")).get

  val targetGroup = ui.createGroup("targetGroup")
  val targetMeshView = ui.show(targetGroup, targetMesh, "targetMesh")

  val modelGroup = ui.createGroup("modelGroup")
  val modelView = ui.show(modelGroup, model, "model")

  val sampler = UniformMeshSampler3D(model.reference, numberOfPoints = 5000)
  val points: Seq[Point[_3D]] = sampler.samplePoints()
  val ptIds = points.map(point => model.reference.pointSet.findClosestPoint(point).id)

  def attributeCorrespondences(
      movingMesh: TriangleMesh[_3D],
      ptIds: Seq[PointId]
  ): Seq[(PointId, Point[_3D])] =
    ptIds.map((id: PointId) =>
      val pt = movingMesh.pointSet.point(id)
      val closestPointOnMesh2 = targetMesh.pointSet.findClosestPoint(pt).point
      (id, closestPointOnMesh2)
    )

  val correspondences = attributeCorrespondences(model.mean, ptIds)

  val littleNoise =
    MultivariateNormalDistribution(DenseVector.zeros[Double](3), DenseMatrix.eye[Double](3))

  def fitModel(correspondences: Seq[(PointId, Point[_3D])]): TriangleMesh[_3D] =
    val regressionData =
      correspondences.map(correspondence => (correspondence._1, correspondence._2, littleNoise))
    val posterior = model.posterior(regressionData.toIndexedSeq)
    posterior.mean

  val fit = fitModel(correspondences)
  val resultGroup = ui.createGroup("results")
  val fitResultView = ui.show(resultGroup, fit, "fit")
  def nonrigidICP(
      movingMesh: TriangleMesh[_3D],
      ptIds: Seq[PointId],
      numberOfIterations: Int
  ): TriangleMesh[_3D] =
    if (numberOfIterations == 0) then movingMesh
    else
      val correspondences = attributeCorrespondences(movingMesh, ptIds)
      val transformed = fitModel(correspondences)

      nonrigidICP(transformed, ptIds, numberOfIterations - 1)
  val finalFit = nonrigidICP(model.mean, ptIds, 20)

  ui.show(resultGroup, finalFit, "final fit")
  ui.close()
