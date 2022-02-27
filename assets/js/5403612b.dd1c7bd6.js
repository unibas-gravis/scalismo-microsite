"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9888],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return m}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=p(n),m=o,h=d["".concat(l,".").concat(m)]||d[m]||u[m]||i;return n?r.createElement(h,a(a({ref:t},c),{},{components:n})):r.createElement(h,a({ref:t},c))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,a[1]=s;for(var p=2;p<i;p++)a[p]=n[p];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},3551:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return p},toc:function(){return c},default:function(){return d}});var r=n(7462),o=n(3366),i=(n(7294),n(3905)),a=["components"],s={id:"tutorial11",title:"Model fitting with Iterative Closest Points"},l=void 0,p={unversionedId:"Tutorials/tutorial11",id:"Tutorials/tutorial11",title:"Model fitting with Iterative Closest Points",description:"The goal in this tutorial is to non-rigidly fit a shape model to a target surface using Iterative Closest Points (ICP)",source:"@site/docs/Tutorials/tutorial11.md",sourceDirName:"Tutorials",slug:"/Tutorials/tutorial11",permalink:"/docs/Tutorials/tutorial11",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Tutorials/tutorial11.md",tags:[],version:"current",frontMatter:{id:"tutorial11",title:"Model fitting with Iterative Closest Points"},sidebar:"docs",previous:{title:"Iterative Closest Points for rigid alignment",permalink:"/docs/Tutorials/tutorial10"},next:{title:"Parametric, non-rigid registration",permalink:"/docs/Tutorials/tutorial12"}},c=[{value:"Related resources",id:"related-resources",children:[],level:5},{value:"Preparation",id:"preparation",children:[],level:5},{value:"Problem setup",id:"problem-setup",children:[],level:3},{value:"Iterative Closest Points (ICP) and GP regression",id:"iterative-closest-points-icp-and-gp-regression",children:[],level:3}],u={toc:c};function d(e){var t=e.components,s=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,r.Z)({},u,s,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"The goal in this tutorial is to non-rigidly fit a shape model to a target surface using Iterative Closest Points (ICP)\nin order to establish correspondences among two surfaces."),(0,i.kt)("h5",{id:"related-resources"},"Related resources"),(0,i.kt)("p",null,"The following resources from our ",(0,i.kt)("a",{parentName:"p",href:"https://www.futurelearn.com/courses/statistical-shape-modelling"},"online course")," may provide\nsome helpful context for this tutorial:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Model-fitting and correspondence ",(0,i.kt)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250371"},"(Video)")),(0,i.kt)("li",{parentName:"ul"},"Model-fitting and the registration problem ",(0,i.kt)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250372"},"(Article)"))),(0,i.kt)("p",null,"To run the code from this tutorial, download the following Scala file:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{target:"_blank",href:n(6492).Z},"Tutorial11.scala"))),(0,i.kt)("h5",{id:"preparation"},"Preparation"),(0,i.kt)("p",null,"As in the previous tutorials, we start by importing some commonly used objects and initializing the system."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"import scalismo.geometry._\nimport scalismo.common._\nimport scalismo.mesh._\nimport scalismo.statisticalmodel.MultivariateNormalDistribution\nimport scalismo.numerics.UniformMeshSampler3D\nimport scalismo.io.{MeshIO, StatisticalModelIO, LandmarkIO}\n\nimport scalismo.ui.api._\n\nimport breeze.linalg.{DenseMatrix, DenseVector}\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"scalismo.initialize()\nimplicit val rng = scalismo.utils.Random(42)\n\nval ui = ScalismoUI()\n")),(0,i.kt)("h3",{id:"problem-setup"},"Problem setup"),(0,i.kt)("p",null,"Let's load and visualize a target mesh; I.e. a mesh, which we want to fit with our model, as well as\na statistical shape model."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},'val targetMesh = MeshIO.readMesh(new java.io.File("datasets/target.ply")).get\nval model = StatisticalModelIO.readStatisticalTriangleMeshModel3D(new java.io.File("datasets/bfm.h5")).get\n\nval targetGroup = ui.createGroup("targetGroup")\nval targetMeshView = ui.show(targetGroup, targetMesh, "targetMesh")\n\nval modelGroup = ui.createGroup("modelGroup")\nval modelView = ui.show(modelGroup, model, "model")\n')),(0,i.kt)("p",null,"As you can see in the 3D scene, the instance of the model taht we are currently displaying (the mean),\ndoes not resemble the target face. The goal in shape model fitting is to find an\ninstance of our shape model, which resembles at best the given target face.\nAs we will see, a good fit directly leads to a way of establishing correspondences between the points of our model and the points\nof the target shape."),(0,i.kt)("h3",{id:"iterative-closest-points-icp-and-gp-regression"},"Iterative Closest Points (ICP) and GP regression"),(0,i.kt)("p",null,"In a previous tutorial, we introduced rigid ICP to find the best rigid transformation between two meshes.\nWe recall that the main steps of the algorithms are as follows:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"Find ",(0,i.kt)("strong",{parentName:"li"},"candidate")," correspondences between the mesh to be aligned and the target one,\nby attributing the closest point on the target mesh as a candidate."),(0,i.kt)("li",{parentName:"ol"},"Solve for the best rigid transform between the moving mesh and the target mesh using Procrustes analysis."),(0,i.kt)("li",{parentName:"ol"},"Transform the moving mesh using the retrieved transform"),(0,i.kt)("li",{parentName:"ol"},"Loop to step 1 if the result is not aligned with the target (or if we didn't reach the limit number of iterations)")),(0,i.kt)("p",null,"The non-rigid ICP algorithm, which we can use for model fitting, will perform exactly the same steps.\nHowever, instead of finding a rigid transformation in step 2, it finds a non-rigid one, using\nGaussian process regression."),(0,i.kt)("p",null,"We start by first selecting the points for which we want to find the correspondences. We choose uniformly distributed\npoints on the surface, which we can obtain as follows:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val sampler = UniformMeshSampler3D(model.reference, numberOfPoints = 5000)\nval points : Seq[Point[_3D]] = sampler.sample.map(pointWithProbability => pointWithProbability._1) // we only want the points\n")),(0,i.kt)("p",null,"Instead of working directly with the points, it is easier to work with the point ids of the sampled points:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val ptIds = points.map(point => model.reference.pointSet.findClosestPoint(point).id)\n")),(0,i.kt)("p",null,"As in the previous tutorial, we write the method ",(0,i.kt)("inlineCode",{parentName:"p"},"attributeCorrespondences"),", which finds for each\npoint of interest the closest point on the target."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"def attributeCorrespondences(movingMesh: TriangleMesh[_3D], ptIds : Seq[PointId]) : Seq[(PointId, Point[_3D])] = {\n  ptIds.map{ id : PointId =>\n    val pt = movingMesh.pointSet.point(id)\n    val closestPointOnMesh2 = targetMesh.pointSet.findClosestPoint(pt).point\n    (id, closestPointOnMesh2)\n  }\n}\n")),(0,i.kt)("p",null,"We can now use the correspondences we found to compute a Gaussian process regression."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},'\nval correspondences = attributeCorrespondences(model.mean, ptIds)\n\nval littleNoise = MultivariateNormalDistribution(DenseVector.zeros[Double](3), DenseMatrix.eye[Double](3))\n\ndef fitModel(correspondences: Seq[(PointId, Point[_3D])]) : TriangleMesh[_3D] = {\n  val regressionData = correspondences.map(correspondence =>\n    (correspondence._1, correspondence._2, littleNoise)\n  )\n  val posterior = model.posterior(regressionData.toIndexedSeq)\n  posterior.mean\n}\n\nval fit = fitModel(correspondences)\nval resultGroup = ui.createGroup("results")\nval fitResultView = ui.show(resultGroup, fit, "fit")\n')),(0,i.kt)("p",null,"While this one fitting iteration does not bring the points where we would like them to have, we are already\na step closer. As in the Rigid ICP case, we now iterate the procedure."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"def nonrigidICP(movingMesh: TriangleMesh[_3D], ptIds : Seq[PointId], numberOfIterations : Int) : TriangleMesh[_3D] = {\n  if (numberOfIterations == 0) movingMesh\n  else {\n    val correspondences = attributeCorrespondences(movingMesh, ptIds)\n    val transformed = fitModel(correspondences)\n\n    nonrigidICP(transformed, ptIds, numberOfIterations - 1)\n  }\n}\n")),(0,i.kt)("p",null,"Repeating the fitting steps iteratively for 20 times results in a good fit of our model"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},'val finalFit = nonrigidICP( model.mean, ptIds, 20)\n\nui.show(resultGroup, finalFit, "final fit")\n')))}d.isMDXComponent=!0},6492:function(e,t,n){t.Z=n.p+"assets/files/Tutorial11-310ddd9cb17dd12fe2c1fa0e0bbcef43.scala"}}]);