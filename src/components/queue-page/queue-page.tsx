import React, { useState } from "react";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { useForm } from "../../hooks/useForm";
import { ElementStates } from "../../types/element-states";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Queue, TQueue, } from "./queue-page-algorithm";
import styles from "./queue-page.module.css";

type TActions = 'add' | 'delete' | 'clear' | null;

type TElement<T> = {
  value: T;
  state: ElementStates;
  head: string;
  tail: string;
};

type TStep<T> = TElement<T>[];

type TSteps<T> = TStep<T>[];

export const QueuePage: React.FC = () => {
  const { values, onChangeHandler, setValues } = useForm({ textInput: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queue] = useState<TQueue<string>>(new Queue<string>(7));
  const [steps, setSteps] = useState<TSteps<string>>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [action, setAction] = useState<TActions>(null);

  const startVisualization = (action: TActions): void => {
    setAction(action);
    const newSteps: TSteps<string> = [];

    if (action === 'add') {
      queue.enqueue(values.textInput as string);
      newSteps.push(queue.items().map((element, index) => ({ value: element, state: (index === queue.tail) ? ElementStates.Changing : ElementStates.Default, head: (index === queue.head) ? 'head' : '', tail: (index === queue.tail) ? 'tail' : '' } as TElement<string>)));
    }

    if (action === 'delete') {
      newSteps.push(queue.items().map((element, index) => ({ value: element, state: (index === (queue.head)) ? ElementStates.Changing : ElementStates.Default, head: (index === queue.head) ? 'head' : '', tail: (index === queue.tail) ? 'tail' : '' } as TElement<string>)));
      queue.dequeue();
    }

    if (action === 'clear') {
      newSteps.push(queue.items().map((element, index) => ({ value: element, state: ElementStates.Changing, head: (index === queue.head) ? 'head' : '', tail: (index === queue.tail) ? 'tail' : '' } as TElement<string>)));
      queue.clear();
    }

    setSteps(newSteps);
    setStepIndex(0);

    if (!newSteps.length) return;

    setIsLoading(true);
    let stepsIndex = 0;
    const intervalId = setInterval(() => {
      if (stepsIndex >= newSteps.length - 1) {
        clearInterval(intervalId);
        setValues({ ...values, textInput: "" })
        setIsLoading(false);
        return;
      }

      setStepIndex(++stepsIndex);
    }, SHORT_DELAY_IN_MS);

  }

  return (
    <SolutionLayout title="Очередь">
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <fieldset className={styles.fieldset_input} disabled={isLoading}>
          <Input type="string" maxLength={4} value={values.textInput as string} name="textInput" placeholder="Введите значение" onChange={onChangeHandler} data-test-id="textInput"/>
        </fieldset>
        <fieldset className={styles.form_buttons} disabled={isLoading}>
          <div className={styles.form_buttons_main}>
            <Button text="Добавить" type="button" onClick={() => startVisualization("add")} isLoader={isLoading && action === 'add'} disabled={!values.textInput || queue.tail === queue.size() - 1} data-test-id="add" />
            <Button text="Удалить" type="button" onClick={() => startVisualization("delete")} isLoader={isLoading && action === 'delete'} disabled={!queue.size() || !queue.length()} data-test-id="delete"/>
          </div>
          <Button text="Очистить" type="button" onClick={() => startVisualization("clear")} isLoader={isLoading && action === 'clear'} disabled={!queue.length()} data-test-id="clear" />
        </fieldset>
      </form>
      <ul className={styles.queue} data-test-id="queue">
        {isLoading && steps[stepIndex].map((element, index) => (
          <li key={index}>
            <Circle letter={element.value} state={element.state} index={index} head={element.head} tail={element.tail} />
          </li>))
        }
        {!isLoading && queue.items()?.map((element, index) => (
          <li key={index}>
            <Circle letter={element as string} state={ElementStates.Default} index={index} head={index === queue.head ? 'head' : ''} tail={index === queue.tail ? 'tail' : ''} />
          </li>))
        }
      </ul>
    </SolutionLayout>
  );
};
