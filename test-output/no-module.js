/**
 * no-module.js <br />
 *  <br />
 * js_test_resources/fronum.js.
 *
 * @module no_module
 * @author Fredrum <rf@monath.net>
 * @copyright Chase & Co. All rights reserved.
 */
/**
 * Fronum.
 *
 * @constructor
 */

function Fronum() {

  /** Chew bakka. */
  this.chewBakka = function() {};
}
/**
 * Chonkey.
 * @param toothache
 * @param tomato
 */
Fronum.prototype.chonkey = function(toothache, tomato) {
  return true;
};

/**
 * Second class.
 *
 * @constructor
 */

function SecondClass() {}
/**
 * Chonkey.
 * @param toothache
 * @param tomato
 */
SecondClass.prototype.chonkey = function(toothache, tomato) {
  return false;
};
