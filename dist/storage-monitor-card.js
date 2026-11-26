/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis, X = D.ShadowRoot && (D.ShadyCSS === void 0 || D.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, tt = Symbol(), ct = /* @__PURE__ */ new WeakMap();
let bt = class {
  constructor(t, s, i) {
    if (this._$cssResult$ = !0, i !== tt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = s;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (X && t === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (t = ct.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && ct.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Nt = (e) => new bt(typeof e == "string" ? e : e + "", void 0, tt), wt = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((i, r, o) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[o + 1], e[0]);
  return new bt(s, e, tt);
}, Pt = (e, t) => {
  if (X) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const i = document.createElement("style"), r = D.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = s.cssText, e.appendChild(i);
  }
}, ht = X ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const i of t.cssRules) s += i.cssText;
  return Nt(s);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Tt, defineProperty: Ht, getOwnPropertyDescriptor: Mt, getOwnPropertyNames: Rt, getOwnPropertySymbols: Ut, getPrototypeOf: zt } = Object, I = globalThis, dt = I.trustedTypes, Jt = dt ? dt.emptyScript : "", Dt = I.reactiveElementPolyfillSupport, P = (e, t) => e, L = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Jt : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let s = e;
  switch (t) {
    case Boolean:
      s = e !== null;
      break;
    case Number:
      s = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(e);
      } catch {
        s = null;
      }
  }
  return s;
} }, et = (e, t) => !Tt(e, t), ut = { attribute: !0, type: String, converter: L, reflect: !1, useDefault: !1, hasChanged: et };
Symbol.metadata ??= Symbol("metadata"), I.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let x = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = ut) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(t, i, s);
      r !== void 0 && Ht(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, s, i) {
    const { get: r, set: o } = Mt(this.prototype, t) ?? { get() {
      return this[s];
    }, set(a) {
      this[s] = a;
    } };
    return { get: r, set(a) {
      const n = r?.call(this);
      o?.call(this, a), this.requestUpdate(t, n, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ut;
  }
  static _$Ei() {
    if (this.hasOwnProperty(P("elementProperties"))) return;
    const t = zt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(P("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(P("properties"))) {
      const s = this.properties, i = [...Rt(s), ...Ut(s)];
      for (const r of i) this.createProperty(r, s[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const s = litPropertyMetadata.get(t);
      if (s !== void 0) for (const [i, r] of s) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, i] of this.elementProperties) {
      const r = this._$Eu(s, i);
      r !== void 0 && this._$Eh.set(r, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const s = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) s.unshift(ht(r));
    } else t !== void 0 && s.push(ht(t));
    return s;
  }
  static _$Eu(t, s) {
    const i = s.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const i of s.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Pt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, s, i) {
    this._$AK(t, i);
  }
  _$ET(t, s) {
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : L).toAttribute(s, i.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, s) {
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const o = i.getPropertyOptions(r), a = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : L;
      this._$Em = r;
      const n = a.fromAttribute(s, o.type);
      this[r] = n ?? this._$Ej?.get(r) ?? n, this._$Em = null;
    }
  }
  requestUpdate(t, s, i, r = !1, o) {
    if (t !== void 0) {
      const a = this.constructor;
      if (r === !1 && (o = this[t]), i ??= a.getPropertyOptions(t), !((i.hasChanged ?? et)(o, s) || i.useDefault && i.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, i)))) return;
      this.C(t, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, s, { useDefault: i, reflect: r, wrapped: o }, a) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, a ?? s ?? this[t]), o !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (s) {
      Promise.reject(s);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, o] of i) {
        const { wrapped: a } = o, n = this[r];
        a !== !0 || this._$AL.has(r) || n === void 0 || this.C(r, void 0, o, n);
      }
    }
    let t = !1;
    const s = this._$AL;
    try {
      t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(s)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(s);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((s) => s.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((s) => this._$ET(s, this[s])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
x.elementStyles = [], x.shadowRootOptions = { mode: "open" }, x[P("elementProperties")] = /* @__PURE__ */ new Map(), x[P("finalized")] = /* @__PURE__ */ new Map(), Dt?.({ ReactiveElement: x }), (I.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const st = globalThis, pt = (e) => e, j = st.trustedTypes, mt = j ? j.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, xt = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, At = "?" + _, Lt = `<${At}>`, b = document, T = () => b.createComment(""), H = (e) => e === null || typeof e != "object" && typeof e != "function", it = Array.isArray, jt = (e) => it(e) || typeof e?.[Symbol.iterator] == "function", q = `[ 	
\f\r]`, O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, gt = /-->/g, ft = />/g, $ = RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), _t = /'/g, $t = /"/g, St = /^(?:script|style|textarea|title)$/i, Bt = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), h = Bt(1), k = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), vt = /* @__PURE__ */ new WeakMap(), v = b.createTreeWalker(b, 129);
function kt(e, t) {
  if (!it(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return mt !== void 0 ? mt.createHTML(t) : t;
}
const It = (e, t) => {
  const s = e.length - 1, i = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = O;
  for (let n = 0; n < s; n++) {
    const l = e[n];
    let d, p, u = -1, m = 0;
    for (; m < l.length && (a.lastIndex = m, p = a.exec(l), p !== null); ) m = a.lastIndex, a === O ? p[1] === "!--" ? a = gt : p[1] !== void 0 ? a = ft : p[2] !== void 0 ? (St.test(p[2]) && (r = RegExp("</" + p[2], "g")), a = $) : p[3] !== void 0 && (a = $) : a === $ ? p[0] === ">" ? (a = r ?? O, u = -1) : p[1] === void 0 ? u = -2 : (u = a.lastIndex - p[2].length, d = p[1], a = p[3] === void 0 ? $ : p[3] === '"' ? $t : _t) : a === $t || a === _t ? a = $ : a === gt || a === ft ? a = O : (a = $, r = void 0);
    const f = a === $ && e[n + 1].startsWith("/>") ? " " : "";
    o += a === O ? l + Lt : u >= 0 ? (i.push(d), l.slice(0, u) + xt + l.slice(u) + _ + f) : l + _ + (u === -2 ? n : f);
  }
  return [kt(e, o + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class M {
  constructor({ strings: t, _$litType$: s }, i) {
    let r;
    this.parts = [];
    let o = 0, a = 0;
    const n = t.length - 1, l = this.parts, [d, p] = It(t, s);
    if (this.el = M.createElement(d, i), v.currentNode = this.el.content, s === 2 || s === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (r = v.nextNode()) !== null && l.length < n; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const u of r.getAttributeNames()) if (u.endsWith(xt)) {
          const m = p[a++], f = r.getAttribute(u).split(_), z = /([.?@])?(.*)/.exec(m);
          l.push({ type: 1, index: o, name: z[2], strings: f, ctor: z[1] === "." ? Wt : z[1] === "?" ? Vt : z[1] === "@" ? qt : F }), r.removeAttribute(u);
        } else u.startsWith(_) && (l.push({ type: 6, index: o }), r.removeAttribute(u));
        if (St.test(r.tagName)) {
          const u = r.textContent.split(_), m = u.length - 1;
          if (m > 0) {
            r.textContent = j ? j.emptyScript : "";
            for (let f = 0; f < m; f++) r.append(u[f], T()), v.nextNode(), l.push({ type: 2, index: ++o });
            r.append(u[m], T());
          }
        }
      } else if (r.nodeType === 8) if (r.data === At) l.push({ type: 2, index: o });
      else {
        let u = -1;
        for (; (u = r.data.indexOf(_, u + 1)) !== -1; ) l.push({ type: 7, index: o }), u += _.length - 1;
      }
      o++;
    }
  }
  static createElement(t, s) {
    const i = b.createElement("template");
    return i.innerHTML = t, i;
  }
}
function E(e, t, s = e, i) {
  if (t === k) return t;
  let r = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const o = H(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(e), r._$AT(e, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = r : s._$Cl = r), r !== void 0 && (t = E(e, r._$AS(e, t.values), r, i)), t;
}
class Ft {
  constructor(t, s) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = s;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: s }, parts: i } = this._$AD, r = (t?.creationScope ?? b).importNode(s, !0);
    v.currentNode = r;
    let o = v.nextNode(), a = 0, n = 0, l = i[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let d;
        l.type === 2 ? d = new U(o, o.nextSibling, this, t) : l.type === 1 ? d = new l.ctor(o, l.name, l.strings, this, t) : l.type === 6 && (d = new Kt(o, this, t)), this._$AV.push(d), l = i[++n];
      }
      a !== l?.index && (o = v.nextNode(), a++);
    }
    return v.currentNode = b, r;
  }
  p(t) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, s), s += i.strings.length - 2) : i._$AI(t[s])), s++;
  }
}
class U {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, s, i, r) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const s = this._$AM;
    return s !== void 0 && t?.nodeType === 11 && (t = s.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, s = this) {
    t = E(this, t, s), H(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== k && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : jt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && H(this._$AH) ? this._$AA.nextSibling.data = t : this.T(b.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: s, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = M.createElement(kt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(s);
    else {
      const o = new Ft(r, this), a = o.u(this.options);
      o.p(s), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let s = vt.get(t.strings);
    return s === void 0 && vt.set(t.strings, s = new M(t)), s;
  }
  k(t) {
    it(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, r = 0;
    for (const o of t) r === s.length ? s.push(i = new U(this.O(T()), this.O(T()), this, this.options)) : i = s[r], i._$AI(o), r++;
    r < s.length && (this._$AR(i && i._$AB.nextSibling, r), s.length = r);
  }
  _$AR(t = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); t !== this._$AB; ) {
      const i = pt(t).nextSibling;
      pt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class F {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, s, i, r, o) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = s, this._$AM = r, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = c;
  }
  _$AI(t, s = this, i, r) {
    const o = this.strings;
    let a = !1;
    if (o === void 0) t = E(this, t, s, 0), a = !H(t) || t !== this._$AH && t !== k, a && (this._$AH = t);
    else {
      const n = t;
      let l, d;
      for (t = o[0], l = 0; l < o.length - 1; l++) d = E(this, n[i + l], s, l), d === k && (d = this._$AH[l]), a ||= !H(d) || d !== this._$AH[l], d === c ? t = c : t !== c && (t += (d ?? "") + o[l + 1]), this._$AH[l] = d;
    }
    a && !r && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Wt extends F {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class Vt extends F {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class qt extends F {
  constructor(t, s, i, r, o) {
    super(t, s, i, r, o), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = E(this, t, s, 0) ?? c) === k) return;
    const i = this._$AH, r = t === c && i !== c || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== c && (i === c || r);
    r && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Kt {
  constructor(t, s, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    E(this, t);
  }
}
const Gt = st.litHtmlPolyfillSupport;
Gt?.(M, U), (st.litHtmlVersions ??= []).push("3.3.3");
const Yt = (e, t, s) => {
  const i = s?.renderBefore ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const o = s?.renderBefore ?? null;
    i._$litPart$ = r = new U(t.insertBefore(T(), o), o, void 0, s ?? {});
  }
  return r._$AI(e), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt = globalThis;
class A extends x {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Yt(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return k;
  }
}
A._$litElement$ = !0, A.finalized = !0, rt.litElementHydrateSupport?.({ LitElement: A });
const Zt = rt.litElementPolyfillSupport;
Zt?.({ LitElement: A });
(rt.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Et = (e) => (t, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Qt = { attribute: !0, type: String, converter: L, reflect: !1, hasChanged: et }, Xt = (e = Qt, t, s) => {
  const { kind: i, metadata: r } = s;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(s.name, e), i === "accessor") {
    const { name: a } = s;
    return { set(n) {
      const l = t.get.call(this);
      t.set.call(this, n), this.requestUpdate(a, l, e, !0, n);
    }, init(n) {
      return n !== void 0 && this.C(a, void 0, e, n), n;
    } };
  }
  if (i === "setter") {
    const { name: a } = s;
    return function(n) {
      const l = this[a];
      t.call(this, n), this.requestUpdate(a, l, e, !0, n);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function ot(e) {
  return (t, s) => typeof s == "object" ? Xt(e, t, s) : ((i, r, o) => {
    const a = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, i), a ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(e, t, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function C(e) {
  return ot({ ...e, state: !0, attribute: !1 });
}
const y = "en", te = {
  "card.title": "Storage",
  "card.configurePrompt": "Storage Monitor Card is not configured yet.",
  "state.unconfigured": "Not configured",
  "state.unavailable": "Unavailable",
  "state.unknown": "Unknown",
  "state.healthy": "Healthy",
  "state.warning": "Warning",
  "state.critical": "Fault",
  "summary.healthy": "All healthy",
  "summary.warning": "Needs attention",
  "summary.critical": "Issues detected",
  "summary.unknown": "Status unknown",
  "summary.maxTemperature": "Max {value} °C",
  "section.pools": "Storage pools",
  "section.raid": "RAID",
  "section.disks": "Physical disks",
  "pools.empty": "No storage pools configured",
  "pool.defaultName": "Pool {index}",
  "raid.defaultName": "Array status",
  "raid.defaultInfo": "Array information",
  "raid.level": "Level {level}",
  "raid.state": "Array state",
  "raid.progress": "Rebuild / sync progress",
  "disks.empty": "No disks configured",
  "disk.defaultName": "Disk {index}",
  "metric.used": "Used",
  "metric.free": "Free",
  "metric.total": "Total",
  "metric.capacity": "Capacity",
  "disk.powerOnHours": "Power-on",
  "disk.hours": "{value} h",
  "error.configObject": "Storage Monitor Card: the configuration must be an object.",
  "error.poolsArray": "Storage Monitor Card: pools must be an array.",
  "error.disksArray": "Storage Monitor Card: disks must be an array.",
  "editor.intro": "Storage Monitor Card configuration editor. Entity IDs are listed under Developer tools → States.",
  "editor.title": "Card title",
  "editor.subtitle": "Subtitle",
  "editor.language": "Language",
  "editor.languageAuto": "Follow Home Assistant",
  "editor.languageEnglish": "English",
  "editor.languageChinese": "简体中文",
  "editor.showPools": "Show storage pools",
  "editor.showRaid": "Show RAID",
  "editor.showDisks": "Show physical disks",
  "editor.showTemperature": "Show temperatures",
  "editor.showHealth": "Show health status",
  "editor.poolsJson": "Storage pools (JSON array)",
  "editor.disksJson": "Disks (JSON array)",
  "editor.raidJson": "RAID (JSON object)",
  "editor.jsonTypeError": "Unexpected JSON type",
  "editor.jsonFormatError": "Invalid JSON",
  "editor.jsonError": "JSON error: {error}. The card updates automatically once the JSON is valid.",
  "editor.hint": "Only valid JSON is applied to the card. You can also edit the dashboard YAML directly."
}, ee = {
  "card.title": "存储空间",
  "card.configurePrompt": "请先配置 Storage Monitor Card。",
  "state.unconfigured": "未配置",
  "state.unavailable": "不可用",
  "state.unknown": "未知",
  "state.healthy": "正常",
  "state.warning": "警告",
  "state.critical": "异常",
  "summary.healthy": "运行正常",
  "summary.warning": "需要关注",
  "summary.critical": "存在异常",
  "summary.unknown": "状态未知",
  "summary.maxTemperature": "最高 {value} °C",
  "section.pools": "存储池",
  "section.raid": "RAID / 阵列",
  "section.disks": "物理硬盘",
  "pools.empty": "尚未配置存储池",
  "pool.defaultName": "存储池 {index}",
  "raid.defaultName": "阵列状态",
  "raid.defaultInfo": "阵列信息",
  "raid.level": "级别 {level}",
  "raid.state": "阵列状态",
  "raid.progress": "重建 / 同步进度",
  "disks.empty": "尚未配置硬盘",
  "disk.defaultName": "硬盘 {index}",
  "metric.used": "已用",
  "metric.free": "剩余",
  "metric.total": "总量",
  "metric.capacity": "容量",
  "disk.powerOnHours": "通电时长",
  "disk.hours": "{value} 小时",
  "error.configObject": "Storage Monitor Card: 配置必须是对象。",
  "error.poolsArray": "Storage Monitor Card: pools 必须是数组。",
  "error.disksArray": "Storage Monitor Card: disks 必须是数组。",
  "editor.intro": "Storage Monitor Card 配置编辑器。实体 ID 可在「开发者工具 → 状态」中查找。",
  "editor.title": "卡片标题",
  "editor.subtitle": "副标题",
  "editor.language": "语言",
  "editor.languageAuto": "跟随 Home Assistant",
  "editor.languageEnglish": "English",
  "editor.languageChinese": "简体中文",
  "editor.showPools": "显示存储池",
  "editor.showRaid": "显示 RAID",
  "editor.showDisks": "显示物理硬盘",
  "editor.showTemperature": "显示温度",
  "editor.showHealth": "显示健康状态",
  "editor.poolsJson": "存储池配置（JSON 数组）",
  "editor.disksJson": "硬盘配置（JSON 数组）",
  "editor.raidJson": "RAID 配置（JSON 对象）",
  "editor.jsonTypeError": "JSON 类型不正确",
  "editor.jsonFormatError": "JSON 格式错误",
  "editor.jsonError": "JSON 错误：{error}。修正后会自动保存。",
  "editor.hint": "提示：编辑 JSON 时，只有合法 JSON 才会同步到卡片配置。也可以直接在仪表盘 YAML 编辑器中配置。"
}, K = {
  en: te,
  "zh-Hans": ee
};
function se(e, t) {
  return t ? e.replace(
    /\{(\w+)\}/g,
    (s, i) => Object.prototype.hasOwnProperty.call(t, i) ? String(t[i]) : s
  ) : e;
}
function Y(e) {
  if (typeof e != "string") return;
  const t = e.trim().replace(/_/g, "-").toLowerCase();
  if (t)
    return t === "zh" || t.startsWith("zh-") ? "zh-Hans" : "en";
}
function Z(e) {
  return e?.language ?? e?.locale?.language;
}
function Q(e, t) {
  const s = typeof e == "string" ? e.trim() : "";
  return !s || s.toLowerCase() === "auto" ? Y(t) ?? y : Y(s) ?? y;
}
function B(e = y) {
  const t = Y(e) ?? y, s = K[t] ?? K[y];
  return (i, r) => se(s[i] ?? K[y][i] ?? i, r);
}
const W = /* @__PURE__ */ new Set(["unknown", "unavailable", "none", ""]), Ct = B(y);
function S(e, t) {
  if (!(!e || !t))
    return e.states[t];
}
function Ot(e, t) {
  const s = S(e, t);
  if (!s || W.has(s.state.toLowerCase())) return null;
  const i = Number(s.state);
  return Number.isFinite(i) ? i : null;
}
function at(e, t, s = {}) {
  const i = s.t ?? Ct, r = S(e, t);
  if (!r) return { raw: null, text: i("state.unconfigured"), unit: "", entityId: t };
  const o = r.state;
  if (W.has(o.toLowerCase()))
    return { raw: null, text: o.toLowerCase() === "unavailable" ? i("state.unavailable") : i("state.unknown"), unit: "", entityId: t, state: o };
  const a = Number(o), n = String(r.attributes.unit_of_measurement ?? "");
  return {
    raw: Number.isFinite(a) ? a : null,
    text: Number.isFinite(a) ? V(a, 1, s.locale) : o,
    unit: n,
    entityId: t,
    state: o
  };
}
function V(e, t = 1, s) {
  return new Intl.NumberFormat(s, { maximumFractionDigits: t }).format(e);
}
function yt(e, t, s = "", i = {}) {
  const r = at(e, t, i);
  return r.raw === null ? r.text : `${r.text}${r.unit || s ? ` ${r.unit || s}` : ""}`;
}
function ie(e, t = "B", s) {
  const i = t.trim().toLowerCase(), r = i.endsWith("ib") || i === "b" || i === "byte" || i === "bytes", o = r ? 1024 : 1e3, a = {
    b: 1,
    byte: 1,
    bytes: 1,
    kb: 1e3,
    mb: 1e3 ** 2,
    gb: 1e3 ** 3,
    tb: 1e3 ** 4,
    pb: 1e3 ** 5,
    kib: 1024,
    mib: 1024 ** 2,
    gib: 1024 ** 3,
    tib: 1024 ** 4,
    pib: 1024 ** 5
  }, n = e * (a[i] ?? 1);
  if (!Number.isFinite(n)) return "—";
  const l = r ? ["B", "KiB", "MiB", "GiB", "TiB", "PiB"] : ["B", "KB", "MB", "GB", "TB", "PB"];
  let d = n, p = 0;
  for (; d >= o && p < l.length - 1; )
    d /= o, p++;
  const u = d >= 100 ? 1 : (d >= 10, 2);
  return `${V(d, u, s)} ${l[p]}`;
}
function re(e, t, s = {}) {
  const i = S(e, t);
  if (!i) return "—";
  const r = Number(i.state);
  if (!Number.isFinite(r)) return at(e, t, s).text;
  const o = String(i.attributes.unit_of_measurement ?? "").trim();
  return (/* @__PURE__ */ new Set(["b", "byte", "bytes", "kb", "mb", "gb", "tb", "pb", "kib", "mib", "gib", "tib", "pib"])).has(o.toLowerCase()) ? ie(r, o, s.locale) : `${V(r, 2, s.locale)}${o ? ` ${o}` : ""}`;
}
function J(e, t) {
  const s = Ot(e, t);
  return s === null ? null : Math.max(0, Math.min(100, s));
}
function nt(e) {
  const t = (e ?? "").toLowerCase();
  return !t || W.has(t) ? "neutral" : /(healthy|normal|ok|good|passed|online|optimal|clean|健康|已正常|正常|良好)/i.test(t) ? "good" : /(warn|degrad|rebuild|repair|scrub|predict|注意|警告|降级|重建|修复)/i.test(t) ? "warning" : /(failed|error|critical|fault|offline|bad|broken|异常|故障|失败|损坏)/i.test(t) ? "bad" : "neutral";
}
function oe(e, t = {}) {
  const s = t.t ?? Ct;
  if (!e || W.has(e.toLowerCase())) return s("state.unknown");
  const i = nt(e);
  return i === "good" ? s("state.healthy") : i === "warning" ? s("state.warning") : i === "bad" ? s("state.critical") : e;
}
function G(e) {
  const t = nt(e);
  return t === "good" ? "mdi:check-circle" : t === "warning" ? "mdi:alert" : t === "bad" ? "mdi:alert-circle" : "mdi:help-circle";
}
function ae(e, t) {
  t && e.dispatchEvent(new CustomEvent("hass-more-info", {
    bubbles: !0,
    composed: !0,
    detail: { entityId: t }
  }));
}
var ne = Object.defineProperty, le = Object.getOwnPropertyDescriptor, lt = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? le(t, s) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (r = (i ? a(t, s, r) : a(r)) || r);
  return i && r && ne(t, s, r), r;
};
const N = {
  showPools: !0,
  showDisks: !0,
  showRaid: !0,
  showTemperature: !0,
  showHealth: !0,
  showEmptySections: !1,
  compact: !1,
  warningThreshold: 75,
  criticalThreshold: 90,
  temperatureWarning: 45,
  temperatureCritical: 55,
  entityTapAction: "more-info",
  language: "auto"
};
let R = class extends A {
  static getConfigElement() {
    return document.createElement("storage-monitor-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:storage-monitor-card",
      pools: [],
      disks: [],
      showPools: !0,
      showDisks: !0,
      showRaid: !0
    };
  }
  setConfig(e) {
    const t = B(Q(e?.language, Z(this.hass)));
    if (!e || typeof e != "object") throw new Error(t("error.configObject"));
    if (e.pools !== void 0 && !Array.isArray(e.pools)) throw new Error(t("error.poolsArray"));
    if (e.disks !== void 0 && !Array.isArray(e.disks)) throw new Error(t("error.disksArray"));
    this._config = { ...N, ...e };
  }
  /** Resolved display language: follows Home Assistant unless `language` forces one. */
  get _language() {
    return Q(this._config?.language, Z(this.hass));
  }
  get _t() {
    return B(this._language);
  }
  get _text() {
    return { t: this._t, locale: this._language };
  }
  getCardSize() {
    const e = this._config;
    return 2 + (e?.showPools && (e.pools?.length ?? 0) ? (e.pools?.length ?? 0) * 2 : 0) + (e?.showDisks && (e.disks?.length ?? 0) ? e.disks?.length ?? 0 : 0) + (e?.showRaid && e.raid ? 2 : 0);
  }
  _tap(e) {
    this._config?.entityTapAction !== "none" && ae(this, e);
  }
  _thresholdClass(e) {
    return e === null ? "neutral" : e >= (this._config?.criticalThreshold ?? N.criticalThreshold) ? "bad" : e >= (this._config?.warningThreshold ?? N.warningThreshold) ? "warning" : "good";
  }
  _temperatureC(e) {
    const t = Ot(this.hass, e);
    return t === null ? null : String(S(this.hass, e)?.attributes.unit_of_measurement ?? "°C").toLowerCase().includes("f") ? (t - 32) * 5 / 9 : t;
  }
  _temperatureClass(e) {
    return e === null ? "neutral" : e >= (this._config?.temperatureCritical ?? N.temperatureCritical) ? "bad" : e >= (this._config?.temperatureWarning ?? N.temperatureWarning) ? "warning" : "good";
  }
  _health(e) {
    const t = S(this.hass, e);
    return t ? { label: oe(t.state, this._text), kind: nt(t.state), raw: t.state } : { label: this._t("state.unconfigured"), kind: "neutral" };
  }
  _progress(e) {
    const t = J(this.hass, e), s = this._thresholdClass(t);
    return h`
      <div class="progress ${s}" role="progressbar"
        aria-valuemin="0" aria-valuemax="100" aria-valuenow=${t ?? 0}>
        <div class="progress__fill" style=${`width:${t ?? 0}%`}></div>
      </div>
    `;
  }
  _entityLine(e, t, s = "") {
    if (!t) return c;
    const i = this._text, r = re(this.hass, t, i), o = r === "—" ? yt(this.hass, t, s, i) : r;
    return h`<span class="metric"><span class="metric__label">${e}</span><span class="metric__value">${o}</span></span>`;
  }
  _poolCard(e, t) {
    const s = J(this.hass, e.usage), i = this._thresholdClass(s), r = this._health(e.health), o = !!e.health;
    return h`
      <section class="pool-card" @click=${() => this._tap(e.usage || e.used || e.total)} role="button" tabindex="0">
        <div class="pool-main">
          <div class="pool-heading">
            <ha-icon class="section-icon" .icon=${e.icon || "mdi:database"}></ha-icon>
            <div class="pool-title">
              <div class="item-name">${e.name || this._t("pool.defaultName", { index: t + 1 })}</div>
              ${e.raid ? h`<div class="item-subtitle">${this._stateText(e.raid)}</div>` : c}
            </div>
            <div class="usage-value ${i}">${s === null ? "—" : `${s.toFixed(1)}%`}</div>
          </div>
          ${this._progress(e.usage)}
          <div class="metrics">
            ${this._entityLine(this._t("metric.used"), e.used)}
            ${this._entityLine(this._t("metric.free"), e.free)}
            ${this._entityLine(this._t("metric.total"), e.total)}
          </div>
          ${o && this._config?.showHealth ? h`
            <div class="inline-status">
              <ha-icon .icon=${G(r.raw)} class=${`status-icon ${r.kind}`}></ha-icon>
              <span>${r.label}</span>
            </div>` : c}
        </div>
      </section>
    `;
  }
  _stateText(e) {
    const t = S(this.hass, e);
    return t ? t.state : "";
  }
  _raidSection(e) {
    const t = this._health(e.health || e.state), s = J(this.hass, e.progress);
    return h`
      <section class="section">
        ${this._sectionHeader("mdi:server-network", this._t("section.raid"))}
        <div class="raid-card">
          <div class="raid-row">
            <div>
              <div class="item-name">${e.name || this._t("raid.defaultName")}</div>
              <div class="item-subtitle">${e.level ? this._t("raid.level", { level: this._stateText(e.level) }) : this._t("raid.defaultInfo")}</div>
            </div>
            <div class="status-pill ${t.kind}">
              <ha-icon .icon=${G(t.raw)}></ha-icon>${t.label}
            </div>
          </div>
          ${e.state && e.health && e.state !== e.health ? h`
            <div class="raid-detail">${this._entityLine(this._t("raid.state"), e.state)}</div>` : c}
          ${e.progress ? h`
            <div class="raid-progress">
              <div class="metrics"><span class="metric__label">${this._t("raid.progress")}</span><span class="metric__value">${s === null ? this._stateText(e.progress) : `${s.toFixed(1)}%`}</span></div>
              ${this._progress(e.progress)}
            </div>` : c}
        </div>
      </section>
    `;
  }
  _diskCard(e, t) {
    const s = this._health(e.health), i = this._temperatureC(e.temperature), r = this._temperatureClass(i), o = J(this.hass, e.usage), a = this._thresholdClass(o), n = e.model ? this._stateText(e.model) : "", l = at(this.hass, e.powerOnHours, this._text), d = l.raw === null ? l.text : this._t("disk.hours", { value: V(l.raw, 0, this._language) });
    return h`
      <div class="disk-row" @click=${() => this._tap(e.health || e.temperature || e.powerOnHours || e.usage || e.capacity)} role="button" tabindex="0">
        <div class="disk-icon-wrap">
          <ha-icon class="disk-icon" .icon=${e.icon || "mdi:harddisk"}></ha-icon>
        </div>
        <div class="disk-content">
          <div class="disk-heading">
            <div class="disk-name-wrap">
              <div class="item-name">${e.name || this._t("disk.defaultName", { index: t + 1 })}</div>
              ${n ? h`<div class="item-subtitle">${n}</div>` : c}
            </div>
            ${this._config?.showHealth && e.health ? h`
              <span class="status-pill ${s.kind}"><ha-icon .icon=${G(s.raw)}></ha-icon>${s.label}</span>
            ` : c}
          </div>
          <div class="disk-metrics">
            ${e.capacity ? h`<span>${this._entityLine(this._t("metric.capacity"), e.capacity)}</span>` : c}
            ${e.temperature && this._config?.showTemperature ? h`
              <span class=${`temperature ${r}`}><ha-icon icon="mdi:thermometer"></ha-icon>${e.temperature ? yt(this.hass, e.temperature, "°C", this._text) : "—"}</span>
            ` : c}
            ${e.powerOnHours ? h`
              <span class="power-on-hours"><ha-icon icon="mdi:clock-outline"></ha-icon>${this._t("disk.powerOnHours")} ${d}</span>
            ` : c}
            ${o !== null ? h`<span class=${`disk-usage ${a}`}>${o.toFixed(1)}%</span>` : c}
          </div>
          ${e.usage ? this._progress(e.usage) : c}
          <div class="metrics">
            ${this._entityLine(this._t("metric.used"), e.used)}
            ${this._entityLine(this._t("metric.free"), e.free)}
          </div>
        </div>
      </div>
    `;
  }
  _sectionHeader(e, t) {
    return h`<div class="section-header"><ha-icon .icon=${e}></ha-icon><span>${t}</span></div>`;
  }
  _summary() {
    const e = this._config;
    if (!e) return c;
    const t = this._config?.disks ?? [], s = t.filter((n) => n.temperature && this._config?.showTemperature).map((n) => this._temperatureC(n.temperature)).filter((n) => n !== null), i = s.length ? Math.max(...s) : null, r = [
      ...(e.pools ?? []).filter((n) => n.health).map((n) => this._health(n.health)),
      ...t.filter((n) => n.health).map((n) => this._health(n.health)),
      ...e.raid?.health || e.raid?.state ? [this._health(e.raid.health || e.raid.state)] : []
    ], o = r.some((n) => n.kind === "bad") ? "bad" : r.some((n) => n.kind === "warning") ? "warning" : r.length && r.every((n) => n.kind === "good") ? "good" : "neutral", a = o === "good" ? this._t("summary.healthy") : o === "warning" ? this._t("summary.warning") : o === "bad" ? this._t("summary.critical") : this._t("summary.unknown");
    return !r.length && i === null ? c : h`
      <div class="summary">
        ${r.length ? h`
          <div class="summary-chip ${o}">
            <ha-icon .icon=${o === "good" ? "mdi:check-circle" : o === "bad" ? "mdi:alert-circle" : o === "warning" ? "mdi:alert" : "mdi:help-circle"}></ha-icon>
            <span>${a}</span>
          </div>` : c}
        ${i !== null ? h`
          <div class="summary-chip ${this._temperatureClass(i)}">
            <ha-icon icon="mdi:thermometer"></ha-icon>
            <span>${this._t("summary.maxTemperature", { value: i.toFixed(0) })}</span>
          </div>` : c}
      </div>
    `;
  }
  render() {
    if (!this._config) return h`<ha-card><div class="empty">${this._t("card.configurePrompt")}</div></ha-card>`;
    const e = this._config, t = e.pools ?? [], s = e.disks ?? [], i = e.showPools !== !1 && (t.length > 0 || e.showEmptySections), r = e.showDisks !== !1 && (s.length > 0 || e.showEmptySections), o = e.showRaid !== !1 && !!e.raid;
    return h`
      <ha-card class=${e.compact ? "compact" : ""}>
        <div class="card-content">
          <header class="card-header">
            <div class="header-text">
              <div class="card-title">${e.title || this._t("card.title")}</div>
              ${e.subtitle ? h`<div class="card-subtitle">${e.subtitle}</div>` : c}
            </div>
            ${this._summary()}
          </header>

          ${i ? h`
            <section class="section">
              ${this._sectionHeader("mdi:database", this._t("section.pools"))}
              ${t.length ? h`<div class="pool-list">${t.map((a, n) => this._poolCard(a, n))}</div>` : h`<div class="empty">${this._t("pools.empty")}</div>`}
            </section>` : c}

          ${o ? this._raidSection(e.raid) : c}

          ${r ? h`
            <section class="section">
              ${this._sectionHeader("mdi:harddisk", this._t("section.disks"))}
              ${s.length ? h`<div class="disk-list">${s.map((a, n) => this._diskCard(a, n))}</div>` : h`<div class="empty">${this._t("disks.empty")}</div>`}
            </section>` : c}
        </div>
      </ha-card>
    `;
  }
};
R.styles = wt`
    :host {
      display: block;
      color: var(--primary-text-color);
      --sm-radius: var(--ha-card-border-radius, 12px);
      --sm-good: var(--success-color, #43a047);
      --sm-warning: var(--warning-color, #f9a825);
      --sm-bad: var(--error-color, #db4437);
      --sm-muted: var(--secondary-text-color);
      --sm-line: var(--divider-color, rgba(127, 127, 127, .18));
      --sm-surface: var(--ha-card-background, var(--card-background-color));
    }
    ha-card {
      overflow: hidden;
      border-radius: var(--sm-radius);
      background: var(--ha-card-background, var(--card-background-color));
      color: var(--primary-text-color);
      box-shadow: var(--ha-card-box-shadow, none);
    }
    .card-content { padding: 16px; display: flex; flex-direction: column; gap: 18px; }
    .card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
    .header-text { min-width: 0; }
    .card-title { font-size: 1.15rem; line-height: 1.4; font-weight: 600; letter-spacing: -.01em; }
    .card-subtitle { margin-top: 3px; color: var(--sm-muted); font-size: .85rem; }
    .summary { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 6px; }
    .summary-chip, .status-pill { display: inline-flex; align-items: center; gap: 5px; border-radius: 999px; padding: 5px 9px; font-size: .75rem; font-weight: 500; white-space: nowrap; background: var(--secondary-background-color, rgba(127,127,127,.10)); }
    ha-icon { --mdc-icon-size: 18px; }
    .summary-chip ha-icon, .status-pill ha-icon { --mdc-icon-size: 15px; }
    .good { color: var(--sm-good); }
    .warning { color: var(--sm-warning); }
    .bad { color: var(--sm-bad); }
    .neutral { color: var(--sm-muted); }
    .section { display: flex; flex-direction: column; gap: 10px; }
    .section-header { display: flex; align-items: center; gap: 8px; color: var(--sm-muted); font-size: .82rem; font-weight: 600; letter-spacing: .015em; }
    .section-header ha-icon { --mdc-icon-size: 17px; }
    .pool-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr)); gap: 10px; }
    .pool-card, .raid-card { background: var(--secondary-background-color, rgba(127,127,127,.08)); border-radius: calc(var(--sm-radius) - 2px); padding: 13px; min-width: 0; }
    .pool-card, .disk-row { cursor: pointer; }
    .pool-main { display: flex; flex-direction: column; gap: 10px; }
    .pool-heading, .raid-row { display: flex; align-items: center; gap: 10px; }
    .section-icon { color: var(--sm-muted); --mdc-icon-size: 22px; }
    .pool-title { min-width: 0; flex: 1; }
    .item-name { font-size: .9rem; font-weight: 600; line-height: 1.35; overflow-wrap: anywhere; }
    .item-subtitle { color: var(--sm-muted); font-size: .75rem; margin-top: 2px; }
    .usage-value { font-size: 1.05rem; font-weight: 650; font-variant-numeric: tabular-nums; }
    .progress { height: 7px; width: 100%; background: var(--divider-color, rgba(127,127,127,.16)); border-radius: 99px; overflow: hidden; }
    .progress__fill { height: 100%; border-radius: inherit; background: currentColor; transition: width .25s ease; }
    .progress.good { color: var(--sm-good); }
    .progress.warning { color: var(--sm-warning); }
    .progress.bad { color: var(--sm-bad); }
    .progress.neutral { color: var(--sm-muted); }
    .metrics { display: flex; flex-wrap: wrap; gap: 5px 14px; }
    .metric { display: inline-flex; gap: 4px; font-size: .75rem; min-width: 0; }
    .metric__label { color: var(--sm-muted); }
    .metric__value { font-weight: 500; font-variant-numeric: tabular-nums; }
    .inline-status { display: flex; align-items: center; gap: 5px; font-size: .75rem; }
    .status-icon { --mdc-icon-size: 16px; }
    .raid-card { display: flex; flex-direction: column; gap: 12px; }
    .raid-row { justify-content: space-between; }
    .raid-row > div:first-child { min-width: 0; }
    .raid-progress { display: flex; flex-direction: column; gap: 7px; }
    .raid-detail { font-size: .8rem; }
    .disk-list { display: flex; flex-direction: column; gap: 0; }
    .disk-row { display: flex; gap: 11px; padding: 12px 0; border-bottom: 1px solid var(--sm-line); min-width: 0; }
    .disk-row:first-child { padding-top: 2px; }
    .disk-row:last-child { border-bottom: none; padding-bottom: 0; }
    .disk-icon-wrap { width: 36px; height: 36px; flex: 0 0 36px; border-radius: 12px; background: var(--secondary-background-color, rgba(127,127,127,.08)); display: grid; place-items: center; color: var(--sm-muted); }
    .disk-icon { --mdc-icon-size: 20px; }
    .disk-content { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 7px; }
    .disk-heading { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .disk-name-wrap { min-width: 0; }
    .disk-metrics { display: flex; flex-wrap: wrap; align-items: center; gap: 5px 12px; font-size: .75rem; }
    .temperature, .power-on-hours { display: inline-flex; align-items: center; gap: 3px; font-weight: 500; font-variant-numeric: tabular-nums; }
    .temperature ha-icon, .power-on-hours ha-icon { --mdc-icon-size: 15px; }
    .power-on-hours { color: var(--sm-muted); }
    .disk-usage { font-weight: 600; font-variant-numeric: tabular-nums; }
    .empty { color: var(--sm-muted); font-size: .82rem; padding: 5px 0; }
    .compact .card-content { padding: 12px; gap: 13px; }
    @media (max-width: 420px) {
      .card-content { padding: 13px; gap: 15px; }
      .card-header { flex-direction: column; }
      .summary { justify-content: flex-start; }
      .pool-list { grid-template-columns: 1fr; }
    }
  `;
lt([
  ot({ attribute: !1 })
], R.prototype, "hass", 2);
lt([
  C()
], R.prototype, "_config", 2);
R = lt([
  Et("storage-monitor-card")
], R);
var ce = Object.defineProperty, he = Object.getOwnPropertyDescriptor, w = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? he(t, s) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (r = (i ? a(t, s, r) : a(r)) || r);
  return i && r && ce(t, s, r), r;
};
let g = class extends A {
  constructor() {
    super(...arguments), this._config = { type: "custom:storage-monitor-card" }, this._poolsJson = "[]", this._disksJson = "[]", this._raidJson = "{}", this._error = "";
  }
  setConfig(e) {
    this._config = { ...e }, this._poolsJson = JSON.stringify(e.pools ?? [], null, 2), this._disksJson = JSON.stringify(e.disks ?? [], null, 2), this._raidJson = JSON.stringify(e.raid ?? {}, null, 2);
  }
  get _language() {
    return Q(this._config.language, Z(this.hass));
  }
  get _t() {
    return B(this._language);
  }
  _update(e, t) {
    this._config = { ...this._config, [e]: t }, this._fire();
  }
  _fire() {
    this.dispatchEvent(new CustomEvent("config-changed", {
      bubbles: !0,
      composed: !0,
      detail: { config: { ...this._config, type: "custom:storage-monitor-card" } }
    }));
  }
  _parseJson(e, t) {
    e === "pools" && (this._poolsJson = t), e === "disks" && (this._disksJson = t), e === "raid" && (this._raidJson = t);
    try {
      const s = JSON.parse(t);
      if (e === "pools" && Array.isArray(s)) this._update("pools", s);
      else if (e === "disks" && Array.isArray(s)) this._update("disks", s);
      else if (e === "raid" && typeof s == "object" && s !== null && !Array.isArray(s)) this._update("raid", s);
      else throw new Error(this._t("editor.jsonTypeError"));
      this._error = "";
    } catch (s) {
      this._error = s instanceof Error ? s.message : this._t("editor.jsonFormatError");
    }
  }
  render() {
    const e = this._t, t = this._config.language === "en" || this._config.language === "zh-Hans" ? this._config.language : "auto";
    return h`
      <div class="editor">
        <div class="intro">${e("editor.intro")}</div>
        <label>${e("editor.title")}<input .value=${this._config.title ?? ""} placeholder=${e("card.title")} @input=${(s) => this._update("title", s.target.value)}></label>
        <label>${e("editor.subtitle")}<input .value=${this._config.subtitle ?? ""} @input=${(s) => this._update("subtitle", s.target.value)}></label>
        <label>${e("editor.language")}
          <select .value=${t} @change=${(s) => this._update("language", s.target.value)}>
            <option value="auto">${e("editor.languageAuto")}</option>
            <option value="en">${e("editor.languageEnglish")}</option>
            <option value="zh-Hans">${e("editor.languageChinese")}</option>
          </select>
        </label>
        <label class="check"><input type="checkbox" .checked=${this._config.showPools !== !1} @change=${(s) => this._update("showPools", s.target.checked)}>${e("editor.showPools")}</label>
        <label class="check"><input type="checkbox" .checked=${this._config.showRaid !== !1} @change=${(s) => this._update("showRaid", s.target.checked)}>${e("editor.showRaid")}</label>
        <label class="check"><input type="checkbox" .checked=${this._config.showDisks !== !1} @change=${(s) => this._update("showDisks", s.target.checked)}>${e("editor.showDisks")}</label>
        <label class="check"><input type="checkbox" .checked=${this._config.showTemperature !== !1} @change=${(s) => this._update("showTemperature", s.target.checked)}>${e("editor.showTemperature")}</label>
        <label class="check"><input type="checkbox" .checked=${this._config.showHealth !== !1} @change=${(s) => this._update("showHealth", s.target.checked)}>${e("editor.showHealth")}</label>
        <div class="group">
          <label>${e("editor.poolsJson")}<textarea .value=${this._poolsJson} spellcheck="false" @input=${(s) => this._parseJson("pools", s.target.value)}></textarea></label>
          <label>${e("editor.disksJson")}<textarea .value=${this._disksJson} spellcheck="false" @input=${(s) => this._parseJson("disks", s.target.value)}></textarea></label>
          <label>${e("editor.raidJson")}<textarea .value=${this._raidJson} spellcheck="false" @input=${(s) => this._parseJson("raid", s.target.value)}></textarea></label>
        </div>
        ${this._error ? h`<div class="error">${e("editor.jsonError", { error: this._error })}</div>` : ""}
        <div class="hint">${e("editor.hint")}</div>
      </div>
    `;
  }
};
g.styles = wt`
    :host { display: block; color: var(--primary-text-color); }
    .editor { display: flex; flex-direction: column; gap: 12px; padding: 8px 0; }
    .intro, .hint { color: var(--secondary-text-color); font-size: .85rem; line-height: 1.5; }
    label { display: flex; flex-direction: column; gap: 5px; font-size: .9rem; }
    input:not([type="checkbox"]), select, textarea { box-sizing: border-box; width: 100%; border: 1px solid var(--divider-color); border-radius: 8px; background: var(--input-fill-color, var(--card-background-color)); color: var(--primary-text-color); padding: 9px 10px; font: inherit; }
    select { cursor: pointer; }
    .check { flex-direction: row; align-items: center; gap: 9px; }
    .check input { width: 18px; height: 18px; }
    textarea { min-height: 125px; resize: vertical; font-family: var(--code-font-family, monospace); font-size: .82rem; }
    .group { display: flex; flex-direction: column; gap: 12px; }
    .error { color: var(--error-color, #db4437); font-size: .85rem; }
  `;
w([
  ot({ attribute: !1 })
], g.prototype, "hass", 2);
w([
  C()
], g.prototype, "_config", 2);
w([
  C()
], g.prototype, "_poolsJson", 2);
w([
  C()
], g.prototype, "_disksJson", 2);
w([
  C()
], g.prototype, "_raidJson", 2);
w([
  C()
], g.prototype, "_error", 2);
g = w([
  Et("storage-monitor-card-editor")
], g);
const de = "0.2.0";
window.customCards = window.customCards || [];
window.customCards.push({
  type: "storage-monitor-card",
  name: "Storage Monitor Card",
  description: "Mushroom-inspired storage pool, RAID and disk health dashboard.",
  preview: !0,
  documentationURL: "https://github.com/fissssssh/storage-monitor-card"
});
console.info(
  `%c STORAGE-MONITOR-CARD %c ${de} `,
  "color: white; background: #16a34a; font-weight: 700;",
  "color: #16a34a; background: transparent; font-weight: 700;"
);
//# sourceMappingURL=storage-monitor-card.js.map
