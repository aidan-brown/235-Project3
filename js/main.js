"use strict";

const controls = {
    player1: {
        forward: 38,
        backward: 40,
        left: 37,
        right: 39,
        drift: 96
    },
    player2: {
        forward: 87,
        backward: 83,
        left: 65,
        right: 68,
        drift: 32
    }
}

let sprites = {};

const keyboard = new Array();

document.addEventListener('keydown', e => {
    if(keyboard[e.keyCode] != true){
        keyboard[e.keyCode] = true;
    }
});
document.addEventListener('keyup', e => {
    if(keyboard[e.keyCode] != false){
        keyboard[e.keyCode] = false;
    }
});

const app = new PIXI.Application(screen.width / 2, screen.height / 2);
document.body.appendChild(app.view);
app.renderer.backgroundColor = 0x00FFFF;

const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

const stage = app.stage;

let cars = new Array();

let check = true;

PIXI.loader.
add(["images/SportsRacingCar_0.png", "images/SportsRacingCar_2.png", "images/SportsRacingCar_3.png", "images/SportsRacingCar_4.png", "images/SportsRacingCar_5.png", "images/SportsRacingCar_6.png", "images/SportsRacingCar_7.png"]).
on("progress",e=>{console.log(`progress=${e.progress}`)})
.load(setup);


function setup(){
    sprites = {
        idle: PIXI.loader.resources["images/SportsRacingCar_0.png"].texture,
        forward: PIXI.loader.resources["images/SportsRacingCar_2.png"].texture,
        backward: PIXI.loader.resources["images/SportsRacingCar_3.png"].texture,
        leftF: PIXI.loader.resources["images/SportsRacingCar_4.png"].texture,
        rightF: PIXI.loader.resources["images/SportsRacingCar_7.png"].texture,
        leftB: PIXI.loader.resources["images/SportsRacingCar_5.png"].texture,
        rightB: PIXI.loader.resources["images/SportsRacingCar_6.png"].texture
    };

    cars.push(new Player(PIXI.loader.resources["images/SportsRacingCar_0.png"].texture, 100, 100, 1, PIXI.loader.resources["images/SportsRacingCar_0.png"].texture.width / 2, 5, 1, controls.player1));
    stage.addChild(cars[0]);

    cars.push(new Player(PIXI.loader.resources["images/SportsRacingCar_0.png"].texture, 100, 200, 1, PIXI.loader.resources["images/SportsRacingCar_0.png"].texture.width / 2, 5, 1, controls.player2));
    stage.addChild(cars[1]);

    app.ticker.add(gameLoop);
}

function gameLoop(){
    let dt = 1/app.ticker.FPS;
    if (dt > 1/12) dt=1/12;

    for(let car of cars){
        car.drive();
        for(let checkCar of cars){
            if(car != checkCar && Math.hypot(car.x - checkCar.x, car.y - checkCar.y) < car.radius + checkCar.radius){
                collision(car, checkCar);
            }
        }
    }
}

