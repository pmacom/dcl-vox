import { CastleTiles } from "./tiles/castle"

enum VoxType {
  Any,
  Self,
  Same,
  StrictEmpty,
  EmptyOrOther,
}

interface Layers {
  above: VoxType[],
  same: VoxType[],
  below: VoxType[],
}

class Floor {
  private entity: Entity = new Entity()
  constructor(){
    engine.addEntity(this.entity)
    this.entity.addComponent(new Transform({
      position: new Vector3(8,0,8),
      scale: new Vector3(16,16,1),
      rotation: new Quaternion().setEuler(90,0,0),
    }))
    this.entity.addComponent(new PlaneShape())
  }
}

class VoxelSelector {
  private entity: Entity = new Entity()
  private _transform: Transform = new Transform()
  private _shape: GLTFShape

  constructor(){
    engine.addEntity(this.entity)
    this._shape = new GLTFShape('models/voxel_selector.glb')
    this.entity.addComponent(this._shape)
    this.entity.addComponent(this._transform)
    this.entity.addComponent(new OnPointerDown(this.onEvent.bind(this), {
      button: ActionButton.ANY,
      hoverText: '(E) Add\n(F) Remove'
    }))
  }

  public set position(position: Vector3){
    this._transform.position = position
  }

  onEvent(event: InputEventResult){
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

  onAdd(event: InputEventResult){
    const { x, y, z } = this._transform.position
    const _x = x-.5
    const _y = y-.5
    const _z = z-.5

    switch(event.hit?.meshName){
      case 'Above':
        vm.add(_x, _y+1, _z)
        break;
      case 'Below':
        vm.add(_x, _y-1, _z)
        break;
      case 'North':
        vm.add(_x, _y, _z-1)
        break;
      case 'East':
        vm.add(_x-1, _y, _z)
        break;
      case 'South':
        vm.add(_x, _y, _z+1)
        break;
      case 'West':
        vm.add(_x+1, _y, _z)
        break;
    }
  }

  onDelete(event: InputEventResult){
    const { x, y, z } = this._transform.position
    const _x = x-.5
    const _y = y-.5
    const _z = z-.5
    vm.remove(_x, _y, _z)
  }
}

declare const Set:any;

class VoxelManager {
  public _voxels: (Voxel|null)[][][] = []
  public _v: typeof Set = new Set()

  constructor(){
   // log(this.getSurroundingTileIds(8,1,8))
  }

  has(x:number, y:number, z:number): boolean {
    if(!this._voxels[x]) this._voxels[x] = []
    if(!this._voxels[x][y]) this._voxels[x][y] = []
    return !!this._voxels[x][y][z]
  }

  get(x:number, y:number, z:number): Voxel {
    if(this.has(x,y,z)){
      this._voxels[x][y][z]!.shape = new GLTFShape(CastleTiles[0].model)
      return this._voxels[x][y][z] as Voxel
    }
    const voxel = new Voxel()
    voxel.position = new Vector3(x,y,z)
    this._voxels[x][y][z] = voxel
    return voxel
  }
  add(x:number, y:number, z:number){this.get(x,y,z)}

  remove(x: number, y: number, z:number){
    if(!this.has(x,y,z)) return
    const voxel: Voxel = this.get(x,y,z)
    voxel.shape = null
  }

  public getSurroundingTileIds(x:number, y:number, z:number){
    const surrounding = this.getSurrounding(x,y,z)
    const rows = surrounding.map((row: number[][][], r:number)=>{
      return row.map((col: number[][], c:number)=>{
        return col.map((position: number[])=>{
          const [x,y,z] = position
          log({ position })
          if(!this.has(x,y,z)) return null
          const voxel = this.get(x,y,z)
          log({ voxel, position })
        })
      })
    })
    log(rows)
  }

  private getSurrounding(x:number, y:number, z:number){
    return [
      this.getSurroundingTilePositions(x,y+1,z),
      this.getSurroundingTilePositions(x,y,z),
      this.getSurroundingTilePositions(x,y-1,z)
    ]
  }

  private getSurroundingTilePositions(x:number, y:number, z:number){
    return [
      [[x-1,y,z+1],[x,y,z+1],[x+1,y,z+1]],
      [[x-1,y,z],[x,y,z],[x+1,y,z]],
      [[x-1,y,z-1],[x,y,z-1],[x+1,y,z-1]],
    ]
  }
}

class Voxel {
  private entity: Entity = new Entity()
  private _transform: Transform = new Transform()
  private _shape: GLTFShape | null
  private _tileSetId: number = 0 // Math.round(Math.random()*3)

  constructor(){
    engine.addEntity(this.entity)
    this._shape = new GLTFShape(CastleTiles[this._tileSetId].model) // new BoxShape() // new GLTFShape('models/voxel_selector.glb')
    this.entity.addComponent(this._transform)
    this.entity.addComponent(this._shape)
    this.entity.addComponent(new OnPointerDown(this.onClick))
    this.entity.addComponent(new OnPointerHoverEnter(this.onHoverEnter.bind(this)))
    this.entity.addComponent(new OnPointerHoverExit(this.onHoverExit))
  }

  public set position(position: Vector3){
    this._transform.position.set(
      Math.round(position.x)+.5,
      Math.round(position.y)+.5,
      Math.round(position.z)+.5,
    )
  }

  public set tileId(id: number){
    this._tileSetId = id
    let bestTileId = 0;
    CastleTiles.forEach(tile => {

    })
  }

  public set shape(shape: GLTFShape | null){
    this._shape = shape
    if(!shape) {
      this.entity.removeComponent(GLTFShape)
      vs.position = new Vector3(0,0,0)
    }else{
      this.entity.addComponentOrReplace(shape)
    }
  }

  onClick(event: InputEventResult){
    log(event.hit?.meshName)
  }

  onHoverEnter(){
    vs.position = this._transform.position
  }

  onHoverExit(){
  //  vs.position = new Vector3(0,0,0)
  }
}


let vm = new VoxelManager()
let vs = new VoxelSelector()
vs.position = new Vector3(0,0,0)

vm.get(8,1,8)
vm.getSurroundingTileIds(8,1,8)
log(vm._voxels)
debugger
// vm.get(1,0,1)
// vm.get(2,0,1)
// vm.get(1,1,1)
// vm.get(1,0,2)
// vm.get(2,1,1)
// vm.get(1,1,2)
