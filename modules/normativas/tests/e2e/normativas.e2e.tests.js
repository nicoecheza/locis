'use strict';

describe('Normativas E2E Tests:', function () {
  describe('Test Normativas page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/normativas');
      expect(element.all(by.repeater('normativa in normativas')).count()).toEqual(0);
    });
  });
});
