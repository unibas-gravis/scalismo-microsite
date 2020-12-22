---
slug: pdms-scalismo-090
title: Point Distribution Models in Scalismo 0.90
author: Marcel Lüthi
author_title: Lecturer, Department of Mathematics and Computer Science, University of Basel
author_url: https://github.com/marcelluethi/
author_image_url: https://avatars2.githubusercontent.com/u/1332115?s=400&u=85f196182f47120058b7ae6edd0a41151b77ceb7&v=4
tags: [scalismo, website]
---

### Introduction

The recently released version of Scalismo - version 0.90 - comes with a number of important changes in its
core classes. In this blog post we will look at the class ```PointDistributionModel```, which replaces and 
generalizes ```StatisticalMeshModel```. 

We start by discussing the differences to the previous implementation. We then show how to create Point Distribution Models. 
In the last part we will discuss how we can change the domain over which the Point Distribution Model is defined. This allows us to change
the resolution of the model, restrict the model to a subset of the original domain, or even to change the type of domain over which the model is defined.   

### From StatisticalMeshModel to PointDistributionModel

Recall that shape variations are modelled using Gaussian processes in Scalismo. More precisely,
we use a low-rank approximation of a Gaussian process, which models a probability distribution over deformation fields,

```scala
val lowrankGP : LowRankGaussianProcess[_3D, EuclideanVector[_3D]] = ???
```
The type signature indicates that the Gaussian process is defined in 3D space and it represents a 
collection of random variables over 3D vectors in Euclidean space.


A ```StatisticalMeshModel``` is the restriction of this continuously defined Gaussian Process to
a discrete and finite set of points. This set of points is defined to be the vertices of a triangle mesh, 
which is called the reference mesh. 
Thus, a ```StatisticalMeshModel``` is just an aggregate of a mesh and a corresponding Gaussian process, 
restricted to the points of the reference mesh. This is reflected in the definition in Scalismo: 

```scala
case class StatisticalMeshModel (referenceMesh: TriangleMesh[_3D],
                                 gp: DiscreteLowRankGaussianProcess[_3D, TriangleMesh, EuclideanVector[_3D]]) 
```
 
When we draw a sample from this model, we actually draw a sample from the Gaussian process and apply
the sampled deformation field to the points of the reference mesh. The resulting sample is the deformed version of the reference mesh.

```scala
val ssm : StatisticalMeshModel = ???
val sample : TriangleMesh[_3D] = ssm.sample
```

From this description it becomes obvious how we can generalize this to other types of datasets. 
As we only use the points of the mesh, we can relax the restriction that the reference has to be a triangle mesh. 
Instead, we assume that the dataset is defined on a finite set of points. In Scalismo, a dataset which is defined on 
a finite set of points is modelled as a subtype of the class ```DiscreteDomain```. This is the basis of the definition of 
a ```PointDistributionModel```:

