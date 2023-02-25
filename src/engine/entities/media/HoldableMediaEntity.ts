import { getUserData } from "@decentraland/Identity";
import { GameModes, ModeChanged } from "../../listeners/events/Modes";
import { MediaItemRemoved, MediaType } from "../../listeners/events/Media";
import { GameControllerInstance } from "src/engine/GameController";
import { ButtonType, OnButtonClickEvent } from "src/engine/listeners/events/Buttons";

@Component("mediaEntity")
export class MediaEntity { }

export class HoldableMediaEntity extends Entity {
    avatarId!: string;
    media: Entity = new Entity()
    cachedSettings: any = {};
    constructor(public gameController: GameControllerInstance, public id: string | undefined, public settings: any, public mediaType: MediaType, public defaultTf: TransformConstructorArgs) {
        super()
        this.addComponent(new Transform())
        this.addComponent(new MediaEntity())
        this.media.addComponent(new Transform(defaultTf));
        this.initClickEvents();
        this.media.setParent(this);

        executeTask(async () => {
            this.avatarId = (await getUserData())?.userId!;
        })
        this.gameController.listener.addListener<ModeChanged>(
            "mode-changed",
            ModeChanged,
            ({ mode }) => {
                let type: string = MediaType[this.mediaType];
                if(this.mediaType !== MediaType.NFT){
                    type = type.toLowerCase();
                    type[0].toUpperCase();
                }
                let viewText = this.mediaType === MediaType.NFT ? (
                    `View NFT Info`
                ) : this.mediaType === MediaType.LINK ? (
                    `${this.settings?.hoverText ?? `Click to view link`}`
                ) : (
                    `View Mode`
                )
                if(this.media.hasComponent(OnPointerDown)){
                    switch (mode) {
                        case GameModes.VIEW: { this.media.getComponent(OnPointerDown).hoverText = viewText; } break;
                        case GameModes.EDIT: {  this.media.getComponent(OnPointerDown).hoverText = `(E) Pick Up\n(F) Edit In Place`; } break;
                        case GameModes.PLACEMENT: {  this.media.getComponent(OnPointerDown).hoverText = `(E) Drop`; } break;
                        case GameModes.PLACEMENT_EXISTING: {  this.media.getComponent(OnPointerDown).hoverText = `(E) Drop`; } break;
                    }
                }
            },
        );
        this.gameController.listener.addListener<OnButtonClickEvent>(
            "button-click-event",
            OnButtonClickEvent,
            ({ buttonType, item }) => {
                if(item.id === this.id){
                    this.log({ buttonType })
                    switch(buttonType){
                        case ButtonType.SAVE: {
                            this.gameController.state.saveEditInPlace(this);
                        } break;
                        case ButtonType.CANCEL: {
                            this.setSettings(this.cachedSettings);
                            this.gameController.state.setMode(GameModes.EDIT)
                            this.gameController.state.setMediaType(MediaType.NONE)
                            this.gameController.state.holding = false;
                            this.gameController.state.holdingMediaItem = undefined;
                            this.gameController.state.editingInPlace = false;
                        } break;
                        case ButtonType.DELETE: {
                            this.gameController.listener.events.fireEvent(new MediaItemRemoved(this))
                            this.gameController.state.editingInPlace = false;
                        } break;
                    }
                }
            }
        )

    }
    initClickEvents(){
        let type: string = MediaType[this.mediaType];
        if(this.mediaType !== MediaType.NFT){
            type = type.toLowerCase();
            type[0].toUpperCase();
        }
        this.media.addComponentOrReplace(new OnPointerDown(this.handlePointerDown.bind(this), {
            hoverText: `(E) View ${type}`
        }))
        this.media.addComponentOrReplace(new OnPointerHoverEnter(this.handleHoverEnter.bind(this)))
        this.media.addComponentOrReplace(new OnPointerHoverExit(this.handleHoverExit.bind(this)))
    }
    handlePointerDown(event: any){
        this.log({ event, mode: this.gameController.state.mode })
        switch(this.gameController.state.mode){
            case GameModes.VIEW: {
                this.onClick(event);
            } break;
            case GameModes.EDIT: {
                switch(event.buttonId){
                    case 0: {
                        // this.log("ActionButton","click")
                        this.pickUp(event);
                    } break;
                    case 1: {
                        // this.log("ActionButton","E")
                        this.pickUp(event);
                    } break;
                    case 2: {
                        // this.log("ActionButton","F")
                        this.editInPlace();
                    } break;
                }
            } break;
            case GameModes.PLACEMENT: {
                this.placeOnTopNew(event);
            } break;
            case GameModes.PLACEMENT_EXISTING: {
                this.placeOnTopExisting(event);
            } break;
        }
    }
    handleHoverEnter(event: any){
        let type: string = MediaType[this.mediaType];
        if(this.mediaType !== MediaType.NFT){
            type = type.toLowerCase();
            type = type[0].toUpperCase() + type.substring(1, type.length);
        }
        this.gameController.state.selectedMediaEntity = this;
        let viewText = this.mediaType === MediaType.NFT ? (
            `View NFT Info`
        ) : this.mediaType === MediaType.LINK ? (
            `${this.settings?.hoverText ?? `Click to view link`}`
        ) : (
            `View Mode`
        )
        if(this.media.hasComponent(OnPointerDown)){
            switch(this.gameController.state.mode){
                case GameModes.VIEW: {
                    this.media.getComponent(OnPointerDown).hoverText = viewText;
                } break;
                case GameModes.EDIT: {
                    this.media.getComponent(OnPointerDown).hoverText = `(E) Pick Up \n(F) Edit In Place`;
                } break;
                case GameModes.PLACEMENT: {
                    this.media.getComponent(OnPointerDown).hoverText = `(E) Place Item`;
                } break;
                case GameModes.PLACEMENT_EXISTING: {
                    this.media.getComponent(OnPointerDown).hoverText = `(E) Place Item`;
                } break;
            }
        }
    }
    handleHoverExit(event: any){
        let type: string = MediaType[this.mediaType];
        if(this.mediaType !== MediaType.NFT){
            type = type.toLowerCase();
            type[0].toUpperCase();
        }
        if(this.gameController.state.mode !== GameModes.PLACEMENT){
            if(this.media.hasComponent(OnPointerDown)){
                this.media.getComponent(OnPointerDown).hoverText = `(E) View ${type}`;
            }
        }
    }
    setSettings(settings: any) {
        this.settings = settings;
    }
    setMediaType(mediaType: MediaType) {
        this.mediaType = mediaType;
    }
    setId(id: string) {
        this.id = id;
    }

