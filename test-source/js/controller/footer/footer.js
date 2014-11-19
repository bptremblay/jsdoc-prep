define(function(require) {

    return function FooterController() {
        require('dashboard/service/languageMapper').call(this);

        var observable = require('blue/observable'),
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

        };

        /**
         * Function for default action
         * @function index
         * @memberOf module:Indexthis
         */
        this.index = function() {
            this.appChannel.on({
                'updateFooter': function(inputData) {
                    this.components.footerComponent.updateFooter(inputData.data);
                }.bind(this)
            });
            return ['footer/footer', this.model];
        };
    };

});