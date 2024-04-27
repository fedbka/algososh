import { APP_TITLE } from "../../src/constants/tests";

describe("Тестирование работоспособности приложения", () => {
  it("Наше приложение поднялось.", () => {
    cy.visit("/");
  });

  it("Главная страница приложения отображается", () => {
    cy.visit("/");
    cy.contains(APP_TITLE);
  });
});
