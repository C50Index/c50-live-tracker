// A better React and utils -- MarkAct.js

export function m(nodeName, attributes, ...args) {
    let children = args.length ? [].concat(...args) : null;
    return {
        nodeName,
        attributes,
        children
    }
}

export function render(vnode, parent=null) {
    if (!vnode) return document.createTextNode('');
    if (vnode.split) return document.createTextNode(vnode);
    let n = null;
    if(vnode.nodeName === "svg" || parent && parent.nodeName === "svg") {
        n = document.createElementNS("http://www.w3.org/2000/svg", vnode.nodeName);
    } else {
        n = document.createElement(vnode.nodeName);
    }
    let as = vnode.attributes || {};
    let onRender = null;
    for (let k in as) {
        if(!!k && !!as[k]) {
            if (k === 'onRender') {
                onRender = as[k];
            } else if (typeof as[k] === "function") {
                n[k] = as[k];
            } else if (vnode.nodeName === "svg" || (parent && parent.nodeName === "svg")) {
                n.setAttributeNS(null, k, as[k]);
            } else {
                n.setAttribute(k, as[k]);
            }
        }
    }
    if(onRender) onRender(n);
    (vnode.children || []).map(c => n.appendChild(render(c, n)));
    return n;
}

export function renderAt(vnode, id) {
    let app = document.getElementById(id);
    if (app && app.firstChild) app.removeChild(app.firstChild);
    app.appendChild(render(vnode));
};