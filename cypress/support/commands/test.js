Cypress.Commands.add('editAddress', (fieldName, addressFunction) => {
  describe(`Select ${fieldName}'s address-button and invoke the given function`, function() {
    cy.server();
    cy.route('POST', '/rest/api/address').as('postAddress');

    cy.get(`.form-field-${fieldName}`)
      .find('button')
      .click();

    cy.wait('@postAddress').then(xhr => {
      const requestId = xhr.response.body.id;

      Cypress.emit('emit:addressPatchResolved', requestId);
    });

    cy.on('emit:addressPatchResolved', requestId => {
      cy.route('POST', `/rest/api/address/${requestId}/complete`).as('completeAddress');

      const outerPatchUrl = `/rest/api/address/${requestId}`;
      addressFunction(outerPatchUrl);

      cy.get(`.form-field-C_Location_ID`).click();
      cy.wait('@completeAddress');
    });
  });
});

/**
 * @param waitBeforePress if truthy, call cy.wait with the given parameter first
 */
Cypress.Commands.add('pressStartButton', waitBeforePress => {
  describe("Press an overlay's start-button", function() {
    if (waitBeforePress) {
      cy.wait(waitBeforePress);
    }

    // fail if there is a confirm dialog because it's the "do you really want to leave" confrimation which means that the record can not be saved
    // https://docs.cypress.io/api/events/catalog-of-events.html#To-catch-a-single-uncaught-exception
    cy.on('window:confirm', str => {
      expect(str).to.eq('Everything is awesome and the process has started');
    });

    //webui.modal.actions.done
    const startText = Cypress.messages.modal.actions.start;
    cy.clickButtonWithText(startText);
  });
});

/**
 * @param expectedStatus - optional; if given, the command verifies the status
 */
Cypress.Commands.add('processDocument', (action, expectedStatus) => {
  describe('Execute a doc action', function() {
    cy.log(`Execute doc action ${action}`);

    cy.get('.form-field-DocAction .meta-dropdown-toggle').click();

    cy.get('.form-field-DocAction .dropdown-status-open').should('exist');

    cy.get('.form-field-DocAction .dropdown-status-list')
      .find('.dropdown-status-item')
      .contains(action)
      .click();
    // .click({ force: true }) // force is needed in some cases with chrome71 (IDK why, to the naked eye the action seems to be visible)

    cy.get('.indicator-pending', { timeout: 10000 }).should('not.exist');
    if (expectedStatus) {
      cy.log(`Verify that the doc status is now ${expectedStatus}`);
      cy.get('.meta-dropdown-toggle .tag-success').contains(expectedStatus);
    }
  });
});

Cypress.Commands.add('openAdvancedEdit', () => {
  describe('Open the advanced edit overlay via ALT+E shortcut', function() {
    cy.get('body').type('{alt}E');
    cy.get('.panel-modal').should('exist');
  });
});

/*
 * Press an overlay's "Done" button. Fail if there is a confirm dialog since that means the record could not be saved.
 *
 * @param waitBeforePress if truthy, call cy.wait with the given parameter first
 */
Cypress.Commands.add('pressDoneButton', waitBeforePress => {
  describe("Press an overlay's done-button", function() {
    if (waitBeforePress) {
      cy.wait(waitBeforePress);
    }

    // fail if there is a confirm dialog because it's the "do you really want to leave" confrimation which means that the record can not be saved
    // https://docs.cypress.io/api/events/catalog-of-events.html#To-catch-a-single-uncaught-exception
    cy.on('window:confirm', str => {
      expect(str).to.eq('Everything is awesome and the data record is saved');
    });

    //webui.modal.actions.done
    const doneText = Cypress.messages.modal.actions.done;
    cy.get('.btn')
      .contains(doneText)
      .should('exist')
      .click();

    cy.get('.panel-modal', { timeout: 10000 }) // wait up to 10 secs for the modal to appear
      .should('not.exist');
  });
});

Cypress.Commands.add('pressAddNewButton', (includedDocumentIdAliasName = 'newIncludedDocumentId') => {
  describe("Press table's add-new-record-button", function() {
    cy.server();
    // window/<windowId>/<rootDocumentId>/<tabId>/NEW
    cy.route('PATCH', new RegExp('/rest/api/window/[^/]+/[^/]+/[^/]+/NEW$')).as('patchNewIncludedDocument');

    const addNewText = Cypress.messages.window.addNew.caption;
    cy.get('.btn')
      .contains(addNewText)
      .should('exist')
      .click()
      .wait('@patchNewIncludedDocument')
      .then(xhr => {
        return { documentId: xhr.response.body[0].rowId };
      })
      .as(includedDocumentIdAliasName);

    cy.get('.panel-modal').should('exist');
  });
});

/**
 * @param waitBeforePress if truthy, call cy.wait with the given parameter first
 */
Cypress.Commands.add('pressBatchEntryButton', waitBeforePress => {
  describe("Press table's batch-entry-record-button", function() {
    if (waitBeforePress) {
      cy.wait(waitBeforePress);
    }

    const batchEntryText = Cypress.messages.window.batchEntry.caption;
    cy.get('.btn')
      .contains(batchEntryText)
      .should('exist')
      .click();

    cy.get('.quick-input-container').should('exist');
  });
});