import { MediaType } from "../../listeners/events/Media";
import { Dash_Cache_VideoMaterial, Dash_Cache_VideoTexture, Dash_Material, Dash_UV_Image, Dash_UV_Video } from "dcldash";
import { HoldableMediaEntity } from "./HoldableMediaEntity";
import { GameControllerInstance } from "src/engine/GameController";

export interface IMediaMetadataVideo {
    source: string;
}

export class Video extends HoldableMediaEntity {
    container = new Entity();
    bg = new Entity();
    constructor(public gameController: GameControllerInstance, public id: string | undefined, public settings: any, public defaultTf: TransformConstructorArgs) {
        super(gameController, id, settings, MediaType.VIDEO, defaultTf)
        this.addComponentOrReplace(new Transform())
        this.bg.addComponent(new Transform());
        this.bg.addComponent(new Material());
        this.bg.getComponent(Material).emissiveColor = Color3.White()
        this.bg.getComponent(Material).emissiveIntensity = 1.5;
        this.bg.addComponent(new PlaneShape());
        this.bg.getComponent(PlaneShape).uvs = Dash_UV_Video();
        this.bg.setParent(this.media);

        this.media.addComponent(Dash_Material.transparent());
        this.media.addComponent(new PlaneShape());
        this.media.getComponent(PlaneShape).withCollisions = true;
        this.setSettings(settings);
        engine.addEntity(this);
    }
    setSettings(settings: any) {
        this.settings = settings;
        const { source } = this.settings;
        if (source) {
            const clip = Dash_Cache_VideoTexture.create(this.settings.source);
            clip.loop = true;
            clip.volume = 0;
            clip.play();
            const mat = Dash_Cache_VideoMaterial.create(this.settings.source);
            mat.emissiveColor = Color3.White();
            mat.emissiveIntensity = 1.5;
            this.bg.addComponentOrReplace(mat);
        }
    }
}

