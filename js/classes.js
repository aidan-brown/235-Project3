class GameObject extends PIXI.Sprite{
    constructor(sprite, x=0, y=0, scale=0.1){
        super(sprite);
        this.anchor.set(0.5);
        this.scale.set(scale);

        this.x = x;
        this.y = y;
        this.radius = sprite.width / 2 * scale;
        this.xOffset = 110;
        this.yOffset = 20;
    }

    move(vector={x:0,y:0}){
        if(this.x - this.radius + vector.x >= this.xOffset && this.x + this.radius + vector.x <= sceneWidth - this.xOffset){
            this.x += vector.x;
        }
        else{
            if(this.x - this.radius + vector.x < this.xOffset){
                this.x = this.radius + this.xOffset;
            }
            else{
                this.x = sceneWidth - this.radius - this.xOffset;
            }
        }

        if(this.y - this.radius + vector.y >= this.yOffset && this.y + this.radius + vector.y <= sceneHeight - this.yOffset){
            this.y += vector.y;
        }
        else{
            if(this.y - this.radius + vector.y < this.yOffset){
                this.y = this.radius + this.yOffset;
            }
            else{
                this.y = sceneHeight - this.radius - this.yOffset;
            }
        }
    }
}

class Checkpoint extends GameObject{
    constructor(sprite, x=0, y=0, scale=0.1){
        super(sprite, x, y, scale);
        this.scale.set(.2, 1.04);

        this.boundingBox = {x1: x - (sprite.width / 2 * this.scale.x), x2: x + (sprite.width / 2 * this.scale.x), y1: y - (sprite.height / 2 * this.scale.y), y2: y + (sprite.height / 2 * this.scale.y)};
    }

    checkCollision(point={x:0, y:0}){
        return (point.x >= this.boundingBox.x1 && point.x <= this.boundingBox.x2) && (point.y >= this.boundingBox.y1 && point.y <= this.boundingBox.y2);
    }
}

class Player extends GameObject{
    constructor(sprite, x=0, y=0, scale=0.1, maxSpeed=1, mass=1, controls={forward: 38, backward: 40, left: 37, right: 39, drift: 32}){
        super(sprite, x, y, scale);

        // Force variables
        this.mass = mass;

        // Speed variables
        this.maxSpeed = maxSpeed;
        this.originalMaxSpeed = maxSpeed;
        this.speed = 0;
        this.turningSpeed = 0.01;

        // Vector variables
        this.direction = {x: 1, y: 0};
        this.velocity = {x: 0, y: 0};
        this.acceleration = {x: 0, y:0};

        // Rotation variables
        this.rotation = 0;
        this.forwardAngle = 0;

        // Controller object
        this.controls = controls;

        // Race variables
        this.laps = 0;
        this.targetCheckpoint = halfwayLine;
    }

    drive(){

        // Forward Control
        if(keyboard[this.controls.forward]){
            this.applyForce(this.direction);

            this.setTexture(sprites.forward);
        }
        // Backward Control
        else if(keyboard[this.controls.backward]){
            this.applyForce({x: -this.direction.x, y: -this.direction.y});

            this.setTexture(sprites.backward);
        }
        // Apply Friction
        else{
            this.applyFriction(0.1);

            this.setTexture(sprites.idle);
        }

        this.velocity.y += this.acceleration.y;
        this.velocity.x += this.acceleration.x;

        this.velocity = clampMagnitude(this.velocity, this.maxSpeed);
        this.acceleration = {x:0, y:0};

        // Speed Control
        this.speed = Math.hypot(this.velocity.x, this.velocity.y)

        if(this.speed < 0.1){
            this.velocity.x = 0;
            this.velocity.y = 0;

            this.setTexture(sprites.idle);
        }

        // Right Control
        if(keyboard[this.controls.right]){
            if(dotProduct(this.velocity, this.direction) > 0){
                this.rotation += this.turningSpeed * this.speed;

                this.setTexture(sprites.rightF);
            }
            else if(dotProduct(this.velocity, this.direction) < 0){
                this.rotation -= this.turningSpeed * this.speed;

                this.setTexture(sprites.rightB);
            }

            this.direction.y = Math.sin(this.rotation);
            this.direction.x = Math.cos(this.rotation);

            this.direction = normalizeVector(this.direction);

            this.velocity = projectVector(this.velocity, this.direction);
        }

        // Left Control
        if(keyboard[this.controls.left]){
            if(dotProduct(this.velocity, this.direction) > 0){
                this.rotation -= this.turningSpeed * this.speed;

                this.setTexture(sprites.leftF);
            }
            else if(dotProduct(this.velocity, this.direction) < 0){
                this.rotation += this.turningSpeed * this.speed;

                this.setTexture(sprites.leftB);
            }

            this.direction.y = Math.sin(this.rotation);
            this.direction.x = Math.cos(this.rotation);

            this.direction = normalizeVector(this.direction);

            this.velocity = projectVector(this.velocity, this.direction);
        }

        this.move(this.velocity);
    }

    applyForce(force={x:0, y:0}){
        this.acceleration.x += force.x / this.mass;
        this.acceleration.y += force.y / this.mass;
    }

    applyGravitationalForce(force={x:0, y:0}){
        this.acceleration.x += force.x;
        this.acceleration.y += force.y;
    }

    applyFriction(coeff){
        let frictionVector = {x:this.velocity.x * -1, y:this.velocity.y * -1};
        frictionVector = normalizeVector(frictionVector);
        frictionVector.x *= coeff;
        frictionVector.y *= coeff;
        
        this.acceleration.x += frictionVector.x;
        this.acceleration.y += frictionVector.y;
    }
}