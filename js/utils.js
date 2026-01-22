export function addPlant(event, plants, Plant) {
    const x = event.clientX;
    const y = event.clientY;
    plants.push(new Plant(x, y));
}

export function burnPlant(event, plants, fireParticles, FireParticle) {
    const x = event.clientX;
    const y = event.clientY;
    for (let plant of plants) {
        const distance = Math.hypot(plant.x - x, plant.y - y);
        if (distance < 50) {
            plant.burn(fireParticles, FireParticle);
            break;
        }
    }
}