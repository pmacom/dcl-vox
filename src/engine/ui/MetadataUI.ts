import { Dash_GlobalCanvas } from "dcldash";
import { MediaDefaultSettings, settingsToObject } from "src/engine/entities/helpers/MediaDefaultSettings";
import { MediaType } from "src/engine/listeners/events/Media";
import { GameModes, ModeChanged } from "src/engine/listeners/events/Modes";
import { GameControllerInstance } from "../GameController";
import { CancelButton, DeleteButton, SaveButton } from "./UIButtons";
import { spriteSheet } from "./textures/commonUI";

declare const Map: any;

export interface IMetadataSettings {
    key: string;
    value: any;
}
export class MetadataUI {
    rect: UIContainerRect;
    bg: UIImage;
    save: SaveButton;
    cancel: CancelButton;
    delete: DeleteButton;
    settings: typeof Map = new Map();
    buttons: typeof Map = new Map();
    inputs: typeof Map = new Map();
    width = 350 - 10;
    height = 110 - 15;
    totalBoxes = 3;
    spacing = 10;

    constructor(public gameController: GameControllerInstance) {
        this.rect = new UIContainerRect(Dash_GlobalCanvas)
        this.rect.width = 350;
        this.rect.height = 110;
        this.rect.hAlign = "right";
        this.rect.vAlign = "bottom";
        this.rect.positionX = 0;
        this.rect.positionY = 40;
        this.rect.visible = false;
        this.rect.isPointerBlocker = false;

        this.bg = new UIImage(this.rect, spriteSheet);
        this.bg.sourceWidth = 1024;
        this.bg.sourceHeight = 512;
        this.bg.sourceLeft = 0;
        this.bg.sourceTop = 0;
        this.bg.width = 350;
        this.bg.height = 110;
        this.bg.opacity = 0.75;
        
        this.save = new SaveButton(this.gameController, this.rect)
        this.cancel = new CancelButton(this.gameController, this.rect)
        this.delete = new DeleteButton(this.gameController, this.rect)
        
        this.gameController.listener.addListener<ModeChanged>(
            "mode-changed",
            ModeChanged,
            ({ mode }) => {
                switch(mode){
                    case GameModes.PLACEMENT_EXISTING: {
                        const editing = this.gameController.state.editingInPlace;
                        this.save.image.visible = editing;
                        this.cancel.image.visible = editing;
                        this.delete.image.visible = editing;
                        this.save.image.isPointerBlocker = editing;
                        this.cancel.image.isPointerBlocker = editing;
                        this.delete.image.isPointerBlocker = editing;
                    } break;
                    default: {
                        this.save.image.visible = false;
                        this.cancel.image.visible = false;
                        this.delete.image.visible = false;
                        this.save.image.isPointerBlocker = false;
                        this.cancel.image.isPointerBlocker = false;
                        this.delete.image.isPointerBlocker = false;
                    } break;
                }
            }
        )
        // The bounding box of the inputs
        // const innerRect = new UIContainerRect(this.bg);
        // innerRect.width = 310; 
        // innerRect.height = this.height;
        // innerRect.hAlign = "center";
        // innerRect.vAlign = "center";
        // innerRect.positionX = 0
        // innerRect.positionY = 0
        // innerRect.color = Color4.Yellow()

    }
    /**
     * Re-Load metadata inputs into the ui rect
     * @param mediaType 
     * @param settings 
     * @returns 
     */
    loadMetadata(mediaType: MediaType, settings?: any) {
        this.log("Load Metadata", mediaType, settings, this.gameController.state.isHoldingMedia(), this.gameController.state.isHoldingPlacementTool())
        //Clean up entries
        for (const [key, input] of this.inputs.entries() as [key: string, input: UIInputText][]) {
            input.visible = false;
            input.isPointerBlocker = false;
            this.inputs.delete(key);
        }
        if (mediaType === MediaType.NONE) {
            this.rect.visible = false;
            this.rect.isPointerBlocker = false;
            return;
        } else {
            this.rect.visible = true;
            this.rect.isPointerBlocker = true;
        }
        if (!settings) settings = settingsToObject(mediaType);
        this.log(`Settings`, settings)
        const keys = Object.keys(settings);
        const l = keys.length;
        let numColumns = 1;
        if (l >= 2 && l <= 3) {
            numColumns = 2;
        } else if (l >= 4 && l <= 5) {
            numColumns = 3;
        } else if (l >= 6 && l <= 7) {
            numColumns = 4;
        } else if (l >= 8) {
            numColumns = 5;
        }
        const layout = this.calculateLayout(l, numColumns)
        const DEFAULT_SETTINGS = MediaDefaultSettings[mediaType].settings;
        keys.forEach((key, index) => {
            const setting = DEFAULT_SETTINGS.filter((x: any) => x.key === key)[0]; //for label
            const { width, height, positionX, positionY } = layout[index];2
            if (setting) {
                this.addInput({
                    bg: this.bg,
                    key,
                    mediaType,
                    label: setting.label,
                    color: Color4.White(),
                    width: width!,
                    height: height!,
                    positionX: positionX!,
                    positionY: positionY!,
                    placeholder: settings[key],
                })
            }
        });
    }

