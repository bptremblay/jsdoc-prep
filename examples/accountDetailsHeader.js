define( /** @exports js/view/myAccounts/accountDetailsHeader */
function(require) {
    /**
     * Account details header view.
     */
    return /** @constructor */
    function accountDetailsHeaderView() {
        this.bridge = this
                .createBridge(require('dashboard/view/webspec/myAccounts/accountDetailsHeader'));
        this.template = require('dashboard/template/myAccounts/accountDetailsHeaderShared');
        /**
         * Init.
         */
        this.init = function() {
            this.bridge.on('state/asOfDateHide', function() {
                $('#accountUpdateDate').hide();
            });
        };
    };
});