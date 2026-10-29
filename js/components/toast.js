let activeToast = null;
let activeTimer = null;

export function showToast(message, type = 'info', duration = 2000) {
  if (!message) return;

  if (activeToast && activeToast.parentNode) {
    activeToast.parentNode.removeChild(activeToast);
  }
  if (activeTimer) {
    clearTimeout(activeTimer);
    activeTimer = null;
  }

  const toast = document.createElement('div');
  toast.className = `app-toast app-toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('app-toast--visible'));

  activeToast = toast;
  activeTimer = setTimeout(() => {
    toast.classList.remove('app-toast--visible');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
      if (activeToast === toast) activeToast = null;
      activeTimer = null;
    }, 200);
  }, duration);
}