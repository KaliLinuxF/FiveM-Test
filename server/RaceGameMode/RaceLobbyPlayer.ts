import { Vector3 } from "../Utlis/Vector3";

export class RaceLobbyPlayer {
    private _player: number;
    private _exitPosition: Vector3;

    get player(): number {
        return this._player;
    }

    constructor(player: number, exitPosition: Vector3) {
        this._player = player;
        this._exitPosition = exitPosition;
    }

    onPlayerExitLobby() {
        const entity = NetworkGetEntityFromNetworkId(this._player);
        SetEntityCoords(entity, this._exitPosition.x, this._exitPosition.y, this._exitPosition.z, true, false, false, false);
        emitNet('racelobby:removeVehicle', this._player);
    }
}