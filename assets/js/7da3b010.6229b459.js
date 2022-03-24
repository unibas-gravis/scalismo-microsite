"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1182],{3905:function(e,t,a){a.d(t,{Zo:function(){return u},kt:function(){return d}});var n=a(7294);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function r(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}var l=n.createContext({}),c=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},u=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var a=e.components,i=e.mdxType,o=e.originalType,l=e.parentName,u=r(e,["components","mdxType","originalType","parentName"]),p=c(a),d=i,h=p["".concat(l,".").concat(d)]||p[d]||m[d]||o;return a?n.createElement(h,s(s({ref:t},u),{},{components:a})):n.createElement(h,s({ref:t},u))}));function d(e,t){var a=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=a.length,s=new Array(o);s[0]=p;var r={};for(var l in t)hasOwnProperty.call(t,l)&&(r[l]=t[l]);r.originalType=e,r.mdxType="string"==typeof e?e:i,s[1]=r;for(var c=2;c<o;c++)s[c]=a[c];return n.createElement.apply(null,s)}return n.createElement.apply(null,a)}p.displayName="MDXCreateElement"},8134:function(e,t,a){a.r(t),a.d(t,{frontMatter:function(){return r},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return u},default:function(){return p}});var n=a(7462),i=a(3366),o=(a(7294),a(3905)),s=["components"],r={id:"scalismo-ui-introduction",title:"Introduction to Scalismo-ui"},l=void 0,c={unversionedId:"scalismo-ui-introduction",id:"scalismo-ui-introduction",title:"Introduction to Scalismo-ui",description:"The goal of this tutorial is to give a practical introduction to visualizing with",source:"@site/docs/scalismo-ui-introduction.md",sourceDirName:".",slug:"/scalismo-ui-introduction",permalink:"/docs/next/scalismo-ui-introduction",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/scalismo-ui-introduction.md",tags:[],version:"current",frontMatter:{id:"scalismo-ui-introduction",title:"Introduction to Scalismo-ui"},sidebar:"docs",previous:{title:"Model fitting using MCMC - Fitting a shape model",permalink:"/docs/next/Tutorials/tutorial15"}},u=[{value:"Starting Scalismo-ui and creating groups",id:"starting-scalismo-ui-and-creating-groups",children:[],level:2},{value:"Visualizing objects",id:"visualizing-objects",children:[],level:2},{value:"Finding object views",id:"finding-object-views",children:[],level:2},{value:"Adding transformations",id:"adding-transformations",children:[],level:2},{value:"Visualizing Statistical Shape Models",id:"visualizing-statistical-shape-models",children:[],level:2},{value:"Visualizing other scalismo objects",id:"visualizing-other-scalismo-objects",children:[],level:2}],m={toc:u};function p(e){var t=e.components,r=(0,i.Z)(e,s);return(0,o.kt)("wrapper",(0,n.Z)({},m,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"The goal of this tutorial is to give a practical introduction to visualizing with\n",(0,o.kt)("em",{parentName:"p"},"Scalismo-ui"),"."),(0,o.kt)("p",null,"To run the code from this tutorial, download the following Scala file:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{target:"_blank",href:a(7702).Z},"ScalismoUIIntroduction.scala"))),(0,o.kt)("p",null,"To get it out of the way, we import the following:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"// api functions for scalismo-ui\nimport scalismo.ui.api._\n\n// some objects and readers from scalismo\nimport scalismo.io._\nimport scalismo.geometry._\nimport scalismo.transformations._\n\n// some other things needed in the examples\nimport java.io.File\nimport java.awt.Color\nimport breeze.linalg.DenseVector\nimport breeze.stats.distributions.Gaussian\n\n")),(0,o.kt)("h2",{id:"starting-scalismo-ui-and-creating-groups"},"Starting Scalismo-ui and creating groups"),(0,o.kt)("p",null,"The first step is to create a ",(0,o.kt)("inlineCode",{parentName:"p"},"ui")," object, with which we interact. This can be done by calling"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"val ui = ScalismoUI()\n")),(0,o.kt)("p",null,"You will see that this starts the graphical user interface. Scalismo-ui features different perspectives on the data. In this guide we use the orthogonal view, which you can select from the menu ",(0,o.kt)("inlineCode",{parentName:"p"},"View->Perspective->Orthognonal Slices"),". You should now see the following window:\n",(0,o.kt)("img",{alt:"Clicking landmarks",src:a(1412).Z,width:"1920",height:"1056"})),(0,o.kt)("p",null,"Before we can start visualizing objects, we need to create a group. A group is a collection of objects that belong together. A typical scenario is that we have an 3D image of a structure, but also a segmentation given in form of a surface mesh and maybe even some manually annotated landmark points. A group is created by calling"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},' val group = ui.createGroup("object-1")\n')),(0,o.kt)("h2",{id:"visualizing-objects"},"Visualizing objects"),(0,o.kt)("p",null,"We start by loading a mesh using Scalismo:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},'val mesh = MeshIO.readMesh(new java.io.File("./datasets/Paola.ply")).get\n')),(0,o.kt)("p",null,"To visualize any scalismo object, we use the show method. As a first argument\nwe specify the group to which the objects belongs and the last argument is an identifier:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},'val meshView = ui.show(group, mesh, "mesh")\n')),(0,o.kt)("p",null,"This call shows the mesh and returns a ",(0,o.kt)("inlineCode",{parentName:"p"},"view")," object, which we can use to\ninteract with the visualization. For example we can change the color or the opacity"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"meshView.color = Color.RED\nmeshView.opacity = 1.0\n")),(0,o.kt)("p",null,"We can also change the visibility of an object, and for example show it only in the\n3D viewport, but not the slice views. This is done by calling"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"ui.setVisibility(meshView, Viewport._3dOnly)\n")),(0,o.kt)("p",null,"To show it again in all viewports we call"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"ui.setVisibility(meshView, Viewport.all)\n")),(0,o.kt)("h2",{id:"finding-object-views"},"Finding object views"),(0,o.kt)("p",null,"We have seen that to interact with an object we need a view of that object. When we use the ",(0,o.kt)("inlineCode",{parentName:"p"},"show")," method to visualize the object, we directly obtain the corresponding view. However, sometimes an object is created by the user, using the graphical user interface. A typical use case is that the user clicks landmarks on an object. In Scalismo-ui, landmarks can be defined by selecting the landmarking button in the top-left corner of the toolbar and  left-clicking on the object.\n",(0,o.kt)("img",{alt:"Clicking landmarks",src:a(1402).Z,width:"1931",height:"1099"})),(0,o.kt)("p",null,"To work with the clicked landmarks, we need to obtain the corresponding views. This can be done using the filter method of the ui. This method is very similarly to a filter method of the Scala collections. It goes through all the objects in a group and returns a list of the object with the correct type that satisfy a given predicate. The view for the clicked landmarks can be obtained as follows:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"val landmarkViews = ui.filter[LandmarkView](group, (v : LandmarkView) => true)\n")),(0,o.kt)("p",null,"Exactly in the same way as we manipulated the display properties of the mesh, we can now change the properties of the landmarks using these views. We can also access the underlying\nscalismo object and, for example, print out their point coordinates."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"  for (landmarkView <- landmarkViews) {\n    landmarkView.color = Color.RED\n    println(landmarkView.landmark.point)\n  }\n")),(0,o.kt)("h2",{id:"adding-transformations"},"Adding transformations"),(0,o.kt)("p",null,"Scalismo-ui does not only allow us to visualize static objects, but can also be used\nto visualize transformations and deformations of the objects in a group. This can be achieved\nby adding a transformation to the group; i.e. a function that maps every 3D point in the scene to another 3D point. The following example flips the objects in the group along the y axis."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},'val transformationView = ui.addTransformation(group, Transformation((p : Point[_3D]) => Point3D(p.x, -p.y, p.z)), "flip")\n')),(0,o.kt)("p",null,"Note that this does not only turn the mesh upside down, but also the landmarks. This is a general rule: a transformation is always applied to all objects in the group.\nTo get back the original mesh, we simply remove the transformation by calling:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"transformationView.remove()\n")),(0,o.kt)("p",null,"Once we are done with the visualization, we can remove the entire group using"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"group.remove()\n")),(0,o.kt)("h2",{id:"visualizing-statistical-shape-models"},"Visualizing Statistical Shape Models"),(0,o.kt)("p",null,"One of the important use cases that guided the development of scalismo-ui is the\nvisualization of statistical shape models. A statistical shape model is\njust a mesh that is transformed by a parametric family of transformation.\nLet's load a statistical shape model and visualize it:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},'val ssm = StatisticalModelIO.readStatisticalTriangleMeshModel3D(new File("datasets/bfm.h5")).get\nval ssmGroup = ui.createGroup("shape-model")\nval ssmView = ui.show(ssmGroup, ssm, "ssm")\n')),(0,o.kt)("p",null,"In scalismo-ui, a statistical shape model is represented as a mesh together with two\ntransformations:  one (rigid) transformation that controls the pose of the mesh and\none that controls the actual shape. We can access the individual parts of an ssm using\nthe ",(0,o.kt)("inlineCode",{parentName:"p"},"ssmView")," object."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"}," ssmView.referenceView\n ssmView.shapeModelTransformationView.shapeTransformationView\n ssmView.shapeModelTransformationView.poseTransformationView\n")),(0,o.kt)("p",null,"The pose transformation and shape transformation are parametric transformations, and to change\nthe transformation, we can change their parameters. To visualize, for example,  a random shape of the statistical shape model, we can  create a random coefficient vector and set the shape transformation parameters accordingly."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},"    val randCoeffs = DenseVector.rand[Double](ssm.rank, Gaussian(0, 1))\n    ssmView.shapeModelTransformationView.shapeTransformationView.coefficients = randCoeffs\n")),(0,o.kt)("p",null,"This will immediately update the shape transformation to the transformation that\nis defined by these coefficients and the visualized mesh is deformed accordingly."),(0,o.kt)("h2",{id:"visualizing-other-scalismo-objects"},"Visualizing other scalismo objects"),(0,o.kt)("p",null,"The concepts that we described above are generic and in exactly the same way\nany other scalismo object can be visualized: We use ",(0,o.kt)("inlineCode",{parentName:"p"},"ui.show")," to visualize an object and interact with it using the corresponding view object,\nwhich we obtain either directly from the show function, or by using the ",(0,o.kt)("inlineCode",{parentName:"p"},"ui.filter")," or\n",(0,o.kt)("inlineCode",{parentName:"p"},"ui.find")," method."),(0,o.kt)("p",null,"Here is, howe we would visualize a 3D image:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-scala"},'  val group2 = ui.createGroup("object-2")\n  val image = ImageIO.read3DScalarImage[Short](new File("./datasets/PaolaMRI.vtk")).get\n  val imageView = ui.show(group2, image, "mri-image")\n')),(0,o.kt)("p",null," The following list shows all the scalismo objects, which can currently be visualized\nin scalismo-ui."),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"3D image (",(0,o.kt)("inlineCode",{parentName:"li"},"DiscreteScalarImage[_3D, _]"),")"),(0,o.kt)("li",{parentName:"ul"},"3D vector field (",(0,o.kt)("inlineCode",{parentName:"li"},"DiscreteField[_3D, Vector[_3D]]"),")"),(0,o.kt)("li",{parentName:"ul"},"Point cloud (",(0,o.kt)("inlineCode",{parentName:"li"},"IndexedSeq[Point[_3D]]"),")"),(0,o.kt)("li",{parentName:"ul"},"Landmark (",(0,o.kt)("inlineCode",{parentName:"li"},"Landmark[_3D]"),")"),(0,o.kt)("li",{parentName:"ul"},"Scalar field (",(0,o.kt)("inlineCode",{parentName:"li"},"DiscreteScalarField[_3D, _]"),")"),(0,o.kt)("li",{parentName:"ul"},"Triangle mesh (",(0,o.kt)("inlineCode",{parentName:"li"},"TriangleMesh[_3D]"),")"),(0,o.kt)("li",{parentName:"ul"},"Scalar mesh field(",(0,o.kt)("inlineCode",{parentName:"li"},"ScalarMeshField[_]"),")"),(0,o.kt)("li",{parentName:"ul"},"Line mesh (",(0,o.kt)("inlineCode",{parentName:"li"},"LineMesh[_3D]"),")")))}p.isMDXComponent=!0},7702:function(e,t,a){t.Z=a.p+"assets/files/ScalismoUiIntroduction-a735602fee136c11fc3a1458afa6312c.scala"},1402:function(e,t,a){t.Z=a.p+"assets/images/landmarking-32c4ec25afa48d321e7b4ba8f2aefcef.png"},1412:function(e,t,a){t.Z=a.p+"assets/images/scalismo-ui-empty-a741a0ad2526580c46f39b38ca9ab7a5.png"}}]);