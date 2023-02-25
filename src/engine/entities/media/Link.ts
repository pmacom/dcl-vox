import { GameControllerInstance } from "src/engine/GameController";
import { MediaType } from "../../listeners/events/Media";
import { HoldableMediaEntity } from "./HoldableMediaEntity";

export interface IMediaMetadataLink {
    link: string;
    label: string;
    hoverText: string;
    color: Color4 | string;
    bgcolor: Color4 | string;
    fontSize: number;
    textWrapping: boolean;
}

export class Link extends HoldableMediaEntity {
    text = new Entity()
    constructor(public gameController: GameControllerInstance, public id: string | undefined, public settings: any, public defaultTf: TransformConstructorArgs) {
        super(gameController, id, settings, MediaType.LINK, defaultTf)
        this.text.addComponent(new Transform({
            position: new Vector3(0,0,-0.01)
        }))
        this.media.addComponent(new Material());
        this.media.addComponent(new PlaneShape());
        this.media.getComponent(PlaneShape).withCollisions = true;
        this.text.addComponent(new TextShape());
        this.setSettings(settings);
        this.text.setParent(this.media);
        engine.addEntity(this);
    }
    setSettings(settings: any) {
        this.settings = settings;
        const { label, link, hoverText, bgColor, fontSize, fontColor, textWrapping } = this.settings
        if (label && link && bgColor && hoverText && fontSize && fontColor && textWrapping) {
            const bgColor43 = this.settings.bgColor.length === 9 ? Color4.FromHexString(bgColor) : Color3.FromHexString(bgColor)
            const bgColor3 = Color3.FromHexString(this.settings.bgColor.slice(0, 7))
            const fontColor = Color3.FromHexString(this.settings.fontColor.slice(0, 7))
            this.media.getComponent(Material).albedoColor = bgColor43;
            this.media.getComponent(Material).emissiveColor = bgColor3;
            this.media.getComponent(Material).emissiveIntensity = 1.5;
            this.text.getComponent(TextShape).value = label;
            this.text.getComponent(TextShape).color = fontColor;
            this.text.getComponent(TextShape).fontSize = fontSize;
            this.text.getComponent(TextShape).textWrapping = textWrapping;
            this.text.addComponentOrReplace(new OnPointerDown(() => {
                openExternalURL(link);
            }, {
                hoverText: hoverText,
            }))
        }
    }

}

