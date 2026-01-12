import{j as u}from"./charts-2e8e60b5.js";import{r as m}from"./vendor-fb33f09a.js";import{b as D,L as j}from"./router-9ce3d278.js";import{a as P}from"./utils-78d57de0.js";let B={data:""},M=r=>{if(typeof window=="object"){let e=(r?r.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return e.nonce=window.__nonce__,e.parentNode||(r||document.head).appendChild(e),e.firstChild}return r||B},J=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,W=/\/\*[^]*?\*\/|  +/g,A=/\n+/g,b=(r,e)=>{let t="",o="",n="";for(let a in r){let s=r[a];a[0]=="@"?a[1]=="i"?t=a+" "+s+";":o+=a[1]=="f"?b(s,a):a+"{"+b(s,a[1]=="k"?"":e)+"}":typeof s=="object"?o+=b(s,e?e.replace(/([^,])+/g,i=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,l=>/&/.test(l)?l.replace(/&/g,i):i?i+" "+l:l)):a):s!=null&&(a=/^--/.test(a)?a:a.replace(/[A-Z]/g,"-$&").toLowerCase(),n+=b.p?b.p(a,s):a+":"+s+";")}return t+(e&&n?e+"{"+n+"}":n)+o},y={},C=r=>{if(typeof r=="object"){let e="";for(let t in r)e+=t+C(r[t]);return e}return r},q=(r,e,t,o,n)=>{let a=C(r),s=y[a]||(y[a]=(l=>{let d=0,c=11;for(;d<l.length;)c=101*c+l.charCodeAt(d++)>>>0;return"go"+c})(a));if(!y[s]){let l=a!==r?r:(d=>{let c,h,v=[{}];for(;c=J.exec(d.replace(W,""));)c[4]?v.shift():c[3]?(h=c[3].replace(A," ").trim(),v.unshift(v[0][h]=v[0][h]||{})):v[0][c[1]]=c[2].replace(A," ").trim();return v[0]})(r);y[s]=b(n?{["@keyframes "+s]:l}:l,t?"":"."+s)}let i=t&&y.g?y.g:null;return t&&(y.g=y[s]),((l,d,c,h)=>{h?d.data=d.data.replace(h,l):d.data.indexOf(l)===-1&&(d.data=c?l+d.data:d.data+l)})(y[s],e,o,i),s},V=(r,e,t)=>r.reduce((o,n,a)=>{let s=e[a];if(s&&s.call){let i=s(t),l=i&&i.props&&i.props.className||/^go/.test(i)&&i;s=l?"."+l:i&&typeof i=="object"?i.props?"":b(i,""):i===!1?"":i}return o+n+(s??"")},"");function S(r){let e=this||{},t=r.call?r(e.p):r;return q(t.unshift?t.raw?V(t,[].slice.call(arguments,1),e.p):t.reduce((o,n)=>Object.assign(o,n&&n.call?n(e.p):n),{}):t,M(e.target),e.g,e.o,e.k)}let $,T,E;S.bind({g:1});let x=S.bind({k:1});function H(r,e,t,o){b.p=e,$=r,T=t,E=o}function w(r,e){let t=this||{};return function(){let o=arguments;function n(a,s){let i=Object.assign({},a),l=i.className||n.className;t.p=Object.assign({theme:T&&T()},i),t.o=/ *go\d+/.test(l),i.className=S.apply(t,o)+(l?" "+l:""),e&&(i.ref=s);let d=r;return r[0]&&(d=i.as||r,delete i.as),E&&d[0]&&E(i),$(d,i)}return e?e(n):n}}var U=r=>typeof r=="function",I=(r,e)=>U(r)?r(e):r,G=(()=>{let r=0;return()=>(++r).toString()})(),Y=(()=>{let r;return()=>{if(r===void 0&&typeof window<"u"){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r}})(),Z=20,F="default",_=(r,e)=>{let{toastLimit:t}=r.settings;switch(e.type){case 0:return{...r,toasts:[e.toast,...r.toasts].slice(0,t)};case 1:return{...r,toasts:r.toasts.map(s=>s.id===e.toast.id?{...s,...e.toast}:s)};case 2:let{toast:o}=e;return _(r,{type:r.toasts.find(s=>s.id===o.id)?1:0,toast:o});case 3:let{toastId:n}=e;return{...r,toasts:r.toasts.map(s=>s.id===n||n===void 0?{...s,dismissed:!0,visible:!1}:s)};case 4:return e.toastId===void 0?{...r,toasts:[]}:{...r,toasts:r.toasts.filter(s=>s.id!==e.toastId)};case 5:return{...r,pausedAt:e.time};case 6:let a=e.time-(r.pausedAt||0);return{...r,pausedAt:void 0,toasts:r.toasts.map(s=>({...s,pauseDuration:s.pauseDuration+a}))}}},K=[],X={toasts:[],pausedAt:void 0,settings:{toastLimit:Z}},k={},z=(r,e=F)=>{k[e]=_(k[e]||X,r),K.forEach(([t,o])=>{t===e&&o(k[e])})},L=r=>Object.keys(k).forEach(e=>z(r,e)),Q=r=>Object.keys(k).find(e=>k[e].toasts.some(t=>t.id===r)),O=(r=F)=>e=>{z(e,r)},ee=(r,e="blank",t)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:e,ariaProps:{role:"status","aria-live":"polite"},message:r,pauseDuration:0,...t,id:(t==null?void 0:t.id)||G()}),R=r=>(e,t)=>{let o=ee(e,r,t);return O(o.toasterId||Q(o.id))({type:2,toast:o}),o.id},g=(r,e)=>R("blank")(r,e);g.error=R("error");g.success=R("success");g.loading=R("loading");g.custom=R("custom");g.dismiss=(r,e)=>{let t={type:3,toastId:r};e?O(e)(t):L(t)};g.dismissAll=r=>g.dismiss(void 0,r);g.remove=(r,e)=>{let t={type:4,toastId:r};e?O(e)(t):L(t)};g.removeAll=r=>g.remove(void 0,r);g.promise=(r,e,t)=>{let o=g.loading(e.loading,{...t,...t==null?void 0:t.loading});return typeof r=="function"&&(r=r()),r.then(n=>{let a=e.success?I(e.success,n):void 0;return a?g.success(a,{id:o,...t,...t==null?void 0:t.success}):g.dismiss(o),n}).catch(n=>{let a=e.error?I(e.error,n):void 0;a?g.error(a,{id:o,...t,...t==null?void 0:t.error}):g.dismiss(o)}),r};var re=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,te=x`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,oe=x`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,se=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${r=>r.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${re} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${te} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${r=>r.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${oe} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,ae=x`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,ne=w("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${r=>r.secondary||"#e0e0e0"};
  border-right-color: ${r=>r.primary||"#616161"};
  animation: ${ae} 1s linear infinite;
`,ie=x`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,le=x`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,ce=w("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${r=>r.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ie} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${le} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${r=>r.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,pe=w("div")`
  position: absolute;
`,de=w("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ue=x`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ge=w("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ue} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,me=({toast:r})=>{let{icon:e,type:t,iconTheme:o}=r;return e!==void 0?typeof e=="string"?m.createElement(ge,null,e):e:t==="blank"?null:m.createElement(de,null,m.createElement(ne,{...o}),t!=="loading"&&m.createElement(pe,null,t==="error"?m.createElement(se,{...o}):m.createElement(ce,{...o})))},fe=r=>`
0% {transform: translate3d(0,${r*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,he=r=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${r*-150}%,-1px) scale(.6); opacity:0;}
`,ye="0%{opacity:0;} 100%{opacity:1;}",xe="0%{opacity:1;} 100%{opacity:0;}",be=w("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,we=w("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,ve=(r,e)=>{let t=r.includes("top")?1:-1,[o,n]=Y()?[ye,xe]:[fe(t),he(t)];return{animation:e?`${x(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${x(n)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}};m.memo(({toast:r,position:e,style:t,children:o})=>{let n=r.height?ve(r.position||e||"top-center",r.visible):{opacity:0},a=m.createElement(me,{toast:r}),s=m.createElement(we,{...r.ariaProps},I(r.message,r));return m.createElement(be,{className:r.className,style:{...n,...t,...r.style}},typeof o=="function"?o({icon:a,message:s}):m.createElement(m.Fragment,null,a,s))});H(m.createElement);S`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;const p=P.create({baseURL:"http://localhost:5000/api",timeout:3e4,headers:{"Content-Type":"application/json",Accept:"application/json"}}),f={getAccessToken:()=>localStorage.getItem("accessToken"),getRefreshToken:()=>localStorage.getItem("refreshToken"),setTokens:(r,e)=>{localStorage.setItem("accessToken",r),e&&localStorage.setItem("refreshToken",e)},clearTokens:()=>{localStorage.removeItem("accessToken"),localStorage.removeItem("refreshToken")},isTokenExpired:r=>{if(!r)return!0;try{return JSON.parse(atob(r.split(".")[1])).exp*1e3<Date.now()}catch{return!0}}};let N=!1;p.interceptors.request.use(r=>{const e=f.getAccessToken();return e&&!f.isTokenExpired(e)&&(r.headers.Authorization=`Bearer ${e}`),r.headers["X-Request-ID"]=`req_${Date.now()}_${Math.random().toString(36).substr(2,9)}`,r.headers["X-Request-Time"]=new Date().toISOString(),r},r=>(console.error("Request interceptor error:",r),Promise.reject(r)));p.interceptors.response.use(r=>r,async r=>{const e=r.config;if(!r.response)return g.error("Network error. Please check your connection."),Promise.reject({message:"Network error",type:"NETWORK_ERROR",originalError:r});const{status:t,data:o}=r.response;if(t===401&&!e._retry){e._retry=!0;try{const i=f.getRefreshToken();if(i&&!f.isTokenExpired(i)){const l=await P.post(`${p.defaults.baseURL}/auth/refresh`,{refreshToken:i}),{accessToken:d,refreshToken:c}=l.data.data||l.data;return f.setTokens(d,c),e.headers.Authorization=`Bearer ${d}`,p(e)}}catch(i){console.error("Token refresh failed:",i)}return N||(N=!0,f.clearTokens(),localStorage.removeItem("user"),localStorage.removeItem("permissions"),localStorage.removeItem("roles"),window.location.href="/auth/login"),Promise.reject({message:"Session expired. Please login again.",type:"AUTH_ERROR",status:401})}const a={400:()=>({message:(o==null?void 0:o.message)||"Bad request. Please check your input.",type:"VALIDATION_ERROR",errors:(o==null?void 0:o.errors)||{}}),403:()=>({message:(o==null?void 0:o.message)||"Access denied. You don't have permission.",type:"PERMISSION_ERROR"}),404:()=>({message:(o==null?void 0:o.message)||"Resource not found.",type:"NOT_FOUND_ERROR"}),409:()=>({message:(o==null?void 0:o.message)||"Conflict. Resource already exists.",type:"CONFLICT_ERROR"}),422:()=>({message:(o==null?void 0:o.message)||"Validation failed.",type:"VALIDATION_ERROR",errors:(o==null?void 0:o.errors)||{}}),429:()=>({message:(o==null?void 0:o.message)||"Too many requests. Please try again later.",type:"RATE_LIMIT_ERROR"}),500:()=>({message:(o==null?void 0:o.message)||"Internal server error. Please try again.",type:"SERVER_ERROR"}),502:()=>({message:"Bad gateway. Server is temporarily unavailable.",type:"SERVER_ERROR"}),503:()=>({message:"Service unavailable. Please try again later.",type:"SERVER_ERROR"})}[t],s=a?a():{message:(o==null?void 0:o.message)||"An unexpected error occurred.",type:"UNKNOWN_ERROR"};return["VALIDATION_ERROR"].includes(s.type)||g.error(s.message),Promise.reject({...s,status:t,originalError:r,response:r.response})});class ke{constructor(){this.endpoints={login:"/auth/login",register:"/auth/register",logout:"/auth/logout",refresh:"/auth/refresh",forgotPassword:"/auth/forgot-password",resetPassword:"/auth/reset-password",verifyEmail:"/auth/verify-email",resendVerification:"/auth/resend-verification",changePassword:"/auth/change-password",profile:"/auth/profile",updateProfile:"/auth/profile",twoFactor:"/auth/2fa",sessions:"/auth/sessions",permissions:"/auth/permissions",roles:"/auth/roles"}}async login(e){var t;try{console.log("🔄 Login attempt for:",e.email);const o=await p.post(this.endpoints.login,{email:(t=e.email)==null?void 0:t.toLowerCase().trim(),password:e.password,rememberMe:e.rememberMe||!1});console.log("✅ Login response:",o.data);const{user:n,accessToken:a,refreshToken:s,permissions:i,roles:l}=o.data.data;return f.setTokens(a,s),localStorage.setItem("user",JSON.stringify(n)),localStorage.setItem("permissions",JSON.stringify(i||[])),localStorage.setItem("roles",JSON.stringify(l||[])),console.log("✅ Login successful, tokens stored"),{user:n,accessToken:a,refreshToken:s,permissions:i,roles:l}}catch(o){throw console.error("❌ Login error:",o),console.error("Error details:",{message:o.message,type:o.type,status:o.status,response:o.response}),o}}async register(e){var t;try{return(await p.post(this.endpoints.register,{firstName:e.firstName,lastName:e.lastName,email:(t=e.email)==null?void 0:t.toLowerCase().trim(),phone:e.phone,password:e.password,acceptTerms:e.acceptTerms,role:e.role})).data.data}catch(o){throw console.error("Registration error:",o),o}}async logout(e=!1){try{const t=f.getRefreshToken();t&&await p.post(this.endpoints.logout,{refreshToken:t,allDevices:e})}catch(t){console.error("Logout error:",t)}finally{this.clearAuthData()}}async refreshToken(){try{const e=f.getRefreshToken();if(!e)throw new Error("No refresh token available");const t=await p.post(this.endpoints.refresh,{refreshToken:e}),{accessToken:o,refreshToken:n}=t.data.data;return f.setTokens(o,n),{accessToken:o,refreshToken:n}}catch(e){throw console.error("Token refresh error:",e),this.clearAuthData(),e}}async forgotPassword(e){try{return(await p.post(this.endpoints.forgotPassword,{email:e.toLowerCase().trim()})).data.data}catch(t){throw console.error("Forgot password error:",t),t}}async resetPassword(e){try{return(await p.post(this.endpoints.resetPassword,e)).data.data}catch(t){throw console.error("Reset password error:",t),t}}async verifyEmail(e){try{return(await p.post(this.endpoints.verifyEmail,{token:e})).data.data}catch(t){throw console.error("Email verification error:",t),t}}async resendVerification(e){try{return(await p.post(this.endpoints.resendVerification,{email:e.toLowerCase().trim()})).data.data}catch(t){throw console.error("Resend verification error:",t),t}}async changePassword(e){try{return(await p.put(this.endpoints.changePassword,e)).data.data}catch(t){throw console.error("Change password error:",t),t}}async getProfile(){try{const t=(await p.get(this.endpoints.profile)).data.data;return localStorage.setItem("user",JSON.stringify(t)),t}catch(e){throw console.error("Get profile error:",e),e}}async updateProfile(e){try{const o=(await p.put(this.endpoints.updateProfile,e)).data.data;return localStorage.setItem("user",JSON.stringify(o)),o}catch(t){throw console.error("Update profile error:",t),t}}async setupTwoFactor(e){try{return(await p.post(this.endpoints.twoFactor,e)).data.data}catch(t){throw console.error("2FA setup error:",t),t}}async verifyTwoFactor(e){try{return(await p.post(`${this.endpoints.twoFactor}/verify`,{code:e})).data.data}catch(t){throw console.error("2FA verification error:",t),t}}async disableTwoFactor(e){try{return(await p.delete(this.endpoints.twoFactor,{data:{password:e}})).data.data}catch(t){throw console.error("2FA disable error:",t),t}}async getSessions(){try{return(await p.get(this.endpoints.sessions)).data.data}catch(e){throw console.error("Get sessions error:",e),e}}async revokeSession(e){try{return(await p.delete(`${this.endpoints.sessions}/${e}`)).data.data}catch(t){throw console.error("Revoke session error:",t),t}}async getPermissions(){try{const t=(await p.get(this.endpoints.permissions)).data.data;return localStorage.setItem("permissions",JSON.stringify(t)),t}catch(e){throw console.error("Get permissions error:",e),e}}async getRoles(){try{const t=(await p.get(this.endpoints.roles)).data.data;return localStorage.setItem("roles",JSON.stringify(t)),t}catch(e){throw console.error("Get roles error:",e),e}}isAuthenticated(){const e=f.getAccessToken();return e&&!f.isTokenExpired(e)}getCurrentUser(){try{const e=localStorage.getItem("user");return e?JSON.parse(e):null}catch{return null}}getStoredPermissions(){try{const e=localStorage.getItem("permissions");return e?JSON.parse(e):[]}catch{return[]}}getStoredRoles(){try{const e=localStorage.getItem("roles");return e?JSON.parse(e):[]}catch{return[]}}clearAuthData(){f.clearTokens(),localStorage.removeItem("user"),localStorage.removeItem("permissions"),localStorage.removeItem("roles")}getDeviceInfo(){return{userAgent:navigator.userAgent,platform:navigator.platform,language:navigator.language,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,screen:{width:screen.width,height:screen.height}}}}const Re=new ke,Oe=()=>{const[r,e]=m.useState(""),[t,o]=m.useState(""),[n,a]=m.useState(""),[s,i]=m.useState(!1),l=D(),d=async c=>{c.preventDefault(),i(!0),a(""),o("");try{await Re.forgotPassword(r)&&(o("Check your email for password reset link"),setTimeout(()=>l("/auth/login"),2e3))}catch(h){console.error("Forgot password error:",h),a(h.message||"Failed to send reset link"),i(!1)}};return u.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"#f8fafc",padding:"16px",minHeight:"100vh",fontFamily:'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'},children:[u.jsx("style",{children:`
        @keyframes popIn {
          0% { transform: scale(0.8) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .forgot-card {
          animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}),u.jsxs("div",{className:"forgot-card",style:{width:"100%",maxWidth:"360px",backgroundColor:"white",borderRadius:"12px",boxShadow:"0 8px 32px rgba(30, 64, 175, 0.15)",padding:"24px",border:"1px solid rgba(30, 64, 175, 0.1)"},children:[u.jsxs(j,{to:"/",style:{fontSize:"16px",fontWeight:"600",color:"#1e293b",textDecoration:"none",display:"flex",alignItems:"center",gap:"6px",marginBottom:"16px"},children:[u.jsx("div",{style:{width:"24px",height:"24px",background:"linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",borderRadius:"5px",display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:"700",fontSize:"11px"},children:"SS"}),u.jsx("span",{children:"StaySpot"})]}),u.jsx("h1",{style:{fontSize:"18px",fontWeight:"700",marginBottom:"2px",color:"#0f172a"},children:"Reset Password"}),u.jsx("p",{style:{color:"#64748b",fontSize:"12px",marginBottom:"14px"},children:"Enter your email to receive reset link"}),n&&u.jsxs("div",{style:{backgroundColor:"#fee2e2",border:"1px solid #fecaca",color:"#991b1b",padding:"8px",borderRadius:"6px",marginBottom:"10px",fontSize:"11px"},children:["⚠️ ",n]}),t&&u.jsxs("div",{style:{backgroundColor:"#d1fae5",border:"1px solid #6ee7b7",color:"#065f46",padding:"8px",borderRadius:"6px",marginBottom:"10px",fontSize:"11px"},children:["✓ ",t]}),u.jsxs("form",{onSubmit:d,style:{display:"flex",flexDirection:"column",gap:"10px"},children:[u.jsxs("div",{children:[u.jsx("label",{style:{display:"block",marginBottom:"3px",fontWeight:"500",color:"#0f172a",fontSize:"11px"},children:"Email"}),u.jsx("input",{type:"email",value:r,onChange:c=>e(c.target.value),required:!0,style:{width:"100%",padding:"7px 9px",border:"1px solid #cbd5e1",borderRadius:"6px",fontSize:"12px",fontFamily:"inherit",boxSizing:"border-box",transition:"all 0.2s"},placeholder:"you@example.com",onFocus:c=>c.target.style.borderColor="#1e293b",onBlur:c=>c.target.style.borderColor="#cbd5e1"})]}),u.jsx("button",{type:"submit",disabled:s,style:{backgroundColor:"#1e293b",color:"white",padding:"7px",borderRadius:"6px",border:"none",fontWeight:"600",cursor:"pointer",fontSize:"12px",opacity:s?.7:1,transition:"all 0.2s"},onMouseOver:c=>!s&&(c.target.style.backgroundColor="#0f172a"),onMouseOut:c=>c.target.style.backgroundColor="#1e293b",children:s?"Sending...":"Send Reset Link"})]}),u.jsxs("div",{style:{marginTop:"10px",paddingTop:"10px",borderTop:"1px solid #e2e8f0",textAlign:"center"},children:[u.jsx("p",{style:{color:"#64748b",fontSize:"11px",marginBottom:"3px"},children:"Remember your password?"}),u.jsx(j,{to:"/auth/login",style:{color:"#1e293b",textDecoration:"none",fontWeight:"600",fontSize:"11px"},children:"Sign in →"})]}),u.jsx("button",{onClick:()=>window.location.href="/",style:{display:"block",marginTop:"12px",padding:"7px",backgroundColor:"#f0f4f8",color:"#1e293b",textDecoration:"none",fontWeight:"600",fontSize:"12px",borderRadius:"6px",textAlign:"center",border:"1px solid #cbd5e1",transition:"all 0.2s",width:"100%",cursor:"pointer"},onMouseOver:c=>c.target.style.backgroundColor="#e0e7ff",onMouseOut:c=>c.target.style.backgroundColor="#f0f4f8",children:"← Back to Homepage"})]})]})};export{Oe as default};
//# sourceMappingURL=ForgotPasswordPage-b192a366.js.map
