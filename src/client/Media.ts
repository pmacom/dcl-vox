import { Dash_Cache_Texture, Dash_Cache_VideoClip, Dash_Cache_VideoMaterial } from "dcldash";

export enum MediaType {
    NFT = "NFT",
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
}

export class Media extends Entity {

    constructor(public mediaType: MediaType, public mediaSrc: string) {
        super()
        this.addComponent(new Transform())
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
    setTransform(media: any){
        const { x, y, z, rx, ry, rz, sx, sy, sz } = media;
        this.getComponent(Transform).position = new Vector3(x, y, z);
        this.getComponent(Transform).scale = new Vector3(sx, sy, sz);
        this.getComponent(Transform).rotation = Quaternion.Euler(rx, ry, rz);
    }
}