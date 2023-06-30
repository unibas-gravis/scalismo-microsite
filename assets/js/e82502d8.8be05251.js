"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7141],{3905:function(e,t,a){a.d(t,{Zo:function(){return u},kt:function(){return h}});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},i=Object.keys(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var l=r.createContext({}),c=function(e){var t=r.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},u=function(e){var t=c(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,i=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),m=c(a),h=n,g=m["".concat(l,".").concat(h)]||m[h]||p[h]||i;return a?r.createElement(g,o(o({ref:t},u),{},{components:a})):r.createElement(g,o({ref:t},u))}));function h(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=a.length,o=new Array(i);o[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:n,o[1]=s;for(var c=2;c<i;c++)o[c]=a[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,a)}m.displayName="MDXCreateElement"},2573:function(e,t,a){a.r(t),a.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return u},default:function(){return m}});var r=a(7462),n=a(3366),i=(a(7294),a(3905)),o=["components"],s={id:"tutorial12",title:"Parametric, non-rigid registration"},l=void 0,c={unversionedId:"Tutorials/tutorial12",id:"version-0.91.0/Tutorials/tutorial12",title:"Parametric, non-rigid registration",description:"We have seen how non-rigid ICP can be used to establish correspondences.",source:"@site/versioned_docs/version-0.91.0/Tutorials/tutorial12.md",sourceDirName:"Tutorials",slug:"/Tutorials/tutorial12",permalink:"/docs/0.91.0/Tutorials/tutorial12",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/versioned_docs/version-0.91.0/Tutorials/tutorial12.md",tags:[],version:"0.91.0",frontMatter:{id:"tutorial12",title:"Parametric, non-rigid registration"},sidebar:"docs",previous:{title:"Model fitting with Iterative Closest Points",permalink:"/docs/0.91.0/Tutorials/tutorial11"},next:{title:"Active Shape Model Fitting",permalink:"/docs/0.91.0/Tutorials/tutorial13"}},u=[{value:"Related resources",id:"related-resources",children:[],level:5},{value:"Preparation",id:"preparation",children:[],level:5},{value:"Loading and visualizing a mesh",id:"loading-and-visualizing-a-mesh",children:[],level:2},{value:"Building a Gaussian process shape model",id:"building-a-gaussian-process-shape-model",children:[],level:2},{value:"Registration",id:"registration",children:[{value:"Working with the registration result",id:"working-with-the-registration-result",children:[],level:3},{value:"Improving registrations for more complex shapes.",id:"improving-registrations-for-more-complex-shapes",children:[],level:3}],level:2}],p={toc:u};function m(e){var t=e.components,s=(0,n.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},p,s,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"We have seen how non-rigid ICP can be used to establish correspondences.\nIn this tutorial we discuss a different approach to model-fitting and non-rigid registration.\nWe are formulating the registration problem as an optimization problem, which we optimize\nusing gradient-based optimization."),(0,i.kt)("p",null,"This registration is more general than ICP, in the sense that it can not only\nbe used for surface-to-surface registration, but also for image-to-image-registration.\nIn this tutorial we show the complete work-flow involved in a typical registration task,\nfrom building the Gaussian process model to performing the actual optimization."),(0,i.kt)("h5",{id:"related-resources"},"Related resources"),(0,i.kt)("p",null,"The following resources from our ",(0,i.kt)("a",{parentName:"p",href:"https://www.futurelearn.com/courses/statistical-shape-modelling"},"online course")," may provide\nsome helpful context for this tutorial:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Model-fitting and correspondence ",(0,i.kt)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250371"},"(Video)"))),(0,i.kt)("p",null,"To run the code from this tutorial, download the following Scala file:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{target:"_blank",href:a(2121).Z},"Tutorial12.scala"))),(0,i.kt)("h5",{id:"preparation"},"Preparation"),(0,i.kt)("p",null,"As in the previous tutorials, we start by importing some commonly used objects and initializing the system."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"import scalismo.geometry._\nimport scalismo.common._\nimport scalismo.common.interpolation._\nimport scalismo.mesh._\nimport scalismo.registration._\nimport scalismo.io.MeshIO\nimport scalismo.numerics._\nimport scalismo.kernels._\nimport scalismo.statisticalmodel._\nimport breeze.linalg.DenseVector\n\nimport scalismo.ui.api._\n\nimport breeze.linalg.{DenseVector}\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"scalismo.initialize()\nimplicit val rng: scalismo.utils.Random = scalismo.utils.Random(42)\n\nval ui = ScalismoUI()\n")),(0,i.kt)("h2",{id:"loading-and-visualizing-a-mesh"},"Loading and visualizing a mesh"),(0,i.kt)("p",null,"We start by loading and visualizing the reference mesh, which we will later use as the\ndomain for our Gaussian Process model."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},'val referenceMesh = MeshIO.readMesh(new java.io.File("datasets/quickstart/facemesh.ply")).get\n\n\nval modelGroup = ui.createGroup("model")\nval refMeshView = ui.show(modelGroup, referenceMesh, "referenceMesh")\nrefMeshView.color = java.awt.Color.RED\n')),(0,i.kt)("h2",{id:"building-a-gaussian-process-shape-model"},"Building a Gaussian process shape model"),(0,i.kt)("p",null,"We assume that our reference surface represents an approximately average face.\nThis justifies the use of a zero-mean Gaussian process. As a covariance function we use a Gaussian kernel and choose to treat the x,y,z component\nof the vector field to be uncorrelated (indicated by the use of the ",(0,i.kt)("inlineCode",{parentName:"p"},"DiagonalKernel"),")."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val zeroMean = Field(EuclideanSpace3D, (_: Point[_3D]) => EuclideanVector.zeros[_3D])\nval kernel = DiagonalKernel3D(GaussianKernel3D(sigma = 70) * 50.0, outputDim = 3)\nval gp = GaussianProcess(zeroMean, kernel)\n")),(0,i.kt)("p",null,"We then perform a low-rank approximation, to get a parametric representation of the\nGaussian process:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val interpolator = TriangleMeshInterpolator3D[EuclideanVector[_3D]]()\nval lowRankGP = LowRankGaussianProcess.approximateGPCholesky(\n    referenceMesh,\n    gp,\n    relativeTolerance = 0.05,\n    interpolator = interpolator)\n")),(0,i.kt)("p",null,"To visualize the effect of this Gaussian process, we add it to the\nmodel group as a transformation."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},'val gpView = ui.addTransformation(modelGroup, lowRankGP, "gp")\n')),(0,i.kt)("p",null,"This has the effect, that the transformations represented by this GP,\nare applied to all the geometric objects, which are present in the group.\nIn this case, it is the mean of the Gaussian process, which is applied to\nthe reference mesh we loaded previously. By changing the parameters in the\nui, we can visualize different transformations, as we did previously\nfor statistical shape models."),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},"Note: Adding the reference mesh to the scene, followed by a Gaussian process transformation\nis indeed what happend internally, we visualized Statistical Shape Models in the\nprevious tutorials")),(0,i.kt)("p",null,"Having visualized the Gaussian process, we can now draw random samples,\nto assess whether out choice of parameters of the Gaussian process leads to\nreasonable deformations. If not, we adjust the parameters until we are happy\nwith the deformations that are modelled."),(0,i.kt)("h2",{id:"registration"},"Registration"),(0,i.kt)("p",null,"In the next step we perform the registration to a target mesh.\nWe start by loading the target mesh and displaying it."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},'val targetGroup = ui.createGroup("target")\nval targetMesh = MeshIO.readMesh(new java.io.File("datasets/quickstart/face-2.ply")).get\nval targetMeshView = ui.show(targetGroup, targetMesh, "targetMesh")\n')),(0,i.kt)("p",null,(0,i.kt)("em",{parentName:"p"},'To visualize a registration, it is best to change the perspective in the graphical user interface to "orthogonal slices". You can find this functionality in the "View -> Perspective" menu.')),(0,i.kt)("p",null,"To define a registration, we need to define four things:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"a ",(0,i.kt)("inlineCode",{parentName:"li"},"transformation space")," that models the possible transformations of the reference surface (or the ambient space)"),(0,i.kt)("li",{parentName:"ol"},"a ",(0,i.kt)("inlineCode",{parentName:"li"},"metric")," to measure the distance between the model (the deformed reference mesh) an the target surface."),(0,i.kt)("li",{parentName:"ol"},"a ",(0,i.kt)("inlineCode",{parentName:"li"},"regularizer"),", which penalizes unlikely transformations."),(0,i.kt)("li",{parentName:"ol"},"an ",(0,i.kt)("inlineCode",{parentName:"li"},"optimizer"),".")),(0,i.kt)("p",null,"For non-rigid registration we usually model the possible transformations using a Gaussian process. We use the Gaussian process that\nwe have defined above to define the transformation space."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val transformationSpace = GaussianProcessTransformationSpace(lowRankGP)\n")),(0,i.kt)("p",null,"As a metric, we use a simple mean squares metric. Currently, all metrics that are available in scalismo are implemented as\nimage to image metrics. These can, however, easily be used for surface registration by representing the surface as  a distance image.\nIn addition to the images, the metric also needs to know the possible transformations (as modelled by the transformation space) and\na sampler. The sampler determines the points where the metric is evaluated. In our case we choose uniformely sampled points on the\nreference mesh."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val fixedImage = referenceMesh.operations.toDistanceImage\nval movingImage = targetMesh.operations.toDistanceImage\nval sampler = FixedPointsUniformMeshSampler3D(referenceMesh, numberOfPoints = 1000)\nval metric = MeanSquaresMetric(fixedImage, movingImage, transformationSpace, sampler)\n")),(0,i.kt)("p",null,"As an optimizer, we choose an LBFGS Optimizer"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val optimizer = LBFGSOptimizer(maxNumberOfIterations = 100)\n")),(0,i.kt)("p",null,"and for regularization we choose to penalize the L2 norm using the ",(0,i.kt)("inlineCode",{parentName:"p"},"L2Regularizer"),":"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val regularizer = L2Regularizer(transformationSpace)\n")),(0,i.kt)("p",null,"We are now ready to define Scalismo's registration object."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val registration = Registration(metric, regularizer, regularizationWeight = 1e-5, optimizer)\n")),(0,i.kt)("p",null,"Registration is an iterative process. Consequently, we work with the registration using an iterator. We obtain an iterator by\ncalling the ",(0,i.kt)("inlineCode",{parentName:"p"},"iterator")," method, where we also provide a starting position for the iteration (which is in this case the zero vector):"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val initialCoefficients = DenseVector.zeros[Double](lowRankGP.rank)\nval registrationIterator = registration.iterator(initialCoefficients)\n")),(0,i.kt)("p",null,"Before running the registration, we change the iterator such that it prints in each iteration to current objective value,\nand updates the visualization. This lets us visually inspect the progress of the registration procedure."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},'val visualizingRegistrationIterator = for ((it, itnum) <- registrationIterator.zipWithIndex) yield {\n  println(s"object value in iteration $itnum is ${it.value}")\n  gpView.coefficients = it.parameters\n  it\n}\n')),(0,i.kt)("p",null,'Note that the above code does not yet run the registration. It simply returns a new iterator, which augments\nthe original iteration with visualization. The actual registration is executed once we "consume" the iterator.\nThis can, for example be achieved by converting it to a sequence. The resulting sequence holds all the intermediate\nstates of the registration. We are usually only interested in the last one:'),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val registrationResult = visualizingRegistrationIterator.toSeq.last\n")),(0,i.kt)("p",null,"You should see in the graphical user interface, how the face mesh slowly adapts to the shape of the target mesh."),(0,i.kt)("p",null,"The final mesh representation can be obtained by obtaining the transform corresponding to the parameters and to\nwarp the reference mesh with this tranform:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val registrationTransformation = transformationSpace.transformationForParameters(registrationResult.parameters)\nval fittedMesh = referenceMesh.transform(registrationTransformation)\n")),(0,i.kt)("h3",{id:"working-with-the-registration-result"},"Working with the registration result"),(0,i.kt)("p",null,"The fittedMesh that we obtained above is a surface that approximates the target surface.  It corresponds to the best representation of the target in the model. For most tasks, this approximation is sufficient.\nHowever, sometimes, we need an exact representation of the target mesh. This can be achieved by defining a projection function, which projects each point onto its closest point on the target."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val targetMeshOperations = targetMesh.operations\nval projection = (pt: Point[_3D]) => {\n    targetMeshOperations.closestPointOnSurface(pt).point\n}\n")),(0,i.kt)("p",null,"Composing the result of the registration with this projection, will give us a mapping that identifies for each point of the reference mesh the corresponding point of the target mesh."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val finalTransformation = registrationTransformation.andThen(projection)\n")),(0,i.kt)("p",null,"To check this last point, we warp the reference mesh with the finalTransform and visualize it. Note that the projected target now coincides with the target mesh.."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},'val projectedMesh = referenceMesh.transform(finalTransformation)\nval resultGroup = ui.createGroup("result")\nval projectionView = ui.show(resultGroup, projectedMesh, "projection")\n')),(0,i.kt)("h3",{id:"improving-registrations-for-more-complex-shapes"},"Improving registrations for more complex shapes."),(0,i.kt)("p",null,"This registration procedure outlined above works reasonably well for simple cases. In complex cases, in particular if you have large\nshape variations, you may find it difficult to find a suitable regularization weight. When you choose the regularization weight\nlarge, the procedure will result in a nice and smooth mesh, but fails to closely fit the surface. If you choose it small, it may\nresult in folds and bad correspondences. In such cases it has proven extremely useful to simply iterate the registration procedure,\nwith decreasing regularization weights. In the following we illustrate this procedure. We start by defining a case class, which\ncollects all relevant parameters:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"case class RegistrationParameters(regularizationWeight: Double, numberOfIterations: Int, numberOfSampledPoints: Int)\n")),(0,i.kt)("p",null,"We put all the registration code into a function, which takes (among others) the registration parameters as an argument."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},'def doRegistration(\n    lowRankGP: LowRankGaussianProcess[_3D, EuclideanVector[_3D]],\n    referenceMesh: TriangleMesh[_3D],\n    targetmesh: TriangleMesh[_3D],\n    registrationParameters: RegistrationParameters,\n    initialCoefficients: DenseVector[Double]\n  ): DenseVector[Double] = {\n    val transformationSpace = GaussianProcessTransformationSpace(lowRankGP)\n    val fixedImage = referenceMesh.operations.toDistanceImage\n    val movingImage = targetMesh.operations.toDistanceImage\n    val sampler = FixedPointsUniformMeshSampler3D(\n      referenceMesh,\n      registrationParameters.numberOfSampledPoints\n    )\n    val metric = MeanSquaresMetric(\n      fixedImage,\n      movingImage,\n      transformationSpace,\n      sampler\n    )\n    val optimizer = LBFGSOptimizer(registrationParameters.numberOfIterations)\n    val regularizer = L2Regularizer(transformationSpace)\n    val registration = Registration(\n      metric,\n      regularizer,\n      registrationParameters.regularizationWeight,\n      optimizer\n    )\n    val registrationIterator = registration.iterator(initialCoefficients)\n    val visualizingRegistrationIterator = for ((it, itnum) <- registrationIterator.zipWithIndex) yield {\n      println(s"object value in iteration $itnum is ${it.value}")\n      it\n    }\n    val registrationResult = visualizingRegistrationIterator.toSeq.last\n    registrationResult.parameters\n}\n')),(0,i.kt)("p",null,"Finally, we define the parameters and run the registration. Note that for large regularization weights, we sample fewer points on the surface to save some computation time.\nThis is justified as, a strongly regularized model will not be able to adapt to fine details and hence it is not necessary to have a very accurate sampling of the surface."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val registrationParameters = Seq(\n    RegistrationParameters(regularizationWeight = 1e-1, numberOfIterations = 20, numberOfSampledPoints = 1000),\n    RegistrationParameters(regularizationWeight = 1e-2, numberOfIterations = 30, numberOfSampledPoints = 1000),\n    RegistrationParameters(regularizationWeight = 1e-4, numberOfIterations = 40, numberOfSampledPoints = 2000),\n    RegistrationParameters(regularizationWeight = 1e-6, numberOfIterations = 50, numberOfSampledPoints = 4000)\n  )\n\n\nval finalCoefficients = registrationParameters.foldLeft(initialCoefficients)((modelCoefficients, regParameters) =>\n    doRegistration(lowRankGP, referenceMesh, targetMesh, regParameters, modelCoefficients)\n  )\n\n")),(0,i.kt)("p",null,"From this point we use the procedure described above to work with the registration result."))}m.isMDXComponent=!0},2121:function(e,t,a){t.Z=a.p+"assets/files/Tutorial12-8df84448c8575c285374f8dc392d81c0.scala"}}]);