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
            }
            else{
                this.x = sceneWidth - this.radius;
            }
        }

        if(this.y - this.radius + vector.y >= 0 && this.y + this.radius + vector.y <= sceneHeight){
            this.y += vector.y;
        }
        else{
            if(this.y - this.radius + vector.y < 0){
                this.y = this.radius;
            }
            else{
                this.y = sceneHeight - this.radius;
            }
        }
    }
}

class Player extends GameObject{
    constructor(sprite, x=0, y=0, scale=0.1, radius=1, maxSpeed=1, controls={forward: 38, backward: 40, left: 37, right: 39}){
        super(sprite, x, y, scale, radius);

        this.maxSpeed = maxSpeed;
        this.speed = 0;

        this.direction = {x: 1, y: 0};
        this.velocity = {x: 0, y: 0};
        this.acceleration = {x: 0, y:0};

        this.rotation = 0;

        this.controls = controls;
    }

    drive(){
        if(keyboard[this.controls.forward]){
            this.acceleration.y += this.direction.y;
            this.acceleration.x += this.direction.x;

            this.setTexture(sprites.forward);
        }
        else if(!keyboard[this.controls.backward]){
            this.acceleration.y *= .99;
            this.acceleration.x *= .99;

            this.acceleration = projectVector(this.acceleration, this.direction);

            this.setTexture(sprites.forward);
        }

        if(keyboard[this.controls.backward]){
            this.acceleration.y -= this.direction.y / 2;
            this.acceleration.x -= this.direction.x / 2;

            this.setTexture(sprites.backward);
        }
        else if(!keyboard[this.controls.forward] && (this.acceleration.x != 0 && this.acceleration.y)){
            this.acceleration.y *= .99;
            this.acceleration.x *= .99;

            this.acceleration = projectVector(this.acceleration, this.direction);

            this.setTexture(sprites.backward);
        }

        this.speed = Math.hypot(this.acceleration.x, this.acceleration.y)

        if(this.speed < 0.1){
            this.acceleration.x = 0;
            this.acceleration.y = 0;

            this.setTexture(sprites.idle);
        }

        if(keyboard[this.controls.right]){
            if(dotProduct(this.acceleration, this.direction) > 0){
                this.rotation += .005 * this.speed;

                this.setTexture(sprites.rightF);
            }
            else if(dotProduct(this.acceleration, this.direction) < 0){
                this.rotation -= .005 * this.speed;

                this.setTexture(sprites.leftB);
            }

            this.direction.y = Math.sin(this.rotation);
            this.direction.x = Math.cos(this.rotation);

            this.direction = normalizeVector(this.direction);
        }

        if(keyboard[this.controls.left]){
            if(dotProduct(this.acceleration, this.direction) > 0){
                this.rotation -= .005 * this.speed;

                this.setTexture(sprites.leftF);
            }
            else if(dotProduct(this.acceleration, this.direction) < 0){
                this.rotation += .005 * this.speed;

                this.setTexture(sprites.rightB);
            }

            this.direction.y = Math.sin(this.rotation);
            this.direction.x = Math.cos(this.rotation);

            this.direction = normalizeVector(this.direction);
        }

        this.acceleration = clampMagnitude(this.acceleration, this.maxSpeed);

        this.velocity.y = this.acceleration.y;
        this.velocity.x = this.acceleration.x;

        this.velocity = clampMagnitude(this.velocity, this.maxSpeed);

        this.move(this.velocity);
    }
}