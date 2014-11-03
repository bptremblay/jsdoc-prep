define(function(require) {

    return function HeaderView() {
        var settings = require('dashboard/settings'),
            componentChannel = require('blue/event/channel/component');
           

        this.template = require('dashboard/template/header/myInfoMenu');

        this.init = function() {
        	 this.bridge = this.createBridge(require('dashboard/view/webspec/header/myInfoMenu'));
        	 this.bridge.on('state/requestMyInfoMenu', this.requestMyInfoMenu.bind(this));
             this.bridge.on('state/exitMyInfoMenu', this.exitMyInfoMenu.bind(this));
        };

        this.requestMyInfoMenu = function(){
            this.$element.find('div.menu').show();
        };
        this.exitMyInfoMenu = function(){
            this.$element.find('div.menu').hide();
        };

    };
});
