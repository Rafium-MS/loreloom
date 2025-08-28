export function initNavigation() {
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.addEventListener('click', function (e) {
      e.stopPropagation();
      document
        .querySelectorAll('.nav-item')
        .forEach((nav) => nav.classList.remove('active'));
      document
        .querySelectorAll('.content-panel')
        .forEach((panel) => panel.classList.remove('active'));
      this.classList.add('active');
      const route = this.dataset.route;
      document.getElementById(route)?.classList.add('active');
      const crumb = document.getElementById('crumb');
      if (crumb) {
        crumb.setAttribute('data-i18n', this.getAttribute('data-i18n') || '');
        const label = this.classList.contains('has-submenu')
          ? this.childNodes[0].textContent.trim()
          : this.textContent.trim();
        crumb.textContent = label;
      }
    });
  });

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', function () {
      if (this.closest('#world')) {
        document
          .querySelectorAll('.tab')
          .forEach((t) => t.classList.remove('active'));
        document
          .querySelectorAll('.tab-content')
          .forEach((tc) => (tc.style.display = 'none'));
        this.classList.add('active');
        const tabId = this.dataset.tab;
        const tabContent = document.getElementById(tabId);
        if (tabContent) tabContent.style.display = 'block';
      }
    });
  });

  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.querySelector('.app')?.classList.toggle('collapsed');
  });
}
