export class LinkedListNode<T> {
  value: T;
  next: LinkedListNode<T> | null;

  constructor(value: T, next?: LinkedListNode<T> | null) {
    this.value = value;
    this.next = null;
    if (next) {
      this.next = next;
    }
  }
}

export type ILinkedList<T> = {
  head: LinkedListNode<T> | null;
  tail: LinkedListNode<T> | null;
  size: number;
  append: (element: T) => void;
  prepend: (element: T) => void;
  addByIndex: (element: T, index: number) => void;
  deleteByIndex: (index: number) => void;
  deleteHead: () => void;
  deleteTail: () => void;
  toArray: () => LinkedListNode<T>[];
};

export class LinkedList<T> implements ILinkedList<T> {
  head: LinkedListNode<T> | null = null;
  tail: LinkedListNode<T> | null = null;
  size = 0;
  constructor(items?: Array<T>) {
    this.head = null;
    this.tail = null;
    if (items) {
      items.forEach((element) => {
        this.append(element);
      });
    }
  }

  append = (element: T) => {
    const newNode = new LinkedListNode(element);
    this.size++;
    if (this.tail === null || this.head === null) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }
    this.tail.next = newNode;
    this.tail = newNode;
  };

  prepend = (element: T) => {
    const newNode = new LinkedListNode(element);
    this.size++;
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }
    newNode.next = this.head;
    this.head = newNode;
  };

  addByIndex = (element: T, index: number) => {
    if (index > this.size - 1 || this.head === null) return;
    this.size++;
    const newNode = new LinkedListNode(element);
    if (index === 0) {
      newNode.next = this.head;
      this.head = newNode;
    }

    let currentNode: LinkedListNode<T> | null = this.head;
    let currentIndex = 0;
    while (currentNode !== null && currentIndex <= index) {
      if (currentIndex === index - 1 && currentNode.next !== null) {
        newNode.next = currentNode.next;
        currentNode.next = newNode;
        break;
      }
      currentNode = currentNode.next;
      currentIndex++;
    }
  };

  deleteByIndex = (index: number) => {
    if (index > this.size - 1 || this.head === null) return;
    this.size--;
    if (index === 0) {
      this.head = this.head.next !== null ? this.head?.next : null;
    }

    let currentNode = this.head;
    let currentIndex = 0;
    while (currentNode !== null && currentIndex <= index) {
      if (currentIndex === index - 1 && currentNode.next !== null) {
        currentNode.next = currentNode.next.next;
        break;
      }
      currentNode = currentNode.next;
      currentIndex++;
    }
  };

  deleteHead = () => {
    if (this.head === null) return;
    this.size--;
    if (this.head === this.tail || this.head.next === null) {
      this.tail = null;
      this.head = null;
      return;
    }
    this.head = this.head.next;
  };

  deleteTail = () => {
    if (this.tail === null || this.head === null) return;
    this.size--;
    if (this.head === this.tail) {
      this.tail = null;
      this.head = null;
      return;
    }

    let currentNode: LinkedListNode<T> | null = this.head;
    while (currentNode !== null) {
      if (currentNode.next !== this.tail) {
        currentNode = currentNode.next;
        continue;
      }
      currentNode.next = null;
      this.tail = currentNode;
    }
  };

  toArray = () => {
    if (this.head === null) return [];
    const result: LinkedListNode<T>[] = [];
    let currentNode: LinkedListNode<T> | null = this.head;
    while (currentNode != null) {
      result.push(currentNode);
      currentNode = currentNode.next;
    }
    return result;
  };
}
