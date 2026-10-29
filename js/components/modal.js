import { h } from '../core/dom.js';

let activeModal = null;

export function openModal({ title, content, size = 'md', onClose } = {}) {
  closeModal();

  const overlay = h('div', { class: 'modal-overlay' });
  const dialog = h('div', { class: `modal modal--${size}` });

  const header = h('div', { class: 'modal__header' },
    h('h2', { class: 'modal__title' }, title || ''),
    h('button', {
      class: 'modal__close',
      type: 'button',
      'aria-label': 'Cerrar',
      onclick: () => closeModal()
    }, '×')
  );

  const body = h('div', { class: 'modal__body' }, content);
  dialog.appendChild(header);
  dialog.appendChild(body);
  overlay.appendChild(dialog);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  const escHandler = (e) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', escHandler);

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  activeModal = { overlay, onClose, escHandler };
  return { close: closeModal };
}

export function closeModal() {
  if (!activeModal) return;
  const { overlay, onClose, escHandler } = activeModal;
  document.removeEventListener('keydown', escHandler);
  if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
  document.body.style.overflow = '';
  activeModal = null;
  if (typeof onClose === 'function') {
    try { onClose(); } catch (e) { console.error(e); }
  }
}