```scala
case class PointDistributionModel[D, DDomain[D] <: DiscreteDomain[D]](
    reference : DDomain[D], 
    gp: DiscreteLowRankGaussianProcess[D, DDomain, EuclideanVector[D]]
 ) (implicit warper: DomainWarp[D, DDomain])
```
Here we replaced ```TriangleMesh``` by the generic type ```DDomain```, which can be any subtype 
of a ```DiscreteDomain```. The implicit argument ```warper``` restricts the domains further to domains
that can be deformed. In Scalismo these are currently the classes ```TriangleMesh```, 
```TetrahedralMesh```, ```LineMesh``` and ```UnstructuredPointsDomain```.<sup>[1](#myfootnote1)</sup> 

In the actual Scalismo implementation, the definition of the class ```PointDistributionModel``` is even a bit simpler.
The reference is assumed to coincide with the domain over which the (discrete) Gaussian process is defined. Therefore, 
we do not even need to explicitly represent it as part of the class ```PointDistributionModel```.




### Creating and working with Point Distribution Models

Now that we know what a Point Distribution Model is, we will show how we work with them in Scalismo.
Our first example illustrates how to learn a Point Distribution Model of tetrahedral meshes from given example meshes.
This is simple: We create a data collection, where we provide a sequence of tetrahedral meshes and use the method ```createUsingPCA``` 
to create the model:
```scala
val referenceMesh: TetrahedralMesh[_3D] = ???
val trainingMeshes: Seq[TetrahedralMesh[_3D]] = ???
val dataCollection = DataCollection.fromTetrahedralMeshSequence(referenceMesh, trainingMeshes)
val pdmTetraMesh = PointDistributionModel.createUsingPCA(dataCollection)
```

As expected, samples from this model are valid tetrahedral meshes.
```scala
val sample: scalismo.mesh.TetrahedralMesh[_3D] = pdmTetraMesh.sample()
```
Creating models of other types of data sets works exactly in the same way. We simply change the corresponding type
of the reference and the data collection. 

```scala
val referenceMesh: TriangleMesh[_3D] = ???
val trainingMeshes: Seq[TriangleMesh[_3D]] = ???
val dataCollection = DataCollection.fromTriangleMeshSequence(referenceMesh, trainingMeshes)
val pdmTriangleMesh = PointDistributionModel.createUsingPCA(dataCollection)
```


A second way to create a PDMs is to specify a low rank Gaussian process as well as a reference mesh on which 
the Gp will be discretized:
```scala
val lowRankGP : LowRankGaussianProcess[_3D, EuclideanVector[_3D]] = ???
val reference : TriangleMesh[_3D] = ???
val pdmTriangleMesh  : PointDistributionModel[_3D, TriangleMesh] = PointDistributionModel(reference, lowRankGP)
```
Again, samples from the model will have the correct type:
```scala
val sample : TriangleMesh[_3D] = pdmTriangleMesh.sample
```

### Changing the domain

The new implementation opens an interesting new possibility: We can 
change the domain over which the point distribution model is defined. 
To achieve this, we call the methods ```newReference``` and provide as an argument the new reference mesh
and an interpolator. Internally, the interpolator is used to obtain a continuously defined ```LowRankGaussianProcess```
from the ```DiscreteLowRankGaussianProcess```. From above discussion we already know how to create a PDM from a ```reference``` and 
a ```LowRankGaussianProcess```. This is exactly what is done behind the scenes when we call ```newReference```.  

In the following example we show how we can use this method to obtain a 
PDM of a triangle mesh from a model defined over tetrahedral meshes. As the new reference 
we use the outer surface of the tetrahedral mesh over which the original PDM is defined

```scala
val triangleRefMesh: TriangleMesh[_3D] = pdmTetraMesh.reference.getOuterSurface
val pdmOuterSurface : PointDistributionModel[_3D, TriangleMesh] = pdm.newReference(triangleRefMesh, BarycentricInterpolator3D())
```

Another common use case for this method is to restrict the model to a subset of the vertices on 
which the PDM is defined. This can either be used for restricting the model to a part of the domain, or to change
the resolution of the domain. This latter use case is illustrated in the following code:
```scala
val decimatedMesh = pdmTriangleMesh.reference.operations.decimate(targetNumberOfVertices = 100) 
val pdmTriangleDecimated = pdmTriangle.newReference(decimatedMesh, TriangleMeshInterpolato3Dr())
```

Having an easily accessible method to change the points on which the PDM is defined, makes it possible to choose
the appropriate mesh resolution for each task. We might for example want to start with a high resolution model, which result in 
visually pleasing samples when rendered, but reduce the mesh resolution when fitting the model, in order to save computation time.

### Summary
We have seen that the new PDM class generalizes the concept of ```StatisticalMeshModel``` from previous versions of Scalismo. 
The newly introduced class ```PointDistributionModel``` can be defined over any subtype of ```DiscreteDomain```, which supports a warping operation. 
Besides triangle and tetrahedral meshes, this includes line meshes and unstructured point domains. 
Another notable feature of Point Distribution Model is that it provides a method to change the 
domain over which the PDM is defined. This makes it possible to restrict a Gaussian process model to a part of the domain, 
change the type of the domain or to change its resolution. 


#### Footnotes

<a name="footnote1">1</a>: An example for a discrete domain, which cannot be used as a basis for a PDM is a

```DiscreteImage```. The reason is that an image is defined on a regular grid, but once we warp the grid
it is not regular anymore and hence not an image.