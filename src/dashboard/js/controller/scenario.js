define(function() {

    return function ScenarioController() {
        /**
         * Function for default action
         * @function index
         * @memberOf module:ScenarioController
         */
        this.index = function(params) {
            var e2eScenario = {
                enabled: true,
                scenarioIdFixture: params[0],
                scenarioDateTimeFixture: params[1]
            };
            this.settings.set('e2eScenario', e2eScenario, this.settings.Type.PERM);
            this.goURL(envConfig.ACCOUNTS_INDEX + this.settings.get('dashboardUrl'));
        };
    };
});