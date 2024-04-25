import { describe, expect, test } from "vitest";
import { ElementStates } from "../../types/element-states";
import { TSteps, sortNumbers } from "./sorting-page-algoritm";

const TEST_DATA = {
  empty: [],
  oneNumber: [7],
  unsorted: [46, 84, 59, 87, 21, 23, 84, 28, 75, 98, 48],
  sortedAscendingOder: [21, 23, 28, 46, 48, 59, 75, 84, 84, 87, 98],
  sortedDescendingOder: [98, 87, 84, 84, 75, 59, 48, 46, 28, 23, 21],
};

const getNumbersFromLastStep = (steps: TSteps) =>
  steps.pop()?.map((el) => el.value);

describe("Тестирование алгоритмов сортировки выбором и пузырьком функцией 'sortNumbers'", () => {
  test("Корректно сортирует методом 'Выбор' пустой массив", () => {
    const sorted = getNumbersFromLastStep(
      sortNumbers(
        TEST_DATA.empty.map((el) => ({
          value: el,
          state: ElementStates.Default,
        })),
        "choice",
        "ascending"
      )
    );
    expect(sorted).toStrictEqual(TEST_DATA.empty);
  });

  test("Корректно сортирует методом 'Выбор' массив из одного числа", () => {
    const sorted = getNumbersFromLastStep(
      sortNumbers(
        TEST_DATA.oneNumber.map((el) => ({
          value: el,
          state: ElementStates.Default,
        })),
        "choice",
        "ascending"
      )
    );
    expect(sorted).toStrictEqual(TEST_DATA.oneNumber);
  });

  test("Корректно сортирует методом 'Выбор' массив из нескольких чисел по возрастанию", () => {
    const sorted = getNumbersFromLastStep(
      sortNumbers(
        TEST_DATA.unsorted.map((el) => ({
          value: el,
          state: ElementStates.Default,
        })),
        "choice",
        "ascending"
      )
    );
    expect(sorted).toStrictEqual(TEST_DATA.sortedAscendingOder);
  });

  test("Корректно сортирует методом 'Выбор' массив из нескольких чисел по убыванию", () => {
    const sorted = getNumbersFromLastStep(
      sortNumbers(
        TEST_DATA.unsorted.map((el) => ({
          value: el,
          state: ElementStates.Default,
        })),
        "choice",
        "descending"
      )
    );
    expect(sorted).toStrictEqual(TEST_DATA.sortedDescendingOder);
  });

  test("Корректно сортирует методом 'Пузырёк' пустой массив", () => {
    const sorted = getNumbersFromLastStep(
      sortNumbers(
        TEST_DATA.empty.map((el) => ({
          value: el,
          state: ElementStates.Default,
        })),
        "bubble",
        "ascending"
      )
    );
    expect(sorted).toStrictEqual(TEST_DATA.empty);
  });

  test("Корректно сортирует методом 'Пузырёк' массив из одного числа", () => {
    const sorted = getNumbersFromLastStep(
      sortNumbers(
        TEST_DATA.oneNumber.map((el) => ({
          value: el,
          state: ElementStates.Default,
        })),
        "bubble",
        "ascending"
      )
    );
    expect(sorted).toStrictEqual(TEST_DATA.oneNumber);
  });

  test("Корректно сортирует методом 'Пузырёк' массив из нескольких чисел по возрастанию", () => {
    const sorted = getNumbersFromLastStep(
      sortNumbers(
        TEST_DATA.unsorted.map((el) => ({
          value: el,
          state: ElementStates.Default,
        })),
        "bubble",
        "ascending"
      )
    );
    expect(sorted).toStrictEqual(TEST_DATA.sortedAscendingOder);
  });

  test("Корректно сортирует методом 'Пузырёк' массив из нескольких чисел по убыванию", () => {
    const sorted = getNumbersFromLastStep(
      sortNumbers(
        TEST_DATA.unsorted.map((el) => ({
          value: el,
          state: ElementStates.Default,
        })),
        "bubble",
        "descending"
      )
    );
    expect(sorted).toStrictEqual(TEST_DATA.sortedDescendingOder);
  });
});
