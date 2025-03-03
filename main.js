// main.js

import {
  createMonsters,
  createBoss,
  updateMonsters,
  spawnMonster,
  findClosestMonster,
  checkProjectileCollision,
} from "./monster.js";
import { Projectile } from "./Projectile.js";
import { Loot } from "./loot.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

 export let player = {
  x: 50,
  y: 50,
  width: 80,
  height: 80,
  health: 100,
  defense: 1,
  maxHealth: 100,
  gold: 0,
  xp: 0,
  speed: 3,
  image: "./images/Craby.png",
  weapon: {
    damage: 1,
    attackspeed: 1,
    fireRate: 1000, // Temps entre chaque tir en millisecondes
    lastShot: 0, // Timestamp du dernier tir
  },
};

const xpParNiveau = 100;
let niveau = 0;
let loots = [];
let projectiles = [];
let keys = { up: false, down: false, left: false, right: false };
let isPaused = false;
// Gestion des événements clavier et boutons (identique à avant)
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") keys.up = true;
  if (event.key === "ArrowDown") keys.down = true;
  if (event.key === "ArrowLeft") keys.left = true;
  if (event.key === "ArrowRight") keys.right = true;
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowUp") keys.up = false;
  if (event.key === "ArrowDown") keys.down = false;
  if (event.key === "ArrowLeft") keys.left = false;
  if (event.key === "ArrowRight") keys.right = false;
});

document.getElementById("upButton").addEventListener("click", () => {
  keys.up = true;
  keys.down = false;
  keys.left = false;
  keys.right = false;
});

document.getElementById("downButton").addEventListener("click", () => {
  keys.down = true;
  keys.up = false;
  keys.left = false;
  keys.right = false;
});

document.getElementById("leftButton").addEventListener("click", () => {
  keys.left = true;
  keys.up = false;
  keys.down = false;
  keys.right = false;
});

document.getElementById("rightButton").addEventListener("click", () => {
  keys.right = true;
  keys.up = false;
  keys.down = false;
  keys.left = false;
});

const gamePopup = document.getElementById("menuPopup");
const resumeButton = document.getElementById("resumeButton");
resumeButton.addEventListener("click", togglePause);
// Fonction pour dessiner le joueur
function drawPlayer() {
  const healthBarWidth = player.width;
  const healthBarHeight = 5;
  const healthPercentage = player.health / player.maxHealth;
  const healthColor =
    healthPercentage > 0.6
      ? "green"
      : healthPercentage > 0.3
      ? "orange"
      : "red";

  // Dessiner l'arrière-plan de la barre de vie
  ctx.fillStyle = "gray";
  ctx.fillRect(
    player.x,
    player.y - healthBarHeight - 5,
    healthBarWidth,
    healthBarHeight
  );

  // Dessiner la barre de vie actuelle
  ctx.fillStyle = healthColor;
  ctx.fillRect(
    player.x,
    player.y - healthBarHeight - 5,
    healthBarWidth * healthPercentage,
    healthBarHeight
  );

  // Mettre à jour les informations du joueur dans l'interface
  document.getElementById("health").textContent =
    Math.round(player.health) + " / " + player.maxHealth;
  document.getElementById("damage").textContent = parseFloat(
    player.weapon.damage.toFixed(1)
  );
  document.getElementById("speed").textContent = parseFloat(
    player.weapon.attackspeed.toFixed(1)
  );
  document.getElementById("gold").textContent = parseFloat(player.gold);
  document.getElementById("defense").textContent = parseFloat(player.defense.toFixed(1));

  document.getElementById("pauseButton").addEventListener("click", togglePause);


  // Dessiner le joueur (image)
  const playerImage = new Image();
  playerImage.src = player.image;
  if (playerImage.complete) {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
  } else {
    playerImage.onload = function () {
      ctx.drawImage(
        playerImage,
        player.x,
        player.y,
        player.width,
        player.height
      );
    };
  }
}


document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
      togglePause(); 
  }
});
document.addEventListener("keydown", function (event) {
  if (event.code === "Space") {
      event.preventDefault(); 
      togglePause(); 
  }
});

function togglePause() {
  isPaused = !isPaused;
  if (!isPaused) {
    gamePopup.style.display = "none";
    gameLoop(); // Relancer la boucle de jeu si on reprend
  } else {
    gamePopup.style.display = "flex";
  }
}

// Fonction pour effacer le canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Fonction pour déplacer le joueur
function movePlayer() {
  if (keys.up && player.y > 0) player.y -= player.speed;
  if (keys.down && player.y + player.height < canvas.height)
    player.y += player.speed;
  if (keys.left && player.x > 0) player.x -= player.speed;
  if (keys.right && player.x + player.width < canvas.width)
    player.x += player.speed;
}

function shootProjectile(player, monsters) {
  const closestMonster = findClosestMonster(player, monsters);
  if (closestMonster) {
    const projectile = new Projectile(
      player.x + player.width / 2,
      player.y + player.height / 2,
      closestMonster
    );

    projectiles.push(projectile);

    // Supprimer le projectile après 3 secondes
    setTimeout(() => {
      const index = projectiles.indexOf(projectile);
      if (index !== -1) {
        projectiles.splice(index, 1);
      }
    }, 1000);
  }
}

