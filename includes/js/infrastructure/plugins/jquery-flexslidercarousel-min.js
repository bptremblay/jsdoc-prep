YUI().add("jquery-flexslidercarousel",function(e){"use strict";(function(t){var n=22,r=6,i,s;i={unhideNodes:function(e){e.find(".hidden-node").removeClass("hidden-node")},hideSwipeIndicator:function(e){e.find(".pd-img-action-indicator").fadeOut(2e3)},showSwipeIndicator:function(e){var n;if(t.featureDetect.isTouch()&&e.canAdvance(e.getTarget("next"))&&e.closest(".carousel").find(".sprite.pd-img-action-indicator").length===0){n=t('<div class="sprite pd-img-action-indicator"></div>');e.append(n)}}};s={_getAdminDisplay:function(t){var n=t.closest(".carousel"),r=n.data("flexsliderCarousel");if(e.Admin&&r.hasCompletedProductAjax&&!r.hasFetchedAdminData){var i=e.all(t.find(".carousel_item").toArray());e.Admin.carousel_prod_info(i);r.hasFetchedAdminData=true}},_removeProductBlocks:function(e){var t=e.closest(".carousel"),n=t.data("flexsliderCarousel"),r=0;if(typeof n.productBlocks==="object"&&n.productBlocks.length){r=n.productBlocks.length;for(var i=0;i<r;i++){n.productBlocks[i].destroy()}n.productBlocks=""}},_addProductBlocks:function(t){var n=t.closest(".carousel"),r=n.data("flexsliderCarousel");if(r.isInterstitial){s._removeProductBlocks(t);r.productBlocks=new Array;t.find(".carousel_item").each(function(t,n){r.productBlocks.push(new e.ProductBlock(e.one(n),"interstitial"))})}},_handleProductResponse:function(e,t,n){var r=t.data("flexsliderCarousel"),i=-1,s="";r.hasCompletedProductAjax=true;if(n!==null){i=n.indexOf("<");if(i==-1){i=n.length;s=null}else{s=n.substring(i)}if(s&&e.addSlide!==undefined){e.addSlide(s)}}}};t.fn.flexsliderCarousel=function(){this.find(".carousel_content").each(function(e,o){var u=t(o),a=u.closest(".carousel"),f=t.featureDetect.isTouch()?0:n,l=f,c=r+f,h="",p=i.showSwipeIndicator,d=function(){},v=i.showSwipeIndicator,m=t.featureDetect.isTouch()?"click":"mouseenter",g,y,b,w,E,S,x,T,N,C,k;h=a.attr("data-carousel-type");if(h!==undefined){if(h.indexOf("product")>-1){S=a.find("[name=carousel_skus]");x=a.data("flexsliderCarousel");if(x===undefined){x={hasCompletedProductAjax:S.attr("data-ajax")==="",hasFetchedAdminData:false,productBlocks:"",isInterstitial:h.indexOf("interstitial")>-1};a.data("flexsliderCarousel",x)}if(x.isInterstitial){T=p;N=v;p=function(e){T(e);s._addProductBlocks(e)};v=function(e){N(e);s._addProductBlocks(e)};d=s._addProductBlocks}if(x.hasCompletedProductAjax){C=v;v=function(e){C(e);s._getAdminDisplay(e)}}else{k=p;v=function(e){t.ajax({url:YUI_config.app.store_url+"/ajax/get_carousel.php?ajax=1&sku="+S.attr("data-sku")+"&proc="+S.attr("data-proc")+"&style="+S.attr("data-cstyle")+"&layout="+S.attr("data-layout")+"&isize="+S.attr("data-isize")+"&exclude="+S.attr("data-exclude")+"&inv=1",success:function(t){s._handleProductResponse(e,a,t)}})};p=function(e){k(e);s._getAdminDisplay(e)}}}}u.parent().addClass("flexslider");a.find("[name=carwait]").remove();a.find("[name=carousel_scroll]").removeClass("hide-when-enabled-disp");g=u.width();y=g-2*c;b=u.find("li").first().width();w=Math.floor(y/b);E=w;u.css("width",""+y+"px");u.parent().css({width:""+y+"px","margin-left":""+c+"px","margin-right":""+c+"px"});u.flexslider({animation:"slide",directionNav:!t.featureDetect.isTouch(),controlNav:false,slideshow:false,animationLoop:false,pauseOnAction:false,itemWidth:b,minItems:E,maxItems:w,prevText:"",nextText:"",start:v,added:p,removed:d,before:function(e){i.unhideNodes(e);i.hideSwipeIndicator(e)}});u.find(".flex-direction-nav a").css("top",""+Math.floor((20+u.find("li").height()-l)/2)+"px");if(h!==undefined){if(h.indexOf("general")>-1){u.find(".yui3-carousel-image").each(function(e,n){if(t(n).children().length===0&&t(n).attr("data-src")!==undefined){t(n).append(t("<img></img>",{src:t(n).attr("data-src"),alt:t(n).attr("data-alt")||"",height:t(n).attr("data-height")||"",width:t(n).attr("data-width")||""})).parent().removeClass("hidden-node")}}).removeClass("yui3-carousel-image")}}u.on(m,".carousel-overlay-scroller",function(e){var n=t(this).find(".yui3-carousel-overlay");if(t.featureDetect.isTouch()&&!n.hasClass("hidden-node")){u.find(".yui3-carousel-overlay").removeClass("hidden-node");e.preventDefault()}n.addClass("hidden-node")});if(!t.featureDetect.isTouch()){u.on("mouseleave",".carousel-overlay-scroller",function(e){t(this).find(".yui3-carousel-overlay").removeClass("hidden-node")})}});return this}})(jQuery)},"0.0.1",{requires:[,"jquery-flexslider"]})