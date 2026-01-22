import { colors } from "./constants.js";

export class Cloud {
    constructor(canvas) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height / 2;
        this.size = Math.random() * 30 + 50;  
        this.speed = Math.random() * 0.3 + 0.1;  
        this.alpha = Math.random() * 0.5 + 0.3;  
        this.canvas = canvas;
    }

    move() {
        this.x += this.speed;
        if (this.x > this.canvas.width) {
            this.x = -this.size; 
        }
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;  
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, this.size, this.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

export class Plant {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.height = 0;
        this.maxHeight = Math.random() * 80 + 50;
        this.growthRate = this.maxHeight / 450;
        this.flowerColor = colors[Math.floor(Math.random() * colors.length)];
        this.petalCount = Math.floor(Math.random() * 4) + 5;
        this.flowerSize = 10;
        this.bloomProgress = 0;
        this.burning = false;
        this.burnProgress = 0;
    }

    grow() {
        if (this.height < this.maxHeight) {
            this.height += this.growthRate;
        } else if (this.bloomProgress < 1) {
            this.bloomProgress += 0.02;
        }
    }

    burn(fireParticles, FireParticle) {
        this.burning = true;
        this.burnProgress = 0;
        for (let i = 0; i < 15; i++) {
            fireParticles.push(new FireParticle(this.x, this.y - this.height / 2));
        }
    }

    draw(ctx, windOffset, windStrength, plants) {
        const bend = Math.sin(windOffset + this.x * 0.01) * windStrength * 8;
        ctx.strokeStyle = this.burning ? `rgb(${50 + this.burnProgress * 2}, ${50 + this.burnProgress * 2}, ${50 + this.burnProgress * 2})` : "green";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.quadraticCurveTo(this.x + bend, this.y - this.height / 2, this.x + bend, this.y - this.height);
        ctx.stroke();

        if (this.height >= this.maxHeight) {
            this.drawFlower(ctx, this.x + bend, this.y - this.height - 10);
        }

        if (this.burning) {
            this.burnProgress += 2;
            if (this.burnProgress > 100) {
                plants = plants.filter(p => p !== this);
            }
        }
    }

    drawFlower(ctx, x, y) {
        ctx.save();
        ctx.translate(x, y);

        for (let i = 0; i < this.petalCount; i++) {
            ctx.beginPath();
            const angle = (Math.PI * 2 / this.petalCount) * i;
            const petalSize = this.flowerSize * (0.5 + this.bloomProgress);
            const petalX = Math.cos(angle) * petalSize;
            const petalY = Math.sin(angle) * petalSize;
            
            const gradient = ctx.createRadialGradient(0, 0, 2, petalX, petalY, petalSize);
            gradient.addColorStop(0, "white");
            gradient.addColorStop(1, this.flowerColor);

            ctx.fillStyle = gradient;
            ctx.ellipse(petalX, petalY, petalSize, petalSize / 2, angle, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fillStyle = "yellow";
        ctx.fill();

        ctx.restore();
    }
}

export class FireParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 2;
        this.alpha = 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * -1 - 0.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.02;
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(255, 100, 0, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

export class PollenParticle {
    constructor(x, y, canvas) {
        this.x = x;
        this.y = y;
        this.alpha = Math.random() * 0.5 + 0.3;
        this.size = Math.random() * 3 + 1;
        this.baseSpeedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * -0.5 - 0.2;
        this.canvas = canvas;
    }
    update(windStrength) {
        this.x += this.baseSpeedX + windStrength * 2;
        this.y += this.speedY;
        if (this.y < -10 || this.x < -10 || this.x > this.canvas.width + 10) {
            this.x = Math.random() * this.canvas.width;
            this.y = this.canvas.height + Math.random() * 20;
        }
    }
    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 0, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

export class Bee {
    constructor(canvas, plants) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height / 2;
        this.target = null;
        this.speed = Math.random() * 1 + 1;
        this.wingOffset = 0;
        this.canvas = canvas;
        this.plants = plants;
    }
    
    findFlower() {
        if (this.plants.length > 0 && Math.random() < 0.02) {
            this.target = this.plants[Math.floor(Math.random() * this.plants.length)];
        }
    }
    
    move() {
        if (this.target) {
            let dx = this.target.x - this.x;
            let dy = (this.target.y - this.target.height - 10) - this.y;
            let dist = Math.hypot(dx, dy);
            if (dist < 5) {
                this.target = null;
            } else {
                this.x += (dx / dist) * this.speed;
                this.y += (dy / dist) * this.speed;
            }
        } else {
            this.x += Math.random() * 2 - 1;
            this.y += Math.random() * 2 - 1;
            this.findFlower();
        }
        this.wingOffset += 0.2;
    }
    
    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x - 3, this.y - 2, 6, 4);
        
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 5 + Math.sin(this.wingOffset) * 2, 3, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 5 + Math.sin(this.wingOffset) * 2, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}