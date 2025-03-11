describe("Quiz E2E", () => {
    beforeEach(() => {
      cy.intercept("GET", "/api/questions/random").as("getQuestions");
  
      cy.visit("/quiz");
    });
  
    it("Starts the quiz", () => {
      cy.contains("Start Quiz").click();
  
      cy.wait("@getQuestions");
  
      cy.get("h2").should("be.visible").and("exist");
    });
  
    it("Runs through all quiz questions and shows score", () => {
      cy.contains("Start Quiz").click();
  
      cy.wait("@getQuestions");
  
      cy.get('h2').each(($h2, index) => {
        cy.wrap($h2).should('exist');
        cy.get('button').eq(index).click(); 
      });
  
      cy.contains("Take New Quiz").should("be.visible");
    });
  
    it("Restarts the quiz after completion", () => {
      cy.contains("Start Quiz").click();
  
      cy.wait("@getQuestions");
  
      cy.get('button').each(($button) => {
        cy.wrap($button).click(); 
      });
  
      cy.contains("Take New Quiz").should("be.visible").click();
  
      cy.wait("@getQuestions");
  
      
      cy.get("h2", { timeout: 10000 }).should("be.visible").and("exist"); 
    });
  });