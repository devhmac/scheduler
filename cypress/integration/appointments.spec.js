describe("Appointments", () => {

  it('Should book a new interview', () => {
    cy.request("GET", "/api/debug/reset")

    cy.visit('/');
    cy.contains('Monday')
    cy.get('[alt="Add"]')
      .first()
      .click()

    cy.get('[data-testid=student-name-input]')
      .type("Lydia Miller-Jones")

    cy.get('[alt="Sylvia Palmer"]')
      .click()

    cy.contains("Save")
      .click()
  })


})