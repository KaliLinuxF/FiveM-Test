import { Vector3 } from "./Vector3";

const Delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const storage = new Map<number, Colshape>();

export class ColshapePool {
    static create(id: number, position: Vector3, dimension: number, radius: number) {
        if(storage.has(id)) {
            return;
        }
        const colshape = new Colshape(id, position, dimension, radius);
        storage.set(id, colshape);
    }

    static removeColshape(id: number) {
        if(storage.has(id)) {
            storage.delete(id);
        }
    }
}

class Colshape {
    readonly id: number;
    isPlayerInRadius: boolean;
    position: Vector3;
    dimension: number;
    radius: number;

    constructor(id: number, position: Vector3, dimension: number, radius: number) {
        this.id = id;
        this.position = position;
        this.dimension = dimension;
        this.radius = radius;
        this.isPlayerInRadius = false;
    }

    onPlayerEnterColshape() {
        this.isPlayerInRadius = true;
        emitNet('playerEnterColshape', PlayerPedId(), this.id);
    }

    onPlayerExitColshape() {
        this.isPlayerInRadius = false;
        emitNet('playerExitColshape', PlayerPedId(), this.id);
    }
}

setTick(async () => {
    if(storage.size > 0) {
        const ped = PlayerPedId();
        const pedCoords = Vector3.toVector3(GetEntityCoords(ped, true));
        const colshapes = [...storage.values()];

        colshapes.forEach((colshape) => {
            if(pedCoords.dist(colshape.position) <= colshape.radius) {
                if(colshape.isPlayerInRadius) {
                    return;
                }

                colshape.onPlayerEnterColshape();
            } else {
                if(!colshape.isPlayerInRadius) {
                    return;
                }

                colshape.onPlayerExitColshape();
            }
        })
    }

    await Delay(1000);
});

onNet('createColshape', (id: number, position: Vector3, dimension: number, radius: number) => {
    ColshapePool.create(id, position, dimension, radius);
});

onNet('destroyColshape', (id: number) => {
    ColshapePool.removeColshape(id);
});