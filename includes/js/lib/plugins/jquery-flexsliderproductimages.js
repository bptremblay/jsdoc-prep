/*
 * Exposes utility functions for using the jQuery flexslider plugin for viewing multiple product images
 *
 * @author    Simon Leung <sleung@wayfair.com>
 * @author    Jeff Ladino <jladino@wayfair.com>
 * @copyright 2013 Wayfair, LLC - All rights reserved
 * @version   SVN: $Id$
 */
YUI().add('jquery-flexsliderproductimages', function(Y) {
  (function($) {
    // Configuration values
    var SRC_PATTERN = /\/lf\/[^\/]*\//i,
    SRC_REPLACE = '/lf/8/';
    HOVER_TIME = 150; // in milliseconds
    IMAGE_FADE_ANIMATION_SPEED = 150; // in milliseconds
    
    // FlexSlider: Plugin Function Overload
    // Added in customization of not displaying a thumbnail if there's only 1 image
    $.fn.flexslider = function(options) {
      if (options === undefined) options = {};
      
      if (typeof options === "object") {
        return this.each(function() {
          var thisNode = $(this),
              selector = (options.selector) ? options.selector : ".slides > li",
              slides = thisNode.find(selector),
              hasVideoNode = thisNode.find('.videolinkwrap').length > 0 ? true : false,
              hasVideoNodeWithOneThumbnail = (hasVideoNode === true && slides.length === 2) ? true : false,
              usingSynchronizedSlider = options.asNavFor ? true : false; // if there is an asNavFor (i.e. thumbnail) value, there is a main/thumbnail paradigm
  
          // don't show a thumbnail slider if there's only 1 image
          if (slides.length === 1 || hasVideoNodeWithOneThumbnail) {
          	if (usingSynchronizedSlider === true) {
          	  handleInitialItemsInThumbnailTray(thisNode, slides, hasVideoNode);
          	}
            slides.fadeIn(400);
            if (options.start) options.start(thisNode);
          } else if (thisNode.data('flexslider') == undefined) {
            new $.flexslider(this, options);
          }
        });
      } else {
        // Helper strings to quickly perform functions on the slider
        var $slider = $(this).data('flexslider');
        switch (options) {
          case "play": $slider.play(); break;
          case "pause": $slider.pause(); break;
          case "next": $slider.flexAnimate($slider.getTarget("next"), true); break;
          case "prev":
          case "previous": $slider.flexAnimate($slider.getTarget("prev"), true); break;
          default: if (typeof options === "number") $slider.flexAnimate(options, true);
        }
      }
    }
  
    /**
     * Will handle the display of the thumbnail tray based on the items that are present on initialization.
     * 
     * 1. If there is a video node and there is an image, remove the image from the thumbnail and the main flexslider; 
     *    only display the video thumbnail
     * 2. Otherwise, there is only 1-image, checked in the parent condition, so hide the thumbnail tray 
     *
     * @return Returns nothing
     */  
    function handleInitialItemsInThumbnailTray(selector, slides, hasVideoNode) {
      var selectorNode = $(selector),
        mainFlexsliderNode = $('.js-flexslider-main');
      
      if ((hasVideoNode === true && slides.length === 2)) {
        // remove the thumbnail of the only thumbnail (excluding the video thumbnail)
        selectorNode.find('ul li').eq(1).remove(); // example -  $('.js-flexslider-pdp-thumbnail ul li').eq(1).remove();
        // remove the first image from the main flexslider, which is the video main image place holder
        mainFlexsliderNode.find('ul li').eq(0).remove();
      } else {
        // hide the thumbnail tray; NOTE: if the tray is hidden, flexslider will not initialize this portion properly
        selectorNode.addClass('hidden-node'); 
      }
    }
    
    /**
     * Handles the logic to re-bind a click/tap
     * This is called on initialization (i.e. start) or when the images have been been added
     * 
     * The click event is rebinded
     *
     * @return Returns nothing
     */    
  	function registerThumbnailTap(selector, slider) {
  		// don't register click unless it's touch because non-touch has the hover event
  		if(!$.featureDetect.isTouch()) { 
  			return;
  		}
  		// bind click (which is tap for touch)
  		rebindClick(selector, slider);
  	}
  	
  	function swapMainImage(imgElement){  
  	  if($.featureDetect.isTouch()) {
  	    return; // on touch, there is currently no hover, so there's no point to swap the 2000x2000 image
  	  }
  	  imgElement = imgElement || null; // default parameter of null
  	  // if there is an image element (e.g. from a desktop click) then swap the image of 
  	  // that because the active slide is not present on click at the moment of swap
  	  var isHover = imgElement ? false : true, 
  	    activeImageNode = isHover ? $('.js-flexslider-main ul .flex-active-slide img') : $(imgElement).find('img');
  	  
      if(activeImageNode.length > 0) { // if present
      	var newImageName = activeImageNode.attr('src'),
      		imageZoomNode = $("#yui3-imagezoom-view img"),
        	newZoomedImageSrc = newImageName.replace(SRC_PATTERN, SRC_REPLACE),
        	oldZoomedImageSrc = imageZoomNode.attr('src');
      	
      	// IMPORTANT!!! if image is the same - do not change, otherwise performance will take a hit (like a lot)
      	if(newZoomedImageSrc != oldZoomedImageSrc) {
      		// set the new image to the current image
      		imageZoomNode.attr('src', newImageName);
      		// replaces the small image with the large image.  e.g.:
      		// <img src="http://common2.csnimages.com/lf/49/hash/1026/6510065/1/Skyline-Furniture-Tufted-Wingback-Bed.jpg"
      		// becomes
      		// <img src="http://common2.csnimages.com/lf/8/hash/1026/6510065/1/Skyline-Furniture-Tufted-Wingback-Bed.jpg"
      		imageZoomNode.attr('src', newZoomedImageSrc);
      	}		
      }
  	}
  	
  	function initThumbnailHover(element, slider, isRebind) {
      var slide = element,
        target = slide.index();
    
      // set animiating to false for touch to workaround an initialization bug
      if($.featureDetect.isTouch()) {
      	slider.animating = false;
      	return; // no hover for touch
      }
      // don't allow focus on this thumbnail
      if(doesNodeHaveVideoInfo(element) === true) {
        return;
      }
      // check if there's a traymask/main overlay (i.e. image not available); if there is, don't continue
      if (doesSlideContainNotAvailableOverlay(slide) === true) {
        return;
      };
      // if same thumbnail (i.e. active), do not hover/animate
      if(slide.hasClass('flex-active-slide')) {
      	return;
      }
      
      if (!slide.hasClass('active')) {
        if (isRebind === false) {
          slider.direction = (slider.currentItem < target) ? "next" : "prev";
        }
        slider.flexAnimate(
      		  target, // target
      		  true,   // pause 
      		  false,  // override
      		  true,   // with sync
      		  true,   // fromNav
      		  true); 
        
        // check to see if main zoom image for zooming needs to be updated
        swapMainImage(); 
        
        if (isRebind === true) {
          // check to see if main img overlay is present, if so check if it needs to present
          // this logic was ported from imageswap.js
          var overlay = $('#imgoverlay');
          if(overlay){
            overlay.addClass('hidden-node');
          }
        }
      }
  	}
  	
  	function shouldHideTempImageOverlay(shouldHide) {
  		var tempImageOverlay = $('.flexslider-tempimgoverlay img');
  		// if there's no temp overlay node, do nothing
  		if(!tempImageOverlay.length) {
  			return;
  		} 
  		shouldHide ? tempImageOverlay.parent().addClass('hidden-node') : tempImageOverlay.parent().removeClass('hidden-node'); 
  	}
  	
  	function shouldHideVideoThumbnail(shouldHide) {
      var videoNode = $('.js-flexslider-pdp-thumbnail .videolinkwrap');
      if(!videoNode.length) {
        return; // do nothing if nothing is found
      }
      shouldHide ? videoNode.addClass('hidden-node') : videoNode.removeClass('hidden-node');
  	}
  	
  	function handleHideViewAllLink() {
  	  var viewAllNode = $('.yui3-view-all-link'),
  	    pdpThumbnailSmall = $('.js-flexslider-pdp-thumbnail.js-flexslider-pdp-thumbnail-small');
  	  if(!viewAllNode.length || !pdpThumbnailSmall.length) {
        return; // do nothing if nothing is found
      }
  	  // if the small thumbnail is present, then display; otherwise nah
  	  pdpThumbnailSmall ? viewAllNode.removeClass('hidden-node') : viewAllNode.addClass('hidden-node');
  	  // touch does not have the 'view all' so removing the small thumbnail; it's done here because the 
  	  // server cannot determine if the device is touch or not
  	  if($.featureDetect.isTouch() && pdpThumbnailSmall) { 
  	    pdpThumbnailSmall.removeClass('js-flexslider-pdp-thumbnail-small');
  	  }
  	}
  	
    /**
     * Called during rebind of the click event and the hover (i.e mouse over) event
     * 
     * Checks if the slide node contains an image overlay mask (i.e. image not available)
     * If it does not, it will then do a safety check to ensure that the mask is not visible
     *
     * @return Returns true if the slide node has the image overlay; otherwise return false 
     */  	
    function doesSlideContainNotAvailableOverlay(slide) {
      // in the thumbnail, check if there's a traymask overlay (i.e. image not available)
      var trayImageOverlay = $(slide).find('.imageoverlaymask#imgoverlay'),
        mainImageOverlay = $('.imageoverlaymask.mainmask#imgoverlay');
      if (trayImageOverlay.length) {
        return true; // do not navigate to this thumbnail if there's an image not available
      } 
      // make sure imageoverlaymask on the main image is gone
      if (!mainImageOverlay.hasClass('hidden-node')) {
        mainImageOverlay.addClass('hidden-node');
      }   
      return false;
    }
  	  
  	function handleSwipeIconOnTouch(slider) {
  	  var mainImages = slider.find('ul li'),
  	  	isOneMainImage = mainImages.length === 1 ? true : false,
  	    actionIndicatorObj = null;
      // check if 1 img and on touch
  	  if($.featureDetect.isTouch()) {
  	    actionIndicatorObj = slider.closest('.flexslider-contain').find('.sprite.pd-img-action-indicator');
        if(isOneMainImage === true) {
          // do not display swipe icon for 1 image
          actionIndicatorObj.addClass('hidden-node');
        } else if(actionIndicatorObj.length === 0) {
          slider.append('<div class="sprite pd-img-action-indicator"></div>');
        }
  	  }
  	}
  	
  	function initHoverIntentWrapper(slider) {
     if($.featureDetect.isTouch()) { // don't register if it's on a touch device 
        return;
      }
      // Binding event for when hovering over a thumbnail image
    	function hoverOver(){  
    		initThumbnailHover($(this), slider, false);
    	}
    	function hoverOut(){} // no-op
      	
    	var config = {
    		over:hoverOver,
    		interval:HOVER_TIME,
    		out:hoverOut
    	};
    	$('#thumbnail-slides > li').hoverIntent(config);		
  	}
  
  	function handleVideoThumbnail() {
      // start flexslider at +1 index (i.e. if video is present, don't start at the first thumbnail, which is the video, start at the 2nd)
      if(isVideoThumbnailPresent() === true && $('.js-flexslider-pdp-main').data('flexslider')) {
        $('.js-flexslider-pdp-main').data('flexslider').flexslider(1);
      } 
  	}
  	
  	function isVideoThumbnailPresent() {
      var videoNode = $('.js-flexslider-pdp-thumbnail .videolinkwrap');
      if(!videoNode.length) {
        return false; // do nothing if nothing is found
      }
      return true;
  	}
  	
  	function doesNodeHaveVideoInfo(element) {
  	  var videoNode = $(element).find('.videolinkwrap');
  	  return videoNode.length ? true : false;
  	}
  	
  	function rebindClick(selector, slider) {
  	  // exposing slider.slides.click from jquery-flexslider.js with a rebind (i.e. unbind -> bind)
  	  // to add in customization (e.g. prevent the same thumbnail to be selected again)
      if(slider.slides) {
        // unbind
        slider.slides.unbind("click");
        slider.slides.click(function(e){
          e.preventDefault();
          var slide = $(this),
              target = slide.index(),
              asNavFor = selector;
          
          // if same thumbnail (i.e. active), do not hover/animate
          if(slide.hasClass('flex-active-slide')) {
            return;
          }
          // don't allow focus on this thumbnail
          if(doesNodeHaveVideoInfo(slide) === true) {
            return;
          }
  
          // check if there's a traymask/main overlay (i.e. image not available); if there is, don't continue
          if (doesSlideContainNotAvailableOverlay(slide) === true) {
            return;
          };    
          
          // click is a little different; it is not yet active, use item that is being switched to
          swapMainImage(slide); 
        
          if (!$(asNavFor).data('flexslider').animating && !slide.hasClass('active')) {
            slider.direction = (slider.currentItem < target) ? "next" : "prev";
            slider.flexAnimate(target, true, false, true, true);
          }
          // check to see if main img overlay is present, if so check if it needs to present
          // this logic was ported from imageswap.js
          var overlay = $('#imgoverlay');
          if(overlay){
            overlay.addClass('hidden-node');
          }
        });       
      }
  	}
  	
  	function rebindDirectionNavigation(slider) {
  	  // this is only for desktop (i.e. with prev/next buttons)
      if(slider.directionNav) {
        // unbind first
        slider.directionNav.unbind("click");
      
        slider.directionNav.bind("click", function(event) {
          event.preventDefault();
  
          var target = ($(this).hasClass('flex-next')) ? slider.getTarget('next') : slider.getTarget('prev');
          slider.flexAnimate(
              target, // target
              false); // pauseOnAction
        });
      }	  
  	}
  	
  	function calibrateDirectionalNav(slider) {
  	  if(!slider.directionNav) {
  	    return; // don't do anything if there's no directionNav
  	  }
  	  // this is really for safety checking; as the removed callback should have set it back to 1 already
  	  // if the paging is over 1, then go to 1 and then 0 for the thumbnail tray to resync
      if (slider.pagingCount > 1) {
        $('.js-flexslider-pdp-thumbnail').data('flexslider').flexslider(0);
        slider.update();
      } else if (slider.pagingCount === 1) { // if it's only 1, get the updated paging count to see if the 2nd page is there prior to shifting
        // resync paging count
        slider.pagingCount = Math.ceil(slider.count / slider.visible);
        if(slider.pagingCount === 1) {
          // if it's still one, then don't do anything
          // this prevents pages with 1 page of thumbnails from scrolling off the screen
          // no-op
        } else {
          $('.js-flexslider-pdp-thumbnail').data('flexslider').flexslider(0);
          slider.update();
        }
      }
  	}
  	
  	function handleMissingDisplayForFirstImage(flexObject, slider) {
      // on fade, add does not contain certain css selectors; rather than reinitializing (which 
      // caused side-effects of the images showing a shadow-image), the display:none is removed so it can
      // act as if a reinitialize occured 
  	  if (flexObject.animation !== "fade") {
  	    return;
  	  } 
      var firstImage = $(slider).find('ul > li').eq(0);
      if(firstImage.css('position') == 'relative' && firstImage.css('display') == 'none') {
        firstImage.css('display', 'list-item');
      }
  	}
  	
  	function handleFlexContainerResize(selector, slider) {
      var oldCount = slider.count;
      slider.count = $(slider).find('li').length; // update the total count to sync up the slider (i.e. some options have fewer/more items than other options)
      // optimization: only do this when the count is different and it's on SWING (slide)
      if (selector.animation === "swing" && oldCount <= slider.count) {
        slider.container.width((slider.count + slider.cloneCount) * 200 + "%");
      }
  	}
  	
  	function hideLoadingSpinnerFromThumbnailTray() {
  	  $('.zoomimgwrap .bgloading').last().addClass('hidden-node');  // hides the spinning icon
  	}
  	
  	function calibrateFlexActiveSlide(slider) {
      // tells the slider the first item is the one selected so it will highlight it
  	  slider.slides.removeClass("flex-active-slide").eq(slider.currentItem).addClass("flex-active-slide");
  	}
  	
  	
    /**
     * Will setup the common bind/rebind logic (i.e. thumbnail tap, click, and hover)
     * 
     * Called when the flexslider start and add callbacks are triggered
     * 
     * @return nothing
     */   
  	function setupCommonBindings(selector, slider) {
      // register tap for thumbnails
      registerThumbnailTap(selector, slider);
      // re-bind click
      rebindClick(selector, slider);
      // register hover events
      initHoverIntentWrapper(slider); 
  	}
  	
    /**
     * Will setup the common thumbnail start property logic
     * 
     * Called when the flexslider thumbnail start callback is triggered
     * 
     * @return nothing
     */     	
  	function setupCommonThumbnailStart(selector, slider) {
      // find and hide pdmainimgoverlay that has an img tag (i.e. the eager loaded img)
      shouldHideTempImageOverlay(true);
      setupCommonBindings(selector, slider);
  	}
  	
    /**
     * Will setup the common main start property logic
     * 
     * Called when the flexslider main start callback is triggered
     * 
     * @return nothing
     */      	
    function setupCommonMainStart(slider) {
      handleSwipeIconOnTouch(slider);
      Y.OptionImages.resolveImageDistortion(true);
    }
    
    /**
     * Will setup the common thumnbail added property logic
     * 
     * Called when the flexslider thumbnail added callback is triggered
     * 
     * @return nothing
     */        
    function setupCommonThumbnailAdded(selector, slider) {
      slider.asNav = true;
      slider.animatingTo = Math.floor(slider.currentSlide/slider.move);
      slider.count = $(slider).find('.slides li').length; // update the total count to sync up the slider (i.e. some options have fewer/more items than other options)
      slider.currentItem = isVideoThumbnailPresent() ? 1 : 0; // Resets to the first (,or 2nd if thumbnail is present,) item of the page (page is set in optionimages.js)
      calibrateFlexActiveSlide(slider);
      setupCommonBindings(selector, slider);
    }
    
    /**
     * Will setup the common main added property logic
     * 
     * Called when the flexslider main added callback is triggered
     * 
     * @return nothing
     */            
    function setupCommonMainAdded(flexObject, slider) {
      // IMPORTANT NOTE: the flexslider needs to be reinitialized or handled (as shown below) on FADE otherwise no images will 
      // be displayed because certain css style selectors will be not be present 
      // e.g. opacity, display, -webkit-transition: opacity 0.6s 
      handleMissingDisplayForFirstImage(flexObject, slider);
      // ensures the swipe icon is always present
      handleSwipeIconOnTouch(slider);
    }
  	
  	/**
  	 * Initializes the Product detail images
  	 */
  	$.fn.flexsliderProductDetailImages = function() {
  	  // NOTE: this is called outside the callbacks
      // handle 'view all' link if needed
  	  handleHideViewAllLink();
      // thumbnail must come first to sync with the main    
      this.find('.js-flexslider-pdp-thumbnail').flexslider({
        animation: "slide",
        controlNav: false,
        slideshow: false,
        animationLoop: false,
        pauseOnAction: false,
        directionNav: !$.featureDetect.isTouch(), // don't show nav buttons on touch
        itemWidth: 75,
        itemMargin: 5,
        asNavFor: '.js-flexslider-pdp-main', // linkage to the main pdp image
        prevText: "",
        nextText: "",
        start: function(slider) {
          setupCommonThumbnailStart('.js-flexslider-pdp-thumbnail', slider);
          // re-bind prev/next buttons to expose this from jquery-flexslider.js
          rebindDirectionNavigation(slider);
        },
        added: function(slider){ // Adding callback when an item is added
          setupCommonThumbnailAdded('.js-flexslider-pdp-thumbnail', slider);
          // recalibrates prev/next direction buttons
          calibrateDirectionalNav(slider);
          // On touch, there is a small edge-case where if the user is on the first slide and slides to the 2nd page without selecting 
          // an item and then changes an option, which will subsequentialy reload the images, the gestures will stop working until
          // the user clicks on another thumbnail or swipes to another image
          if ($.featureDetect.isTouch()) {
            $('.js-flexslider-pdp-main').data('flexslider').flexslider(1); // animate 1 to reset
            $('.js-flexslider-pdp-main').data('flexslider').flexslider(0); // animate back to the orignal
          }
          handleVideoThumbnail();
          // swap the main image with the corresponding thumbnail
          // this is set here in case the user hover overs the main image prior to a thumbnail to ensure the image is swapped already
          swapMainImage();     

        },
        removed: function(slider) {
          slider.pagingCount = 1; // after removing the thumbnails, set to pagingCount 1 so it can resync in the added callback
          $('.js-flexslider-pdp-thumbnail').data('flexslider').flexslider(0); // force to first page
        }
      });
    
      // main image
      this.find('.js-flexslider-pdp-main').flexslider({
    	  animation: !$.featureDetect.isTouch() ? "fade" : "slide", // slide on touch, fade on desktop
    	  controlNav: false,
    	  touch: true,
    	  animationSpeed: IMAGE_FADE_ANIMATION_SPEED, // 350ms seems to be a nice number that works for fade and hoverIntent
    	  animationLoop: false,
    	  directionNav: false,
    	  pauseOnAction: false,
    	  slideshow: false,
    	  sync: '.js-flexslider-pdp-thumbnail', // This is to sync with the carousel
    	  added: function(slider){ // Adding callback when an item is added
    	    setupCommonMainAdded(this, slider);
    	    // this syncs the main image; note similar logic in the js-flexslider-pdp-thumbnail added:
    	    handleFlexContainerResize(this, slider);
    	  },
    	  removed: function(slider) {
    	    // handling some of the thumbnail flexslider on the main image remove for stack order purposes
          // add the tempmainimage overlay to prevent the screen from giving the 
          // 'flickering' (i.e. blank image -> then the image loads) effect
          shouldHideTempImageOverlay(false);  	 
    	  },
    	  start:function(slider) {
    		  // check if option image; if so, don't unhide flexslider until 2nd load
    		  // if not option image, remove loading carousel and unveil the flexslider
    		  hideLoadingSpinnerFromThumbnailTray();
    		  setupCommonMainStart(slider);
    		  // handle video thumbnails if they're present
    		  handleVideoThumbnail();
    	  }
      });
    }; // end $.fn.flexsliderProductDetailImages
    
    function flexsliderWithoutDirectionalButtons(flexNode, mainSelector, thumbnailSelector) {
      var thisFlexNode = flexNode;
      thisFlexNode.find(thumbnailSelector).flexslider({
        animation: "slide",
        controlNav: false,
        slideshow: false,
        animationLoop: false,
        pauseOnAction: false,
        directionNav: false, // don't show nav buttons
        itemWidth: 75,
        itemMargin: 5,
        asNavFor: mainSelector, // linkage to the main pdp image
        prevText: "",
        nextText: "",
        start: function(slider) {
          setupCommonThumbnailStart(thumbnailSelector, slider);
        },
        added: function(slider){ // Adding callback when an item is added
          setupCommonThumbnailAdded(thumbnailSelector, slider);
        }
      });      
      
      thisFlexNode.find(mainSelector).flexslider({
        animation: !$.featureDetect.isTouch() ? "fade" : "slide", // slide on touch, fade on desktop
        controlNav: false,
        touch: true,
        animationSpeed: IMAGE_FADE_ANIMATION_SPEED, // 350ms seems to be a nice number that works for fade and hoverIntent
        animationLoop: false,
        directionNav: false,
        pauseOnAction: false,
        slideshow: false,
        sync: thumbnailSelector, // This is to sync with the carousel
        start: function(slider) {
          setupCommonMainStart(slider);
        },
        added: function(slider) {
          setupCommonMainAdded(this, slider);
        },
        removed: function(slider) {
          // handling some of the thumbnail flexslider on the main image remove for stack order purposes
          // add the tempmainimage overlay to prevent the screen from giving the 
          // 'flickering' (i.e. blank image -> then the image loads) effect
          shouldHideTempImageOverlay(false);     
        }
      });      
    }
    
    /**
     * Initializes the QuickView product images
     */
    $.fn.flexsliderQuickViewImages = function() {
      flexsliderWithoutDirectionalButtons(this, '.js-flexslider-qv-main', '.js-flexslider-qv-thumbnail');
      // return for jQuery chainability
      return this;
  	}; // end $.fn.flexsliderQuickViewImages
  	
    
    /**
     * Initializes the Joss And Main product images
     */
    $.fn.flexsliderJossAndMainImages = function() {
      flexsliderWithoutDirectionalButtons(this, '.js-flexslider-jm-main', '.js-flexslider-jm-thumbnail');
      // return for jQuery chainability
      return this;
    };	// end $.fn.flexsliderJossAndMainImages
    
    /**
     * Initializes the DailyFair product images
     */
    $.fn.flexsliderDailyFairImages = function() {
      flexsliderWithoutDirectionalButtons(this, '.js-flexslider-df-main', '.js-flexslider-df-thumbnail');
      // return for jQuery chainability
      return this;
    };  // end $.fn.flexsliderDailyFairImages    
  
  })(jQuery);
},
  '0.1.0', {requires: [/* jquery, */ 'jquery-flexslider', 'jquery-hoverintent', 'optionimages']
});