import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import { ElementStates } from "../../src/types/element-states";
import {
  SELECTOR_ACTION_BUTTON_ADD,
  SELECTOR_ACTION_BUTTON_CLEAR,
  SELECTOR_ACTION_BUTTON_DELETE,
  SELECTOR_CIRCLES,
  SELECTOR_CIRCLES_CONTENT,
  SELECTOR_HEADS,
  SELECTOR_VALUE_INPUT,
} from "../support/constants";

const TEST_DATA = {
  itemsForStack: ["FIRS", "SECO", "THIR", "FOUR"],
};

describe("Тестирование страницы 'Стек'", () => {
  beforeEach(() => {
    cy.visit("/stack");
    cy.get(SELECTOR_VALUE_INPUT).as("valueInput");
    cy.get(SELECTOR_ACTION_BUTTON_ADD).as("addButton");
    cy.get(SELECTOR_ACTION_BUTTON_DELETE).as("deleteButton");
    cy.get(SELECTOR_ACTION_BUTTON_CLEAR).as("clearButton");
    cy.get("[data-test-id='stack']").as("stack");
  });

  it("Проверка условия - при пустом поле ввода кнопка добавления неактивна", () => {
    cy.checkButtonsUnavailabilityOnEmptyInputs("@valueInput", ["@addButton"]);
  });

  it("Проверка условия - при пустом стеке кнопка очистки неактивна", () => {
    cy.checkButtonsUnavailabilityOnEmptyElement("@stack", [
      "@deleteButton",
      "@clearButton",
    ]);
  });

  it("Проверка правильности добавления элемента в стек. ", () => {
    cy.get("@stack").should("be.empty");

    TEST_DATA.itemsForStack.forEach((item, itemIndex) => {
      cy.get("@valueInput").should("be.empty").type(item);
      cy.clock();
      cy.get("@addButton").should("not.be.disabled").click();

      cy.get(SELECTOR_CIRCLES_CONTENT).as("values");
      cy.get(SELECTOR_CIRCLES).as("circles");
      cy.get(SELECTOR_HEADS).as("heads");

      cy.get("@stack").should("not.be.empty");
      cy.get("@values")
        .should("have.length", itemIndex + 1)
        .last()
        .should("contain", item);
      cy.get("@circles")
        .last()
        .then((element) =>
          cy.checkBorderStyle(element, ElementStates.Changing)
        );
      cy.get("@heads").last().should("contain", "top");
      cy.tick(SHORT_DELAY_IN_MS);
      cy.clock().then((clock) => {
        clock.restore();
      });
    });
  });

  it("Проверка правильности удаления элемента из стека. ", () => {
    TEST_DATA.itemsForStack.forEach((item) => {
      cy.typeValueToInputAndClickActionButton("@valueInput", "@addButton", item, SHORT_DELAY_IN_MS * 2);
    });

    cy.get(SELECTOR_CIRCLES_CONTENT).as("values");
    cy.get(SELECTOR_CIRCLES).as("circles");
    cy.get(SELECTOR_HEADS).as("heads");

    cy.get("@stack").should("not.be.empty");
    cy.get("@valueInput").should("be.empty");
    cy.get("@addButton").should("be.disabled");
    cy.get("@deleteButton").should("not.be.disabled");

    TEST_DATA.itemsForStack.reverse().forEach((item, itemIndex) => {
      cy.clock();
      cy.get("@deleteButton").should("not.be.disabled").click();

      cy.get("@stack").should("not.be.empty");
      cy.get("@values")
        .should("have.length", TEST_DATA.itemsForStack.length - itemIndex)
        .last()
        .should("contain", item);
      cy.get("@circles")
        .last()
        .then((element) =>
          cy.checkBorderStyle(element, ElementStates.Changing)
        );
      cy.get("@heads").last().should("contain", "top");

      cy.tick(SHORT_DELAY_IN_MS);

      cy.get("@stack").should("not.be.empty");
      cy.get("@values").should(
        "have.length",
        TEST_DATA.itemsForStack.length - (itemIndex + 1)
      );
      cy.clock().then((clock) => {
        clock.restore();
      });
    });
  });

  it("Проверка правильности очистки стека. ", () => {
    TEST_DATA.itemsForStack.forEach((item) => {
      cy.typeValueToInputAndClickActionButton("@valueInput", "@addButton", item, SHORT_DELAY_IN_MS * 2);
    });

    cy.get("@stack").should("not.be.empty");
    cy.get("@clearButton").should("not.be.disabled");

    cy.clock();
    cy.get("@clearButton").click();

    cy.get("@stack").should("not.be.empty");
    cy.get(SELECTOR_CIRCLES)
      .should("have.length", TEST_DATA.itemsForStack.length)
      .each((element) => cy.checkBorderStyle(element, ElementStates.Changing));

    cy.tick(SHORT_DELAY_IN_MS);
    cy.clock().then((clock) => {
      clock.restore();
    });
    cy.get("@stack")
      .should("be.empty")
      .get("@clearButton")
      .should("be.disabled")
      .get("@deleteButton")
      .should("be.disabled");
  });
});
