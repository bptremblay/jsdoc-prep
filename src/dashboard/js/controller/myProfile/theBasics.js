/**
 * @copyright &copy; JPMorgan Chase & Co. All rights reserved.
 * @module ProfileController
 **/
define(function (require){
  var controllerChannel = require('blue/event/channel/controller'),
		componentChannel = require('blue/event/channel/component');

	return function TheBasicsController(){

		var observable = require('blue/observable'),
			theBasicsSpec = require('blue-spec/dist/spec/layout'),
			theBasicsMethods = require('dashboard/component/myProfile/theBasics');

		this.init = function() {
			controllerChannel.on({
				'theBasics': function(data) {
					this.theBasics();
				}.bind(this)
			});
		};

		this.theBasics = function(data){
			this.register.components(this, [{
					name: 'theBasicsComponent',
					model: observable.Model.combine({}),
					spec: theBasicsSpec,
					methods: theBasicsMethods
			}]);
			this.executeCAV([ this.components.theBasicsComponent, "myProfile/theBasics", {'target':'#profile-details'} ]);
		}
	};
})
