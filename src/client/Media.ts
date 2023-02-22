import { Dash_Cache_Texture, Dash_Cache_VideoClip, Dash_Cache_VideoMaterial } from "dcldash";
import { MediaType } from "src/state/events/Media";

enum MediaDefaultSources {
    NFT = "ethereum://0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b/2055",
    IMAGE = "https://metazoo-blob.nyc3.digitaloceanspaces.com/97_SCHEDULE_343822f45e.jpeg?updated_at=2023-02-10T23:46:55.235Z",
    VIDEO = "https://metazoo-blob.nyc3.digitaloceanspaces.com/tunnel_flicker_loop_e2754f3871.mp4?updated_at=2023-01-16T07:07:37.706Z",
    NONE = "",
}

export class MediaPlacementTool extends Entity {
    public mediaType!: MediaType
    public mediaSrc!: string
    constructor() {
        super()
        this.addComponent(new Transform())
    }
    setMedia(mediaType: MediaType, mediaSrc?: string) {
        this.mediaType = mediaType;
        this.mediaSrc = mediaSrc ?? MediaDefaultSources[mediaType];
        switch (this.mediaType) {
            case MediaType.IMAGE:
                this.addComponent(new PlaneShape());
                this.addComponent(new Material());
                const txt = Dash_Cache_Texture.create(this.mediaSrc);
                this.getComponent(Material).albedoTexture = txt;
                this.getComponent(Material).emissiveTexture = txt;
                this.getComponent(Material).emissiveColor = Color3.White();
                this.getComponent(Material).emissiveIntensity = 1.5;
                break;
            case MediaType.NFT:
                this.addComponent(new NFTShape(this.mediaSrc))
                break;
            case MediaType.VIDEO:
                this.addComponent(new PlaneShape());
                const clip = Dash_Cache_VideoClip.create(this.mediaSrc);
                const mat = Dash_Cache_VideoMaterial.create(this.mediaSrc);
                this.addComponent(mat);
                // this.getComponent(Material).emissiveTexture = mat;
                this.getComponent(Material).emissiveColor = Color3.White();
                this.getComponent(Material).emissiveIntensity = 1.5;
                break;
        }
    }
    setTransform(media: any) {
        const { x, y, z, rx, ry, rz, sx, sy, sz } = media;
        this.getComponent(Transform).position = new Vector3(x, y, z);
        this.getComponent(Transform).scale = new Vector3(sx, sy, sz);
        this.getComponent(Transform).rotation = Quaternion.Euler(rx, ry, rz);
    }
}