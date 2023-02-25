import { GameModes, ModeChanged } from "../listeners/events/Modes";
import { MediaItemPickedUp, MediaItemPlaced, MediaType, MediaItemChanged, MediaItemEditedInPlace } from "../listeners/events/Media";
import { MediaPlacementTool } from "../entities/helpers/MediaPlacementTool";
import { HoldableMediaEntity } from "../entities/media/HoldableMediaEntity";
import { GameControllerInstance } from "../GameController";

export class State {

    mode: GameModes = GameModes.VIEW;
    mediaType: MediaType = MediaType.NONE;
    holding: boolean = false;
    editingInPlace: boolean = false;
    selectedMediaEntity: HoldableMediaEntity | undefined;
    holdingMediaItem: HoldableMediaEntity | undefined;
    holdingMediaPlacementTool: MediaPlacementTool | undefined;
    selectedSettings: any = {};

    constructor(public gameController: GameControllerInstance ) {}

    isView() { return this.mode === GameModes.VIEW; }
    isEdit() { return this.mode === GameModes.EDIT; }
    isPlacement() { return this.mode === GameModes.PLACEMENT; }
    isPlacementExisting() { return this.mode === GameModes.PLACEMENT_EXISTING; }
    isHoldingMedia() { return this.mode === GameModes.PLACEMENT_EXISTING && this.holding; }
    isHoldingPlacementTool() { return this.mode === GameModes.PLACEMENT && this.holdingMediaPlacementTool !== undefined }

    public setMode(mode: GameModes) {
        this.mode = mode;
        this.gameController.listener.events.fireEvent(new ModeChanged(this.mode));
    }

    public setMediaType(mediaType: MediaType) {
        this.log("setMediaType", mediaType)
        this.mediaType = mediaType;
        this.gameController.listener.events.fireEvent(new MediaItemChanged(this.mediaType));
    }
    
    public setSelectedSetting(key: string, value: any){
        this.selectedSettings[key] = value;
    }

    public pickOrPlaceMediaItem(item: HoldableMediaEntity, holding: boolean, hitPoint?: Vector3, normal?: Vector3){
        this.holding = holding;
        if(holding){
            if(item.mediaType !== this.mediaType){
                this.setMediaType(item.mediaType);
            }
            this.holdingMediaItem = item;
            this.gameController.listener.events.fireEvent(new MediaItemPickedUp(item));
        }else{
            this.holdingMediaItem = undefined;
            this.gameController.listener.events.fireEvent(new MediaItemPlaced(item, hitPoint!, normal!));
            if(this.mediaType !== MediaType.NONE) this.setMediaType(MediaType.NONE);
        }
        this.editingInPlace = false;
    }
    
    public placeNewMediaItem(item: MediaPlacementTool, holding: boolean, hitPoint?: Vector3, normal?: Vector3){
        this.holdingMediaItem = undefined;
        this.gameController.listener.events.fireEvent(new MediaItemPlaced(item, hitPoint!, normal!));
        if(this.mediaType !== MediaType.NONE) this.setMediaType(MediaType.NONE);
        this.editingInPlace = false;
    }
    
    public saveEditInPlace(item: HoldableMediaEntity){
        this.holdingMediaItem = undefined;
        this.gameController.listener.events.fireEvent(new MediaItemEditedInPlace(item));
        if(this.mediaType !== MediaType.NONE) this.setMediaType(MediaType.NONE);
        this.setMode(GameModes.EDIT);
        this.holding = false;
        this.holdingMediaItem = undefined;
        this.editingInPlace = false;
    }

    log(...args: any[]) {
        log(`[ AppState ]`, ...args)
    }
}