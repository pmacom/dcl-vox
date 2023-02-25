import { GameControllerInstance } from "../GameController";
import { ButtonType, OnButtonClickEvent } from "../listeners/events/Buttons";
import { spriteSheet } from "./textures/commonUI"

export class SaveButton {
    image: UIImage 
    constructor(gameController: GameControllerInstance, parent: UIShape){
        this.image = new UIImage(parent, spriteSheet);
        this.image.sourceLeft = 36;
        this.image.sourceTop = 826;
        this.image.sourceWidth = 99;
        this.image.sourceHeight = 35;
        this.image.positionX = -134
        this.image.positionY = 68
        const scale = 0.6
        this.image.width = 99 * scale;
        this.image.height = 35 * scale;
        this.image.onClick = new OnPointerDown(() => {
            gameController.listener.events.fireEvent(
                new OnButtonClickEvent(ButtonType.SAVE, gameController.state.holdingMediaItem!)
            );
        });
    }
}

export class DeleteButton {
    image: UIImage 
    constructor(gameController: GameControllerInstance, parent: UIShape){
        this.image = new UIImage(parent, spriteSheet);
        this.image.sourceLeft = 146;
        this.image.sourceTop = 826;
        this.image.sourceWidth = 99;
        this.image.sourceHeight = 35;
        this.image.positionX = 135
        this.image.positionY = 68
        const scale = 0.6
        this.image.width = 99 * scale;
        this.image.height = 35 * scale;
        this.image.onClick = new OnPointerDown(() => {
            gameController.listener.events.fireEvent(
                new OnButtonClickEvent(ButtonType.DELETE, gameController.state.holdingMediaItem!)
            );
        });
    }
}

export class CancelButton {
    image: UIImage 
    constructor(gameController: GameControllerInstance, parent: UIShape){
        this.image = new UIImage(parent, spriteSheet);
        this.image.sourceLeft = 257;
        this.image.sourceTop = 826;
        this.image.sourceWidth = 99;
        this.image.sourceHeight = 35;
        this.image.positionX = -66
        this.image.positionY = 68
        const scale = 0.6
        this.image.width = 99 * scale;
        this.image.height = 35 * scale;
        this.image.onClick = new OnPointerDown(() => {
            gameController.listener.events.fireEvent(
                new OnButtonClickEvent(ButtonType.CANCEL, gameController.state.holdingMediaItem!)
            );
        });
    }
}