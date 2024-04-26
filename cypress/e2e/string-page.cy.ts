import {
  TSteps,
  reverseStringWithSteps,
} from "../../src/components/string-page/string-page-algorithm";

import { DELAY_IN_MS } from "../../src/constants/delays";
const TEST_DATA = {
  inputString: "hello",
  reversedInputString: "olleh",
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
});

describe("Проверка корректности разворота строки (пошагово)", () => {
  before(() => {
    cy.visit("/recursion");
    cy.get("button[type=submit]").as("submitButton");
    cy.get("input").as("textInput");
    cy.get("@textInput").type(TEST_DATA.inputString);
    cy.get("@submitButton").should("not.be.disabled");
    cy.get("@submitButton").click();
  });

  beforeEach(() => {
    cy.get("div[class*='circle']").as("letters");
  });

  it(`Проверка корректности разворота и анимации (пошаговая)`, () => {
    TEST_DATA.reverseSteps.forEach((step) => {
      cy.get("@submitButton").should("be.disabled");
      cy.get("@letters")
        .children()
        .should("have.length", TEST_DATA.inputString.length)
        .each((circle, index) => {
          cy.wrap(circle)
            .should("contain", step[index].value)
            .should("have.css", "border");
        });
      cy.wait(DELAY_IN_MS);
    });
    cy.get("@letters")
      .children()
      .should("have.length", TEST_DATA.inputString.length)
      .each((circle, index) => {
        cy.wrap(circle).should("contain", TEST_DATA.reversedInputString[index]);
      });
    cy.get("@submitButton").should("not.be.disabled");
  });
});
