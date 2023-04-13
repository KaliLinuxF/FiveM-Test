import { RaceLobbyHandler } from "./RaceLobbyHandler";

RegisterCommand('raceinvite', (source: number, args: any, raw: string) => {
    if(args.length < 1) {
        return;
    }

    const targetServerId = parseInt(args[0]);
    const playerServerId = source;

    if(targetServerId === playerServerId) {
        return;
    }

    const lobby = RaceLobbyHandler.getByPlayer(playerServerId);
    
    if(!lobby || lobby.leader !== playerServerId) {
        return;
    }

    const targetLobby = RaceLobbyHandler.getByPlayer(targetServerId);

    if(targetLobby) {
        return;
    }

    lobby.initForPlayer(targetServerId);

}, false);

RegisterCommand('leaverace', (source: number, args: any, raw: string) => {
    const playerServerId = source;

    const lobby = RaceLobbyHandler.getByPlayer(playerServerId);
    
    if(!lobby) {
        return;
    }

    lobby.deinitForPlayer(playerServerId);
}, false);

RegisterCommand('startrace', (source: number, args: any, raw: string) => {
    const playerServerId = source;

    const lobby = RaceLobbyHandler.getByPlayer(playerServerId);
    
    if(!lobby || lobby.leader !== playerServerId) {
        return;
    }

    lobby.start();
}, false);

RegisterCommand('endrace', (source: number, args: any, raw: string) => {
    const playerServerId = source;

    const lobby = RaceLobbyHandler.getByPlayer(playerServerId);
    
    if(!lobby || lobby.leader !== playerServerId) {
        return;
    }

    lobby.finish();
}, false);

RegisterServerEvent('racelobby:create');

on('racelobby:create', (player: number, locationName: string, vehicleModel: string, color1: number, color2: number, color3: number, maxPlayers: number) => {
    RaceLobbyHandler.create(player, locationName, vehicleModel, [color1, color2, color3], maxPlayers);
});