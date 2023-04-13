import { Vector3, toVecotor3 } from "../Utlis/Vector3";
import { RaceLobbyLocation } from "./RaceLobbyLocation";
import { RaceLobbyPlayer } from "./RaceLobbyPlayer";
import { EXCLUDE_LEADER_POSITION_RADIUS, SPAWN_NEAR_LEADER_RADIUS } from "./config";

export type RGB = [number, number, number];

export type VehicleSettings = {
    modelName: string;
    color: RGB
}

export class RaceLobby {
    private readonly _lobbyId: number;
    private readonly location: RaceLobbyLocation;
    private readonly players: RaceLobbyPlayer[];
    private readonly vehicleSettings: VehicleSettings;
    private readonly maxPlayers: number;
    private isStarted: boolean;

    private _leader: number;

    get leader(): number {
        return this._leader;
    }

    get lobbyId(): number {
        return this._lobbyId;
    }

    constructor(lobbyId: number, location: RaceLobbyLocation, creator: number, vehicleModel: string, color: RGB, maxPlayers: number) {
        this._lobbyId = lobbyId;
        this.location = location;
        this._leader = creator;
        this.maxPlayers = maxPlayers;
        this.isStarted = true;

        this.vehicleSettings = {
            color,
            modelName: vehicleModel
        }

        this.players = [];
    }

    start() {
        this.players.forEach((item) => {
            emitNet('racelobby:setFreeze', item.player, false);
        });
    }

    finish() {
        this.isStarted = false;

        this.players.forEach((entity) => {
            this.deinitForPlayer(entity.player);
        });
    }

    initForPlayer(player: number) {
        const playerEntity = NetworkGetEntityFromNetworkId(player);

        const coords = toVecotor3(GetEntityCoords(playerEntity));
        const raceLobbyPlayer = new RaceLobbyPlayer(player, coords);

        const tpPosition = this.location.centerPosition;

        if(player === this._leader) {
            emitNet('racelobby:setPosition', player, tpPosition.x, tpPosition.y, tpPosition.z);
        } else {
            const spawnPosition = this.getRandomSpawnNearLeader();
            emitNet('racelobby:setPosition', player, spawnPosition.x, spawnPosition.y, spawnPosition.z);
        }

        emitNet('racelobby:createVehicle', player, this.vehicleSettings.modelName, this.vehicleSettings.color);
        emitNet('racelobby:setFreeze', player, true);

        this.players.push(raceLobbyPlayer);
    }

    deinitForPlayer(player: number) {
        const racePlayer = this.getRacePlayer(player);

        if(!racePlayer) {
            return;
        }

        if(this._leader === racePlayer.player) {
            this.delegateLeader();
        }

        racePlayer.onPlayerExitLobby();

        const playerIndex = this.players.indexOf(racePlayer);

        if(player !== -1) {
            this.players.splice(playerIndex, 1);
        }

        if(this.players.length <= 1 && this.isStarted) {
            this.finish();
        }
    }

    isPlayerCanJoin(player: number) {
        if(this.getRacePlayer(player)) {
            return false;
        }

        if(this.players.length >= this.maxPlayers) {
            return false;
        }
         
        return true;
    }

    isPlayerOnLobby(player: number) {
        return this.getRacePlayer(player) ? true : false;
    }

    private getRandomSpawnNearLeader() {
        const leaderEntity = NetworkGetEntityFromNetworkId(this._leader);
        const leaderPosition = toVecotor3(GetEntityCoords(leaderEntity));

        const spawnPosition: Vector3 = new Vector3(0, 0, 0);

        do {
            spawnPosition.x = leaderPosition.x + Math.random() * (SPAWN_NEAR_LEADER_RADIUS * 2) - SPAWN_NEAR_LEADER_RADIUS;
            spawnPosition.y = leaderPosition.y + Math.random() * (SPAWN_NEAR_LEADER_RADIUS * 2) - SPAWN_NEAR_LEADER_RADIUS;
            spawnPosition.z = leaderPosition.z;
        } while (leaderPosition.dist(spawnPosition) <= EXCLUDE_LEADER_POSITION_RADIUS);

        return spawnPosition;
    }

    private getRacePlayer(player: number) {
        return this.players.find((item) => item.player === player);
    }

    private delegateLeader() {
        let newLeader: number;

        do {
            const randomNumber = Math.floor(Math.random() * this.players.length)
            newLeader = this.players[randomNumber].player;
        } while (this._leader === newLeader);

        this._leader = newLeader;
    }
}