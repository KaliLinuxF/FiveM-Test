import { Vector3 } from "../Utlis/Vector3";

export const lobbyLocations = [
    {
        name: 'airport',
        centerPosition: new Vector3(-1336.1356, -3044.0156, 13.9444),
        dimension: 25
    },
    {
        name: 'zancudo',
        centerPosition: new Vector3(-2311.8376, 3071.18096, 32.8142),
        dimension: 26
    }
]

export const SPAWN_NEAR_LEADER_RADIUS = 50;
export const EXCLUDE_LEADER_POSITION_RADIUS = 5;