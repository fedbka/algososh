import {
  TSteps,
  reverseStringWithSteps,
} from "../../src/components/string-page/string-page-algorithm";

import { DELAY_IN_MS } from "../../src/constants/delays";
import { ElementStates } from "../../src/types/element-states";
import { CIRCLE_BORDER_STYLES } from "./constants";

const TEST_DATA = {
  inputString: "АНДРЕЙ",
  reversedInputString: "ЙЕРДНА",
  reverseSteps: [] as TSteps,
};

TEST_DATA.reverseSteps = reverseStringWithSteps(TEST_DATA.inputString);

describe("Тестирование страницы 'Строка'", () => {
  beforeEach(() => {
    cy.visit("/recursion");
    cy.get("button[type=submit]").as("submitButton");
    cy.get("input").as("textInput");
  });

  it("Проверка условия - при пустом поле ввода кнопка запуска действия неактивна", () => {
    cy.get("@textInput").should("be.empty");
    cy.get("@submitButton").should("be.disabled");
    cy.get("@textInput").type(TEST_DATA.inputString);
    cy.get("@submitButton").should("not.be.disabled");
    cy.get("@textInput").clear();
    cy.get("@submitButton").should("be.disabled");
  });

  it(`Проверка корректности разворота и анимации (пошаговая)`, () => {
    cy.get("@textInput").type(TEST_DATA.inputString);
    cy.get("@submitButton").should("not.be.disabled");
    cy.get("@submitButton").click();
    cy.clock();

    cy.get("div[class*='circle']").as("letters");

    TEST_DATA.reverseSteps.forEach((step) => {
      cy.get("@submitButton").should("be.disabled");
      cy.get("@letters")
        .children()
        .should("have.length", TEST_DATA.inputString.length)
        .each((circle, index) => {
          cy.wrap(circle)
            .should("contain", step[index].value)
            .parent()
            .should(
              "have.css",
              "border",
              step[index].state == ElementStates.Default
                ? CIRCLE_BORDER_STYLES.default
                : step[index].state == ElementStates.Changing
                ? CIRCLE_BORDER_STYLES.changing
                : CIRCLE_BORDER_STYLES.modified
            );
        });
      cy.tick(DELAY_IN_MS);
    });

    cy.get("@letters")
      .children()
      .should("have.length", TEST_DATA.inputString.length)
      .each((circle, index) => {
        cy.wrap(circle).should("contain", TEST_DATA.reversedInputString[index])
        .parent()
        .should(
          "have.css",
          "border",
          CIRCLE_BORDER_STYLES.modified);
      });
    cy.get("@textInput").should("be.empty");
    cy.get("@submitButton").should("be.disabled");
  });
});
