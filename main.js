// main.js

import { createMonsters, updateMonsters, spawnMonster, findClosestMonster, checkCollision, checkProjectileCollision } from "./monster.js";
import { Projectile } from "./Projectile.js"
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
  x: 50,
  y: 50,
  width: 40,
  height: 40,
  health:100,
  xp:0,
  speed: 3,
  emoji: "👾",
  weapon: {
    damage: 1,
    fireRate: 1000, // Temps entre chaque tir en millisecondes
    lastShot: 0, // Timestamp du dernier tir
  },
};

const xpParNiveau = 100;
let niveau = 1;


let projectiles = []

let keys = { up: false, down: false, left: false, right: false };

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

// Fonction pour dessiner le joueur
function drawPlayer() {
  const healthBarWidth = player.width;
  const healthBarHeight = 5; 
  const healthPercentage = player.health / 100;
  const healthColor = healthPercentage > 0.6 ? "green" : healthPercentage > 0.3 ? "orange" : "red";

  // Dessiner l'arrière-plan de la barre de vie 
  ctx.fillStyle = "gray";
  ctx.fillRect(player.x, player.y - healthBarHeight - 5, healthBarWidth, healthBarHeight);

  // Dessiner la barre de vie actuelle 
  ctx.fillStyle = healthColor;
  ctx.fillRect(player.x, player.y - healthBarHeight - 5, healthBarWidth * healthPercentage, healthBarHeight);
  document.getElementById("vie").textContent = Math.round(player.health)
  // Dessiner le joueur (emoji)
  ctx.font = `${player.height}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(player.emoji, player.x + player.width / 2, player.y + player.height / 2);
}

// Fonction pour effacer le canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Fonction pour déplacer le joueur
function movePlayer() {
  if (keys.up && player.y > 0) player.y -= player.speed;
  if (keys.down && player.y + player.height < canvas.height) player.y += player.speed;
  if (keys.left && player.x > 0) player.x -= player.speed;
  if (keys.right && player.x + player.width < canvas.width) player.x += player.speed;
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
  }
}

// Créer des monstres en passant canvas en paramètre
let monsters = createMonsters(5, canvas);

// Boucle de jeu
// main.js

function gameLoop() {
  clearCanvas();
  movePlayer();
  drawPlayer();

  // Tirer un projectile si le temps est écoulé
  const now = Date.now();
  if (now - player.weapon.lastShot > player.weapon.fireRate) {
    shootProjectile(player, monsters);
    player.weapon.lastShot = now;
  }

  // Mettre à jour et dessiner les projectiles
  projectiles.forEach((projectile, index) => {
    projectile.update();
    projectile.draw(ctx);

    // Vérifier les collisions avec les monstres
    monsters.forEach((monster, monsterIndex) => {
      if (checkCollision(projectile, monster)) {
        // Infliger des dégâts au monstre
        monster.health -= player.weapon.damage;
        if (monster.health <= 0) {
          monsters.splice(monsterIndex, 1); // Supprimer le monstre
        }
        projectiles.splice(index, 1); // Supprimer le projectile
      }
      if (checkProjectileCollision(projectile, monster)) {
        monster.health -= player.weapon.damage;
        if (monster.health <= 0) {
          monsters.splice(monsterIndex, 1);
          player.xp = player.xp + monster.gainXp
          ajouterExperience(monster.gainXp)
          // document.getElementById("experience").textContent = player.xp// Supprimer le monstre s'il n'a plus de vie
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
        document.getElementById("niveau").textContent = niveau;
    }
    document.getElementById("experience").textContent = player.xp;
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

// Démarrer le jeu
gameLoop();

// Ajouter un monstre toutes les 5 secondes en passant canvas en paramètre
setInterval(() => spawnMonster(monsters, canvas), 1000);

