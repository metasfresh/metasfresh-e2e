/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {

    /**
     * Asserts that a particular filed is not shown (e.g. because of a display rule)
     * 
     * @param fieldName name of the field is question
     * @param modal optional, default = false; use true, if the field is in a modal overlay; required if the underlying window has a field with the same name.
     */
    assertFieldNotShown(fieldName: string, modal: boolean): Chainable<any>

    /**
     * This command runs a quick actions. If the second parameter is truthy, the default action will be executed.
     * 
     * @param actionName internal name of the action to be executed
     * @param active if truthy, the default action will be executed.
     */
    executeQuickAction(actionName:string, active:boolean): Chainable<any>

    /**
     * @param fieldName name of the field is question
     * @param modal optional, default = false; use true, if the field is in a modal overlay; required if the underlying window has a field with the same name.
     * 
     * @example 
     * cy.getFieldValue('Description').then(fieldValue => {
     *  cy.log(`Description = ${fieldValue}`)
     * });
     */
    getFieldValue(fieldName: string, modal: boolean): Chainable<any>

    /**
     * @param fieldName name of the field is question
     * @param modal optional, default = false; use true, if the field is in a modal overlay; required if the underlying window has a field with the same name.
     * 
     * @example 
     * cy.isChecked('IsDefault').then(checkBoxValue => {
     *  cy.log(`IsDefault = ${checkBoxValue}`)
     * });
     */
    isChecked(fieldName: string, modal: boolean): Chainable<any>
    
    /**
     * Open the advanced edit overlay via ALT+E shortcut
     */
    openAdvancedEdit(): Chainable<any>

    /**
     * Presses a single document's add-new-button to create a new subrow / included document
     * 
     * @param aliasToStoreNewDocumentId the name of the alias in which the command will store the new record's ID; example " { documentId: 1000001 }";
     * 
     * @example
     * // press the button to open the new sub-record's modal dialog
     * cy.pressAddNewButton('myNewIncludedDcumentId')
     * 
     * // set fields
     * 
     * // close the modal dialog
     * cy.pressDoneButton()
     * 
     * cy.get('@myNewIncludedDcumentId').then((newIncludedDocument) => {
     *   cy.log(`going to do things with the included document we added just before; newIncludedDocument=${JSON.stringify(newIncludedDocument)}`)
     * })
     */
    pressAddNewButton(includedDocumentIdAliasName: string): Chainable<any>
    
    /**
     * 
     * @param action 
     * @param expectedStatus - optional; if given, the command verifies the status
     * 
     * @example cy.processDocument('Complete', 'Completed');
     */
    processDocument(action:string, expectedStatus:string)
    
    /**
     * Select an item in a list field
     * 
     * @param fieldName name of the field is question
     * @param stringValue (sub-)string of the list item to select
     * @param modal optional, default = false; use true, if the field is in a modal overlay; required if the underlying window has a field with the same name.
     */
    selectInListField(fieldName: string, stringValue: string, modal: boolean): Chainable<any>

    /**
     * Select a reference (zoom-to-target) from the reference-sidelist
     * 
     * @param internalReferenceName
     * @example
     * // this should work from a sales order
     * cy.get('body').type('{alt}6'); // open referenced-records-sidelist
     * cy.selectReference('C_Order_C_Invoice_Candidate').click();
     */
    selectReference(internalReferenceName: string): Chainable<any>

    /**
     * Opens a new single document window
     * @param windowId the metasfresh AD_Window_ID of the window to visit
     * @param recordId optional; the record ID of the record to open within the window, or NEW if a new record shall be created. If set the detail layout is shown and cypress waits for the layout into fo be send by the API; otherwise, the "table/grid" layout is shown.
     * 
     * @param documentIdAliasName the name of the alias in which the command will store the actual record; example " { documentId: 1000001 }"; usefull if recordId=NEW; default: visitedDocumentId
     * 
     * @example
     * // create a new business partner document
     * cy.visitWindow(123, 'NEW', 'myNewDcumentId')
     *
     * cy.get('@myNewDcumentId').then((newDocument) => {
     *   cy.log(`going to do things with the document we added just before; newDocument=${JSON.stringify(newDocument)}`)
     * })
     * 
     */
    visitWindow(windowId: BigInteger, recordId: string, documentIdAliasName: string): Chainable<any>

    /**
     * Wait for the completion of a particular patch where a particular field was set to a particular value.
     * Useful to make sure that cypress waits for the UI to react to each particular input before proceeding to the next one.
     * 
     * Thx to https://github.com/cypress-io/cypress/issues/387#issuecomment-458944112
     * 
     * @param alias name of the alias to wait for; needs to begin with '@'
     */
    waitForFieldValue(alias: String, fieldName: String, fieldValue: String): Chainable<any>
    

    /**
     * 
     * @param fieldName name of the field is question
     * @param partialValue string to enter into the lookup field
     * @param expectedListValue (sub-)string of the expected item to show up in the lookup list when the partial value was entered
     * @param typeList optional, default = false; use true when selecting value from a list not lookup field.
     * @param modal optional, default = false; use true, if the field is in a modal overlay; required if the underlying window has a field with the same name.
     * @param rewriteUrl optional, default = null; specify to which URL the command expects the frontend to patch.
     */
    writeIntoLookupListField(fieldName: String, partialValue: String, expectedListValue: String, typeList: boolean, modal:boolean, rewriteUrl:String): Chainable<any>

    /**
     * Write a string into an input field. Assert that the frontend performs a PATCH request with the given value.
     * 
     * @param fieldName name of the field is question
     * @param stringValue the string to write. This command prepends "{enter}" to that string. Also works for number or date fields, e.g. '01/01/2018' when invoked with noRequest=true.
     * @param modal optional - set true if the field in question is assumed to be in a modal/overlay dialog.
     * @param rewriteUrl optional - specify to which URL the command expects the frontend to patch.
     * @param noRequest optional - set true if the command shall not very that a patch with the "right" response takes place. This is currently required if you use this command to non-string fields.
     * 
     * @example
     * // This will work also with modal dialogs, *unless* there is also a description field in the underlying document
     * cy.writeIntoStringField('Description', 'myname')
     * // This will fail if the field in question is *not* in a modal dialog
     * cy.writeIntoStringField('Description', 'myname', true)
     */
    writeIntoStringField(fieldName: string, stringValue: string, modal: boolean, rewriteUrl: string, noRequest: boolean): Chainable<any>

    /**
     * Write a string into a text area
     * 
     * @param fieldName name of the field is question
     * @param stringValue the string to write. This command prepends "{enter}" to that string
     * @param modal optional, default = false; use true, if the field is in a modal overlay; required if the underlying window has a field with the same name.
     * 
     * @example
     * // This will work also with modal dialogs, *unless* there is also a description field in the underlying document
     * cy.writeIntoTextField('Description', 'myname')
     * 
     * // This will fail if the field in question is *not* in a modal dialog
     * cy.writeIntoTextField('Description', 'myname', true)
     */
    writeIntoTextField(fieldName: string, stringValue: string, modal: boolean): Chainable<any>
  }
}