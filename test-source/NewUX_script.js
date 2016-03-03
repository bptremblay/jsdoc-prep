/*
* JavaScript helper code for NextGen New UX Project. @2016 BNYM
*/
 
// The following global variables are NOT constants.
/**
* Handle to the JS timeout for message box auto-close duration.
* @type {Number}
*/
var mbxTimeout = -1;
/**
* The context path from the JSP servlet.
* @type {String}
*/
var contextPath = '';
/**
* The JSP org code.
* @type {String}
*/
var orgCode = 'gis';
/**
* JS file version number.
* @type {String}
*/
var nxv = '0.5.5';
/**
* The JSP runtime environment id.
* @type {String}
*/
var runtime = '';
/**
* An alias to _showErrMsg
* @type {Function}
*/
var showErrMsg = _showErrMsg;
/**
* An alias to _hideErrMsg
* @type {Function}
*/
var hideErrMsg = _hideErrMsg;
 
 
/**
* Very simple logging. No-op in production environment.
* @param msg 
 * @param severity
*/
function report(msg, severity) {
    if (window.console == null) {
        /**
         * console.
         */
        var console = {
            /**
             * console logging
             */
            log: function () {},
            /**
             * info logging method? who uses this?
             */
            info: function () {},
            /**
             * Print a warning with an angry color.
             */
            warn: function () {},
            /**
             * Debug-level logging is not built-in feature of a console. Is this for ExtJS?
             */
            debug: function () {},
            /**
             * Print an error message, including stack trace, in very angry color.
             */
            error: function () {}
        };
    }
    // don't print stuff to the console in the wild
    if (runtime === ("dev") || runtime === ("int") || runtime === ("test")) {
 
        var detect = navigator.userAgent.toLowerCase();
        if (detect.search("msie") > 0) {
            if (window.console != null) {
                window.console.log(msg);
            }
        } else {
            window.console.log(msg);
        }
    }
}
 
//shim populateDevicePrint to avoid script errors
if (!populateDevicePrint) {
    /**
     * Populate device print... RSA method.
     */
    var populateDevicePrint = function () {};
}
 
