export class Loot {
    constructor(x, y, ctx) {
      this.x = x;
      this.y = y;
      this.buff = this.randomBuff();
      this.width = 50;
      this.height = 50;
      this.ctx = ctx
      const type = Object.keys(this.buff)[0];
      const imagePath = this.getImageByBuffType(type);
      this.image = new Image();
      this.image.src = imagePath;
    
    }
    getImageByBuffType(buff) {
      switch (buff) {
        case "health":
          return "./images/buffs/health.png";
        case "damage":
          return "./images/buffs/attack.png";
        case "speed":
          return "./images/buffs/coin.png";
        case "heal":
          return "./images/buffs/heal.png";
        default:
          return "./images/buffs/heal.png";
      }
    }
    randomBuff() {
      let loots = {
        health: "5",
        damage: "1",
        speed: "1",
        heal: "10",
      };
      let keys = Object.keys(loots);
      let randomKey = keys[Math.floor(Math.random() * keys.length)];
      return { [randomKey]: loots[randomKey] };
    }
  
    draw() {
      if (this.image.complete) { 
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      }
    }
    
  
 
  }
  