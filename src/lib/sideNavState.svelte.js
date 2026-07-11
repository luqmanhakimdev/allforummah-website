/** @typedef {{ open: boolean }} SideNavState */

/** @type {SideNavState} */
export const sideNav = $state({ open: false });

export function toggleSideNav() {
  sideNav.open = !sideNav.open;
  persist();
}

/** @param {boolean} value */
export function setSideNavOpen(value) {
  sideNav.open = value;
  persist();
}

function persist() {
  try {
    localStorage.setItem('afu-side-nav', sideNav.open ? '1' : '0');
  } catch {
    // ignore
  }
}

export function initSideNav() {
  try {
    const saved = localStorage.getItem('afu-side-nav');
    if (saved !== null) {
      sideNav.open = saved === '1';
      return;
    }
  } catch {
    // ignore
  }
  sideNav.open = false;
}
