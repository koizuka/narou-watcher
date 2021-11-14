var ie=Object.defineProperty,de=Object.defineProperties;var me=Object.getOwnPropertyDescriptors;var j=Object.getOwnPropertySymbols;var fe=Object.prototype.hasOwnProperty,pe=Object.prototype.propertyIsEnumerable;var U=(e,t,r)=>t in e?ie(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,k=(e,t)=>{for(var r in t||(t={}))fe.call(t,r)&&U(e,r,t[r]);if(j)for(var r of j(t))pe.call(t,r)&&U(e,r,t[r]);return e},y=(e,t)=>de(e,me(t));import{r as u,u as z,R as s,S as ke,M as H,a as Ee,Z as R,H as V,D as he,b as W,c as G,d as F,e as q,B as C,C as ge,f as be,g as ye,h as ve,i as w,T as X,j as xe,L as I,m as Ce,k as we,s as Be,l as Ae,n as Re,A as _e,o as Fe,F as Ie,p as $e,q as De,t as Se,v as Le,w as Me,x as Ne,y as Ke,z as Oe,E as Pe,I as Te,G as je,J as Ue,K as ze,N as J,O as Q,P as He,Q as Ve,X as We,U as Ge,V as qe}from"./vendor.2d2c1ca1.js";const Xe=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function r(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerpolicy&&(a.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?a.credentials="include":o.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(o){if(o.ep)return;o.ep=!0;const a=r(o);fetch(o.href,a)}};Xe();class Je extends Error{constructor(t,r){super(r);this.status=t,this.name="ApiError"}}class v{constructor(t){this.server=t.replace(/\/$/,"")}get baseUrl(){return this.server}async fetch(t){return fetch(`${this.server}${t}`,{credentials:"include"})}async login(t,r){const n=new FormData;return n.append("id",t),n.append("password",r),await fetch(`${this.server}/narou/login`,{method:"POST",body:n,credentials:"include"})}async logout(){await this.fetch("/narou/logout")}async call(t){const r=await this.fetch(t);if(!r.ok)throw new Je(r.status,await r.text());return r.json()}static isnoticelist({maxPage:t=1}){return console.log("NarouApi.isnoticelist"),`/narou/isnoticelist?max_page=${t}`}static isnoticelistR18({maxPage:t=1}){return`/r18/isnoticelist?max_page=${t}`}static bookmarks(){return"/narou/bookmarks/"}static bookmarksR18(){return"/r18/bookmarks/"}static bookmark(t,{order:r}){return`/narou/bookmarks/${t}?order=${r}`}static bookmarkR18(t,{order:r}){return`/r18/bookmarks/${t}?order=${r}`}static novelInfo(t){return`/narou/novels/${t}`}static novelInfoR18(t){return`/r18/novels/${t}`}}function Qe(e){const t=Ee();return z(t.breakpoints.up(e))}function Ze({bookmarks:e,bookmark:t,onChangeBookmark:r}){const[n,o]=u.exports.useState(!1),a=Qe("sm");return s.createElement(ke,{disableUnderline:!0,variant:"standard",open:n,onOpen:()=>o(!0),onClose:()=>o(!1),value:t,onChange:l=>r(Number(l.target.value))},s.createElement(H,{key:0,value:0},n||a?"\u30D6\u30C3\u30AF\u30DE\u30FC\u30AF\u306A\u3057":"BM-"),e&&Object.keys(e).map(l=>s.createElement(H,{key:l,value:l},n||a?e[Number(l)].name:`BM${t}`)))}function Z(e){return e.latest>e.bookmark}function Y(e){return Z(e)?`${e.base_url}${e.bookmark+1}/`:`${e.base_url}${e.latest}/`}function Ye(e){const t=[e.title," ("];return Z(e)&&t.push(`${e.bookmark}/`),t.push(`${e.latest})`),e.completed&&t.push("[\u5B8C\u7D50]"),t.join("")}function ee(e){return Math.max(e.latest-e.bookmark,0)}function te(e,t){const{data:r,error:n}=R(e?t?v.bookmarksR18():v.bookmarks():null,async a=>e?e.call(a):[]);return{data:u.exports.useMemo(()=>{if(r)return r.reduce((a,l)=>(a[l.no]={name:l.name,num_items:l.num_items},a),{})},[r]),error:n}}function $(){V("/narou/isnoticelist"),V("/r18/isnoticelist")}function et(e,{enableR18:t,maxPage:r=1,bookmark:n=0}){const{data:o,error:a}=R(v.isnoticelist({maxPage:r}),async m=>e.call(m),{onErrorRetry:m=>{console.log(`onErrorRetry: ${m.status}: ${m}`)}}),l="new",{data:d,error:E}=R(!a&&n?v.bookmark(n,{order:l}):null,async m=>e.call(m)),{data:g,error:i}=R(!a&&t?v.isnoticelistR18({maxPage:r}):null,async m=>e.call(m)),p=u.exports.useMemo(()=>{if(o&&d){const m=new Set(o.map(b=>b.base_url)),f=d.filter(b=>b.is_notice&&!m.has(b.base_url));if(f.length>0)return[...o,...f]}return o},[o,d]),h=u.exports.useMemo(()=>p===void 0?void 0:[...p.map(f=>y(k({},f),{isR18:!1})),...(g||[]).map(f=>y(k({},f),{isR18:!0}))].map(f=>y(k({},f),{update_time:he.fromISO(f.update_time)})),[p,g]);return{data:a?void 0:h,error:a||i||E}}function tt(e){const[t,r]=u.exports.useState(""),[n,o]=u.exports.useState(""),[a,l]=u.exports.useState(""),d=u.exports.useCallback(async()=>{const i=await e.api.login(t,n);if(i.ok)e.onLogin();else{const p=await i.text();l(`${i.status} ${i.statusText}
${p}`)}},[t,n,e]),E=u.exports.useRef(),g=u.exports.useCallback(()=>{var i;l(""),(i=E.current)==null||i.focus()},[]);return React.createElement(React.Fragment,null,React.createElement(W,{open:a!=="",onClose:()=>g()},React.createElement(G,null,"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F"),React.createElement(F,null,React.createElement("pre",null,a)),React.createElement(q,null,React.createElement(C,{autoFocus:!0,onClick:()=>g()},"OK"))),React.createElement(ge,{maxWidth:"sm"},React.createElement(be,{raised:!0},React.createElement(ye,{title:"\u5C0F\u8AAC\u5BB6\u306B\u306A\u308D\u3046\u306E\u30ED\u30B0\u30A4\u30F3\u60C5\u5831","data-testid":"login-page"}),React.createElement(ve,null,React.createElement(w,{display:"flex",flexDirection:"column",justifyContent:"center"},React.createElement(X,{id:"id",name:"id",label:"ID or email",autoFocus:!0,value:t,onChange:i=>r(i.target.value),onKeyPress:i=>{var p;i.key==="Enter"&&((p=E.current)==null||p.focus())},"data-testid":"id"}),React.createElement(X,{id:"password",name:"password",label:"password",type:"password",value:n,onChange:i=>o(i.target.value),inputRef:E,onKeyPress:i=>{i.key==="Enter"&&d()},"data-testid":"password"}))),React.createElement(xe,{style:{justifyContent:"center"}},React.createElement(C,{variant:"contained",onClick:d,"data-testid":"login"},"login")))))}function rt(e){if(!e)return null;const t=e.match(/https:\/\/([0-9a-zA-Z.]+)\/([0-9a-z]+)\/?/);if(!t)return console.warn(`base_url is invalid: ${e}`),null;const[,r,n]=t;return{host:r,ncode:n}}function nt(e,t){const r=u.exports.useMemo(()=>rt(t),[t]),n=u.exports.useMemo(()=>{if(!r)return null;switch(r.host){case"ncode.syosetu.com":return v.novelInfo(r.ncode);case"novel18.syosetu.com":return v.novelInfoR18(r.ncode);default:return console.warn(`unknown host: ${r.host}`),null}},[r]),{data:o,error:a}=R(n,async l=>e.call(l));return{data:o,error:a}}function ot({api:e,item:t,onClose:r}){const{data:n}=nt(e,t==null?void 0:t.base_url),{data:o}=te((n==null?void 0:n.bookmark_no)?e:null,(t==null?void 0:t.isR18)||!1),a=u.exports.useMemo(()=>{console.log("novelInfo:",n),console.log("bookmarkInfo:",o);const l=n==null?void 0:n.bookmark_no;if(o&&l&&(n==null?void 0:n.bookmark_url))return{no:l,name:o[l].name,url:n.bookmark_url}},[n,o]);return s.createElement(W,{open:!!t,onClose:r},s.createElement(G,null,t==null?void 0:t.title),s.createElement(F,null,"\u4F5C\u8005:",s.createElement(I,{href:n==null?void 0:n.author_url,target:"_blank"},t==null?void 0:t.author_name)),a&&s.createElement(F,null,"\u30D6\u30C3\u30AF\u30DE\u30FC\u30AF:",s.createElement(I,{href:a.url,target:"_blank"},a.name)),s.createElement(q,null,s.createElement(C,{size:"small",variant:"contained",onClick:()=>{t&&window.open(t.base_url,"_blank"),r()}},"\u5C0F\u8AAC\u30DA\u30FC\u30B8"),s.createElement(C,{size:"small",variant:"contained",onClick:()=>{t&&window.open(Y(t),"_blank"),r()}},"\u6700\u65B0",t==null?void 0:t.latest,"\u90E8\u5206"),s.createElement(C,{size:"small",variant:"contained",onClick:()=>r()},"\u30AD\u30E3\u30F3\u30BB\u30EB")))}const re={numNewItems:null,selectedIndex:-1,defaultIndex:-1};function at(e,t){switch(t.type){case"set":{if(!t.items)return re;const r=t.items.sort((a,l)=>lt(a,l,d=>ut(d),a.bookmark<a.latest?d=>d.update_time:st(d=>d.update_time),d=>d.base_url)).slice(0,30),n=r[0],o=n&&n.bookmark<n.latest?0:-1;return y(k({},e),{items:r,numNewItems:r.filter(a=>a.bookmark<a.latest).length,selectedIndex:o,defaultIndex:o})}case"select":return y(k({},e),{selectedIndex:e.items?Math.max(Math.min(t.index,e.items.length-1),-1):-1})}}function ne(e,t,r){const n=r(e),o=r(t);return n<o?-1:n>o?1:0}function st(e){return{f:e}}function lt(e,t,...r){for(const n of r){let o;if(typeof n=="object"?o=ne(t,e,n.f):o=ne(e,t,n),o)return o}return 0}const ut=e=>e.bookmark===e.latest?Number.MAX_SAFE_INTEGER:e.bookmark>e.latest?Number.MAX_SAFE_INTEGER-1:e.latest-e.bookmark;function ct(){return"setAppBadge"in navigator&&"clearAppBadge"in navigator?{setAppBadge:e=>navigator.setAppBadge(e),clearAppBadge:()=>navigator.clearAppBadge()}:{setAppBadge:()=>Promise.resolve(),clearAppBadge:()=>Promise.resolve()}}function it(){return"setClientBadge"in navigator&&"clearClientBadge"in navigator?{setClientBadge:e=>navigator.setClientBadge(e),clearClientBadge:()=>navigator.clearClientBadge()}:{setClientBadge:()=>Promise.resolve(),clearClientBadge:()=>Promise.resolve()}}function oe(e){return[e.shiftKey?"shift":void 0,e.ctrlKey?"ctrl":void 0,e.altKey?"alt":void 0,e.metaKey?"meta":void 0,e.key].filter(t=>t!==void 0).join("+")}function dt(e){const[t,...r]=e==="+"?["+"]:e.endsWith("++")?["+",...e.slice(0,-2).split("+").reverse()]:e.split("+").reverse(),n=["shift","ctrl","alt","meta"];if(r.some(a=>!n.includes(a)))throw new Error(`HotKey(${e}): unknown modifiers: ${r.filter(a=>!n.includes(a))}`);const o=oe({key:t,shiftKey:r.some(a=>a==="shift"),ctrlKey:r.some(a=>a==="ctrl"),altKey:r.some(a=>a==="alt"),metaKey:r.some(a=>a==="meta")});if(o!==e)throw new Error(`HotKey(${e}): invalid order: must be ${o} `)}function mt(){const[e,t]=u.exports.useState({});return u.exports.useEffect(()=>{const r=Object.keys(e);if(r.length>0){r.forEach(o=>dt(o));const n=o=>{const a=e[oe(o)];a&&a(o)};return document.addEventListener("keydown",n,!1),()=>{document.removeEventListener("keydown",n)}}},[e]),[t]}const ae="https://syosetu.com/user/top/",ft=Ce(e=>we({backdrop:{zIndex:e.zIndex.drawer+1,color:"#fff"}}));function pt(e){return e.latest<e.bookmark?{color:"secondary",badgeContent:"!"}:{color:"primary",badgeContent:ee(e)}}function D(e){return e?2:1}function kt(e,t){const r=Object.keys(e).map(n=>Number(n));for(const n of r)if(n>t)return n;return 0}function Et(e,t){const r=[0,...Object.keys(e).map(o=>Number(o))],n=r.findIndex(o=>o>=t);return n>0?r[n-1]:r[r.length-1]}function ht({server:e,onUnauthorized:t}){const r=ft(),[n,o]=u.exports.useState(!1),[a,l]=u.exports.useState(D(!1)),[d,E]=u.exports.useState(0),{data:g,error:i}=et(e,{enableR18:n,maxPage:a,bookmark:d}),{data:p}=te(e,!1),[{items:h,numNewItems:m,selectedIndex:f,defaultIndex:b},_]=u.exports.useReducer(at,re);u.exports.useEffect(()=>{_({type:"set",items:g})},[g]);const B=c=>_({type:"select",index:c}),[le,S]=u.exports.useState(void 0),{setAppBadge:L,clearAppBadge:M}=ct(),{setClientBadge:N,clearClientBadge:K}=it();u.exports.useEffect(()=>{m!==null&&(document.title=`\u306A\u308D\u3046 \u672A\u8AAD:${m}`,m?(L(m),N(m)):(M(),K()))},[M,K,m,L,N]);const ue=u.exports.useCallback(c=>{c&&(Be(c,{behavior:"smooth",scrollMode:"if-needed"}),c.focus())},[]),O=u.exports.useRef(null);u.exports.useEffect(()=>{var c;f===-1&&((c=O.current)==null||c.focus())},[f]);const[P]=mt();u.exports.useEffect(()=>{if(h){const c=h.length,A=x=>{x.preventDefault(),_({type:"select",index:f-1})},T=x=>{x.preventDefault(),_({type:"select",index:f+1})};P(k(y(k(k(k({},f>0&&{ArrowUp:A,k:A}),f<c-1&&{ArrowDown:T,j:T}),c>0&&{Home:()=>B(0),End:()=>B(c-1),Escape:()=>B(b)}),{r:()=>o(x=>!x),"1":()=>l(x=>D(x===D(!1))),h:()=>window.open(ae,"_blank")}),p&&{b:()=>E(kt(p,d)),"shift+B":()=>E(Et(p,d))}))}},[f,b,h,p,d,P]);const ce=u.exports.useCallback(c=>ee(c)>0?{component:"a",href:Y(c),onClick:()=>B(-1),target:"_blank"}:{disabled:!0},[]);return i?(console.log(`error = ${i}`),i.status===401&&t(),s.createElement("div",{onClick:()=>window.location.reload()},s.createElement("p",null,"Server(",JSON.stringify(e.baseUrl),") is not working...?"),s.createElement("p",null,"status: ",i.status),s.createElement("code",null,i.message))):h?s.createElement(s.Fragment,null,s.createElement(ot,{api:e,item:le,onClose:()=>S(void 0)}),s.createElement(_e,{position:"sticky"},s.createElement(Fe,null,s.createElement(w,null,s.createElement(Ie,{label:"R18",control:s.createElement($e,{checked:n,onChange:c=>o(c.target.checked)})})),s.createElement(w,null,s.createElement(Ze,{bookmarks:p,bookmark:d,onChangeBookmark:E})),s.createElement(w,{m:2},"\u672A\u8AAD: ",m!=null?m:""),s.createElement(C,{variant:"contained",disabled:f===0,disableRipple:!0,ref:O,onClick:()=>B(b)},"ESC"))),s.createElement(w,{m:2,display:"flex",alignItems:"center",flexDirection:"column",bgcolor:"background.paper"},s.createElement(w,{maxWidth:600},s.createElement(De,null,h==null?void 0:h.map((c,A)=>s.createElement(Se,k(y(k({key:c.base_url,button:!0},A===f?{selected:!0,ref:ue}:{}),{disableRipple:!0,onFocusVisible:()=>B(A)}),ce(c)),s.createElement(Le,null,s.createElement(Me,k({overlap:"circular"},pt(c)),s.createElement(Ne,null,s.createElement(Ke,{color:c.isR18?"secondary":void 0})))),s.createElement(Oe,{primary:Ye(c),secondary:`${c.update_time.toFormat("yyyy/LL/dd HH:mm")} \u66F4\u65B0  \u4F5C\u8005:${c.author_name}`}),s.createElement(Pe,null,s.createElement(Te,{edge:"end",onClick:()=>S(c),disableRipple:!0,size:"large"},s.createElement(je,null))))))),s.createElement(w,{position:"fixed",right:"20px",bottom:"20px"},s.createElement(Ue,{variant:"extended",size:"small",disableRipple:!0,component:"a",href:ae,target:"_blank"},"\u30E6\u30FC\u30B6\u30FC\u30DB\u30FC\u30E0")))):s.createElement(Ae,{className:r.backdrop,open:!0},s.createElement(Re,{color:"inherit"}))}function gt({api:e}){const[t,r]=u.exports.useState(!1),n=u.exports.useCallback(()=>{setTimeout(()=>{$(),r(!0)},0)},[]);return t?s.createElement(tt,{api:e,onLogin:()=>{console.log("logged in!"),$(),r(!1)}}):s.createElement(s.Fragment,null,s.createElement(ht,{server:e,onUnauthorized:n}),s.createElement(C,{onClick:async()=>{await e.logout(),$(),r(!0)}},"logout"))}const bt=5*60*1e3;function yt(e){const t=new URLSearchParams(e.search).get("server");return t||(e.protocol==="http:"?"http://localhost:7676":/.*\.github\.io$/.test(e.hostname)?"":e.protocol+"//"+e.host+e.pathname)}function vt(){const e=z("(prefers-color-scheme: dark)"),t=u.exports.useMemo(()=>ze({palette:{mode:e?"dark":"light",primary:Ge}}),[e]),[r,n]=u.exports.useState(null),[o,a]=u.exports.useState(!1);return u.exports.useEffect(()=>{const l=yt(document.location);l?n(new v(l)):a(!0)},[]),o?s.createElement(J,{injectFirst:!0},s.createElement(Q,{theme:t},s.createElement(He,null,"http\u4EE5\u5916\u306E\u5834\u5408\u306F\u5FC5\u305A server \u30AF\u30A8\u30EA\u30D1\u30E9\u30E1\u30FC\u30BF\u306B\u30B5\u30FC\u30D0\u30FC\u30A2\u30C9\u30EC\u30B9\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044"),s.createElement(I,{href:"https://github.com/koizuka/narou-watcher/"},"GitHub"))):s.createElement(J,{injectFirst:!0},s.createElement(Q,{theme:t},s.createElement(Ve,null),s.createElement(We,{value:{refreshInterval:bt}},r&&s.createElement(gt,{api:r})),s.createElement("div",{style:{display:"inline-block",position:"fixed",bottom:0,right:0,fontSize:"small",fontStyle:"italic"}},"narou-react: ","2021-11-14T09:43:00.857+00:00")))}const xt="modulepreload",se={},Ct="/",wt=function(t,r){return!r||r.length===0?t():Promise.all(r.map(n=>{if(n=`${Ct}${n}`,n in se)return;se[n]=!0;const o=n.endsWith(".css"),a=o?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${n}"]${a}`))return;const l=document.createElement("link");if(l.rel=o?"stylesheet":xt,o||(l.as="script",l.crossOrigin=""),l.href=n,document.head.appendChild(l),o)return new Promise((d,E)=>{l.addEventListener("load",d),l.addEventListener("error",E)})})).then(()=>t())},Bt=e=>{e&&e instanceof Function&&wt(()=>import("./web-vitals.8eea515e.js"),[]).then(({getCLS:t,getFID:r,getFCP:n,getLCP:o,getTTFB:a})=>{t(e),r(e),n(e),o(e),a(e)})};qe.render(s.createElement(s.StrictMode,null,s.createElement(vt,null)),document.getElementById("root"));Bt();
