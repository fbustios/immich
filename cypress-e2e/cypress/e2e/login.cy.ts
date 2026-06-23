import 'cypress-xpath';

describe('Login', () => {
  beforeEach(() => {
    cy.visit('https://demo.immich.app');
  });

  // L0-01
  it('Verificar que se permite el acceso a la aplicación con usuario y contraseña válidos', () => {
    cy.get('input[type="email"]').type('demo@immich.app');
    cy.get('input[type="password"]').type('demo');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/photos');
  });

  // LO-02
  it('Verificar que el sistema no permite ingreso con un usuario y contraseña inválidos', () => {
    cy.get('input[type="email"]').type('hola@immich.app');
    cy.get('input[type="password"]').type('memo');
    cy.get('button[type="submit"]').click();
    cy.contains('Incorrect email or password').should('be.visible');
  });

  // LO-03
  it('Verificar que el sistema no permite dejar el usuario vacío al ingresar', () => {
    cy.get('input[type="password"]').type('demo');
    cy.get('button[type="submit"]').click();
    cy.contains('email should not be empty').should('be.visible');
  });

  // LO-04
  it('Verificar que el sistema no permite dejar la contraseña vacía al ingresar', () => {
    cy.get('input[type="email"]').type('demo@immich.app');
    cy.get('button[type="submit"]').click();
    cy.contains('password should not be empty').should('be.visible');
  });

  // LO-05
  it('Verificar que el sistema no permite ingresar un formato de correo inválido', () => {
    cy.get('#email').type('demoimmich.app');
    cy.get('#password').type('demo');
    cy.get('button[type="submit"]').click();
    cy.get('#email:invalid').should('exist');
  });

  // LO-06
  it('Verificar que el sistema permite que el usuario vea la contraseña en el campo indicado', () => {
    cy.get('#email').type('demo@immich.app');
    cy.get('#password').type('demo');
    cy.get('#password').parent().find('button').click();
    cy.get('#password').should('have.attr', 'type', 'text');
    cy.get('#password').should('have.value', 'demo');
  });

  // LO-07
  it('Verificar que el sistema permite que el usuario pueda esconder la contraseña en el campo indicado', () => {
    cy.get('#email').type('demo@immich.app');
    cy.get('#password').type('demo');
    cy.get('#password').parent().find('button').click();
    cy.get('#password').parent().find('button').click();
    cy.get('#password').should('have.attr', 'type', 'password');
  });

  // LO-08
  it('Verificar que el sistema no permite ingresar con un usuario y contraseña vacíos', () => {
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/photos');
    cy.contains('email should not be empty').should('be.visible');
    cy.contains('password should not be empty').should('be.visible');
  });

});
