// import { VoxelManager } from "./manager"

// class VoxelSelector_Instance {
//     private entity: Entity = new Entity()
//     private _transform: Transform = new Transform()
//     private _shape: GLTFShape
  
//     constructor(){
//       engine.addEntity(this.entity)
//       this._shape = new GLTFShape('models/voxel_selector.glb')
//       this.entity.addComponent(this._shape)
//       this.entity.addComponent(this._transform)
//       this.entity.addComponent(new OnPointerDown(this.onEvent.bind(this), {
//         button: ActionButton.ANY,
//         hoverText: '(E) Add\n(F) Remove'
//       }))
//     }
  
//     public set position(position: Vector3){
//       this._transform.position = position
//     }
  
//     onEvent(event: InputEventResult){
//       switch(event.buttonId){
//           case 0:
//           case 1:
//             this.onAdd(event)
//             break;
//           case 2:
//             this.onDelete(event)
//             break;
//       }
//     }
  
//     onAdd(event: InputEventResult){
//       const { x, y, z } = this._transform.position
//       const _x = x-.5
//       const _y = y-.5
//       const _z = z-.5
  
//       switch(event.hit?.meshName){
//         case 'Above':
//           VoxelManager.add(_x, _y+1, _z)
//           break;
//         case 'Below':
//           VoxelManager.add(_x, _y-1, _z)
//           break;
//         case 'North':
//           VoxelManager.add(_x, _y, _z-1)
//           break;
//         case 'East':
//           VoxelManager.add(_x-1, _y, _z)
//           break;
//         case 'South':
//           VoxelManager.add(_x, _y, _z+1)
//           break;
//         case 'West':
//           VoxelManager.add(_x+1, _y, _z)
//           break;
//       }
//     }
  
//     onDelete(event: InputEventResult){
//       const { x, y, z } = this._transform.position
//       const _x = x-.5
//       const _y = y-.5
//       const _z = z-.5
//       VoxelManager.delete(_x, _y, _z)
//     }
//   }

// export const VoxelSelector = new VoxelSelector_Instance()