    addInput(
        config: {
            bg: UIImage,
            mediaType: MediaType,
            key: string;
            label: string;
            color: Color4,
            positionX: number;
            positionY: number;
            width: number;
            height: number;
            placeholder: string;
        }
    ) {
        const value = this.gameController.state.selectedSettings[config.key];
        const input = new UIInputText(config.bg);
        input.positionX = config.positionX;
        input.positionY = config.positionY;
        input.width = config.width;
        input.height = config.height;
        input.visible = true;
        input.vTextAlign = "center";
        input.paddingLeft = 7;
        input.paddingRight = 7;
        input.placeholder = config.placeholder;
        input.textWrapping = true;
        input.fontSize = 5
        input.value = value !== false ? value : config.placeholder;
        input.onChange(((_key, newVal, oldVal) => {
            if (_key === "value") {
                //TODO add a debouncer for typing
                this.log(`Onchange ${config.key}`, _key, newVal, oldVal)
                this.gameController.state.setSelectedSetting(config.key, newVal);
                const settings = settingsToObject(config.mediaType);
                Object.keys(settings).forEach(key => {
                    if (this.gameController.state.selectedSettings[key]) {
                        settings[key] = this.gameController.state.selectedSettings[key];
                    }
                })
                if (this.gameController.state.holdingMediaItem) {
                    this.gameController.state.holdingMediaItem.setSettings(settings);
                }
                this.gameController.mediaManager.placementTool.setMedia(config.mediaType, settings);
            }
            return input;
        }))
        const text = new UIText(input);
        text.width = config.width;
        text.height = config.height;
        text.value = config.label;
        text.positionX = 0;
        text.positionY = 0;
        text.fontSize = 6
        text.hTextAlign = "left";
        text.vTextAlign = "top";
        text.paddingTop = 3
        text.paddingLeft = 7
        text.isPointerBlocker = false;
        text.color = Color4.FromHexString("#CCCCCCFF")
        text.outlineWidth = 0.1;

        this.inputs.set(config.key, input)
        return input;
    }

    calculateLayout = (numItems: number, numColumns: number): {
        width: number,
        height: number,
        positionX: number,
        positionY: number
    }[] => {
        const result: {
            width: number,
            height: number,
            positionX: number,
            positionY: number
        }[] = [];

        let itemWidth, itemHeight, outerSpacing = 10;
        if (numItems === 1) {
            itemWidth = this.width - this.spacing * 3.5;
            itemHeight = (this.height - this.spacing * (Math.ceil(numItems / numColumns) + 1)) / Math.ceil(numItems / numColumns);
        } else if (numItems === 2) {
            numColumns = 1;
            itemWidth = this.width - this.spacing * 3.5;
            itemHeight = (this.height - this.spacing * (Math.ceil(numItems / numColumns) + 1)) / Math.ceil(numItems / numColumns);
        } else {
            const maxNumColumns = 5;
            numColumns = Math.min(numColumns, maxNumColumns);
            itemWidth = (this.width - this.spacing * (numColumns + 2.5)) / numColumns;
            itemHeight = (this.height - this.spacing * (Math.ceil(numItems / numColumns) + 1)) / Math.ceil(numItems / numColumns);
            outerSpacing = (this.width - numColumns * itemWidth - this.spacing * (numColumns - 1)) / 2;
        }

        const numRows = Math.ceil(numItems / numColumns);
        for (let i = 0; i < numItems; i++) {
            const colIndex = i % numColumns;
            const rowIndex = Math.floor(i / numColumns);
            const reversedRowIndex = numRows - 1 - rowIndex;
            const adj = numColumns > 1 ? this.spacing : 0;
            const positionX = outerSpacing + (colIndex + 1) * this.spacing + colIndex * itemWidth - this.width / 2 + itemWidth / 2 - adj;
            const positionY = (reversedRowIndex + 1) * this.spacing + reversedRowIndex * itemHeight - this.height / 2 + itemHeight / 2;

            result.push({ width: itemWidth, height: itemHeight, positionX, positionY });
        }

        return result;
    }

    addButton(
        config: {
            bg: UIImage,
            key: string;
            label: string;
            color: Color4,
            positionX: number;
            positionY: number;
            width: number;
            height: number;
            callback: () => void;
        }
    ) {
        const button = new UIImage(config.bg, spriteSheet);
        button.sourceWidth = 524;
        button.sourceHeight = 215;
        button.sourceLeft = 1024;
        button.sourceTop = 512; //black = 512, white = 731
        button.positionX = config.positionX;
        button.positionY = config.positionY;
        button.width = config.width;
        button.height = config.height;
        button.isPointerBlocker = true;
        button.visible = true;
        button.onClick = new OnPointerDown(() => {
            config.callback();
        })

        const text = new UIText(config.bg);
        text.width = config.width;
        text.height = config.height;
        text.value = config.label;
        text.positionX = config.positionX;
        text.positionY = config.positionY;
        text.hTextAlign = "center";
        text.vTextAlign = "center";
        text.isPointerBlocker = false;
        text.color = config.color;
        text.outlineColor = Color4.Black();
        text.outlineWidth = 0.1;

        this.buttons.set(config.key, {
            button,
            text,
        })
        return button;
    }
    log(...args: any[]) {
        log(`[ MetadataUI ]`, ...args)
    }
}