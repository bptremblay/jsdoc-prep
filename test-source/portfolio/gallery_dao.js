/**
 * js_test_resources/js/gallery_dao.js<br />
 *
 *
 */
define(['jquery', 'messages', 'logger'],
    /**
     * @exports gallery_dao
     * @requires jquery
     * @requires messages
     */

    function($, Messages, Logger) {
        'use strict';
        /**
         * This is a class.
         *
         *
         */
        /** @alias module:gallery_dao */
        var exports = {};
        exports.data = {};
        /**
   * fetch data for this model

 */
        exports.fetch = function() {
            Logger.fine('Dao.fetch');
            $.ajax({
                dataType: 'json',
                url: '../json/galleryData.json',
                /**
                 * Success.
                 *
                 * @param data
                 * @param status
                 * @param xhr
                 */
                success: function(data, status, xhr) {
                    Logger.fine('Dao.fetch done');

                    // notify
                    exports.data.id = 'gallery';
                    exports.data.result = data;
                    Messages.notify('gallery-data', data);
                }
            });
        };
        /**
         * Update.
         *
         * @param observation
         * @param data
         */
        exports.update = function(observation, data) {
            window.alert('dao update');
        };
        return exports;
    });
