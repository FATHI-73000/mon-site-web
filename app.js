
function fetchArticles() {
  return fetch("https://api.thecatapi.com/v1/images/search?limit=10")
    .then(response => response.json())
    .catch(error => {
      console.error("Erreur :", error);
    });
}

/* ----------------------------------------
   Création dynamique des éléments de posts
---------------------------------------- */
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

/* ----------------------------------------
   Chargement et affichage du fil d’images
---------------------------------------- */
function loadFeed() {
  const feed = document.getElementById("feed");
  if (!feed) return;

  feed.innerHTML = "";

  fetchArticles().then(posts => {
    posts.forEach(post => {
      const postEl = createPostElement(post);
      feed.appendChild(postEl);
    });
  });
}

/* ----------------------------------------
   Menu déroulant : ouvrir / fermer
---------------------------------------- */
function toggleMenu() {
  const menu = document.getElementById("contenuMenu");
  if (menu) {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  }
}

// Fermer le menu si clic en dehors d’un bouton
window.onclick = function (event) {
  if (!event.target.matches("button")) {
    const dropdowns = document.getElementsByClassName("contenuMenu");
    for (let i = 0; i < dropdowns.length; i++) {
      dropdowns[i].style.display = "none";
    }
  }
};

/* ----------------------------------------
   Gestion du formulaire d’ajout d’image par URL
---------------------------------------- */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("postForm");
  const input = document.getElementById("imageUrl");
  const feed = document.getElementById("feed");

  if (form && input) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const imageUrl = input.value.trim();
      if (imageUrl !== "") {
        const newPost = { url: imageUrl };
        const postEl = createPostElement(newPost);

        if (feed) {
          feed.appendChild(postEl);
        } else {
          // Si #feed n'existe pas (ex: page formulaire), ajouter après le formulaire
          form.parentNode.appendChild(postEl);
        }

        form.reset();
      }
    });
  }
});

/* ----------------------------------------
   Vue galerie : changement de disposition
---------------------------------------- */
function setView(mode) {
  const gallery = document.getElementById("gallery");
  if (gallery) {
    gallery.className = "gallery " + mode;
  }
}

/* ----------------------------------------
   Ajout d’image via l’explorateur de fichiers
---------------------------------------- */
const ajoutImage = document.getElementById("ajoutImage");
const galerie = document.getElementById("gallery");

if (ajoutImage && galerie) {
  ajoutImage.addEventListener("change", function (event) {
    const fichier = event.target.files[0];
    if (fichier && fichier.type.startsWith("image/")) {
      const lecteur = new FileReader();
      lecteur.onload = function (e) {
        const container = document.createElement("div");
        container.classList.add("image-container");

        const img = document.createElement("img");
        img.src = e.target.result;
        img.alt = "Image ajoutée";

        const btn = document.createElement("button");
        btn.textContent = "✖";
        btn.classList.add("delete-btn");
        btn.onclick = () => {
          if (confirm("Voulez-vous vraiment supprimer cette image ?")) {
            container.remove();
          }
        };

        container.appendChild(img);
        container.appendChild(btn);
        galerie.appendChild(container);
      };
      lecteur.readAsDataURL(fichier);
    }
  });
}

/* ----------------------------------------
   Carrousel publicitaire d’images (défilement auto)
---------------------------------------- */
const pubImages = document.querySelectorAll(".pub-image");
let indexPub = 0;

function defilePub() {
  if (pubImages.length === 0) return;

  pubImages.forEach(img => img.classList.remove("active"));
  indexPub = (indexPub + 1) % pubImages.length;
  pubImages[indexPub].classList.add("active");
}

setInterval(defilePub, 3000);

/* ----------------------------------------
   Initialisation au chargement
---------------------------------------- */
window.onload = () => {
  loadFeed(); // Ne s’exécute que si #feed est présent
};