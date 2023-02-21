import { MediaType } from "src/state/events/Media";
import { HoldableMediaEntity } from "./HoldableMediaEntity";
import { SceneMedia } from "./SceneMedia";

export class NFT extends HoldableMediaEntity {
    constructor(public id: string | undefined, public source: string, public defaultTf: TransformConstructorArgs){
        super(id, source, MediaType.NFT, defaultTf);
        this.addComponentOrReplace(new Transform());
        this.media.addComponent(new NFTShape(this.source));
        engine.addEntity(this);
        SceneMedia.add(`nft-${id}`, this);
    }
}

