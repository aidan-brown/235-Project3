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
    e.preventDefault();
    if(keyboard[e.keyCode] != true){
        keyboard[e.keyCode] = true;
    }
});
document.addEventListener('keyup', e => {
    e.preventDefault();
    if(keyboard[e.keyCode] != false){
        keyboard[e.keyCode] = false;
    }
});

const app = new PIXI.Application(1500, 800);
document.body.appendChild(app.view);
app.renderer.backgroundColor = 0x3EAB52;

const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

const stage = app.stage;

let cars = new Array();
let finishLine, halfwayLine;

let imageData;

PIXI.loader.
add(["images/SportsRacingCar_0.png", "images/SportsRacingCar_2.png", "images/SportsRacingCar_3.png", "images/SportsRacingCar_4.png", "images/SportsRacingCar_5.png", "images/SportsRacingCar_6.png", "images/SportsRacingCar_7.png", "images/track.png", "images/line.png"]).
on("progress",e=>{console.log(`progress=${e.progress}`)})
.load(setup);


function setup(){
    sprites = {
        track: PIXI.loader.resources["images/track.png"].texture,
        line: PIXI.loader.resources["images/line.png"].texture,
        idle: PIXI.loader.resources["images/SportsRacingCar_0.png"].texture,
        forward: PIXI.loader.resources["images/SportsRacingCar_2.png"].texture,
        backward: PIXI.loader.resources["images/SportsRacingCar_3.png"].texture,
        leftF: PIXI.loader.resources["images/SportsRacingCar_4.png"].texture,
        rightF: PIXI.loader.resources["images/SportsRacingCar_7.png"].texture,
        leftB: PIXI.loader.resources["images/SportsRacingCar_5.png"].texture,
        rightB: PIXI.loader.resources["images/SportsRacingCar_6.png"].texture
    };

    let background = new GameObject(sprites.track, 25, 25, .8);
    background.anchor.set(0);
    stage.addChild(background);

    halfwayLine = new Checkpoint(sprites.line, 695, 85, 1);
    stage.addChild(halfwayLine);

    finishLine = new Checkpoint(sprites.line, 750, 709, 1);
    stage.addChild(finishLine);

    cars.push(new Player(PIXI.loader.resources["images/SportsRacingCar_0.png"].texture, 800, 729, .5, 5, 1, controls.player1));
    stage.addChild(cars[0]);

    cars.push(new Player(PIXI.loader.resources["images/SportsRacingCar_0.png"].texture, 800, 679, .5, 5, 1, controls.player2));
    stage.addChild(cars[1]);

    app.ticker.add(gameLoop);
}

function gameLoop(){
    let dt = 1/app.ticker.FPS;
    if (dt > 1/12) dt=1/12;

    for(let car of cars){
        car.drive();
        if(car.targetCheckpoint.checkCollision({x:car.x, y:car.y})){
            if(car.targetCheckpoint == halfwayLine){
                car.targetCheckpoint = finishLine;
            }
            else{
                car.targetCheckpoint = halfwayLine;
                car.laps++;
            }
        }
    }
}

