export enum GameModes {
    VIEW,
    EDIT,
    PLACEMENT,
}

@EventConstructor()
export class ModeChanged {
    constructor(public mode: GameModes) { }
}