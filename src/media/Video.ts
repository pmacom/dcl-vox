import { Dash_Cache_VideoMaterial, Dash_Cache_VideoTexture, Dash_UV_Video } from "dcldash";
import { MediaType } from "src/state/events/Media";
import { HoldableMediaEntity } from "./HoldableMediaEntity";
import { SceneMedia } from "./SceneMedia";

export class Video extends HoldableMediaEntity {
    constructor(public id: string | undefined, public source: string, public defaultTf: TransformConstructorArgs){
        super(id, source, MediaType.VIDEO, defaultTf)
        this.addComponentOrReplace(new Transform())
        const clip = Dash_Cache_VideoTexture.create(this.source);
        clip.loop = true;
        clip.volume = 0;
        clip.play();
        const mat = Dash_Cache_VideoMaterial.create(this.source);
        this.media.addComponent(mat);
        mat.emissiveColor = Color3.White();
        mat.emissiveIntensity = 1.5;
        this.media.addComponent(new PlaneShape());
        this.media.getComponent(PlaneShape).uvs = Dash_UV_Video();
        engine.addEntity(this);
        SceneMedia.add(`video-${id}`, this);
    }
}

