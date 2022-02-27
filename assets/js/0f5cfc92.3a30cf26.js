"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7661],{3905:function(e,a,t){t.d(a,{Zo:function(){return m},kt:function(){return d}});var n=t(7294);function i(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function l(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function o(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?l(Object(t),!0).forEach((function(a){i(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function r(e,a){if(null==e)return{};var t,n,i=function(e,a){if(null==e)return{};var t,n,i={},l=Object.keys(e);for(n=0;n<l.length;n++)t=l[n],a.indexOf(t)>=0||(i[t]=e[t]);return i}(e,a);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)t=l[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var s=n.createContext({}),c=function(e){var a=n.useContext(s),t=a;return e&&(t="function"==typeof e?e(a):o(o({},a),e)),t},m=function(e){var a=c(e.components);return n.createElement(s.Provider,{value:a},e.children)},p={inlineCode:"code",wrapper:function(e){var a=e.children;return n.createElement(n.Fragment,{},a)}},u=n.forwardRef((function(e,a){var t=e.components,i=e.mdxType,l=e.originalType,s=e.parentName,m=r(e,["components","mdxType","originalType","parentName"]),u=c(t),d=i,h=u["".concat(s,".").concat(d)]||u[d]||p[d]||l;return t?n.createElement(h,o(o({ref:a},m),{},{components:t})):n.createElement(h,o({ref:a},m))}));function d(e,a){var t=arguments,i=a&&a.mdxType;if("string"==typeof e||i){var l=t.length,o=new Array(l);o[0]=u;var r={};for(var s in a)hasOwnProperty.call(a,s)&&(r[s]=a[s]);r.originalType=e,r.mdxType="string"==typeof e?e:i,o[1]=r;for(var c=2;c<l;c++)o[c]=t[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,t)}u.displayName="MDXCreateElement"},65:function(e,a,t){t.r(a),t.d(a,{frontMatter:function(){return r},contentTitle:function(){return s},metadata:function(){return c},toc:function(){return m},default:function(){return u}});var n=t(7462),i=t(3366),l=(t(7294),t(3905)),o=["components"],r={id:"tutorial01",title:"Hello Scalismo!"},s=void 0,c={unversionedId:"Tutorials/tutorial01",id:"Tutorials/tutorial01",title:"Hello Scalismo!",description:"The goal in this tutorial is to present the most important data structures, as well as the visualization capabilities of Scalismo.",source:"@site/docs/Tutorials/tutorial01.md",sourceDirName:"Tutorials",slug:"/Tutorials/tutorial01",permalink:"/docs/Tutorials/tutorial01",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/Tutorials/tutorial01.md",tags:[],version:"current",frontMatter:{id:"tutorial01",title:"Hello Scalismo!"},sidebar:"docs",previous:{title:"Using Scalismo with scala-cli and vscode",permalink:"/docs/Setup/vscode"},next:{title:"Rigid Alignment",permalink:"/docs/Tutorials/tutorial02"}},m=[{value:"Related resources",id:"related-resources",children:[],level:5},{value:"Imports and Scalismo initialization",id:"imports-and-scalismo-initialization",children:[],level:2},{value:"Meshes (surface data)",id:"meshes-surface-data",children:[{value:"Anatomy of a Triangle mesh",id:"anatomy-of-a-triangle-mesh",children:[],level:4}],level:2},{value:"Points and Vectors",id:"points-and-vectors",children:[],level:2},{value:"Scalar Images",id:"scalar-images",children:[{value:"Scalar Image domain",id:"scalar-image-domain",children:[],level:3},{value:"Scalar image values",id:"scalar-image-values",children:[],level:3},{value:"Creating scalar images",id:"creating-scalar-images",children:[],level:3}],level:2},{value:"Statistical Mesh Models",id:"statistical-mesh-models",children:[{value:"Sampling in the UI",id:"sampling-in-the-ui",children:[],level:3},{value:"Sampling programmatically",id:"sampling-programmatically",children:[{value:"Exercise: Visualize a few randomly generated meshes in the ui.",id:"exercise-visualize-a-few-randomly-generated-meshes-in-the-ui",children:[{value:"Retrieving objects from Scalismo-ui",id:"retrieving-objects-from-scalismo-ui",children:[],level:5},{value:"Related resources:",id:"related-resources-1",children:[],level:5}],level:4}],level:3}],level:2}],p={toc:m};function u(e){var a=e.components,r=(0,i.Z)(e,o);return(0,l.kt)("wrapper",(0,n.Z)({},p,r,{components:a,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"The goal in this tutorial is to present the most important data structures, as well as the visualization capabilities of Scalismo."),(0,l.kt)("h5",{id:"related-resources"},"Related resources"),(0,l.kt)("p",null,"The following resources from our ",(0,l.kt)("a",{parentName:"p",href:"https://www.futurelearn.com/courses/statistical-shape-modelling"},"online course")," may provide\nsome helpful context for this tutorial:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"What is Scalismo ",(0,l.kt)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250314"},"(Video)"))),(0,l.kt)("p",null,"To run the code from this tutorial, download the following Scala file:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{target:"_blank",href:t(2487).Z},"Tutorial01.scala"))),(0,l.kt)("h2",{id:"imports-and-scalismo-initialization"},"Imports and Scalismo initialization"),(0,l.kt)("p",null,"Before we start with writing actual Scalismo code, we import all\nobjects from the Scalismo library, which we will need in this tutorial. "),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"\n// Basic geometric primitives\nimport scalismo.geometry.{_3D, Point, Point3D}\nimport scalismo.geometry.{EuclideanVector}\nimport scalismo.geometry.{IntVector, IntVector3D} \nimport scalismo.geometry.Landmark\n\nimport scalismo.common.PointId\n\n// Geometric objects\nimport scalismo.mesh.TriangleMesh\nimport scalismo.mesh.TriangleId\nimport scalismo.image.{DiscreteImage, DiscreteImage3D}\nimport scalismo.statisticalmodel.PointDistributionModel \n\n// IO Methods\nimport scalismo.io.ImageIO; \nimport scalismo.io.StatisticalModelIO\nimport scalismo.io.{MeshIO, StatisticalModelIO}\n\n// Visualization\nimport scalismo.ui.api.ScalismoUI\nimport scalismo.ui.api.LandmarkView\n")),(0,l.kt)("p",null,"Before we can start working with Scalismo objects, we need to initialize Scalismo. "),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"scalismo.initialize()\nimplicit val rng = scalismo.utils.Random(42)\n")),(0,l.kt)("p",null,"The call to ",(0,l.kt)("inlineCode",{parentName:"p"},"scalismo.initialize")," loads all the dependencies to native C++ libraries (such as e.g. ",(0,l.kt)("a",{parentName:"p",href:"https://www.vtk.org"},"vtk")," or ",(0,l.kt)("a",{parentName:"p",href:"https://www.hdf-group.org"},"hdf5"),").\nThe second call tells scalismo, which source\nof randomness to use and at the same time seeds the random number generator appropriately."),(0,l.kt)("p",null,"Later on we would like to visualize the objects we create. This is done using ",(0,l.kt)("a",{parentName:"p",href:"https://github.com/unibas-gravis/scalismo-ui"},"Scalismo-ui")," - the visualization library accompanying scalismo.\nWe can load an instance of the GUI, which we name here simply ",(0,l.kt)("inlineCode",{parentName:"p"},"ui")," as follows:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"val ui = ScalismoUI()\n")),(0,l.kt)("h2",{id:"meshes-surface-data"},"Meshes (surface data)"),(0,l.kt)("p",null,"The first fundamental data structure we discuss is the triangle mesh,\nwhich is defined in the package ",(0,l.kt)("inlineCode",{parentName:"p"},"scalismo.mesh"),".\nMeshes can be read from a file using the method ",(0,l.kt)("inlineCode",{parentName:"p"},"readMesh")," from the ",(0,l.kt)("inlineCode",{parentName:"p"},"MeshIO"),":"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},'val mesh: TriangleMesh[_3D] = MeshIO.readMesh(new java.io.File("datasets/Paola.ply")).get\n')),(0,l.kt)("p",null,"To visualize any object in Scalismo, we can use the ",(0,l.kt)("inlineCode",{parentName:"p"},"show")," method of the ",(0,l.kt)("inlineCode",{parentName:"p"},"ui")," object.\nWe often want to organize different visualizations of an object in a group.\nWe start directly with this practice and\nfirst create a new group, to which we then add the visualization of the mesh:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},'val paolaGroup = ui.createGroup("paola")\nval meshView = ui.show(paolaGroup, mesh, "Paola")\n')),(0,l.kt)("p",null,'Now that the mesh is displayed in the "Scalismo Viewer\'s 3D view", you can interact with it as follows:'),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"to rotate: maintain the left mouse button clicked and drag"),(0,l.kt)("li",{parentName:"ul"},"to shift/translate: maintain the middle mouse button clicked and drag"),(0,l.kt)("li",{parentName:"ul"},"to scale: maintain the right mouse button clicked and drag up or down")),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},"Note: if you are a Mac user, please find out how to emulate these events using your mouse or trackpad"),"\n",(0,l.kt)("em",{parentName:"p"},"Note also that you can use the "),"RC",(0,l.kt)("em",{parentName:"p"},", "),"X",(0,l.kt)("em",{parentName:"p"},", "),"Y",(0,l.kt)("em",{parentName:"p"}," and "),"Z",(0,l.kt)("em",{parentName:"p"}," buttons in the 3D view to recenter the camera on the displayed object.")),(0,l.kt)("h4",{id:"anatomy-of-a-triangle-mesh"},"Anatomy of a Triangle mesh"),(0,l.kt)("p",null,"A 3D triangle mesh in scalismo consists of a ",(0,l.kt)("inlineCode",{parentName:"p"},"pointSet"),", which maintains a collection of 3D points and a\nlist of triangle cells. We can access individual points using their point id.\nHere we show how we can access the first point in the mesh:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},'println("first point " + mesh.pointSet.point(PointId(0)))\n')),(0,l.kt)("p",null,"Similarly, we can access the first triangles as follows:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},'println("first cell " + mesh.triangulation.triangle(TriangleId(0)))\n')),(0,l.kt)("p",null,"The first cell is a triangle between the first, second and third points of the mesh.\nNotice here that the cell indicates the identifiers of the points (their index in the point sequence)\ninstead of the geometric position of the points."),(0,l.kt)("p",null,"Instead of visualizing the mesh, we can also display the points forming the mesh."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},'val pointCloudView = ui.show(paolaGroup, mesh.pointSet, "pointCloud")\n')),(0,l.kt)("p",null,'This should add a new point cloud element to the scene with the name "pointCloud".'),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},"Note: depending on your computer, visualizing the full point cloud may slow down the visualization performance.")),(0,l.kt)("p",null,"Note that to clean up the 3D scene, you can delete the objects either from the user interface (by right-clicking on the object's name), or programmatically by calling ",(0,l.kt)("inlineCode",{parentName:"p"},"remove")," on the corresponding view object :"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"pointCloudView.remove()\n")),(0,l.kt)("h2",{id:"points-and-vectors"},"Points and Vectors"),(0,l.kt)("p",null,"We are very often interested in modelling transformations of point sets. Therefore we need to learn how to manipulate point positions.\nThe two fundamental classes in this context are ",(0,l.kt)("inlineCode",{parentName:"p"},"Point")," and ",(0,l.kt)("inlineCode",{parentName:"p"},"EuclideanVector"),":"),(0,l.kt)("p",null,"We define points by specifying their coordinates:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"val p1: Point[_3D] = Point3D(4.0, 5.0, 6.0)\nval p2: Point[_3D] = Point3D(1.0, 2.0, 3.0)\n")),(0,l.kt)("p",null,"The difference between two points is a ",(0,l.kt)("inlineCode",{parentName:"p"},"EuclideanVector")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"val v1: EuclideanVector[_3D] = Point3D(4.0, 5.0, 6.0) - Point3D(1.0, 2.0, 3.0)\n")),(0,l.kt)("p",null,"The sum of a point with a vector yields a new point:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"val p3: Point[_3D] = p1 + v1\n")),(0,l.kt)("p",null,"Points can be converted to vectors:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"val v2: EuclideanVector[_3D] = p1.toVector\n")),(0,l.kt)("p",null,"and vice versa:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"val v3: Point[_3D] = v1.toPoint\n")),(0,l.kt)("p",null,"*Remark: Observe that the type of the expression is a parametric type ",(0,l.kt)("inlineCode",{parentName:"p"},"Point[_3D]"),", where the type parameter ",(0,l.kt)("inlineCode",{parentName:"p"},"_3D")," encodes the dimensionality.\nThe following pattern holds throughout Scalismo. In the object constructor, the dimesionality is given as part of the name (such as ",(0,l.kt)("inlineCode",{parentName:"p"},"Point3D, TriangleMesh3D"),").\nThe corresponding Type that is returned, is the parametric type (such as ",(0,l.kt)("inlineCode",{parentName:"p"},"Point[_3D]")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"TriangleMesh[_3D]"),").\nThis pattern allows us to write generic code, which is independent of the dimensionality in which the objects live."),(0,l.kt)("p",null,"We put these concepts in practice, and illustrate how we can compute the center of mass, given a sequence of points:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"val pointList = Seq(\n    Point3D(4.0, 5.0, 6.0),\n    Point3D(1.0, 2.0, 3.0),\n    Point3D(14.0, 15.0, 16.0),\n    Point3D(7.0, 8.0, 9.0),\n    Point3D(10.0, 11.0, 12.0)\n  )\n")),(0,l.kt)("p",null,"In a first step, we treat all the points as displacement vectors (the displacement of the points from the origin)"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"val vectors = pointList.map { p: Point[_3D] => p.toVector } // use map to turn points into vectors\n")),(0,l.kt)("p",null,"The average displacement can be easily computed by averaging all the vectors."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"val vectorSum = vectors.reduce { (v1, v2) => v1 + v2 } // sum up all vectors in the collection\nval centerV: EuclideanVector[_3D] = vectorSum * (1.0 / pointList.length) // divide the sum by the number of points\n")),(0,l.kt)("p",null,"And finally we treat the average displacement again as a point in space."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"val center = centerV.toPoint\n")),(0,l.kt)("h2",{id:"scalar-images"},"Scalar Images"),(0,l.kt)("p",null,"The next important data structure is the (scalar-) image.\nA ",(0,l.kt)("em",{parentName:"p"},"discrete")," scalar image (e.g. gray level image) in Scalismo is simply a function from a discrete domain of points to a scalar value."),(0,l.kt)("p",null,"Let's read and display a 3D image (MRI of a human):"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},'val image: DiscreteImage[_3D, Short] = ImageIO.read3DScalarImage[Short](new java.io.File("datasets/PaolaMRI.vtk")).get\nval imageView = ui.show(paolaGroup, image, "mri")\n')),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},"Note: depending on your view on the scene, it could appear as if the image is not displayed. In this case, make sure to rotate the scene and change the position of the slices as indicated below.")),(0,l.kt)("p",null,'To visualize the different image slices in the viewer, select "Scene" (the upper node in the scene tree graph) and use the X,Y,Z sliders.'),(0,l.kt)("p",null,"You can also change the way of visualizing the 3D scene under the"),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},"View -> Perspective")," menu."),(0,l.kt)("h3",{id:"scalar-image-domain"},"Scalar Image domain"),(0,l.kt)("p",null,"Let's inspect the domain of the image :"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"val origin: Point[_3D] = image.domain.origin\nval spacing: EuclideanVector[_3D] = image.domain.spacing\nval size: IntVector[_3D] = image.domain.size\n")),(0,l.kt)("p",null,"The discrete image domain is a 3-dimensional regular grid of points originating at point (92.5485, -121.926, 135.267),\nwith regular spacing of 1.5 mm in each dimension and containing 171, 171, 139 grid slots in the x, y and z directions respectively."),(0,l.kt)("p",null,"To better see this, let's display the first 172 points of the image domain"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},'val imagePoints: Iterator[Point[_3D]] = image.domain.pointSet.points.take(172)\nval gridPointsView = ui.show(paolaGroup, imagePoints.toIndexedSeq, "imagePoints")\n')),(0,l.kt)("h3",{id:"scalar-image-values"},"Scalar image values"),(0,l.kt)("p",null,"The other important part of a discrete image are the values associated with the domain points"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"val values : Iterator[Short] = image.values\n")),(0,l.kt)("p",null,"This is an iterator of scalar values of type ",(0,l.kt)("inlineCode",{parentName:"p"},"Short")," as encoded in the read image."),(0,l.kt)("p",null,"Let's check the first value, which is the value associated with the origin :"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"image.values.next\n")),(0,l.kt)("p",null,"The point ",(0,l.kt)("em",{parentName:"p"},"origin")," corresponds to the grid point with index (0,0,0). Hence, the same value can be obtained by accessing the image at this index :"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"image(IntVector(0,0,0))\n")),(0,l.kt)("p",null,"Naturally, the number of scalar values should be equal to the number of points"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"image.values.size == image.domain.pointSet.numberOfPoints\n")),(0,l.kt)("p",null,"Notice that you can check the intensity value at a particular point position in the image, by maintaining the Ctrl key pressed and hovering over the image. The intensity value will then be displayed in the lower left corner of the Scalismo viewer window."),(0,l.kt)("h3",{id:"creating-scalar-images"},"Creating scalar images"),(0,l.kt)("p",null,"Given that discrete scalar images are a mapping between points and values,\nwe can easily create such images programmatically."),(0,l.kt)("p",null,"Here we create a new image defined on the same domain of points with artificially created values: We threshold an MRI image, where\nall the values above 300 are replaced with 0."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},'val threshValues = image.values.map { v: Short => if (v <= 300) v else 0.toShort }\nval thresholdedImage: DiscreteImage[_3D, Short] = DiscreteImage3D[Short](image.domain, threshValues.toIndexedSeq)\nui show(paolaGroup, thresholdedImage, "thresh")\n')),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},"Note: We need to write 0.toShort or 0 : Short in order to ensure that the ",(0,l.kt)("inlineCode",{parentName:"em"},"threshValues")," have type ",(0,l.kt)("inlineCode",{parentName:"em"},"Short")," and not ",(0,l.kt)("inlineCode",{parentName:"em"},"Int"),".")),(0,l.kt)("p",null,"There is, however, also a more elegant way to write above code, namely using the ",(0,l.kt)("inlineCode",{parentName:"p"},"map")," method. The ",(0,l.kt)("inlineCode",{parentName:"p"},"map")," method applies\nan operation to all values. Using this method, we can write instead"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"val thresholdedImage2 = image.map(v => if (v <= 300) v else 0.toShort)\n")),(0,l.kt)("h2",{id:"statistical-mesh-models"},"Statistical Mesh Models"),(0,l.kt)("p",null,"Finally, we look at Statistical Shape Models."),(0,l.kt)("p",null,"Statistical models can be read by calling ",(0,l.kt)("inlineCode",{parentName:"p"},"readStatisticalMeshModel")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},'val faceModel: PointDistributionModel[_3D, TriangleMesh] = StatisticalModelIO.readStatisticalTriangleMeshModel3D(new java.io.File("datasets/bfm.h5")).get\nval faceModelView = ui.show(faceModel, "faceModel")\n')),(0,l.kt)("h3",{id:"sampling-in-the-ui"},"Sampling in the UI"),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},'Exercise: Sample random instances of faces by using the graphical tools in the scene pane : click on the "model" tree node and then the "Random" button')),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},'Exercise: click a landmark on a position of the face model, e.g. chin or eye corner.. (use the toggle button "LM" in the toolbar to activate landmark clicking). Rename this landmark and call it '),"noseLM",(0,l.kt)("em",{parentName:"p"},". Now continue sampling from the model. What happens to the selected point?")),(0,l.kt)("p",null,'As you can see, a new instance of the face model is displayed each time along with the corresponding landmark point. Notice how the position of the landmark point changes in space while it keeps the same "meaning" on the face (eye corner, tip of nose ..)'),(0,l.kt)("h3",{id:"sampling-programmatically"},"Sampling programmatically"),(0,l.kt)("p",null,"Sampling in the ui is useful for getting a visual impression of the variability of a model. But more often we want to\nsample from a model programmatically. We can obtain a sample from the model, by calling the ",(0,l.kt)("inlineCode",{parentName:"p"},"sample method"),":"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"val randomFace: TriangleMesh[_3D] = faceModel.sample\n")),(0,l.kt)("h4",{id:"exercise-visualize-a-few-randomly-generated-meshes-in-the-ui"},"Exercise: Visualize a few randomly generated meshes in the ui."),(0,l.kt)("h5",{id:"retrieving-objects-from-scalismo-ui"},"Retrieving objects from Scalismo-ui"),(0,l.kt)("p",null,"This is a good point to show how objects that we added manually in Scalismo-ui can be retrieved programmatically. A typical example is,\nthat we manually clicked a landmark, such as our ",(0,l.kt)("inlineCode",{parentName:"p"},"noseLM"),", on one of the visualized objects and would like to work with them in our\nprograms.\nTo achieve this we can use the ",(0,l.kt)("inlineCode",{parentName:"p"},"filter")," method of the ui object. It works as follows:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},'val matchingLandmarkViews : Seq[LandmarkView] = ui.filter[LandmarkView](paolaGroup, (l : LandmarkView) => l.name == "noseLM")\nval matchingLandmarks : Seq[Landmark[_3D]] = matchingLandmarkViews.map(lmView => lmView.landmark)\n')),(0,l.kt)("p",null,"The ",(0,l.kt)("inlineCode",{parentName:"p"},"filter")," method is very general. The type parameter (the parameter inside []) indicates the type of ",(0,l.kt)("inlineCode",{parentName:"p"},"view")," object we want to\nsearch for. Here we look only for landmarks, and consequently specify the type ",(0,l.kt)("inlineCode",{parentName:"p"},"LandmarkView"),". As a first we  pass the group,\nin which we want to search for an object. The second argument is a predicate, which is executed for all objects in the group, of the right type.\nHere we specify, that ",(0,l.kt)("inlineCode",{parentName:"p"},"filter"),' should match all objects whose name equals "noseLM". Calling the ',(0,l.kt)("inlineCode",{parentName:"p"},"filter")," method results in a sequence\nof view objects, which match the predicate. To get the matching scalismo object, we call the method ",(0,l.kt)("inlineCode",{parentName:"p"},"landmark")," on the view object.\nWe can do this for all landmark view objects in the sequence using the familiar ",(0,l.kt)("inlineCode",{parentName:"p"},"map")," function."),(0,l.kt)("p",null,"Finally, we can get the id and position of the matched landmark as follows:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-scala"},"val landmarkId : String = matchingLandmarks.head.id\nval landmarkPosition : Point[_3D] = matchingLandmarks.head.point\n")),(0,l.kt)("p",null,(0,l.kt)("em",{parentName:"p"},"Remark: In exactly the same way we can retrieve all other types of objects,\nwhich we can visualize in in Scalismo-ui, such as images, meshes, pointClouds, etc.")),(0,l.kt)("h5",{id:"related-resources-1"},"Related resources:"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{target:"_blank",href:t(2487).Z},"Scala-code for this tutorial"))))}u.isMDXComponent=!0},2487:function(e,a,t){a.Z=t.p+"assets/files/Tutorial01-2ee827a894c89da23743648627a4634f.scala"}}]);