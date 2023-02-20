// import { getParcel } from "@decentraland/ParcelIdentity"

// export const GetSceneData = async () => {
//     const parcelData = await getParcel()
//     const base = parcelData.land.sceneJsonData.scene.base
//     const parcels = parcelData.land.sceneJsonData.scene.parcels
//     const maxHeight = Math.ceil(20 * (Math.log(parcels.length+1) * Math.LOG2E))
//     return { base, parcels, maxHeight }
// }

// export const parseParcelString = (parcelString: string) => {
//     const [x, y] = parcelString.split(',').map(n => parseInt(n))
//     log({x, y})
// }