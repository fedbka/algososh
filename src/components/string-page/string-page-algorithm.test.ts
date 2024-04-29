import { describe, expect, test } from "vitest";
import { TSteps, reverseStringWithSteps } from "./string-page-algorithm";

const TEST_DATA = {
  evenNumberOfCharactersSting: "1234567890",
  reversedevenNumberOfCharactersSting: "0987654321",
  oddNumberOfCharactersSting: "123456789",
  reversedOddNumberOfCharactersSting: "987654321",
  oneCharacterString: "A",
  emptyString: "",
};

const getStringFromLastStep = (steps: TSteps) =>
  steps
    .pop()
    ?.map((el) => el.value)
    .join("");

describe("Тестирование алгоритма разворота строки функцией 'reverseStringWithSteps'", () => {
  test("Корректно разворачивает строку с чётным количеством символов", () => {
    const reversedString = getStringFromLastStep(
      reverseStringWithSteps(TEST_DATA.evenNumberOfCharactersSting)
    );
    expect(reversedString).toBe(TEST_DATA.reversedevenNumberOfCharactersSting);
  });

  test("Корректно разворачивает строку с нечётным количеством символов", () => {
    const reversedString = getStringFromLastStep(
      reverseStringWithSteps(TEST_DATA.oddNumberOfCharactersSting)
    );
    expect(reversedString).toBe(TEST_DATA.reversedOddNumberOfCharactersSting);
  });

  test("Корректно разворачивает строку с одним символом", () => {
    const reversedString = getStringFromLastStep(
      reverseStringWithSteps(TEST_DATA.oneCharacterString)
    );
    expect(reversedString).toBe(TEST_DATA.oneCharacterString);
  });

  test("Корректно разворачивает пустую строку", () => {
    const reversedString = getStringFromLastStep(
      reverseStringWithSteps(TEST_DATA.emptyString)
    );
    expect(reversedString).toBe(TEST_DATA.emptyString);
  });
});
