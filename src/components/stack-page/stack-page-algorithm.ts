import { ElementStates } from "../../types/element-states";

export type TStack<T> = {
  push: (item: T) => void;
  pop: () => void;
  peak: () => T | null;
  clear: () => void;
  size: () => number;
  items: () => T[];
}

export class Stack<T> implements TStack<T> {
  private stackItems: T[] = [];

  push = (item: T) => {
    this.stackItems.push(item);
  };

  pop = () => {
    this.stackItems.pop();
  };

  peak = () => {
    return !this.stackItems.length ? null : this.stackItems[this.stackItems.length - 1];
  };

  clear = () => {
    this.stackItems = [];
  }

  size = () => this.stackItems.length;

  items = () => [...this.stackItems];

}

export type TElement<T> = {
  value: T;
  state: ElementStates;
}

export type TStackStep<T> = TElement<T>[];

export type TStackSteps<T> = TStackStep<T>[];


