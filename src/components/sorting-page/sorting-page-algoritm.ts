import { ElementStates } from "../../types/element-states";

export type TElement = {
  value: number;
  state: ElementStates;
};

export type TStep = TElement[];

export type TSteps = TStep[];

export const getRandomNumbers = (): TElement[] => {
  const minLength = 3;
  const maxLength = 17;
  const maxValue = 100;
  const randomNumbers: TElement[] = [];
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  for (let i = 0; i < length; i++) {
    randomNumbers.push({
      value: Math.floor(Math.random() * maxValue),
      state: ElementStates.Default,
    });
  }
  return randomNumbers;
};

export const sortNumbers = (
  numbers: TElement[],
  sortingType: "choice" | "bubble",
  direction: "ascending" | "descending"
): TSteps => {
  const result: TSteps = [];
  result.push([...numbers.map((element) => ({ ...element }))]);

  if (sortingType === "bubble") {
    for (let i = 0; i < numbers.length; i++) {
      for (let j = 0; j < numbers.length - i - 1; j++) {
        result.push(
          numbers.map((element, index) =>
            index === j || index === j + 1
              ? { ...element, state: ElementStates.Changing }
              : { ...element }
          )
        );
        if (
          (direction === "ascending" &&
            numbers[j].value > numbers[j + 1].value) ||
          (direction === "descending" &&
            numbers[j].value < numbers[j + 1].value)
        ) {
          [numbers[j], numbers[j + 1]] = [numbers[j + 1], numbers[j]];
        }
      }
      numbers[numbers.length - i - 1] = {
        ...numbers[numbers.length - i - 1],
        state: ElementStates.Modified,
      };
      result.push([...numbers.map((element) => ({ ...element }))]);
    }
  } else if (sortingType === "choice") {
    for (let i = 0; i < numbers.length; i++) {
      let indexMin = i;
      for (let k = i; k < numbers.length; k++) {
        result.push(
          numbers.map((element, index) =>
            index === k || index === indexMin
              ? { ...element, state: ElementStates.Changing }
              : { ...element }
          )
        );
        if (
          (direction === "descending" &&
            numbers[k].value > numbers[indexMin].value) ||
          (direction === "ascending" &&
            numbers[k].value < numbers[indexMin].value)
        ) {
          indexMin = k;
        }
      }
      if (indexMin !== i) {
        [numbers[i], numbers[indexMin]] = [numbers[indexMin], numbers[i]];
      }
      numbers[i] = { ...numbers[i], state: ElementStates.Modified };
      result.push([...numbers.map((element) => ({ ...element }))]);
    }
  }

  return result;
  console.log(result);
};
