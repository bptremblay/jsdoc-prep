define(
  /**
   * @exports js/controller/scenario
   */
  function(require) {
    /**
     * Creates a new instance of class MockController.
     * @constructor
     */
    return function MockController() {
      var componentChannel = require('blue/event/channel/component'),
        cookie = new(require('blue/store/enumerable/cookie'))('scenario'),
        $this = this;
      /**
       * Init.
       */
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
      /**
       * Index.
       * @todo Please describe the return type of this method.
       */
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
      /**
       * Enabled.
       * @param params
       */
      this.enabled = function(params) {
        var mockEnabled = params[0] === 'true' ? true : false;
        this.setFixture({
          enabled: mockEnabled
        });
      };
      /**
       * Set fixture.
       * @param inputData
       */
      this.setFixture = function(inputData) {
        this.settings.set('mockEnabled', inputData.enabled, this.settings.Type.USER);
        this.model.lens('enabled').set(inputData.enabled);
        location.reload();
      };
      /**
       * Set scenario.
       * @param inputData
       */
      this.setScenario = function(inputData) {
        if (inputData.enabled === true) {
          this.settings.set('e2eScenario', {
            enabled: inputData.enabled,
            scenarioIdFixture: inputData.scenarioIdFixture,
            scenarioDateTimeFixture: inputData.scenarioDateTimeFixture,
          }, this.settings.Type.PERM);
          cookie.set('e2eScenario', {
            enabled: inputData.enabled,
            scenarioIdFixture: inputData.scenarioIdFixture,
            scenarioDateTimeFixture: inputData.scenarioDateTimeFixture,
          }, undefined, undefined, '.chase.com');
          this.model.lens('scenarioEnable').set(inputData.enabled);
        } else {
          this.settings.set('e2eScenario', '', this.settings.Type.PERM);
          cookie.set('e2eScenario', '', undefined, undefined, '.chase.com');
          this.model.lens('scenarioEnable').set(inputData.enabled);
        }
      };
    };
  });