
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
      price: 3,
      img: "images/weapon/sword.png",
      description: "Une lame aiguisée et légère, idéale pour les duels. Parfaite pour un vrai pirate !",
      buff: {
        damage: 1.5,
      },
    },
    {
      name: "Casque du Guerrier",
      price: 15,
      img: "images/weapon/hat.png",
      description: "Un casque forgé par un maître artisan. Protège efficacement mais alourdit légèrement son porteur.",
      buff: {
        defense: 3,
        speed: -1,
      },
    },
    {
      name: "Arc des Elfes",
      price: 20,
      img: "images/weapon/bow.png",
      description: "Un arc d'une finesse remarquable, favorisant une cadence de tir rapide mais moins puissant en combat rapproché.",
      buff: {
        damage: -3,
        attackspeed: 5,
      },
    },
    {
      name: "Massue des Orcs",
      price: 15,
      img: "images/weapon/mace.png",
      description: "Une arme brutale conçue pour écraser les ennemis. Délivre des coups dévastateurs mais ralentit les attaques.",
      buff: {
        damage: 10,
        attackspeed: -5,
      },
    },
  ];
  
  function openShop() {
    console.log("ouvrir le shop");
    pausedChange();
  
    const shop = document.getElementById("shopPopup");
    const shopStand = document.getElementById("stand-shope");
    shopStand.innerHTML = ""; // Nettoyer le shop avant d'ajouter les objets
  
    shopItems.forEach((item) => {
      let itemDiv = document.createElement("div");
      itemDiv.classList.add("shop-item");
  
      // Conteneur de l'image avec overlay
      let imgContainer = document.createElement("div");
      imgContainer.classList.add("img-container");
  
      let img = document.createElement("img");
      img.src = item.img;
      img.alt = item.name;
      img.classList.add("item-img");
  
      // Overlay toujours visible avec nom et prix
      let overlay = document.createElement("div");
      overlay.classList.add("overlay");
      overlay.innerHTML = `<strong>${item.name}</strong><br>💰 ${item.price} pièces`;
  
      imgContainer.appendChild(img);
      imgContainer.appendChild(overlay);
  
      // Description cachée par défaut (visible en hover)
      let description = document.createElement("p");
      description.classList.add("item-description");
      description.textContent = item.description;
  
      let buyButton = document.createElement("button");
      buyButton.textContent = "Acheter";
      buyButton.classList.add("buy-btn");

      buyButton.onclick = () => {
        if (player.gold >= item.price) {
          buyItem(item);
        } else {
          // Ajoute une animation de secousse sur la tuile
          itemDiv.classList.add("shake");
          setTimeout(() => {
            itemDiv.classList.remove("shake");
          }, 500); // Supprime l'animation après 500ms
        }
      };
      

      itemDiv.appendChild(imgContainer);
      itemDiv.appendChild(description); // Ajout de la description cachée
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
          
    player.gold = player.gold - item.price;
    document.getElementById("gold").textContent = parseFloat(player.gold);
    Object.keys(item.buff).forEach((stat) => {
        console.log(`Stat en cours : ${stat}`);
        console.log("Joueur avant :", player);
        
        if (stat in player) {
          console.log(`${stat} existe dans player, ajout de ${item.buff[stat]}`);
          player[stat] += item.buff[stat]; 
          document.getElementById(`${stat}`).textContent = parseFloat(player[stat]);

        } else if (stat in player.weapon) {
          console.log(`${stat} existe dans player.weapon, ajout de ${item.buff[stat]}`);
          player.weapon[stat] += item.buff[stat]; 
          document.getElementById('damage').textContent = parseFloat(player.weapon[stat]);

        } else {`${stat}`
          console.warn(`${stat} n'existe ni dans player ni dans player.weapon`);
        }
        console.log("Joueur après :", player);
      });
      
}
