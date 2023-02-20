import { client } from "./client/ColyseusClient"
import { NFT } from "./media/NFT";
import { VoxelManager } from "./vox/manager"

client.setConfig({
    voxelManager: VoxelManager,
    endpoint: "wss://dcl-voxel-api.herokuapp.com", // "wss://dcl-voxel-api.herokuapp.com/"
    sceneOwner: "0xd689478d44A438798EE0DC07657CcE2135c0AeF7",
    baseParcel: "-150,-150",
    nickname: "default",
    roomName: "update",
    debug: true,
});
VoxelManager.set(8, 0, 8, 0)
new NFT({
    position: new Vector3(8,3,8),
    scale: new Vector3(2,2,2),
})