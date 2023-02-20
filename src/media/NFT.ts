import { HoldableMediaEntity } from "./HoldableMediaEntity";

export class NFT extends HoldableMediaEntity {
    constructor(public defaultTf: TransformConstructorArgs){
        super(defaultTf)
        this.media.addComponent(new NFTShape(`ethereum://0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b/2055`));
        engine.addEntity(this)
    }
}