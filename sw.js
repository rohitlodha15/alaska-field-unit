/* Field Unit service worker — cache-first shell, stale-while-revalidate data */
const SHELL='fu-shell-v1', TILES='fu-tiles', DATA='fu-data';
const CORE=['./','./index.html','./manifest.webmanifest',
 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(SHELL).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(
    ks.filter(k=>![SHELL,TILES,DATA].includes(k)).map(k=>caches.delete(k))
  )).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const u=e.request.url;
  if(e.request.method!=='GET')return;
  if(u.includes('basemaps.cartocdn.com')){
    e.respondWith(caches.open(TILES).then(async c=>{
      const hit=await c.match(e.request); if(hit)return hit;
      try{const r=await fetch(e.request); if(r.ok)c.put(e.request,r.clone()); return r;}
      catch(err){return new Response('',{status:408});}
    })); return;
  }
  if(u.includes('swpc.noaa.gov')||u.includes('open-meteo.com')){
    e.respondWith(caches.open(DATA).then(async c=>{
      try{const r=await fetch(e.request); if(r.ok)c.put(e.request,r.clone()); return r;}
      catch(err){const hit=await c.match(e.request); return hit||new Response('null',{headers:{'Content-Type':'application/json'}});}
    })); return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
    if(r.ok&&(u.startsWith(self.location.origin)||u.includes('unpkg.com'))){
      const cl=r.clone(); caches.open(SHELL).then(c=>c.put(e.request,cl));
    } return r;
  }).catch(()=>caches.match('./index.html'))));
});
