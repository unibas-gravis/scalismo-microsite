(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{159:function(e,t,n){"use strict";n.d(t,"a",(function(){return p})),n.d(t,"b",(function(){return u}));var a=n(0),o=n.n(a);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,o=function(e,t){if(null==e)return{};var n,a,o={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=o.a.createContext({}),m=function(e){var t=o.a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},p=function(e){var t=m(e.components);return o.a.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},h=o.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,i=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=m(n),h=a,u=p["".concat(i,".").concat(h)]||p[h]||d[h]||r;return n?o.a.createElement(u,s(s({ref:t},c),{},{components:n})):o.a.createElement(u,s({ref:t},c))}));function u(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,i=new Array(r);i[0]=h;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var c=2;c<r;c++)i[c]=n[c];return o.a.createElement.apply(null,i)}return o.a.createElement.apply(null,n)}h.displayName="MDXCreateElement"},74:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return s})),n.d(t,"metadata",(function(){return l})),n.d(t,"rightToc",(function(){return c})),n.d(t,"default",(function(){return p}));var a=n(3),o=n(7),r=(n(0),n(159)),i=["components"],s={id:"tutorial3",title:"From meshes to deformation fields"},l={unversionedId:"tutorials/tutorial3",id:"tutorials/tutorial3",isDocsHomePage:!1,title:"From meshes to deformation fields",description:"In this tutorial, we show how the deformation fields that relate two meshes can be computed and visualized.",source:"@site/docs/tutorials/tutorial3.md",slug:"/tutorials/tutorial3",permalink:"/docs/next/tutorials/tutorial3",editUrl:"https://github.com/unibas-gravis/scalismo-microsite/edit/master/website/docs/tutorials/tutorial3.md",version:"current",sidebar:"docs",previous:{title:"Rigid Alignment",permalink:"/docs/next/tutorials/tutorial2"},next:{title:"Gaussian processes and Point Distribution Models",permalink:"/docs/next/tutorials/tutorial4"}},c=[{value:"Representing meshes as deformations",id:"representing-meshes-as-deformations",children:[]},{value:"Deformation fields over continuous domains:",id:"deformation-fields-over-continuous-domains",children:[]},{value:"The mean deformation and the mean mesh",id:"the-mean-deformation-and-the-mean-mesh",children:[]}],m={rightToc:c};function p(e){var t=e.components,n=Object(o.a)(e,i);return Object(r.b)("wrapper",Object(a.a)({},m,n,{components:t,mdxType:"MDXLayout"}),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"In this tutorial, we show how the deformation fields that relate two meshes can be computed and visualized.")),Object(r.b)("h5",{id:"related-resources"},"Related resources"),Object(r.b)("p",null,"The following resources from our ",Object(r.b)("a",{parentName:"p",href:"https://www.futurelearn.com/courses/statistical-shape-modelling"},"online course")," may provide\nsome helpful context for this tutorial:"),Object(r.b)("ul",null,Object(r.b)("li",{parentName:"ul"},"Modelling Shape Deformations ",Object(r.b)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250326"},"(Video)"))),Object(r.b)("h5",{id:"preparation"},"Preparation"),Object(r.b)("p",null,"As in the previous tutorials, we start by importing some commonly used objects and initializing the system."),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-scala"},"import scalismo.geometry._\nimport scalismo.common._\nimport scalismo.transformations._\nimport scalismo.io.MeshIO\nimport scalismo.mesh.TriangleMesh\nimport scalismo.common.interpolation._\nimport scalismo.common.interpolation.TriangleMeshInterpolator3D\nimport scalismo.ui.api._\n\nscalismo.initialize()\nimplicit val rng = scalismo.utils.Random(42)\n\nval ui = ScalismoUI()\n")),Object(r.b)("p",null,"We will also load three meshes and visualize them in Scalismo-ui."),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-scala"},'import scalismo.io.MeshIO\n\nval dsGroup = ui.createGroup("datasets")\n\nval meshFiles = new java.io.File("datasets/testFaces/").listFiles.take(3)\nval (meshes, meshViews) = meshFiles.map(meshFile => {\n    val mesh = MeshIO.readMesh(meshFile).get\n    val meshView = ui.show(dsGroup, mesh, "mesh")\n    (mesh, meshView) // return a tuple of the mesh and the associated view\n}).unzip // take the tuples apart, to get a sequence of meshes and one of meshViews\n\n')),Object(r.b)("h3",{id:"representing-meshes-as-deformations"},"Representing meshes as deformations"),Object(r.b)("p",null,"In the following we show how we can represent a mesh as a reference mesh plus a deformation field. This is possible\nbecause the meshes are all in correspondence; I.e. they all have the same number of points and points with the same id in the meshes represent\nthe same point/region in the mesh."),Object(r.b)("p",null,"Let's say ",Object(r.b)("em",{parentName:"p"},"face_0"),", is the reference mesh:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-scala"},"val reference = meshes.head // face_0 is our reference\n")),Object(r.b)("p",null,"Now any mesh, which is in correspondence with this reference, can be represented as a deformation field.\nThe deformation field is defined on this reference mesh; I.e. the points of\nthe reference mesh are the domain on which the deformation field is defined."),Object(r.b)("p",null,"The deformations can be computed by taking the difference between the corresponding\npoint of the mesh and the reference:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-scala"},"val deformations : IndexedSeq[EuclideanVector[_3D]] =\n    reference.pointSet.pointIds.map {\n         id =>  meshes(1).pointSet.point(id) - reference.pointSet.point(id)\n    }.toIndexedSeq\n")),Object(r.b)("p",null,"From these deformations, we can then create a ",Object(r.b)("inlineCode",{parentName:"p"},"DiscreteVectorField"),":"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-scala"},"val deformationField: DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = DiscreteField3D(reference, deformations)\n")),Object(r.b)("p",null,"As for images, the deformation vector associated with a particular point id in a ",Object(r.b)("em",{parentName:"p"},"DiscreteVectorField")," can be retrieved via its point id:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-scala"},"deformationField(PointId(0))\n// res1: EuclideanVector[_3D] = EuclideanVector3D(\n//   -0.031402587890625,\n//   -0.24579620361328125,\n//   4.780601501464844\n// )\n")),Object(r.b)("p",null,"We can visualize this deformation field in Scalismo-ui using the usual ",Object(r.b)("inlineCode",{parentName:"p"},"show"),"\ncommand:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-scala"},'val deformationFieldView = ui.show(dsGroup, deformationField, "deformations")\n')),Object(r.b)("p",null,"We can see that the deformation vectors indeed point from the reference to ",Object(r.b)("em",{parentName:"p"},"face_1"),".\nTo see the effect better we need to remove ",Object(r.b)("em",{parentName:"p"},"face2")," from the ui,\nmake the reference transparent"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-scala"},"meshViews(2).remove()\nmeshViews(0).opacity = 0.3\n")),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Exercise: generate the rest of the deformation fields that represent the rest of the faces in the dataset and display them.")),Object(r.b)("h3",{id:"deformation-fields-over-continuous-domains"},"Deformation fields over continuous domains:"),Object(r.b)("p",null,"The deformation field that we computed above is discrete as it is\ndefined only over the mesh points. Since the real-world objects that we\nmodel are continuous, and the discretization of our meshes is rather\narbitrary, this is not ideal. In Scalismo we usually prefer to work with\ncontinuous domains.\nWhenever we have an object in Scalismo, which is defined on a discrete domain,\nwe can obtain a continuous representation, by means\nof interpolation."),Object(r.b)("p",null,"To turn our deformation field into a continuous deformation field, we need to define an ",Object(r.b)("inlineCode",{parentName:"p"},"Interpolator")," and call the ",Object(r.b)("inlineCode",{parentName:"p"},"interpolate"),"\nmethod:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-scala"},"val interpolator = TriangleMeshInterpolator3D[EuclideanVector[_3D]]()\nval continuousDeformationField : Field[_3D, EuclideanVector[_3D]] = deformationField.interpolate(interpolator)\n")),Object(r.b)("p",null,Object(r.b)("inlineCode",{parentName:"p"},"The TriangleMeshInterpolator")," that we use here finds interpolates by finding for each point in the Euclidean space the closest\npoint on the surface and uses the corresponding deformation as the deformation at the given point. The point on the\nsurface is in turn obtained by barycentric interpolation of the corresponding vertex points. As a result of the interpolation,\nwe obtain a deformation field over the entire real space, which can be evaluated at any 3D Point:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-scala"},"continuousDeformationField(Point3D(-100,-100,-100))\n// res4: EuclideanVector[_3D] = EuclideanVector3D(\n//   7.903905081209915,\n//   1.533905050608121,\n//   -6.654507430739976\n// )\n")),Object(r.b)("p",null,Object(r.b)("em",{parentName:"p"},"Remark: This approach is general: Any discrete object in Scalismo can be interpolated.\nIf we don't know anything about the structure of the domain, we can use the ",Object(r.b)("inlineCode",{parentName:"em"},"NearestNeighborInterpolator"),".\nFor most domain, however, more specialised interpolators are defined. To interpolate an image for example,\nwe can use efficient linear or b-spline interpolation schemes.")),Object(r.b)("h3",{id:"the-mean-deformation-and-the-mean-mesh"},"The mean deformation and the mean mesh"),Object(r.b)("p",null,"Given a set of meshes, we are often interested to compute mesh that represents the mean shape.\nThis is equivalent to computing the mean deformation ",Object(r.b)("span",{parentName:"p",className:"math math-inline"},Object(r.b)("span",{parentName:"span",className:"katex"},Object(r.b)("span",{parentName:"span",className:"katex-mathml"},Object(r.b)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},Object(r.b)("semantics",{parentName:"math"},Object(r.b)("mrow",{parentName:"semantics"},Object(r.b)("mover",{parentName:"mrow",accent:"true"},Object(r.b)("mi",{parentName:"mover"},"u"),Object(r.b)("mo",{parentName:"mover",stretchy:"true"},"\u203e"))),Object(r.b)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"\\overline{u}")))),Object(r.b)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},Object(r.b)("span",{parentName:"span",className:"base"},Object(r.b)("span",{parentName:"span",className:"strut",style:{height:"0.63056em",verticalAlign:"0em"}}),Object(r.b)("span",{parentName:"span",className:"mord overline"},Object(r.b)("span",{parentName:"span",className:"vlist-t"},Object(r.b)("span",{parentName:"span",className:"vlist-r"},Object(r.b)("span",{parentName:"span",className:"vlist",style:{height:"0.63056em"}},Object(r.b)("span",{parentName:"span",style:{top:"-3em"}},Object(r.b)("span",{parentName:"span",className:"pstrut",style:{height:"3em"}}),Object(r.b)("span",{parentName:"span",className:"mord"},Object(r.b)("span",{parentName:"span",className:"mord mathdefault"},"u"))),Object(r.b)("span",{parentName:"span",style:{top:"-3.55056em"}},Object(r.b)("span",{parentName:"span",className:"pstrut",style:{height:"3em"}}),Object(r.b)("span",{parentName:"span",className:"overline-line",style:{borderBottomWidth:"0.04em"}})))))))))),", and to apply this deformation to them mean mesh."),Object(r.b)("p",null,"To compute the mean deformation, we compute for each point in our mesh the sample mean of the\ndeformations at this point in the deformation fields:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-scala"},"\nval nMeshes = meshes.length\n\nval meanDeformations = reference.pointSet.pointIds.map( id => {\n\n  var meanDeformationForId = EuclideanVector3D(0, 0, 0)\n\n  val meanDeformations = meshes.foreach (mesh => { // loop through meshes\n    val deformationAtId = mesh.pointSet.point(id) - reference.pointSet.point(id)\n    meanDeformationForId += deformationAtId * (1.0 / nMeshes)\n  })\n\n  meanDeformationForId\n})\n\nval meanDeformationField = DiscreteField3D(reference, meanDeformations.toIndexedSeq)\n")),Object(r.b)("p",null,"We can now apply the deformation to every point of the reference mesh, to obtain the mean mesh.\nTo do this, the easiest way is to first genenerate a transformation from the deformation field, which\nwe can use to map every point of the reference to its mean:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-scala"},"val continuousMeanDeformationField = meanDeformationField.interpolate(TriangleMeshInterpolator3D())\n\nval meanTransformation = Transformation((pt : Point[_3D]) => pt + continuousMeanDeformationField(pt))\n")),Object(r.b)("p",null,"To obtain the mean mesh, we simply apply this transformation to the reference mesh:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-scala"},"val meanMesh = reference.transform(meanTransformation)\n")),Object(r.b)("p",null,"Finally, we display the result:"),Object(r.b)("pre",null,Object(r.b)("code",{parentName:"pre",className:"language-scala"},'ui.show(dsGroup, meanMesh, "mean mesh")\n')))}p.isMDXComponent=!0}}]);