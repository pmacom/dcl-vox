///<reference lib="es2015.symbol" />
///<reference lib="es2015.symbol.wellknown" />
///<reference lib="es2015.collection" />
///<reference lib="es2015.iterable" />

import { Client, Room } from "colyseus.js";
import { getCurrentRealm } from "@decentraland/EnvironmentAPI";
import { getUserData } from "@decentraland/Identity";
import { Dash_Wait } from "dcldash";
import { makeid } from "zootools";
import { VoxelManager_Instance } from "src/vox/manager";
import { VoxelUI } from "./VoxelUI";

export class ColyseusClient {
    endpoint: string = `wss://dcl-voxel-api.herokuapp.com`;
    options?: any;
    client!: Client;
    room?: Room;
    attempts: number = 0;
    connecting: boolean = false;
    onRoomConnectedCbs: ((room: Room) => void)[] = [];
    voxelManager!: VoxelManager_Instance;
    voxelUI = new VoxelUI(this);
    constructor() { }

    onRoomConnected(cb: (room: Room) => void) {
        this.onRoomConnectedCbs.push(cb);
        this.options.debug && this.log(`onRoomConnected Callback was set`)
    }

    setConfig(
        config: {
            voxelManager: VoxelManager_Instance, 
            endpoint: string, 
            sceneOwner: string, 
            baseParcel: string, 
            nickname: string, 
            roomName: string, 
            debug?: boolean,
        }
    ) {
        if(config.debug == undefined) config.debug = true;
        this.voxelManager = config.voxelManager;
        this.endpoint = config.endpoint;
        this.client = new Client(this.endpoint);
        this.options = {};
        this.options.baseParcel = config.baseParcel;
        this.options.nickname = config.nickname;
        this.options.roomName = config.roomName;
        this.options.sceneOwner = config.sceneOwner;
        this.options.debug = config.debug;
        this.options.debug && this.log(`Config was set`)
        return this.connect(this.options);
    }

    async connect(options: any & {
        nickname: string;
        roomName: string;
        debug?: boolean;
    } = this.options): Promise<Room | null> {

        if (options.debug == undefined) this.options.debug = false;
        else this.options.debug = options.undefined;

        //An ID for debugging connection instances
        const id = makeid(5);

        //Record attempts. In case of disconnect we will use this to time the reconnection attempt
        this.attempts++;
        if (this.attempts > 15) this.attempts = 15;
        this.options.debug && this.log(`Attempting connection to server id:${id} (attempts: ${this.attempts})`)

        //Populate user and options
        options.realm = await getCurrentRealm();
        options.userData = await getUserData();
        options.timezone = new Date().toString();

        //Ensure avatars are pointed to content servers
        const regex = /^https?:\/\/[^\/]+\.[^\/]+\/content\/contents\/[a-zA-Z0-9]+$/;
        const snapshots = options?.userData?.avatar?.snapshots;
        Object.keys(snapshots).forEach(key => {
            const snapshot = snapshots[key];
            if (!regex.test(snapshot)) {
                delete options.userData.avatar.snapshots[key];
            }
        });

        this.options = options;
        const handleReconnection = () => {
            Dash_Wait(() => this.connect(options), this.attempts);
        }

        try {
            this.room = await this.client.joinOrCreate<any>(options.roomName, options);
            if (this.room) {
                this.log("YUHH")
                this.onRoomConnectedCbs.forEach(cb => cb(this.room!));
                this.onConnected(id);
                this.room.onStateChange((state) => {
                    this.log(`STATE CHANGE`, state)
                    this.voxelUI.setSceneId(state.scene.id);
                    this.voxelUI.setVoxelCount(state.voxels.size);
                    this.voxelUI.setSceneName(state.scene.nickname);
                    // for (const [voxelId, voxel] of state.voxels.entries()) {
                    //     this.voxelManager.set(voxel.x, voxel.y, voxel.z, voxel.tileSetId);
                    // }
                });
                this.room.onMessage("notification", (msg: any) => {
                    const { message } = msg;
                    this.voxelUI.notification(message);
                });
                this.room.onMessage("sync-voxels", (message: any) => {
                    message.voxels.forEach((voxel: any) => {
                        this.voxelManager.set(voxel.x, voxel.y, voxel.z, voxel.tileSetId, true);
                    })
                    this.voxelManager.renderAll()
                });
                this.room.onMessage("add-voxel", (message) => {
                    const { x, y, z, tileSetId } = message;
                    this.voxelManager.set(x, y, z, tileSetId);
                });
                this.room.onMessage("remove-voxel", (message) => {
                    const { x, y, z } = message;
                    this.voxelManager.set(x, y, z, null);
                });
                this.room.onMessage("reset-scene", (message) => {
                    for(const [key, vox] of this.voxelManager._voxels.entries()){
                        if(!(vox.x === 8 && vox.y === 0 && vox.z === 8)){
                            this.voxelManager.set(vox.x, vox.y, vox.z, null);
                        }
                    }
                });
                this.room.onLeave((code) => {
                    this.options.debug && this.log(`Left, id:${id} code =>`, code);
                    this.onDisconnect(id, handleReconnection);
                });
                this.room.onError((code) => {
                    this.options.debug && this.log(`Error, id:${id} code =>`, code);
                });
            }
            return this.room;
        } catch (e: any) {
            this.onDisconnect(id, handleReconnection);
            return null;
        }
    }

    onConnected(id: string) {
        this.options.debug && this.log(`Connected to socket server (id:${id})`);
        this.attempts = 0;
    }

    onDisconnect(id: string, reconnect: () => void) {
        this.options.debug && this.log(`Disconnected from socket server (id:${id})`);
        reconnect();
    }

    log(...args: any[]) {
        log(`[ Colyseus ]`, ...args)
    }
}

export const client = new ColyseusClient();