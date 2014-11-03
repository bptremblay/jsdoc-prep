/**
 * @author DST SFO 2
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module dashboard/lib/myProfile/commonComponentsUtil
 * This module contains functions used for inserting common components
 **/
define(function(require) {

	return function CommonComponentsUtil(settings) {
		var elementObserver = require('dashboard/lib/myProfile/elementObserver')(),
			observable = require('blue/observable'),
			componentsMapper = {
				'CONTEXTUALHELP':{
					spec: require('blue-spec/dist/spec/layout'),
					methods: require('dashboard/component/myProfile/contextualHelp'),
					view: 'myProfile/contextualHelp'
				}
			};

		return {
			/**
			 * @function
			 * @param {object} controller 
			 * @param {objet} options
			 * Registers and insert contextual help component.
			 */
			insertContextualHelpComponent: function(controller, options){
			
				controller.register.components(controller, [{
					name: options.name,
					model: observable.Model.combine({
						contextualHelpId:  options.id,
						message: options.message
					}),
					spec: componentsMapper.CONTEXTUALHELP.spec,
					methods: componentsMapper.CONTEXTUALHELP.methods
				}]);

				elementObserver.isInserted(options.target, function(target){
					controller.executeCAV([ controller.components[options.name], componentsMapper.CONTEXTUALHELP.view, { target: target, react: true }] );
				});

			},
			/**
			 * @function
			 * @param {objet} options
			 * Show spinner on given target.
			 */
			showSpinner: function(options){
				$(options.target).html('<h2>Loading...</h2>');
			}
		};
	};
});