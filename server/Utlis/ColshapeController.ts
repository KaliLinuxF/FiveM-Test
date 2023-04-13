import { Vector3 } from "./Vector3";

const storage = new Set<number>();
let idGenerator = 0;

export class ColshapeController {
    static create(position: Vector3, dimension: number, radius: number) {
        const id = idGenerator++;

        emitNet('createColshape', -1, id, position, dimension, radius);
    
        storage.add(id);
        return id;
    }

    static destroy(id: number) {
        if(!storage.has(id)) {
            return;
        }

        emitNet('destroyColshape', -1, id);
        storage.delete(id);
    }
}
