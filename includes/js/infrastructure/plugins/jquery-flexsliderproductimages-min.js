YUI().add("jquery-flexsliderproductimages",function(e){(function(t){function i(e,n,r){var i=t(e),s=t(".flexslider_main");if(r===true&&n.length===2){i.find("ul li").eq(1).remove();s.find("ul li").eq(0).remove()}else{i.addClass("hidden-node")}}function s(e,n){if(!t.featureDetect.isTouch()){return}g(e,n)}function o(e){if(t.featureDetect.isTouch()){return}e=e||null;var i=e?false:true,s=i?t(".js-flexslider-pdp-main ul .flex-active-slide img"):t(e).find("img");if(s.length>0){var o=s.attr("src"),u=t("#yui3-imagezoom-view img"),a=o.replace(n,r),f=u.attr("src");if(a!=f){u.attr("src",o);u.attr("src",a)}}}function u(e,n,r){var i=e,s=i.index();if(t.featureDetect.isTouch()){n.animating=false;return}if(m(e)===true){return}if(c(i)===true){return}if(i.hasClass("flex-active-slide")){return}if(!i.hasClass("active")){if(r===false){n.direction=n.currentItem<s?"next":"prev"}n.flexAnimate(s,true,false,true,true,true);o();if(r===true){var u=t("#imgoverlay");if(u){u.addClass("hidden-node")}}}}function a(e){var n=t(".pdtempimgoverlay img");if(!n.length){return}e?n.parent().addClass("hidden-node"):n.parent().removeClass("hidden-node")}function f(e){var n=t(".js-flexslider-pdp-thumbnail .videolinkwrap");if(!n.length){return}e?n.addClass("hidden-node"):n.removeClass("hidden-node")}function l(){var e=t(".yui3-view-all-link"),n=t(".js-flexslider-pdp-thumbnail.js-flexslider-pdp-thumbnail-small");if(!e.length||!n.length){return}n?e.removeClass("hidden-node"):e.addClass("hidden-node");if(t.featureDetect.isTouch()&&n){n.removeClass("js-flexslider-pdp-thumbnail-small")}}function c(e){var n=t(e).find(".imageoverlaymask#imgoverlay"),r=t(".imageoverlaymask.mainmask#imgoverlay");if(n.length){return true}if(!r.hasClass("hidden-node")){r.addClass("hidden-node")}return false}function h(e){var n=e.find("ul li"),r=n.length===1?true:false,i=null;if(t.featureDetect.isTouch()){i=e.closest(".flexslider-contain").find(".sprite.pd-img-action-indicator");if(r===true){i.addClass("hidden-node")}else if(i.length===0){e.append('<div class="sprite pd-img-action-indicator"></div>')}}}function p(e){function n(){u(t(this),e,false)}function r(){}if(t.featureDetect.isTouch()){return}var i={over:n,interval:HOVER_TIME,out:r};t("#thumbnail-slides > li").hoverIntent(i)}function d(){if(v()===true&&t(".js-flexslider-pdp-main").data("flexslider")){t(".js-flexslider-pdp-main").data("flexslider").flexslider(1)}}function v(){var e=t(".js-flexslider-pdp-thumbnail .videolinkwrap");if(!e.length){return false}return true}function m(e){var n=t(e).find(".videolinkwrap");return n.length?true:false}function g(e,n){if(n.slides){n.slides.unbind("click");n.slides.click(function(r){r.preventDefault();var i=t(this),s=i.index(),u=e;if(i.hasClass("flex-active-slide")){return}if(m(i)===true){return}if(c(i)===true){return}o(i);if(!t(u).data("flexslider").animating&&!i.hasClass("active")){n.direction=n.currentItem<s?"next":"prev";n.flexAnimate(s,true,false,true,true)}var a=t("#imgoverlay");if(a){a.addClass("hidden-node")}})}}function y(e){if(e.directionNav){e.directionNav.unbind("click");e.directionNav.bind("click",function(n){n.preventDefault();var r=t(this).hasClass("flex-next")?e.getTarget("next"):e.getTarget("prev");e.flexAnimate(r,false)})}}function b(e){if(!e.directionNav){return}if(e.pagingCount>1){t(".js-flexslider-pdp-thumbnail").data("flexslider").flexslider(0);e.update()}else if(e.pagingCount===1){e.pagingCount=Math.ceil(e.count/e.visible);if(e.pagingCount===1){}else{t(".js-flexslider-pdp-thumbnail").data("flexslider").flexslider(0);e.update()}}}function w(e,n){if(e.animation!=="fade"){return}var r=t(n).find("ul > li").eq(0);if(r.css("position")=="relative"&&r.css("display")=="none"){r.css("display","list-item")}}function E(e,n){var r=n.count;n.count=t(n).find("li").length;if(e.animation==="swing"&&r<=n.count){n.container.width((n.count+n.cloneCount)*200+"%")}}function S(){t(".zoomimgwrap .bgloading").last().addClass("hidden-node")}function x(e){e.slides.removeClass("flex-active-slide").eq(e.currentItem).addClass("flex-active-slide")}var n=/\/lf\/[^\/]*\//i,r="/lf/8/";HOVER_TIME=150;IMAGE_FADE_ANIMATION_SPEED=150;t.fn.flexslider=function(e){if(e===undefined)e={};if(typeof e==="object"){return this.each(function(){var n=t(this),r=e.selector?e.selector:".slides > li",s=n.find(r),o=n.find(".videolinkwrap").length>0?true:false,u=o===true&&s.length===2?true:false,a=e.asNavFor?true:false;if(s.length===1||u){if(a===true){i(n,s,o)}s.fadeIn(400);if(e.start)e.start(n)}else if(n.data("flexslider")==undefined){new t.flexslider(this,e)}})}else{var n=t(this).data("flexslider");switch(e){case"play":n.play();break;case"pause":n.pause();break;case"next":n.flexAnimate(n.getTarget("next"),true);break;case"prev":case"previous":n.flexAnimate(n.getTarget("prev"),true);break;default:if(typeof e==="number")n.flexAnimate(e,true)}}};t.fn.flexsliderProductDetailImages=function(){l();this.find(".js-flexslider-pdp-thumbnail").flexslider({animation:"slide",controlNav:false,slideshow:false,animationLoop:false,pauseOnAction:false,directionNav:!t.featureDetect.isTouch(),itemWidth:75,itemMargin:5,asNavFor:".js-flexslider-pdp-main",prevText:"",nextText:"",start:function(e){a(true);s(".js-flexslider-pdp-thumbnail",e);g(".js-flexslider-pdp-thumbnail",e);y(e);p(e)},added:function(e){e.asNav=true;e.animatingTo=Math.floor(e.currentSlide/e.move);e.count=t(e).find(".slides li").length;e.currentItem=v()?1:0;b(e);x(e);if(t.featureDetect.isTouch()){t(".js-flexslider-pdp-main").data("flexslider").flexslider(1);t(".js-flexslider-pdp-main").data("flexslider").flexslider(0)}d();g(".js-flexslider-pdp-thumbnail",e);s(".js-flexslider-pdp-thumbnail",e);o();p(e)},removed:function(e){e.pagingCount=1;t(".js-flexslider-pdp-thumbnail").data("flexslider").flexslider(0)}});this.find(".js-flexslider-pdp-main").flexslider({animation:!t.featureDetect.isTouch()?"fade":"slide",controlNav:false,touch:true,animationSpeed:IMAGE_FADE_ANIMATION_SPEED,animationLoop:false,directionNav:false,pauseOnAction:false,slideshow:false,sync:".js-flexslider-pdp-thumbnail",added:function(e){w(this,e);h(e);E(this,e)},removed:function(e){a(false)},start:function(t){S();h(t);d();e.OptionImages.resolveImageDistortion(true)}})};t.fn.flexsliderQuickViewImages=function(){this.find(".js-flexslider-qv-thumbnail").flexslider({animation:"slide",controlNav:false,slideshow:false,animationLoop:false,pauseOnAction:false,directionNav:false,itemWidth:75,itemMargin:5,asNavFor:".js-flexslider-qv-main",prevText:"",nextText:"",start:function(e){a(true);s(".js-flexslider-qv-thumbnail",e);g(".js-flexslider-qv-thumbnail",e);p(e)},added:function(e){e.asNav=true;e.animatingTo=Math.floor(e.currentSlide/e.move);e.count=t(e).find(".slides li").length;e.currentItem=v()?1:0;e.slides.removeClass("flex-active-slide").eq(e.currentItem).addClass("flex-active-slide");x(e);s(".js-flexslider-qv-thumbnail",e);g(".js-flexslider-qv-thumbnail",e);p(e)}});this.find(".js-flexslider-qv-main").flexslider({animation:!t.featureDetect.isTouch()?"fade":"slide",controlNav:false,touch:true,animationSpeed:IMAGE_FADE_ANIMATION_SPEED,animationLoop:false,directionNav:false,pauseOnAction:false,slideshow:false,sync:".js-flexslider-qv-thumbnail",start:function(t){h(t);e.OptionImages.resolveImageDistortion(true)},added:function(e){w(this,e);h(e)},removed:function(e){a(false)}});return this}})(jQuery)},"0.1.0",{requires:["jquery-flexslider","jquery-hoverintent","optionimages"]})