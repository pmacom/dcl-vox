import { getUserData } from "@decentraland/Identity";
import { AppState } from "src/state/AppState";
import { MediaItemPickedUp, MediaItemPlaced } from "src/state/events/Placements";

export class HoldableMediaEntity extends Entity {
    avatarId!: string;
    media: Entity = new Entity()

    constructor(public defaultTf: TransformConstructorArgs) {
        super()
        this.media.addComponent(new Transform(defaultTf));
        this.media.addComponent(new OnPointerDown(this.pickUp.bind(this), {
            button: ActionButton.ANY,
            hoverText: '(E) Pick Up\n(F) Change Metadata'
        }))
        this.media.setParent(this);
        executeTask(async () => {
            this.avatarId = (await getUserData())?.userId!;
        })
    }
    pickUp() {
        AppState.pickOrPlaceMediaItem(this, true);
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
    placeItem(hitPoint: Vector3, normal: Vector3) {
        normal = new Vector3(normal.x, normal.y, normal.y);
        if(this.hasComponent(AttachToAvatar)){
            this.removeComponent(AttachToAvatar);
        }
        log(this.media.getComponent(Transform).position, hitPoint, normal)

        this.addComponentOrReplace(new Transform())
        const tf = new Transform({
            ...this.defaultTf,
            position: hitPoint,
            rotation: Quaternion.Euler(0, 0, 0)
        })
        tf.lookAt(Vector3.Add(hitPoint, normal.negate()));
        this.media.addComponentOrReplace(tf);
    }
}

AppState.listener.addListener<MediaItemPickedUp>(
    "media-item-picked-up",
    MediaItemPickedUp,
    ({ item, placementItem, id }) => {
        log("media-item-picked-up", {
            item, placementItem, id
        })
    },
);

AppState.listener.addListener<MediaItemPlaced>(
    "media-item-placed",
    MediaItemPlaced,
    ({ item, placementItem, id, hitPoint, normal }) => {
        log("media-item-placed", {
            item, placementItem, id, hitPoint, normal
        })
        item.placeItem(hitPoint, normal);
    },
);
