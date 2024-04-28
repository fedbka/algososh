import React, { useState } from "react";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { useForm } from "../../hooks/useForm";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { getFibonacciNumbers } from "./fibonacci-page-algorithm";
import styles from "./fibonacci-page.module.css";
import { ElementStates } from "../../types/element-states";

export const FibonacciPage: React.FC = () => {
  const { values, onChangeHandler, setValues } = useForm({ numberInput: "" });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [fiboNumbers, setFiboNumbers] = useState<number[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const minNumber = 0;
  const maxNumber = 19;

  const startVisualization = () => {
    const numbers = getFibonacciNumbers(Number(values.numberInput));

    setFiboNumbers(numbers);
    setStepIndex(0);

    if (!numbers.length) return;

    setLoading(true);
    let stepIndex = 0;
    const intervalId = setInterval(() => {
      if (stepIndex >= numbers.length - 1) {
        clearInterval(intervalId);
        setValues({ ...values, numberInput: "" })
        setLoading(false);
        return;
      }

      setStepIndex(++stepIndex);
    }, SHORT_DELAY_IN_MS);
  };


  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <Input name="numberInput" placeholder="Введите число" type="number" value={Number(values.numberInput)} isLimitText={true} min={minNumber} max={maxNumber} extraClass={styles.input} onChange={onChangeHandler} disabled={isLoading} data-test-id="valueInput" />
        <Button type="submit" text="Рассчитать" disabled={isLoading || !values.numberInput || Number(values.numberInput) > maxNumber || Number(values.numberInput) < minNumber} isLoader={isLoading} onClick={startVisualization} data-test-id="actionButton"/>
      </form>
      <ul className={styles.numbers}>
        {fiboNumbers.map((fiboNumber, index) => index <= stepIndex ? (
          <li key={index}>
            <Circle index={index} letter={fiboNumber.toString()} state={ElementStates.Default}/>
          </li>
        ) : null)}
      </ul>
    </SolutionLayout>
  );
};
