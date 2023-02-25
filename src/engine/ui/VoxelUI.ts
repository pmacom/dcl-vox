import { Dash_GlobalCanvas } from "dcldash";
import { spriteSheet } from "./textures/commonUI";
import { GameModes, ModeChanged } from "src/engine/listeners/events/Modes";
import { MediaItemChanged, MediaType } from "src/engine/listeners/events/Media";
import { GameControllerInstance } from "../GameController";

declare const Map: any;

export class VoxelUI {
    rect: UIContainerRect;
    bg: UIImage;
    logo: UIImage;
    sceneNameInput: UIInputText;
    sceneId: UIText;
    voxels: UIText;
    media: UIText;
    notify: UIText;
    //modes
    viewMode: UIImage;
    editMode: UIImage;
    placementMode: UIImage;
    buttons: typeof Map = new Map();

    constructor(public gameController: GameControllerInstance) {

        this.rect = new UIContainerRect(Dash_GlobalCanvas)
        this.rect.width = 350;
        this.rect.height = 110;
        this.rect.hAlign = "right";
        this.rect.vAlign = "top";
        this.rect.positionX = 0

        this.bg = new UIImage(this.rect, spriteSheet);
        this.bg.sourceWidth = 1024;
        this.bg.sourceHeight = 512;
        this.bg.sourceLeft = 0;
        this.bg.sourceTop = 0;
        this.bg.width = 350;
        this.bg.height = 110;
        this.bg.opacity = 0.75;


        this.logo = new UIImage(this.rect, spriteSheet);
        const color: "black" | "white" = "white";
        this.logo.sourceWidth = 282;
        this.logo.sourceHeight = 46;
        this.logo.sourceLeft = 1098;
        this.logo.sourceTop = color === "white" ? 50 : 110;
        this.logo.width = 282 / 3;
        this.logo.height = 46 / 3;
        this.logo.positionX = -105;
        this.logo.positionY = 33;

        this.sceneId = new UIText(this.bg);
        this.sceneId.width = 250;
        this.sceneId.height = 30;
        this.sceneId.positionX = 110;
        this.sceneId.positionY = 50;
        this.sceneId.fontSize = 8;
        this.setSceneId(``)

        this.voxels = new UIText(this.bg);
        this.voxels.width = 250;
        this.voxels.height = 30;
        this.voxels.positionX = 110;
        this.voxels.positionY = 41;
        this.voxels.fontSize = 7;
        this.setVoxelCount(0);

        this.media = new UIText(this.bg);
        this.media.width = 250;
        this.media.height = 30;
        this.media.positionX = 170;
        this.media.positionY = 41;
        this.media.fontSize = 7;
        this.setMediaCount(0);

        this.notify = new UIText(this.bg);
        this.notify.width = 350;
        this.notify.height = 40;
        this.notify.positionY = -60;
        this.notify.fontSize = 10;
        this.notify.textWrapping = true;
        this.notify.hTextAlign = "center";
        this.notify.vTextAlign = "center";
        this.notification(`Welcome to DCLVox, LFG to the moon!`)

        /**
         * Set the scene name
         * or create a new scene with the name
         */

        this.sceneNameInput = new UIInputText(this.bg);
        this.sceneNameInput.width = 125;
        this.sceneNameInput.height = 30;
        this.sceneNameInput.positionX = -90;
        this.sceneNameInput.positionY = 5.5;
        this.sceneNameInput.vTextAlign = "center";
        this.sceneNameInput.paddingLeft = 7;
        this.sceneNameInput.paddingRight = 7;
        this.sceneNameInput.placeholder = "My new scene"
        this.setSceneName(``);

        const sceneNameLabel = new UIText(this.bg);
        sceneNameLabel.width = 250;
        sceneNameLabel.height = 30;
        sceneNameLabel.value = "Scene Name"
        sceneNameLabel.color = Color4.FromHexString("#CCCCCCFF")
        sceneNameLabel.positionX = -21;
        sceneNameLabel.positionY = 26;
        sceneNameLabel.fontSize = 5;


        this.addButton({
            key: "button",
            label: "Load",
            color: Color4.Teal(),
            width: 90,
            height: 30,
            positionX: 22,
            positionY: 5,
            callback: () => {
                log("LOAD", this.sceneNameInput.value)
                this.gameController.client?.room?.send("load-scene-name", {
                    sceneName: this.sceneNameInput.value,
                })
            },
        })

        this.addButton({
            key: "button",
            label: "New",
            color: Color4.Green(),
            width: 90,
            height: 30,
            positionX: 115,
            positionY: 5,
            callback: () => {
                log("NEW", this.sceneNameInput.value)
                this.gameController.client?.room?.send("create-new-scene", {
                    sceneName: this.sceneNameInput.value,
                })
            },
        })

        const modeLabel = new UIText(this.bg);
        modeLabel.width = 250;
        modeLabel.height = 30;
        modeLabel.value = "Select Mode:"
        modeLabel.positionX = -27;
        modeLabel.positionY = -23;
        modeLabel.fontSize = 10;

        this.viewMode = this.addButton({
            key: "view",
            label: "View",
            color: Color4.Green(),
            width: 60,
            height: 20,
            positionX: -50,
            positionY: -33,
            callback: () => this.gameController.state.setMode(GameModes.VIEW),
        });

        this.editMode = this.addButton({
            key: "edit",
            label: "Edit",
            color: Color4.Red(),
            width: 60,
            height: 20,
            positionX: 20,
            positionY: -33,
            callback: () => this.gameController.state.setMode(GameModes.EDIT),
        });

        this.placementMode = this.addButton({
            key: "placement",
            label: "Placement",
            color: Color4.Yellow(),
            width: 80,
            height: 20,
            positionX: 100,
            positionY: -33,
            callback: () => this.gameController.state.setMode(GameModes.PLACEMENT),
        });

        this.gameController.state.setMode(GameModes.VIEW);
        this.gameController.state.setMediaType(MediaType.NONE);
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
        const button = new UIImage(this.bg, spriteSheet);
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

        const text = new UIText(this.bg);
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
    setSceneId(text: string) {
        this.sceneId.value = `id: ${text}`
    }
    setVoxelCount(text: number) {
        this.voxels.value = `Voxels: ${text}`
    }
    setMediaCount(text: number) {
        this.media.value = `Media: ${text}`
    }
    setSceneName(text: string) {
        this.sceneNameInput.placeholder = text
    }
    notification(text: string) {
        this.notify.value = text
    }
    renderMode() {
        switch (this.gameController.state.mode) {
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
            case GameModes.PLACEMENT_EXISTING:
            case GameModes.PLACEMENT: {
                this.buttons.get("view").button.opacity = 0;
                this.buttons.get("edit").button.opacity = 0;
                this.buttons.get("placement").button.opacity = 1;
            } break;
        }
    }
}