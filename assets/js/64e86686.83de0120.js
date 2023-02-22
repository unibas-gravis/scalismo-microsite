"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[268],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return u}});var a=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=a.createContext({}),m=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=m(e.components);return a.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,r=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=m(n),u=o,h=d["".concat(l,".").concat(u)]||d[u]||c[u]||r;return n?a.createElement(h,i(i({ref:t},p),{},{components:n})):a.createElement(h,i({ref:t},p))}));function u(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=n.length,i=new Array(r);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var m=2;m<r;m++)i[m]=n[m];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},3818:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return m},toc:function(){return p},default:function(){return d}});var a=n(7462),o=n(3366),r=(n(7294),n(3905)),i=["components"],s={id:"tutorial03",title:"From meshes to deformation fields"},l=void 0,m={unversionedId:"Tutorials/tutorial03",id:"version-0.90/Tutorials/tutorial03",title:"From meshes to deformation fields",description:"In this tutorial, we show how the deformation fields that relate two meshes can be computed and visualized.",source:"@site/versioned_docs/version-0.90/Tutorials/tutorial03.md",sourceDirName:"Tutorials",slug:"/Tutorials/tutorial03",permalink:"/docs/0.90/Tutorials/tutorial03",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/versioned_docs/version-0.90/Tutorials/tutorial03.md",tags:[],version:"0.90",frontMatter:{id:"tutorial03",title:"From meshes to deformation fields"},sidebar:"docs",previous:{title:"Rigid Alignment",permalink:"/docs/0.90/Tutorials/tutorial02"},next:{title:"Gaussian processes and Point Distribution Models",permalink:"/docs/0.90/Tutorials/tutorial04"}},p=[{value:"Related resources",id:"related-resources",children:[],level:5},{value:"Preparation",id:"preparation",children:[],level:5},{value:"Representing meshes as deformations",id:"representing-meshes-as-deformations",children:[],level:3},{value:"Deformation fields over continuous domains:",id:"deformation-fields-over-continuous-domains",children:[],level:3},{value:"The mean deformation and the mean mesh",id:"the-mean-deformation-and-the-mean-mesh",children:[],level:3}],c={toc:p};function d(e){var t=e.components,s=(0,o.Z)(e,i);return(0,r.kt)("wrapper",(0,a.Z)({},c,s,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"In this tutorial, we show how the deformation fields that relate two meshes can be computed and visualized.")),(0,r.kt)("h5",{id:"related-resources"},"Related resources"),(0,r.kt)("p",null,"The following resources from our ",(0,r.kt)("a",{parentName:"p",href:"https://www.futurelearn.com/courses/statistical-shape-modelling"},"online course")," may provide\nsome helpful context for this tutorial:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Modelling Shape Deformations ",(0,r.kt)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250326"},"(Video)"))),(0,r.kt)("p",null,"To run the code from this tutorial, download the following Scala file:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{target:"_blank",href:n(284).Z},"Tutorial03.scala"))),(0,r.kt)("h5",{id:"preparation"},"Preparation"),(0,r.kt)("p",null,"As in the previous tutorials, we start by importing some commonly used objects and initializing the system."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},"import scalismo.geometry._\nimport scalismo.common._\nimport scalismo.transformations._\nimport scalismo.io.MeshIO\nimport scalismo.mesh.TriangleMesh\nimport scalismo.common.interpolation._\nimport scalismo.common.interpolation.TriangleMeshInterpolator3D\nimport scalismo.ui.api._\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},"scalismo.initialize()\nimplicit val rng = scalismo.utils.Random(42)\n\nval ui = ScalismoUI()\n")),(0,r.kt)("p",null,"We will also load three meshes and visualize them in Scalismo-ui."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},'import scalismo.io.MeshIO\n\nval dsGroup = ui.createGroup("datasets")\n\nval meshFiles = new java.io.File("datasets/testFaces/").listFiles.take(3)\nval (meshes, meshViews) = meshFiles.map(meshFile => {\n    val mesh = MeshIO.readMesh(meshFile).get\n    val meshView = ui.show(dsGroup, mesh, "mesh")\n    (mesh, meshView) // return a tuple of the mesh and the associated view\n}).unzip // take the tuples apart, to get a sequence of meshes and one of meshViews\n\n')),(0,r.kt)("h3",{id:"representing-meshes-as-deformations"},"Representing meshes as deformations"),(0,r.kt)("p",null,"In the following we show how we can represent a mesh as a reference mesh plus a deformation field. This is possible\nbecause the meshes are all in correspondence; I.e. they all have the same number of points and points with the same id in the meshes represent\nthe same point/region in the mesh."),(0,r.kt)("p",null,"Let's say ",(0,r.kt)("em",{parentName:"p"},"face_0"),", is the reference mesh:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},"val reference = meshes.head // face_0 is our reference\n")),(0,r.kt)("p",null,"Now any mesh, which is in correspondence with this reference, can be represented as a deformation field.\nThe deformation field is defined on this reference mesh; I.e. the points of\nthe reference mesh are the domain on which the deformation field is defined."),(0,r.kt)("p",null,"The deformations can be computed by taking the difference between the corresponding\npoint of the mesh and the reference:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},"val deformations : IndexedSeq[EuclideanVector[_3D]] =\n    reference.pointSet.pointIds.map {\n         id =>  meshes(1).pointSet.point(id) - reference.pointSet.point(id)\n    }.toIndexedSeq\n")),(0,r.kt)("p",null,"From these deformations, we can then create a ",(0,r.kt)("inlineCode",{parentName:"p"},"DiscreteVectorField"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},"val deformationField: DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = DiscreteField3D(reference, deformations)\n")),(0,r.kt)("p",null,"As for images, the deformation vector associated with a particular point id in a ",(0,r.kt)("em",{parentName:"p"},"DiscreteVectorField")," can be retrieved via its point id:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},"deformationField(PointId(0))\n")),(0,r.kt)("p",null,"We can visualize this deformation field in Scalismo-ui using the usual ",(0,r.kt)("inlineCode",{parentName:"p"},"show"),"\ncommand:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},'val deformationFieldView = ui.show(dsGroup, deformationField, "deformations")\n')),(0,r.kt)("p",null,"We can see that the deformation vectors indeed point from the reference to ",(0,r.kt)("em",{parentName:"p"},"face_1"),".\nTo see the effect better we need to remove ",(0,r.kt)("em",{parentName:"p"},"face2")," from the ui,\nmake the reference transparent"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},"meshViews(2).remove()\nmeshViews(0).opacity = 0.3\n")),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"Exercise: generate the rest of the deformation fields that represent the rest of the faces in the dataset and display them.")),(0,r.kt)("h3",{id:"deformation-fields-over-continuous-domains"},"Deformation fields over continuous domains:"),(0,r.kt)("p",null,"The deformation field that we computed above is discrete as it is\ndefined only over the mesh points. Since the real-world objects that we\nmodel are continuous, and the discretization of our meshes is rather\narbitrary, this is not ideal. In Scalismo we usually prefer to work with\ncontinuous domains.\nWhenever we have an object in Scalismo, which is defined on a discrete domain,\nwe can obtain a continuous representation, by means\nof interpolation."),(0,r.kt)("p",null,"To turn our deformation field into a continuous deformation field, we need to define an ",(0,r.kt)("inlineCode",{parentName:"p"},"Interpolator")," and call the ",(0,r.kt)("inlineCode",{parentName:"p"},"interpolate"),"\nmethod:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},"val interpolator = TriangleMeshInterpolator3D[EuclideanVector[_3D]]()\nval continuousDeformationField : Field[_3D, EuclideanVector[_3D]] = deformationField.interpolate(interpolator)\n")),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"The TriangleMeshInterpolator")," that we use here finds interpolates by finding for each point in the Euclidean space the closest\npoint on the surface and uses the corresponding deformation as the deformation at the given point. The point on the\nsurface is in turn obtained by barycentric interpolation of the corresponding vertex points. As a result of the interpolation,\nwe obtain a deformation field over the entire real space, which can be evaluated at any 3D Point:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},"continuousDeformationField(Point3D(-100,-100,-100))\n")),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"Remark: This approach is general: Any discrete object in Scalismo can be interpolated.\nIf we don't know anything about the structure of the domain, we can use the ",(0,r.kt)("inlineCode",{parentName:"em"},"NearestNeighborInterpolator"),".\nFor most domain, however, more specialised interpolators are defined. To interpolate an image for example,\nwe can use efficient linear or b-spline interpolation schemes.")),(0,r.kt)("h3",{id:"the-mean-deformation-and-the-mean-mesh"},"The mean deformation and the mean mesh"),(0,r.kt)("p",null,"Given a set of meshes, we are often interested to compute mesh that represents the mean shape.\nThis is equivalent to computing the mean deformation ",(0,r.kt)("span",{parentName:"p",className:"math math-inline"},(0,r.kt)("span",{parentName:"span",className:"katex"},(0,r.kt)("span",{parentName:"span",className:"katex-mathml"},(0,r.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,r.kt)("semantics",{parentName:"math"},(0,r.kt)("mrow",{parentName:"semantics"},(0,r.kt)("mover",{parentName:"mrow",accent:"true"},(0,r.kt)("mi",{parentName:"mover"},"u"),(0,r.kt)("mo",{parentName:"mover",stretchy:"true"},"\u203e"))),(0,r.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"\\overline{u}")))),(0,r.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,r.kt)("span",{parentName:"span",className:"base"},(0,r.kt)("span",{parentName:"span",className:"strut",style:{height:"0.63056em",verticalAlign:"0em"}}),(0,r.kt)("span",{parentName:"span",className:"mord overline"},(0,r.kt)("span",{parentName:"span",className:"vlist-t"},(0,r.kt)("span",{parentName:"span",className:"vlist-r"},(0,r.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.63056em"}},(0,r.kt)("span",{parentName:"span",style:{top:"-3em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"3em"}}),(0,r.kt)("span",{parentName:"span",className:"mord"},(0,r.kt)("span",{parentName:"span",className:"mord mathnormal"},"u"))),(0,r.kt)("span",{parentName:"span",style:{top:"-3.55056em"}},(0,r.kt)("span",{parentName:"span",className:"pstrut",style:{height:"3em"}}),(0,r.kt)("span",{parentName:"span",className:"overline-line",style:{borderBottomWidth:"0.04em"}})))))))))),", and to apply this deformation to them mean mesh."),(0,r.kt)("p",null,"To compute the mean deformation, we compute for each point in our mesh the sample mean of the\ndeformations at this point in the deformation fields:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},"\nval nMeshes = meshes.length\n\nval meanDeformations = reference.pointSet.pointIds.map( id => {\n\n  var meanDeformationForId = EuclideanVector3D(0, 0, 0)\n\n  val meanDeformations = meshes.foreach (mesh => { // loop through meshes\n    val deformationAtId = mesh.pointSet.point(id) - reference.pointSet.point(id)\n    meanDeformationForId += deformationAtId * (1.0 / nMeshes)\n  })\n\n  meanDeformationForId\n})\n\nval meanDeformationField = DiscreteField3D(reference, meanDeformations.toIndexedSeq)\n")),(0,r.kt)("p",null,"We can now apply the deformation to every point of the reference mesh, to obtain the mean mesh.\nTo do this, the easiest way is to first genenerate a transformation from the deformation field, which\nwe can use to map every point of the reference to its mean:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},"val continuousMeanDeformationField = meanDeformationField.interpolate(TriangleMeshInterpolator3D())\n\nval meanTransformation = Transformation((pt : Point[_3D]) => pt + continuousMeanDeformationField(pt))\n")),(0,r.kt)("p",null,"To obtain the mean mesh, we simply apply this transformation to the reference mesh:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},"val meanMesh = reference.transform(meanTransformation)\n")),(0,r.kt)("p",null,"Finally, we display the result:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},'ui.show(dsGroup, meanMesh, "mean mesh")\n')))}d.isMDXComponent=!0},284:function(e,t,n){t.Z=n.p+"assets/files/Tutorial03-7848810dea7a21f06f67edfc51abf731.scala"}}]);