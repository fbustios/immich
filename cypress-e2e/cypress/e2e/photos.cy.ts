describe('Photos', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.window().then((win) => {
      win.localStorage.clear();
      win.sessionStorage.clear();
    });
    cy.visit('https://demo.immich.app');
    cy.get('input[type="email"]').type('demo@immich.app');
    cy.get('input[type="password"]').type('demo');
    cy.get('button[type="submit"]').click();
  });
  describe('downloads', () => {
    // FT-03
    it('deberia descargar la imagen seleccionada', () => {
      cy.get('[data-thumbnail-focus-container]').first().click();
      cy.get('[aria-label="Info"]').click();
      cy.get(
        '#detail-panel > section.relative.p-2 > div.px-4.py-4 > div:nth-child(3) > div:nth-child(2) > p',
      )
        .invoke('text')
        .then((panelText) => {

          cy.get('[aria-label="Download"]').click();
          cy.readFile(
            'cypress/downloads/' + panelText.replace('.jpeg', '.jpg').trim(),
          ).should('exist');
        });

    });
  })

  describe('link sharing', () => {
    //FT-04
    it('deberia mostrar la imagen compartida mediante un link personalizado despues de introducir la contraseña', () => {
      cy.get('[data-thumbnail-focus-container]').first().click();
      cy.get('button[aria-label="Share"]').click();
      const unique = Date.now().toString();
      const password = 'test';
      cy.get('#input-ui-id-3').type(unique);
      cy.get('#input-ui-id-4').type(password);
      cy.contains('button', 'Create link').click();
      cy.get('[aria-label="Copy link to clipboard"]').click();
      cy.window()
        .then((win) => win.navigator.clipboard.readText())
        .as('shareLink');
      cy.get('@shareLink').then((shareLink) => {
        cy.visit(shareLink);
        cy.get('#input-ui-id-0').type(password);
        cy.contains('button', 'Submit').click();
        cy.get('#bits-c7 path').should('be.visible');
      });

    });

    //FT-05
    it('no deberia mostrar la imagen compartida al digitar una contraseña incorrecta', () => {
      cy.get('[data-thumbnail-focus-container]').first().click();
      cy.get('button[aria-label="Share"]').click();
      const unique = Date.now().toString();
      const password = 'test';
      cy.get('#input-ui-id-3').type(unique);
      cy.get('#input-ui-id-4').type(password);
      cy.contains('button', 'Create link').click();
      cy.get('[aria-label="Copy link to clipboard"]').click();
      cy.window()
        .then((win) => win.navigator.clipboard.readText())
        .as('shareLink');
      cy.get('@shareLink').then((shareLink) => {
        cy.visit(shareLink);
        cy.get('#input-ui-id-0').type('contraseña incorrecta');
        cy.contains('button', 'Submit').click();
        cy.get('#bits-c7 > svg > path').should('not.exist');
      });
    });

    it('no deberia mostrar la opcion de informacion ya que fue deshabilitada', () => {
      cy.get('[data-thumbnail-focus-container]').first().click();
      cy.get('button[aria-label="Share"]').click();
      const unique = Date.now().toString();
      const password = 'test';
      cy.get('#input-ui-id-3').type(unique);
      cy.get('#input-ui-id-4').type(password);
      cy.get('#input-ui-id-6').click();
      cy.contains('button', 'Create link').click();
      cy.get('[aria-label="Copy link to clipboard"]').click();
      cy.window()
        .then((win) => win.navigator.clipboard.readText())
        .as('shareLink');
      cy.get('@shareLink').then((shareLink) => {
        cy.visit(shareLink);
        cy.get('#input-ui-id-0').type(password);
        cy.contains('button', 'Submit').click();
        cy.get('#bits-c7 > svg').should('not.exist');
      });
    });
  });

  describe('editor de fotos', () => {

    it('al darle a restaurar cambios se deberian eliminar todos los cambios historicos', () => {
      cy.get('[data-thumbnail-focus-container]').first().click();
      cy.get('button[aria-label="Editor"]').click();
      cy.get('button[aria-label="Rotate 90° counterclockwise"]').click();
      cy.get('button[aria-label="Rotate 90° counterclockwise"]').click();
      cy.get('button[aria-label="Rotate 90° clockwise"]').click();
      cy.contains('button', 'Reset changes').click();
      cy.contains('button', 'Save').click();
    });

    //FT-06
    it('deberia girar la foto seleccionada 270 grados en sentido antihorario, despues de haberle dado tres veces al boton', () => {
      cy.get('[data-thumbnail-focus-container]').first().click();
      cy.get('button[aria-label="Editor"]').click();
      cy.get('button[aria-label="Rotate 90° counterclockwise"]').click();
      cy.get('button[aria-label="Rotate 90° counterclockwise"]').click();
      cy.get('button[aria-label="Rotate 90° counterclockwise"]').click();
      cy.get(
        '#immich-asset-viewer > div.z-\\[-1\\].relative.col-start-1.col-span-4.row-start-1.row-span-full > div > div',
      )
        .should('have.attr', 'style')
        .and('include', 'rotate: -270deg');
    });

    //FT-07
    it('deberia girar la foto seleccionada 270 grados en sentido horario, despues de haberle dado tres veces al boton', () => {
      cy.get('[data-thumbnail-focus-container]').first().click();
      cy.get('button[aria-label="Editor"]').click();
      cy.get('button[aria-label="Rotate 90° clockwise"]').click();
      cy.get('button[aria-label="Rotate 90° clockwise"]').click();
      cy.get('button[aria-label="Rotate 90° clockwise"]').click();
      cy.get(
        '#immich-asset-viewer > div.z-\\[-1\\].relative.col-start-1.col-span-4.row-start-1.row-span-full > div > div',
      )
        .should('have.attr', 'style')
        .and('include', 'rotate: 270deg');
    });
    //FT-08
    it('deberia de espejar la imagen horizontalmente', () => {
      cy.get('[data-thumbnail-focus-container]').first().click();
      cy.get('button[aria-label="Editor"]').click();
      cy.get('button[aria-label="Flip horizontal"]').click();
      cy.get(
        '#immich-asset-viewer > div.z-\\[-1\\].relative.col-start-1.col-span-4.row-start-1.row-span-full > div > div > img',
      )
        .should('have.attr', 'style')
        .and('include', 'transform: scaleX(-1)');
    });

    //FT-09
    it('deberia de espejar la imagen verticalmente', () => {
      cy.get('[data-thumbnail-focus-container]').first().click();
      cy.get('button[aria-label="Editor"]').click();
      cy.get('button[aria-label="Flip vertical"]').click();
      cy.get(
        '#immich-asset-viewer > div.z-\\[-1\\].relative.col-start-1.col-span-4.row-start-1.row-span-full > div > div > img',
      )
        .should('have.attr', 'style')
        .and('include', 'transform: scaleY(-1)');
    });
    //FT-10
    it('deberia de guardarse el cambio realizado en el editor, despues de darle click a guardar', () => {
      cy.get('[data-thumbnail-focus-container]').first().click();
      cy.get('button[aria-label="Editor"]').click();
      let width, height;
      cy.get('#immich-asset-viewer > div.z-\\[-1\\].relative.col-start-1.col-span-4.row-start-1.row-span-full > div > div > div > div:nth-child(2)').then(($el) => {
        const rect = $el[0].getBoundingClientRect();

        width = rect.width;
        height = rect.height;

      });
      cy.get('button[aria-label="Rotate 90° counterclockwise"]').click();
      cy.contains('button', 'Save').click();
      cy.get(
        '#immich-asset-viewer > div.z-\\[-1\\].relative.col-start-1.col-span-4.row-start-1.row-span-full > div > div > div > div:nth-child(2)',
      ).then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        assert(rect.width !== width);
      });
    });

    it('deberian de descartarse los cambios realizados en el editor al salir sin guardar', ()=> {
      cy.get('[data-thumbnail-focus-container]').first().click();
      cy.get('button[aria-label="Editor"]').click();
      let width, height;
      cy.get('#immich-asset-viewer > div.z-\\[-1\\].relative.col-start-1.col-span-4.row-start-1.row-span-full > div > div > div > div:nth-child(2)').then(($el) => {
        const rect = $el[0].getBoundingClientRect();

        width = rect.width;
        height = rect.height;

      });
      cy.get('button[aria-label="Rotate 90° clockwise"]').click();
      cy.get('[aria-label="Close"]').click();
      cy.contains('button', 'Discard edits').click();
      cy.get(
        '#immich-asset-viewer > div.z-\\[-1\\].relative.col-start-1.col-span-4.row-start-1.row-span-full > div > div > div > div:nth-child(2)',
      ).then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        assert(rect.width === width);
        assert(rect.height === height);
      });
    });


  });

  describe('editor de informacion de fotos', () => {
    //FT-15
    it('deberia de editar la informacion de ubicacion con la ingresada en las coordenadas', () => {
      cy.get('[data-thumbnail-focus-container]').first().click();
      cy.get('[aria-label="Info"]').click();
      cy.get('button[title="Edit location"]').click();
      cy.contains('label', 'Latitude')
        .invoke('attr', 'for')
        .then((id) => {
          cy.get(`#${id}`).clear().type('20.334820015089676');
        });
      cy.contains('label', 'Longitude')
        .invoke('attr', 'for')
        .then((id) => {
          cy.get(`#${id}`).clear().type('-97.93044287176853');
        });
      cy.contains('button', 'Confirm').click();
      cy.contains('San Lorenzo').should('exist')
      cy.contains('Puebla').should('exist');
      cy.contains('Mexico').should('exist');
    });

    it('deberia editar la fecha', () => {
      cy.get('[data-thumbnail-focus-container]').first().click();
      cy.get('[aria-label="Info"]').click();
      cy.get('button[title="Edit date"]').click();
      cy.get('input[id="datetime"]').clear().type('2026-06-28T14:30');
      cy.contains('button', 'Confirm').click();
      cy.contains('Jun 28, 2026');
      cy.contains('Sun, 2:30:00 PM GMT-06:00');
    });
     it('deberia cambiar la descripcion', () => {
       cy.get('[data-thumbnail-focus-container]').first().click();
       cy.get('[aria-label="Info"]').click();
       cy.get('[data-testid="autogrow-textarea"]').clear().type(
         'descripción de prueba',
       );
       cy.get('[aria-label="Close"]').click();
       cy.get('[aria-label="Info"]').click();
       cy.get('[data-testid="autogrow-textarea"]').should(
         'have.value',
         'descripción de prueba',
       );
     });

  });
  afterEach(()=> {

  })
});
