(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[991],{8580:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/demo/singleCard",function(){return r(6190)}])},4756:function(e,t,r){"use strict";var n,s,i,a;function c(e){let t={[n.Spade]:"Spade",[n.Diamond]:"Diamond",[n.Heart]:"Heart",[n.Club]:"Club"};return t[e]}r.d(t,{J7:function(){return c},Rh:function(){return h},hE:function(){return n},wE:function(){return s},xo:function(){return d}}),(i=n||(n={})).Spade="S",i.Diamond="D",i.Heart="H",i.Club="C",(a=s||(s={})).Ace="A",a.Two="2",a.Three="3",a.Four="4",a.Five="5",a.Six="6",a.Seven="7",a.Eight="8",a.Nine="9",a.Ten="0",a.Jack="J",a.Queen="Q",a.King="K";let o=Object.values(n),u=Object.values(s),l=[];for(let e of o)for(let t of u)l.push("".concat(t).concat(e));class h{get visible(){return this._visible}set visible(e){this._visible=e}get cardValue(){return this._cardValue}get cardNumber(){let e=this._cardValue.slice(0,-1);return"A"===e?14:"J"===e?11:"Q"===e?12:"K"===e?13:"0"===e?10:Number(e)}get suit(){let e=this._cardValue.slice(-1),t=Object.entries(n).find(t=>{let[,r]=t;return r===e});if(t)return t[1];throw Error("Invalid suit character")}get numberSymbol(){return this._cardValue.slice(0,1)}static NewPokerCards(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];let n=new Set(t);if(n.size!==t.length)throw Error("Duplicate values are not allowed");return t.map(e=>new h(e))}constructor(e){this._visible=!1,this._cardValue=d(e)}}function d(e){let t=function(e){if(!e)return e;let t={10:"0",11:"J",12:"Q",13:"K"},r=e.charAt(e.length-1).toUpperCase(),n=e.slice(0,-1).toUpperCase();return t[n]?t[n]+r:n+r}(e);if(!l.includes(t))throw Error("Invalid card value: ".concat(e));return t}},6190:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return l}});var n=r(5893),s=r(7294),i=r(6154);class a{async getCardImage(e){return this.axios.get("/static/img/".concat(e,".png"),{responseType:"blob"})}constructor(e){if(!e)throw Error("baseUrlが定義されていません");this.axios=i.Z.create({baseURL:e}),this.axios.interceptors.request.use(e=>(console.log("Starting Request",JSON.stringify(e,null,2)),e)),this.axios.interceptors.response.use(e=>(console.log("Response",JSON.stringify(e),null,2),e))}}class c{static create(){return this.client||(this.client=new a("https://deckofcardsapi.com/")),this.client}}var o=r(1163),u=r(4756);function l(){let[e,t]=(0,s.useState)(null),r=(0,o.useRouter)(),i=null,a=r.query.card;try{a&&(i=(0,u.xo)(a))}catch(e){console.error(e.message)}let l=i;return(0,s.useEffect)(()=>{i&&(async()=>{console.log("API CALL");let e=c.create();try{let r=await e.getCardImage(l),n=URL.createObjectURL(r.data);t(n)}catch(e){console.error("カード画像取得に失敗しました。",e)}console.log("API CALL HAS DONE")})()},[l]),(0,n.jsx)("div",{children:e&&(0,n.jsx)("img",{src:e,alt:"Card"})})}}},function(e){e.O(0,[827,774,888,179],function(){return e(e.s=8580)}),_N_E=e.O()}]);