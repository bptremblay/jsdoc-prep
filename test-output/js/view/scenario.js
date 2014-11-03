/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module MockView

 */
define(
  /**
   * @exports js/view/scenario
   * @requires jquery
   */
  function(require) {
    var self = this,
      componentChannel = require('blue/event/channel/component');
    //TODO: Remove emit support settings as soon as possible
    self.instanceName = 'mockView';
    self.type = 'VIEW';
    /**
     * Creates a new instance of class MockView.
     * @constructor
     */
    return function MockView() {
      this.template = require('logon/template/scenario');
      this.attrs = {
        'scenarioId': '#scenarioId',
        'scenarioDateTime': '#scenarioDateTime'
      };
      this.eventManager = {
        change: {
          '#ddaDetailFixture': function($input) {
            $('#ddaActivityFixture').val($input.val());
          },
          '#autoDetailFixture': function($input) {
            $('#autoActivityFixture').val($input.val());
          },
          '#mortgageDetailFixture': function($input) {
            $('#mortgageActivityFixture').val($input.val());
          },
          '#cardDetailFixture': function($input) {
            $('#cardActivityFixture').val($input.val());
          },
          '#loanDetailFixture': function($input) {
            $('#loanActivityFixture').val($input.val());
          }
        },
        click: {
          '#mock-launcher': function($input) {
            if ($input.context.id === 'mock-launcher') {
              this.show('div#mock-setup');
              this.hide('div#mockScenario');
            }
          },
          '#mock-launcher-scenario': function($input) {
            if ($input.context.id === 'mock-launcher-scenario') {
              $('div#mockScenario').show();
              $('div#mock-setup').hide();
            }
          },
          'button#unsetMocking': function($input) {
            if ($input.context.id === 'unsetMocking') {
              //@TODO: REMOVE HACK
              componentChannel.emit('trigger', {
                target: self,
                value: 'enableMock',
                enabled: false
              });
              $('div#mock-background').hide();
              $('div#mock-config').hide();
            }
          },
          'button#unsetMockingScenario': function($input) {
            if ($input.context.id === 'unsetMockingScenario') {
              //@TODO: REMOVE HACK
              componentChannel.emit('trigger', {
                target: self,
                value: 'scenarioEnabled',
                enabled: false
              });
              sessionStorage.setItem('setlocal', '0');
              $('div#mock-background').hide;
              $('div#mock-config').hide();
            }
          },
          'button#setMocking': function($input) {
            var fixtures = {},
              url;
            if ($input.context.id === 'setMocking') {
              this.$('select').each(function() {
                url = $(this).data('url');
                fixtures[$(this).data('name')] = {
                  activeResponse: $(this).val(),
                  service: url || '',
                  name: $(this).data('name'),
                  session: $(this).data('session')
                };
              });
              fixtures.enabled = true;
              //@TODO: REMOVE HACK
              componentChannel.emit('trigger', {
                target: self,
                value: 'enableMock',
                fixtures: fixtures
              });
              $('div#mock-background').hide();
              $('div#mock-config').hide();
            }
          },
          'button#setMockingScenario': function($input) {
            sessionStorage.setItem('setlocal', '1');
            if ($input.context.id === 'setMockingScenario') {
              var fixtures = {
                  enabled: true
                },
                scenarioIdFixture = this.$(this.attrs.scenarioId).val(),
                scenarioDateTimeFixture = this.$(this.attrs.scenarioDateTime).val();
              if (scenarioIdFixture != 'null') {
                fixtures.scenarioIdFixture = scenarioIdFixture;
              }
              if (scenarioDateTimeFixture != 'null') {
                fixtures.scenarioDateTimeFixture = scenarioDateTimeFixture;
              }
              //@TODO: REMOVE HACK
              componentChannel.emit('trigger', {
                target: self,
                value: 'scenarioEnabled',
                enabled: true,
                scenarioIdFixture: scenarioIdFixture,
                scenarioDateTimeFixture: scenarioDateTimeFixture,
              });
              $('div#mock-background').hide();
              $('div#mock-config').hide();
            }
          },
          '#unsetMockingScenario': function() {
            sessionStorage.setItem('setlocal', '0');
            $('div#mock-background').hide();
            $('div#mock-config').hide();
          },
          '#closeMocking': function($input) {
            if ($input.context.id === 'closeMocking') {
              $('div#mock-background').hide();
              $('div#mock-config').hide();
            }
          }
        }
      };
      /**
       * Init.
       */
      this.init = function() {};
      /**
       * Default enable mock.
       */
      this.defaultEnableMock = function() {
        $('#setMocking').click();
      };
      /**
       * On data change.
       */
      this.onDataChange = function onDataChange() {
        this.rerender();
      };
    };
  });