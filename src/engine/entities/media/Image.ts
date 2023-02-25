import { Dash_Cache_Texture, Dash_Material, Dash_UV_Image } from "dcldash";
import { GameControllerInstance } from "src/engine/GameController";
import { MediaType } from "../../listeners/events/Media";
import { HoldableMediaEntity } from "./HoldableMediaEntity";

export interface IMediaMetadataNFT {
    source: string;
}

export class Image extends HoldableMediaEntity {
    bg = new Entity();
    constructor(public gameController: GameControllerInstance, public id: string | undefined, public settings: any, public defaultTf: TransformConstructorArgs){
        super(gameController, id, settings, MediaType.IMAGE, defaultTf)
        this.addComponentOrReplace(new Transform())
        this.bg.addComponent(new Transform());
        this.bg.addComponent(new Material());
        this.bg.getComponent(Material).emissiveColor = Color3.White()
        this.bg.getComponent(Material).emissiveIntensity = 1.5;
        this.bg.addComponent(new PlaneShape());
        this.bg.getComponent(PlaneShape).uvs = Dash_UV_Image();
        this.bg.setParent(this.media);

        this.media.addComponent(Dash_Material.transparent());
        this.media.addComponent(new PlaneShape());
        this.media.getComponent(PlaneShape).withCollisions = true;
        this.setSettings(settings);
        engine.addEntity(this);
    }
    setSettings(settings: any){
        this.settings = settings;
        const { source } = this.settings;
        if(source){
            const txt = Dash_Cache_Texture.create(source);
            this.bg.getComponentOrCreate(Material).emissiveTexture = txt;
            this.bg.getComponentOrCreate(Material).alphaTexture = txt;
        }
    }
}

