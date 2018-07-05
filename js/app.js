

if(!window.Promise){
  window.Promise = Promise;
}

if("serviceWorker" in navigator){
  navigator.serviceWorker
  .register('/sw.js')
  .then(function(){
    console.log('Worker registered');
  })
  .catch(function(err){
    console.log(err);
  });
}


let newtorkData = false;

document.querySelector('.get-news').addEventListener('click', getNews);

function getNews(e){
  const country = document.querySelector('input[type="text"]').value;

   const url = 'https://newsapi.org/v2/top-headlines?'+'country='+country+'&'               + 'apiKey=4b5bcaf6beb74363a2a83b13c1fbbab8';

  const req = new Request(url);

     fetch(req)
         .then(function(response) {
         return response.json();
     }).then(function(data){
       
         let output = ''
       if(data.status === 'ok'){
         data.articles.forEach(function(article){
            output += `
              <div class="card">
                <div class="card-image waves-effect waves-block waves-light">
                  <img class="activator" src="${article.urlToImage}">
                  </div>
                  <div class="card-content">
                    <span class="card-title activator grey-text        text-darken-4">${article.title}<i class="material-icons   right">more_vert</i></span>
                    <p><a href="${article.url}">Visit</a></p>
                 </div>
                <div class="card-reveal">
                  <span class="card-title grey-text text-darken-4">${article.title}<i class="material-icons right">close</i></span>
                 <p>${article.description}</p>
             </div>
          </div>
            `
         });
       }
       document.querySelector('.news').innerHTML = output;
     }).catch(function(err){
       console.log(err);
     });
   


     e.preventDefault();
};



