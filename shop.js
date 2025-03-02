// window.isPaused = false;
// window.gameLoop = gameLoop;

import { gameLoop, pausedChange, player } from "./main.js";
// Récupérer les éléments du DOM
const shopBtnCancel = document.getElementById("cancelShop");
shopBtnCancel.addEventListener("click", closeShop);
const shopBtnOpen = document.getElementById("shop");
shopBtnOpen.addEventListener("click", openShop);
const shop = document.getElementById("shopPopup");
// toutes les statistiques sont en pourcentage
const shopItems = [
    {
      name: "Épée du Pirate",
      price: 7,
      img: "sword.png",
      description: "Une lame aiguisée et légère, idéale pour les duels. Parfaite pour un vrai pirate !",
      buff: {
        attack: 1.5,
      },
    },
    {
      name: "Casque du Guerrier",
      price: 15,
      img: "hat.png",
      description: "Un casque forgé par un maître artisan. Protège efficacement mais alourdit légèrement son porteur.",
      buff: {
        defense: 3,
        speed: -1,
      },
    },
    {
      name: "Arc des Elfes",
      price: 20,
      img: "bow.png",
      description: "Un arc d'une finesse remarquable, favorisant une cadence de tir rapide mais moins puissant en combat rapproché.",
      buff: {
        attack: -3,
        attackspeed: 5,
      },
    },
    {
      name: "Massue des Orcs",
      price: 15,
      img: "mace.png",
      description: "Une arme brutale conçue pour écraser les ennemis. Délivre des coups dévastateurs mais ralentit les attaques.",
      buff: {
        attack: 10,
        attackspeed: -5,
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
  console.log(item.buff)
 Object.keys(item.buff).forEach((stat) => {
      if (stat in player) {
        player[stat] += item.buff[stat]; // Buff standard (ex: speed, defense)
      } else if (stat in player.weapon) {
        player.weapon[stat] += item.buff[stat]; // Buff d'arme (ex: attack, attackspeed)
      }
    });
}
