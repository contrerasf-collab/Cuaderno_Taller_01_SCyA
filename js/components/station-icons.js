const ICONS = {
  relay: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M12 12h6"/>',
  circuit: '<path d="M3 12h4l2-4 4 8 2-4h6"/>',
  motor: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="4" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="20"/><line x1="4" y1="12" x2="7" y2="12"/><line x1="17" y1="12" x2="20" y2="12"/>',
  battery: '<rect x="2" y="8" width="18" height="10" rx="2"/><line x1="22" y1="11" x2="22" y2="13"/><line x1="5" y1="13" x2="8" y2="13"/><line x1="6.5" y1="11.5" x2="6.5" y2="14.5"/><line x1="12" y1="13" x2="15" y2="13"/>',
  default: '<circle cx="12" cy="12" r="8"/>'
};

export function createStationIcon(iconId, size = 20) {
  const inner = ICONS[iconId] || ICONS.default;
  const wrapper = document.createElement('span');
  wrapper.className = 'station-icon';
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
  return wrapper;
}