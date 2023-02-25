import { GameClient } from "src/engine/client/GameClient";
import { MediaPlacementTool } from "src/engine/entities/helpers/MediaPlacementTool";
import { MediaItemChanged, MediaItemPickedUp, MediaItemPlaced, MediaType } from "src/engine/listeners/events/Media";
import { GameModes } from "src/engine/listeners/events/Modes";
import { HoldableMediaEntity } from "../entities/media/HoldableMediaEntity";
import { Image, Video, NFT, Link, Text } from "../entities/media/index";
import { GameControllerInstance } from "../GameController";

declare const Map: any

export interface IMediaEntity {
    id: string;
    entity: HoldableMediaEntity;
}

export class MediaManager {
    public _media: typeof Map = new Map()
    private _client?: GameClient
    public placementTool: MediaPlacementTool;
    constructor(public gameController: GameControllerInstance) {
        this.placementTool = new MediaPlacementTool(this.gameController);
    }

    public setClient(client: GameClient) {
        this._client = client;
    }

    public add(mediaId: string | undefined, mediaType: MediaType, settings: any, transform: Transform) {
        this.log({ mediaId, mediaType, settings, transform })
        const {
            position: { x, y, z },
            scale: { x: sx, x: sy, x: sz },
            rotation: { eulerAngles: { x: rx, y: ry, z: rz } },
        } = transform;
        this._client?.room?.send("media-added", {
            baseParcel: this._client?.room.state.scene.baseParcel,
            mediaId, mediaType, settings, x, y, z, rx, ry, rz, sx, sy, sz,
        })
        this.gameController.state.setMode(GameModes.EDIT);
    }

    public delete(mediaType: MediaType, mediaId: string) {
        this._client?.room?.send("media-removed", {
            baseParcel: this._client?.room.state.scene.baseParcel,
            mediaType,
            mediaId,
        })
    }

    public get(mediaId: string) {
        return this._media.get(mediaId)
    }

    public set(mediaId: string, mediaType: MediaType, settings: any, x: number, y: number, z: number, rx: number, ry: number, rz: number, sx: number, sy: number, sz: number) {
        const transform = new Transform({
            position: new Vector3(x, y, z),
            scale: new Vector3(sx, sy, sz),
            rotation: Quaternion.Euler(rx, ry, rz),
        })
        if (mediaId && this._media.has(mediaId)) {
            const entity: HoldableMediaEntity = this._media.get(mediaId);
            entity.media.addComponentOrReplace(transform);
            entity.setMediaType(mediaType);
            entity.setSettings(settings);
            // entity.setTransform(transform);
            if (!entity.isAddedToEngine()) engine.addEntity(entity);
            return entity;
        } else {
            return this._media.set(mediaId, this.getMediaEntity(mediaId, mediaType, settings, transform));
        }
    }

    private getMediaEntity(mediaId: string, mediaType: MediaType, settings: any, transform: TransformConstructorArgs) {
        let media: HoldableMediaEntity | undefined;
        switch (mediaType) {
            case MediaType.NFT: {
                this.log("CREATE NEW NFT", { settings, mediaId, mediaType })
                media = new NFT(this.gameController, mediaId, settings, transform)
            } break;
            case MediaType.IMAGE: {
                this.log("CREATE NEW IMAGE", { settings, mediaId, mediaType })
                media = new Image(this.gameController, mediaId, settings, transform)
            } break;
            case MediaType.VIDEO: {
                this.log("CREATE NEW VIDEO", { settings, mediaId, mediaType })
                media = new Video(this.gameController, mediaId, settings, transform)
            } break;
            case MediaType.LINK: {
                this.log("CREATE NEW LINK", { settings, mediaId, mediaType })
                media = new Link(this.gameController, mediaId, settings, transform)
            } break;
            case MediaType.TEXT: {
                this.log("CREATE NEW TEXT", { settings, mediaId, mediaType })
                media = new Text(this.gameController, mediaId, settings, transform)
            } break;
        }
        if (media) {
            media.getComponentOrCreate(Transform).position = new Vector3()
            // media.pickUp();
        }
        return media
    }

    public remove(mediaId: string) {
        const entity = this._media.get(mediaId);
        engine.removeEntity(entity);
        this._media.delete(mediaId);
        return entity;
    }

    log(...args: any[]) {
        log(`[ MediaManager ]`, ...args)
    }
}