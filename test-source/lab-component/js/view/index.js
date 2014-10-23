define(function(require) {

    return function IndexView() {
        this.init = function() {
            this.viewName = 'index';
            this.bridge = this.createBridge( require( 'lab-component/view/webspec/contactForm' ) );
            this.template = require( 'lab-component/template/contactForm' );

        };
    };

});
