(this["webpackJsonpnarou-react"]=this["webpackJsonpnarou-react"]||[]).push([[0],{89:function(e,t,n){},97:function(e,t,n){"use strict";n.r(t);var r=n(0),c=n.n(r),a=n(10),o=n.n(a),i=(n(89),n(18)),u=n(32),s=n(35),l=n(11),j=n.n(l),b=n(17),d=n(16),f=n(147),O=n(126),h=n(127),p=n(128),v=n(129),m=n(145),x=n(131),k=n(132),g=n(133),w=n(148),y=n(130),C=n(134),S=n(135),D=n(136),_=n(149),E=n(138),F=n(137),R=n(59);var L=n(143),I=n(5);function T(e){var t=Object(r.useState)(""),n=Object(i.a)(t,2),c=n[0],a=n[1],o=Object(r.useState)(""),u=Object(i.a)(o,2),s=u[0],l=u[1],d=Object(r.useState)(""),x=Object(i.a)(d,2),k=x[0],g=x[1],w=Object(r.useCallback)(Object(b.a)(j.a.mark((function t(){var n,r;return j.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.api.login(c,s);case 2:if((n=t.sent).ok){t.next=10;break}return t.next=6,n.text();case 6:r=t.sent,g("".concat(n.status," ").concat(n.statusText,"\n").concat(r)),t.next=11;break;case 10:e.onLogin();case 11:case"end":return t.stop()}}),t)}))),[c,s,e]),y=Object(r.useRef)(),C=Object(r.useCallback)((function(){var e;g(""),null===(e=y.current)||void 0===e||e.focus()}),[]);return Object(I.jsxs)(I.Fragment,{children:[Object(I.jsxs)(f.a,{open:""!==k,onClose:function(){return C()},children:[Object(I.jsx)(O.a,{children:"\u30ed\u30b0\u30a4\u30f3\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f"}),Object(I.jsx)(h.a,{children:Object(I.jsx)("pre",{children:k})}),Object(I.jsx)(p.a,{children:Object(I.jsx)(v.a,{autoFocus:!0,onClick:function(){return C()},children:"OK"})})]}),Object(I.jsxs)("form",{id:"loginForm",children:[Object(I.jsx)("h2",{children:"\u5c0f\u8aac\u5bb6\u306b\u306a\u308d\u3046\u306e\u30ed\u30b0\u30a4\u30f3\u60c5\u5831"}),Object(I.jsx)(m.a,{children:Object(I.jsx)(L.a,{id:"id",name:"id",label:"ID or email",autoFocus:!0,value:c,onChange:function(e){return a(e.target.value)},onKeyPress:function(e){var t;"Enter"===e.key&&(null===(t=y.current)||void 0===t||t.focus())}})}),Object(I.jsx)(m.a,{children:Object(I.jsx)(L.a,{id:"password",name:"password",label:"password",type:"password",value:s,onChange:function(e){return l(e.target.value)},inputRef:y,onKeyPress:function(e){"Enter"===e.key&&w()}})}),Object(I.jsx)(v.a,{onClick:w,children:"login"})]})]})}function P(e){return e.bookmark>=e.latest?"".concat(e.base_url).concat(e.latest,"/"):"".concat(e.base_url).concat(e.bookmark+1,"/")}function M(e){return e.latest>e.bookmark}function z(e){return Math.max(e.latest-e.bookmark,0)}function H(e){return e.latest<e.bookmark?{color:"secondary",badgeContent:"!"}:{color:"primary",badgeContent:z(e)}}function U(e){var t=e.item,n=e.onClose;return Object(I.jsxs)(f.a,{open:!!t,onClose:n,children:[Object(I.jsx)(O.a,{children:null===t||void 0===t?void 0:t.title}),Object(I.jsxs)(h.a,{children:["\u4f5c\u8005:",null===t||void 0===t?void 0:t.author_name]}),Object(I.jsxs)(p.a,{children:[Object(I.jsx)(v.a,{variant:"contained",onClick:function(){t&&window.open(t.base_url,"_blank"),n()},children:"\u5c0f\u8aac\u30da\u30fc\u30b8"}),Object(I.jsxs)(v.a,{variant:"contained",onClick:function(){t&&window.open(P(t),"_blank"),n()},children:["\u6700\u65b0",null===t||void 0===t?void 0:t.latest,"\u90e8\u5206"]}),Object(I.jsx)(v.a,{variant:"contained",onClick:function(){return n()},children:"\u30ad\u30e3\u30f3\u30bb\u30eb"})]})]})}function J(e){var t=e.server,n=e.ignoreDuration,c=e.onUnauthorized,a=Object(r.useState)(!1),o=Object(i.a)(a,2),l=o[0],f=o[1],O=function(e,t){var n=t.ignoreDuration,c=t.enableR18,a=Object(u.b)("/narou/isnoticelist",function(){var t=Object(b.a)(j.a.mark((function t(n){return j.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",e.call(n));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),{onErrorRetry:function(e){console.log("onErrorRetry:",e,e.status)}}),o=a.data,i=a.error,l=Object(u.b)(!i&&c?"/r18/isnoticelist":null,function(){var t=Object(b.a)(j.a.mark((function t(n){return j.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",e.call(n));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),f=l.data,O=l.error,h=Object(r.useMemo)((function(){if(void 0!==o){var e=s.DateTime.now().minus(n);return[].concat(Object(R.a)(o.map((function(e){return Object(d.a)(Object(d.a)({},e),{},{isR18:!1})}))),Object(R.a)((f||[]).map((function(e){return Object(d.a)(Object(d.a)({},e),{},{isR18:!0})})))).map((function(e){return Object(d.a)(Object(d.a)({},e),{},{update_time:s.DateTime.fromISO(e.update_time)})})).filter((function(t){return t.update_time>e})).sort((function(e,t){return e.update_time>t.update_time?-1:e.update_time<t.update_time?1:0}))}}),[o,f,n]);return{data:i?void 0:h,error:i||O}}(t,{ignoreDuration:n,enableR18:l}),h=O.data,p=O.error,L=Object(r.useMemo)((function(){return h?h.filter((function(e){return e.bookmark<e.latest})).length:0}),[h]),T=Object(r.useState)(void 0),J=Object(i.a)(T,2),K=J[0],A=J[1],B=Object(r.useState)(-1),N=Object(i.a)(B,2),V=N[0],$=N[1],G=Object(r.useState)(-1),Z=Object(i.a)(G,2),q=Z[0],Q=Z[1];Object(r.useEffect)((function(){document.title="\u306a\u308d\u3046 \u672a\u8aad:".concat(L)}),[L]);var W=Object(r.useCallback)((function(e){e&&(e.scrollIntoViewIfNeeded(),e.focus())}),[]);Object(r.useEffect)((function(){var e=h?h.reduce((function(e,t,n){return t.bookmark<t.latest?n:e}),-1):-1;Q(e),$(e)}),[h]),Object(r.useEffect)((function(){if(h){var e=function(e){var t=h.length;switch(e.key){case"ArrowUp":V>0&&e.preventDefault(),$((function(e){return e>0?e-1:0}));break;case"ArrowDown":V<t-1&&e.preventDefault(),$((function(e){return e<t?e+1:t-1}));break;case"Home":$(0);break;case"End":$(t-1)}};return document.addEventListener("keydown",e,!1),function(){document.removeEventListener("keydown",e)}}}),[V,h]);var X=Object(r.useCallback)((function(e){return z(e)>0?{component:"a",href:P(e),target:"_blank"}:{onClick:function(){return A(e)}}}),[A]);return p?(console.log("error =",p),401===p.status&&c(),Object(I.jsxs)("div",{children:["Server(",JSON.stringify(t),") is not working...?"]})):h?Object(I.jsxs)(m.a,{m:2,display:"flex",flexDirection:"column",bgcolor:"background.paper",children:[Object(I.jsx)(U,{item:K,onClose:function(){return A(void 0)}}),Object(I.jsx)(x.a,{position:"sticky",children:Object(I.jsxs)(k.a,{children:[Object(I.jsx)(m.a,{children:Object(I.jsx)(g.a,{label:"\u542bR18",control:Object(I.jsx)(w.a,{checked:l,onChange:function(e){return f(e.target.checked)}})})}),Object(I.jsx)(m.a,{m:2,children:"\u672a\u8aad: ".concat(L," \u4f5c\u54c1.")}),Object(I.jsx)(v.a,{variant:"contained",disabled:q===V,onClick:function(){return $(q)},children:"\u6700\u53e4\u306e\u672a\u8aad\u3078"})]})}),Object(I.jsx)(y.a,{children:null===h||void 0===h?void 0:h.map((function(e,t){return Object(I.jsxs)(C.a,Object(d.a)(Object(d.a)(Object(d.a)({button:!0},t===V?{selected:!0,ref:W}:{}),{},{onFocusVisible:function(){return $(t)}},X(e)),{},{children:[Object(I.jsx)(S.a,{children:Object(I.jsx)(D.a,Object(d.a)(Object(d.a)({overlap:"circle"},H(e)),{},{children:Object(I.jsx)(_.a,{children:Object(I.jsx)(F.a,{color:e.isR18?"secondary":void 0})})}))}),Object(I.jsx)(E.a,{primary:M(e)?"".concat(e.title," (").concat(e.bookmark,"/").concat(e.latest,")"):"".concat(e.title," (").concat(e.latest,")"),secondary:"".concat(e.update_time.toFormat("yyyy/LL/dd HH:mm")," \u66f4\u65b0  \u4f5c\u8005:").concat(e.author_name)})]}),e.base_url)}))})]}):Object(I.jsx)("div",{children:"Loading..."})}function K(e){var t=e.api,n=e.ignoreDuration,c=Object(r.useState)(!1),a=Object(i.a)(c,2),o=a[0],s=a[1];return Object(r.useEffect)((function(){Object(u.c)("/narou/isnoticelist"),Object(u.c)("/r18/isnoticelist")}),[o]),o?Object(I.jsx)(T,{api:t,onLogin:function(){console.log("logged in!"),s(!1)}}):Object(I.jsxs)(m.a,{children:[Object(I.jsx)(J,{server:t,ignoreDuration:n,onUnauthorized:function(){return s(!0)}}),Object(I.jsx)(v.a,{onClick:Object(b.a)(j.a.mark((function e(){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.logout();case 2:s(!0);case 3:case"end":return e.stop()}}),e)}))),children:"logout"})]})}var A=n(74),B=n(140),N=n(139),V=n(33),$=n(141),G=n(142),Z=n(72),q=n(73),Q=function(){function e(t){Object(Z.a)(this,e),this.server=void 0,this.server=t.replace(/\/$/,"")}return Object(q.a)(e,[{key:"fetch",value:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}(function(){var e=Object(b.a)(j.a.mark((function e(t){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",fetch("".concat(this.server).concat(t),{credentials:"include"}));case 1:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}())},{key:"login",value:function(){var e=Object(b.a)(j.a.mark((function e(t,n){var r,c;return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(r=new FormData).append("id",t),r.append("password",n),e.next=5,fetch("".concat(this.server,"/narou/login"),{method:"POST",body:r,credentials:"include"});case 5:return c=e.sent,e.abrupt("return",c);case 7:case"end":return e.stop()}}),e,this)})));return function(t,n){return e.apply(this,arguments)}}()},{key:"logout",value:function(){var e=Object(b.a)(j.a.mark((function e(){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.fetch("/narou/logout");case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"call",value:function(){var e=Object(b.a)(j.a.mark((function e(t){var n;return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.fetch(t);case 2:if((n=e.sent).ok){e.next=5;break}throw n;case 5:return e.abrupt("return",n.json());case 6:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()}]),e}(),W=s.Duration.fromObject({days:30});var X=function(){var e=Object(N.a)("(prefers-color-scheme: dark)"),t=Object(r.useMemo)((function(){return Object(A.a)({palette:{type:e?"dark":"light"}})}),[e]),n=Object(r.useState)(null),c=Object(i.a)(n,2),a=c[0],o=c[1];return Object(r.useEffect)((function(){var e,t=(e=document.location,new URLSearchParams(e.search).get("server")||("http:"===e.protocol?"http://localhost:7676":/.*\.github\.io$/.test(e.hostname)?"":e.protocol+"//"+e.host+e.pathname));o(t?new Q(t):null)}),[]),a?Object(I.jsxs)(B.a,{theme:t,children:[Object(I.jsx)(G.a,{}),Object(I.jsx)(u.a,{value:{refreshInterval:3e5},children:Object(I.jsx)(K,{api:a,ignoreDuration:W})}),Object(I.jsxs)("div",{style:{display:"inline-block",position:"fixed",bottom:0,right:0,fontSize:"small",fontStyle:"italic"},children:["narou-react: ",s.DateTime.fromISO("2021-04-26T14:28:45.263Z").toISO()]})]}):Object(I.jsxs)(B.a,{theme:t,children:[Object(I.jsx)(V.a,{children:"http\u4ee5\u5916\u306e\u5834\u5408\u306f\u5fc5\u305a server \u30af\u30a8\u30ea\u30d1\u30e9\u30e1\u30fc\u30bf\u306b\u30b5\u30fc\u30d0\u30fc\u30a2\u30c9\u30ec\u30b9\u3092\u6307\u5b9a\u3057\u3066\u304f\u3060\u3055\u3044"}),Object(I.jsx)($.a,{href:"https://github.com/koizuka/narou-watcher/",children:"GitHub"})]})},Y=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,152)).then((function(t){var n=t.getCLS,r=t.getFID,c=t.getFCP,a=t.getLCP,o=t.getTTFB;n(e),r(e),c(e),a(e),o(e)}))};o.a.render(Object(I.jsx)(c.a.StrictMode,{children:Object(I.jsx)(X,{})}),document.getElementById("root")),Y()}},[[97,1,2]]]);
//# sourceMappingURL=main.7f50faa1.chunk.js.map