/**
 * Helper hyperscript. Crea un HTMLElement a partir de:
 *   h(tag, attrs, ...children)
 *
 * - tag: string (etiqueta HTML)
 * - attrs: { class, id, style, dataset, onX, ... } | null
 * - children: string | Node | Array<string|Node> | null | false
 */
export function h(tag, attrs, ...children) {
  const el = document.createElement(tag);

  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      if (value == null || value === false) {
        continue;
      }
      if (key === 'class' || key === 'className') {
        el.className = value;
      } else if (key === 'style' && typeof value === 'object') {
        Object.assign(el.style, value);
      } else if (key === 'dataset' && typeof value === 'object') {
        for (const [dk, dv] of Object.entries(value)) {
          el.dataset[dk] = dv;
        }
      } else if (key.startsWith('on') && typeof value === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), value);
      } else if (value === true) {
        el.setAttribute(key, '');
      } else {
        el.setAttribute(key, value);
      }
    }
  }

  appendChildren(el, children);
  return el;
}

function appendChildren(parent, children) {
  for (const child of children) {
    if (child == null || child === false) continue;
    if (Array.isArray(child)) {
      appendChildren(parent, child);
    } else if (child instanceof Node) {
      parent.appendChild(child);
    } else {
      parent.appendChild(document.createTextNode(String(child)));
    }
  }
}