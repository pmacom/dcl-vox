import { HoldableMediaEntity } from "src/engine/entities/media/HoldableMediaEntity";

export enum ButtonType {
    CANCEL = "CANCEL",
    SAVE = "SAVE",
    DELETE = "DELETE",
}

@EventConstructor()
export class OnButtonClickEvent {
    constructor(public buttonType: ButtonType, public item: HoldableMediaEntity) { }
}
