(window.webpackJsonp=window.webpackJsonp||[]).push([[89],{154:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return s})),n.d(t,"metadata",(function(){return l})),n.d(t,"rightToc",(function(){return c})),n.d(t,"default",(function(){return d}));var a=n(3),i=n(7),o=(n(0),n(159)),r=["components"],s={id:"tutorial5",title:"Gaussian processes, sampling and marginalization"},l={unversionedId:"tutorials/tutorial5",id:"tutorials/tutorial5",isDocsHomePage:!1,title:"Gaussian processes, sampling and marginalization",description:"In this tutorial we will experiment with sampling and marginalization of",source:"@site/docs/tutorials/tutorial5.md",slug:"/tutorials/tutorial5",permalink:"/docs/next/tutorials/tutorial5",editUrl:"https://github.com/unibas-gravis/scalismo-microsite/edit/master/website/docs/tutorials/tutorial5.md",version:"current",sidebar:"docs",previous:{title:"Gaussian processes and Point Distribution Models",permalink:"/docs/next/tutorials/tutorial4"},next:{title:"Building a shape model from data",permalink:"/docs/next/tutorials/tutorial6"}},c=[{value:"From continuous to discrete: marginalization and discretization",id:"from-continuous-to-discrete-marginalization-and-discretization",children:[]},{value:"Changing the reference of a point distribution model",id:"changing-the-reference-of-a-point-distribution-model",children:[]},{value:"Probability of shapes and deformations:",id:"probability-of-shapes-and-deformations",children:[]}],p={rightToc:c};function d(e){var t=e.components,n=Object(i.a)(e,r);return Object(o.b)("wrapper",Object(a.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"In this tutorial we will experiment with sampling and marginalization of\nGaussian processes. Furthermore, we will learn how to compare the\nlikelihood of instances of our model."),Object(o.b)("h5",{id:"related-resources"},"Related resources"),Object(o.b)("p",null,"The following resources from our ",Object(o.b)("a",{parentName:"p",href:"https://www.futurelearn.com/courses/statistical-shape-modelling"},"online course")," may provide\nsome helpful context for this tutorial:"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"The marginalization property ",Object(o.b)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250339"},"(Video)")),Object(o.b)("li",{parentName:"ul"},"Sampling from a shape model ",Object(o.b)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250340"},"(Article)"))),Object(o.b)("h5",{id:"preparation"},"Preparation"),Object(o.b)("p",null,"As in the previous tutorials, we start by importing some commonly used objects and initializing the system."),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-scala"},"import scalismo.ui.api._\nimport scalismo.geometry._\nimport scalismo.common._\nimport scalismo.common.interpolation.TriangleMeshInterpolator3D\nimport scalismo.mesh._\nimport scalismo.io.StatisticalModelIO\nimport scalismo.statisticalmodel._\n\nscalismo.initialize()\nimplicit val rng = scalismo.utils.Random(42)\n\nval ui = ScalismoUI()\n")),Object(o.b)("h4",{id:"discrete-and-continuous-gaussian-processes"},"Discrete and Continuous Gaussian processes"),Object(o.b)("p",null,"We have seen in the last tutorial that a Point Distribution Model (PDM)\nis represented in Scalismo as a (discrete) Gaussian process over deformation fields,\ndefined on a reference mesh."),Object(o.b)("p",null,"To continue our exploration of Gaussian processes, we therefore start\nby loading (and visualizing) an existing PDM and retrieve its underlying\nGaussian process"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-scala"},'val model = StatisticalModelIO.readStatisticalTriangleMeshModel3D(new java.io.File("datasets/bfm.h5")).get\nval gp = model.gp\n\nval modelGroup = ui.createGroup("modelGroup")\nval ssmView = ui.show(modelGroup, model, "model")\n')),Object(o.b)("p",null,"We can retrieve random samples from the Gaussian process by calling ",Object(o.b)("inlineCode",{parentName:"p"},"sample"),"\non the ",Object(o.b)("inlineCode",{parentName:"p"},"gp")," object:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-scala"},'val sampleDF : DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = model.gp.sample\n\nval sampleGroup = ui.createGroup("sample")\nui.show(sampleGroup, sampleDF, "discreteSample")\n')),Object(o.b)("p",null,"Note that the sampled vector field is ",Object(o.b)("strong",{parentName:"p"},"discrete"),"; I.e. is\ndefined over a ",Object(o.b)("strong",{parentName:"p"},"discrete set of points"),".\nThis is due to the fact that our Gaussian Process is stored in a file\nand was therefore discretized over the points of the reference mesh."),Object(o.b)("p",null,"As seen in the previous tutorial, we could interpolate the\nsample ",Object(o.b)("inlineCode",{parentName:"p"},"sampleDf")," to obtain a continuous version of the deformation field.\nA more convenient approach is, however, to interpolate the\nGaussian process directly:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-scala"},"val interpolator = TriangleMeshInterpolator3D[EuclideanVector[_3D]]()\nval contGP = model.gp.interpolate(interpolator)\n")),Object(o.b)("p",null,"When we sample now from the continuous GP, we obtain a vector-valued function,\nwhich is defined on the entire 3D Space:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-scala"},"val contSample: Field[_3D, EuclideanVector[_3D]] = contGP.sample\n")),Object(o.b)("p",null,Object(o.b)("em",{parentName:"p"},"Attention: While the interpolated Gaussian process is now defined on the entire 3D Space, the interpolation really only makes sense close to the mesh points"),"."),Object(o.b)("h2",{id:"from-continuous-to-discrete-marginalization-and-discretization"},"From continuous to discrete: marginalization and discretization"),Object(o.b)("p",null,"In practice, we will never work with a continuous Gaussian process directly.\nWe are always interested in the distribution on a finite set of points.\nThe real advantage of having a continuous Gaussian process is, that we can\nget samples at ",Object(o.b)("em",{parentName:"p"},"any")," finite set of points and thereby choosing the discretization\naccording to the needs of our application."),Object(o.b)("p",null,"To illustrate this, we could, for example obtain a sample,\nwhich is defined on all the points of the original reference mesh."),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-scala"},'val fullSample = contGP.sampleAtPoints(model.reference)\nval fullSampleView = ui.show(sampleGroup, fullSample, "fullSample")\n')),Object(o.b)("p",null,"The marginalization property of a Gaussian process makes it possible not only\nto obtain samples at an arbitrary set of points, but also the\ndistribution at these points. We can\nobtain this distribution, by calling the method ",Object(o.b)("inlineCode",{parentName:"p"},"marginal"),"\non the Gaussian process instance:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-scala"},"val referencePointSet = model.reference.pointSet\nval rightEyePt: Point[_3D] = referencePointSet.point(PointId(4281))\nval leftEyePt: Point[_3D] = referencePointSet.point(PointId(11937))\nval marginal : DiscreteGaussianProcess[_3D, UnstructuredPointsDomain, EuclideanVector[_3D]] = contGP.marginal(IndexedSeq(rightEyePt,leftEyePt))\n")),Object(o.b)("p",null,"The result of marginalization is again a discrete Gaussian process. As we have specified individual points, on which\nto evaluate the Gaussian process, but not how these points are connected, the resulting\ndiscrete Gaussian process is defined over an ",Object(o.b)("inlineCode",{parentName:"p"},"UnstructuredPointsDomain"),".\nTo obtain a discrete Gaussian Process with a richer structure, we can use the ",Object(o.b)("inlineCode",{parentName:"p"},"discretize")," method,\nwhich takes as an argument a domain and result in a discrete Gaussian Process defined on that domain."),Object(o.b)("p",null,"To obtain the Gaussian Process that we started with again, we can call the ",Object(o.b)("inlineCode",{parentName:"p"},"discretize")," method\nwith the reference mesh:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-scala"},"val discreteGP : DiscreteGaussianProcess[_3D, TriangleMesh, EuclideanVector[_3D]] = contGP.discretize(model.reference)\n")),Object(o.b)("p",null,"This mechanism of interpolation followed by discretization gives us the ability to freely change\nthe resolution of the domain on which the Gaussian process is defined."),Object(o.b)("h2",{id:"changing-the-reference-of-a-point-distribution-model"},"Changing the reference of a point distribution model"),Object(o.b)("p",null,"Given that a point distribution model is really just a wrapper around a Gaussian process, it\nis not surprising that we can apply the same ideas to these models. In particular, we often\nwould like to change the domain (I.e., the reference) of a point distribution model.\nThis can be done using the method ",Object(o.b)("inlineCode",{parentName:"p"},"newReference")," of the point distribution model. Under the hood, the method ",Object(o.b)("inlineCode",{parentName:"p"},"newReference"),"\ninterpolates the gaussian process and discretizes it with the new reference."),Object(o.b)("p",null,"In the following example we use this method to obtain a model which is defined on a low-resolution mesh:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-scala"},"val lowresMesh = model.reference.operations.decimate(1000)\nval lowResModel = model.newReference(lowresMesh, TriangleMeshInterpolator3D())\n")),Object(o.b)("p",null,"Other common applications of this method include restricting the model to only a part of the domain."),Object(o.b)("h2",{id:"probability-of-shapes-and-deformations"},"Probability of shapes and deformations:"),Object(o.b)("p",null,"It is often interesting to assess how probable a model instance is.\nThis can be done in Scalismo by means of the method ",Object(o.b)("inlineCode",{parentName:"p"},"pdf "),"\n(which stands for probability density function) of the class ",Object(o.b)("inlineCode",{parentName:"p"},"GaussianProcess"),"\nand ",Object(o.b)("inlineCode",{parentName:"p"},"StatisticalMeshModel")," respectively."),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-scala"},"val defSample = model.gp.sample\nmodel.gp.pdf(defSample)\n")),Object(o.b)("p",null,"The value of the ",Object(o.b)("em",{parentName:"p"},"pdf")," is often not interesting as such. But it allows us to compare the likelihood of different instances, by comparing their density value.\nFor numerical reasons, we usually work with the log probability:"),Object(o.b)("pre",null,Object(o.b)("code",{parentName:"pre",className:"language-scala"},'val defSample1 = model.gp.sample\n// defSample1: DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = <function1>\nval defSample2 = model.gp.sample\n// defSample2: DiscreteField[_3D, TriangleMesh, EuclideanVector[_3D]] = <function1>\n\nval logPDF1 = model.gp.logpdf(defSample1)\n// logPDF1: Double = -12.599680420141278\nval logPDF2 = model.gp.logpdf(defSample2)\n// logPDF2: Double = -12.300955026410005\n\nval moreOrLess = if (logPDF1 > logPDF2) "more" else "less"\n// moreOrLess: String = "less"\nprintln(s"defSample1 is $moreOrLess likely than defSample2")\n// defSample1 is less likely than defSample2\n')))}d.isMDXComponent=!0},159:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return b}));var a=n(0),i=n.n(a);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,i=function(e,t){if(null==e)return{};var n,a,i={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=i.a.createContext({}),p=function(e){var t=i.a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},d=function(e){var t=p(e.components);return i.a.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},m=i.a.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,r=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),d=p(n),m=a,b=d["".concat(r,".").concat(m)]||d[m]||u[m]||o;return n?i.a.createElement(b,s(s({ref:t},c),{},{components:n})):i.a.createElement(b,s({ref:t},c))}));function b(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,r=new Array(o);r[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,r[1]=s;for(var c=2;c<o;c++)r[c]=n[c];return i.a.createElement.apply(null,r)}return i.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);