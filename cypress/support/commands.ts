/// <reference types="cypress" />

import { ElementStates } from "../../src/types/element-states";
import { CIRCLE_BORDER_STYLES } from "./constants";

Cypress.Commands.add(
  "checkButtonsUnavailabilityOnEmptyInputs",
  (inputSelector: string, buttonsSelectors: string[]) => {
    cy.get(inputSelector).should("be.empty");
    buttonsSelectors.forEach((selector) => {
      cy.get(selector).should("be.disabled");
    });

    cy.get(inputSelector).type("1");
    buttonsSelectors.forEach((selector) => {
      cy.get(selector).should("not.be.disabled");
    });

    cy.get(inputSelector).clear();
    buttonsSelectors.forEach((selector) => {
      cy.get(selector).should("be.disabled");
    });
  }
);

Cypress.Commands.add(
  "checkButtonsUnavailabilityOnEmptyElement",
  (inputSelector: string, buttonsSelectors: string[]) => {
    cy.get(inputSelector).should("be.empty");
    buttonsSelectors.forEach((selector) => {
      cy.get(selector).should("be.disabled");
    });
  }
);

Cypress.Commands.add(
  "checkBorderStyle",
  (element: JQuery<HTMLElement>, state: ElementStates) => {
    cy.wrap(element).should(
      "have.css",
      "border",
      state === ElementStates.Default
        ? CIRCLE_BORDER_STYLES.default
        : state === ElementStates.Changing
        ? CIRCLE_BORDER_STYLES.changing
        : CIRCLE_BORDER_STYLES.modified
    );
  }
);

Cypress.Commands.add(
  "typeValueToInputAndClickActionButton", (inputSelector:string, actionButtonSelector:string, value:string, tick:number) => {
    cy.get(inputSelector).should("be.empty").type(value);
    cy.clock();
    cy.get(actionButtonSelector).should("not.be.disabled").click();
    cy.tick(tick);
    cy.clock().then((clock) => {
      clock.restore();
    });    
  }
)

