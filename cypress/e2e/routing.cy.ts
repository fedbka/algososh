import { APP_TITLE, ROUTES } from "../support/constants";

describe("Тестирование переходов по страницам", () => {
  it("Главная страница приложения отображается", () => {
    cy.visit("/");
    cy.contains(APP_TITLE);
  });

  ROUTES.forEach((route) => {
    describe(`Тестируем переход на страницу '${route.title}' и обратно`, () => {
      it(`Выполняем переход с главной страницы на страницу '${route.title}'`, () => {
        cy.visit("/");
        cy.get(`a[href*="${route.url}"]`).click();
        cy.url().should("include", route.url);
        cy.contains(route.title);
      });

      it(`Выполняем переход со страницы '${route.title}' на главную страницу`, () => {
        cy.visit(route.url);
        cy.get("button").contains("К оглавлению").click();
        cy.contains(APP_TITLE);
      });
    });
  });
});
