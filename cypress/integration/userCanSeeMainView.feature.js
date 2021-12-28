describe('User visiting the application, can see home view', () => {
  before(() => {
    cy.visit('/', {
      onBeforeLoad(window) {
        const stubLocation = {
          coords: {
            latitude: 59.4116812,
            longitude: 17.9250757
          }
        };
        cy.stub(window.navigator.geolocation, 'getCurrentPosition')
          .callsFake((callback) => {
            return callback(stubLocation);
          });
      }
    });
  });

  it('is expected to display header "Current Weather"', () => {
    cy.get('h1').should('contain.text', 'Current Weather');
  });

  describe('display user coordinates', () => {
    it('is expected to display latitude', () => {
      cy.get('[data-cy=user-latitude]')
        .should('contain.text', 'Your latitude is: 59.4116812');
    });

    it('is expected to display latitude', () => {
      cy.get('[data-cy=user-longitude]')
        .should('contain.text', 'Your longitude is: 17.9250757');
    });
  });
});
