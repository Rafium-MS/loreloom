
// app.js — fio condutor: inicializa Router, Editor e integra HTML existente
import Router from "./router.js";
import Editor from "./editor.js";
import World from "./world.js";

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

function applyView(hashPath){
  // ativa nav
  $$(".nav-item").forEach(a => a.classList.remove("active"));
  // mapeia ids conforme HTML atual
  const map = { "#/editor":"editor", "#/characters":"characters", "#/world":"world", "#/economy":"economy", "#/languages":"languages", "#/timeline":"timeline", "#/notes":"notes" };
  const panelId = map[hashPath] || "editor";

  // ativa painel
  $$(".content-panel").forEach(v => v.classList.remove("active"));
  document.getElementById(panelId)?.classList.add("active");

  // ativa item correspondente preservando seu onclick legacy
  const idxOrder = ["editor","characters","world","economy","languages","timeline","notes"];
  const idx = idxOrder.indexOf(panelId);
  const navEl = $$(".sidebar .nav-item")[idx];
  if (navEl) navEl.classList.add("active");

  // quando entra no editor, reconta
  if (panelId === "editor") Editor.updateStats();
}

// Guarda: confirmar ao sair do editor com mudanças
Router.beforeEach(async (to, from) => {
  const leavingEditor = from?.path === "#/editor" && to?.path !== from?.path;
  if (!leavingEditor) return true;
  if (!Editor.isChanged()) return true;

  // Modal custom pode ser conectado aqui; usando confirm por simplicidade
  const save = await new Promise(res => setTimeout(() => res(confirm("Alterações não salvas. Salvar antes de sair?")), 0));
  if (save) { Editor.save(); return true; }
  const discard = await new Promise(res => setTimeout(() => res(confirm("Sair sem salvar?")), 0));
  return !!discard;
});

Router.onChange((to /*, from */) => applyView(to.path));

function bindSidebar() {
  // mantém compat com onclick="showPanel('editor')" do HTML
  window.showPanel = (id) => Router.navigate(`#/${id}`);
  // e também acrescenta listeners diretos para UX consistente
  const ids = ["editor","characters","world","economy","languages","timeline","notes"];
  $$(".sidebar .nav-item").forEach((el, i) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      Router.navigate(`#/${ids[i]}`);
    });
  });
}

function mountRoutes(){
  Router.use(["#/editor","#/characters","#/world","#/economy","#/languages","#/timeline","#/notes"], { default: "#/editor" });
}

function exposeGlobals(){
  // Editor
  window.formatText = (cmd) => Editor.format(cmd);
  window.insertReference = () => Editor.insertReference();
  window.checkConsistency = () => Editor.checkConsistency();
  window.saveDocument = () => Editor.save();

  // Mundo
  window.addCharacter = () => World.addCharacter();
  window.addLocation  = () => World.addLocation();
  window.addMerchant  = () => World.addMerchant();
  window.addItem      = () => World.addItem();
  window.addLanguage  = () => World.addLanguage();
  window.addEvent     = () => World.addEvent();
  window.addNote      = () => World.addNote();

  // Hooks de export/import usados pelo editor.js
  window.__worldExportHook = () => {
    Editor.exportProject(() => World.getData());
  };
  window.__worldImportHook = (worldObj) => {
    World.setData(worldObj);
  };
}

function toast(msg, ms = 1600){
  let box = document.getElementById("toast-container");
  if (!box) { box = document.createElement("div"); box.id = "toast-container"; document.body.appendChild(box); }
  const el = document.createElement("div");
  el.className = "toast"; el.textContent = msg; box.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 300); }, ms);
}
window.toast = toast;

document.addEventListener("DOMContentLoaded", () => {
  exposeGlobals();
  bindSidebar();
  mountRoutes();
  Editor.bind();
});
