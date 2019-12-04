function normalizeVector(vector={x:0, y:0}){
    let normalizedVector = {x: 0, y: 0};
    normalizedVector.x = vector.x / Math.hypot(vector.x, vector.y);
    normalizedVector.y = vector.y / Math.hypot(vector.x, vector.y);
    return normalizedVector;
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