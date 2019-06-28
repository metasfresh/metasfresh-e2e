import { BPartner } from '../../support/utils/bpartner';
import { Product, ProductCategory } from '../../support/utils/product';

describe('create new packing instructions ', function() {
  const timestamp = new Date().getTime();
  const customerName = `TestBPartnerPackingMaterial ${timestamp}`;
  const packingMaterialInstruction = `TestPackingMaterialInstruction ${timestamp}`;
  const productName = `TestProductPackingMaterial ${timestamp}`;
  const packingMaterial = `TestPackingMaterial ${timestamp}`;
  const productCategoryName = `ProductCategoryName ${timestamp}`;
  const productCategoryValue = `ProductNameValue ${timestamp}`;

  before(function() {
    cy.fixture('product/simple_productCategory.json').then(productCategoryJson => {
      Object.assign(new ProductCategory(), productCategoryJson)
        .setName(productCategoryName)
        .setValue(productCategoryValue)
        .apply();
    });

    cy.fixture('product/simple_product.json').then(productJson => {
      Object.assign(new Product(), productJson)
        .setName(productName)
        .setProductCategory(productCategoryValue + '_' + productCategoryName)
        .apply();
    });

    cy.visitWindow('540192');
    cy.clickHeaderNav(Cypress.messages.window.new.caption);
    cy.writeIntoStringField('Name', packingMaterial);
    cy.selectInListField('M_Product_ID', productName);

    cy.fixture('settings/dunning_bpartner.json').then(customerJson => {
      Object.assign(new BPartner(), customerJson)
        .setName(customerName)
        .apply();
    });
  });

  it('creating packing instructions', function() {
    cy.visitWindow('540343');
    cy.clickHeaderNav(Cypress.messages.window.new.caption);
    cy.writeIntoStringField('Name', packingMaterialInstruction);
  });

  it('creating packing instructions version', function() {
    cy.visitWindow('540344');
    cy.clickHeaderNav(Cypress.messages.window.new.caption);
    cy.selectInListField('M_HU_PI_ID', packingMaterialInstruction);
    cy.writeIntoStringField('Name', packingMaterialInstruction);
    cy.selectInListField('HU_UnitType', 'Load/Logistique Unit');
  });

  it('add new in modal', function() {
    cy.pressAddNewButton();
    cy.selectInListField('ItemType', 'Packmittel', true);
    cy.selectInListField('M_HU_PackingMaterial_ID', packingMaterial, true);
    cy.pressDoneButton();

    cy.pressAddNewButton();
    cy.selectInListField('ItemType', 'Unter-Packvorschrift', true);
    cy.selectInListField('Included_HU_PI_ID', 'IFCO 6416', true);
    cy.writeIntoStringField('Qty', '10', true);
    cy.writeIntoLookupListField('C_BPartner_ID', customerName, customerName, true, true);
    cy.pressDoneButton();
  });
});