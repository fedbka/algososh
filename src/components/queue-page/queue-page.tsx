import React, { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { ElementStates } from "../../types/element-states";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Queue, TElement, TQueue, TQueueSteps } from "./queue-page-algorithm";
import styles from "./queue-page.module.css";
import { act } from "react-dom/test-utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

export const QueuePage: React.FC = () => {
  const { values, onChangeHandler, setValues } = useForm({ textInput: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queue] = useState<TQueue<string>>(new Queue<string>(7));
  const [steps, setSteps] = useState<TQueueSteps<string>>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [action, setAction] = useState<'add' | 'delete' | 'clear' | ''>('');

  const clearHandler = () => {
    setAction('clear');
    startVisualization('clear');
  }

  const addHandler = () => {
    setAction('add');
    startVisualization('add');
    setValues({ ...values, textInput: '' });
  }

  const deleteHandler = () => {
    setAction('delete');
    startVisualization('delete');
  }

  const startVisualization = (action: string): void => {

    const newSteps: TQueueSteps<string> = [];

    if (action === 'add') {
      newSteps.push(queue.items().map((element, index) => ({ value: element, state: (index === (queue.tail + 1)) ? ElementStates.Changing : ElementStates.Default } as TElement<string>)));
      queue.enqueue(values.textInput as string);
      newSteps.push(queue.items().map((element) => ({value: element, state: ElementStates.Default} as TElement<string>)));
    }

    if (action === 'delete') {
      newSteps.push(queue.items().map((element, index) => ({ value: element, state: (index === (queue.head)) ? ElementStates.Changing : ElementStates.Default } as TElement<string>)));
      queue.dequeue();
      newSteps.push(queue.items().map((element) => ({value: element, state: ElementStates.Default} as TElement<string>)));      
    }

    if (action === 'clear') {
      newSteps.push(queue.items().map((element) => ({ value: element, state: ElementStates.Changing } as TElement<string>)));
      queue.clear();
      newSteps.push(queue.items().map((element) => ({value: element, state: ElementStates.Default} as TElement<string>)));      
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
    <SolutionLayout title="Очередь">
      <form className={styles.form}>
        <fieldset className={styles.fieldset_input} disabled={isLoading}>
          <Input type="string" maxLength={4} value={values.textInput as string} name="textInput" placeholder="Введите текст" onChange={onChangeHandler} />
        </fieldset>
        <fieldset className={styles.form_buttons} disabled={isLoading}>
          <div className={styles.form_buttons_main}>
            <Button text="Добавить" type="button" onClick={addHandler} isLoader={isLoading && action === 'add'} disabled={!values.textInput || queue.tail === queue.size() - 1} />
            <Button text="Удалить" type="button" onClick={deleteHandler} isLoader={isLoading && action === 'delete'} disabled={!queue.size() || !queue.length()} />
          </div>
          <Button text="Очистить" type="button" isLoader={isLoading && action === 'clear'} disabled={!queue.length()} onClick={clearHandler} />
        </fieldset>
      </form>
      <ul className={styles.queue}>
        {isLoading && steps[stepIndex].map((element, index) => (
          <li key={index}>
            <Circle letter={element.value} state={element.state} index={index} head={index === queue.head ? 'head' : ''} tail={index === queue.tail ? 'tail' : ''} />
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
