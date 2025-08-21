
// editor.js — editor principal do LoreLoom
// Recursos: autosave com status, preview Markdown leve (headers, listas, links),
// negrito/itálico, referências [ ], export/import e guarda "dirty".
// Sem dependências externas.

const Editor = (() => {
  // ----- Estado interno -----
  let isDirty = false;
  let saveTimer = null;
  let previewOn = false;

  const DRAFT_KEY = "loreloom@draft";
  const LAST_SAVED_KEY = "loreloom@lastSavedDoc";

  // ----- Helpers DOM -----
  const $  = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  // =========================
  //   Persistência & Status
  // =========================
  function setSaveStatus(msg, kind = "info") {
    const el = $("#saveStatus");
    if (!el) return;
    el.textContent = msg;
    el.className = `msg ${kind}`;
  }

  function loadDraft() {
    const ta = $("#mainText");
    if (!ta) return;
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft && !ta.value) ta.value = draft;
    updateStats();
    isDirty = false;
    setSaveStatus("Pronto", "success");
  }

  function scheduleSave() {
    clearTimeout(saveTimer);
    setSaveStatus("Salvando…");
    saveTimer = setTimeout(() => {
      try {
        const ta = $("#mainText");
        localStorage.setItem(DRAFT_KEY, ta?.value ?? "");
        setSaveStatus("Rascunho salvo", "success");
      } catch {
        setSaveStatus("Falha ao salvar", "error");
      }
    }, 350);
  }

  function save() {
    const ta = $("#mainText");
    const content = ta?.value ?? "";
    localStorage.setItem(
      LAST_SAVED_KEY,
      JSON.stringify({ content, savedAt: new Date().toISOString() })
    );
    isDirty = false;
    setSaveStatus("Documento salvo", "success");
    toast("Documento salvo.");
  }

  function isChanged() { return !!isDirty; }

  // =========================
  //     Estatísticas
  // =========================
  function updateStats() {
    const ta = $("#mainText");
    if (!ta) return;
    const text = ta.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    // conta referências que NÃO são links markdown [txt](url)
    const withoutLinks = text.replace(/\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/g, "");
    const refs = (withoutLinks.match(/\[([^\]]+)\]/g) || []).length;

    $("#wordCount")?.textContent = String(words);
    $("#charCount")?.textContent = String(chars);
    $("#refCount")?.textContent  = String(refs);
  }

  function touch() {
    updateStats();
    isDirty = true;
    scheduleSave();
    if (previewOn) renderPreview(); // live
  }

  // =========================
  //     Formatação básica
  // =========================
  function surround(left, right) {
    const ta = $("#mainText"); if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    if (s == null || e == null || s === e) return;
    const sel = ta.value.slice(s, e);
    const out = left + sel + right;
    ta.value = ta.value.slice(0, s) + out + ta.value.slice(e);
    ta.focus();
    ta.setSelectionRange(s, s + out.length);
    touch();
  }

  function format(cmd) {
    if (cmd === "bold")   return surround("**", "**");
    if (cmd === "italic") return surround("*", "*");
  }

  function insertReference() {
    const ta = $("#mainText"); if (!ta) return;
    const ref = "[Nome/Local/Item]";
    const pos = ta.selectionStart ?? ta.value.length;
    ta.value = ta.value.slice(0, pos) + ref + ta.value.slice(pos);
    ta.focus();
    ta.setSelectionRange(pos + 1, pos + ref.length - 1);
    touch();
  }

  function checkConsistency() {
    const ta = $("#mainText"); if (!ta) return;
    const withoutLinks = ta.value.replace(/\[[^\]]+\]\((https?:\/\/[^\s)]+)\)/g, "");
    const refs = withoutLinks.match(/\[([^\]]+)\]/g) || [];
    if (refs.length) {
      alert(`Encontradas ${refs.length} referências:\n${refs.join("\n")}\n\nVerifique se estão cadastradas no Mundo.`);
    } else {
      alert("Nenhuma referência encontrada. Use [colchetes] para marcar entidades.");
    }
  }

  // =========================
  //    Parser Markdown Lite
  // =========================

  // Escapa HTML básico
  function esc(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // Inline: links, autolink, bold/italic, refs, soft breaks
  function applyInline(src) {
    let html = esc(src);

    // código inline `code` (fazer antes de bold/italic para não conflitar)
    html = html.replace(/`([^`]+)`/g, (_, code) => `<code>${esc(code)}</code>`);

    // links markdown [texto](url)
    html = html.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      (_, text, url) => `<a href="${url}" target="_blank" rel="noopener">${esc(text)}</a>`
    );

    // autolinks http(s)://
    html = html.replace(
      /(^|[\s(])((https?:\/\/[^\s)<]+))/g,
      (_, pre, url) => `${pre}<a href="${url}" target="_blank" rel="noopener">${url}</a>`
    );

    // **negrito**
    html = html.replace(/(\*\*|__)(.+?)\1/g, "<strong>$2</strong>");
    // *itálico*
    html = html.replace(/(\*|_)([^*_].*?)\1/g, "<em>$2</em>");

    // [Referências] que não foram parte de link → <mark>
    html = html.replace(/\[([^\]]+)\]/g, "<mark>[$1]</mark>");

    // quebra suave: dois espaços no fim da linha
    html = html.replace(/  \n/g, "<br>\n");
    return html;
  }

  // Blocks: headers, hr, lists, blockquote, code fence, paragraphs
  function renderMarkdown(src) {
    const lines = src.replace(/\r\n?/g, "\n").split("\n");
    const blocks = [];
    let i = 0;

    // estado de code fence ```
    let inCode = false;
    let codeBuffer = [];

    while (i < lines.length) {
      let line = lines[i];

      // Cerca de código (```)
      const fence = line.match(/^```/);
      if (fence && !inCode) {
        inCode = true;
        codeBuffer = [];
        i++;
        continue;
      }
      if (fence && inCode) {
        // fecha
        blocks.push(`<pre><code>${esc(codeBuffer.join("\n"))}</code></pre>`);
        inCode = false;
        codeBuffer = [];
        i++;
        continue;
      }
      if (inCode) {
        codeBuffer.push(line);
        i++;
        continue;
      }

      // Linha horizontal
      if (/^(\*\s*\*\s*\*|-{3,}|_{3,})\s*$/.test(line)) {
        blocks.push("<hr/>");
        i++;
        continue;
      }

      // Cabeçalhos #..######
      const h = line.match(/^(#{1,6})\s+(.+?)\s*$/);
      if (h) {
        const level = h[1].length;
        blocks.push(`<h${level}>${applyInline(h[2])}</h${level}>`);
        i++;
        continue;
      }

      // Blockquote (linhas consecutivas iniciando com >)
      if (/^>\s?/.test(line)) {
        const buf = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) {
          buf.push(lines[i].replace(/^>\s?/, ""));
          i++;
        }
        const inner = renderMarkdown(buf.join("\n")); // recursivo
        blocks.push(`<blockquote>${inner}</blockquote>`);
        continue;
      }

      // Listas não ordenadas (-, *, +)
      if (/^\s*[-*+]\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
          const item = lines[i].replace(/^\s*[-*+]\s+/, "");
          items.push(`<li>${applyInline(item)}</li>`);
          i++;
        }
        blocks.push(`<ul>${items.join("")}</ul>`);
        continue;
      }

      // Listas ordenadas (1. ...)
      if (/^\s*\d+\.\s+/.test(line)) {
        const items = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
          const item = lines[i].replace(/^\s*\d+\.\s+/, "");
          items.push(`<li>${applyInline(item)}</li>`);
          i++;
        }
        blocks.push(`<ol>${items.join("")}</ol>`);
        continue;
      }

      // Parágrafos (agrupar até linha em branco)
      if (line.trim() !== "") {
        const buf = [line];
        i++;
        while (i < lines.length && lines[i].trim() !== "") {
          buf.push(lines[i]);
          i++;
        }
        blocks.push(`<p>${applyInline(buf.join("\n"))}</p>`);
        continue;
      }

      // linhas em branco
      i++;
    }

    return blocks.join("\n");
  }

  function renderPreview() {
    const ta = $("#mainText");
    const pv = $("#previewPane");
    if (!ta || !pv) return;
    pv.innerHTML = renderMarkdown(ta.value);
  }

  function togglePreview() {
    const pv = $("#previewPane");
    if (!pv) return;
    previewOn = !previewOn;
    pv.style.display = previewOn ? "block" : "none";
    if (previewOn) renderPreview();
  }

  // =========================
  //     Export / Import
  // =========================
  function exportProject(worldDataProvider) {
    const content = $("#mainText")?.value ?? "";
    const payload = {
      version: 1,
      savedAt: new Date().toISOString(),
      editor: { content },
      world: worldDataProvider ? worldDataProvider() : {}
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `loreloom_${new Date().toISOString().slice(0,19).replace(/[:T]/g,"-")}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function importProject(file, worldDataConsumer) {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onerror = () => reject(new Error("Falha ao ler arquivo"));
      fr.onload = () => {
        try {
          const data = JSON.parse(String(fr.result || "{}"));
          if (data?.editor?.content != null) {
            $("#mainText").value = data.editor.content;
            localStorage.setItem(DRAFT_KEY, data.editor.content);
          }
          if (data?.world && typeof worldDataConsumer === "function") {
            worldDataConsumer(data.world);
          }
          updateStats();
          isDirty = false;
          setSaveStatus("Projeto importado", "success");
          if (previewOn) renderPreview();
          resolve(true);
        } catch (e) {
          reject(e);
        }
      };
      fr.readAsText(file);
    });
  }

  // =========================
  //         Bindings
  // =========================
  function bind() {
    const ta = $("#mainText"); if (!ta) return;

    loadDraft();
    ta.addEventListener("input", touch);

    // atalhos
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault(); save();
      }
    });

    // aviso ao sair
    window.addEventListener("beforeunload", (e) => {
      if (isDirty) { e.preventDefault(); e.returnValue = ""; }
    });

    // Preview & botões de export/import
    $("#btnPreview")?.addEventListener("click", togglePreview);
    $("#btnExport")?.addEventListener("click", () => window.__worldExportHook?.());
    $("#fileImport")?.addEventListener("change", async (ev) => {
      const file = ev.target.files?.[0];
      if (!file) return;
      try {
        await importProject(file, window.__worldImportHook);
        toast("Projeto importado.");
      } catch {
        toast("Falha ao importar.");
      } finally {
        ev.target.value = "";
      }
    });
  }

  // API pública
  return {
    bind,
    save,
    isChanged,
    format,
    insertReference,
    checkConsistency,
    updateStats,
    exportProject,
    importProject
  };
})();

export default Editor;

// ---- Toast fallback (se app.js não definir) ----
function toast(msg, ms = 1600) {
  let box = document.getElementById("toast-container");
  if (!box) { box = document.createElement("div"); box.id = "toast-container"; document.body.appendChild(box); }
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  box.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 300); }, ms);
}
