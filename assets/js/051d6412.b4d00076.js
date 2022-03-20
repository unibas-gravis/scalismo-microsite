"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5086],{3905:function(e,a,t){t.d(a,{Zo:function(){return p},kt:function(){return u}});var n=t(7294);function r(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function o(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?o(Object(t),!0).forEach((function(a){r(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function l(e,a){if(null==e)return{};var t,n,r=function(e,a){if(null==e)return{};var t,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],a.indexOf(t)>=0||(r[t]=e[t]);return r}(e,a);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var s=n.createContext({}),m=function(e){var a=n.useContext(s),t=a;return e&&(t="function"==typeof e?e(a):i(i({},a),e)),t},p=function(e){var a=m(e.components);return n.createElement(s.Provider,{value:a},e.children)},d={inlineCode:"code",wrapper:function(e){var a=e.children;return n.createElement(n.Fragment,{},a)}},c=n.forwardRef((function(e,a){var t=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),c=m(t),u=r,f=c["".concat(s,".").concat(u)]||c[u]||d[u]||o;return t?n.createElement(f,i(i({ref:a},p),{},{components:t})):n.createElement(f,i({ref:a},p))}));function u(e,a){var t=arguments,r=a&&a.mdxType;if("string"==typeof e||r){var o=t.length,i=new Array(o);i[0]=c;var l={};for(var s in a)hasOwnProperty.call(a,s)&&(l[s]=a[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var m=2;m<o;m++)i[m]=t[m];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}c.displayName="MDXCreateElement"},5347:function(e,a,t){t.r(a),t.d(a,{frontMatter:function(){return l},contentTitle:function(){return s},metadata:function(){return m},toc:function(){return p},default:function(){return c}});var n=t(7462),r=t(3366),o=(t(7294),t(3905)),i=["components"],l={id:"tutorial02",title:"Rigid Alignment"},s=void 0,m={unversionedId:"Tutorials/tutorial02",id:"Tutorials/tutorial02",title:"Rigid Alignment",description:"In this tutorial we show how rigid alignment of shapes can be performed in Scalismo.",source:"@site/docs/Tutorials/tutorial02.md",sourceDirName:"Tutorials",slug:"/Tutorials/tutorial02",permalink:"/docs/next/Tutorials/tutorial02",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Tutorials/tutorial02.md",tags:[],version:"current",frontMatter:{id:"tutorial02",title:"Rigid Alignment"},sidebar:"docs",previous:{title:"Hello Scalismo!",permalink:"/docs/next/Tutorials/tutorial01"},next:{title:"From meshes to deformation fields",permalink:"/docs/next/Tutorials/tutorial03"}},p=[{value:"Related resources",id:"related-resources",children:[],level:5},{value:"Preparation",id:"preparation",children:[],level:5},{value:"Quick view on Transformations",id:"quick-view-on-transformations",children:[],level:3},{value:"Composing transformations",id:"composing-transformations",children:[],level:3},{value:"Rigid alignment",id:"rigid-alignment",children:[],level:3}],d={toc:p};function c(e){var a=e.components,l=(0,r.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},d,l,{components:a,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"In this tutorial we show how rigid alignment of shapes can be performed in Scalismo."),(0,o.kt)("h5",{id:"related-resources"},"Related resources"),(0,o.kt)("p",null,"The following resources from our ",(0,o.kt)("a",{parentName:"p",href:"https://www.futurelearn.com/courses/statistical-shape-modelling"},"online course")," may provide\nsome helpful context for this tutorial:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Learning a model from example data ",(0,o.kt)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250329"},"(Video)")),(0,o.kt)("li",{parentName:"ul"},"Superimposing shapes ",(0,o.kt)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250330"},"(Article)"))),(0,o.kt)("p",null,"To run the code from this tutorial, download the following Scala file:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{target:"_blank",href:t(8850).Z},"Tutorial02.scala"))),(0,o.kt)("h5",{id:"preparation"},"Preparation"),(0,o.kt)("p",null,"As in the previous tutorials, we start by importing some commonly used objects and initializing the system."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"import scalismo.geometry._\nimport scalismo.common._\nimport scalismo.mesh.TriangleMesh\nimport scalismo.transformations._\nimport scalismo.io.MeshIO\nimport scalismo.ui.api._\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"scalismo.initialize()\nimplicit val rng: scalismo.utils.Random = scalismo.utils.Random(42)\n")),(0,o.kt)("h3",{id:"quick-view-on-transformations"},"Quick view on Transformations"),(0,o.kt)("p",null,"Let's start by loading and showing Paola's mesh again:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},'val ui = ScalismoUI()\nval paolaGroup = ui.createGroup("paola")\n\nval mesh: TriangleMesh[_3D] = MeshIO.readMesh(new java.io.File("datasets/Paola.ply")).get\nval meshView = ui.show(paolaGroup, mesh, "Paola")\n')),(0,o.kt)("p",null,"Scalismo allows us to perform geometric transformations on meshes."),(0,o.kt)("p",null,"Transformations are ",(0,o.kt)("em",{parentName:"p"},"functions")," that map a given point, into a new ",(0,o.kt)("em",{parentName:"p"},"transformed")," point.\nThe most general way to define a transformation is by specifying the transformation function\nexplicitly. The following example illustrates this by defining a transformation,\nwhich flips the point along the x axis."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"val flipTransform = Transformation((p: Point[_3D]) => Point3D(-p.x, p.y, p.z))\n")),(0,o.kt)("p",null,"When given a point as an argument, the defined transform will then simply return a new point:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"val pt: Point[_3D] = flipTransform(Point3D(1.0, 1.0, 1.0))\n")),(0,o.kt)("p",null,"An important class of transformations are the rigid transformation, i.e. a rotation followed by a translation. Due to their\nimportance, these transformations are readily defined in scalismo."),(0,o.kt)("p",null,"A translation can be defined by specifying the translation vector, which is\nadded to every point:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"val translation = Translation3D(EuclideanVector3D(100, 0, 0))\n")),(0,o.kt)("p",null,"For defining a rotation, we define the 3 ",(0,o.kt)("a",{parentName:"p",href:"https://en.wikipedia.org/wiki/Euler_angles"},"Euler angles")," , as well as the center of rotation."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"val rotationCenter = Point3D(0.0, 0.0, 0.0)\nval rotation: Rotation[_3D] = Rotation3D(0f, 3.14f, 0f, rotationCenter)\n")),(0,o.kt)("p",null,"This transformation rotates every point with approximately 180 degrees around the Y axis (centered at the origin of the space)."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"val pt2: Point[_3D] = rotation(Point(1, 1, 1))\n")),(0,o.kt)("p",null,"In Scalismo, such transformations can be applied not only to single points, but most collections of points such as triangle meshes, can be\ntransformed by invoking the method ",(0,o.kt)("inlineCode",{parentName:"p"},"transform")," on the respective object."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},'val translatedPaola: TriangleMesh[_3D] = mesh.transform(translation)\nval paolaMeshTranslatedView = ui.show(paolaGroup, translatedPaola, "translatedPaola")\n')),(0,o.kt)("h3",{id:"composing-transformations"},"Composing transformations"),(0,o.kt)("p",null,"Simple transformations can be composed to more complicated ones using the ",(0,o.kt)("inlineCode",{parentName:"p"},"compose")," method. For example, we can define a rigid\ntranformation as a composition of translation and rotation:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"val rigidTransform1 = CompositeTransformation(translation, rotation)\n")),(0,o.kt)("p",null,"In Scalismo, rigid transformations are also already predefined. We could have written instead:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"val rigidTransform2 : RigidTransformation[_3D] = TranslationAfterRotation3D(translation, rotation)\n")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"Exercise: Apply the rotation transform to the original mesh of Paola and show the result")),(0,o.kt)("p",null,(0,o.kt)("em",{parentName:"p"},"Note: since the rotation is around the origin, you might have to zoom out (hold right click and drag down) to see the result.")),(0,o.kt)("h3",{id:"rigid-alignment"},"Rigid alignment"),(0,o.kt)("p",null,"A task that we need to perform in any shape modelling pipeline, is the rigid alignment of objects; I.e. normalizing the pose of\nan object with respect to some reference."),(0,o.kt)("p",null,"To illustrate this procedure, we transform the mesh of Paola rigidly using the\nrigid transformation defined above."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},'val paolaTransformedGroup = ui.createGroup("paolaTransformed")\nval paolaTransformed = mesh.transform(rigidTransform2)\nui.show(paolaTransformedGroup, paolaTransformed, "paolaTransformed")\n')),(0,o.kt)("p",null,"The task is now to retrieve the transformation, which best aligns the transformed mesh\nwith the original mesh, from the meshes alone."),(0,o.kt)("p",null,"Rigid alignment is easiest if we already know some corresponding points in both shapes. Assume for the moment, that we\nhave identified a few corresponding points and marked them using landmarks. We can then apply ",(0,o.kt)("em",{parentName:"p"},"Procrustes Analysis"),".\nUsually, these landmarks would need to be clicked manually in a GUI, saved to disk and then loaded in Scalismo using the\nmethods in ",(0,o.kt)("inlineCode",{parentName:"p"}," LandmarksIO"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala",metastring:"emptyLines:2","emptyLines:2":!0},'val landmarks : Seq[Landmark[_3D]] = LandmarkIO.readLandmarksJson3D(new java.io.File("landmarks.json")).get\n')),(0,o.kt)("p",null,"To simplify this tutorial, we exploit that the two meshes\nare the same and hence have the same point ids. We can thus define landmarks programmatically:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},'val ptIds = Seq(PointId(2213), PointId(14727), PointId(8320), PointId(48182))\nval paolaLandmarks = ptIds.map(pId => Landmark(s"lm-${pId.id}", mesh.pointSet.point(pId)))\nval paolaTransformedLandmarks = ptIds.map(pId => Landmark(s"lm-${pId.id}", paolaTransformed.pointSet.point(pId)))\n\nval paolaLandmarkViews = paolaLandmarks.map(lm => ui.show(paolaGroup, lm, s"${lm.id}"))\nval paolaTransformedLandmarkViews = paolaTransformedLandmarks.map(lm => ui.show(paolaTransformedGroup, lm, lm.id))\n')),(0,o.kt)("p",null,"Given this lists of landmarks, we can use the method ",(0,o.kt)("inlineCode",{parentName:"p"},"rigid3DLandmarkRegistration"),"\nto retrieve the best rigid transformation from the original set of landmarks:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"import scalismo.registration.LandmarkRegistration\n\nval bestTransform : RigidTransformation[_3D] = LandmarkRegistration.rigid3DLandmarkRegistration(paolaLandmarks, paolaTransformedLandmarks, center = Point(0, 0, 0))\n")),(0,o.kt)("p",null,"The resulting transformation is the best possible rigid transformation (with rotation center ",(0,o.kt)("inlineCode",{parentName:"p"},"Point(0,0,0)"),") from ",(0,o.kt)("inlineCode",{parentName:"p"},"paolaLandmarks")," to ",(0,o.kt)("inlineCode",{parentName:"p"},"paolaTransformedLandmarks"),".\nBest here means, that it minimizes the mean squared error over the landmark points."),(0,o.kt)("p",null,"Let's now apply it to the original set of landmarks, to see how well they are transformed :"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},'val transformedLms = paolaLandmarks.map(lm => lm.transform(bestTransform))\nval landmarkViews = ui.show(paolaGroup, transformedLms, "transformedLMs")\n')),(0,o.kt)("p",null,"And finally, we apply the transformation to the entire mesh:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},'val alignedPaola = mesh.transform(bestTransform)\nval alignedPaolaView = ui.show(paolaGroup, alignedPaola, "alignedPaola")\nalignedPaolaView.color = java.awt.Color.RED\n')))}c.isMDXComponent=!0},8850:function(e,a,t){a.Z=t.p+"assets/files/Tutorial02-215fc912226933e454c2ecec0fe4b74f.scala"}}]);