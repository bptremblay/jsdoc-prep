define(function(require) {

    return function ClassicController() {

        var observable = require('blue/observable'),
            classicSpec = require('dashboard/spec/classic/classic'),
            classicMethod = require('dashboard/component/classic/classic'),
            controllerChannel = require('blue/event/channel/controller'),
            dynamicContentUtil = require('common/utility/dynamicContentUtil');

        // Controller initialization
        // Initialize the model and component meant to be used by actions
        this.init = function() {
            var classicModel = observable.Model({
                iframeElement: '',
                titleElement: ''
            });

            this.model = observable.Model.combine({
                'classicComponent': classicModel
            });

            //Create named instances that are available @controller.components.{componentName}
            this.register.components(this, [{
                name: 'classicComponent',
                model: classicModel,
                spec: classicSpec,
                methods: classicMethod
            }]);


            // Emit the event to set the html content on the footer
            // Here's where we can get content and set it if we wish
            //controllerChannel.emit('set-page-footer-html', { htmlContent: ''});
        };

        /**
         * Function for default action.  This action is meant to render the default view after formulating the URL for each
         * integration point form properties set in 'settings.js' and the existing browser window.
         * @function index
         * @memberOf module:Indexthis
         */
        this.index = function(params) {


            this.settings.set('switchedApp', true, this.settings.Type.USER);

            if (params && params[0]) {
                var url, iframeTitle, appName, accountIndex;

                appName = params[0];
                accountIndex = params[1];

                url = this.settings.get('IFRAME_URL')[appName].url;

                //Append Chase3FramedPage & cipDomain querystring parameters
                // check to see if url already has querystring ?
                var ch = (url.indexOf('?') !== -1)  ? '&' : '?';
                url += ch + 'Chase3FramedPage=true&cipDomain=' + this.getCipDomain();

                //Append AI value to classic site url if it's passed
                if (accountIndex) {
                	url += '&AI=' + accountIndex;
                }

                iframeTitle = this.settings.get('IFRAME_URL')[appName].iframeTitle;

                this.model.lens('classicComponent.iframeElement').set({
                    url: url,
                    dataName: iframeTitle,
                    titleContent: iframeTitle + ' Content'
                });

                var helpContentText = dynamicContentUtil.dynamicSettings.get(this.components.classicComponent, 'help_content');
                var showsContentBelowText = dynamicContentUtil.dynamicSettings.get(this.components.classicComponent, 'shows_content_below');
                var accessibilityHelpBeginContent = dynamicContentUtil.dynamicSettings.get(this.components.classicComponent, 'begin_help_accessibility_content');
                var accessibilityHelpEndContent = dynamicContentUtil.dynamicSettings.get(this.components.classicComponent, 'end_help_accessibility_content');
                var helpToggleLinkContent = dynamicContentUtil.dynamicSettings.get(this.components.classicComponent, 'why_am_i_seeing');
                var hidesContentBelowText = dynamicContentUtil.dynamicSettings.get(this.components.classicComponent, 'hides_content_below');

                this.model.lens('classicComponent.titleElement').set({
                    pageTitle: this.settings.get('IFRAME_URL')[appName].pageTitle,
                    helpContent: helpContentText,
                    showsContent: showsContentBelowText,
                    helpAccessibilityBeginContent: accessibilityHelpBeginContent,
                    helpAccessibilityEndContent: accessibilityHelpEndContent,
                    helpToggleLinkText: helpToggleLinkContent,
                    hidesContent: hidesContentBelowText
                });

                // Emit the event to set the html content on the footer
            	// Here's where we can get content and set it if we wish
            	controllerChannel.emit('set-page-footer-html', { htmlContent: ''});

                //Render the component
                this.executeCAV([this.components.classicComponent, 'classic/classic', {target: '#content'}]);
            }

        };

        // Encapsulate the access to the window object for the host within a function so we can abstract it from the action method.
        // This helps us unit test and mock this particular function so we can use it outside of the browser context
        this.getCipDomain = function() {
        	return window.location.host;
        };
    };
});
