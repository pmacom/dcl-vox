import { MediaPlacementTool } from "../../../engine/entities/helpers/MediaPlacementTool";
import { HoldableMediaEntity } from "../../../engine/entities/media/HoldableMediaEntity";

export enum MediaType {
    NONE = "NONE",
    NFT = "NFT",
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    TEXT = "TEXT",
    LINK = "LINK",
}

@EventConstructor()
export class MediaItemChanged {
    constructor(public mediaType: MediaType) { }
}

@EventConstructor()
export class MediaItemPickedUp {
    constructor(
        public item: HoldableMediaEntity | MediaPlacementTool,
    ) { }
}

@EventConstructor()
export class MediaItemPlaced {
    constructor(
        public item: HoldableMediaEntity | MediaPlacementTool,
        public hitPoint: Vector3,
        public normal: Vector3,
    ) { }
}

@EventConstructor()
export class MediaItemRemoved {
    constructor(
        public item: HoldableMediaEntity,
    ) { }
}

@EventConstructor()
export class MediaItemEditedInPlace {
    constructor(
        public item: HoldableMediaEntity,
    ) { }
}
