(this.webpackJsonplibracoin=this.webpackJsonplibracoin||[]).push([[0],{59:function(e,t,a){},64:function(e,t,a){},65:function(e,t,a){},66:function(e,t,a){},67:function(e,t,a){},69:function(e,t,a){},73:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),s=a(25),c=a.n(s),i=a(51),o=a(7),l=a(9),u=a.n(l),d=a(53),h=a(18),b=a(17),j=a(76),p=a(78),x=a(80),m=a(79),O=(a(59),a(1));function v(){return Object(O.jsxs)(x.a,{bg:"none",expand:"lg",className:"mb-3",children:[Object(O.jsx)(x.a.Brand,{href:"https://github.com/lbragile/LibraCoin",children:Object(O.jsx)("img",{src:"./assets/libracoin-logo-256.png",width:"64"})}),Object(O.jsx)(x.a.Toggle,{"aria-controls":"basic-navbar-nav"}),Object(O.jsx)(x.a.Collapse,{id:"basic-navbar-nav",children:Object(O.jsxs)(m.a,{className:"mr-auto",children:[Object(O.jsx)(m.a.Link,{href:"/LibraCoin/wallet",active:location.href.includes("/wallet"),children:"Wallet"}),Object(O.jsx)(m.a.Link,{href:"/LibraCoin/mine",active:location.href.includes("/mine"),children:"Mine"}),Object(O.jsx)(m.a.Link,{href:"/LibraCoin/blockchain",active:location.href.includes("/blockchain"),children:"Blockchain"})]})})]})}var f=a(77),y=a(75);function g(){var e,t,a=Object(n.useState)(!1),r=Object(b.a)(a,2),s=r[0],c=r[1],i=Object(n.useState)(!1),o=Object(b.a)(i,2),l=o[0],u=o[1];return Object(O.jsxs)("div",{children:[Object(O.jsx)("button",{className:"font-weight-bold btn btn-info p-3 my-5",onClick:function(){return c(!0)},children:"Make Transaction"}),Object(O.jsxs)(f.a,{show:s,centered:!0,backdrop:"static",onHide:function(){return c(!1)},children:[Object(O.jsx)(f.a.Header,{closeButton:!0,children:Object(O.jsx)("h4",{children:"LibraCoin Transaction"})}),Object(O.jsx)(f.a.Body,{children:Object(O.jsxs)(p.a,{noValidate:!0,validated:l,onSubmit:function(e){!1===e.currentTarget.checkValidity()&&(e.preventDefault(),e.stopPropagation()),u(!0)},children:[Object(O.jsxs)(p.a.Group,{controlId:"TransFrom",children:[Object(O.jsx)(p.a.Label,{children:Object(O.jsx)("b",{children:"From:"})}),Object(O.jsx)(p.a.Control,{type:"text",defaultValue:(null===(e=JSON.parse(localStorage.getItem("user")))||void 0===e?void 0:e.publicKey)||""}),Object(O.jsx)(p.a.Text,{className:"text-muted",children:"Your public key \u2192 used to verify transaction was signed using your private key"})]}),Object(O.jsxs)(p.a.Group,{controlId:"TransTo",children:[Object(O.jsx)(p.a.Label,{children:Object(O.jsx)("b",{children:"To:"})}),Object(O.jsx)(p.a.Control,{type:"text",pattern:"[A-Za-z0-9]{182,182}",required:!0}),Object(O.jsx)(p.a.Control.Feedback,{type:"invalid",children:"Must be of the same format as your public key"})]}),Object(O.jsxs)(p.a.Group,{controlId:"TransAmount",children:[Object(O.jsx)(p.a.Label,{children:Object(O.jsx)("b",{children:"Amount:"})}),Object(O.jsxs)(y.a,{className:"mb-2",children:[Object(O.jsx)(p.a.Control,{type:"text",placeholder:"1.00",onBlur:function(e){return function(e){var t,a=(null===(t=JSON.parse(localStorage.getItem("user")))||void 0===t?void 0:t.balance)||1e3;e.target.value=Math.min(Math.max(.1,+e.target.value),a).toFixed(2).toString()}(e)},required:!0}),Object(O.jsx)(y.a.Prepend,{children:Object(O.jsx)(y.a.Text,{children:"LC"})})]})]}),Object(O.jsxs)(p.a.Group,{controlId:"TransPrivate",children:[Object(O.jsx)(p.a.Label,{children:Object(O.jsx)("b",{children:"Private Key:"})}),Object(O.jsx)(p.a.Control,{type:"text",defaultValue:(null===(t=JSON.parse(localStorage.getItem("user")))||void 0===t?void 0:t.privateKey)||"",required:!0}),Object(O.jsx)(p.a.Text,{className:"text-muted",children:"This is not shared with anyone, keep this secret!"})]}),Object(O.jsx)(j.a,{variant:"primary",type:"submit",block:!0,children:"Sign"})]})})]})]})}var H=a(48);a(64);function w(e){var t=e.users,a=Object(n.useState)(!1),r=Object(b.a)(a,2),s=r[0],c=r[1],i=Object(n.useState)(!1),o=Object(b.a)(i,2),l=o[0],u=o[1],d=Object(n.useRef)({index:0,publicKey:"",balance:0});return Object(O.jsxs)("div",{children:[Object(O.jsxs)("div",{children:[Object(O.jsx)("h3",{children:Object(O.jsx)("b",{children:"Users:"})}),Object(O.jsx)("div",{id:"user-list-background",children:t.map((function(e,t){return Object(O.jsx)("div",{className:"user-item ml-3 col-1",onClick:function(){return function(e,t){d.current=Object(H.a)(Object(H.a)({},e),{},{index:t}),c(!0)}(e,t)},children:Object(O.jsx)("p",{className:"user-item-index-text",children:Object(O.jsx)("b",{children:t})})},Math.random())}))})]}),Object(O.jsxs)(f.a,{show:s,centered:!0,onHide:function(){return c(!1)},children:[Object(O.jsxs)(f.a.Header,{closeButton:!0,children:[Object(O.jsxs)(f.a.Title,{children:["User ",d.current.index," Details"]})," "]}),Object(O.jsxs)(f.a.Body,{children:[Object(O.jsxs)("div",{children:[Object(O.jsx)("h5",{children:"Public Key:"}),Object(O.jsx)(p.a.Control,{type:"text",className:"text-truncate",onFocus:function(e){return function(e){e.target.select(),e.target.setSelectionRange(0,99999),document.execCommand("copy"),u(!0)}(e)},value:d.current.publicKey,isValid:l}),Object(O.jsx)(p.a.Control.Feedback,{type:"valid",children:"Copied to clipboard"})]}),Object(O.jsxs)("div",{className:"mt-4",children:[Object(O.jsx)("h5",{children:"Balance:"}),d.current.balance.toFixed(2)," LC"]})]})]})]})}var k=a(24),S=a(40),C=a(11),D=a(31),N=function e(t,a,n,r){Object(k.a)(this,e),this.index=void 0,this.prevHash=void 0,this.currHash=void 0,this.transactions=void 0,this.timestamp=Date.now(),this.index=t,this.prevHash=a,this.currHash=n,this.transactions=r},T=function e(t,a,n,r){Object(k.a)(this,e),this.amount=void 0,this.from=void 0,this.to=void 0,this.message=void 0,this.amount=t,this.from=a,this.to=n,this.message=r},K=Object(D.a)("chain"),I=Object(D.a)("verifiedTransactions"),A=Object(D.a)("BLOCK_LIMIT"),B=Object(D.a)("users"),M=function(){function e(){Object(k.a)(this,e),Object.defineProperty(this,K,{writable:!0,value:void 0}),Object.defineProperty(this,I,{writable:!0,value:void 0}),Object.defineProperty(this,A,{writable:!0,value:2}),Object.defineProperty(this,B,{writable:!0,value:void 0});var t={type:"public",extractable:!0,algorithm:{name:"ECDSA"},usages:["verify"]},a=[new T(0,t,t)],n=Array(64).fill("0").join(""),r=this.randomHash(32).replace(/^.{0,3}/,"000");Object(C.a)(this,K)[K]=[new N(0,n,r,a)],Object(C.a)(this,I)[I]=[],Object(C.a)(this,B)[B]=[]}return Object(S.a)(e,[{key:"blockChain",get:function(){return Object(C.a)(this,K)[K]}},{key:"lastBlock",get:function(){return Object(C.a)(this,K)[K][Object(C.a)(this,K)[K].length-1]}},{key:"addUser",value:function(e){Object(C.a)(this,B)[B].push(e)}},{key:"randomHash",value:function(t){return e.bufferToHex(window.crypto.getRandomValues(new Uint32Array(t)))}},{key:"digestMessage",value:function(){var t=Object(h.a)(u.a.mark((function t(a){var n,r;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=(new TextEncoder).encode(a),t.next=3,window.crypto.subtle.digest("SHA-256",n);case 3:return r=t.sent,t.abrupt("return",e.bufferToHex(r));case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()},{key:"mine",value:function(){var e=Object(h.a)(u.a.mark((function e(t,a){var n;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:console.log("\u2692 mining..."),n="";case 2:if(!(t<=Number.MAX_SAFE_INTEGER)){e.next=13;break}return e.next=5,this.digestMessage(t.toString());case 5:if(n=e.sent,!n.substr(0,a).split("").every((function(e){return"0"===e}))){e.next=10;break}return console.log("Solved: ".concat(t)),e.abrupt("break",13);case 10:t++,e.next=2;break;case 13:return e.abrupt("return",n);case 14:case"end":return e.stop()}}),e,this)})));return function(t,a){return e.apply(this,arguments)}}()},{key:"verifyTransaction",value:function(){var t=Object(h.a)(u.a.mark((function t(a,n){var r,s;return u.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.stringToArrayBuffer(JSON.stringify(a)),t.next=3,crypto.subtle.verify({name:"ECDSA",hash:"SHA-256"},a.from,n,r);case 3:if((s=t.sent)&&(Object(C.a)(this,I)[I].push(a),console.log("\u2705 Verified Transaction!"),console.log("Transaction Pool Now Has ".concat(Object(C.a)(this,I)[I].length," Verified Transactions"))),Object(C.a)(this,I)[I].length!==Object(C.a)(this,A)[A]){t.next=9;break}return t.next=8,this.addBlock(Object(C.a)(this,I)[I]);case 8:Object(C.a)(this,I)[I]=[];case 9:return t.abrupt("return",s);case 10:case"end":return t.stop()}}),t,this)})));return function(e,a){return t.apply(this,arguments)}}()},{key:"addBlock",value:function(){var e=Object(h.a)(u.a.mark((function e(t){var a,n,r,s,c,i,o,l;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=Math.round(2*Math.random())+2,e.next=3,this.digestMessage(this.randomHash(20));case 3:n=e.sent,r=new RegExp("^.{0,".concat(a,"}"),"g"),s=Array(a).fill("0").join(""),c=n.replace(r,s);case 7:return i=Math.round(999999999*Math.random()),e.next=11,this.mine(i,a);case 11:if(!((o=e.sent)<=c)){e.next=19;break}return l=new N(this.lastBlock.index+1,this.lastBlock.currHash,o,t),Object(C.a)(this,K)[K].push(l),console.log("\u2728 Added Block To Chain"),e.abrupt("break",22);case 19:console.log("\u274c Failed Mining Below Target");case 20:e.next=7;break;case 22:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()}],[{key:"stringToArrayBuffer",value:function(e){for(var t=new ArrayBuffer(2*e.length),a=new Uint16Array(t),n=0,r=e.length;n<r;n++)a[n]=e.charCodeAt(n);return t}},{key:"bufferToHex",value:function(e){return Array.from(new Uint8Array(e)).map((function(e){return e.toString(16).padStart(2,"0")})).join("")}}]),e}();M.instance=new M;var L=function(){function e(){Object(k.a)(this,e),this.publicKey=void 0,this.privateKey=void 0,this.balance=void 0,this.publicKey={type:"public",extractable:!0,algorithm:{name:"ECDSA"},usages:["verify"]},this.privateKey={type:"private",extractable:!0,algorithm:{name:"ECDSA"},usages:["sign"]},this.balance=1e3}return Object(S.a)(e,[{key:"initialize",value:function(){var e=Object(h.a)(u.a.mark((function e(){var t;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.crypto.subtle.generateKey({name:"ECDSA",namedCurve:"P-256"},!0,["sign","verify"]);case 2:t=e.sent,this.publicKey=t.publicKey,this.privateKey=t.privateKey;case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getMessageEncoding",value:function(e){return(new TextEncoder).encode(e)}},{key:"sendMoney",value:function(){var e=Object(h.a)(u.a.mark((function e(t,a,n){var r,s,c;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!(t<=this.balance)){e.next=12;break}return r=new T(t,this.publicKey,a,n),s=M.stringToArrayBuffer(JSON.stringify(r)),e.next=5,window.crypto.subtle.sign({name:"ECDSA",hash:"SHA-256"},this.privateKey,s);case 5:return c=e.sent,e.next=8,M.instance.verifyTransaction(r,c);case 8:e.sent?this.balance-=t:alert("Invalid transaction!"),e.next=13;break;case 12:alert("Your balance is not high enough to cover this transaction.");case 13:case"end":return e.stop()}}),e,this)})));return function(t,a,n){return e.apply(this,arguments)}}()}],[{key:"CryptoKeyToHex",value:function(){var e=Object(h.a)(u.a.mark((function e(t,a){var n;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,window.crypto.subtle.exportKey(t,a);case 2:return n=e.sent,e.abrupt("return",M.bufferToHex(n));case 4:case"end":return e.stop()}}),e)})));return function(t,a){return e.apply(this,arguments)}}()}]),e}();a(65);function V(){var e,t,a=Object(n.useRef)(null),r=Object(n.useRef)(null),s=Object(n.useState)([!1,!1]),c=Object(b.a)(s,2),i=c[0],o=c[1],l=Object(n.useState)(localStorage.getItem("users")?JSON.parse(localStorage.getItem("users")):[]),x=Object(b.a)(l,2),m=x[0],f=x[1],y=function(){var e=Object(h.a)(u.a.mark((function e(){var t,n,s,c;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=new L,e.next=3,t.initialize();case 3:return e.next=5,L.CryptoKeyToHex("spki",t.publicKey);case 5:return n=e.sent,e.next=8,L.CryptoKeyToHex("pkcs8",t.privateKey);case 8:s=e.sent,a.current&&r.current&&(a.current.innerText=n,r.current.innerText=new Array(s.length).fill("\u25e6").join("")),c=[].concat(Object(d.a)(m),[{publicKey:n,balance:t.balance}]),localStorage.setItem("user",JSON.stringify({publicKey:n,privateKey:s,balance:t.balance})),localStorage.setItem("users",JSON.stringify(c)),f(c);case 14:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();function H(e,t){e.target.select(),e.target.setSelectionRange(0,99999),document.execCommand("copy");var a="public"===t;o([a,!a&&!e.target.value.includes("\u25e6")])}return Object(O.jsxs)("div",{className:"container-fluid my-3",children:[Object(O.jsx)(v,{}),Object(O.jsxs)("div",{className:"row",children:[(null===(e=JSON.parse(localStorage.getItem("user")))||void 0===e?void 0:e.publicKey)?Object(O.jsx)("div",{className:"col-1"}):Object(O.jsx)("div",{className:"col-2",children:Object(O.jsx)(j.a,{variant:"primary",className:"p-3 font-weight-bold",onClick:y,children:"Create Wallet"})}),Object(O.jsx)("div",{className:"col-5",children:Object(O.jsxs)("div",{className:"user-key",children:[Object(O.jsx)("h3",{className:"mb-3",children:"Public Key:"}),Object(O.jsx)(p.a.Control,{as:"textarea",rows:7,className:"userKey",defaultValue:localStorage.getItem("user")&&JSON.parse(localStorage.getItem("user")).publicKey,isValid:i[0],onFocus:function(e){return H(e,"public")},ref:a}),Object(O.jsx)(p.a.Control.Feedback,{type:"valid",children:"Copied to clipboard!"})]})}),Object(O.jsx)("div",{className:"col-5",children:Object(O.jsxs)("div",{className:"user-key",children:[Object(O.jsxs)("h3",{className:"mb-3",children:["Private Key:"," ",(null===(t=JSON.parse(localStorage.getItem("user")))||void 0===t?void 0:t.publicKey)&&Object(O.jsx)("span",{id:"private-reveal-eyes",onClick:function(){r.current&&(r.current.value.includes("\u25e6")?r.current.value=JSON.parse(localStorage.getItem("user")).privateKey:r.current.value=new Array(r.current.value.length).fill("\u25e6").join(""))},children:"\ud83d\udc40"})]}),Object(O.jsx)(p.a.Control,{as:"textarea",rows:7,className:"userKey",defaultValue:localStorage.getItem("user")?new Array(JSON.parse(localStorage.getItem("user")).privateKey.length).fill("\u25e6").join(""):"",onFocus:function(e){return H(e,"private")},isValid:i[1],ref:r}),Object(O.jsx)(p.a.Control.Feedback,{type:"valid",children:"Copied to clipboard!"})]})})]}),Object(O.jsx)(g,{}),Object(O.jsx)(w,{users:m})]})}a(66);function J(e){var t=e.details,a=Object(n.useState)(!1),r=Object(b.a)(a,2),s=r[0],c=r[1],i=Object(n.useRef)({index:0,prevHash:"",currHash:"",transactions:[],timestamp:Date.now()});return Object(O.jsxs)("div",{className:"container-fluid mx-5 row",children:[t.map((function(e,t){return Object(O.jsxs)("div",{className:"row block-and-chain my-2",children:[Object(O.jsx)("div",{className:"block-background "+(t>2?"invalid-block":"valid-block"),onClick:function(){i.current=e,c(!0)},children:Object(O.jsx)("div",{className:"block-counter",children:t})}),Object(O.jsx)("div",{className:"chain-link",children:"\ud83d\udd17"})]},Math.random())})),Object(O.jsxs)(f.a,{show:s,centered:!0,onHide:function(){return c(!1)},children:[Object(O.jsx)(f.a.Header,{closeButton:!0,children:Object(O.jsx)(f.a.Title,{children:"Block Details"})}),Object(O.jsx)(f.a.Body,{children:Object(O.jsxs)(p.a,{children:[Object(O.jsxs)(p.a.Group,{controlId:"index-indicator",children:[Object(O.jsx)(p.a.Label,{children:Object(O.jsx)("h5",{children:"Index:"})}),Object(O.jsx)(p.a.Control,{type:"number",defaultValue:i.current.index})]}),Object(O.jsxs)(p.a.Group,{controlId:"index-indicator",children:[Object(O.jsx)(p.a.Label,{children:Object(O.jsx)("h5",{children:"Timestamp:"})}),Object(O.jsx)(p.a.Control,{type:"number",defaultValue:i.current.timestamp})]}),Object(O.jsxs)(p.a.Group,{controlId:"prevHash-indicator",children:[Object(O.jsx)(p.a.Label,{children:Object(O.jsx)("h5",{children:"Previous Hash:"})}),Object(O.jsx)(p.a.Control,{type:"text",defaultValue:i.current.prevHash})]}),Object(O.jsxs)(p.a.Group,{controlId:"prevHash-indicator",children:[Object(O.jsx)(p.a.Label,{children:Object(O.jsx)("h5",{children:"Current Hash:"})}),Object(O.jsx)(p.a.Control,{type:"text",defaultValue:i.current.currHash})]}),Object(O.jsxs)(p.a.Group,{controlId:"prevHash-indicator",children:[Object(O.jsx)(p.a.Label,{children:Object(O.jsx)("h5",{children:"Merkle Root:"})}),Object(O.jsx)(p.a.Control,{type:"text",defaultValue:JSON.stringify(i.current.transactions)})]})]})})]})]})}function P(){return Object(O.jsxs)("div",{children:[Object(O.jsx)(v,{}),Object(O.jsx)(J,{details:[{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()},{index:0,prevHash:"",currHash:"0000000000000000000000000000000000000000000",transactions:[],timestamp:Date.now()}]})]})}a(67);function E(){var e=Object(n.useRef)({index:0,timestamp:Date.now(),prevHash:"00000000000000000...",currHash:"000absd234hdsf84h5...",transactions:[]}),t=Object(n.useRef)({nonce:654,target:"000wld823nfwe3024rin...",solution:"000absd234hdsf84h5..."});return Object(O.jsxs)("div",{className:"container-fluid",children:[Object(O.jsx)(v,{}),Object(O.jsx)("div",{id:"verified-transaction",children:Object(O.jsx)("h3",{children:"Verified Transactions:"})}),Object(O.jsxs)("div",{className:"row",children:[Object(O.jsxs)("div",{id:"mine-interactive-area",children:[Object(O.jsxs)("div",{id:"statistics",children:[Object(O.jsxs)("p",{children:[Object(O.jsx)("b",{children:"Nonce:"})," ",t.current.nonce]}),Object(O.jsxs)("p",{children:[Object(O.jsx)("b",{children:"Target:"})," ",t.current.target]}),Object(O.jsxs)("p",{children:[Object(O.jsx)("b",{children:"Solution:"})," ",t.current.solution]})]}),Object(O.jsx)(j.a,{variant:"primary",id:"mine-add-block",children:"Mine"})]}),Object(O.jsxs)("div",{id:"mined-block",className:"valid-block",children:[Object(O.jsx)(j.a,{variant:"success",id:"mine-add-block",children:"+"}),Object(O.jsxs)("p",{children:[Object(O.jsx)("b",{children:"Index:"})," ",e.current.index]}),Object(O.jsxs)("p",{children:[Object(O.jsx)("b",{children:"Timestamp:"})," ",e.current.timestamp]}),Object(O.jsxs)("p",{children:[Object(O.jsx)("b",{children:"Previous Hash:"})," ",e.current.prevHash]}),Object(O.jsxs)("p",{children:[Object(O.jsx)("b",{children:"Current Hash:"})," ",e.current.currHash]}),Object(O.jsxs)("p",{children:[Object(O.jsx)("b",{children:"Merkle Root:"})," ","4h354kdnf380sdf234..."]})]})]})]})}a(68),a(69);function F(){return Object(O.jsxs)(i.a,{basename:"/LibraCoin",children:[Object(O.jsx)(o.a,{path:"/",component:V,exact:!0}),Object(O.jsx)(o.a,{path:"/wallet",component:V}),Object(O.jsx)(o.a,{path:"/mine",component:E}),Object(O.jsx)(o.a,{path:"/blockchain",component:P})]})}c.a.render(Object(O.jsx)(r.a.StrictMode,{children:Object(O.jsx)(F,{})}),document.getElementById("root"))}},[[73,1,2]]]);
//# sourceMappingURL=main.1222353e.chunk.js.map