/**
* Set org code.
* @param code
*/
function setOrgCode(code) {
   report('Setting the org code to "' + code + '".');
    orgCode = code.toLowerCase();
}
/**
* Get org code.
* @return {String}
*/
function getOrgCode() {
    return orgCode;
}
/**
* Set runtime.
* @param env
*/
function setRuntime(env) {
    runtime = env.toLowerCase();
    report('Setting the runtime to "' + env + '".');
}
/**
* Set context path.
* @param path
*/
function setContextPath(path) {
    report('Setting the context path to "' + path + '".');
    contextPath = path;
}
/**
* Get context path.
* @return {String}
*/
function getContextPath() {
    return contextPath;
}
/**
* Get root url for the browser. (varies between deployed and dev modes)
* @return {String}
*/
var getRootUrl = function () {
 
    var loc = window.location;
 
    var rootUrl = loc.protocol + '//' + loc.hostname;
    if (loc.port) {
        rootUrl += ':' + loc.port;
    }
    return rootUrl;
};
///////////////////////////////// WIDGETS ////////////////////////////////
/**
* Slide switch.
* @constructor
*/
function SlideSwitch() {
    this.el = null;
    this.state = false;
    this.states = null;
    this.trueStateElement = null;
    this.falseStateElement = null;
    this.trueStateBorderElement = null;
    this.borderElement = null;
}
/**
* @property {Number} cid A static counter for all instances of slideswitch.
* YAGNI... we don't use multiple slide switches anywhere.
*/
SlideSwitch.prototype.cid = 0;
/**
* Set state.
* @param {String} state It's a color: red/green/gray
*/
SlideSwitch.prototype.setState = function (state) {
    report('SlideSwitch.setState(' + state + ')');
    this.state = state;
 
    var whichState = this.states[state];
 
    var newLeft = '';
    if (state) {
        // motion
        newLeft = this.borderElement.css('left');
        // color
        //      this.trueStateElement.find('span').css('color', 'rgb(255, 255, 255, 0.8)');
        //      this.falseStateElement.find('span').css('color', '#333333');
    } else {
        // FIXME: hard-coded
        newLeft = '41px';
        //      this.falseStateElement.find('span').css('color', 'rgb(255, 255, 255, 0.8)');
        //      this.trueStateElement.find('span').css('color', '#333333');
    }
    // report(newLeft);
    // this.sliderElement.css('left', newLeft);
 
    var cfg = {
        'left': newLeft
    };
 
    var me = this;
    this.sliderElement.animate(cfg, 50, function () {
        if (state) {
            // motion
            newLeft = me.borderElement.css('left');
            // color
            me.trueStateElement.find('span').css('color', 'rgb(255, 255, 255)');
            me.falseStateElement.find('span').css('color', '#333333');
        } else {
            // FIXME: hard-coded
            newLeft = '41px';
            me.falseStateElement.find('span').css('color', 'rgb(255, 255, 255)');
            me.trueStateElement.find('span').css('color', '#333333');
        }
    });
    if (this.handler) {
        this.handler(this);
    }
};
/**
* @param {Object} config
* @param {jQueryElement} parent Where to insert the DOM element of this widget
*/
SlideSwitch.prototype.init = function (config, parent) {
    this.states = config;
    if (!this.el) {
        /**
         * src.
         */
        var src = [];
        src.push('<div id="slideSwitch_' + SlideSwitch.prototype.cid + '" class="slideSwitch">');
        src.push('<div class="ax_default" id="u462">');
        src.push('<!-- Unnamed (Rectangle) -->');
        src.push('<div class="ax_default box_1" id="u463">');
        src.push('  <div class="" id="u463_div"></div>');
        src.push('  <!-- Unnamed () -->');
        src.push('  <div style="display: none; visibility: hidden" class="text" id="u464">');
        src
            .push('    <p><span style="font-family:\'ArialMT\', \'Arial\';font-weight:400;font-style:normal;font-size:13px;text-decoration:none;color:#333333;"></span></p>');
        src.push('  </div>');
        src.push('</div>');
        src.push('<!-- Unnamed (Rectangle) -->');
        src.push('<div class="ax_default box_1" id="u465">');
        src.push('  <div class="" id="u465_div"></div>');
        src.push('  <!-- Unnamed () -->');
        src.push(' <div style="display: none; visibility: hidden" class="text" id="u466">');
        src
            .push('    <p><span style="font-family:\'ArialMT\', \'Arial\';font-weight:400;font-style:normal;font-size:13px;text-decoration:none;color:#333333;"></span></p>');
        src.push('  </div>');
        src.push(' </div>');
        src.push('<!-- Unnamed (Rectangle) -->');
        src.push('<div class="ax_default label" id="u467">');
        src.push('<div class="" id="u467_div"></div>');
        src.push('<!-- Unnamed () -->');
        src.push(' <div style="visibility: visible;" class="text" id="u468">');
        src
            .push('<p><span style="font-family:\'ArialMT\', \'Arial\';font-weight:400;font-style:normal;font-size:12px;text-decoration:none;color:#333333;">SSN</span></p>');
        src.push('</div>');
        src.push('</div>');
        src.push('<!-- Unnamed (Rectangle) -->');
        src.push('<div class="ax_default label" id="u469">');
        src.push('<div class="" id="u469_div"></div>');
        src.push('<!-- Unnamed () -->');
        src.push('<div style="visibility: visible;" class="text" id="u470">');
        src
            .push('<p><span style="font-family:\'ArialMT\', \'Arial\';font-weight:400;font-style:normal;font-size:12px;text-decoration:none;color:rgb(255, 255, 255, 0.8);opacity:0.8;">EIN</span></p>');
        src.push('</div>');
        src.push('</div>');
        src.push('</div>');
        this.el = $(src.join('\n'));
 
        var trueState = this.states["true"];
 
        var me = this;
        this.trueStateElement = this.el.find(trueState.id);
        this.trueStateElement.bind("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            // report('TRUE click');
            me.setState(true);
        });
        this.el.find(trueState.id + ' span').html(trueState.label);
 
        var falseState = this.states["false"];
        this.falseStateElement = this.el.find(falseState.id);
        this.falseStateElement.bind("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            // report('FALSE click');
            me.setState(false);
        });
        this.el.bind("click", function (event) {
            // report('FALSE click');
            event.preventDefault();
            event.stopPropagation();
            me.setState(!me.state);
        });
        this.el.find(falseState.id + ' span').html(falseState.label);
        // report('get the thumb: ' + this.states.thumb.id);
        this.sliderElement = this.el.find(this.states.thumb.id);
        this.borderElement = this.el.find(this.states.border.id);
        if (!parent) {
            $('body').append(this.el);
        } else {
            $(parent).append(this.el);
        }
    }
    SlideSwitch.prototype.cid++;
    this.handler = config.handler;
    if (config.state != null) {
        this.setState(config.state);
    }
    this.el.show();
};
///////////// TOOLTIP API /////////////////
/**
* Current tool tip.
* @type {ToolTip} The global used for the ToolTip Singleton
*/
var currentToolTip = null;
/**
* Get tool tip.
 * ToolTip Singleton Factory
* Populates global currentToolTip with the one and only ToolTip instance.
* @example getToolTip().init().showToolTip('#accountNumber', 'Hello');
*
 * @return {ToolTip} currentToolTip
*/
var getToolTip = function () {
    /**
     * Tool tip.
     * @constructor
     */
    function ToolTip() {
        this.el = null;
        // contents may be HTML
        this.contents = '';
    }
    /**
     * Construct DOM elements of this widget. Until init() is called, the widget has no DOM presence.
     * @param {jQueryElement} parent The element we append this widget's element to.
     * @return {ToolTip}
     */
    ToolTip.prototype.init = function (parent) {
        if (!this.el) {
            /**
             * buffer.
             */
            var buffer = [];
            buffer.push('<div id = "tooltip" class = "tooltip">');
            buffer
                .push('<div style="visibility: visible; display: block;" data-label="Email tooltip" class="ax_default ax_default_hidden" id="u926">');
            buffer
                .push('<div data-label="State1" class="panel_state" id="u926_state0" style="width: 155px; height: 68px;">');
            buffer.push('     <div class="panel_state_content" id="u926_state0_content">');
            buffer.push('      <!-- Unnamed (Shape) -->');
            buffer.push('      <div class="ax_default box_2" id="u927">');
            buffer.push('        <img src="' + contextPath + '/imagesv4/tooltip.png" class="img " id="u927_img">');
            buffer.push('        <!-- Unnamed () -->');
            buffer.push('        <div style="display: none; visibility: hidden" class="text" id="u928">');
            buffer
                .push('          <p><span style="font-family:\'ArialMT\', \'Arial\';font-weight:400;font-style:normal;font-size:13px;text-decoration:none;color:#333333;"></span></p>');
            buffer.push('        </div>');
            buffer.push('     </div>');
            buffer.push('      <!-- Unnamed (Rectangle) -->');
            buffer.push('     <div class="ax_default paragraph" id="u929">');
            buffer.push('       <div class="" id="u929_div"></div>');
            buffer.push('       <!-- Unnamed () -->');
            buffer.push('      <div style="visibility: visible;" class="text" id="u930">');
            buffer
                .push(
                    '         <p class="tooltip-content-container"><span id="content" class="tooltip-content" style="font-family:\'ArialMT\', \'Arial\';font-weight:400;font-style:normal;font-size:13px;text-decoration:none;color:#333333;"></span></p>'
                );
            buffer.push('      </div>');
            buffer.push('    </div>');
            buffer.push('   </div>');
            buffer.push('  </div>');
            buffer.push('</div>');
            buffer.push('</div>');
            this.el = $(buffer.join('\n'));
            this.el.hide();
            if (!parent) {
                $('body').append(this.el);
            } else {
                $(parent).append(this.el);
            }
            this.el.hide();
        }
        return this;
    };
    /**
     * Find pos.
     * @author taken from quirksmode.org
     * @param {DOMElement} obj 
     * @return {left {Number}, top {Number}}
     */
    function findPos(obj) {
        var curtop = 0;
        var curleft = curtop;
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return {
            left: curleft,
            top: curtop
        };
    }
    /**
     * Show tool tip.
     * @param {JQueryElement} targetEl Draw the tooltip adjacent to targetEl
     * @param {String} content The HTML to show inside the tooltip
     * @param {String} sizeSpec Name of the size of the tooltip: large/x-large/small (default)
     * @return {ToolTip}
     */
    ToolTip.prototype.showToolTip = function (targetEl, content, sizeSpec) {
        this.contents = content;
        if (!targetEl) {
            return;
        }
        this.el.show();
        if (sizeSpec === 'large') {
            this.el.find("#u927_img").attr('height', '79');
            this.el.find("#u927_img").attr('src', contextPath + '/imagesv4/tooltip_large.png');
            this.el.find("#u927_img").css('height', '79px');
        } else if (sizeSpec === 'x-large') {
            // #u930
            // -11px
            // 125px
            // line-height: 25px
            this.el.find("#u927_img").attr('height', '119');
            this.el.find("#u927_img").attr('src', contextPath + '/imagesv4/tooltip_x-large.png');
            this.el.find("#u927_img").css('height', '119px');
        } else {
            this.el.find("#u927_img").attr('height', '56');
            this.el.find("#u927_img").attr('src', contextPath + '/imagesv4/tooltip.png');
            this.el.find("#u927_img").css('height', '56px');
        }
 
        var pos = $(targetEl).offset();
        pos = findPos($(targetEl)[0]);
        // report(pos);
        // var w = $(targetEl).parent().find('.x-form-invalid-msg').width() + 16;
        // if (w === 3){
 
        var w = $(targetEl).width() + 32;
        // }
        this.el.find('#content').html(content);
        if (sizeSpec === 'x-large') {
            this.el.find("#u930 span").css('font-size', '8pt');
            this.el.find("#u930").css('left', '-15px');
            this.el.find("#u930").css('top', '-13px');
            this.el.find("#u930").css('width', '127px');
            this.el.find("#u930 li").css('line-height', '16px');
        } else {
            this.el.find("#u930 span").css('font-size', '9pt');
            this.el.find("#u930").css('left', '-10px');
            this.el.find("#u930").css('top', '-10px');
            this.el.find("#u930").css('width', '125px');
            this.el.find("#u930 li").css('line-height', '16px');
        }
 
        var locEl = $('#u926');
        var myHeightOffset = locEl.height() / 2;
        // report(myHeightOffset);
        locEl.css('zindex', '5000');
        locEl.css('left', (pos.left + w) + 'px');
        locEl.css('top', (pos.top - myHeightOffset) + 'px');
        // locEl.css('border-style', 'solid');
        // locEl.css('border-width', '1px');
        // locEl.css('border-color', '#000');
    };
    if (currentToolTip == null) {
        currentToolTip = new ToolTip();
    }
    return currentToolTip;
};
//////////////////PROGRESS BAR ///////////////////////////
/**
* Chevron progress.
 * ChevronProgress is a dynamic progress bar capable of drawing itself using configuration data.
* All the dom elements for this widget are emitted from JavaScript.
* @constructor
*/
function ChevronProgress() {
    this.el = null;
    this.step = -1;
    this.steps = [];
}
/**
* Init.
 * Construct DOM elements of this widget. Until init() is called, the widget has no DOM presence.
* @param {Array<Object>} steps The step elements for each step in the progress bar.
 * @param {JQueryElement} parent The element we append this widget's element to.
 * @return {ChevronProgress}
*/
ChevronProgress.prototype.init = function (steps, parent) {
    if (!this.el) {
        this.el = $('<div id="chevronProgress" class="chevron-progress"></div>');
        if (!parent) {
            $('body').append(this.el);
        } else {
            $(parent).append(this.el);
        }
    }
    this.steps = steps;
 
    /**
     * Enable/Disable a Chevron Progress Bar Step.
     * @param {Number} stepNumber
     * @param {Boolean} state
     */
    this.setStepEnabled = function (stepNumber, state) {
        this.steps[stepNumber].enabled = (state === true);
 
        this.el.empty();
 
        for (var n = 0; n < this.steps.length; n++) {
 
            var theStep = this.steps[n];
            addStep(this.el, n, theStep);
        }
        return this;
    };
    /**
     * Add step.
     * @param el 
     * @param number 
     * @param label 
     * @param link
     */
    function addStep(el, number, stepObj) {
        stepObj.sequence = number;
 
        var whichChevron = 'chevron';
        if (number > 0) {
            whichChevron = 'chevron_mid';
        }
 
        var imageRez = stepObj.enabled ? whichChevron : 'chevron_disabled';
 
       var stepState = stepObj.enabled ? 'chevron-step' : 'chevron-step-disabled';
        stepObj.image = imageRez;
        stepObj.style = stepState;
 
        var linkEnabled = (stepObj.link != null) ? 'chevron-step-link-enabled' : 'chevron-step-link-disabled';
 
        var labelElementSrc = '<span class="chevron-step-label">' + stepObj.label + '</span>';
        if (stepObj.enabled && stepObj.link) {
            labelElementSrc = '<span class="chevron-step-label"><a class="' + linkEnabled + '" href="javascript:void(0);">' + stepObj.label + '</a></span>';
        }
 
        var step = $('<span id="step_' + number + '" class="' + stepState + '" ><img src="' + contextPath + '/imagesv4/' + imageRez + '.png">' + labelElementSrc + '</span>');
        // <span style="font-family:'ArialMT',
        // 'Arial';font-weight:400;font-style:normal;font-size:11px;text-decoration:none;color:#169BD5;">Enter User
        // ID</span>
        if (stepObj.enabled && stepObj.link) {
            step.on("click", function () {
                stepObj.link();
            });
        }
        el.append(step);
 
        var CHEV_OFFSET = 12;
        step.css("left", "-" + (CHEV_OFFSET * number) + "px");
    }
 
    for (var n = 0; n < steps.length; n++) {
 
        var theStep = steps[n];
        addStep(this.el, n, theStep);
    }
    this.el.show();
    return this;
};
///////////////////// Message Bar API ///////////////////////////
/**
* Message bar.
* @constructor
*/
function MessageBar() {
    this.el = null;
}
/**
* Close every instance of MessageBar
* @static
*/
MessageBar.closeAll = closeAllMessages;
/**
* Show the message bar with the desired message and color.
* @param {String} message Any HTML you wish to display, within sane limits.
 * @param {String} type Could be info/success/error or gray/green/red. Default is red.
*/
MessageBar.prototype.show = function (message, type) {
    if (message == null) {
        report("Error: MessageBar.show() called with null message.");
        message = "[empty mesage]";
    }
    if (type == null) {
        type = "gray";
    }
    type = type.toLowerCase();
    if (type === "info") {
        type = "gray";
    } else if (type === "success") {
        type = "green";
    } else if (type === "error") {
        type = "red";
    }
    this.el = NewUX_showMessage(message, type);
};
/**
* Hide the message bar, using the default fadeout.
*/
MessageBar.prototype.hide = function () {
    if (this.el) {
        NewUX_closeMessage(false, this.el);
        this.el = null;
    }
    //    else{
    //        report("Error: MessageBar.hide() called when MessageBar was not shown.");
    //    }
};
 
 
 
