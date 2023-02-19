import { CastleTiles } from "../tiles/castle"
// import { VoxelManager_Instance } from "./manager"
// import { VoxelManager } from "./manager"
import { VoxelSelector } from "./selector"
import { getNeighborPathSet } from "./utils"

declare const Map:any
declare const Set:any

const grass = new GLTFShape('models/mstyle/grass.glb')
const dirt = new GLTFShape('models/mstyle/dirt.glb')

export class Voxel {
    public active: boolean = false
    private entity: Entity | null | undefined
    private _transform: Transform = new Transform()
    private _shape: GLTFShape | null | undefined
    private _tileSetId: number | null
    private _neighbors: typeof Set
  
    constructor(
      public x:number,
      public y:number,
      public z:number
    ){
      this.position = new Vector3(x,y,z)
      this._tileSetId = null
      this._neighbors = getNeighborPathSet(x,y,z)
    }
  
    public show(){
      if(!this.entity) this.entity = new Entity()
      if(!this.entity.isAddedToEngine()) engine.addEntity(this.entity)
      this.entity.addComponentOrReplace(this._transform)
      this.entity.addComponent(new OnPointerDown(this.onClick.bind(this)))
      this.entity.addComponent(new OnPointerHoverEnter(this.onHoverEnter.bind(this)))
      this.entity.addComponent(new OnPointerHoverExit(this.onHoverExit.bind(this)))
      this.entity.addComponent(new BoxShape())
      this.updateNeighbors()
      this.updateSelf()
      this.active = true
    }
  
    public hide(){
      VoxelSelector.position = new Vector3(0,0,0)
      if(this.entity){
        if(this.entity.hasComponent(OnPointerDown)) this.entity.removeComponent(OnPointerDown)
        if(this.entity.hasComponent(OnPointerHoverEnter)) this.entity.removeComponent(OnPointerHoverEnter)
        if(this.entity.hasComponent(OnPointerHoverExit)) this.entity.removeComponent(OnPointerHoverExit)
        if(this.entity.hasComponent(GLTFShape)) this.entity.removeComponent(GLTFShape)
        if(this.entity.hasComponent(BoxShape)) this.entity.removeComponent(BoxShape)
      }
      this.updateNeighbors()
      this.active = false
    }
  
    public updateSelf(){
      // if()
      // this.entity?.addComponentOrReplace(new GLTFShape(modelSrc))
    }
  
    public updateNeighbors(){
    //   const neighbors: Voxel[] = []
    //   this._neighbors.forEach((path:string) => {
    //     const voxel = VoxelManager.getActiveFromPath(path)
    //     if(voxel){ neighbors.push(voxel) }
    //   })
    //   log(neighbors.length)
    }
  
    public set position(position: Vector3){
      this._transform.position.set(
        Math.round(position.x)+.5,
        Math.round(position.y)+.5,
        Math.round(position.z)+.5,
      )
    }
  
    public set tileId(id: number | null){ this._tileSetId = id }
    public get tileId(){ return this._tileSetId }
  
    public set shape(shape: GLTFShape | null){
      // this._shape = shape
      // if(!shape) {
      //   this.entity.removeComponent(GLTFShape)
      //   vs.position = new Vector3(0,0,0)
      // }else{
      //   this.entity.addComponentOrReplace(shape)
      // }
    }
  
    onClick(event: InputEventResult){
      // log(event.hit?.meshName)
    }
  
    onHoverEnter(){
      VoxelSelector.position = this._transform.position
    }
  
    onHoverExit(){
      // vs.position = new Vector3(0,0,0)
    }
}