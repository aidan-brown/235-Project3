"use strict";

let keyboard = new Array();

document.addEventListener('keydown', e => {
    if(keyboard[e.keyCode] != true){
        keyboard[e.keyCode] = true;
        console.log(`${e.keyCode}: ${keyboard[e.keyCode]}`);
    }
});
document.addEventListener('keyup', e => {
    if(keyboard[e.keyCode] != false){
        keyboard[e.keyCode] = false;
        console.log(`${e.keyCode}: ${keyboard[e.keyCode]}`);
    }
});

const app = new PIXI.Application(600, 400);
document.body.appendChild(app.view);
app.renderer.backgroundColor = 0xFF00FF;

const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

const stage = app.stage;

PIXI.loader.
add(["images/SportsRacingCar_0.png"]).
on("progress",e=>{console.log(`progress=${e.progress}`)})
.load(setup);

let car;

function setup(){
    car = new Player(PIXI.loader.resources["images/SportsRacingCar_0.png"].texture, 100, 100, 1, PIXI.loader.resources["images/SportsRacingCar_0.png"].texture.width / 2);
    stage.addChild(car);

    app.ticker.add(gameLoop);
}

function gameLoop(){
    car.drive();
}

