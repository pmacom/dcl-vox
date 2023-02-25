import { getUserData } from "@decentraland/Identity";
import { Dash_Cache_Texture, Dash_Cache_VideoMaterial, Dash_Cache_VideoTexture, Dash_UV_Image, Dash_UV_Video } from "dcldash";
import { settingsToObject } from "src/engine/entities/helpers/MediaDefaultSettings";
import { GameControllerInstance } from "src/engine/GameController";
import { MediaType } from "src/engine/listeners/events/Media";

export class MediaPlacementTool extends Entity {
    public mediaType!: MediaType;
    public settings!: any;
    public media: Entity = new Entity();
    public bg: Entity = new Entity();
    public text?: Entity;
    public avatarId!: string;
    public holding: boolean = false;
    constructor(public gameController: GameControllerInstance) {
        super()
        this.addComponent(new Transform());
        this.bg.addComponent(new Transform());
        this.bg.setParent(this);
        this.media.addComponent(new Transform());
        this.media.setParent(this.bg);
    }
    setMedia(mediaType: MediaType, settings?: any) {
        this.mediaType = mediaType;
        this.settings = settings ?? settingsToObject(mediaType);
        this.removeAllComponents()
        switch (this.mediaType) {
            case MediaType.IMAGE: {
                if (this.settings.source) {
                    this.media.addComponentOrReplace(new PlaneShape());
                    this.media.addComponentOrReplace(new Material());
                    this.media.getComponent(PlaneShape).uvs = Dash_UV_Image();
                    const txt = Dash_Cache_Texture.create(this.settings.source);
                    this.media.getComponent(Material).albedoTexture = txt;
                    this.media.getComponent(Material).emissiveTexture = txt;
                    this.media.getComponent(Material).emissiveColor = Color3.White();
                    this.media.getComponent(Material).emissiveIntensity = 1.5;
                }
            } break;
            case MediaType.NFT: {
                if (this.settings.contractAddress && this.settings.tokenId) {
                    const nft = new NFTShape(
                        `ethereum://${this.settings.contractAddress}/${this.settings.tokenId}`
                    )
                    const color = Color3.FromHexString(this.settings.frameColor?.slice(0, 7) ?? "#000000");
                    nft.color = color;
                    this.media.addComponentOrReplace(nft);
                }
            } break;
            case MediaType.VIDEO: {
                if (this.settings.source) {
                    this.media.addComponentOrReplace(new PlaneShape());
                    this.media.getComponent(PlaneShape).uvs = Dash_UV_Video();
                    const clip = Dash_Cache_VideoTexture.create(this.settings.source);
                    clip.loop = true;
                    clip.volume = 0;
                    clip.play();
                    const mat = Dash_Cache_VideoMaterial.create(this.settings.source);
                    this.media.addComponentOrReplace(mat);
                    mat.emissiveColor = Color3.White();
                    mat.emissiveIntensity = 1.5;
                }
            } break;
            case MediaType.TEXT: {
                const { label, bgColor, fontSize, fontColor, textWrapping } = this.settings
                if (label && bgColor && fontSize && fontColor && textWrapping) {
                    this.bg.addComponentOrReplace(new PlaneShape());
                    this.bg.addComponentOrReplace(new Material());
                    this.media.addComponentOrReplace(new TextShape());
                    const bgColor43 = bgColor.length === 9 ? Color4.FromHexString(bgColor) : Color3.FromHexString(bgColor)
                    const bgColor3 = bgColor.slice(0, 7)
                    this.bg.getComponent(Material).albedoColor = bgColor43;
                    this.bg.getComponent(Material).emissiveColor = Color3.FromHexString(bgColor3);
                    this.bg.getComponent(Material).emissiveIntensity = 1.5;
                    this.media.getComponentOrCreate(TextShape).value = label;
                    this.media.getComponent(TextShape).fontSize = fontSize;
                    this.media.getComponent(TextShape).textWrapping = textWrapping == "true";
                    this.media.getComponent(TextShape).color = Color3.FromHexString(fontColor.slice(0, 7));
                    this.media.getComponent(Transform).position.z = -0.01
                }
            } break;
            case MediaType.LINK: {
                const { label, link, bgColor, fontSize, fontColor, textWrapping } = this.settings
                if (label && bgColor && fontSize && fontColor && textWrapping) {
                    this.bg.addComponentOrReplace(new PlaneShape());
                    this.bg.addComponentOrReplace(new Material());
                    this.media.addComponentOrReplace(new TextShape());
                    const bgColor43 = bgColor.length === 9 ? Color4.FromHexString(bgColor) : Color3.FromHexString(bgColor)
                    const bgColor3 = bgColor.slice(0, 7)
                    this.bg.getComponent(Material).albedoColor = bgColor43;
                    this.bg.getComponent(Material).emissiveColor = Color3.FromHexString(bgColor3);
                    this.bg.getComponent(Material).emissiveIntensity = 1.5;
                    this.media.getComponent(TextShape).value = label;
                    this.media.getComponent(TextShape).fontSize = fontSize;
                    this.media.getComponent(TextShape).textWrapping = textWrapping == "true";
                    this.media.getComponent(TextShape).color = Color3.FromHexString(fontColor.slice(0, 7));
                    this.media.getComponent(Transform).position.z = -0.01
                }
            } break;
            case MediaType.NONE: {} break;
        }
    }
    removeAllComponents() {
        if (this.bg.hasComponent(Material)) this.bg.removeComponent(Material);
        if (this.bg.hasComponent(PlaneShape)) this.bg.removeComponent(PlaneShape);
        if (this.media.hasComponent(NFTShape)) this.media.removeComponent(NFTShape);
        if (this.media.hasComponent(PlaneShape)) this.media.removeComponent(PlaneShape);
        if (this.media.hasComponent(Material)) this.media.removeComponent(Material);
        if (this.media.hasComponent(TextShape)) this.media.removeComponent(TextShape);
    }
    setTransform(media: any) {
        const { x, y, z, rx, ry, rz, sx, sy, sz } = media;
        this.media.getComponent(Transform).position = new Vector3(x, y, z);
        this.media.getComponent(Transform).scale = new Vector3(sx, sy, sz);
        this.media.getComponent(Transform).rotation = Quaternion.Euler(rx, ry, rz);
    }
    setSettings(settings: any) {
        this.settings = settings;
    }
    setMediaType(mediaType: MediaType) {
        this.mediaType = mediaType;
    }
    pickUp() {
        this.holding = true;
        this.log("⬆️ Picked up")
        if (this.gameController.state.holdingMediaItem) {
            this.gameController.state.holdingMediaItem.putDownRevert();
            this.gameController.state.holdingMediaItem = undefined;
        }
        this.gameController.state.holdingMediaPlacementTool = this;
        executeTask(async () => {
            this.avatarId = (await getUserData())?.userId!;
            this.addComponentOrReplace(
                new AttachToAvatar({
                    avatarId: this.avatarId,
                    anchorPointId: AttachToAvatarAnchorPointId.NameTag,
                })
            )
        })
        this.add()
    }
    getPlacedTransform(hitPoint: Vector3, normal: Vector3) {
        if (this.hasComponent(AttachToAvatar)) this.removeComponent(AttachToAvatar);
        this.getComponentOrCreate(Transform).position = new Vector3();
        const inch = Vector3.Lerp(Vector3.Zero(), normal, .025);
        const { x, y, z } = hitPoint
        const transform = this.media.getComponentOrCreate(Transform)
        transform.position = new Vector3(x, y, z).add(inch);
        const targetPosition = new Vector3(x, y, z).addInPlace(normal)
        transform.lookAt(targetPosition)
        transform.rotate(Vector3.Up(), 180)
        return transform;
    }
    putDownRevert() {
        this.log("⬇️ Put down")
        this.holding = false;
        if (this.hasComponent(AttachToAvatar)) this.removeComponent(AttachToAvatar);
    }
    add() {
        this.log("➕ Added")
        if (!this.isAddedToEngine()) engine.addEntity(this);
        if (!this.media.isAddedToEngine()) engine.addEntity(this.media);
        this.addComponentOrReplace(new Transform());
        this.bg.addComponentOrReplace(new Transform({
            position: new Vector3(0.51, -0.5, 1)
        }));
        this.media.addComponentOrReplace(new Transform());
        this.media.setParent(this.bg);
        this.bg.setParent(this);
    }
    remove() {
        this.log("➖ Removed")
        this.holding = false;
        if (this.isAddedToEngine()) engine.removeEntity(this);
    }
    log(...args: any[]) {
        log(`[ MediaPlacement ]`, ...args)
    }
}