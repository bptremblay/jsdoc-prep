/**
 * @author DST SFO 2
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module component/dashboard/myProfile/mailingAddress
 * @requires blue/event/channel/controller
 */
define(function( require ) {

	var controllerChannel = require('blue/event/channel/controller'),
		componentChannel = require('blue/event/channel/component'),
		when = require('when/when'),
		contentUtil = require('dashboard/lib/myProfile/contentUtil'),
		commonComponentsUtil = require('dashboard/lib/myProfile/commonComponentsUtil'),
		BaconModelCache = require('dashboard/lib/myProfile/baconModelCache');
	return {
		/**
		 * @function
		 * Sets context and controllerChannel object.
		 */
		init: function() {
			this.mode = 'VIEW';
			this.controllerChannel = controllerChannel;
			this.componentChannel = componentChannel;
			this.controller = this.settings.context;
			this.commonComponentsUtil = commonComponentsUtil();
			this.baconModelCache = new BaconModelCache();
			this.componentChannel.on('resetToView', this._resetToView.bind(this));
		},
		/**
		 * @function
		 * TODO: Remove it once spec is updated.
		 */
		addPermanentMailingAddress: function(){
		},
		/**
		 * @function
		 * TODO: Remove it once spec is updated.
		 */
		addTemporaryMailingAddress: function(){
		},
		/**
		 * @function
		 * Emit controller Channel event to edit mailing address.
		 */
		editMailingAddress: function(){
			this.controllerChannel.emit('showEditMailingAddressForm', { addressData: this.model.get(), mode: 'EDIT' });
		},
		/**
		 * @function
		 * Emit controllerChannel event to show delete confirmation modal.
		 */
		deleteMailingAddress: function(){
			this.controllerChannel.emit('showDeleteMailingAddressConfirmation', { addressData: this.model.get()});
		},
		/**
		 * @function
		 * 1. Make Validate service call.
		 * 2. If result has 1 address option then emit controllerChannel event to list Mailing address with
		 * messageInfo data.
		 * 3. If result has 2 address options, transform result and emit controllerChannel event to show
		 * addition verification modal with transformed data.
		 */
		saveMailingAddressChanges: function(eventData){

			// Manually add the date from the date picker components registered on the mailing address controller.
			// These dates are formatted on the data transform layer.
			if(eventData.context.mailingAddressCategory === 'TEMPORARY'){
				eventData.context.mailingAddressEffectiveDate = this.context.controller.components.datePickerFromComponent.model.lens('selectedDate').get();
				eventData.context.mailingAddressEndDate = this.context.controller.components.datePickerToComponent.model.lens('selectedDate').get();
			}
			// We need to know whether to call the edit or add service. If there's an addressID,
			// we know we're submitting an edited form. Otherwise we're submitting an add form.
			var serviceCall = eventData.context.id ? 'myProfile.mailingAddress.edit.validate.svc':
									'myProfile.mailingAddress.add.validate.svc',
				postData = this.context.controller.dataTransform.transformAddressDataForPost(eventData.context, this.model.lens('groupId').get());

			this.context.controller.myProfileServices.mailingAddress[serviceCall](postData)
				.then(function(validateData){

					// when status code is VALID
					if(validateData.statusCode === "VALID"){
						if (validateData.addressOptions.length === 1) {

							this.context.controller.myProfileServices.mailingAddress['myProfile.mailingAddress.commit.svc']({
								formId: validateData.formId,
								optionId: validateData.addressOptions[0].optionId
							}).then(function(commitData){
									if(commitData.code === 'SUCCESS') {
										this.controllerChannel.emit('listMailingAddress',
										this.context.controller.dataTransform.transformAddressAddedMessage({ line1: validateData.addressOptions[0].address.line1, isEdit: !!eventData.context.id }, 'success'));
									} else {
										console.log('saveMailingAddressChanges Service Failure Handler Called');
									}
								}.bind(this), function(jqXHR){
									console.log('saveMailingAddressChanges Service Error Handler Called');
								}.bind(this));

						} else {
							this.controllerChannel.emit('showAddressAdditionVerificationModal',
							this.context.controller.dataTransform.transformAddressVerificationData(validateData, !!eventData.context.id));
						}
					}

					// set validation statusCode in response
					else {
						this.output.emit('trigger', {
							value: 'serverValidation',
							statusCode: validateData.statusCode
						});
					}

				}.bind(this), function(jqXHR){
					console.log('400 bad request');
						this.output.emit('trigger', {
							value: 'serverValidation',
							statusCode: 'UNKNOWN_SERVER_ERROR'
						});
				}.bind(this));
		},
		/**
		 * @function
		 * Destroy mailing address edit form (both add and edit)
		 */
		cancelMailingAddressChanges: function(){

			this.baconModelCache.restore();

			// If we have an add form(No address id), simply destroy the view
			if (!this.model.lens('id').get()) {
				this.destroyView();
			// Otherwise we need to rerender the read only view
			} else {
				this._renderInViewMode();
			}
		},
		/**
		 * @function
		 * Emit controllerChannel event to show add mailing address form.
		 */
		requestMailingAddressTypeDetails: function(eventData){
			var addressType = eventData.domEvent.target.value;

			// Get country and state list, clear pre-populated fields
			when(this._getCountriesOrStates(addressType)).done(function(list){
				if(!list.cached){
					list.countries && this._sortList(list.countries, 'description');
				}
				this._setCountriesOrStates(list, addressType);
				this.output.emit('trigger', { value: 'resetValidation' });
				this.output.emit('trigger',{
					value:'resetMailingAddressData',
					countries: list.countries || [],
					states: list.states || [],
					state: '',
					country: '',
					city: '',
					postalCode: '',
					zipCode: '',
					zipCodeExtension: ''
				});
			}.bind(this));
		},
		/**
		 * @function
		 * Render component and insert it to target.
		 */
		_render: function(options, data){
			var callbackFunction = function(){
				this.controller.executeCAV( [ this, options.view, { target: options.target, react: true } ]);
			}.bind(this);
			if(options.mode === 'ADD'){
				this.componentChannel.emit("resetToView");
				this._populateAddAddressData(data, callbackFunction);
			} else if(options.mode === 'EDIT'){
				this.baconModelCache.cache(this.model);
				this.componentChannel.emit("resetToView");
				this._populateEditAddressData(data, callbackFunction);
			} else{
				callbackFunction();
			}

			this.commonComponentsUtil.insertContextualHelpComponent(this.context.controller, {
				name: 'contextualHelpComponent-' + (this.model.lens('id').get() || 'Add'),
				id: 'contextual-help-' + (this.model.lens('id').get() || 'add') ,
				target: '#contextual-help-container-' + (this.model.lens('id').get() || 'add'),
				message: this.model.lens('mailing_address_linked_accounts_advisory').get()
			});

			this.mode = options.mode;
		},
		/**
		 * @function
		 * Render component and insert it to target.
		 */
		_renderInViewMode: function(){
			this._render({
				view: 'myProfile/mailingAddressView',
				target: this.model.lens('target').get(),
				mode: 'VIEW'
			});
		},
		/**
		 * @function
		 * If component is in EDIT mode render it in view mode,
		 * else if it's in ADD mode destroy it.
		 */
		_resetToView: function(){
			this.mode === 'EDIT' && this._renderInViewMode();
			this.mode === 'ADD' && this.destroyView();
		},
		/**
		 * @function
		 * Populate add address data.
		 */
		_populateAddAddressData: function(data, callbackFunction){
			var addressType = data.mailingAddressType;
			when.join(this._getAddOptions(data.mailingAddressCategory), this._getStates(addressType))
				.done(function(results){
					this.model.lens('addressOptions').set(this.controller.dataTransform.transformAddressOptions(results[0]));
					this._setCountriesOrStates(results[1], addressType);
					callbackFunction.call();
				}.bind(this));
		},
		/**
		 * @function
		 * @param data {object}
		 * @param callbackFunction {function}
		 * Populate edit address data.
		 */
		_populateEditAddressData: function(data, callbackFunction){
			when.join(this._getEditOptions(data.id), this._getCountriesOrStates(data.mailingAddressType))
				.done(function(results){
					this.model.lens('mailingAddressCategory').set(results[0].addressCategory);
					this.model.lens('addressOptions').set(this.controller.dataTransform.transformAddressOptions(results[0]));
					this._setCountriesOrStates(results[1], data.mailingAddressType);
					callbackFunction.call();
			}.bind(this));
		},
		/**
		 * @function
		 * @param addressCategory {string}
		 * @return promise {object}
		 * Make add options service call and return promise.
		 */
		_getAddOptions: function(addressCategory){
			// return this.controller.myProfileServices.mailingAddress['myProfile.mailingAddress.addOptions.vt']({
			return this.controller.myProfileServices.mailingAddress['myProfile.mailingAddress.addOptions.svc']({
				addressCategory: addressCategory
			});
		},
		/**
		 * @function
		 * @param addressId {string}
		 * @return promise {object}
		 * Make edit options service call and return promise.
		 */
		_getEditOptions: function(addressId){
			return this.controller.myProfileServices.mailingAddress['myProfile.mailingAddress.editOptions.svc']({
				addressId: addressId
			});
		},
		/**
		 * @function
		 * @param addressType {string}
		 * If addressType is INTERNATIONAL call _getCountries or call _getStates.
		 */
		_getCountriesOrStates: function(addressType){
			if(addressType == 'INTERNATIONAL'){
				return this._getCountries();
			}else{
				return this._getStates(addressType);
			}
		},
		/**
		 * @function
		 * @param list {object} list of states or countries returend from service call
		 * @param addressType {string}
		 * @param promise {object}
		 * If addressType is INTERNATIONAL call _setCountries or call _setStates.
		 */
		_setCountriesOrStates: function(list, addressType){
			if(addressType == 'INTERNATIONAL'){
				this._setCountries(list);
				// Setting empty list, requires for ractive to rerender when data is added.
				this._setStates({states:[]});
			}else{
				this._setStates( list, addressType);
				// Setting empty list, requires for ractive to rerender when data is added.
				this._setCountries({countries:[]});
			}
		},
		/**
		 * @function
		 * @return promise {object}
		 * Make country list service call and return promise.
		 */
		_getCountries: function(){
			var countries =  this.controller.model.lens('countryList.countries').get();
			if(countries){
				return {
					cached: true,
					countries: countries
				};
			} else {
				return {countries: contentUtil.getList('COUNTRY')};
				// return this.controller.myProfileServices.mailingAddress['myProfile.mailingAddress.countryList.svc']({});
			}
		},
		/**
		 * @function
		 * @param list {object}
		 * Set countries to component model.
		 */
		_setCountries: function(list){
			if(!list.cached && list.countries.length){
				this.controller.model.lens('countryList.countries').set(list.countries)
			}
			this.model.lens('countries').set(list.countries);
		},
		/**
		 * @function
		 * @param addressType {string}
		 * @return promise {object}
		 * Make state list service call and return promise.
		 */
		_getStates: function(addressType){
			var states =  this.controller.model.lens('stateList.'+ addressType).get();
			if(states){
				return {
					cached: true,
					states: states
				};
			} else {
				return this.controller.myProfileServices.mailingAddress['myProfile.mailingAddress.stateList.svc']( {
					addressType: addressType
				});
			}
		},
		/**
		 * @function
		 * @param addressType {string}
		 * @param list {object}
		 * Sort states for given addressType
		 */
		_setStates: function(list, addressType){
			if(!list.cached && list.states.length){
				this.controller.model.lens('stateList.'+ addressType).set(list.states);
			}
			this.model.lens('states').set(list.states);
		},
		/**
		 * @function
		 * @param list {object}
		 * @param sortOn {string}
		 * Sort list on property to sort on.
		 */
		// TODO: Should move it to common util?
		_sortList: function(list, sortOn){
			list.sort(function(a, b){
				if (a[sortOn] < b[sortOn]) return -1;
				if (a[sortOn] > b[sortOn]) return 1;
				return 0;
			});
		}
	};
});
