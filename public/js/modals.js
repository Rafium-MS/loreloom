const modalTriggers = {};

export async function loadModals() {
  const res = await fetch('/partials/modals.html');
  if (res.ok) {
    const html = await res.text();
    document.body.insertAdjacentHTML('beforeend', html);
    document.querySelectorAll('.modal').forEach((modal) => {
      modal.addEventListener('click', function (e) {
        if (e.target === this) {
          closeModal(this.id);
        }
      });
    });
  }
}

export function openModal(modalId, trigger) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('active');
  modalTriggers[modalId] = trigger || document.activeElement;
  const focusEl = modal.querySelector('input, select, textarea, button');
  focusEl?.focus();
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal?.classList.remove('active');
  const trigger = modalTriggers[modalId];
  if (trigger && typeof trigger.focus === 'function') {
    trigger.focus();
  }
  delete modalTriggers[modalId];
}
