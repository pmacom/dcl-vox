import { getUserData } from "@decentraland/Identity";
import { AppState } from "src/state/AppState";
import { MediaItemPickedUp, MediaItemPlaced } from "src/state/events/Placements";



// @Component("IsHoldable")
// export class IsHoldable {
//   avatarId!: string
  
// }



export class HoldableMediaEntity extends Entity {
    avatarId!: string;
    media: Entity = new Entity()

    constructor(public defaultTf: TransformConstructorArgs) {
        super()
        this.addComponent(new Transform())
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
        // normal = new Vector3(normal.x, normal.y, normal.y);
        if(this.hasComponent(AttachToAvatar)){
            this.removeComponent(AttachToAvatar);
        }

        this.getComponentOrCreate(Transform).position = new Vector3()
        this.media.getComponentOrCreate(Transform).position = hitPoint


        const { x, y, z } = hitPoint
 
        const targetPosition = new Vector3(x,y,z).addInPlace(normal)
        this.media.getComponentOrCreate(Transform).lookAt(targetPosition)
        this.media.getComponentOrCreate(Transform).rotate(Vector3.Up(), 180)
        
        // log(this.media.getComponent(Transform).position, hitPoint, normal)

        // const transform = this.media.getComponentOrCreate(Transform)
        // const inch = Vector3.Lerp(Vector3.Zero(), normal.negate(), .1)
        

       
        

        log({ hitPoint })
        // const { x, y, z } = hitPoint
        // this.getComponentOrCreate(Transform).position.setAll(0)
        // this.getComponentOrCreate(Transform).rotation.setEuler(0,0,0)
        // transform.position.set(x,y,z)
        // transform.rotation.setEuler(0,0,0)
        // const direction = Vector3.Add(transform.position, normal.negate())
        // transform.lookAt(direction.addInPlace(inch))

        // transform.rotation.setFromToRotation(new Vector3(x,y,z), direction.addInPlace(inch))
        // this.media.addComponentOrReplace(transform);
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
