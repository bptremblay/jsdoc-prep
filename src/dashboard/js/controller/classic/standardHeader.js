define(function(require) {

	return function StandardHeaderController() {

		// Define our components
		var observable = require('blue/observable'),
			headerSpec = require('dashboard/spec/classic/standardHeader'),
			headerMethods = require('dashboard/component/classic/standardHeader'),
            dynamicContentUtil = require('common/utility/dynamicContentUtil');

		// Our init fuction that sets up the components
		this.init = function() {
			var headerModel = observable.Model({
				properties: null
			});

			this.model = observable.Model.combine({
				'headerComponent': headerModel
			});

		//Create named instances that are available @controller.components.{componentName}
			this.register.components(this, [{
				name: 'headerComponent',
				model: headerModel,
				spec: headerSpec,
				methods: headerMethods
			}]);
		};

		/**
		 * Function for default action.  This fetches the necessary settings to set up the header in the model
		 * and passes those properties to the view.
		 * @function index
		 * @memberOf module:Indexthis
		 */
		this.index = function() {

			var returnToEveryDayLivingUrl = this.settings.get('authRedirectURL', this.settings.Type.USER);

			if (!returnToEveryDayLivingUrl) {
				returnToEveryDayLivingUrl = '#/dashboard';
			}

			// dynamic content read from locale specific resource in common/assets/locale
            var everyDayLivingLabel = dynamicContentUtil.dynamicSettings.get(this.components.headerComponent, 'return_to_everyday');
            var beginHeaderAccessibilityContent = dynamicContentUtil.dynamicSettings.get(this.components.headerComponent,  'begin_header_content');
            var endingHeaderAccessibilityContent = dynamicContentUtil.dynamicSettings.get(this.components.headerComponent, 'end_header_content');

			this.model.lens('headerComponent.properties').set({
				everyDayLivingUrl: returnToEveryDayLivingUrl,
				everyDayLivingLabel : everyDayLivingLabel,
				headerAccessibilityBeginContent : beginHeaderAccessibilityContent,
				headerAccessibilityEndContent : endingHeaderAccessibilityContent
			});

			// Started to work on executeCAV for standardHeader and had to back it out for now because of a presumed target conflict
			// due to using 2 different view engines.
			// This will be revisited when we move to ractive view engine.

			//this.executeCAV([this.components.headerComponent, 'classic/standardHeader', {target:'#top_header_content'}]);

			return ['classic/standardHeader', this.model];
		};

	};

});
