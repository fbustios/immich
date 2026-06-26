describe('Share', () => {
  beforeEach(() => {
    cy.visit('https://demo.immich.app');
    cy.get('input[type="email"]').type('demo@immich.app');
    cy.get('input[type="password"]').type('demo');
    cy.get('button[type="submit"]').click();
  });

  // CO-03
  it('Verificar que la funcionalidad de eliminar un usuario de los compartidos de un álbum funcione correctamente',() => {
    cy.get('a[href="/albums"]').click();
    cy.get('a[href^="/albums/"]').first().click();
    cy.get('button[aria-label="Share"]').filter(':visible').first().click();
    cy.contains('Invite People').filter(':visible').click();
    cy.contains('bob@immich.app').filter(':visible').click();
    cy.get('button[type="submit"]').filter(':visible').first().click();
    cy.contains('Editor').filter(':visible').first().click();
    cy.contains('Remove user').filter(':visible').first().click();
    cy.contains('button', 'Remove user').filter(':visible').first().click();
    cy.contains('Bob').should('not.exist');
  });

  // CO-01
  it('Verificar que la funcionalidad de compartir un álbum invitando a un usuario directamente funcione correctamente',() => {
    cy.get('a[href="/albums"]').click();
    cy.get('a[href^="/albums/"]').first().click();
    cy.get('button[aria-label="Share"]').filter(':visible').first().click();
    cy.contains('Invite People').filter(':visible').click();
    cy.contains('bob@immich.app').filter(':visible').click();
    cy.get('button[type="submit"]').filter(':visible').first().click();
    cy.contains('Bob').should('be.visible');
    cy.contains('Editor').filter(':visible').first().click();
    cy.contains('Remove user').filter(':visible').first().click();
    cy.contains('button', 'Remove user').filter(':visible').first().click();
  });

  // CO-02
  it('Verificar que la funcionalidad de cambiar el rol de un usuario a “Visor” al que se le comparte un álbum funcione correctamente',() => {
    cy.get('a[href="/albums"]').click();
    cy.get('a[href^="/albums/"]').first().click();
    cy.get('button[aria-label="Share"]').filter(':visible').first().click();
    cy.contains('Invite People').filter(':visible').click();
    cy.contains('bob@immich.app').filter(':visible').click();
    cy.get('button[type="submit"]').filter(':visible').first().click();
    cy.contains('Bob').should('be.visible');
    cy.contains('Editor').filter(':visible').first().click();
    cy.contains('Viewer').filter(':visible').first().click();
    cy.contains('Viewer').should('be.visible');
    cy.contains('Viewer').filter(':visible').first().click();
    cy.contains('Remove user').filter(':visible').first().click();
    cy.contains('button', 'Remove user').filter(':visible').first().click();
  });

  // CO-04
  it('Verificar que crear un enlace que no vence funcione correctamente.',() => {
    cy.get('a[href="/albums"]').click();
    cy.get('a[href^="/albums/"]').first().click();
    cy.get('button[aria-label="Share"]').filter(':visible').first().click();
    cy.contains('Create link').filter(':visible').click();
    cy.contains('button', 'Never').scrollIntoView().should('be.visible').click();
    cy.contains('button', 'Create link').filter(':visible').first().click({force:true});
  });

  // CO-05
  it('Verificar que eliminar un enlace funcione correctamente.',() => {
    cy.get('a[href="/albums"]').click();
    cy.get('a[href^="/albums/"]').first().click();
    cy.get('button[aria-label="Share"]').filter(':visible').first().click();
    cy.get('button[aria-label="Delete link"]').filter(':visible').first().parents('.flex.justify-between.items-center').first().find('p').first().invoke('text')
      .then((linkName) => {
        expect(linkName, 'first shared link name').to.be.a('string').and.not.be.empty;
        cy.get('button[aria-label="Delete link"]').filter(':visible').first().click();
        });
        cy.contains('button', 'Delete').filter(':visible').first().click();
    });

    // CO-06
    it('Verificar que eliminar un enlace funcione correctamente.',() => {
    cy.get('a[href="/albums"]').click();
    cy.get('a[href^="/albums/"]').first().click();
    cy.get('button[aria-label="Share"]').filter(':visible').first().click();
    cy.get('button[aria-label="Copy link"]').filter(':visible').first().parents('.flex.justify-between.items-center').first().find('p').first().invoke('text')
      .then((linkName) => {
        expect(linkName, 'first shared link name').to.be.a('string').and.not.be.empty;
        cy.get('button[aria-label="Copy link"]').filter(':visible').first().click();
        });
    });

    // CO-07
    it('Verificar que mostrar el código QR de enlace previamente existente funcione correctamente.',() => {
    cy.get('a[href="/albums"]').click();
    cy.get('a[href^="/albums/"]').first().click();
    cy.get('button[aria-label="Share"]').filter(':visible').first().click();
    cy.get('button[aria-label="View QR code"]').filter(':visible').first().parents('.flex.justify-between.items-center').first().find('p').first().invoke('text').
    then((linkName) => {
        expect(linkName, 'first shared link name').to.be.a('string').and.not.be.empty;
        cy.get('button[aria-label="View QR code"]').filter(':visible').first().click();
        });
    });

    // CO-08
    it('Verificar que en la ventana de mostrar el código QR de un enlace previamente existente, el copiar el enlace funcione correctamente.',() => {
    cy.get('a[href="/albums"]').click();
    cy.get('a[href^="/albums/"]').first().click();
    cy.get('button[aria-label="Share"]').filter(':visible').first().click();
    cy.get('button[aria-label="View QR code"]').filter(':visible').first().parents('.flex.justify-between.items-center').first().find('p').first().invoke('text')
    .then((linkName) => {
        expect(linkName, 'first shared link name').to.be.a('string').and.not.be.empty;
        cy.get('button[aria-label="View QR code"]').filter(':visible').first().click();
        });
        cy.get('button[aria-label="Copy link to clipboard"]').filter(':visible').first().click();
    });
});

