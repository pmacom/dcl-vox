import { GameControllerInstance } from "src/engine/GameController";
import { MediaType } from "../../listeners/events/Media";
import { HoldableMediaEntity } from "./HoldableMediaEntity";

export interface IMediaMetadataText {
    label: string;
}

export class Text extends HoldableMediaEntity {
    text = new Entity()
    constructor(public gameController: GameControllerInstance, public id: string | undefined, public settings: any, public defaultTf: TransformConstructorArgs) {
        super(gameController, id, settings, MediaType.TEXT, defaultTf)
        this.addComponentOrReplace(new Transform());
        this.text.addComponent(new Transform({
            position: new Vector3(0, 0, -0.025)
        }))
        this.text.addComponent(new TextShape());
        this.text.setParent(this.media);
        this.media.addComponent(new Material());
        this.media.addComponent(new PlaneShape());
        this.media.getComponent(PlaneShape).withCollisions = true;

        this.setSettings(settings);
        engine.addEntity(this);
    }
    setSettings(settings: any) {
        this.settings = settings;
        const { label, bgColor, fontSize, fontColor, textWrapping } = this.settings
        if (label && bgColor && fontSize && fontColor && textWrapping) {
            const color = settings.bgColor.length === 9 ? Color4.FromHexString(bgColor) : Color3.FromHexString(bgColor)
            const color3 = Color3.FromHexString(settings.bgColor.slice(0, 7))
            this.media.getComponent(Material).albedoColor = color;
            this.media.getComponent(Material).emissiveColor = color3;
            this.media.getComponent(Material).emissiveIntensity = 1.5;
            this.text.getComponent(TextShape).value = label;
            this.text.getComponent(TextShape).color = fontColor;
            this.text.getComponent(TextShape).fontSize = fontSize;
            this.text.getComponent(TextShape).textWrapping = textWrapping;
        }
    }
}

