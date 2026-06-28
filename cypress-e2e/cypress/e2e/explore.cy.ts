
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
  return undefined;
});

describe('Explore', () => {
  const BASE_URL = 'https://demo.immich.app';

  // Imagen mínima (1x1) para stubbear miniaturas y evitar el OOM de Chrome.
  const tinyPng = Cypress.Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64',
  );

  Cypress.Commands.add('loginDemo', () => {
    cy.session('immich-demo-session', () => {
      cy.visit(BASE_URL);
      cy.get('input[type="email"]').type('demo@immich.app');
      cy.get('input[type="password"]').type('demo');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/photos');
    });
  });

  beforeEach(() => {
    cy.viewport(1280, 720);

    // CLAVE: sirve una imagen mínima en lugar de descargar cada foto. Va ANTES
    // de loginDemo para que aplique también al login cacheado. Es lo que evita
    // los errores de memoria al re-correr el suite.
    cy.intercept('GET', '**/thumbnail*', {
      statusCode: 200,
      headers: { 'content-type': 'image/png' },
      body: tinyPng,
    });

    cy.loginDemo();
    cy.visit(`${BASE_URL}/photos`);
    cy.url().should('include', '/photos');
  });

  // EX-01
  it('Verificar que la pantalla Explore carga correctamente mostrando las secciones People y Places con sus respectivos contenidos', () => {
    const placeSearchLinks = 'a[href*="/search"]:not(#search-button)';

    cy.get('a[href="/explore"]').filter(':visible').first().click();

    cy.url().should('include', '/explore');

    // Sección People + botón View All
    cy.contains('p', /^People$/).should('be.visible');
    cy.get('a[href="/people"]')
      .contains(/^View All$/)
      .should('be.visible');

    // Sección Places + botón View All
    cy.contains('p', /^Places$/).should('be.visible');
    cy.get('a[href="/places"]')
      .contains(/^View All$/)
      .should('be.visible');

    // Avatares de personas
    cy.get('a[href^="/people/"]')
      .filter(':visible')
      .should('have.length.greaterThan', 0);

    // Miniaturas/enlaces reales de lugares, excluyendo el botón global de búsqueda
    cy.get(placeSearchLinks)
      .filter(':visible')
      .should('have.length.greaterThan', 0);
  });

  // EX-02
  it('Verificar que la funcionalidad de mostrar y ocultar personas funcione correctamente', () => {
    cy.get('a[href="/explore"]').filter(':visible').first().click();
    cy.url().should('include', '/explore');

    cy.get('a[href="/people"]').filter(':visible').first().click();
    cy.url().should('include', '/people');

    cy.contains('button', 'Show & hide people')
      .filter(':visible')
      .first()
      .should('be.enabled')
      .click();

    cy.contains('Something went wrong').should('not.exist');
    cy.url().should('include', '/people');
  });

  // EX-03
  it("Verificar que al hacer click en 'View All' de Places el sistema redirige a la vista completa de Places", () => {
    cy.get('a[href="/explore"]').filter(':visible').first().click();
    cy.get('a[href="/places"]').contains('View All').click();

    cy.url().should('include', '/places');
    cy.contains('Places').should('be.visible'); // título de la vista
    cy.get('input[placeholder="Search places"]').should('be.visible'); // barra de búsqueda
    cy.get('a[href*="/search"]:not(#search-button)')
      .filter(':visible')
      .should('have.length.greaterThan', 0); // miniaturas de lugares
  });

  // EX-04
  it("Verificar que la opción 'Group by country' agrupe correctamente los lugares por país", () => {
    // Se fuerza "No grouping" antes de cargar /places para que sea consistente
    cy.visit('https://demo.immich.app/places', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          'places-view-settings',
          JSON.stringify({ groupBy: 'None', collapsedGroups: {} }),
        );
      },
    });
    cy.url().should('include', '/places');

    cy.contains(/^\s*No grouping\s*$/)
      .filter(':visible')
      .first()
      .click();
    cy.contains('Group by country').filter(':visible').first().click();

    cy.contains(/\(\s*\d+\s*places?\s*\)/i, { timeout: 10000 }).should(
      'be.visible',
    );

    cy.get('span.text-3xl.font-bold').then(($countries) => {
      const names = [...$countries]
        .map((s) => (s.textContent || '').trim())
        .filter(Boolean);
      expect(names.length, 'se encontraron grupos de países').to.be.greaterThan(
        0,
      );
      const sorted = [...names].sort((a, b) =>
        a.localeCompare(b, 'en', { sensitivity: 'base' }),
      );
      expect(names, 'países en orden alfabético').to.deep.equal(sorted);
    });
  });

  // EX-05
  it("Verificar que el botón de colapsar todos los grupos en la vista 'Group by country' funcione correctamente", () => {
    cy.visit('https://demo.immich.app/places', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          'places-view-settings',
          JSON.stringify({ groupBy: 'Country', collapsedGroups: {} }),
        );
      },
    });
    cy.url().should('include', '/places');

    cy.contains(/\(\s*\d+\s*places?\s*\)/i, { timeout: 10000 }).should(
      'be.visible',
    );
    cy.get('a[href*="/search"]:not(#search-button)')
      .filter(':visible')
      .should('have.length.greaterThan', 0);

    cy.get('button[aria-label="Collapse all"]')
      .filter(':visible')
      .first()
      .click();

    cy.get('span.text-3xl.font-bold').should('have.length.greaterThan', 0);
    cy.get('a[href*="/search"]:not(#search-button)').should('not.exist');
  });

  // EX-06
  it("Verificar que la búsqueda en 'Search places' filtre correctamente los lugares", () => {
    cy.get('a[href="/explore"]').filter(':visible').first().click();
    cy.get('a[href="/places"]').contains('View All').click();

    // Dato válido (éxito): 'Brussels'
    cy.get('input[placeholder="Search places"]').click().type('Brussels');
    cy.contains('Brussels').should('be.visible');

    // Dato inválido: '1234' -> no debe haber coincidencias
    cy.get('input[placeholder="Search places"]').clear().type('1234');
    cy.contains('Brussels').should('not.exist');
  });

  // EX-07
  it('Verificar que al hacer click en la miniatura de un lugar se muestran las fotos asociadas', () => {
    cy.get('a[href="/explore"]').filter(':visible').first().click();
    cy.get('a[href="/places"]').contains('View All').click();

    cy.get('input[placeholder="Search places"]').click().type('Kuranda');
    cy.contains('a', 'Kuranda').should('be.visible').click();

    // Navega a la vista de búsqueda con el filtro de ciudad aplicado
    cy.url().should('include', '/search');
    cy.url().should('include', 'Kuranda');
    cy.contains('Kuranda').should('be.visible'); // filtro 'City: Kuranda' en la parte superior
  });

  // EX-08
  it("Verificar que al abrir 'Search options' se desplieguen todos los campos correctamente", () => {
    cy.get('button[aria-label="Show search options"]')
      .filter(':visible')
      .first()
      .click();
    cy.contains('Search options').should('be.visible');

    [
      'Search type',
      'Place',
      'Country',
      'State',
      'City',
      'Camera',
      'Make',
      'Model',
      'Lens model',
      'Start date',
      'End date',
      'Media type',
      'Display options',
    ].forEach((campo) => {
      cy.contains(campo).should('exist');
    });

    cy.contains('button', 'Clear all').should('exist');
    cy.contains('button', 'Search').should('exist');
  });

  // EX-09
  it("Verificar que al seleccionar un país en 'Country', el campo 'State' solo muestre los estados de ese país", () => {
    const countryInput = 'input[placeholder="Search country..."]';
    const stateInput = 'input[placeholder="Search state..."]';

    cy.get('button[aria-label="Show search options"]')
      .filter(':visible')
      .first()
      .click();
    cy.contains('Search options').should('be.visible');

    // Seleccionar Country = Belgium.
    cy.get(countryInput)
      .filter(':visible')
      .first()
      .click()
      .clear()
      .type('Belgium');
    cy.get(countryInput)
      .closest('div.relative')
      .contains('li[role="option"]', /^Belgium$/i)
      .click();

    cy.get(countryInput).should('have.value', 'Belgium');

    cy.get(stateInput).filter(':visible').first().click();
    cy.get(stateInput)
      .closest('div.relative')
      .find('li[role="option"]')
      .should(($states) => {
        const estados = [...$states].map((li) =>
          (li.textContent || '').trim().toLowerCase(),
        );

        expect(
          estados,
          'State no muestra estados de otro país cuando Country = Belgium',
        ).to.not.include('queensland');
      });
  });

  // EX-010
  it('Verificar que al ingresar un rango de fechas válido la búsqueda devuelva las fotos dentro del rango', () => {
    cy.get('button[aria-label="Show search options"]')
      .filter(':visible')
      .first()
      .click();
    cy.contains('Search options').should('be.visible');

    const setDate = (
      labelText: string,
      month: string,
      day: string,
      year: string,
    ) => {
      cy.contains(labelText)
        .parents('div')
        .first()
        .within(() => {
          const press = (segment: string, digits: string) => {
            cy.get(`[data-segment="${segment}"]`).click();
            [...digits].forEach((d) =>
              cy.focused().trigger('keydown', { key: d }),
            );
          };
          press('month', month);
          press('day', day);
          press('year', year);
        });
    };

    // Start date: 01/01/2024  |  End date: 31/12/2024
    setDate('Start date', '01', '01', '2024');
    setDate('End date', '12', '31', '2024');

    cy.contains('button', 'Search').click();

    cy.url().should('include', '/search');
    cy.url().should('include', '2024');
    cy.contains('Start date must be before end date').should('not.exist');
  });

  // EX-011
  it('Verificar que un rango de fechas inválido (Start posterior a End) muestre el mensaje de error', () => {
    cy.get('button[aria-label="Show search options"]')
      .filter(':visible')
      .first()
      .click();
    cy.contains('Search options').should('be.visible');

    const setDate = (
      labelText: string,
      month: string,
      day: string,
      year: string,
    ) => {
      cy.contains(labelText)
        .parents('div')
        .first()
        .within(() => {
          const press = (segment: string, digits: string) => {
            cy.get(`[data-segment="${segment}"]`).click();
            [...digits].forEach((d) =>
              cy.focused().trigger('keydown', { key: d }),
            );
          };
          press('month', month);
          press('day', day);
          press('year', year);
        });
    };

    // Start = 07/11/2026, End = 03/11/2026.
    setDate('Start date', '07', '11', '2026');
    setDate('End date', '03', '11', '2026');

    cy.contains('Start date must be before end date').should('be.visible');
  });

  // EX-012
  it("Verificar que al buscar por 'File name or extension' con una extensión se retornen resultados", () => {
    cy.get('button[aria-label="Show search options"]')
      .filter(':visible')
      .first()
      .click();
    cy.contains('Search options').should('be.visible');

    cy.get('#file-name-radio').click({ force: true });

    cy.get('input[placeholder*="IMG_"]').clear().type('JPG');

    cy.contains('button', 'Search').click();

    cy.url().should('include', '/search');
    cy.contains('No results').should('not.exist');

    cy.get('img').filter(':visible').should('have.length.greaterThan', 0);
  });

  // EX-014
  it("Verificar que al hacer click en 'Show & hide people' se abra la ventana para mostrar/ocultar personas", () => {
    cy.get('a[href="/explore"]').filter(':visible').first().click();
    cy.url().should('include', '/explore');
    cy.get('a[href="/people"]').filter(':visible').first().click();
    cy.url().should('include', '/people');

    cy.contains('button', 'Show & hide people')
      .filter(':visible')
      .first()
      .click();

    cy.contains('Something went wrong').should('not.exist');
    cy.get('img').filter(':visible').should('have.length.greaterThan', 0);
  });

  // EX-021
  it("Verificar que 'Search people' filtre las personas según el texto ingresado", () => {
    cy.get('a[href="/explore"]').filter(':visible').first().click();
    cy.url().should('include', '/explore');
    cy.get('a[href="/people"]').filter(':visible').first().click();
    cy.url().should('include', '/people');

    const searchPeople = 'input[placeholder="Search people"]';

    cy.get(searchPeople)
      .filter(':visible')
      .first()
      .click()
      .clear()
      .type('The Rabbit');
    cy.get('[title="The Rabbit"]').should('be.visible');
    cy.get('a[href^="/people/"]')
      .filter(':visible')
      .should('have.length.greaterThan', 0);

    cy.get(searchPeople).filter(':visible').first().clear().type('abbit');
    cy.get('[title="The Rabbit"]').should('not.exist');
    cy.contains(/No people|No matching people/i).should('be.visible');
  });

  // EX-022
  it("Verificar que al buscar en 'Search people' un nombre inexistente no se muestren resultados", () => {
    cy.get('a[href="/explore"]').filter(':visible').first().click();
    cy.url().should('include', '/explore');
    cy.get('a[href="/people"]').filter(':visible').first().click();
    cy.url().should('include', '/people');

    cy.get('input[placeholder="Search people"]')
      .filter(':visible')
      .first()
      .click()
      .type('@123456');

    cy.get('a[href^="/people/"]').should('not.exist');
    // ...y debe aparecer un mensaje de "sin personas" (el texto varía por versión).
    cy.contains(/No people|No matching people/i).should('be.visible');
  });
});
