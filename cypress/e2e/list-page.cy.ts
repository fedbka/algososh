import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import { CIRCLE_BORDER_STYLES, SELECTOR_ACTION_BUTTON_ADD_BY_INDEX, SELECTOR_ACTION_BUTTON_APPEND, SELECTOR_ACTION_BUTTON_DELETE_BY_INDEX, SELECTOR_ACTION_BUTTON_DELETE_HEAD, SELECTOR_ACTION_BUTTON_DELETE_TAIL, SELECTOR_ACTION_BUTTON_PREPEND, SELECTOR_CIRCLES, SELECTOR_CIRCLES_CONTENT, SELECTOR_HEADS, SELECTOR_INDEXES, SELECTOR_INDEX_INPUT, SELECTOR_TAILS, SELECTOR_VALUE_INPUT } from "../support/constants";

const TEST_DATA = {
  addingText: "test",
  addingIndex: 1,
  deletingIndex: 1,
};
describe("Тестирование страницы 'Стек'", () => {
  beforeEach(() => {
    cy.visit("/list");
    cy.get(SELECTOR_VALUE_INPUT).as("valueInput");
    cy.get(SELECTOR_INDEX_INPUT).as("indexInput");
    cy.get(SELECTOR_ACTION_BUTTON_PREPEND).as("prepend");
    cy.get(SELECTOR_ACTION_BUTTON_APPEND).as("append");
    cy.get(SELECTOR_ACTION_BUTTON_DELETE_HEAD).as("deleteHead");
    cy.get(SELECTOR_ACTION_BUTTON_DELETE_TAIL).as("deleteTail");
    cy.get(SELECTOR_ACTION_BUTTON_ADD_BY_INDEX).as("addByIndex");
    cy.get(SELECTOR_ACTION_BUTTON_DELETE_BY_INDEX).as("deleteByIndex");

    cy.get(SELECTOR_CIRCLES_CONTENT).as("list");
    cy.get(SELECTOR_CIRCLES).as("circles");
    cy.get(SELECTOR_HEADS).as("heads");
    cy.get(SELECTOR_TAILS).as("tails");
    cy.get(SELECTOR_INDEXES).as("indexes");
  });

  it("Проверка условия - при пустом поле ввода значения кнопки добавления в список неактивна", () => {
    cy.checkButtonsUnavailabilityOnEmptyInputs("@valueInput", ["@prepend", "@append"]);
  });

  it("Проверка условия - при пустом поле ввода индекса кнопки удаления по индексу неактивна", () => {
    cy.checkButtonsUnavailabilityOnEmptyInputs("@indexInput", ["@deleteByIndex"]);
  });

  it("Проверка корректности отрисовки списка по-умолчанию", () => {
    cy.get("@list")
      .should("have.length.at.least", 3)
      .and("have.length.at.most", 6);
    cy.get("@heads").each((element, index) => {
      cy.wrap(element).should(index === 0 ? "not.be.empty" : "be.empty");
    });

    cy.get("@indexes").each((element, index) => {
      cy.wrap(element).should("contain", index.toString());
    });

    cy.get("@tails").each((element, index, list) => {
      cy.wrap(element).should(
        index === list.length - 1 ? "not.be.empty" : "be.empty"
      );
    });

    cy.get("@circles").each((element) => {
      cy.wrap(element).should(
        "have.css",
        "border",
        CIRCLE_BORDER_STYLES.default
      );
    });
  });

  it("Проверка добавления элемента в head", () => {
    cy.get("@valueInput").should("be.empty").type("test");
    cy.clock();
    cy.get("@prepend").should("not.be.disabled").click();
    cy.get("@circles")
      .first()
      .should("have.css", "border", CIRCLE_BORDER_STYLES.changing);
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@heads").first().should("contain", "test");
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@heads").first().should("contain", "head");
    cy.get("@circles")
      .first()
      .should("have.css", "border", CIRCLE_BORDER_STYLES.modified);
    cy.get("@list").first().should("contain", "test");
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@circles")
      .first()
      .should("have.css", "border", CIRCLE_BORDER_STYLES.default);

    cy.clock().then((clock) => {
      clock.restore();
    });
  });

  it("Проверка добавления элемента в tail", () => {
    cy.get("@valueInput").should("be.empty").type(TEST_DATA.addingText);
    cy.clock();
    cy.get("@append").should("not.be.disabled").click();
    cy.get("@circles")
      .last()
      .should("have.css", "border", CIRCLE_BORDER_STYLES.changing);
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@heads").last().should("contain", TEST_DATA.addingText);
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@heads").last().should("be.empty");
    cy.get("@circles")
      .last()
      .should("have.css", "border", CIRCLE_BORDER_STYLES.modified);
    cy.get("@list").last().should("contain", TEST_DATA.addingText);
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@circles")
      .last()
      .should("have.css", "border", CIRCLE_BORDER_STYLES.default);

    cy.clock().then((clock) => {
      clock.restore();
    });
  });

  it("Проверка добавления элемента по индексу", () => {
    cy.get("@valueInput").should("be.empty").type(TEST_DATA.addingText);
    cy.get("@indexInput")
      .should("be.empty")
      .type(TEST_DATA.addingIndex.toString());
    cy.clock();
    cy.get("@addByIndex").should("not.be.disabled").click();
    for (let index = 0; index <= TEST_DATA.addingIndex; index++) {
      cy.get("@circles")
        .eq(index)
        .should("have.css", "border", CIRCLE_BORDER_STYLES.changing);
      cy.tick(SHORT_DELAY_IN_MS);
    }
    cy.get("@heads")
      .eq(TEST_DATA.addingIndex)
      .should("contain", TEST_DATA.addingText);
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@heads").eq(TEST_DATA.addingIndex).should("be.empty");
    cy.get("@circles")
      .eq(TEST_DATA.addingIndex)
      .should("have.css", "border", CIRCLE_BORDER_STYLES.modified);
    cy.get("@list")
      .eq(TEST_DATA.addingIndex)
      .should("contain", TEST_DATA.addingText);
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@circles")
      .eq(TEST_DATA.addingIndex)
      .should("have.css", "border", CIRCLE_BORDER_STYLES.default);

    cy.clock().then((clock) => {
      clock.restore();
    });
  });

  it("Проверка удаления элемента из head", () => {
    cy.get("@circles").should("not.be.empty");
    cy.clock();
    cy.get("@deleteHead").should("not.be.disabled").click();
    cy.get("@circles")
      .first()
      .should("have.css", "border", CIRCLE_BORDER_STYLES.changing);
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@list").first().should("be.empty");
    cy.get("@tails").first().should("not.be.empty");
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@circles")
      .first()
      .should("have.css", "border", CIRCLE_BORDER_STYLES.modified);
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@circles")
      .first()
      .should("have.css", "border", CIRCLE_BORDER_STYLES.default);

    cy.clock().then((clock) => {
      clock.restore();
    });
  });

  it("Проверка удаления элемента из tail", () => {
    cy.get("@circles").should("not.be.empty");
    cy.clock();
    cy.get("@deleteTail").should("not.be.disabled").click();
    cy.get("@circles")
      .last()
      .should("have.css", "border", CIRCLE_BORDER_STYLES.changing);
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@list").last().should("be.empty");
    cy.get("@tails").last().should("not.be.empty");
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@circles")
      .last()
      .should("have.css", "border", CIRCLE_BORDER_STYLES.modified);
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@circles")
      .last()
      .should("have.css", "border", CIRCLE_BORDER_STYLES.default);

    cy.clock().then((clock) => {
      clock.restore();
    });
  });

  it("Проверка удаления элемента по индексу", () => {
    cy.get("@indexInput")
      .should("be.empty")
      .type(TEST_DATA.deletingIndex.toString());
    cy.clock();
    cy.get("@deleteByIndex").should("not.be.disabled").click();
    for (let index = 0; index <= TEST_DATA.deletingIndex; index++) {
      cy.get("@circles")
        .eq(index)
        .should("have.css", "border", CIRCLE_BORDER_STYLES.changing);
      cy.tick(SHORT_DELAY_IN_MS);
    }
    cy.get("@list").eq(TEST_DATA.deletingIndex).should("be.empty");
    cy.get("@tails").eq(TEST_DATA.deletingIndex).should("not.be.empty");
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@circles")
      .eq(TEST_DATA.deletingIndex)
      .should("have.css", "border", CIRCLE_BORDER_STYLES.modified);
    cy.tick(SHORT_DELAY_IN_MS);
    cy.get("@circles")
      .eq(TEST_DATA.deletingIndex)
      .should("have.css", "border", CIRCLE_BORDER_STYLES.default);

    cy.clock().then((clock) => {
      clock.restore();
    });
  });
});
