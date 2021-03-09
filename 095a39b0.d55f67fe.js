(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{154:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return m}));var o=n(0),a=n.n(o);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,o,a=function(e,t){if(null==e)return{};var n,o,a={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=a.a.createContext({}),p=function(e){var t=a.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=p(e.components);return a.a.createElement(s.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},d=a.a.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,r=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),u=p(n),d=o,m=u["".concat(r,".").concat(d)]||u[d]||b[d]||i;return n?a.a.createElement(m,l(l({ref:t},s),{},{components:n})):a.a.createElement(m,l({ref:t},s))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,r=new Array(i);r[0]=d;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:o,r[1]=l;for(var s=2;s<i;s++)r[s]=n[s];return a.a.createElement.apply(null,r)}return a.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},201:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/project-import-intellij-381bf3a0ce7fefebf44cdc9d1566c4dc.png"},202:function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/project-in-intellij-73580ba5ddd830c8a789e6dcaa1cf2c1.png"},67:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return r})),n.d(t,"metadata",(function(){return l})),n.d(t,"rightToc",(function(){return c})),n.d(t,"default",(function(){return p}));var o=n(3),a=n(7),i=(n(0),n(154)),r={id:"ide",title:"Using Scalismo in an IDE"},l={unversionedId:"ide",id:"version-0.90/ide",isDocsHomePage:!1,title:"Using Scalismo in an IDE",description:"In this article we describe how to set up Scalismo such that it can be used to program shape modelling applications from an Integrated Development Environment (IDE).",source:"@site/versioned_docs/version-0.90/ide.md",slug:"/ide",permalink:"/docs/ide",editUrl:"https://github.com/unibas-gravis/scalismo-microsite/edit/master/website/versioned_docs/version-0.90/ide.md",version:"0.90"},c=[{value:"Setting up Scala",id:"setting-up-scala",children:[]},{value:"Installing Git",id:"installing-git",children:[]},{value:"Getting and building the seed project",id:"getting-and-building-the-seed-project",children:[]},{value:"Using Scalismo from IntelliJ Idea",id:"using-scalismo-from-intellij-idea",children:[{value:"Other Ressources",id:"other-ressources",children:[]}]}],s={rightToc:c};function p(e){var t=e.components,r=Object(a.a)(e,["components"]);return Object(i.b)("wrapper",Object(o.a)({},s,r,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"In this article we describe how to set up Scalismo such that it can be used to program shape modelling applications from an Integrated Development Environment (IDE).\nFor this, we need to set up a Scala development environment (including JDK, a Scala Compiler and a build tool) the source control management system ",Object(i.b)("em",{parentName:"p"},"git")," as well as\nthe IDE. As an IDE we use of ",Object(i.b)("em",{parentName:"p"},"Intellij IDEA"),"."),Object(i.b)("h2",{id:"setting-up-scala"},"Setting up Scala"),Object(i.b)("p",null,"To setup a Scala environment, we will use the tool ",Object(i.b)("a",{parentName:"p",href:"https://get-coursier.io/"},"Coursier"),", which will set up an appropriate JDK, the Scala compiler as well as the Scala build tool (sbt) for us. "),Object(i.b)("p",null,"On MacOS and Linux, use the following commands to download and install coursier:"),Object(i.b)("pre",null,Object(i.b)("code",{parentName:"pre"},'$ curl -fLo cs https://git.io/coursier-cli-"$(uname | tr LD ld)"\n$ chmod +x cs\n$ ./cs setup\n$ rm -f cs\n')),Object(i.b)("p",null,"On Windows, open a terminal (cmd.exe not powershell), ",Object(i.b)("em",{parentName:"p"},"navigate to a folder where you have write permissions")," and issue the following commands"),Object(i.b)("pre",null,Object(i.b)("code",{parentName:"pre"},'> bitsadmin /transfer cs-cli https://git.io/coursier-cli-windows-exe "%cd%\\cs.exe"\n> .\\cs setup\n> del cs.exe\n')),Object(i.b)("p",null,Object(i.b)("em",{parentName:"p"},"Note, after the setup of coursier you might need to open a new terminal for the ",Object(i.b)("inlineCode",{parentName:"em"},"cs")," command to be found on your system.")),Object(i.b)("p",null,"When coursier finds a valid JVM on the system, it will use that. Most JVM versions should work fine, but we recommend to use either Java 8 or Java 11. There is also a known bug in many JVM implementations, which causes Scalismo-ui to crash on startup on MacOS. On MacOS we therefore strongly suggest to use the the Zulu JVM. It can be installed using Coursier as follows:"),Object(i.b)("pre",null,Object(i.b)("code",{parentName:"pre"},"cs java --jvm zulu:1.11.0-9 --setup\n")),Object(i.b)("p",null,"To see which java version is used by your system, type"),Object(i.b)("pre",null,Object(i.b)("code",{parentName:"pre",className:"language-bash"},"cs java -version\n")),Object(i.b)("p",null,Object(i.b)("em",{parentName:"p"},"In case this command does not report the right version, you might need to open a new terminal.")," "),Object(i.b)("p",null,"Finally, you may want to know the location, where Coursier installed the JVM. You can find this out by\ntyping "),Object(i.b)("pre",null,Object(i.b)("code",{parentName:"pre"},"cs java --jvm zulu:1.11.0-9  --env\n")),Object(i.b)("p",null,"More details on how to work with ",Object(i.b)("em",{parentName:"p"},"coursier")," and how to manage JVM versions can be found on the ",Object(i.b)("a",{parentName:"p",href:"https://get-coursier.io/docs/cli-overview"},"Coursier Webpage")," and in\nthis ",Object(i.b)("a",{parentName:"p",href:"https://get-coursier.io/docs/cli-setup"},"blog post"),"."),Object(i.b)("h2",{id:"installing-git"},"Installing Git"),Object(i.b)("p",null,"In addition to the Scala environment, we will need the ",Object(i.b)("em",{parentName:"p"},"git")," source control management system and also an integrated development environment.\nTo install Git, please go to the ",Object(i.b)("a",{parentName:"p",href:"https://git-scm.com/downloads"},"Git website")," and following the download and installation instructions there."),Object(i.b)("h2",{id:"getting-and-building-the-seed-project"},"Getting and building the seed project"),Object(i.b)("p",null,'In this step we provide you with a small "Hello World" example project.\nWe download the project  run it from the command line and set up the IDE for the later usage.'),Object(i.b)("p",null,"To get the project, use the follow command"),Object(i.b)("pre",null,Object(i.b)("code",{parentName:"pre",className:"language-bash"},"sbt new unibas-gravis/scalismo-seed.g8\n")),Object(i.b)("p",null,Object(i.b)("em",{parentName:"p"},"Note: On Windows this command might report the error, that it was not able to delete some resources. You can ignore this error.")),Object(i.b)("p",null,"On the following prompt, enter a name for your project. The seed project will now be available in the subdirectory\nwith the corresponding name. Change to this directory."),Object(i.b)("pre",null,Object(i.b)("code",{parentName:"pre"},"cd NAME_OF_YOUR_PROJECT\n")),Object(i.b)("p",null,"We will now run the project. This will trigger the project to be built by sbt.\nNote that the initial build will download some dependencies specific to the project. This may take a while.\nThe command to run the project is:"),Object(i.b)("pre",null,Object(i.b)("code",{parentName:"pre",className:"language-bash"},"sbt run\n")),Object(i.b)("p",null,"A successful run should display a Scalismo UI with a pink mean face."),Object(i.b)("blockquote",null,Object(i.b)("p",{parentName:"blockquote"},"We have now a working setup of Scalismo and could use any editor to work on the code.\nHowever, we strongly recommend to use an IDE when working with Scala. Our recommendation\nis to use ",Object(i.b)("a",{parentName:"p",href:"https://www.jetbrains.com/idea/"},"IntelliJ idea"),". ")),Object(i.b)("h2",{id:"using-scalismo-from-intellij-idea"},"Using Scalismo from IntelliJ Idea"),Object(i.b)("p",null,"In this last step, we will set up Scalismo such that we can use it from the IDE IntelliJ Idea.\nTo install IntelliJ, go to the ",Object(i.b)("a",{parentName:"p",href:"https://www.jetbrains.com/idea/download/#section=windows"},"IntelliJ Idea download page"),", download the ",Object(i.b)("em",{parentName:"p"},"Community edition")," and follow the installation instructions. Once we have installed IntelliJ, we will to install the Scala plugin. This is\ninstalled and enabled from within IntelliJ, as described ",Object(i.b)("a",{parentName:"p",href:"https://www.jetbrains.com/help/idea/discover-intellij-idea-for-scala.html#"},"here"),"."),Object(i.b)("p",null,"After the Scala plugin has been installed and you see the welcome screen, choose ",Object(i.b)("em",{parentName:"p"},"File->New->Project From Existing Sources"),".\nThen navigate to the folder containing the seed project directory. In the next dialog select the option: ",Object(i.b)("em",{parentName:"p"},"Import project from external model")," and select ",Object(i.b)("em",{parentName:"p"},"sbt")," as a model (see screenshots below)."),Object(i.b)("p",null,"In the next dialog you need to choose the right ",Object(i.b)("em",{parentName:"p"},"Project JDK"),". If your system required you to use the Zulu JDK in the previous step, go to ",Object(i.b)("em",{parentName:"p"},"Project JDK"),", choose Download JDK and select\n",Object(i.b)("em",{parentName:"p"},"Version 11")," and as Vendor ",Object(i.b)("em",{parentName:"p"},"Azul Zulu Community")," and then press the ",Object(i.b)("em",{parentName:"p"},"Download")," button."),Object(i.b)("p",null,"Then continue by clicking onto the ",Object(i.b)("em",{parentName:"p"},"Finish")," button."),Object(i.b)("p",null,Object(i.b)("img",{alt:"ide",src:n(201).default})),Object(i.b)("p",null,"Now the IDE should import the project. When you start the IDE for the first time,\nthere is a lot of processing that is done in the background and it might take a few minutes\nbefore the project is ready for use. In the bottom right you can spot an indication for the ongoing work."),Object(i.b)("p",null,"Once all the importing is done, you should then be able to navigate through the project folder to\n",Object(i.b)("inlineCode",{parentName:"p"},"src/main/scala/com/example/")," and double-click ",Object(i.b)("em",{parentName:"p"},"ExampleApp"),".\nThis will open the code of the application we have already executed before from the console using sbt."),Object(i.b)("p",null,"To execute the file from within the IDE right-click the source file and click ",Object(i.b)("em",{parentName:"p"},"Run"),"."),Object(i.b)("p",null,Object(i.b)("img",{alt:"ide",src:n(202).default})," "),Object(i.b)("h3",{id:"other-ressources"},"Other Ressources"),Object(i.b)("ul",null,Object(i.b)("li",{parentName:"ul"},"You can find a more detailed overview on how to work with the Scala plugin on the Jetbrains ",Object(i.b)("a",{parentName:"li",href:"https://www.jetbrains.com/help/idea/discover-intellij-idea-for-scala.html#"},"website"),"."),Object(i.b)("li",{parentName:"ul"},"How to work with Scalismo using IntelliJ is described in this ",Object(i.b)("a",{parentName:"li",href:"http://empty-set.me/index.php/categories-intro/statistical-shape-modeling/"},"blog post")," by Behzad Vafaeian.")))}p.isMDXComponent=!0}}]);