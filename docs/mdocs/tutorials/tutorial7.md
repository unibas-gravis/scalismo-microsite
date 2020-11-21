---
id: tutorial7
title: Shape modelling with Gaussian processes and kernels
---

In this tutorial we learn how to define our own Gaussian processes using analytically
defined kernels. Further, we experiment with different kernels that are useful in
shape modelling.

##### Related resources

The following resources from our [online course](https://www.futurelearn.com/courses/statistical-shape-modelling) may provide
some helpful context for this tutorial:

- Covariance functions [(Video)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250350)
- Constructing kernels for shape modelling [(Article)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250351)
- Enlarging the flexibility of statistical shape models [(Article)](https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250357)

##### Preparation

As in the previous tutorials, we start by importing some commonly used objects and initializing the system.

```scala mdoc:silent
import scalismo.geometry._
import scalismo.common._
import scalismo.ui.api._
import scalismo.mesh._
import scalismo.io.{StatisticalModelIO, MeshIO}
import scalismo.statisticalmodel._
import scalismo.numerics.UniformMeshSampler3D
import scalismo.kernels._
import breeze.linalg.{DenseMatrix, DenseVector}

scalismo.initialize()
implicit val rng = scalismo.utils.Random(42)

val ui = ScalismoUI()
```


In the following we will always visualize the effect of different Gaussian process models,
by applying the deformations to a reference mesh. We therefore start by loading the mesh and visualizing
it in a separate group.

```scala mdoc:silent
val referenceMesh = MeshIO.readMesh(new java.io.File("datasets/lowResPaola.ply")).get

val modelGroup = ui.createGroup("gp-model")
val referenceView = ui.show(modelGroup, referenceMesh, "reference")
```

## Modelling deformations using Gaussian processes:

A Gaussian Process is defined by two components: the **mean function** and the **covariance function**.

##### The mean:

As we are modelling deformation fields, the mean of the Gaussian process will, of course, itself be a deformation field.
In terms of shape models, we can think of the mean function as the deformation field that deforms our reference mesh into the mean shape.

If the reference shape that we choose corresponds approximately to an average shape, and we do not have any further knowledge
about our shape space, it is entirely reasonable to use a zero mean; I.e. a deformation field which applies to
every point a zero deformation.

```scala mdoc:silent
val zeroMean = Field(RealSpace[_3D], (pt:Point[_3D]) => EuclideanVector(0,0,0))
```

##### The covariance function:

The covariance function, which is also referred to as a *kernel*,
defines the properties that characterize likely deformations in our model.
Formally, it is a symmetric, positive semi-definite function,
$$k: X \times X \to R^{ d \times d}$$, which defines the covariance between the
values at any pair of points $$x, x'$$ of the domain. Since we are modelling deformation
fields (I.e. vector-valued functions), the covariance function is matrix-valued.

To define a kernel in Scalismo, we need to implement the following methods of the abstract class ```MatrixValuedPDKernel```:
```scala
abstract class MatrixValuedPDKernel[_3D]() {

    def outputDim: Int;
    def domain: Domain[_3D];
    def k(x: Point[_3D], y: Point[_3D]): DenseMatrix[Double];
  }
```

The field ```outputDim``` determines the dimensionality of the values we model. In our case, we model 3D vectors, and hence ```outputDim```should be 3.
The ```domain``` indicates the set of points on which our kernel is defined. Most often, we set this to the entire Euclidean space ```RealSpace3D```.
Finally ```k``` denotes the covariance function.

The most often used kernel is the Gaussian kernel. Recall that the scalar-valued Gaussian kernel, is defined by the following formula:
$$
k_g(x,x') = \exp^{-\frac{\left\lVert x-x'\right\rVert^2}{\sigma^2} }.
$$
A corresponding matrix-valued kernel can be obtained by multiplying the value with an identity matrix (which implies, that we treat each space dimension as independent). In Scalismo, this is defined as follows:
```scala mdoc:silent
case class MatrixValuedGaussianKernel3D(sigma2 : Double) extends MatrixValuedPDKernel[_3D]() {

    override def outputDim: Int = 3
    override def domain: Domain[_3D] = RealSpace[_3D];

    override def k(x: Point[_3D], y: Point[_3D]): DenseMatrix[Double] = {
       DenseMatrix.eye[Double](outputDim) * Math.exp(- (x - y).norm2 / sigma2)
  }
}
```

