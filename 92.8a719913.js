(window.webpackJsonp=window.webpackJsonp||[]).push([[92],{155:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),o=n(20),i=n(163),s=n(165),c=n(162);var u=function(e){const{metadata:t}=e;return a.a.createElement("nav",{className:"pagination-nav","aria-label":"Blog list page navigation"},a.a.createElement("div",{className:"pagination-nav__item"},t.previous&&a.a.createElement(c.a,{className:"pagination-nav__link",to:t.previous.permalink},a.a.createElement("div",{className:"pagination-nav__sublabel"},"Previous"),a.a.createElement("div",{className:"pagination-nav__label"},"\xab ",t.previous.title))),a.a.createElement("div",{className:"pagination-nav__item pagination-nav__item--next"},t.next&&a.a.createElement(c.a,{className:"pagination-nav__link",to:t.next.permalink},a.a.createElement("div",{className:"pagination-nav__sublabel"},"Next"),a.a.createElement("div",{className:"pagination-nav__label"},t.next.title," \xbb"))))},l=n(164),d=n(160);var f=function(){const{siteConfig:{title:e}}=Object(i.default)(),{pluginId:t}=Object(l.useActivePlugin)({failfast:!0}),{savePreferredVersionName:n}=Object(d.useDocsPreferredVersion)(t),r=Object(l.useActiveVersion)(t),{latestDocSuggestion:o,latestVersionSuggestion:s}=Object(l.useDocVersionSuggestions)(t);if(!s)return a.a.createElement(a.a.Fragment,null);const u=null!=o?o:(f=s).docs.find((e=>e.id===f.mainDocId));var f;return a.a.createElement("div",{className:"alert alert--warning margin-bottom--md",role:"alert"},"current"===r.name?a.a.createElement("div",null,"This is unreleased documentation for ",e," ",a.a.createElement("strong",null,r.label)," version."):a.a.createElement("div",null,"This is documentation for ",e," ",a.a.createElement("strong",null,r.label),", which is no longer actively maintained."),a.a.createElement("div",{className:"margin-top--md"},"For up-to-date documentation, see the"," ",a.a.createElement("strong",null,a.a.createElement(c.a,{to:u.path,onClick:()=>n(s.name)},"latest version"))," ","(",s.label,")."))},m=n(179),g=n(161),v=n(76),p=n.n(v);t.default=function(e){const{siteConfig:t}=Object(i.default)(),{url:n,title:r,titleDelimiter:c}=t,{content:d}=e,{metadata:v}=d,{description:h,title:b,permalink:E,editUrl:D,lastUpdatedAt:P,lastUpdatedBy:_}=v,{frontMatter:{image:O,keywords:V,hide_title:y,hide_table_of_contents:j}}=d,{pluginId:w}=Object(l.useActivePlugin)({failfast:!0}),A=Object(l.useVersions)(w),C=Object(l.useActiveVersion)(w),N=A.length>1,x=b?`${b} ${c} ${r}`:r,L=Object(s.a)(O,{absolute:!0});return a.a.createElement(a.a.Fragment,null,a.a.createElement(o.a,null,a.a.createElement("title",null,x),a.a.createElement("meta",{property:"og:title",content:x}),h&&a.a.createElement("meta",{name:"description",content:h}),h&&a.a.createElement("meta",{property:"og:description",content:h}),V&&V.length&&a.a.createElement("meta",{name:"keywords",content:V.join(",")}),O&&a.a.createElement("meta",{property:"og:image",content:L}),O&&a.a.createElement("meta",{property:"twitter:image",content:L}),O&&a.a.createElement("meta",{name:"twitter:image:alt",content:`Image for ${b}`}),E&&a.a.createElement("meta",{property:"og:url",content:n+E}),E&&a.a.createElement("link",{rel:"canonical",href:n+E})),a.a.createElement("div",{className:"row"},a.a.createElement("div",{className:Object(g.a)("col",{[p.a.docItemCol]:!j})},a.a.createElement(f,null),a.a.createElement("div",{className:p.a.docItemContainer},a.a.createElement("article",null,N&&a.a.createElement("div",null,a.a.createElement("span",{className:"badge badge--secondary"},"Version: ",C.label)),!y&&a.a.createElement("header",null,a.a.createElement("h1",{className:p.a.docTitle},b)),a.a.createElement("div",{className:"markdown"},a.a.createElement(d,null))),(D||P||_)&&a.a.createElement("div",{className:"margin-vert--xl"},a.a.createElement("div",{className:"row"},a.a.createElement("div",{className:"col"},D&&a.a.createElement("a",{href:D,target:"_blank",rel:"noreferrer noopener"},a.a.createElement("svg",{fill:"currentColor",height:"1.2em",width:"1.2em",preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 40 40",style:{marginRight:"0.3em",verticalAlign:"sub"}},a.a.createElement("g",null,a.a.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"}))),"Edit this page")),(P||_)&&a.a.createElement("div",{className:"col text--right"},a.a.createElement("em",null,a.a.createElement("small",null,"Last updated"," ",P&&a.a.createElement(a.a.Fragment,null,"on"," ",a.a.createElement("time",{dateTime:new Date(1e3*P).toISOString(),className:p.a.docLastUpdatedAt},new Date(1e3*P).toLocaleDateString()),_&&" "),_&&a.a.createElement(a.a.Fragment,null,"by ",a.a.createElement("strong",null,_)),!1))))),a.a.createElement("div",{className:"margin-vert--lg"},a.a.createElement(u,{metadata:v})))),!j&&d.rightToc&&a.a.createElement("div",{className:"col col--3"},a.a.createElement(m.a,{headings:d.rightToc}))))}},160:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=n(169);Object.defineProperty(t,"useThemeConfig",{enumerable:!0,get:function(){return r.useThemeConfig}});var a=n(181);Object.defineProperty(t,"docVersionSearchTag",{enumerable:!0,get:function(){return a.docVersionSearchTag}}),Object.defineProperty(t,"DEFAULT_SEARCH_TAG",{enumerable:!0,get:function(){return a.DEFAULT_SEARCH_TAG}});var o=n(170);Object.defineProperty(t,"isDocsPluginEnabled",{enumerable:!0,get:function(){return o.isDocsPluginEnabled}});var i=n(185);Object.defineProperty(t,"isSamePath",{enumerable:!0,get:function(){return i.isSamePath}});var s=n(186);Object.defineProperty(t,"useDocsPreferredVersion",{enumerable:!0,get:function(){return s.useDocsPreferredVersion}}),Object.defineProperty(t,"useDocsPreferredVersionByPluginId",{enumerable:!0,get:function(){return s.useDocsPreferredVersionByPluginId}});var c=n(171);Object.defineProperty(t,"DocsPreferredVersionContextProvider",{enumerable:!0,get:function(){return c.DocsPreferredVersionContextProvider}})},161:function(e,t,n){"use strict";function r(e){var t,n,a="";if("string"==typeof e||"number"==typeof e)a+=e;else if("object"==typeof e)if(Array.isArray(e))for(t=0;t<e.length;t++)e[t]&&(n=r(e[t]))&&(a&&(a+=" "),a+=n);else for(t in e)e[t]&&(a&&(a+=" "),a+=t);return a}t.a=function(){for(var e,t,n=0,a="";n<arguments.length;)(e=arguments[n++])&&(t=r(e))&&(a&&(a+=" "),a+=t);return a}},162:function(e,t,n){"use strict";var r=n(0),a=n.n(r),o=n(10),i=n(168),s=n(11);const c=Object(r.createContext)({collectLink:()=>{}});var u=n(165),l=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var a=0;for(r=Object.getOwnPropertySymbols(e);a<r.length;a++)t.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]])}return n};t.a=function(e){var t,{isNavLink:n,to:d,href:f,activeClassName:m,isActive:g,"data-noBrokenLinkCheck":v}=e,p=l(e,["isNavLink","to","href","activeClassName","isActive","data-noBrokenLinkCheck"]);const{withBaseUrl:h}=Object(u.b)(),b=Object(r.useContext)(c),E=d||f,D=Object(i.a)(E),P=null==E?void 0:E.replace("pathname://",""),_=void 0!==P?(e=>e.startsWith("/"))(O=P)?h(O):O:void 0;var O;const V=Object(r.useRef)(!1),y=n?o.e:o.c,j=s.a.canUseIntersectionObserver;let w;Object(r.useEffect)((()=>(!j&&D&&window.docusaurus.prefetch(_),()=>{j&&w&&w.disconnect()})),[_,j,D]);const A=null!==(t=null==_?void 0:_.startsWith("#"))&&void 0!==t&&t,C=!_||!D||A;return _&&D&&!A&&!v&&b.collectLink(_),C?a.a.createElement("a",Object.assign({href:_},E&&!D&&{target:"_blank",rel:"noopener noreferrer"},p)):a.a.createElement(y,Object.assign({},p,{onMouseEnter:()=>{V.current||(window.docusaurus.preload(_),V.current=!0)},innerRef:e=>{var t,n;j&&e&&D&&(t=e,n=()=>{window.docusaurus.prefetch(_)},w=new window.IntersectionObserver((e=>{e.forEach((e=>{t===e.target&&(e.isIntersecting||e.intersectionRatio>0)&&(w.unobserve(t),w.disconnect(),n())}))})),w.observe(t))},to:_||""},n&&{isActive:g,activeClassName:m}))}},163:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n(21);t.default=function(){const e=Object(r.useContext)(a.a);if(null===e)throw new Error("Docusaurus context not provided");return e}},164:function(e,t,n){try{e.exports=n(182)}catch(r){e.exports={}}},165:function(e,t,n){"use strict";n.d(t,"b",(function(){return o})),n.d(t,"a",(function(){return i}));var r=n(163),a=n(168);function o(){const{siteConfig:{baseUrl:e="/",url:t}={}}=Object(r.default)();return{withBaseUrl:(n,r)=>function(e,t,n,r){let{forcePrependBaseUrl:o=!1,absolute:i=!1}=void 0===r?{}:r;if(!n)return n;if(n.startsWith("#"))return n;if(Object(a.b)(n))return n;if(o)return t+n;const s=n.startsWith(t)?n:t+n.replace(/^\//,"");return i?e+s:s}(t,e,n,r)}}function i(e,t){void 0===t&&(t={});const{withBaseUrl:n}=o();return n(e,t)}},167:function(e,t,n){"use strict";n.r(t);var r=n(10);n.d(t,"MemoryRouter",(function(){return r.d})),n.d(t,"Prompt",(function(){return r.f})),n.d(t,"Redirect",(function(){return r.g})),n.d(t,"Route",(function(){return r.h})),n.d(t,"Router",(function(){return r.i})),n.d(t,"StaticRouter",(function(){return r.j})),n.d(t,"Switch",(function(){return r.k})),n.d(t,"generatePath",(function(){return r.l})),n.d(t,"matchPath",(function(){return r.m})),n.d(t,"useHistory",(function(){return r.n})),n.d(t,"useLocation",(function(){return r.o})),n.d(t,"useParams",(function(){return r.p})),n.d(t,"useRouteMatch",(function(){return r.q})),n.d(t,"withRouter",(function(){return r.r})),n.d(t,"BrowserRouter",(function(){return r.a})),n.d(t,"HashRouter",(function(){return r.b})),n.d(t,"Link",(function(){return r.c})),n.d(t,"NavLink",(function(){return r.e}))},168:function(e,t,n){"use strict";function r(e){return!0===/^(\w*:|\/\/)/.test(e)}function a(e){return void 0!==e&&!r(e)}n.d(t,"b",(function(){return r})),n.d(t,"a",(function(){return a}))},169:function(e,t,n){"use strict";var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.useThemeConfig=void 0;const a=r(n(163));t.useThemeConfig=function(){return a.default().siteConfig.themeConfig}},170:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.isDocsPluginEnabled=void 0;const r=n(164);t.isDocsPluginEnabled=!!r.useAllDocsData},171:function(e,t,n){"use strict";var r=this&&this.__createBinding||(Object.create?function(e,t,n,r){void 0===r&&(r=n),Object.defineProperty(e,r,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,r){void 0===r&&(r=n),e[r]=t[n]}),a=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),o=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.hasOwnProperty.call(e,n)&&r(t,e,n);return a(t,e),t},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.useDocsPreferredVersionContext=t.DocsPreferredVersionContextProvider=void 0;const s=o(n(0)),c=n(169),u=n(170),l=n(164),d=i(n(187));function f(e){let{pluginIds:t,versionPersistence:n,allDocsData:r}=e;const a={};return t.forEach((e=>{a[e]=function(e){const t=d.default.read(e,n);return r[e].versions.some((e=>e.name===t))?{preferredVersionName:t}:(d.default.clear(e,n),{preferredVersionName:null})}(e)})),a}function m(){const e=l.useAllDocsData(),t=c.useThemeConfig().docs.versionPersistence,n=s.useMemo((()=>Object.keys(e)),[e]),[r,a]=s.useState((()=>function(e){const t={};return e.forEach((e=>{t[e]={preferredVersionName:null}})),t}(n)));s.useEffect((()=>{a(f({allDocsData:e,versionPersistence:t,pluginIds:n}))}),[e,t,n]);return[r,s.useMemo((()=>({savePreferredVersion:function(e,n){d.default.save(e,t,n),a((t=>Object.assign(Object.assign({},t),{[e]:{preferredVersionName:n}})))}})),[a])]}const g=s.createContext(null);function v(e){let{children:t}=e;const n=m();return s.default.createElement(g.Provider,{value:n},t)}t.DocsPreferredVersionContextProvider=function(e){let{children:t}=e;return u.isDocsPluginEnabled?s.default.createElement(v,null,t):s.default.createElement(s.default.Fragment,null,t)},t.useDocsPreferredVersionContext=function(){const e=s.useContext(g);if(!e)throw new Error("Can't find docs preferred context, maybe you forgot to use the DocsPreferredVersionContextProvider ?");return e}},179:function(e,t,n){"use strict";var r=n(0),a=n.n(r),o=n(161);var i=function(e,t,n){const[a,o]=Object(r.useState)(void 0);Object(r.useEffect)((()=>{function r(){const r=function(){const e=Array.from(document.getElementsByClassName("anchor")),t=e.find((e=>{const{top:t}=e.getBoundingClientRect();return t>=n}));if(t){if(t.getBoundingClientRect().top>=n){const n=e[e.indexOf(t)-1];return null!=n?n:t}return t}return e[e.length-1]}();if(r){let n=0,i=!1;const s=document.getElementsByClassName(e);for(;n<s.length&&!i;){const e=s[n],{href:c}=e,u=decodeURIComponent(c.substring(c.indexOf("#")+1));r.id===u&&(a&&a.classList.remove(t),e.classList.add(t),o(e),i=!0),n+=1}}}return document.addEventListener("scroll",r),document.addEventListener("resize",r),r(),()=>{document.removeEventListener("scroll",r),document.removeEventListener("resize",r)}}))},s=n(50),c=n.n(s);const u="table-of-contents__link";function l(e){let{headings:t,isChild:n}=e;return t.length?a.a.createElement("ul",{className:n?"":"table-of-contents table-of-contents__left-border"},t.map((e=>a.a.createElement("li",{key:e.id},a.a.createElement("a",{href:`#${e.id}`,className:u,dangerouslySetInnerHTML:{__html:e.value}}),a.a.createElement(l,{isChild:!0,headings:e.children}))))):null}t.a=function(e){let{headings:t}=e;return i(u,"table-of-contents__link--active",100),a.a.createElement("div",{className:Object(o.a)(c.a.tableOfContents,"thin-scrollbar")},a.a.createElement(l,{headings:t}))}},181:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.docVersionSearchTag=t.DEFAULT_SEARCH_TAG=void 0,t.DEFAULT_SEARCH_TAG="default",t.docVersionSearchTag=function(e,t){return`docs-${e}-${t}`}},182:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.useDocVersionSuggestions=t.useActiveDocContext=t.useActiveVersion=t.useLatestVersion=t.useVersions=t.useActivePluginAndVersion=t.useActivePlugin=t.useDocsData=t.useAllDocsData=void 0;const r=n(167),a=n(183),o=n(184);t.useAllDocsData=()=>a.useAllPluginInstancesData("docusaurus-plugin-content-docs"),t.useDocsData=e=>a.usePluginData("docusaurus-plugin-content-docs",e),t.useActivePlugin=function(e){void 0===e&&(e={});const n=t.useAllDocsData(),{pathname:a}=r.useLocation();return o.getActivePlugin(n,a,e)},t.useActivePluginAndVersion=function(e){void 0===e&&(e={});const n=t.useActivePlugin(e),{pathname:a}=r.useLocation();if(n){return{activePlugin:n,activeVersion:o.getActiveVersion(n.pluginData,a)}}},t.useVersions=e=>t.useDocsData(e).versions,t.useLatestVersion=e=>{const n=t.useDocsData(e);return o.getLatestVersion(n)},t.useActiveVersion=e=>{const n=t.useDocsData(e),{pathname:a}=r.useLocation();return o.getActiveVersion(n,a)},t.useActiveDocContext=e=>{const n=t.useDocsData(e),{pathname:a}=r.useLocation();return o.getActiveDocContext(n,a)},t.useDocVersionSuggestions=e=>{const n=t.useDocsData(e),{pathname:a}=r.useLocation();return o.getDocVersionSuggestions(n,a)}},183:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return a})),n.d(t,"useAllPluginInstancesData",(function(){return o})),n.d(t,"usePluginData",(function(){return i}));var r=n(163);function a(){const{globalData:e}=Object(r.default)();if(!e)throw new Error("Docusaurus global data not found");return e}function o(e){const t=a()[e];if(!t)throw new Error(`Docusaurus plugin global data not found for pluginName=${e}`);return t}function i(e,t){void 0===t&&(t="default");const n=o(e)[t];if(!n)throw new Error(`Docusaurus plugin global data not found for pluginName=${e} and pluginId=${t}`);return n}},184:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getDocVersionSuggestions=t.getActiveDocContext=t.getActiveVersion=t.getLatestVersion=t.getActivePlugin=void 0;const r=n(167);t.getActivePlugin=function(e,t,n){void 0===n&&(n={});const a=Object.entries(e).find((e=>{let[n,a]=e;return!!r.matchPath(t,{path:a.path,exact:!1,strict:!1})})),o=a?{pluginId:a[0],pluginData:a[1]}:void 0;if(!o&&n.failfast)throw new Error(`Can't find active docs plugin for pathname=${t}, while it was expected to be found. Maybe you tried to use a docs feature that can only be used on a docs-related page? Existing docs plugin paths are: ${Object.values(e).map((e=>e.path)).join(", ")}`);return o},t.getLatestVersion=e=>e.versions.find((e=>e.isLast)),t.getActiveVersion=(e,n)=>{const a=t.getLatestVersion(e);return[...e.versions.filter((e=>e!==a)),a].find((e=>!!r.matchPath(n,{path:e.path,exact:!1,strict:!1})))},t.getActiveDocContext=(e,n)=>{const a=t.getActiveVersion(e,n),o=null==a?void 0:a.docs.find((e=>!!r.matchPath(n,{path:e.path,exact:!0,strict:!1})));return{activeVersion:a,activeDoc:o,alternateDocVersions:o?function(t){const n={};return e.versions.forEach((e=>{e.docs.forEach((r=>{r.id===t&&(n[e.name]=r)}))})),n}(o.id):{}}},t.getDocVersionSuggestions=(e,n)=>{const r=t.getLatestVersion(e),a=t.getActiveDocContext(e,n),o=a.activeVersion!==r;return{latestDocSuggestion:o?null==a?void 0:a.alternateDocVersions[r.name]:void 0,latestVersionSuggestion:o?r:void 0}}},185:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.isSamePath=void 0,t.isSamePath=(e,t)=>{const n=e=>!e||(null==e?void 0:e.endsWith("/"))?e:`${e}/`;return n(e)===n(t)}},186:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.useDocsPreferredVersionByPluginId=t.useDocsPreferredVersion=void 0;const r=n(0),a=n(171),o=n(164),i=n(188);t.useDocsPreferredVersion=function(e){void 0===e&&(e=i.DEFAULT_PLUGIN_ID);const t=o.useDocsData(e),[n,s]=a.useDocsPreferredVersionContext(),{preferredVersionName:c}=n[e];return{preferredVersion:c?t.versions.find((e=>e.name===c)):null,savePreferredVersionName:r.useCallback((t=>{s.savePreferredVersion(e,t)}),[s])}},t.useDocsPreferredVersionByPluginId=function(){const e=o.useAllDocsData(),[t]=a.useDocsPreferredVersionContext(),n=Object.keys(e),r={};return n.forEach((n=>{r[n]=function(n){const r=e[n],{preferredVersionName:a}=t[n];return a?r.versions.find((e=>e.name===a)):null}(n)})),r}},187:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const r=e=>`docs-preferred-version-${e}`,a={save:(e,t,n)=>{"none"===t||window.localStorage.setItem(r(e),n)},read:(e,t)=>"none"===t?null:window.localStorage.getItem(r(e)),clear:(e,t)=>{"none"===t||window.localStorage.removeItem(r(e))}};t.default=a},188:function(e,t,n){"use strict";n.r(t),n.d(t,"DEFAULT_PLUGIN_ID",(function(){return r}));const r="default"}}]);