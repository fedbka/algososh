import { ElementStates } from "../../types/element-states";

export type TLetter = {
  value: string;
  state: ElementStates;
};

export type TLetters = TLetter[];

export type TSteps = TLetters[];

export const reverseStringWithSteps = (text: string): TSteps => {
  const result: TSteps = [];
  let letters: TLetters = text
    .split("")
    .map((letter: string) => ({ value: letter, state: ElementStates.Default }));
  result.push(letters);

  let start = 0;
  let end = letters.length - 1;
  while (start < end) {
    letters = letters.map((letter, index) =>
      index === start || index === end
        ? { ...letter, state: ElementStates.Changing }
        : { ...letter }
    );
    result.push(letters);

    letters = [...letters];
    [letters[start], letters[end]] = [
      { ...letters[end], state: ElementStates.Modified },
      { ...letters[start], state: ElementStates.Modified },
    ];
    result.push(letters);

    start++;
    end--;
  }

  if (letters[start].state !== ElementStates.Modified) {
    letters = letters.map((letter, index) =>
      index != start
        ? { ...letter }
        : { ...letter, state: ElementStates.Modified }
    );
    result.push(letters);
  }
  return result;
};
