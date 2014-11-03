/**
 * @author DST SFO 2
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module component/dashboard/myProfile/mailingAddressUpdate
 * @requires blue/event/channel/controller
 */
define(['blue/event/channel/controller','when/when'], function( controllerChannel, when ) {

	return {
		/**
		 * @function
		 * Sets context and controllerChannel object.
		 */
		init: function() {
			this.controllerChannel = controllerChannel;
		},
		/**
		 * @function
		 * @param eventData {object} event data received
		 * save brokerage mailing address change request form.
		 */
		saveMailingAddressChanges: function(eventData){

			var serviceCall = 'myProfile.mailingAddress.brokerage.update.svc',
				postData = this.context.controller.dataTransform.transformChangeAddressDataForPost(eventData.context, this.model.lens('accountId').get());

			this.context.controller.myProfileServices.mailingAddress[serviceCall](postData)
				.then(function(returnData){
					if(returnData.code === 'SUCCESS') {
						//console.log('saveMailingAddressChanges Service Success', this.model.lens('mask').get());
						this.controllerChannel.emit('listMailingAddress',
							this.context.controller.dataTransform.transformAddressChangedMessage({ mask: this.model.lens('mask').get()}, 'success')
						);
					} else {
						//console.log('saveMailingAddressChanges Service Error');
						// this.controllerChannel.emit('listMailingAddress',
						// 	this.context.controller.dataTransform.transformAddressChangedMessage({mask: ''}, 'error')
						// );
						this.output.emit('trigger', {
							value: 'serverValidation',
							statusCode: validateData.statusCode
						});
					}
				}.bind(this), function(jqXHR){
					// Handle error condition
					//console.log('saveMailingAddressChanges Service call Failure');
					// this.controllerChannel.emit('listMailingAddress',
					// 	this.context.controller.dataTransform.transformAddressChangedMessage({mask: ''}, 'error')
					// );
					this.output.emit('trigger', {
						value: 'serverValidation',
						statusCode: 'UNKNOWN_SERVER_ERROR'
					});
				}.bind(this));
		},

		/**
		 * @function
		 * @param eventData {object} event data received
		 * cancel brokerage mailing address change request form.
		 */
		cancelMailingAddressChanges: function(eventData){
			this.destroyView();
		},

		/**
		 * @function
		 * @param eventData {object} event data received
		 * Emit controllerChannel event to show add mailing address form.
		 */
		requestMailingAddressTypeDetails: function(eventData){
			var addressType = eventData.domEvent.target.value;

			// Get country and state list, clear pre-populated fields
			when(this._getCountriesOrStates(addressType)).done(function(list){
				if(!list.cached){
					list.countries && this._sortList(list.countries, 'countryDescription');
				}
				this._setCountriesOrStates(list, addressType);
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
		 * @param options {object} options contains target selector
		 * Render component and insert it to target.
		 */
		_render: function(options){
			var callbackFunction = function(){
				this.controller.executeCAV( [ this, options.view, { target: (options.target + ' TD'), react: true } ]);
			}.bind(this);

			this._populateAddressData(callbackFunction);
		},
		/**
		 * @function
		 * @param callbackFunction {function} callback function to be called when data received
		 * Populate add address data.
		 */
		_populateAddressData: function(callbackFunction){
			var addressType = 'USA';
			when.join(this._getCountriesOrStates(addressType))
				.done(function(results){
					this._setCountriesOrStates(results[0], addressType);
					callbackFunction.call();
				}.bind(this));
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
				return this.controller.myProfileServices.mailingAddress['myProfile.mailingAddress.countryList.svc']({});
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
