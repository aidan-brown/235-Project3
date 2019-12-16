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
document.querySelector('main').appendChild(app.view);
app.renderer.backgroundColor = 0x000000;

let menuScene, gameScene, winScene, pauseScene;

const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

const stage = app.stage;

let cars = new Array();
let checkpoints = new Array();

let currentState;
let countdown, winText, postionsText;

let menuAudio = new Howl({
    src: ['../audio/menu.mp3'],
    loop: true,
    volume: 0.5
});
let raceAudio = new Howl({
    src: ['../audio/race.mp3'],
    loop: true,
    volume: 0.5
});
let player1WinAudio = new Howl({
    src: ['../audio/player_1.wav'],
    volume: 0.5
});
let player2WinAudio = new Howl({
    src: ['../audio/player_2.wav'],
    volume: 0.5
});

let mute = false;

PIXI.loader.
add(["../imgs/SportsRacingCar_0.png", "../imgs/SportsRacingCar_2.png", "../imgs/SportsRacingCar_3.png", "../imgs/SportsRacingCar_4.png", "../imgs/SportsRacingCar_5.png", "../imgs/SportsRacingCar_6.png", "../imgs/SportsRacingCar_7.png",
 "../imgs/SportsRacingCar2_0.png", "../imgs/SportsRacingCar2_2.png", "../imgs/SportsRacingCar2_3.png", "../imgs/SportsRacingCar2_4.png", "../imgs/SportsRacingCar2_5.png", "../imgs/SportsRacingCar2_6.png", "../imgs/SportsRacingCar2_7.png",
  "../imgs/track.png", "../imgs/car.jpg", "../imgs/line.png", "../imgs/finishLine.png", "../imgs/keyboard.png", "../imgs/Speaker_Icon.svg", "../imgs/Mute_Icon.svg"]).
on("progress",e=>{console.log(`progress=${e.progress}`)})
.load(setup);


