
import { GameControllerInstance } from "src/engine/GameController"
import { GameModes, ModeChanged } from "src/engine/listeners/events/Modes"
import { CastleTiles } from "../tiles/castle"
import { TileData, TileStatus } from "../tiles/interfaces"
import { getNeighborPathSet, getNeighborPaths, getPath, getSurrounding, getWeight } from "./utils"


declare const Map:any
declare const Set:any

export class VoxelManager {
    public _voxels: typeof Map = new Map()
    public _neighbors: typeof Map = new Map()
    public _tileId: number = 0

    constructor(public gameController: GameControllerInstance){
      this.init()
    }
  
    private init(){
      for(let x=0; x<16; x++){
        for(let y=0; y<16; y++){
          for(let z=0; z<16; z++){
            const path = getPath(x,y,z)
            this._voxels.set(path, new Voxel(this.gameController, x, y, z))
          }
        }
      }
    }
  
    public set(x:number, y:number, z:number, id: number|null, preventRender: boolean = false){
      const path = getPath(x, y, z)
      if(!this._voxels.has(path)){ return } // Ignore any paths not included from init
      const voxel = this._voxels.get(path) as Voxel
      voxel.tileId = id
      if(id === null && !preventRender){ voxel.hide() }else{ voxel.show() }
    }

    public renderAll(){
      this._voxels.forEach((voxel: Voxel) => {
        const id = voxel.tileId
        if(id == null){ voxel.hide() }else{ voxel.show()}
      })
    }
  
    public add(x:number, y:number, z:number){
      this.gameController.client.room?.send("voxel-added", {
        baseParcel: "0,0",
        x,
        y,
        z,
        tileSetId: this._tileId,
      })
    }
    
    public delete(x:number, y:number, z:number){
      this.gameController.client.room?.send("voxel-removed", {
        baseParcel: "0,0",
        x,
        y,
        z,
      })
    }
  
    // public has(x:number, y:number, z:number): boolean { return this._v.has(getPath(x,y,z))}
    public get(x:number, y:number, z:number): Voxel | number {
      const path = getPath(x,y,z)
      return this._voxels.has(path) ? this._voxels.get(path) : null
    }
    public getActiveFromPath(path:string){
      const voxel = this._voxels.has(path) ? this._voxels.get(path) as Voxel : null
      if(voxel && voxel.active) return voxel
    }
  
    public getSurroundingTileTypes(x:number, y:number, z:number, tileId: number){
      const neighbors = getNeighborPaths(x,y,z)
      const flatTiles: TileStatus[] = []
      neighbors.forEach((group: string[][], groupId: number)=>{
        group.forEach((row: string[], rowId: number) => {
            row.forEach((path: string, tileIndex: number)=>{
                const voxel = this.getActiveFromPath(path)
                if(!voxel){ flatTiles.push(TileStatus.NULL); return }
                if(groupId == 1 && rowId == 1 && tileIndex == 1){ flatTiles.push(TileStatus.NULL); return }
                flatTiles.push(voxel.tileId == tileId ? TileStatus.SAME : TileStatus.OTHER)
                return
            })
        })
      })
      return flatTiles
    }
  
    public getSurroundingTileIds(x:number, y:number, z:number){
      const surrounding = getSurrounding(x,y,z)
      const rows = surrounding.map((row: number[][][])=>{
        return row.map((col: number[][])=>{
          return col.map((position: number[])=>{
            const [x,y,z] = position
            const voxel = this.get(x, y, z) as Voxel
            
            // log({ voxel })
            // if(!voxel){ log('returning null'); return null }else{ log('not null')}
            return voxel.tileId
          })
        })
      })
      // log({ rows })
      return rows // { above, same, below }
    }
}


















const grass = new GLTFShape('models/mstyle/grass.glb')
const dirt = new GLTFShape('models/mstyle/dirt.glb')

class Voxel {
    public active: boolean = false
    private entity: Entity | null | undefined
    private _transform: Transform = new Transform()
    private _shape: GLTFShape | null | undefined
    private _tileSetId: number | null
    private _neighbors: typeof Set
  
