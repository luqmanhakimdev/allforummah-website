/** @typedef {{ open: boolean }} SideNavState */

/** @type {SideNavState} */
export const sideNav = $state({ open: false });

export function toggleSideNav() {
  sideNav.open = !sideNav.open;
}

/** @param {boolean} value */
export function setSideNavOpen(value) {
  sideNav.open = value;
}

export function initSideNav() {
  sideNav.open = false;
}
