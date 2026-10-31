// Gerado por tools/gerar_lista.py — não edite em _site/.
const VERSAO = "6946906083bb";
const CACHE = "compras-" + VERSAO;
const ARQUIVOS = [
 "./",
 "dados.json",
 "fotos/abobrinha.jpg",
 "fotos/alho.jpg",
 "fotos/cebola.jpg",
 "fotos/champignon.jpg",
 "fotos/coalhada-fresca-1.jpg",
 "fotos/coalhada-fresca-2.jpg",
 "fotos/cogumelo-portobello.jpg",
 "fotos/fuba-1.jpg",
 "fotos/fuba-2.jpg",
 "fotos/linguica-fresca-1.jpg",
 "fotos/linguica-fresca-2.jpg",
 "fotos/linguica-fresca-3.jpg",
 "fotos/manjericao.jpg",
 "fotos/manteiga-1.jpg",
 "fotos/manteiga-2.jpg",
 "fotos/manteiga-3.jpg",
 "fotos/pimenta-de-cheiro.jpg",
 "fotos/pimentao-vermelho.jpg",
 "fotos/salsinha.jpg",
 "fotos/tomate-pelado-em-lata-1.jpg",
 "fotos/tomate-pelado-em-lata-2.jpg",
 "fotos/tomate.jpg",
 "fotos/tomilho.jpg",
 "fotos/urucum-1.jpg",
 "fotos/urucum-2.jpg",
 "icone-180.png",
 "icone-512.png",
 "manifest.webmanifest"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith("compras-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Tudo sai do cache (funciona offline). Uma lista nova chega como um sw.js novo:
// o navegador confere o sw.js a cada abertura com internet, instala e a página recarrega.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(async (c) => {
      const hit = await c.match(e.request, { ignoreSearch: true });
      if (hit) return hit;
      if (e.request.mode === "navigate") {
        const idx = await c.match("./");
        if (idx) return idx;
      }
      return fetch(e.request);
    })
  );
});
