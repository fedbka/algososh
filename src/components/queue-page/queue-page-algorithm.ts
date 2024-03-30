import { ElementStates } from "../../types/element-states";

export type TQueue<T> = {
  head: number;
  tail: number;
  enqueue: (item: T) => void;
  dequeue: () => void;
  clear: () => void;
  items: () => (T | null)[];
  size: () => number;
  length: () => number;
};

export class Queue<T> implements TQueue<T> {
  private container: Array<T | null> = [];
  head = -1;
  tail = -1;
  private readonly initialSize: number = 0;

  constructor(size: number) {
    this.container = Array(size);
    this.initialSize = size;
  }

  enqueue = (item: T) => {
    this.tail++;
    this.container[this.tail] = item;
    if (this.head === -1) {
      this.head = this.tail;
    }
  };

  dequeue = () => {
    if (this.length() === 0) return;
    this.container[this.head] = null;
    if (this.head === this.tail) {
      this.head = -1;
      this.tail = -1;
    } else {
      this.head++;
    }
  };

  clear = () => {
    this.container = Array(this.initialSize);
    this.head = -1;
    this.tail = -1;
  };

  items = () => [...this.container];

  size = () => this.initialSize;

  length = () => (this.tail >= 0 ? this.tail - this.head + 1 : 0);
}

export type TElement<T> = {
  value: T;
  state: ElementStates;
};

export type TQueueStep<T> = TElement<T>[];

export type TQueueSteps<T> = TQueueStep<T>[];
