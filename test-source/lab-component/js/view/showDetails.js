define(function(require) {

    return function ShowDetailsView() {
        this.init = function() {
            this.viewName = 'showDetails';
            this.bridge = this.createBridge( require( 'lab-component/view/webspec/showDetails' ) );
            this.template = require( 'lab-component/template/showDetails' );

            this.bridge.on('state/showDetails', function() {
               
            }.bind(this));
        };
    };

});
