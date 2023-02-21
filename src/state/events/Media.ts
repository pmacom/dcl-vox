import { HoldableMediaEntity } from "src/media/HoldableMediaEntity";

export enum MediaType {
    NONE = "NONE",
    NFT = "NFT",
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
}

@EventConstructor()
export class MediaItemChanged {
    constructor(public mediaType: MediaType) { }
}

@EventConstructor()
export class MediaItemPickedUp {
    constructor(
        public item: HoldableMediaEntity,
    ) { }
}

@EventConstructor()
export class MediaItemPlaced {
    constructor(
        public item: HoldableMediaEntity,
        public hitPoint: Vector3,
        public normal: Vector3,
    ) { }
}