This constructions allows us to define any kernel. For the most commonly used ones, such as the Gaussian kernel, there is, however,
an easier way in Scalismo. First, the scalar-valued Gaussian kernel is already implemented in Scalismo:

```scala mdoc:silent
val scalarValuedGaussianKernel : PDKernel[_3D]= GaussianKernel(sigma = 100.0)
```
Further, the class ```DiagonalKernel```allows us to turn any scalar-valued kernel into a matrix-valued kernel,
 by specifying for each dimension of the output-space a kernel and assuming them to be independent. To obtain the same kernel as defined above, we can write:
```scala mdoc:silent
val matrixValuedGaussianKernel = DiagonalKernel(scalarValuedGaussianKernel, scalarValuedGaussianKernel, scalarValuedGaussianKernel)
```
In this case, since we are using the same kernel in every space dimension, we can write this even more succinct as:
```scala mdoc:silent
DiagonalKernel(scalarValuedGaussianKernel, 3)
```


##### Building the GP :

Now that we have our mean and covariance functions, we can build a Gaussian process as follows:
```scala mdoc:silent
val gp = GaussianProcess(zeroMean, matrixValuedGaussianKernel)
```

We can now sample deformations from our Gaussian process **at any desired set of points**. Below we choose the points to be those of the reference mesh:

```scala mdoc:silent
val sampleGroup = ui.createGroup("samples")
val sample = gp.sampleAtPoints(referenceMesh.pointSet)
ui.show(sampleGroup, sample, "gaussianKernelGP_sample")
```

The result is an instance from the Gaussian Process evaluated at the points
we indicated;  in this case on the points of the reference mesh.

We can visualize its effect by interpolating the deformation field, which we then use to deform the reference mesh:
```scala mdoc:silent
val interpolatedSample = sample.interpolate(NearestNeighborInterpolator())
val deformedMesh = referenceMesh.transform((p : Point[_3D]) => p + interpolatedSample(p))
ui.show(sampleGroup, deformedMesh, "deformed mesh")
```

#### Low-rank approximation
Whenever we create a sample using the ```sampleAtPoints``` method of the Gaussian process, internally a matrix of dimensionality $$nd \times nd$$,where $$n$$ denotes the number of points and $$d$$ the dimensionality of the output space, is created. Hence if we want to sample
from many points we quickly run out of memory.

We can get around this problem by computing a low-rank approximation of the Gaussian process.
To obtain such a representation in Scalismo, we can use the method
````approximateGPCholesky``` of the *LowRankGaussianProcess* object.
```scala mdoc:silent
val lowRankGP = LowRankGaussianProcess.approximateGPCholesky(
    referenceMesh.pointSet,
    gp,
    relativeTolerance = 0.01,
    interpolator = NearestNeighborInterpolator()
    )
```
This call computes a finite-rank approximation of the Gaussian Process using a
Pivoted Cholesky approximation. The procedure automatically chooses the rank (I.e. the
number of basis functions of the Gaussian process), such that the given relative error
is achieved. (The error is measures in terms of the variance of the Gaussian
process, approximated on the points of the reference Mesh).
Using this low rank Gaussian process, we can now directly sample continuous deformation fields:

```scala mdoc:silent
val  defField : Field[_3D, EuclideanVector[_3D]]= lowRankGP.sample
```
These in turn, can be used to warp a reference mesh, as discussed above:
```scala mdoc:silent
referenceMesh.transform((p : Point[_3D]) => p + defField(p))
```

More conveniently, we can visualize the sampled meshes by building again a ```StatisticalMeshModel```,
```scala mdoc:silent
val ssm = StatisticalMeshModel(referenceMesh, lowRankGP)
```
which we can directly visualize
```scala mdoc:silent
val ssmView = ui.show(modelGroup, ssm, "group")
```

### Building more interesting kernels

In the following we show a few more examples of kernels, which are interesting for shape modelling.


#### Kernels from Statistical Shape Models

As discussed previously, a Statistical Shape Model (SSM) in Scalismo is a discrete Gaussian process.
We have seen how to interpolate it to obtain a continuously defined Gaussian Process. As any
Gaussian process is  completely defined by its mean and covariance function, it follows that this is
also true for the GP in our statistical shape model.

This allows us to use this *sample covariance kernel* in combination with other kernels.
For example, we often want to slightly enlarge the flexibility of our statistical models.
In the following, we show how this can be achieved.

In a first step, we get the Gaussian process from the model an interpolate it.

```scala mdoc:silent
val pcaModel = StatisticalModelIO.readStatisticalMeshModel(new java.io.File("datasets/lowresModel.h5")).get
val gpSSM = pcaModel.gp.interpolate(NearestNeighborInterpolator())
```

We can then access its covariance function, which is a kernel:
```scala mdoc:silent
val covSSM : MatrixValuedPDKernel[_3D] = gpSSM.cov
```

In the next step, we model the additional variance using a Gaussian kernel and add it to the
*sample covariance kernel*.
```scala mdoc:silent
val augmentedCov = covSSM + DiagonalKernel(GaussianKernel[_3D](100.0), 3)
```

Finally, we build the Gaussian process with the new kernel.
```scala mdoc:silent
val augmentedGP = GaussianProcess(gpSSM.mean, augmentedCov)
```

From here on, we follow the steps outlined above to obtain the *augmented* SSM.
```scala mdoc:silent
val lowRankAugmentedGP = LowRankGaussianProcess.approximateGPCholesky(
    referenceMesh.pointSet,
    augmentedGP,
    relativeTolerance = 0.01,
    interpolator = NearestNeighborInterpolator(),
    )
