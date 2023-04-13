class FreezeController {
    static isFreeze: boolean = false;

    static setPlayerFreeze(state: boolean) {
        if(state === this.isFreeze) {
            return;
        }

        const ped = PlayerPedId();

        FreezeEntityPosition(ped, state);
    }
}

onNet('racelobby:setFreeze', (state: boolean) => {
    FreezeController.setPlayerFreeze(state);
});