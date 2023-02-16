interface Point {
    [key: string]: number;
}

class KDTree {
    root: Node | null;

    constructor(points: Point[]) {
        this.root = buildTree(points, 0);
    }
}

class Node {
    point: Point;
    left: Node | null;
    right: Node | null;

    constructor(point: Point) {
        this.point = point;
        this.left = null;
        this.right = null;
    }
}

function buildTree(points: Point[], depth: number): Node | null {
    if (points.length === 0) {
        return null;
    }

    const axis = depth % 3; // use x-axis for 0, y-axis for 1, z-axis for 2
    points.sort((a: Point, b: Point) => a[axis] - b[axis]);

    const middle = Math.floor(points.length / 2);
    const node = new Node(points[middle]);
    node.left = buildTree(points.slice(0, middle), depth + 1);
    node.right = buildTree(points.slice(middle + 1), depth + 1);

    return node;
}

function findNeighbors(tree: KDTree, voxel: Point, radius: number): Point[] {
    const neighbors: Point[] = [];
    findNeighborsRec(tree.root, voxel, radius, 0, neighbors);
    return neighbors;
}

function findNeighborsRec(node: Node | null, voxel: Point, radius: number, depth: number, neighbors: Point[]): void {
    if (!node) {
        return;
    }

    const axis = depth % 3;
    const dist = Math.sqrt(
        (node.point.x - voxel.x) ** 2 +
        (node.point.y - voxel.y) ** 2 +
        (node.point.z - voxel.z) ** 2
    );

    if (dist <= radius) {
        neighbors.push(node.point);
    }

    if (node.point[axis] > voxel[axis] - radius) {
        findNeighborsRec(node.left, voxel, radius, depth + 1, neighbors);
    }

    if (node.point[axis] < voxel[axis] + radius) {
        findNeighborsRec(node.right, voxel, radius, depth + 1, neighbors);
    }
}