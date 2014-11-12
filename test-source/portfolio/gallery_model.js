/**
 * js_test_resources/js/gallery_model.js<br />
 */
define(
		[ 'jquery', 'gallery_dao', 'messages', 'logger' ],
		/**
		 * @exports gallery_model
		 * @requires jquery
		 * @requires gallery_dao
		 * @requires messages
		 */
		function($, Dao, Messages, Logger) {
			'use strict';
			/** @alias module:gallery_model */
			var exports = {};
			Messages.observe('gallery-data', Dao, exports);
			/**
			 * Update.
			 *
			 * @param observation
			 * @param data
			 */
			exports.update = function(observation, data) {
				Logger.fine('model update');
				this.items = data.items;

				this.items.reverse();
				this.items.sort(byTime);
				this.genres = getGenres(this.items);
				
				this.timeline = getTimeline(this.items);

				this.categories = getCategories(data.categories, this.genres);
				//console.log(this.timeline);
				//console.log(JSON.stringify(this));
				Messages.notify('gallery-model', this);
			};
			
			function getTimeline(galleryData) {
				var timeline = {};
				for (var index = 0; index < galleryData.length; index++) {
					var item = galleryData[index];
					if (timeline[item.date] == null) {
						timeline[item.date] = [];
					}
					timeline[item.date].push(item);
				}
				var output = [];
				for (var t in timeline){
					if (timeline.hasOwnProperty(t)){
						var tItem = {};
						tItem.date = t;
						tItem.events = timeline[t];
						output.push(tItem);
					}
				}
				output.sort(byTime);
				return output;
			}
			
			/**
			 * Initialize.
			 */
			exports.initialize = function() {
				Logger.fine('Model.initialize');
				Dao.fetch();
				Logger.fine('Model.initialize done');
			};

			function getCategories(categories, genres) {
				var categoryData = [];
				for (var index = 0; index < categories.length; index++) {
					var categoryName = categories[index];
					var item = {};
					item.index = index;
					item.name = categoryName;
					item.genres = getGenresForCategory(categoryName, genres);
					categoryData.push(item);
				}
				return categoryData;
			}

			function decodeHtml(input) {
				var decoded = $("<div/>").html(input).text();
				return decoded;
			}
			
			function byTime(b, a) {
				var dateA = new Date(a.date).getTime();
				var dateB = new Date(b.date).getTime();
				if (dateA > dateB) {
					return 1;
				} else if (dateB > dateA) {
					return -1;
				}
				return 0;
			}

			function getGenresForCategory(categoryName, genres) {
				var output = [];
				for ( var g in genres) {
					if (genres.hasOwnProperty(g)) {
						var genre = genres[g];
						genre.name = g;
						for (var index = 0; index < genre.length; index++) {
							var genreItem = genre[index];
							//alert(decodeHtml(genreItem.tabCategory)+ "," + categoryName);
							if (decodeHtml(genreItem.tabCategory) === decodeHtml(categoryName)) {
								output.push(genreItem);
							}
						}
					}
				}
				output.sort(byTime);
				return output;
			}

			function getGenres(galleryData) {
				var genres = {};
				for (var index = 0; index < galleryData.length; index++) {
					var item = galleryData[index];
					item.index = index;
					if (genres[item.industry] == null) {
						genres[item.industry] = [];
					}
					genres[item.industry].push(item);
				}
				return genres;
			}

			return exports;
		});
