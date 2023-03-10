export enum VoxType {
    NULL,
    Any,
    Self,
    Same,
    StrictEmpty,
    EmptyOrOther,
}

export enum VoxTType {
    NULL,
    FREE,
    SAME,
    ANY,
    EMPTY
}

export enum TileStatus {
    NULL,
    SAME,
    OTHER,
}

export interface TileData {
    model: string
    allowRotation: boolean
    onlyGroundFloor: boolean
    weight: number
    above: number[][]
    same: number[][]
    below: number[][]
}