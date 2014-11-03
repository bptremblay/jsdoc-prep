/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module SiteMessageView
 * @requires dashboard/template/conversationDeck/siteMessage
 * @requires dashboard/view/webspec/conversationDeck/siteMessage
 */

define(function(require) {

	return function SiteMessageView() {
		var settings = require('dashboard/settings'),
		SiteMessageBridge = require('blue/bridge').create(require('dashboard/view/webspec/conversationDeck/siteMessage'), {}),
		self = this,
		$body;
		

		/*Bind template*/
		this.template = require('dashboard/template/conversationDeck/siteMessage');

		this.init = function() {
			/*bridge configurations*/
			this.bridge = new SiteMessageBridge({
				targets: {
					site_message_description: '.site_message_description',
					site_message_brief: '.site_message_brief',
					site_message_action_text: '.site_message_action_text',
					close_customer_site_messaging: '.site-message-close',
					expand_message: '.site-message-expand',
					collapse_message: '.site-message-collapse'
				}
			});
			/*cache body object*/
			$body = $('body');

			/*Listening for expand message from 'expandMessage' action method*/
			self.bridge.on('state/expand', function(data) {
                self.expandMsg(data);
            });

			/*Listening for expand message from 'collapseMessage' action method*/
            self.bridge.on('state/collapse', function(data) {
                self.collapseMsg(data);
            });

            /*Listening for expand message from 'closeCustomerSiteMessaging' action method*/
            self.bridge.on('state/dismiss', function(data) {
                self.dismissMsg(data);
            });
		};

		/** @function expandMsg
		* @param {object} [data] [message data]
		* @description Handler function for expanding message
		*/
		this.expandMsg = function (data){
			/*show overlay and content*/
			self.$element.children('.site-message-overlay').show();
			/*show/hide trigger*/
			self.$element.find('a.site-message-expand').hide().end().find('a.site-message-collapse').show();
			/*Add site-message-no-scroll class to block the scrolling on the page*/
			$body.addClass('site-message-no-scroll');
		};
		/** @function collapseMsg
		* @param {object} [data] [message data]
		* @description Handler for collapse message to collapse the full detials section of the message*/
		this.collapseMsg = function (data){
			/*hide overlay and content*/
			self.$element.children('.site-message-overlay').hide();
			/*show/hide trigger*/
			self.$element.find('a.site-message-expand').show().end().find('a.site-message-collapse').hide();
			/*remove site-message-no-scroll class to allow the scrolling on the page*/
			$body.removeClass('site-message-no-scroll');
		};
		/** @function dismissMsg
		* @param {object} [data] [message data]
		* @description Handler for dismiss message to remove the message from the dom*/
		this.dismissMsg = function (data){
			/*delete the HTML node from dom*/
			self.$element.remove();
			/*remove site-message-no-scroll class to allow the scrolling on the page*/
			$body.removeClass('site-message-no-scroll');
		};
	};
});
