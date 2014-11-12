/**
 * info_panel.js
 */
define(
    ['jquery', 'messages', 'logger'],
    /**
     * @exports info_panel
     * @requires jquery
     */
    function($, Messages, Logger) {
        'use strict';
        /**
         * @constructor
         */
        function InfoPanel() {

        }

        InfoPanel.prototype.show = function() {
            this.element.show();
        };

        InfoPanel.prototype.hide = function() {
            this.element.hide();
        };

        InfoPanel.prototype.initialize = function() {

            // info panel
            var details = $('<div />');
            details.hide();
            this.element = details;

            // go back link
            var goback = document.createElement('a');
            this.goback = $(goback);
            goback.href = 'javascript:void(0);';
            goback.innerHTML = '<span class="glyphicon glyphicon-hand-left"></span> &nbsp;go back';
            goback.id = 'goback';
            goback = $(goback);

            goback.on('click', function(evt) {
                // goBack();
                Messages.notify('gallery_view', {
                    "control": "goBack"
                });
            });

           // details.append(goback);

            var bigTitle = document.createElement('h3');
            this.bigTitle = $(bigTitle);
            bigTitle.className = 'bigTitle';
            bigTitle.innerHTML = 'Title';
            details.append(bigTitle);
            var hr = document.createElement('hr');
            hr.className = 'liteline';
            //details.append(hr);

            var detailsPanel = document.createElement('div');
            detailsPanel.className = 'detailsPanel';
            detailsPanel = $(detailsPanel);

            var bigDate = document.createElement('div');
            this.bigDate = $(bigDate);
            bigDate.className = 'bigDate';
            bigDate.innerHTML = 'bigDate';
            //detailsPanel.append(bigDate);

            var bigClient = document.createElement('div');
            this.bigClient = $(bigClient);
            bigClient.className = 'bigClient';
            bigClient.innerHTML = 'bigClient';
            detailsPanel.append(bigClient);

            var bigRole = document.createElement('div');
            this.bigRole = $(bigRole);
            bigRole.className = 'bigRole';
            bigRole.innerHTML = 'bigRole';
            detailsPanel.append(bigRole);

            var bigPlatform = document.createElement('div');
            this.bigPlatform = $(bigPlatform);
            bigPlatform.className = 'bigPlatform';
            bigPlatform.innerHTML = 'bigPlatform';
            detailsPanel.append(bigPlatform);

            var bigTools = document.createElement('div');
            this.bigTools = $(bigTools);
            bigTools.className = 'bigTools';
            bigTools.innerHTML = 'bigTools';
            detailsPanel.append(bigTools);

            var bigComments = document.createElement('div');
            this.bigComments = $(bigComments);
            bigComments.className = 'bigComments';
            bigComments.innerHTML = 'bigComments';
            //detailsPanel.append(bigComments);

            var bigGenre = document.createElement('div');
            this.bigGenre = $(bigGenre);
            bigGenre.className = 'bigGenre';
            bigGenre.innerHTML = 'bigGenre';
            detailsPanel.append(bigGenre);
            //detailsPanel.append(document.createElement('hr'));

            var bigLinks = document.createElement('div');
            this.bigLinks = $(bigLinks);
            bigLinks.className = 'bigLinks';
            bigLinks.innerHTML = 'bigLinks';
            detailsPanel.append(bigLinks);

            //details.append(detailsPanel);

            var bigSlider = document.createElement('div');
            bigSlider.className = 'bigSlider';
            this.bigSlider = $(bigSlider);
            this.bigSlider
                .html('<div id=\'internal-slider\'></div><div class=\'big-picture\'></div>');
            //details.append(bigSlider);
            
           

            detailsPanel.css('font-size', '1.4em');
            details.append(detailsPanel);
        };

        /**
         * Create gallery tab.
         *
         * @private
         * @param id
         * @param title
         * @param content
         * @param src
         * @return {String}
         */
        function createGalleryTab(id, title, content, src) {
            var buffer = [];
            Logger.fine('createGalleryTab: ' + src);
            buffer.push('<img id="' + id + '" width="96" height="72" src="' + src + '" class="gallery-slot" />');
            return buffer.join('');
        }

        function setBusy() {

        }

        function setIdle() {

        }

        InfoPanel.prototype.renderCarousel = function(item, slideIndex) {
            this.bigSlider.html();

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

            for (var index = 0; index < item.slideInstances.length; index++) {
                var slide = item.slideInstances[index];
                var thumb = item.slideThumbs[index];
                var img = $(slide).find('.gallery-item');
                var bigSrc = item.slideSources[index];
                var slideName = 'Slide ' + (index + 1);
                Logger.fine('showPopup big source: ' + bigSrc);
                if (index === 0) {
                    setBusy();
                    //$('.big-picture-img').on('load', setIdle);
                    //$('.big-picture-img').attr('src', bigSrc);
                    skel.push('    <div class="active item">');
                } else {
                    skel.push('    <div class="item">');
                }
                //setBusy();
                //                    galleryLightboxHTML += createGalleryTab('liquid_' + index,
                //                            'Slide ' + (index + 1),
                //                            '<img class="gallery-slide" src="'
                //                                    + img.attr('src') + '" alt="" />', thumb);
                //                    $('.gallery-slide').on('load', setIdle);

                skel.push('      <img src="' + bigSrc + '" alt="' + slideName + '">');
                skel.push('      <div class="carousel-caption">');
                skel.push(slideName);
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

            $('#internal-slider').html(galleryLightboxHTML);
        };

        /**
         * TODO: normalize signature
         * @param item
         * @param slideIndex
         */
        InfoPanel.prototype.render = function(item, slideIndex) {

            //this.renderCarousel(item, slideIndex);

            this.bigTitle.html(item.title);
            this.bigDate.html('<span class="bigLabel">date: </span>' + item.date);
            this.bigRole
                .html('<span class="bigLabel">my role in this: </span>' + item.role);
            this.bigClient.html('<span class="bigLabel">for: </span>' + item.client);
            this.bigPlatform
                .html('<span class="bigLabel">platform: </span>' + item.platform);
            this.bigTools.html('<span class="bigLabel">using: </span>' + item.tools);
            this.bigComments.html('<span class="bigLabel">notes: </span>' + item.comment);
            this.bigGenre.html('<span class="bigLabel">file under: </span>' + item.genre);
            if (item.links != null) {
                var links = [];
                for (var e in item.links) {
                    if (item.links.hasOwnProperty(e)) {
                        links.push('<span class="bigLink">');
                        links.push(e + ': ');
                        links.push('</span>');
                        links.push('<a class="bigLinkAnchor" href="' + item.links[e] + '" target="_blank">');
                        links.push('<span class="glyphicon glyphicon-eye-open"></span>');
                        links.push(' &nbsp;');
                        links.push('click');
                        links.push('</a>');
                        links.push('<br />');
                    }
                }
                this.bigLinks.html('<span class="bigLabel">links: </span>' + links.join(''));
            } else {
                this.bigLinks.html('');
            }

            //this.element.css('minHeight', $('.detailsPanel').height() + 40 + 'px');

            //this.show();

//            $('#internal-slider').carousel({
//                interval: false
//            });
            return this.element.html();
        };

        return InfoPanel;
    });
