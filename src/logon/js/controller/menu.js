/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module IndexController
 */
define(function(require) {

    return function MenuController() {

        var observable = require('blue/observable'),
            TopMenuSpec = require('logon/spec/topMenu'),
            TopMenuMethods = require('logon/component/topMenu');

        this.init = function() {
            //@Todo: Default model should move to framework
            //this.model = observable.Model({});
            //this.model.lens('authComponent').set(authModel.get());
            this.model = observable.Model.combine({
                label: 'Español',
                locale: 'sp-es'
            });
        };
        /**
         * Function for default action
         * @function index
         * @memberOf module:IndexController
         */
        this.index = function() {
            //Create named instances that are available @controller.components.{componentName}
            this.register.components(this, [{
                name: 'topMenuComponent',
                model: this.model,
                spec: TopMenuSpec,
                methods: TopMenuMethods
            }]);

            //var storedLanguage = this.settings.get('language', this.settings.Type.PERM),
                //topMenuModel = this.model.lens('topMenuComponent');

            // if (storedLanguage) {
            //     topMenuModel.lens('label').set(storedLanguage.label);
            //     topMenuModel.lens('locale').set(storedLanguage.locale);
            // }
            //return ['menu', this.model];
            return [this.components.topMenuComponent, 'menu'];
        };
    };
});
