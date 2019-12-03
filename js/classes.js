class GameObject extends PIXI.Sprite{
    constructor(sprite, x=0, y=0, scale=0.1, radius=0.1){
        super(sprite);
        this.anchor.set(0.5);
        this.scale.set(scale);

        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    move(vector={x:0,y:0}){
        if(this.x - this.radius + vector.x >= 0 && this.x + this.radius + vector.x <= sceneWidth){
            this.x += vector.x;
        }
        else{
            if(this.x - this.radius + vector.x < 0){
                this.x = this.radius;
                console.log('left');
            }
            else{
                this.x = sceneWidth - this.radius;
                console.log('right');
            }
        }

        if(this.y - this.radius + vector.y >= 0 && this.y + this.radius + vector.y <= sceneHeight){
            this.y += vector.y;
        }
        else{
            if(this.y - this.radius + vector.y < 0){
                this.y = this.radius;
                console.log('up');
            }
            else{
                this.y = sceneHeight - this.radius;
                console.log('down');
            }
        }
    }
}

class Player extends GameObject{
    constructor(sprite, x=0, y=0, scale=0.1, radius=1, speed=1){
        super(sprite, x, y, scale, radius);
        this.speed = speed;

        this.direction = {x: 1, y: 0};
        this.velocity = {x: 0, y: 0};
        this.acceleration = {x: 0, y:0};

        this.rotation = 0;
    }

    drive(){
        if(keyboard[38]){
            this.velocity.y = this.direction.y * this.speed;
            this.velocity.x = this.direction.x * this.speed;
        }
        else if(!keyboard[40]){
            this.velocity.y = 0;
            this.velocity.x = 0;
        }

        if(keyboard[40]){
            this.velocity.y = this.direction.y * -this.speed;
            this.velocity.x = this.direction.x * -this.speed;
        }
        else if(!keyboard[38]){
            this.velocity.y = 0;
            this.velocity.x = 0;
        }

        if(keyboard[39]){
            this.rotation += .1;

            console.log(this.direction);

            this.direction.y = Math.sin(this.rotation);
            this.direction.x = Math.cos(this.rotation);

            this.direction = normalizeVector(this.direction);
        }

        if(keyboard[37]){
            this.rotation -= .1;

            this.direction.y = Math.sin(this.rotation);
            this.direction.x = Math.cos(this.rotation);

            this.direction = normalizeVector(this.direction);
        }

        this.move(this.velocity);
    }
}