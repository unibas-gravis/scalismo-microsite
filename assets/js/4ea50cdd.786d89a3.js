"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5017],{3905:function(e,t,a){a.d(t,{Zo:function(){return u},kt:function(){return d}});var n=a(7294);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}var l=n.createContext({}),c=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},u=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var a=e.components,i=e.mdxType,r=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=c(a),d=i,h=p["".concat(l,".").concat(d)]||p[d]||m[d]||r;return a?n.createElement(h,o(o({ref:t},u),{},{components:a})):n.createElement(h,o({ref:t},u))}));function d(e,t){var a=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=a.length,o=new Array(r);o[0]=p;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var c=2;c<r;c++)o[c]=a[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}p.displayName="MDXCreateElement"},9012:function(e,t,a){a.r(t),a.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return u},default:function(){return p}});var n=a(7462),i=a(3366),r=(a(7294),a(3905)),o=["components"],s={id:"tutorial04",title:"Gaussian processes and Point Distribution Models"},l=void 0,c={unversionedId:"Tutorials/tutorial04",id:"version-0.91.0/Tutorials/tutorial04",title:"Gaussian processes and Point Distribution Models",description:"With this tutorial we aim at illuminating the relationship between Point Distribution Models (PDM) and Gaussian Processes.",source:"@site/versioned_docs/version-0.91.0/Tutorials/tutorial04.md",sourceDirName:"Tutorials",slug:"/Tutorials/tutorial04",permalink:"/docs/0.91.0/Tutorials/tutorial04",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/versioned_docs/version-0.91.0/Tutorials/tutorial04.md",tags:[],version:"0.91.0",frontMatter:{id:"tutorial04",title:"Gaussian processes and Point Distribution Models"},sidebar:"docs",previous:{title:"From meshes to deformation fields",permalink:"/docs/0.91.0/Tutorials/tutorial03"},next:{title:"Gaussian processes, sampling and marginalization",permalink:"/docs/0.91.0/Tutorials/tutorial05"}},u=[{value:"Related resources",id:"related-resources",children:[],level:5},{value:"Preparation",id:"preparation",children:[],level:5},{value:"Gaussian Processes and Point Distribution Models",id:"gaussian-processes-and-point-distribution-models",children:[{value:"The GP behind the PDM:",id:"the-gp-behind-the-pdm",children:[{value:"Exercise : Zoom in on the scene and observe the deformation field. Where are the vectors starting",id:"exercise--zoom-in-on-the-scene-and-observe-the-deformation-field-where-are-the-vectors-starting",children:[],level:5}],level:4}],level:2}],m={toc:u};function p(e){var t=e.components,s=(0,i.Z)(e,o);return(0,r.kt)("wrapper",(0,n.Z)({},m,s,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"With this tutorial we aim at illuminating the relationship between Point Distribution Models (PDM) and Gaussian Processes."),(0,r.kt)("h5",{id:"related-resources"},"Related resources"),(0,r.kt)("p",null,"The following resources from our ",(0,r.kt)("a",{parentName:"p",href:"https://www.futurelearn.com/courses/statistical-shape-modelling"},"online course")," may provide\nsome helpful context for this tutorial:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Learning a model from example data ",(0,r.kt)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250329"},"(Video)"))),(0,r.kt)("p",null,"To run the code from this tutorial, download the following Scala file:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{target:"_blank",href:a(8419).Z},"Tutorial04.scala"))),(0,r.kt)("h5",{id:"preparation"},"Preparation"),(0,r.kt)("p",null,"As in the previous tutorials, we start by importing some commonly used objects and initializing the system."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},"import scalismo.geometry._\nimport scalismo.common._\nimport scalismo.mesh._\nimport scalismo.io.{StatismoIO, StatisticalModelIO}\nimport scalismo.statisticalmodel._\nimport scalismo.ui.api._\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},"scalismo.initialize()\nimplicit val rng: scalismo.utils.Random = scalismo.utils.Random(42)\n\nval ui = ScalismoUI()\n")),(0,r.kt)("h2",{id:"gaussian-processes-and-point-distribution-models"},"Gaussian Processes and Point Distribution Models"),(0,r.kt)("p",null,"We start by loading and visualizing a shape model (or PDM) of faces :"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},'val faceModel : PointDistributionModel[_3D, TriangleMesh] = StatisticalModelIO.readStatisticalTriangleMeshModel3D(new java.io.File("datasets/bfm.h5")).get\nval modelGroup = ui.createGroup("model")\n')),(0,r.kt)("p",null,"This model represents a ",(0,r.kt)("strong",{parentName:"p"},"probability distribution of face meshes"),"."),(0,r.kt)("p",null,"While we cannot visualize this distribution directly, we can obtain\nand visualize the mean shape:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},'val sampleGroup = ui.createGroup("samples")\n\nval meanFace : TriangleMesh[_3D] = faceModel.mean\nui.show(sampleGroup, meanFace, "meanFace")\n')),(0,r.kt)("p",null,"or we can obtain concrete face meshes by sampling from it:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},'val sampledFace : TriangleMesh[_3D] = faceModel.sample()\nui.show(sampleGroup, sampledFace, "randomFace")\n')),(0,r.kt)("h4",{id:"the-gp-behind-the-pdm"},"The GP behind the PDM:"),(0,r.kt)("p",null,"In Scalismo, a PDM is represented as a triangle mesh (called the reference mesh)\non which a Gaussian Process over deformation fields is defined:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},"val reference : TriangleMesh[_3D] = faceModel.reference\nval faceGP : DiscreteLowRankGaussianProcess[_3D, TriangleMesh, EuclideanVector[_3D]] = faceModel.gp\n")),(0,r.kt)("p",null,"The type signature of the GP looks slightly scary.\nIf we recall that a Gaussian process is a distribution over functions,\nwe can, however, rather easily make sense of the individual bits.\nThe type signature tells us that:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"It is a DiscreteGaussianProcess. This means, the function, which the process models are defined on a discrete, finite set of points."),(0,r.kt)("li",{parentName:"ul"},"It is defined in 3D Space (indicated by the type parameter ",(0,r.kt)("inlineCode",{parentName:"li"},"_3D"),")"),(0,r.kt)("li",{parentName:"ul"},"Its domain of the modeled functions is a ",(0,r.kt)("inlineCode",{parentName:"li"},"TriangleMesh")),(0,r.kt)("li",{parentName:"ul"},"The values of the modeled functions are vectors (more precisely, they are of type ",(0,r.kt)("inlineCode",{parentName:"li"},"EuclideanVector"),")."),(0,r.kt)("li",{parentName:"ul"},"It is represented using a low-rank approximation. This is a technicality, which we will come back to later.")),(0,r.kt)("p",null,"Consequently, when we draw samples or obtain the mean from the Gaussian process, we expect to obtain functions with a matching\nsignature. This is indeed the case"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},"val meanDeformation : DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = faceGP.mean\nval sampleDeformation : DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = faceGP.sample()\n")),(0,r.kt)("p",null,"Let's visualize the mean deformation:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-scala"},'ui.show(sampleGroup, meanDeformation, "meanField")\n')),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},'Exercise : make everything invisible in the 3D scene, except for "meanField" and "meanFace". Now zoom in (right click and drag) on the vector field. Where are the tips of the vectors ending?*')),(0,r.kt)("p",null,"As you hopefully see, all the tips of the mean deformation vectors end on points of the mean face."),(0,r.kt)("p",null,"To find out where they start from, let's display the face model's reference mesh :"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-tut:silent"},'ui.show(modelGroup, referenceFace, "referenceFace")\n')),(0,r.kt)("h5",{id:"exercise--zoom-in-on-the-scene-and-observe-the-deformation-field-where-are-the-vectors-starting"},"Exercise : Zoom in on the scene and observe the deformation field. Where are the vectors starting"),(0,r.kt)("p",null,"As you can see, the mean deformation field of the Gaussian Process contained in our face model\nis a deformation from the reference mesh of the model into the mean face mesh."),(0,r.kt)("p",null,"Hence when calling ",(0,r.kt)("em",{parentName:"p"},"faceModel.mean"),", what is really happening is"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"the mean deformation field is obtained (by calling ",(0,r.kt)("em",{parentName:"li"},"faceModel.gp.mean"),")"),(0,r.kt)("li",{parentName:"ol"},"the mean deformation field is then used to deform the reference mesh (",(0,r.kt)("em",{parentName:"li"},"faceModel.referenceMesh"),")\ninto the triangle Mesh representing the mean face")),(0,r.kt)("p",null,"The same is happening when randomly sampling from the face model :"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"a random deformation field is sampled (",(0,r.kt)("em",{parentName:"li"},"faceModel.gp.sample"),")"),(0,r.kt)("li",{parentName:"ol"},"the deformation field is applied to the reference mesh to obtain a random face mesh")),(0,r.kt)("p",null,(0,r.kt)("em",{parentName:"p"},"Exercise : Perform the 2 steps above in order to sample a random face (that is sample a random deformation first, then use it to warp the reference mesh).")))}p.isMDXComponent=!0},8419:function(e,t,a){t.Z=a.p+"assets/files/Tutorial04-b34e7cb4aab06d6bf913006a3517d4e1.scala"}}]);