import React, { useState } from "react";
import { DELAY_IN_MS } from "../../constants/delays";
import { useForm } from "../../hooks/useForm";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { TLetters, reverseStringWithSteps } from "./string-page-algorithm";
import styles from "./string-page.module.css";

export const StringComponent: React.FC = () => {
  const { values, onChangeHandler, setValues } = useForm({ textInput: "" });
  const [isLoading, setLoading] = useState<boolean>(false);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [steps, setSteps] = useState<TLetters[]>([]);

  const startVisualization = (): void => {

    const newSteps = reverseStringWithSteps(values.textInput as string);

    setSteps(newSteps);
    setStepIndex(0);

    if (!newSteps.length) return;

    setLoading(true);

    let stepIndex = 0;
    const intervalId = setInterval(() => {
      if (stepIndex >= newSteps.length - 1) {
        clearInterval(intervalId);
        setValues({ ...values, textInput: "" });
        setLoading(false);
        return;
      }

      setStepIndex(++stepIndex);
    }, DELAY_IN_MS);
  };

  return (
    <SolutionLayout title="Строка">
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <Input name="textInput" value={values.textInput as string} placeholder="Введите текст" type="text" maxLength={11} isLimitText={true} onChange={onChangeHandler} extraClass={styles.input} disabled={isLoading} data-test-id="valueInput" />
        <Button type="submit" text="Развернуть" disabled={!values.textInput || isLoading} isLoader={isLoading} onClick={startVisualization} data-test-id="actionButton" />
      </form>
      <ul className={styles.letters}>
        {steps[stepIndex]?.map((letter, index) => (
          <li key={index}>
            <Circle letter={letter.value} state={letter.state} />
          </li>
        ))}
      </ul>
    </SolutionLayout>
  );
};
