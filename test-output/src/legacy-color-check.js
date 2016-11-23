/**
 * @module legacy-color-check
 * @exports new LegacyColorCheck
 * @requires jquery
 */
import $ from 'jquery';
/**
 * The class LegacyColorCheck.
 */
class LegacyColorCheck {
  /**
   * @param $markup
   */
  usesLegacyGlobalColors($markup) {
    /**
     * The legacy style attribute selectors.
     */
    let legacyStyleAttributeSelectors = [
      // After Init Dom Node Markup
      '[data-style-background-color]',
      '[data-style-color]',
      // On Import Markup
      '[color]',
      '[background-color]'
    ];
    /**
     * The match.
     * @type {Boolean}
     */
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
export default new LegacyColorCheck;