(this["webpackJsonpnarou-react"]=this["webpackJsonpnarou-react"]||[]).push([[0],{101:function(e,t,n){},109:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),c=n(12),o=n.n(c),i=(n(101),n(13)),u=n(20),s=n(53),l=n(10),b=n.n(l),f=n(15),d=n(18),j=n(69),p=n(158),v=n(179),O=n(111),h=n(161),m=n(162),k=n(163),x=n(176),g=n(164),y=n(181),w=n(148),C=n(155),_=n(113),S=n(166),B=n(167),R=n(182),E=n(169),A=n(170),I=n(165),P=n(172),M=n(168),F=n(171),z=n(50),K=n(76),D=n(77),N=function(){function e(t){Object(K.a)(this,e),this.server=void 0,this.server=t.replace(/\/$/,"")}return Object(D.a)(e,[{key:"baseUrl",get:function(){return this.server}},{key:"fetch",value:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){var e=Object(f.a)(b.a.mark((function e(t){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",fetch("".concat(this.server).concat(t),{credentials:"include"}));case 1:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}())},{key:"login",value:function(){var e=Object(f.a)(b.a.mark((function e(t,n){var r,a;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(r=new FormData).append("id",t),r.append("password",n),e.next=5,fetch("".concat(this.server,"/narou/login"),{method:"POST",body:r,credentials:"include"});case 5:return a=e.sent,e.abrupt("return",a);case 7:case"end":return e.stop()}}),e,this)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"logout",value:function(){var e=Object(f.a)(b.a.mark((function e(){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.fetch("/narou/logout");case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"call",value:function(){var e=Object(f.a)(b.a.mark((function e(t){var n;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.fetch(t);case 2:if((n=e.sent).ok){e.next=5;break}throw n;case 5:return e.abrupt("return",n.json());case 6:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()}],[{key:"isnoticelist",value:function(e){var t=e.maxPage;return"/narou/isnoticelist?max_page=".concat(void 0===t?1:t)}},{key:"isnoticelistR18",value:function(e){var t=e.maxPage;return"/r18/isnoticelist?max_page=".concat(void 0===t?1:t)}},{key:"bookmarks",value:function(){return"/narou/bookmarks/"}},{key:"bookmarksR18",value:function(){return"/r18/bookmarks/"}},{key:"bookmark",value:function(e,t){var n=t.order;return"/narou/bookmarks/".concat(e,"?order=").concat(n)}},{key:"bookmarkR18",value:function(e,t){var n=t.order;return"/r18/bookmarks/".concat(e,"?order=").concat(n)}},{key:"novelInfo",value:function(e){return"/narou/novels/".concat(e)}},{key:"novelInfoR18",value:function(e){return"/r18/novels/".concat(e)}}]),e}();function L(){Object(u.c)("/narou/isnoticelist"),Object(u.c)("/r18/isnoticelist")}function T(e,t,n){var r=n(e),a=n(t);return r<a?-1:r>a?1:0}function U(e,t){var n=t.enableR18,a=t.maxPage,c=void 0===a?1:a,o=t.bookmark,i=void 0===o?0:o,l=Object(u.b)(N.isnoticelist({maxPage:c}),function(){var t=Object(f.a)(b.a.mark((function t(n){return b.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",e.call(n));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),{onErrorRetry:function(e){console.log("onErrorRetry:",e,e.status)}}),j=l.data,p=l.error,v=Object(u.b)(!p&&i?N.bookmark(i,{order:"new"}):null,function(){var t=Object(f.a)(b.a.mark((function t(n){return b.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",e.call(n));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),O=v.data,h=v.error,m=Object(u.b)(!p&&n?N.isnoticelistR18({maxPage:c}):null,function(){var t=Object(f.a)(b.a.mark((function t(n){return b.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",e.call(n));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),k=m.data,x=m.error,g=Object(r.useMemo)((function(){if(j&&O){var e=new Set(j.map((function(e){return e.base_url}))),t=O.filter((function(t){return t.is_notice&&!e.has(t.base_url)}));if(t.length>0)return[].concat(Object(z.a)(j),Object(z.a)(t))}return j}),[j,O]),y=Object(r.useMemo)((function(){if(void 0!==g){return[].concat(Object(z.a)(g.map((function(e){return Object(d.a)(Object(d.a)({},e),{},{isR18:!1})}))),Object(z.a)((k||[]).map((function(e){return Object(d.a)(Object(d.a)({},e),{},{isR18:!0})})))).map((function(e){return Object(d.a)(Object(d.a)({},e),{},{update_time:s.DateTime.fromISO(e.update_time)})})).sort((function(e,t){return function(e,t){for(var n=arguments.length,r=new Array(n>2?n-2:0),a=2;a<n;a++)r[a-2]=arguments[a];for(var c=0,o=r;c<o.length;c++){var i=o[c],u=void 0;if(u="object"===typeof i?T(t,e,i.f):T(e,t,i))return u}return 0}(e,t,(function(e){return function(e){return e.bookmark===e.latest?Number.MAX_SAFE_INTEGER:e.bookmark>e.latest?Number.MAX_SAFE_INTEGER-1:e.latest-e.bookmark}(e)}),e.bookmark<e.latest?function(e){return e.update_time}:{f:function(e){return e.update_time}},(function(e){return e.base_url}))})).slice(0,30)}}),[g,k]);return{data:p?void 0:y,error:p||x||h}}function H(e){return e.latest>e.bookmark}function G(e){return H(e)?"".concat(e.base_url).concat(e.bookmark+1,"/"):"".concat(e.base_url).concat(e.latest,"/")}function J(e){var t=[e.title," ("];return H(e)&&t.push("".concat(e.bookmark,"/")),t.push("".concat(e.latest,")")),e.completed&&t.push("[\u5b8c\u7d50]"),t.join("")}function W(e){return Math.max(e.latest-e.bookmark,0)}var X=n(143),Z=n(145),$=n(146),V=n(147),q=n(149),Q=n(150),Y=n(151),ee=n(152),te=n(178),ne=n(156),re=n(5);function ae(e){var t=Object(r.useState)(""),n=Object(i.a)(t,2),a=n[0],c=n[1],o=Object(r.useState)(""),u=Object(i.a)(o,2),s=u[0],l=u[1],d=Object(r.useState)(""),j=Object(i.a)(d,2),p=j[0],v=j[1],O=Object(r.useCallback)(Object(f.a)(b.a.mark((function t(){var n,r;return b.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.api.login(a,s);case 2:if((n=t.sent).ok){t.next=10;break}return t.next=6,n.text();case 6:r=t.sent,v("".concat(n.status," ").concat(n.statusText,"\n").concat(r)),t.next=11;break;case 10:e.onLogin();case 11:case"end":return t.stop()}}),t)}))),[a,s,e]),h=Object(r.useRef)(),m=Object(r.useCallback)((function(){var e;v(""),null===(e=h.current)||void 0===e||e.focus()}),[]);return Object(re.jsxs)(re.Fragment,{children:[Object(re.jsxs)(X.a,{open:""!==p,onClose:function(){return m()},children:[Object(re.jsx)(Z.a,{children:"\u30ed\u30b0\u30a4\u30f3\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f"}),Object(re.jsx)($.a,{children:Object(re.jsx)("pre",{children:p})}),Object(re.jsx)(V.a,{children:Object(re.jsx)(w.a,{autoFocus:!0,onClick:function(){return m()},children:"OK"})})]}),Object(re.jsx)(q.a,{maxWidth:"sm",children:Object(re.jsxs)(Q.a,{raised:!0,children:[Object(re.jsx)(Y.a,{title:"\u5c0f\u8aac\u5bb6\u306b\u306a\u308d\u3046\u306e\u30ed\u30b0\u30a4\u30f3\u60c5\u5831"}),Object(re.jsx)(ee.a,{children:Object(re.jsxs)(x.a,{display:"flex",flexDirection:"column",justifyContent:"center",children:[Object(re.jsx)(te.a,{id:"id",name:"id",label:"ID or email",autoFocus:!0,value:a,onChange:function(e){return c(e.target.value)},onKeyPress:function(e){var t;"Enter"===e.key&&(null===(t=h.current)||void 0===t||t.focus())}}),Object(re.jsx)(te.a,{id:"password",name:"password",label:"password",type:"password",value:s,onChange:function(e){return l(e.target.value)},inputRef:h,onKeyPress:function(e){"Enter"===e.key&&O()}})]})}),Object(re.jsx)(ne.a,{style:{justifyContent:"center"},children:Object(re.jsx)(w.a,{variant:"contained",onClick:O,children:"login"})})]})})]})}var ce=n(83),oe=n(157);function ie(e,t){var n=Object(u.b)(e?t?N.bookmarksR18():N.bookmarks():null,function(){var t=Object(f.a)(b.a.mark((function t(n){return b.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",e?e.call(n):[]);case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),a=n.data,c=n.error;return{data:Object(r.useMemo)((function(){return a?a.reduce((function(e,t){return e[t.no]={name:t.name,num_items:t.num_items},e}),{}):void 0}),[a]),error:c}}function ue(e,t){var n=Object(r.useMemo)((function(){return function(e){if(!e)return null;var t=e.match(/https:\/\/([0-9a-zA-Z.]+)\/([0-9a-z]+)\/?/);if(!t)return console.warn("base_url is invalid: ".concat(e)),null;var n=Object(i.a)(t,3);return{host:n[1],ncode:n[2]}}(t)}),[t]),a=Object(r.useMemo)((function(){if(!n)return null;switch(n.host){case"ncode.syosetu.com":return N.novelInfo(n.ncode);case"novel18.syosetu.com":return N.novelInfoR18(n.ncode);default:return console.warn("unknown host: ".concat(n.host)),null}}),[n]),c=Object(u.b)(a,function(){var t=Object(f.a)(b.a.mark((function t(n){return b.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",e.call(n));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}());return{data:c.data,error:c.error}}function se(e){var t=e.api,n=e.item,a=e.onClose,c=ue(t,null===n||void 0===n?void 0:n.base_url).data,o=ie((null===c||void 0===c?void 0:c.bookmark_no)?t:null,(null===n||void 0===n?void 0:n.isR18)||!1).data,i=Object(r.useMemo)((function(){console.log("novelInfo:",c),console.log("bookmarkInfo:",o);var e=null===c||void 0===c?void 0:c.bookmark_no;if(o&&e&&(null===c||void 0===c?void 0:c.bookmark_url))return{no:e,name:o[e].name,url:c.bookmark_url}}),[c,o]);return Object(re.jsxs)(X.a,{open:!!n,onClose:a,children:[Object(re.jsx)(Z.a,{children:null===n||void 0===n?void 0:n.title}),Object(re.jsxs)($.a,{children:["\u4f5c\u8005:",Object(re.jsx)(oe.a,{href:null===c||void 0===c?void 0:c.author_url,target:"_blank",children:null===n||void 0===n?void 0:n.author_name})]}),i&&Object(re.jsxs)($.a,{children:["\u30d6\u30c3\u30af\u30de\u30fc\u30af:",Object(re.jsx)(oe.a,{href:i.url,target:"_blank",children:i.name})]}),Object(re.jsxs)(V.a,{children:[Object(re.jsx)(w.a,{size:"small",variant:"contained",onClick:function(){n&&window.open(n.base_url,"_blank"),a()},children:"\u5c0f\u8aac\u30da\u30fc\u30b8"}),Object(re.jsxs)(w.a,{size:"small",variant:"contained",onClick:function(){n&&window.open(G(n),"_blank"),a()},children:["\u6700\u65b0",null===n||void 0===n?void 0:n.latest,"\u90e8\u5206"]}),Object(re.jsx)(w.a,{size:"small",variant:"contained",onClick:function(){return a()},children:"\u30ad\u30e3\u30f3\u30bb\u30eb"})]})]})}var le=n(159),be=n(177),fe=n(160),de=Object(p.a)({root:{color:"black"},icon:{fill:"black"}});var je=Object(le.a)()((function(e){var t=e.bookmarks,n=e.bookmark,a=e.onChangeBookmark,c=e.width,o=de(),u=Object(r.useState)(!1),s=Object(i.a)(u,2),l=s[0],b=s[1],f=Object(le.b)("sm",c);return Object(re.jsxs)(be.a,{classes:{root:o.root,icon:o.icon},disableUnderline:!0,open:l,onOpen:function(){return b(!0)},onClose:function(){return b(!1)},value:n,onChange:function(e){return a(Number(e.target.value))},children:[Object(re.jsx)(fe.a,{value:0,children:l||f?"\u30d6\u30c3\u30af\u30de\u30fc\u30af\u306a\u3057":"BM-"},0),t&&Object.keys(t).map((function(e){return Object(re.jsx)(fe.a,{value:e,children:l||f?t[Number(e)].name:"BM".concat(n)},e)}))]})}));var pe="https://syosetu.com/user/top/",ve=Object(p.a)((function(e){return Object(v.a)({backdrop:{zIndex:e.zIndex.drawer+1,color:"#fff"}})}));function Oe(e){return e.latest<e.bookmark?{color:"secondary",badgeContent:"!"}:{color:"primary",badgeContent:W(e)}}function he(e){return e?2:1}function me(e){var t=e.server,n=e.onUnauthorized,a=ve(),c=Object(r.useState)(!1),o=Object(i.a)(c,2),u=o[0],s=o[1],l=Object(r.useState)(he(!1)),b=Object(i.a)(l,2),f=b[0],p=b[1],v=Object(r.useState)(0),z=Object(i.a)(v,2),K=z[0],D=z[1],N=U(t,{enableR18:u,maxPage:f,bookmark:K}),L=N.data,T=N.error,H=ie(t,!1).data,X=Object(r.useMemo)((function(){return L?L.filter((function(e){return e.bookmark<e.latest})).length:null}),[L]),Z=Object(r.useState)(void 0),$=Object(i.a)(Z,2),V=$[0],q=$[1],Q=Object(r.useState)(-1),Y=Object(i.a)(Q,2),ee=Y[0],te=Y[1],ne=Object(r.useState)(-1),ae=Object(i.a)(ne,2),oe=ae[0],ue=ae[1],le="setAppBadge"in navigator&&"clearAppBadge"in navigator?{setAppBadge:function(e){return navigator.setAppBadge(e)},clearAppBadge:function(){return navigator.clearAppBadge()}}:{setAppBadge:function(){return Promise.resolve()},clearAppBadge:function(){return Promise.resolve()}},be=le.setAppBadge,fe=le.clearAppBadge,de="setClientBadge"in navigator&&"clearClientBadge"in navigator?{setClientBadge:function(e){return navigator.setClientBadge(e)},clearClientBadge:function(){return navigator.clearClientBadge()}}:{setClientBadge:function(){return Promise.resolve()},clearClientBadge:function(){return Promise.resolve()}},me=de.setClientBadge,ke=de.clearClientBadge;Object(r.useEffect)((function(){null!==X&&(document.title="\u306a\u308d\u3046 \u672a\u8aad:".concat(X),X?(be(X),me(X)):(fe(),ke()))}),[fe,ke,be,me,X]);var xe=Object(r.useCallback)((function(e){e&&(Object(ce.a)(e,{behavior:"smooth",scrollMode:"if-needed"}),e.focus())}),[]);Object(r.useEffect)((function(){te(-1)}),[u,f]),Object(r.useEffect)((function(){var e=L&&L.length>0&&W(L[0])>0?0:-1;ue(e),te(e)}),[L]);var ge=Object(r.useRef)(null);Object(r.useEffect)((function(){var e;-1===ee&&(null===(e=ge.current)||void 0===e||e.focus())}),[ee]),Object(r.useEffect)((function(){if(L){var e=function(e){var t=L.length;switch(e.key){case"ArrowUp":ee>0&&e.preventDefault(),te((function(e){return e>0?e-1:0}));break;case"ArrowDown":ee<t-1&&e.preventDefault(),te((function(e){return e<t?e+1:t-1}));break;case"Home":te(0);break;case"End":te(t-1);break;case"Escape":te(oe);break;case"r":e.metaKey||e.ctrlKey||s((function(e){return!e}));break;case"b":case"B":e.metaKey||e.ctrlKey||H&&D(e.shiftKey?function(e,t){var n=Object.keys(e).map((function(e){return Number(e)})).reverse();if(n.length>0){if(0===t)return n[0];var r,a=Object(j.a)(n);try{for(a.s();!(r=a.n()).done;){var c=r.value;if(c<t)return c}}catch(o){a.e(o)}finally{a.f()}}return 0}(H,K):function(e,t){var n,r=Object.keys(e).map((function(e){return Number(e)})),a=Object(j.a)(r);try{for(a.s();!(n=a.n()).done;){var c=n.value;if(c>t)return c}}catch(o){a.e(o)}finally{a.f()}return 0}(H,K));break;case"1":e.metaKey||e.ctrlKey||p((function(e){return he(e===he(!1))}));break;case"h":e.metaKey||e.ctrlKey||window.open(pe,"_blank")}};return document.addEventListener("keydown",e,!1),function(){document.removeEventListener("keydown",e)}}}),[ee,oe,L,H,K]);var ye=Object(r.useCallback)((function(e){return W(e)>0?{component:"a",href:G(e),onClick:function(){return te(-1)},target:"_blank"}:{disabled:!0}}),[]);return T?(console.log("error =",T),401===T.status&&n(),Object(re.jsxs)("div",{onClick:function(){return window.location.reload()},children:["Server(",JSON.stringify(t.baseUrl),") is not working...? status: ",T.status]})):L?Object(re.jsxs)(re.Fragment,{children:[Object(re.jsx)(se,{api:t,item:V,onClose:function(){return q(void 0)}}),Object(re.jsx)(m.a,{position:"sticky",children:Object(re.jsxs)(k.a,{children:[Object(re.jsx)(x.a,{children:Object(re.jsx)(g.a,{label:"R18",control:Object(re.jsx)(y.a,{checked:u,onChange:function(e){return s(e.target.checked)}})})}),Object(re.jsx)(x.a,{children:Object(re.jsx)(je,{bookmarks:H,bookmark:K,onChangeBookmark:D})}),Object(re.jsxs)(x.a,{m:2,children:["\u672a\u8aad: ",null!==X&&void 0!==X?X:""]}),Object(re.jsx)(w.a,{variant:"contained",disabled:0===ee,disableRipple:!0,ref:ge,onClick:function(){return te(oe)},children:"ESC"})]})}),Object(re.jsxs)(x.a,{m:2,display:"flex",alignItems:"center",flexDirection:"column",bgcolor:"background.paper",children:[Object(re.jsx)(x.a,{maxWidth:600,children:Object(re.jsx)(C.a,{children:null===L||void 0===L?void 0:L.map((function(e,t){return Object(re.jsxs)(_.a,Object(d.a)(Object(d.a)(Object(d.a)({button:!0},t===ee?{selected:!0,ref:xe}:{}),{},{disableRipple:!0,onFocusVisible:function(){return te(t)}},ye(e)),{},{children:[Object(re.jsx)(S.a,{children:Object(re.jsx)(B.a,Object(d.a)(Object(d.a)({overlap:"circular"},Oe(e)),{},{children:Object(re.jsx)(R.a,{children:Object(re.jsx)(M.a,{color:e.isR18?"secondary":void 0})})}))}),Object(re.jsx)(E.a,{primary:J(e),secondary:"".concat(e.update_time.toFormat("yyyy/LL/dd HH:mm")," \u66f4\u65b0  \u4f5c\u8005:").concat(e.author_name)}),Object(re.jsx)(A.a,{children:Object(re.jsx)(I.a,{edge:"end",onClick:function(){return q(e)},disableRipple:!0,children:Object(re.jsx)(F.a,{})})})]}),e.base_url)}))})}),Object(re.jsx)(x.a,{position:"fixed",right:"20px",bottom:"20px",children:Object(re.jsx)(P.a,{variant:"extended",size:"small",disableRipple:!0,component:"a",href:pe,target:"_blank",children:"\u30e6\u30fc\u30b6\u30fc\u30db\u30fc\u30e0"})})]})]}):Object(re.jsx)(O.a,{className:a.backdrop,open:!0,children:Object(re.jsx)(h.a,{color:"inherit"})})}function ke(e){var t=e.api,n=Object(r.useState)(!1),a=Object(i.a)(n,2),c=a[0],o=a[1];return c?Object(re.jsx)(ae,{api:t,onLogin:function(){console.log("logged in!"),L(),o(!1)}}):Object(re.jsxs)(re.Fragment,{children:[Object(re.jsx)(me,{server:t,onUnauthorized:function(){L(),o(!0)}}),Object(re.jsx)(w.a,{onClick:Object(f.a)(b.a.mark((function e(){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.logout();case 2:L(),o(!0);case 4:case"end":return e.stop()}}),e)}))),children:"logout"})]})}var xe=n(82),ge=n(174),ye=n(112),we=n(23),Ce=n(175),_e=n(173);var Se=function(){var e=Object(ye.a)("(prefers-color-scheme: dark)"),t=Object(r.useMemo)((function(){return Object(xe.a)({palette:{type:e?"dark":"light",primary:_e.a}})}),[e]),n=Object(r.useState)(null),a=Object(i.a)(n,2),c=a[0],o=a[1],l=Object(r.useState)(!1),b=Object(i.a)(l,2),f=b[0],d=b[1];return Object(r.useEffect)((function(){var e,t=(e=document.location,new URLSearchParams(e.search).get("server")||("http:"===e.protocol?"http://localhost:7676":/.*\.github\.io$/.test(e.hostname)?"":e.protocol+"//"+e.host+e.pathname));t?o(new N(t)):d(!0)}),[]),f?Object(re.jsxs)(ge.a,{theme:t,children:[Object(re.jsx)(we.a,{children:"http\u4ee5\u5916\u306e\u5834\u5408\u306f\u5fc5\u305a server \u30af\u30a8\u30ea\u30d1\u30e9\u30e1\u30fc\u30bf\u306b\u30b5\u30fc\u30d0\u30fc\u30a2\u30c9\u30ec\u30b9\u3092\u6307\u5b9a\u3057\u3066\u304f\u3060\u3055\u3044"}),Object(re.jsx)(oe.a,{href:"https://github.com/koizuka/narou-watcher/",children:"GitHub"})]}):Object(re.jsxs)(ge.a,{theme:t,children:[Object(re.jsx)(Ce.a,{}),Object(re.jsx)(u.a,{value:{refreshInterval:3e5},children:c&&Object(re.jsx)(ke,{api:c})}),Object(re.jsxs)("div",{style:{display:"inline-block",position:"fixed",bottom:0,right:0,fontSize:"small",fontStyle:"italic"},children:["narou-react: ",s.DateTime.fromISO("2021-09-23T15:48:09.594Z").toISO()]})]})},Be=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,184)).then((function(t){var n=t.getCLS,r=t.getFID,a=t.getFCP,c=t.getLCP,o=t.getTTFB;n(e),r(e),a(e),c(e),o(e)}))};o.a.render(Object(re.jsx)(a.a.StrictMode,{children:Object(re.jsx)(Se,{})}),document.getElementById("root")),Be()}},[[109,1,2]]]);
//# sourceMappingURL=main.30680185.chunk.js.map