function setup(){
    sprites = {
        background: PIXI.loader.resources["../imgs/car.jpg"].texture,
        speaker: PIXI.loader.resources["../imgs/Speaker_Icon.svg"].texture,
        mute: PIXI.loader.resources["../imgs/Mute_Icon.svg"].texture,
        track: PIXI.loader.resources["../imgs/track.png"].texture,
        line: PIXI.loader.resources["../imgs/line.png"].texture,
        finishLine: PIXI.loader.resources["../imgs/finishLine.png"].texture,
        idle1: PIXI.loader.resources["../imgs/SportsRacingCar_0.png"].texture,
        forward1: PIXI.loader.resources["../imgs/SportsRacingCar_2.png"].texture,
        backward1: PIXI.loader.resources["../imgs/SportsRacingCar_3.png"].texture,
        leftF1: PIXI.loader.resources["../imgs/SportsRacingCar_4.png"].texture,
        rightF1: PIXI.loader.resources["../imgs/SportsRacingCar_7.png"].texture,
        leftB1: PIXI.loader.resources["../imgs/SportsRacingCar_5.png"].texture,
        rightB1: PIXI.loader.resources["../imgs/SportsRacingCar_6.png"].texture,
        idle2: PIXI.loader.resources["../imgs/SportsRacingCar2_0.png"].texture,
        forward2: PIXI.loader.resources["../imgs/SportsRacingCar2_2.png"].texture,
        backward2: PIXI.loader.resources["../imgs/SportsRacingCar2_3.png"].texture,
        leftF2: PIXI.loader.resources["../imgs/SportsRacingCar2_4.png"].texture,
        rightF2: PIXI.loader.resources["../imgs/SportsRacingCar2_7.png"].texture,
        leftB2: PIXI.loader.resources["../imgs/SportsRacingCar2_5.png"].texture,
        rightB2: PIXI.loader.resources["../imgs/SportsRacingCar2_6.png"].texture
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

    checkpoints.push(new Checkpoint(sprites.line, 1391, 400, 1.72, .2));
    gameScene.addChild(checkpoints[0]);

    checkpoints.push(new Checkpoint(sprites.line, 750, 107, .2, 1.72));
    gameScene.addChild(checkpoints[1]);

    checkpoints.push(new Checkpoint(sprites.line, 107, 400, 1.72, .2));
    gameScene.addChild(checkpoints[2]);

    checkpoints.push(new Checkpoint(sprites.finishLine, 750, 691, .2, 1.72));
    gameScene.addChild(checkpoints[3]);

    cars.push(new Player(1, PIXI.loader.resources["../imgs/SportsRacingCar_0.png"].texture, 750, 729, .5, 350, 1, controls.player1));
    gameScene.addChild(cars[0]);

    cars.push(new Player(2, PIXI.loader.resources["../imgs/SportsRacingCar2_0.png"].texture, 750, 679, .5, 350, 1, controls.player2));
    gameScene.addChild(cars[1]);

    countdown = new PIXI.Text("3");
    countdown.style = new PIXI.TextStyle({
        fill: 0xFF00FF,
        stroke: 0xFFFFFF,
        strokeThickness: 6,
        fontSize: 96,
        fontFamily: 'Racing Sans One, sans-serif'
    });
    countdown.anchor.set(0.5);
    countdown.x = sceneWidth / 2;
    countdown.y = sceneHeight / 2;
    gameScene.addChild(countdown);

    postionsText = new PIXI.Text("1st - Player 2 2nd - Player 1");
    postionsText.style = new PIXI.TextStyle({
        fill: 0xFF00FF,
        stroke: 0xFFFFFF,
        strokeThickness: 3,
        fontSize: 25,
        fontFamily: 'Racing Sans One, sans-serif',
        wordWrap: true,
        wordWrapWidth: 175
    });
    postionsText.anchor.set(1);
    postionsText.x = sceneWidth;
    postionsText.y = sceneHeight;
    gameScene.addChild(postionsText);

    // Win Scene
    winText = new PIXI.Text("Player 1 Wins!");
    winText.style = new PIXI.TextStyle({
        fill: 0xFF00FF,
        fontSize: 96,
        fontFamily: 'Racing Sans One, sans-serif',
        stroke: 0xFFFFFF,
        strokeThickness: 6
    });
    winText.anchor.set(0.5);
    winText.x = sceneWidth / 2;
    winText.y = sceneHeight / 2;
    winScene.addChild(winText);

    let restartButton = new PIXI.Text("Restart");
    restartButton.style = new PIXI.TextStyle({
        fill: 0xFF00FF,
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
    restartButton.on('mouseover', ()=>restartButton.style.fill = '#FFFFFF');
    restartButton.on('mouseout', ()=>restartButton.style.fill = '#FF00FF');
    winScene.addChild(restartButton);

    let menuButton = new PIXI.Text("Menu");
    menuButton.style = new PIXI.TextStyle({
        fill: 0xFF00FF,
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
    menuButton.on('mouseover', ()=>menuButton.style.fill = '#FFFFFF');
    menuButton.on('mouseout', ()=>menuButton.style.fill = '#FF00FF');
    winScene.addChild(menuButton);

    // Pause Scene
    let pauseText = new PIXI.Text("Paused");
    pauseText.style = new PIXI.TextStyle({
        fill: 0xFF00FF,
        fontSize: 96,
        fontFamily: 'Racing Sans One, sans-serif',
        stroke: 0xFFFFFF,
        strokeThickness: 6
    });
    pauseText.anchor.set(0.5);
    pauseText.x = sceneWidth / 2;
    pauseText.y = sceneHeight / 2;
    pauseScene.addChild(pauseText);

    let resumeButton = new PIXI.Text("Resume");
    resumeButton.style = new PIXI.TextStyle({
        fill: 0xFF00FF,
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
    resumeButton.on('mouseover', ()=>resumeButton.style.fill = '#FFFFFF');
    resumeButton.on('mouseout', ()=>resumeButton.style.fill = '#FF00FF');
    pauseScene.addChild(resumeButton);

    let pauseMenuButton = new PIXI.Text("Menu");
    pauseMenuButton.style = new PIXI.TextStyle({
        fill: 0xFF00FF,
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
    pauseMenuButton.on('mouseover', ()=>pauseMenuButton.style.fill = '#FFFFFF');
    pauseMenuButton.on('mouseout', ()=>pauseMenuButton.style.fill = '#FF00FF');
    pauseScene.addChild(pauseMenuButton);

    currentState = gameState.mainMenu;

    menuAudio.play();

    app.ticker.add(gameLoop);
}

function createMainMenu(){
    let menuBackground = new GameObject(sprites.background, sceneWidth / 2, sceneHeight / 2, 1.5);
    menuBackground.anchor.set(0.5);
    menuScene.addChild(menuBackground);

    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFF00FF,
        fontSize: 48,
        fontFamily: 'Racing Sans One, sans-serif'
    });

    let title = new PIXI.Text("μKarts");
    title.style = new PIXI.TextStyle({
        fill: 0xFF00FF,
        fontSize: 96,
        fontFamily: 'Racing Sans One, sans-serif',
        stroke: 0xFFFFFF,
        strokeThickness: 6
    });
    title.anchor.set(0.5);
    title.x = sceneWidth / 2;
    title.y = sceneHeight / 2 - 100;
    menuScene.addChild(title);

    let startButton = new PIXI.Text("Play");
    startButton.style = buttonStyle;
    startButton.anchor.set(0.5);
    startButton.x = sceneWidth / 2;
    startButton.y = sceneHeight / 2 + 100;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame);
    startButton.on("pointerup", e=>e.target.alpha = 0.7);
    startButton.on("pointerup", e=>e.currentTarget.alpha = 1.0);
    startButton.on('mouseover', ()=>startButton.style.fill = '#FFFFFF');
    startButton.on('mouseout', ()=>startButton.style.fill = '#FF00FF');
    menuScene.addChild(startButton);

    let keyboardSprite = new GameObject(PIXI.loader.resources["../imgs/keyboard.png"].texture, sceneWidth - 5, sceneHeight - 5, .4);
    keyboardSprite.anchor.set(1);
    menuScene.addChild(keyboardSprite);

    let muteButton = new GameObject(sprites.speaker, 5, sceneHeight - 5, .2);
    muteButton.anchor.set(0, 1);
    muteButton.interactive = true;
    muteButton.buttonMode = true;
    muteButton.on("pointerup", e=>e.target.alpha = 0.7);
    muteButton.on("pointerup", e=>e.currentTarget.alpha = 1.0);
    muteButton.on("pointerup", ()=>{
        mute = !mute;

        if(mute){
            muteButton.setTexture(sprites.mute);
        }
        else{
            muteButton.setTexture(sprites.speaker);
        }
    });
    menuScene.addChild(muteButton);
}

function startGame(){
    resetCars();

    countdown.visible = true;
    countdown.text = '3';
    menuScene.visible = false;
    gameScene.visible = true;

    menuAudio.stop();
    raceAudio.play();
    for(let car of cars){
        car.engineAudio.play();
    }

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
                for(let i = 0; i < cars.length; i++){
                    cars[i].drive(dt);
                    cars[i].engineAudio.volume(.05 + (cars[i].speed / 1500));
                    cars[i].engineAudio.rate(1 + (cars[i].speed / 1500));

                    if(checkpoints[cars[i].targetCheckpoint].checkCollision({x:cars[i].x, y:cars[i].y})){
                        if(cars[i].targetCheckpoint < checkpoints.length - 1){
                            cars[i].targetCheckpoint++;
                        }
                        else{
                            cars[i].targetCheckpoint = 0;
                            cars[i].laps++;
                        }
                    }
            
                    if(cars[i].laps == 3){
                        currentState = gameState.win;
                        winText.text = `Player ${cars[i].player} Wins!`
                        winScene.visible = true;

                        raceAudio.stop();
                        for(let car of cars){
                            car.engineAudio.stop();
                        }

                        switch(i){
                            case 0:
                                player1WinAudio.play();
                                break;

                            case 1:
                                player2WinAudio.play();
                                break;
                        }
                    }
                }

                if(cars[0].laps > cars[1].laps){
                    postionsText.text = '1st - Player 1 2nd - Player 2';
                    cars[1].maxSpeed = 400;
                    cars[0].maxSpeed = 350;
                }
                else if(cars[0].laps == cars[1].laps){
                    if(cars[0].targetCheckpoint > cars[1].targetCheckpoint){
                        postionsText.text = '1st - Player 1 2nd - Player 2';
                        cars[1].maxSpeed = 400;
                        cars[0].maxSpeed = 350;
                    }
                    else if(cars[0].targetCheckpoint == cars[1].targetCheckpoint){
                        if(distance({x:cars[0].x, y:cars[0].y}, {x:checkpoints[cars[0].targetCheckpoint].x, y:checkpoints[cars[0].targetCheckpoint].y}) <= distance({x:cars[1].x, y:cars[1].y}, {x:checkpoints[cars[1].targetCheckpoint].x, y:checkpoints[cars[1].targetCheckpoint].y})){
                            postionsText.text = '1st - Player 1 2nd - Player 2';
                            cars[1].maxSpeed = 400;
                            cars[0].maxSpeed = 350;
                        }
                        else{
                            postionsText.text = '1st - Player 2 2nd - Player 1';
                            cars[1].maxSpeed = 350;
                            cars[0].maxSpeed = 400;
                        }
                    }
                    else{
                        postionsText.text = '1st - Player 2 2nd - Player 1';
                        cars[1].maxSpeed = 350;
                        cars[0].maxSpeed = 400;
                    }
                }
                else{
                    postionsText.text = '1st - Player 2 2nd - Player 1';
                    cars[1].maxSpeed = 350;
                    cars[0].maxSpeed = 400;
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

    if(mute){
        Howler.volume(0);
    }
    else{
        Howler.volume(0.5);
    }
}

function restartGame(){
    winScene.visible = false;

    resetCars();

    raceAudio.play();
    for(let car of cars){
        car.engineAudio.play();
    }

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

    menuAudio.play();
    raceAudio.stop();
    for(let car of cars){
        car.engineAudio.stop();
    }
}

function pauseGame(){
    currentState = gameState.pause;

    pauseScene.visible = true;
    
    raceAudio.pause();
    for(let car of cars){
        car.engineAudio.pause();
    }
}

function resumeGame(){
    currentState = gameState.play;

    pauseScene.visible = false;

    raceAudio.play();
    for(let car of cars){
        car.engineAudio.play();
    }
}