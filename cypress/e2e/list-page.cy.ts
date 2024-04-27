import { SHORT_DELAY_IN_MS } from "../../src/constants/delays";
import { CIRCLE_BORDER_STYLES } from "./constants";

const TEST_DATA = {
  addingText: "test",
  addingIndex: 1,
  deletingIndex: 2,
};
describe("Тестирование страницы 'Стек'", () => {
  beforeEach(() => {
    cy.visit("/list");
    cy.get("[data-test-id='textInput']").as("textInput");
    cy.get("[data-test-id='indexInput']").as("indexInput");
    cy.get("[data-test-id='prepend']").as("prepend");
    cy.get("[data-test-id='append']").as("append");
    cy.get("[data-test-id='deleteHead']").as("deleteHead");
    cy.get("[data-test-id='deleteTail']").as("deleteTail");
    cy.get("[data-test-id='addByIndex']").as("addByIndex");
    cy.get("[data-test-id='deleteByIndex']").as("deleteByIndex");

    cy.get("p[class*='circle']").as("list");
    cy.get("div[class*='circle']").as("circles");
    cy.get("div[class*='head']").as("heads");
    cy.get("div[class*='tail']").as("tails");
    cy.get("p[class*='index']").as("indexes");
  });

  it("Проверка условия - при пустом поле ввода значения кнопки добавления в список неактивна", () => {
    cy.get("@textInput")
      .should("be.empty")
      .get("@prepend")
      .should("be.disabled")
      .get("@append")
      .should("be.disabled")
      .get("@textInput")
      .type("test")
      .get("@prepend")
      .should("not.be.disabled")
      .get("@append")
      .should("not.be.disabled")
      .get("@textInput")
      .clear()
      .get("@prepend")
      .should("be.disabled")
      .get("@append")
      .should("be.disabled");
  });

  it("Проверка условия - при пустом поле ввода индекса кнопки удаления по индексу неактивна", () => {
    cy.get("@indexInput")
      .should("be.empty")
      .get("@deleteByIndex")
      .should("be.disabled")
      .get("@indexInput")
      .type("1")
      .get("@deleteByIndex")
      .should("not.be.disabled")
      .get("@indexInput")
      .clear()
      .get("@deleteByIndex")
      .should("be.disabled");
  });

  it("Проверка условия - при пустых полях ввода значения и индекса кнопка добавления по индексу неактивна", () => {
    cy.get("@textInput")
      .should("be.empty")
      .get("@indexInput")
      .should("be.empty")
      .get("@addByIndex")
      .should("be.disabled")
      .get("@textInput")
      .type("test")
      .get("@indexInput")
      .type("1")
      .get("@addByIndex")
      .should("not.be.disabled")
      .get("@textInput")
      .clear()
      .get("@indexInput")
      .clear()
      .get("@addByIndex")
      .should("be.disabled");
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
    cy.get("@textInput").should("be.empty").type("test");
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
    cy.get("@textInput").should("be.empty").type(TEST_DATA.addingText);
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
    cy.get("@textInput").should("be.empty").type(TEST_DATA.addingText);
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
