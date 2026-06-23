describe('Album', () => {
  beforeEach(() => {
    cy.visit('https://demo.immich.app');
    cy.get('input[type="email"]').type('demo@immich.app');
    cy.get('input[type="password"]').type('demo');
    cy.get('button[type="submit"]').click();
  });

  // AL-01
  it('Verificar que el acceso al menú de Álbumes se da correctamente', () => {
    cy.get('a[href="/albums"]').click();
    cy.url().should('include', '/albums');
  });

  // AL-02
  it('Verificar que el acceso al menú de álbumes compartidos se despliega correctamente', () => {
    cy.get('a[href="/albums"]').click();
    cy.contains('label', 'Shared').click();
    cy.contains('label', 'Shared')
      .invoke('attr', 'for')
      .then((id) => cy.get(`#${id}`).should('be.checked'));
  });

  // AL-03
  it('Verificar que el acceso al menú de álbumes propios se despliega correctamente', () => {
    cy.get('a[href="/albums"]').click();
    cy.contains('label', 'Owned').click();
    cy.contains('label', 'Owned')
      .invoke('attr', 'for')
      .then((id) => cy.get(`#${id}`).should('be.checked'));
  });

  // AL-05
  it('Verificar que se puede ingresar a un álbum existente', () => {
    cy.get('a[href="/albums"]').click();
    cy.url().should('include', '/albums');
    cy.get('a[href^="/albums/"]').first().click();
    cy.url().should('match', /\/albums\/[\w-]+/);
  });

  //AL-06
  it('Verificar que se puede ordenar álbumes por título', () => {
    cy.get('a[href="/albums"]').click();
    cy.url().should('include', '/albums');

    cy.contains('button', 'Most recent photo').click();
    cy.contains('Number of items').click();

    cy.get('.grid-auto-fill-56').each(($grid) => {
      const counts = [...$grid.find('[data-testid="album-details"]')].map((el) => {
        const m = el.textContent.match(/(\d+)\s*items?/);
        return m ? parseInt(m[1], 10) : 0;
      });
      const sorted = [...counts].sort((a, b) => b - a);
      expect(counts).to.deep.equal(sorted);
    });
  });

  //AL-07
  it('Verificar que se puede ordenar álbumes por número de archivos', () => {
    cy.get('a[href="/albums"]').click();
    cy.url().should('include', '/albums');
    cy.contains('button', 'Most recent photo').click();
    cy.contains('Title').click();
    cy.get('.grid-auto-fill-56').each(($grid) => {
      const titles = [...$grid.find('[data-testid="album-name"]')].map(
        (el) => el.getAttribute('title') ?? el.textContent.trim()
      );
      const sorted = [...titles].sort((a, b) =>
        a.localeCompare(b, 'es', { sensitivity: 'base' })
      );
      expect(titles).to.deep.equal(sorted);
    });
  });

  //AL-10
  it('Verificar que se puede ordenar álbumes por foto más reciente', () => {
    cy.get('a[href="/albums"]').click();
    cy.url().should('include', '/albums');
    cy.get('.grid-auto-fill-56').each(($grid) => {
      const dates = [...$grid.find('[data-testid="album-card"]')].map((card) => {
        const text = card.querySelector('.capitalize')?.textContent.trim() ?? '';
        const last = text.split('-').pop().trim();
        const ts = Date.parse(last);
        return isNaN(ts) ? 0 : ts;
      });
      const sorted = [...dates].sort((a, b) => b - a);
      expect(dates).to.deep.equal(sorted);
    });
  });
});
