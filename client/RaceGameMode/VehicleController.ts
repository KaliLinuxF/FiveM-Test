import { Delay } from "../Utils/Delay";

export type RGB = [number, number, number];

export class VehicleController {
    static lobbyVehicle: number;

    static async setLobbyVehicle(vehicleModel: string, color: RGB) {
        if (this.lobbyVehicle) {
            return;
        }

        RequestModel(vehicleModel);
        while (!HasModelLoaded(vehicleModel)) {
            await Delay(500);
        }

        const ped = PlayerPedId();
        const coords = GetEntityCoords(ped, true);

        this.lobbyVehicle = CreateVehicle(vehicleModel, coords[0], coords[1], coords[2], GetEntityHeading(ped), true, false);

        SetVehicleCustomPrimaryColour(this.lobbyVehicle, color[0], color[1], color[2]);
        SetVehicleCustomSecondaryColour(this.lobbyVehicle, color[0], color[1], color[2]);
        SetPedIntoVehicle(ped, this.lobbyVehicle, -1);

        SetEntityAsNoLongerNeeded(this.lobbyVehicle);
        SetModelAsNoLongerNeeded(this.lobbyVehicle);

        await Delay(2000);

        FreezeEntityPosition(this.lobbyVehicle, true);
    }

    static removeLobbyVehicle() {
        if(!this.lobbyVehicle) {
            return;
        }

        SetEntityAsMissionEntity(this.lobbyVehicle, true, true);
        DeleteVehicle(this.lobbyVehicle);
    }
}

onNet('racelobby:createVehicle', (vehicleModel: string, color: RGB) => {
    VehicleController.setLobbyVehicle(vehicleModel, color);
});

onNet('racelobby:removeVehicle', () => {
    VehicleController.removeLobbyVehicle();
})
