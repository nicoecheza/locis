'use strict';

describe('Regulations E2E Tests:', function () {
  describe('Test Regulations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/regulations');
      expect(element.all(by.repeater('regulation in regulations')).count()).toEqual(0);
    });
  });
});
