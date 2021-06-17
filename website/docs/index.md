---
id: index
title: Scalismo tutorials
slug: /
---

The following tutorials explain all the basic concepts behind Scalismo, which are needed for developing complete shape modelling applications.
The intention behind these tutorials is not only to show how to use the software, but also to help understanding the theoretical concepts underlying the software.
Originally, these tutorials were designed as part of the Open Online Course [Statistical Shape Modelling - Computing the Human Anatomy](https://www.futurelearn.com/courses/statistical-shape-modelling).
Each tutorial contains links to videos and articles from the online course, which will
provide some theoretical background.

### Preparation

To run the code in the tutorials, you will need to setup a Scala project,
which depends on the latest Scalismo version.

If you are new to Scala and have never worked with Scala in an IDE, follow the instructions in the guides:

* [Using Scalismo in an IDE (article)](ide)
* [Getting started with Scalismo in IntelliJ IDEA (Video tutorial)](https://www.youtube.com/watch?v=E3br5-Yr-h8)

These guides will walk you through the steps of setting up a complete Scala programming environment, and importing a first project into an IDE.


If you are an experience Scala developer and you just want to use Scalismo as a library in an existing project, simply add the following lines to
your ```build.sbt```.

```scala
resolvers += Resolver.bintrayRepo("unibas-gravis", "maven")

libraryDependencies ++=
  Seq("ch.unibas.cs.gravis" %% "scalismo-ui" % "0.90.0")
```

### Tutorials

You will also need to [download](https://drive.switch.ch/index.php/s/zOJDpqh2ZGxzJJH) the datasets used in the tutorials and unzip them into your project folder.


* [Tutorial 1](tutorials/tutorial1): Hello Scalismo
* [Tutorial 2](tutorials/tutorial2): Rigid alignment
* [Tutorial 3](tutorials/tutorial3): From meshes to deformation fields
* [Tutorial 4](tutorials/tutorial4): Gaussian processes and Point Distribution Models
* [Tutorial 5](tutorials/tutorial5): Gaussian processes, sampling and marginalization
* [Tutorial 6](tutorials/tutorial6): Building a shape model from data
* [Tutorial 7](tutorials/tutorial7): Shape modelling with Gaussian processes and kernels
* [Tutorial 8](tutorials/tutorial8): Posterior Shape Models
* [Tutorial 9](tutorials/tutorial9): Shape completion using Gaussian process regression
* [Tutorial 10](tutorials/tutorial10): Iterative Closest Points for rigid alignment
* [Tutorial 11](tutorials/tutorial11): Model fitting with Iterative Closest Points
* [Tutorial 12](tutorials/tutorial12): Parametric, non-rigid registration
* [Tutorial 13](tutorials/tutorial13): Active Shape Models
* [Tutorial 14](tutorials/tutorial14): Model fitting using MCMC - The basic framework
* [Tutorial 15](tutorials/tutorial15): Model fitting using MCMC - Fitting a shape model


### Other guides

* [Visualizing with *Scalismo-ui*](scalismo-ui-introduction)

