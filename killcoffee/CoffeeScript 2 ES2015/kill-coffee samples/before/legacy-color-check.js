/**
 * @module legacy-color-check
 * @requires jquery
 */
import $ from 'jquery';
/**
 * The class LegacyColorCheck.
 */
class LegacyColorCheck {
    /**
     * @param $markup
     * usesLegacyGlobalColors
     */
    usesLegacyGlobalColors($markup) {
        /**
         * The legacy style attribute selectors.
         * @constant Legacy style attribute selectors
         * legacyStyleAttributeSelectors
         */
        const legacyStyleAttributeSelectors = [
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
        /**
         * selector
         */
        for (let selector of Array.from(legacyStyleAttributeSelectors)) {
            if ($markup.is(selector) || ($markup.find(selector).length > 0)) {
                match = true;
                break;
            }
        }
        return match;
    }
}
// Add explicit return to exports:
export default new LegacyColorCheck;
