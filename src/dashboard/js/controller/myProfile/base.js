/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module ProfileController
 **/
define(function(require) {
	var controllerChannel = require('blue/event/channel/controller'),
		componentChannel = require('blue/event/channel/component');

	return function BaseProfileController() {

		var observable = require('blue/observable'),
			profileContainerSpec = require('bluespec/my_profile_container'),
			profileContainerMethods = require('dashboard/component/myProfile/container'),
			profileMenuSpec = require('blue-spec/dist/spec/my_profile_menu'),
			profileMenuMethods = require('dashboard/component/myProfile/menu');

		this.init = function() {
			this.register.components(this, [
				{
					name: 'profileContainerComponent',
					model: observable.Model.combine({}),
					spec: profileContainerSpec,
					methods: profileContainerMethods
				},
				{
					name: 'profileMenuComponent',
					model: observable.Model.combine({}),
					spec: profileMenuSpec,
					methods: profileMenuMethods
				}]);			
		};

		this.index = function(params) {
			
			var state = params[0] || 'overview';
			// If my profile is not loaded insert profile container component
			if(!document.getElementById('my-profile')){
				this.executeCAV([ this.components.profileContainerComponent, 'myProfile/container', { 'target': '#content', 'react':true}]);
			}

			// Render Profile Menu
			this.components.profileMenuComponent.model.lens('state').set(state);
			this.elementObserver.isInserted('#profile-menu', function(){
				this.executeCAV([ this.components.profileMenuComponent, 'myProfile/menu', { 'target': '#profile-menu', 'react': true } ]);
			}.bind(this));

			// Render Profile details
			this.elementObserver.isInserted('#profile-details', function(){
				switch(state){
					case 'email':
						controllerChannel.emit('listEmails');
						break;
					case 'phone':
						controllerChannel.emit('listPhones');
						break;
					case 'mailingaddress':
						controllerChannel.emit('listMailingAddress');
						break;
					default:
						controllerChannel.emit('theBasics');
						break;
				}
			}.bind(this));

			if(!params[0]){
				// If default profile page is loaded  then set focus on Profile section header 
				this.elementObserver.isInserted('#profile-section-header', function(){
					document.querySelector('#profile-section-header').focus();
				});
			} else {
				// Else set focus on Profile details sub title
				// TODO: This may require review with ADA as in case of error focus should be on error message.
				// Needs delay so that current subtitle is destroyed.
				setTimeout(function(){
					this.elementObserver.isInserted('#profile-subtitle', function(){
						document.querySelector('#profile-subtitle').focus();
					});
				}.bind(this), 200);
			}

		}
	};
})
