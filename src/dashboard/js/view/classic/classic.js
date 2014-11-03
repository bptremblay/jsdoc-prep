define(function(require) {

    return function ClassicView() {
        this.template = require('dashboard/template/classic/classic');
        var logger = require('blue/log')('[classic]');
        var controllerChannel = require('blue/event/channel/controller');
        var classicBridge = this.createBridgePrototype(require('dashboard/view/webspec/classic/classic')),
            self = this;

        this.init = function() {
            this.showOverlay();

            // want the resize code (changes height of iframe) invoked whenever browser is resized
            $(window).resize(this.classicIframeResizer);

            // This message comes from the classic header view. It says that the
            // 'Why am I seeing this' link has been clicked. That pushes the iframe down and up.
            controllerChannel.on({
                'classic-help-content-click': function(expanded) {
                    logger.debug('Got the click msg on the ctrlr channel');
                    this.classicIframeResizer(expanded);
                }.bind(this)
            });

            //Setting Bridge
            //adding empty trigger method
            //same method name is required in webspec for the action
            self.bridge = new classicBridge ({
                targets: {}
            });

            this.eventManager = {
                click: {
                    '#classic-help-content': function() {
                        // Get the link and span in it
                        var link = $('#classic-help-content');
                        var linkSpan = link.find('span.accessible-text');

                        // Change the body of the span tag
                        var showsContentBelow = this.model.lens('titleElement').get().showsContent;
                        var hidesContentBelow = this.model.lens('titleElement').get().hidesContent;

                        if (linkSpan.text() === showsContentBelow) {
                            linkSpan.html(hidesContentBelow);
                        } else if (linkSpan.text() === hidesContentBelow) {
                            linkSpan.html(showsContentBelow);
                        }

                        //Error message if string doesn't matches
                        else {
                            logger.warn('Should contain showContentBelow or hideContentBelow');
                        }

                        // Get the indicator and switch that
                        var indicator = link.find('i.fa');
                        if (indicator.hasClass('fa-angle-up')) {
                            indicator.removeClass('fa-angle-up');
                            indicator.addClass('fa-angle-down');
                        } else if (indicator.hasClass('fa-angle-down')) {
                            indicator.removeClass('fa-angle-down');
                            indicator.addClass('fa-angle-up');
                        }

                        // Toggle the active class on the container
                        $('#classic-help-content-container').toggleClass('active');

                        // send medssage to listeners (index view) on controllerChannel
                        var expanded = indicator.hasClass('fa-angle-up');   // this right? Not used
                        controllerChannel.emit('classic-help-content-click', {
                            expanded: expanded
                        });
                   },
                }
            };
        };

        this.showOverlay = function() {
        	var that = this; // need this so we can reference the resizer

            setTimeout(function() {
                $('#modal-iframe').load(function() {
                    if (($('#modal-iframe').data('name')).indexOf('investment') > -1) {
                        $('.investment').addClass('header-active');
                    } else {
                        $('.others-tab').addClass('header-active');
                    }
                    $(this).show();
                    $('#pre-loader').hide();

                    that.classicIframeResizer(); // size the iframe first time in
                });

            }, 1000);

            $('#pre-loader').fadeIn(300);
        };

        this.hideOverlay = function() {
            $('#pre-loader').fadeOut(300);
        };

        this.onDataChange = function onDataChange() {
            this.rerender();
            this.showOverlay();
        };

        // re-calculate iframe height. Happens on initial load, resize, when the 'Why am I seeing this' link click
        this.classicIframeResizer = function() {
            var viewportHeight = $(window).height(); // this gives us the height of the viewport
            var footerHeight = 75; // adjust for notional footer. THIS VALUE MAY CHANGE
            var iframe = document.getElementById('modal-iframe');

            // Make sure the dom is loaded (check can probably go now)
            if (iframe) {
                var iframeHeight = parseInt(viewportHeight - iframe.offsetTop - 8 - footerHeight);
                //TODO: we should make sure we don't go below a minimum height - can't get it to work
                iframe.style.height = iframeHeight + 'px';

                logger.debug('iframe resized to height: ' + iframeHeight);
            } else {
                logger.debug('iframe not detected yet');
            }
        };
    };
});
