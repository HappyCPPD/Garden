import { Cloud, Plant, FireParticle, PollenParticle, Bee } from "./classes.js";
import { addPlant, burnPlant } from "./utils.js";

const canvas = document.getElementById("gardenCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let plants = [];
let fireParticles = [];
let pollenParticles = [];
let windStrength = 0;
let windOffset = 0;
let fireMode = false;
let bees = [];

function animate() {
    let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#87c38f");
    gradient.addColorStop(1, "#b4e197");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    pollenParticles.forEach(particle => {
        particle.update(windStrength);
        particle.draw(ctx);
    });

    plants.forEach(plant => {
        plant.grow();
        plant.draw(ctx, windOffset, windStrength, plants);
    });

    bees.forEach(bee => {
        bee.move();
        bee.draw(ctx);
    });

    fireParticles.forEach((particle, index) => {
        particle.update();
        particle.draw(ctx);
        if (particle.alpha <= 0) fireParticles.splice(index, 1);
    });

    windOffset += 0.03;
    windStrength = (Math.sin(windOffset) + 1) / 2 * 2;

    requestAnimationFrame(animate);
}

document.getElementById("fireButton").addEventListener("click", () => {
    fireMode = !fireMode;
    document.getElementById("fireButton").textContent = fireMode ? "Fire Mode: ON" : "Fire Mode: OFF";
});

canvas.addEventListener("click", event => fireMode ? burnPlant(event, plants, fireParticles, FireParticle) : addPlant(event, plants, Plant));

for (let i = 0; i < 10; i++) {
    bees.push(new Bee(canvas, plants));
}

let clouds = [];
for (let i = 0; i < 5; i++) {
    clouds.push(new Cloud(canvas));
}

animate();