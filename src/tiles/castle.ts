enum VoxType {
    Any,
    Self,
    Same,
    StrictEmpty,
    EmptyOrOther,
}

export const CastleTiles = [
    {
        model: "models/castle/castle_tile_1.gltf",
        allowRotation: true,
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
        model: "models/castle/castle_tile_2.gltf",
        allowRotation: true,
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
        model: "models/castle/castle_tile_3.gltf",
        allowRotation: true,
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
]
