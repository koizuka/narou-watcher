(this["webpackJsonpnarou-react"]=this["webpackJsonpnarou-react"]||[]).push([[0],{91:function(e,t,n){},99:function(e,t,n){"use strict";n.r(t);var r=n(0),c=n.n(r),a=n(10),o=n.n(a),i=(n(91),n(15)),u=n(33),s=n(46),l=n(12),b=n.n(l),j=n(18),d=n(17),f=n(155),O=n(128),h=n(129),p=n(130),v=n(131),m=n(138),x=n(139),k=n(153),g=n(140),y=n(156),w=n(136),C=n(141),S=n(142),E=n(143),_=n(157),R=n(145),F=n(144),D=n(60);function I(){Object(u.c)("/narou/isnoticelist"),Object(u.c)("/r18/isnoticelist")}var L=n(132),M=n(133),T=n(134),A=n(135),N=n(151),P=n(137),z=n(5);function G(e){var t=Object(r.useState)(""),n=Object(i.a)(t,2),c=n[0],a=n[1],o=Object(r.useState)(""),u=Object(i.a)(o,2),s=u[0],l=u[1],d=Object(r.useState)(""),m=Object(i.a)(d,2),x=m[0],g=m[1],y=Object(r.useCallback)(Object(j.a)(b.a.mark((function t(){var n,r;return b.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.api.login(c,s);case 2:if((n=t.sent).ok){t.next=10;break}return t.next=6,n.text();case 6:r=t.sent,g("".concat(n.status," ").concat(n.statusText,"\n").concat(r)),t.next=11;break;case 10:e.onLogin();case 11:case"end":return t.stop()}}),t)}))),[c,s,e]),w=Object(r.useRef)(),C=Object(r.useCallback)((function(){var e;g(""),null===(e=w.current)||void 0===e||e.focus()}),[]);return Object(z.jsxs)(z.Fragment,{children:[Object(z.jsxs)(f.a,{open:""!==x,onClose:function(){return C()},children:[Object(z.jsx)(O.a,{children:"\u30ed\u30b0\u30a4\u30f3\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f"}),Object(z.jsx)(h.a,{children:Object(z.jsx)("pre",{children:x})}),Object(z.jsx)(p.a,{children:Object(z.jsx)(v.a,{autoFocus:!0,onClick:function(){return C()},children:"OK"})})]}),Object(z.jsx)(L.a,{maxWidth:"sm",children:Object(z.jsxs)(M.a,{raised:!0,children:[Object(z.jsx)(T.a,{title:"\u5c0f\u8aac\u5bb6\u306b\u306a\u308d\u3046\u306e\u30ed\u30b0\u30a4\u30f3\u60c5\u5831"}),Object(z.jsx)(A.a,{children:Object(z.jsxs)(k.a,{display:"flex",flexDirection:"column",justifyContent:"center",children:[Object(z.jsx)(N.a,{id:"id",name:"id",label:"ID or email",autoFocus:!0,value:c,onChange:function(e){return a(e.target.value)},onKeyPress:function(e){var t;"Enter"===e.key&&(null===(t=w.current)||void 0===t||t.focus())}}),Object(z.jsx)(N.a,{id:"password",name:"password",label:"password",type:"password",value:s,onChange:function(e){return l(e.target.value)},inputRef:w,onKeyPress:function(e){"Enter"===e.key&&y()}})]})}),Object(z.jsx)(P.a,{style:{justifyContent:"center"},children:Object(z.jsx)(v.a,{variant:"contained",onClick:y,children:"login"})})]})})]})}var H=n(75);function U(e){return e.bookmark>=e.latest?"".concat(e.base_url).concat(e.latest,"/"):"".concat(e.base_url).concat(e.bookmark+1,"/")}function J(e){var t=[e.title," ("];return function(e){return e.latest>e.bookmark}(e)&&t.push("".concat(e.bookmark,"/")),t.push("".concat(e.latest,")")),e.completed&&t.push("[\u5b8c\u7d50]"),t.join("")}function K(e){return Math.max(e.latest-e.bookmark,0)}function X(e){return e.latest<e.bookmark?{color:"secondary",badgeContent:"!"}:{color:"primary",badgeContent:K(e)}}function B(e){var t=e.item,n=e.onClose;return Object(z.jsxs)(f.a,{open:!!t,onClose:n,children:[Object(z.jsx)(O.a,{children:null===t||void 0===t?void 0:t.title}),Object(z.jsxs)(h.a,{children:["\u4f5c\u8005:",null===t||void 0===t?void 0:t.author_name]}),Object(z.jsxs)(p.a,{children:[Object(z.jsx)(v.a,{variant:"contained",onClick:function(){t&&window.open(t.base_url,"_blank"),n()},children:"\u5c0f\u8aac\u30da\u30fc\u30b8"}),Object(z.jsxs)(v.a,{variant:"contained",onClick:function(){t&&window.open(U(t),"_blank"),n()},children:["\u6700\u65b0",null===t||void 0===t?void 0:t.latest,"\u90e8\u5206"]}),Object(z.jsx)(v.a,{variant:"contained",onClick:function(){return n()},children:"\u30ad\u30e3\u30f3\u30bb\u30eb"})]})]})}function $(e){var t=e.server,n=e.onUnauthorized,c=Object(r.useState)(!1),a=Object(i.a)(c,2),o=a[0],l=a[1],f=function(e,t){var n=t.enableR18,c=Object(u.b)("/narou/isnoticelist",function(){var t=Object(j.a)(b.a.mark((function t(n){return b.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",e.call(n));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),{onErrorRetry:function(e){console.log("onErrorRetry:",e,e.status)}}),a=c.data,o=c.error,i=Object(u.b)(!o&&n?"/r18/isnoticelist":null,function(){var t=Object(j.a)(b.a.mark((function t(n){return b.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",e.call(n));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),l=i.data,f=i.error,O=Object(r.useMemo)((function(){if(void 0!==a){var e=function(e){return e.bookmark===e.latest?Number.MAX_SAFE_INTEGER:e.bookmark>e.latest?Number.MAX_SAFE_INTEGER-1:e.latest-e.bookmark};return[].concat(Object(D.a)(a.map((function(e){return Object(d.a)(Object(d.a)({},e),{},{isR18:!1})}))),Object(D.a)((l||[]).map((function(e){return Object(d.a)(Object(d.a)({},e),{},{isR18:!0})})))).map((function(e){return Object(d.a)(Object(d.a)({},e),{},{update_time:s.DateTime.fromISO(e.update_time)})})).sort((function(t,n){var r=e(t),c=e(n);return r>c?1:r<c?-1:t.update_time<n.update_time?1:t.update_time>n.update_time?-1:0})).slice(0,30)}}),[a,l]);return{data:o?void 0:O,error:o||f}}(t,{enableR18:o}),O=f.data,h=f.error,p=Object(r.useMemo)((function(){return O?O.filter((function(e){return e.bookmark<e.latest})).length:0}),[O]),I=Object(r.useState)(void 0),L=Object(i.a)(I,2),M=L[0],T=L[1],A=Object(r.useState)(-1),N=Object(i.a)(A,2),P=N[0],G=N[1],$=Object(r.useState)(-1),V=Object(i.a)($,2),W=V[0],Z=V[1];Object(r.useEffect)((function(){document.title="\u306a\u308d\u3046 \u672a\u8aad:".concat(p)}),[p]);var q=Object(r.useCallback)((function(e){e&&(Object(H.a)(e,{behavior:"smooth",scrollMode:"if-needed"}),e.focus())}),[]);Object(r.useEffect)((function(){var e=O?O.reduce((function(e,t,n){var r=Object(i.a)(e,2),c=r[0],a=r[1],o=Math.max(t.latest-t.bookmark,0);return o&&o<=a?[n,o]:[c,a]}),[-1,Number.MAX_SAFE_INTEGER]):[-1],t=Object(i.a)(e,1)[0];Z(t),G(t)}),[O]);var Q=Object(r.useRef)(null);Object(r.useEffect)((function(){var e;-1===P&&(null===(e=Q.current)||void 0===e||e.focus())}),[P]),Object(r.useEffect)((function(){if(O){var e=function(e){var t=O.length;switch(e.key){case"ArrowUp":P>0&&e.preventDefault(),G((function(e){return e>0?e-1:0}));break;case"ArrowDown":P<t-1&&e.preventDefault(),G((function(e){return e<t?e+1:t-1}));break;case"Home":G(0);break;case"End":G(t-1);break;case"Escape":G(W)}};return document.addEventListener("keydown",e,!1),function(){document.removeEventListener("keydown",e)}}}),[P,W,O]);var Y=Object(r.useCallback)((function(e){return K(e)>0?{component:"a",href:U(e),target:"_blank"}:{onClick:function(){return T(e)}}}),[T]);return h?(console.log("error =",h),401===h.status&&n(),Object(z.jsxs)("div",{children:["Server(",JSON.stringify(t),") is not working...?"]})):O?Object(z.jsxs)(z.Fragment,{children:[Object(z.jsx)(B,{item:M,onClose:function(){return T(void 0)}}),Object(z.jsx)(m.a,{position:"sticky",children:Object(z.jsxs)(x.a,{children:[Object(z.jsx)(k.a,{children:Object(z.jsx)(g.a,{label:"R18",control:Object(z.jsx)(y.a,{checked:o,onChange:function(e){return l(e.target.checked)},inputRef:Q})})}),Object(z.jsxs)(k.a,{m:2,children:["\u672a\u8aad: ",p]}),Object(z.jsx)(v.a,{variant:"contained",disabled:W===P,onClick:function(){return G(W)},children:"\u6700\u53e4\u306e\u672a\u8aad"})]})}),Object(z.jsx)(k.a,{m:2,display:"flex",flexDirection:"column",bgcolor:"background.paper",children:Object(z.jsx)(w.a,{children:null===O||void 0===O?void 0:O.map((function(e,t){return Object(z.jsxs)(C.a,Object(d.a)(Object(d.a)(Object(d.a)({button:!0},t===P?{selected:!0,ref:q}:{}),{},{disableRipple:!0,onFocusVisible:function(){return G(t)}},Y(e)),{},{children:[Object(z.jsx)(S.a,{children:Object(z.jsx)(E.a,Object(d.a)(Object(d.a)({overlap:"circle"},X(e)),{},{children:Object(z.jsx)(_.a,{children:Object(z.jsx)(F.a,{color:e.isR18?"secondary":void 0})})}))}),Object(z.jsx)(R.a,{primary:J(e),secondary:"".concat(e.update_time.toFormat("yyyy/LL/dd HH:mm")," \u66f4\u65b0  \u4f5c\u8005:").concat(e.author_name)})]}),e.base_url)}))})})]}):Object(z.jsx)("div",{children:"Loading..."})}function V(e){var t=e.api,n=Object(r.useState)(!1),c=Object(i.a)(n,2),a=c[0],o=c[1];return a?Object(z.jsx)(G,{api:t,onLogin:function(){console.log("logged in!"),I(),o(!1)}}):Object(z.jsxs)(z.Fragment,{children:[Object(z.jsx)($,{server:t,onUnauthorized:function(){I(),o(!0)}}),Object(z.jsx)(v.a,{onClick:Object(j.a)(b.a.mark((function e(){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.logout();case 2:I(),o(!0);case 4:case"end":return e.stop()}}),e)}))),children:"logout"})]})}var W=n(74),Z=n(148),q=n(146),Q=n(19),Y=n(149),ee=n(150),te=n(72),ne=n(73),re=function(){function e(t){Object(te.a)(this,e),this.server=void 0,this.server=t.replace(/\/$/,"")}return Object(ne.a)(e,[{key:"fetch",value:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){var e=Object(j.a)(b.a.mark((function e(t){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",fetch("".concat(this.server).concat(t),{credentials:"include"}));case 1:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}())},{key:"login",value:function(){var e=Object(j.a)(b.a.mark((function e(t,n){var r,c;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(r=new FormData).append("id",t),r.append("password",n),e.next=5,fetch("".concat(this.server,"/narou/login"),{method:"POST",body:r,credentials:"include"});case 5:return c=e.sent,e.abrupt("return",c);case 7:case"end":return e.stop()}}),e,this)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"logout",value:function(){var e=Object(j.a)(b.a.mark((function e(){return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.fetch("/narou/logout");case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"call",value:function(){var e=Object(j.a)(b.a.mark((function e(t){var n;return b.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.fetch(t);case 2:if((n=e.sent).ok){e.next=5;break}throw n;case 5:return e.abrupt("return",n.json());case 6:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()}]),e}(),ce=n(147);var ae=function(){var e=Object(q.a)("(prefers-color-scheme: dark)"),t=Object(r.useMemo)((function(){return Object(W.a)({palette:{type:e?"dark":"light",primary:ce.a}})}),[e]),n=Object(r.useState)(null),c=Object(i.a)(n,2),a=c[0],o=c[1];return Object(r.useEffect)((function(){var e,t=(e=document.location,new URLSearchParams(e.search).get("server")||("http:"===e.protocol?"http://localhost:7676":/.*\.github\.io$/.test(e.hostname)?"":e.protocol+"//"+e.host+e.pathname));o(t?new re(t):null)}),[]),a?Object(z.jsxs)(Z.a,{theme:t,children:[Object(z.jsx)(ee.a,{}),Object(z.jsx)(u.a,{value:{refreshInterval:3e5},children:Object(z.jsx)(V,{api:a})}),Object(z.jsxs)("div",{style:{display:"inline-block",position:"fixed",bottom:0,right:0,fontSize:"small",fontStyle:"italic"},children:["narou-react: ",s.DateTime.fromISO("2021-05-01T18:10:48.786Z").toISO()]})]}):Object(z.jsxs)(Z.a,{theme:t,children:[Object(z.jsx)(Q.a,{children:"http\u4ee5\u5916\u306e\u5834\u5408\u306f\u5fc5\u305a server \u30af\u30a8\u30ea\u30d1\u30e9\u30e1\u30fc\u30bf\u306b\u30b5\u30fc\u30d0\u30fc\u30a2\u30c9\u30ec\u30b9\u3092\u6307\u5b9a\u3057\u3066\u304f\u3060\u3055\u3044"}),Object(z.jsx)(Y.a,{href:"https://github.com/koizuka/narou-watcher/",children:"GitHub"})]})},oe=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,160)).then((function(t){var n=t.getCLS,r=t.getFID,c=t.getFCP,a=t.getLCP,o=t.getTTFB;n(e),r(e),c(e),a(e),o(e)}))};o.a.render(Object(z.jsx)(c.a.StrictMode,{children:Object(z.jsx)(ae,{})}),document.getElementById("root")),oe()}},[[99,1,2]]]);
//# sourceMappingURL=main.36874235.chunk.js.map