val augmentedSSM = StatisticalMeshModel(pcaModel.referenceMesh, lowRankAugmentedGP)
```

#### Changepoint kernel:

Another very useful kernel is the *changepoint kernel*.
A changepoint kernel is a combination of different kernels, where each kernel is active only in
a certain region of the space.

Here we show how we can define a kernel, which has different behavior in two different regions.
```scala mdoc:silent
case class ChangePointKernel(kernel1 : MatrixValuedPDKernel[_3D], kernel2 : MatrixValuedPDKernel[_3D])
    extends MatrixValuedPDKernel[_3D]() {

  override def domain = RealSpace[_3D]
  val outputDim = 3

  def s(p: Point[_3D]) =  1.0 / (1.0 + math.exp(-p(0)))
  def k(x: Point[_3D], y: Point[_3D]) = {
      val sx = s(x)
      val sy = s(y)
      kernel1(x,y) * sx * sy + kernel2(x,y) * (1-sx) * (1-sy)
  }

}
```

Let's visualize its effect with two different Gaussian Kernels

```scala mdoc:silent
val gk1 = DiagonalKernel(GaussianKernel[_3D](100.0), 3)
val gk2 = DiagonalKernel(GaussianKernel[_3D](10.0), 3)
val changePointKernel = ChangePointKernel(gk1, gk2)
val gpCP = GaussianProcess(zeroMean, changePointKernel)
val sampleCP =  gpCP.sampleAtPoints(referenceMesh.pointSet)
ui.show(sampleGroup, sampleCP, "ChangePointKernelGP_sample")
```

As you can see each kernel is now active only on one half of the face.


#### Symmetrizing a kernel

Quite often, the shapes that we aim to model exhibit a symmetry. This is particularly valid in the case of faces.
Therefore when modelling over such shapes, one would want deformation fields that yield symmetric shapes.

Once we obtained a kernel yielding the type of deformations we desire, it is possible to symmetrize the resulting deformation fields by applying the formula below:


<img src=" data:image/png;base64,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"/>

where *x<sub>m</sub>* is the symmetric point to *x* around the YZ plane.

The resulting kernel will preserve the same smoothness properties of the deformation fields while adding the symmetry around the YZ plane.

Let's turn it into code:

```scala mdoc:silent
case class xMirroredKernel(kernel : PDKernel[_3D]) extends PDKernel[_3D] {
  override def domain = kernel.domain
  override def k(x: Point[_3D], y: Point[_3D]) = kernel(Point(x(0) * -1.0 ,x(1), x(2)), y)

}

def symmetrizeKernel(kernel : PDKernel[_3D]) : MatrixValuedPDKernel[_3D] = {
   val xmirrored = xMirroredKernel(kernel)
   val k1 = DiagonalKernel(kernel, 3)
   val k2 = DiagonalKernel(xmirrored * -1f, xmirrored, xmirrored)
   k1 + k2
}

val symmetrizedGaussian = symmetrizeKernel(GaussianKernel[_3D](100))
```

```scala mdoc:silent
val gpSym = GaussianProcess(zeroMean, symmetrizedGaussian)
val sampleGpSym =  gpSym.sampleAtPoints(referenceMesh.pointSet)
ui.show(sampleGroup, sampleGpSym, "ChangePointKernelGP_sample")
```

```scala mdoc:invisible
ui.close()
```