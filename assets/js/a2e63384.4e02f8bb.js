"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[137],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return h}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=c(n),h=o,d=m["".concat(s,".").concat(h)]||m[h]||p[h]||a;return n?r.createElement(d,i(i({ref:t},u),{},{components:n})):r.createElement(d,i({ref:t},u))}));function h(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var c=2;c<a;c++)i[c]=n[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},4551:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return s},metadata:function(){return c},assets:function(){return u},toc:function(){return p},default:function(){return h}});var r=n(7462),o=n(3366),a=(n(7294),n(3905)),i=["components"],l={slug:"java-on-osx-problem",title:"Java version problem for OSX: SIGABRT in IntelliJ",author:"Dennis Madsen",author_title:"Researcher, Department of Mathematics and Computer Science, University of Basel",author_url:"https://dennismadsen.me",author_image_url:"https://avatars.githubusercontent.com/u/12571611?v=4",tags:["osx","java","IntelliJ"]},s=void 0,c={permalink:"/blog/java-on-osx-problem",editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/blog/2021-12-17-java-osx.md",source:"@site/blog/2021-12-17-java-osx.md",title:"Java version problem for OSX: SIGABRT in IntelliJ",description:"Java continues to be a challenge on the OSX platform. We have recently experienced just how sensitive Scalismo is to using the correct Java version.",date:"2021-12-17T00:00:00.000Z",formattedDate:"December 17, 2021",tags:[{label:"osx",permalink:"/blog/tags/osx"},{label:"java",permalink:"/blog/tags/java"},{label:"IntelliJ",permalink:"/blog/tags/intelli-j"}],readingTime:1.115,truncated:!1,authors:[{name:"Dennis Madsen",title:"Researcher, Department of Mathematics and Computer Science, University of Basel",url:"https://dennismadsen.me",imageURL:"https://avatars.githubusercontent.com/u/12571611?v=4"}],frontMatter:{slug:"java-on-osx-problem",title:"Java version problem for OSX: SIGABRT in IntelliJ",author:"Dennis Madsen",author_title:"Researcher, Department of Mathematics and Computer Science, University of Basel",author_url:"https://dennismadsen.me",author_image_url:"https://avatars.githubusercontent.com/u/12571611?v=4",tags:["osx","java","IntelliJ"]},nextItem:{title:"MDX Blog Post",permalink:"/blog/mdx-blog-post"}},u={authorsImageUrls:[void 0]},p=[],m={toc:p};function h(e){var t=e.components,l=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,r.Z)({},m,l,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Java continues to be a challenge on the OSX platform. We have recently experienced just how sensitive Scalismo is to using the correct Java version. "),(0,a.kt)("p",null,"As explained in the ",(0,a.kt)("a",{parentName:"p",href:"https://scalismo.org/docs/ide"},"setup guide"),", we encourage people to install the Zulu version 11.0-9 of JVM using the command line. "),(0,a.kt)("p",null,"However, when using Zulu JDK in IntelliJ, there is no option to select the specific minor version 9. Unfortunately, the newest version does not always work and might result in the following error when initializing Scalismo:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"libc++abi: terminating with uncaught exception of type NSException\n\nProcess finished with exit code 134 (interrupted by signal 6: SIGABRT)\n")),(0,a.kt)("p",null,"To fix this, we have to manually import the Zulu 11.0-9 JDK downloaded with Coursier from the command line. To do so, we need to know the ",(0,a.kt)("inlineCode",{parentName:"p"},"java.home")," directory. This can be found by starting ",(0,a.kt)("inlineCode",{parentName:"p"},"sbt")," and invoking:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},'eval System.getProperty("java.home")\n')),(0,a.kt)("p",null,"This will produce an output similar to:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"[info] ans: String = /Users/USERNAME/Library/Caches/Coursier/jvm/zulu@1.11.0-9/zulu-11.jdk/Contents/Home\n")),(0,a.kt)("p",null,"In IntelliJ click File -> Project structure ... -> In the project tap, select ",(0,a.kt)("inlineCode",{parentName:"p"},"Add SDK")," -> ",(0,a.kt)("inlineCode",{parentName:"p"},"JDK...")," (as shown in below image):"),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"IntelliJ Project Structure",src:n(6036).Z,width:"1790",height:"1090"})),(0,a.kt)("p",null,"We now have to navigate to the folder. Note that the ",(0,a.kt)("inlineCode",{parentName:"p"},"Library")," folder is hidden, and so to see hidden folders, click: CMD+shift+. "),(0,a.kt)("p",null,"Apply changes and make sure that the SDK is set to the correct Zulu JDK."))}h.isMDXComponent=!0},6036:function(e,t,n){t.Z=n.p+"assets/images/project-structure-jdk-highlight-131ab61830a332b1c59a1a0ca551d263.png"}}]);