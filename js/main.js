"use strict";

const app = new PIXI.Application(600, 400);
document.body.appendChild(app.view);

const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

const stage = app.stage;

PIXI.loader.
add(["images/SportsRacingCar_0.png"]).
on("progress",e=>{console.log(`progress=${e.progress}`)})
.load(() => {
    const car = new GameObject(PIXI.loader.resources["images/SportsRacingCar_0.png"].texture, 100, 100, 1, PIXI.loader.resources["images/SportsRacingCar_0.png"].texture.width / 2);
    stage.addChild(car);

    car.move({x:-1000, y:200});
});

