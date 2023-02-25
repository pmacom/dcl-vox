import { VoxelManager, VoxelSelector } from "src/vox/manager";
import { GameClient } from "./client/GameClient";
import { settingsToObject } from "./entities/helpers/MediaDefaultSettings";
import { EventListener } from "./listeners/EventListener";
import { MediaItemChanged, MediaItemEditedInPlace, MediaItemPickedUp, MediaItemPlaced, MediaItemRemoved, MediaType } from "./listeners/events/Media";
import { GameModes, ModeChanged } from "./listeners/events/Modes";
import { InputListener } from "./listeners/InputListener";
import { MediaManager } from "./managers/MediaManager";
import { State } from "./state/State";
import { MetadataUI } from "./ui/MetadataUI";
import { PlacementUI } from "./ui/PlacementUI";
import { VoxelUI } from "./ui/VoxelUI";

/***
 * A Controller to manage the game engine
 */
export class GameControllerInstance {
    //Client
    client: GameClient;
    //State
    state: State;
    //Managers
    mediaManager: MediaManager;
    voxelManager: VoxelManager;
    //Listeners
    listener: EventListener;
    inputListener: InputListener;
    //Entities
    voxelSelector: VoxelSelector;
    //UI
    voxelUI: VoxelUI;
    placementUI: PlacementUI;
    metadataUI: MetadataUI;
    constructor() {
        this.client = new GameClient(this);
        this.state = new State(this);
        this.listener = new EventListener(this);
        this.inputListener = new InputListener(this);
        this.mediaManager = new MediaManager(this);
        this.voxelSelector = new VoxelSelector(this);
        this.voxelManager = new VoxelManager(this);
        this.voxelUI = new VoxelUI(this);
        this.placementUI = new PlacementUI(this);
        this.metadataUI = new MetadataUI(this);
        this.events();
    }
    events() {
        this.listener.addListener<ModeChanged>(
            "mode-changed",
            ModeChanged,
            ({ mode }) => {
                this.log(`🌟 Mode changed ${GameModes[mode]} 🌟`)
                switch (mode) {
                    case GameModes.PLACEMENT:
                        if(!this.state.isHoldingPlacementTool() && this.state.mediaType !== MediaType.NONE){
                            // this.mediaManager.placementTool.pickUp();
                            // const settings = settingsToObject(this.state.mediaType);
                            // Object.keys(settings).forEach(key => {
                            //     if (this.state.selectedSettings[key]) {
                            //         settings[key] = this.state.selectedSettings[key];
                            //     }
                            // })
                            // this.mediaManager.placementTool.setMedia(MediaType.VIDEO, settings);
                            // this.placementUI.renderMode()
                            // this.state.setMediaType(MediaType.VIDEO);
                        }else if(this.state.mediaType === MediaType.NONE){
                            this.mediaManager.placementTool.setMedia(MediaType.NONE, {});
                            this.placementUI.renderMode()
                        }
                        break;
                    case GameModes.PLACEMENT_EXISTING:
                        // if(this.appState.holdingMediaItem){
                        //     this.metadataUI.loadMetadata(this.appState.mediaType, this.appState.holdingMediaItem.settings);
                        // }
                        break;
                    case GameModes.PLACEMENT:
                    case GameModes.PLACEMENT_EXISTING:
                        this.placementUI.bg.visible = true;
                        this.placementUI.bg.isPointerBlocker = true;
                        break;
                    case GameModes.EDIT:
                    case GameModes.VIEW:
                        this.metadataUI.rect.visible = false;
                        this.metadataUI.rect.isPointerBlocker = false;
                        this.placementUI.bg.visible = false;
                        this.placementUI.bg.isPointerBlocker = false;
                        if(this.state.mediaType !== MediaType.NONE){
                            this.state.setMediaType(MediaType.NONE);
                        }
                        if(this.mediaManager.placementTool.holding){
                            this.mediaManager.placementTool.putDownRevert();
                            this.mediaManager.placementTool.remove();
                        }
                        this.state.holdingMediaPlacementTool = undefined;
                        break;
                }
                this.placementUI.renderMode()
                this.voxelUI.renderMode();

            }
        );

        this.listener.addListener<MediaItemPickedUp>(
            "media-item-picked-up",
            MediaItemPickedUp,
            ({ item }) => {
                this.mediaManager.log("media-item-picked-up", {
                    item
                })
                this.state.selectedSettings = item.settings;
                this.metadataUI.loadMetadata(this.state.mediaType, this.state.selectedSettings);
            },
        );

        this.listener.addListener<MediaItemPlaced>(
            "media-item-placed",
            MediaItemPlaced,
            ({ item, hitPoint, normal }) => {
                this.mediaManager.log("media-item-placed")
                const transform = item.getPlacedTransform(hitPoint, normal);
                this.mediaManager.log({ pos: transform.position, rot: transform.rotation.eulerAngles, type: item.mediaType })
                this.mediaManager.add(item.id, item.mediaType, item.settings, transform);
                item.remove();
                // this.state.setMode(GameModes.EDIT);
            },
        );

        //MediaPlacementTool
        this.listener.addListener<MediaItemChanged>(
            "placement-item-changed",
            MediaItemChanged,
            ({ mediaType }) => {
                this.log(`placement-item-changed`,{
                    stateType: this.state.mediaType,
                    toolType: this.mediaManager.placementTool.mediaType,
                })
                if(this.state.mode === GameModes.PLACEMENT){
                    if (mediaType === MediaType.NONE) {
                        this.metadataUI.rect.visible = false
                        this.metadataUI.rect.isPointerBlocker = false;
                        this.mediaManager.placementTool.putDownRevert();
                        this.mediaManager.placementTool.remove();
                        this.state.holdingMediaPlacementTool = undefined;
                        this.mediaManager.placementTool.setMedia(mediaType, {});
                    } else {
                        this.metadataUI.rect.visible = true;
                        this.metadataUI.rect.isPointerBlocker = true;

                        if(!this.state.isHoldingPlacementTool()){
                            this.mediaManager.placementTool.pickUp()
                            this.mediaManager.placementTool.add()
                            // this.state.setMediaType(this.mediaManager.placementTool.mediaType);
                        }

                        const settings = settingsToObject(mediaType);
                        Object.keys(settings).forEach(key => {
                            if (this.state.selectedSettings[key]) {
                                settings[key] = this.state.selectedSettings[key];
                            }
                        })
                        // if (this.gameController.appState.holdingMediaItem) {
                        //     this.gameController.appState.holdingMediaItem.setSettings(settings);
                        // }
                        this.mediaManager.placementTool.setMedia(mediaType, settings);
                        this.metadataUI.loadMetadata(mediaType, this.mediaManager.placementTool.settings);
                    }
                }else if (this.state.mode === GameModes.PLACEMENT_EXISTING){
                    if(this.state.isHoldingPlacementTool()){
                        this.mediaManager.placementTool.putDownRevert();
                        this.mediaManager.placementTool.remove();
                        this.mediaManager.placementTool.setMedia(MediaType.NONE, {});
                    }
                    if(mediaType === MediaType.NONE){
                        this.metadataUI.rect.visible = false;
                        this.metadataUI.rect.isPointerBlocker = false;
                    }else{
                        // this.metadataUI.rect.visible = true;
                        // this.metadataUI.rect.isPointerBlocker = true;
                        // const settings = settingsToObject(mediaType);
                        // Object.keys(settings).forEach(key => {
                        //     if (this.appState.selectedSettings[key]) {
                        //         settings[key] = this.appState.selectedSettings[key];
                        //     }
                        // })
                    }

                }
                this.placementUI.renderMode();
                this.voxelUI.renderMode();
            },
        );
        this.listener.addListener<MediaItemRemoved>(
            "media-item-removed",
            MediaItemRemoved,
            ({ item }) => {
                this.mediaManager.delete(item.mediaType, item.id);
                this.state.setMode(GameModes.EDIT)
            }
        )
        this.listener.addListener<MediaItemEditedInPlace>(
            "media-item-edited-in-place",
            MediaItemEditedInPlace,
            ({ item }) => {
                this.mediaManager.add(item.id, item.mediaType, item.settings, item.media.getComponent(Transform));
                this.state.setMode(GameModes.EDIT)
            }
        )
    }
    debugger(prefix: string){
        const logs: any[] = [
            `mode: ${this.state.mode}`,
            `mediaType: ${this.state.mediaType}`,
            `isEdit: ${this.state.isEdit()}`,
            `isView: ${this.state.isView()}`,
            `isPlacement: ${this.state.isPlacement()}`,
            `isHoldingPlacementTool: ${this.state.isHoldingPlacementTool()}`,
            `isHoldingMedia: ${this.state.isHoldingMedia()}`,
        ];
        logs.forEach(lg => log(`[ Debugger ] [${prefix}]`,lg));
    }
    log(...args: any[]){
        log(`[ GameController ]`,...args);
    }
}

export const GameController = new GameControllerInstance();