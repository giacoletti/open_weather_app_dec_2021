describe('User visiting the application, can see home view', () => {
  before(() => {
    cy.intercept('GET', 'https://api.opencagedata.com/geocode/v1/json**', {
        fixture: 'openCageResponse.json'
      }).as('getCity');
    cy.intercept('GET', 'https://api.openweathermap.org/data/2.5/onecall**', {
        fixture: 'openWeatherResponse.json'
      }).as('getWeather');
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
    cy.wait('@getCity');
    cy.wait('@getWeather');
  });

  it('is expected to display header "Current Weather"', () => {
    cy.get('h1').should('contain.text', 'Current Weather');
  });

  describe("displays current weather based on user's location", () => {
    it('is expected to display city "Paradise City"', () => {
      cy.get('[data-cy=weather-city]')
        .should('contain.text', 'Paradise City')
        .and('be.visible');
    });

    it('is expected to display weather icon', () => {
      cy.get('[data-cy=weather-icon]').should('be.visible');
    });

    it('is expected to display weather description', () => {
      cy.get('[data-cy=weather-description]')
        .should('contain.text', 'Light snow')
        .and('be.visible');
    });

    it('is expected to display temperature icon', () => {
      cy.get('[data-cy=temperature-icon]').should('be.visible');
    });

    it('is expected to display temperature in Celsius', () => {
      cy.get('[data-cy=weather-temperature]')
        .should('contain.text', '0.1°C')
        .and('be.visible');
    });

    it("is expected to display 'Feels like' temperature", () => {
      cy.get('[data-cy=weather-feels-like]')
        .should('contain.text', 'Feels like: 0°C')
        .and('be.visible');
    });

    it('is expected to display Humidity', () => {
      cy.get('[data-cy=weather-humidity]')
        .should('contain.text', 'Humidity: 94%')
        .and('be.visible');
    });

    it('is expected to display Wind speed', () => {
      cy.get('[data-cy=weather-wind-speed]')
        .should('contain.text', 'Wind speed: 2.4 m/sec')
        .and('be.visible');
    });
  });
});
