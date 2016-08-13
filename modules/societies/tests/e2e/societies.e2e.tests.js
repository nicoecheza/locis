'use strict';

describe('Societies E2E Tests:', function () {
  describe('Test Societies page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/societies');
      expect(element.all(by.repeater('society in societies')).count()).toEqual(0);
    });
  });
});
