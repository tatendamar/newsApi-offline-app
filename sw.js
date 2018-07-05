importScripts('/js/idb.js');
importScripts('/js/utility.js');

const CACHE_VERSION = 'static-v6';
const CACHE_DYNAMIC_VERSION =  'dynamic-v4';
STATIC_FILES= [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/idb.js',
  '/style.css',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-beta/css/materialize.min.css',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-rc.2/js/materialize.min.js'
];


self.addEventListener('install', function(event){
  console.log(`installing the service worker ... ${event}`);
  event.waitUntil(
    caches.open(CACHE_VERSION)
    .then(function(cache){
      console.log('Precaching app shell');
      cache.addAll(STATIC_FILES)
    })
  );
});


self.addEventListener('activate', function(event){
  console.log(`activating the service worker ... ${event}`);
  event.waitUntil(
    caches.keys()
    .then(function(keyList){
      return Promise.all(keyList.map(function(key){
        if(key !== CACHE_VERSION && key !== CACHE_DYNAMIC_VERSION){
          console.log('Removing old cache.', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request)
    .then(function(response){
      if(response){
        return response;
      } else {
        readAllData('feeds')
        .then(function(data){
           console.log('From cache', data);
            data.forEach(function(key){
              if(key){
                console.log('Returned',key);
                return key;
              }

       })
      })
    }
      return fetch(event.request)
          .then(function(res){
            return caches.open(CACHE_DYNAMIC_VERSION)
            .then(function(cache){
              cache.put(event.request, res.clone());
              return res;
            })
          })
        })
        );
       event.respondWith(
       fetch(event.request)
        .then(function(res){

            const clonedRes = res.clone()
            clonedRes.json()
            .then(function(data){
                for(key in data.articles){
              console.log('data sarved', data.articles[key])
                writeData('feeds', data.articles[key]);
              }
            });
             return res;
          })
        .catch(function(err){

        })
  );
});

