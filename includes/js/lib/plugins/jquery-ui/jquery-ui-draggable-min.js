YUI().add("jquery-ui-draggable",function(a){$.widget("ui.draggable",$.ui.mouse,{version:"@VERSION",widgetEventPrefix:"drag",options:{addClasses:true,appendTo:"parent",axis:false,connectToSortable:false,containment:false,cursor:"auto",cursorAt:false,grid:false,handle:false,helper:"original",iframeFix:false,opacity:false,refreshPositions:false,revert:false,revertDuration:500,scope:"default",scroll:true,scrollSensitivity:20,scrollSpeed:20,snap:false,snapMode:"both",snapTolerance:20,stack:false,zIndex:false,drag:null,start:null,stop:null},_create:function(){if(this.options.helper==="original"&&!(/^(?:r|a|f)/).test(this.element.css("position"))){this.element[0].style.position="relative"}if(this.options.addClasses){this.element.addClass("ui-draggable")}if(this.options.disabled){this.element.addClass("ui-draggable-disabled")}this._mouseInit()},_destroy:function(){this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");this._mouseDestroy()},_mouseCapture:function(b){var c=this.options;if(this.helper||c.disabled||$(b.target).closest(".ui-resizable-handle").length>0){return false}this.handle=this._getHandle(b);if(!this.handle){return false}$(c.iframeFix===true?"iframe":c.iframeFix).each(function(){$("<div class='ui-draggable-iframeFix' style='background: #fff;'></div>").css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1000}).css($(this).offset()).appendTo("body")});return true},_mouseStart:function(b){var c=this.options;this.helper=this._createHelper(b);this.helper.addClass("ui-draggable-dragging");this._cacheHelperProportions();if($.ui.ddmanager){$.ui.ddmanager.current=this}this._cacheMargins();this.cssPosition=this.helper.css("position");this.scrollParent=this.helper.scrollParent();this.offset=this.positionAbs=this.element.offset();this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};$.extend(this.offset,{click:{left:b.pageX-this.offset.left,top:b.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this.position=this._generatePosition(b);this.originalPageX=b.pageX;this.originalPageY=b.pageY;(c.cursorAt&&this._adjustOffsetFromHelper(c.cursorAt));if(c.containment){this._setContainment()}if(this._trigger("start",b)===false){this._clear();return false}this._cacheHelperProportions();if($.ui.ddmanager&&!c.dropBehaviour){$.ui.ddmanager.prepareOffsets(this,b)}this._mouseDrag(b,true);if($.ui.ddmanager){$.ui.ddmanager.dragStart(this,b)}return true},_mouseDrag:function(b,d){this.position=this._generatePosition(b);this.positionAbs=this._convertPositionTo("absolute");if(!d){var c=this._uiHash();if(this._trigger("drag",b,c)===false){this._mouseUp({});return false}this.position=c.position}if(!this.options.axis||this.options.axis!=="y"){this.helper[0].style.left=this.position.left+"px"}if(!this.options.axis||this.options.axis!=="x"){this.helper[0].style.top=this.position.top+"px"}if($.ui.ddmanager){$.ui.ddmanager.drag(this,b)}return false},_mouseStop:function(d){var b,c=this,f=false,e=false;if($.ui.ddmanager&&!this.options.dropBehaviour){e=$.ui.ddmanager.drop(this,d)}if(this.dropped){e=this.dropped;this.dropped=false}b=this.element[0];while(b&&(b=b.parentNode)){if(b===document){f=true}}if(!f&&this.options.helper==="original"){return false}if((this.options.revert==="invalid"&&!e)||(this.options.revert==="valid"&&e)||this.options.revert===true||($.isFunction(this.options.revert)&&this.options.revert.call(this.element,e))){$(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){if(c._trigger("stop",d)!==false){c._clear()}})}else{if(this._trigger("stop",d)!==false){this._clear()}}return false},_mouseUp:function(b){$("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)});if($.ui.ddmanager){$.ui.ddmanager.dragStop(this,b)}return $.ui.mouse.prototype._mouseUp.call(this,b)},cancel:function(){if(this.helper.is(".ui-draggable-dragging")){this._mouseUp({})}else{this._clear()}return this},_getHandle:function(b){var c=!this.options.handle||!$(this.options.handle,this.element).length?true:false;$(this.options.handle,this.element).find("*").addBack().each(function(){if(this===b.target){c=true}});return c},_createHelper:function(c){var d=this.options,b=$.isFunction(d.helper)?$(d.helper.apply(this.element[0],[c])):(d.helper==="clone"?this.element.clone().removeAttr("id"):this.element);if(!b.parents("body").length){b.appendTo((d.appendTo==="parent"?this.element[0].parentNode:d.appendTo))}if(b[0]!==this.element[0]&&!(/(fixed|absolute)/).test(b.css("position"))){b.css("position","absolute")}return b},_adjustOffsetFromHelper:function(b){if(typeof b==="string"){b=b.split(" ")}if($.isArray(b)){b={left:+b[0],top:+b[1]||0}}if("left" in b){this.offset.click.left=b.left+this.margins.left}if("right" in b){this.offset.click.left=this.helperProportions.width-b.right+this.margins.left}if("top" in b){this.offset.click.top=b.top+this.margins.top}if("bottom" in b){this.offset.click.top=this.helperProportions.height-b.bottom+this.margins.top}},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var b=this.offsetParent.offset();if(this.cssPosition==="absolute"&&this.scrollParent[0]!==document&&$.contains(this.scrollParent[0],this.offsetParent[0])){b.left+=this.scrollParent.scrollLeft();b.top+=this.scrollParent.scrollTop()}if((this.offsetParent[0]===document.body)||(this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()==="html"&&$.ui.ie)){b={top:0,left:0}}return{top:b.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:b.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition==="relative"){var b=this.element.position();return{top:b.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:b.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else{return{top:0,left:0}}},_cacheMargins:function(){this.margins={left:(parseInt(this.element.css("marginLeft"),10)||0),top:(parseInt(this.element.css("marginTop"),10)||0),right:(parseInt(this.element.css("marginRight"),10)||0),bottom:(parseInt(this.element.css("marginBottom"),10)||0)}},_cacheHelperProportions:function(){this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var d,f,b,e=this.options;if(e.containment==="parent"){e.containment=this.helper[0].parentNode}if(e.containment==="document"||e.containment==="window"){this.containment=[e.containment==="document"?0:$(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,e.containment==="document"?0:$(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,(e.containment==="document"?0:$(window).scrollLeft())+$(e.containment==="document"?document:window).width()-this.helperProportions.width-this.margins.left,(e.containment==="document"?0:$(window).scrollTop())+($(e.containment==="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top]}if(!(/^(document|window|parent)$/).test(e.containment)&&e.containment.constructor!==Array){f=$(e.containment);b=f[0];if(!b){return}d=($(b).css("overflow")!=="hidden");this.containment=[(parseInt($(b).css("borderLeftWidth"),10)||0)+(parseInt($(b).css("paddingLeft"),10)||0),(parseInt($(b).css("borderTopWidth"),10)||0)+(parseInt($(b).css("paddingTop"),10)||0),(d?Math.max(b.scrollWidth,b.offsetWidth):b.offsetWidth)-(parseInt($(b).css("borderLeftWidth"),10)||0)-(parseInt($(b).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(d?Math.max(b.scrollHeight,b.offsetHeight):b.offsetHeight)-(parseInt($(b).css("borderTopWidth"),10)||0)-(parseInt($(b).css("paddingBottom"),10)||0)-this.helperProportions.height-this.margins.top-this.margins.bottom];this.relative_container=f}else{if(e.containment.constructor===Array){this.containment=e.containment}}},_convertPositionTo:function(e,g){if(!g){g=this.position}var c=e==="absolute"?1:-1,b=this.cssPosition==="absolute"&&!(this.scrollParent[0]!==document&&$.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=(/(html|body)/i).test(b[0].tagName);return{top:(g.top+this.offset.relative.top*c+this.offset.parent.top*c-((this.cssPosition==="fixed"?-this.scrollParent.scrollTop():(f?0:b.scrollTop()))*c)),left:(g.left+this.offset.relative.left*c+this.offset.parent.left*c-((this.cssPosition==="fixed"?-this.scrollParent.scrollLeft():f?0:b.scrollLeft())*c))}},_generatePosition:function(c){var b,i,j,e,d=this.options,k=this.cssPosition==="absolute"&&!(this.scrollParent[0]!==document&&$.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,h=(/(html|body)/i).test(k[0].tagName),g=c.pageX,f=c.pageY;if(this.originalPosition){if(this.containment){if(this.relative_container){i=this.relative_container.offset();b=[this.containment[0]+i.left,this.containment[1]+i.top,this.containment[2]+i.left,this.containment[3]+i.top]}else{b=this.containment}if(c.pageX-this.offset.click.left<b[0]){g=b[0]+this.offset.click.left}if(c.pageY-this.offset.click.top<b[1]){f=b[1]+this.offset.click.top}if(c.pageX-this.offset.click.left>b[2]){g=b[2]+this.offset.click.left}if(c.pageY-this.offset.click.top>b[3]){f=b[3]+this.offset.click.top}}if(d.grid){j=d.grid[1]?this.originalPageY+Math.round((f-this.originalPageY)/d.grid[1])*d.grid[1]:this.originalPageY;f=b?((j-this.offset.click.top>=b[1]||j-this.offset.click.top>b[3])?j:((j-this.offset.click.top>=b[1])?j-d.grid[1]:j+d.grid[1])):j;e=d.grid[0]?this.originalPageX+Math.round((g-this.originalPageX)/d.grid[0])*d.grid[0]:this.originalPageX;g=b?((e-this.offset.click.left>=b[0]||e-this.offset.click.left>b[2])?e:((e-this.offset.click.left>=b[0])?e-d.grid[0]:e+d.grid[0])):e}}return{top:(f-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+((this.cssPosition==="fixed"?-this.scrollParent.scrollTop():(h?0:k.scrollTop())))),left:(g-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+((this.cssPosition==="fixed"?-this.scrollParent.scrollLeft():h?0:k.scrollLeft())))}},_clear:function(){this.helper.removeClass("ui-draggable-dragging");if(this.helper[0]!==this.element[0]&&!this.cancelHelperRemoval){this.helper.remove()}this.helper=null;this.cancelHelperRemoval=false},_trigger:function(b,c,d){d=d||this._uiHash();$.ui.plugin.call(this,b,[c,d]);if(b==="drag"){this.positionAbs=this._convertPositionTo("absolute")}return $.Widget.prototype._trigger.call(this,b,c,d)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,originalPosition:this.originalPosition,offset:this.positionAbs}}});$.ui.plugin.add("draggable","connectToSortable",{start:function(c,e){var d=$(this).data("ui-draggable"),f=d.options,b=$.extend({},e,{item:d.element});d.sortables=[];$(f.connectToSortable).each(function(){var g=$.data(this,"ui-sortable");if(g&&!g.options.disabled){d.sortables.push({instance:g,shouldRevert:g.options.revert});g.refreshPositions();g._trigger("activate",c,b)}})},stop:function(c,e){var d=$(this).data("ui-draggable"),b=$.extend({},e,{item:d.element});$.each(d.sortables,function(){if(this.instance.isOver){this.instance.isOver=0;d.cancelHelperRemoval=true;this.instance.cancelHelperRemoval=false;if(this.shouldRevert){this.instance.options.revert=true}this.instance._mouseStop(c);this.instance.options.helper=this.instance.options._helper;if(d.options.helper==="original"){this.instance.currentItem.css({top:"auto",left:"auto"})}}else{this.instance.cancelHelperRemoval=false;this.instance._trigger("deactivate",c,b)}})},drag:function(c,e){var d=$(this).data("ui-draggable"),b=this;$.each(d.sortables,function(){var f=false,g=this;this.instance.positionAbs=d.positionAbs;this.instance.helperProportions=d.helperProportions;this.instance.offset.click=d.offset.click;if(this.instance._intersectsWith(this.instance.containerCache)){f=true;$.each(d.sortables,function(){this.instance.positionAbs=d.positionAbs;this.instance.helperProportions=d.helperProportions;this.instance.offset.click=d.offset.click;if(this!==g&&this.instance._intersectsWith(this.instance.containerCache)&&$.contains(g.instance.element[0],this.instance.element[0])){f=false}return f})}if(f){if(!this.instance.isOver){this.instance.isOver=1;this.instance.currentItem=$(b).clone().removeAttr("id").appendTo(this.instance.element).data("ui-sortable-item",true);this.instance.options._helper=this.instance.options.helper;this.instance.options.helper=function(){return e.helper[0]};c.target=this.instance.currentItem[0];this.instance._mouseCapture(c,true);this.instance._mouseStart(c,true,true);this.instance.offset.click.top=d.offset.click.top;this.instance.offset.click.left=d.offset.click.left;this.instance.offset.parent.left-=d.offset.parent.left-this.instance.offset.parent.left;this.instance.offset.parent.top-=d.offset.parent.top-this.instance.offset.parent.top;d._trigger("toSortable",c);d.dropped=this.instance.element;d.currentItem=d.element;this.instance.fromOutside=d}if(this.instance.currentItem){this.instance._mouseDrag(c)}}else{if(this.instance.isOver){this.instance.isOver=0;this.instance.cancelHelperRemoval=true;this.instance.options.revert=false;this.instance._trigger("out",c,this.instance._uiHash(this.instance));this.instance._mouseStop(c,true);this.instance.options.helper=this.instance.options._helper;this.instance.currentItem.remove();if(this.instance.placeholder){this.instance.placeholder.remove()}d._trigger("fromSortable",c);d.dropped=false}}})}});$.ui.plugin.add("draggable","cursor",{start:function(){var b=$("body"),c=$(this).data("ui-draggable").options;if(b.css("cursor")){c._cursor=b.css("cursor")}b.css("cursor",c.cursor)},stop:function(){var b=$(this).data("ui-draggable").options;if(b._cursor){$("body").css("cursor",b._cursor)}}});$.ui.plugin.add("draggable","opacity",{start:function(c,d){var b=$(d.helper),e=$(this).data("ui-draggable").options;if(b.css("opacity")){e._opacity=b.css("opacity")}b.css("opacity",e.opacity)},stop:function(b,c){var d=$(this).data("ui-draggable").options;if(d._opacity){$(c.helper).css("opacity",d._opacity)}}});$.ui.plugin.add("draggable","scroll",{start:function(){var b=$(this).data("ui-draggable");if(b.scrollParent[0]!==document&&b.scrollParent[0].tagName!=="HTML"){b.overflowOffset=b.scrollParent.offset()}},drag:function(d){var c=$(this).data("ui-draggable"),e=c.options,b=false;if(c.scrollParent[0]!==document&&c.scrollParent[0].tagName!=="HTML"){if(!e.axis||e.axis!=="x"){if((c.overflowOffset.top+c.scrollParent[0].offsetHeight)-d.pageY<e.scrollSensitivity){c.scrollParent[0].scrollTop=b=c.scrollParent[0].scrollTop+e.scrollSpeed}else{if(d.pageY-c.overflowOffset.top<e.scrollSensitivity){c.scrollParent[0].scrollTop=b=c.scrollParent[0].scrollTop-e.scrollSpeed}}}if(!e.axis||e.axis!=="y"){if((c.overflowOffset.left+c.scrollParent[0].offsetWidth)-d.pageX<e.scrollSensitivity){c.scrollParent[0].scrollLeft=b=c.scrollParent[0].scrollLeft+e.scrollSpeed}else{if(d.pageX-c.overflowOffset.left<e.scrollSensitivity){c.scrollParent[0].scrollLeft=b=c.scrollParent[0].scrollLeft-e.scrollSpeed}}}}else{if(!e.axis||e.axis!=="x"){if(d.pageY-$(document).scrollTop()<e.scrollSensitivity){b=$(document).scrollTop($(document).scrollTop()-e.scrollSpeed)}else{if($(window).height()-(d.pageY-$(document).scrollTop())<e.scrollSensitivity){b=$(document).scrollTop($(document).scrollTop()+e.scrollSpeed)}}}if(!e.axis||e.axis!=="y"){if(d.pageX-$(document).scrollLeft()<e.scrollSensitivity){b=$(document).scrollLeft($(document).scrollLeft()-e.scrollSpeed)}else{if($(window).width()-(d.pageX-$(document).scrollLeft())<e.scrollSensitivity){b=$(document).scrollLeft($(document).scrollLeft()+e.scrollSpeed)}}}}if(b!==false&&$.ui.ddmanager&&!e.dropBehaviour){$.ui.ddmanager.prepareOffsets(c,d)}}});$.ui.plugin.add("draggable","snap",{start:function(){var b=$(this).data("ui-draggable"),c=b.options;b.snapElements=[];$(c.snap.constructor!==String?(c.snap.items||":data(ui-draggable)"):c.snap).each(function(){var e=$(this),d=e.offset();if(this!==b.element[0]){b.snapElements.push({item:this,width:e.outerWidth(),height:e.outerHeight(),top:d.top,left:d.left})}})},drag:function(u,p){var c,z,j,k,s,n,m,A,v,h,g=$(this).data("ui-draggable"),q=g.options,y=q.snapTolerance,x=p.offset.left,w=x+g.helperProportions.width,f=p.offset.top,e=f+g.helperProportions.height;for(v=g.snapElements.length-1;v>=0;v--){s=g.snapElements[v].left;n=s+g.snapElements[v].width;m=g.snapElements[v].top;A=m+g.snapElements[v].height;if(!((s-y<x&&x<n+y&&m-y<f&&f<A+y)||(s-y<x&&x<n+y&&m-y<e&&e<A+y)||(s-y<w&&w<n+y&&m-y<f&&f<A+y)||(s-y<w&&w<n+y&&m-y<e&&e<A+y))){if(g.snapElements[v].snapping){(g.options.snap.release&&g.options.snap.release.call(g.element,u,$.extend(g._uiHash(),{snapItem:g.snapElements[v].item})))}g.snapElements[v].snapping=false;continue}if(q.snapMode!=="inner"){c=Math.abs(m-e)<=y;z=Math.abs(A-f)<=y;j=Math.abs(s-w)<=y;k=Math.abs(n-x)<=y;if(c){p.position.top=g._convertPositionTo("relative",{top:m-g.helperProportions.height,left:0}).top-g.margins.top}if(z){p.position.top=g._convertPositionTo("relative",{top:A,left:0}).top-g.margins.top}if(j){p.position.left=g._convertPositionTo("relative",{top:0,left:s-g.helperProportions.width}).left-g.margins.left}if(k){p.position.left=g._convertPositionTo("relative",{top:0,left:n}).left-g.margins.left}}h=(c||z||j||k);if(q.snapMode!=="outer"){c=Math.abs(m-f)<=y;z=Math.abs(A-e)<=y;j=Math.abs(s-x)<=y;k=Math.abs(n-w)<=y;if(c){p.position.top=g._convertPositionTo("relative",{top:m,left:0}).top-g.margins.top}if(z){p.position.top=g._convertPositionTo("relative",{top:A-g.helperProportions.height,left:0}).top-g.margins.top}if(j){p.position.left=g._convertPositionTo("relative",{top:0,left:s}).left-g.margins.left}if(k){p.position.left=g._convertPositionTo("relative",{top:0,left:n-g.helperProportions.width}).left-g.margins.left}}if(!g.snapElements[v].snapping&&(c||z||j||k||h)){(g.options.snap.snap&&g.options.snap.snap.call(g.element,u,$.extend(g._uiHash(),{snapItem:g.snapElements[v].item})))}g.snapElements[v].snapping=(c||z||j||k||h)}}});$.ui.plugin.add("draggable","stack",{start:function(){var b,d=$(this).data("ui-draggable").options,c=$.makeArray($(d.stack)).sort(function(f,e){return(parseInt($(f).css("zIndex"),10)||0)-(parseInt($(e).css("zIndex"),10)||0)});if(!c.length){return}b=parseInt(c[0].style.zIndex,10)||0;$(c).each(function(e){this.style.zIndex=b+e});this[0].style.zIndex=b+c.length}});$.ui.plugin.add("draggable","zIndex",{start:function(c,d){var b=$(d.helper),e=$(this).data("ui-draggable").options;if(b.css("zIndex")){e._zIndex=b.css("zIndex")}b.css("zIndex",e.zIndex)},stop:function(b,c){var d=$(this).data("ui-draggable").options;if(d._zIndex){$(c.helper).css("zIndex",d._zIndex)}}})},"0.0.1",{requires:["jquery-ui-core","jquery-ui-widget","jquery-ui-mouse"]});
