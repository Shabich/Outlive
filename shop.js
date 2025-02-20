// window.isPaused = false;
// window.gameLoop = gameLoop;

import { gameLoop, pausedChange } from "./main.js";
// Récupérer les éléments du DOM
const shopBtnCancel = document.getElementById("cancelShop");
shopBtnCancel.addEventListener("click", closeShop);
const shopBtnOpen = document.getElementById("shop");
shopBtnOpen.addEventListener("click", openShop);
const shop = document.getElementById("shopPopup");
// toutes les statistiques sont en pourcentage
const shopItems = [
  {
    name: "Épée de pirate",
    price: 7,
    img: "sword.png",
    descripton: "Une bonne épée qui vous aidera a vous défaire de vos ennemis! Sans réel inconvénient..",
    buff: {
      attack: 15,
    },
  },
  {
    name: "Casque de guerrier",
    price: 15,
    img: "hat.png",
    descripton: "Armure tres lourde forgé par un forgeron légendaire, elle permet à son porteur de resister à tout.. ou presque..  ",
    buff: {
      defense: 30,
      speed: -20,
    },
  },
  {
    name: "Arc des elfes",
    price: 20,
    img: "map.png",
    descripton: "Une bonne épée qui vous aidera a vous défaire de vos ennemis! Sans réel inconvénient..",
    buff: {
      attack: -50,
      attackspeed: 50,
    },
  },
  {
    name: "Massue des orcs",
    price: 15,
    img: "compass.png",
    descripton: "Une bonne épée qui vous aidera a vous défaire de vos ennemis! Sans réel inconvénient..",
    buff: {
      attack: 100,
      attackspeed : -50,
    },
  },
];

function openShop() {
  console.log("ouvrir le shop");
  pausedChange(); // Mettre à jour la variable globale

  const shop = document.getElementById("shopPopup");
  const shopStand = document.getElementById("stand-shope");
  shopStand.innerHTML = ""; // Vider avant d'ajouter les nouveaux éléments

  // Ajouter les objets au shop
  shopItems.forEach((item) => {
    let itemDiv = document.createElement("div");
    itemDiv.classList.add("shop-item");

    let img = document.createElement("img");
    img.src = item.img;
    img.alt = item.name;
    img.classList.add("item-img");

    let name = document.createElement("p");
    name.textContent = item.name;

    let price = document.createElement("p");
    price.textContent = `💰 ${item.price} pièces`;

    let buyButton = document.createElement("button");
    buyButton.textContent = "Acheter";
    buyButton.classList.add("buy-btn");
    buyButton.onclick = () => buyItem(item);

    itemDiv.appendChild(img);
    itemDiv.appendChild(name);
    itemDiv.appendChild(price);
    itemDiv.appendChild(buyButton);
    shopStand.appendChild(itemDiv);
  });

  shop.style.display = "block";
}

function closeShop() {
  document.getElementById("shopPopup").style.display = "none";
  pausedChange(); // Mettre à jour la variable globale
  gameLoop(); // Reprendre le jeu
}

function buyItem(item) {
  console.log(`Achat de ${item.name} pour ${item.price} pièces`);
  // Ajouter ici la logique d'achat, par exemple vérifier les pièces du joueur
}
