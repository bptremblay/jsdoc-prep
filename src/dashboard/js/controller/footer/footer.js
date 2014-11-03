define(function(require) {

    return function FooterController() {
        var controllerChannel = require('blue/event/channel/controller'),
            observable = require('blue/observable'),
            footerSpec = require('dashboard/spec/footer/footer'),
            footerMethod = require('dashboard/component/footer/footer');

        this.init = function() {
            var footerModel = observable.Model({
                title: ''
            });

            this.model = observable.Model.combine({
                'footerComponent': footerModel,
            });
            //Create named instances that are available @controller.components.{componentName}
            this.register.components(this, [{
                name: 'footerComponent',
                model: footerModel,
                spec: footerSpec,
                methods: footerMethod
            }]);

            controllerChannel.on({
                'updateFooter': function(inputData) {
                    this.components.footerComponent.updateFooter(inputData.data);
                }.bind(this),
                'initFooter': function(params) {
                    this.index(params);
                }.bind(this)
            });

        };

        /**
         * Function for default action
         * @function index
         * @memberOf module:Indexthis
         */
        this.index = function() {
            return ['footer/footer', this.model];
        };
    };

});
