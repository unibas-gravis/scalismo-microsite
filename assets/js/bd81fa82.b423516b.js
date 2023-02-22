"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1179],{3905:function(e,a,t){t.d(a,{Zo:function(){return l},kt:function(){return d}});var n=t(7294);function s(e,a,t){return a in e?Object.defineProperty(e,a,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[a]=t,e}function i(e,a){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);a&&(n=n.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),t.push.apply(t,n)}return t}function r(e){for(var a=1;a<arguments.length;a++){var t=null!=arguments[a]?arguments[a]:{};a%2?i(Object(t),!0).forEach((function(a){s(e,a,t[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(t,a))}))}return e}function o(e,a){if(null==e)return{};var t,n,s=function(e,a){if(null==e)return{};var t,n,s={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],a.indexOf(t)>=0||(s[t]=e[t]);return s}(e,a);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],a.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(s[t]=e[t])}return s}var m=n.createContext({}),p=function(e){var a=n.useContext(m),t=a;return e&&(t="function"==typeof e?e(a):r(r({},a),e)),t},l=function(e){var a=p(e.components);return n.createElement(m.Provider,{value:a},e.children)},c={inlineCode:"code",wrapper:function(e){var a=e.children;return n.createElement(n.Fragment,{},a)}},h=n.forwardRef((function(e,a){var t=e.components,s=e.mdxType,i=e.originalType,m=e.parentName,l=o(e,["components","mdxType","originalType","parentName"]),h=p(t),d=s,u=h["".concat(m,".").concat(d)]||h[d]||c[d]||i;return t?n.createElement(u,r(r({ref:a},l),{},{components:t})):n.createElement(u,r({ref:a},l))}));function d(e,a){var t=arguments,s=a&&a.mdxType;if("string"==typeof e||s){var i=t.length,r=new Array(i);r[0]=h;var o={};for(var m in a)hasOwnProperty.call(a,m)&&(o[m]=a[m]);o.originalType=e,o.mdxType="string"==typeof e?e:s,r[1]=o;for(var p=2;p<i;p++)r[p]=t[p];return n.createElement.apply(null,r)}return n.createElement.apply(null,t)}h.displayName="MDXCreateElement"},4457:function(e,a,t){t.r(a),t.d(a,{frontMatter:function(){return o},contentTitle:function(){return m},metadata:function(){return p},toc:function(){return l},default:function(){return h}});var n=t(7462),s=t(3366),i=(t(7294),t(3905)),r=["components"],o={id:"tutorial13",title:"Active Shape Model Fitting"},m=void 0,p={unversionedId:"Tutorials/tutorial13",id:"version-0.91.0/Tutorials/tutorial13",title:"Active Shape Model Fitting",description:"In this tutorial we show how we can perform active shape model fitting in Scalismo.",source:"@site/versioned_docs/version-0.91.0/Tutorials/tutorial13.md",sourceDirName:"Tutorials",slug:"/Tutorials/tutorial13",permalink:"/docs/Tutorials/tutorial13",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/versioned_docs/version-0.91.0/Tutorials/tutorial13.md",tags:[],version:"0.91.0",frontMatter:{id:"tutorial13",title:"Active Shape Model Fitting"},sidebar:"docs",previous:{title:"Parametric, non-rigid registration",permalink:"/docs/Tutorials/tutorial12"},next:{title:"Model fitting using MCMC - The basic framework",permalink:"/docs/Tutorials/tutorial14"}},l=[{value:"Related resources",id:"related-resources",children:[],level:5},{value:"Preparation",id:"preparation",children:[],level:5},{value:"Active Shape models in Scalismo",id:"active-shape-models-in-scalismo",children:[{value:"Finding likely model correspondences in an image",id:"finding-likely-model-correspondences-in-an-image",children:[],level:4},{value:"The original Active Shape Model Fitting",id:"the-original-active-shape-model-fitting",children:[],level:3}],level:2},{value:"Evaluating the likelihood of a model instance under the image",id:"evaluating-the-likelihood-of-a-model-instance-under-the-image",children:[],level:2}],c={toc:l};function h(e){var a=e.components,o=(0,s.Z)(e,r);return(0,i.kt)("wrapper",(0,n.Z)({},c,o,{components:a,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"In this tutorial we show how we can perform active shape model fitting in Scalismo."),(0,i.kt)("h5",{id:"related-resources"},"Related resources"),(0,i.kt)("p",null,"The following resources from our ",(0,i.kt)("a",{parentName:"p",href:"https://www.futurelearn.com/courses/statistical-shape-modelling"},"online course")," may provide\nsome helpful context for this tutorial:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Fitting models to images ",(0,i.kt)("a",{parentName:"li",href:"https://www.futurelearn.com/courses/statistical-shape-modelling/3/steps/250379"},"(Video)"))),(0,i.kt)("p",null,"To run the code from this tutorial, download the following Scala file:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{target:"_blank",href:t(2276).Z},"Tutorial13.scala"))),(0,i.kt)("h5",{id:"preparation"},"Preparation"),(0,i.kt)("p",null,"As in the previous tutorials, we start by importing some commonly used objects and initializing the system."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"import scalismo.geometry._\nimport scalismo.transformations._\nimport scalismo.registration._\nimport scalismo.mesh.TriangleMesh\nimport scalismo.statisticalmodel.asm._\nimport scalismo.io.{ActiveShapeModelIO, ImageIO}\n\nimport scalismo.ui.api._\nimport breeze.linalg.{DenseVector}\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"scalismo.initialize()\nimplicit val rng: scalismo.utils.Random = scalismo.utils.Random(42)\n\nval ui = ScalismoUI()\n")),(0,i.kt)("h2",{id:"active-shape-models-in-scalismo"},"Active Shape models in Scalismo"),(0,i.kt)("p",null,"Scalismo provides full support for Active Shape models. This means we can use it to learn active shape models from\na set of images and corresponding contour, we can save these models, and we can use them to fit images. In this tutorial\nwe will assume that the model has already been built and will only concentrate on model fitting."),(0,i.kt)("p",null,"We can load an Active Shape Model as follows:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},'val asm = ActiveShapeModelIO.readActiveShapeModel(new java.io.File("datasets/femur-asm.h5")).get\n')),(0,i.kt)("p",null,"An ActiveShapeModel instance in Scalismo is a combination of a statistical shape model and an intensity model.\nUsing the method ",(0,i.kt)("inlineCode",{parentName:"p"},"statisticalModel"),", we can obtain the shape model part. Let's visualize this model:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},'val modelGroup = ui.createGroup("modelGroup")\nval modelView = ui.show(modelGroup, asm.statisticalModel, "shapeModel")\n')),(0,i.kt)("p",null,"The second part of the model is the intensity model. This model consists of a set of profiles,\nwhich are attached to specific vertices of the shape model, indicated by the ",(0,i.kt)("inlineCode",{parentName:"p"},"pointId"),".\nFor each profile, a probability distribution is defined. This distribution represent the intensity variation that we\nexpect for this profile."),(0,i.kt)("p",null,"The following code shows how this information can be accessed:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val profiles = asm.profiles\nprofiles.map(profile => {\n  val pointId = profile.pointId\n  val distribution = profile.distribution\n})\n")),(0,i.kt)("h4",{id:"finding-likely-model-correspondences-in-an-image"},"Finding likely model correspondences in an image"),(0,i.kt)("p",null,"The main usage of the profile distribution is to identify the points in the image, which are most likely to correspond to the given profile points in the model.\nMore precisely, let ",(0,i.kt)("span",{parentName:"p",className:"math math-inline"},(0,i.kt)("span",{parentName:"span",className:"katex"},(0,i.kt)("span",{parentName:"span",className:"katex-mathml"},(0,i.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,i.kt)("semantics",{parentName:"math"},(0,i.kt)("mrow",{parentName:"semantics"},(0,i.kt)("msub",{parentName:"mrow"},(0,i.kt)("mi",{parentName:"msub"},"p"),(0,i.kt)("mi",{parentName:"msub"},"i"))),(0,i.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"p_i")))),(0,i.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,i.kt)("span",{parentName:"span",className:"base"},(0,i.kt)("span",{parentName:"span",className:"strut",style:{height:"0.625em",verticalAlign:"-0.19444em"}}),(0,i.kt)("span",{parentName:"span",className:"mord"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal"},"p"),(0,i.kt)("span",{parentName:"span",className:"msupsub"},(0,i.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.31166399999999994em"}},(0,i.kt)("span",{parentName:"span",style:{top:"-2.5500000000000003em",marginLeft:"0em",marginRight:"0.05em"}},(0,i.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,i.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal mtight"},"i")))),(0,i.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.15em"}},(0,i.kt)("span",{parentName:"span"}))))))))))," denote the i-th profile in the model. We can use the information to evaluate for any set of points\n",(0,i.kt)("span",{parentName:"p",className:"math math-inline"},(0,i.kt)("span",{parentName:"span",className:"katex"},(0,i.kt)("span",{parentName:"span",className:"katex-mathml"},(0,i.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,i.kt)("semantics",{parentName:"math"},(0,i.kt)("mrow",{parentName:"semantics"},(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,i.kt)("msub",{parentName:"mrow"},(0,i.kt)("mi",{parentName:"msub"},"x"),(0,i.kt)("mn",{parentName:"msub"},"1")),(0,i.kt)("mo",{parentName:"mrow",separator:"true"},","),(0,i.kt)("mo",{parentName:"mrow"},"\u2026"),(0,i.kt)("mo",{parentName:"mrow",separator:"true"},","),(0,i.kt)("msub",{parentName:"mrow"},(0,i.kt)("mi",{parentName:"msub"},"x"),(0,i.kt)("mi",{parentName:"msub"},"n")),(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,i.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"(x_1, \\ldots, x_n)")))),(0,i.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,i.kt)("span",{parentName:"span",className:"base"},(0,i.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,i.kt)("span",{parentName:"span",className:"mopen"},"("),(0,i.kt)("span",{parentName:"span",className:"mord"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal"},"x"),(0,i.kt)("span",{parentName:"span",className:"msupsub"},(0,i.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.30110799999999993em"}},(0,i.kt)("span",{parentName:"span",style:{top:"-2.5500000000000003em",marginLeft:"0em",marginRight:"0.05em"}},(0,i.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,i.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,i.kt)("span",{parentName:"span",className:"mord mtight"},"1")))),(0,i.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.15em"}},(0,i.kt)("span",{parentName:"span"})))))),(0,i.kt)("span",{parentName:"span",className:"mpunct"},","),(0,i.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.16666666666666666em"}}),(0,i.kt)("span",{parentName:"span",className:"minner"},"\u2026"),(0,i.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.16666666666666666em"}}),(0,i.kt)("span",{parentName:"span",className:"mpunct"},","),(0,i.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.16666666666666666em"}}),(0,i.kt)("span",{parentName:"span",className:"mord"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal"},"x"),(0,i.kt)("span",{parentName:"span",className:"msupsub"},(0,i.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.151392em"}},(0,i.kt)("span",{parentName:"span",style:{top:"-2.5500000000000003em",marginLeft:"0em",marginRight:"0.05em"}},(0,i.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,i.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal mtight"},"n")))),(0,i.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.15em"}},(0,i.kt)("span",{parentName:"span"})))))),(0,i.kt)("span",{parentName:"span",className:"mclose"},")"))))),", how likely it is that a point ",(0,i.kt)("span",{parentName:"p",className:"math math-inline"},(0,i.kt)("span",{parentName:"span",className:"katex"},(0,i.kt)("span",{parentName:"span",className:"katex-mathml"},(0,i.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,i.kt)("semantics",{parentName:"math"},(0,i.kt)("mrow",{parentName:"semantics"},(0,i.kt)("msub",{parentName:"mrow"},(0,i.kt)("mi",{parentName:"msub"},"x"),(0,i.kt)("mi",{parentName:"msub"},"j"))),(0,i.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"x_j")))),(0,i.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,i.kt)("span",{parentName:"span",className:"base"},(0,i.kt)("span",{parentName:"span",className:"strut",style:{height:"0.716668em",verticalAlign:"-0.286108em"}}),(0,i.kt)("span",{parentName:"span",className:"mord"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal"},"x"),(0,i.kt)("span",{parentName:"span",className:"msupsub"},(0,i.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.311664em"}},(0,i.kt)("span",{parentName:"span",style:{top:"-2.5500000000000003em",marginLeft:"0em",marginRight:"0.05em"}},(0,i.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,i.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal mtight",style:{marginRight:"0.05724em"}},"j")))),(0,i.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.286108em"}},(0,i.kt)("span",{parentName:"span"}))))))))))," corresponds to the profile point ",(0,i.kt)("span",{parentName:"p",className:"math math-inline"},(0,i.kt)("span",{parentName:"span",className:"katex"},(0,i.kt)("span",{parentName:"span",className:"katex-mathml"},(0,i.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,i.kt)("semantics",{parentName:"math"},(0,i.kt)("mrow",{parentName:"semantics"},(0,i.kt)("msub",{parentName:"mrow"},(0,i.kt)("mi",{parentName:"msub"},"p"),(0,i.kt)("mi",{parentName:"msub"},"i"))),(0,i.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"p_i")))),(0,i.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,i.kt)("span",{parentName:"span",className:"base"},(0,i.kt)("span",{parentName:"span",className:"strut",style:{height:"0.625em",verticalAlign:"-0.19444em"}}),(0,i.kt)("span",{parentName:"span",className:"mord"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal"},"p"),(0,i.kt)("span",{parentName:"span",className:"msupsub"},(0,i.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.31166399999999994em"}},(0,i.kt)("span",{parentName:"span",style:{top:"-2.5500000000000003em",marginLeft:"0em",marginRight:"0.05em"}},(0,i.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,i.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal mtight"},"i")))),(0,i.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.15em"}},(0,i.kt)("span",{parentName:"span"})))))))))),", based on the image intensity patterns\n",(0,i.kt)("span",{parentName:"p",className:"math math-inline"},(0,i.kt)("span",{parentName:"span",className:"katex"},(0,i.kt)("span",{parentName:"span",className:"katex-mathml"},(0,i.kt)("math",{parentName:"span",xmlns:"http://www.w3.org/1998/Math/MathML"},(0,i.kt)("semantics",{parentName:"math"},(0,i.kt)("mrow",{parentName:"semantics"},(0,i.kt)("mi",{parentName:"mrow"},"\u03c1"),(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,i.kt)("msub",{parentName:"mrow"},(0,i.kt)("mi",{parentName:"msub"},"x"),(0,i.kt)("mn",{parentName:"msub"},"1")),(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},")"),(0,i.kt)("mo",{parentName:"mrow",separator:"true"},","),(0,i.kt)("mo",{parentName:"mrow"},"\u2026"),(0,i.kt)("mo",{parentName:"mrow",separator:"true"},","),(0,i.kt)("mi",{parentName:"mrow"},"\u03c1"),(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},"("),(0,i.kt)("msub",{parentName:"mrow"},(0,i.kt)("mi",{parentName:"msub"},"x"),(0,i.kt)("mi",{parentName:"msub"},"n")),(0,i.kt)("mo",{parentName:"mrow",stretchy:"false"},")")),(0,i.kt)("annotation",{parentName:"semantics",encoding:"application/x-tex"},"\\rho(x_1), \\ldots, \\rho(x_n)")))),(0,i.kt)("span",{parentName:"span",className:"katex-html","aria-hidden":"true"},(0,i.kt)("span",{parentName:"span",className:"base"},(0,i.kt)("span",{parentName:"span",className:"strut",style:{height:"1em",verticalAlign:"-0.25em"}}),(0,i.kt)("span",{parentName:"span",className:"mord mathnormal"},"\u03c1"),(0,i.kt)("span",{parentName:"span",className:"mopen"},"("),(0,i.kt)("span",{parentName:"span",className:"mord"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal"},"x"),(0,i.kt)("span",{parentName:"span",className:"msupsub"},(0,i.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.30110799999999993em"}},(0,i.kt)("span",{parentName:"span",style:{top:"-2.5500000000000003em",marginLeft:"0em",marginRight:"0.05em"}},(0,i.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,i.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,i.kt)("span",{parentName:"span",className:"mord mtight"},"1")))),(0,i.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.15em"}},(0,i.kt)("span",{parentName:"span"})))))),(0,i.kt)("span",{parentName:"span",className:"mclose"},")"),(0,i.kt)("span",{parentName:"span",className:"mpunct"},","),(0,i.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.16666666666666666em"}}),(0,i.kt)("span",{parentName:"span",className:"minner"},"\u2026"),(0,i.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.16666666666666666em"}}),(0,i.kt)("span",{parentName:"span",className:"mpunct"},","),(0,i.kt)("span",{parentName:"span",className:"mspace",style:{marginRight:"0.16666666666666666em"}}),(0,i.kt)("span",{parentName:"span",className:"mord mathnormal"},"\u03c1"),(0,i.kt)("span",{parentName:"span",className:"mopen"},"("),(0,i.kt)("span",{parentName:"span",className:"mord"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal"},"x"),(0,i.kt)("span",{parentName:"span",className:"msupsub"},(0,i.kt)("span",{parentName:"span",className:"vlist-t vlist-t2"},(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.151392em"}},(0,i.kt)("span",{parentName:"span",style:{top:"-2.5500000000000003em",marginLeft:"0em",marginRight:"0.05em"}},(0,i.kt)("span",{parentName:"span",className:"pstrut",style:{height:"2.7em"}}),(0,i.kt)("span",{parentName:"span",className:"sizing reset-size6 size3 mtight"},(0,i.kt)("span",{parentName:"span",className:"mord mathnormal mtight"},"n")))),(0,i.kt)("span",{parentName:"span",className:"vlist-s"},"\u200b")),(0,i.kt)("span",{parentName:"span",className:"vlist-r"},(0,i.kt)("span",{parentName:"span",className:"vlist",style:{height:"0.15em"}},(0,i.kt)("span",{parentName:"span"})))))),(0,i.kt)("span",{parentName:"span",className:"mclose"},")")))))," we find at these points in an image."),(0,i.kt)("p",null,"To illustrate this, we first load an image:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},'val image = ImageIO.read3DScalarImage[Short](new java.io.File("datasets/femur-image.nii")).get.map(_.toFloat)\nval targetGroup = ui.createGroup("target")\n\nval imageView = ui.show(targetGroup, image, "image")\n')),(0,i.kt)("p",null,"The ASM implementation in Scalismo, is not restricted to work with the raw intensities, but the active shape model may first apply some preprocessing,\nsuch as smooth, applying a gradient transform, etc.  Thus in a first step we obtain this preprocess iamge uing the prepocessor method of the ",(0,i.kt)("inlineCode",{parentName:"p"},"asm")," object:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val preprocessedImage = asm.preprocessor(image)\n")),(0,i.kt)("p",null,"We can now extract features at a given point:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val point1 = image.domain.origin + EuclideanVector3D(10.0, 10.0, 10.0)\nval profile = asm.profiles.head\nval feature1 : DenseVector[Double] = asm.featureExtractor(preprocessedImage, point1, asm.statisticalModel.mean, profile.pointId).get\n")),(0,i.kt)("p",null,"Here we specified the preprocessed image, a point in the image where whe want the evaluate the feature vector, a mesh instance and a point id for the mesh.\nThe mesh instance and point id are needed, since a feature extractor might choose to extract the feature based on mesh information, such as the normal direction\nof a line at this point."),(0,i.kt)("p",null,"We can retrieve the likelihood that each corresponding point corresponds to a given profile point:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val point2 = image.domain.origin + EuclideanVector3D(20.0, 10.0, 10.0)\nval featureVec1 = asm.featureExtractor(preprocessedImage, point1, asm.statisticalModel.mean, profile.pointId).get\nval featureVec2 = asm.featureExtractor(preprocessedImage, point2, asm.statisticalModel.mean, profile.pointId).get\n\nval probabilityPoint1 = profile.distribution.logpdf(featureVec1)\nval probabilityPoint2 = profile.distribution.logpdf(featureVec2)\n")),(0,i.kt)("p",null,"Based on this information, we can decide, which point is more likely to correspond to the model point. This idea forms the\nbasis of the original m Active Shape Model Fitting algorithm."),(0,i.kt)("h3",{id:"the-original-active-shape-model-fitting"},"The original Active Shape Model Fitting"),(0,i.kt)("p",null,"Scalismo features an implementation of Active Shape Model fitting algorithm, as proposed by ",(0,i.kt)("a",{parentName:"p",href:"http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.141.3089&rep=rep1&type=pdf"},"Cootes and Taylor"),"."),(0,i.kt)("p",null,'To configure the fitting process, we need to set up a search method, which searches for a given model point, corresponding  points\nin the image. From these points, the most likely point is select and used as as the corresponding point for one iteration of\nthe algorithm. Once these "candidate correspondences" have been established, the rest of the algorithm works in exactly the same as\nthe ICP algorithm that we described in the previous tutorials.'),(0,i.kt)("p",null,"One search strategy that is already implemented in Scalismo is to search along\nthe normal direction of a model point. This behavior is provided by the ",(0,i.kt)("inlineCode",{parentName:"p"},"NormalDirectionSearchPointSampler")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val searchSampler = NormalDirectionSearchPointSampler(numberOfPoints = 100, searchDistance = 3)\n")),(0,i.kt)("p",null,"In addition to the search strategy, we can specify some additional configuration parameters to control the fitting process:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val config = FittingConfiguration(featureDistanceThreshold = 3, pointDistanceThreshold = 5, modelCoefficientBounds = 3)\n")),(0,i.kt)("p",null,"The first parameter determines how far away (as measured by the mahalanobis distance) an intensity feature can be, such that it is still\nchosen as corresponding. The ",(0,i.kt)("inlineCode",{parentName:"p"},"pointDistanceThreshold")," does the same for the distance of the points; I.e. in this  case points which are\nmore than 5 standard deviations aways are not chosen as corresponding points. The last parameters determines how\nlarge coefficients of the model can become in the fitting process. Whenever a model parameter is larger than this threshold,\nit will be set back to this maximal value. This introduces a regularization into the fitting, which prevents the shape\nfrom becoming too unlikely."),(0,i.kt)("p",null,"The ASM fitting algorithm optimizes both the pose (as defined by a rigid transformation) and the shape.\nIn order to allow it to optimize the rotation, it is important that we choose a rotation center, which is approximately\nthe center of mass of the model:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"    // make sure we rotate around a reasonable center point\nval modelBoundingBox = asm.statisticalModel.reference.boundingBox\nval rotationCenter = modelBoundingBox.origin + modelBoundingBox.extent * 0.5\n")),(0,i.kt)("p",null,"To initialize the fitting process, we also need to set up the initial transformation:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"\n// we start with the identity transform\nval translationTransformation = Translation3D(EuclideanVector3D(0, 0, 0))\nval rotationTransformation = Rotation3D(0, 0, 0, rotationCenter)\nval initialRigidTransformation = TranslationAfterRotation3D(translationTransformation, rotationTransformation)\nval initialModelCoefficients = DenseVector.zeros[Double](asm.statisticalModel.rank)\nval initialTransformation = ModelTransformations(initialModelCoefficients, initialRigidTransformation)\n")),(0,i.kt)("p",null,"To start the fitting, we obtain an iterator, which we subsequently use to drive the iteration."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val numberOfIterations = 20\nval asmIterator = asm.fitIterator(image, searchSampler, numberOfIterations, config, initialTransformation)\n")),(0,i.kt)("p",null,"Especially in a debugging phase, we want to visualize the result in every iteration. The following code shows,\nhow we can obtain a new iterator, which updates the pose transformation and model coefficients in the ",(0,i.kt)("inlineCode",{parentName:"p"},"ui"),"\nin every iteration:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val asmIteratorWithVisualization = asmIterator.map(it => {\n    it match {\n        case scala.util.Success(iterationResult) => {\n            modelView.shapeModelTransformationView.poseTransformationView.transformation = iterationResult.transformations.rigidTransform\n            modelView.shapeModelTransformationView.shapeTransformationView.coefficients = iterationResult.transformations.coefficients\n        }\n        case scala.util.Failure(error) => System.out.println(error.getMessage)\n    }\n    it\n})\n")),(0,i.kt)("p",null,"To run the fitting, and get the result, we finally consume the iterator:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"val result = asmIteratorWithVisualization.toIndexedSeq.last\nval finalMesh = result.get.mesh\n\n")),(0,i.kt)("h2",{id:"evaluating-the-likelihood-of-a-model-instance-under-the-image"},"Evaluating the likelihood of a model instance under the image"),(0,i.kt)("p",null,"In the previous section we have used the intensity distribution to find the best corresponding image point to a\ngiven point in the model. Sometimes we are also interested in finding out how well a model fits an image.\nTo compute this, we can extend the method used above to compute the likelihood for all profile points of an Active Shape Model."),(0,i.kt)("p",null,"Given the model instance, we will get the position of each profile point in the current instance,\nevaluate its likelihood and then compute the joint likelihood for all profiles. Assuming independence, the joint probability is just the product of the probability at the individual profile points.\nIn order not to get too extreme values, we use log probabilities here (and consequently the product becomes a sum)."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},"def likelihoodForMesh(asm : ActiveShapeModel, mesh : TriangleMesh[_3D], preprocessedImage: PreprocessedImage) : Double = {\n\n    val ids = asm.profiles.ids\n\n    val likelihoods = for (id <- ids) yield {\n      val profile = asm.profiles(id)\n      val profilePointOnMesh = mesh.pointSet.point(profile.pointId)\n      val featureAtPoint = asm.featureExtractor(preprocessedImage, profilePointOnMesh, mesh, profile.pointId).get\n      profile.distribution.logpdf(featureAtPoint)\n    }\n    likelihoods.sum\n}\n")),(0,i.kt)("p",null,"This method allows us to compute for each mesh, represented by the model, how likely it is to correspond\nto the given image."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-scala"},'val sampleMesh1 = asm.statisticalModel.sample()\nval sampleMesh2 = asm.statisticalModel.sample()\nprintln("Likelihood for mesh 1 = " + likelihoodForMesh(asm, sampleMesh1, preprocessedImage))\nprintln("Likelihood for mesh 2 = " + likelihoodForMesh(asm, sampleMesh2, preprocessedImage))\n')),(0,i.kt)("p",null,"This information is all that is need to write probabilistic fitting methods methods using Markov Chain Monte Carlo\nmethods, which will be discussed in a later tutorial."))}h.isMDXComponent=!0},2276:function(e,a,t){a.Z=t.p+"assets/files/Tutorial13-198995806bbd4fa874948d6974eaebb1.scala"}}]);