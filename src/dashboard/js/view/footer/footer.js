define(function(require) {

    return function FooterView() {
        this.template = require('dashboard/template/footer/footer');
        var controllerChannel = require('blue/event/channel/controller');
        var logger = require('blue/log')('[classic]');

        this.init = function() {

        	// Update the footer content with any passed-in html content from an event
        	controllerChannel.on({
                'set-page-footer-html': function(htmlContent) {
                    logger.debug('Set page footer html event received: ' + htmlContent);
                    // var footerElement = $('#footer-content');
                    // footerElement.html(htmlContent);
                }.bind(this)
            });
        };

        this.onDataChange = function onDataChange() {
            this.rerender();
        };
    };
});
