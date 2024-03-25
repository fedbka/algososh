import React, { useState } from "react";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { useForm } from "../../hooks/useForm";
import { Button } from "../ui/button/button";
import { Column } from "../ui/column/column";
import { RadioInput } from "../ui/radio-input/radio-input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { TElement, TSortingSteps, getRandomNumbers, sortNumbers } from "./sorting-page-algoritm";
import styles from "./sorting-page.module.css";

export const SortingPage: React.FC = () => {
  const { values, onChangeHandler } = useForm({ sortingType: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [steps, setSteps] = useState<TSortingSteps>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [numbers, setNumbers] = useState<TElement[]>([]);

  const newNumbers = (): void => {
    setNumbers(getRandomNumbers());
    setStepIndex(-2);
  }

  const startVisualization = (direction: string): void => {
    const newSteps = sortNumbers([...numbers.map(element => ({...element}))], values.sortingType as 'choice' | 'bubble', direction as 'ascending' | 'descending');
    setSteps(newSteps);
    setStepIndex(0);

    if (!newSteps.length) return;

    setIsLoading(true);
    let stepIndex = 0;
    const intervalId = setInterval(() => {
      if (stepIndex >= newSteps.length - 1) {
        clearInterval(intervalId);
        setIsLoading(false);
        return;
      }

      setStepIndex(++stepIndex);
    }, SHORT_DELAY_IN_MS);
  }

  return (
    <SolutionLayout title="Сортировка массива">
      <form className={styles.form}>
        <fieldset className={styles.form_radioInputs} disabled={isLoading}>
          <RadioInput label="Выбор" name="sortingType" onChange={onChangeHandler} value="choice" />
          <RadioInput label="Пузырёк" name="sortingType" onChange={onChangeHandler} value="bubble" />
        </fieldset>
        <fieldset className={styles.form_actions} disabled={isLoading}>
          <Button text="По возрастанию" type="button" onClick={() => startVisualization("ascending")} disabled={!values.sortingType} isLoader={isLoading} />
          <Button text="По убыванию" type="button" onClick={() => startVisualization("descending")} disabled={!values.sortingType} isLoader={isLoading} />
        </fieldset>
        <fieldset className={styles.form_otherActions} disabled={isLoading}>
          <Button type="button" text="Новый Массив" onClick={() => newNumbers()} isLoader={isLoading} />
        </fieldset>
      </form>
      <ul className={styles.diagram}>
        {(isLoading || stepIndex === (steps.length - 1)) && steps[stepIndex]?.map((element, index) => (
          <li key={index}>
            <Column index={element.value} state={element.state} />
          </li>))
        }
        {(!isLoading && stepIndex !== (steps.length - 1)) && numbers?.map((element, index) => (
          <li key={index}>
            <Column index={element.value} state={element.state} />
          </li>))
        }        
      </ul>
    </SolutionLayout>
  );
};
