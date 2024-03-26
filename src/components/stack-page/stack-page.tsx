import React, { useState } from "react";
import { useForm } from "../../hooks/useForm";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { Button } from "../ui/button/button";

export const StackPage: React.FC = () => {
  const { values, onChangeHandler } = useForm({ textInput: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stack, setStack] = useState<Stack
  return (
    <SolutionLayout title="Стек">
      <form>
        <fieldset>
          <Input type="string" maxLength={4} value={values.textInput as string} name="textInput" placeholder="Введите текст" />
        </fieldset>
        <fieldset>
          <Button text="Добавить" type="button" isLoader={isLoading} disabled={!values.textInput} linkedList="small" />
          <Button text="Удалить" type="button" isLoader={isLoading} disabled={!values.textInput} linkedList="small" />
        </fieldset>
        <fieldset></fieldset>
      </form>
    </SolutionLayout>
  );
};
