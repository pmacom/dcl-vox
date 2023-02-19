import { colyseus } from "./client/ColyseusClient"
import { VoxelManager } from "./vox/manager"

// colyseus.setConfig(VoxelManager,"wss://dcl-voxel-api.herokuapp.com/", "0,0", "dcl-vox-test", "update");
colyseus.setConfig({
    voxelManager: VoxelManager,
    endpoint: "ws://localhost:4249", 
    sceneOwner: "0xd689478d44A438798EE0DC07657CcE2135c0AeF7",
    baseParcel: "0,0", 
    nickname: "dcl-vox-test", 
    roomName: "update",
    debug: true,
});
VoxelManager.set(8,0,8,0)