export const getFibonacciNumbers = (quantity: number): number[] => {
  const result: number[] = [];

  while (result.length <= quantity ) {
    if (result.length <= 1) {
      result.push(1);
      continue;
    }

    result.push(result[result.length - 2] + result[result.length - 1]);
  }

  return result;
};
