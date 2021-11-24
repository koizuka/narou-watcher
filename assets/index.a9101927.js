var ue=Object.defineProperty,ce=Object.defineProperties;var ie=Object.getOwnPropertyDescriptors;var O=Object.getOwnPropertySymbols;var de=Object.prototype.hasOwnProperty,me=Object.prototype.propertyIsEnumerable;var P=(e,t,r)=>t in e?ue(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,m=(e,t)=>{for(var r in t||(t={}))de.call(t,r)&&P(e,r,t[r]);if(O)for(var r of O(t))me.call(t,r)&&P(e,r,t[r]);return e},h=(e,t)=>ce(e,ie(t));import{r as u,R as o,D as T,H as j,Z as B,u as z,S as fe,M as U,a as pe,b as H,c as W,d as w,e as V,B as v,C as ke,f as Ee,g as he,h as ge,i as x,T as G,j as be,s as ye,k as q,l as X,L as ve,m as xe,n as Ce,o as Be,A as we,p as Ae,q as _e,t as Fe,I as Ie,v as $e,w as A,x as Re,y as De,F as Se,z as Le,E as Me,G as Ke,J as Ne,K as J,N as Q,O as Oe,P as Pe,X as Te,Q as je}from"./vendor.d2d20e10.js";const ze=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function r(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerpolicy&&(a.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?a.credentials="include":s.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=r(s);fetch(s.href,a)}};ze();class Ue extends Error{constructor(t,r){super(r);this.status=t,this.name="ApiError"}}class y{constructor(t){this.server=t.replace(/\/$/,"")}get baseUrl(){return this.server}async fetch(t){return fetch(`${this.server}${t}`,{credentials:"include"})}async login(t,r){const n=new FormData;return n.append("id",t),n.append("password",r),await fetch(`${this.server}/narou/login`,{method:"POST",body:n,credentials:"include"})}async logout(){await this.fetch("/narou/logout")}async call(t){const r=await this.fetch(t);if(!r.ok)throw new Ue(r.status,await r.text());return r.json()}static isnoticelist({maxPage:t=1}){return`/narou/isnoticelist?max_page=${t}`}static isnoticelistR18({maxPage:t=1}){return`/r18/isnoticelist?max_page=${t}`}static bookmarks(){return"/narou/bookmarks/"}static bookmarksR18(){return"/r18/bookmarks/"}static bookmark(t,{order:r}){return`/narou/bookmarks/${t}?order=${r}`}static bookmarkR18(t,{order:r}){return`/r18/bookmarks/${t}?order=${r}`}static novelInfo(t){return`/narou/novels/${t}`}static novelInfoR18(t){return`/r18/novels/${t}`}}function He(e){const t=new URLSearchParams(e.search).get("server");return t||(e.protocol==="http:"?"http://localhost:7676":/.*\.github\.io$/.test(e.hostname)?"":e.protocol+"//"+e.host+e.pathname)}function We(){const[e,t]=u.exports.useState(null),[r,n]=u.exports.useState(!1);return u.exports.useEffect(()=>{const s=He(document.location);s?t(new y(s)):n(!0)},[]),[e,r]}function Ve(e){return o.createElement("div",{style:{display:"inline-block",position:"fixed",bottom:0,right:0,fontSize:"small",fontStyle:"italic"}},e.name,": ",T.fromISO("2021-11-24T14:25:26.112+00:00").toISO())}function Ge(){return"setAppBadge"in navigator&&"clearAppBadge"in navigator?{setAppBadge:e=>navigator.setAppBadge(e),clearAppBadge:()=>navigator.clearAppBadge()}:{setAppBadge:()=>Promise.resolve(),clearAppBadge:()=>Promise.resolve()}}function qe(){return"setClientBadge"in navigator&&"clearClientBadge"in navigator?{setClientBadge:e=>navigator.setClientBadge(e),clearClientBadge:()=>navigator.clearClientBadge()}:{setClientBadge:()=>Promise.resolve(),clearClientBadge:()=>Promise.resolve()}}function Z(e){return[e.shiftKey?"shift":void 0,e.ctrlKey?"ctrl":void 0,e.altKey?"alt":void 0,e.metaKey?"meta":void 0,e.key].filter(t=>t!==void 0).join("+")}function Xe(e){const[t,...r]=e==="+"?["+"]:e.endsWith("++")?["+",...e.slice(0,-2).split("+").reverse()]:e.split("+").reverse(),n=["shift","ctrl","alt","meta"];if(r.some(a=>!n.includes(a)))throw new Error(`HotKey(${e}): unknown modifiers: ${r.filter(a=>!n.includes(a))}`);const s=Z({key:t,shiftKey:r.some(a=>a==="shift"),ctrlKey:r.some(a=>a==="ctrl"),altKey:r.some(a=>a==="alt"),metaKey:r.some(a=>a==="meta")});if(s!==e)throw new Error(`HotKey(${e}): invalid order: must be ${s} `)}function _(){const[e,t]=u.exports.useState({});return u.exports.useEffect(()=>{const r=Object.keys(e);if(r.length>0){r.forEach(s=>Xe(s));const n=s=>{const a=e[Z(s)];a&&a(s)};return document.addEventListener("keydown",n,!1),()=>{document.removeEventListener("keydown",n)}}},[e]),[t]}function F(){j("/narou/isnoticelist"),j("/r18/isnoticelist")}function Je(e,{enableR18:t,maxPage:r=1,bookmark:n=0}){const{data:s,error:a}=B(y.isnoticelist({maxPage:r}),async f=>e.call(f),{onErrorRetry:f=>{console.log(`onErrorRetry: ${f.status}: ${f}`)}}),l="new",{data:d,error:c}=B(!a&&n?y.bookmark(n,{order:l}):null,async f=>e.call(f)),{data:k,error:i}=B(!a&&t?y.isnoticelistR18({maxPage:r}):null,async f=>e.call(f)),p=u.exports.useMemo(()=>{if(s&&d){const f=new Set(s.map(C=>C.base_url)),E=d.filter(C=>C.is_notice&&!f.has(C.base_url));if(E.length>0)return[...s,...E]}return s},[s,d]),b=u.exports.useMemo(()=>p===void 0?void 0:[...p.map(E=>h(m({},E),{isR18:!1})),...(k||[]).map(E=>h(m({},E),{isR18:!0}))].map(E=>h(m({},E),{update_time:T.fromISO(E.update_time)})),[p,k]);return{data:a?void 0:b,error:a||i||c}}const Y={numNewItems:null,selectedIndex:-1,defaultIndex:-1};function Qe(e,t){switch(t.type){case"set":{if(!t.items)return Y;const r=t.items.sort((a,l)=>Ye(a,l,d=>et(d),a.bookmark<a.latest?d=>d.update_time:Ze(d=>d.update_time),d=>d.base_url)).slice(0,30),n=r[0],s=n&&n.bookmark<n.latest?0:-1;return h(m({},e),{items:r,numNewItems:r.filter(a=>a.bookmark<a.latest).length,selectedIndex:s,defaultIndex:s})}case"select":return h(m({},e),{selectedIndex:e.items?Math.max(Math.min(t.index,e.items.length-1),-1):-1});case"default":return h(m({},e),{selectedIndex:e.defaultIndex})}}function ee(e,t,r){const n=r(e),s=r(t);return n<s?-1:n>s?1:0}function Ze(e){return{f:e}}function Ye(e,t,...r){for(const n of r){let s;if(typeof n=="object"?s=ee(t,e,n.f):s=ee(e,t,n),s)return s}return 0}const et=e=>e.bookmark===e.latest?Number.MAX_SAFE_INTEGER:e.bookmark>e.latest?Number.MAX_SAFE_INTEGER-1:e.latest-e.bookmark;function tt(e){const t=pe();return z(t.breakpoints.up(e))}function rt({bookmarks:e,bookmark:t,onChangeBookmark:r}){const[n,s]=u.exports.useState(!1),a=tt("sm");return o.createElement(fe,{disableUnderline:!0,variant:"standard",open:n,onOpen:()=>s(!0),onClose:()=>s(!1),value:t,onChange:l=>r(Number(l.target.value))},o.createElement(U,{key:0,value:0},n||a?"\u30D6\u30C3\u30AF\u30DE\u30FC\u30AF\u306A\u3057":"BM-"),e&&Object.keys(e).map(l=>o.createElement(U,{key:l,value:l},n||a?e[Number(l)].name:`BM${t}`)))}function nt(e){const[t,r]=u.exports.useState(""),[n,s]=u.exports.useState(""),[a,l]=u.exports.useState(""),d=u.exports.useCallback(async()=>{const i=await e.api.login(t,n);if(i.ok)e.onLogin();else{const p=await i.text();l(`${i.status} ${i.statusText}
${p}`)}},[t,n,e]),c=u.exports.useRef(),k=u.exports.useCallback(()=>{var i;l(""),(i=c.current)==null||i.focus()},[]);return o.createElement(o.Fragment,null,o.createElement(H,{open:a!=="",onClose:()=>k()},o.createElement(W,null,"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F"),o.createElement(w,null,o.createElement("pre",null,a)),o.createElement(V,null,o.createElement(v,{autoFocus:!0,onClick:()=>k()},"OK"))),o.createElement(ke,{maxWidth:"sm"},o.createElement(Ee,{raised:!0},o.createElement(he,{title:"\u5C0F\u8AAC\u5BB6\u306B\u306A\u308D\u3046\u306E\u30ED\u30B0\u30A4\u30F3\u60C5\u5831","data-testid":"login-page"}),o.createElement(ge,null,o.createElement(x,{display:"flex",flexDirection:"column",justifyContent:"center"},o.createElement(G,{id:"id",name:"id",label:"ID or email",autoFocus:!0,value:t,onChange:i=>r(i.target.value),onKeyPress:i=>{var p;i.key==="Enter"&&((p=c.current)==null||p.focus())},"data-testid":"id"}),o.createElement(G,{id:"password",name:"password",label:"password",type:"password",value:n,onChange:i=>s(i.target.value),inputRef:c,onKeyPress:i=>{i.key==="Enter"&&d()},"data-testid":"password"}))),o.createElement(be,{style:{justifyContent:"center"}},o.createElement(v,{variant:"contained",onClick:d,"data-testid":"login"},"login")))))}function te(e){return e.latest>e.bookmark}function re(e){return te(e)?`${e.base_url}${e.bookmark+1}/`:`${e.base_url}${e.latest}/`}function ot(e){const t=[e.title," ("];return te(e)&&t.push(`${e.bookmark}/`),t.push(`${e.latest})`),e.completed&&t.push("[\u5B8C\u7D50]"),t.join("")}function ne(e){return Math.max(e.latest-e.bookmark,0)}function st(e){return e.latest<e.bookmark?{color:"secondary",badgeContent:"!"}:{color:"primary",badgeContent:ne(e)}}function at({items:e,selectedIndex:t,setSelectedIndex:r,selectDefault:n,onSecondaryAction:s}){const a=u.exports.useCallback(c=>{c&&(ye(c,{behavior:"smooth",scrollMode:"if-needed"}),c.focus())},[]),[l]=_();u.exports.useEffect(()=>{if(e){const c=e.length,k=p=>{p.preventDefault(),r(t-1)},i=p=>{p.preventDefault(),r(t+1)};l(m(m(m({},t>0&&{ArrowUp:k,k}),t<c-1&&{ArrowDown:i,j:i}),c>0&&{Home:()=>r(0),End:()=>r(c-1),Escape:()=>n(),i:()=>s(e[t])}))}else l({})},[e,s,n,t,l,r]);const d=u.exports.useCallback(c=>ne(c)>0?{component:"a",href:re(c),onClick:()=>n(),target:"_blank",tabIndex:0}:{disabled:!0},[n]);return e?o.createElement(ve,null,e==null?void 0:e.map((c,k)=>o.createElement(xe,m(h(m({key:c.base_url},k===t?{selected:!0,ref:a}:{}),{disableRipple:!0,onFocusVisible:()=>r(k)}),d(c)),o.createElement(Ce,null,o.createElement(Be,m({overlap:"circular"},st(c)),o.createElement(we,null,o.createElement(Ae,{color:c.isR18?"secondary":void 0})))),o.createElement(_e,{primary:ot(c),secondary:`${c.update_time.toFormat("yyyy/LL/dd HH:mm")} \u66F4\u65B0  \u4F5C\u8005:${c.author_name}`}),o.createElement(Fe,null,o.createElement(Ie,{edge:"end",onClick:i=>{i.preventDefault(),s(c)},disableRipple:!0,size:"large",tabIndex:-1},o.createElement($e,null)))))):o.createElement(q,{sx:{color:"#fff",zIndex:c=>c.zIndex.drawer+1},open:!0},o.createElement(X,{color:"inherit"}))}function oe(e,t){const{data:r,error:n}=B(e?t?y.bookmarksR18():y.bookmarks():null,async a=>e?e.call(a):[]);return{data:u.exports.useMemo(()=>{if(r)return r.reduce((a,l)=>(a[l.no]={name:l.name,num_items:l.num_items},a),{})},[r]),error:n}}function lt(e){if(!e)return null;const t=e.match(/https:\/\/([0-9a-zA-Z.]+)\/([0-9a-z]+)\/?/);if(!t)return console.warn(`base_url is invalid: ${e}`),null;const[,r,n]=t;return{host:r,ncode:n}}function ut(e,t){const r=u.exports.useMemo(()=>lt(t),[t]),n=u.exports.useMemo(()=>{if(!r)return null;switch(r.host){case"ncode.syosetu.com":return y.novelInfo(r.ncode);case"novel18.syosetu.com":return y.novelInfoR18(r.ncode);default:return console.warn(`unknown host: ${r.host}`),null}},[r]),{data:s,error:a}=B(n,async l=>e.call(l));return{data:s,error:a}}function ct({api:e,item:t,onClose:r}){const{data:n}=ut(e,t==null?void 0:t.base_url),{data:s}=oe((n==null?void 0:n.bookmark_no)?e:null,(t==null?void 0:t.isR18)||!1),a=u.exports.useMemo(()=>{console.log("novelInfo:",n),console.log("bookmarkInfo:",s);const l=n==null?void 0:n.bookmark_no;if(s&&l&&(n==null?void 0:n.bookmark_url))return{no:l,name:s[l].name,url:n.bookmark_url}},[n,s]);return o.createElement(H,{open:!!t,onClose:r},o.createElement(W,null,t==null?void 0:t.title),o.createElement(w,null,"\u4F5C\u8005:",o.createElement(A,{href:n==null?void 0:n.author_url,target:"_blank"},t==null?void 0:t.author_name)),a&&o.createElement(w,null,"\u30D6\u30C3\u30AF\u30DE\u30FC\u30AF:",o.createElement(A,{href:a.url,target:"_blank"},a.name)),o.createElement(V,null,o.createElement(v,{size:"small",variant:"contained",onClick:()=>{t&&window.open(t.base_url,"_blank"),r()}},"\u5C0F\u8AAC\u30DA\u30FC\u30B8"),o.createElement(v,{size:"small",variant:"contained",onClick:()=>{t&&window.open(re(t),"_blank"),r()}},"\u6700\u65B0",t==null?void 0:t.latest,"\u90E8\u5206"),o.createElement(v,{size:"small",variant:"contained",onClick:()=>r()},"\u30AD\u30E3\u30F3\u30BB\u30EB")))}const it={bookmarks:void 0,selected:0};function dt(e,t){const r=Object.keys(e).map(n=>Number(n));for(const n of r)if(n>t)return n;return 0}function mt(e,t){const r=[0,...Object.keys(e).map(s=>Number(s))],n=r.findIndex(s=>s>=t);return n>0?r[n-1]:r[r.length-1]}function ft(e,t){switch(t.type){case"set":return h(m({},e),{bookmarks:t.bookmarks,selected:0});case"select":return e.bookmarks&&t.selected.toString()in e.bookmarks?h(m({},e),{selected:t.selected}):h(m({},e),{selected:0});case"next":return h(m({},e),{selected:e.bookmarks?dt(e.bookmarks,e.selected):0});case"prev":return h(m({},e),{selected:e.bookmarks?mt(e.bookmarks,e.selected):0})}}function pt(e){const[{bookmarks:t,selected:r},n]=u.exports.useReducer(ft,it),{data:s}=oe(e,!1);u.exports.useEffect(()=>n({type:"set",bookmarks:s}),[s]);const[a]=_();return u.exports.useEffect(()=>{a(t?{b:()=>n({type:"next"}),"shift+B":()=>n({type:"prev"})}:{})},[t,a]),[r,l=>n({type:"select",selected:l}),t]}const se="https://syosetu.com/user/top/";function I(e){return e?2:1}function kt({server:e,onUnauthorized:t}){const[r,n]=u.exports.useState(!1),[s,a]=u.exports.useState(I(!1)),[l,d,c]=pt(e),{data:k,error:i}=Je(e,{enableR18:r,maxPage:s,bookmark:l}),[{items:p,numNewItems:b,selectedIndex:f},E]=u.exports.useReducer(Qe,Y);u.exports.useEffect(()=>{E({type:"set",items:k})},[k]);const C=g=>E({type:"select",index:g}),$=()=>E({type:"default"}),[le,R]=u.exports.useState(void 0),{setAppBadge:D,clearAppBadge:S}=Ge(),{setClientBadge:L,clearClientBadge:M}=qe();u.exports.useEffect(()=>{b!==null&&(document.title=`\u306A\u308D\u3046 \u672A\u8AAD:${b}`,b?(D(b),L(b)):(S(),M()))},[S,M,b,D,L]);const K=u.exports.useRef(null);u.exports.useEffect(()=>{var g;f===-1&&((g=K.current)==null||g.focus())},[f]);const[N]=_();return u.exports.useEffect(()=>{N({r:()=>n(g=>!g),"1":()=>a(g=>I(g===I(!1))),h:()=>window.open(se,"_blank")})},[N]),i?(console.log(`error = ${i}`),i.status===401&&t(),o.createElement("div",{onClick:()=>window.location.reload()},o.createElement("p",null,"Server(",JSON.stringify(e.baseUrl),") is not working...?"),o.createElement("p",null,"status: ",i.status),o.createElement("code",null,i.message))):p?o.createElement(o.Fragment,null,o.createElement(ct,{api:e,item:le,onClose:()=>R(void 0)}),o.createElement(Re,{position:"sticky"},o.createElement(De,null,o.createElement(x,null,o.createElement(Se,{label:"R18",control:o.createElement(Le,{checked:r,onChange:g=>n(g.target.checked)})})),o.createElement(x,null,o.createElement(rt,{bookmarks:c,bookmark:l,onChangeBookmark:d})),o.createElement(x,{m:2},"\u672A\u8AAD: ",b!=null?b:""),o.createElement(v,{variant:"contained",disabled:f===0,disableRipple:!0,ref:K,onClick:()=>$()},"ESC"))),o.createElement(x,{m:2,display:"flex",alignItems:"center",flexDirection:"column",bgcolor:"background.paper"},o.createElement(x,{maxWidth:600},o.createElement(at,{items:p,selectedIndex:f,setSelectedIndex:C,selectDefault:$,onSecondaryAction:R})),o.createElement(x,{position:"fixed",right:"20px",bottom:"20px"},o.createElement(Me,{variant:"extended",size:"small",disableRipple:!0,component:"a",href:se,target:"_blank"},"\u30E6\u30FC\u30B6\u30FC\u30DB\u30FC\u30E0")))):o.createElement(q,{sx:{color:"#fff",zIndex:g=>g.zIndex.drawer+1},open:!0},o.createElement(X,{color:"inherit"}))}function Et({api:e}){const[t,r]=u.exports.useState(!1),n=u.exports.useCallback(()=>{setTimeout(()=>{F(),r(!0)},0)},[]);return t?o.createElement(nt,{api:e,onLogin:()=>{console.log("logged in!"),F(),r(!1)}}):o.createElement(o.Fragment,null,o.createElement(kt,{server:e,onUnauthorized:n}),o.createElement(v,{onClick:async()=>{await e.logout(),F(),r(!0)}},"logout"))}function ht(){const e=z("(prefers-color-scheme: dark)");return u.exports.useMemo(()=>Ke({palette:{mode:e?"dark":"light",primary:Ne}}),[e])}const gt=5*60*1e3;function bt(){const e=ht(),[t,r]=We();return r?o.createElement(J,{injectFirst:!0},o.createElement(Q,{theme:e},o.createElement(Oe,null,"http\u4EE5\u5916\u306E\u5834\u5408\u306F\u5FC5\u305A server \u30AF\u30A8\u30EA\u30D1\u30E9\u30E1\u30FC\u30BF\u306B\u30B5\u30FC\u30D0\u30FC\u30A2\u30C9\u30EC\u30B9\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044"),o.createElement(A,{href:"https://github.com/koizuka/narou-watcher/"},"GitHub"))):o.createElement(J,{injectFirst:!0},o.createElement(Q,{theme:e},o.createElement(Pe,null),o.createElement(Te,{value:{refreshInterval:gt}},t&&o.createElement(Et,{api:t})),o.createElement(Ve,{name:"narou-react"})))}const yt="modulepreload",ae={},vt="/narou/",xt=function(t,r){return!r||r.length===0?t():Promise.all(r.map(n=>{if(n=`${vt}${n}`,n in ae)return;ae[n]=!0;const s=n.endsWith(".css"),a=s?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${n}"]${a}`))return;const l=document.createElement("link");if(l.rel=s?"stylesheet":yt,s||(l.as="script",l.crossOrigin=""),l.href=n,document.head.appendChild(l),s)return new Promise((d,c)=>{l.addEventListener("load",d),l.addEventListener("error",c)})})).then(()=>t())},Ct=e=>{e&&e instanceof Function&&xt(()=>import("./web-vitals.8eea515e.js"),[]).then(({getCLS:t,getFID:r,getFCP:n,getLCP:s,getTTFB:a})=>{t(e),r(e),n(e),s(e),a(e)})};je.render(o.createElement(o.StrictMode,null,o.createElement(bt,null)),document.getElementById("root"));Ct();
