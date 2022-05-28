"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[393],{3905:function(e,t,o){o.d(t,{Zo:function(){return c},kt:function(){return d}});var a=o(7294);function r(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function n(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,a)}return o}function i(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?n(Object(o),!0).forEach((function(t){r(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):n(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function s(e,t){if(null==e)return{};var o,a,r=function(e,t){if(null==e)return{};var o,a,r={},n=Object.keys(e);for(a=0;a<n.length;a++)o=n[a],t.indexOf(o)>=0||(r[o]=e[o]);return r}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(a=0;a<n.length;a++)o=n[a],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(r[o]=e[o])}return r}var l=a.createContext({}),p=function(e){var t=a.useContext(l),o=t;return e&&(o="function"==typeof e?e(t):i(i({},t),e)),o},c=function(e){var t=p(e.components);return a.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var o=e.components,r=e.mdxType,n=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),m=p(o),d=r,h=m["".concat(l,".").concat(d)]||m[d]||u[d]||n;return o?a.createElement(h,i(i({ref:t},c),{},{components:o})):a.createElement(h,i({ref:t},c))}));function d(e,t){var o=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var n=o.length,i=new Array(n);i[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,i[1]=s;for(var p=2;p<n;p++)i[p]=o[p];return a.createElement.apply(null,i)}return a.createElement.apply(null,o)}m.displayName="MDXCreateElement"},7e3:function(e,t,o){o.r(t),o.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return p},toc:function(){return c},default:function(){return m}});var a=o(7462),r=o(3366),n=(o(7294),o(3905)),i=["components"],s={id:"tutorial08",title:"Posterior shape models"},l=void 0,p={unversionedId:"Tutorials/tutorial08",id:"version-0.91.0/Tutorials/tutorial08",title:"Posterior shape models",description:"In this tutorial we will use Gaussian processes for regression tasks and experiment with the concept of posterior shape models.",source:"@site/versioned_docs/version-0.91.0/Tutorials/tutorial08.md",sourceDirName:"Tutorials",slug:"/Tutorials/tutorial08",permalink:"/docs/Tutorials/tutorial08",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/versioned_docs/version-0.91.0/Tutorials/tutorial08.md",tags:[],version:"0.91.0",frontMatter:{id:"tutorial08",title:"Posterior shape models"},sidebar:"docs",previous:{title:"Shape modelling with Gaussian processes and kernels",permalink:"/docs/Tutorials/tutorial07"},next:{title:"Shape completion using GP regression",permalink:"/docs/Tutorials/tutorial09"}},c=[{value:"Related resources",id:"related-resources",children:[],level:5},{value:"Preparation",id:"preparation",children:[],level:5},{value:"Fitting observed data using Gaussian process regression",id:"fitting-observed-data-using-gaussian-process-regression",children:[{value:"Posterior of a StatisticalMeshModel:",id:"posterior-of-a-statisticalmeshmodel",children:[{value:"Landmark uncertainty:",id:"landmark-uncertainty",children:[],level:4}],level:3}],level:2}],u={toc:c};function m(e){var t=e.components,s=(0,r.Z)(e,i);return(0,n.kt)("wrapper",(0,a.Z)({},u,s,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"In this tutorial we will use Gaussian processes for regression tasks and experiment with the concept of posterior shape models.\nThis will form the basics for the next tutorial, where we will see how these tools can be applied to construct a\nreconstruction of partial shapes."),(0,n.kt)("h5",{id:"related-resources"},"Related resources"),(0,n.kt)("p",null,"The following resources from our ",(0,n.kt)("a",{parentName:"p",href:"https://www.futurelearn.com/courses/statistical-shape-modelling"},"online course")," may provide\nsome helpful context for this tutorial:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"The regression problem ",(0,n.kt)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250360"},"(Article)")),(0,n.kt)("li",{parentName:"ul"},"Gaussian process regression ",(0,n.kt)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250361"},"(Video)")),(0,n.kt)("li",{parentName:"ul"},"Posterior models for different kernels ",(0,n.kt)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250362"},"(Article)"))),(0,n.kt)("p",null,"To run the code from this tutorial, download the following Scala file:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{target:"_blank",href:o(2934).Z},"Tutorial08.scala"))),(0,n.kt)("h5",{id:"preparation"},"Preparation"),(0,n.kt)("p",null,"As in the previous tutorials, we start by importing some commonly used objects and initializing the system."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-scala"},"import scalismo.geometry._\nimport scalismo.common._\nimport scalismo.common.interpolation.TriangleMeshInterpolator3D\nimport scalismo.mesh._\nimport scalismo.io.{StatisticalModelIO, MeshIO}\nimport scalismo.statisticalmodel._\nimport scalismo.numerics.UniformMeshSampler3D\nimport scalismo.kernels._\n\nimport scalismo.ui.api._\nimport breeze.linalg.{DenseMatrix, DenseVector}\n")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-scala"},"scalismo.initialize()\nimplicit val rng: scalismo.utils.Random = scalismo.utils.Random(42)\n\nval ui = ScalismoUI()\n")),(0,n.kt)("p",null,"We also load and visualize the face model:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-scala"},'val model = StatisticalModelIO.readStatisticalTriangleMeshModel3D(new java.io.File("datasets/bfm.h5")).get\n\nval modelGroup = ui.createGroup("modelGroup")\nval ssmView = ui.show(modelGroup, model, "model")\n')),(0,n.kt)("h2",{id:"fitting-observed-data-using-gaussian-process-regression"},"Fitting observed data using Gaussian process regression"),(0,n.kt)("p",null,"The reason we build statistical models is that we want to use them\nfor explaining data. More precisely, given some observed data, we fit the model\nto the data and get as a result a distribution over the model parameters.\nIn our case, the model is a Gaussian process model of shape deformations, and the data are observed shape deformations; I.e. deformation vectors from the reference surface."),(0,n.kt)("p",null,"To illustrate this process, we simulate some data. We generate\na deformation vector at the tip of the nose, which corresponds ot a really long\nnose:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-scala"},"val idNoseTip = PointId(8156)\nval noseTipReference = model.reference.pointSet.point(idNoseTip)\nval noseTipMean = model.mean.pointSet.point(idNoseTip)\nval noseTipDeformation = (noseTipReference - noseTipMean) * 2.0\n")),(0,n.kt)("p",null,"To visualize this deformation, we need to define a ",(0,n.kt)("inlineCode",{parentName:"p"},"DiscreteField"),", which can then be passed to the show\nmethod of our ",(0,n.kt)("inlineCode",{parentName:"p"},"ui")," object."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-scala"},'val noseTipDomain = UnstructuredPointsDomain3D(IndexedSeq(noseTipReference))\nval noseTipDeformationField = DiscreteField3D(noseTipDomain,  IndexedSeq(noseTipDeformation))\n\nval observationGroup = ui.createGroup("observation")\nui.show(observationGroup, noseTipDeformationField, "noseTip")\n')),(0,n.kt)("p",null,"In the next step we set up the regression. The Gaussian process model assumes that the deformation\nis observed only up to some uncertainty,\nwhich can be modelled using a normal distribution."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-scala"},"val noise = MultivariateNormalDistribution(DenseVector.zeros[Double](3), DenseMatrix.eye[Double](3))\n")),(0,n.kt)("p",null,"In Scalismo, the data for the regression is specified by a sequence of triples, consisting of the point of the reference, the\ncorresponding deformation vector, as well as the noise at that point:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-scala"},"val regressionData = IndexedSeq((noseTipReference, noseTipDeformation, noise))\n")),(0,n.kt)("p",null,"We can now obtain the regression result by feeding this data to the method ",(0,n.kt)("inlineCode",{parentName:"p"},"regression")," of the ",(0,n.kt)("inlineCode",{parentName:"p"},"GaussianProcess")," object:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-scala"},"val gp : LowRankGaussianProcess[_3D, EuclideanVector[_3D]] = model.gp.interpolate(TriangleMeshInterpolator3D())\nval posteriorGP : LowRankGaussianProcess[_3D, EuclideanVector[_3D]] = LowRankGaussianProcess.regression(gp, regressionData)\n")),(0,n.kt)("p",null,"Note that the result of the regression is again a Gaussian process, over the same domain as the original process. We call this the ",(0,n.kt)("em",{parentName:"p"},"posterior process"),".\nThis construction is very important in Scalismo. Therefore, we have a convenience method defined directly on the Gaussian process object. We could write the same in\nthe more succinctly:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-scala"},"gp.posterior(regressionData)\n")),(0,n.kt)("p",null,"Independently of how you call the method, the returned type is a continuous (low rank) Gaussian Process from which we can now sample deformations at any set of points:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-scala"},'val posteriorSample: DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] =\n    posteriorGP.sampleAtPoints(model.reference)\nval posteriorSampleGroup = ui.createGroup("posteriorSamples")\nfor (i <- 0 until 10) {\n    ui.show(posteriorSampleGroup, posteriorSample, "posteriorSample")\n}\n')),(0,n.kt)("h3",{id:"posterior-of-a-statisticalmeshmodel"},"Posterior of a StatisticalMeshModel:"),(0,n.kt)("p",null,"Given that the StatisticalMeshModel is merely a wrapper around a GP, the same posterior functionality is available for statistical mesh models:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-scala"},"val littleNoise = MultivariateNormalDistribution(DenseVector.zeros[Double](3), DenseMatrix.eye[Double](3) * 0.01)\nval pointOnLargeNose = noseTipReference + noseTipDeformation\nval discreteTrainingData = IndexedSeq((PointId(8156), pointOnLargeNose, littleNoise))\nval meshModelPosterior: PointDistributionModel[_3D, TriangleMesh] = model.posterior(discreteTrainingData)\n")),(0,n.kt)("p",null,"Notice in this case, since we are working with a discrete Gaussian process, the observed data is specified in terms of the ",(0,n.kt)("em",{parentName:"p"},"point identifier")," of the nose tip point instead of its 3D coordinates."),(0,n.kt)("p",null,"Let's visualize the obtained posterior model:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-scala"},'val posteriorModelGroup = ui.createGroup("posteriorModel")\nui.show(posteriorModelGroup, meshModelPosterior, "NoseyModel")\n')),(0,n.kt)("p",null,(0,n.kt)("em",{parentName:"p"},"Exercise: sample a few random faces from the graphical interface using the random button. Notice how all faces display large noses :) with the tip of the nose remaining close to the selected landmark.")),(0,n.kt)("p",null,"Here again we obtain much more than just a single face instance fitting the input data: we get a full normal distribution of shapes fitting the observation. The ",(0,n.kt)("strong",{parentName:"p"},"most probable")," shape, and hence our best fit, is the ",(0,n.kt)("strong",{parentName:"p"},"mean")," of the posterior."),(0,n.kt)("p",null,"We notice by sampling from the posterior model that we tend to get faces with rather large noses. This is since we chose our observation to be twice the length of the\naverage (mean) deformation at the tip of the nose."),(0,n.kt)("h4",{id:"landmark-uncertainty"},"Landmark uncertainty:"),(0,n.kt)("p",null,"When we are specifying the training data for the posterior GP computation,\nwe model the uncertainty of the input data. The variance of this\nnoise model has a large influence on the resulting posterior distribution.\nWe should choose it always such that it corresponds as closely as possible to\nthe real uncertainty of our observation."),(0,n.kt)("p",null,"To see how this variance influences the posterior, we perform the posterior computation again with,\nthis time, a 5 times bigger noise variance."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-scala"},'val largeNoise = MultivariateNormalDistribution(DenseVector.zeros[Double](3), DenseMatrix.eye[Double](3) * 5.0)\nval discreteTrainingDataLargeNoise = IndexedSeq((PointId(8156), pointOnLargeNose, largeNoise))\nval discretePosteriorLargeNoise = model.posterior(discreteTrainingDataLargeNoise)\nval posteriorGroupLargeNoise = ui.createGroup("posteriorLargeNoise")\nui.show(posteriorGroupLargeNoise, discretePosteriorLargeNoise, "NoisyNoseyModel")\n')),(0,n.kt)("p",null,"We observe, that there is now much more variance left in this posterior process,\nwhich is a consequence of the larger uncertainty that was associated with the\nobserved data."))}m.isMDXComponent=!0},2934:function(e,t,o){t.Z=o.p+"assets/files/Tutorial08-6bc748fbe3692fec67c39c0c3f1954f7.scala"}}]);