/*
* message bar "API" is a set of procedures used to manage the Message Bar.
* "Message Bar Object" here is a normal jQuery Element.
*/
/**
* Message boxes.
* @type {Array<jQueryElement>} The global used for maintaining the current list of Message Bars
*/
var messageBoxes = [];
 
/**
* Pending error message.
* @type {String} The global used for the next error message to be displayed. Note only one next message can be displayed.
*/
var pendingErrorMessage = '';
 
/**
* Pending success message.
* @type {String} The global used for the next success message to be displayed. Note only one next message can be displayed.
*/
var pendingSuccessMessage = '';
/**
* Hide message.
* @alias {Function} hideMessage A copy of hideErrMsg
*/
var hideMessage = hideErrMsg;
 
/**
* Generic error message box.
* @type {jQueryElement} genericErrorMessageBox A reference to the last-created existing Message Bar
*/
var genericErrorMessageBox = null;
 
/**
* @description Get the scroll vertical offset.
* @return {Number}
*/
function getScrollVOffset() {
    var detect = navigator.userAgent.toLowerCase();
    if (detect.search("msie") > 0) {
        return $("body").scrollTop();
    }
    return 0;
}
 
/**
* Center absolute message.
* @param messageBox
*/
function centerAbsoluteMessage(messageBox) {
 
    var msgWidth = messageBox.width();
    // Should we use the document width?
 
    var windowWidth = $('body').innerWidth();
    // report('window is ' + windowWidth);
    // report('bar is ' + msgWidth);
 
    var offsetCenter = (windowWidth / 2) - (msgWidth / 2);
    messageBox.css("left", offsetCenter);
}
 
