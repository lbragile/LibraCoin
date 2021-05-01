// modified from https://github.com/foqc/bfs-canvas-tree
interface ICoordinate {
  x: number;
  y: number;
}

class Node {
  value: string;
  children: Node[];
  parent: Node | null;
  pos: ICoordinate;

  constructor(value: string) {
    this.value = value;
    this.children = [];
    this.parent = null;
    this.pos = { x: 0, y: 0 };
  }

  get left(): Node {
    return this.children[0];
  }

  set left(node: Node) {
    node.parent = this;
    this.children[0] = node;
  }

  get right(): Node {
    return this.children[1];
  }

  set right(node: Node) {
    node.parent = this;
    this.children[1] = node;
  }

  get position(): ICoordinate {
    return this.pos;
  }

  set position(position: ICoordinate) {
    this.pos = position;
  }
}

export class Tree {
  #root: Node | null;
  #startPosition: ICoordinate;
  #dim: { width: number; height: number };
  #ctx: CanvasRenderingContext2D | null;

  constructor(canvas: HTMLCanvasElement) {
    this.#root = null;
    this.#startPosition = { x: window.innerWidth / 2 - 150, y: 5 };
    this.#ctx = canvas.getContext("2d");
    this.#dim = { width: canvas.width, height: canvas.height };
  }

  calculatePosition({ x, y }: ICoordinate, isLeft = false): ICoordinate {
    const offset = 50;
    return { x: isLeft ? x - offset * 6 : x + offset * 6, y: y + offset };
  }

  clear(): void {
    if (this.#ctx) {
      this.#ctx.clearRect(0, 0, this.#dim.width, this.#dim.height);
    }
  }

  addNode(value: string): void {
    const newNode = new Node(value !== "" ? value.slice(0, 25) + "..." : "");
    if (!this.#root) {
      newNode.position = this.#startPosition;
      this.#root = newNode;
    } else {
      // start at root, if no node on left add and break, likewise for right
      // only move in direction that does not have both children
      let node = this.#root;
      while (node) {
        if (!node.left) {
          newNode.position = this.calculatePosition(node.position, true);
          node.left = newNode;
          break;
        }

        if (!node.right) {
          newNode.position = this.calculatePosition(node.position);
          node.right = newNode;
          break;
        }

        node = !node.left.left || !node.left.right ? node.left : node.right;
      }
    }
  }

  drawTree(): void {
    const queue = [] as Node[];
    queue.push(this.#root as Node);

    // level order traversal
    while (queue.length !== 0) {
      const node = queue.shift();
      const rectWidth = node && node.value.length * 9;

      if (this.#ctx && rectWidth && node) {
        // draw the root node
        const { x, y } = node.position;
        this.#ctx.beginPath();

        this.#ctx.font = "1rem Arial";
        this.#ctx.strokeStyle = "#000";
        this.#ctx.fillStyle = node.value === this.#root?.value ? "#dfd" : "#ddf";

        this.#ctx.fillRect(x - rectWidth / 2, y + 5, rectWidth, 30);
        this.#ctx.fillStyle = "#000";
        this.#ctx.fillText(node.value, x + 10 - rectWidth / 2, y + 25);

        // draw it's children
        node.children.forEach((child, i) => {
          child.position.x = i === 1 ? child.position.x - 150 : child.position.x + 150; // avoid overlap
          queue.push(child);
          if (this.#ctx) {
            this.#ctx.beginPath();
            this.#ctx.moveTo(x, y + 35);
            this.#ctx.lineTo(child.position.x, child.position.y + 5);
            this.#ctx.stroke();
          }
        });
      }
    }
  }
}
