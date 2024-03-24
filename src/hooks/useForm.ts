import { useState } from "react";

export function useForm(inputValues: Record<string, string | number | boolean>) {
  const [values, setValues] = useState(inputValues);
  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({...values, [name]: value});
  }
  return {values, onChangeHandler, setValues};
};