/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module Indexthis
 **/
define(function(require) {

    return function HeaderController() {

        var observable = require('blue/observable'),
            componentChannel = require('blue/event/channel/component'),
            controllerChannel = require('blue/event/channel/controller'),
            MyInfoSpec = require('bluespec/my_info_menu'),
            MyInfoMethods = require('dashboard/component/header/myInfoMenu'),
            TopMenuSpec = require('dashboard/spec/header/topMenu'),
            TopMenuMethods = require('dashboard/component/header/topMenu'),
            $this = this;

        this.init = function() {
            this.model= observable.Model({
                myInfoComponent:{
                    fullName: ''
                },
                topMenuComponent:{
                    navigation: null
                }

                });
              //Create named instances that are available @controller.components.{componentName}
            this.register.components(this, [{
                name: 'myInfoComponent',
                model: this.model.lens('myInfoComponent'),
                spec: MyInfoSpec,
                methods: MyInfoMethods
            }, {
                name: 'topMenuComponent',
                model: this.model.lens('topMenuComponent'),
                spec: TopMenuSpec,
                methods: TopMenuMethods
            }]);

            componentChannel.on({
            	'headerview/view/trigger/everydaylivingclick': function() {
            	    $this.components.topMenuComponent.everydayLivingClick();
            	}
            });

            componentChannel.on({
            	'headerview/view/trigger/logout': function() {
                    $this.components.myInfoComponent.logOutOnlineBanking();
                }
            });

            componentChannel.on({
            	'headerview/view/trigger/myprofile': function() {
            	    $this.components.myInfoComponent.requestMyProfile();
            	}
            });

            componentChannel.on({
            	'headerview/view/trigger/investmentsclick': function() {
                    $this.components.topMenuComponent.investmentsClick();
                }
            });

            componentChannel.on({
            	'headerview/view/trigger/goalsclick': function() {
                    $this.components.topMenuComponent.goalsClick();
                }
            });

            controllerChannel.on({
                'initHeader': function(params) {
                    this.index(params);
                }.bind(this)
            });

            controllerChannel.on({
                convoDeckGreetingResponseReceived: this.updateCustomerName.bind(this)
            });
        };

        //Update user name on the myinfo Menu received from greeting component.
        this.updateCustomerName = function(data){
             this.model.lens('myInfoComponent.fullName').set(data.fullName);
        };
        /**
         * Function for default action
         * @function index
         * @memberOf module:Indexthis
         */
        this.index = function() {

            if($('#dashboard-header').length)
            {
                return;

            }
            
            this.model.lens('topMenuComponent').set(this.settings.get('topMenuInstance'));
            this.executeCAV([[this.components.topMenuComponent, 'header/header', {'target': '#top-header-content',react: true}],[this.components.myInfoComponent, 'header/myInfoMenu', {'target': '#myinfomenu',react: true}]]);
            
            this.elementObserver.isInserted('#dashboard-header', function(){
                controllerChannel.emit('dashboardHeaderLoaded');
            });
        };
    };
});
