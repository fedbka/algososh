import { getFibonacciNumbers } from "../../src/components/fibonacci-page/fibonacci-page-algorithm";

import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import { CIRCLE_BORDER_STYLES } from "./constants";

const TEST_DATA = {
  numbersQuantity: 12,
  fibonacciNumbers: [] as number[],
};

TEST_DATA.fibonacciNumbers = getFibonacciNumbers(TEST_DATA.numbersQuantity);

describe("Тестирование страницы 'Фибоначчи'", () => {
  beforeEach(() => {
    cy.visit("/fibonacci");
    cy.get("button[type=submit]").as("submitButton");
    cy.get("input").as("textInput");
  });

  it("Проверка условия - при пустом поле ввода кнопка запуска действия неактивна", () => {
    cy.get("@textInput").should("be.empty");
    cy.get("@submitButton").should("be.disabled");
    cy.get("@textInput").type(TEST_DATA.numbersQuantity.toString());
    cy.get("@submitButton").should("not.be.disabled");
    cy.get("@textInput").clear();
    cy.get("@submitButton").should("be.disabled");
  });

  it(`Проверка корректности разворота и анимации (пошаговая)`, () => {
    cy.get("@textInput").type(TEST_DATA.numbersQuantity.toString());
    cy.get("@submitButton").should("not.be.disabled");
    cy.clock();
    cy.get("@submitButton").click();
    cy.get("div[class*='circle']").as("numbers");

    TEST_DATA.fibonacciNumbers.forEach((fibonacciNumber, stepIndex) => {
      cy.get("@submitButton").should("be.disabled");
      cy.get("@numbers")
        .children()
        .should("have.length", stepIndex + 1)
        .each((circle, index) => {
          cy.wrap(circle)
            .should("contain", TEST_DATA.fibonacciNumbers[index])
            .parent()
            .should("have.css", "border", CIRCLE_BORDER_STYLES.default);
        });
      cy.tick(SHORT_DELAY_IN_MS);
    });
    cy.get("@textInput").should("be.empty");
    cy.get("@submitButton").should("be.disabled");

    cy.clock().then((clock) => {
      clock.restore();
    });
  });
});
