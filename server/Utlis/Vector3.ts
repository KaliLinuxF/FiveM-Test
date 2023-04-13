export class Vector3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    dist(vector: Vector3): number {
        const unNormalizedVector = { x: Math.pow(vector.x - this.x, 2), y: Math.pow(vector.y - this.y, 2), z: Math.pow(vector.z - this.z, 2)};
    
        return Math.sqrt(unNormalizedVector.x + unNormalizedVector.y + unNormalizedVector.z);
    }
}

export function toVecotor3(coords: number[]): Vector3 {
    return new Vector3(coords[0], coords[1], coords[2]);
}