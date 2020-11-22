(window.webpackJsonp=window.webpackJsonp||[]).push([[38],{105:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return s})),n.d(t,"metadata",(function(){return l})),n.d(t,"rightToc",(function(){return r})),n.d(t,"default",(function(){return p}));var a=n(3),i=n(7),o=(n(0),n(111)),s={id:"tutorial5",title:"Gaussian processes, sampling and marginalization"},l={unversionedId:"tutorials/tutorial5",id:"tutorials/tutorial5",isDocsHomePage:!1,title:"Gaussian processes, sampling and marginalization",description:"In this tutorial we will experiment with sampling and marginalization of",source:"@site/docs/tutorials/tutorial5.md",slug:"/tutorials/tutorial5",permalink:"/docs/tutorials/tutorial5",editUrl:"https://github.com/unibas-gravis/scalismo-microsite/edit/master/website/docs/tutorials/tutorial5.md",version:"current",sidebar:"docs",previous:{title:"Gaussian processes and Point Distribution Models",permalink:"/docs/tutorials/tutorial4"},next:{title:"Building a shape model from data",permalink:"/docs/tutorials/tutorial6"}},r=[{value:"From continuous to discrete: marginalization",id:"from-continuous-to-discrete-marginalization",children:[]},{value:"Marginal of a statistical mesh model",id:"marginal-of-a-statistical-mesh-model",children:[]},{value:"Probability of shapes and deformations:",id:"probability-of-shapes-and-deformations",children:[]}],c={rightToc:r};function p(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(o.b)("wrapper",Object(a.a)({},c,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"In this tutorial we will experiment with sampling and marginalization of\nGaussian processes. Furthermore, we will learn how to compare the\nlikelihood of instances of our model."),Object(o.b)("h5",{id:"related-resources"},"Related resources"),Object(o.b)("p",null,"The following resources from our ",Object(o.b)("a",Object(a.a)({parentName:"p"},{href:"https://www.futurelearn.com/courses/statistical-shape-modelling"}),"online course")," may provide\nsome helpful context for this tutorial:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"The marginalization property ",Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250339"}),"(Video)")),Object(o.b)("li",{parentName:"ul"},"Sampling from a shape model ",Object(o.b)("a",Object(a.a)({parentName:"li"},{href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250340"}),"(Article)"))),Object(o.b)("h5",{id:"preparation"},"Preparation"),Object(o.b)("p",null,"As in the previous tutorials, we start by importing some commonly used objects and initializing the system."),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),"import scalismo.geometry._\nimport scalismo.common._\nimport scalismo.ui.api._\nimport scalismo.mesh._\nimport scalismo.io.StatisticalModelIO\nimport scalismo.statisticalmodel._\n\nscalismo.initialize()\nimplicit val rng = scalismo.utils.Random(42)\n\nval ui = ScalismoUI()\n")),Object(o.b)("h4",{id:"discrete-and-continuous-gaussian-processes"},"Discrete and Continuous Gaussian processes"),Object(o.b)("p",null,"We have seen in the last tutorial that a Point Distribution Model (PDM)\nis represented in Scalismo as a (discrete) Gaussian process over deformation fields,\ndefined on a reference mesh."),Object(o.b)("p",null,"To continue our exploration of Gaussian processes, we therefore start\nby loading (and visualizing) an existing PDM and retrieve its underlying\nGaussian process"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),'val model = StatisticalModelIO.readStatisticalMeshModel(new java.io.File("datasets/bfm.h5")).get\nval gp = model.gp\n\nval modelGroup = ui.createGroup("modelGroup")\nval ssmView = ui.show(modelGroup, model, "model")\n')),Object(o.b)("p",null,"We can retrieve random samples from the Gaussian process by calling ",Object(o.b)("inlineCode",{parentName:"p"},"sample"),"\non the ",Object(o.b)("inlineCode",{parentName:"p"},"gp")," object:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),'val sampleDF : DiscreteField[_3D,UnstructuredPointsDomain[_3D], EuclideanVector[_3D]]\n    = model.gp.sample\n\nval sampleGroup = ui.createGroup("sample")\nui.show(sampleGroup, sampleDF, "discreteSample")\n')),Object(o.b)("p",null,"Note that the sampled vector field is ",Object(o.b)("strong",{parentName:"p"},"discrete"),"; I.e. is\ndefined over a ",Object(o.b)("strong",{parentName:"p"},"discrete set of points"),".\nThis is due to the fact that our Gaussian Process is stored in a file\nand was therefore discretized over the points of the reference mesh."),Object(o.b)("p",null,"As seen in the previous tutorial, we could interpolate the\nsample ",Object(o.b)("inlineCode",{parentName:"p"},"sampleDf")," to obtain a continuous version of the deformation field.\nA more convenient approach is, however, to interpolate the\nGaussian process directly:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),"val interpolator = NearestNeighborInterpolator[_3D, EuclideanVector[_3D]]()\nval contGP = model.gp.interpolate(interpolator)\n")),Object(o.b)("p",null,"When we sample now from the continuous GP, we obtain a vector-valued function,\nwhich is defined on the entire 3D Space:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),"val contSample: Field[_3D, EuclideanVector[_3D]] = contGP.sample\n")),Object(o.b)("p",null,Object(o.b)("em",{parentName:"p"},"Attention: While the interpolated Gaussian process is now defined on the entire 3D Space, the interpolation really only makes sense close to the mesh points"),"."),Object(o.b)("h2",{id:"from-continuous-to-discrete-marginalization"},"From continuous to discrete: marginalization"),Object(o.b)("p",null,"In practice, we will never work with a continuous Gaussian process directly.\nWe are always interested in the distribution on a finite set of points.\nThe real advantage of having a continuous Gaussian process is, that we can\nget samples at ",Object(o.b)("em",{parentName:"p"},"any")," finite set of points and thereby choosing the discretization\naccording to the needs of our application."),Object(o.b)("p",null,"To illustrate this, we could, for example obtain a sample,\nwhich is defined on all the points of the original reference mesh."),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),'val fullSample = contGP.sampleAtPoints(model.referenceMesh.pointSet)\nval fullSampleView = ui.show(sampleGroup, fullSample, "fullSample")\n')),Object(o.b)("p",null,"We can also obtain samples which are defined only at a single point:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),'fullSampleView.remove()\nval singlePointDomain : DiscreteDomain[_3D] =\n    UnstructuredPointsDomain(IndexedSeq(model.referenceMesh.pointSet.point(PointId(8156))))\nval singlePointSample = contGP.sampleAtPoints(singlePointDomain)\nui.show(sampleGroup, singlePointSample, "singlePointSample")\n')),Object(o.b)("p",null,"(This should show a vector at the tip of the nose, which, could also be behind the face)"),Object(o.b)("p",null,"The marginalization property of a Gaussian process makes it possible not only\nto obtain samples at an arbitrary set of points, but also the\ndistribution at these points. We can\nobtain this distribution, by calling the method ",Object(o.b)("inlineCode",{parentName:"p"},"marginal"),"\non the Gaussian process instance:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),"val referencePointSet = model.referenceMesh.pointSet\nval rightEyePt: Point[_3D] = referencePointSet.point(PointId(4281))\nval leftEyePt: Point[_3D] = referencePointSet.point(PointId(11937))\nval dom = UnstructuredPointsDomain(IndexedSeq(rightEyePt,leftEyePt))\nval marginal : DiscreteGaussianProcess[_3D, UnstructuredPointsDomain[_3D], EuclideanVector[_3D]] = contGP.marginal(dom)\n")),Object(o.b)("p",null,"The result of marginalization is again a discrete Gaussian process.\nSampling from this new Gaussian process yields a discrete deformation field, which\nis defined only at the two points over which we marginalized:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),'val sample : DiscreteField[_3D, UnstructuredPointsDomain[_3D], EuclideanVector[_3D]] = marginal.sample\nui.show(sampleGroup, sample, "marginal_sample")\n')),Object(o.b)("p",null,"It seems that we are back where we started. But note that we have\nnow choosen a completly different set of points\non which the Gaussian process is defined.\nThis is important, as we can choose for any application that\ndiscretization of the Gaussian process, which is most useful."),Object(o.b)("h2",{id:"marginal-of-a-statistical-mesh-model"},"Marginal of a statistical mesh model"),Object(o.b)("p",null,"Given that a ",Object(o.b)("em",{parentName:"p"},"StatisticalMeshModel")," is in reality just a wrapper\naround a GP, it naturally allows for marginalization as well:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),"val noseTipModel : StatisticalMeshModel = model.marginal(IndexedSeq(PointId(8156)))\n")),Object(o.b)("p",null,"Notice in this case, how the passed argument to the marginal function\nis an indexed sequence of point ",Object(o.b)("strong",{parentName:"p"},"identifiers")," instead of a discrete domain.\nThis is due to the fact that we are marginalizing a discrete Gaussian process.\nSince the domain of the GP is already discrete, marginalization in this\ncase is done by selecting a subset of the discrete domain.\nHence the use of point identifiers instead of 3D coordinates."),Object(o.b)("p",null,"Not surprisingly, we can again sample from this nose tip model:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),'val tipSample : TriangleMesh[_3D] = noseTipModel.sample\n// tipSample: TriangleMesh[_3D] = TriangleMesh3D(\n//   scalismo.common.UnstructuredPointsDomain3D@6e15e143,\n//   TriangleList(Vector())\n// )\nprintln("nb mesh points " + tipSample.pointSet.numberOfPoints)\n// nb mesh points 1\n')),Object(o.b)("p",null,"Given that the marginal model is a ",Object(o.b)("em",{parentName:"p"},"StatisticalMeshModel"),", sampling from it\nreturns a ",Object(o.b)("inlineCode",{parentName:"p"},"TriangleMesh"),". When inspecting the points of the\nreturned sample, we see that it contains only one point, the nose tip."),Object(o.b)("h4",{id:"nose-marginal"},"Nose marginal"),Object(o.b)("p",null,"Let's suppose that we have a full model of the face, but are only\ninterested in the shape variations around the nose.\nMarginalization let's us achieve this easily.\nTo do so, we extract all points which lie within a specified distance\naround the middle of the nose:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),"val middleNose = referencePointSet.point(PointId(8152))\nval nosePtIDs : Iterator[PointId] = referencePointSet.pointsWithId\n  .filter( ptAndId => {  // yields tuples with point and ids\n   val (pt, id) = ptAndId\n   (pt - middleNose).norm > 40\n   })\n  .map(ptAndId => ptAndId._2) // extract the id's\n")),Object(o.b)("p",null,"We can now use the point ids to marginalize our shape model:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),'val noseModel = model.marginal(nosePtIDs.toIndexedSeq)\nval noseGroup = ui.createGroup("noseModel")\nui.show(noseGroup, noseModel, "noseModel")\n')),Object(o.b)("h2",{id:"probability-of-shapes-and-deformations"},"Probability of shapes and deformations:"),Object(o.b)("p",null,"It is often interesting to assess how probable a model instance is.\nThis can be done in Scalismo by means of the method ",Object(o.b)("inlineCode",{parentName:"p"},"pdf "),"\n(which stands for probability density function) of the class ",Object(o.b)("inlineCode",{parentName:"p"},"GaussianProcess"),"\nand ",Object(o.b)("inlineCode",{parentName:"p"},"StatisticalMeshModel")," respectively."),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),"val defSample = noseModel.gp.sample\nnoseModel.gp.pdf(defSample)\n")),Object(o.b)("p",null,"The value of the ",Object(o.b)("em",{parentName:"p"},"pdf")," is often not interesting as such. But it allows us to compare the likelihood of different instances, by comparing their density value.\nFor numerical reasons, we usually work with the log probability:"),Object(o.b)("pre",null,Object(o.b)("code",Object(a.a)({parentName:"pre"},{className:"language-scala"}),'val defSample1 = noseModel.gp.sample\n// defSample1: DiscreteField[_3D, UnstructuredPointsDomain[_3D], EuclideanVector[_3D]] = <function1>\nval defSample2 = noseModel.gp.sample\n// defSample2: DiscreteField[_3D, UnstructuredPointsDomain[_3D], EuclideanVector[_3D]] = <function1>\n\nval logPDF1 = noseModel.gp.logpdf(defSample1)\n// logPDF1: Double = -11.265529462996712\nval logPDF2 = noseModel.gp.logpdf(defSample2)\n// logPDF2: Double = -17.33330521109113\n\nval moreOrLess = if (logPDF1 > logPDF2) "more" else "less"\n// moreOrLess: String = "more"\nprintln(s"defSample1 is $moreOrLess likely than defSample2")\n// defSample1 is more likely than defSample2\n')))}p.isMDXComponent=!0},111:function(e,t,n){"use strict";n.d(t,"a",(function(){return m})),n.d(t,"b",(function(){return b}));var a=n(0),i=n.n(a);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function r(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=i.a.createContext({}),p=function(e){var t=i.a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},m=function(e){var t=p(e.components);return i.a.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},u=i.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,c=r(e,["components","mdxType","originalType","parentName"]),m=p(n),u=a,b=m["".concat(s,".").concat(u)]||m[u]||d[u]||o;return n?i.a.createElement(b,l(l({ref:t},c),{},{components:n})):i.a.createElement(b,l({ref:t},c))}));function b(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,s=new Array(o);s[0]=u;var l={};for(var r in t)hasOwnProperty.call(t,r)&&(l[r]=t[r]);l.originalType=e,l.mdxType="string"==typeof e?e:a,s[1]=l;for(var c=2;c<o;c++)s[c]=n[c];return i.a.createElement.apply(null,s)}return i.a.createElement.apply(null,n)}u.displayName="MDXCreateElement"}}]);