/**
* Restack message boxes.
 * Re-order message boxes after delete.
*/
function restackMessageBoxes() {
    // report('restackMessageBoxes');
    /**
     * vertical sum.
     * @type {Number}
     */
    var verticalSum = 0;
    /**
     * The last message bar.
     * @type {Object}
     */
    var lastMessageBar = null;
    /**
     * last message box height.
     * @type {Number}
     */
    var lastMessageBoxHeight = 0;
    /**
     * last message box top.
     * @type {Number}
     */
    var lastMessageBoxTop = 0;
    /**
     * bar top.
     */
    var barTop = $(".menudiv").position().top;
    barTop += getScrollVOffset();
    /**
     * bar height.
     */
    var barHeight = $(".menudiv").height();
    // Set the CLIPPING RECTANGLE and BASE POSITION in the right position now.
    /**
     * where to place top.
     */
    var whereToPlaceTop = barTop + barHeight;
    /**
     * @type {array}
     */
    var newTops = [];
 
    var m = 0;
    for (m = 0; m < messageBoxes.length; m++) {
        //report('message box ' + m);
        lastMessageBar = messageBoxes[m];
        // lastMessageBoxTop = lastMessageBar.position().top;
        lastMessageBoxHeight = lastMessageBar.height();
        //lastMessageBar.css("top", (whereToPlaceTop + verticalSum) + 'px');
        newTops.push(whereToPlaceTop + verticalSum);
        verticalSum += lastMessageBoxHeight;
    }
    for (m = 0; m < messageBoxes.length; m++) {
        //report('message box ' + m);
        lastMessageBar = messageBoxes[m];
        //lastMessageBar.css("top", newTops[m] + 'px');
        lastMessageBar.animate({
            "top": (newTops[m] + 'px')
        }, 400, function () {
            report('done restacking ' + m);
        });
    }
    report('Add the vertical offsets of the previous bars: ' + (verticalSum));
}
 
/**
* Newux closemessage.
* @param noAnimate 
 * @param whichMessageBox
*/
function NewUX_closeMessage(noAnimate, whichMessageBox) {
    /**
     * message boxm jQuery selection.
     */
    var messageBox = whichMessageBox != null ? whichMessageBox : $("#u213");
    if (!noAnimate) {
        report('fading out');
        messageBox.fadeOut(1000, function () {
            report('done fading out');
            /**
             * newux message.
             */
            var NewUX_message = $("#NewUX_message");
            NewUX_message.html('');
            /**
             * bar top.
             */
            var barTop = $(".menudiv").position().top;
            barTop += getScrollVOffset();
            /**
             * bar height.
             */
            var barHeight = $(".menudiv").height();
            /**
             * message box height.
             */
            var messageBoxHeight = messageBox.height();
            /**
             * message slab.
             */
            var messageSlab = $("#u213_state0");
            messageSlab.css("top", (0 - messageBoxHeight - 1) + 'px');
            if (whichMessageBox) {
                if (messageBox.data("backdrop")) {
                    messageBox.data("backdrop").hide();
                    messageBox.data("backdrop").remove();
                }
                report('removing');
                messageBox.remove();
                report('rearrange n mbxs: ' + messageBoxes.length);
                window.setTimeout(restackMessageBoxes, 1);
            }
        });
    } else {
        messageBox.hide();
        if (messageBox.data("backdrop")) {
            messageBox.data("backdrop").hide();
            messageBox.data("backdrop").remove();
        }
        if (whichMessageBox) {
            report('removing');
            messageBox.remove();
            report('rearrange n mbxs: ' + messageBoxes.length);
            window.setTimeout(restackMessageBoxes, 1);
        }
    }
    /**
     * pos.
     */
    var pos = messageBoxes.indexOf(messageBox);
    if (pos !== -1) {
        //alert('found this message box, remove it from the list');
        messageBoxes.splice(pos, 1);
    }
    if (mbxTimeout > 0) {
        window.clearTimeout(mbxTimeout);
        mbxTimeout = -1;
    }
}
 
