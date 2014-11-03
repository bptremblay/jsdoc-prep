/**
 * @author DST SFO 2
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module mailingAddressController
 **/


define(function (require){
	var controllerChannel = require('blue/event/channel/controller'),
		componentChannel = require('blue/event/channel/component'),
		dynamicContentUtil = require('common/utility/dynamicContentUtil'),
		when = require('when/when');

	return function MailingAddressController(){
		var observable = require('blue/observable'),
			mailingAddressComponentsMapper = {
			'MAILING_ADDRESS_LIST_CONTAINER':{
				spec: require('blue-spec/dist/spec/layout'),
				methods: require('dashboard/component/myProfile/mailingAddressListContainer'),
				view: 'myProfile/mailingAddressListContainer'
			},
			'MAILING_ADDRESS_VIEW':{
				spec: require('blue-spec/dist/spec/my_profile_address'),
				methods: require('dashboard/component/myProfile/mailingAddress'),
				view: 'myProfile/mailingAddressView'
			},
			'MAILING_ADDRESS_EDIT':{
				spec: require('blue-spec/dist/spec/my_profile_address'),
				methods: require('dashboard/component/myProfile/mailingAddress'),
				view: 'myProfile/mailingAddressEdit'
			},
			'MAILING_ADDRESS_BROKERAGE_ACCOUNTS_VIEW':{
				spec: require('blue-spec/dist/spec/my_profile_brokerage_accounts'),
				methods: require('dashboard/component/myProfile/mailingAddressBrokerageAccounts'),
				view: 'myProfile/mailingAddressBrokerageAccountsView'
			},
			'MY_PROFILE_ADDRESS_UPDATE':{
				//spec: require('dashboard/spec/myProfile/my_profile_address_update'),
				spec: require('blue-spec/dist/spec/my_profile_address_update'),
				methods: require('dashboard/component/myProfile/mailingAddressUpdate'),
				view: 'myProfile/mailingAddressUpdateView'
			},
			'MAILING_ADDRESS_HEADER':{
				spec: require('blue-spec/dist/spec/my_profile_address_header'),
				methods: require('dashboard/component/myProfile/mailingAddressHeader'),
				view: 'myProfile/mailingAddressHeader'
			},
			'MAILING_ADDRESS_DELETE_CONFIRMATION':{
				spec: require('blue-spec/dist/spec/my_profile_address_deletion'),
				methods: require('dashboard/component/myProfile/mailingAddressDeleteConfirmation'),
				view: 'myProfile/mailingAddressDeleteConfirmation'
			},
			'MAILING_ADDRESS_ADDITION_VERIFICATION':{
				spec: require('blue-spec/dist/spec/my_profile_address_addition_verification'),
				methods: require('dashboard/component/myProfile/mailingAddressAdditionVerification'),
				view: 'myProfile/mailingAddressAdditionVerification'
			},
			'MODAL':{
				spec: require('blue-spec/dist/spec/layout'),
				methods: require('dashboard/component/myProfile/modal'),
				view: 'myProfile/modal'
			},
			'CONTEXTUALHELP':{
				spec: require('blue-spec/dist/spec/layout'),
				methods: require('dashboard/component/myProfile/contextualHelp'),
				view: 'myProfile/contextualHelp'
			},
			'DROPDOWN':{
				spec: require('blue-spec/dist/spec/layout'),
				methods: require('dashboard/component/myProfile/dropdown'),
				view: 'myProfile/buttonDropDown'
			},
			'DATEPICKER':{
				spec: require('blue-spec/dist/spec/layout'),
				methods: require('dashboard/component/myProfile/datepicker'),
				view: 'myProfile/datepicker'
			}
		},
		mailingAddressComponentName = 'mailingAddressComponent-';


		this.init = function() {

			controllerChannel.on({ 'showAddMailingAddressForm': this.showMailingAddressForm.bind(this) });
			controllerChannel.on({ 'showEditMailingAddressForm': this.showMailingAddressForm.bind(this) });
			controllerChannel.on({ 'listMailingAddress': this.listAddress.bind(this) });
			controllerChannel.on({ 'showDeleteMailingAddressConfirmation': this.showDeleteAddressConfirmation.bind(this) });
			controllerChannel.on({ 'showAddressAdditionVerificationModal': this.showAddressAdditionVerificationModal.bind(this) });
			controllerChannel.on({ 'hideAddressAdditionVerificationModal': this.hideAddressAdditionVerificationModal.bind(this) });
			controllerChannel.on({ 'hideDeleteMailingAddressConfirmation': this.hideConfirmationModal.bind(this) });
			controllerChannel.on({ 'changeMailingAddress': this.changeMailingAddress.bind(this) });


			// Data Model
			this.model = observable.Model.combine(
			{
				'countryList':{},
				'stateList': {},
				'groupId':undefined
			});

			this.register.components(this, [{
				name: 'addressListContainerComponent',
				model: this.model.lens('addressListContainerComponent'),
				spec: mailingAddressComponentsMapper.MAILING_ADDRESS_LIST_CONTAINER.spec,
				methods: mailingAddressComponentsMapper.MAILING_ADDRESS_LIST_CONTAINER.methods
			}]);

		};

		/**
		* @function Retrieve list of addresses from list service and display
		*
		* Entry point into the mailing address page. Calls DPS service
		* rr-profile-secure-v1-address-profile-list and transforms data
		* before passing it into the address container.
		*
		* @param {Object} additionalInfo: Contains a parameter messageInfo
		* which is used by the container header to display confirmation message
		* on successful submit.
		*/
		this.listAddress = function(additionalInfo){
			this.commonComponentsUtil.showSpinner({ target: '#profile-details' });
			//this.myProfileServices.mailingAddress['myProfile.mailingAddress.list.vt']({"personId":99905001
			this.myProfileServices.mailingAddress['myProfile.mailingAddress.list.svc']({
				}).then(function(data) {
					this.model.lens('groupId').set(data.groupId);
					this.createAddressContainer(this.dataTransform.transformAddressesList(data, additionalInfo));
				}.bind(this), function(jqXHR) {
					this.createAddressContainer(this.dataTransform.transformAddressesList( {},
						  { messageInfo: { type: 'error', title: 'ADDRESS LIST SERVICE ERROR', details: jqXHR.statusText}}));
				}.bind(this));
		};

		/**
		* @function Create address list container
		*
		* We create an address container to contain each individual address
		* component. This calls a function to register and insert the
		* container. Once complete, it waits until the container is rendered
		* on the DOM before calling a function which will insert each address
		*
		* @param {Object} data: Contains data from DPS and any messageInfo used
		* for the success message.
		*/
		this.createAddressContainer = function(data){
			this.insertAddressListContainerComponent(data);
			this.elementObserver.isInserted('#mailing-address-list-container', function(){
				this.insertAddressHeaderComponent(data.header);
				!data.header.noAddress && this.insertAddressComponents(data);
			}.bind(this));
		};

		/**
		* @function Insert list container component
		*
		* Registers and renders the list container component to the DOM.
		* For each address, the list container template is creating an
		* empty div with an id we can target when inserting each individual
		* address component.
		*
		* @param {Object} data: Contains data from DPS and any messageInfo used
		* for the success message. Used by the list container to create empty
		* divs for each address.
		*/
		this.insertAddressListContainerComponent = function(data){
			this.model.lens('addressListContainerComponent').set(data);
			this.executeCAV( [ this.components.addressListContainerComponent, mailingAddressComponentsMapper.MAILING_ADDRESS_LIST_CONTAINER.view, { target: '#profile-details' , react: true }] );
		};

		/**
		* @function Insert address header into list container component
		*
		* The header is a separate component within the list contianer. It
		* contains any messages we're passing in via the messageInfo property
		* on data, a header, and dropdown which allows the user to add a new
		* address. We register the dropdown component here to insert once the
		* element has been inserted into the DOM.
		*
		* @param {Object} data: Contains header data, specifically the messageInfo
		* used to display a success message.
		*/
		this.insertAddressHeaderComponent = function(data){
			this.register.components(this, [{
				name: 'addressHeaderComponent',
				model: observable.Model.combine(data),
				spec: mailingAddressComponentsMapper.MAILING_ADDRESS_HEADER.spec,
				methods: mailingAddressComponentsMapper.MAILING_ADDRESS_HEADER.methods
			}]);

			// check if its a single account association
			if (data.messageInfo && data.messageInfo.associatedAccounts && data.messageInfo.associatedAccounts.length ==1)
				{
					// token to translate from the resource properties
					if (data.messageInfo.mailingAddressCategory == 'TEMPORARY')
						var messageToken = 'delete_temporary_mailing_address_single_account_advisory';
					else
						var messageToken = 'delete_permanent_mailing_address_single_account_advisory';
					// value to be sent
					var messageTokenProps = {'mask':data.messageInfo.associatedAccounts[0].mask},
					// current component
					messageComponent = this.components.addressHeaderComponent;
					dynamicContentUtil.dynamicContent.set(messageComponent, messageToken, messageTokenProps);
				}

			this.executeCAV( [ this.components.addressHeaderComponent, mailingAddressComponentsMapper.MAILING_ADDRESS_HEADER.view, { target: '#mailing-address-header', react: true }] );
			this.executeCAV( [ this.components.addressHeaderComponent, mailingAddressComponentsMapper.MAILING_ADDRESS_HEADER.view, { target: '#mailing-address-header', react: true }] );

			// Button Dropdown Component
			this.register.components(this, [{
				name: 'buttonDropDownComponent',
				model: observable.Model.combine({
							dropdownId: 'dropdown1',
							label: this.components.addressHeaderComponent.model.lens('add_mailing_address_label').get(),
							items: [
								{
									name: this.components.addressHeaderComponent.model.lens('add_permanent_mailing_address_label').get(),
									id : 'add-permanent-address'
								},
								{
									name: this.components.addressHeaderComponent.model.lens('add_temporary_mailing_address_label').get(),
									id : 'add-temporary-address'
								}
							]
						}),
				spec:  mailingAddressComponentsMapper.DROPDOWN.spec,
				methods: mailingAddressComponentsMapper.DROPDOWN.methods
			}]);

			this.elementObserver.isInserted('#button-dropdown1', function(){
				this.executeCAV([ this.components.buttonDropDownComponent, mailingAddressComponentsMapper.DROPDOWN.view, {'target':'#button-dropdown1', 'react':true}]);
			}.bind(this));

		};


		this.insertAddressComponents = function(data) {

			var addressComponents =[],
				addressInstanceName, addressData, i;

			// Primary Address component
			addressData = data.primaryAddress;
			addressInstanceName = mailingAddressComponentName + addressData.id;
			addressData.target = '#address-container-' + addressData.id;
			this.register.components(this, [{
				name: addressInstanceName,
				model: observable.Model.combine(addressData),
				spec: mailingAddressComponentsMapper.MAILING_ADDRESS_VIEW.spec,
				methods: mailingAddressComponentsMapper.MAILING_ADDRESS_VIEW.methods
			}]);

			addressComponents.push( [ this.components[addressInstanceName], mailingAddressComponentsMapper.MAILING_ADDRESS_VIEW.view, { target: '#address-container-' + addressData.id, react: true }] );

			// Contextual Help Component
			this.commonComponentsUtil.insertContextualHelpComponent(this, {
				name: 'contextualHelpComponent-' + addressData.id,
				id: 'contextual-help-' + addressData.id,
				target: '#contextual-help-container-' + addressData.id,
				message: this.components[addressInstanceName].model.lens('mailing_address_linked_accounts_advisory').get()
			});

			for (i in data.secondaryAddresses){
				addressData = data.secondaryAddresses[i];
				addressData.target = '#address-container-' + addressData.id;
				// Secondary address Component
				addressInstanceName = mailingAddressComponentName + addressData.id;
				this.register.components(this, [{
					name: addressInstanceName,
					model: observable.Model.combine(addressData),
					spec: mailingAddressComponentsMapper.MAILING_ADDRESS_VIEW.spec,
					methods: mailingAddressComponentsMapper.MAILING_ADDRESS_VIEW.methods
				}]);

				addressComponents.push([ this.components[addressInstanceName], mailingAddressComponentsMapper.MAILING_ADDRESS_VIEW.view, { target: '#address-container-' + addressData.id, react: true } ]);

				// Contextual Help Component
				this.commonComponentsUtil.insertContextualHelpComponent(this, {
					name: 'contextualHelpComponent-' + addressData.id,
					id: 'contextual-help-' + addressData.id,
					target: '#contextual-help-container-' + addressData.id,
					message: this.components[addressInstanceName].model.lens('mailing_address_linked_accounts_advisory').get()
				});
			}

			for (i in data.temporaryAddresses){
				// Reset Address index to 1 for Temporary Address
				addressData = data.temporaryAddresses[i];
				addressData.target = '#address-container-' + addressData.id;
				// Temporary Address Component
				addressInstanceName = mailingAddressComponentName + addressData.id;
				this.register.components(this, [{
					name: addressInstanceName,
					model: observable.Model.combine(addressData),
					spec: mailingAddressComponentsMapper.MAILING_ADDRESS_VIEW.spec,
					methods: mailingAddressComponentsMapper.MAILING_ADDRESS_VIEW.methods
				}]);

				addressComponents.push([ this.components[addressInstanceName], mailingAddressComponentsMapper.MAILING_ADDRESS_VIEW.view, { target: '#address-container-' + addressData.id, react: true } ]);

				// Flyout Component
				this.commonComponentsUtil.insertContextualHelpComponent(this, {
					name: 'contextualHelpComponent-' + addressData.id,
					id: 'contextual-help-' + addressData.id,
					target: '#contextual-help-container-' + addressData.id,
					message: this.components[addressInstanceName].model.lens('mailing_address_linked_accounts_advisory').get()
				});
			}

			// create investments/brokerage accounts address list
			if(data.investmentAccounts){
				addressData.investmentAccounts = data.investmentAccounts;
				addressData.target = '#investments-address-container';
				this.register.components(this, [{
					name: 'brokerageAddressComponent',
					model: observable.Model.combine(addressData),
					spec: mailingAddressComponentsMapper.MAILING_ADDRESS_BROKERAGE_ACCOUNTS_VIEW.spec,
					methods: mailingAddressComponentsMapper.MAILING_ADDRESS_BROKERAGE_ACCOUNTS_VIEW.methods
				}]);

				this.components.brokerageAddressComponent._render({
					view: mailingAddressComponentsMapper.MAILING_ADDRESS_BROKERAGE_ACCOUNTS_VIEW.view,
					target: addressData.target
				}, addressData);

			}

			// Insert Address Components
			this.executeCAV(addressComponents);
		};

		/* ---- Begin Modal Helper Methods ---- */
 		this.hideConfirmationModal = function(){
			this.components.confirmationModalComponent.hide();
		};

		this.registerConfirmationModal = function(){

			var modalOptions = {
				modalId: 'confirmation-modal',
				// Using delete-confirmation CSS class for now, should be renamed to something more generic
				cssClass: 'delete-confirmation',
				positionTarget: '#my-profile'
			};

			this.register.components(this, [{
				name: 'confirmationModalComponent',
				model: observable.Model.combine(modalOptions),
				spec: mailingAddressComponentsMapper.MODAL.spec,
				methods: mailingAddressComponentsMapper.MODAL.methods
			}]);

		};

		this.insertConfirmationModal = function(){

			if(!this.components.confirmationModalComponent){
				this.registerConfirmationModal();
			}

			if( !this.components.confirmationModalComponent.inserted ) {
				this.executeCAV( [ this.components.confirmationModalComponent, mailingAddressComponentsMapper.MODAL.view, { target: '#my-profile', append: true, react: true}] );
				this.components.confirmationModalComponent.inserted = true;
			}
		};

		this.insertContentIntoModal = function(options){

			var modalContentSelector = '#' +  this.components.confirmationModalComponent.model.lens('modalId').get() + ' .content';

			this.elementObserver.isInserted(modalContentSelector, function(){
				this.executeCAV([options.component, options.viewPath, { target: modalContentSelector, react: true }]);
				this.components.confirmationModalComponent.show();
			}.bind(this));
		};
		/* ---- End Modal Helper Methods ---- */

		this.showDeleteAddressConfirmation = function(data){

			this.insertConfirmationModal();

			this.register.components(this, [{
				name: 'addressDeleteConfirmationComponent',
				model: observable.Model.combine(data.addressData),
				spec: mailingAddressComponentsMapper.MAILING_ADDRESS_DELETE_CONFIRMATION.spec,
				methods: mailingAddressComponentsMapper.MAILING_ADDRESS_DELETE_CONFIRMATION.methods
			}]);


			// check if its a single account association
			if (data.addressData && data.addressData.associatedAccounts && data.addressData.associatedAccounts.length ==1)
				{
					// token to translate from the resource properties
					if (data.addressData.mailingAddressCategory == 'TEMPORARY')
						var messageToken = 'delete_temporary_mailing_address_single_account_advisory';
					else
						var messageToken = 'delete_permanent_mailing_address_single_account_advisory';
					// value to be sent
					var messageTokenProps = {'mask':data.addressData.associatedAccounts[0].mask},
					// current component
					messageComponent = this.components.addressDeleteConfirmationComponent;
					dynamicContentUtil.dynamicContent.set(messageComponent, messageToken, messageTokenProps);
				}


			var executeCAVOptions = {
				component: this.components.addressDeleteConfirmationComponent,
				viewPath: mailingAddressComponentsMapper.MAILING_ADDRESS_DELETE_CONFIRMATION.view
			};

			this.insertContentIntoModal(executeCAVOptions);
		};

		this.showAddressAdditionVerificationModal = function(data){

			// First insert the empty modal
			this.insertConfirmationModal();

			// Add radio buttons options
			this.dataTransform.extendAddressVerificationData(data);

			// Register the component using the mapped data
			this.register.components(this, [{
				name: 'addressAdditionVerificationComponent',
				model: observable.Model.combine(data),
				spec: mailingAddressComponentsMapper.MAILING_ADDRESS_ADDITION_VERIFICATION.spec,
				methods: mailingAddressComponentsMapper.MAILING_ADDRESS_ADDITION_VERIFICATION.methods
			}]);

			// Insert the component to be viewed into the modal
			var executeCAVOptions = {
				component: this.components.addressAdditionVerificationComponent,
				viewPath: mailingAddressComponentsMapper.MAILING_ADDRESS_ADDITION_VERIFICATION.view
			};

			this.insertContentIntoModal(executeCAVOptions);

		};

		this.hideAddressAdditionVerificationModal = function(data){
			this.hideConfirmationModal();
			document.querySelector('#save-address-button').focus();
		};

		this.showMailingAddressForm = function(data){
			var mode = data.mode || 'ADD',
				addressInstanceName;
			if( mode === 'EDIT'){
				data = data.addressData;
			} else {
				data = this.dataTransform.transformAddAddressData(data.address, this.model.lens('groupId').get());
			}
			addressInstanceName = mailingAddressComponentName + (data.id || 'add');

			this.register.components(this, [{
				name: addressInstanceName,
				model: observable.Model.combine(data),
				spec: mailingAddressComponentsMapper.MAILING_ADDRESS_EDIT.spec,
				methods: mailingAddressComponentsMapper.MAILING_ADDRESS_EDIT.methods
			}]);

			this.components[addressInstanceName]._render({
				view: mailingAddressComponentsMapper.MAILING_ADDRESS_EDIT.view,
				target: data.target || '#add-address-container',
				mode: mode
			}, data);

			this.elementObserver.isInserted('#address-form-header' + (data.id || ''), function(target){
				// Needs a delay after element is inserted to set focus.
				setTimeout(function(){
					document.querySelector(target).focus();
				}, 100);
			}.bind(this));

			if(data.mailingAddressCategory === 'TEMPORARY'){
				this.insertDatePickerComponent({
					name: 'datePickerFromComponent',
					datepickerId: 'date-picker-from-component',
					inputId: 'date-picker-from-input',
					inputValue: data.fromDate,
					target: '#date-picker-from' + (data.id || '')
				});

				this.insertDatePickerComponent({
					name: 'datePickerToComponent',
					datepickerId: 'date-picker-to-component',
					inputId: 'date-picker-to-input',
					inputValue: data.toDate,
					target: '#date-picker-to' + (data.id || '')
				});
			}
		};

		/**
		 * @function Brokerage mailing address change form submit.
		 * @param addressData {object} data object from list with accountId and mask
		 */
		this.changeMailingAddress = function(addressData){
			addressData.target = '#brokerage-account-'+addressData.accountId;
			addressData.mask = addressData.mask;
			this.register.components(this, [{
				name: 'brokerageAddressUpdateComponent',
				model: observable.Model.combine(addressData),
				spec: mailingAddressComponentsMapper.MY_PROFILE_ADDRESS_UPDATE.spec,
				methods: mailingAddressComponentsMapper.MY_PROFILE_ADDRESS_UPDATE.methods
			}]);

			this.components.brokerageAddressUpdateComponent._render({
				view: mailingAddressComponentsMapper.MY_PROFILE_ADDRESS_UPDATE.view,
				target: addressData.target
			}, addressData);

		};

		this.insertDatePickerComponent = function(options){

			this.register.components(this, [{
				name: options.name,
				model: observable.Model.combine({
					datepickerId: options.datepickerId,
					inputId: options.inputId,
					inputValue: options.inputValue,
					calendarTemplate: require('dashboard/template/myProfile/calendar')
				}),
				spec: mailingAddressComponentsMapper.DATEPICKER.spec,
				methods: mailingAddressComponentsMapper.DATEPICKER.methods
			}]);

			this.elementObserver.isInserted(options.target, function(target){
				this.executeCAV( [ this.components[options.name], mailingAddressComponentsMapper.DATEPICKER.view, { target: target }] );
			}.bind(this));
		};
	};
});
