import { MediaType } from "src/state/events/Media";
import { HoldableMediaEntity } from "./HoldableMediaEntity";

export class NFT extends HoldableMediaEntity {
    constructor(public id: string | undefined, public source: string, public defaultTf: TransformConstructorArgs){
        super(id, source, MediaType.NFT, defaultTf);
        this.addComponentOrReplace(new Transform());
        this.setSource(source);
        engine.addEntity(this);
    }
    setSource(source: string){
        this.source = source;
        this.media.addComponentOrReplace(new NFTShape(this.source));
    }
}