    placeOnTopNew(event: any) {
        this.log("placeOnTopNew media entity")

        if (this.gameController.state.mode === GameModes.PLACEMENT) {
            if (event.hit) {
                if (this.gameController.state.isHoldingPlacementTool() && this.gameController.state.holdingMediaPlacementTool) {
                    this.gameController.state.placeNewMediaItem(this.gameController.state.holdingMediaPlacementTool!, false, event.hit.hitPoint as any, event.hit.normal as any);
                    this.gameController.state.holdingMediaPlacementTool = undefined;
                }
            }
        }
    }
    placeOnTopExisting(event: any) {
        this.log("placeOnTopExisting media entity")
        if (this.gameController.state.mode === GameModes.PLACEMENT_EXISTING) {
            if (event.hit) {
                if (this.gameController.state.isHoldingMedia() && this.gameController.state.holdingMediaItem) {
                    this.gameController.state.pickOrPlaceMediaItem(this.gameController.state.holdingMediaItem, false, event.hit.hitPoint as any, event.hit.normal as any);
                }
            }
        }
    }
    onClick(event: any) {
        log("onclick", this.mediaType)
        switch(this.mediaType){
            case MediaType.IMAGE: {} break;
            case MediaType.VIDEO: {} break;
            case MediaType.NFT: {
                openNFTDialog(`ethereum://${this.settings.contractAddress}/${this.settings.tokenId}`)
            } break;
            case MediaType.TEXT: {} break;
            case MediaType.LINK: {
                openExternalURL(this.settings.link);
            } break;
        }
    }
    editInPlace(){
        this.log("editInPlace media entity");
        this.cachedSettings = { ...this.settings };
        this.gameController.state.editingInPlace = true;
        if (this.gameController.state.mode !== GameModes.PLACEMENT_EXISTING) {
            this.gameController.state.setMode(GameModes.PLACEMENT_EXISTING);
        }
        if (this.gameController.state.mediaType !== this.mediaType) {
            this.gameController.state.setMediaType(this.mediaType);
        }
        this.gameController.metadataUI.loadMetadata(this.mediaType, this.settings);
        this.gameController.state.holding = true;
        this.gameController.state.holdingMediaItem = this;
    }
    pickUp(event: any) {
        this.log("pickUp media entity");
        if (this.gameController.state.mode !== GameModes.PLACEMENT_EXISTING) {
            this.gameController.state.setMode(GameModes.PLACEMENT_EXISTING);
        }
        if (this.gameController.state.mediaType !== this.mediaType) {
            this.gameController.state.setMediaType(this.mediaType);
        }
        this.gameController.state.holdingMediaItem = this;
        this.gameController.state.pickOrPlaceMediaItem(this, true);


        //     // this.log("SETTINGS", settings)
        //     if(this.gameController.appState.holdingMediaItem){
        //         this.log("HOLDING MEDIA ITEM")
        //         this.loadMetadata(mediaType, this.gameController.appState.holdingMediaItem.settings);
        //     }else if(this.gameController.appState.holdingMediaPlacementTool || this.gameController.appState.isMediaPlacementMode()){
        //         this.log("HOLDING PLACEMENT TOOL")
        //         this.loadMetadata(mediaType);
        //     }else if(false){
        //         // this.loadMetadata(MediaType.NONE)
        //     }else{
        //         this.loadMetadata(MediaType.NONE)

        //     }
        //     if (this.gameController.appState.isHolding()) {
        //     } else if (this.gameController.appState.isMediaPlacementMode()) {
        //         // this.loadMetadata(mediaType, this.gameController.appState.selectedSettings);
        //     }
        // },
        // }
        if (this.gameController.state.holdingMediaPlacementTool) {
            this.gameController.state.holdingMediaPlacementTool.putDownRevert();
            this.gameController.state.holdingMediaPlacementTool.remove();
            this.gameController.state.holdingMediaPlacementTool = undefined;
        }

        this.addComponentOrReplace(new Transform())
        this.media.addComponentOrReplace(new Transform({
            position: new Vector3(0.6, -0.5, 1)
        }));

        this.addComponentOrReplace(
            new AttachToAvatar({
                avatarId: this.avatarId,
                anchorPointId: AttachToAvatarAnchorPointId.NameTag,
            })
        )
    }
    getPlacedTransform(hitPoint: Vector3, normal: Vector3) {
        if (this.hasComponent(AttachToAvatar)) this.removeComponent(AttachToAvatar);
        this.getComponentOrCreate(Transform).position = new Vector3();
        const inch = Vector3.Lerp(Vector3.Zero(), normal, .025);
        const { x, y, z } = hitPoint
        const transform = this.media.getComponentOrCreate(Transform)
        transform.position = new Vector3(x, y, z).add(inch);
        const targetPosition = new Vector3(x, y, z).addInPlace(normal)
        transform.lookAt(targetPosition)
        transform.rotate(Vector3.Up(), 180)
        return transform;
    }
    putDownRevert() {
        this.log("putDownRevert")
        if (this.hasComponent(AttachToAvatar)) this.removeComponent(AttachToAvatar);
        this.media.addComponentOrReplace(new Transform(this.defaultTf));
    }
    remove() {
        this.log("remove")
        if (this.isAddedToEngine()) engine.removeEntity(this);
    }
    formatTransform(tf: Transform) {
        const {
            position: { x, y, z },
            scale: { x: sx, y: sy, z: sz },
            rotation,
        } = tf;
        const { x: rx, y: ry, z: rz } = rotation.eulerAngles;
        return { x, y, z, sx, sy, sz, rx, ry, rz }
    }
    log(...args: any[]) {
        log(`[ Holdable ]`, ...args);
    }
}