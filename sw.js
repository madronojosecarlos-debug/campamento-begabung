// Service worker "network-first": siempre intenta traer la ultima version de
// internet; si no hay conexion, usa la ultima guardada. Asi el acceso directo
// de la pantalla de inicio nunca se queda pegado a una version vieja.
var CACHE='campamento-v1';

self.addEventListener('install', function(e){ self.skipWaiting(); });

self.addEventListener('activate', function(e){
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(e){
  if(e.request.method!=='GET') return;
  e.respondWith(
    fetch(e.request).then(function(resp){
      var copy=resp.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request, copy); });
      return resp;
    }).catch(function(){
      return caches.match(e.request);
    })
  );
});
