function normalizeVector(vector={x:0, y:0}){
    mag = Math.hypot(vector.x, vector.y);
    if(mag != 1 && mag != 0){
        let normalizedVector = {x: 0, y: 0};
        normalizedVector.x = vector.x / Math.hypot(vector.x, vector.y);
        normalizedVector.y = vector.y / Math.hypot(vector.x, vector.y);
        return normalizedVector;
    }
    else{
        return vector;
    }
}

function clampMagnitude(vector={x:0, y:0}, maxMagnitude=1){
    if(Math.hypot(vector.x, vector.y) > maxMagnitude){
        let clampedVector = normalizeVector(vector);
        clampedVector.x *= maxMagnitude;
        clampedVector.y *= maxMagnitude;

        
        return clampedVector;
    }
    else{
        return vector;
    }
}

function dotProduct(vector1={x:0, y:0}, vector2={x:0, y:0}){
    return (vector1.x * vector2.x) + (vector1.y * vector2.y);
}

function projectVector(vector={x:0, y:0}, targetVector={x:0, y:0}){
    let projectedVector = {x: 0, y: 0};
    let normlizedTarget = normalizeVector(targetVector);
    let scalar = dotProduct(vector, normlizedTarget);

    projectedVector.x = scalar * normlizedTarget.x;
    projectedVector.y = scalar * normlizedTarget.y;

    return projectedVector;
}

function scaleVector(vector={x:0, y:0}, scalar){
    let scaledVector = {x:0, y:0};
    scaledVector.x = vector.x * scalar;
    scaledVector.y = vector.y * scalar;
    return scaledVector;
}

function collision(car1, car2){
    let desiredVelocity = {x:0, y:0};

    desiredVelocity.x = ((car1.mass * car1.velocity.x) + (car2.mass * car2.velocity.x)) / (car1.mass + car2.mass);
    desiredVelocity.y = ((car1.mass * car1.velocity.y) + (car2.mass * car2.velocity.y)) / (car1.mass + car2.mass);

    desiredVelocity = normalizeVector(desiredVelocity);
    desiredVelocity.x *= car1.maxSpeed;
    desiredVelocity.y *= car1.maxSpeed;

    car1.applyForce({x:desiredVelocity.x - car1.velocity.x, y:desiredVelocity.y - car1.velocity.y});
    car2.applyForce({x:desiredVelocity.x - car2.velocity.x, y:desiredVelocity.y - car2.velocity.y});
}

function distance(vector1={x:0, y:0}, vector2={x:0, y:0}){
    return Math.hypot(vector2.x - vector1.x, vector2.y - vector1.y);
}