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
    constructor(sprite, x=0, y=0, scale=0.1, radius=1, maxSpeed=1, mass=1, controls={forward: 38, backward: 40, left: 37, right: 39, drift: 32}){
        super(sprite, x, y, scale, radius);

        // Force variables
        this.mass = mass;

        // Speed variables
        this.maxSpeed = maxSpeed;
        this.speed = 0;
        this.turningSpeed = 0.007;

        // Vector variables
        this.direction = {x: 1, y: 0};
        this.velocity = {x: 0, y: 0};
        this.acceleration = {x: 0, y:0};

        // Rotation variables
        this.rotation = 0;
        this.forwardAngle = 0;

        // Controller object
        this.controls = controls;
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