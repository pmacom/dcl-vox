import { GameControllerInstance } from "src/engine/GameController";
import { MediaType } from "../../listeners/events/Media";
import { HoldableMediaEntity } from "./HoldableMediaEntity";

export interface IMediaMetadataNFT {
    contractAddress: string;
    tokenId: string;
}

export class NFT extends HoldableMediaEntity {
    constructor(public gameController: GameControllerInstance, public id: string | undefined, public settings: any, public defaultTf: TransformConstructorArgs){
        super(gameController, id, settings, MediaType.NFT, defaultTf);
        this.addComponentOrReplace(new Transform());
        this.setSettings(settings);
        engine.addEntity(this);
    }
    setSettings(settings: any){
        this.settings = settings;
        const { contractAddress, tokenId, frameColor } = this.settings
        if(contractAddress && tokenId && frameColor){
            const nft = new NFTShape(
                `ethereum://${contractAddress}/${tokenId}`
            );
            const color = Color3.FromHexString(frameColor?.slice(0, 7) ?? "#000000");
            nft.color = color;
            this.media.addComponentOrReplace(nft);
        }
    }
}

