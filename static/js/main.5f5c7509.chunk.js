(this.webpackJsonplibracoin=this.webpackJsonplibracoin||[]).push([[0],{33:function(e,t,a){},39:function(e,t,a){},40:function(e,t,a){},50:function(e,t,a){},57:function(e,t,a){},61:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(21),s=a.n(c),i=a(8),l=a(44),o=a(9),u=a(65),d=a(67),j=(a(50),a(1));function b(){return Object(j.jsxs)(u.a,{expand:"lg",className:"mb-3",children:[Object(j.jsx)(u.a.Brand,{href:"https://github.com/lbragile/LibraCoin",children:Object(j.jsx)("img",{src:"./assets/libracoin-logo-256.png",alt:"LibraCoin Logo",width:"64"})}),Object(j.jsx)(u.a.Toggle,{"aria-controls":"basic-navbar-nav"}),Object(j.jsx)(u.a.Collapse,{id:"basic-navbar-nav",children:Object(j.jsxs)(d.a,{className:"ml-auto",children:[Object(j.jsx)(d.a.Link,{href:"/LibraCoin/wallet",active:location.href.includes("/wallet"),children:"Wallet"}),Object(j.jsx)(d.a.Link,{href:"/LibraCoin/mine",active:location.href.includes("/mine"),children:"Mine"}),Object(j.jsx)(d.a.Link,{href:"/LibraCoin/blockchain",active:location.href.includes("/blockchain"),children:"Blockchain"})]})})]})}var h,x=a(24),O=a(7),p=a.n(O),f=a(10),m=a(66),v=r.a.createContext(void 0);function y(e,t,a){if(e.target.select(),e.target.setSelectionRange(0,1e6),document.execCommand("copy"),a){var n="public"===a;t([n,!n&&!e.target.value.includes("\u25e6")])}else t([!0])}function g(e){return Array.from(new Uint8Array(e)).map((function(e){return e.toString(16).padStart(2,"0")})).join("")}function S(e){return N.apply(this,arguments)}function N(){return(N=Object(f.a)(p.a.mark((function e(t){var a,n;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=(new TextEncoder).encode(t),e.next=3,window.crypto.subtle.digest("SHA-256",a);case 3:return n=e.sent,e.abrupt("return",g(n));case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function T(e){return g(window.crypto.getRandomValues(new Uint32Array(e)))}!function(e){e[e.ADD_VERIFIED_TRANS=0]="ADD_VERIFIED_TRANS",e[e.UPDATE_VERIFIED_TRANS=1]="UPDATE_VERIFIED_TRANS",e[e.UPDATE_SELECTED_TRANS=2]="UPDATE_SELECTED_TRANS",e[e.UPDATE_USERS=3]="UPDATE_USERS",e[e.ADD_BLOCK=4]="ADD_BLOCK",e[e.UPDATE_BLOCK=5]="UPDATE_BLOCK"}(h||(h={}));a(39);function k(){var e,t=Object(n.useContext)(v),a=t.state,r=t.dispatch,c=Object(n.useRef)(null),s=Object(n.useRef)(null),l=Object(n.useRef)(3),o=Object(n.useState)([!1,!1]),u=Object(i.a)(o,2),d=u[0],b=u[1];function O(e,t){return S.apply(this,arguments)}function S(){return(S=Object(f.a)(p.a.mark((function e(t,a){var n;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.crypto.subtle.exportKey(t,a);case 2:return n=e.sent,e.abrupt("return",g(n));case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function N(){return(N=Object(f.a)(p.a.mark((function e(){var t,n,i,l,o,u;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.crypto.subtle.generateKey({name:"ECDSA",namedCurve:"P-256"},!0,["sign","verify"]);case 2:return t=e.sent,n=t.publicKey,i=t.privateKey,e.next=7,O("spki",n);case 7:return l=e.sent,e.next=10,O("pkcs8",i);case 10:o=e.sent,c.current&&s.current&&(c.current.innerText=l,s.current.innerText=new Array(o.length).fill("\u25e6").join("")),localStorage.setItem("user",JSON.stringify({publicKey:l,privateKey:o,balance:1e3})),u=[].concat(Object(x.a)(a.users),[{publicKey:l,balance:1e3}]),r({type:h.UPDATE_USERS,payload:{users:u}});case 15:case"end":return e.stop()}}),e)})))).apply(this,arguments)}Object(n.useEffect)((function(){var e;(null===(e=JSON.parse(localStorage.getItem("user")))||void 0===e?void 0:e.publicKey)||function(){N.apply(this,arguments)}()}),[]);return Object(j.jsxs)("div",{className:"container-fluid row d-flex align-items-center justify-content-center mx-auto",children:[Object(j.jsxs)(m.a.Group,{className:"user-key col-5 px-0",children:[Object(j.jsx)(m.a.Label,{className:"mb-3",children:Object(j.jsx)("h4",{className:"mb-0",children:"Public:"})}),Object(j.jsx)(m.a.Control,{as:"textarea",rows:l.current,defaultValue:localStorage.getItem("user")&&JSON.parse(localStorage.getItem("user")).publicKey,isValid:d[0],onFocus:function(e){return y(e,b,"public")},ref:c}),Object(j.jsx)(m.a.Control.Feedback,{type:"valid",children:"Copied to clipboard!"})]}),Object(j.jsxs)(m.a.Group,{className:"user-key col-5 px-0 ml-4",children:[Object(j.jsx)(m.a.Label,{className:"mb-3",children:Object(j.jsxs)("h4",{className:"mb-0",children:["Private:"," ",(null===(e=JSON.parse(localStorage.getItem("user")))||void 0===e?void 0:e.publicKey)&&Object(j.jsx)("span",{id:"private-reveal-eyes",onClick:function(){s.current&&(s.current.value.includes("\u25e6")?s.current.value=JSON.parse(localStorage.getItem("user")).privateKey:s.current.value=new Array(s.current.value.length).fill("\u25e6").join(""))},children:"\ud83d\udc40"})]})}),Object(j.jsx)(m.a.Control,{as:"textarea",rows:l.current,defaultValue:localStorage.getItem("user")?new Array(JSON.parse(localStorage.getItem("user")).privateKey.length).fill("\u25e6").join(""):"",onFocus:function(e){return y(e,b,"private")},isValid:d[1],ref:s}),Object(j.jsx)(m.a.Control.Feedback,{type:"valid",children:"Copied to clipboard!"})]})]})}var w=a(12),C=a(63),E=a(64);function D(e){return Object(j.jsxs)(m.a,{noValidate:!0,className:"col-12 col-lg-5 my-2 my-lg-0 trans-form",onSubmit:function(t){return e.handleSubmit(t)},children:[Object(j.jsxs)(m.a.Group,{children:[Object(j.jsx)(m.a.Control,{type:"text",defaultValue:e.details.to,disabled:!0}),Object(j.jsx)(m.a.Text,{className:"text-muted",children:"The receiver's public key"})]}),Object(j.jsx)(m.a.Group,{children:Object(j.jsxs)(C.a,{className:"mb-2",children:[Object(j.jsx)(m.a.Control,{type:"number",defaultValue:e.details.amount,disabled:!0}),Object(j.jsx)(C.a.Prepend,{children:Object(j.jsx)(C.a.Text,{children:"LC"})})]})}),Object(j.jsx)(m.a.Group,{children:Object(j.jsx)(m.a.Control,{as:"textarea",defaultValue:e.details.message,rows:5,placeholder:"optional message...",disabled:!0})}),Object(j.jsxs)(m.a.Group,{children:[Object(j.jsx)(m.a.Control,{type:"text",defaultValue:e.details.signature,disabled:!0}),Object(j.jsx)(m.a.Text,{className:"text-muted",children:"Transaction Signature \u2192 receiver uses this along with your public key to verify transaction."})]}),Object(j.jsx)(E.a,{variant:"primary",type:"submit",disabled:!e.signed,block:!0,children:Object(j.jsx)("b",{children:"Send"})})]})}function A(e){var t,a,n=e.validated,r=e.signed,c=e.handleSubmit;return Object(j.jsxs)(m.a,{noValidate:!0,validated:n,className:"col-12 col-lg-5 trans-form",onSubmit:c,children:[Object(j.jsxs)(m.a.Group,{children:[Object(j.jsx)(m.a.Control,{type:"text",defaultValue:(null===(t=JSON.parse(localStorage.getItem("user")))||void 0===t?void 0:t.publicKey)||"",disabled:!0}),Object(j.jsx)(m.a.Text,{className:"text-muted",children:"Your public key \u2192 used to verify transaction was signed using your private key"}),Object(j.jsx)("h3",{className:"my-0 text-center",children:"\u2193"}),Object(j.jsx)(m.a.Control,{type:"text",placeholder:"Receiver's public key",pattern:"[A-Za-z0-9]{182,182}",required:!0}),Object(j.jsx)(m.a.Control.Feedback,{type:"invalid",children:"Must be of the same format as your public key"})]}),Object(j.jsx)(m.a.Group,{children:Object(j.jsxs)(C.a,{className:"mb-2",children:[Object(j.jsx)(m.a.Control,{type:"number",placeholder:"1.00",onBlur:function(e){return function(e){var t,a=(null===(t=JSON.parse(localStorage.getItem("user")))||void 0===t?void 0:t.balance)||1e3;e.target.value=Math.min(Math.max(.1,+e.target.value),a).toFixed(2).toString()}(e)},required:!0}),Object(j.jsx)(C.a.Prepend,{children:Object(j.jsx)(C.a.Text,{children:"LC"})})]})}),Object(j.jsx)(m.a.Group,{children:Object(j.jsx)(m.a.Control,{as:"textarea",rows:2,placeholder:"optional message..."})}),Object(j.jsxs)(m.a.Group,{children:[Object(j.jsx)(m.a.Control,{type:"text",defaultValue:(null===(a=JSON.parse(localStorage.getItem("user")))||void 0===a?void 0:a.privateKey)||"",disabled:!0}),Object(j.jsx)(m.a.Text,{className:"text-muted",children:"Your private key \u2192 not shared with anyone, keep this secret!"})]}),Object(j.jsx)(E.a,{variant:"primary",type:"submit",disabled:r,block:!0,children:Object(j.jsx)("b",{children:"Sign"})})]})}a(40);function P(){var e,t,a=Object(n.useContext)(v).dispatch,r=Object(n.useState)(!1),c=Object(i.a)(r,2),s=c[0],l=c[1],o=Object(n.useState)(!1),u=Object(i.a)(o,2),d=u[0],b=u[1],x=Object(n.useRef)({to:"",from:null!==(e=null===(t=JSON.parse(localStorage.getItem("user")))||void 0===t?void 0:t.publicKey)&&void 0!==e?e:"",amount:void 0,message:"",signature:""}),O=function(){var e=Object(f.a)(p.a.mark((function e(t){var n,r,c;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),n=t.currentTarget,l(!0),!n.checkValidity()||d){e.next=15;break}return r=Object(w.a)({},n),c=Object.values(r).slice(1,4).map((function(e){return e.value})),x.current.to=c[0],x.current.amount=c[1],x.current.message=c[2],e.next=11,S(JSON.stringify(x.current));case 11:x.current.signature=e.sent,b(!0),e.next=16;break;case 15:n.checkValidity()&&(a({type:h.ADD_VERIFIED_TRANS,payload:{trans:x.current}}),b(!1),l(!1));case 16:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return Object(j.jsxs)("div",{className:"container-fluid d-flex justify-content-center mx-auto row my-4",children:[Object(j.jsx)(A,{validated:s,signed:d,handleSubmit:O}),Object(j.jsx)(D,{validated:s,setValidated:l,signed:d,setSigned:b,handleSubmit:O,details:x.current})]})}function I(){var e,t=Object(n.useContext)(v).state,a=Object(n.useState)([!1]),r=Object(i.a)(a,2),c=r[0],s=r[1];return Object(j.jsxs)("div",{className:"container-fluid mb-2",children:[Object(j.jsx)("h3",{className:"font-weight-bold",children:" Users"}),Object(j.jsx)("div",{className:"row flex-nowrap overflow-auto bg-dark mx-1 px-2 rounded",children:null===(e=t.users)||void 0===e?void 0:e.map((function(e){return Object(j.jsxs)(m.a,{className:"user-item rounded",children:[Object(j.jsxs)(m.a.Group,{children:[Object(j.jsx)(m.a.Text,{className:"font-weight-bold mb-1 my-0",children:"Public Key"}),Object(j.jsx)(m.a.Control,{type:"text",className:"text-truncate",onFocus:function(e){return y(e,s)},defaultValue:e.publicKey,isValid:c[0]}),Object(j.jsx)(m.a.Control.Feedback,{type:"valid",children:"Copied to clipboard"})]}),Object(j.jsxs)(C.a,{className:"mt-2",children:[Object(j.jsx)(m.a.Control,{type:"number",defaultValue:e.balance.toFixed(2),disabled:!0}),Object(j.jsx)(C.a.Append,{children:Object(j.jsx)(C.a.Text,{children:"LC"})})]})]},Math.random())}))})]})}function V(){return Object(j.jsxs)("div",{children:[Object(j.jsx)(b,{}),Object(j.jsx)(k,{}),Object(j.jsx)(P,{}),Object(j.jsx)(I,{})]})}function R(e){return _.apply(this,arguments)}function _(){return(_=Object(f.a)(p.a.mark((function e(t){var a,n,r;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,S(T(20));case 2:return a=e.sent,n=new RegExp("^.{0,".concat(t,"}"),"g"),r=Array(t).fill("0").join(""),e.abrupt("return",a.replace(n,r));case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function L(e,t,a,n,r){return J.apply(this,arguments)}function J(){return(J=Object(f.a)(p.a.mark((function e(t,a,n,r,c){var s,i,l,o;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return s=Math.round(Math.random())+2,e.next=3,R(s);case 3:i=e.sent,n(i),l="",o=t;case 7:if(!(o<=Number.MAX_SAFE_INTEGER)){e.next=18;break}return e.next=10,S(o.toString());case 10:if(l=e.sent,r(l),a(o++),!l.substr(0,s).split("").every((function(e){return"0"===e}))){e.next=16;break}return e.abrupt("break",18);case 16:e.next=7;break;case 18:return c(l<=i),e.abrupt("return",l);case 20:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function K(e){var t=Object(n.useContext)(v).state,a=Object(n.useRef)(),r=Object(n.useState)(),c=Object(i.a)(r,2),s=c[0],l=c[1],o=Object(n.useState)(),u=Object(i.a)(o,2),d=u[0],b=u[1];function h(){return(h=Object(f.a)(p.a.mark((function t(){var n;return p.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a.current=Math.round(1e6*Math.random()),t.next=3,L(a.current,l,b,e.setSolution,e.setIsValid);case 3:if(n=t.sent,!e.propagateBlockStatus){t.next=7;break}return t.next=7,e.propagateBlockStatus(n,!0);case 7:case"end":return t.stop()}}),t)})))).apply(this,arguments)}return Object(j.jsxs)("div",{className:e.chain?"bordered-background":"col-11 col-lg-5 mx-3",children:[Object(j.jsxs)(C.a,{className:"my-2",children:[Object(j.jsx)(C.a.Prepend,{children:Object(j.jsx)(C.a.Text,{children:"Nonce"})}),Object(j.jsx)(m.a.Control,{type:"number",defaultValue:e.solution?a.current:"",disabled:!0})]}),Object(j.jsxs)(C.a,{className:"my-2",children:[Object(j.jsx)(C.a.Prepend,{children:Object(j.jsx)(C.a.Text,{children:"Header"})}),Object(j.jsx)(m.a.Control,{type:"number",defaultValue:s,disabled:!0})]}),Object(j.jsxs)(C.a,{className:"my-2",children:[Object(j.jsx)(C.a.Prepend,{children:Object(j.jsx)(C.a.Text,{className:"font-weight-bold",children:"Target"})}),Object(j.jsx)(m.a.Control,{type:"text",defaultValue:d,disabled:!0})]}),Object(j.jsxs)(C.a,{className:"my-2",children:[Object(j.jsx)(C.a.Prepend,{children:Object(j.jsx)(C.a.Text,{children:"Sol'n"})}),Object(j.jsx)(m.a.Control,{type:"text",style:e.isValid?{color:"green"}:{color:"red"},defaultValue:e.solution,disabled:!0})]}),Object(j.jsx)(E.a,{variant:"primary",className:"btn-block d-block mt-3",disabled:e.isValid||!e.chain&&0===t.selectedTrans.length,onClick:function(){return function(){return h.apply(this,arguments)}()},children:Object(j.jsx)("h4",{className:"m-0",children:"Mine"})})]})}a(33);function U(e){var t,a=e.details,r=Object(n.useContext)(v),c=r.state,s=r.dispatch,l=Object(n.useState)(""),o=Object(i.a)(l,2),u=o[0],d=o[1],b=Object(n.useState)(Date.now()),x=Object(i.a)(b,2),O=x[0],y=x[1],g=Object(n.useState)(a.merkleRoot),N=Object(i.a)(g,2),T=N[0],k=N[1],w=Object(n.useState)(null===(t=a.valid)||void 0===t||t),E=Object(i.a)(w,2),D=E[0],A=E[1];function P(){return(P=Object(f.a)(p.a.mark((function e(t){var n,r;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.target.value,e.next=3,S(a.index+a.prevHash+n);case 3:return r=e.sent,A(n===T),y(Date.now()),d(r),k(n),e.next=10,I(r,!1,n);case 10:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function I(e,t,a){return V.apply(this,arguments)}function V(){return(V=Object(f.a)(p.a.mark((function e(t,n,r){var i,l,o,u,d,j,b=arguments;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:i=b.length>3&&void 0!==b[3]?b[3]:Date.now(),l=a.index,o=l;case 3:if(!(o<c.chain.length)){e.next=19;break}if(u=r&&o===l?r:c.chain[o].merkleRoot,o!==l){e.next=9;break}e.t0=t,e.next=12;break;case 9:return e.next=11,S(o+t+u);case 11:e.t0=e.sent;case 12:d=e.t0,j={index:o,timestamp:i,prevHash:o===l?a.prevHash:t,currHash:d,transactions:c.chain[o].transactions,merkleRoot:u,valid:!!n&&o===l},t=d,s({type:h.UPDATE_BLOCK,payload:{block:j}});case 16:o++,e.next=3;break;case 19:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return Object(n.useEffect)((function(){return y(Date.now())}),[u]),Object(j.jsxs)("div",{className:"block my-3 mx-1 p-2 rounded "+(D?"valid-block":"invalid-block"),children:[Object(j.jsxs)(m.a,{children:[Object(j.jsxs)(C.a,{className:"my-2",children:[Object(j.jsx)(C.a.Prepend,{children:Object(j.jsx)(C.a.Text,{children:"Index"})}),Object(j.jsx)(m.a.Control,{type:"number",value:a.index,disabled:!0})]}),Object(j.jsxs)(C.a,{className:"my-2",children:[Object(j.jsx)(C.a.Prepend,{children:Object(j.jsx)(C.a.Text,{children:"Timestamp"})}),Object(j.jsx)(m.a.Control,{type:"number",value:u?O:a.timestamp,disabled:!0})]}),Object(j.jsxs)(C.a,{className:"my-2",children:[Object(j.jsx)(C.a.Prepend,{children:Object(j.jsx)(C.a.Text,{children:"Previous #"})}),Object(j.jsx)(m.a.Control,{type:"text",value:a.prevHash,disabled:!0})]}),Object(j.jsxs)(C.a,{className:"my-2",children:[Object(j.jsx)(C.a.Prepend,{children:Object(j.jsx)(C.a.Text,{children:"Current #"})}),Object(j.jsx)(m.a.Control,{type:"text",value:u||a.currHash,disabled:!0})]}),Object(j.jsxs)(C.a,{className:"my-2",children:[Object(j.jsx)(C.a.Prepend,{children:Object(j.jsx)(C.a.Text,{children:"Merkle #"})}),0===a.index?Object(j.jsx)(m.a.Control,{type:"text",disabled:!0,value:""}):Object(j.jsx)(m.a.Control,{type:"text",value:T,onChange:function(e){return function(e){return P.apply(this,arguments)}(e)}})]})]}),Object(j.jsx)(K,{chain:!0,solution:u,setSolution:d,isValid:D,setIsValid:A,propagateBlockStatus:I})]})}function M(){var e=Object(n.useContext)(v).state;return Object(j.jsx)("div",{className:"mx-3 row flex-nowrap overflow-auto",children:e.chain.map((function(e){return Object(j.jsx)(U,{details:e},Math.random())}))})}function F(){return Object(j.jsxs)("div",{children:[Object(j.jsx)(b,{}),Object(j.jsx)(M,{})]})}var B=a(6),G=a(22),H=a(35),W=a(36),Y=function(){function e(t){Object(H.a)(this,e),this.value=void 0,this.children=void 0,this.parent=void 0,this.pos=void 0,this.value=t,this.children=[],this.parent=null,this.pos={x:0,y:0}}return Object(W.a)(e,[{key:"left",get:function(){return this.children[0]},set:function(e){e.parent=this,this.children[0]=e}},{key:"right",get:function(){return this.children[1]},set:function(e){e.parent=this,this.children[1]=e}},{key:"position",get:function(){return this.pos},set:function(e){this.pos=e}}]),e}(),q=Object(G.a)("root"),z=Object(G.a)("transactionSignatures"),X=Object(G.a)("startPosition"),Z=Object(G.a)("dim"),Q=Object(G.a)("ctx"),$=function(){function e(t,a){Object(H.a)(this,e),Object.defineProperty(this,q,{writable:!0,value:void 0}),Object.defineProperty(this,z,{writable:!0,value:void 0}),Object.defineProperty(this,X,{writable:!0,value:void 0}),Object.defineProperty(this,Z,{writable:!0,value:void 0}),Object.defineProperty(this,Q,{writable:!0,value:void 0});var n=window.innerWidth<1200?1.8*window.innerWidth:window.innerWidth/2*.8;Object(B.a)(this,q)[q]=null,Object(B.a)(this,z)[z]=a.map((function(e){return e.signature.slice(0,25)+"..."})),Object(B.a)(this,X)[X]={x:n,y:5},Object(B.a)(this,Q)[Q]=t.getContext("2d"),Object(B.a)(this,Z)[Z]={width:t.width,height:t.height}}return Object(W.a)(e,[{key:"calculatePosition",value:function(e){var t=e.x,a=e.y,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=50;return{x:n?t-6*r:t+6*r,y:a+r}}},{key:"clear",value:function(){Object(B.a)(this,Q)[Q]&&Object(B.a)(this,Q)[Q].clearRect(0,0,Object(B.a)(this,Z)[Z].width,Object(B.a)(this,Z)[Z].height)}},{key:"addNode",value:function(e){var t=new Y(""!==e?e.slice(0,25)+"...":"");if(Object(B.a)(this,q)[q])for(var a=Object(B.a)(this,q)[q];a;){if(!a.left){t.position=this.calculatePosition(a.position,!0),a.left=t;break}if(!a.right){t.position=this.calculatePosition(a.position),a.right=t;break}a=a.left.left&&a.left.right?a.right:a.left}else t.position=Object(B.a)(this,X)[X],Object(B.a)(this,q)[q]=t}},{key:"drawTree",value:function(){var e=this,t=[];for(t.push(Object(B.a)(this,q)[q]);0!==t.length;){var a=t.shift(),n=a&&9*a.value.length;Object(B.a)(this,Q)[Q]&&n&&a&&function(){var r,c=a.position,s=c.x,i=c.y;Object(B.a)(e,Q)[Q].beginPath(),Object(B.a)(e,Q)[Q].font="1rem Arial",Object(B.a)(e,Q)[Q].strokeStyle="#000";var l=Object(B.a)(e,z)[z].includes(a.value)?"#ddf":"#ff0a";Object(B.a)(e,Q)[Q].fillStyle=a.value===(null===(r=Object(B.a)(e,q)[q])||void 0===r?void 0:r.value)?"#dfd":l,Object(B.a)(e,Q)[Q].fillRect(s-n/2,i+5,n,30),Object(B.a)(e,Q)[Q].fillStyle="#000",Object(B.a)(e,Q)[Q].fillText(a.value,s+10-n/2,i+27),a.children.forEach((function(a,n){a.position.x=1===n?a.position.x-150:a.position.x+150,t.push(a),Object(B.a)(e,Q)[Q]&&(Object(B.a)(e,Q)[Q].beginPath(),Object(B.a)(e,Q)[Q].moveTo(s+.5,i+35),Object(B.a)(e,Q)[Q].lineTo(a.position.x+.5,a.position.y+5),Object(B.a)(e,Q)[Q].stroke())}))}()}}}]),e}();function ee(){return(ee=Object(f.a)(p.a.mark((function e(t,a,n){var r,c,s,i,l,o,u;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=[[""]],!(a.length>0)){e.next=26;break}c=t.map((function(e){return e.signature})),s=a.map((function(e){return e.signature})),i=c.filter((function(e){return s.includes(e)})),r=[i];case 6:if(1===i.length){e.next=26;break}l=[],o=0;case 9:if(!(o<i.length)){e.next=22;break}if(!i[o+1]){e.next=16;break}return e.next=13,S(i[o]+i[o+1]);case 13:e.t0=e.sent,e.next=17;break;case 16:e.t0=i[o];case 17:u=e.t0,l.push(u);case 19:o+=2,e.next=9;break;case 22:i=l,r.push(l),e.next=6;break;case 26:return n&&n(r),e.abrupt("return",te(r));case 28:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function te(e){return e[e.length-1][0]}function ae(){var e=Object(n.useContext)(v),t=e.state,a=e.dispatch,r=Object(n.useRef)(null),c=Object(n.useState)(""),s=Object(i.a)(c,2),l=s[0],o=s[1],u=Object(n.useState)(!1),d=Object(i.a)(u,2),b=d[0],x=d[1],O=Object(n.useState)(Date.now()),p=Object(i.a)(O,2),f=p[0],y=p[1],g=Object(n.useState)([[""]]),S=Object(i.a)(g,2),N=S[0],T=S[1],k=Object(n.useState)(t.chain[t.chain.length-1].index+1),w=Object(i.a)(k,2),D=w[0],A=w[1],P=Object(n.useState)(t.chain[t.chain.length-1].currHash),I=Object(i.a)(P,2),V=I[0],R=I[1];return Object(n.useEffect)((function(){!function(e,t,a){ee.apply(this,arguments)}(t.verifiedTrans,t.selectedTrans,T),x(!1)}),[t.selectedTrans]),Object(n.useEffect)((function(){!function(e,t,a){if(t){var n=new $(t,a);n.clear();for(var r=function(e){for(var t=[],a=0;a<e.length;a++)t=t.concat(e[a].reverse());return t}(e),c=r.length-1;c>=0;c--)n.addNode(r[c]);n.drawTree()}}(N,r.current,t.selectedTrans)}),[N]),Object(n.useEffect)((function(){return y(Date.now())}),[l]),Object(j.jsxs)("div",{className:"container-fluid row d-flex justify-content-center mx-auto my-3",children:[Object(j.jsxs)("div",{className:"overflow-auto mb-2",children:[Object(j.jsx)("h4",{className:"font-weight-bold text-center",children:"Merkle Tree Visualization"}),Object(j.jsx)("canvas",{ref:r,className:"border border-dark rounded",width:1500})]}),Object(j.jsx)(K,{chain:!1,solution:l,setSolution:o,isValid:b,setIsValid:x}),Object(j.jsxs)(m.a,{className:"col-10 col-lg-5 my-4 my-lg-0 pb-2 rounded "+(b?"valid-block":"invalid-block"),children:[Object(j.jsxs)(C.a,{className:"my-2",children:[Object(j.jsx)(C.a.Prepend,{children:Object(j.jsx)(C.a.Text,{children:"Index"})}),Object(j.jsx)(m.a.Control,{type:"number",value:D,disabled:!0})]}),Object(j.jsxs)(C.a,{className:"my-2",children:[Object(j.jsx)(C.a.Prepend,{children:Object(j.jsx)(C.a.Text,{children:"Timestamp"})}),Object(j.jsx)(m.a.Control,{type:"number",value:f,disabled:!0})]}),Object(j.jsxs)(C.a,{className:"my-2",children:[Object(j.jsx)(C.a.Prepend,{children:Object(j.jsx)(C.a.Text,{children:"Previous #"})}),Object(j.jsx)(m.a.Control,{type:"text",value:V,disabled:!0})]}),Object(j.jsxs)(C.a,{className:"my-2",children:[Object(j.jsx)(C.a.Prepend,{children:Object(j.jsx)(C.a.Text,{children:"Current #"})}),Object(j.jsx)(m.a.Control,{type:"text",value:l,disabled:!0})]}),Object(j.jsxs)(C.a,{className:"my-2",children:[Object(j.jsx)(C.a.Prepend,{children:Object(j.jsx)(C.a.Text,{children:"Merkle #"})}),Object(j.jsx)(m.a.Control,{type:"text",value:te(N),disabled:!0})]}),b&&Object(j.jsx)(E.a,{variant:"success",block:!0,onClick:function(){return function(){var e={index:D,prevHash:V,currHash:l,transactions:t.selectedTrans,timestamp:f,merkleRoot:te(N),valid:t.chain[D-1].valid};a({type:h.ADD_BLOCK,payload:{block:e}}),a({type:h.UPDATE_VERIFIED_TRANS}),a({type:h.UPDATE_SELECTED_TRANS,payload:{selectedTrans:[]}}),x(!1),A(D+1),R(l),o(""),y(Date.now())}()},children:Object(j.jsx)("h3",{className:"my-0 font-weight-bold",children:"+"})})]})]})}function ne(){var e=Object(n.useContext)(v),t=e.state,a=e.dispatch;return Object(j.jsxs)("div",{className:"container-fluid",children:[Object(j.jsx)("h3",{className:"font-weight-bold",children:"Verified Transactions"}),Object(j.jsx)("div",{className:"trans-list row flex-nowrap overflow-auto bg-dark mx-1 px-2 rounded",children:t.verifiedTrans.map((function(e){return Object(j.jsxs)("div",{className:"trans-item "+(t.selectedTrans.map((function(e){return e.signature})).includes(e.signature)?"selected":"not-selected"),onClick:function(){return function(e){var t=JSON.parse(localStorage.getItem("selectedTransactions"))||[],n=t.map((function(e){return e.signature})).includes(e.signature);t.length<4||n?(n?t=t.filter((function(t){return t.signature!==e.signature})):t.push(e),a({type:h.UPDATE_SELECTED_TRANS,payload:{selectedTrans:t}})):alert("You can mine at most 4 transactions at a time!")}(e)},children:[Object(j.jsxs)(m.a.Group,{className:"mb-2 text-center",children:[Object(j.jsx)(m.a.Control,{type:"text",defaultValue:e.from,disabled:!0}),Object(j.jsx)("h3",{className:"my-0",children:"\u2193"}),Object(j.jsx)(m.a.Control,{type:"text",defaultValue:e.to,disabled:!0})]}),Object(j.jsxs)(C.a,{className:"mb-2",children:[Object(j.jsx)(C.a.Prepend,{children:Object(j.jsx)(C.a.Text,{children:"Msg"})}),Object(j.jsx)(m.a.Control,{as:"textarea",defaultValue:e.message,disabled:!0})]}),Object(j.jsxs)(C.a,{className:"mb-2",children:[Object(j.jsx)(m.a.Control,{type:"number",defaultValue:e.amount,disabled:!0}),Object(j.jsx)(C.a.Append,{children:Object(j.jsx)(C.a.Text,{children:"LC"})})]}),Object(j.jsxs)(C.a,{className:"mb-2",children:[Object(j.jsx)(C.a.Prepend,{children:Object(j.jsx)(C.a.Text,{children:"Sig"})}),Object(j.jsx)(m.a.Control,{type:"text",defaultValue:e.signature,disabled:!0})]})]},Math.random())}))})]})}function re(){return Object(j.jsxs)("div",{children:[Object(j.jsx)(b,{}),Object(j.jsx)(ne,{}),Object(j.jsx)(ae,{})]})}a(56),a(57);var ce=function(e,t){switch(t.type){case h.ADD_VERIFIED_TRANS:var a,n=t.payload.trans,r=null!==(a=JSON.parse(localStorage.getItem("transactions")))&&void 0!==a?a:[],c=[].concat(Object(x.a)(r),[n]);return localStorage.setItem("transactions",JSON.stringify(c)),Object(w.a)(Object(w.a)({},e),{},{verifiedTrans:c});case h.UPDATE_VERIFIED_TRANS:var s=e.selectedTrans.map((function(e){return e.signature})),i=e.verifiedTrans.filter((function(e){return!s.includes(e.signature)}));return localStorage.setItem("transactions",JSON.stringify(i)),Object(w.a)(Object(w.a)({},e),{},{verifiedTrans:i});case h.UPDATE_SELECTED_TRANS:var l=t.payload.selectedTrans;return localStorage.setItem("selectedTransactions",JSON.stringify(l)),Object(w.a)(Object(w.a)({},e),{},{selectedTrans:l});case h.UPDATE_USERS:var o=t.payload.users;return localStorage.setItem("users",JSON.stringify(o)),Object(w.a)(Object(w.a)({},e),{},{users:o});case h.ADD_BLOCK:var u=t.payload.block,d=[].concat(Object(x.a)(e.chain),[u]);return localStorage.setItem("chain",JSON.stringify(d)),Object(w.a)(Object(w.a)({},e),{},{chain:d});case h.UPDATE_BLOCK:var j=t.payload.block,b=JSON.parse(localStorage.getItem("chain"));return b[j.index]=j,localStorage.setItem("chain",JSON.stringify(b)),Object(w.a)(Object(w.a)({},e),{},{chain:b});default:return e}};function se(){var e,t,a,r,c=Object(n.useReducer)(ce,{verifiedTrans:null!==(e=JSON.parse(localStorage.getItem("transactions")))&&void 0!==e?e:[],selectedTrans:null!==(t=JSON.parse(localStorage.getItem("selectedTransactions")))&&void 0!==t?t:[],users:null!==(a=JSON.parse(localStorage.getItem("users")))&&void 0!==a?a:[],chain:null!==(r=JSON.parse(localStorage.getItem("chain")))&&void 0!==r?r:[{index:0,prevHash:"",currHash:new Array(256).fill("0").join(""),transactions:[],timestamp:Date.parse("04/31/2021")}]}),s=Object(i.a)(c,2),u=s[0],d=s[1],b=Object(n.useMemo)((function(){return{state:u,dispatch:d}}),[u,d]);return Object(j.jsx)(l.a,{basename:"/LibraCoin",children:Object(j.jsxs)(v.Provider,{value:b,children:[Object(j.jsx)(o.b,{exact:!0,path:"/",children:Object(j.jsx)(o.a,{to:"/wallet"})}),Object(j.jsx)(o.b,{path:"/wallet",component:V}),Object(j.jsx)(o.b,{path:"/mine",component:re}),Object(j.jsx)(o.b,{path:"/blockchain",component:F})]})})}s.a.render(Object(j.jsx)(r.a.StrictMode,{children:Object(j.jsx)(se,{})}),document.getElementById("root"))}},[[61,1,2]]]);
//# sourceMappingURL=main.5f5c7509.chunk.js.map