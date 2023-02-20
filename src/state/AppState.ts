import { HoldableMediaEntity } from "src/media/HoldableMediaEntity";
import { EventListener } from "./events/listener";
import { GameModes, ModeChanged } from "./events/Modes";
import { GamePlacementItem, MediaItemPickedUp, MediaItemPlaced, PlacementItemChanged } from "./events/Placements";

export class _AppState {
    mode: GameModes = GameModes.VIEW;
    placementItem: GamePlacementItem = GamePlacementItem.NFT;
    holding: boolean = false;
    holdingMediaItem: HoldableMediaEntity | undefined;
    listener = new EventListener(this);
    constructor() {}
    isView() { return this.mode === GameModes.VIEW; }
    isEdit() { return this.mode === GameModes.EDIT; }
    isPlacement() { return this.mode === GameModes.PLACEMENT; }
    isHolding() { return this.mode === GameModes.PLACEMENT; }

    public setMode(mode: GameModes) {
        this.mode = mode;
        this.listener.events.fireEvent(new ModeChanged(this.mode));
    }

    public setPlacementItem(placementItem: GamePlacementItem) {
        this.placementItem = placementItem;
        this.listener.events.fireEvent(new PlacementItemChanged(this.placementItem));
    }
    
    public pickOrPlaceMediaItem(item: HoldableMediaEntity, holding: boolean, hitPoint?: Vector3, normal?: Vector3){
        this.holding = holding;
        log({ holding, hitPoint, normal })
        if(holding){
            this.holdingMediaItem = item;
            this.listener.events.fireEvent(new MediaItemPickedUp(item, this.placementItem, "0"));
        }else{
            this.holdingMediaItem = undefined;
            this.listener.events.fireEvent(new MediaItemPlaced(item, this.placementItem, "0", hitPoint!, normal!));
        }
    }
}



export const AppState = new _AppState();