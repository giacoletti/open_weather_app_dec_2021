describe('User can click a button and display search input', () => {
  
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
    cy.get('[data-cy=change-city-btn]').click();
  });

  it('is expected to hide "Change City" button', () => {
    cy.get('[data-cy=change-city-btn]').should('not.exist');
  });

  it('is expected to display search input', () => {
    cy.get('[data-cy=search-input-city]').should('be.visible');
  });

  it('is expected to display "Search" button', () => {
    cy.get('[data-cy=search-city-btn]')
      .should('contain.text', 'Search')
      .and('be.visible');
  });

  describe('user can look for the weather in a different city', () => {
    before(() => {
      cy.intercept('GET', 'https://api.opencagedata.com/geocode/v1/json**', {
        fixture: 'openCageBerlinResponse.json'
      }).as('getBerlinCoords');
      cy.intercept('GET', 'https://api.openweathermap.org/data/2.5/onecall**', {
        fixture: 'openWeatherBerlinResponse.json'
      }).as('getBerlinWeather');
      cy.get('[data-cy=search-input-city]').type('Berlin');
      cy.get('[data-cy=search-city-btn]').click();
    });

    describe("displays current weather in Berlin", () => {
      it('is expected to display city "Berlin"', () => {
        cy.get('[data-cy=weather-city]')
          .should('contain.text', 'Berlin')
          .and('be.visible');
      });
  
      it('is expected to display weather icon', () => {
        cy.get('[data-cy=weather-icon]').should('be.visible');
      });
  
      it('is expected to display weather description', () => {
        cy.get('[data-cy=weather-description]')
          .should('contain.text', 'Scattered clouds')
          .and('be.visible');
      });
  
      it('is expected to display temperature icon', () => {
        cy.get('[data-cy=temperature-icon]').should('be.visible');
      });
  
      it('is expected to display temperature in Celsius', () => {
        cy.get('[data-cy=weather-temperature]')
          .should('contain.text', '6.9°C')
          .and('be.visible');
      });
  
      it("is expected to display 'Feels like' temperature", () => {
        cy.get('[data-cy=weather-feels-like]')
          .should('contain.text', 'Feels like: 3.8°C')
          .and('be.visible');
      });
  
      it('is expected to display Humidity', () => {
        cy.get('[data-cy=weather-humidity]')
          .should('contain.text', 'Humidity: 86%')
          .and('be.visible');
      });
  
      it('is expected to display Wind speed', () => {
        cy.get('[data-cy=weather-wind-speed]')
          .should('contain.text', 'Wind speed: 4.9 m/sec')
          .and('be.visible');
      });
    });
  });
});