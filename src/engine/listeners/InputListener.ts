import { MediaType } from "src/engine/listeners/events/Media";
import { GameModes } from "src/engine/listeners/events/Modes";
import { GameControllerInstance } from "../GameController";

declare const Map: any;

export class InputListener {
    public events: typeof Map = new Map();
    public input = Input.instance;
    constructor(public gameController: GameControllerInstance){
        this.subscribe();
    }
    subscribe(){

        this.input.subscribe("BUTTON_DOWN", ActionButton.ACTION_3, false, (e) => {
            log("Subscribed to View Mode [Button 1]", e)
            if(this.gameController.state.mode === GameModes.EDIT){
                this.gameController.state.setMode(GameModes.VIEW)
            }else{
                this.gameController.state.setMode(GameModes.EDIT)
            }
        });

        this.input.subscribe("BUTTON_DOWN", ActionButton.ACTION_4, false, (e) => {
            log("Subscribed to Media Mode [Button 2]", e)
            if(this.gameController.state.mode !== GameModes.PLACEMENT){
                this.gameController.state.setMode(GameModes.PLACEMENT)
            }
            if(this.gameController.state.mediaType === MediaType.NONE){
                this.gameController.state.setMediaType(MediaType.VIDEO);
            }else if(this.gameController.state.mediaType === MediaType.VIDEO){
                this.gameController.state.setMediaType(MediaType.IMAGE);
            }else if(this.gameController.state.mediaType === MediaType.IMAGE){
                this.gameController.state.setMediaType(MediaType.NFT);
            }else if(this.gameController.state.mediaType === MediaType.NFT){
                this.gameController.state.setMediaType(MediaType.LINK);
            }else if(this.gameController.state.mediaType === MediaType.LINK){
                this.gameController.state.setMediaType(MediaType.TEXT);
            }else if(this.gameController.state.mediaType === MediaType.TEXT){
                this.gameController.state.setMode(GameModes.EDIT)
            }
        });

    }
    log(...args: any[]){
        this.log(`[ InputListener ]`, ...args);
    }
    
}