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
  #canvas: CanvasRenderingContext2D | null;

  constructor(canvas: HTMLCanvasElement) {
    this.#root = null;
    this.#startPosition = { x: window.innerWidth / 2, y: 0 };
    this.#canvas = canvas.getContext("2d");
    this.#dim = { width: canvas.width, height: canvas.height };
  }

  calculatePosition({ x, y }: ICoordinate, isLeft = false): ICoordinate {
    const offset = 50;
    return { x: isLeft ? x - offset * 6 : x + offset * 6, y: y + offset };
  }

  clear(): void {
    if (this.#canvas) {
      this.#canvas.clearRect(0, 0, this.#dim.width, this.#dim.height);
    }
  }

  addNode(value: string): void {
    const newNode = new Node(value !== "" ? value.slice(0, 25) + "..." : "");
    if (!this.#root) {
      newNode.position = this.#startPosition;
      this.#root = newNode;
    } else {
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

    while (queue.length !== 0) {
      const node = queue.shift();
      const rectWidth = node && node.value.length * 9;

      if (this.#canvas && rectWidth && node) {
        const { x, y } = node.position;
        this.#canvas.beginPath();
        this.#canvas.rect(x - rectWidth / 2, y + 5, rectWidth, 30);
        this.#canvas.strokeStyle = "#000";
        this.#canvas.fillStyle = node.value === this.#root?.value ? "#dfd" : "#ddf";
        this.#canvas.font = "1rem Arial";
        this.#canvas.fill();
        this.#canvas.stroke();
        this.#canvas.strokeStyle = "#000";
        this.#canvas.strokeText(node.value, x + 10 - rectWidth / 2, y + 25);

        node.children.forEach((child) => {
          if (this.#canvas) {
            this.#canvas.beginPath();
            this.#canvas.moveTo(x, y + 35);
            this.#canvas.lineTo(child.position.x, child.position.y + 35);
            this.#canvas.stroke();
            queue.push(child);
          }
        });
      }
    }
  }
}
