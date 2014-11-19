define(function(require) {

    return function ClassicController() {

        var observable = require('blue/observable'),
            classicSpec = require('dashboard/spec/classic/classic'),
            classicMethod = require('dashboard/component/classic/classic');

        //Todo: Remove this line when using blue 1.1.0
        this.register = require('common/blue/register');

        this.init = function() {
            var classicModel = observable.Model({
                sourceUrl: ''
            });

            this.model = observable.Model.combine({
                'classicComponent': classicModel
            });
            //Create named instances that are available @controller.components.{componentName}
            this.register.components(this, [{
                name: 'classicComponent',
                model: classicModel,
                spec: classicSpec,
                methods: classicMethod
            }]);
        };

        /**
         * Function for default action
         * @function index
         * @memberOf module:Indexthis
         */

        this.index = function(params) {
            this.settings.set('switchedApp', true, this.settings.Type.USER);

            if (params && params[0]) {
                var url, param1 = params[0].toLowerCase();
                url = this.settings.get('IFRAME_URL')[param1];
                url = (param1 === 'mortgage' || param1 === 'investments') ? url + params[1] : url;
                this.model.lens('classicComponent.sourceUrl').set({
                    url: url,
                    name: params
                });
            }
            return ['classic/classic', this.model];
        };

    };

});