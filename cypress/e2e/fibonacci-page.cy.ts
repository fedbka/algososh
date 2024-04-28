import { getFibonacciNumbers } from "../../src/components/fibonacci-page/fibonacci-page-algorithm";

import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import { ElementStates } from "../../src/types/element-states";
import {
  SELECTOR_ACTION_BUTTON,
  SELECTOR_CIRCLES,
  SELECTOR_CIRCLES_CONTENT,
  SELECTOR_VALUE_INPUT,
} from "../support/constants";

const TEST_DATA = {
  numbersQuantity: 12,
  fibonacciNumbers: [] as number[],
};

TEST_DATA.fibonacciNumbers = getFibonacciNumbers(TEST_DATA.numbersQuantity);

describe("Тестирование страницы 'Фибоначчи'", () => {
  beforeEach(() => {
    cy.visit("/fibonacci");
    cy.get(SELECTOR_VALUE_INPUT).as("valueInput");
    cy.get(SELECTOR_ACTION_BUTTON).as("actionButton");
  });

  it("Проверка условия - при пустом поле ввода кнопка запуска действия неактивна", () => {
    cy.checkButtonsUnavailabilityOnEmptyInputs("@valueInput", [
      "@actionButton",
    ]);
  });

  it(`Проверка корректности разворота и анимации (пошаговая)`, () => {
    cy.get("@valueInput").type(TEST_DATA.numbersQuantity.toString());
    cy.get("@actionButton").should("not.be.disabled");
    cy.clock();
    cy.get("@actionButton").click();

    cy.get(SELECTOR_CIRCLES_CONTENT).as("numbers");
    cy.get(SELECTOR_CIRCLES).as("circles");

    TEST_DATA.fibonacciNumbers.forEach((fibonacciNumber, stepIndex) => {
      cy.get("@actionButton").should("be.disabled");
      cy.get("@numbers")
        .should("have.length", stepIndex + 1)
        .each((circle, index) => {
          cy.wrap(circle).should("contain", TEST_DATA.fibonacciNumbers[index]);
        });

      cy.get("@circles")
        .should("have.length", stepIndex + 1)
        .each((circle) => {
          cy.checkBorderStyle(circle, ElementStates.Default);
        });

      cy.tick(SHORT_DELAY_IN_MS);
    });
    cy.get("@valueInput").should("be.empty");
    cy.get("@actionButton").should("be.disabled");

    cy.clock().then((clock) => {
      clock.restore();
    });
  });
});
