import { Dash_Cache_Texture, Dash_UV_Image } from "dcldash";
import { MediaType } from "src/state/events/Media";
import { HoldableMediaEntity } from "./HoldableMediaEntity";
import { MediaManager } from "./MediaManager";

export class Image extends HoldableMediaEntity {
    constructor(public id: string | undefined, public source: string, public defaultTf: TransformConstructorArgs){
        super(id, source, MediaType.IMAGE, defaultTf)
        this.addComponentOrReplace(new Transform())
        this.media.addComponent(new Material());
        this.media.getComponent(Material).emissiveColor = Color3.White()
        this.media.getComponent(Material).emissiveIntensity = 1.5;
        this.setSource(source);
        this.media.addComponent(new PlaneShape());
        this.media.getComponent(PlaneShape).uvs = Dash_UV_Image();
        engine.addEntity(this);
    }
    setSource(source: string){
        log("IMAGEEEEEE SOURCE", source)
        const txt = Dash_Cache_Texture.create(this.source)
        this.media.getComponent(Material).emissiveTexture = txt
        this.media.getComponent(Material).alphaTexture = txt
    }
}

