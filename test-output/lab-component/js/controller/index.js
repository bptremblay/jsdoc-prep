/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module AuthController
 */
define(
  /**
   * @exports lab-component/js/controller/index
   */
  function(require) {
    /**
     * Creates a new instance of class IndexController.
     * @constructor
     */
    return function IndexController() {
      var observable = require('blue/observable'),
        contactFormSpec = require('lab-component/spec/contactForm'),
        contactFormMethods = require('lab-component/component/contactForm'),
        showDetailsSpec = require('lab-component/spec/showDetails'),
        showDetailsMethods = require('lab-component/component/showDetails'),
        // the event bus
        componentChannel = require('blue/event/channel/component');
      /**
       * Init.
       * @todo Please describe the return type of this method.
       */
      this.init = function() {
        // This sample is using a duplicate model for entryComponent and
        // verifyComponent
        // There is no need for this. One model could be utilized for both
        // Components
        // However, this shows component to component communication
        this.model = observable.Model.combine({
          'contactForm': {
            chkBox: false,
            dropDown: '',
            txtBox: ''
          },
          'showDetails': {
            chkBoxVal: false,
            dropDownVal: '',
            txtBoxVal: ''
          }
        });
        // Create named instances that are available
        // @controller.components.{componentName}
        this.register.components(this, [{
          name: 'contactForm',
          model: this.model.lens('contactForm'),
          spec: contactFormSpec,
          methods: contactFormMethods
        }, {
          name: 'showDetails',
          model: this.model.lens('showDetails'),
          spec: showDetailsSpec,
          methods: showDetailsMethods
        }]);
        // METHOD 3 component-controller communication - component channel listening
        // shown in entry component
        componentChannel.on({
          'action/submit': function(submitEvent) {
            console.log('Component Channel Submit Event:', submitEvent);
            this.components.showDetails.showDetails({
              chkBoxVal: submitEvent.target.chkBox,
              dropDownVal: submitEvent.target.dropDown,
              txtBoxVal: submitEvent.target.txtBox
            });
          }.bind(this)
        });
        /**
* Function for default action.


* @todo Please describe the return type of this method.
*/
        this.index = function() {
          return [
            [this.components.contactForm, 'index', {
              append: false,
              'react': true
            }],
            [this.components.showDetails, 'showDetails', {
              append: true,
              'react': true
            }]
          ];
        };
      };
    };
  });