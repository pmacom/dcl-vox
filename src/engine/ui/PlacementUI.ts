import { Dash_GlobalCanvas } from "dcldash";
import { MediaItemChanged, MediaType } from "../listeners/events/Media";
import { GameModes, ModeChanged } from "../listeners/events/Modes";
import { spriteSheet } from "./textures/commonUI";
import { GameControllerInstance } from "../GameController";

declare const Map: any;

export class PlacementUI {
    bg: UIImage
    buttons: typeof Map = new Map();

    constructor(public gameController: GameControllerInstance) {

        const width = 350 - 25;
        const totalBoxes = 5;
        const spacing = 10;
        const boxWidth = this.calculateBoxWidth(width, totalBoxes, spacing);

        this.bg = new UIImage(Dash_GlobalCanvas, spriteSheet);
        this.bg.hAlign = "right";
        this.bg.vAlign = "bottom";
        this.bg.sourceWidth = 1024;
        this.bg.sourceHeight = 146;
        this.bg.sourceLeft = 0;
        this.bg.sourceTop = 512;
        this.bg.width = 350;
        this.bg.height = 40;
        this.bg.positionY = 0;
        this.bg.opacity = 0.75;

        /**
         * Placement items
         */

        this.addButton({
            bg: this.bg,
            key: "text",
            label: "Text",
            color: Color4.White(),
            width: boxWidth,
            height: 20,
            positionX: this.calculateBoxPositionY(0, totalBoxes, boxWidth),
            positionY: 0,
            callback: () => {
                if (this.gameController.state.mediaType !== MediaType.TEXT) {
                    this.gameController.state.setMediaType(MediaType.TEXT);
                } else {
                    this.gameController.state.setMediaType(MediaType.NONE)
                }
            },
        })

        this.addButton({
            bg: this.bg,
            key: "link",
            label: "Link",
            color: Color4.White(),
            width: boxWidth,
            height: 20,
            positionX: this.calculateBoxPositionY(1, totalBoxes, boxWidth),
            positionY: 0,
            callback: () => this.gameController.state.mediaType !== MediaType.LINK ? (
                this.gameController.state.setMediaType(MediaType.LINK)
            ) : (
                this.gameController.state.setMediaType(MediaType.NONE)
            ),
        })

        this.addButton({
            bg: this.bg,
            key: "nft",
            label: "NFT",
            color: Color4.White(),
            width: boxWidth,
            height: 20,
            positionX: this.calculateBoxPositionY(2, totalBoxes, boxWidth),
            positionY: 0,
            callback: () => this.gameController.state.mediaType !== MediaType.NFT ? (
                this.gameController.state.setMediaType(MediaType.NFT)
            ) : (
                this.gameController.state.setMediaType(MediaType.NONE)
            ),
        })

        this.addButton({
            bg: this.bg,
            key: "image",
            label: "Image",
            color: Color4.White(),
            width: boxWidth,
            height: 20,
            positionX: this.calculateBoxPositionY(3, totalBoxes, boxWidth),
            positionY: 0,
            callback: () => {
                this.gameController.state.mediaType !== MediaType.IMAGE ? (
                    this.gameController.state.setMediaType(MediaType.IMAGE)
                ) : (
                    this.gameController.state.setMediaType(MediaType.NONE)
                )
            },
        })

        this.addButton({
            bg: this.bg,
            key: "video",
            label: "Video",
            color: Color4.White(),
            width: boxWidth,
            height: 20,
            positionX: this.calculateBoxPositionY(4, totalBoxes, boxWidth),
            positionY: 0,
            callback: () => this.gameController.state.mediaType !== MediaType.VIDEO ? (
                this.gameController.state.setMediaType(MediaType.VIDEO)
            ) : (
                this.gameController.state.setMediaType(MediaType.NONE)
            ),
        })

        // this.gameController.listener.addListener<ModeChanged>(
        //     "mode-changed",
        //     ModeChanged,
        //     ({ mode }) => {
        //         if (mode !== GameModes.PLACEMENT && mode !== GameModes.PLACEMENT_EXISTING) {
        //             this.bg.visible = false;
        //             this.bg.isPointerBlocker = false;
        //         } else {
        //             this.bg.visible = true;
        //             this.bg.isPointerBlocker = true;
        //             // if(this.gameController.appState.mediaType === MediaType.NONE){
        //             //     this.gameController.appState.setMediaType(MediaType.VIDEO);
        //             // }
        //         }
        //         this.renderMode()
        //     },
        // );

        // this.gameController.listener.addListener<MediaItemChanged>(
        //     "placement-item-changed",
        //     MediaItemChanged,
        //     ({ mediaType }) => {
        //         this.log(`placement-item-changed`, mediaType)
        //         this.renderMode();
        //     },
        // );


        this.renderMode();

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
            if(this.gameController.state.mode !== GameModes.PLACEMENT_EXISTING){
                config.callback();
            }
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
    calculateBoxWidth(totalWidth: number, numOfBoxes: number, spacer: number) {
        const totalSpacerWidth = (numOfBoxes - 1) * spacer;
        const totalBoxWidth = totalWidth - totalSpacerWidth;
        const boxWidth = totalBoxWidth / numOfBoxes;
        return boxWidth;
    }
    calculateBoxPositionY(index: number, totalBoxes: number, boxWidth: number) {
        const rowCenter = (totalBoxes * boxWidth) / 2;
        const firstBoxPositionX = rowCenter - (boxWidth / 2) * (totalBoxes - 1);
        const boxPositionX = firstBoxPositionX + index * boxWidth;
        const distanceFromCenter = rowCenter - boxPositionX;
        const positionX = distanceFromCenter;
        return positionX;
    }
    renderMode() {
        const showMediaOptions = this.gameController.state.mode === GameModes.PLACEMENT || this.gameController.state.mode === GameModes.PLACEMENT_EXISTING

        if (!showMediaOptions) {
            this.bg.visible = false;
            this.bg.isPointerBlocker = false;
        } else {
            this.bg.visible = true;
            this.bg.isPointerBlocker = true;
        }

        const nft = this.buttons.get("nft");
        if (nft) {
            nft.button.isPointerBlocker = showMediaOptions;
            nft.button.visible = showMediaOptions;
            nft.text.visible = showMediaOptions;
            nft.button.opacity = this.gameController.state.mediaType === MediaType.NFT ? 1 : 0;
        }

        const video = this.buttons.get("video");
        if (video) {
            video.button.isPointerBlocker = showMediaOptions;
            video.button.visible = showMediaOptions;
            video.text.visible = showMediaOptions;
            video.button.opacity = this.gameController.state.mediaType === MediaType.VIDEO ? 1 : 0;
        }

        const image = this.buttons.get("image");
        if (image) {
            image.button.isPointerBlocker = showMediaOptions;
            image.button.visible = showMediaOptions;
            image.text.visible = showMediaOptions;
            image.button.opacity = this.gameController.state.mediaType === MediaType.IMAGE ? 1 : 0;
        }

        const link = this.buttons.get("link");
        if (link) {
            link.button.isPointerBlocker = showMediaOptions;
            link.button.visible = showMediaOptions;
            link.text.visible = showMediaOptions;
            link.button.opacity = this.gameController.state.mediaType === MediaType.LINK ? 1 : 0;
        }

        const text = this.buttons.get("text");
        if (text) {
            text.button.isPointerBlocker = showMediaOptions;
            text.button.visible = showMediaOptions;
            text.text.visible = showMediaOptions;
            text.button.opacity = this.gameController.state.mediaType === MediaType.TEXT ? 1 : 0;
        }
    }
    log(...args:any[]){
        log(`[ PlacementUI ]`,...args);
    }
}