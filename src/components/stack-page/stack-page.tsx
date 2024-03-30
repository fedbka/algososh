import React, { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Stack, TElement, TStack, TStackStep, TStackSteps } from "./stack-page-algorithm";
import styles from "./stack-page.module.css";
import { ElementStates } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

export const StackPage: React.FC = () => {
  const { values, onChangeHandler, setValues } = useForm({ textInput: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stack] = useState<TStack<string>>(new Stack<string>());
  const [steps, setSteps] = useState<TStackSteps<string>>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [action, setAction] = useState<'add' | 'delete' | 'clear' | ''>('');

  const clearHandler = () => {
    setAction('clear');
    startVisualization('clear');
  }
  
  const addHandler = () => {
    if (!values.textInput) return;
    setAction('add');
    startVisualization('add');
    setValues({...values, textInput: ''});
  }

  const deleteHandler = () => {
    setAction('delete');
    startVisualization('delete');
  }
  
  const startVisualization = (action: string): void => {
    
    const firstStep: TStackStep<string> = stack.items().map(element => ({value: element, state: ElementStates.Default} as TElement<string>));

    let newSteps: TStackSteps<string> = [firstStep];

    if (action === 'add') {
      stack.push(values.textInput as string);
      newSteps = [...newSteps, [...newSteps[0], {value: values.textInput as string, state: ElementStates.Changing}], [...newSteps[0], {value: values.textInput as string, state: ElementStates.Default}]];
    }

    if (action === 'delete') {
      newSteps = [...newSteps, [...newSteps[0].map((element, index) => index !== newSteps[0].length - 1 ? ({...element}) : ({...element, state: ElementStates.Changing}))]];
      stack.pop();
      newSteps = [...newSteps, [...stack.items().map(element => ({value: element, state: ElementStates.Default} as TElement<string>))]];
    } 
    
    if (action === 'clear') {
      newSteps = [...newSteps, [...newSteps[0].map((element) => ({...element, state: ElementStates.Changing}))]];
      stack.clear();
      newSteps = [...newSteps, []];
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
    <SolutionLayout title="Стек">
      <form className={styles.form}>
        <fieldset className={styles.fieldset_input} disabled={isLoading}>
          <Input type="string" maxLength={4} value={values.textInput as string} name="textInput" placeholder="Введите текст" onChange={onChangeHandler} />
        </fieldset>
        <fieldset className={styles.form_buttons} disabled={isLoading}>
          <div className={styles.form_buttons_main}>
            <Button text="Добавить" type="button" onClick={addHandler} isLoader={isLoading && action === 'add'} disabled={!values.textInput} />
            <Button text="Удалить" type="button" onClick={deleteHandler} isLoader={isLoading && action === 'delete'} disabled={!stack.size()} />
          </div>
          <Button text="Очистить" type="button" isLoader={isLoading && action === 'clear'} disabled={!stack.size()} onClick={clearHandler}/>
        </fieldset>
      </form>
      <ul className={styles.stack}>
        {isLoading && steps[stepIndex].map((element, index) => (
          <li key={index}>
            <Circle letter={element.value} state={element.state} index={index} head={index === steps[stepIndex].length - 1 ? 'top' : ''}/>
          </li>))
        }
        {!isLoading && stack.items()?.map((element, index) => (
          <li key={index}>
            <Circle letter={element} state={ElementStates.Default} index={index} head={index === stack.size() - 1 ? 'top' : ''}/>
          </li>))
        }
      </ul>
    </SolutionLayout>

  );
};
