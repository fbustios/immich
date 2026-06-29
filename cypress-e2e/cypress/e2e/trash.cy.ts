describe('Trash', () => {
  beforeEach(() => {
    cy.visit('https://demo.immich.app');
    cy.get('input[type="email"]').type('demo@immich.app');
    cy.get('input[type="password"]').type('demo');
    cy.get('button[type="submit"]').click();
    cy.get('a[href="/trash"]').first().scrollIntoView().click({force:true});
    cy.url().should('include', '/trash');
    cy.contains('button', 'Restore all').should('be.visible').click();
    cy.contains('button', 'Confirm').should('be.visible').click();
  });

  // PA-01
  it('Verificar que la funcionalidad de eliminar fotos o videos desde la sección "Fotos" funcione correctamente', () => {
    cy.get('a[href="/photos"]').filter(':visible').first().click();
    cy.get('[data-asset]').first().should('be.visible').invoke('attr', 'data-asset')
      .then((assetId) => {
        expect(assetId, 'first asset id').to.be.a('string').and.not.be.empty;
        cy.get(`[data-asset="${assetId}"]`).click();
        cy.get('[data-testid="asset-viewer-navbar-actions"]').find('button[aria-label="Delete"]').first().click();
        cy.contains('Trashed 1 asset').should('be.visible');
        cy.get('a[href="/trash"]').first().click({force:true});
        cy.get(`[data-asset="${assetId}"]`).should('exist');
      });
  });

  // PA-03
  it('Verificar que la funcionalidad de restaurar fotos o videos desde la sección “Papelera”, dentro de la imagen en específico funcione correctamente.', () => {
    cy.get('a[href="/photos"]').filter(':visible').first().click();
    cy.get('[data-asset]').first().should('be.visible').invoke('attr', 'data-asset')
      .then((assetId) => {
        expect(assetId, 'first asset id').to.be.a('string').and.not.be.empty;
        cy.get(`[data-asset="${assetId}"]`).click();
        cy.get('[data-testid="asset-viewer-navbar-actions"]').find('button[aria-label="Delete"]').first().click();
        cy.contains('Trashed 1 asset').should('be.visible');
        cy.get('button[aria-label="Close"]').first().click();
        cy.get('a[href="/trash"]').first().scrollIntoView().click({force:true});
        cy.get(`[data-asset="${assetId}"]`).should('be.visible').click();
        cy.get('[data-testid="asset-viewer-navbar-actions"]').find('button[aria-label="More"]').filter(':visible').first().click();
        cy.get('button:contains("Restore")').first().click({force:true});
        cy.get('button:contains("Confirm")').first().click({force:true});
        cy.get('a[href="/photos"]').first().click({force:true});
        cy.get(`[data-asset="${assetId}"]`).should('exist');
      });
  });

  // PA-04
  it('Verificar que la funcionalidad de eliminar varias fotos desde la sección “Fotos” funcione correctamente.', () => {
    cy.get('a[href="/photos"]').filter(':visible').first().click();
    cy.get('[data-asset]').first().should('be.visible')
      .invoke('attr', 'data-asset')
      .then((assetId1) => {
        expect(assetId1, 'first asset id').to.be.a('string').and.not.be.empty;
        cy.get(`[data-asset="${assetId1}"]`).click();
        cy.get('[data-testid="asset-viewer-navbar-actions"]').find('button[aria-label="Delete"]').first().click();
        cy.contains('Trashed 1 asset').should('be.visible');
        cy.get('a[href="/photos"]').first().click({force:true});
        cy.get('[data-asset]').first().should('be.visible').invoke('attr', 'data-asset')
          .then((assetId2) => {
            expect(assetId2, 'second asset id').to.be.a('string').and.not.be.empty;
            expect(assetId2, 'second asset should differ from first').to.not.equal(assetId1);
            cy.get(`[data-asset="${assetId2}"]`).click();
            cy.get('[data-testid="asset-viewer-navbar-actions"]').find('button[aria-label="Delete"]').first().click();
            cy.contains('Trashed 1 asset').should('be.visible');
            cy.get('a[href="/trash"]').first().scrollIntoView().click({force:true});
        cy.get(`[data-asset="${assetId1}"]`).should('exist');
        cy.get(`[data-asset="${assetId2}"]`).should('exist');
      });
    });
  });

  // PA-07
  it('Verificar que la funcionalidad de deshacer el eliminado de una foto (seleccionar con click) desde la sección “Fotos” funcione correctamente.', () => {
    cy.get('a[href="/photos"]').filter(':visible').first().click();
    cy.get('[data-asset]').first().should('be.visible').invoke('attr', 'data-asset')
      .then((assetId) => {
        expect(assetId, 'first asset id').to.be.a('string').and.not.be.empty;
        cy.get(`[data-asset="${assetId}"]`).click();
        cy.get('[data-testid="asset-viewer-navbar-actions"]').find('button[aria-label="Delete"]').first().click();
        cy.contains('Trashed 1 asset').should('be.visible');
        cy.get('.border-primary-100.bg-primary-50').last().should('be.visible')
        .within(() => {
            cy.contains('p', 'Success').should('be.visible');
            cy.contains('button', 'Undo').should('be.visible').click();
          });
        cy.get('a[href="/photos"]').first().click({force:true});
        cy.get(`[data-asset="${assetId}"]`).should('exist');
      });
  });

  // PA-09
  it('Verificar que eliminar permanentemente una foto funcione correctamente.', () => {
    cy.get('a[href="/photos"]').filter(':visible').first().click();
    cy.get('[data-asset]').first().should('be.visible').invoke('attr', 'data-asset')
      .then((assetId) => {
        expect(assetId, 'first asset id').to.be.a('string').and.not.be.empty;
        cy.get(`[data-asset="${assetId}"]`).click();
        cy.get('[data-testid="asset-viewer-navbar-actions"]').find('button[aria-label="Delete"]').first().click();
        cy.contains('Trashed 1 asset').should('be.visible');
        cy.get('a[href="/trash"]').first().click({force:true});
        cy.get(`[data-asset="${assetId}"]`).click();
        cy.get('[data-testid="asset-viewer-navbar-actions"]').find('button[aria-label="Permanently delete"]').first().click();
        cy.contains('button', 'Delete').should('be.visible').click();
        cy.get(`[data-asset="${assetId}"]`).should('not.exist');
      });
  });

  // PA-11
  it('Verificar que vaciar la papelera funcione correctamente.', () => {
    cy.get('a[href="/photos"]').filter(':visible').first().click();
    cy.get('[data-asset]').first().should('be.visible').invoke('attr', 'data-asset')
      .then((assetId) => {
        expect(assetId, 'first asset id').to.be.a('string').and.not.be.empty;
        cy.get(`[data-asset="${assetId}"]`).click();
        cy.url().should('include', assetId);
        cy.get('[data-testid="asset-viewer-navbar-actions"]').find('button[aria-label="Delete"]').first().click();
        cy.contains('Trashed 1 asset').should('be.visible');
        cy.get('a[href="/trash"]').first().click({force:true});
        cy.contains('button', 'Empty trash').should('be.visible').click();
        cy.contains('button', 'Confirm').should('be.visible').click();
        cy.get(`[data-asset="${assetId}"]`).should('not.exist');
      });
    });

  // PA-12
  it('Verificar que restaurar la papelera funcione correctamente.', () => {
    cy.get('a[href="/photos"]').filter(':visible').first().click();
    cy.get('[data-asset]').first().should('be.visible').invoke('attr', 'data-asset')
      .then((assetId) => {
        expect(assetId, 'first asset id').to.be.a('string').and.not.be.empty;
        cy.get(`[data-asset="${assetId}"]`).click();
        cy.get('[data-testid="asset-viewer-navbar-actions"]').find('button[aria-label="Delete"]').first().click();
        cy.get('a[href="/trash"]').first().click({force:true});
        cy.contains('button', 'Restore all').should('be.visible').click();
        cy.contains('button', 'Confirm').should('be.visible').click();
        cy.get('a[href="/photos"]').filter(':visible').first().click();
        cy.get(`[data-asset="${assetId}"]`).should('exist');
      });
  });
});
