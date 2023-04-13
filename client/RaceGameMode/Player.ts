onNet('racelobby:setPosition', (x: number, y: number, z: number) => {
    const ped = PlayerPedId();

    emitNet('serverlog', `${x}, ${y}, ${z}`);
    SetEntityCoords(ped, x, y, z, true, false, false, false);
})