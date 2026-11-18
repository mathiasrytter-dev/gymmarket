/* Kategori-ikoner: egne streg-ikoner (24 x 24) */
window.GM_ICONS = {
  trampolin: '<ellipse cx="12" cy="8.5" rx="9" ry="3"/><path d="M5.5 10.8 4.5 19M18.5 10.8l1 8.2M3 19h3M18 19h3M12 11.5v3"/>',
  airtrack: '<path d="M3 12 15 7l6 2.5-12 5z"/><path d="M3 12v3l6 2.5 12-5v-3M9 14.5v3"/><path d="M7 10.3l6 2.5M11 8.7l6 2.5"/><path d="M17.5 5.2c.6-.6 1.2-.6 1.8 0s1.2.6 1.8 0"/>',
  teamgym: '<path d="M3 19.5h18"/><path d="M13 19.5l2-5.5 6 2.2"/><path d="M15 14l-1.2 5.5M19.8 15.8l-.6 3.7"/><path d="M3.5 15.5C5 8 10 4.5 16 7.5" stroke-dasharray="2 2.2"/><circle cx="18.2" cy="8.9" r="1.6"/>',
  ag: '<path d="M3 3.5h18M8 3.5v7M16 3.5v7"/><circle cx="8" cy="14.5" r="4"/><circle cx="16" cy="14.5" r="4"/>',
  rg: '<path d="M3.5 20.5 9 15"/><path d="M9 15c2.5-2.5 6.5-3 8.5-1s.5 5.5-2.5 5.5-3.5-3-1.5-5.5 5-5 6-8.5-2-4-4.5-2.5"/>',
  skum: '<rect x="2.5" y="4" width="11" height="3.6" rx="1.8"/><path d="M5.5 7.6 4.6 13M10.5 7.6l.9 5.4M3.5 13h9"/><rect x="13" y="13.5" width="4.5" height="4.5" rx="1"/><rect x="16.5" y="9" width="4.5" height="4.5" rx="1" transform="rotate(12 18.75 11.25)"/><path d="M2.5 16.5v4h19v-4"/>',
  andet: '<path d="M11 3.5 19 7.5v9L11 20.5 3 16.5v-9z"/><path d="M3 7.5l8 4 8-4M11 11.5v9"/><path d="M21 3v1.6l-2.4 1 2.4 1-2.4 1 2.4 1V10"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>'
};
window.GMIcon = function (id, size, sw) {
  const p = window.GM_ICONS[id] || window.GM_ICONS.andet;
  return '<svg class="gm-ico" viewBox="0 0 24 24" width="' + (size || 24) + '" height="' + (size || 24) + '" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
};
