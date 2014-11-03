define(function(require) {
    return function MockController() {
        var componentChannel = require('blue/event/channel/component'),
        	cookie = new (require('blue/store/enumerable/cookie'))('scenario'),
            $this = this;
        this.init = function() {
            componentChannel.on({
                'mockView/VIEW/trigger/enableMock': function(inputData) {
                    $this.setFixture(inputData);
                },

                'mockView/VIEW/trigger/scenarioEnabled': function(inputData) {
                    $this.setScenario(inputData);
                }
            });
        };

        this.index = function() {
            var e2eScenario = this.settings.get('e2eScenario', this.settings.Type.PERM) ? this.settings.get('e2eScenario', this.settings.Type.PERM) : false;
            if (!e2eScenario) {
            	e2eScenario = cookie.get('e2eScenario') ? cookie.get('e2eScenario') : false;
            }

            return ['scenario', {
                ASSETS_INDEX: envConfig.ASSETS_INDEX,
                enabled: this.settings.get('mockEnabled', this.settings.Type.USER) ? this.settings.get('mockEnabled', this.settings.Type.USER) : false,
                scenarioEnable: e2eScenario
            }];
        };

        this.enabled = function(params) {
            var mockEnabled = params[0] === 'true' ? true : false;
            this.setFixture({
                enabled: mockEnabled
            });
        };

        this.setFixture = function(inputData) {
            this.settings.set('mockEnabled', inputData.enabled, this.settings.Type.USER);
            this.model.lens('enabled').set(inputData.enabled);
            location.reload();
        };

        this.setScenario = function(inputData) {
            if (inputData.enabled === true) {
                this.settings.set('e2eScenario', {
                    enabled: inputData.enabled,
                    scenarioIdFixture: inputData.scenarioIdFixture,
                    scenarioDateTimeFixture: inputData.scenarioDateTimeFixture,
                }, this.settings.Type.PERM);
                cookie.set( 'e2eScenario', {
                    enabled: inputData.enabled,
                    scenarioIdFixture: inputData.scenarioIdFixture,
                    scenarioDateTimeFixture: inputData.scenarioDateTimeFixture,
                }, undefined, undefined, '.chase.com');
                this.model.lens('scenarioEnable').set(inputData.enabled);
            } else {
                this.settings.set('e2eScenario', '', this.settings.Type.PERM);
                cookie.set( 'e2eScenario', '', undefined, undefined, '.chase.com');
                this.model.lens('scenarioEnable').set(inputData.enabled);
            }
        };
    };
});
