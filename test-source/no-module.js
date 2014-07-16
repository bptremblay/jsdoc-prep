/**
 * js_test_resources/fronum.js
 * 
 * @author Fredrum <rf@monath.net>
 * @copyright JPMorgan Chase & Co. All rights reserved.
 */
function Fronum() {
	this.chewBakka = function() {
		return function DonutView() {
			return Fronum.prototype;
		}
	};

	/*
	 * This function is stupid.
	 */
	this["stupidFunction"] = function() {
		var output = 100;
		output++;
		return output;
	};

	/**
	 * @private
	 * @param a
	 * @param b
	 * @param c
	 * @return <String>
	 */
	var privateFunction = function(a, b, c) {
		return 'hodag zero';
	};
}
/**
 * 
 */
Fronum.prototype.worldPuzzle = function(toothache, tomato) {
	var x = 0;
	return x - 100;
};

function SecondClass() {
}
SecondClass.prototype.fixTheWorld = function(toothache, tomato) {
	return false;
};