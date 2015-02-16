/**
 * Exposes utility functions for using the jQuery flexslider plugin in Wayfair pages for carousel widgets.
 * 
 * @author    Jeff Ladino <jladino@wayfair.com>
 * @copyright 2013 CSN Stores, LLC - All rights reserved
 * @version   SVN: $Id$
 */

YUI().add('jquery-flexslidercarousel', function(Y) {
  "use strict";
  (function($) {
    // CONSTANTS for sizing the carousels
    var NAV_BUTTON_WIDTH = 22, // the width of the navigation button images
      NAV_BUTTON_MARGIN = 6,
      privateMethods,
      ajaxProductFetcher; // a margin to apply to the left and right of the nav buttons
    
    privateMethods = {
      /**
       * unhideImages()
       * Shows hidden images within the carousel.
       * This is primarily used on the home page to show hidden "As Seen In" images. 
       */
      unhideNodes: function(slider) {
        slider.find('.hidden-node').removeClass('hidden-node');
      },
      
      /**
       * Hides the swipe icon from the carousel.
       */
      hideSwipeIndicator: function(slider) {
        slider.find('.pd-img-action-indicator').fadeOut(2000);
      },
      
      /**
       * Shows a swipe indicator icon if it should be shown.
       */
      showSwipeIndicator: function(slider) {
        var swipableIconObj;
        // Show the sliding icon for touch devices where swipe is possible
        if ($.featureDetect.isTouch() && slider.canAdvance(slider.getTarget('next')) && slider.closest('.carousel').find('.sprite.pd-img-action-indicator').length === 0) {
          swipableIconObj = $('<div class="sprite pd-img-action-indicator"></div>');
          slider.append(swipableIconObj);
        }
      }
    };
    
    /**
     * Jeff Ladino 2/28/2013:
     * Object containing functions that replaces old YUI3 carousel widget plugin in productplug.js
     */
    ajaxProductFetcher = {
      //Two cases -- we have product but some are off the screen-- set the admin info when next buttons clicked
      //          -- we need to make an ajax call to get more products -- make the call when new prod list has been concatenated
      //             but before products are actually shown (ajax flag set, before sync method)
      _getAdminDisplay : function (slider) {
        var elCarContainer = slider.closest('.carousel'),
          carouselData = elCarContainer.data('flexsliderCarousel');
        //console.log('  _getAdminDisplay for ' + elCarContainer.parent().attr('id'));
        if (Y.Admin && carouselData.hasCompletedProductAjax && !carouselData.hasFetchedAdminData) {
          // convert jquery objects into YUI objects for the Y.Admin.carousel_prod_info function 
          var products = Y.all(slider.find('.carousel_item').toArray());
          Y.Admin.carousel_prod_info(products);
          carouselData.hasFetchedAdminData = true;
        }
      },
      
      // destroy all of the the js ProductBlock objects from the carousel
      _removeProductBlocks: function (slider) {
        var elCarContainer = slider.closest('.carousel'),
          carouselData = elCarContainer.data('flexsliderCarousel'),
          count = 0;
        
        //console.log('  removeProductBlocks for ' + elCarContainer.parent().attr('id'));
        
        if (typeof carouselData.productBlocks === 'object' && carouselData.productBlocks.length){
          count = carouselData.productBlocks.length;
          for(var x = 0; x < count; x++){
            carouselData.productBlocks[x].destroy(); 
          }
          carouselData.productBlocks = '';
        }
      },
      
      // add the js ProductBlock objects to the carousel
      _addProductBlocks: function (slider) {
        var elCarContainer = slider.closest('.carousel'),
          carouselData = elCarContainer.data('flexsliderCarousel');
        
        //console.log('_addProductBlocks');
        if (carouselData.isInterstitial) {
          // remove old product blocks first just to be safe
          ajaxProductFetcher._removeProductBlocks(slider);
          
          // add new product block for each list element
          carouselData.productBlocks = new Array();
          slider.find('.carousel_item').each (function (index, domEl) {
            //console.log('  adding data for index='+index);
            carouselData.productBlocks.push(new Y.ProductBlock(Y.one(domEl), 'interstitial'));
          });
        }
      },
      
      // Handles AJAX response of product items that should populate the 
      _handleProductResponse: function(slider, elCarContainer, responseData) {
        var carouselData = elCarContainer.data('flexsliderCarousel'),
          htmlIndex = -1,
          tmpProducts = '';
        
        carouselData.hasCompletedProductAjax = true;
        //console.log('  _handleProductResponse for ' + elCarContainer.parent().attr('id'));
        if (responseData !== null) {
          htmlIndex = responseData.indexOf('<');
          if (htmlIndex == -1) {
            htmlIndex = responseData.length; 
            tmpProducts = null;
          } else {
            tmpProducts = responseData.substring(htmlIndex);
          }
          if (tmpProducts && slider.addSlide !== undefined) {
            //console.log ('   adding slides to the flexslider')
            slider.addSlide(tmpProducts);
          }
        }
      }
      
    };
    
    /**
     * Initialize all carousels that show products in a horizontal manner.
     * Use like this:
     *  $('html').initProductCarousel();
     * 
     * This function was created as part of PT 890020 - YUI Carousel to jQuery flexslider conversion.
     * The jQuery flexslider widget will be applied to the carousels on the page which will enable paging
     * with next/previous buttons and swipe scrolling on touch devices.
     * 
     * @author Jeff Ladino <jladino@wayfair.com>
     */
    $.fn.flexsliderCarousel = function() {
      // iterate over each DOM element to be bound to a flexslider carousel
      this.find('.carousel_content').each(function(index, el){
        var
          elObj = $(el),
          elCarContainer = elObj.closest('.carousel'),  // DOM element containing the entire carousel
          navButtonWidth = ($.featureDetect.isTouch()) ? 0 : NAV_BUTTON_WIDTH, // no buttons on touch devices
          navButtonHeight = navButtonWidth,
          navButtonPlusMargin = NAV_BUTTON_MARGIN + navButtonWidth,
          carouselType = '',
          addedFunc = privateMethods.showSwipeIndicator,
          removedFunc = function(){},
          startFunc = privateMethods.showSwipeIndicator,
          overlayEvent = $.featureDetect.isTouch() ? 'click' : 'mouseenter',
          // other valuse that we will use
          oldElWidth, elWidth, itemWidth, maxItems, minItems,
          hiddenInput, carouselData, firstAddedFunc, firstStartFunc, oldStartFunc, oldAddedFunc;
  
        //console.log('### flexsliderCarousel begin for ' + elCarContainer.parent().attr('id'));
          
        // Pre-flexslider setup for carousel types such as "product", "interstitial", and "general" 
        carouselType = elCarContainer.attr('data-carousel-type');
        if (carouselType !== undefined) {
          //console.log('   carouselType is ' + carouselType);
          // Jeff Ladino: The code in this if statement replaces ProductPlug.initializer
          if (carouselType.indexOf('product') > -1) {
            hiddenInput = elCarContainer.find('[name=carousel_skus]');
            carouselData = elCarContainer.data('flexsliderCarousel');
            
            // Associate required date to the DOM element containing the carousel
            if (carouselData === undefined) {
              carouselData = {
                //data-ajax specifies if there were more products found than returned in the initial call
                hasCompletedProductAjax: (hiddenInput.attr('data-ajax') === ''),
                hasFetchedAdminData: false,
                productBlocks: '',
                isInterstitial: (carouselType.indexOf('interstitial') > -1)
              };
              
              elCarContainer.data('flexsliderCarousel', carouselData);
            }
            
            // add special handlers for interstitial carousels
            if (carouselData.isInterstitial) {
              firstAddedFunc = addedFunc;
              firstStartFunc = startFunc;
              
              addedFunc = function(slider) {
                firstAddedFunc(slider);
                ajaxProductFetcher._addProductBlocks(slider);
              };
              
              startFunc = function(slider) {
                firstStartFunc(slider);
                ajaxProductFetcher._addProductBlocks(slider);
              };
              
              removedFunc = ajaxProductFetcher._addProductBlocks;
            }
            
            // Decide if an additional product ajax call must be made or not
            if (carouselData.hasCompletedProductAjax) {
              //console.log('  hasCompletedProductAjax==true');
              oldStartFunc = startFunc;
              startFunc = function(slider) {
                oldStartFunc(slider);  // call any previous start function
                ajaxProductFetcher._getAdminDisplay(slider);  // if we have the products then fetch the admin data associated with them
              };
            } else { 
              // If we get in here we'll need to make an ajax call to load more Product DOM elements for the slider at startup
              //console.log('  hasCompletedProductAjax==false');
              oldAddedFunc = addedFunc;
              
              startFunc = function(slider) {
                // make an ajax call for our additional products to put into the carousel 
                $.ajax({
                  url:  YUI_config.app.store_url + '/ajax/get_carousel.php?ajax=1&sku=' + hiddenInput.attr('data-sku') + '&proc=' + 
                        hiddenInput.attr('data-proc') + '&style=' + hiddenInput.attr('data-cstyle') + '&layout=' +
                        hiddenInput.attr('data-layout') + '&isize=' + hiddenInput.attr('data-isize') +
                        '&exclude=' + hiddenInput.attr('data-exclude') + '&inv=1', //means we want to make the inventory call
                  success: function(data) {
                    ajaxProductFetcher._handleProductResponse(slider, elCarContainer, data);
                  }
                });
              };
              
              // after the slider has added new slides we'll want to get the admin display for those slides
              addedFunc = function(slider) {
                oldAddedFunc(slider);
                ajaxProductFetcher._getAdminDisplay(slider);  // if we have the products then fetch the admin data associated with them
              };
            }
          } // if (carouselType.indexOf('product') > -1)
          
        } // if (carouselType !== undefined)

        // add the flexslider class to the parent of the elObj to enable proper flexslider functionality
        elObj.parent().addClass('flexslider');
        
        // remove loading animations if they are present
        elCarContainer.find('[name=carwait]').remove();
        elCarContainer.find('[name=carousel_scroll]').removeClass('hide-when-enabled-disp');
        
        // after loading animations are removed and our dom element is visible we can calculate widths and margins
        oldElWidth = elObj.width();
        elWidth = oldElWidth - 2 * navButtonPlusMargin;
        itemWidth = elObj.find('li').first().width();
        maxItems = Math.floor(elWidth / itemWidth);
        minItems = maxItems;

        // set a new width and margins to account for the left and right scroller buttons
        elObj.css('width', '' + elWidth + 'px');
        elObj.parent().css({'width':'' + elWidth + 'px', 'margin-left':'' + navButtonPlusMargin + 'px', 'margin-right':'' + navButtonPlusMargin + 'px'});
        
        //console.log('original el.width() = ' + oldElWidth);
        //console.log('new el.width() = ' + elObj.width());
        //console.log('item outer width = ' + itemWidth);
        //console.log('li item count = ' + elObj.find('li').length);
        //console.log('maxItems = ' + maxItems);
        
        // bind the dom element to the flexslider widget
        elObj.flexslider({
          animation: "slide",
          directionNav: !$.featureDetect.isTouch(), // don't show paging buttons on touch
          controlNav: false,
          slideshow: false,
          animationLoop: false,
          pauseOnAction: false,
          itemWidth: itemWidth,
          minItems: minItems,
          maxItems: maxItems,
          prevText: "",
          nextText: "",
          start: startFunc, // Fires when the slider loads the first slide
          added: addedFunc, // Fires after a slide is added
          removed: removedFunc,  // Fires after a slide is removed
          // before fires asynchronously with each slider animation
          before: function(slider) {
            privateMethods.unhideNodes(slider);
            privateMethods.hideSwipeIndicator(slider);
          }
        });
  
        // set the height of the navigation controls based on our element height
        elObj.find('.flex-direction-nav a').css('top', '' + Math.floor((20 + elObj.find('li').height() - navButtonHeight)/2) + 'px');
        //console.log('new height for flex-direction-nav a is:' + elObj.find('.flex-direction-nav a').css('top'));
          
        // Post-flexslider setup for carousel types such as "product", "interstitial", and "general" 
        if (carouselType !== undefined) {
          /* Jeff Ladino 2/28/2013: Add images to the carousel's DOM that weren't added before page load for 
           * faster page load performance.  This is currently done on the home page in the brands slider and 
           * all general type sliders. This logic replaces the old YUI plugin in the file imageplug.js */ 
          if (carouselType.indexOf('general') > -1) {
            elObj.find('.yui3-carousel-image').each(function(idx2, el2){
              if($(el2).children().length === 0 && $(el2).attr('data-src') !== undefined) {
                $(el2).append(
                    $('<img></img>', {
                      src: $(el2).attr('data-src'),
                      alt: $(el2).attr('data-alt') || '',
                      height: $(el2).attr('data-height') || '',
                      width: $(el2).attr('data-width') || ''
                    }) ) // append a new image DOM element
                  .parent().removeClass('hidden-node'); // remove the hidden class from the parent node 
              }
            })
              // remove the class from the elements once we are done processing them
              .removeClass('yui3-carousel-image');
            
          } // end if 'general'
        }
        
        /* Jeff Ladino 3/6/2013: Initialize hover and touch events for overlay scrollers.  Homepage As Seen In magazines is an example of this
         * This replaces logic formerly in carouselwidget.js. */
        // If the .yui3-carousel-overlay image is visible, hide it on mouseenter (or tap for touch events) to reveal the product underneath
        elObj.on(overlayEvent, '.carousel-overlay-scroller', function(e){
          var overlayImg = $(this).find('.yui3-carousel-overlay');
          if ($.featureDetect.isTouch() && !overlayImg.hasClass('hidden-node')) {
            // make all other carousel overlay images appear for touch devices
            elObj.find('.yui3-carousel-overlay').removeClass('hidden-node');
            e.preventDefault();
          }
          overlayImg.addClass('hidden-node');
        });
        // If the .yui3-carousel-overlay image is hidden, show it again on mouseleave.  But don't do this on touch device.
        if (!$.featureDetect.isTouch()) {
          elObj.on('mouseleave', '.carousel-overlay-scroller', function(e){
            $(this).find('.yui3-carousel-overlay').removeClass('hidden-node');
          });
        }
        
      }); // end .each()
     

      // return this for chainability
      return this;
    };
    
  })(jQuery);
}, '0.0.1', {
  requires: [/* jquery, featuredetect */, 'jquery-flexslider']
});