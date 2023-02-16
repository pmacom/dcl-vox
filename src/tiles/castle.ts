import { TileData, VoxType } from "./interfaces";

export const CastleTiles: TileData[] = [
    {
        model: "models/castle/castle_type_a.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 0,
        above: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
        same: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
        below: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_b.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 300,
        above: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
        same: [
            [0, VoxType.EmptyOrOther, 0],
            [0, 0, VoxType.EmptyOrOther],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_c.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 804,
        above: [
            [0, 0, 0],
            [0, VoxType.EmptyOrOther, 0],
            [0, 0, 0],
        ],
        same: [
            [0, VoxType.EmptyOrOther, 0],
            [VoxType.Same, 0, VoxType.Same],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [VoxType.Same, VoxType.EmptyOrOther, VoxType.Same],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_d.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 500,
        above: [
            [0, 0, 0],
            [0, VoxType.EmptyOrOther, 0],
            [0, 0, 0],
        ],
        same: [
            [0, VoxType.EmptyOrOther, 0],
            [VoxType.EmptyOrOther, 0, VoxType.EmptyOrOther],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_e.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 600,
        above: [
            [0, 0, 0],
            [0, VoxType.Any, 0],
            [0, 0, 0],
        ],
        same: [
            [0, VoxType.EmptyOrOther, 0],
            [VoxType.EmptyOrOther, 0, VoxType.EmptyOrOther],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [0, VoxType.Any, 0],
            [0, VoxType.Any, 0],
        ],
    },
    {
        model: "models/castle/castle_type_f.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 300,
        above: [
            [0, 0, 0],
            [0, VoxType.EmptyOrOther, 0],
            [0, 0, 0],
        ],
        same: [
            [0, 0, 0],
            [0, 0, VoxType.EmptyOrOther],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_g.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 400,
        above: [
            [0, 0, 0],
            [0, VoxType.EmptyOrOther, 0],
            [0, 0, 0],
        ],
        same: [
            [0, VoxType.EmptyOrOther, 0],
            [0, 0, VoxType.EmptyOrOther],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_h.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 200,
        above: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
        same: [
            [0, 0, 0],
            [0, 0, VoxType.EmptyOrOther],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_i.gltf",
        allowRotation: true,
        onlyGroundFloor: true,
        weight: 450,
        above: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
        same: [
            [0, 0, 0],
            [0, 0, VoxType.EmptyOrOther],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_j.gltf",
        allowRotation: true,
        onlyGroundFloor: true,
        weight: 550,
        above: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
        same: [
            [0, VoxType.EmptyOrOther, 0],
            [0, 0, VoxType.EmptyOrOther],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_k.gltf",
        allowRotation: true,
        onlyGroundFloor: true,
        weight: 650,
        above: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
        same: [
            [0, VoxType.EmptyOrOther, 0],
            [VoxType.EmptyOrOther, 0, VoxType.EmptyOrOther],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_l.gltf",
        allowRotation: true,
        onlyGroundFloor: true,
        weight: 350,
        above: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
        same: [
            [0, 0, 0],
            [0, 0, 0],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_m.gltf",
        allowRotation: true,
        onlyGroundFloor: true,
        weight: 450,
        above: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
        same: [
            [0, VoxType.EmptyOrOther, 0],
            [0, 0, 0],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_n.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 0,
        above: [
            [0, 0, 0],
            [0, VoxType.Any, 0],
            [0, 0, 0],
        ],
        same: [
            [0, 0, 0],
            [0, 0, 0],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [0, VoxType.Any, 0],
            [0, VoxType.Any, 0],
        ],
    },
    {
        model: "models/castle/castle_type_o.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 400,
        above: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
        same: [
            [0, VoxType.EmptyOrOther, 0],
            [VoxType.EmptyOrOther, 0, VoxType.EmptyOrOther],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_p.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 500,
        above: [
            [0, 0, 0],
            [0, VoxType.Any, 0],
            [0, 0, 0],
        ],
        same: [
            [0, VoxType.EmptyOrOther, 0],
            [0, 0, VoxType.EmptyOrOther],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [0, VoxType.Any, VoxType.Any],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_q.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 604,
        above: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
        same: [
            [0, 0, 0],
            [VoxType.Same, 0, VoxType.Same],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [VoxType.Same, VoxType.EmptyOrOther, VoxType.Same],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_r.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 704,
        above: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
        same: [
            [0, VoxType.EmptyOrOther, 0],
            [VoxType.Same, 0, VoxType.Same],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [VoxType.Same, VoxType.EmptyOrOther, VoxType.Same],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_s.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 704,
        above: [
            [0, 0, 0],
            [0, VoxType.EmptyOrOther, 0],
            [0, 0, 0],
        ],
        same: [
            [0, 0, 0],
            [VoxType.Same, 0, VoxType.Same],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [VoxType.Same, VoxType.EmptyOrOther, VoxType.Same],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_t.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 704,
        above: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
        same: [
            [0, VoxType.EmptyOrOther, 0],
            [VoxType.Same, 0, VoxType.Same],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [VoxType.Same, VoxType.EmptyOrOther, VoxType.Same],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_u.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 300,
        above: [
            [0, 0, 0],
            [0, VoxType.EmptyOrOther, 0],
            [0, 0, 0],
        ],
        same: [
            [0, VoxType.EmptyOrOther, 0],
            [0, 0, 0],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_v.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 504,
        above: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
        same: [
            [0, 0, 0],
            [VoxType.Same, 0, VoxType.Same],
            [VoxType.Same, VoxType.EmptyOrOther, VoxType.Same],
        ],
        below: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_w.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 706,
        above: [
            [0, 0, 0],
            [0, VoxType.Same, 0],
            [0, VoxType.Same, 0],
        ],
        same: [
            [0, 0, 0],
            [VoxType.Same, 0, VoxType.Same],
            [VoxType.Same, VoxType.EmptyOrOther, VoxType.Same],
        ],
        below: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    },
    {
        model: "models/castle/castle_type_x.gltf",
        allowRotation: true,
        onlyGroundFloor: false,
        weight: 200,
        above: [
            [0, 0, 0],
            [0, VoxType.EmptyOrOther, 0],
            [0, 0, 0],
        ],
        same: [
            [0, 0, 0],
            [0, 0, 0],
            [0, VoxType.EmptyOrOther, 0],
        ],
        below: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
        ],
    },
    
]
