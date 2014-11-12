/**
 * js_test_resources/js/gallery_view.js<br />
 */
define(
    ['jquery', 'gallery_model', 'messages', 'logger', 'contextual_carousel'],
    /**
     * @exports gallery_view
     * @requires jquery
     * @requires gallery_model
     * @requires messages
     */
    function($, Model, Messages, Logger, ContextualCarousel) {
        'use strict';
        /** @alias module:gallery_view */
        var exports = {};

        var minDate = '01/01/1999';
        var gigsPanel = null;
        var carousel = null;
        var genrePanels = {};
        var fossilSwitch = null;
        var galleryBuffer = null;
        var fossilTitle = null;
        var filterSettings = {};
        var selectedItems = [];
        var cursorState = 0;
        var galleryData = [];
        var categories = [];

        // initialize tabs

        /**
         * make some kind of control for categories
         * @param {String} category
         */
        function createCategoryControl(category, active) {
            var decoded = $("<div/>").html(category).text();
            var activeClass = active ? 'active' : '';
            var el = $('<label class="btn btn-lg btn-primary ' + activeClass + '"><input type="radio" name="categories" id="' + category + '">' + decoded + '</label>');
            el.button();
            el.on('click', function() {
                exports.setCategory(decoded);
            });

            $('#categories').append(el);
        }
        
        /**
         * general tab button
         * @param {String} category
         */
        function createTabButton(category, active) {
            var decoded = $("<div/>").html(category).text();
            var activeClass = active ? 'active' : '';
            var el = $('<label class="btn btn-lg btn-primary ' + activeClass + '"><input type="radio" name="categories" id="' + category + '">' + decoded + '</label>');
            el.button();
            el.on('click', function() {
                exports.setCategory(decoded);
            });

            $('#categories').append(el);
        }

        /**
         * Render.
         *
         * @param data
         */
        exports.render = function(data) {
            galleryData = data.items;
            categories = data.categories;

            // render categories:

//            for (var c = 0; c < categories.length; c++) {
//                var category = categories[c];
//                createCategoryControl(category, (c === 0));
//            }
            
            

            // galleryBuffer is the whole big frame??
            galleryBuffer = $('#galleryBuffer');

            if (carousel === null) {
                carousel = new ContextualCarousel();
                carousel.initialize();
                Messages.observe('gallery_view', carousel, exports);
            }
            
            

            var genres = data.genres;

            for (var e in genres) {
                if (genres.hasOwnProperty(e)) {
                    var genre = genres[e];
                    var panelContainer = createGenrePanel(e, genre);
                    genrePanels[e] = panelContainer;
                }
            }

            var fossilSelector = '<p class="fossilTitle">Check <span class="thisbox" ><input id="fossils" type="checkbox" class="fossil-checkbox">this box</span> if you want to see the ancient fossils.</p>';
            galleryBuffer.html(fossilSelector);
            fossilSwitch = $('#fossils');
            fossilTitle = $('.fossilTitle');
            var fossils = fossilSwitch.is(':checked');
            if (fossils) {
                minDate = '01/01/1989';
            } else {
                minDate = '01/01/2000';
            }
            filterItems(minDate, '*', 'Enterprise', '*');
            displayGenrePanels();
            galleryBuffer.detach();

            gigsPanel = $('#gigs');
            gigsPanel.empty();
            gigsPanel.append(galleryBuffer);
            gigsPanel.append(carousel.element);
            // galleryBuffer.show();

            $('.gallery-item').hover(function handlerIn(eventObject) {
                var pair = $(this).attr('id');
                var index = parseInt(pair.split(',')[0], 10);
                var item = galleryData[index];
                var industry = item.industry;
            }, function handlerOut(eventObject) {
                var pair = $(this).attr('id');
                var index = parseInt(pair.split(',')[0], 10);
                var item = galleryData[index];
                var industry = item.industry;
            });

            $('.gallery-item').on('click', function(evt) {
                exports.showItem($(this));
            });

            $('#fossils').on('click', function(evt) {
                exports.showFossils();
            });
            gigsPanel.show();
            carousel.show();
            carousel.render(data);
        };
        /**
         * Pad title.
         *
         * @param {String}
         *            input
         * @return {String}
         */
        function padTitle(input) {
            return input.split(' ').join('_').split('/').join('_');
        }
        /**
         * Create genre panel.
         *
         * @param genreTitle
         * @param genreItems
         * @return {Object}
         */
        function createGenrePanel(genreTitle, genreItems) {
            Logger.fine('createGenrePanel: ' + genreTitle);
            var panelContainer = {};
            var newPanel = document.createElement('div');
            newPanel.className = 'container';
            newPanel.id = genreTitle;
            var title = document.createElement('h2');
            title.id = 'title_' + padTitle(genreTitle);
            title.innerHTML = genreTitle;
            newPanel.appendChild(title);
            for (var index = 0; index < genreItems.length; index++) {
                var item = genreItems[index];
                item.gallerItem = createGalleryItem(item, index);
                newPanel.appendChild(item.gallerItem.element);
            }
            panelContainer.panel = newPanel;
            panelContainer.genreItems = genreItems;

            return panelContainer;
        }

        /**
         * Create gallery item.
         *
         * @param item
         * @param index
         * @return {Object}
         */
        function createGalleryItem(item, index) {
            Logger.fine('createGalleryItem: ' + index);
            item.slideSources = [];
            item.slideThumbs = [];
            item.slideInstances = [];
            var id = 'slide_' + index;
            var itemWrapper = document.createElement('span');
            itemWrapper.className = 'gallery-flow';
            itemWrapper.id = id;
            for (var whichSlide = 0; whichSlide < item.slides.length; whichSlide++) {
                var slide = createGallerySlide(item, whichSlide);
                itemWrapper.appendChild(slide);
            }
            item.element = itemWrapper;
            return item;
        }

        /**
         * Create gallery slide.
         *
         * @param item
         * @param index
         * @return {Object} A jQuery element.
         */
        function createGallerySlide(item, index) {
            var label = item.date + ': <br />' + item.client;
            Logger.fine('createGallerySlide: ' + label);
            var slideName = item.slides[index];
            var venue = item.slideRoot;
            var prefix = item.prefix;
            item.slideThumbs[index] = 'images/thumbnails/' + venue + '/' + prefix + slideName;
            item.slideSources[index] = 'images/projects/' + venue + '/' + prefix + slideName;
            var wrapper = document.createElement('span');
            wrapper.className = 'slide-wrapper';
            var titleDate = document.createElement('span');
            titleDate.innerHTML = item.date;
            titleDate.className = 'slide-title-date';
            var title = document.createElement('span');
            title.className = 'slide-title';
            title.innerHTML = item.client + ' (' + new Date(item.date).getUTCFullYear() + ')';
            var slide = document.createElement('img');
            $(slide).data('bigSrc', item.slideSources[index]);
            slide.id = item.index + '_' + index;
            slide.className = 'gallery-item';
            slide.alt = label;
            wrapper.appendChild(title);
            wrapper.appendChild($('<br />')[0]);
            wrapper.appendChild(slide);
            $(wrapper).data('bigSrc', item.slideSources[index]);
            item.slideInstances.push(wrapper);
            return wrapper;
        }

        /**
         * Display genre panels.
         */
        function displayGenrePanels() {
            Logger.fine('displayGenrePanels()');
            for (var g in genrePanels) {
                if (genrePanels.hasOwnProperty(g)) {
                    var genrePanel = genrePanels[g];
                    galleryBuffer.append($(genrePanel.panel));
                }
            }
        }

        /**
         * Filter genre panels.
         */
        function filterGenrePanels() {
            Logger.fine('filterGenrePanels()');
            var hasFossils = false;
            for (var g in genrePanels) {
                if (genrePanels.hasOwnProperty(g)) {
                    var genrePanel = genrePanels[g];
                    var items = genrePanel.genreItems;
                    var show = false;
                    for (var index = 0; index < items.length; index++) {
                        var item = items[index];
                        if (item.matchedExceptDate && item.ancient) {
                            hasFossils = true;
                        }
                        if (item.show) {
                            show = true;
                        }
                    }
                    if (show) {
                        genrePanel.panel.style.display = 'block';
                    } else {
                        genrePanel.panel.style.display = 'none';
                    }
                }
            }
            if (hasFossils) {
                fossilTitle.show();
            } else {
                fossilTitle.hide();
            }
        }

        /**
         * Filter items.
         *
         * @param date
         * @param industry
         * @param tabCategory
         * @param genre
         */
        function filterItems(date, industry, tabCategory, genre) {
            var ancientDate = new Date('01/01/1999').getTime();
            if (date == null) {
                date = filterSettings.date;
            } else {
                filterSettings.date = date;
            }
            if (industry == null) {
                industry = filterSettings.industry;
            } else {
                filterSettings.industry = industry;
            }
            if (tabCategory == null) {
                tabCategory = filterSettings.tabCategory;
            } else {
                filterSettings.tabCategory = tabCategory;
            }
            if (genre == null) {
                genre = filterSettings.genre;
            } else {
                filterSettings.genre = genre;
            }
            Logger.fine('filterItems: ' + date + ',' + industry + ',' + tabCategory + ',' + genre);
            var theCurrentDate = new Date(date).getTime();
            for (var index = 0; index < galleryData.length; index++) {
                var item = galleryData[index];
                var fossilDate = new Date(item.date).getTime();
                var show = false;
                var dateGood = false;
                var genreGood = false;
                var industryGood = false;
                var categoryGood = false;
                if (item.industry === industry || industry === '*') {
                    industryGood = true;
                }
                if (item.tabCategory === tabCategory || tabCategory === '*') {
                    categoryGood = true;
                }
                if (item.genre === genre || genre === '*') {
                    genreGood = true;
                }
                item.matchedExceptDate = false;
                if (genreGood && categoryGood && industryGood) {
                    item.matchedExceptDate = true;
                }
                item.ancient = false;
                if (fossilDate < ancientDate) {
                    item.ancient = true;
                }
                if (fossilDate > theCurrentDate || date === '*') {
                    dateGood = true;
                }
                if (dateGood && genreGood && categoryGood && industryGood) {
                    show = true;
                }
                item.show = show;
                for (var whichSlide = 0; whichSlide < item.slides.length; whichSlide++) {
                    var slide = item.slideInstances[whichSlide];
                    var img = $(slide).find('.gallery-item');
                    img = $(img);
                    img.data('smallSrc', item.slideThumbs[whichSlide]);
                    img.data('bigSrc', item.slideSources[whichSlide]);
                    if (show && whichSlide === 0) {
                        busyCursor();
                        $(img).on('load', normalCursor);
                        img.attr('src', item.slideThumbs[whichSlide]);
                        slide.style.display = 'inline-block';
                        Logger.fine(item.slideSources[whichSlide]);
                    } else {
                        slide.style.display = 'none';
                    }
                }
            }
            filterGenrePanels();
        }

        /**
         * Show popup.
         *
         * @param item
         * @param slideIndex
         */
        exports.showPopup = function(item, slideIndex) {
            galleryBuffer.hide();
            carousel.render(item, slideIndex);
        };

        /**
         * Cache all images.
         */
        function cacheAllImages() {
            var imgs = $('.gallery-item');
            for (var index = 0; index < imgs.length; index++) {
                var img = $(imgs[index]);
                var smallSrc = img.data('smallSrc');
                if (smallSrc != null) {
                    Logger.fine('cache image "' + smallSrc + '"');
                    img.attr('src', smallSrc);
                } else {
                    Logger.fine('can\'t cache image ' + index + ' because smallSrc is null');
                }
            }
        }

        /**
         * Busy cursor.
         */
        function busyCursor() {
            //$('html').css('cursor', 'progress');
            cursorState++;
            // Logger.fine('busyCursor: ' + cursorState);
            if (cursorState > 2) {
                cursorState = 2;
            }
        }

        /**
         * Normal cursor.
         */
        function normalCursor() {
            cursorState--;
            if (cursorState < 1) {
                cursorState = 0;
                //$('html').css('cursor', 'auto');
            }
            // Logger.fine('normalCursor: ' + cursorState);
        }
        // / Factored Code:

        /**
         * Set category.
         *
         * @param value
         * @param ui
         */
        exports.setCategory = function(value) {
            Logger.fine('setCategory("' + value + '")');
            var fossils = fossilSwitch.is(':checked');
            if (fossils) {
                minDate = '01/01/1989';
            } else {
                minDate = '01/01/1999';
            }
            filterItems(minDate, '*', value, '*');
            //gigsPanel.empty();
            //gigsPanel.append(galleryBuffer);
            //gigsPanel.append(carousel.element);
            // carousel.hide();
            // galleryBuffer.show();
        };

        /**
         * Go back.
         */
        exports.goBack = function() {
            Logger.fine('goBack()');
            // carousel.hide();
            // galleryBuffer.show();
        };

        /**
         * Show item.
         *
         * @param itemJQElement
         */
        exports.showItem = function(itemJQElement) {
            Logger.fine('showItem()');
            var pair = itemJQElement.attr('id');
            var index = parseInt(pair.split(',')[0], 10);
            exports.showPopup(galleryData[index], 0);
        };

        /**
         * Show fossils.
         */
        exports.showFossils = function() {
            Logger.fine('showFossils()');
            var fossils = fossilSwitch.is(':checked');
            Logger.fine('fossils = ' + fossils);
            if (fossils) {
                minDate = '01/01/1989';
            } else {
                minDate = '01/01/1999';
            }
            filterItems(minDate);
        };

        /**
         * Load big slide.
         *
         * @param thumbNailElement
         */
        exports.loadBigSlide = function(bigSrc) {
            busyCursor();
            Logger.fine('loadBigSlide: ' + bigSrc);
            // slide_panel
            $('.big-picture-img').on('load', normalCursor);
            $('.big-picture-img').attr('src', bigSrc);
        };

        // Public API
        /**
         * Update.
         *
         * @param observation
         * @param data
         */
        exports.update = function(observation, data) {
            if (observation.what === 'gallery-model') {
                exports.render(data);
                exports.setCategory(data.categories[0]);
                //            } else if (observation.what === 'gallery-view-category') {
                //                //??
                //            } else if (observation.what === 'gallery-view-item') {
                //                //??
                //            } else if (observation.what === 'gallery-view-fossils') {
                //                //??
                //            } else if (observation.what === 'gallery-view-goback') {
                //                //??
            } else if (observation.what === 'gallery_view') {
                // alert(JSON.stringify(data));
                if (data.control != null) {
                    var controlData = null;
                    if (data.data != null) {
                        controlData = data.data;
                    }
                    exports[data.control](controlData);
                }
            }
        };

        Messages.observe('gallery-model', Model, exports);

        return exports;
    });
