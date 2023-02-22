import { getUserData } from "@decentraland/Identity";
import { AppState } from "src/state/AppState";
import { GameModes, ModeChanged } from "src/state/events/Modes";
import { MediaType } from "src/state/events/Media";

export class HoldableMediaEntity extends Entity {
    avatarId!: string;
    media: Entity = new Entity()

    constructor(public id: string | undefined, public source: string, public mediaType: MediaType, public defaultTf: TransformConstructorArgs) {
        super()
        this.addComponent(new Transform())
        this.media.addComponent(new Transform(defaultTf));
        this.media.setParent(this);
        executeTask(async () => {
            this.avatarId = (await getUserData())?.userId!;
        })
        AppState.listener.addListener<ModeChanged>(
            "mode-changed",
            ModeChanged,
            ({ mode }) => {
                switch (mode) {
                    case GameModes.VIEW: {
                        this.bindViewMode()
                    } break;
                    case GameModes.EDIT: {
                        this.bindEditMode()
                    } break;
                    case GameModes.PLACEMENT: {
                        this.bindPlacementMode()
                    } break;
                }
            },
        );
    }
    setSource(source: string) {
        this.source = source;
    }
    setMediaType(mediaType: MediaType) {
        this.mediaType = mediaType;
    }
    setId(id: string) {
        this.id = id;
    }
    bindViewMode() {
        this.media.addComponentOrReplace(new OnPointerDown(this.pickUp.bind(this), {
            button: ActionButton.ANY,
            hoverText: 'View NFT'
        }))
    }
    bindEditMode() {
        this.media.addComponentOrReplace(new OnPointerDown(this.pickUp.bind(this), {
            button: ActionButton.ANY,
            hoverText: '(E) Pick Up'
        }))
    }
    bindPlacementMode() {
        this.media.addComponentOrReplace(new OnPointerDown(this.pickUp.bind(this), {
            button: ActionButton.ANY,
            hoverText: '(E) Pick Up\n(F) Change Metadata'
        }))
    }
    pickUp() {
        AppState.pickOrPlaceMediaItem(this, true);
        if (AppState.mode !== GameModes.PLACEMENT) {
            AppState.setMode(GameModes.PLACEMENT);
        }
        this.media.addComponentOrReplace(new Transform({
            position: new Vector3(0.5, -0.5, 1)
        }));

        this.addComponentOrReplace(
            new AttachToAvatar({
                avatarId: this.avatarId,
                anchorPointId: AttachToAvatarAnchorPointId.NameTag,
            })
        )
    }
    getPlacedTransform(hitPoint: Vector3, normal: Vector3) {
        if (this.hasComponent(AttachToAvatar)) {
            this.removeComponent(AttachToAvatar);
        }
        // this.getComponentOrCreate(Transform).position = new Vector3();
        // const inch = Vector3.Lerp(Vector3.Zero(), normal, .1);
        // const { x, y, z } = hitPoint
        // this.media.getComponentOrCreate(Transform).position = new Vector3(x, y, z).add(inch);
        // const targetPosition = new Vector3(x, y, z).add(normal)
        // this.media.getComponentOrCreate(Transform).lookAt(targetPosition)
        // this.media.getComponentOrCreate(Transform).rotate(Vector3.Up(), 180)
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
        if (this.hasComponent(AttachToAvatar)) {
            this.removeComponent(AttachToAvatar);
        }
        this.media.addComponentOrReplace(new Transform(this.defaultTf));
    }
    remove(){
        if(this.isAddedToEngine()) engine.removeEntity(this);
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
}