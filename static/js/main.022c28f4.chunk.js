(this.webpackJsonplibracoin=this.webpackJsonplibracoin||[]).push([[0],{33:function(e,t,a){},39:function(e,t,a){},40:function(e,t,a){},50:function(e,t,a){},57:function(e,t,a){},61:function(e,t,a){"use strict";a.r(t);var n=a(0),c=a.n(n),r=a(22),s=a.n(r),i=a(7),l=a(44),o=a(8),u=a(65),d=a(67),j=(a(50),a(1));function b(){return Object(j.jsxs)(u.a,{expand:"lg",className:"mb-3",children:[Object(j.jsx)(u.a.Brand,{href:"https://github.com/lbragile/LibraCoin",children:Object(j.jsx)("img",{src:"./assets/libracoin-logo-256.png",alt:"LibraCoin Logo",width:"64"})}),Object(j.jsx)(u.a.Toggle,{"aria-controls":"basic-navbar-nav"}),Object(j.jsx)(u.a.Collapse,{id:"basic-navbar-nav",children:Object(j.jsxs)(d.a,{className:"ml-auto",children:[Object(j.jsx)(d.a.Link,{href:"/LibraCoin/wallet",active:location.href.includes("/wallet"),children:"Wallet"}),Object(j.jsx)(d.a.Link,{href:"/LibraCoin/mine",active:location.href.includes("/mine"),children:"Mine"}),Object(j.jsx)(d.a.Link,{href:"/LibraCoin/blockchain",active:location.href.includes("/blockchain"),children:"Blockchain"})]})})]})}var h,O=a(19),x=a(9),p=a.n(x),f=a(12),m=a(63),v=a(66),y=c.a.createContext(void 0);function g(e,t,a){if(e.target.select(),e.target.setSelectionRange(0,1e6),document.execCommand("copy"),a){var n="public"===a;t([n,!n&&!e.target.value.includes("\u25e6")])}else t([!0])}function S(e){return Array.from(new Uint8Array(e)).map((function(e){return e.toString(16).padStart(2,"0")})).join("")}function N(e){return T.apply(this,arguments)}function T(){return(T=Object(f.a)(p.a.mark((function e(t){var a,n;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=(new TextEncoder).encode(t),e.next=3,window.crypto.subtle.digest("SHA-256",a);case 3:return n=e.sent,e.abrupt("return",S(n));case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function k(e){return S(window.crypto.getRandomValues(new Uint32Array(e)))}!function(e){e[e.ADD_VERIFIED_TRANS=0]="ADD_VERIFIED_TRANS",e[e.UPDATE_VERIFIED_TRANS=1]="UPDATE_VERIFIED_TRANS",e[e.UPDATE_SELECTED_TRANS=2]="UPDATE_SELECTED_TRANS",e[e.UPDATE_USERS=3]="UPDATE_USERS",e[e.ADD_BLOCK=4]="ADD_BLOCK"}(h||(h={}));a(39);function C(){var e,t,a=Object(n.useContext)(y),c=a.state,r=a.dispatch,s=Object(n.useRef)(null),l=Object(n.useRef)(null),o=Object(n.useRef)(3),u=Object(n.useState)([!1,!1]),d=Object(i.a)(u,2),b=d[0],x=d[1];function N(e,t){return T.apply(this,arguments)}function T(){return(T=Object(f.a)(p.a.mark((function e(t,a){var n;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.crypto.subtle.exportKey(t,a);case 2:return n=e.sent,e.abrupt("return",S(n));case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function k(){return(k=Object(f.a)(p.a.mark((function e(){var t,a,n,i,o,u;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.crypto.subtle.generateKey({name:"ECDSA",namedCurve:"P-256"},!0,["sign","verify"]);case 2:return t=e.sent,a=t.publicKey,n=t.privateKey,e.next=7,N("spki",a);case 7:return i=e.sent,e.next=10,N("pkcs8",n);case 10:o=e.sent,s.current&&l.current&&(s.current.innerText=i,l.current.innerText=new Array(o.length).fill("\u25e6").join("")),localStorage.setItem("user",JSON.stringify({publicKey:i,privateKey:o,balance:1e3})),u=[].concat(Object(O.a)(c.users),[{publicKey:i,balance:1e3}]),localStorage.setItem("users",JSON.stringify(u)),r({type:h.UPDATE_USERS,payload:{users:u}});case 16:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return Object(j.jsxs)("div",{className:"container-fluid row d-flex align-items-center justify-content-center mx-auto",children:[!(null===(e=JSON.parse(localStorage.getItem("user")))||void 0===e?void 0:e.publicKey)&&Object(j.jsx)(m.a,{variant:"primary",className:"p-3 mx-2 font-weight-bold",onClick:function(){return k.apply(this,arguments)},children:"Create Wallet"}),Object(j.jsxs)(v.a.Group,{className:"user-key col-5 px-0",children:[Object(j.jsx)(v.a.Label,{className:"mb-3",children:Object(j.jsx)("h4",{className:"mb-0",children:"Public:"})}),Object(j.jsx)(v.a.Control,{as:"textarea",rows:o.current,defaultValue:localStorage.getItem("user")&&JSON.parse(localStorage.getItem("user")).publicKey,isValid:b[0],onFocus:function(e){return g(e,x,"public")},ref:s}),Object(j.jsx)(v.a.Control.Feedback,{type:"valid",children:"Copied to clipboard!"})]}),Object(j.jsxs)(v.a.Group,{className:"user-key col-5 px-0 ml-4",children:[Object(j.jsx)(v.a.Label,{className:"mb-3",children:Object(j.jsxs)("h4",{className:"mb-0",children:["Private:"," ",(null===(t=JSON.parse(localStorage.getItem("user")))||void 0===t?void 0:t.publicKey)&&Object(j.jsx)("span",{id:"private-reveal-eyes",onClick:function(){l.current&&(l.current.value.includes("\u25e6")?l.current.value=JSON.parse(localStorage.getItem("user")).privateKey:l.current.value=new Array(l.current.value.length).fill("\u25e6").join(""))},children:"\ud83d\udc40"})]})}),Object(j.jsx)(v.a.Control,{as:"textarea",rows:o.current,defaultValue:localStorage.getItem("user")?new Array(JSON.parse(localStorage.getItem("user")).privateKey.length).fill("\u25e6").join(""):"",onFocus:function(e){return g(e,x,"private")},isValid:b[1],ref:l}),Object(j.jsx)(v.a.Control.Feedback,{type:"valid",children:"Copied to clipboard!"})]})]})}var w=a(14),E=a(64);function V(e){return Object(j.jsxs)(v.a,{noValidate:!0,className:"col-12 col-lg-5 my-2 my-lg-0 trans-form",onSubmit:function(t){return e.handleSubmit(t)},children:[Object(j.jsxs)(v.a.Group,{children:[Object(j.jsx)(v.a.Control,{type:"text",defaultValue:e.details.to,disabled:!0}),Object(j.jsx)(v.a.Text,{className:"text-muted",children:"The receiver's public key"})]}),Object(j.jsx)(v.a.Group,{children:Object(j.jsxs)(E.a,{className:"mb-2",children:[Object(j.jsx)(v.a.Control,{type:"number",defaultValue:e.details.amount,disabled:!0}),Object(j.jsx)(E.a.Prepend,{children:Object(j.jsx)(E.a.Text,{children:"LC"})})]})}),Object(j.jsx)(v.a.Group,{children:Object(j.jsx)(v.a.Control,{as:"textarea",defaultValue:e.details.message,rows:5,placeholder:"optional message...",disabled:!0})}),Object(j.jsxs)(v.a.Group,{children:[Object(j.jsx)(v.a.Control,{type:"text",defaultValue:e.details.signature,disabled:!0}),Object(j.jsx)(v.a.Text,{className:"text-muted",children:"Transaction Signature \u2192 receiver uses this along with your public key to verify transaction."})]}),Object(j.jsx)(m.a,{variant:"primary",type:"submit",disabled:!e.validated,block:!0,children:Object(j.jsx)("b",{children:"Send"})})]})}function P(e){var t,a,n,c=e.validated,r=e.handleSubmit;return Object(j.jsxs)(v.a,{noValidate:!0,validated:c,className:"col-12 col-lg-5 trans-form",onSubmit:r,children:[Object(j.jsxs)(v.a.Group,{children:[Object(j.jsx)(v.a.Control,{type:"text",defaultValue:(null===(t=JSON.parse(localStorage.getItem("user")))||void 0===t?void 0:t.publicKey)||"",disabled:!0}),Object(j.jsx)(v.a.Text,{className:"text-muted",children:"Your public key \u2192 used to verify transaction was signed using your private key"}),Object(j.jsx)("h3",{className:"my-0 text-center",children:"\u2193"}),Object(j.jsx)(v.a.Control,{type:"text",placeholder:"Receiver's public key",pattern:"[A-Za-z0-9]{182,182}",required:!0}),Object(j.jsx)(v.a.Control.Feedback,{type:"invalid",children:"Must be of the same format as your public key"})]}),Object(j.jsx)(v.a.Group,{children:Object(j.jsxs)(E.a,{className:"mb-2",children:[Object(j.jsx)(v.a.Control,{type:"number",placeholder:"1.00",onBlur:function(e){return function(e){var t,a=(null===(t=JSON.parse(localStorage.getItem("user")))||void 0===t?void 0:t.balance)||1e3;e.target.value=Math.min(Math.max(.1,+e.target.value),a).toFixed(2).toString()}(e)},required:!0}),Object(j.jsx)(E.a.Prepend,{children:Object(j.jsx)(E.a.Text,{children:"LC"})})]})}),Object(j.jsx)(v.a.Group,{children:Object(j.jsx)(v.a.Control,{as:"textarea",rows:2,placeholder:"optional message..."})}),Object(j.jsxs)(v.a.Group,{children:[Object(j.jsx)(v.a.Control,{type:"text",defaultValue:(null===(a=JSON.parse(localStorage.getItem("user")))||void 0===a?void 0:a.privateKey)||"",disabled:!0}),Object(j.jsx)(v.a.Text,{className:"text-muted",children:"Your private key \u2192 not shared with anyone, keep this secret!"})]}),Object(j.jsx)(m.a,{variant:"primary",type:"submit",disabled:!(null===(n=JSON.parse(localStorage.getItem("user")))||void 0===n?void 0:n.publicKey)||c,block:!0,children:Object(j.jsx)("b",{children:"Sign"})})]})}a(40);function A(){var e,t,a=Object(n.useContext)(y).state,c=Object(n.useState)(!1),r=Object(i.a)(c,2),s=r[0],l=r[1],o=Object(n.useState)(!1),u=Object(i.a)(o,2),d=u[0],b=u[1],h=Object(n.useRef)({to:"",from:null!==(e=null===(t=JSON.parse(localStorage.getItem("user")))||void 0===t?void 0:t.publicKey)&&void 0!==e?e:"",amount:void 0,message:"",signature:""}),x=function(){var e=Object(f.a)(p.a.mark((function e(t){var n,c,r;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),n=t.currentTarget,l(!0),!n.checkValidity()||d){e.next=15;break}return c=Object(w.a)({},n),r=Object.values(c).slice(1,4).map((function(e){return e.value})),h.current.to=r[0],h.current.amount=r[1],h.current.message=r[2],e.next=11,N(JSON.stringify(h.current));case 11:h.current.signature=e.sent,b(!0),e.next=16;break;case 15:n.checkValidity()&&(localStorage.setItem("transactions",JSON.stringify([].concat(Object(O.a)(a.verifiedTrans),[h.current]))),b(!1),l(!1));case 16:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return Object(j.jsxs)("div",{className:"container-fluid d-flex justify-content-center mx-auto row mb-2",children:[Object(j.jsx)(P,{validated:s,handleSubmit:x}),Object(j.jsx)(V,{validated:s,setValidated:l,setSigned:b,handleSubmit:x,details:h.current})]})}function D(){var e,t=Object(n.useContext)(y).state,a=Object(n.useState)([!1]),c=Object(i.a)(a,2),r=c[0],s=c[1];return Object(j.jsxs)("div",{className:"container-fluid mb-2",children:[Object(j.jsx)("h3",{className:"font-weight-bold",children:" Users"}),Object(j.jsx)("div",{id:"list-background",children:null===(e=t.users)||void 0===e?void 0:e.map((function(e){return Object(j.jsxs)(v.a,{className:"item",children:[Object(j.jsxs)(v.a.Group,{children:[Object(j.jsx)(v.a.Label,{children:Object(j.jsx)("h5",{className:r?"my-0":"mt-1",children:"Public Key:"})}),Object(j.jsx)(v.a.Control,{type:"text",className:"text-truncate",onFocus:function(e){return g(e,s)},defaultValue:e.publicKey,isValid:r[0]}),Object(j.jsx)(v.a.Control.Feedback,{type:"valid",children:"Copied to clipboard"})]}),Object(j.jsxs)(v.a.Group,{children:[Object(j.jsx)(v.a.Label,{children:Object(j.jsx)("h5",{className:"my-0",children:"Balance:"})}),Object(j.jsxs)("p",{children:[e.balance.toFixed(2)," LC"]})]})]},Math.random())}))})]})}function I(){return Object(j.jsxs)("div",{children:[Object(j.jsx)(b,{}),Object(j.jsx)(C,{}),Object(j.jsx)(A,{}),Object(j.jsx)(D,{})]})}function R(e){return _.apply(this,arguments)}function _(){return(_=Object(f.a)(p.a.mark((function e(t){var a,n,c;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,N(k(20));case 2:return a=e.sent,n=new RegExp("^.{0,".concat(t,"}"),"g"),c=Array(t).fill("0").join(""),e.abrupt("return",a.replace(n,c));case 6:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function L(){return(L=Object(f.a)(p.a.mark((function e(t,a,n,c,r){var s,i,l,o;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return s=Math.round(Math.random())+2,e.next=3,R(s);case 3:i=e.sent,n(i),l="",o=t;case 7:if(!(o<=Number.MAX_SAFE_INTEGER)){e.next=18;break}return e.next=10,N(o.toString());case 10:if(l=e.sent,c(l),a(o++),!l.substr(0,s).split("").every((function(e){return"0"===e}))){e.next=16;break}return e.abrupt("break",18);case 16:e.next=7;break;case 18:r(l<=i);case 19:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function J(e){var t=Object(n.useContext)(y).state,a=Object(n.useRef)(Math.round(1e6*Math.random())),c=Object(n.useState)(),r=Object(i.a)(c,2),s=r[0],l=r[1],o=Object(n.useState)(),u=Object(i.a)(o,2),d=u[0],b=u[1];return Object(j.jsxs)("div",{className:e.chain?"bordered-background":"col-11 col-lg-5 mx-3",children:[Object(j.jsxs)(E.a,{className:"my-2",children:[Object(j.jsx)(E.a.Prepend,{children:Object(j.jsx)(E.a.Text,{children:"Nonce"})}),Object(j.jsx)(v.a.Control,{type:"number",defaultValue:e.solution?a.current:"",disabled:!0})]}),Object(j.jsxs)(E.a,{className:"my-2",children:[Object(j.jsx)(E.a.Prepend,{children:Object(j.jsx)(E.a.Text,{children:"Header"})}),Object(j.jsx)(v.a.Control,{type:"number",defaultValue:s,disabled:!0})]}),Object(j.jsxs)(E.a,{className:"my-2",children:[Object(j.jsx)(E.a.Prepend,{children:Object(j.jsx)(E.a.Text,{className:"font-weight-bold",children:"Target"})}),Object(j.jsx)(v.a.Control,{type:"text",defaultValue:d,disabled:!0})]}),Object(j.jsxs)(E.a,{className:"my-2",children:[Object(j.jsx)(E.a.Prepend,{children:Object(j.jsx)(E.a.Text,{children:"Sol'n"})}),Object(j.jsx)(v.a.Control,{type:"text",style:e.isValid?{color:"green"}:{color:"red"},defaultValue:e.solution,disabled:!0})]}),Object(j.jsx)(m.a,{variant:"primary",className:"btn-block d-block mt-3",disabled:e.isValid||0===t.selectedTrans.length,onClick:function(){return function(e,t,a,n,c){return L.apply(this,arguments)}(a.current,l,b,e.setSolution,e.setIsValid)},children:Object(j.jsx)("h4",{className:"m-0",children:"Mine"})})]})}a(33);function K(e){var t=e.details,a=Object(n.useState)(""),c=Object(i.a)(a,2),r=c[0],s=c[1],l=Object(n.useState)(!0),o=Object(i.a)(l,2),u=o[0],d=o[1],b=Object(n.useState)(Date.now()),h=Object(i.a)(b,2)[1];return Object(n.useEffect)((function(){return h(Date.now())}),[r]),Object(j.jsxs)("div",{className:"d-flex flex-column justify-content-center my-3 p-2 rounded "+(u?"valid-block":"invalid-block"),children:[Object(j.jsxs)(v.a,{className:"block col-12",children:[Object(j.jsxs)(E.a,{className:"my-2",children:[Object(j.jsx)(E.a.Prepend,{children:Object(j.jsx)(E.a.Text,{children:"Index"})}),Object(j.jsx)(v.a.Control,{type:"number",defaultValue:t.index,disabled:!0})]}),Object(j.jsxs)(E.a,{className:"my-2",children:[Object(j.jsx)(E.a.Prepend,{children:Object(j.jsx)(E.a.Text,{children:"Timestamp"})}),Object(j.jsx)(v.a.Control,{type:"number",defaultValue:t.timestamp,disabled:!0})]}),Object(j.jsxs)(E.a,{className:"my-2",children:[Object(j.jsx)(E.a.Prepend,{children:Object(j.jsx)(E.a.Text,{children:"Previous #"})}),Object(j.jsx)(v.a.Control,{type:"text",defaultValue:t.prevHash,disabled:!0})]}),Object(j.jsxs)(E.a,{className:"my-2",children:[Object(j.jsx)(E.a.Prepend,{children:Object(j.jsx)(E.a.Text,{children:"Current #"})}),Object(j.jsx)(v.a.Control,{type:"text",defaultValue:t.currHash,disabled:!0})]}),Object(j.jsxs)(E.a,{className:"my-2",children:[Object(j.jsx)(E.a.Prepend,{children:Object(j.jsx)(E.a.Text,{children:"Merkle #"})}),Object(j.jsx)(v.a.Control,{type:"text",defaultValue:"abc"})]})]}),Object(j.jsx)(J,{chain:!0,solution:r,setSolution:s,isValid:u,setIsValid:d})]})}function U(){var e=Object(n.useContext)(y).state;return Object(j.jsx)("div",{id:"blockchain",children:e.chain.map((function(e){return Object(j.jsxs)("div",{className:"block-and-chain",children:[Object(j.jsx)(K,{details:e}),Object(j.jsx)("div",{className:"chain",children:"\ud83d\udd17"})]},Math.random())}))})}function M(){return Object(j.jsxs)("div",{children:[Object(j.jsx)(b,{}),Object(j.jsx)(U,{})]})}var F=a(6),G=a(24),B=a(35),H=a(36),W=function(){function e(t){Object(B.a)(this,e),this.value=void 0,this.children=void 0,this.parent=void 0,this.pos=void 0,this.value=t,this.children=[],this.parent=null,this.pos={x:0,y:0}}return Object(H.a)(e,[{key:"left",get:function(){return this.children[0]},set:function(e){e.parent=this,this.children[0]=e}},{key:"right",get:function(){return this.children[1]},set:function(e){e.parent=this,this.children[1]=e}},{key:"position",get:function(){return this.pos},set:function(e){this.pos=e}}]),e}(),Y=Object(G.a)("root"),q=Object(G.a)("startPosition"),z=Object(G.a)("dim"),X=Object(G.a)("ctx"),Z=function(){function e(t){Object(B.a)(this,e),Object.defineProperty(this,Y,{writable:!0,value:void 0}),Object.defineProperty(this,q,{writable:!0,value:void 0}),Object.defineProperty(this,z,{writable:!0,value:void 0}),Object.defineProperty(this,X,{writable:!0,value:void 0}),Object(F.a)(this,Y)[Y]=null,Object(F.a)(this,q)[q]={x:window.innerWidth/2-210,y:5},Object(F.a)(this,X)[X]=t.getContext("2d"),Object(F.a)(this,z)[z]={width:t.width,height:t.height}}return Object(H.a)(e,[{key:"calculatePosition",value:function(e){var t=e.x,a=e.y,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],c=50;return{x:n?t-6*c:t+6*c,y:a+c}}},{key:"clear",value:function(){Object(F.a)(this,X)[X]&&Object(F.a)(this,X)[X].clearRect(0,0,Object(F.a)(this,z)[z].width,Object(F.a)(this,z)[z].height)}},{key:"addNode",value:function(e){var t=new W(""!==e?e.slice(0,25)+"...":"");if(Object(F.a)(this,Y)[Y])for(var a=Object(F.a)(this,Y)[Y];a;){if(!a.left){t.position=this.calculatePosition(a.position,!0),a.left=t;break}if(!a.right){t.position=this.calculatePosition(a.position),a.right=t;break}a=a.left.left&&a.left.right?a.right:a.left}else t.position=Object(F.a)(this,q)[q],Object(F.a)(this,Y)[Y]=t}},{key:"drawTree",value:function(){var e=this,t=[];for(t.push(Object(F.a)(this,Y)[Y]);0!==t.length;){var a=t.shift(),n=a&&9*a.value.length;Object(F.a)(this,X)[X]&&n&&a&&function(){var c,r=a.position,s=r.x,i=r.y;Object(F.a)(e,X)[X].beginPath(),Object(F.a)(e,X)[X].font="1rem Arial",Object(F.a)(e,X)[X].strokeStyle="#000",Object(F.a)(e,X)[X].fillStyle=a.value===(null===(c=Object(F.a)(e,Y)[Y])||void 0===c?void 0:c.value)?"#dfd":"#ddf",Object(F.a)(e,X)[X].fillRect(s-n/2,i+5,n,30),Object(F.a)(e,X)[X].fillStyle="#000",Object(F.a)(e,X)[X].fillText(a.value,s+10-n/2,i+25),a.children.forEach((function(a,n){a.position.x=1===n?a.position.x-150:a.position.x+150,t.push(a),Object(F.a)(e,X)[X]&&(Object(F.a)(e,X)[X].beginPath(),Object(F.a)(e,X)[X].moveTo(s,i+35),Object(F.a)(e,X)[X].lineTo(a.position.x,a.position.y+5),Object(F.a)(e,X)[X].stroke())}))}()}}}]),e}();function Q(){return(Q=Object(f.a)(p.a.mark((function e(t,a,n){var c,r,s,i,l,o,u;return p.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(a.length>0)){e.next=28;break}c=t.map((function(e){return e.signature})),r=a.map((function(e){return e.signature})),s=c.filter((function(e){return r.includes(e)})),i=[s];case 5:if(1===s.length){e.next=25;break}l=[],o=0;case 8:if(!(o<s.length)){e.next=21;break}if(!s[o+1]){e.next=15;break}return e.next=12,N(s[o]+s[o+1]);case 12:e.t0=e.sent,e.next=16;break;case 15:e.t0=s[o];case 16:u=e.t0,l.push(u);case 18:o+=2,e.next=8;break;case 21:s=l,i.push(l),e.next=5;break;case 25:n(i),e.next=29;break;case 28:n([[""]]);case 29:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var $=function(e,t){switch(t.type){case h.UPDATE_VERIFIED_TRANS:var a=ee(e.selectedTrans,e.verifiedTrans);return Object(w.a)(Object(w.a)({},e),{},{verifiedTrans:a});case h.UPDATE_SELECTED_TRANS:return Object(w.a)(Object(w.a)({},e),{},{selectedTrans:t.payload.selectedTrans});case h.UPDATE_USERS:return Object(w.a)(Object(w.a)({},e),{},{users:t.payload.users});case h.ADD_BLOCK:return Object(w.a)(Object(w.a)({},e),{},{chain:[].concat(Object(O.a)(e.chain),[t.payload.block])});default:return e}};function ee(e,t){var a=e.map((function(e){return e.signature}));return t.filter((function(e){return!a.includes(e.signature)}))}function te(){var e,t=Object(n.useContext)(y),a=t.state,c=t.dispatch,r=Object(n.useRef)(a.chain[a.chain.length-1].index+1),s=Object(n.useRef)(a.chain[a.chain.length-1].currHash),l=Object(n.useRef)(null),o=Object(n.useState)(""),u=Object(i.a)(o,2),d=u[0],b=u[1],x=Object(n.useState)(!1),p=Object(i.a)(x,2),f=p[0],g=p[1],S=Object(n.useState)(!0),N=Object(i.a)(S,2),T=N[0],k=N[1],C=Object(n.useState)(Date.now()),w=Object(i.a)(C,2),V=w[0],P=w[1],A=Object(n.useState)([[""]]),D=Object(i.a)(A,2),I=D[0],R=D[1];return Object(n.useEffect)((function(){!function(e,t,a){Q.apply(this,arguments)}(a.verifiedTrans,a.selectedTrans,R),g(!1)}),[a.selectedTrans]),Object(n.useEffect)((function(){!function(e,t){if(t){var a=new Z(t);a.clear();for(var n=function(e){for(var t=[],a=0;a<e.length;a++)t=t.concat(e[a].reverse());return t}(e),c=n.length-1;c>=0;c--)a.addNode(n[c]);a.drawTree()}}(I,l.current)}),[I]),Object(n.useEffect)((function(){return P(Date.now())}),[d]),Object(j.jsxs)("div",{className:"container-fluid row d-flex justify-content-center mx-auto my-3",children:[Object(j.jsxs)("div",{className:"text-center overflow-auto mb-2",children:[Object(j.jsx)("h4",{className:"font-weight-bold",children:"Merkle Tree Visualization"}),Object(j.jsx)("canvas",{ref:l,className:"border border-dark",width:1500})]}),Object(j.jsx)(J,{chain:!1,solution:d,setSolution:b,isValid:f,setIsValid:g}),Object(j.jsxs)(v.a,{className:"block col-10 col-lg-5 my-4 my-lg-0 pb-2 "+(f?"valid-block":"invalid-block"),children:[Object(j.jsxs)(E.a,{className:"my-2",children:[Object(j.jsx)(E.a.Prepend,{children:Object(j.jsx)(E.a.Text,{children:"Index"})}),Object(j.jsx)(v.a.Control,{type:"number",defaultValue:r.current,disabled:!0})]}),Object(j.jsxs)(E.a,{className:"my-2",children:[Object(j.jsx)(E.a.Prepend,{children:Object(j.jsx)(E.a.Text,{children:"Timestamp"})}),Object(j.jsx)(v.a.Control,{type:"number",defaultValue:V,disabled:!0})]}),Object(j.jsxs)(E.a,{className:"my-2",children:[Object(j.jsx)(E.a.Prepend,{children:Object(j.jsx)(E.a.Text,{children:"Previous #"})}),Object(j.jsx)(v.a.Control,{type:"text",defaultValue:s.current,disabled:!0})]}),Object(j.jsxs)(E.a,{className:"my-2",children:[Object(j.jsx)(E.a.Prepend,{children:Object(j.jsx)(E.a.Text,{children:"Current #"})}),Object(j.jsx)(v.a.Control,{type:"text",defaultValue:d,disabled:!0})]}),Object(j.jsxs)(E.a,{className:"my-2",children:[Object(j.jsx)(E.a.Prepend,{children:Object(j.jsx)(E.a.Text,{children:"Merkle #"})}),Object(j.jsx)(v.a.Control,{type:"text",defaultValue:(e=I,e[e.length-1][0]),disabled:!0})]}),f&&T&&Object(j.jsx)(m.a,{variant:"success",block:!0,onClick:function(){return function(){var e={index:r.current,prevHash:s.current,currHash:d,transactions:a.selectedTrans,timestamp:V};c({type:h.ADD_BLOCK,payload:{block:e}}),localStorage.setItem("chain",JSON.stringify([].concat(Object(O.a)(a.chain),[e]))),c({type:h.UPDATE_VERIFIED_TRANS}),localStorage.setItem("transactions",JSON.stringify(ee(a.selectedTrans,a.verifiedTrans))),c({type:h.UPDATE_SELECTED_TRANS,payload:{selectedTrans:[]}}),localStorage.setItem("selectedTransactions","[]"),r.current+=1,s.current=d,k(!1),g(!1),b(""),P(Date.now())}()},children:Object(j.jsx)("h3",{className:"my-0 font-weight-bold",children:"+"})})]})]})}function ae(){var e=Object(n.useContext)(y),t=e.state,a=e.dispatch;return Object(j.jsxs)("div",{className:"container-fluid",children:[Object(j.jsx)("h3",{className:"font-weight-bold",children:"Verified Transactions"}),Object(j.jsx)("div",{id:"list-background",children:t.verifiedTrans.map((function(e){return Object(j.jsxs)("div",{className:"trans-item "+(t.selectedTrans.map((function(e){return e.signature})).includes(e.signature)?"selected":"not-selected"),onClick:function(){return function(e){var t=JSON.parse(localStorage.getItem("selectedTransactions"))||[],n=t.map((function(e){return e.signature})).includes(e.signature);t.length<4||n?(n?t=t.filter((function(t){return t.signature!==e.signature})):t.push(e),a({type:h.UPDATE_SELECTED_TRANS,payload:{selectedTrans:t}}),localStorage.setItem("selectedTransactions",JSON.stringify(t))):alert("You can mine at most 4 transactions at a time!")}(e)},children:[Object(j.jsxs)(v.a.Group,{className:"mb-2 text-center",children:[Object(j.jsx)(v.a.Control,{type:"text",defaultValue:e.from,disabled:!0}),Object(j.jsx)("h3",{className:"my-0",children:"\u2193"}),Object(j.jsx)(v.a.Control,{type:"text",defaultValue:e.to,disabled:!0})]}),Object(j.jsxs)(E.a,{className:"mb-2",children:[Object(j.jsx)(E.a.Prepend,{children:Object(j.jsx)(E.a.Text,{children:"Msg"})}),Object(j.jsx)(v.a.Control,{as:"textarea",defaultValue:e.message,disabled:!0})]}),Object(j.jsxs)(E.a,{className:"mb-2",children:[Object(j.jsx)(v.a.Control,{type:"number",defaultValue:e.amount,disabled:!0}),Object(j.jsx)(E.a.Append,{children:Object(j.jsx)(E.a.Text,{children:"LC"})})]}),Object(j.jsxs)(E.a,{className:"mb-2",children:[Object(j.jsx)(E.a.Prepend,{children:Object(j.jsx)(E.a.Text,{children:"Sig"})}),Object(j.jsx)(v.a.Control,{type:"text",defaultValue:e.signature,disabled:!0})]})]},Math.random())}))})]})}function ne(){return Object(j.jsxs)("div",{children:[Object(j.jsx)(b,{}),Object(j.jsx)(ae,{}),Object(j.jsx)(te,{})]})}a(56),a(57);function ce(){var e,t,a,c,r=Object(n.useReducer)($,{verifiedTrans:null!==(e=JSON.parse(localStorage.getItem("transactions")))&&void 0!==e?e:[],selectedTrans:null!==(t=JSON.parse(localStorage.getItem("selectedTransactions")))&&void 0!==t?t:[],users:null!==(a=JSON.parse(localStorage.getItem("users")))&&void 0!==a?a:[],chain:null!==(c=JSON.parse(localStorage.getItem("chain")))&&void 0!==c?c:[{index:0,prevHash:"",currHash:new Array(256).fill("0").join(""),transactions:[],timestamp:Date.parse("04/31/2021")}]}),s=Object(i.a)(r,2),u=s[0],d=s[1],b=Object(n.useMemo)((function(){return{state:u,dispatch:d}}),[u,d]);return Object(j.jsx)(l.a,{basename:"/LibraCoin",children:Object(j.jsxs)(y.Provider,{value:b,children:[Object(j.jsx)(o.b,{exact:!0,path:"/",children:Object(j.jsx)(o.a,{to:"/wallet"})}),Object(j.jsx)(o.b,{path:"/wallet",component:I}),Object(j.jsx)(o.b,{path:"/mine",component:ne}),Object(j.jsx)(o.b,{path:"/blockchain",component:M})]})})}s.a.render(Object(j.jsx)(c.a.StrictMode,{children:Object(j.jsx)(ce,{})}),document.getElementById("root"))}},[[61,1,2]]]);
//# sourceMappingURL=main.022c28f4.chunk.js.map