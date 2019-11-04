import { Attribute, AttributeSet } from '../../support/utils/attribute';
import { appendHumanReadableNow } from '../../support/utils/utils';
import { getLanguageSpecific } from '../../support/utils/utils';

describe('Create Attribute Masterdata', function() {
  let attributeName;
  let attributeSetName;
  let mandatoryType;

  it('Read the fixture', function() {
    cy.fixture('misc/attributeset_attributes_setup_spec.json').then(f => {
      attributeName = appendHumanReadableNow(f['attributeName']);
      attributeSetName = appendHumanReadableNow(f['attributeSetName']);
      mandatoryType = getLanguageSpecific(f,'mandatoryType');
    });
  });

  it('Create a new Attribute', function() {
    cy.fixture('misc/simple_attribute.json').then(attributeJson => {
      Object.assign(new Attribute(), attributeJson)
        .setName(attributeName)
        .setValue(attributeName)
        .apply();
    });
  });

  it('Create AttributeSet', function() {
    new AttributeSet(attributeSetName).setMandatoryType(mandatoryType).addAttribute(attributeName).apply();
  });
});
