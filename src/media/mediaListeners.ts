import { AppState } from "src/state/AppState";
import { MediaItemPickedUp, MediaItemPlaced } from "src/state/events/Media";
import { GameModes } from "src/state/events/Modes";
import { MediaManager } from "./Manager";

export function initMediaListeners() {
    AppState.listener.addListener<MediaItemPickedUp>(
        "media-item-picked-up",
        MediaItemPickedUp,
        ({ item }) => {
            log("media-item-picked-up", {
                item
            })
        },
    );

    AppState.listener.addListener<MediaItemPlaced>(
        "media-item-placed",
        MediaItemPlaced,
        ({ item, hitPoint, normal }) => {
            log("media-item-placed", {
                item, hitPoint, normal
            })
            const transform = item.getPlacedTransform(hitPoint, normal);
            log({ pos: transform.position, rot: transform.rotation.eulerAngles })
            MediaManager.add(item.id, item.mediaType, item.source, transform);
            item.remove();
            AppState.setMode(GameModes.PLACEMENT);
            AppState.setMode(GameModes.EDIT);
        },
    );
}
