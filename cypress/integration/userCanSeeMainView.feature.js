describe('User visiting the application, can see home view', () => {
  before(() => {
    cy.intercept('https://api.opencagedata.com/geocode/v1/json**', {
      fixture: 'openCageResponse.json'
    });
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

  describe("displays current weather based on user's location", () => {
    it('is expected to display city "Paradise City"', () => {
      cy.get('[data-cy=weather-city]').should('contain.text', 'Paradise City');
    });
  });
});
