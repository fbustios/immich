import 'cypress-xpath';

describe('Login', function () {
  beforeEach(function () {
    cy.visit('https://demo.immich.app');
  });

  it('Login válido', () => {
    cy.get('input[type="email"]').type('demo@immich.app');
    cy.get('input[type="password"]').type('demo');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/photos');
  });
});
