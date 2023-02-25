import { GameController } from "./engine/GameController";
import { API_ENDPOINTS } from "./utils/types";

executeTask(async () => {
    GameController.client.setConfig({
        endpoint: API_ENDPOINTS.PROD,
        sceneOwner: "0xd689478d44A438798EE0DC07657CcE2135c0AeF7", //Add your eth addy
        nickname: "default", //Default scene name that loads on first load
        debug: true,
    });
});

GameController.voxelManager.set(8, 0, 8, 0);