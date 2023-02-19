import { colyseus } from "./client/ColyseusClient"
import { VoxelManager } from "./vox/manager"

// import * as Zootools from "zootools"

colyseus.setConfig(VoxelManager,"ws://localhost:4249", "0,0", "dcl-vox-test", "update");

VoxelManager.set(8,0,8,0)