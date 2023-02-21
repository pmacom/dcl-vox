import { client } from "./client/ColyseusClient"
import { Image } from "./media/Image";
import { NFT } from "./media/NFT";
import { Video } from "./media/Video";
import { VoxelManager } from "./vox/manager"
import { MediaManager } from "./media/Manager";

client.setConfig({
    mediaManager: MediaManager,
    voxelManager: VoxelManager,
    endpoint: "ws://localhost:4249",
    // endpoint: "wss://dcl-voxel-api.herokuapp.com",
    sceneOwner: "0xd689478d44A438798EE0DC07657CcE2135c0AeF7",
    baseParcel: "-150,-150",
    nickname: "default",
    roomName: "update",
    debug: true,
});
VoxelManager.set(8, 0, 8, 0)


// const mediaNFT = new NFT(undefined,`ethereum://0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b/2055`,{
//     position: new Vector3(8,3,8),
//     scale: new Vector3(2,2,2),
// })
// const mediaImage = new Image(undefined,`https://metazoo-blob.nyc3.digitaloceanspaces.com/97_SCHEDULE_343822f45e.jpeg?updated_at=2023-02-10T23:46:55.235Z`,{
//     position: new Vector3(8,3,7),
//     scale: new Vector3(2,2,2),
// })
// const mediaVideo = new Video(undefined,`https://metazoo-blob.nyc3.digitaloceanspaces.com/tunnel_flicker_loop_e2754f3871.mp4?updated_at=2023-01-16T07:07:37.706Z`,{
//     position: new Vector3(8,3,6),
//     scale: new Vector3(2,2,2),
// })