/**
* Close all messages.
 * Dismiss all message bars.
* @param dontFadeOut
 * @return {Object} The jQuery selection for the message bar.
*/
function closeAllMessages(dontFadeOut) {
    /**
     * @type {Object}
     */
    var tempMessageBar = null;
    /**
     * @type {Number}
     */
    var m = 0;
    /**
     * still visible.
     * @type {Boolean}
     */
    var stillVisible = true;
    /**
     * @param {Object} mb The jQuery element representing a message bar.
     * @return {Function}
     */
    function func(mb) {
        var ret = function () {
            NewUX_closeMessage(dontFadeOut, mb);
        };
        return ret;
    }
    for (m = 0; m < messageBoxes.length; m++) {
        tempMessageBar = messageBoxes[m];
        window.setTimeout(func(tempMessageBar), 10);
    }
}
/**
* Get non IMS messages.
 * Get red and green message bars.
* @return array of message bars
*/
function getNonIMSMessages() {
    /**
     * result.
     */
    var result = [];
    /**
     * temp message bar.
     * @type {Object}
     */
    var tempMessageBar = null;
    /**
     * m.
     * @type {Number}
     */
    var m = 0;
    for (m = 0; m < messageBoxes.length; m++) {
        tempMessageBar = messageBoxes[m];
        if (tempMessageBar.data("severity") !== 'gray') {
            result.push(tempMessageBar);
        }
    }
    return result;
}
/**
* Close non IMS messages.
 * Close red and green message bars, immediately.
* Use to reset the status upon submit.
* @param {Boolean} dontFadeOut True if we want the message bars to close instantly.
*/
function closeNonIMSMessages(dontFadeOut) {
    /**
     * temp message bar.
     * @type {Object}
     */
    var tempMessageBar = null;
 
    var m = 0;
    for (m = 0; m < messageBoxes.length; m++) {
        tempMessageBar = messageBoxes[m];
        if (tempMessageBar.data("severity") !== 'gray') {
            NewUX_closeMessage(dontFadeOut, tempMessageBar);
        }
    }
}
/**
* Is message box created.
 * Search existing message boxes for this message.
* @param {String} msg 
 * @return {Boolean}
*/
function isMessageBoxCreated(msg) {
    /**
     * The last message bar.
     * @type {Object}
     */
    var lastMessageBar = null;
 
    var m = 0;
    for (m = 0; m < messageBoxes.length; m++) {
        lastMessageBar = messageBoxes[m];
        if (lastMessageBar.data("msg") === msg) {
            return true;
        }
    }
    return false;
}
/**
* Get message box created.
 * Get the messaage box if it already exists.
* @param {String} msg 
 * @return {jQuerySelection}
*/
function getMessageBoxCreated(msg) {
    /**
     * The last message bar.
     * @type {Object}
     */
    var lastMessageBar = null;
 
    var m = 0;
    for (m = 0; m < messageBoxes.length; m++) {
        lastMessageBar = messageBoxes[m];
        if (lastMessageBar.data("msg") === msg) {
            return lastMessageBar;
        }
    }
    return null;
}
/**
* Newux showmessage.
* @example NewUX_showMessage("hello", "green", 5000)
* @param {String} msg 
 * @param {String} severity 
 * @param {Number} duration 
 * @param {Boolean} noAnimate 
 * @param {Function} clickHandler 
 * @param (boolean) noClose -- no closebox! beware!
*/
function NewUX_showMessage(msg, severity, duration, noAnimate, clickHandler, noClose) {
    /**
     * args.
     */
    var args = arguments;
    if (runtime === '') {
        // defer
        report('Trying to show a message bar too early! Let\'s try again later, shall we?');
        window.setTimeout(function () {
            NewUX_showMessage.apply(this, args);
        }, 100);
        return;
    }
    //alert('NewUX_showMessage: ' + severity);
    // report(msg);
    $("body").focus();
    severity = severity ? severity : "gray";
    if (isMessageBoxCreated(msg)) {
        report('Do not show ' + severity.toUpperCase() + ' message "' + msg + '" more than once.');
        window.setTimeout(function () {
            // Defect #3082 Force the message bars to get focus so the carets underneath will disappear.
            getMessageBoxCreated(msg).focus();
        }, 10);
        return null;
    }
    /**
     * message box.
     */
    var messageBox = $("#u213").clone(true);
    messageBox.data("msg", msg);
    messageBox.data("severity", severity);
    messageBoxes.push(messageBox);
    //messageBox.data('cid', messageBoxes.length);
    if (severity === 'modal') {
        /**
         * backdrop.
         */
        var backdrop = $('<div class="plexiglass"></div>');
        messageBox.data("backdrop", backdrop);
        $("body").append(backdrop);
        $("body").append(messageBox);
        messageBox.css('z-index', '3001');
    } else {
        $("body").append(messageBox);
    }
    /**
     * newux message.
     */
    var NewUX_message = messageBox.find("#NewUX_message");
    messageBox.find("#closebox").on("click", function () {
        NewUX_closeMessage(false, messageBox);
    });
    // NewUX_message.css('display', "block");
    // NewUX_message.css('max-width', "750px");
    /**
     * image path.
     * @type {String}
     */
    var imagePath = '';
    /**
     * levels.
     */
    var levels = {
        green: {
            "color": '#66CC33',
            // "background-color": 'rgb(223, 247, 223, 1)',
            "background-color": 'rgb(223, 247, 223)',
            // "border-color": 'rgb(102, 204, 51, 1)'
            "border-color": 'rgb(102, 204, 51)'
        },
        red: {
            "color": '#EA6A5E',
            // "background-color": 'rgb(249, 211, 207, 1)',
            "background-color": 'rgb(249, 211, 207)',
            // "border-color": 'rgb(234, 106, 94, 1)'
            "border-color": 'rgb(234, 106, 94)'
        },
        gray: {
            "color": '#666666',
            "background-color": '#E4E4E4',
            "border-color": '#999999'
        },
        modal: {
            "color": '#666666',
            "background-color": '#E4E4E4',
            "border-color": '#999999'
        }
    };
    /**
     * colors.
     */
    var colors = levels.red;
    if (severity) {
        colors = levels[severity];
        imagePath = contextPath + '/imagesv4/' + severity + '_closebox.png';
        report('Setting image path for message bar now: ' + imagePath);
        // #u214_div
        // #u216
        // #u216_div
        // u215
        // $('#u214_div').css(colors);
        messageBox.find('#u215').css(colors);
        messageBox.find('#u214_div').css(colors);
        messageBox.find('#u216').css(colors);
        messageBox.find('#u216_div').css(colors);
        messageBox.find('#u217').css(colors);
        messageBox.find("#u217 p span").css(colors);
        // messageBox.css(colors);
    }
    if (severity === 'modal') {
        imagePath = contextPath + '/imagesv4/' + 'gray' + '_closebox.png';
    }
    if (noClose) {
        imagePath = null;
        messageBox.find("#u218").remove();
    }
    centerAbsoluteMessage(messageBox);
    // this should NOT be hard-coded:
    /**
     * text line height.
     * @type {Number}
     */
    var TEXT_LINE_HEIGHT = 16;
    if (clickHandler) {
        msg += '<p><button id="messageBarPopupOkay" style="color: ' + colors.color + '">Okay</button>';
        //msg +='<p><div id="messageBarPopupOkay" class="continue"><a style="font-family: \'Arial-BoldMT\', \'Arial Bold\', \'Arial\'; font-weight: 700; font-style: normal; font-size: 13px; text-decoration: none; color: ' + colors.color + '" id="register" href="javascript:callRegistration();">Okay</a></div><p>';
    }
    NewUX_message.html(msg);
    NewUX_message.addClass("unselectable");
    if (clickHandler) {
        NewUX_message.find('#messageBarPopupOkay').on("click", function () {
            clickHandler();
        });
    }
    // report("NewUX_message height: " + $("#NewUX_message").height());
    /**
     * top margin.
     * @type {Number}
     */
    var TOP_MARGIN = 17;
    /**
     * panel height.
     * @type {Number}
     */
    var PANEL_HEIGHT = 50;
    /**
     * panel border.
     * @type {Number}
     */
    var PANEL_BORDER = 1;
    messageBox.find('#u214_div').css("height", PANEL_HEIGHT + 'px');
    /**
     * message box height.
     */
    var messageBoxHeight = messageBox.height();
    /**
     * message slab.
     */
    var messageSlab = messageBox.find("#u213_state0");
    messageSlab.css("top", (0 - messageBoxHeight - 1) + 'px');
    messageBox.show();
    window.setTimeout(function () {
        /**
         * text height.
         */
        var textHeight = messageBox.find("#NewUX_message").height();
        // report("textHeight: " + textHeight + ', textLineHeight: ' + TEXT_LINE_HEIGHT );
        if (textHeight > TEXT_LINE_HEIGHT) {
            messageBox.css("height", (textHeight + (TOP_MARGIN * 2) + PANEL_BORDER + 1) + 'px');
            messageBox.find('#u214_div').css("height", textHeight + (TOP_MARGIN * 2) + PANEL_BORDER + 'px');
        } else {
            messageBox.find('#u214_div').css("height", PANEL_HEIGHT + 'px');
            messageBox.css("height", PANEL_HEIGHT + 'px');
        }
        if (imagePath) {
            messageBox.find("#closebox").html('');
            messageBox.find("#closebox").append('<img src="' + imagePath + '" />');
        }
        // messageBox.fadeIn(500);
        /**
         * bar top.
         */
        var barTop = $(".menudiv").position().top;
        barTop += getScrollVOffset();
        //report("barTop: " + barTop);
        /**
         * bar height.
         */
        var barHeight = $(".menudiv").height();
        //report("barHeight: " + barHeight);
        // GET THE HEIGHT OF ME:
        /**
         * message box height.
         */
        var messageBoxHeight = messageBox.height();
        //report("messageBoxHeight: " + messageBoxHeight);
        /**
         * message slab.
         */
        var messageSlab = messageBox.find("#u213_state0");
        // messageSlab.css('position', 'relative');
        // set the slab in the starting position
        messageSlab.css("top", (0 - messageBoxHeight - 1) + 'px');
        // Set the CLIPPING RECTANGLE and BASE POSITION in the right position now.
        /**
         * where to place top.
         */
        var whereToPlaceTop = barTop + barHeight;
        /**
         * vertical sum.
         * @type {Number}
         */
        var verticalSum = 0;
        if (messageBoxes.length > 1) {
            report('more than one message box, stack it');
            /**
             * The last message bar.
             * @type {Object}
             */
            var lastMessageBar = null;
            /**
             * last message box height.
             * @type {Number}
             */
            var lastMessageBoxHeight = 0;
            /**
             * last message box top.
             * @type {Number}
             */
            var lastMessageBoxTop = 0;
 
            for (var m = 0; m < messageBoxes.length - 1; m++) {
                report('message box ' + m);
                lastMessageBar = messageBoxes[m];
                //lastMessageBoxTop = lastMessageBar.position().top;
                lastMessageBoxHeight = lastMessageBar.height();
                verticalSum += lastMessageBoxHeight;
            }
            report('Add the vertical offsets of the previous bars: ' + (verticalSum));
        }
        messageBox.css("top", (whereToPlaceTop + verticalSum) + 'px');
        /**
         * cfg.
         */
        var cfg = {
            "top": (0) + 'px'
        };
        //cfg.top = (stackingOffset) + 'px';
        messageBox.show();
        if (!noAnimate) {
            messageSlab.animate(cfg, 750, function () {
                NewUX_message.focus();
            });
        } else {
            messageSlab.css(cfg);
            NewUX_message.focus();
        }
        if (duration) {
            report('show message for ' + duration + ' milliseconds');
            if (mbxTimeout === -1)
                mbxTimeout = window.setTimeout(function () {
                    if (!noAnimate) {
                        report('fading out now');
                        messageBox.fadeOut(1000, function () {
                            report('faded out now');
                            mbxTimeout = -1;
                            report('removing');
                            messageBox.remove();
                            /**
                             * pos.
                             */
                            var pos = messageBoxes.indexOf(messageBox);
                            if (pos !== -1) {
                                //alert('found this message box, remove it from the list');
                                messageBoxes.splice(pos, 1);
                                report('rearrange n mbxs: ' + messageBoxes.length);
                                window.setTimeout(restackMessageBoxes, 1);
                            }
                        });
                    } else {
                        messageBox.hide();
                        report('removing');
                        messageBox.remove();
                        /**
                         * pos.
                         */
                        var pos = messageBoxes.indexOf(messageBox);
                        if (pos !== -1) {
                            //alert('found this message box, remove it from the list');
                            messageBoxes.splice(pos, 1);
                            report('rearrange n mbxs: ' + messageBoxes.length);
                            window.setTimeout(restackMessageBoxes, 1);
                        }
                    }
                }, duration);
        }
        window.setTimeout(function () {
            // Defect #3082 Force the message bars to get focus so the carets underneath will disappear.
            messageBox.focus();
        }, 10);
    }, 1);
    return messageBox;
}
//Override the error message UI:
/**
* @param noAnimate
*/
function _hideErrMsg(noAnimate) {
    $("#errMsg").hide();
    NewUX_closeMessage(noAnimate, genericErrorMessageBox);
    genericErrorMessageBox = null;
}
/**
* Show err msg.
 * Wrapper for showing an error message. Looks for standard elements in "NewUX_" JSP pages containing message data:<br />
*
 * $("#errMsg") - The holder for a server-side errors.<br />
*
 * $(".clsNextGenError") - Holder used on some screens for additional server-side messages.<br />
*
 * $("#defaultErrMsg") - Holder for generic client-side message. "Please correct the following..."<br />
* .
* @param noAnimate
*/
function _showErrMsg(noAnimate) {
    hideErrMsg(true);
    $("#errMsg").hide();
    $(".clsNextGenError").find('p').hide();
    /**
     * message.
     */
    var message = $("#errMsg");
    if (message.length) {
        message = message.html().trim();
        $("#errMsg").html('');
    } else {
        message = null;
    }
    /**
     * default error message.
     */
    var defaultErrorMessage = $("#defaultErrMsg");
    /**
     * errors.
     */
    var errors = $(".clsNextGenError");
    if (errors.length) {
        errors = errors.find('p');
    }
    if (errors.length) {
        errors = errors.html().trim();
    } else {
        errors = null;
    }
    if (errors) {
        // NewUX_showMessage(message + '<br /><span class="errorList">' + errors + '</span>', 'red');
        genericErrorMessageBox = NewUX_showMessage(errors, 'red', null, noAnimate);
        // erase
        $(".clsNextGenError").find('p').html('');
    } else if (message) {
        // NewUX_showMessage(message + '<br /><span class="errorList">' + errors + '</span>', 'red');
        genericErrorMessageBox = NewUX_showMessage(message, 'red', null, noAnimate);
    } else {
        if (defaultErrorMessage.length > 0) {
            /**
             * default error message text.
             */
            var defaultErrorMessageText = defaultErrorMessage.html().trim();
            genericErrorMessageBox = NewUX_showMessage(defaultErrorMessageText, 'red', null, noAnimate);
        } else {
            report('WARNING: tried to call showErrMsg() but no message or default message was present!');
        }
    }
}
/**
* Display message.
* @deprecated
* @param txt
*/
function displayMessage(txt) {
    if (txt) {
        if ((txt.indexOf('The information you entered was incorrect.') !== -1) || (txt.indexOf("Forgot Password") !== -1)) {
            NewUX_showMessage(txt, 'red');
        } else {
            NewUX_showMessage(txt, 'gray');
        }
    }
}
/**
* Messsagebox test.
* @test
* @description Simple unit test for Message Bar API.
*
 */
