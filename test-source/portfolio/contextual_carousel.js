/**
 * contextual_carousel.js
 */
define(
		[ 'jquery', 'messages', 'logger', 'info_panel' ],
		/**
		 * @exports contextual_carousel
		 * @requires jquery
		 */
		function($, Messages, Logger, InfoPanel) {
			'use strict';

			var infoPanel = null;
			/**
			 * @constructor
			 */
			function ContextualCarousel() {

			}

			ContextualCarousel.prototype.show = function() {
				this.element.show();
			};

			ContextualCarousel.prototype.hide = function() {
				this.element.hide();
			};

			ContextualCarousel.prototype.initialize = function() {

				// info panel
				var details = $('<div />');
				//details.hide();
				this.element = details;

				var bigSlider = document.createElement('div');
				bigSlider.className = 'bigSlider';
				this.bigSlider = $(bigSlider);
				this.bigSlider
						.html('<div id=\'slider-id\'></div><div class=\'big-picture\'></div>');
				details.append(bigSlider);

				if (infoPanel == null) {
					infoPanel = new InfoPanel();
					infoPanel.initialize();
					Messages.observe('gallery_view', infoPanel, this);
				}

			};

			ContextualCarousel.prototype.renderGeneral = function(data) {
				var item = data.timeline;
				var skel = [];

				skel
						.push('<div id="carousel-example-generic" class="carousel slide" data-interval="false" data-ride="carousel">');
				skel.push('  <!-- Indicators -->');
				skel.push('  <ol class="carousel-indicators">');

				skel.push('  </ol>');
				skel.push('');
				skel.push('  <!-- Wrapper for slides -->');
				skel.push('  <div class="carousel-inner">');

				// SHOULD THIS CODE LIVE HERE????

				// These are the thumbnails above the big slide.
				// Part of the details panel.
				var galleryLightboxHTML = '';

				for (var index = 0; index < item.length; index++) {
					var slide = item[index];
					var slideName = slide.date;
					var genres = slide.events;
					if (index === 0) {
						skel.push('    <div class="active item">');
					} else {
						skel.push('    <div class="item">');
					}
					// content in here <<<
					skel.push('<div class="c-frame">');
					skel.push('<h2 class="c-text">' + slideName + '</h2>');

					//$(".carousel-control.left").width()
					skel.push('<div class="c-cell">');
					//skel.push('<ul class="c-list">');
					for (var g = 0; g < genres.length; g++) {
						var genre = genres[g];
						//skel.push('<li>' + genre.title + '</li>');

						var slide = genre.slideInstances[0];
						var thumb = genre.slideThumbs[0];
						var img = $(slide).find('.gallery-item');
						var bigSrc = genre.slideSources[0];
						var slideName = 'Slide ' + (0 + 1);

						skel.push('<div class="internal-pictures">');
						skel.push('<img height="300" src="' + bigSrc
								+ '" alt="' + slideName + '" />');
						skel.push('</div>');

						skel.push('<div class="internal-info">');
						skel.push(infoPanel.render(genre));
						skel.push('</div>');

						//						skel.push('<div class="internal-slider">');
						//						skel.push('</div>');
					}
					//skel.push('</ul>');

					skel.push('</div>');
					skel.push('</div>');
					skel.push('      <div class="carousel-caption">');
					//skel.push(slideName);
					skel.push('      </div>');
					skel.push('    </div>');
				}

				skel.push('    ');
				skel.push('  </div>');
				skel.push('');
				skel.push('  <!-- Controls -->');
				skel
						.push('  <a class="left carousel-control" href="#carousel-example-generic" data-slide="prev">');
				skel
						.push('    <span class="glyphicon glyphicon-chevron-left"></span>');
				skel.push('  </a>');
				skel
						.push('  <a class="right carousel-control" href="#carousel-example-generic" data-slide="next">');
				skel
						.push('    <span class="glyphicon glyphicon-chevron-right"></span>');
				skel.push('  </a>');
				skel.push('</div>');

				galleryLightboxHTML = skel.join('\n');

				//console.log(galleryLightboxHTML);

				$('#slider-id').html(galleryLightboxHTML);
			};

			/**
			 * TODO: normalize signature
			 * @param item
			 * @param slideIndex
			 */
			ContextualCarousel.prototype.render = function(data) {
				this.show();
				this.renderGeneral(data);

				$('#slider-id').carousel({
					interval : false
				});

			};

			return ContextualCarousel;
		});