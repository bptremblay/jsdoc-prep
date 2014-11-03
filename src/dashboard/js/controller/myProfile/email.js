/**
 * @author DST SFO 2
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module controller/dashboard/myProfile/email
 */
define(function (require){
	var controllerChannel = require('blue/event/channel/controller');

	return function EmailController(){

		var observable = require('blue/observable'),
			emailComponentsMapper = {
				'EMAIL':{
					spec: require('bluespec/my_profile_email_address'),
					methods: require('dashboard/component/myProfile/email'),
					view: 'myProfile/email'
				},
				'EMAIL_HEADER': {
					spec: require('bluespec/my_profile_email_address_header'),
					methods: require('dashboard/component/myProfile/emailHeader'),
					view: 'myProfile/emailHeader'
				}
			},
			dynamicContentUtil = require('common/utility/dynamicContentUtil');

		/**
		 * @function
		 * Initializes controller model and controllerChannel event to list emails
		 */
		this.init = function() {

			this.model = observable.Model.combine({
				'emailComponent': {},
				'emailHeaderComponent': {}
			});
			controllerChannel.on({
				'listEmails': function(data) {
					this.list();
				}.bind(this)
			});

		};

		/**
		 * @function
		 * param {object} messageInfo Message information displayed in header
		 * Makes profile emails list calls and calls insertEmailComponents function
		 * to insert compoents after service response is successful.
		 */
		this.list = function(messageInfo) {
			this.commonComponentsUtil.showSpinner({ target: '#profile-details' });
			this.myProfileServices.email['myProfile.email.list.svc']({
			}).then(function(data) {
				this.insertEmailComponents(data);
			}.bind(this), function(jqXHR) {
				this.insertEmailComponents({ emailComponent: {}, emailHeaderComponent: {} },
						{ type: 'error', isListServiceError: true});
			}.bind(this));
		},

		/**
		 * @function
		 * Registers and insert components.
		 */
		this.insertEmailComponents = function(data, messageInfo){
			
			// Register compoents one time
			!(this.components && this.components.emailComponent) && this.register.components(this, [{
				name: "emailComponent",
				model: this.model.lens('emailComponent'),
				spec: emailComponentsMapper.EMAIL.spec,
				methods: emailComponentsMapper.EMAIL.methods
			}]);

			!(this.components && this.components.emailHeaderComponent) && this.register.components(this, [{
				name: "emailHeaderComponent",
				model: this.model.lens('emailHeaderComponent'),
				spec: emailComponentsMapper.EMAIL_HEADER.spec,
				methods: emailComponentsMapper.EMAIL_HEADER.methods
			}]);

			// Update component model with new data
			this.model.lens('emailComponent.emailAddresses').set(data.emailComponent.emailAddresses);
			this.model.lens('emailHeaderComponent.addAllowed').set(data.emailHeaderComponent.addAllowed);
			if(messageInfo) {
				this.model.lens('emailHeaderComponent.messageInfo').set(messageInfo);
				messageInfo.isListServiceError && dynamicContentUtil.dynamicSettings.set(this.components.emailHeaderComponent, 'email_address_error', 'list');
			}

			this.executeCAV( [
				[ this.components.emailHeaderComponent, emailComponentsMapper.EMAIL_HEADER.view, { 'target':'#profile-details', react: true }],
				[ this.components.emailComponent, emailComponentsMapper.EMAIL.view, { 'target':'#profile-details', append: true, react: true }] 
			]);

			data.emailComponent.emailAddresses.forEach(function(email){
				this.commonComponentsUtil.insertContextualHelpComponent( this, {
					name: 'contextualHelpComponent-' + email.id,
					id: 'contextual-help-' + email.id,
					target: '#contextual-help-container-' + email.id,
					message: this.components.emailComponent.model.lens('use_for_account_help_message').get()
				});
			}.bind(this));

		};
		
	};
})
