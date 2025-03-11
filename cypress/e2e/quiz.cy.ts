describe("Quiz E2E", () => {
    beforeEach(() => {
      // Intercept the API call for quiz questions (optional, depending on your setup)
      cy.intercept("GET", "/api/questions/random", { fixture: "questions.json" }).as("getQuestions");
  
      // Visit the page where the quiz is located (adjust the URL if necessary)
      cy.visit("/quiz");
    });
  
    it("Starts the quiz", () => {
      // Start the quiz and check for the first question
      cy.contains("Start Quiz").click();
      cy.wait("@getQuestions");
      cy.get("h2").should("exist"); // Check if the first question appears
    });
  
    it("Runs through all quiz questions and shows score", () => {
      cy.contains("Start Quiz").click();
      cy.wait("@getQuestions");
  
      // Simulate answering all questions
      cy.fixture("questions.json").then((questions) => {
        questions.forEach((q: any) => {
          cy.get("h2").should("contain", q.question);
          cy.get("button").contains("1").click(); // Simulate answering each question
        });
      });
  
      // After completing the quiz, check for the "Take New Quiz" button
      cy.contains("Take New Quiz").should("be.visible");
    });
  
    it("Restarts the quiz after completion", () => {
      // Start the quiz and answer all questions
      cy.contains("Start Quiz").click();
      cy.wait("@getQuestions");
  
      cy.fixture("questions.json").then((questions) => {
        questions.forEach(() => {
          cy.get("button").contains("1").click(); // Simulate answering each question
        });
      });
  
      // After completing the quiz, the "Take New Quiz" button should be visible
      cy.contains("Take New Quiz").should("be.visible").click();
  
      // After clicking "Take New Quiz", check that the quiz starts again by verifying that the question appears
      cy.wait("@getQuestions");
      cy.get("h2").should("exist"); // Check if question appears
    });
  });