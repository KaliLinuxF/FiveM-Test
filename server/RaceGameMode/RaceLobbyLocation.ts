import { Vector3 } from "../Utlis/Vector3";

export class RaceLobbyLocation {
    private _name: string;
    private _centerPosition: Vector3;
    private _dimension: number;

    public get name() : string {
        return this._name;
    }

    public get centerPosition() : Vector3 {
        return this._centerPosition;
    }

    public get dimension() : number {
        return this._dimension;
    }
    
    constructor(name: string, centerPosition: Vector3, dimension: number) {
        this._name = name;
        this._centerPosition = centerPosition;
        this._dimension = dimension;
    }
}