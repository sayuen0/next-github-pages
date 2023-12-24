(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[540],{3454:function(t,e,n){"use strict";var r,o;t.exports=(null==(r=n.g.process)?void 0:r.env)&&"object"==typeof(null==(o=n.g.process)?void 0:o.env)?n.g.process:n(7663)},1828:function(t,e,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/demo/multiChips",function(){return n(8960)}])},8960:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return f}});var r,o,u=n(5893),i=n(7294),c=n(3454);function a(t){let{value:e}=t,[n,r]=(0,i.useState)({width:100,height:100});return(0,u.jsx)("div",{children:(0,u.jsx)("img",{src:function(t){let e=c.env.PUBLIC_PATH||"";return"".concat(e).concat(t.startsWith("/")?"":"/").concat(t)}("/static/img/chips/".concat(e,".svg")),style:{width:"".concat(n.width,"px"),height:"".concat(n.height,"px")},alt:"".concat(e,".svg")})})}var s=n(7632);(r=o||(o={}))[r.OneHundred=100]="OneHundred",r[r.FiveHundred=500]="FiveHundred",r[r.OneThousand=1e3]="OneThousand",r[r.FiveThousand=5e3]="FiveThousand";class l{get chipValue(){return this.value}get number(){return Number(this.value)}static OneHundred(){return new l(o.OneHundred)}static FiveHundred(){return new l(o.FiveHundred)}static OneThousand(){return new l(o.OneThousand)}static FiveThousand(){return new l(o.FiveThousand)}constructor(t){this.id=(0,s.Z)(),this.value=t}}function d(t){let{onToggle:e}=t,[n,r]=(0,i.useState)(!1);return(0,u.jsx)("button",{onClick:()=>{r(!n),e(!n)},children:n?"Unsort":"Sort"})}function f(){let t=l.getRandomizedArray(30),e=(0,i.useRef)(t),[n,r]=(0,i.useState)(e.current);return(0,u.jsxs)("div",{className:"flex flex-wrap",children:[(0,u.jsx)(d,{onToggle:t=>{if(t){let t=[...n].sort((t,e)=>t.value-e.value);r(t)}else r([...e.current])}}),n.map((t,e)=>(0,u.jsx)("div",{className:"transform -translate-x-".concat(e%10),children:(0,u.jsx)(a,{value:t.value})},t.id))]})}l.getRandValue=(t,e)=>Math.floor(Math.random()*(e-t+1))+t,l.getRandomizedArray=t=>{let e=[l.OneHundred,l.FiveHundred,l.OneThousand,l.FiveThousand];return Array(t).fill(0).map(()=>{let t=Math.floor(Math.random()*e.length);return e[t]()})}},7663:function(t){!function(){var e={229:function(t){var e,n,r,o=t.exports={};function u(){throw Error("setTimeout has not been defined")}function i(){throw Error("clearTimeout has not been defined")}function c(t){if(e===setTimeout)return setTimeout(t,0);if((e===u||!e)&&setTimeout)return e=setTimeout,setTimeout(t,0);try{return e(t,0)}catch(n){try{return e.call(null,t,0)}catch(n){return e.call(this,t,0)}}}!function(){try{e="function"==typeof setTimeout?setTimeout:u}catch(t){e=u}try{n="function"==typeof clearTimeout?clearTimeout:i}catch(t){n=i}}();var a=[],s=!1,l=-1;function d(){s&&r&&(s=!1,r.length?a=r.concat(a):l=-1,a.length&&f())}function f(){if(!s){var t=c(d);s=!0;for(var e=a.length;e;){for(r=a,a=[];++l<e;)r&&r[l].run();l=-1,e=a.length}r=null,s=!1,function(t){if(n===clearTimeout)return clearTimeout(t);if((n===i||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(t);try{n(t)}catch(e){try{return n.call(null,t)}catch(e){return n.call(this,t)}}}(t)}}function h(t,e){this.fun=t,this.array=e}function p(){}o.nextTick=function(t){var e=Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];a.push(new h(t,e)),1!==a.length||s||c(f)},h.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=p,o.addListener=p,o.once=p,o.off=p,o.removeListener=p,o.removeAllListeners=p,o.emit=p,o.prependListener=p,o.prependOnceListener=p,o.listeners=function(t){return[]},o.binding=function(t){throw Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(t){throw Error("process.chdir is not supported")},o.umask=function(){return 0}}},n={};function r(t){var o=n[t];if(void 0!==o)return o.exports;var u=n[t]={exports:{}},i=!0;try{e[t](u,u.exports,r),i=!1}finally{i&&delete n[t]}return u.exports}r.ab="//";var o=r(229);t.exports=o}()},7632:function(t,e,n){"use strict";let r;n.d(e,{Z:function(){return a}});let o="undefined"!=typeof crypto&&crypto.randomUUID&&crypto.randomUUID.bind(crypto);var u={randomUUID:o};let i=new Uint8Array(16),c=[];for(let t=0;t<256;++t)c.push((t+256).toString(16).slice(1));var a=function(t,e,n){if(u.randomUUID&&!e&&!t)return u.randomUUID();t=t||{};let o=t.random||(t.rng||function(){if(!r&&!(r="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)))throw Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return r(i)})();if(o[6]=15&o[6]|64,o[8]=63&o[8]|128,e){n=n||0;for(let t=0;t<16;++t)e[n+t]=o[t];return e}return function(t,e=0){return c[t[e+0]]+c[t[e+1]]+c[t[e+2]]+c[t[e+3]]+"-"+c[t[e+4]]+c[t[e+5]]+"-"+c[t[e+6]]+c[t[e+7]]+"-"+c[t[e+8]]+c[t[e+9]]+"-"+c[t[e+10]]+c[t[e+11]]+c[t[e+12]]+c[t[e+13]]+c[t[e+14]]+c[t[e+15]]}(o)}}},function(t){t.O(0,[774,888,179],function(){return t(t.s=1828)}),_N_E=t.O()}]);