function showDefeatScreen(score) {
  const popupMessage = document.getElementById("popupMenuMessage");
  const popupMenu = document.querySelector(".popupMenu");
  const popupButtons = document.querySelector(".popupMenu-buttons");

  popupMessage.innerHTML = "💀 Défaite ! 💀";

  const scoreText = document.createElement("p");
  scoreText.textContent = `Ton score est de ${score}`;
  popupMenu.insertBefore(scoreText, popupButtons);

  popupButtons.innerHTML = `
    <button id="restartButton">🔄 Recommencer une partie</button>
    <button onclick="window.location.href='index.html'">⚓ Retourner au port</button>
  `;

  document
    .getElementById("restartButton")
    .addEventListener("click", restartGame);

  document.getElementById("menuPopup").style.display = "flex";
}

function restartGame() {
  window.location.reload();
}

function checkLootCollision() {
  loots.forEach((loot, index) => {
    if (
      player.x < loot.x + loot.width &&
      player.x + player.width > loot.x &&
      player.y < loot.y + loot.height &&
      player.y + player.height > loot.y
    ) {
      // Appliquer le buff au joueur
      applyLootEffect(loot.buff);

      // Supprimer le loot après l'avoir ramassé
      loots.splice(index, 1);
    }
  });
}

function applyLootEffect(buff) {
  const type = Object.keys(buff)[0]; // Ex: "health", "damage", etc.
  const value = buff[type];
  switch (type) {
    case "health":
      player.maxHealth = player.maxHealth + value;
      player.health = player.health + value;
      showStatBanner(`+${value} Santé`);
      break;
    case "damage":
      player.weapon.damage += value;
      showStatBanner(`+${value} Dégâts`);
      break;
    case "speed":
      player.weapon.attackspeed += value;
      console.log(value);
      showStatBanner(`+${value} Vitesse d'attaque`);
      break;
    case "heal":
      player.health = Math.min(player.health + value, player.maxHealth);
      showStatBanner(`+${value} Soin`);
      break;
    case "defense":
      player.defense += value;
      showStatBanner(`+${value} Defense`);
      break;
    case "gold":
      player.gold += value;
      showStatBanner(`+${value} Piece d'or`);
      break;
  }
}

// Créer des monstres en passant canvas en paramètre
let monsters = createMonsters(5, canvas);
export function pausedChange(){
  isPaused = !isPaused;
}
// Boucle de jeu
// main.js

export function gameLoop() {
  if (isPaused) return;

  clearCanvas();
  movePlayer();
  checkLootCollision();

  drawPlayer();
  loots.forEach((loot) => loot.draw());

  // Tirer un projectile si le temps est écoulé
  const now = Date.now();
  const attackSpeed = player.weapon.attackspeed; // Par défaut à 1 si non défini
  const adjustedFireRate = player.weapon.fireRate / attackSpeed;

  if (now - player.weapon.lastShot > adjustedFireRate) {
    shootProjectile(player, monsters);
    player.weapon.lastShot = now;
  }

  if (player.health <= 0) {
    showDefeatScreen(document.getElementById("experience").textContent);
    return;
  }

  // Mettre à jour et dessiner les projectiles
  projectiles.forEach((projectile, index) => {
    projectile.update();
    projectile.draw(ctx);

    // Vérifier les collisions avec les monstres
    monsters.forEach((monster, monsterIndex) => {
      if (checkProjectileCollision(projectile, monster)) {
        monster.health -= player.weapon.damage;
        if (monster.health <= 0) {
          monsters.splice(monsterIndex, 1);
          player.xp = player.xp + monster.gainXp;
          ajouterExperience(monster.gainXp);
          if (Math.random() < 0.2 /*1  */) {
            loots.push(new Loot(monster.x, monster.y, ctx));
          }
        }
        projectiles.splice(index, 1); // Supprimer le projectile après collision
      }
    });
  });
  function ajouterExperience(valeur) {
    player.xp += valeur;
    if (player.xp >= xpParNiveau) {
      player.xp -= xpParNiveau;
      niveau++;
      if (niveau % 2 == 0) {
        createBoss(canvas, monsters);
      }

      document.getElementById("niveau").textContent = niveau;
    }
    document.getElementById("experience").textContent =
      player.xp + niveau * 100;
    mettreAJourXPBar();
  }

  function mettreAJourXPBar() {
    const xpPourcentage = (player.xp / xpParNiveau) * 100;
    document.getElementById("xpBar").style.width = xpPourcentage + "%";
  }
  // Mettre à jour et dessiner les monstres
  updateMonsters(monsters, player, ctx);
  requestAnimationFrame(gameLoop);
}
window.gameLoop = gameLoop;


function showStatBanner(message) {
  const banner = document.getElementById("statBanner");
  banner.textContent = message;
  banner.style.visibility = "visible";
  banner.style.opacity = "1";

  setTimeout(() => {
    banner.style.opacity = "0";
    setTimeout(() => {
      banner.style.visibility = "hidden";
    }, 500); // Attendre la fin de la transition
  }, 2000);
}
new Loot(100, 100);

// Démarrer le jeu
// gameLoop();

setTimeout(() => {
  gameLoop();
}, 3000); 

function spawnMonsters() {
  if (!isPaused) {
    spawnMonster(monsters, canvas, player.x, player.y);
  }

  let experience = parseInt(document.getElementById("niveau").textContent);
  console.log(experience);
  let ratio = 10000 / ((experience + 1) * 2.5);
  setTimeout(spawnMonsters, ratio); // Planifie le prochain spawn
}

// Démarrer le spawn initial
spawnMonsters();
