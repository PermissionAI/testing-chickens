class FakeClassList {
  constructor() { this.classes = new Set(); }
  add(...cls) { cls.forEach(c => this.classes.add(c)); }
  remove(...cls) { cls.forEach(c => this.classes.delete(c)); }
  contains(c) { return this.classes.has(c); }
  toString() { return Array.from(this.classes).join(' '); }
}

class FakeElement {
  constructor(tag, id, document) {
    this.tagName = tag.toLowerCase();
    this.id = id || null;
    this.document = document;
    this.children = [];
    this.parent = null;
    this.classList = new FakeClassList();
    this.style = {};
    this.onclick = null;
    this.textContent = '';
    this._innerHTML = '';
    this._listeners = {};
  }
  appendChild(el) { el.parent = this; this.children.push(el); }
  removeChild(el) { this.children = this.children.filter(c => c !== el); }
  remove() { if(this.parent) this.parent.removeChild(this); }
  querySelector(selector) {
    if(selector.startsWith('#')) return this.document.getElementById(selector.slice(1));
    if(selector === 'button') {
      const stack = [...this.children];
      while(stack.length) {
        const el = stack.shift();
        if(el.tagName === 'button') return el;
        stack.push(...el.children);
      }
    }
    return null;
  }
  addEventListener(event, cb) {
    this._listeners[event] = this._listeners[event] || [];
    this._listeners[event].push(cb);
  }
  click() {
    if(this.onclick) this.onclick();
    const list = this._listeners['click'] || [];
    list.forEach(cb => cb());
  }
  set innerHTML(v) { this._innerHTML = v; this.children = []; }
  get innerHTML() { return this._innerHTML; }
}

class FakeDocument {
  constructor() { this.elements = {}; this.body = new FakeElement('body', 'body', this); }
  createElement(tag) { return new FakeElement(tag, null, this); }
  getElementById(id) { return this.elements[id] || null; }
}

function makeDOM(ids) {
  const document = new FakeDocument();
  const window = { location: { search: '', href: '', reload: () => {} } };
  ids.forEach(id => {
    const tag = id.toLowerCase().includes('btn') ? 'button' :
      (id === 'demoFrame' ? 'iframe' : 'div');
    const el = new FakeElement(tag, id, document);
    document.elements[id] = el;
    document.body.appendChild(el);
  });
  return { document, window };
}

function makeStorage() {
  const store = {};
  return {
    getItem(k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
    setItem(k, v) { store[k] = String(v); },
    removeItem(k) { delete store[k]; },
    clear() { for (const k in store) delete store[k]; }
  };
}

module.exports = { makeDOM, makeStorage, FakeElement };
