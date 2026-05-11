/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$2=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$4=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$4(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$3,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$3(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$1=t=>t,s$1=t$1.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r$2=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r$2:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$1.litHtmlPolyfillSupport;B?.(S,k),(t$1.litHtmlVersions??=[]).push("3.3.2");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=t=>(e,o)=>{ void 0!==o?o.addInitializer(()=>{customElements.define(t,e);}):customElements.define(t,e);};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o={attribute:true,type:String,converter:u$1,reflect:false,hasChanged:f$1},r$1=(t=o,e,r)=>{const{kind:n,metadata:i}=r;let s=globalThis.litPropertyMetadata.get(i);if(void 0===s&&globalThis.litPropertyMetadata.set(i,s=new Map),"setter"===n&&((t=Object.create(t)).wrapped=true),s.set(r.name,t),"accessor"===n){const{name:o}=r;return {set(r){const n=e.get.call(this);e.set.call(this,r),this.requestUpdate(o,n,t,true,r);},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===n){const{name:o}=r;return function(r){const n=this[o];e.call(this,r),this.requestUpdate(o,n,t,true,r);}}throw Error("Unsupported decorator location: "+n)};function n(t){return (e,o)=>"object"==typeof o?r$1(t,e,o):((t,e,o)=>{const r=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),r?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function r(r){return n({...r,state:true,attribute:false})}

const cardStyles = i$3 `
  :host {
    display: block;
  }

  ha-card {
    padding: 16px;
  }

  .card-header {
    font-size: 1.2em;
    font-weight: 500;
    margin-bottom: 16px;
    color: var(--primary-text-color);
  }

  .section {
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 0.85em;
    font-weight: 500;
    color: var(--secondary-text-color);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
  }

  select,
  input[type="number"],
  input[type="datetime-local"] {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid var(--divider-color, #e0e0e0);
    border-radius: 4px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    font-size: 1em;
    box-sizing: border-box;
  }

  select:focus,
  input:focus {
    outline: none;
    border-color: var(--primary-color);
  }

  .action-toggle {
    display: flex;
    gap: 8px;
  }

  .action-toggle button {
    flex: 1;
    padding: 8px;
    border: 1px solid var(--divider-color, #e0e0e0);
    border-radius: 4px;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color);
    cursor: pointer;
    font-size: 0.95em;
    transition: background 0.2s, color 0.2s;
  }

  .action-toggle button.active {
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    border-color: var(--primary-color);
  }

  .mode-toggle {
    display: flex;
    gap: 16px;
    margin-bottom: 8px;
  }

  .mode-toggle label {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 0.95em;
  }

  .control-buttons {
    display: flex;
    gap: 8px;
  }

  .btn-start {
    flex: 2;
    padding: 10px;
    background: var(--primary-color);
    color: var(--text-primary-color, #fff);
    border: none;
    border-radius: 4px;
    font-size: 1em;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-start:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-cancel-all {
    flex: 1;
    padding: 10px;
    background: var(--error-color, #f44336);
    color: #fff;
    border: none;
    border-radius: 4px;
    font-size: 0.9em;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-cancel-all:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .error-message {
    color: var(--error-color, #f44336);
    font-size: 0.85em;
    margin-top: 4px;
    padding: 8px;
    background: var(--error-color-background, rgba(244, 67, 54, 0.1));
    border-radius: 4px;
  }

  .schedule-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .schedule-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid var(--divider-color, #e0e0e0);
    background: var(--secondary-background-color, #fafafa);
    gap: 8px;
  }

  .schedule-info {
    flex: 1;
    min-width: 0;
  }

  .schedule-entity {
    font-weight: 500;
    font-size: 0.95em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .schedule-details {
    font-size: 0.8em;
    color: var(--secondary-text-color);
    margin-top: 2px;
  }

  .schedule-countdown {
    font-size: 0.8em;
    color: var(--primary-color);
    font-weight: 500;
    margin-top: 2px;
  }

  .status-badge {
    font-size: 0.75em;
    padding: 2px 8px;
    border-radius: 12px;
    color: #fff;
    white-space: nowrap;
    font-weight: 500;
  }

  .btn-cancel-item {
    padding: 4px 8px;
    background: transparent;
    border: 1px solid var(--error-color, #f44336);
    color: var(--error-color, #f44336);
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8em;
    white-space: nowrap;
  }

  .btn-cancel-item:hover {
    background: var(--error-color, #f44336);
    color: #fff;
  }

  .idle-message {
    color: var(--secondary-text-color);
    font-size: 0.9em;
    font-style: italic;
    text-align: center;
    padding: 12px;
  }

  .history-section {
    margin-top: 12px;
  }

  .history-toggle {
    background: none;
    border: none;
    color: var(--secondary-text-color);
    cursor: pointer;
    font-size: 0.85em;
    padding: 4px 0;
    text-decoration: underline;
  }

  .history-list {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .history-item {
    font-size: 0.8em;
    padding: 6px 10px;
    border-radius: 4px;
    background: var(--secondary-background-color, #fafafa);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .preset-section {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .preset-section select {
    flex: 1;
  }

  .btn-load-preset {
    padding: 8px 12px;
    background: var(--secondary-background-color, #f5f5f5);
    border: 1px solid var(--divider-color, #e0e0e0);
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
    white-space: nowrap;
  }

  @media (max-width: 400px) {
    ha-card {
      padding: 12px;
    }

    .control-buttons {
      flex-direction: column;
    }

    .schedule-item {
      flex-wrap: wrap;
    }
  }
`;

const CARD_NAME = "once-timer-card";
const CARD_EDITOR_NAME = "once-timer-card-editor";
const DEFAULT_ALLOWED_DOMAINS = ["light", "switch", "fan", "media_player", "climate"];
const STATUS_COLORS = {
    scheduled: "var(--info-color, #039be5)",
    running: "var(--warning-color, #ff9800)",
    done: "var(--success-color, #4caf50)",
    error: "var(--error-color, #f44336)",
    cancelled: "var(--disabled-color, #9e9e9e)",
};

async function startTimer(hass, params) {
    await hass.callService("once_timer", "start", params);
}
async function cancelTimer(hass, scheduleId) {
    await hass.callService("once_timer", "cancel", { schedule_id: scheduleId });
}
async function savePreset(hass, params) {
    await hass.callService("once_timer", "save_preset", params);
}
async function loadPreset(hass, name) {
    await hass.callService("once_timer", "load_preset", { name });
}

function formatRemainingTime(runAtIso) {
    const runAt = new Date(runAtIso).getTime();
    const now = Date.now();
    const diffMs = runAt - now;
    if (diffMs <= 0)
        return "overdue";
    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (days > 0)
        return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0)
        return `${hours}h ${minutes}m`;
    if (minutes > 0)
        return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
}
function formatAbsoluteTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
function localDatetimeInputValue(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return (`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
        `T${pad(date.getHours())}:${pad(date.getMinutes())}`);
}
function defaultRunAt() {
    const d = new Date(Date.now() + 60 * 60 * 1000);
    return localDatetimeInputValue(d);
}

function isValidEntityId(entityId) {
    return /^[a-z_]+\.[a-z0-9_]+$/.test(entityId);
}
function isValidDelayMinutes(minutes) {
    return Number.isFinite(minutes) && minutes >= 0.1 && minutes <= 10080;
}
function isValidRunAt(isoString) {
    const date = new Date(isoString);
    return !isNaN(date.getTime()) && date > new Date();
}
function validateStartInput(params) {
    if (!params.entityId)
        return "Please select a target entity.";
    if (!isValidEntityId(params.entityId))
        return `Invalid entity ID: ${params.entityId}`;
    if (params.mode === "delay") {
        if (!isValidDelayMinutes(params.delayMinutes)) {
            return "Delay must be between 0.1 and 10080 minutes.";
        }
    }
    else {
        if (!isValidRunAt(params.runAt)) {
            return "Run-at time must be a valid future date/time.";
        }
    }
    return null;
}

let TargetSection = class TargetSection extends i {
    get _filteredEntities() {
        return Object.keys(this.hass.states)
            .filter((id) => this.allowedDomains.some((d) => id.startsWith(d + ".")))
            .sort();
    }
    _onChange(e) {
        const value = e.target.value;
        this.dispatchEvent(new CustomEvent("entity-changed", { detail: value, bubbles: true, composed: true }));
    }
    render() {
        const entities = this._filteredEntities;
        return b `
      <select .value=${this.selectedEntityId} @change=${this._onChange}>
        <option value="" ?selected=${!this.selectedEntityId}>-- Select entity --</option>
        ${entities.map((id) => b `
            <option value=${id} ?selected=${id === this.selectedEntityId}>${id}</option>
          `)}
      </select>
    `;
    }
};
TargetSection.styles = i$3 `
    select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 1em;
      box-sizing: border-box;
    }
    select:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  `;
__decorate([
    n({ attribute: false })
], TargetSection.prototype, "hass", void 0);
__decorate([
    n()
], TargetSection.prototype, "selectedEntityId", void 0);
__decorate([
    n({ type: Array })
], TargetSection.prototype, "allowedDomains", void 0);
TargetSection = __decorate([
    t("once-timer-target-section")
], TargetSection);

let ActionSection = class ActionSection extends i {
    _select(action) {
        this.dispatchEvent(new CustomEvent("action-changed", { detail: action, bubbles: true, composed: true }));
    }
    render() {
        return b `
      <div class="action-toggle">
        <button
          class=${this.selectedAction === "turn_on" ? "active" : ""}
          @click=${() => this._select("turn_on")}
        >
          Turn On
        </button>
        <button
          class=${this.selectedAction === "turn_off" ? "active" : ""}
          @click=${() => this._select("turn_off")}
        >
          Turn Off
        </button>
      </div>
    `;
    }
};
ActionSection.styles = i$3 `
    .action-toggle {
      display: flex;
      gap: 8px;
    }
    .action-toggle button {
      flex: 1;
      padding: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      cursor: pointer;
      font-size: 0.95em;
      transition: background 0.2s, color 0.2s;
    }
    .action-toggle button.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border-color: var(--primary-color);
    }
  `;
__decorate([
    n()
], ActionSection.prototype, "selectedAction", void 0);
ActionSection = __decorate([
    t("once-timer-action-section")
], ActionSection);

let TimeSection = class TimeSection extends i {
    _onModeChange(e) {
        const value = e.target.value;
        this.dispatchEvent(new CustomEvent("mode-changed", { detail: value, bubbles: true, composed: true }));
    }
    _onDelayChange(e) {
        const value = parseFloat(e.target.value);
        this.dispatchEvent(new CustomEvent("delay-changed", { detail: value, bubbles: true, composed: true }));
    }
    _onRunAtChange(e) {
        const value = e.target.value;
        // Convert local datetime-local value to ISO string
        const date = new Date(value);
        this.dispatchEvent(new CustomEvent("run-at-changed", {
            detail: date.toISOString(),
            bubbles: true,
            composed: true,
        }));
    }
    render() {
        return b `
      <div class="mode-toggle">
        <label>
          <input
            type="radio"
            name="mode"
            value="delay"
            ?checked=${this.mode === "delay"}
            @change=${this._onModeChange}
          />
          In X minutes
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="absolute_time"
            ?checked=${this.mode === "absolute_time"}
            @change=${this._onModeChange}
          />
          At exact time
        </label>
      </div>

      ${this.mode === "delay"
            ? b `
            <input
              type="number"
              min="0.1"
              max="10080"
              step="0.5"
              .value=${String(this.delayMinutes)}
              @input=${this._onDelayChange}
              placeholder="Minutes"
            />
          `
            : b `
            <input
              type="datetime-local"
              .value=${this.runAt}
              @input=${this._onRunAtChange}
            />
          `}
    `;
    }
};
TimeSection.styles = i$3 `
    .mode-toggle {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;
    }
    .mode-toggle label {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      font-size: 0.95em;
    }
    input[type="number"],
    input[type="datetime-local"] {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 1em;
      box-sizing: border-box;
    }
    input:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  `;
__decorate([
    n()
], TimeSection.prototype, "mode", void 0);
__decorate([
    n({ type: Number })
], TimeSection.prototype, "delayMinutes", void 0);
__decorate([
    n()
], TimeSection.prototype, "runAt", void 0);
TimeSection = __decorate([
    t("once-timer-time-section")
], TimeSection);

let ControlSection = class ControlSection extends i {
    constructor() {
        super(...arguments);
        this.loading = false;
        this.disabled = false;
        this.hasActive = false;
    }
    _onStart() {
        this.dispatchEvent(new CustomEvent("start", { bubbles: true, composed: true }));
    }
    _onCancelAll() {
        this.dispatchEvent(new CustomEvent("cancel-all", { bubbles: true, composed: true }));
    }
    render() {
        return b `
      <div class="control-buttons">
        <button
          class="btn-start"
          ?disabled=${this.disabled || this.loading}
          @click=${this._onStart}
        >
          ${this.loading ? "Scheduling…" : "▶ Start Timer"}
        </button>
        <button
          class="btn-cancel-all"
          ?disabled=${!this.hasActive || this.loading}
          @click=${this._onCancelAll}
        >
          Cancel All
        </button>
      </div>
    `;
    }
};
ControlSection.styles = i$3 `
    .control-buttons {
      display: flex;
      gap: 8px;
    }
    .btn-start {
      flex: 2;
      padding: 10px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border: none;
      border-radius: 4px;
      font-size: 1em;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn-start:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-cancel-all {
      flex: 1;
      padding: 10px;
      background: var(--error-color, #f44336);
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 0.9em;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn-cancel-all:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    @media (max-width: 400px) {
      .control-buttons {
        flex-direction: column;
      }
    }
  `;
__decorate([
    n({ type: Boolean })
], ControlSection.prototype, "loading", void 0);
__decorate([
    n({ type: Boolean })
], ControlSection.prototype, "disabled", void 0);
__decorate([
    n({ type: Boolean })
], ControlSection.prototype, "hasActive", void 0);
ControlSection = __decorate([
    t("once-timer-control-section")
], ControlSection);

let StatusSection = class StatusSection extends i {
    constructor() {
        super(...arguments);
        this.schedules = [];
        this.history = [];
        this.showHistory = false;
        this._tick = 0;
        this._showHistory = false;
    }
    connectedCallback() {
        super.connectedCallback();
        this._interval = setInterval(() => {
            this._tick++;
        }, 10000);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        if (this._interval)
            clearInterval(this._interval);
    }
    _cancelSchedule(scheduleId) {
        this.dispatchEvent(new CustomEvent("cancel-schedule", {
            detail: scheduleId,
            bubbles: true,
            composed: true,
        }));
    }
    _renderStatusBadge(status) {
        const color = STATUS_COLORS[status] ?? "#9e9e9e";
        return b `
      <span class="status-badge" style="background:${color}">${status}</span>
    `;
    }
    _renderScheduleItem(schedule) {
        const isActive = schedule.status === "scheduled" || schedule.status === "running";
        return b `
      <div class="schedule-item">
        <div class="schedule-info">
          <div class="schedule-entity">${schedule.entity_id}</div>
          <div class="schedule-details">
            ${schedule.action} · ${formatAbsoluteTime(schedule.run_at)}
          </div>
          ${isActive
            ? b `<div class="schedule-countdown">
                ⏱ ${formatRemainingTime(schedule.run_at)}
              </div>`
            : ""}
          ${schedule.last_error
            ? b `<div class="schedule-error">⚠ ${schedule.last_error}</div>`
            : ""}
        </div>
        <div class="schedule-actions">
          ${this._renderStatusBadge(schedule.status)}
          ${isActive
            ? b `
                <button
                  class="btn-cancel-item"
                  @click=${() => this._cancelSchedule(schedule.schedule_id)}
                >
                  Cancel
                </button>
              `
            : ""}
        </div>
      </div>
    `;
    }
    render() {
        const activeSchedules = this.schedules.filter((s) => s.status === "scheduled" || s.status === "running");
        const errorSchedules = this.schedules.filter((s) => s.status === "error");
        const allVisible = [...activeSchedules, ...errorSchedules];
        return b `
      ${allVisible.length === 0
            ? b `<div class="idle-message">No active timers</div>`
            : b `
            <div class="schedule-list">
              ${allVisible.map((s) => this._renderScheduleItem(s))}
            </div>
          `}

      ${this.showHistory && this.history.length > 0
            ? b `
            <div class="history-section">
              <button
                class="history-toggle"
                @click=${() => (this._showHistory = !this._showHistory)}
              >
                ${this._showHistory ? "▲ Hide" : "▼ Show"} history
                (${this.history.length})
              </button>
              ${this._showHistory
                ? b `
                    <div class="history-list">
                      ${this.history
                    .slice()
                    .reverse()
                    .slice(0, 20)
                    .map((s) => b `
                            <div class="history-item">
                              <span>${s.entity_id} · ${s.action}</span>
                              ${this._renderStatusBadge(s.status)}
                            </div>
                          `)}
                    </div>
                  `
                : ""}
            </div>
          `
            : ""}
    `;
    }
};
StatusSection.styles = i$3 `
    .schedule-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .schedule-item {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 10px 12px;
      border-radius: 6px;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: var(--secondary-background-color, #fafafa);
      gap: 8px;
    }
    .schedule-info {
      flex: 1;
      min-width: 0;
    }
    .schedule-entity {
      font-weight: 500;
      font-size: 0.95em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .schedule-details {
      font-size: 0.8em;
      color: var(--secondary-text-color);
      margin-top: 2px;
    }
    .schedule-countdown {
      font-size: 0.8em;
      color: var(--primary-color);
      font-weight: 500;
      margin-top: 2px;
    }
    .schedule-error {
      font-size: 0.8em;
      color: var(--error-color, #f44336);
      margin-top: 2px;
    }
    .schedule-actions {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }
    .status-badge {
      font-size: 0.75em;
      padding: 2px 8px;
      border-radius: 12px;
      color: #fff;
      white-space: nowrap;
      font-weight: 500;
    }
    .btn-cancel-item {
      padding: 4px 8px;
      background: transparent;
      border: 1px solid var(--error-color, #f44336);
      color: var(--error-color, #f44336);
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8em;
    }
    .btn-cancel-item:hover {
      background: var(--error-color, #f44336);
      color: #fff;
    }
    .idle-message {
      color: var(--secondary-text-color);
      font-size: 0.9em;
      font-style: italic;
      text-align: center;
      padding: 12px;
    }
    .history-section {
      margin-top: 12px;
    }
    .history-toggle {
      background: none;
      border: none;
      color: var(--secondary-text-color);
      cursor: pointer;
      font-size: 0.85em;
      padding: 4px 0;
      text-decoration: underline;
    }
    .history-list {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .history-item {
      font-size: 0.8em;
      padding: 6px 10px;
      border-radius: 4px;
      background: var(--secondary-background-color, #fafafa);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }
  `;
__decorate([
    n({ type: Array })
], StatusSection.prototype, "schedules", void 0);
__decorate([
    n({ type: Array })
], StatusSection.prototype, "history", void 0);
__decorate([
    n({ type: Boolean })
], StatusSection.prototype, "showHistory", void 0);
__decorate([
    r()
], StatusSection.prototype, "_tick", void 0);
__decorate([
    r()
], StatusSection.prototype, "_showHistory", void 0);
StatusSection = __decorate([
    t("once-timer-status-section")
], StatusSection);

let OnceTimerCardEditor = class OnceTimerCardEditor extends i {
    setConfig(config) {
        this._config = config;
    }
    _valueChanged(field, value) {
        if (!this._config)
            return;
        const newConfig = { ...this._config, [field]: value };
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config: newConfig },
            bubbles: true,
            composed: true,
        }));
    }
    render() {
        if (!this._config)
            return b ``;
        return b `
      <div class="editor">
        <div class="field">
          <label>Title</label>
          <input
            type="text"
            .value=${this._config.title ?? ""}
            @input=${(e) => this._valueChanged("title", e.target.value)}
            placeholder="Once Timer"
          />
        </div>

        <div class="field">
          <label>Show history</label>
          <input
            type="checkbox"
            ?checked=${this._config.show_history ?? false}
            @change=${(e) => this._valueChanged("show_history", e.target.checked)}
          />
        </div>
      </div>
    `;
    }
};
OnceTimerCardEditor.styles = i$3 `
    .editor {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    label {
      font-size: 0.85em;
      color: var(--secondary-text-color);
      font-weight: 500;
    }
    input[type="text"] {
      padding: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 1em;
    }
  `;
__decorate([
    n({ attribute: false })
], OnceTimerCardEditor.prototype, "hass", void 0);
__decorate([
    r()
], OnceTimerCardEditor.prototype, "_config", void 0);
OnceTimerCardEditor = __decorate([
    t(CARD_EDITOR_NAME)
], OnceTimerCardEditor);

let OnceTimerCard = class OnceTimerCard extends i {
    constructor() {
        super(...arguments);
        this._selectedEntityId = "";
        this._selectedAction = "turn_off";
        this._mode = "delay";
        this._delayMinutes = 30;
        this._runAt = defaultRunAt();
        this._loading = false;
        this._error = null;
        this._selectedPreset = "";
    }
    setConfig(config) {
        if (!config)
            throw new Error("Invalid configuration");
        this._config = config;
    }
    static getConfigElement() {
        return document.createElement(CARD_EDITOR_NAME);
    }
    static getStubConfig() {
        return { type: `custom:${CARD_NAME}`, title: "Once Timer", show_history: true };
    }
    _getSchedules() {
        // The NextRunSensor exposes all schedules in its attributes
        const entry = Object.values(this.hass.states).find((e) => e.entity_id.startsWith("sensor.") && e.entity_id.endsWith("_next_run"));
        const schedules = entry?.attributes?.["schedules"];
        return Array.isArray(schedules) ? schedules : [];
    }
    _getHistory() {
        const entry = Object.values(this.hass.states).find((e) => e.entity_id.startsWith("sensor.") && e.entity_id.endsWith("_state"));
        const history = entry?.attributes?.["history"];
        return Array.isArray(history) ? history : [];
    }
    _getPresets() {
        const entry = Object.values(this.hass.states).find((e) => e.entity_id.startsWith("sensor.") && e.entity_id.endsWith("_state"));
        const presets = entry?.attributes?.["presets"];
        return Array.isArray(presets) ? presets : [];
    }
    async _handleStart() {
        this._error = null;
        const validationError = validateStartInput({
            entityId: this._selectedEntityId,
            action: this._selectedAction,
            mode: this._mode,
            delayMinutes: this._delayMinutes,
            runAt: this._runAt,
        });
        if (validationError) {
            this._error = validationError;
            return;
        }
        this._loading = true;
        try {
            await startTimer(this.hass, {
                entity_id: this._selectedEntityId,
                action: this._selectedAction,
                mode: this._mode,
                ...(this._mode === "delay"
                    ? { delay_minutes: this._delayMinutes }
                    : { run_at: new Date(this._runAt).toISOString() }),
            });
        }
        catch (err) {
            this._error = `Failed to start timer: ${err}`;
        }
        finally {
            this._loading = false;
        }
    }
    async _handleCancelSchedule(scheduleId) {
        try {
            await cancelTimer(this.hass, scheduleId);
        }
        catch (err) {
            this._error = `Failed to cancel: ${err}`;
        }
    }
    async _handleCancelAll() {
        const activeSchedules = this._getSchedules().filter((s) => s.status === "scheduled" || s.status === "running");
        for (const s of activeSchedules) {
            await this._handleCancelSchedule(s.schedule_id);
        }
    }
    async _handleLoadPreset() {
        if (!this._selectedPreset)
            return;
        try {
            await loadPreset(this.hass, this._selectedPreset);
            const presets = this._getPresets();
            const preset = presets.find((p) => p.name === this._selectedPreset);
            if (preset) {
                this._selectedEntityId = preset.entity_id;
                this._selectedAction = preset.action;
                this._mode = preset.mode;
                if (preset.delay_minutes !== null) {
                    this._delayMinutes = preset.delay_minutes;
                }
            }
        }
        catch (err) {
            this._error = `Failed to load preset: ${err}`;
        }
    }
    async _handleSavePreset() {
        const name = prompt("Preset name:");
        if (!name)
            return;
        try {
            await savePreset(this.hass, {
                name,
                entity_id: this._selectedEntityId,
                action: this._selectedAction,
                mode: this._mode,
                ...(this._mode === "delay" ? { delay_minutes: this._delayMinutes } : {}),
            });
        }
        catch (err) {
            this._error = `Failed to save preset: ${err}`;
        }
    }
    render() {
        if (!this._config)
            return b ``;
        const schedules = this._getSchedules();
        const history = this._getHistory();
        const presets = this._getPresets();
        const allowedDomains = this._config.allowed_domains ?? DEFAULT_ALLOWED_DOMAINS;
        const activeSchedules = schedules.filter((s) => s.status === "scheduled" || s.status === "running");
        return b `
      <ha-card>
        ${this._config.title
            ? b `<div class="card-header">${this._config.title}</div>`
            : ""}

        <!-- Presets -->
        ${presets.length > 0
            ? b `
              <div class="section">
                <div class="section-title">Presets</div>
                <div class="preset-section">
                  <select
                    .value=${this._selectedPreset}
                    @change=${(e) => (this._selectedPreset = e.target.value)}
                  >
                    <option value="">-- Select preset --</option>
                    ${presets.map((p) => b `
                        <option value=${p.name} ?selected=${p.name === this._selectedPreset}>
                          ${p.is_favorite ? "★ " : ""}${p.name}
                        </option>
                      `)}
                  </select>
                  <button class="btn-load-preset" @click=${this._handleLoadPreset}>
                    Load
                  </button>
                </div>
              </div>
            `
            : ""}

        <!-- Section 1: Target -->
        <div class="section">
          <div class="section-title">Target</div>
          <once-timer-target-section
            .hass=${this.hass}
            .selectedEntityId=${this._selectedEntityId}
            .allowedDomains=${allowedDomains}
            @entity-changed=${(e) => (this._selectedEntityId = e.detail)}
          ></once-timer-target-section>
        </div>

        <!-- Section 2: Action -->
        <div class="section">
          <div class="section-title">Action</div>
          <once-timer-action-section
            .selectedAction=${this._selectedAction}
            @action-changed=${(e) => (this._selectedAction = e.detail)}
          ></once-timer-action-section>
        </div>

        <!-- Section 3: Time -->
        <div class="section">
          <div class="section-title">Time</div>
          <once-timer-time-section
            .mode=${this._mode}
            .delayMinutes=${this._delayMinutes}
            .runAt=${this._runAt}
            @mode-changed=${(e) => (this._mode = e.detail)}
            @delay-changed=${(e) => (this._delayMinutes = e.detail)}
            @run-at-changed=${(e) => (this._runAt = localDatetimeInputValue(new Date(e.detail)))}
          ></once-timer-time-section>
        </div>

        <!-- Section 4: Controls -->
        <div class="section">
          <once-timer-control-section
            .loading=${this._loading}
            .disabled=${!this._selectedEntityId}
            .hasActive=${activeSchedules.length > 0}
            @start=${this._handleStart}
            @cancel-all=${this._handleCancelAll}
          ></once-timer-control-section>

          ${this._error
            ? b `<div class="error-message">⚠ ${this._error}</div>`
            : ""}
        </div>

        <!-- Save as Preset -->
        ${this._selectedEntityId
            ? b `
              <div class="section">
                <button class="btn-load-preset" @click=${this._handleSavePreset}>
                  💾 Save as Preset
                </button>
              </div>
            `
            : ""}

        <!-- Section 5: Status -->
        <div class="section">
          <div class="section-title">Status</div>
          <once-timer-status-section
            .schedules=${schedules}
            .history=${history}
            .showHistory=${this._config.show_history ?? false}
            @cancel-schedule=${(e) => this._handleCancelSchedule(e.detail)}
          ></once-timer-status-section>
        </div>
      </ha-card>
    `;
    }
};
OnceTimerCard.styles = cardStyles;
__decorate([
    n({ attribute: false })
], OnceTimerCard.prototype, "hass", void 0);
__decorate([
    r()
], OnceTimerCard.prototype, "_config", void 0);
__decorate([
    r()
], OnceTimerCard.prototype, "_selectedEntityId", void 0);
__decorate([
    r()
], OnceTimerCard.prototype, "_selectedAction", void 0);
__decorate([
    r()
], OnceTimerCard.prototype, "_mode", void 0);
__decorate([
    r()
], OnceTimerCard.prototype, "_delayMinutes", void 0);
__decorate([
    r()
], OnceTimerCard.prototype, "_runAt", void 0);
__decorate([
    r()
], OnceTimerCard.prototype, "_loading", void 0);
__decorate([
    r()
], OnceTimerCard.prototype, "_error", void 0);
__decorate([
    r()
], OnceTimerCard.prototype, "_selectedPreset", void 0);
OnceTimerCard = __decorate([
    t(CARD_NAME)
], OnceTimerCard);
window.customCards = window.customCards ?? [];
window.customCards.push({
    type: CARD_NAME,
    name: "Once Timer",
    description: "Schedule a one-shot action on any Home Assistant entity.",
    preview: true,
});

export { OnceTimerCard };
