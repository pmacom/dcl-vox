import { Dash_GlobalCanvas, Dash_Wait } from "dcldash";
import { GameModes, ModeChanged } from "src/state/events/Modes";
import { GamePlacementItem, PlacementItemChanged } from "src/state/events/Placements";
import { AppState } from "../state/AppState";
import { ColyseusClient } from "./ColyseusClient";

declare const Map: any;
const bgTxt = new Texture("images/corner-ui.png");
const btnTxt = new Texture("images/ui-button.png");

export class VoxelUI {
    rect: UIContainerRect;
    bg: UIImage;
    sceneNameInput: UIInputText;
    sceneId: UIText;
    voxels: UIText;
    notify: UIText;

    //modes
    viewMode: UIImage;
    editMode: UIImage;
    placementMode: UIImage;
    buttons: typeof Map = new Map();

    constructor(public client: ColyseusClient) {

        this.rect = new UIContainerRect(Dash_GlobalCanvas)
        this.rect.width = 350;
        this.rect.height = 175;
        this.rect.hAlign = "right";
        this.rect.vAlign = "top";
        this.rect.positionX = 0

        this.bg = new UIImage(this.rect, bgTxt);
        this.bg.sourceWidth = 1000;
        this.bg.sourceHeight = 500;
        this.bg.sourceLeft = 0;
        this.bg.sourceTop = 0;
        // this.bg.width = 1000;
        // this.bg.width = 500;
        this.bg.width = 350;
        this.bg.height = 175;
        this.bg.opacity = 0.3;

        this.sceneId = new UIText(this.bg);
        this.sceneId.width = 250;
        this.sceneId.height = 30;
        this.sceneId.positionX = 110;
        this.sceneId.positionY = 75;
        this.sceneId.fontSize = 10;
        this.setSceneId(``)

        this.voxels = new UIText(this.bg);
        this.voxels.width = 250;
        this.voxels.height = 30;
        this.voxels.positionX = 110;
        this.voxels.positionY = 60;
        this.voxels.fontSize = 10;
        this.setVoxelCount(0);

        this.notify = new UIText(this.bg);
        this.notify.width = 350;
        this.notify.height = 40;
        this.notify.positionY = -90;
        this.notify.fontSize = 10;
        this.notify.textWrapping = true;
        this.notify.hTextAlign = "center";
        this.notify.vTextAlign = "center";
        this.notification(`Welcome to DCLVox, LFG to the moon!`)

        /**
         * Set the scene name
         * or create a new scene with the name
         */
        const sceneNameLabel = new UIText(this.bg);
        sceneNameLabel.width = 250;
        sceneNameLabel.height = 30;
        sceneNameLabel.value = "Scene Name:"
        sceneNameLabel.positionX = -27;
        sceneNameLabel.positionY = 53;
        sceneNameLabel.fontSize = 10;

        this.sceneNameInput = new UIInputText(this.bg);
        this.sceneNameInput.width = 125;
        this.sceneNameInput.height = 30;
        this.sceneNameInput.positionX = -90;
        this.sceneNameInput.positionY = 20;
        this.sceneNameInput.vTextAlign = "center";
        this.sceneNameInput.paddingLeft = 10;
        this.sceneNameInput.paddingRight = 10;
        this.sceneNameInput.placeholder = "My new scene"
        this.setSceneName(``);

        this.addButton({
            key: "button",
            label: "Load",
            color: Color4.Green(),
            width: 80,
            height: 30,
            positionX: 25,
            positionY: 20,
            callback: () => {
                log("LOAD", this.sceneNameInput.value)
                this.client.room?.send("load-scene-name", {
                    sceneName: this.sceneNameInput.value,
                })
            },
        })

        this.addButton({
            key: "button",
            label: "New",
            color: Color4.Blue(),
            width: 80,
            height: 30,
            positionX: 115,
            positionY: 20,
            callback: () => {
                log("NEW", this.sceneNameInput.value)
                this.client.room?.send("create-new-scene", {
                    sceneName: this.sceneNameInput.value,
                })
            },
        })

        this.addButton({
            key: "nft",
            label: "NFT",
            color: Color4.Yellow(),
            width: 60,
            height: 25,
            positionX: -123,
            positionY: -25,
            callback: () => AppState.setPlacementItem(GamePlacementItem.NFT),
        })

        this.addButton({
            key: "image",
            label: "Image",
            color: Color4.Purple(),
            width: 60,
            height: 25,
            positionX: -55,
            positionY: -25,
            callback: () => AppState.setPlacementItem(GamePlacementItem.IMAGE),
        })

        this.addButton({
            key: "video",
            label: "Video",
            color: Color4.Red(),
            width: 60,
            height: 25,
            positionX: 15,
            positionY: -25,
            callback: () => AppState.setPlacementItem(GamePlacementItem.VIDEO),
        })


        const modeLabel = new UIText(this.bg);
        modeLabel.width = 250;
        modeLabel.height = 30;
        modeLabel.value = "Select Mode:"
        modeLabel.positionX = -27;
        modeLabel.positionY = -53;
        modeLabel.fontSize = 10;

        this.viewMode = this.addButton({
            key: "view",
            label: "View",
            color: Color4.Green(),
            width: 60,
            height: 25,
            positionX: -50,
            positionY: -60,
            callback: () => AppState.setMode(GameModes.VIEW),
        });

        this.editMode = this.addButton({
            key: "edit",
            label: "Edit",
            color: Color4.Red(),
            width: 60,
            height: 25,
            positionX: 20,
            positionY: -60,
            callback: () => AppState.setMode(GameModes.EDIT),
        });

        this.placementMode = this.addButton({
            key: "placement",
            label: "Placement",
            color: Color4.Yellow(),
            width: 80,
            height: 25,
            positionX: 100,
            positionY: -60,
            callback: () => AppState.setMode(GameModes.PLACEMENT),
        });

        AppState.listener.addListener<ModeChanged>(
            "mode-changed",
            ModeChanged,
            ({ mode }) => this.renderMode(),
        );

        AppState.listener.addListener<PlacementItemChanged>(
            "placement-item-changed",
            PlacementItemChanged,
            ({ placementItem }) => this.renderMode(),
        );

        AppState.setMode(GameModes.VIEW);
        AppState.setPlacementItem(GamePlacementItem.NFT);
    }
    addButton(
        config: {
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
        const button = new UIImage(this.bg, btnTxt);
        button.sourceWidth = 500;
        button.sourceHeight = 200;
        button.sourceLeft = 0;
        button.sourceTop = 0;
        button.positionX = config.positionX;
        button.positionY = config.positionY;
        button.width = config.width;
        button.height = config.height;
        button.isPointerBlocker = true;
        button.visible = true;
        button.onClick = new OnPointerDown(() => {
            config.callback();
        })

        const text = new UIText(this.bg);
        text.width = config.width;
        text.height = config.height;
        text.value = config.label;
        text.positionX = config.positionX;
        text.positionY = config.positionY;
        text.hTextAlign = "center";
        text.vTextAlign = "center";
        text.isPointerBlocker = false;
        text.outlineColor = config.color;
        text.outlineWidth = 0.3;

        this.buttons.set(config.key, {
            button,
            text,
        })
        return button;
    }
    setSceneId(text: string) {
        this.sceneId.value = `id: ${text}`
    }
    setVoxelCount(text: number) {
        this.voxels.value = `Voxels: ${text}`
    }
    setSceneName(text: string) {
        this.sceneNameInput.placeholder = text
    }
    notification(text: string) {
        this.notify.value = text
    }
    renderMode() {
        switch (AppState.mode) {
            case GameModes.VIEW: {
                this.buttons.get("view").button.opacity = 1;
                this.buttons.get("edit").button.opacity = 0;
                this.buttons.get("placement").button.opacity = 0;
            } break;
            case GameModes.EDIT: {
                this.buttons.get("view").button.opacity = 0;
                this.buttons.get("edit").button.opacity = 1;
                this.buttons.get("placement").button.opacity = 0;
            } break;
            case GameModes.PLACEMENT: {
                this.buttons.get("view").button.opacity = 0;
                this.buttons.get("edit").button.opacity = 0;
                this.buttons.get("placement").button.opacity = 1;
            } break;
        }
        const showPlacementItems = AppState.mode === GameModes.PLACEMENT
        const nft = this.buttons.get("nft");
        const image = this.buttons.get("image");
        const video = this.buttons.get("video");
        // log({ showPlacementItems, nft, image, video })

        nft.button.isPointerBlocker = showPlacementItems;
        nft.button.visible = showPlacementItems;
        nft.text.visible = showPlacementItems;
        nft.button.opacity = AppState.placementItem === GamePlacementItem.NFT ? 1 : 0;
        
        video.button.isPointerBlocker = showPlacementItems;
        video.button.visible = showPlacementItems;
        video.text.visible = showPlacementItems;
        video.button.opacity = AppState.placementItem === GamePlacementItem.VIDEO ? 1 : 0;
        
        image.button.isPointerBlocker = showPlacementItems;
        image.button.visible = showPlacementItems;
        image.text.visible = showPlacementItems;
        image.button.opacity = AppState.placementItem === GamePlacementItem.IMAGE ? 1 : 0;
    }
}