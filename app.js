
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
const urls = {
  facile: 'https://mocki.io/v1/TON_URL1',
  moyen: 'https://mocki.io/v1/TON_URL2',
  difficile: 'https://mocki.io/v1/TON_URL3'
};

let tentativesRestantes;
let premiereCarte = null;
let verouiller = false;
let pairesTrouvees = 0;

const niveauSelect = document.getElementById('niveau-select');
niveauSelect.addEventListener('change', async (e) => {
  const niveau = e.target.value;
  if (!niveau) return;
  const res = await fetch(urls[niveau]);
  const data = await res.json();
  setupJeu(data);
});

function setupJeu(data) {
  document.getElementById('info-jeu').innerHTML = 
    `<h2>${data.nom} (${data.niveau})</h2>
     <p>Paires à trouver : ${data.paires}</p>
     <p>Tentatives max : ${data.tentatives_max}</p>
     <p id="tentatives">Tentatives restantes : ${data.tentatives_max}</p>`;

  tentativesRestantes = data.tentatives_max;
  pairesTrouvees = 0;
  premiereCarte = null;
  verouiller = false;

  const images = [...data.images, ...data.images];
  images.sort(() => Math.random() - 0.5);

  const plateau = document.getElementById('plateau-jeu');
  plateau.innerHTML = '';
  images.forEach(src => {
    const carte = document.createElement('div');
    carte.className = 'carte';
    const img = document.createElement('img');
    img.src = src;
    carte.appendChild(img);
    carte.addEventListener('click', () => handleClick(carte));
    plateau.appendChild(carte);
  });
}

function handleClick(carte) {
  if (verouiller || carte.classList.contains('revelee')) return;
  carte.classList.add('revelee');
  if (!premiereCarte) {
    premiereCarte = carte;
    return;
  }

  const img1 = premiereCarte.querySelector('img').src;
  const img2 = carte.querySelector('img').src;
  if (img1 === img2) {
    pairesTrouvees++;
    if (pairesTrouvees * 2 === document.querySelectorAll('.carte').length) {
      alert('Bravo ! Vous avez gagné !');
      updateStats(true);
    }
    premiereCarte = null;
  } else {
    verouiller = true;
    setTimeout(() => {
      premiereCarte.classList.remove('revelee');
      carte.classList.remove('revelee');
      premiereCarte = null;
      verouiller = false;
    }, 1000);
    tentativesRestantes--;
    document.getElementById('tentatives').textContent = `Tentatives restantes : ${tentativesRestantes}`;
    if (tentativesRestantes <= 0) {
      alert('Dommage ! Vous avez perdu.');
      updateStats(false);
    }
  }
}

function updateStats(gagne) {
  const niveau = document.getElementById('niveau-select').value;
  const stats = JSON.parse(localStorage.getItem('memoryStats')) || {};
  if (!stats[niveau]) stats[niveau] = { parties: 0, victoires: 0 };
  stats[niveau].parties++;
  if (gagne) stats[niveau].victoires++;
  localStorage.setItem('memoryStats', JSON.stringify(stats));
}
