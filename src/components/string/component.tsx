import React, { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { Button } from "../ui/button/button";
import { Input } from "../ui/input/input";
import { Circle } from "../ui/circle/circle";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { TLetters, reverseStringWithSteps } from "./algo";
import styles from "./component.module.css";
import { DELAY_IN_MS } from "../../constants/delays";

export const StringComponent: React.FC = () => {
  const { values, onChangeHandler } = useForm({ textInput: "" });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [steps, setSteps] = useState<TLetters[]>([]);

  const onSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const newSteps = reverseStringWithSteps(values.textInput as string);
    setSteps(newSteps);

    setCurrentStepIndex(0);
 
    if (!newSteps.length) return;
    
    setLoading(true);
    let stepIndex = 0;
    const intervalId = setInterval(() => {
      if (stepIndex >= newSteps.length - 1) {
        clearInterval(intervalId);
        setLoading(false);
        return;
      }

      setCurrentStepIndex(++stepIndex);
    }, DELAY_IN_MS);
  };

  return (
    <SolutionLayout title="Строка">
      <form className={styles.form} onSubmit={onSubmitHandler}>
        <Input name="textInput" placeholder="Введите текст" type="text" maxLength={11} isLimitText={true} onChange={onChangeHandler} extraClass={styles.input} disabled={isLoading}/>
        <Button type="submit" text="Развернуть" disabled={!values.textInput} isLoader={isLoading} />
      </form>
      <ul className={styles.letters}>
        {steps[currentStepIndex]?.map((letter, index) => (
          <li key={index}>
            <Circle letter={letter.value} state={letter.state} />
          </li>
        ))}
      </ul>
    </SolutionLayout>
  );
};
