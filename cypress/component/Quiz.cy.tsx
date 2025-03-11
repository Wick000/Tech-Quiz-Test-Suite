//import React from 'react'
import Quiz from '../../client/src/components/Quiz'
import { mount } from "cypress/react";


describe("Quiz Component", () => {
  beforeEach(() => {
    cy.intercept("GET", "/api/questions/random", { fixture: "questions.json" }).as("getQuestions");
    mount(<Quiz />);
  });

  it("Starts the quiz", () => {
    cy.contains("Start Quiz").should("be.visible").click(); 
    cy.wait("@getQuestions");
    cy.get("h2").should("exist"); 
  });

  it("Runs through all quiz questions and shows score", () => {
    cy.contains("Start Quiz").should("be.visible").click(); 
    cy.wait("@getQuestions");

    cy.fixture("questions.json").then((questions) => {
      questions.forEach((q: any) => {
        cy.get("h2").should("contain", q.question); 
        cy.get("button").contains("1").click(); 
      });
    });

    
    cy.contains("Quiz Completed").should("be.visible");
    cy.contains("Your score:").should("be.visible");
  });

  it("Restarts the quiz after completion", () => {
    cy.contains("Start Quiz").should("be.visible").click(); 
    cy.wait("@getQuestions");

    cy.fixture("questions.json").then((questions) => {
      questions.forEach(() => {
        cy.get("button").contains("1").click(); 
      });
    });

   
    cy.contains("Take New Quiz").should("be.visible").click();

   
   cy.wait("@getQuestions");
   cy.get("h2").should("exist");
  });
});