function messsageBox_test() {
    /**
     * green.
     */
    var green = new MessageBar();
    /**
     * gray.
     */
    var gray = new MessageBar();
    /**
     * red.
     */
   var red = new MessageBar();
    NewUX_showMessage("should only show the same message one time", "green");
    // should not show this next message
    NewUX_showMessage("should only show the same message one time", "red");
    window.setTimeout(function () {
        NewUX_showMessage("Hello " + new Date().getTime() * Math.random(), "red");
        window.setTimeout(function () {
            NewUX_showMessage("Hello " + new Date().getTime() * Math.random(), "green");
            window.setTimeout(function () {
                NewUX_showMessage("Hello " + new Date().getTime() * Math.random(), "gray");
                window.setTimeout(function () {
                    green.show("Things are GREAT!", "green");
                    window.setTimeout(function () {
                        gray.show("Things are OKAY.", "gray");
                        window.setTimeout(function () {
                            red.show("Things are BAD!", "red");
                            window.setTimeout(function () {
                                green.hide();
                                window.setTimeout(function () {
                                    gray.hide();
                                    window.setTimeout(function () {
                                        red.hide();
                                        window.setTimeout(function () {
                                            MessageBar.closeAll();
                                        }, 1000);
                                    }, 500);
                                }, 500);
                            }, 500);
                        }, 10);
                    }, 10);
                }, 10);
            }, 500);
        }, 10);
    }, 10);
}
///////////////////// END Message Box API ///////////////////////////
//////////////validations //////////////////
/**
* Is numeric.
* @param {Object} obj 
 * @return {Boolean}
*/
var isNumeric = function (obj) {
    return (obj != null && obj.join == null) && (obj - parseFloat(obj) + 1) >= 0;
};
//////////////race condition with showErrMsg //////////////////
$(function () {
    if (document.getElementById("errMsg")) {
        if (document.getElementById("errMsg").style.display !== 'none') {
            document.getElementById("errMsg").style.display = "none";
            _showErrMsg();
        }
    }
    /**
     * resizing.
     * @type {Boolean}
     */
    var resizing = false;
    $(window).on("resize", function (evt) {
        /**
         * message box.
         * @type {Object}
         */
        var messageBox = null;
        /**
         * resizing flag.
         * @type {Boolean}
         */
        var resizingFlag = false;
 
        for (var m = 0; m < messageBoxes.length; m++) {
            messageBox = messageBoxes[m];
            if (!resizing && messageBox.css("display") !== "none") {
                resizingFlag = true;
                centerAbsoluteMessage(messageBox);
           }
        }
        if (resizingFlag) {
            resizing = true;
            window.setTimeout(function () {
                resizing = false;
            }, 100);
        }
    });
    hideErrMsg = _hideErrMsg;
    showErrMsg = _showErrMsg;
});
/**
* @param messageText
*/
function ux_showInfoMsg(messageText) {
    /**
     * all messages.
     */
    var allMessages = messageText.join(' ');
    if (allMessages.indexOf("PLEASE NOTE") !== -1) {
        /**
         * decoded.
         */
        var decoded = decodeURIComponent(messageText.join(' '));
        report('ux_showInfoMsg', decoded);
        NewUX_showMessage(decoded, 'gray');
    } else {
        ux_showSuccessMsg(messageText);
    }
}
/*
* We may be inserting too many <br> in here.
*/
// Snippet for fixing the text with embedded <br>.
//var warning = responseObj[1].data.result;
//warning = warning.split('<br/>');
//for (var i = 0; i < warning.length; i++){
//    warning[i] = trim(warning[i]);
//}
//warning = warning.join('&nbsp;');
/**
* @param messageText
*/
function ux_showErrMsg(messageText) {
    /**
     * decoded.
     */
    var decoded = decodeURIComponent(messageText.join(' '));
    report('ux_showErrMsg', '"' + decoded + '"');
    pendingErrorMessage = decoded;
}
/**
* @param messageText
*/
function ux_showSuccessMsg(messageText) {
    /**
     * decoded.
     */
    var decoded = decodeURIComponent(messageText.join(' '));
    report('ux_showSuccessMsg', '"' + decoded + '"');
    pendingSuccessMessage = decoded;
}
/**
* Another alias for _hideErrMsg.
*/
function ux_hideMsg() {
    _hideErrMsg();
}
/**
* Ux showimsselectivemessage.
 * Show a message and supply some optional handlers.
* @param message 
 * @param {Function} closeHandler 
 * @param {Function} okayHandler 
 * @param {Function} cancelHandler
*/
function ux_showIMSSelectiveMessage(message, closeHandler, okayHandler, cancelHandler) {
    NewUX_showMessage(message, 'gray');
}
/* Array for holding IMS Selective Message data */
/**
* IMS array.
*/
var IMSArray = [];
/**
* Ux handleimsmessages.
 * Setter for IMSArray.
* @param {Array<String>} messageArray
*/
function ux_handleImsMessages(messageArray) {
    report('handleImsMessages');
    IMSArray = messageArray;
}
/**
* popup showing
* @type {Boolean}
*/
var popupShowing = false;
/**
* Are any message bars present?
* @return {Boolean}
*/
function noMessageWidgets() {
    return ((!popupShowing) && IMSArray.length === 0 && messageBoxes.length === 0);
}
/**
* Handle message bar triggers.
 * Handle all types of messages. This happens asynchronously because the script tags all load at different times.
* @todo: Possible to show >1 message at one time. Need to stack message bars of different colors.
* DONE! now all 3 could be invoked at once
*
 */
