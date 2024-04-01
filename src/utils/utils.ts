export const getRandomValues = (): string[] => {
  const minLength = 3;
  const maxLength = 6;
  const maxValue = 100;
  const randomNumbers: string[] = [];
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  for (let i = 0; i < length; i++) {
    randomNumbers.push(Math.floor(Math.random() * maxValue).toString());
  }
  return randomNumbers;
}
