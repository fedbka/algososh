import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import { CIRCLE_BORDER_STYLES } from "./constants";

const TEST_DATA = {
  itemsForStack: ["FIRS", "SECO", "THIR", "FOUR"],
};

describe("Тестирование страницы 'Стек'", () => {
  beforeEach(() => {
    cy.visit("/stack");
    cy.get("[data-test-id='textInput']").as("textInput");
    cy.get("[data-test-id='add']").as("addButton");
    cy.get("[data-test-id='delete']").as("deleteButton");
    cy.get("[data-test-id='clear']").as("clearButton");
    cy.get("[data-test-id='stack']").as("stack");
  });

  it("Проверка условия - при пустом поле ввода кнопка добавления неактивна", () => {
    cy.get("@textInput")
      .should("be.empty")
      .get("@addButton")
      .should("be.disabled")
      .get("@textInput")
      .type("test")
      .get("@addButton")
      .should("not.be.disabled")
      .get("@textInput")
      .clear()
      .get("@addButton")
      .should("be.disabled");
  });

  it("Проверка условия - при пустом стеке кнопка очистки неактивна", () => {
    cy.get("@stack")
      .should("be.empty")
      .get("@deleteButton")
      .should("be.disabled")
      .get("@clearButton")
      .should("be.disabled");
  });

  it("Проверка правильности добавления элемента в стек. ", () => {
    cy.get("@stack").should("be.empty");

    TEST_DATA.itemsForStack.forEach((item, itemIndex) => {
      cy.get("@textInput").should("be.empty").type(item);
      cy.clock();
      cy.get("@addButton").should("not.be.disabled").click();
      cy.get("@stack")
        .should("not.be.empty")
        .children()
        .should("have.length", itemIndex + 1)
        .last()
        .children()
        .children()
        .then(($childrenOflastElement) => {
          cy.wrap($childrenOflastElement).eq(0).contains("top");
          cy.wrap($childrenOflastElement)
            .eq(1)
            .should("have.css", "border", CIRCLE_BORDER_STYLES.changing)
            .children()
            .eq(0)
            .contains(item);
          cy.wrap($childrenOflastElement).eq(2).contains(itemIndex.toString());
        });
      cy.tick(SHORT_DELAY_IN_MS);
      cy.clock().then((clock) => {
        clock.restore();
      });
    });

    cy.get("@stack")
      .should("not.be.empty")
      .get("@textInput")
      .should("be.empty")
      .get("@addButton")
      .should("be.disabled")
      .get("@deleteButton")
      .should("not.be.disabled")
      .get("@clearButton")
      .should("not.be.disabled");
  });

  it("Проверка правильности удаления элемента из стека. ", () => {
    TEST_DATA.itemsForStack.forEach((item) => {
      cy.get("@textInput").should("be.empty").type(item);
      cy.clock();
      cy.get("@addButton").should("not.be.disabled").click();
      cy.tick(SHORT_DELAY_IN_MS);
      cy.tick(SHORT_DELAY_IN_MS);
      cy.clock().then((clock) => {
        clock.restore();
      });
    });

    cy.get("@stack")
      .should("not.be.empty")
      .get("@textInput")
      .should("be.empty")
      .get("@addButton")
      .should("be.disabled")
      .get("@deleteButton")
      .should("not.be.disabled");

    TEST_DATA.itemsForStack.reverse().forEach((item, itemIndex) => {
      cy.clock();
      cy.get("@deleteButton").should("not.be.disabled").click();
      cy.get("@stack")
        .should("not.be.empty")
        .children()
        .should("have.length", TEST_DATA.itemsForStack.length - itemIndex)
        .last()
        .children()
        .children()
        .then(($childrenOflastElement) => {
          cy.wrap($childrenOflastElement).eq(0).contains("top");
          cy.wrap($childrenOflastElement)
            .eq(1)
            .should("have.css", "border", CIRCLE_BORDER_STYLES.changing)
            .children()
            .eq(0)
            .contains(item);
          cy.wrap($childrenOflastElement)
            .eq(2)
            .contains(
              (TEST_DATA.itemsForStack.length - 1 - itemIndex).toString()
            );
        });
      cy.tick(SHORT_DELAY_IN_MS);
      cy.get("@stack")
        .should("not.be.empty")
        .children()
        .should(
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
      cy.get("@textInput").should("be.empty").type(item);
      cy.clock();
      cy.get("@addButton").should("not.be.disabled").click();
      cy.tick(SHORT_DELAY_IN_MS);
      cy.tick(SHORT_DELAY_IN_MS);
      cy.clock().then((clock) => {
        clock.restore();
      });
    });

    cy.get("@stack")
      .should("not.be.empty")
      .get("@clearButton")
      .should("not.be.disabled");

    cy.clock();
    cy.get("@clearButton").click();

    cy.get("@stack")
      .should("not.be.empty")
      .children()
      .should("have.length", TEST_DATA.itemsForStack.length)
      .each((element) => {
        cy.wrap(element)
          .children()
          .children()
          .eq(1)
          .should("have.css", "border", CIRCLE_BORDER_STYLES.changing);
      });

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
