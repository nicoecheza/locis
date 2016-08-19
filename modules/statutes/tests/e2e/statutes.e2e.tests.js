'use strict';

describe('Statutes E2E Tests:', function () {
  describe('Test Statutes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/statutes');
      expect(element.all(by.repeater('statute in statutes')).count()).toEqual(0);
    });
  });
});
