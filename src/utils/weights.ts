// import { Voxel } from "src/vox/manager";

// declare const Set:any;
// declare const Map:any;
// class VoxelEventManager {
//     private callbacks: typeof Map = new Map()

//     constructor(){

//     }

//     listen(voxel: Voxel, callback: (voxel: Voxel)=>void){
//         if(!this.callbacks.has(voxel)) this.callbacks.set(voxel, new Set())
//         this.callbacks.get(voxel).add(callback)
//     }

//     emit(voxel: Voxel, payload: any){
//         if(this.callbacks.has(voxel)) this.callbacks.get(voxel).forEach((callback: (voxel: Voxel)=>void)=>{
//             callback(payload)
//         })
//     }
 

// }