/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module digital-ui/src/dashboard/js/lib/quickPay/serviceErrorResponseHelper
 * @classdesc
 * This will render error message by the setting key of the component
 * In Ractive: it will simply update the setting keys
 *				//in ractive the templete code should be similar this this:
 *				//{{#if cspecSettingkey}} <div> {{{cspecSettingkey}}}</div> {{/if}}
 *
 * In Handlebars, this will emit a message @param emitMessage
 * additional handle of the message will need to be implemented if your component: Please see qpSend controller/component for ref
 */
define(function(require){
	var dynamicContentUtil = require('common/utility/dynamicContentUtil'),
		is = require( 'blue/is' );

	/**
	 * renderError(): this updates the component's settings to show the corresponding server error message
	 * @function
	 * @param {object} data
	 * @param {object} component
	 * @param {string} cspecSettingkey
	 * @param {object||function} dynamicContent [optional] //is the data to dynamicContent substitute e.g.{amount: 100, name: 'SUPER MAN', code: '1345'}
	 * @param {object} handlebarData [optional] //set this data if used for handlebar template e.g. {isHandlebar: true, emitMessage : 'qp_sendServerValidationError', targetId: '#errorMsg'}
	 * @example
	 *  serviceErrorResponseHelper.renderError(jqXHR, this, 'verify_send_money_error');
	 *  serviceErrorResponseHelper.renderError(jqXHR, this, 'verify_send_money_error', null, {isHandlebar: true, emitMessage : 'qp_sendServerValidationError', targetId: '#errorMsg'});
	 * 	serviceErrorResponseHelper.renderError(jqXHR, this, 'verify_send_money_error', {amount: 100, name: 'SUPER MAN', code: '1345'});
	 * 	serviceErrorResponseHelper.renderError(jqXHR, this, 'verify_send_money_error', {amount: 100, name: 'SUPER MAN', code: '1345'}, {isHandlebar: true, emitMessage : 'qp_sendServerValidationError', targetId: '#errorMsg'});
	 *  serviceErrorResponseHelper.renderError(jqXHR, this, 'verify_send_money_error', function(data) {return data + 'do what you need';},{isHandlebar: true, emitMessage : 'qp_sendServerValidationError', targetId: '#errorMsg'});
	 */
	var renderError = function(data, component, cspecSettingkey, dynamicContent, handlebarData) {
		if ( data.statusCode)
		{
			var statusCode = data.statusCode;
			//Comments below are another way to set the component resource bundle
			// var tempL = dynamicContentUtil.dynamicSettings.get(this, 'payee_name_label', 'TEST');
			// context.model.lens('sendComponent.payee_name_label').set(tempL);
			// var tempL2 = context.model.lens('sendComponent.payee_name_label').get();

			//in ractive the templete code should be similar this this:
			//{{#if cspecSettingkey}} <div> {{{cspecSettingkey}}}</div> {{/if}}
			if ( dynamicContent ) //only if there are dynamic content/ substitution(s) needed
			{
				var dContent = '';
				if ( is.function(dynamicContent) )
				{
					dContent = dynamicContent(dynamicContentUtil.dynamicSettings.get(component, cspecSettingkey+'.'+statusCode));
				}
				else {
					dContent = dynamicContentUtil.dynamicContent.get(component, cspecSettingkey+'.'+statusCode, dynamicContent);
				}
				component.model.lens(cspecSettingkey).set(dContent);
			}
			else {
				dynamicContentUtil.dynamicSettings.set(component, cspecSettingkey, statusCode); // this is all that is needed for ractive
			}
			if ( handlebarData && handlebarData.isHandlebar ) //additional implementation for handlebar tempates
			{
				component.settings.context.controllerChannel.emit(handlebarData.emitMessage, {'targetId': handlebarData.targetId} );
			}
		}
		else{ // should never be in this state
			this.context.logger.error( '***************** renderError else block, should not be here data=>', data );
		}
	};
	/**
	 * clearError(): this clears the component settings to hide the server error message
	 * @function
	 * @param {object} component
	 * @param {string} cspecSettingkey
	 * @param {object} handlebarData [optional] //set this data if used for handlebar template e.g. {isHandlebar: true, emitMessage : 'qp_sendServerValidationError', targetId: '#errorMsg'}
	 * @example
	 *	serviceErrorResponseHelper.clearError(this, 'verify_send_money_error', {isHandlebar: true, emitMessage : 'qp_sendServerValidationError', targetId: '#errorMsg'});
	 *	serviceErrorResponseHelper.clearError(this, 'verify_send_money_error');
	 */
	var clearError = function(component, cspecSettingkey, handlebarData) {
		component.model.lens(cspecSettingkey).set(''); // this is all that is needed for ractive
		if ( handlebarData && handlebarData.isHandlebar ) //additional implementation for handlebar templates
		{
			component.settings.context.controllerChannel.emit(handlebarData.emitMessage, {'targetId': handlebarData.targetId} );
		}
	};

	return {
		renderError : renderError,
		clearError : clearError
	};
});
