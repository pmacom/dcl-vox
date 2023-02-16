import { TileStatus, VoxType } from "../tiles/interfaces"

declare const Map:any
declare const Set:any

export const getPath = (x:number, y:number, z:number) => `${x},${y},${z}`

export const getSurroundingTilePositions = (x:number, y:number, z:number) => {
  return [
    [[x-1,y,z+1],[x,y,z+1],[x+1,y,z+1]],
    [[x-1,y,z],[x,y,z],[x+1,y,z]],
    [[x-1,y,z-1],[x,y,z-1],[x+1,y,z-1]],
  ]
}

export const getSurrounding = (x:number, y:number, z:number) => {
  return [
    getSurroundingTilePositions(x,y+1,z),
    getSurroundingTilePositions(x,y,z),
    getSurroundingTilePositions(x,y-1,z)
  ]
}

export const getNeighborPaths = (x:number, y:number, z:number) => {
  const nz = z-1
  const pz = z+1
  const nx = x-1
  const px = x+1
  const ny = y-1
  const py = y+1
  return [
    [
        [`${nx},${py},${pz}`,`${x},${py},${pz}`,`${px},${py},${pz}`],
        [`${nx},${py},${z}`, `${x},${py},${z}`, `${px},${py},${z}`],
        [`${nx},${py},${nz}`,`${x},${py},${nz}`,`${px},${py},${nz}`],
    ],
    [
        [`${nx},${y},${pz}`,`${x},${y},${pz}`,`${px},${y},${pz}`],
        [`${nx},${y},${z}`, `${x},${y},${z}`, `${px},${y},${z}`],
        [`${nx},${y},${nz}`,`${x},${y},${nz}`,`${px},${y},${nz}`],
    ],
    [
        [`${nx},${ny},${pz}`,`${x},${ny},${pz}`,`${px},${ny},${pz}`],
        [`${nx},${ny},${z}`, `${x},${ny},${z}`, `${px},${ny},${z}`],
        [`${nx},${ny},${nz}`,`${x},${ny},${nz}`,`${px},${ny},${nz}`],
    ],
  ]
}

export const getNeighborPathSet = (x:number, y:number, z:number) => {
  const nz = z-1
  const pz = z+1
  const nx = x-1
  const px = x+1
  const ny = y-1
  const py = y+1
  return new Set([
    `${nx},${py},${pz}`,`${x},${py},${pz}`,`${px},${py},${pz}`,
    `${nx},${py},${z}`, `${x},${py},${z}`, `${px},${py},${z}`,
    `${nx},${py},${nz}`,`${x},${py},${nz}`,`${px},${py},${nz}`,
    `${nx},${y},${pz}`,`${x},${y},${pz}`,`${px},${y},${pz}`,
    `${nx},${y},${z}`, `${px},${y},${z}`,
    `${nx},${y},${nz}`,`${x},${y},${nz}`,`${px},${y},${nz}`,
    `${nx},${ny},${pz}`,`${x},${ny},${pz}`,`${px},${ny},${pz}`,
    `${nx},${ny},${z}`, `${x},${ny},${z}`, `${px},${ny},${z}`,
    `${nx},${ny},${nz}`,`${x},${ny},${nz}`,`${px},${ny},${nz}`,
  ])
}

export const getWeigit = () => {
    
}

export const getWeight = (_type: VoxType, _status: TileStatus) => {
    switch(_type){
        case VoxType.NULL:
            if(_status == TileStatus.NULL) return 0
            break;
        case VoxType.Any:
            if( _status == TileStatus.SAME
             || _status == TileStatus.OTHER
            ) return 100
            break;
        case VoxType.Self:
            return 0;
        case VoxType.Same:
            if( _status == TileStatus.SAME
            ) return 101
            break;
        case VoxType.StrictEmpty:
            if( _status == TileStatus.NULL
            ) return 100
            break;
        case VoxType.EmptyOrOther:
            if( _status == TileStatus.NULL
             || _status == TileStatus.OTHER
            ) return 101
            break;
    }
    return 0
}