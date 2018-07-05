

 const dbPromise = idb.open('feed-store', 1, function(db){
  if(!db.objectStoreNames.contains('feeds')){
    db.createObjectStore('feeds',{keyPath: 'title'});
  }
});

function writeData(sto, data){
  return dbPromise
  .then(function(db){
    const tx = db.transaction(sto, 'readwrite');
    const store = tx.objectStore(sto);
    store.put(data);
    //console.log(data);
    return tx.complete;
 })
}

function readAllData(sto){
  return dbPromise
  .then(function(db){
    const tx = db.transaction(sto, 'readonly');
    const store = tx.objectStore(sto);
    //console.log(store.getAll());
    return store.getAll();
  })
//.then(function(val){
//     console.log('From cache', val);
//   val.forEach(function(key){
//   console.log('awesome', key);
//     return key;
//  })
// })
}