/**
 * @author DST SFO 2 - Evan Kim - evan.kim@chase.com
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module dashboard/lib/myProfile/baconModelCache
 * This module allows you to cache and restore your observable models.
 *
 * Use Case: User opens a form and changes some values. When the user closes
 * the form, original values should be restored. Cache the original bacon
 * model before the form opens, and restore it before the read-only view is
 * rendered again.
 *
 * Sample usage in component:
 * var BaconModelCache = require('dashboard/lib/myProfile/baconModelCache');
 *
 * this.init = function() {
 *   this.baconModelCache = new BaconModelCache();
 * };
 *
 * this.showForm = function() {
 *   this.baconModelCache.cache(this.model);
 *   // Your show form code goes here
 * };
 *
 * this.hideForm = function() {
 *	 this.baconModelCache.restore();
 *	 // Your hide form code goes here
 * };
 *
 **/

define(function(require) {

    var BaconModelCache = function() {};

    /**
     * @function
     * param {Model} baconModel - Observable model to cache
     * Caches the bacon model
     */
    BaconModelCache.prototype.cache = function(baconModel) {
        var deepCopy = {};
        $.extend(true, deepCopy, baconModel.get());
        this.baconModel = baconModel;
        this.cachedBaconModel = deepCopy;
    };

    /**
     * @function
     * Restores the baconModel passed into the cache function.
     */
    BaconModelCache.prototype.restore = function() {
        if (!this.baconModel || !this.cachedBaconModel) return;
        this.baconModel.set(this.cachedBaconModel);
    };

    return BaconModelCache;

});
