define(function(require) {

    return function MegaMenuView() {
        var MegaMenuBridge = require('blue/bridge').create(require('dashboard/view/webspec/sideMenu/megaMenu'), {});

        var self = this;

        self.megaMenuBridge = new MegaMenuBridge({
            targets: {
                atmPref: '#atm-pref',
                messageCenter: '#message-center'
            }
        });

        //set up essential view settings
        var settings = require('dashboard/settings');
        this.template = require('dashboard/template/sideMenu/megaMenu');

        this.init = function() {
            this.eventManager = {
                click: {
                    '#atm-pref': function() { // TODO: DISPLAYING ATM PREFERENCE POPUP
                        this.state(settings.classicAtmPrefUrl);
                         $('body').toggleClass('hidden-menu');		// hide the slide-out menu
                   },
                    '#message-center': function() { // TODO: DISPLAYING ATM PREFERENCE POPUP
                        this.state(settings.classicMsgCenterUrl);
                         $('body').toggleClass('hidden-menu');		// hide the slide-out menu
                    }
                }
            };
        };

        this.onDataChange = function onDataChange() {
            this.rerender();
        };
    };
});
