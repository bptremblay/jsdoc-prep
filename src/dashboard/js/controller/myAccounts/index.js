define(function(require) {

    return function IndexController() {
        var observable = require('blue/observable'),
            accountsContainerSpec = require('blue-spec/dist/spec/layout'),
            accountsContainerMethod = require('dashboard/component/myAccounts/accountsContainer');

        /**
         * Function for default action
         * @function index
         * @memberOf module:ScenarioController
         */
        this.index = function(params) {
            this.appChannel.emit('initAccounts', {
                params: params
            });

            this.register.components(this, [{
                name: 'accountsContainer',
                model: observable.Model({}),
                spec: accountsContainerSpec,
                methods: accountsContainerMethod
            }]);

			return [ this.components.accountsContainer, 'myAccounts/accountsContainer', { react: true } ];
        };
    };
});
