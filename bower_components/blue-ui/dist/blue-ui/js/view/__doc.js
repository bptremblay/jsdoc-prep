define(function(require) {
	return function DocumentationView() {

		// Prism does not work with AMD, let it be al mighty for now...
		require('blue-ui/lib/prism');

		this.template = require('../template/__doc');
		this.init = function(){
			// Quick temporary hack
			setTimeout(function(){

				// Get dom elements
				// ====================================================
				var dom = {
					primaryMenu : document.querySelector('.f-menu')
					,menuItems  : document.querySelectorAll('.f-menu li a')
					,menuToggle : document.querySelector('.f-menu-toggle')
					,prototype  : document.getElementById('prototype')
					,chips      : document.querySelectorAll('.f-color-chip')
					,toggleCode : document.querySelectorAll('.f-toggle')
					,toggleAll  : document.querySelectorAll('.f-controls [data-toggle-control]')
				};

				// Get a forEach
				var forEach = Array.prototype.forEach;

				// Set code toggling
				// ====================================================
				forEach.call( dom.toggleCode, function(toggle){
					toggle.addEventListener('click', function () {
						var group = this.parentNode.parentNode.parentNode;

						group.querySelector('[data-toggle="code"]').classList.toggle('f-item-hidden');
					});
				});

				// Set the chips color
				// ====================================================
				forEach.call( dom.chips, function(chip){
					var color = chip.querySelector('.f-color-chip__color').innerHTML;
					chip.style.borderTopColor = color;
				});
				
				// Menu Control
				// ====================================================
				forEach.call( dom.menuItems, function(menuItem){

					// Listen for click events
					menuItem.addEventListener('click', function () {

						// Get the item clicked
						var itemClicked = this;

						// Find the active item
						forEach.call( dom.menuItems, function( item ){
							if( itemClicked.getAttribute('data-href') === item.getAttribute('data-href') ) {
								item.classList.add('f-active');
								// Depricated, but for now this is the animation.
								$('html, body').animate({
									scrollTop: $(itemClicked.getAttribute('data-href')).offset().top - 60 + 'px'
								}, 'medium');
							}
							// Innefficent, but for now this is how we ensure previous ones get deactivated
							else if( item.classList.contains('f-active') ) {
								item.classList.remove('f-active');
							}
						});
					});
				});


				// Super toggles
				// ====================================================
				forEach.call( dom.toggleAll, function( toggler ){

					// On click event toggle all
					toggler.addEventListener('click', function () {
						// Get the state of the super toggle
						this.classList.toggle('f-active');
						var active = this.classList.contains('f-active');
						var type   = this.getAttribute('data-toggle-control');

						// Toggle the items
						forEach.call( dom.toggleCode, function(toggle){
							var code = toggle.parentNode.parentNode.parentNode.querySelector('[data-toggle="'+type+'"]');
							if( active ) { code.classList.remove('f-item-hidden'); }
							else         { code.classList.add   ('f-item-hidden'); }
						});
					});
				});


				// Syntax Highlighting
				// ====================================================
				window.Prism.highlightAll();


			},400);
		};
	};
});
