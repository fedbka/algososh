import React, { useState } from "react";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { useForm } from "../../hooks/useForm";
import { ElementStates } from "../../types/element-states";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Stack, TElement, TStack, TStackStep, TStackSteps } from "./stack-page-algorithm";
import styles from "./stack-page.module.css";

type TActions = 'add' | 'delete' | 'clear' | null;
export const StackPage: React.FC = () => {
  const { values, onChangeHandler, setValues } = useForm({ textInput: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stack] = useState<TStack<string>>(new Stack<string>());
  const [steps, setSteps] = useState<TStackSteps<string>>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [action, setAction] = useState<TActions>(null);

  const startVisualization = (action: TActions): void => {
    setAction(action);
    const firstStep: TStackStep<string> = stack.items().map(element => ({ value: element, state: ElementStates.Default } as TElement<string>));

    const newSteps: TStackSteps<string> = [];

    if (action === 'add') {
      stack.push(values.textInput as string);
      newSteps.push([...firstStep, { value: values.textInput as string, state: ElementStates.Changing }]);
    }

    if (action === 'delete') {
      newSteps.push(firstStep.map((element, index) => index !== firstStep.length - 1 ? ({ ...element }) : ({ ...element, state: ElementStates.Changing })));
      stack.pop();
    }

    if (action === 'clear') {
      newSteps.push([...firstStep.map((element) => ({ ...element, state: ElementStates.Changing }))]);
      stack.clear();
    }

    setSteps(newSteps);
    setStepIndex(0);

    if (!newSteps.length) return;

    setIsLoading(true);
    let stepsIndex = 0;
    const intervalId = setInterval(() => {
      if (stepsIndex >= newSteps.length - 1) {
        clearInterval(intervalId);
        setValues({ ...values, textInput: "" });
        setIsLoading(false);
        return;
      }

      setStepIndex(++stepsIndex);
    }, SHORT_DELAY_IN_MS);

  }

  return (
    <SolutionLayout title="Стек">
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <fieldset className={styles.fieldset_input} disabled={isLoading}>
          <Input type="string" maxLength={4} value={values.textInput as string} name="textInput" placeholder="Введите значение" onChange={onChangeHandler} data-test-id="valueInput" />
        </fieldset>
        <fieldset className={styles.form_buttons} disabled={isLoading}>
          <div className={styles.form_buttons_main}>
            <Button text="Добавить" type="button" onClick={() => startVisualization('add')} isLoader={isLoading && action === 'add'} disabled={!values.textInput} data-test-id="add" />
            <Button text="Удалить" type="button" onClick={() => startVisualization('delete')} isLoader={isLoading && action === 'delete'} disabled={!stack.size()} data-test-id="delete" />
          </div>
          <Button text="Очистить" type="button" onClick={() => startVisualization('clear')} isLoader={isLoading && action === 'clear'} disabled={!stack.size()} data-test-id="clear" />
        </fieldset>
      </form>
      <ul className={styles.stack} data-test-id="stack">
        {isLoading && steps[stepIndex].map((element, index) => (
          <li key={index}>
            <Circle letter={element.value} state={element.state} index={index} head={index === steps[stepIndex].length - 1 ? 'top' : ''} />
          </li>))
        }
        {!isLoading && stack.items()?.map((element, index) => (
          <li key={index}>
            <Circle letter={element} state={ElementStates.Default} index={index} head={index === stack.size() - 1 ? 'top' : ''} />
          </li>))
        }
      </ul>
    </SolutionLayout>

  );
};
