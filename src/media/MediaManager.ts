import { ColyseusClient } from "src/client/ColyseusClient";
import { MediaType } from "src/state/events/Media";
import { HoldableMediaEntity } from "./HoldableMediaEntity";
import { Image } from "./Image";
import { NFT } from "./NFT";
import { Video } from "./Video";

declare const Map: any

export interface IMediaEntity {
    id: string;
    entity: HoldableMediaEntity;
}

export class MediaManager_Instance {
    public _media: typeof Map = new Map()
    private _client?: ColyseusClient

    constructor() {
    }
    public add(mediaId: string | undefined, mediaType: MediaType, source: string, transform: Transform) {
        log({ mediaId, mediaType, source, transform })
        const {
            position: { x, y, z },
            scale: { x: sx, x: sy, x: sz },
            rotation: { eulerAngles: { x: rx, y: ry, z: rz} },
        } = transform;
        this._client?.room?.send("media-added", {
            baseParcel: this._client?.room.state.scene.baseParcel,
            mediaId, mediaType, source, x, y, z, rx, ry, rz, sx, sy, sz,
        })
    }

    public delete(mediaType: MediaType, mediaId: string) {
        this._client?.room?.send("media-removed", {
            baseParcel: this._client?.room.state.scene.baseParcel,
            mediaType,
            mediaId,
        })
    }

    public setClient(client: ColyseusClient) {
        this._client = client;
    }

    public get(mediaId: string) {
        return this._media.get(mediaId)
    }

    public remove(mediaId: string) {
        const entity = this._media.get(mediaId);
        engine.removeEntity(entity);
        return entity;
    }

    public set(mediaId: string, mediaType: MediaType, source: string, x: number, y: number, z: number, rx: number, ry: number, rz: number, sx: number, sy: number, sz: number) {
        const transform = new Transform({
            position: new Vector3(x, y, z),
            scale: new Vector3(sx, sy, sz),
            rotation: Quaternion.Euler(rx, ry, rz),
        })
        if(this._media.has(mediaId)){
            const entity: HoldableMediaEntity = this._media.get(mediaId);
            entity.media.addComponentOrReplace(transform);
            entity.setSource(source);
            entity.setMediaType(mediaType);
            if(!entity.isAddedToEngine()) engine.addEntity(entity);
            return entity;
        }else{
            return this._media.set(mediaId, this.getMediaEntity(mediaId, mediaType, source, transform));
        }
    }

    private getMediaEntity(mediaId: string, mediaType: MediaType, source: string, transform: TransformConstructorArgs) {
        let media: HoldableMediaEntity | undefined;
        switch (mediaType) {
            case MediaType.NFT: {
                log("CREATE NEW NFT")
                media = new NFT(mediaId, source, transform)
            } break;
            case MediaType.IMAGE: {
                log("CREATE NEW IMAGE")
                media = new Image(mediaId, source, transform)
            } break;
            case MediaType.VIDEO: {
                log("CREATE NEW VIDEO")
                media = new Video(mediaId, source, transform)
            } break;
        }
        if(media){
            media.getComponentOrCreate(Transform).position = new Vector3()
            // media.pickUp();
        }
        return media
    }
}

export const MediaManager = new MediaManager_Instance()