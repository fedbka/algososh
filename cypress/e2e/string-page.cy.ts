import {
  TSteps,
  reverseStringWithSteps,
} from "../../src/components/string-page/string-page-algorithm";

import { DELAY_IN_MS } from "../../src/constants/delays";
import {
  SELECTOR_ACTION_BUTTON,
  SELECTOR_CIRCLES,
  SELECTOR_CIRCLES_CONTENT,
  SELECTOR_VALUE_INPUT,
} from "../support/constants";

const TEST_DATA = {
  inputString: "АНДРЕЙ",
  reversedInputString: "ЙЕРДНА",
  steps: [] as TSteps,
};

TEST_DATA.steps = reverseStringWithSteps(TEST_DATA.inputString);

describe("Тестирование страницы 'Строка'", () => {
  beforeEach(() => {
    cy.visit("/recursion");
    cy.get(SELECTOR_VALUE_INPUT).as("valueInput");
    cy.get(SELECTOR_ACTION_BUTTON).as("actionButton");
  });

  it("Проверка условия - при пустом поле ввода кнопка запуска действия неактивна", () => {
    cy.checkButtonsUnavailabilityOnEmptyInputs("@valueInput", [
      "@actionButton",
    ]);
  });

  it(`Проверка корректности разворота и анимации (пошаговая)`, () => {
    cy.get("@valueInput").type(TEST_DATA.inputString);
    cy.get("@actionButton").should("not.be.disabled");
    cy.clock();
    cy.get("@actionButton").click();

    cy.get(SELECTOR_CIRCLES_CONTENT).as("letters");
    cy.get(SELECTOR_CIRCLES).as("circles");

    TEST_DATA.steps.forEach((step) => {
      cy.get("@actionButton").should("be.disabled");
      cy.get("@letters")
        .should("have.length", TEST_DATA.inputString.length)
        .each((letter, index) => {
          cy.wrap(letter).should("contain", step[index].value);
        });
      cy.get("@circles")
        .should("have.length", TEST_DATA.inputString.length)
        .each((circle, index) => {
          cy.checkBorderStyle(circle, step[index].state);         
        });
      cy.tick(DELAY_IN_MS);
    });

    cy.clock().then((clock) => {
      clock.restore();
    });
    cy.get("@valueInput").should("be.empty");
    cy.get("@actionButton").should("be.disabled");
  });
});
