(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{160:function(e,t,o){"use strict";o.d(t,"a",(function(){return u})),o.d(t,"b",(function(){return b}));var a=o(0),r=o.n(a);function n(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function s(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,a)}return o}function i(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?s(Object(o),!0).forEach((function(t){n(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):s(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function l(e,t){if(null==e)return{};var o,a,r=function(e,t){if(null==e)return{};var o,a,r={},n=Object.keys(e);for(a=0;a<n.length;a++)o=n[a],t.indexOf(o)>=0||(r[o]=e[o]);return r}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(a=0;a<n.length;a++)o=n[a],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(r[o]=e[o])}return r}var c=r.a.createContext({}),p=function(e){var t=r.a.useContext(c),o=t;return e&&(o="function"==typeof e?e(t):i(i({},t),e)),o},u=function(e){var t=p(e.components);return r.a.createElement(c.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},d=r.a.forwardRef((function(e,t){var o=e.components,a=e.mdxType,n=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=p(o),d=a,b=u["".concat(s,".").concat(d)]||u[d]||m[d]||n;return o?r.a.createElement(b,i(i({ref:t},c),{},{components:o})):r.a.createElement(b,i({ref:t},c))}));function b(e,t){var o=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var n=o.length,s=new Array(n);s[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:a,s[1]=i;for(var c=2;c<n;c++)s[c]=o[c];return r.a.createElement.apply(null,s)}return r.a.createElement.apply(null,o)}d.displayName="MDXCreateElement"},68:function(e,t,o){"use strict";o.r(t),o.d(t,"frontMatter",(function(){return s})),o.d(t,"metadata",(function(){return i})),o.d(t,"rightToc",(function(){return l})),o.d(t,"default",(function(){return p}));var a=o(3),r=o(7),n=(o(0),o(160)),s={id:"tutorial8",title:"Posterior Shape Models"},i={unversionedId:"tutorials/tutorial8",id:"version-0.18/tutorials/tutorial8",isDocsHomePage:!1,title:"Posterior Shape Models",description:"In this tutorial we will use Gaussian processes for regression tasks and experiment with the concept of posterior shape models.",source:"@site/versioned_docs/version-0.18/tutorials/tutorial8.md",slug:"/tutorials/tutorial8",permalink:"/docs/0.18/tutorials/tutorial8",editUrl:"https://github.com/unibas-gravis/scalismo-microsite/edit/master/website/versioned_docs/version-0.18/tutorials/tutorial8.md",version:"0.18",sidebar:"version-0.18/docs",previous:{title:"Shape modelling with Gaussian processes and kernels",permalink:"/docs/0.18/tutorials/tutorial7"},next:{title:"Shape completion using Gaussian process regression",permalink:"/docs/0.18/tutorials/tutorial9"}},l=[{value:"Fitting observed data using Gaussian process regression",id:"fitting-observed-data-using-gaussian-process-regression",children:[{value:"Posterior of a StatisticalMeshModel:",id:"posterior-of-a-statisticalmeshmodel",children:[]}]}],c={rightToc:l};function p(e){var t=e.components,o=Object(r.a)(e,["components"]);return Object(n.b)("wrapper",Object(a.a)({},c,o,{components:t,mdxType:"MDXLayout"}),Object(n.b)("p",null,"In this tutorial we will use Gaussian processes for regression tasks and experiment with the concept of posterior shape models.\nThis will form the basics for the next tutorial, where we will see how these tools can be applied to construct a\nreconstruction of partial shapes."),Object(n.b)("h5",{id:"related-resources"},"Related resources"),Object(n.b)("p",null,"The following resources from our ",Object(n.b)("a",{parentName:"p",href:"https://www.futurelearn.com/courses/statistical-shape-modelling"},"online course")," may provide\nsome helpful context for this tutorial:"),Object(n.b)("ul",null,Object(n.b)("li",{parentName:"ul"},"The regression problem ",Object(n.b)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250360"},"(Article)")),Object(n.b)("li",{parentName:"ul"},"Gaussian process regression ",Object(n.b)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250361"},"(Video)")),Object(n.b)("li",{parentName:"ul"},"Posterior models for different kernels ",Object(n.b)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250362"},"(Article)"))),Object(n.b)("h5",{id:"preparation"},"Preparation"),Object(n.b)("p",null,"As in the previous tutorials, we start by importing some commonly used objects and initializing the system."),Object(n.b)("pre",null,Object(n.b)("code",{parentName:"pre",className:"language-scala"},"import scalismo.geometry._\nimport scalismo.common._\nimport scalismo.ui.api._\nimport scalismo.mesh._\nimport scalismo.io.{StatisticalModelIO, MeshIO}\nimport scalismo.statisticalmodel._\nimport scalismo.numerics.UniformMeshSampler3D\nimport scalismo.kernels._\nimport breeze.linalg.{DenseMatrix, DenseVector}\n\nscalismo.initialize()\nimplicit val rng = scalismo.utils.Random(42)\n\nval ui = ScalismoUI()\n")),Object(n.b)("p",null,"We also load and visualize the face model:"),Object(n.b)("pre",null,Object(n.b)("code",{parentName:"pre",className:"language-scala"},'val model = StatisticalModelIO.readStatisticalMeshModel(new java.io.File("datasets/bfm.h5")).get\n\nval modelGroup = ui.createGroup("modelGroup")\nval ssmView = ui.show(modelGroup, model, "model")\n')),Object(n.b)("h2",{id:"fitting-observed-data-using-gaussian-process-regression"},"Fitting observed data using Gaussian process regression"),Object(n.b)("p",null,"The reason we build statistical models is that we want to use them\nfor explaining data. More precisely, given some observed data, we fit the model\nto the data and get as a result a distribution over the model parameters.\nIn our case, the model is a Gaussian process model of shape deformations, and the data are observed shape deformations; I.e. deformation vectors from the reference surface."),Object(n.b)("p",null,"To illustrate this process, we simulate some data. We generate\na deformation vector at the tip of the nose, which corresponds ot a really long\nnose:"),Object(n.b)("pre",null,Object(n.b)("code",{parentName:"pre",className:"language-scala"},"val idNoseTip = PointId(8156)\nval noseTipReference = model.referenceMesh.pointSet.point(idNoseTip)\nval noseTipMean = model.mean.pointSet.point(idNoseTip)\nval noseTipDeformation = (noseTipMean - noseTipReference) * 2.0\n")),Object(n.b)("p",null,"To visualize this deformation, we need to define a ",Object(n.b)("inlineCode",{parentName:"p"},"DiscreteField"),", which can then be passed to the show\nmethod of our ",Object(n.b)("inlineCode",{parentName:"p"},"ui")," object."),Object(n.b)("pre",null,Object(n.b)("code",{parentName:"pre",className:"language-scala"},'val noseTipDomain = UnstructuredPointsDomain(IndexedSeq(noseTipReference))\nval noseTipDeformationAsSeq = IndexedSeq(noseTipDeformation)\nval noseTipDeformationField = DiscreteField[_3D, UnstructuredPointsDomain[_3D], EuclideanVector[_3D]](noseTipDomain, noseTipDeformationAsSeq)\n\nval observationGroup = ui.createGroup("observation")\nui.show(observationGroup, noseTipDeformationField, "noseTip")\n')),Object(n.b)("p",null,"In the next step we set up the regression. The Gaussian process model assumes that the deformation\nis observed only up to some uncertainty,\nwhich can be modelled using a normal distribution."),Object(n.b)("pre",null,Object(n.b)("code",{parentName:"pre",className:"language-scala"},"val noise = MultivariateNormalDistribution(DenseVector.zeros[Double](3), DenseMatrix.eye[Double](3))\n")),Object(n.b)("p",null,"In Scalismo, the data for the regression is specified by a sequence of triples, consisting of the point of the reference, the\ncorresponding deformation vector, as well as the noise at that point:"),Object(n.b)("pre",null,Object(n.b)("code",{parentName:"pre",className:"language-scala"},"val regressionData = IndexedSeq((noseTipReference, noseTipDeformation, noise))\n")),Object(n.b)("p",null,"We can now obtain the regression result by feeding this data to the method ",Object(n.b)("inlineCode",{parentName:"p"},"regression")," of the ",Object(n.b)("inlineCode",{parentName:"p"},"GaussianProcess")," object:"),Object(n.b)("pre",null,Object(n.b)("code",{parentName:"pre",className:"language-scala"},"val gp : LowRankGaussianProcess[_3D, EuclideanVector[_3D]] = model.gp.interpolate(NearestNeighborInterpolator())\nval posteriorGP : LowRankGaussianProcess[_3D, EuclideanVector[_3D]] = LowRankGaussianProcess.regression(gp, regressionData)\n")),Object(n.b)("p",null,"Note that the result of the regression is again a Gaussian process, over the same domain as the original process. We call this the ",Object(n.b)("em",{parentName:"p"},"posterior process"),".\nThis construction is very important in Scalismo. Therefore, we have a convenience method defined directly on the Gaussian process object. We could write the same in\nthe more succinctly:"),Object(n.b)("pre",null,Object(n.b)("code",{parentName:"pre",className:"language-scala"},"gp.posterior(regressionData)\n")),Object(n.b)("p",null,"Independently of how you call the method, the returned type is a continuous (low rank) Gaussian Process from which we can now sample deformations at any set of points:"),Object(n.b)("pre",null,Object(n.b)("code",{parentName:"pre",className:"language-scala"},'val posteriorSample : DiscreteField[_3D, UnstructuredPointsDomain[_3D], EuclideanVector[_3D]]\n    = posteriorGP.sampleAtPoints(model.referenceMesh.pointSet)\nval posteriorSampleGroup = ui.createGroup("posteriorSamples")\nfor (i <- 0 until 10) {\n    ui.show(posteriorSampleGroup, posteriorSample, "posteriorSample")\n}\n')),Object(n.b)("h3",{id:"posterior-of-a-statisticalmeshmodel"},"Posterior of a StatisticalMeshModel:"),Object(n.b)("p",null,"Given that the StatisticalMeshModel is merely a wrapper around a GP, the same posterior functionality is available for statistical mesh models:"),Object(n.b)("pre",null,Object(n.b)("code",{parentName:"pre",className:"language-scala"},"val littleNoise = MultivariateNormalDistribution(DenseVector.zeros[Double](3), DenseMatrix.eye[Double](3) * 0.01)\nval pointOnLargeNose = noseTipReference + noseTipDeformation\nval discreteTrainingData = IndexedSeq((PointId(8156), pointOnLargeNose, littleNoise))\nval meshModelPosterior : StatisticalMeshModel = model.posterior(discreteTrainingData)\n")),Object(n.b)("p",null,"Notice in this case, since we are working with a discrete Gaussian process, the observed data is specified in terms of the ",Object(n.b)("em",{parentName:"p"},"point identifier")," of the nose tip point instead of its 3D coordinates."),Object(n.b)("p",null,"Let's visualize the obtained posterior model:"),Object(n.b)("pre",null,Object(n.b)("code",{parentName:"pre",className:"language-scala"},'val posteriorModelGroup = ui.createGroup("posteriorModel")\nui.show(posteriorModelGroup, meshModelPosterior, "NoseyModel")\n')),Object(n.b)("p",null,Object(n.b)("em",{parentName:"p"},"Exercise: sample a few random faces from the graphical interface using the random button. Notice how all faces display large noses :) with the tip of the nose remaining close to the selected landmark.")),Object(n.b)("p",null,"Here again we obtain much more than just a single face instance fitting the input data: we get a full normal distribution of shapes fitting the observation. The ",Object(n.b)("strong",{parentName:"p"},"most probable")," shape, and hence our best fit, is the ",Object(n.b)("strong",{parentName:"p"},"mean")," of the posterior."),Object(n.b)("p",null,"We notice by sampling from the posterior model that we tend to get faces with rather large noses. This is since we chose our observation to be twice the length of the\naverage (mean) deformation at the tip of the nose."),Object(n.b)("h4",{id:"landmark-uncertainty"},"Landmark uncertainty:"),Object(n.b)("p",null,"When we are specifying the training data for the posterior GP computation,\nwe model the uncertainty of the input data. The variance of this\nnoise model has a large influence on the resulting posterior distribution.\nWe should choose it always such that it corresponds as closely as possible to\nthe real uncertainty of our observation."),Object(n.b)("p",null,"To see how this variance influences the posterior, we perform the posterior computation again with,\nthis time, a 5 times bigger noise variance."),Object(n.b)("pre",null,Object(n.b)("code",{parentName:"pre",className:"language-scala"},'val largeNoise = MultivariateNormalDistribution(DenseVector.zeros[Double](3), DenseMatrix.eye[Double](3) * 5.0)\nval discreteTrainingDataLargeNoise = IndexedSeq((PointId(8156), pointOnLargeNose, largeNoise))\nval discretePosteriorLargeNoise = model.posterior(discreteTrainingDataLargeNoise)\nval posteriorGroupLargeNoise = ui.createGroup("posteriorLargeNoise")\nui.show(posteriorGroupLargeNoise, discretePosteriorLargeNoise, "NoisyNoseyModel")\n')),Object(n.b)("p",null,"We observe, that there is now much more variance left in this posterior process,\nwhich is a consequence of the larger uncertainty that was associated with the\nobserved data."))}p.isMDXComponent=!0}}]);