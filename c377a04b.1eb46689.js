(window.webpackJsonp=window.webpackJsonp||[]).push([[65],{130:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return o})),a.d(t,"metadata",(function(){return l})),a.d(t,"rightToc",(function(){return s})),a.d(t,"default",(function(){return c}));var r=a(3),i=a(7),n=(a(0),a(154)),o={id:"index",title:"Scalismo tutorials",slug:"/"},l={unversionedId:"index",id:"index",isDocsHomePage:!1,title:"Scalismo tutorials",description:"The following tutorials explain all the basic concepts behind Scalismo, which are needed for developing complete shape modelling applications.",source:"@site/docs/index.md",slug:"/",permalink:"/docs/next/",editUrl:"https://github.com/unibas-gravis/scalismo-microsite/edit/master/website/docs/index.md",version:"current"},s=[{value:"Preparation",id:"preparation",children:[]},{value:"Tutorials",id:"tutorials",children:[]},{value:"Other guides",id:"other-guides",children:[]}],u={rightToc:s};function c(e){var t=e.components,a=Object(i.a)(e,["components"]);return Object(n.b)("wrapper",Object(r.a)({},u,a,{components:t,mdxType:"MDXLayout"}),Object(n.b)("p",null,"The following tutorials explain all the basic concepts behind Scalismo, which are needed for developing complete shape modelling applications.\nThe intention behind these tutorials is not only to show how to use the software, but also to help understanding the theoretical concepts underlying the software.\nOriginally, these tutorials were designed as part of the Open Online Course ",Object(n.b)("a",{parentName:"p",href:"https://www.futurelearn.com/courses/statistical-shape-modelling"},"Statistical Shape Modelling - Computing the Human Anatomy"),".\nEach tutorial contains links to videos and articles from the online course, which will\nprovide some theoretical background."),Object(n.b)("h3",{id:"preparation"},"Preparation"),Object(n.b)("p",null,"To run the code in the tutorials, you will need to setup a Scala project,\nwhich depends on the latest Scalismo version."),Object(n.b)("p",null,"If you are new to Scala and are have never worked with Scala in an IDE, follow the instructions in the guide:"),Object(n.b)("ul",null,Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",{parentName:"li",href:"ide"},"Using Scalismo in an IDE"))),Object(n.b)("p",null,"This guide will walk you through the steps of setting up a complete Scala programming environment, and importing a first project into an IDE."),Object(n.b)("p",null,"If you are an experience Scala developer and you just want to use Scalismo as a library in an existing project, simply add the following lines to\nyour ",Object(n.b)("inlineCode",{parentName:"p"},"build.sbt"),"."),Object(n.b)("pre",null,Object(n.b)("code",{parentName:"pre",className:"language-scala"},'resolvers += Resolver.bintrayRepo("unibas-gravis", "maven")\n\nlibraryDependencies ++=\n  Seq("ch.unibas.cs.gravis" %% "scalismo-ui" % "0.90.0")\n')),Object(n.b)("h3",{id:"tutorials"},"Tutorials"),Object(n.b)("p",null,"You will also need to ",Object(n.b)("a",{parentName:"p",href:"https://drive.switch.ch/index.php/s/zOJDpqh2ZGxzJJH"},"download")," the datasets used in the tutorials and unzip them into your project folder."),Object(n.b)("ul",null,Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",{parentName:"li",href:"tutorials/tutorial1"},"Tutorial 1"),": Hello Scalismo"),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",{parentName:"li",href:"tutorials/tutorial2"},"Tutorial 2"),": Rigid alignment"),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",{parentName:"li",href:"tutorials/tutorial3"},"Tutorial 3"),": From meshes to deformation fields"),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",{parentName:"li",href:"tutorials/tutorial4"},"Tutorial 4"),": Gaussian processes and Point Distribution Models"),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",{parentName:"li",href:"tutorials/tutorial5"},"Tutorial 5"),": Gaussian processes, sampling and marginalization"),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",{parentName:"li",href:"tutorials/tutorial6"},"Tutorial 6"),": Building a shape model from data"),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",{parentName:"li",href:"tutorials/tutorial7"},"Tutorial 7"),": Shape modelling with Gaussian processes and kernels"),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",{parentName:"li",href:"tutorials/tutorial8"},"Tutorial 8"),": Posterior Shape Models"),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",{parentName:"li",href:"tutorials/tutorial9"},"Tutorial 9"),": Shape completion using Gaussian process regression"),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",{parentName:"li",href:"tutorials/tutorial10"},"Tutorial 10"),": Iterative Closest Points for rigid alignment"),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",{parentName:"li",href:"tutorials/tutorial11"},"Tutorial 11"),": Model fitting with Iterative Closest Points"),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",{parentName:"li",href:"tutorials/tutorial12"},"Tutorial 12"),": Parametric, non-rigid registration"),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",{parentName:"li",href:"tutorials/tutorial13"},"Tutorial 13"),": Active Shape Models"),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",{parentName:"li",href:"tutorials/tutorial14"},"Tutorial 14"),": Model fitting using MCMC - The basic framework"),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",{parentName:"li",href:"tutorials/tutorial15"},"Tutorial 15"),": Model fitting using MCMC - Fitting a shape model")),Object(n.b)("h3",{id:"other-guides"},"Other guides"),Object(n.b)("ul",null,Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",{parentName:"li",href:"scalismo-ui-introduction"},"Visualizing with ",Object(n.b)("em",{parentName:"a"},"Scalismo-ui")))))}c.isMDXComponent=!0},154:function(e,t,a){"use strict";a.d(t,"a",(function(){return p})),a.d(t,"b",(function(){return m}));var r=a(0),i=a.n(r);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,r,i=function(e,t){if(null==e)return{};var a,r,i={},n=Object.keys(e);for(r=0;r<n.length;r++)a=n[r],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(r=0;r<n.length;r++)a=n[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}var u=i.a.createContext({}),c=function(e){var t=i.a.useContext(u),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},p=function(e){var t=c(e.components);return i.a.createElement(u.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},d=i.a.forwardRef((function(e,t){var a=e.components,r=e.mdxType,n=e.originalType,o=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),p=c(a),d=r,m=p["".concat(o,".").concat(d)]||p[d]||b[d]||n;return a?i.a.createElement(m,l(l({ref:t},u),{},{components:a})):i.a.createElement(m,l({ref:t},u))}));function m(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var n=a.length,o=new Array(n);o[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,o[1]=l;for(var u=2;u<n;u++)o[u]=a[u];return i.a.createElement.apply(null,o)}return i.a.createElement.apply(null,a)}d.displayName="MDXCreateElement"}}]);