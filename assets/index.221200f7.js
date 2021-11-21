var ie=Object.defineProperty,de=Object.defineProperties;var me=Object.getOwnPropertyDescriptors;var T=Object.getOwnPropertySymbols;var fe=Object.prototype.hasOwnProperty,pe=Object.prototype.propertyIsEnumerable;var j=(e,t,r)=>t in e?ie(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,k=(e,t)=>{for(var r in t||(t={}))fe.call(t,r)&&j(e,r,t[r]);if(T)for(var r of T(t))pe.call(t,r)&&j(e,r,t[r]);return e},y=(e,t)=>de(e,me(t));import{r as u,R as o,D as U,Z as _,H as z,u as H,S as ke,M as W,a as Ee,b as V,c as G,d as F,e as q,B as C,C as he,f as ge,g as be,h as ye,i as w,T as X,j as xe,L as I,s as ve,k as Ce,l as we,A as Be,m as Ae,F as _e,n as Fe,o as Ie,p as $e,q as De,t as Re,v as Se,w as Le,x as Me,y as Ne,I as Oe,z as Ke,E as Pe,G as Te,J as je,K as J,N as Q,O as Ue,P as ze,X as He,Q as We}from"./vendor.9dccfff8.js";const Ve=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function r(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerpolicy&&(a.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?a.credentials="include":s.crossorigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=r(s);fetch(s.href,a)}};Ve();class Ge extends Error{constructor(t,r){super(r);this.status=t,this.name="ApiError"}}class x{constructor(t){this.server=t.replace(/\/$/,"")}get baseUrl(){return this.server}async fetch(t){return fetch(`${this.server}${t}`,{credentials:"include"})}async login(t,r){const n=new FormData;return n.append("id",t),n.append("password",r),await fetch(`${this.server}/narou/login`,{method:"POST",body:n,credentials:"include"})}async logout(){await this.fetch("/narou/logout")}async call(t){const r=await this.fetch(t);if(!r.ok)throw new Ge(r.status,await r.text());return r.json()}static isnoticelist({maxPage:t=1}){return console.log("NarouApi.isnoticelist"),`/narou/isnoticelist?max_page=${t}`}static isnoticelistR18({maxPage:t=1}){return`/r18/isnoticelist?max_page=${t}`}static bookmarks(){return"/narou/bookmarks/"}static bookmarksR18(){return"/r18/bookmarks/"}static bookmark(t,{order:r}){return`/narou/bookmarks/${t}?order=${r}`}static bookmarkR18(t,{order:r}){return`/r18/bookmarks/${t}?order=${r}`}static novelInfo(t){return`/narou/novels/${t}`}static novelInfoR18(t){return`/r18/novels/${t}`}}function qe(e){const t=new URLSearchParams(e.search).get("server");return t||(e.protocol==="http:"?"http://localhost:7676":/.*\.github\.io$/.test(e.hostname)?"":e.protocol+"//"+e.host+e.pathname)}function Xe(){const[e,t]=u.exports.useState(null),[r,n]=u.exports.useState(!1);return u.exports.useEffect(()=>{const s=qe(document.location);s?t(new x(s)):n(!0)},[]),[e,r]}function Je(e){return o.createElement("div",{style:{display:"inline-block",position:"fixed",bottom:0,right:0,fontSize:"small",fontStyle:"italic"}},e.name,": ",U.fromISO("2021-11-21T17:28:55.502+00:00").toISO())}function Qe(){return"setAppBadge"in navigator&&"clearAppBadge"in navigator?{setAppBadge:e=>navigator.setAppBadge(e),clearAppBadge:()=>navigator.clearAppBadge()}:{setAppBadge:()=>Promise.resolve(),clearAppBadge:()=>Promise.resolve()}}function Ze(){return"setClientBadge"in navigator&&"clearClientBadge"in navigator?{setClientBadge:e=>navigator.setClientBadge(e),clearClientBadge:()=>navigator.clearClientBadge()}:{setClientBadge:()=>Promise.resolve(),clearClientBadge:()=>Promise.resolve()}}function Z(e){return[e.shiftKey?"shift":void 0,e.ctrlKey?"ctrl":void 0,e.altKey?"alt":void 0,e.metaKey?"meta":void 0,e.key].filter(t=>t!==void 0).join("+")}function Ye(e){const[t,...r]=e==="+"?["+"]:e.endsWith("++")?["+",...e.slice(0,-2).split("+").reverse()]:e.split("+").reverse(),n=["shift","ctrl","alt","meta"];if(r.some(a=>!n.includes(a)))throw new Error(`HotKey(${e}): unknown modifiers: ${r.filter(a=>!n.includes(a))}`);const s=Z({key:t,shiftKey:r.some(a=>a==="shift"),ctrlKey:r.some(a=>a==="ctrl"),altKey:r.some(a=>a==="alt"),metaKey:r.some(a=>a==="meta")});if(s!==e)throw new Error(`HotKey(${e}): invalid order: must be ${s} `)}function et(){const[e,t]=u.exports.useState({});return u.exports.useEffect(()=>{const r=Object.keys(e);if(r.length>0){r.forEach(s=>Ye(s));const n=s=>{const a=e[Z(s)];a&&a(s)};return document.addEventListener("keydown",n,!1),()=>{document.removeEventListener("keydown",n)}}},[e]),[t]}function Y(e){return e.latest>e.bookmark}function ee(e){return Y(e)?`${e.base_url}${e.bookmark+1}/`:`${e.base_url}${e.latest}/`}function tt(e){const t=[e.title," ("];return Y(e)&&t.push(`${e.bookmark}/`),t.push(`${e.latest})`),e.completed&&t.push("[\u5B8C\u7D50]"),t.join("")}function te(e){return Math.max(e.latest-e.bookmark,0)}function re(e,t){const{data:r,error:n}=_(e?t?x.bookmarksR18():x.bookmarks():null,async a=>e?e.call(a):[]);return{data:u.exports.useMemo(()=>{if(r)return r.reduce((a,l)=>(a[l.no]={name:l.name,num_items:l.num_items},a),{})},[r]),error:n}}function $(){z("/narou/isnoticelist"),z("/r18/isnoticelist")}function rt(e,{enableR18:t,maxPage:r=1,bookmark:n=0}){const{data:s,error:a}=_(x.isnoticelist({maxPage:r}),async d=>e.call(d),{onErrorRetry:d=>{console.log(`onErrorRetry: ${d.status}: ${d}`)}}),l="new",{data:m,error:g}=_(!a&&n?x.bookmark(n,{order:l}):null,async d=>e.call(d)),{data:E,error:i}=_(!a&&t?x.isnoticelistR18({maxPage:r}):null,async d=>e.call(d)),f=u.exports.useMemo(()=>{if(s&&m){const d=new Set(s.map(b=>b.base_url)),p=m.filter(b=>b.is_notice&&!d.has(b.base_url));if(p.length>0)return[...s,...p]}return s},[s,m]),h=u.exports.useMemo(()=>f===void 0?void 0:[...f.map(p=>y(k({},p),{isR18:!1})),...(E||[]).map(p=>y(k({},p),{isR18:!0}))].map(p=>y(k({},p),{update_time:U.fromISO(p.update_time)})),[f,E]);return{data:a?void 0:h,error:a||i||g}}const ne={numNewItems:null,selectedIndex:-1,defaultIndex:-1};function nt(e,t){switch(t.type){case"set":{if(!t.items)return ne;const r=t.items.sort((a,l)=>st(a,l,m=>at(m),a.bookmark<a.latest?m=>m.update_time:ot(m=>m.update_time),m=>m.base_url)).slice(0,30),n=r[0],s=n&&n.bookmark<n.latest?0:-1;return y(k({},e),{items:r,numNewItems:r.filter(a=>a.bookmark<a.latest).length,selectedIndex:s,defaultIndex:s})}case"select":return y(k({},e),{selectedIndex:e.items?Math.max(Math.min(t.index,e.items.length-1),-1):-1})}}function oe(e,t,r){const n=r(e),s=r(t);return n<s?-1:n>s?1:0}function ot(e){return{f:e}}function st(e,t,...r){for(const n of r){let s;if(typeof n=="object"?s=oe(t,e,n.f):s=oe(e,t,n),s)return s}return 0}const at=e=>e.bookmark===e.latest?Number.MAX_SAFE_INTEGER:e.bookmark>e.latest?Number.MAX_SAFE_INTEGER-1:e.latest-e.bookmark;function lt(e){const t=Ee();return H(t.breakpoints.up(e))}function ut({bookmarks:e,bookmark:t,onChangeBookmark:r}){const[n,s]=u.exports.useState(!1),a=lt("sm");return o.createElement(ke,{disableUnderline:!0,variant:"standard",open:n,onOpen:()=>s(!0),onClose:()=>s(!1),value:t,onChange:l=>r(Number(l.target.value))},o.createElement(W,{key:0,value:0},n||a?"\u30D6\u30C3\u30AF\u30DE\u30FC\u30AF\u306A\u3057":"BM-"),e&&Object.keys(e).map(l=>o.createElement(W,{key:l,value:l},n||a?e[Number(l)].name:`BM${t}`)))}function ct(e){const[t,r]=u.exports.useState(""),[n,s]=u.exports.useState(""),[a,l]=u.exports.useState(""),m=u.exports.useCallback(async()=>{const i=await e.api.login(t,n);if(i.ok)e.onLogin();else{const f=await i.text();l(`${i.status} ${i.statusText}
${f}`)}},[t,n,e]),g=u.exports.useRef(),E=u.exports.useCallback(()=>{var i;l(""),(i=g.current)==null||i.focus()},[]);return o.createElement(o.Fragment,null,o.createElement(V,{open:a!=="",onClose:()=>E()},o.createElement(G,null,"\u30ED\u30B0\u30A4\u30F3\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F"),o.createElement(F,null,o.createElement("pre",null,a)),o.createElement(q,null,o.createElement(C,{autoFocus:!0,onClick:()=>E()},"OK"))),o.createElement(he,{maxWidth:"sm"},o.createElement(ge,{raised:!0},o.createElement(be,{title:"\u5C0F\u8AAC\u5BB6\u306B\u306A\u308D\u3046\u306E\u30ED\u30B0\u30A4\u30F3\u60C5\u5831","data-testid":"login-page"}),o.createElement(ye,null,o.createElement(w,{display:"flex",flexDirection:"column",justifyContent:"center"},o.createElement(X,{id:"id",name:"id",label:"ID or email",autoFocus:!0,value:t,onChange:i=>r(i.target.value),onKeyPress:i=>{var f;i.key==="Enter"&&((f=g.current)==null||f.focus())},"data-testid":"id"}),o.createElement(X,{id:"password",name:"password",label:"password",type:"password",value:n,onChange:i=>s(i.target.value),inputRef:g,onKeyPress:i=>{i.key==="Enter"&&m()},"data-testid":"password"}))),o.createElement(xe,{style:{justifyContent:"center"}},o.createElement(C,{variant:"contained",onClick:m,"data-testid":"login"},"login")))))}function it(e){if(!e)return null;const t=e.match(/https:\/\/([0-9a-zA-Z.]+)\/([0-9a-z]+)\/?/);if(!t)return console.warn(`base_url is invalid: ${e}`),null;const[,r,n]=t;return{host:r,ncode:n}}function dt(e,t){const r=u.exports.useMemo(()=>it(t),[t]),n=u.exports.useMemo(()=>{if(!r)return null;switch(r.host){case"ncode.syosetu.com":return x.novelInfo(r.ncode);case"novel18.syosetu.com":return x.novelInfoR18(r.ncode);default:return console.warn(`unknown host: ${r.host}`),null}},[r]),{data:s,error:a}=_(n,async l=>e.call(l));return{data:s,error:a}}function mt({api:e,item:t,onClose:r}){const{data:n}=dt(e,t==null?void 0:t.base_url),{data:s}=re((n==null?void 0:n.bookmark_no)?e:null,(t==null?void 0:t.isR18)||!1),a=u.exports.useMemo(()=>{console.log("novelInfo:",n),console.log("bookmarkInfo:",s);const l=n==null?void 0:n.bookmark_no;if(s&&l&&(n==null?void 0:n.bookmark_url))return{no:l,name:s[l].name,url:n.bookmark_url}},[n,s]);return o.createElement(V,{open:!!t,onClose:r},o.createElement(G,null,t==null?void 0:t.title),o.createElement(F,null,"\u4F5C\u8005:",o.createElement(I,{href:n==null?void 0:n.author_url,target:"_blank"},t==null?void 0:t.author_name)),a&&o.createElement(F,null,"\u30D6\u30C3\u30AF\u30DE\u30FC\u30AF:",o.createElement(I,{href:a.url,target:"_blank"},a.name)),o.createElement(q,null,o.createElement(C,{size:"small",variant:"contained",onClick:()=>{t&&window.open(t.base_url,"_blank"),r()}},"\u5C0F\u8AAC\u30DA\u30FC\u30B8"),o.createElement(C,{size:"small",variant:"contained",onClick:()=>{t&&window.open(ee(t),"_blank"),r()}},"\u6700\u65B0",t==null?void 0:t.latest,"\u90E8\u5206"),o.createElement(C,{size:"small",variant:"contained",onClick:()=>r()},"\u30AD\u30E3\u30F3\u30BB\u30EB")))}const se="https://syosetu.com/user/top/";function ft(e){return e.latest<e.bookmark?{color:"secondary",badgeContent:"!"}:{color:"primary",badgeContent:te(e)}}function D(e){return e?2:1}function pt(e,t){const r=Object.keys(e).map(n=>Number(n));for(const n of r)if(n>t)return n;return 0}function kt(e,t){const r=[0,...Object.keys(e).map(s=>Number(s))],n=r.findIndex(s=>s>=t);return n>0?r[n-1]:r[r.length-1]}function Et({server:e,onUnauthorized:t}){const[r,n]=u.exports.useState(!1),[s,a]=u.exports.useState(D(!1)),[l,m]=u.exports.useState(0),{data:g,error:E}=rt(e,{enableR18:r,maxPage:s,bookmark:l}),{data:i}=re(e,!1),[{items:f,numNewItems:h,selectedIndex:d,defaultIndex:p},b]=u.exports.useReducer(nt,ne);u.exports.useEffect(()=>{b({type:"set",items:g})},[g]);const B=c=>b({type:"select",index:c}),[le,R]=u.exports.useState(void 0),{setAppBadge:S,clearAppBadge:L}=Qe(),{setClientBadge:M,clearClientBadge:N}=Ze();u.exports.useEffect(()=>{h!==null&&(document.title=`\u306A\u308D\u3046 \u672A\u8AAD:${h}`,h?(S(h),M(h)):(L(),N()))},[L,N,h,S,M]);const ue=u.exports.useCallback(c=>{c&&(ve(c,{behavior:"smooth",scrollMode:"if-needed"}),c.focus())},[]),O=u.exports.useRef(null);u.exports.useEffect(()=>{var c;d===-1&&((c=O.current)==null||c.focus())},[d]);const[K]=et();u.exports.useEffect(()=>{if(f){const c=f.length,A=v=>{v.preventDefault(),b({type:"select",index:d-1})},P=v=>{v.preventDefault(),b({type:"select",index:d+1})};K(k(y(k(k(k({},d>0&&{ArrowUp:A,k:A}),d<c-1&&{ArrowDown:P,j:P}),c>0&&{Home:()=>B(0),End:()=>B(c-1),Escape:()=>B(p)}),{r:()=>n(v=>!v),"1":()=>a(v=>D(v===D(!1))),h:()=>window.open(se,"_blank")}),i&&{b:()=>m(pt(i,l)),"shift+B":()=>m(kt(i,l))}))}},[d,p,f,i,l,K]);const ce=u.exports.useCallback(c=>te(c)>0?{component:"a",href:ee(c),onClick:()=>B(-1),target:"_blank"}:{disabled:!0},[]);return E?(console.log(`error = ${E}`),E.status===401&&t(),o.createElement("div",{onClick:()=>window.location.reload()},o.createElement("p",null,"Server(",JSON.stringify(e.baseUrl),") is not working...?"),o.createElement("p",null,"status: ",E.status),o.createElement("code",null,E.message))):f?o.createElement(o.Fragment,null,o.createElement(mt,{api:e,item:le,onClose:()=>R(void 0)}),o.createElement(Be,{position:"sticky"},o.createElement(Ae,null,o.createElement(w,null,o.createElement(_e,{label:"R18",control:o.createElement(Fe,{checked:r,onChange:c=>n(c.target.checked)})})),o.createElement(w,null,o.createElement(ut,{bookmarks:i,bookmark:l,onChangeBookmark:m})),o.createElement(w,{m:2},"\u672A\u8AAD: ",h!=null?h:""),o.createElement(C,{variant:"contained",disabled:d===0,disableRipple:!0,ref:O,onClick:()=>B(p)},"ESC"))),o.createElement(w,{m:2,display:"flex",alignItems:"center",flexDirection:"column",bgcolor:"background.paper"},o.createElement(w,{maxWidth:600},o.createElement(Ie,null,f==null?void 0:f.map((c,A)=>o.createElement($e,k(y(k({key:c.base_url,button:!0},A===d?{selected:!0,ref:ue}:{}),{disableRipple:!0,onFocusVisible:()=>B(A)}),ce(c)),o.createElement(De,null,o.createElement(Re,k({overlap:"circular"},ft(c)),o.createElement(Se,null,o.createElement(Le,{color:c.isR18?"secondary":void 0})))),o.createElement(Me,{primary:tt(c),secondary:`${c.update_time.toFormat("yyyy/LL/dd HH:mm")} \u66F4\u65B0  \u4F5C\u8005:${c.author_name}`}),o.createElement(Ne,null,o.createElement(Oe,{edge:"end",onClick:()=>R(c),disableRipple:!0,size:"large"},o.createElement(Ke,null))))))),o.createElement(w,{position:"fixed",right:"20px",bottom:"20px"},o.createElement(Pe,{variant:"extended",size:"small",disableRipple:!0,component:"a",href:se,target:"_blank"},"\u30E6\u30FC\u30B6\u30FC\u30DB\u30FC\u30E0")))):o.createElement(Ce,{sx:{color:"#fff",zIndex:c=>c.zIndex.drawer+1},open:!0},o.createElement(we,{color:"inherit"}))}function ht({api:e}){const[t,r]=u.exports.useState(!1),n=u.exports.useCallback(()=>{setTimeout(()=>{$(),r(!0)},0)},[]);return t?o.createElement(ct,{api:e,onLogin:()=>{console.log("logged in!"),$(),r(!1)}}):o.createElement(o.Fragment,null,o.createElement(Et,{server:e,onUnauthorized:n}),o.createElement(C,{onClick:async()=>{await e.logout(),$(),r(!0)}},"logout"))}function gt(){const e=H("(prefers-color-scheme: dark)");return u.exports.useMemo(()=>Te({palette:{mode:e?"dark":"light",primary:je}}),[e])}const bt=5*60*1e3;function yt(){const e=gt(),[t,r]=Xe();return r?o.createElement(J,{injectFirst:!0},o.createElement(Q,{theme:e},o.createElement(Ue,null,"http\u4EE5\u5916\u306E\u5834\u5408\u306F\u5FC5\u305A server \u30AF\u30A8\u30EA\u30D1\u30E9\u30E1\u30FC\u30BF\u306B\u30B5\u30FC\u30D0\u30FC\u30A2\u30C9\u30EC\u30B9\u3092\u6307\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044"),o.createElement(I,{href:"https://github.com/koizuka/narou-watcher/"},"GitHub"))):o.createElement(J,{injectFirst:!0},o.createElement(Q,{theme:e},o.createElement(ze,null),o.createElement(He,{value:{refreshInterval:bt}},t&&o.createElement(ht,{api:t})),o.createElement(Je,{name:"narou-react"})))}const xt="modulepreload",ae={},vt="/narou/",Ct=function(t,r){return!r||r.length===0?t():Promise.all(r.map(n=>{if(n=`${vt}${n}`,n in ae)return;ae[n]=!0;const s=n.endsWith(".css"),a=s?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${n}"]${a}`))return;const l=document.createElement("link");if(l.rel=s?"stylesheet":xt,s||(l.as="script",l.crossOrigin=""),l.href=n,document.head.appendChild(l),s)return new Promise((m,g)=>{l.addEventListener("load",m),l.addEventListener("error",g)})})).then(()=>t())},wt=e=>{e&&e instanceof Function&&Ct(()=>import("./web-vitals.8eea515e.js"),[]).then(({getCLS:t,getFID:r,getFCP:n,getLCP:s,getTTFB:a})=>{t(e),r(e),n(e),s(e),a(e)})};We.render(o.createElement(o.StrictMode,null,o.createElement(yt,null)),document.getElementById("root"));wt();
