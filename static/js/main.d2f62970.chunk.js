(this["webpackJsonpnarou-react"]=this["webpackJsonpnarou-react"]||[]).push([[0],{104:function(e,t,n){"use strict";n.r(t);var r=n(0),c=n.n(r),a=n(10),o=n.n(a),i=(n(96),n(71)),s=n(72),u=n(79),l=n(80),j=n(19),d=n(42),b=n(33),f=n(32),O=n.n(f),h=n(45),m=n(149),v=n(137),p=n(152),x=n(136),g=n(138),k=n(139),y=n(140),w=n(153),S=n(142),_=n(141),D=n(27),C=n(63);var E=n(73),F=n(151),R=n(133),L=n(134),T=n(135),I=n(147),M=n(6);function P(e){var t=Object(r.useState)(""),n=Object(j.a)(t,2),c=n[0],a=n[1],o=Object(r.useState)(""),i=Object(j.a)(o,2),s=i[0],u=i[1],l=Object(r.useState)(""),d=Object(j.a)(l,2),b=d[0],f=d[1],v=Object(r.useCallback)(Object(h.a)(O.a.mark((function t(){var n,r,a,o,i,u;return O.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:(n=new FormData).append("id",c),n.append("password",s),console.log(n),r=Object(E.a)(n.entries());try{for(r.s();!(a=r.n()).done;)o=a.value,console.log(o[0],o[1])}catch(l){r.e(l)}finally{r.f()}return t.next=8,fetch("".concat(e.server,"/narou/login"),{method:"POST",body:n,credentials:"include"});case 8:if((i=t.sent).ok){t.next=16;break}return t.next=12,i.text();case 12:u=t.sent,f("".concat(i.status," ").concat(i.statusText,"\n").concat(u)),t.next=20;break;case 16:return t.next=18,i.json();case 18:t.sent&&e.onLogin();case 20:case"end":return t.stop()}}),t)}))),[c,s,e]),p=Object(r.useRef)(),g=Object(r.useCallback)((function(){var e;f(""),null===(e=p.current)||void 0===e||e.focus()}),[]);return Object(M.jsxs)(M.Fragment,{children:[Object(M.jsxs)(F.a,{open:""!==b,onClose:function(){return g()},children:[Object(M.jsx)(R.a,{children:"\u30ed\u30b0\u30a4\u30f3\u3067\u304d\u307e\u305b\u3093\u3067\u3057\u305f"}),Object(M.jsx)(L.a,{children:Object(M.jsx)("pre",{children:b})}),Object(M.jsx)(T.a,{children:Object(M.jsx)(x.a,{autoFocus:!0,onClick:function(){return g()},children:"OK"})})]}),Object(M.jsxs)("form",{id:"loginForm",children:[Object(M.jsx)("h2",{children:"\u5c0f\u8aac\u5bb6\u306b\u306a\u308d\u3046\u306e\u30ed\u30b0\u30a4\u30f3\u60c5\u5831"}),Object(M.jsx)(m.a,{children:Object(M.jsx)(I.a,{id:"id",name:"id",label:"ID or email",autoFocus:!0,value:c,onChange:function(e){return a(e.target.value)},onKeyPress:function(e){var t;"Enter"===e.key&&(null===(t=p.current)||void 0===t||t.focus())}})}),Object(M.jsx)(m.a,{children:Object(M.jsx)(I.a,{id:"password",name:"password",label:"password",type:"password",value:s,onChange:function(e){return u(e.target.value)},inputRef:p,onKeyPress:function(e){"Enter"===e.key&&v()}})}),Object(M.jsx)(x.a,{onClick:v,children:"login"})]})]})}function z(e){return e.bookmark>=e.latest?"".concat(e.base_url).concat(e.latest,"/"):"".concat(e.base_url).concat(e.bookmark+1,"/")}function H(e){return e.latest>e.bookmark}function J(e){return Math.max(e.latest-e.bookmark,0)}function K(e){var t=e.server,n=e.ignoreDuration,c=e.onUnauthorized,a=Object(r.useState)(!1),o=Object(j.a)(a,2),i=o[0],s=o[1],u=function(e,t){var n=t.ignoreDuration,c=t.enableR18,a=Object(d.b)(e?"".concat(e,"/narou/isnoticelist"):null,{onErrorRetry:function(e){console.log("onErrorRetry:",e,e.status)}}),o=a.data,i=a.error,s=Object(d.b)(e&&!i&&c?"".concat(e,"/r18/isnoticelist"):null),u=s.data,l=s.error,j=Object(r.useMemo)((function(){if(void 0!==o){var e=b.DateTime.now().minus(n);return[].concat(Object(C.a)(o.map((function(e){return Object(D.a)(Object(D.a)({},e),{},{isR18:!1})}))),Object(C.a)((u||[]).map((function(e){return Object(D.a)(Object(D.a)({},e),{},{isR18:!0})})))).map((function(e){return Object(D.a)(Object(D.a)({},e),{},{update_time:b.DateTime.fromISO(e.update_time)})})).filter((function(t){return t.update_time>e})).sort((function(e,t){return e.update_time>t.update_time?-1:e.update_time<t.update_time?1:0}))}}),[o,u,n]);return{data:i?void 0:j,error:i||l}}(t,{ignoreDuration:n,enableR18:i}),l=u.data,f=u.error,O=Object(r.useMemo)((function(){return null===l||void 0===l?void 0:l.filter((function(e){return e.bookmark<e.latest}))}),[l]),h=Object(r.useMemo)((function(){return O&&O.length>0?O[O.length-1]:void 0}),[O]),E=Object(r.useMemo)((function(){return h?z(h):void 0}),[h]);if(Object(r.useEffect)((function(){document.title="\u306a\u308d\u3046 \u672a\u8aad:".concat(null===O||void 0===O?void 0:O.length)}),[O]),Object(r.useEffect)((function(){if(void 0!==E){var e=function(e){"Enter"===e.key&&window.open(E,"_blank")};return document.addEventListener("keydown",e,!1),function(){document.removeEventListener("keydown",e)}}}),[E]),f)return console.log("error = ".concat(f)),401===f.status&&c(),Object(M.jsxs)("div",{children:["Server(",JSON.stringify(t),") is not working...?"]});if(!l)return Object(M.jsx)("div",{children:"Loading..."});var F=function(e){return!!h&&e.base_url===h.base_url};return Object(M.jsxs)(m.a,{m:2,display:"flex",flexDirection:"column",bgcolor:"background.paper",children:[Object(M.jsx)("p",{children:Object(M.jsx)(v.a,{label:"R18\u3092\u542b\u3081\u308b",control:Object(M.jsx)(p.a,{checked:i,onChange:function(e){return s(e.target.checked)}})})}),Object(M.jsx)("p",{children:"\u672a\u8aad: ".concat(null===O||void 0===O?void 0:O.length," \u4f5c\u54c1.")}),null===l||void 0===l?void 0:l.map((function(e){return Object(M.jsx)(m.a,{width:"100%",children:Object(M.jsx)(x.a,{variant:F(e)?"contained":"outlined",href:z(e),target:"_blank",children:Object(M.jsxs)(g.a,{children:[Object(M.jsx)(k.a,{children:Object(M.jsx)(y.a,{color:"primary",badgeContent:J(e),children:Object(M.jsx)(w.a,{children:Object(M.jsx)(_.a,{color:e.isR18?"secondary":void 0})})})}),Object(M.jsx)(S.a,{primary:H(e)?"".concat(e.title," (").concat(e.bookmark,"/").concat(e.latest,")"):"".concat(e.title," (").concat(e.latest,")"),secondary:"".concat(e.update_time.toFormat("yyyy/LL/dd HH:mm")," \u66f4\u65b0  \u4f5c\u8005:").concat(e.author_name)})]})})},e.base_url)}))]})}function U(e){var t=e.server,n=e.ignoreDuration,c=Object(r.useState)(!1),a=Object(j.a)(c,2),o=a[0],i=a[1];return o?Object(M.jsx)(P,{server:t,onLogin:function(){console.log("logged in!"),i(!1)}}):Object(M.jsxs)(m.a,{children:[Object(M.jsx)(K,{server:t,ignoreDuration:n,onUnauthorized:function(){return i(!0)}}),Object(M.jsx)(x.a,{onClick:Object(h.a)(O.a.mark((function e(){return O.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(t,"/narou/logout"),{credentials:"include"});case 2:i(!0);case 3:case"end":return e.stop()}}),e)}))),children:"logout"})]})}var B=n(78),A=n(144),G=n(143),N=n(28),Z=n(145),$=n(146),q=b.Duration.fromObject({days:30});var Q=function(){var e=Object(G.a)("(prefers-color-scheme: dark)"),t=Object(r.useMemo)((function(){return Object(B.a)({palette:{type:e?"dark":"light"}})}),[e]),n=Object(r.useState)(""),c=Object(j.a)(n,2),a=c[0],o=c[1];return Object(r.useEffect)((function(){var e;o((e=document.location,new URLSearchParams(e.search).get("server")||("http:"===e.protocol?"http://localhost:7676":/.*\.github\.io$/.test(e.hostname)?"":e.protocol+"//"+e.host+e.pathname)))}),[]),""===a?Object(M.jsxs)(A.a,{theme:t,children:[Object(M.jsx)(N.a,{children:"http\u4ee5\u5916\u306e\u5834\u5408\u306f\u5fc5\u305a server \u30af\u30a8\u30ea\u30d1\u30e9\u30e1\u30fc\u30bf\u306b\u30b5\u30fc\u30d0\u30fc\u30a2\u30c9\u30ec\u30b9\u3092\u6307\u5b9a\u3057\u3066\u304f\u3060\u3055\u3044"}),Object(M.jsx)(Z.a,{href:"https://github.com/koizuka/narou-watcher/",children:"GitHub"})]}):Object(M.jsxs)(A.a,{theme:t,children:[Object(M.jsx)($.a,{}),Object(M.jsx)(d.a,{value:{refreshInterval:3e5,fetcher:function(e){return fetch(e,{credentials:"include"}).then((function(e){if(!e.ok){var t=new(function(e){Object(s.a)(n,e);var t=Object(u.a)(n);function n(){var e;Object(i.a)(this,n);for(var r=arguments.length,c=new Array(r),a=0;a<r;a++)c[a]=arguments[a];return(e=t.call.apply(t,[this].concat(c))).status=0,e.name="FetchError",e}return n}(Object(l.a)(Error)))("failed to fetch: status=".concat(e.status));throw t.status=e.status,t}return e.json()}))}},children:Object(M.jsx)(U,{server:a,ignoreDuration:q})}),Object(M.jsxs)("div",{style:{display:"inline-block",position:"fixed",bottom:0,right:0,fontSize:"small",fontStyle:"italic"},children:["narou-react: ",b.DateTime.fromISO("2021-04-16T18:45:55.988Z").toISO()]})]})},V=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,156)).then((function(t){var n=t.getCLS,r=t.getFID,c=t.getFCP,a=t.getLCP,o=t.getTTFB;n(e),r(e),c(e),a(e),o(e)}))};o.a.render(Object(M.jsx)(c.a.StrictMode,{children:Object(M.jsx)(Q,{})}),document.getElementById("root")),V()},96:function(e,t,n){}},[[104,1,2]]]);
//# sourceMappingURL=main.d2f62970.chunk.js.map