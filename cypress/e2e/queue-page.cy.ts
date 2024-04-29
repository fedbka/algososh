import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import { ElementStates } from "../../src/types/element-states";
import {
  CIRCLE_BORDER_STYLES,
  SELECTOR_ACTION_BUTTON_ADD,
  SELECTOR_ACTION_BUTTON_CLEAR,
  SELECTOR_ACTION_BUTTON_DELETE,
  SELECTOR_CIRCLES,
  SELECTOR_HEADS,
  SELECTOR_TAILS,
  SELECTOR_VALUE_INPUT,
} from "../support/constants";

const TEST_DATA = {
  itemsForQueue: ["FIRS", "SECO", "THIR", "FOUR"],
};

describe("Тестирование страницы 'Очередь'", () => {
  beforeEach(() => {
    cy.visit("/queue");
    cy.get(SELECTOR_VALUE_INPUT).as("valueInput");
    cy.get(SELECTOR_ACTION_BUTTON_ADD).as("addButton");
    cy.get(SELECTOR_ACTION_BUTTON_DELETE).as("deleteButton");
    cy.get(SELECTOR_ACTION_BUTTON_CLEAR).as("clearButton");
    cy.get("p[class*='circle']").as("queue");
    cy.get(SELECTOR_CIRCLES).as("circles");
    cy.get(SELECTOR_HEADS).as("heads");
    cy.get(SELECTOR_TAILS).as("tails");
  });

  it("Проверка условия - при пустом поле ввода кнопка добавления в очередь неактивна", () => {
    cy.checkButtonsUnavailabilityOnEmptyInputs("@valueInput", ["@addButton"]);
  });

  it("Проверка условия - при пустой очереди кнопка очистки неактивна", () => {
    cy.checkButtonsUnavailabilityOnEmptyElement("@queue", [
      "@deleteButton",
      "@clearButton",
    ]);
  });

  it("Проверка правильности добавления элемента в очередь. ", () => {
    cy.get("@queue").each((element) => {
      cy.wrap(element).should("be.empty");
    });

    TEST_DATA.itemsForQueue.forEach((item, itemIndex) => {
      cy.get("@valueInput").should("be.empty").type(item);
      cy.clock();
      cy.get("@addButton").should("not.be.disabled").click();
      cy.get("@heads").eq(0).should("contain", "head");
      cy.get("@queue").eq(itemIndex).should("contain", item);
      cy.get("@circles")
        .eq(itemIndex)
        .then((element) =>
          cy.checkBorderStyle(element, ElementStates.Changing)
        );
      cy.get("@tails").eq(itemIndex).should("contain", "tail");

      cy.tick(SHORT_DELAY_IN_MS);
      cy.get("@circles")
        .eq(itemIndex)
        .then((element) =>
          cy.checkBorderStyle(element, ElementStates.Changing)
        );
      cy.clock().then((clock) => {
        clock.restore();
      });
    });

    cy.get("@valueInput").should("be.empty");
    cy.get("@addButton").should("be.disabled");
    cy.get("@deleteButton").should("not.be.disabled");
    cy.get("@clearButton").should("not.be.disabled");
  });

  it("Проверка правильности удаления элемента из очереди. ", () => {
    TEST_DATA.itemsForQueue.forEach((item) => {
      cy.typeValueToInputAndClickActionButton(
        "@valueInput",
        "@addButton",
        item,
        SHORT_DELAY_IN_MS * 2
      );
    });

    TEST_DATA.itemsForQueue.forEach((item, itemIndex) => {
      cy.clock();
      cy.get("@deleteButton").should("not.be.disabled").click();
      cy.get("@circles")
        .eq(itemIndex)
        .should("have.css", "border", CIRCLE_BORDER_STYLES.changing);
      cy.tick(SHORT_DELAY_IN_MS);
      cy.get("@queue").eq(itemIndex).should("be.empty");
      cy.get("@circles")
        .eq(itemIndex)
        .should("have.css", "border", CIRCLE_BORDER_STYLES.default);
      cy.get("@heads").eq(itemIndex).should("be.empty");
      itemIndex < TEST_DATA.itemsForQueue.length - 1 &&
        cy
          .get("@heads")
          .eq(itemIndex + 1)
          .should("contain", "head");

      cy.clock().then((clock) => {
        clock.restore();
      });
    });
  });

  it("Проверка правильности очистки очереди. ", () => {
    TEST_DATA.itemsForQueue.forEach((item) => {
      cy.typeValueToInputAndClickActionButton(
        "@valueInput",
        "@addButton",
        item,
        SHORT_DELAY_IN_MS * 2
      );
    });

    cy.clock();
    cy.get("@clearButton").should("not.be.disabled").click();

    cy.get("@circles").each((element) => {
      cy.checkBorderStyle(element, ElementStates.Changing);
    });
    cy.tick(SHORT_DELAY_IN_MS * 2);

    cy.clock().then((clock) => {
      clock.restore();
    });

    cy.get("@clearButton").should("be.disabled");
    cy.get("@deleteButton").should("be.disabled");
  });
});
