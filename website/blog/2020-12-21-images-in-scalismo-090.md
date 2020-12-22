---
slug: pdms-images-scalismo-090
title: Images in Scalismo 0.90
author: Marcel Lüthi
author_title: Lecturer, Department of Mathematics and Computer Science, University of Basel
author_url: https://github.com/marcelluethi/
author_image_url: https://avatars2.githubusercontent.com/u/1332115?s=400&u=85f196182f47120058b7ae6edd0a41151b77ceb7&v=4
tags: [scalismo, website]
---

### Introduction

The recently released version of Scalismo - version 0.90 - comes with a number of important changes in its
core classes. In this blog post, we will look at images. 

In older versions of Scalismo images had a special status in the library. While conceptually they were thought to be just discrete fields, they were implemented using a number of special classes, representing the differnet types of images. 
This led to inconsistencies in the 
API and complicated the type hierarchy. Even worse, it enforced the wrong notion that image are conceptually different from other representations of 
intensities used in Scalismo. In version 0.90 we cleaned up the hierarchy and removed all the special classes. Discrete images are now simply a special instantiation of a discrete field, whose
domain is a regular grid. In the following we explain the underlying concepts, show how we can create images and how 
we can obtain a continuous from a discrete representations and vice versa.

### Continuous and discrete Images

Similar to other types of representations, images come in two types: Discrete images and continuous images.
Continuous images are modeled as a ```Field```; I.e. they are functions that have a domain $$D \subset \mathbb{R}^d$$ and
map each point of the domain to some values. The mapped values can be scalars, vectors or even more complicated objects.

Discrete images in turn are a special case of a discrete field. Discrete fields are defined as a finite set of points, where for each point we have an associated value. 
A discrete image is a discrete field, whose domain is constrained to be a regular grid; I.e. whose domain points are equally spaced. That the points are equally spaces makes
it possible to represent the domain points implicitly by a mathematical formula rather than having to explicitly store them.
Furthermore, accessing the image values and looking up closest points becomes a constant time operation.

### Structured Points

The basic object to represent such a set of structured points is the class ```StructuredPoints```.
We can create a set of points on a grid as follows:

```scala
val origin = Point3D(10.0, 15.0, 7.0) // some point defining the lower left corner of the image
val spacing = EuclideanVector3D(0.1, 0.1, 0.1) // the spacing between two grid points in each space dimension
val size = IntVector3D(32, 64, 92) // size in each space dimension
val points = StructuredPoints3D(origin, spacing, size)
```
This creates a grid of points $$32 \times 64 \times 92$$ points, where the bottom left point is at the ```origin```,
and the points are the in the $$x, y, z$$ direction $$0.1mm$$ apart.

Note that the grid of points is aligned to the coordinate axis. In case you would like to have a different
alignment, it is possible to specify a rotation of the points. The rotation is specified by 1 or 3 Euler angles,
depending on whether there is a 2 or 3 dimensional image.
```scala
val yaw = Math.PI / 2
val pitch = 0.0
val roll = Math.PI
val points2 = StructuredPoints3D(origin, spacing, size, yaw, pitch, roll)
```

### Image domain

The image domain represents a domain, whose points are aligned in a rectangular grid.
Naturally, it uses ```StructuredPoints``` as a representation of the underlying points of the
domain. We can create an image domain from structured points as follows:
```scala
val imageDomain = DiscreteImageDomain3D(StructuredPoints3D(origin, spacing, size))
``` 

For convenience, Scalismo also offers the possibility to specify the origin, spacing and size directly, as we did
for the structured points.
```scala
val imageDomain2 = DiscreteImageDomain3D(origin, spacing, size)
```
Note however, that this still creates a structured points object internally.


As for structured points, we can also define a rotation, by specifying the corresponding
Euler angles.
```scala
val imageDomain3 = DiscreteImageDomain3D(origin, spacing, size, yaw, pitch, roll)
```

Finally, we can specify the points by specifying its bounding box together with the information about the spacing or size:
```scala
val boundingBox : BoxDomain[_3D] = imageDomain.boundingBox
val imageDomain4 = DiscreteImageDomain3D(boundingBox, spacing = spacing)
```
or
```scala
val imageDomain5 = DiscreteImageDomain3D(boundingBox, size = size)
```

This last creation method is particularly useful for changing the resolution of an image,
as we will see later.

### Creating images
To create an image, we need to specify a value for each
point in the domain. In this example, we create an image, which assigns a zero value to each point.
```scala
val image = DiscreteImage3D(imageDomain, p => 0.toShort)
```
Alternatively, we could have specified the values using an array, as follows:
```scala
val image2 = DiscreteImage3D(imageDomain, Array.fill(imageDomain.pointSet.numberOfPoints)(0.toShort))
```
Note that an image is just another name for a discrete field with a image domain. We could
have equally well constructed the image as:
```scala
val image3 = DiscreteField3D(imageDomain, p => 0.toShort)
```

### Interpolation and discretization.

It is often more convenient to work with a continuous representation of the image. 
To obtain a continuous image, we use the ```interpolate``` method and specify a suitable
interpolator:
```scala
val continuousImage : Field[_3D, Short] = image.interpolate(BSplineImageInterpolator3D(degree = 3))
``` 
The resulting object is defined on all the points within the bounding box of the image domain.
To go back to a discrete representation, we can specify a new image domain and use the
```discretize``` method. As the new domain could be bigger than the domain of the continuous image,
we need to specify a value that is assigned to the points, which fall outside this domain.

```scala
val newDomain = DiscreteImageDomain3D(image.domain.boundingBox, size=IntVector(32, 32, 32))
val resampledImage : DiscreteImage[_3D, Short] = continuousImage.discretize(newDomain, outsideValue = 0.toShort)
``` 

Of course, we could also resample the continuous image using a different type of domain. Assume for example that we
have a CT image of the upper leg, but we are only interested in representing the intensities for the femur bone. We could then 
discretize the (interpolated) image using a tetrahederal mesh, and thus obtain a representation of the field which is restricted
to the femur bone only. 
```scala
val femurMesh : TetrahedralMesh[_3D] = ???
val femurVolumeMeshModel : DiscreteField[_3D, TetrahedralMesh, Short] = continuousImage.discretize(femurMesh)
```

### Summary 

We have discussed the new design of images in Scalismo. Discrete images are modelled as discrete fields, and thus have a domain and 
associated values attached to it. The points of the domain are represented using the class ```StructuredPoints```, which 
represent points that lie on a regular grid. Exploiting this special structure, we can efficiently access values 
associated to the grid points in the image, or use dedicated interpolation methods to swich from a discrete to a 
continuous representation. Once we have the continuous representation, we can discretize using a different domain, which 
allows us for example to resample the image in a different resolution, restrict the image to a part of the domain or even change the 
type of the domain. 
