describe('map', ()=>{
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });
    cy.visit('https://demo.immich.app', {
      onBeforeLoad(win) {
        cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake(
          (success) => {
            success({
              coords: {
                latitude: 9.9281,
                longitude: -84.0907,
                accuracy: 10,
              },
            });
          },
        );
      },
    });
    cy.get('input[type="email"]').type('demo@immich.app');
    cy.get('input[type="password"]').type('demo');
    cy.get('button[type="submit"]').click();
  });

  //MP-01
  it('deberia habilitar la posicion actual dentro del mapa, mostrando el punto azul', () => {
    cy.contains('Map').click();
    cy.get('button[aria-label="Find my location"]').click();
    cy.get('.maplibregl-user-location-dot', { timeout: 15000 })
      .should('exist')
      .and('be.visible');
  });
});
