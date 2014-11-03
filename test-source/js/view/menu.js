/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module MenuView
 */
define(function(require) {

    return function MenuView() {
        var self = this,
            Bridge = this.createBridgePrototype( require('logon/view/webspec/topMenu') );

        //TODO: Remove emit support settings as soon as possible
        self.instanceName = 'menuview';
        self.type = 'view';

        self.bridge = new Bridge({
            targets: {
                select_menu_item: '#switchLocale'
            }
        });

        this.template = require('logon/template/menu');

        this.init = function() {

        };

        this.onDataChange = function onDataChange() {
            this.rerender();
        };
    };
});
