import React, { useState } from "react";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { useForm } from "../../hooks/useForm";
import { ElementStates } from "../../types/element-states";
import { getRandomValues } from "../../utils/utils";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { LinkedList } from "./LinkedList";
import styles from "./list-page.module.css";

type TElement<T> = {
  value: T;
  head: string;
  tail: string;
  state: ElementStates;
}

type TStep<T> = Array<TElement<T>>;

type TSteps<T> = TStep<T>[];

type TActions = 'append' | 'prepend' | 'addByIndex' | 'deleteByIndex' | 'deleteHead' | 'deleteTail' | 'clear' | null;

export const ListPage: React.FC = () => {
  const { values, onChangeHandler, setValues } = useForm({ valueInput: "", indexInput: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [list] = useState<LinkedList<string>>(new LinkedList<string>(getRandomValues()));
  const [steps, setSteps] = useState<TSteps<string>>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [action, setAction] = useState<TActions>(null);

  const startVisualization = (action: TActions): void => {
    setAction(action);
    const newSteps: TSteps<string> = [];
    let nodes = list.toArray();
    if (action === 'prepend') {
      newSteps.push(nodes.map((node) => ({ value: node.value, head: (node === list.head) ? 'head' : '', tail: (node === list.tail) ? 'tail' : '', state: (node === list.head) ? ElementStates.Changing : ElementStates.Default } as TElement<string>)));
      newSteps.push(nodes.map((node) => ({ value: node.value, head: (node === list.head) ? values.valueInput : '', tail: (node === list.tail) ? 'tail' : '', state: (node === list.head) ? ElementStates.Changing : ElementStates.Default } as TElement<string>)));
      list.prepend(values.valueInput as string);
      nodes = list.toArray();
      newSteps.push(nodes.map((node) => ({ value: node.value, head: (node === list.head) ? 'head' : '', tail: (node === list.tail) ? 'tail' : '', state: (node === list.head) ? ElementStates.Modified : ElementStates.Default } as TElement<string>)));
      setValues({ ...values, valueInput: "" });
    }

    if (action === 'append') {
      newSteps.push(nodes.map((node) => ({ value: node.value, head: (node === list.head) ? 'head' : '', tail: (node === list.tail) ? 'tail' : '', state: (node === list.tail) ? ElementStates.Changing : ElementStates.Default } as TElement<string>)));
      newSteps.push(nodes.map((node) => ({ value: node.value, head: (node === list.head) ? 'head' : (node === list.tail) ? values.valueInput : '', tail: (node === list.tail) ? 'tail' : '', state: (node === list.tail) ? ElementStates.Changing : ElementStates.Default } as TElement<string>)));
      list.append(values.valueInput as string);
      nodes = list.toArray();
      newSteps.push(nodes.map((node) => ({ value: node.value, head: (node === list.head) ? 'head' : '', tail: (node === list.tail) ? 'tail' : '', state: (node === list.tail) ? ElementStates.Modified : ElementStates.Default } as TElement<string>)));
      setValues({ ...values, valueInput: "" });
    }

    if (action === 'deleteHead') {
      newSteps.push(nodes.map((node) => ({ value: node.value, head: (node === list.head) ? 'head' : '', tail: (node === list.tail) ? 'tail' : '', state: (node === list.head) ? ElementStates.Changing : ElementStates.Default } as TElement<string>)));
      newSteps.push(nodes.map((node) => ({ value: (node === list.head) ? '' : node.value, head: (node === list.head) ? 'head' : '', tail: (node === list.tail) ? 'tail' : (node === list.head) ? node.value : '', state: (node === list.head) ? ElementStates.Changing : ElementStates.Default } as TElement<string>)));
      list.deleteHead();
      nodes = list.toArray();
      newSteps.push(nodes.map((node) => ({ value: node.value, head: (node === list.head) ? 'head' : '', tail: (node === list.tail) ? 'tail' : '', state: (node === list.head) ? ElementStates.Modified : ElementStates.Default } as TElement<string>)));
    }

    if (action === 'deleteTail') {
      newSteps.push(nodes.map((node) => ({ value: node.value, head: (node === list.head) ? 'head' : '', tail: (node === list.tail) ? 'tail' : '', state: (node === list.tail) ? ElementStates.Changing : ElementStates.Default } as TElement<string>)));
      newSteps.push(nodes.map((node) => ({ value: (node === list.tail) ? '' : node.value, head: (node === list.head) ? 'head' : '', tail: (node === list.tail) ? node.value : '', state: (node === list.tail) ? ElementStates.Changing : ElementStates.Default } as TElement<string>)));
      list.deleteTail();
      nodes = list.toArray();
      newSteps.push(nodes.map((node) => ({ value: node.value, head: (node === list.head) ? 'head' : '', tail: (node === list.tail) ? 'tail' : '', state: (node === list.tail) ? ElementStates.Modified : ElementStates.Default } as TElement<string>)));
    }

    if (action === 'deleteByIndex') {
      const indexInput = Number(values.indexInput);
      for (let i: number = 0; Math.min(indexInput, (nodes.length - 1)) >= i; i++) {
        newSteps.push(nodes.map((node, index) => ({ value: node.value, head: (node === list.head) ? 'head' : '', tail: (node === list.tail) ? 'tail' : '', state: (index == i) ? ElementStates.Changing : ElementStates.Default } as TElement<string>)));
      }
      if (indexInput <= nodes.length - 1) {
        newSteps.push(nodes.map((node, index) => ({ value: (index === indexInput) ? '' : node.value, head: (node === list.head) ? 'head' : '', tail: (index === indexInput) ? node.value : (node === list.tail) ? 'tail' : '', state: (index === indexInput) ? ElementStates.Changing : ElementStates.Default } as TElement<string>)));
        list.deleteByIndex(indexInput);
        nodes = list.toArray();
        newSteps.push(nodes.map((node, index) => ({ value: node.value, head: (node === list.head) ? 'head' : '', tail: (node === list.tail) ? 'tail' : '', state: (index === indexInput) ? ElementStates.Modified : ElementStates.Default } as TElement<string>)));
      }
      setValues({ ...values, indexInput: "" });
    }

    if (action === 'addByIndex') {
      const indexInput = Number(values.indexInput);
      for (let i: number = 0; Math.min(indexInput, (nodes.length - 1)) >= i; i++) {
        newSteps.push(nodes.map((node, index) => ({ value: node.value, head: (node === list.head) ? 'head' : '', tail: (node === list.tail) ? 'tail' : '', state: (index == i) ? ElementStates.Changing : ElementStates.Default } as TElement<string>)));
      }
      if (indexInput <= nodes.length - 1) {
        newSteps.push(nodes.map((node, index) => ({ value: node.value, head: (index === indexInput) ? values.valueInput : (node === list.head) ? 'head' : '', tail: (node === list.tail) ? 'tail' : '', state: (index === indexInput) ? ElementStates.Changing : ElementStates.Default } as TElement<string>)));
        list.addByIndex(values.valueInput as string, indexInput);
        nodes = list.toArray();
        newSteps.push(nodes.map((node, index) => ({ value: node.value, head: (node === list.head) ? 'head' : '', tail: (node === list.tail) ? 'tail' : '', state: (index === indexInput) ? ElementStates.Modified : ElementStates.Default } as TElement<string>)));
      }
      setValues({ ...values, valueInput: "", indexInput: "" });
    }

    setSteps(newSteps);
    setStepIndex(0);

    if (!newSteps.length) return;

    setIsLoading(true);
    let stepsIndex = 0;
    const intervalId = setInterval(() => {
      if (stepsIndex >= newSteps.length - 1) {
        clearInterval(intervalId);
        setIsLoading(false);
        return;
      }

      setStepIndex(++stepsIndex);
    }, SHORT_DELAY_IN_MS);

  }

  return (
    <SolutionLayout title="Связный список">
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <fieldset className={styles.fieldset} disabled={isLoading}>
          <Input extraClass={styles.input} type="text" maxLength={4} value={values.valueInput as number} name="valueInput" isLimitText={true} placeholder="Введите значение" onChange={onChangeHandler} data-test-id="valueInput"/>
          <Button extraClass={styles.wideButton} text="Добавить в head" type="button" isLoader={isLoading && action === 'prepend'} disabled={!values.valueInput || values.valueInput as number > 9999} onClick={() => startVisualization('prepend')} data-test-id="prepend"/>
          <Button extraClass={styles.wideButton} text="Добавить в tail" type="button" isLoader={isLoading && action === 'append'} disabled={!values.valueInput || values.valueInput as number > 9999} onClick={() => startVisualization('append')} data-test-id="append"/>
          <Button extraClass={styles.wideButton} text="Удалить из head" type="button" isLoader={isLoading && action === 'deleteHead'} disabled={!list.head} onClick={() => startVisualization('deleteHead')} data-test-id="deleteHead"/>
          <Button extraClass={styles.wideButton} text="Удалить из tail" type="button" isLoader={isLoading && action === 'deleteTail'} disabled={!list.tail} onClick={() => startVisualization('deleteTail')} data-test-id="deleteTail"/>
        </fieldset>
        <fieldset className={styles.fieldset} disabled={isLoading}>
          <Input extraClass={styles.input} type="number" min={0} max={list.size} value={values.indexInput as number} name="indexInput" placeholder="Введите индекс" onChange={onChangeHandler} data-test-id="indexInput"/>
          <Button extraClass={styles.wideButton} text="Добавить по индексу" type="button" isLoader={isLoading && action === 'addByIndex'} disabled={!values.valueInput || !values.indexInput || !list.size || values.indexInput as number >= list.size - 1} onClick={() => startVisualization('addByIndex')} data-test-id="addByIndex"/>
          <Button extraClass={styles.wideButton} text="Удалить по индексу" type="button" isLoader={isLoading && action === 'deleteByIndex'} disabled={!values.indexInput || !list.size || Number(values.indexInput) > list.size - 1} onClick={() => startVisualization('deleteByIndex')} data-test-id="deleteByIndex"/>
        </fieldset>

      </form>
      <ul className={styles.list}>
        {isLoading && steps[stepIndex].map((element, index) => (
          <li key={index} className={styles.listItem}>
            {(index > 0) && <ArrowIcon />}
            <Circle letter={element.value} state={element.state} index={index} head={element.head} tail={element.tail} />
          </li>))
        }
        {!isLoading && list.toArray()?.map((element, index) => (
          <li key={index} className={styles.listItem}>
            {(index > 0) && <ArrowIcon />}
            <Circle letter={element.value.toString()} state={ElementStates.Default} index={index} head={element === list.head ? 'head' : ''} tail={element === list.tail ? 'tail' : ''} />
          </li>))
        }
      </ul>
    </SolutionLayout>
  );
};
