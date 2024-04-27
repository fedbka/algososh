import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import { CIRCLE_BORDER_STYLES } from "./constants";

const TEST_DATA = {
  itemsForQueue: ["FIRS", "SECO", "THIR", "FOUR"],
};

describe("Тестирование страницы 'Очередь'", () => {
  beforeEach(() => {
    cy.visit("/queue");
    cy.get("[data-test-id='textInput']").as("textInput");
    cy.get("[data-test-id='add']").as("addButton");
    cy.get("[data-test-id='delete']").as("deleteButton");
    cy.get("[data-test-id='clear']").as("clearButton");
    cy.get("p[class*='circle']").as("queue");
    cy.get("div[class*='circle']").as("circles");
    cy.get("div[class*='head']").as("heads");
    cy.get("div[class*='tail']").as("tails");
  });

  it("Проверка условия - при пустом поле ввода кнопка добавления в очередь неактивна", () => {
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

  it("Проверка условия - при пустой очереди кнопка очистки неактивна", () => {
    cy.get("@queue")
      .each((element) => {
        cy.wrap(element).should("be.empty");
      })
      .get("@deleteButton")
      .should("be.disabled")
      .get("@clearButton")
      .should("be.disabled");
  });

  it("Проверка правильности добавления элемента в очередь. ", () => {
    cy.get("@queue").each((element) => {
      cy.wrap(element).should("be.empty");
    });

    TEST_DATA.itemsForQueue.forEach((item, itemIndex) => {
      cy.get("@textInput").should("be.empty").type(item);
      cy.clock();
      cy.get("@addButton").should("not.be.disabled").click();
      cy.get("@heads").eq(0).should("contain", "head");
      cy.get("@queue").eq(itemIndex).should("contain", item);
      cy.get("@circles")
        .eq(itemIndex)
        .should("have.css", "border", CIRCLE_BORDER_STYLES.changing);
      cy.get("@tails").eq(itemIndex).should("contain", "tail");

      cy.tick(SHORT_DELAY_IN_MS);
      cy.get("@circles")
        .eq(itemIndex)
        .should("have.css", "border", CIRCLE_BORDER_STYLES.default);
      cy.clock().then((clock) => {
        clock.restore();
      });
    });

    cy.get("@textInput")
      .should("be.empty")
      .get("@addButton")
      .should("be.disabled")
      .get("@deleteButton")
      .should("not.be.disabled")
      .get("@clearButton")
      .should("not.be.disabled");
  });

  it("Проверка правильности удаления элемента из очереди. ", () => {
    TEST_DATA.itemsForQueue.forEach((item) => {
      cy.get("@textInput").should("be.empty").type(item);
      cy.clock();
      cy.get("@addButton").should("not.be.disabled").click();
      cy.tick(SHORT_DELAY_IN_MS);
      cy.tick(SHORT_DELAY_IN_MS);
      cy.clock().then((clock) => {
        clock.restore();
      });
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
      cy.get("@textInput").should("be.empty").type(item);
      cy.clock();
      cy.get("@addButton").should("not.be.disabled").click();
      cy.tick(SHORT_DELAY_IN_MS);
      cy.tick(SHORT_DELAY_IN_MS);
      cy.clock().then((clock) => {
        clock.restore();
      });
    });

    cy.clock();
    cy.get("@clearButton").should("not.be.disabled").click();

    cy.get("@circles").each((element) => {
      cy.wrap(element).should(
        "have.css",
        "border",
        CIRCLE_BORDER_STYLES.changing
      );
    });

    cy.tick(SHORT_DELAY_IN_MS);
    cy.tick(SHORT_DELAY_IN_MS);

    cy.clock().then((clock) => {
      clock.restore();
    });

    cy.get("@clearButton")
      .should("be.disabled")
      .get("@deleteButton")
      .should("be.disabled");
  });
});
