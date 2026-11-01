// Gerado por tools/gerar_lista.py — não edite em _site/.
//
// O service worker só serve arquivos do cache da versão em uso. Quem baixa versões
// novas é a própria página (index.html, função atualizar): ela lê versao.json sem
// cache e monta um cache novo "compras-<versão>" (copia do cache atual o que tem o
// mesmo hash e baixa o resto); com tudo pronto, grava a versão em uso em
// "compras-meta". Assim nunca fica uma versão pela metade.
const META = "compras-meta";
const CHAVE_VERSAO = "versao-em-uso";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

async function versaoEmUso() {
  const meta = await caches.open(META);
  const r = await meta.match(CHAVE_VERSAO);
  return r ? (await r.text()) : null;
}

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  // versao.json e os downloads da página ("?rede=") vão direto para a rede.
  if (url.pathname.endsWith("/versao.json") || url.searchParams.has("rede")) return;
  e.respondWith((async () => {
    const v = await versaoEmUso();
    if (v) {
      const c = await caches.open("compras-" + v);
      const hit = await c.match(e.request, { ignoreSearch: true });
      if (hit) return hit;
      if (e.request.mode === "navigate") {
        const idx = await c.match("./");
        if (idx) return idx;
      }
    }
    return fetch(e.request);
  })());
});
