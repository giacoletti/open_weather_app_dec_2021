describe('User visiting the application, can see home view', () => {
  before(() => {
    cy.visit('/');
  });

  it('is expected to see header "This is a test"', () => {
    cy.get('h1').should('contain.text', 'This is a test');
  });
});