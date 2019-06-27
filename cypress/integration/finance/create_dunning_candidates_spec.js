import { Product, ProductCategory } from '../../support/utils/product';
import { BPartner } from '../../support/utils/bpartner';
import { SalesInvoice, SalesInvoiceLine } from '../../support/utils/sales_invoice';
import { DunningType, DunningTypeEntryLine } from '../../support/utils/dunning_type';

describe('create dunning candidates', function() {
  const timestamp = new Date().getTime();
  const productName = `Dunning Test ${timestamp}`;
  const customerName = `Dunning Test ${timestamp}`;
  const salesInvoiceTargetDocumentType = 'Sales Invoice';
  const productValue = `Dunning Test ${timestamp}`;
  const productCategoryName = `ProductCategoryName ${timestamp}`;
  const productCategoryValue = `ProductNameValue ${timestamp}`;
  const dunningTypeName = `dunning test ${timestamp}`;

  before(function() {
    cy.fixture('product/simple_productCategory.json').then(productCategoryJson => {
      Object.assign(new ProductCategory(), productCategoryJson)
        .setName(productCategoryName)
        .setValue(productCategoryValue)
        .apply();
    });

    cy.fixture('product/product.json').then(productJson => {
      Object.assign(new Product(), productJson)
        .setName(productName)
        .setValue(productValue)
        .setProductType('Service')
        .setProductCategory(productCategoryValue + '_' + productCategoryName)
        .apply();
    });

    cy.fixture('finance/dunning_candidates.json').then(dunningType => {
      Object.assign(new DunningType(), dunningType)
        .setName(dunningTypeName)
        .addEntryLine(
          new DunningTypeEntryLine()
            .setName('Level 1')
            .setPrintName('Text 1')
            .setHeader('Header 1')
            .setNote('Note 1')
        )
        .addEntryLine(
          new DunningTypeEntryLine()
            .setName('Level 2')
            .setPrintName('Text 2')
            .setHeader('Header 2')
            .setNote('Note 2')
        )
        .apply();
    });

    cy.fixture('sales/simple_bpartner.json').then(customerJson => {
      Object.assign(new BPartner(), customerJson)
        .setName(customerName)
        .setCustomerDunning(dunningTypeName)
        .setPaymentTerm('immediately')
        .apply();
    });

    new SalesInvoice(customerName, salesInvoiceTargetDocumentType)
      .addLine(
        new SalesInvoiceLine()
          .setProduct(productName)
          .setQuantity(20)
          .setPackingItem('IFCO 6410 x 10 Stk')
          .setTuQuantity(2)
      )
      .setDocumentAction('Complete')
      .setDocumentStatus('Completed')
      .apply();
  });

  it('create dunning candidates', function() {
    cy.visitWindow('540154');
    cy.waitForHeader('Finance', 'Dunning Candidates');
    cy.executeHeaderAction('C_Dunning_Candidate_Create');
    cy.pressStartButton(1000);
    cy.clickOnBreadcrumb('Dunning Candidates');
  });
});
