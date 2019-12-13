"use strict";

const gameState = {
    mainMenu: 'menu',
    start: 'start',
    play: 'play',
    pause: 'pause',
    win: 'win'
}

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
    for(let player of Object.keys(controls)){
        for(let key of Object.keys(player)){
            if(key == e.keyCode || e.keyCode == 27){
                e.preventDefault();
                break;
            }
        }
    }
    
    if(keyboard[e.keyCode] != true){
        keyboard[e.keyCode] = true;
    }
});
document.addEventListener('keyup', e => {
    for(let player of Object.keys(controls)){
        for(let key of Object.keys(player)){
            if(key == e.keyCode || e.keyCode == 27){
                e.preventDefault();
                break;
            }
        }
    }

    if(keyboard[e.keyCode] != false){
        keyboard[e.keyCode] = false;
    }
});

const app = new PIXI.Application(1500, 800);
document.body.appendChild(app.view);
app.renderer.backgroundColor = 0x000000;

let menuScene, gameScene, winScene, pauseScene;

const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

const stage = app.stage;

let cars = new Array();
let finishLine, halfwayLine;

let currentState;
let countdown, winText;

PIXI.loader.
add(["images/SportsRacingCar_0.png", "images/SportsRacingCar_2.png", "images/SportsRacingCar_3.png", "images/SportsRacingCar_4.png", "images/SportsRacingCar_5.png", "images/SportsRacingCar_6.png", "images/SportsRacingCar_7.png",
 "images/SportsRacingCar2_0.png", "images/SportsRacingCar2_2.png", "images/SportsRacingCar2_3.png", "images/SportsRacingCar2_4.png", "images/SportsRacingCar2_5.png", "images/SportsRacingCar2_6.png", "images/SportsRacingCar2_7.png",
  "images/track.png", "images/line.png", "images/keyboard.png"]).
on("progress",e=>{console.log(`progress=${e.progress}`)})
.load(setup);


