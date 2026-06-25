function albumsByYear() {
  return cy.get('[data-testid="album-card"]').then(($cards) => {
    const groups = {};
    [...$cards].forEach((card) => {
      const name =
        card.querySelector('[data-testid="album-name"]')?.getAttribute('title')?.trim() ?? '';

      const dateText = card.querySelector('.capitalize')?.textContent.trim() ?? '';
      const last = dateText.split('-').pop().trim();
      const ts = Date.parse(last);

      const countText = card.querySelector('[data-testid="album-details"]')?.textContent ?? '';
      const countMatch = countText.match(/(\d+)\s*items?/);
      const count = countMatch ? parseInt(countMatch[1], 10) : 0;

      const year = isNaN(ts) ? 'unknown' : new Date(ts).getFullYear();
      (groups[year] ??= []).push({ name, ts: isNaN(ts) ? 0 : ts, count });
    });
    return groups;
  });
}

describe('Album', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
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
    cy.get('input[type="radio"][value="Shared"]').last().check({ force: true });
    cy.get('input[type="radio"][value="Shared"]').last().should('be.checked');
  });

  // AL-03
  it('Verificar que el acceso al menú de álbumes propios se despliega correctamente', () => {
    cy.get('a[href="/albums"]').click();
    cy.get('input[type="radio"][value="Owned"]').last().check({ force: true });
    cy.get('input[type="radio"][value="Owned"]').last().should('be.checked');
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
    cy.contains('button', 'Most recent photo').filter(':visible').click();
    cy.contains('Title').filter(':visible').click();

    albumsByYear().then((groups) => {
      const years = Object.keys(groups);
      expect(years.length, 'found year groups').to.be.greaterThan(0);
      years.forEach((y) => {
        const names = groups[y].map((a) => a.name);
        const sorted = [...names].sort((a, b) =>
          a.localeCompare(b, 'es', { sensitivity: 'base' })
        );
        expect(names, `year ${y}`).to.deep.equal(sorted);
      });
    });
  });

  //AL-07
  it('Verificar que se puede ordenar álbumes por número de archivos', () => {
    cy.get('a[href="/albums"]').click();
    cy.contains('button', 'Most recent photo').filter(':visible').click();
    cy.contains('Number of items').filter(':visible').click();

    albumsByYear().then((groups) => {
      const years = Object.keys(groups);
      expect(years.length, 'found year groups').to.be.greaterThan(0);
      years.forEach((y) => {
        const counts = groups[y].map((a) => a.count);
        const sorted = [...counts].sort((a, b) => b - a);
        expect(counts, `year ${y}`).to.deep.equal(sorted);
      });
    });
  });

  //AL-10
  it('Verificar que se puede ordenar álbumes por foto más reciente', () => {
    cy.get('a[href="/albums"]').click();
    albumsByYear().then((groups) => {
      const years = Object.keys(groups);
      expect(years.length, 'found year groups').to.be.greaterThan(0);
      years.forEach((y) => {
        const dates = groups[y].map((a) => a.ts);
        const sorted = [...dates].sort((a, b) => b - a);
        expect(dates, `year ${y}`).to.deep.equal(sorted);
      });
    });
  });
});
