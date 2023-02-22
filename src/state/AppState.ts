import { HoldableMediaEntity } from "src/media/HoldableMediaEntity";
import { MediaManager } from "src/media/MediaManager";
import { EventListener } from "./events/listener";
import { GameModes, ModeChanged } from "./events/Modes";
import { MediaItemPickedUp, MediaItemPlaced, MediaType, MediaItemChanged } from "./events/Media";

export class _AppState {
    mode: GameModes = GameModes.VIEW;
    mediaType: MediaType = MediaType.NONE;
    holding: boolean = false;
    holdingMediaItem: HoldableMediaEntity | undefined;
    listener = new EventListener(this);
    constructor() {

    }
    isView() { return this.mode === GameModes.VIEW; }
    isEdit() { return this.mode === GameModes.EDIT; }
    isPlacement() { return this.mode === GameModes.PLACEMENT; }
    isHolding() { return this.mode === GameModes.PLACEMENT; }

    public setMode(mode: GameModes) {
        this.mode = mode;
        this.listener.events.fireEvent(new ModeChanged(this.mode));
    }

    public setMediaType(mediaType: MediaType) {
        this.mediaType = mediaType;
        this.listener.events.fireEvent(new MediaItemChanged(this.mediaType));
    }
    
    public pickOrPlaceMediaItem(item: HoldableMediaEntity, holding: boolean, hitPoint?: Vector3, normal?: Vector3){
        this.holding = holding;
        if(holding){
            if(item.mediaType !== this.mediaType){
                this.setMediaType(item.mediaType);
            }
            this.holdingMediaItem = item;
            this.listener.events.fireEvent(new MediaItemPickedUp(item));
        }else{
            this.holdingMediaItem = undefined;
            this.listener.events.fireEvent(new MediaItemPlaced(item, hitPoint!, normal!));
            this.setMediaType(MediaType.NONE);
        }
    }
}



export const AppState = new _AppState();