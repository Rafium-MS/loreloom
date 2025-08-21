
// router.js — roteador hash-based minimalista com beforeEach assíncrono
function parseHash(hash) {
  const raw = (hash || "").replace(/^#/, "");
  const [pathPart, queryPart] = raw.split("?");
  const path = pathPart?.startsWith("/") ? `#${pathPart}` : `#/${pathPart || ""}`;
  const query = {};
  if (queryPart) {
    for (const kv of queryPart.split("&")) {
      if (!kv) continue;
      const [k, v] = kv.split("=");
      query[decodeURIComponent(k)] = decodeURIComponent(v ?? "");
    }
  }
  return { path: path || "#/", query };
}

const Router = (() => {
  let validRoutes = new Set();
  let current = { path: "#/", query: {} };
  let defaultRoute = "#/";
  const listeners = new Set();
  const guards = [];
  let isTransitioning = false;

  function notify(to, from) { listeners.forEach(fn => fn(to, from)); }

  async function runGuards(to, from) {
    for (const guard of guards) {
      const res = await guard(to, from);
      if (res === false) return { action: "cancel" };
      if (typeof res === "string" || (res && typeof res === "object" && res.path)) {
        return { action: "redirect", to: res };
      }
    }
    return { action: "proceed" };
  }

  async function resolve(hash) {
    const from = current;
    const parsed = parseHash(hash || defaultRoute);
    const target = validRoutes.size
      ? (validRoutes.has(parsed.path) ? parsed : parseHash(defaultRoute))
      : parsed;

    const guardResult = await runGuards(target, from);
    if (guardResult.action === "cancel") {
      if (location.hash !== from.path) location.hash = from.path;
      return;
    }
    if (guardResult.action === "redirect") {
      navigate(guardResult.to);
      return;
    }

    current = target;
    const normalized = `${target.path}${Object.keys(target.query).length ? "?" + new URLSearchParams(target.query).toString() : ""}`;
    if (location.hash !== normalized) {
      location.hash = normalized;
      return;
    }
    notify(current, from);
  }

  async function onHashChange() {
    if (isTransitioning) return;
    isTransitioning = true;
    try { await resolve(location.hash); }
    finally { isTransitioning = false; }
  }

  function use(routes = [], options = {}) {
    validRoutes = new Set(routes);
    defaultRoute = options.default || routes[0] || "#/";
    window.removeEventListener("hashchange", onHashChange);
    window.addEventListener("hashchange", onHashChange);
    onHashChange();
  }

  function onChange(cb) { if (typeof cb === "function") listeners.add(cb); return () => listeners.delete(cb); }
  function beforeEach(fn) { if (typeof fn === "function") guards.push(fn); return () => { const i = guards.indexOf(fn); if (i>=0) guards.splice(i,1); }; }
  function get() { return { ...current }; }

  function navigate(to) {
    if (!to) return;
    if (typeof to === "string") {
      location.hash = to.startsWith("#") ? to : `#${to.replace(/^#/, "")}`;
    } else if (to.path) {
      const qs = to.query ? ("?" + new URLSearchParams(to.query).toString()) : "";
      location.hash = `${to.path.startsWith("#") ? to.path : `#${to.path.replace(/^#/, "")}`}${qs}`;
    }
  }

  return { use, onChange, beforeEach, get, navigate };
})();

export default Router;
