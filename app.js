
function fetchArticles() {    // récupérer des données depuis une API via la méthode fetch.
    return fetch("https://api.thecatapi.com/v1/images/search?limit=10")
      .then(response => response.json()) //  est une méthode qui **convertit la réponse JSON en objet JavaScript**.
      .then(data => {
        return data; // on retourne les données récupérées   //représente les vraies données retournées par l’API, une fois qu’elles ont été transformées depuis le format JSON.
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
        div.className = "post";   //Cette ligne assigne une classe CSS à l’élément HTML div
      
        const img = document.createElement("img"); // pour créer des éléments HTML 
        img.src = post.url;
        img.alt = "Image de chat"; //alt signifie "texte alternatif".

        img.style.width = "300px";
      
        div.appendChild(img); // Elle ajoute l’élément img (une image) dans l’élément div (le conteneur ou "post").
        return div;
      }
      
      function loadFeed() {   //  C’est la fonction qui remplit dynamiquement la page avec les images.
        const feed = document.getElementById("feed"); // C’est une méthode qui permet de récupérer un élément HTML à partir de son attribut id.
        feed.innerHTML = ""; // On vide le mur
      
        fetchArticles().then(posts => { //Cette fonction récupère les données depuis une API (par exemple, les images de chats).
          posts.forEach(post => {       //.forEach() est une méthode de tableau qui permet d'itérer sur chaque élément du tableau.

            const postEl = createPostElement(post); // postEl est l'élément HTML créé par la fonction createPostElement.
            feed.appendChild(postEl); // Cela permet de modifier et mettre à jour le contenu de la page en temps réel sans la recharger.
          });
        });

      }

        function toggleMenu(){
         const menu= document.getElementById("contenuMenu");
         menu.style.display = menu.style.display === "block" ? "none" : "block" ; 
        }
        
        window.onclick =function(event){
        // Si l'élément cliqué n'est pas un bouton
       if (!event.target.matches("button")){  // matches() est une méthode qui vérifie si un élément HTML correspond à un sélecteur CSS.
        // On récupère tous les éléments avec la classe "contenuMenu"

      const Menudropdown = document.getElementsByClassName("contenuMenu") ;

       // On boucle sur chaque menu déroulant trouvé
       for( let i = 0; i< Menudropdown.length; i++){
        //  On cache le menu (en mettant display: none)

        Menudropdown [i].style.display ="none" ;

       }

      }

        }
        // Gérer la soumission du formulaire
document.getElementById("postForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Empêche le rechargement de la page

  const imageUrl = document.getElementById("imageUrl").value;

  if (imageUrl.trim() !== "") {
    const newPost = { url: imageUrl };
    const postEl = createPostElement(newPost);
    document.getElementById("feed").appendChild(postEl);
    document.getElementById("postForm").reset(); // Réinitialise le formulaire
  }
});


        
    

    
