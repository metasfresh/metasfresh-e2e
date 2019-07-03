export class SalesOrder {
  constructor(reference) {
    this.reference = reference;
    this.bPartner = undefined;
    this.bPartnerLocation = undefined;
  }

  setBPartner(bPartner) {
    cy.log(`SalesOrder - setBPartner = ${bPartner}`);
    this.bPartner = bPartner;
    return this;
  }

  setBPartnerLocation(location) {
    cy.log(`SalesOrder - setBPartnerLocation = ${location}`);
    this.bPartnerLocation = location;
    return this;
  }

  setPoReference(reference) {
    cy.log(`SalesOrder - setReference = ${reference}`);
    this.reference = reference;
    return this;
  }

  setPricingSystem(pricingSystem) {
    cy.log(`SalesOrder - pricingSystem = ${pricingSystem}`);
    this.pricingSystem = pricingSystem;
    return this;
  }

  setPaymentTerm(paymentTerm) {
    cy.log(`SalesOrder - paymentTerm = ${paymentTerm}`);
    this.paymentTerm = paymentTerm;
    return this;
  }

  apply() {
    cy.log(`SalesOrder - apply - START (${this.reference})`);
    applySalesOrder(this);
    cy.log(`SalesOrder - apply - END (${this.reference})`);
    return this;
  }
}

function applySalesOrder(salesOrder) {
  describe(`Create new salesOrder`, function() {
    cy.visit('/window/143/NEW');
    // cy.waitForHeader('Sales', 'Sales Order');
    cy.wait(1000)
    cy.get('.header-breadcrumb-sitename').should('contain', '<');

    cy.writeIntoLookupListField('C_BPartner_ID', salesOrder.bPartner, salesOrder.bPartner);

    if (salesOrder.bPartnerLocation) {
      cy.writeIntoLookupListField(
        'C_BPartner_Location_ID',
        salesOrder.bPartnerLocation,
        salesOrder.bPartnerLocation,
        true /*typeList*/
      );
    }

    if (salesOrder.pricingSystem) {
      cy.selectInListField('M_PricingSystem_ID', salesOrder.pricingSystem, false, null, true);
    }

    if (salesOrder.paymentTerm) {
      cy.selectInListField('C_PaymentTerm_ID', salesOrder.paymentTerm, false, null, true);
    }

    cy.get('.header-breadcrumb-sitename').should('not.contain', '<');

    cy.writeIntoStringField('POReference', salesOrder.reference);
  });
}
