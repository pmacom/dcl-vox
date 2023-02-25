export enum GameModes {
    VIEW,
    EDIT,
    PLACEMENT, // For new placements
    PLACEMENT_EXISTING, // For existing pick/place
}

@EventConstructor()
export class ModeChanged {
    constructor(public mode: GameModes) { }
}

@EventConstructor()
export class ResetScene {
    constructor() { }
}