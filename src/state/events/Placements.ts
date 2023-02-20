import { HoldableMediaEntity } from "src/media/HoldableMediaEntity";

export enum GamePlacementItem {
    NFT,
    IMAGE,
    VIDEO,
}

@EventConstructor()
export class PlacementItemChanged {
    constructor(public placementItem: GamePlacementItem) { }
}

@EventConstructor()
export class MediaItemPickedUp {
    constructor(
        public item: HoldableMediaEntity,
        public placementItem: GamePlacementItem, 
        public id: string,
    ) { }
}

@EventConstructor()
export class MediaItemPlaced {
    constructor(
        public item: HoldableMediaEntity,
        public placementItem: GamePlacementItem, 
        public id: string,
        public hitPoint: Vector3,
        public normal: Vector3,
    ) { }
}