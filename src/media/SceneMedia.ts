import { HoldableMediaEntity } from "./HoldableMediaEntity";

declare const Map: any

class _SceneMedia {
    media: typeof Map = new Map();
    constructor(){

    }
    add(name: string, entity: HoldableMediaEntity){
        this.media.set(name, entity)
        log("add", { name, entity })
    }
    clear(){
        for(const [key, media] of this.media.entries()){
            log("clear", { key, media })
        }
    }
}

export const SceneMedia = new _SceneMedia()