function setup(){
    sprites = {
        track: PIXI.loader.resources["images/track.png"].texture,
        line: PIXI.loader.resources["images/line.png"].texture,
        idle1: PIXI.loader.resources["images/SportsRacingCar_0.png"].texture,
        forward1: PIXI.loader.resources["images/SportsRacingCar_2.png"].texture,
        backward1: PIXI.loader.resources["images/SportsRacingCar_3.png"].texture,
        leftF1: PIXI.loader.resources["images/SportsRacingCar_4.png"].texture,
        rightF1: PIXI.loader.resources["images/SportsRacingCar_7.png"].texture,
        leftB1: PIXI.loader.resources["images/SportsRacingCar_5.png"].texture,
        rightB1: PIXI.loader.resources["images/SportsRacingCar_6.png"].texture,
        idle2: PIXI.loader.resources["images/SportsRacingCar2_0.png"].texture,
        forward2: PIXI.loader.resources["images/SportsRacingCar2_2.png"].texture,
        backward2: PIXI.loader.resources["images/SportsRacingCar2_3.png"].texture,
        leftF2: PIXI.loader.resources["images/SportsRacingCar2_4.png"].texture,
        rightF2: PIXI.loader.resources["images/SportsRacingCar2_7.png"].texture,
        leftB2: PIXI.loader.resources["images/SportsRacingCar2_5.png"].texture,
        rightB2: PIXI.loader.resources["images/SportsRacingCar2_6.png"].texture
    };

    menuScene = new PIXI.Container();
    stage.addChild(menuScene);

    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    winScene = new PIXI.Container();
    winScene.visible = false;
    stage.addChild(winScene);

    pauseScene = new PIXI.Container();
    pauseScene.visible = false;
    stage.addChild(pauseScene);

    // Menu Scene
    createMainMenu();

    // Game Scene
    let background = new GameObject(sprites.track, 0, 0, 1);
    background.anchor.set(0);
    gameScene.addChild(background);

    halfwayLine = new Checkpoint(sprites.line, 750, 107, 1);
    gameScene.addChild(halfwayLine);

    finishLine = new Checkpoint(sprites.line, 750, 691, 1);
    gameScene.addChild(finishLine);

    cars.push(new Player(1, PIXI.loader.resources["images/SportsRacingCar_0.png"].texture, 750, 729, .5, 350, 1, controls.player1));
    gameScene.addChild(cars[0]);

    cars.push(new Player(2, PIXI.loader.resources["images/SportsRacingCar2_0.png"].texture, 750, 679, .5, 350, 1, controls.player2));
    gameScene.addChild(cars[1]);

    countdown = new PIXI.Text("3");
    countdown.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 96,
        fontFamily: 'Racing Sans One, sans-serif'
    });
    countdown.anchor.set(0.5);
    countdown.x = sceneWidth / 2;
    countdown.y = sceneHeight / 2;
    gameScene.addChild(countdown);

    // Win Scene
    winText = new PIXI.Text("Player 1 Wins!");
    winText.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 96,
        fontFamily: 'Racing Sans One, sans-serif',
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    winText.anchor.set(0.5);
    winText.x = sceneWidth / 2;
    winText.y = sceneHeight / 2;
    winScene.addChild(winText);

    let restartButton = new PIXI.Text("Restart");
    restartButton.style = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 48,
        fontFamily: 'Racing Sans One, sans-serif'
    });
    restartButton.anchor.set(0.5);
    restartButton.x = sceneWidth / 2 - 200;
    restartButton.y = sceneHeight - 100;
    restartButton.interactive = true;
    restartButton.buttonMode = true;
    restartButton.on("pointerup", restartGame);
    restartButton.on("pointerup", e=>e.target.alpha = 0.7);
    restartButton.on("pointerup", e=>e.currentTarget.alpha = 1.0);
    winScene.addChild(restartButton);

    let menuButton = new PIXI.Text("Menu");
    menuButton.style = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 48,
        fontFamily: 'Racing Sans One, sans-serif'
    });
    menuButton.anchor.set(0.5);
    menuButton.x = sceneWidth / 2 + 200;
    menuButton.y = sceneHeight - 100;
    menuButton.interactive = true;
    menuButton.buttonMode = true;
    menuButton.on("pointerup", goToMenu);
    menuButton.on("pointerup", e=>e.target.alpha = 0.7);
    menuButton.on("pointerup", e=>e.currentTarget.alpha = 1.0);
    winScene.addChild(menuButton);

    // Pause Scene
    let pauseText = new PIXI.Text("Paused");
    pauseText.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 96,
        fontFamily: 'Racing Sans One, sans-serif',
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    pauseText.anchor.set(0.5);
    pauseText.x = sceneWidth / 2;
    pauseText.y = sceneHeight / 2;
    pauseScene.addChild(pauseText);

    let resumeButton = new PIXI.Text("Resume");
    resumeButton.style = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 48,
        fontFamily: 'Racing Sans One, sans-serif'
    });
    resumeButton.anchor.set(0.5);
    resumeButton.x = sceneWidth / 2 - 200;
    resumeButton.y = sceneHeight - 100;
    resumeButton.interactive = true;
    resumeButton.buttonMode = true;
    resumeButton.on("pointerup", resumeGame);
    resumeButton.on("pointerup", e=>e.target.alpha = 0.7);
    resumeButton.on("pointerup", e=>e.currentTarget.alpha = 1.0);
    pauseScene.addChild(resumeButton);

    let pauseMenuButton = new PIXI.Text("Menu");
    pauseMenuButton.style = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 48,
        fontFamily: 'Racing Sans One, sans-serif'
    });
    pauseMenuButton.anchor.set(0.5);
    pauseMenuButton.x = sceneWidth / 2 + 200;
    pauseMenuButton.y = sceneHeight - 100;
    pauseMenuButton.interactive = true;
    pauseMenuButton.buttonMode = true;
    pauseMenuButton.on("pointerup", goToMenu);
    pauseMenuButton.on("pointerup", e=>e.target.alpha = 0.7);
    pauseMenuButton.on("pointerup", e=>e.currentTarget.alpha = 1.0);
    pauseScene.addChild(pauseMenuButton);

    currentState = gameState.mainMenu;

    app.ticker.add(gameLoop);
}