function handleMessageBarTriggers() {
    /**
     * box.
     * @type {Object}
     */
    var box = null;
    report('handleMessageBarTriggers: checking for queued text messages');
    if (runtime === '') {
        // defer
        report('Trying to check for queued text messages too early! Let\'s try again later, shall we?');
        window.setTimeout(function () {
            handleMessageBarTriggers();
        }, 100);
        return;
    }
    if (pendingErrorMessage.length) {
        NewUX_showMessage(pendingErrorMessage, 'red');
        pendingErrorMessage = '';
    }
    if (pendingSuccessMessage.length) {
        // don't auto-close success messages
        NewUX_showMessage(pendingSuccessMessage, 'green');
        pendingSuccessMessage = '';
    }
    if (IMSArray.length) {
        window.setTimeout(function () {
            // report(messageArray);
            /**
             * message array.
             */
            var messageArray = IMSArray;
            // autoScroll: "N"
            // isPopup: "N"
            // msg: "Welcome to the Internet Account Management demo site. This space can be used to display a
            // message to your shareholders. <a href="https://www.bnymellon.com">Visit BNY Mellon</a> <br>"
            // styleClass: "clsSelectiveMsgStyle1"
            /**
             * message body
             * @type {String}
             */
            var messageBody = '';
            /**
             * click handler
             * @type {Object}
             */
            var clickHandler = null;
            /**
             * redirect
             * @type {Boolean}
             */
            var redirect = false;
            for (var index = 0; index < messageArray.length; index++) {
                var message = messageArray[index];
                if (message.isPopup === 'Y') {
                    // NOTE: we never set popupShowing back to false!!! Intentionally.
                    popupShowing = true;
                    redirect = true;
                    if (this.ux_IMSRedirect)
                        clickHandler = message.isPopup === 'Y' ? this.ux_IMSRedirect : null;
                    else {
                        report('WARNING: ux_IMSRedirect NOT DEFINED');
                    }
                    if (this.ux_IMSPageLogic)
                        this.ux_IMSPageLogic();
                    else {
                        report('WARNING: ux_IMSRux_IMSPageLogicedirect NOT DEFINED');
                    }
                }
                /**
                 * @type {String}
                 * html
                 */
                var html = '<div class="' + message.styleClass + '" id="ims_' + index + '" >' + message.msg + '</div>';
                messageBody += html;
            }
            // UNIT TEST
            //                redirect = true;
            //                var box = null;
            //                clickHandler = function(){
            //                    //debugger;
            //                    box.hide();
            //                };
            if (redirect) {
                if (clickHandler) {
                    report('about to show popup, divert focus to body');
                    $("body").focus();
                    report('show the box');
                    box = Ext.Msg.show({
                        title: '',
                        msg: ("<div class=\"popupMessage\">" + messageBody + "</div>"),
                        width: 854,
                        closable: false,
                        modal: true,
                        multiline: false
                    });
                    /**
                     * @type {Array}
                     */
                    var pos = box.getDialog().getPosition();
                    //console.log(pos);
                    pos[1] = 200;
                    report('move the box');
                    box.getDialog().setPosition(pos);
                    report('focus body, again');
                    $("body").focus();
                    report('focus dialog');
                    box.getDialog().focus();
                    window.setTimeout(function () {
                        report('focus dialog, again');
                        box.getDialog().focus();
                    }, 250);
                    window.setTimeout(function () {
                        report('focus dialog, again');
                        box.getDialog().focus();
                    }, 1005);
                    window.setTimeout(function () {
                        report('calling the redirect handler');
                        clickHandler();
                    }, 10000);
                } else {
                    report('ERROR: IMS Selective Message with redirect popup, but NO REDIRECT HANDLER FOUND.');
                }
            } else {
                NewUX_showMessage(messageBody, 'gray', null, null, null);
            }
        }, 1);
    }
}
//Adjust this to change exactly when all message bar triggers are detected.
$(function () {
    window.setTimeout(handleMessageBarTriggers, 250);
});
 
 
/*
* PLACHOLDERS etc.
* placeholder code here is just a polyfill for IE browsers.
* It is not used for Chrome or Firefox, etc.
*/
var fieldsToCheck = {};
/**
* @description Initialize events and render PlaceHolder shim for IE.
 * @see handleDefault below
*/
function activatePlaceholders() {
    var detect = navigator.userAgent.toLowerCase();
    if (detect.search("msie") > 0) {
        // if (true){
        $('input[type=text],input[type=email]').each(function (ind, elem) {
            if ($(elem).attr('placeholder') != "") {
                if ($(elem).val() === "" || $(elem).val() === $(elem).attr('placeholder')) {
                    $(elem).css("color", "gray");
                    //var fieldObject = fieldsToCheck[$(elem).attr("name")];
                    // fieldObject.extComponent.preventMark = true;
                    // report('you may NOT validate ' + $(elem).attr("name"));
                    $(elem).val($(elem).attr("placeholder"));
                }
                // was click, changed to focus
                $(elem).focus(function () {
                    /**
                     * field object
                     */
                    var fieldObject = fieldsToCheck[$(this).attr("name")];
                    if ($(this).val() == $(this).attr("placeholder")) {
                        // report('you may validate ' + $(this).attr("name"));
                        // fieldObject.extComponent.preventMark = false;
                        $(this).val("");
                        $(this).css("color", "black");
                    } else {
                        // fieldObject.extComponent.preventMark = true;
                    }
                });
                $(elem).blur(function () {
                    /**
                     * field object.
                     */
                    var fieldObject = fieldsToCheck[$(this).attr("name")];
                    if ($(this).val() === "" || $(this).val() === $(this).attr("placeholder")) {
                        // report('you may NOT validate ' + $(this).attr("name"));
                        $(this).css("color", "gray");
                        $(this).val($(this).attr("placeholder"));
                        // fieldObject.extComponent.preventMark = true;
                    } else {
                        $(this).css("color", "black");
                        // fieldObject.extComponent.preventMark = false;
                    }
                });
            }
        });
    }
}
/**
* Trick ExtJS into getting the real value for a placeholder instead of the placeholder text.
* @param {String} fieldName
*/
function placeHolderValidate(fieldName) {
    var detect = navigator.userAgent.toLowerCase();
    if (detect.search("msie") > 0) {
        var obj = fieldsToCheck[fieldName];
        var type = obj.el.attr('type');
        if (type !== 'password') {
            var savePlaceHolder = obj.el.prop("placeholder");
            obj.el.val('');
            obj.el.prop("placeholder", "");
            window.setTimeout(function () {
                obj.el.prop("placeholder", savePlaceHolder);
                obj.el.val(savePlaceHolder);
                obj.el.css("color", "gray");
            }, 1);
        }
    }
}
/**
* Returns true if placeholder shim element is default or empty.
* @param fieldName
* @return {Boolean}
*/
function isDefaultOrEmpty(fieldName) {
    var obj = fieldsToCheck[fieldName];
    if (obj) {
        return (obj.el.val() === '' || obj.el.val() === obj["default"]);
    }
    return false;
}
/**
* Returns true if placeholder shim element is default.
* @param fieldName
* @return {Boolean}
*/
function isDefault(fieldName) {
    var obj = fieldsToCheck[fieldName];
    if (!obj) {
        return false;
    }
    return (obj.el.val() === obj["default"]);
}
/**
* Handle default.
 * Used to intitialize placeholder logic on form fields.
* @param {String} elementName 
 * @param {String} defaultValue 
 * @param {Object} extComponent
*/
function handleDefault(elementName, defaultValue, extComponent) {
    report('handleDefault: "' + elementName + '", ' + defaultValue);
 
    var el = document.getElementsByName(elementName);
    if (el.length === 0) {
        report('elment ' + elementName + ' not found');
    }
 
    var jqEl = $(el[0]);
    // jqEl.val(defaultValue);
    jqEl.prop('placeholder', defaultValue);
    fieldsToCheck[elementName] = {
        "default": defaultValue,
        el: jqEl,
        extComponent: extComponent
    };
}
/**
* Dump field, for diagnostic purposes.
 * This uses report(), which is disabled in production.
* Dump the contents of this form input to the console.
* @param {String} name
*/
function dumpField(name) {
    report('Field "' + name + '" >> ' + getField(name));
}
/**
* Get field. Get the contents of this form input.
*
 * @fixme This does not scope the search to a specific form. Consider the case of multiple forms on a page with fields
*        having the same names.
* @param {String} name
* @return {String} The value of the element.
*/
function getField(name) {
    try {
        var field = document.getElementsByName(name)[0];
        return field.value;
    } catch (e) {
        report(e.message);
        return "";
    }
}
///////////////////////////// General Utilities ///////////////////////////////
/**
* Trim.
 * Polyfill for String.trim().
* @param {String} input 
 * @return {String}
*/
function trim(input) {
    if (input == null) {
        return "";
    }
    return input.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
}
///////////////////////////// END General Utilities ///////////////////////////////
//Initialization Methods:
$(function () {
    // showErrMsg(true);
    // hideErrMsg(true);
    getToolTip().init();
});