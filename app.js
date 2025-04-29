
function fetchArticles() {
    return fetch("https://api.thecatapi.com/v1/images/search?limit=10")
      .then(response => response.json())
      .then(data => {
        return data; // on retourne les données récupérées
      })
      .catch(error => {
        console.error("Erreur :", error); // en cas d'erreur, on l'affiche
      });
  }
//async function fetchArticles() {
 // const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
 // const data = await response.json();
 // return data;
//}
function createPostElement(post) {
        const div = document.createElement("div");
        div.className = "post";
      
        const img = document.createElement("img");
        img.src = post.url;
        img.alt = "Image de chat";
        img.style.width = "300px";
      
        div.appendChild(img);
        return div;
      }
      
      function loadFeed() {
        const feed = document.getElementById("feed");
        feed.innerHTML = ""; // On vide le mur
      
        fetchArticles().then(posts => {
          posts.forEach(post => {
            const postEl = createPostElement(post);
            feed.appendChild(postEl);
          });
        });

    }

    
