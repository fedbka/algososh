import React, { useState } from "react";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { useForm } from "../../hooks/useForm";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { fibonachiNumbers } from "./fibonacci-page-algorithm";
import styles from "./fibonacci-page.module.css";

export const FibonacciPage: React.FC = () => {
  const { values, onChangeHandler } = useForm({ numberInput: "" });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [fiboNumbers, setFiboNumbers] = useState<number[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const maxNumber = 19;

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const numbers = fibonachiNumbers(values.numberInput as number);

    setFiboNumbers(numbers);

    setCurrentStepIndex(0);

    if (!numbers.length) return;

    setLoading(true);
    let stepIndex = 0;
    const intervalId = setInterval(() => {
      if (stepIndex >= numbers.length - 1) {
        clearInterval(intervalId);
        setLoading(false);
        return;
      }

      setCurrentStepIndex(++stepIndex);
    }, SHORT_DELAY_IN_MS);
  };


  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <form className={styles.form} onSubmit={onSubmitHandler}>
        <Input name="numberInput" placeholder="Введите число" type="number" isLimitText={true} min={0} max={maxNumber} extraClass={styles.input} onChange={onChangeHandler} disabled={isLoading}/>
        <Button type="submit" text="Рассчитать" disabled={!values.numberInput || values.numberInput as number > maxNumber} isLoader={isLoading} />
      </form>
      <ul className={styles.numbers}>
        {fiboNumbers.map((fiboNumber, index) => index <= currentStepIndex ? (
          <li key={index}>
            <Circle index={index} letter={fiboNumber.toString()} />
          </li>
        ) : null)}
      </ul>
    </SolutionLayout>
  );
};
