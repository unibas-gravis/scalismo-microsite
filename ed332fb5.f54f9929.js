(window.webpackJsonp=window.webpackJsonp||[]).push([[82],{147:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return s})),n.d(t,"metadata",(function(){return l})),n.d(t,"rightToc",(function(){return c})),n.d(t,"default",(function(){return d}));var r=n(3),i=n(7),a=(n(0),n(159)),o=["components"],s={id:"tutorial10",title:"Iterative Closest Points for rigid alignment"},l={unversionedId:"tutorials/tutorial10",id:"version-0.18/tutorials/tutorial10",isDocsHomePage:!1,title:"Iterative Closest Points for rigid alignment",description:"The goal in this tutorial is to derive an implementation of the classical Iterative Closest Points (ICP) algorithm",source:"@site/versioned_docs/version-0.18/tutorials/tutorial10.md",slug:"/tutorials/tutorial10",permalink:"/docs/0.18/tutorials/tutorial10",editUrl:"https://github.com/unibas-gravis/scalismo-microsite/edit/master/website/versioned_docs/version-0.18/tutorials/tutorial10.md",version:"0.18",sidebar:"version-0.18/docs",previous:{title:"Shape completion using Gaussian process regression",permalink:"/docs/0.18/tutorials/tutorial9"},next:{title:"Model fitting with Iterative Closest Points",permalink:"/docs/0.18/tutorials/tutorial11"}},c=[{value:"Automatic rigid alignment",id:"automatic-rigid-alignment",children:[{value:"Candidate correspondences",id:"candidate-correspondences",children:[]}]}],p={rightToc:c};function d(e){var t=e.components,n=Object(i.a)(e,o);return Object(a.b)("wrapper",Object(r.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("p",null,"The goal in this tutorial is to derive an implementation of the classical Iterative Closest Points (ICP) algorithm\nin the context of rigid alignment of shapes."),Object(a.b)("h5",{id:"related-resources"},"Related resources"),Object(a.b)("p",null,"The following resources from our ",Object(a.b)("a",{parentName:"p",href:"https://www.futurelearn.com/courses/statistical-shape-modelling"},"online course")," may provide\nsome helpful context for this tutorial:"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"Superimposing shapes ",Object(a.b)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250330"},"(Article)")),Object(a.b)("li",{parentName:"ul"},"Model-fitting and correspondence ",Object(a.b)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250371"},"(Video)"))),Object(a.b)("h5",{id:"preparation"},"Preparation"),Object(a.b)("p",null,"As in the previous tutorials, we start by importing some commonly used objects and initializing the system."),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-scala"},"import scalismo.geometry._\nimport scalismo.common._\nimport scalismo.ui.api._\nimport scalismo.mesh._\nimport scalismo.registration.LandmarkRegistration\nimport scalismo.io.{MeshIO}\nimport scalismo.numerics.UniformMeshSampler3D\nimport breeze.linalg.{DenseMatrix, DenseVector}\n\nscalismo.initialize()\nimplicit val rng = scalismo.utils.Random(42)\n\nval ui = ScalismoUI()\n")),Object(a.b)("h2",{id:"automatic-rigid-alignment"},"Automatic rigid alignment"),Object(a.b)("p",null,"We start by loading and visualizing two meshes"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-scala"},'val mesh1 = MeshIO.readMesh(new java.io.File("datasets/Paola.ply")).get\nval group1 = ui.createGroup("Dataset 1")\nval mesh1View = ui.show(group1, mesh1, "mesh1")\n\nval mesh2 = MeshIO.readMesh(new java.io.File("datasets/323.ply")).get\nval group2 = ui.createGroup("Dataset 2")\nval mesh2View = ui.show(group2, mesh2, "mesh2")\nmesh2View.color = java.awt.Color.RED\n')),Object(a.b)("p",null,"As you can see here, the meshes are not aligned. As in previous tutorials, we could identify corresponding points\nto align the meshes. The downside is, that this requires some manual intervention.\nIn this tutorial we will instead use the Iterative Closest Point (ICP) method to perform this rigid alignment step ",Object(a.b)("strong",{parentName:"p"},"automatically"),"."),Object(a.b)("h3",{id:"candidate-correspondences"},"Candidate correspondences"),Object(a.b)("p",null,"We have seen before that finding the best rigid transformation when given correct correspondences has a closed-form\nsolution. The problem we are facing here is that we do not have these correspondences. The idea of the ICP algorithm is,\nthat we can approximate the correspondences, by simply assuming that the corresponding point is always the closest point on\nthe mesh."),Object(a.b)("p",null,"Let's select a few points from the mesh."),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-scala"},'val ptIds = (0 until mesh1.pointSet.numberOfPoints by 50).map(i => PointId(i))\nui.show(group1, ptIds.map(id => mesh1.pointSet.point(id)), "selected")\n')),Object(a.b)("p",null,"The exact number of points is not important. It is only important that we select points, which are approximately\nuniformly distributed over the surface."),Object(a.b)("p",null,"In the next step, we find the corresponding points in the other mesh:"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-scala"},"def attributeCorrespondences(movingMesh: TriangleMesh[_3D], ptIds : Seq[PointId]) : Seq[(Point[_3D], Point[_3D])] = {\n  ptIds.map{ id : PointId =>\n    val pt = movingMesh.pointSet.point(id)\n    val closestPointOnMesh2 = mesh2.pointSet.findClosestPoint(pt).point\n    (pt, closestPointOnMesh2)\n  }\n}\n")),Object(a.b)("p",null,"Note that we used here not ",Object(a.b)("inlineCode",{parentName:"p"},"mesh1")," directly, but passed the mesh from which we find the closest points as an argument,\nwhich we called the ",Object(a.b)("inlineCode",{parentName:"p"},"MovingMesh"),". The reason is, that this will later be iteratively transformed to come closer to our target mesh ",Object(a.b)("inlineCode",{parentName:"p"},"mesh2"),"."),Object(a.b)("p",null,"Let us now visualize the the chosen correspondences:"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-scala"},'val correspondences = attributeCorrespondences(mesh1, ptIds)\nval targetPoints = correspondences.map(pointPair => pointPair._2)\nui.show(group2, targetPoints.toIndexedSeq, "correspondences")\n')),Object(a.b)("p",null,"As expected, the obtained correspondences are clearly not good, as they tend to focus on only one side of the target face.\nNevertheless, we can apply Procrustes analysis based on these correspondences and\nretrieve a rigid transformation, which brings us closer to the target."),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-scala"},'val rigidTrans =  LandmarkRegistration.rigid3DLandmarkRegistration(correspondences, center = Point3D(0, 0, 0))\nval transformed = mesh1.transform(rigidTrans)\nval alignedMeshView = ui.show(group1, transformed, "aligned?")\nalignedMeshView.color = java.awt.Color.GREEN\n')),Object(a.b)("p",null,Object(a.b)("strong",{parentName:"p"},"Well, no surprise here.")," Given the poor quality of the candidate correspondences, we obtained a poor rigid alignment.\nThis said, when considering where we started from, that is the original position, we did get closer to the target."),Object(a.b)("p",null,"The second important idea of the ICP algorithm comes is now to ",Object(a.b)("strong",{parentName:"p"},"iterate")," this steps in the hope that it will converge.\nLet's try it out:"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-scala"},'val newCorrespondences = attributeCorrespondences(transformed, ptIds)\nval newClosestPoints = newCorrespondences.map(pointPair => pointPair._2)\nui.show(group2, newClosestPoints.toIndexedSeq, "newCandidateCorr")\nval newRigidTransformation =\n    LandmarkRegistration.rigid3DLandmarkRegistration(newCorrespondences, center = Point3D(0, 0, 0))\nval newTransformed = transformed.transform(newRigidTransformation)\nval alignedMeshView2 =  ui.show(group2, newTransformed, "aligned??")\nalignedMeshView2.color = java.awt.Color.BLUE\n')),Object(a.b)("p",null,"As you can see, the candidate correspondences are still clearly wrong,\nbut start to be more spread around the target face.\nAlso the resulting rigid transformation seems to bring our mesh a bit closer to the target."),Object(a.b)("p",null,"Finally, we change our implementation such that we can perform an arbitrary number of iterations:"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-scala"},"def ICPRigidAlign(movingMesh: TriangleMesh[_3D], ptIds : Seq[PointId], numberOfIterations : Int) : TriangleMesh[_3D] = {\n  if (numberOfIterations == 0) movingMesh\n  else {\n    val correspondences = attributeCorrespondences(movingMesh, ptIds)\n    val transform = LandmarkRegistration.rigid3DLandmarkRegistration(correspondences, center = Point(0, 0, 0))\n    val transformed = movingMesh.transform(transform)\n\n    ICPRigidAlign(transformed, ptIds, numberOfIterations - 1)\n  }\n}\n")),Object(a.b)("p",null,"Let's now run it with 150 iterations:"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-scala"},'\nval rigidfit = ICPRigidAlign(mesh1, ptIds, 150)\nval rigidFitView = ui.show(group1, rigidfit, "ICP_rigid_fit")\nrigidFitView.color = java.awt.Color.YELLOW\n')),Object(a.b)("p",null,"As you can see here, the quality of the candidate correspondences did indeed result in a proper\n",Object(a.b)("strong",{parentName:"p"},"automatic")," rigid alignment of Paola to the target. One should not forget, however, that the ICP method is\nvery sensitive to the initial position, and might easily get stuck in a local minimum."))}d.isMDXComponent=!0},159:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return h}));var r=n(0),i=n.n(r);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=i.a.createContext({}),p=function(e){var t=i.a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},d=function(e){var t=p(e.components);return i.a.createElement(c.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},u=i.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,o=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=p(n),u=r,h=d["".concat(o,".").concat(u)]||d[u]||m[u]||a;return n?i.a.createElement(h,s(s({ref:t},c),{},{components:n})):i.a.createElement(h,s({ref:t},c))}));function h(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,o=new Array(a);o[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,o[1]=s;for(var c=2;c<a;c++)o[c]=n[c];return i.a.createElement.apply(null,o)}return i.a.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);