    constructor(
      public gameController: GameControllerInstance,
      public x:number,
      public y:number,
      public z:number
    ){
      this.position = new Vector3(x,y,z)
      this._tileSetId = null
      this._neighbors = getNeighborPathSet(x,y,z)

      this.gameController.listener.addListener<ModeChanged>(
        "mode-changed",
        ModeChanged,
        ({ mode }) => {
            switch (mode) {
                case GameModes.VIEW: { this.entity && (this.entity.getComponent(OnPointerDown).hoverText = `View Mode`); } break;
                case GameModes.EDIT: {  this.entity && (this.entity.getComponent(OnPointerDown).hoverText = `(E) Pick Up\n(F) Edit In Place`); } break;
                case GameModes.PLACEMENT: {  this.entity && (this.entity.getComponent(OnPointerDown).hoverText = `(E) Drop`); } break;
                case GameModes.PLACEMENT_EXISTING: {  this.entity && (this.entity.getComponent(OnPointerDown).hoverText = `(E) Drop`); } break;
            }
        },
    );
    }
  
    public show(){
      if(!this.entity) this.entity = new Entity()
      if(!this.entity.isAddedToEngine()) engine.addEntity(this.entity)
      this.entity.addComponentOrReplace(this._transform)
      this.entity.addComponentOrReplace(new OnPointerDown(this.onClick.bind(this)))
      this.entity.addComponentOrReplace(new OnPointerHoverEnter(this.onHoverEnter.bind(this)))
      this.entity.addComponentOrReplace(new OnPointerHoverExit(this.onHoverExit.bind(this)))
      this.entity.addComponentOrReplace(new BoxShape())
      this.updateNeighbors()
      this.updateSelf()
      this.active = true
    }
  
    public hide(){
      this.gameController.voxelSelector.position = new Vector3(0,0,0)
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
        const hasAbove = this.gameController.voxelManager.get(this.x, this.y+1, this.z) as Voxel
        const hasBelow = this.gameController.voxelManager.get(this.x, this.y-1, this.z) as Voxel
        // log(!!hasAbove, !!hasBelow, hasAbove)
        this.entity?.addComponentOrReplace(hasAbove && hasAbove.active ? dirt : grass)
        if(hasBelow && hasBelow.active){ hasBelow.updateSelf() }
    }
  
    public updateSelf2(){
      let modelSrc = CastleTiles[0].model
      let _weight = -1
      let tile: TileData = CastleTiles[0]

      if(typeof this._tileSetId == 'number'){
        const neighbors = this.gameController.voxelManager.getSurroundingTileTypes(this.x, this.y, this.z, this._tileSetId)

        CastleTiles.forEach((tileData: TileData) => {
            let _w = -1
            const { above, same, below } = tileData
            const tiles = [
                ...above[0], ...above[1], ...above[2],
                ...same[0], ...same[1], ...same[2],
                ...below[0], ...below[1], ...below[2]
            ]

            neighbors.forEach((_type: TileStatus, index: number) => {
                let id = rotation_0[index]
                _w += getWeight(tiles[id], _type)
            })

            if(_w > _weight){
                log('NEW WEIGHT', _w, tile.model)
                tile = tileData;
                _weight = _w
            }
        })

        modelSrc = tile.model
      }

      this.entity?.addComponentOrReplace(new GLTFShape(modelSrc))
    }
  
    public updateNeighbors(){
      // const hasAbove = this.gameController.voxelManager.get(this.x, this.y+1, this.z) as Voxel
      // const hasBelow = this.gameController.voxelManager.get(this.x, this.y-1, this.z) as Voxel
      // if(hasAbove && hasAbove.active){ hasBelow.updateSelf() }
      // log('updating')
      // if(hasAbove && hasBelow.active){ hasAbove.updateSelf() }
    //   const neighbors: Voxel[] = []
    //   this._neighbors.forEach((path:string) => {
    //     const voxel = this.gameController.voxelManager.getActiveFromPath(path)
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
      if(event.hit){
        if(this.gameController.state.mode === GameModes.PLACEMENT 
          ||this.gameController.state.mode === GameModes.PLACEMENT_EXISTING
        ){          
          if(this.gameController.state.isHoldingMedia() && this.gameController.state.holdingMediaItem){
            this.gameController.state.pickOrPlaceMediaItem(this.gameController.state.holdingMediaItem, false, event.hit.hitPoint as any, event.hit.normal as any);
          }else if(this.gameController.state.isHoldingPlacementTool() && this.gameController.state.holdingMediaPlacementTool){
            this.gameController.state.placeNewMediaItem(this.gameController.state.holdingMediaPlacementTool!, false, event.hit.hitPoint as any, event.hit.normal as any);
            this.gameController.state.holdingMediaPlacementTool = undefined;
          }
        }
      }
    }
  
