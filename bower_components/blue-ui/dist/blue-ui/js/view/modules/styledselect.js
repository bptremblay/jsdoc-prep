define(function (require) {
	var controllerChannel = require('blue/event/channel/controller');

    return function() {
    	var self = this;


        var SBridge = require('blue/bridge').create(require('blue-ui/view/webspec/modules/styledselect'));
        this.bridge = new SBridge({
            targets: {
            }
        });

        self.instanceName = 'styledselect';
        self.type = 'view';

    	this.eventManager = {
    		'click': {
    			'.field': function($target, event) {
    				self.component.toggle();
    			},
    			'.option': function($target, event) {
    				self.component.selectOption($target);
    			}
    		},
    		'keydown': {
    			'.field': function($target, event) {
    				self.component.fieldKeydown($target, event);
    			},
    			'.option': function($target, event) {
    				self.component.optionKeydown($target, event);
    			}
    		}
    	}
    	this.template = require('blue-ui/template/modules/styledselect');

    }
});
