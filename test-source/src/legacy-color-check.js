define([
  'jquery'
], function($) {
  class LegacyColorCheck {
    usesLegacyGlobalColors($markup) {
      let legacyStyleAttributeSelectors = [
        // After Init Dom Node Markup
        '[data-style-background-color]',
        '[data-style-color]',
        // On Import Markup
        '[color]',
        '[background-color]'
      ];
      let match = false;
      for (let selector of legacyStyleAttributeSelectors) {
        if ($markup.is(selector) || $markup.find(selector).length > 0) {
          match = true;
          break;
        }
      }
      return match;
    }
  }
  return new LegacyColorCheck;
});