function createMainMenu(){
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 48,
        fontFamily: 'Racing Sans One, sans-serif'
    });

    let title = new PIXI.Text("μKarts");
    title.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 96,
        fontFamily: 'Racing Sans One, sans-serif',
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    title.anchor.set(0.5);
    title.x = sceneWidth / 2;
    title.y = 120;
    menuScene.addChild(title);

    let startButton = new PIXI.Text("Play");
    startButton.style = buttonStyle;
    startButton.anchor.set(0.5);
    startButton.x = sceneWidth / 2;
    startButton.y = sceneHeight - 100;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame);
    startButton.on("pointerup", e=>e.target.alpha = 0.7);
    startButton.on("pointerup", e=>e.currentTarget.alpha = 1.0);
    menuScene.addChild(startButton);

    let keyboardSprite = new GameObject(PIXI.loader.resources["images/keyboard.png"].texture, 5, sceneHeight - 5, .4);
    keyboardSprite.anchor.set(0, 1);
    menuScene.addChild(keyboardSprite);
}

function startGame(){
    resetCars();

    countdown.visible = true;
    menuScene.visible = false;
    gameScene.visible = true;

    setTimeout(() => {
        countdown.text = '2'
        setTimeout(() => {
            countdown.text = '1'
            setTimeout(() => {
                currentState = gameState.play;
                countdown.visible = false;
            }, 1000);
        }, 1000);
    }, 1000);
}

function gameLoop(){
    let dt = 1/app.ticker.FPS;
    if (dt > 1/12) dt=1/12;

    switch(currentState){
        case gameState.mainMenu:
            break;

        case gameState.play:
                for(let car of cars){
                    car.drive(dt);
                    if(car.targetCheckpoint.checkCollision({x:car.x, y:car.y})){
                        if(car.targetCheckpoint == halfwayLine){
                            car.targetCheckpoint = finishLine;
                        }
                        else{
                            car.targetCheckpoint = halfwayLine;
                            car.laps++;
                        }
                    }
            
                    if(car.laps == 3){
                        currentState = gameState.win;
                        winText.text = `Player ${car.player} Wins!`
                        winScene.visible = true;
                    }
                }

                if(keyboard[27]){
                    pauseGame();
                }
            break;

        case gameState.pause:
            break;

        case gameState.win:
            break;
    }
}

function restartGame(){
    winScene.visible = false;

    resetCars();

    countdown.text = '3';
    countdown.visible = true;
    setTimeout(() => {
        countdown.text = '2'
        setTimeout(() => {
            countdown.text = '1'
            setTimeout(() => {
                currentState = gameState.play;
                countdown.visible = false;
            }, 1000);
        }, 1000);
    }, 1000);
}

function resetCars(){
    for(let i = 0; i < cars.length; i++){
        cars[i].laps = 0;
        cars[i].x = 750;
        cars[i].velocity = {x:0, y:0};
        cars[i].acceleration = {x:0, y:0};
        cars[i].direction = {x: 1, y: 0};
        cars[i].rotation = 0;
        cars[i].setTexture(sprites[`idle${cars[i].player}`]);

        switch(i){
            case 0:
                cars[i].y = 729;
                break;

            case 1:
                cars[i].y = 679;
                break;
        }
    }
}

function goToMenu(){
    resetCars();

    currentState = gameState.mainMenu;
    gameScene.visible = false;
    menuScene.visible = true;
    winScene.visible = false;
    pauseScene.visible = false;
}

function pauseGame(){
    currentState = gameState.pause;

    pauseScene.visible = true;
}

function resumeGame(){
    currentState = gameState.play;

    pauseScene.visible = false;
}