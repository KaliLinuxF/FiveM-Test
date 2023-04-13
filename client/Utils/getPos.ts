import { Vector3 } from "./Vector3";

RegisterCommand('getPos', async (source: number, args: any, raw: string) => {
    const ped = PlayerPedId();
    const coords = Vector3.toVector3(GetEntityCoords(ped, true));

    emitNet('serverlog', `${JSON.stringify(coords)}`);

    const car = GetVehiclePedIsIn(ped, false);

    if(car) {
        const carCoords = Vector3.toVector3(GetEntityCoords(car, true));

        emitNet('serverlog', `${JSON.stringify(carCoords)}`);
    }
}, false);