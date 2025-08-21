
// editor.js — funções do editor, estado "sujo" e salvamento
const Editor = (() => {
  let isDirty = false;
  const DRAFT_KEY = "loreloom@draft";
  const LAST_SAVED_KEY = "loreloom@lastSavedDoc";

  const $ = sel => document.querySelector(sel);

  function loadDraft() {
    const ta = $("#mainText");
    if (!ta) return;
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft && !ta.value) ta.value = draft;
    updateStats();
    isDirty = false;
  }

  function updateStats() {
    const ta = $("#mainText");
    if (!ta) return;
    const text = ta.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const refs = (text.match(/\[([^\]]+)\]/g) || []).length;
    $("#wordCount").textContent = String(words);
    $("#charCount").textContent = String(chars);
    $("#refCount").textContent = String(refs);
  }

  function markDirty() {
    isDirty = true;
    const ta = $("#mainText");
    if (ta) localStorage.setItem(DRAFT_KEY, ta.value);
  }

  function save() {
    const ta = $("#mainText");
    const content = ta?.value ?? "";
    localStorage.setItem(LAST_SAVED_KEY, JSON.stringify({ content, savedAt: new Date().toISOString() }));
    isDirty = false;
    toast("Documento salvo.");
  }

  function isChanged() { return !!isDirty; }

  function format(cmd) {
    const ta = $("#mainText"); if (!ta) return;
    const start = ta.selectionStart, end = ta.selectionEnd;
    const sel = ta.value.substring(start, end);
    if (!sel) return;
    let out = sel;
    if (cmd === "bold") out = `**${sel}**`;
    if (cmd === "italic") out = `*${sel}*`;
    ta.value = ta.value.slice(0, start) + out + ta.value.slice(end);
    ta.focus(); ta.setSelectionRange(start, start + out.length);
    updateStats(); markDirty();
  }

  function insertReference() {
    const ta = $("#mainText"); if (!ta) return;
    const ref = "[Nome/Local/Item]";
    const pos = ta.selectionStart ?? ta.value.length;
    ta.value = ta.value.slice(0, pos) + ref + ta.value.slice(pos);
    ta.focus(); ta.setSelectionRange(pos + 1, pos + ref.length - 1);
    updateStats(); markDirty();
  }

  function checkConsistency() {
    const ta = $("#mainText"); if (!ta) return;
    const refs = ta.value.match(/\[([^\]]+)\]/g) || [];
    if (refs.length) alert(`Encontradas ${refs.length} referências:\n${refs.join("\n")}\n\nVerifique se estão cadastradas no Mundo.`);
    else alert("Nenhuma referência encontrada. Use [colchetes] para marcar entidades.");
  }

  function bind() {
    const ta = $("#mainText"); if (!ta) return;
    loadDraft();
    ta.addEventListener("input", () => { updateStats(); markDirty(); });
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault(); save();
      }
    });
    window.addEventListener("beforeunload", (e) => {
      if (isDirty) { e.preventDefault(); e.returnValue = ""; }
    });
  }

  return { bind, save, isChanged, format, insertReference, checkConsistency, updateStats };
})();

export default Editor;

// toast util local (fallback se app.js não tiver)
function toast(msg, ms = 1600) {
  let box = document.getElementById("toast-container");
  if (!box) { box = document.createElement("div"); box.id = "toast-container"; document.body.appendChild(box); }
  const el = document.createElement("div");
  el.className = "toast"; el.textContent = msg; box.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 300); }, ms);
}
