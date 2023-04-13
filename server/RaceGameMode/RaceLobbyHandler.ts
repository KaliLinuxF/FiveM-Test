import { RGB, RaceLobby } from "./RaceLobby";
import { RaceLobbyLocation } from "./RaceLobbyLocation";
import { lobbyLocations } from "./config";

const storage = new Map<number, RaceLobby>();
let idGenerator = 0;

export class RaceLobbyHandler {
    static create(player: number, locationName: string, vehicleModel: string, vehicleColor: RGB, maxPlayers: number) {
        const lobbyLocationConfig = lobbyLocations.find((item) => item.name === locationName);

        if(!lobbyLocationConfig) {
            console.log('Локация не найдена!');
            return;
        }

        const id = idGenerator++;

        const lobbyLocation = new RaceLobbyLocation(lobbyLocationConfig.name, lobbyLocationConfig.centerPosition, lobbyLocationConfig.dimension);
        const lobby = new RaceLobby(id, lobbyLocation, player, vehicleModel, vehicleColor, maxPlayers);

        lobby.initForPlayer(player);
        storage.set(id, lobby);
    }

    static getByPlayer(player: number) {
        return [...storage.values()].find((item) => item.isPlayerOnLobby(player));
    }

    static remove(id: number) {
        if(storage.has(id)) {
            storage.delete(id);
        }
    }
}