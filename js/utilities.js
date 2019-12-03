function normalizeVector(vector={x:0, y:0}){
    let normalizedVector = {x: 0, y: 0};
    normalizedVector.x = vector.x / Math.hypot(vector.x, vector.y);
    normalizedVector.y = vector.y / Math.hypot(vector.x, vector.y);
    return normalizedVector;
}