    onHoverEnter(){
      if(this.gameController.state.mode === GameModes.EDIT){
        this.gameController.voxelSelector.position = this._transform.position;
      }else{
        this.gameController.voxelSelector.position = new Vector3(0, 0, 0);
      }
    }
  
    onHoverExit(){
      // vs.position = new Vector3(0,0,0)
    }
}















export class VoxelSelector {
    private entity: Entity = new Entity()
    private _transform: Transform = new Transform()
    private _shape: GLTFShape
  
    constructor(public gameController: GameControllerInstance){
      engine.addEntity(this.entity)
      this._shape = new GLTFShape('models/voxel_selector.glb')
      this.entity.addComponent(this._shape)
      this.entity.addComponent(this._transform)
      this.entity.addComponent(new OnPointerDown(this.onEvent.bind(this), {
        button: ActionButton.ANY,
        hoverText: '(E) Add\n(F) Remove'
      }))
      this.gameController.listener.addListener<ModeChanged>(
        "mode-changed",
        ModeChanged,
        ({ mode }) => {
            if(mode === GameModes.EDIT){
                if(!this.entity.isAddedToEngine()) engine.addEntity(this.entity)
            }else{
              if(this.entity.isAddedToEngine()) engine.removeEntity(this.entity)
            }
        }
    );
    }
  
    public set position(position: Vector3){
      this._transform.position = position
    }
  
    onEvent(event: InputEventResult){
      if(this.gameController.state.mode === GameModes.EDIT){
        switch(event.buttonId){
            case 0:
            case 1:
              this.onAdd(event)
              break;
            case 2:
              this.onDelete(event)
              break;
        }
      }
    }
  
    onAdd(event: InputEventResult){
      const { x, y, z } = this._transform.position
      const _x = x-.5
      const _y = y-.5
      const _z = z-.5
  
      switch(event.hit?.meshName){
        case 'Above':
          this.gameController.voxelManager.add(_x, _y+1, _z)
          break;
        case 'Below':
          this.gameController.voxelManager.add(_x, _y-1, _z)
          break;
        case 'North':
          this.gameController.voxelManager.add(_x, _y, _z-1)
          break;
        case 'East':
          this.gameController.voxelManager.add(_x-1, _y, _z)
          break;
        case 'South':
          this.gameController.voxelManager.add(_x, _y, _z+1)
          break;
        case 'West':
          this.gameController.voxelManager.add(_x+1, _y, _z)
          break;
      }
    }
  
    onDelete(event: InputEventResult){
      const { x, y, z } = this._transform.position
      const _x = x-.5
      const _y = y-.5
      const _z = z-.5
      this.gameController.voxelManager.delete(_x, _y, _z)
    }
  }

// export const VoxelSelector = new VoxelSelector_Instance()
// export const VoxelManager = new VoxelManager_Instance()







const rotation_0 = [
    0, 1, 2, 3, 4, 5, 6, 7, 8,
    9, 10, 11, 12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23, 24, 25, 26,
]

const rotation_90 = [
    6, 3, 0, 7, 4, 1, 8, 5, 2,
    15, 12, 9, 16, 13, 10, 17, 14, 11,
    24, 21, 18, 25, 22, 19, 26, 23, 20,
]

const rotation_120 = [
    8, 7, 6, 5, 4, 3, 2, 1, 0,
    17, 16, 15, 14, 13, 12, 11, 10, 9,
    26, 25, 24, 23, 22, 21, 20, 19, 18,
]

const rotation_270 = [
    2, 5, 8, 1, 4, 7, 0, 3, 6,
    11, 14, 17, 10, 13, 16, 9, 12, 15,
    20, 23, 26, 19, 22, 25, 18, 21, 24,
]

const rotations = [rotation_0, rotation_90, rotation_120, rotation_270]