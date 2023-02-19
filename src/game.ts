import { colyseus } from "./client/ColyseusClient"
import { VoxelManager } from "./vox/manager"

colyseus.setConfig({
    voxelManager: VoxelManager,
    endpoint: "wss://dcl-voxel-api.herokuapp.com", // "wss://dcl-voxel-api.herokuapp.com/"
    sceneOwner: "0xd689478d44A438798EE0DC07657CcE2135c0AeF7",
    baseParcel: "-150,-150", 
    nickname: "default", 
    roomName: "update",
    debug: true,
});
VoxelManager.set(8,0,8,0)