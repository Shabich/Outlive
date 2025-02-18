// monster.js
class Monster {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.width =  type != 'boss' ? 40 : 100;
      this.height = type != 'boss' ? 40 : 100;
      this.speed = 0.5;
      this.gainXp = this.getXpGainByType(type);
      this.type = type;
      this.degat = type != 'boss' ? 0.5 : 2;
      this.health = this.getHealthByType(type);
      const imagePath = this.getImageByType(type); // Récupérer le chemin d'image
      if (!imagePath) {
          console.error(`Aucune image trouvée pour le type : ${type}`);
      }
      this.image = new Image(); // Initialisation correcte de l'objet Image
      this.image.src = imagePath || "images/default.png"; // Assurer une image valide
    }
  
    getXpGainByType(type) {
      switch (type) {
        case "easy":
          return 2;
        case "medium":
          return 4;
        case "hard":
          return 6;
        case "boss":
          return 20;
        default:
          return 2;
      }
    }
    getImageByType(type) {
      const imagesByType = {
          "easy": "images/Monster1.png",
          "medium": "images/Monster2.png",
          "hard": "images/Monster3.png",
          "boss": "images/Boss1.png",
      };
      return imagesByType[type] || "images/default.png"; // Assurer une valeur de retour valide
  }
  
    getHealthByType(type) {
      switch (type) {
        case "easy":
          return 1;
        case "medium":
          return 2;
        case "hard":
          return 3;
        case "boss":
          return 10;
        default:
          return 1;
      }
    }
  

    draw(ctx) {
      if (this.image.complete) { // Vérifie que l'image est bien chargée avant de la dessiner
          ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      }

      // Dessiner la barre de vie
      const healthBarWidth = this.width;
      const healthBarHeight = 5;
      const healthPercentage = this.health / this.getHealthByType(this.type);
      const healthColor = healthPercentage > 0.5 ? "green" : healthPercentage > 0.2 ? "orange" : "red";

      if (healthPercentage < 1) {
          ctx.fillStyle = "gray";
          ctx.fillRect(this.x, this.y - healthBarHeight - 2, healthBarWidth, healthBarHeight);
          ctx.fillStyle = healthColor;
          ctx.fillRect(this.x, this.y - healthBarHeight - 2, healthBarWidth * healthPercentage, healthBarHeight);
      }
  }
    moveTowardsPlayer(player) {
      const dx = player.x - this.x;
      const dy = player.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
  
      if (distance > 0) {
        this.x += (dx / distance) * this.speed;
        this.y += (dy / distance) * this.speed;
      }
    }
  }
  


  // Fonction pour créer des monstres
  function createMonsters(count, canvas) { // Ajouter canvas en paramètre
    const monsters = [];
    const types = ["easy", "medium", "hard"];
  
    for (let i = 0; i < count; i++) {
      const x = Math.random() * (canvas.width - 40); // Utiliser canvas.width
      const y = Math.random() * (canvas.height - 40); // Utiliser canvas.height
      const type = types[Math.floor(Math.random() * types.length)];
      monsters.push(new Monster(x, y, type));
    }
    return monsters;
  }
  
  function createBoss(canvas, monsters) {
    if (!Array.isArray(monsters)) {
      throw new Error("monsters doit être un tableau");
    }
    const x = Math.random() * (canvas.width - 80); // Boss plus grand, ajuste la position
    const y = Math.random() * (canvas.height - 80);
    const boss = new Monster(x, y, "boss");
    monsters.push(boss);
  }
  
  

  // Fonction pour vérifier les collisions entre le joueur et les monstres

  // monster.js

function checkProjectileCollision(projectile, monster) {
    const dx = projectile.x - monster.x;
    const dy = projectile.y - monster.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < projectile.radius + monster.width / 2;
  }

  function checkCollision(player, monster) {
    return (
      player.x < monster.x + monster.width &&
      player.x + player.width > monster.x &&
      player.y < monster.y + monster.height &&
      player.y + player.height > monster.y
    );
  }
  // Fonction pour mettre à jour les monstres
  function updateMonsters(monsters, player, ctx) {
    monsters.forEach((monster) => {
      monster.moveTowardsPlayer(player);
      monster.draw(ctx);
  
      if (checkCollision(player, monster)) {
        console.log("Collision avec un monstre!");
        player.health = player.health - monster.degat
        }
    });
  }
  
  // Fonction pour ajouter des monstres de manière dynamique
  function spawnMonster(monsters, canvas) { // Ajouter canvas en paramètre
    const x = Math.random() * (canvas.width - 40);
    const y = Math.random() * (canvas.height - 40);
    const types = ["easy", "medium", "hard"];
    const type = types[Math.floor(Math.random() * types.length)];
    monsters.push(new Monster(x, y, type));
  }


  // monster.js

function findClosestMonster(player, monsters) {
    let closestMonster = null;
    let closestDistance = Infinity;
  
    monsters.forEach((monster) => {
      const dx = monster.x - player.x;
      const dy = monster.y - player.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
  
      if (distance < closestDistance) {
        closestDistance = distance;
        closestMonster = monster;
      }
    });
  
    return closestMonster;
  }
  
  // Exporter les fonctions et classes nécessaires
  export { Monster, createMonsters, createBoss, updateMonsters, spawnMonster, findClosestMonster, checkProjectileCollision };