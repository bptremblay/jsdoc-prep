define("init_page", ["wayfair", "jquery", "underscore", "browser_utils", "visibility", "scribe", "dom_utils", "event_dispatch", "page_visibility", "openx", "url_utils", "wf_dropdown_headers", "logger", "speed_index", "wf_storage", "sitespect", "wf_scheduler", "tracking", "lazy!sync_recently_viewed_products", "lazy!sync_recently_viewed_classes", "lazy!wf_modal_manager", "scroll_to_top", "init_autocomplete_v2", "performance_timing", "modal_quickview", "gmedia", "site_feedback", "modal_utility_functions", "jquery_flexsliderrotate", "visibility_tracker", "sitespect_core", "init_show_page"], function (wf, $, _, BrowserUtils, Visibility, scribe, DomUtils, EventDispatch, pageVisibility, OpenX, UrlUtils, dropdownHeaders, logger, speedIndex, Storage, SiteSpect, Scheduler, Tracker, syncRecentlyViewedPromise, syncRecentlyViewedClassesPromise, modalManagerPromise) {
    "use strict";
    if (document.visibilityState === "prerender") {
        logger.useLogger("js_prerender_tracking").info("PRERENDERED");
        pageVisibility.bus.listenToOnce(pageVisibility.bus, "change", function (obj) {
            if (obj.state === "visible" || obj.state === "hidden") {
                logger.useLogger("js_prerender_tracking").info("PRERENDERED AND VIEWED")
            }
        })
    }
    if (wf.features && wf.features.enable_scribe_client_prerender_tracking) {
        scribe.trackPrerendering()
    }
    if (wf.features && wf.features.measure_speed_index && window.location.href.indexOf("speed_index=true") !== -1) {
        Scheduler.queuePostLoadTask(function () {
            speedIndex()
        })
    }
    var TRACKING_EVENT_TYPE = wf.constants.eventTypes.TRACKING_EVENT_TYPE;
    var AMD_EVENT_TYPE = wf.constants.eventTypes.AMD_EVENT_TYPE;
    var exports = {};
    var $body = wf.$body;

    function initializeClickDelegates() {
        $body.on("click", ".yui3-signin-modal", function (event) {
            event.preventDefault();
            var target = $(event.target),
                redirectURL = target.attr("data-redirect-url");
            UrlUtils.redirectToLogin(redirectURL)
        });
        $body.on("click", ".yui3-noclick, .js-noclick", function (event) {
            event.preventDefault()
        });
        $body.on("click", ".js-ss-click", function (event) {
            var $target = $(event.currentTarget).data();
            SiteSpect.trackEvent($target.clickTrack, $target.clickFactor)
        });
        $body.on("change", ".js-ss-select", function (event) {
            var $select = $(event.currentTarget);
            SiteSpect.trackEvent($select.attr("data-select-track") + ":" + $select.val(), $select.attr("data-click-factor"))
        });
        $body.on("click", ".yui3-popup, .yui3-toggle", function (e) {
            var ct = e.currentTarget;
            ct = $(ct);
            if (ct.hasClass("yui3-popup")) {
                BrowserUtils.openPopup(e)
            } else if (ct.hasClass("yui3-toggle")) {
                DomUtils.toggle(e)
            }
        });
        $body.on("focus", ".yui3-blur-text", DomUtils.hideBlurText);
        $body.on("blur", ".yui3-blur-text", DomUtils.showBlurText);
        $('a[data-click-track="nav-department"]').on("click", function (event) {
            SiteSpect.trackEvent($(event.currentTarget).attr("data-click-track"))
        });
        $body.on("click", "[data-click-location]", function () {
            var externalLinkClick = "_blank" === this.target;
            if (externalLinkClick && $(this).hasClass("js-cms-link")) {
                return
            }
            var clickLocation = DomUtils.getDataAttr(this, "click-location");
            var clickLocationMetadata = DomUtils.getDataAttr(this, "click-location-metadata");
            if (externalLinkClick) {
                var rfCstmVars = "Event=1;ClickLocation=" + clickLocation + ";ClickLocationMetadata=" + clickLocationMetadata + ";";
                Tracker.spvTwo(this.href, document.location.href, rfCstmVars)
            } else {
                Tracker.setClickLocation(clickLocation, clickLocationMetadata)
            }
        });
        $body.on("change", "[data-select-location]", function () {
            var $select = $(this),
                clickLocation = $select.attr("data-select-location") + ":" + $select.val(),
                clickLocationMetadata = $select.attr("data-select-location-metadata");
            Tracker.setClickLocation(clickLocation, clickLocationMetadata)
        });
        $body.on("click", ".js-lead-source", function () {
            Storage.cookie.set({
                key: "LeadSource",
                value: DomUtils.getDataAttr(this, "lead-source"),
                ttl: 0
            })
        });
        $body.on("click", ".js-track-event", function (event) {
            var target = event.currentTarget;
            Tracker.recordEvent(target.getAttribute("data-event-name"), target.getAttribute("data-event-cstmvars"))
        })
    }
    if (!(wf.appData.pageAlias === "Superbrowse" || wf.appData.pageAlias === "ProductPage")) {
        Storage.cookie.remove({
            key: "CSNBrief",
            subKey: "previous_caid"
        });
        Storage.cookie.remove({
            key: "CSNBrief",
            subKey: "used_widget"
        })
    }

    function initializeDealBlock() {
        var dealBlock = $(".yui3-deal-email-block");
        if (dealBlock.length > 0) {
            dealBlock.on("submit", function (e) {
                e.preventDefault();
                var dealBlock = $(e.currentTarget),
                    dealEmailEl = dealBlock.find(".yui3-deal-email-text"),
                    emailText = dealEmailEl.val(),
                    defaultText = dealEmailEl.attr("data-blur-text"),
                    device = dealEmailEl.attr("data-device"),
                    pageType = dealEmailEl.attr("data-page_type"),
                    captureMethod = dealEmailEl.attr("data-method");
                if (emailText != null && emailText !== "" && emailText !== defaultText) {
                    var dealCallBack = function (responseText) {
                        dealHandler(responseText)
                    };
                    var dealHandler = function (responseText) {
                        var responseMsg = responseText.message;
                        responseMsg = responseMsg.split("$~$DELIM$~$");
                        var outStatus = responseMsg[0],
                            outMsg = responseMsg[1];
                        if (outStatus === "0") {
                            dealBlock.html('<div class="dealemailsubmit">' + outMsg + "</div>")
                        } else if (outStatus === "1") {
                            dealBlock.find(".yui3-deal-email-message").html(outMsg)
                        }
                        var pixels = responseText.pixels;
                        if (pixels) {
                            for (var pixelName in pixels) {
                                if (pixels.hasOwnProperty(pixelName)) {
                                    var existingElement = $("." + pixelName).eq(0);
                                    if (existingElement.length === 0) {
                                        var pixelElement = '<div class="' + pixelName + '" style="display:none">' + responseText.pixels[pixelName] + "</div>";
                                        dealBlock.append(pixelElement)
                                    } else {
                                        existingElement.html(responseText.pixels[pixelName])
                                    }
                                }
                            }
                        }
                    };
                    var url = wf.constants.STORE_URL + "/session/public/ajax/deal_email.php?email=" + encodeURIComponent(emailText) + "&device=" + encodeURIComponent(device) + "&page_type=" + encodeURIComponent(pageType) + "&method=" + encodeURIComponent(captureMethod);
                    if (window.YUI_config && window.YUI_config.app.blinds_page) {
                        window.processJSContent(url + "&jsp=1", dealHandler, "deal_email_var")
                    } else {
                        $.ajax({
                            type: "GET",
                            url: url,
                            success: dealCallBack
                        })
                    }
                }
            })
        }
    }

    function initializePagingEvent() {
        var pagingSelects = $("form.yui3-paging-form select");
        if (pagingSelects.length > 0) {
            pagingSelects.on("change", DomUtils.submitPaging)
        }
    }

    function initializeTracking() {
        Scheduler.queuePostLoadTask(function () {
            if (typeof window.ta_breadcrumb !== "undefined") {
                EventDispatch.trigger(TRACKING_EVENT_TYPE, {
                    verb: "TELL_APART"
                })
            }
            if (wf.features && wf.features.enable_scribe_client_page_view_tracking) {
                Visibility.afterPrerendering(function () {
                    scribe.trackPageViewing();
                    scribe.trackVisibilityChanges()
                })
            }
            if (wf.features && wf.features.enable_scribe_client_click_tracking) {
                scribe.trackBodyClicks()
            }
        })
    }
    EventDispatch.one(AMD_EVENT_TYPE, {
        verb: "LOADED"
    }, function () {
        initializeClickDelegates();
        $body.on("mouseenter mouseleave", ".yui3-toggle-hover", DomUtils.toggle);
        if ($.featureDetect.isTouch()) {
            $body.on("mouseleave", ".yui3-touch-dismiss-hover", function () {})
        }
        initializeDealBlock();
        initializePagingEvent();
        initializeTracking();
        if (wf && wf.tracking && wf.tracking.gmedia && window.google_csa_query) {
            if (wf.tracking.gmedia.doAFS && wf.tracking.gmedia.doAFS !== "" || wf.tracking.gmedia.doAFC && wf.tracking.gmedia.doAFC !== "") {
                Scheduler.queuePostLoadTask(function () {
                    wf.tracking.gmedia.startAdsense()
                })
            }
        }
        if (!wf.features.free_shipping_new_tungsten_modal) {
            modalManagerPromise.done(function () {
                var modalStyle = 5,
                    modalTitle = "Shipping Details";
                if (wf.constants.STORE_ID === wf.constants.BIRCH_ID || wf.constants.STORE_ID === wf.constants.JOSSANDMAIN_ID) {
                    modalStyle = 1;
                    modalTitle = null
                } else if (wf.constants.STORE_ID === wf.constants.WAYFAIR_ID) {
                    modalStyle = null;
                    modalTitle = null
                }
                $(".js-free-shipping").wfModalManager({
                    style: modalStyle,
                    userClass: "freeshipping_modal",
                    title: modalTitle,
                    content: null,
                    ajax: wf.constants.STORE_URL + "/ajax/free_shipping.php"
                })
            }).load()
        }
    });

    function googleTrustedStore() {
        window.gts.push(["id", "" + window.YUI_config.app.ts_merchant_id]);
        window.gts.push(["locale", "" + window.YUI_config.app.google_trusted_store_locale]);
        window.gts.push(["google_base_offer_id", window.YUI_config.app.prodID]);
        window.gts.push(["google_base_subaccount_id", "" + window.YUI_config.app.search_account_id]);
        window.gts.push(["google_base_country", "" + window.YUI_config.app.google_base_country]);
        window.gts.push(["google_base_language", "" + window.YUI_config.app.google_base_language]);
        if (window.YUI_config.app.google_trusted_badge_float) {
            window.gts.push(["badge_position", "BOTTOM_RIGHT"])
        } else {
            window.gts.push(["badge_position", "USER_DEFINED"]);
            window.gts.push(["badge_container", "GTS_CONTAINER"]);
            window.gts.push(["gtsContainer", "GTS_CONTAINER"])
        }(function () {
            var scheme = document.location.protocol + "//";
            var gts = document.createElement("script");
            gts.type = "text/javascript";
            gts.async = true;
            gts.src = scheme + "www.googlecommerce.com/trustedstores/api/js";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(gts, s)
        })()
    }

    function initOpenX() {
        if (OpenX && OpenX.loadOpenX && !!wf.tracking.openx) {
            OpenX.loadOpenX()
        }
    }

    function refreshBasket() {
        $.ajax({
            url: wf.constants.STORE_URL + "/a/checkout/basket/refresh_basket"
        })
    }

    function initStickyButtons() {
        var feedbackTypeId = "";
        var showFeedbackButton = true;
        if (wf.appData.sidebar_feedback_type_id && !isNaN(wf.appData.sidebar_feedback_type_id)) {
            feedbackTypeId = wf.appData.sidebar_feedback_type_id;
            showFeedbackButton = Storage.cookie.get({
                key: "CSNPersist",
                subKey: "sticky_feedback"
            }) + "" !== "0"
        }
        var bd = $("#bd");
        if (bd.length) {
            if (wf.appData.showBackToTop) {
                var backToTopButton = $("<div " + 'class="btt_btn btn_css jq-back-to-top-button hidden-node js-ss-click js-track-event" ' + 'data-click-track="back_to_top" data-event-name="BackToTop">' + '<a href="javascript:void(0);" class="cleanlink_disabled">' + '<span class="btt_icon wficonfont wf_primarytext"></span>&nbsp;<span class="btt_text">' + "Back To Top" + "</span></a></div>");
                bd.append(backToTopButton);
                backToTopButton.scrollToTop()
            }
            if (feedbackTypeId && showFeedbackButton) {
                var feedbackButton = '<div class="js-site-feedback-links feedback_links inlineblock receipt_noprint" data-display-type="modal"' + 'data-userclass="feedback_modal" data-style="5" data-feedback-type-id="' + feedbackTypeId + '">' + '<a href="#" class="feedback_question js-site-feedback-link yui3-noclick">' + "Feedback" + '</a><a href="#" title="' + "Close feedback button" + '" class="feedback_btn_close cleanlink_disabled wficonfont js-close-site-feedback-link">&#58953;</a>' + '<div class="hidden-node js-feedback-loading-spinner bgloading"></div></div>';
                $(".js-customer-feedback").append(feedbackButton)
            }
        }
    }

    function syncRecentlyViewed() {
        if (wf.appData && wf.appData.session) {
            if (wf.appData.session.recordingRecentlyViewed && Storage.local.get({
                    key: wf.constants.RECENTLY_VIEWED_PRODUCTS_KEY
                })) {
                syncRecentlyViewedPromise.done(function (syncRecentlyViewed) {
                    syncRecentlyViewed.syncRecentlyViewedProducts()
                }).load()
            }
            if (wf.appData.session.recordingRecentlyViewedClass && Storage.local.get({
                    key: wf.constants.RECENTLY_VIEWED_CLASSES_KEY
                })) {
                syncRecentlyViewedClassesPromise.done(function (syncRecentlyViewed) {
                    syncRecentlyViewed.syncRecentlyViewedClasses()
                }).load()
            }
        }
    }
    Scheduler.queuePostLoadTask(function () {
        initOpenX();
        if (!wf.constants.IN_CHECKOUT && !wf.constants.CAN_ADMIN_LOGON) {
            googleTrustedStore()
        }
        EventDispatch.trigger(TRACKING_EVENT_TYPE, {
            verb: "RECORD_CUSTOMER_REFERRER"
        });
        EventDispatch.trigger(TRACKING_EVENT_TYPE, {
            verb: "RUN_OIQ"
        });
        initStickyButtons();
        if (wf.appData.session.refreshBasket === true && wf.appData.pageAlias !== "Checkout") {
            refreshBasket()
        }
        syncRecentlyViewed()
    });
    EventDispatch.on(wf.constants.eventTypes.CART_UPDATE_EVENT_TYPE, {
        verb: "BASKET_COUNT"
    }, function (event) {
        if (event.data.basketCount) {
            $(".js-basket-count, .js-top-nav-basket-count").text(event.data.basketCount);
            wf.appData.session.basketCount = parseInt(event.data.basketCount, 10)
        }
    });
    if (wf.appData && wf.appData.thirdPartyTags) {
        Scheduler.queuePostLoadTask(function () {
            _.each(wf.appData.thirdPartyTags, function (url) {
                var jsExt = ".js";
                if (url.indexOf(jsExt, url.length - jsExt.length) !== -1) {
                    $.getScript(url)
                } else {
                    var i = new Image;
                    i.src = url
                }
            })
        })
    }
    var header = $(".js-header");
    if (header.length > 0) {
        var showingStickyHeader = false,
            headerHeight = header[0].offsetHeight + header[0].offsetTop;
        wf.$doc.on("scroll", _.throttle(function () {
            var scrollHeight = wf.$doc.scrollTop(),
                showStickyHeader = scrollHeight > headerHeight;
            if (showStickyHeader !== showingStickyHeader) {
                SiteSpect.trackEvent(showStickyHeader ? "sticky_header_opened" : "sticky_header_closed");
                showingStickyHeader = showStickyHeader
            }
        }, 200))
    }
    return exports
});
define("wayfair", ["jquery", "underscore", "configuration", "wf_constants", "event_dispatch"], function ($, _) {
    "use strict";
    var wf = window.wf = window.wf || {};
    var WINDOW_EVENT_THROTTLE_DURATION = 50;
    wf.translate = function (key, defaultText) {
        if (wf.appData.debuglnrs) {
            return key
        }
        return defaultText
    };
    wf.get = function (props, context) {
        var current = context || wf;
        var steps = props.split(".");
        var isSet = true;
        for (var i = 0; i < steps.length; i++) {
            current = current[steps[i]];
            if (current == null) {
                return null
            }
        }
        return current
    };
    var $win = wf.$win = $(window);
    wf.$doc = $(document);
    wf.$body = $("body");
    var $scroll = $("body, html");
    wf.scrollTop = function (position, duration) {
        if (duration) {
            $scroll.animate({
                scrollTop: position
            }, duration)
        } else {
            $scroll.scrollTop(position)
        }
    };
    wf.features = wf.features || {};
    var throttledScroll = _.throttle(function () {
            $win.trigger("wf_scroll", {
                scrollTop: $win.scrollTop()
            })
        }, WINDOW_EVENT_THROTTLE_DURATION),
        throttledResize = _.throttle(function () {
            $win.trigger("wf_resize", {
                width: $win.width(),
                height: $win.height()
            })
        }, WINDOW_EVENT_THROTTLE_DURATION);
    if (window.addEventListener && wf.features.enable_passive_event_listeners) {
        window.addEventListener("scroll", throttledScroll, {
            passive: true
        });
        window.addEventListener("resize", throttledResize, {
            passive: true
        })
    } else {
        $win.on("scroll", throttledScroll);
        $win.on("resize", throttledResize)
    }
    window.wf = wf;
    return window.wf
});
define("browser_utils", ["jquery", "wf_storage"], function ($, storage) {
    "use strict";
    var exports = {},
        cachedBrowserPrefix = null;
    var hexRand4 = function () {
        return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1)
    };
    exports.openPopup = function (e) {
        var ct = $(e.currentTarget);
        var url = ct.data("href") || ct.attr("href");
        var tname = ct.data("title") || ct.attr("title"),
            opt = ct.data("options") || "height=600,width=600,scrollbars=yes";
        var contextWindow = null;
        if (tname) {
            tname.replace(new RegExp(" ", "g"), "")
        }
        if ($.featureDetect.isIE()) {
            tname = ""
        }
        contextWindow = window.open(url, tname, opt);
        if (contextWindow && contextWindow.focus) {
            contextWindow.focus()
        }
        e.preventDefault();
        e.stopPropagation();
        return contextWindow
    };
    var _GUID = function () {
        return hexRand4() + hexRand4() + "-" + hexRand4() + "-" + hexRand4() + "-" + hexRand4() + "-" + hexRand4() + hexRand4() + hexRand4()
    };
    var _setFlashUserCookie = function (user) {
        var spvEmbed = document.getElementById("spvEmbed");
        if (spvEmbed) {
            if (spvEmbed.spv_flash) {
                return spvEmbed.spv_flash(user)
            }
        }
        return user
    };
    var _backupFlashUserCookie = function (user) {
        var spvEmbed = document.getElementById("spvEmbed");
        if (spvEmbed) {
            if (spvEmbed.bk_flash) {
                spvEmbed.bk_flash(user)
            }
        }
    };
    exports.getUser = function () {
        var user = storage.cookie.get({
            key: "CSNUtId"
        });
        if (!user || user === "") {
            user = _GUID();
            user = _setFlashUserCookie(user);
            storage.cookie.set({
                key: "CSNUtId",
                value: user,
                ttl: 365 * 10
            })
        } else {
            _backupFlashUserCookie(user)
        }
        return user
    };

    function getVendorPrefix() {
        if (cachedBrowserPrefix) {
            return cachedBrowserPrefix
        }
        var regex = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/;
        var docScriptTag = document.getElementsByTagName("script")[0];
        for (var prop in docScriptTag.style) {
            if (regex.test(prop)) {
                cachedBrowserPrefix = prop.match(regex)[0]
            }
        }
        if (!cachedBrowserPrefix) {
            if ("WebkitOpacity" in docScriptTag.style) {
                cachedBrowserPrefix = "Webkit"
            } else if ("KhtmlOpacity" in docScriptTag.style) {
                cachedBrowserPrefix = "Khtml"
            }
        }
        return cachedBrowserPrefix
    }

    function getPrefixedStyleName(styleName, userAgent, bypassCache) {
        var prefixedStyleName, prefix = getVendorPrefix(userAgent, bypassCache);
        prefixedStyleName = prefix + styleName.slice(0, 1).toUpperCase() + styleName.slice(1);
        return prefixedStyleName
    }

    function getPrefixedEventName(eventName, userAgent, bypassCache) {
        var prefixedEventName = getPrefixedStyleName(eventName, userAgent, bypassCache);
        prefixedEventName = prefixedEventName.slice(0, 1).toLowerCase() + prefixedEventName.slice(1);
        return prefixedEventName
    }
    exports.applyCSSStyle = function (element, style, value) {
        var prefixedStyleName = getPrefixedStyleName(style);
        if (prefixedStyleName !== false) {
            element.style[prefixedStyleName] = value
        }
    };
    exports.preloadImages = function preloadImages(imageUrls) {
        var numToLoad = imageUrls.length;
        var loaded = 0;
        var deferred = $.Deferred();
        var onload = function () {
            if (++loaded === numToLoad) {
                deferred.resolve()
            }
        };
        for (var i = 0; i < numToLoad; i++) {
            var img = new Image;
            img.src = imageUrls[i];
            img.onload = onload
        }
        return deferred.promise()
    };
    exports.getVendorPrefix = getVendorPrefix;
    exports.getPrefixedStyleName = getPrefixedStyleName;
    exports.getPrefixedEventName = getPrefixedEventName;
    return exports
});
define("visibility", [], function () {
    return function (modules) {
        var installedModules = {};

        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                exports: {},
                id: moduleId,
                loaded: false
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.loaded = true;
            return module.exports
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.p = "";
        return __webpack_require__(0)
    }([function (module, exports, __webpack_require__) {
        __webpack_require__(1);
        module.exports = __webpack_require__(2)
    }, function (module, exports) {
        (function (document) {
            "use strict";
            if (document.visibilityState || document.webkitVisibilityState) {
                return
            }
            document.hidden = false;
            document.visibilityState = "visible";
            var event = null;
            var i = 0;
            var fireEvent = function () {
                if (document.createEvent) {
                    if (!event) {
                        event = document.createEvent("HTMLEvents");
                        event.initEvent("visibilitychange", true, true)
                    }
                    document.dispatchEvent(event)
                } else {
                    if (typeof Visibility == "object") {
                        Visibility._change.call(Visibility, {})
                    }
                }
            };
            var onFocus = function () {
                document.hidden = false;
                document.visibilityState = "visible";
                fireEvent()
            };
            var onBlur = function () {
                document.hidden = true;
                document.visibilityState = "hidden";
                fireEvent()
            };
            if (document.addEventListener) {
                window.addEventListener("focus", onFocus, true);
                window.addEventListener("blur", onBlur, true)
            } else {
                document.attachEvent("onfocusin", onFocus);
                document.attachEvent("onfocusout", onBlur)
            }
        })(document)
    }, function (module, exports, __webpack_require__) {
        module.exports = __webpack_require__(3)
    }, function (module, exports, __webpack_require__) {
        (function (window) {
            "use strict";
            var lastTimer = -1;
            var install = function (Visibility) {
                Visibility.every = function (interval, hiddenInterval, callback) {
                    Visibility._time();
                    if (!callback) {
                        callback = hiddenInterval;
                        hiddenInterval = null
                    }
                    lastTimer += 1;
                    var number = lastTimer;
                    Visibility._timers[number] = {
                        visible: interval,
                        hidden: hiddenInterval,
                        callback: callback
                    };
                    Visibility._run(number, false);
                    if (Visibility.isSupported()) {
                        Visibility._listen()
                    }
                    return number
                };
                Visibility.stop = function (id) {
                    if (!Visibility._timers[id]) {
                        return false
                    }
                    Visibility._stop(id);
                    delete Visibility._timers[id];
                    return true
                };
                Visibility._timers = {};
                Visibility._time = function () {
                    if (Visibility._timed) {
                        return
                    }
                    Visibility._timed = true;
                    Visibility._wasHidden = Visibility.hidden();
                    Visibility.change(function () {
                        Visibility._stopRun();
                        Visibility._wasHidden = Visibility.hidden()
                    })
                };
                Visibility._run = function (id, runNow) {
                    var interval, timer = Visibility._timers[id];
                    if (Visibility.hidden()) {
                        if (null === timer.hidden) {
                            return
                        }
                        interval = timer.hidden
                    } else {
                        interval = timer.visible
                    }
                    var runner = function () {
                        timer.last = new Date;
                        timer.callback.call(window)
                    };
                    if (runNow) {
                        var now = new Date;
                        var last = now - timer.last;
                        if (interval > last) {
                            timer.delay = setTimeout(function () {
                                runner();
                                timer.id = setInterval(runner, interval)
                            }, interval - last)
                        } else {
                            runner();
                            timer.id = setInterval(runner, interval)
                        }
                    } else {
                        timer.id = setInterval(runner, interval)
                    }
                };
                Visibility._stop = function (id) {
                    var timer = Visibility._timers[id];
                    clearInterval(timer.id);
                    clearTimeout(timer.delay);
                    delete timer.id;
                    delete timer.delay
                };
                Visibility._stopRun = function (event) {
                    var isHidden = Visibility.hidden(),
                        wasHidden = Visibility._wasHidden;
                    if (isHidden && !wasHidden || !isHidden && wasHidden) {
                        for (var i in Visibility._timers) {
                            Visibility._stop(i);
                            Visibility._run(i, !isHidden)
                        }
                    }
                };
                return Visibility
            };
            if (typeof module != "undefined" && module.exports) {
                module.exports = install(__webpack_require__(4))
            } else {
                install(window.Visibility)
            }
        })(window)
    }, function (module, exports) {
        (function (global) {
            "use strict";
            var lastId = -1;
            var self = {
                onVisible: function (callback) {
                    var support = self.isSupported();
                    if (!support || !self.hidden()) {
                        callback();
                        return support
                    }
                    var listener = self.change(function (e, state) {
                        if (!self.hidden()) {
                            self.unbind(listener);
                            callback()
                        }
                    });
                    return listener
                },
                change: function (callback) {
                    if (!self.isSupported()) {
                        return false
                    }
                    lastId += 1;
                    var number = lastId;
                    self._callbacks[number] = callback;
                    self._listen();
                    return number
                },
                unbind: function (id) {
                    delete self._callbacks[id]
                },
                afterPrerendering: function (callback) {
                    var support = self.isSupported();
                    var prerender = "prerender";
                    if (!support || prerender != self.state()) {
                        callback();
                        return support
                    }
                    var listener = self.change(function (e, state) {
                        if (prerender != state) {
                            self.unbind(listener);
                            callback()
                        }
                    });
                    return listener
                },
                hidden: function () {
                    return !!(self._doc.hidden || self._doc.webkitHidden)
                },
                state: function () {
                    return self._doc.visibilityState || self._doc.webkitVisibilityState || "visible"
                },
                isSupported: function () {
                    return !!(self._doc.visibilityState || self._doc.webkitVisibilityState)
                },
                _doc: document || {},
                _callbacks: {},
                _change: function (event) {
                    var state = self.state();
                    for (var i in self._callbacks) {
                        self._callbacks[i].call(self._doc, event, state)
                    }
                },
                _listen: function () {
                    if (self._init) {
                        return
                    }
                    var event = "visibilitychange";
                    if (self._doc.webkitVisibilityState) {
                        event = "webkit" + event
                    }
                    var listener = function () {
                        self._change.apply(self, arguments)
                    };
                    if (self._doc.addEventListener) {
                        self._doc.addEventListener(event, listener)
                    } else {
                        self._doc.attachEvent(event, listener)
                    }
                    self._init = true
                }
            };
            if (typeof module != "undefined" && module.exports) {
                module.exports = self
            } else {
                global.Visibility = self
            }
        })(this)
    }])
});
define("scribe", ["underscore", "scribe_event_constants", "scribe_event", "scribe_client", "scribe_stats_tracker", "scribe_heartbeat", "scribe_page_visibility_tracker", "scribe_click_tracker"], function (_, SCRIBE_EVENTS, ScribeEvent, ScribeClient, ScribeStatsTracker, ScribeHeartbeat, ScribePageVisibilityTracker, ScribeClickTracker) {
    function Scribe() {
        this.statsTracker = new ScribeStatsTracker;
        this.client = new ScribeClient(this.statsTracker);
        this.pageVisibilityTracker = new ScribePageVisibilityTracker(this.client);
        this.clickTracker = new ScribeClickTracker(this.client)
    }
    Scribe.prototype.EVENTS = SCRIBE_EVENTS;
    Scribe.prototype.sendEvent = function (eventData) {
        var promise = this.client.sendEvent(eventData);
        return promise
    };
    Scribe.prototype.trackBodyClicks = function () {
        this.clickTracker.trackBodyClicks()
    };
    Scribe.prototype.trackPageViewing = function () {
        var promise = this._setupHeartbeat();
        this.client.sendEvent({
            eventType: SCRIBE_EVENTS.PAGE_VIEW
        });
        return promise
    };
    Scribe.prototype.trackPrerendering = function () {
        this.pageVisibilityTracker.trackPrerendering()
    };
    Scribe.prototype.trackVisibilityChanges = function () {
        this.pageVisibilityTracker.trackVisibilityChanges()
    };
    Scribe.prototype._setupHeartbeat = function () {
        if (this.heartbeat) {
            this.heartbeat.stop()
        }
        this.statsTracker.resetStats();
        this.heartbeat = new ScribeHeartbeat(this.client, this.statsTracker);
        var promise = this.heartbeat.start();
        return promise
    };
    return new Scribe
});
define("dom_utils", ["jquery", "wf_storage"], function ($, Storage) {
    "use strict";
    var exports = {};
    var getOneOpts = function getOneOpts(PiID) {
        var a = "",
            b = "",
            c = "",
            er = true,
            i, l;
        if (PiID) {
            if (PiID.length !== undefined && PiID.options === undefined) {
                l = PiID.length;
                for (i = 0; i < l; i++) {
                    c = "";
                    if (PiID[i].options !== undefined) {
                        if (PiID[i].options[PiID[i].selectedIndex].value !== "XXXXXXXXXX") {
                            er = false;
                            c = PiID[i].options[PiID[i].selectedIndex].value
                        }
                    } else {
                        if (PiID[i].value !== "XXXXXXXXXX") {
                            er = false;
                            c = PiID[i].value
                        }
                    }
                    if (c !== "") {
                        a = a + "&PiID=" + c;
                        if (b !== "") {
                            b = b + ","
                        }
                        b = b + c
                    }
                }
            } else {
                if (PiID.options !== undefined) {
                    if (PiID.options[PiID.selectedIndex].value !== "XXXXXXXXXX") {
                        er = false;
                        c = PiID.options[PiID.selectedIndex].value
                    }
                } else {
                    if (PiID.value !== "XXXXXXXXXX") {
                        er = false;
                        c = PiID.value
                    }
                }
                if (c !== "") {
                    a = a + "&PiID=" + c;
                    if (b !== "") {
                        b = b + ","
                    }
                    b = b + c
                }
            }
        } else {
            er = false
        }
        return [a, er, b]
    };
    exports.GetSelOpts = function (myForm) {
        var a = "",
            b = "",
            MiID = myForm.MiID,
            i, l;
        var AddItem = document.AddItem;
        var rt = getOneOpts(myForm.PiID);
        if (MiID) {
            if (MiID.length !== undefined) {
                l = MiID.length;
                for (i = 0; i < l; i++) {
                    if (MiID[i].checked === true) {
                        a = a + "&PiID=" + AddItem.MiID[i].value;
                        b = b + AddItem.MiID[i].value + ","
                    }
                }
            } else if (MiID.checked === true) {
                a = a + "&PiID=" + AddItem.MiID[i].value;
                b = b + document.AddItem.MiID[i].value + ","
            }
        }
        a = a + rt[0];
        b = b + rt[2];
        return [a, rt[1], b]
    };
    exports.hideBlurText = function (e) {
        var node = $(e.currentTarget);
        var blurText = node.attr("data-blur-text");
        var blurStyle = node.attr("data-blur-style");
        if (e.currentTarget._node != null) {
            node = $(node._node)
        }
        if (node.val() === blurText) {
            node.val("");
            if (blurStyle) {
                node.attr("style", blurStyle)
            }
        }
    };
    exports.showBlurText = function (e) {
        var node = $(e.currentTarget),
            blurText = node.attr("data-blur-text"),
            blurStyle = node.attr("data-blur-style");
        if (e.currentTarget._node != null) {
            node = $(node._node)
        }
        if (node.val() === "") {
            node.val(blurText);
            if (blurStyle) {
                node.attr("style", "")
            }
        }
    };
    var TAGNAMES = {
        select: "input",
        submit: "form",
        reset: "form",
        error: "img",
        load: "img",
        abort: "img"
    };
    exports.isEventSupported = function (eventName, element) {
        element = element || document.createElement(TAGNAMES[eventName] || "div");
        eventName = "on" + eventName;
        var isSupported = eventName in element;
        if (!isSupported) {
            if (!element.setAttribute) {
                element = document.createElement("div")
            }
            if (element.setAttribute && element.removeAttribute) {
                element.setAttribute(eventName, "");
                isSupported = typeof element[eventName] === "function";
                if (typeof element[eventName] !== "undefined") {
                    element[eventName] = undefined
                }
                element.removeAttribute(eventName)
            }
        }
        element = null;
        return isSupported
    };
    exports.disableSubmitOnEnter = function (e) {
        var code = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
        if (code === 13) {
            e.preventDefault()
        }
    };
    exports.setHTMLAttributes = function (selectorArray, srcNode) {
        if (selectorArray) {
            var selLength = selectorArray.length,
                x, currentNode;
            for (x = 0; x < selLength; x++) {
                if (selectorArray[x] && selectorArray[x].attribute && selectorArray[x].selector) {
                    currentNode = $(selectorArray[x].selector, srcNode).first();
                    if (currentNode.length > 0) {
                        if (selectorArray[x].attribute === "selectedIndex") {
                            currentNode.children("option").each(function () {
                                this.selected = selectorArray[x].value === this.value
                            })
                        } else if (selectorArray[x].attribute === "content") {
                            currentNode.html(selectorArray[x].value)
                        } else if (selectorArray[x].attribute.split("-")[0] === "data") {
                            currentNode.data(selectorArray[x].attribute.split("-")[1], selectorArray[x].value)
                        } else {
                            currentNode.prop(selectorArray[x].attribute, selectorArray[x].value)
                        }
                    }
                }
            }
        }
    };
    exports.multiToggle = function (e) {
        var ct = $(e.currentTarget),
            toggleClass = ct.attr("data-class"),
            altText = ct.attr("data-alttext"),
            bPreventDefault = ct.attr("data-prevent-default") || true,
            txt = ct.html(),
            hideClass = "hidden-node",
            nodeList;
        if (toggleClass) {
            nodeList = $("." + toggleClass);
            if (nodeList) {
                nodeList.toggleClass(hideClass);
                if (altText) {
                    ct.html(altText);
                    ct.attr("data-alttext", txt)
                }
            }
        }
        if (bPreventDefault) {
            e.preventDefault()
        }
    };
    exports.initToggle = function initToggle($container) {
        $container.find(".js-toggle-trigger").on("click", function (e) {
            e.preventDefault();
            $container.find(".js-toggle-element").toggleClass("hidden-node")
        })
    };
    exports.toggle = function (e) {
        var ct = $(e.currentTarget);
        var toggleName = ct.data("name");
        var toggleId = ct.data("id");
        var altText = ct.data("alttext");
        var toggleClass = ct.data("toggle-class");
        var hideClass = ct.data("hide-class");
        var bSetCookie = ct.data("set-cookie");
        var bPreventDefault = ct.data("prevent-default");
        var variationId = ct.data("variation-id");
        var toggleId2 = ct.data("toggle-id-2");
        var toggleClass2 = ct.data("toggle-class-2");
        var txt = ct.html();
        var cl2;
        var tog2Class;
        var node;
        if (!hideClass) {
            hideClass = "hidden-node"
        }
        if (toggleName) {
            node = $('[name="' + toggleName + '"]:first')
        } else if (toggleId) {
            node = $("#" + toggleId + ":first")
        }
        if (node) {
            if (e.type === "mouseenter") {
                node.removeClass(hideClass)
            } else if (e.type === "mouseleave") {
                node.addClass(hideClass)
            } else {
                node.toggleClass(hideClass)
            }
            if (bSetCookie) {
                if (node.hasClass(hideClass)) {
                    Storage.cookie.set({
                        key: "CSNBrief",
                        subKey: toggleId,
                        value: "0"
                    });
                    if (variationId) {
                        Storage.cookie.set({
                            key: "CSNBrief",
                            subKey: toggleId + variationId,
                            value: "0"
                        })
                    }
                } else {
                    Storage.cookie.set({
                        key: "CSNBrief",
                        subKey: toggleId,
                        value: "1"
                    });
                    if (variationId) {
                        Storage.cookie.set({
                            key: "CSNBrief",
                            subKey: toggleId + variationId,
                            value: "1"
                        })
                    }
                }
            }
            if (toggleClass) {
                ct.toggleClass(toggleClass)
            }
            if (altText) {
                ct.html(altText);
                ct.data("alttext", txt)
            }
            if (toggleClass2) {
                cl2 = $("#" + toggleId2 + ":first");
                tog2Class = cl2.data("toggle-class");
                cl2.toggleClass(toggleClass2);
                cl2.data("toggleClass2", tog2Class)
            }
        }
        if (bPreventDefault) {
            e.preventDefault()
        }
    };
    var executeFunction = function (functionName, args) {
        var namespaces = functionName.split("."),
            func = namespaces.pop(),
            context = window;
        for (var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
            if (!context) {
                return false
            }
        }
        if (typeof context[func] === "function") {
            context[func].apply(this, args)
        }
        return true
    };
    exports.ajaxToggle = function (node, success) {
        if (node) {
            node = node.jquery ? node : $(node);
            var parentBlock = node.closest(".yui3-toggleblock");
            if (parentBlock) {
                var defaultBlock = parentBlock.find(".yui3-default-block:first");
                var dInterClass = defaultBlock.attr("data-intermediate-class");
                var backupBlock = parentBlock.find(".yui3-backup-block:first");
                var bInterClass = backupBlock.attr("data-intermediate-class");
                var pInterClass = parentBlock.attr("data-intermediate-class");
                if (success) {
                    backupBlock.addClass("hidden-node");
                    parentBlock.removeClass(pInterClass);
                    defaultBlock.removeClass(dInterClass)
                } else {
                    defaultBlock.addClass("hidden-node");
                    if (backupBlock) {
                        var nodeCurrent = backupBlock.children().eq(0),
                            myFunction = backupBlock.attr("data-function"),
                            params = backupBlock.attr("data-params");
                        if (myFunction && myFunction !== "") {
                            var paramArray = [];
                            if (params) {
                                paramArray = params.split(",")
                            }
                            paramArray.push(nodeCurrent);
                            executeFunction(myFunction, paramArray)
                        } else {
                            backupBlock.removeClass(bInterClass);
                            parentBlock.removeClass(pInterClass)
                        }
                    }
                }
            }
        }
    };
    exports.resetAjaxToggle = function (node) {
        if (node) {
            var parentBlock = node.closest(".yui3-toggleblock");
            if (parentBlock) {
                var defaultBlock = parentBlock.find(".yui3-default-block:first");
                var dInterClass = defaultBlock.attr("data-intermediate-class");
                var backupBlock = parentBlock.find(".yui3-backup-block:first");
                var bInterClass = backupBlock.attr("data-intermediate-class");
                var pInterClass = parentBlock.attr("data-intermediate-class");
                defaultBlock.removeClass("hidden-node");
                backupBlock.removeClass("hidden-node");
                defaultBlock.addClass(dInterClass);
                backupBlock.addClass(bInterClass);
                parentBlock.addClass(pInterClass)
            }
        }
    };
    exports.submitPaging = function (e) {
        var node = $(e.target),
            pageForm = node.closest("form");
        if (node.hasClass("yui3-itemsdropdown")) {
            var originalNumber = node.attr("data-default"),
                curpage = node.attr("data-page"),
                newNumber = node.children("option").get(node.prop("selectedIndex")).value;
            Storage.cookie.set({
                key: "CSNBrief",
                subKey: "itemsperpage",
                value: newNumber
            });
            if (newNumber && originalNumber && curpage) {
                var startIndex = originalNumber * (curpage - 1);
                var newPage = parseInt(startIndex / newNumber, 10) + 1;
                var newInput = $('<input type="hidden" name="curpage" value="' + newPage + '">');
                pageForm.append(newInput)
            }
        }
        pageForm.submit()
    };
    exports.onChangeSubmit = function (e) {
        var mySelectBox = $(e.currentTarget),
            mySelectBoxID = mySelectBox.prop("id"),
            myForm = mySelectBox.closest("form");
        $("#" + mySelectBoxID + "-input:first").attr("value", "change");
        myForm.submit()
    };
    exports.setSelectValue = function (eleID, eleValue) {
        var ele = document.getElementById(eleID);
        if (ele !== null) {
            for (var y = ele.options.length; y--;) {
                if (ele.options[y].value === eleValue) {
                    ele.selectedIndex = y;
                    break
                }
            }
        }
    };
    exports.one = function (selector) {
        var el = $(selector);
        window.console.log('DomUtils.one("' + selector + '") >> ' + (el.length > 0));
        if (el.length > 0) {
            return $(el[0])
        }
        return null
    };
    exports.getXY = function (jqElement) {
        var el = $(jqElement);
        var offset = el.offset();
        return [offset.left, offset.top]
    };
    exports.showDiv = function (nodeId) {
        var ele = $("#" + nodeId);
        if (ele.length) {
            ele.removeClass("hidden-node")
        }
    };
    exports.hideDiv = function (nodeId) {
        var ele = $("#" + nodeId);
        if (ele.length) {
            ele.addClass("hidden-node")
        }
    };
    var isParentOf = function (containerEl, elInQuestion) {
        elInQuestion = elInQuestion;
        containerEl = containerEl;
        if (containerEl.length === 0 || elInQuestion.length === 0) {
            return false
        }
        var parents = elInQuestion.parents();
        for (var index = 0; index < parents.length; index++) {
            var parent = parents[index];
            if (containerEl[0] === parent) {
                return true
            }
        }
        return false
    };
    var clickOutsideHandler = function (event) {
        var target = $(event.target);
        var overlay = event.data.overlay;
        var isInOverlay = isParentOf(overlay, target);
        if (!isInOverlay) {
            overlay.trigger("clickoutside")
        }
    };
    exports.addClickOutsideHandler = function (widgetNode, once) {
        widgetNode = widgetNode.jquery ? widgetNode : $(widgetNode);
        $(document.body)[once ? "one" : "on"]("click", {
            overlay: widgetNode
        }, clickOutsideHandler)
    };
    exports.getDataAttr = function (node, attr) {
        node = node.jquery ? node[0] : node;
        return node && node.getAttribute("data-" + attr)
    };
    exports.removeClickOutsideHandler = function (widgetNode) {
        widgetNode = widgetNode.jquery ? widgetNode : $(widgetNode);
        $(document.body).off("click", clickOutsideHandler)
    };
    return exports
});
define("event_dispatch", ["jquery", "underscore", "logger", "wf_event", "configuration"], function ($, _, Logger, Event, Configuration) {
    "use strict";
    var _instance = null;
    var suspended = false;

    function EventDispatch() {
        this.handlers = {}
    }
    EventDispatch.prototype.suspend = function () {
        suspended = true
    };
    EventDispatch.prototype.isSuspended = function () {
        return suspended
    };
    EventDispatch.prototype.resume = function () {
        suspended = false
    };
    EventDispatch.prototype.broadcastEvent = function (eventType, namespace, uid, verb, data, nativeEvent) {
        this.broadcastEventObject(new Event(eventType, {
            namespace: namespace,
            uid: uid,
            verb: verb,
            data: data,
            nativeEvent: nativeEvent
        }))
    };
    EventDispatch.prototype.broadcastEventObject = function (wfEvent) {
        if (suspended) {
            Logger.debug("Broadcast ignored, event dispatcher is suspended");
            return
        } else if (!wfEvent) {
            Logger.debug("Broadcast ignored, event is missing");
            return
        }
        var myUid = !!_.isNull(wfEvent.uid) ? "all" : wfEvent.uid,
            myEventType = wfEvent.eventType || "all",
            myNamespace = wfEvent.namespace || "all",
            myVerb = wfEvent.verb || "all";
        for (var uidKey in this.handlers) {
            if (this.handlers.hasOwnProperty(uidKey)) {
                if (String(myUid) === uidKey || myUid === "all" || uidKey === "all") {
                    this._broadcastEventByUid(myEventType, myNamespace, myVerb, this.handlers[uidKey], wfEvent)
                }
            }
        }
    };
    EventDispatch.prototype._broadcastEventByUid = function (myEventType, myNamespace, myVerb, myHandlersByUid, wfEvent) {
        if (!myHandlersByUid) {
            return
        }
        for (var eventTypeKey in myHandlersByUid) {
            if (myHandlersByUid.hasOwnProperty(eventTypeKey)) {
                if (myEventType === "all" || myEventType === eventTypeKey || eventTypeKey === "all") {
                    this._broadcastEventByEventType(myNamespace, myVerb, myHandlersByUid[eventTypeKey], wfEvent)
                }
            }
        }
    };
    EventDispatch.prototype._broadcastEventByEventType = function (myNamespace, myVerb, myHandlersByEventType, wfEvent) {
        if (!myHandlersByEventType) {
            return
        }
        for (var namespaceKey in myHandlersByEventType) {
            if (myHandlersByEventType.hasOwnProperty(namespaceKey)) {
                if (myNamespace === "all" || myNamespace === namespaceKey || namespaceKey === "all") {
                    this._broadcastEventByNamespace(myVerb, myHandlersByEventType[namespaceKey], wfEvent)
                }
            }
        }
    };
    EventDispatch.prototype._broadcastEventByNamespace = function (myVerb, myHandlersByNamespace, wfEvent) {
        if (!myHandlersByNamespace) {
            return
        }
        for (var verbKey in myHandlersByNamespace) {
            if (myHandlersByNamespace.hasOwnProperty(verbKey)) {
                if (myVerb === "all" || myVerb === verbKey || verbKey === "all") {
                    this._execHandlers(myHandlersByNamespace[verbKey], wfEvent)
                }
            }
        }
    };
    EventDispatch.prototype._execHandlers = function (myHandlers, wfEvent) {
        if (!myHandlers) {
            return
        }
        for (var i = 0; i < myHandlers.length; i++) {
            if (myHandlers[i] && myHandlers[i].enabled) {
                myHandlers[i].fn(wfEvent);
                if (myHandlers[i].once) {
                    myHandlers[i].enabled = false
                }
            }
        }
    };
    EventDispatch.prototype.fireEvent = function (event) {
        if (suspended) {
            return
        }
        if (event === null || event === undefined) {
            Logger.debug("EventDispatch.fireEvent(null) >> Cannot take null as an argument.");
            return
        }
        if (window.wf.constants.IS_AMD_DEBUG_MODE) {
            this.broadcastEventObject(event)
        } else {
            try {
                this.broadcastEventObject(event)
            } catch (err) {
                Logger.debug("EventDispatch.fireEvent(" + event.toString() + ") Error: " + err.message, {
                    error: err
                })
            }
        }
    };
    EventDispatch.prototype.addEventHandler = function (eventType, namespace, uid, verb, handler, once) {
        var handlerObj = {
            fn: handler,
            enabled: true,
            once: once || false
        };
        var myUid = _.isNull(uid) ? "all" : uid,
            myEventType = eventType || "all",
            myNamespace = namespace || "all",
            myVerb = verb || "all";
        if (!this.handlers[myUid]) {
            this.handlers[myUid] = {}
        }
        if (!this.handlers[myUid][myEventType]) {
            this.handlers[myUid][myEventType] = {}
        }
        if (!this.handlers[myUid][myEventType][myNamespace]) {
            this.handlers[myUid][myEventType][myNamespace] = {}
        }
        if (!this.handlers[myUid][myEventType][myNamespace][myVerb]) {
            this.handlers[myUid][myEventType][myNamespace][myVerb] = [handlerObj]
        } else {
            this.handlers[myUid][myEventType][myNamespace][myVerb].push(handlerObj)
        }
        return handlerObj
    };
    EventDispatch.prototype.addEventHandlerOnce = function (eventType, namespace, uid, verb, handler) {
        this.addEventHandler(eventType, namespace, uid, verb, handler, true)
    };
    EventDispatch.prototype.removeEventHandler = function (eventType, namespace, uid, verb, handler) {
        var myUid = !!_.isNull(uid) ? "all" : uid,
            myEventType = eventType || "all",
            myNamespace = namespace || "all",
            myVerb = verb || "all";
        if (this.handlers[myUid] && this.handlers[myUid][myEventType] && this.handlers[myUid][myEventType][myNamespace] && this.handlers[myUid][myEventType][myNamespace][myVerb]) {
            var myHandlers = this.handlers[myUid][myEventType][myNamespace][myVerb];
            if (handler.fn === undefined) {
                for (var i = 0, l = myHandlers.length; i < l; i++) {
                    if (myHandlers[i].fn === handler) {
                        this.handlers[myUid][myEventType][myNamespace][myVerb][i] = false
                    } else {
                        Logger.debug("EventDispatch: " + "not matched")
                    }
                }
            } else {
                var index = -1;
                var handlersLen = myHandlers.length;
                for (index = 0; index < handlersLen; index++) {
                    if (myHandlers[index] === handler) {
                        this.handlers[myUid][myEventType][myNamespace][myVerb][index] = false
                    }
                }
            }
            if (this.handlers[myUid][myEventType][myNamespace][myVerb].length < 2) {
                delete this.handlers[myUid][myEventType][myNamespace][myVerb]
            }
        }
    };
    EventDispatch.prototype.reset = function () {
        this.handlers = {};
        this.suspended = false
    };
    if (_instance === null) {
        _instance = new EventDispatch
    }

    function _mergeOptions(options) {
        return $.extend(true, {
            verb: null,
            namespace: null,
            uid: null,
            data: {},
            nativeEvent: null
        }, options)
    }

    function _on(eventType, options, cb) {
        options = _mergeOptions(options);
        _instance.addEventHandler(eventType, options.namespace, options.uid, options.verb, cb, false)
    }

    function _one(eventType, options, cb) {
        options = _mergeOptions(options);
        _instance.addEventHandlerOnce(eventType, options.namespace, options.uid, options.verb, cb)
    }

    function _off(eventType, options, cb) {
        options = _mergeOptions(options);
        _instance.removeEventHandler(eventType, options.namespace, options.uid, options.verb, cb)
    }

    function _trigger(eventType, options) {
        if (typeof eventType === "undefined") {
            return
        }
        options = _mergeOptions(options);
        var triggerEvent = new Event(eventType, options);
        _instance.fireEvent(triggerEvent)
    }

    function _getTrigger(eventType, verb, defaults) {
        defaults = defaults || {};
        return function (data) {
            _trigger(eventType, {
                verb: verb,
                data: $.extend(true, {}, defaults, data)
            })
        }
    }
    var eventDispatchTestApi = Configuration.namespace("testApi.event_dispatch");
    eventDispatchTestApi.EventDispatch = EventDispatch;
    return {
        on: _on,
        one: _one,
        off: _off,
        trigger: _trigger,
        getTrigger: _getTrigger
    }
});
define("page_visibility", ["wayfair", "underscore", "wf_events"], function (wf, _, eventBus) {
    "use strict";
    var visibilityEventBus = _.extend(eventBus, {});
    var stateCounts = {},
        previousVisibilityState;
    if (typeof document.visibilityState === "undefined" || typeof document.hidden === "undefined") {
        return
    }

    function handleVisibilityChange() {
        if (typeof stateCounts[document.visibilityState] === "number") {
            stateCounts[document.visibilityState]++
        } else {
            stateCounts[document.visibilityState] = 1
        }
        if (previousVisibilityState) {
            visibilityEventBus.trigger("change", {
                state: document.visibilityState,
                lastState: previousVisibilityState,
                counts: stateCounts
            })
        }
        previousVisibilityState = document.visibilityState
    }
    handleVisibilityChange();
    wf.$doc.on("visibilitychange", handleVisibilityChange);
    return {
        bus: visibilityEventBus,
        counts: stateCounts,
        state: document.visibilityState
    }
});
define("openx", ["jquery", "wayfair", "underscore", "event_dispatch", "featuredetect", "tracking", "beacon_fire_tracker", "wf_pixel_base"], function ($, wf, _, EventDispatch, featureDetect, tracking, beaconFireTracker) {
    "use strict";
    var openX = true;
    var fireBeaconOnViewList = [];
    var blockedPageAliases = ["AccountLogin", "CheckoutLogin", "InternalFeatures"];
    if (wf.tracking && wf.tracking.openx && !wf.constants.IS_BOT && _.indexOf(blockedPageAliases, wf.appData.pageAlias) < 0) {
        var openXAdBlocks = {};
        var bannerRotationSet = false,
            bannerRotationCount = 0,
            bannnerRotationThreshold = 0,
            bannerIntervalFlag = false;
        openX = {
            loadedOXBlocks: false,
            loadOpenX: function () {
                if (!this.loadedOXBlocks) {
                    var openXVars = wf.tracking.openx;
                    if (encodeURIComponent(openXVars.cu_bin_id) === 0) {
                        openX.set_customer_bin_preferences()
                    } else {
                        var binId = encodeURIComponent(openXVars.cu_bin_id);
                        openX.load_openx(binId)
                    }
                }
            },
            set_customer_bin_preferences: function () {
                var src = "/session/public/ajax/openx/customer_bin_preferences.php?bpss=yes";
                $.ajax({
                    type: "GET",
                    dataType: "text",
                    url: src,
                    success: function (data) {
                        openX.load_openx(data)
                    }
                })
            },
            load_openx: function (binId) {
                var widgets = $(".js-openx-tracker"),
                    widgetsToTrack = "",
                    widgetObjectCount = 0;
                if (widgets.length > 0) {
                    $.each(widgets, function () {
                        var tracker = $(this);
                        widgetObjectCount += tracker.data("openx-tracker-count");
                        widgetsToTrack += tracker.data("openx-tracker") + ","
                    });
                    openX.add_ad_zone(31, widgetObjectCount);
                    widgetsToTrack = widgetsToTrack.substring(0, widgetsToTrack.length - 1)
                }
                var pageType = encodeURIComponent(wf.constants.PAGE_TYPE);
                if (pageType === "ProductOptionSku" || pageType === "ProductSimpleSku" || pageType === "ProductKit") {
                    var blockHeight = pageType === "ProductKit" ? $(".js-faq-section-wrap").height() : $("#reviewcontainer").height();
                    if (blockHeight > 1150) {
                        $("#openx_zone_1_sctext").remove();
                        $("#openx_zone_1").remove()
                    } else {
                        $("#openx_zone_38_sctext").remove();
                        $("#openx_zone_38").remove()
                    }
                }
                var currentElement = wf.$body.find(".js-current");
                var localizedBody = currentElement.length ? currentElement : wf.$body;
                var openXBlocks = localizedBody.find(".js-openx-block"),
                    openXVars = wf.tracking.openx,
                    soId = encodeURIComponent(openXVars.so_id),
                    countryId = encodeURIComponent(openXVars.country),
                    region = encodeURIComponent(openXVars.region),
                    msa = encodeURIComponent(openXVars.msa),
                    maId = encodeURIComponent(openXVars.ma_id),
                    catId = encodeURIComponent(openXVars.ca_id),
                    edn = encodeURIComponent(openXVars.edn),
                    lowPrice = encodeURIComponent(openXVars.low_price),
                    highPrice = encodeURIComponent(openXVars.high_price),
                    cuSeg = encodeURIComponent(openXVars.cu_seg),
                    site = encodeURIComponent(openXVars.site),
                    autotest = encodeURIComponent(openXVars.autotest),
                    avgReviewRating = encodeURIComponent(openXVars.avg_review_rating),
                    reviewRelevancy = encodeURIComponent(openXVars.review_relevancy),
                    catSeg = encodeURIComponent(openXVars.cat_seg),
                    pageId = encodeURIComponent(openXVars.page_id),
                    classId = encodeURIComponent(openXVars.cl_id),
                    adId = encodeURIComponent(openXVars.ad_id),
                    b2bIsActive = encodeURIComponent(openXVars.b2b_is_active),
                    b2bFunnel = encodeURIComponent(openXVars.b2b_funnel),
                    b2bIndustry = encodeURIComponent(openXVars.b2b_industry),
                    b2bCreationStore = encodeURIComponent(openXVars.b2b_creation_store),
                    b2bCreationMethod = encodeURIComponent(openXVars.b2b_creation_method),
                    b2bAccountTier = encodeURIComponent(openXVars.b2b_account_spend_tier),
                    b2bStatusLastUpdated = encodeURIComponent(openXVars.b2b_status_last_updated),
                    b2bApplicationSubmitted = encodeURIComponent(openXVars.b2b_application_submitted),
                    breadcrumb = encodeURIComponent(openXVars.breadcrumb),
                    hideRails = encodeURIComponent(openXVars.hide_rails),
                    sku = encodeURIComponent(openXVars.sku),
                    skuSeg = encodeURIComponent(openXVars.sku_seg),
                    loopCounter = 0,
                    adZones = "",
                    openxLinkIDs = "",
                    cmsBlocks = $(".cmscell_override"),
                    dt = featureDetect.isPhone() ? 2 : 1,
                    src = "",
                    dataZone = "",
                    showIdeasHomeSideBar = 0,
                    isIdeasZone = false,
                    pageLength = document.body.offsetHeight,
                    isIE = featureDetect.isIE(),
                    eventID = 0,
                    jmPageEvents = $(".js-jm-event-track"),
                    eventsString = "|",
                    ssVariation = encodeURIComponent(openXVars.ss_variation),
                    adTags = openX.getKeywordTags(),
                    articleId = openX.getArticleId();
                if (openXBlocks.length < 1) {
                    openX.loadedOXBlocks = true;
                    return
                }
                if (pageType === "ContentIdeasAdvice") {
                    var leftColumnHeight = $(".left_content").height(),
                        sideBarHeight = $(".sidebar_content").height();
                    if (leftColumnHeight - sideBarHeight > 620) {
                        showIdeasHomeSideBar = 1
                    }
                }
                while (loopCounter < openXBlocks.length) {
                    dataZone = $(openXBlocks[loopCounter]).attr("data-zone");
                    isIdeasZone = dataZone === "41";
                    if (loopCounter > 0) {
                        if (showIdeasHomeSideBar === 0 && (isIdeasZone || adZones.length === 0)) {
                            adZones += "";
                            $("#openx_zone_41").remove();
                            $("#openx_zone_41_sctext").remove()
                        } else {
                            adZones += "|"
                        }
                    }
                    if (showIdeasHomeSideBar === 0 && isIdeasZone) {
                        adZones += ""
                    } else {
                        adZones += encodeURIComponent(dataZone)
                    }
                    loopCounter++
                }
                loopCounter = 0;
                while (loopCounter < cmsBlocks.length) {
                    if (loopCounter > 0) {
                        openxLinkIDs += ","
                    }
                    openxLinkIDs += $(cmsBlocks[loopCounter]).attr("data-openx-link-id");
                    loopCounter++
                }
                src = "/a/media/display_ad_content/show?bpss=yes";
                if (featureDetect.isTablet()) {
                    dt = 3
                } else if (featureDetect.isMobile()) {
                    dt = 2
                }
                if (wf.appData.eventID) {
                    eventID = wf.appData.eventID
                }
                loopCounter = 0;
                while (loopCounter < jmPageEvents.length) {
                    eventsString += $(jmPageEvents[loopCounter]).data("event-id") + "|";
                    loopCounter++
                }
                if (adZones !== "undefined" && adZones != null) {
                    $.ajax({
                        type: "POST",
                        dataType: "script",
                        url: src,
                        data: {
                            ad_zones: adZones,
                            category_id: catId,
                            so_id: soId,
                            country_id: countryId,
                            region: region,
                            msa: msa,
                            ma_id: maId,
                            openx_link_id: openxLinkIDs,
                            page_type: pageType,
                            edn: edn,
                            low_price: lowPrice,
                            high_price: highPrice,
                            dt: dt,
                            cu_seg: cuSeg,
                            site: site,
                            widgets_to_track: widgetsToTrack,
                            bin_id: binId,
                            autotest: autotest,
                            avg_review_rating: avgReviewRating,
                            review_relevancy: reviewRelevancy,
                            page_length: pageLength,
                            cat_seg: catSeg,
                            page_id: pageId,
                            cl_id: classId,
                            ad_id: adId,
                            is_ie: isIE,
                            event_id: eventID,
                            breadcrumb: breadcrumb,
                            hide_rails: hideRails,
                            b2b_is_active: b2bIsActive,
                            b2b_industry: b2bIndustry,
                            b2b_funnel: b2bFunnel,
                            sku: sku,
                            sku_seg: skuSeg,
                            b2b_creation_store: b2bCreationStore,
                            b2b_creation_method: b2bCreationMethod,
                            b2b_account_spend_tier: b2bAccountTier,
                            b2b_status_last_updated: b2bStatusLastUpdated,
                            b2b_application_submitted: b2bApplicationSubmitted,
                            events_string: eventsString,
                            page_url: encodeURIComponent(window.location.href),
                            page_width: encodeURIComponent($(window).width()),
                            ss_variation: ssVariation,
                            ad_tags: encodeURIComponent(adTags),
                            article_id: encodeURIComponent(articleId)
                        },
                        success: function (data) {
                            if (data && adZones) {
                                openX.fill_ad_slots(data, adZones);
                                beaconFireTracker.populateBeaconList(fireBeaconOnViewList)
                            }
                            openX.loadedOXBlocks = true
                        }
                    })
                }
            },
            add_ad_zone: function (zoneId, zoneCount, zoneTarget) {
                var adZoneHTML = "";
                if (zoneCount > 1) {
                    for (var i = zoneCount - 1; i >= 0; i--) {
                        adZoneHTML += '<div id="openx_zone_' + zoneId + "_" + i + '" ' + 'data-zone="' + zoneId + "_" + i + '" class="js-openx-block openx_block" />'
                    }
                } else {
                    adZoneHTML += '<div id="openx_zone_' + zoneId + '" ' + 'data-zone="' + zoneId + '" class="js-openx-block openx_block" />'
                }
                var $adZone = $(adZoneHTML);
                if (zoneTarget) {
                    $adZone.appendTo("#" + (zoneTarget || "open_x_core"))
                }
                $adZone.find("div").each(function (i, el) {
                    openXAdBlocks[el.id] = $(el)
                })
            },
            generate_additional_page_ads: function (openXBlocks, adTargetingAttributes, useSuffix) {
                var openXVars = wf.tracking.openx,
                    pageType = encodeURIComponent(wf.constants.PAGE_TYPE),
                    soId = encodeURIComponent(openXVars.so_id),
                    countryId = encodeURIComponent(openXVars.country),
                    region = encodeURIComponent(openXVars.region),
                    msa = encodeURIComponent(openXVars.msa),
                    loopCounter = 0,
                    adZones = "",
                    targetingAttributesQueryString = "",
                    src = "";
                while (loopCounter < openXBlocks.length) {
                    if (loopCounter > 0) {
                        adZones += "|"
                    }
                    var zoneId = openXBlocks[loopCounter];
                    var zoneString = useSuffix ? "#openx_zone_" + zoneId + "_" + loopCounter : "#openx_zone_" + zoneId;
                    openXBlocks[loopCounter] = $("#openx_zone_" + openXBlocks[loopCounter]);
                    var adZoneElement = openXAdBlocks[zoneString] || $(openXBlocks[loopCounter]);
                    var adZoneContent = adZoneElement.attr("data-zone");
                    if (!adZoneContent) {
                        openX.add_ad_zone(zoneId, 1)
                    }
                    adZones += $(zoneString).attr("data-zone");
                    loopCounter++
                }
                $.each(adTargetingAttributes, function (key, value) {
                    targetingAttributesQueryString += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(value)
                });
                src = "/a/media/display_ad_content/show?bpss=yes&ad_zones=" + encodeURIComponent(adZones) + "&so_id=" + soId;
                src += "&country_id=" + countryId + "&region=" + region + "&msa=" + msa + "&page_type=" + pageType;
                src += targetingAttributesQueryString;
                if (adZones !== "undefined" && adZones != null) {
                    $.ajax({
                        type: "GET",
                        dataType: "script",
                        url: src,
                        success: function (data) {
                            if (data && adZones) {
                                openX.fill_ad_slots(data, adZones);
                                if (bannerRotationCount === bannnerRotationThreshold - 2) {
                                    clearInterval(bannerIntervalFlag);
                                    bannerIntervalFlag = 0;
                                    bannerRotationCount = 0
                                } else if (bannerRotationSet) {
                                    bannerRotationCount++
                                }
                            }
                        }
                    })
                }
            },
            init_delayed_openx_ad_call: function (eventType, action, zoneID, $contentBlock, zoneContainer) {
                EventDispatch.on(eventType, {
                    verb: action
                }, function () {
                    if (zoneContainer.length) {
                        openX.add_ad_zone(zoneID, 1, zoneContainer)
                    }
                    $contentBlock.html(openX.generate_additional_page_ads([zoneID], [], false));
                    EventDispatch.off(eventType)
                })
            },
            fill_ad_slots: function (data, adZones) {
                var slots = adZones.split("|");
                for (var i = 0; i < slots.length; i++) {
                    if ($("#openx_zone_" + slots[i])) {
                        _fillAdSlotsHelper(slots, i)
                    }
                }
            },
            getKeywordTags: function () {
                var adTags = "";
                if ($(".js-keyword-tags").length > 0) {
                    adTags = $(".js-keyword-tags").map(function () {
                        return $(this).text()
                    }).get().join(",")
                }
                return adTags
            },
            getArticleId: function () {
                var articleId;
                var url = document.URL;
                if (url.substring(url.length - 4, url.length) === "html") {
                    articleId = url.match(/-S(.*).html/)
                }
                return articleId ? articleId[1].length === 4 ? articleId[1] : "" : ""
            }
        };
        var addTargetClassToThumbnail = function (adHtml, zoneId) {
            if (_.contains(["104", "105", "106", "110", "111", "112"], zoneId) && adHtml.slice(1, 2) === "a") {
                adHtml = [adHtml.slice(0, 2), ' class="media_active_target" ', adHtml.slice(2)].join("")
            }
            return adHtml
        };
        var _fillAdSlotsHelper = function (slots, s) {
            setTimeout(function () {
                var zoneId = slots[s],
                    ad = $("#openx_zone_" + zoneId),
                    bannerid = "",
                    $beaconList = $(),
                    adHtml = window.OA_output["openx_zone_" + zoneId],
                    clickthroughURL = adHtml.split("oadest");
                if (adHtml) {
                    if (zoneId === "35" || zoneId === "47" || zoneId === "48") {
                        var siderails = $("#openx_zone_" + zoneId);
                        siderails.detach().prependTo("#doc3")
                    }
                    bannerid = adHtml.split("bannerid=");
                    bannerid = bannerid[1].split("_");
                    bannerid = bannerid[0].split("&");
                    bannerid = bannerid[0];
                    ad.data("banner-id", bannerid);
                    if (adHtml.indexOf("code%3Dwf_session_id") >= 0) {
                        adHtml = adHtml.replace("code%3Dwf_session_id", "code=" + encodeURIComponent(wf.appData.session.csnID.substr(wf.appData.session.csnID.length - 5)))
                    }
                    if (ad.data("delay-pixel")) {
                        adHtml = adHtml.replace(/ src=/gi, " data-src=");
                        adHtml = addTargetClassToThumbnail(adHtml, zoneId);
                        var adNode = $(adHtml).wrapAll("<div>").parent();
                        $beaconList = $("[id^=beacon_]", adNode).remove();
                        adNode.find("[data-src]").attr("src", function () {
                            return $(this).data("src")
                        });
                        ad.html(adNode.html())
                    } else if (adHtml.indexOf("js-delay-beacon-fire") >= 0) {
                        adHtml = adHtml.replace(/ src=/gi, " data-src=");
                        var delayedAdNode = $(adHtml).wrapAll("<div>").parent();
                        fireBeaconOnViewList[zoneId] = $("[id^=beacon_]", delayedAdNode).remove();
                        delayedAdNode.find("[data-src]").attr("src", function () {
                            return $(this).data("src")
                        });
                        ad.html(delayedAdNode.html());
                        beaconFireTracker.registerElement(ad)
                    } else {
                        adHtml = addTargetClassToThumbnail(adHtml, zoneId);
                        ad.html(adHtml)
                    }
                    if (ad[0]) {
                        $.data(ad[0], "visibility-threshold-ms", 1e3);
                        $.data(ad[0], "visibility-callback", wf.constants.STORE_URL + "/ajax/track_open_x_ad_visibility.php?bpss=yes&page_type=" + wf.constants.PAGE_TYPE + "&ad_id=" + bannerid + "&ad_timer=")
                    }
                    ad.find("a").attr("rel", "nofollow");
                    if (window.OA_output["openx_zone_" + zoneId].indexOf("pubiframe") >= 0) {
                        ad.find("iframe").on("load", function () {
                            var q = $(this).contents(),
                                c = q.find("img");
                            if (c.attr("src") === "http://common.csnimages.com/mediax/ce21cbdd9b894e6af794813eb3fdaf60.png") {
                                ad.addClass("hidden-node");
                                var advertisementText = $("#" + $("#openx_zone_" + zoneId).attr("id") + "_sctext");
                                var feedbackLink = advertisementText.find(".js-site-feedback-link");
                                feedbackLink.data("adv-id", bannerid);
                                advertisementText.addClass("hidden-node")
                            }
                        });
                        ad.removeClass("hidden-node")
                    } else {
                        ad.removeClass("hidden-node")
                    }
                    if (ad.html() !== "" && ad[0] && !$(ad[0].firstChild).hasClass("wf_content")) {
                        var advertisementText = $("#" + ad.attr("id") + "_sctext");
                        var feedbackLink = advertisementText.find(".js-site-feedback-link");
                        feedbackLink.data("adv-id", bannerid);
                        advertisementText.removeClass("hidden-node")
                    }
                    var bannerTag = $(ad[0]).find(".rotating_banner");
                    if (!bannerRotationSet && ad.html() !== "" && ad[0] && bannerTag.length === 1) {
                        bannerTag = $(bannerTag);
                        bannerRotationSet = true;
                        bannnerRotationThreshold = bannerTag.data("threshold");
                        bannerIntervalFlag = setInterval(function () {
                            openX.generate_additional_page_ads([zoneId], "")
                        }, bannerTag.data("interval") * 1e3)
                    } else if (bannerRotationSet && bannerIntervalFlag === 0) {
                        bannerRotationSet = false
                    }
                    if (ad.html() !== "") {
                        EventDispatch.trigger(wf.constants.eventTypes.OPENX_EVENT_TYPE, {
                            verb: "AD_AVAILABLE",
                            data: {
                                zone: parseInt(zoneId, 10),
                                ad: ad,
                                beaconList: $beaconList
                            }
                        })
                    }
                    if (bannerid !== "" && bannerid !== "1510") {
                        ad.click(function () {
                            tracking.spvTwo(false, false, "Event=1;EventType=OSMAdClick;osm_banner=" + encodeURIComponent(bannerid) + ";osm_zone=" + zoneId + ";")
                        })
                    }
                } else if (zoneId === "77") {
                    $(".js-block-outline").css("outline-width", "0px")
                } else {
                    ad.removeClass("track_visibility")
                }
                if (_.contains(["90", "60", "94", "104", "105", "110", "111", "112"], zoneId)) {
                    var params = {};
                    params.ad_id = bannerid;
                    switch (zoneId) {
                    case "104":
                        openX.generate_additional_page_ads([34], params, false);
                        break;
                    case "105":
                        openX.generate_additional_page_ads([46], params, false);
                        break;
                    case "90":
                        openX.generate_additional_page_ads([106], params, false);
                        break;
                    case "60":
                        openX.generate_additional_page_ads([61, 62, 63], params, false);
                        break;
                    case "94":
                        openX.generate_additional_page_ads([95, 96], params, false);
                        break;
                    case "110":
                        openX.generate_additional_page_ads([107], params, false);
                        break;
                    case "111":
                        openX.generate_additional_page_ads([108], params, false);
                        break;
                    case "112":
                        openX.generate_additional_page_ads([109], params, false);
                        break
                    }
                }
            }, 1)
        }
    }
    return openX
});
define("url_utils", ["jquery", "underscore", "wayfair"], function ($, _, wf) {
    "use strict";
    var exports = {};
    exports.topLevelDomain = function () {
        return wf.constants.COOKIE_DOMAIN
    };
    exports.extractParamFromUri = function (uri, paramName, leaveParamEncoded) {
        var parts, query, param, params, i;
        if (!uri) {
            return
        }
        uri = uri.split("#")[0];
        parts = uri.split("?");
        if (parts.length === 1) {
            return
        }
        query = decodeURI(parts[1]);
        paramName += "=";
        params = query.split("&");
        for (i = 0; i < params.length; ++i) {
            param = params[i];
            if (param.indexOf(paramName) === 0) {
                return !leaveParamEncoded ? decodeURIComponent(param.split("=")[1]) : param.split("=")[1]
            }
        }
    };
    exports.extractUrlHash = function (url) {
        var urlParts = [];
        if (url) {
            urlParts = url.split("#")
        }
        return urlParts
    };
    exports.getImageObjectFromUrl = function (imageUrl) {
        var imageDataObject = {
            imageResourceId: "",
            imageResourceMaID: "",
            imageResourceName: "",
            imageResourceRuleSize: ""
        };
        if (typeof imageUrl === "string") {
            var explodedImageData = imageUrl.split("/");
            imageDataObject.imageResourceId = explodedImageData[7];
            imageDataObject.imageResourceMaID = explodedImageData[6];
            imageDataObject.imageResourceName = explodedImageData[9];
            imageDataObject.imageResourceRuleSize = explodedImageData[4]
        }
        return imageDataObject
    };
    exports.getUrlWithImageRule = function (imageUrl, imageRuleId) {
        if (typeof imageRuleId !== "number" || typeof imageUrl !== "string") {
            return false
        }
        var offset, urlExploded = imageUrl.split("/");
        var httpRegex = /^(http:\/\/|https:\/\/)/;
        if (httpRegex.test(imageUrl)) {
            offset = 0
        } else {
            offset = 2
        }
        urlExploded[4 - offset] = imageRuleId;
        return urlExploded.join("/")
    };
    exports.inputsToQueryString = function (formNode) {
        var s = _.reduce(formNode.find("input[name],select[name],textarea[name]"), function (init, el) {
            if (init[el.name]) {
                if (!(init[el.name] instanceof Array)) {
                    init[el.name] = [el.value, init[el.name]]
                } else {
                    init[el.name].push(el.value)
                }
            } else {
                init[el.name] = el.value
            }
            return init
        }, {});
        return $.param(s)
    };
    exports.appendImageQueryString = function (anchorTag, imageDataObject) {
        var baseUrl = anchorTag.attr("href").split("?")[0],
            existingParams = anchorTag.attr("href").split("?")[1],
            querystring = existingParams ? "?" + existingParams : "",
            operator = existingParams ? "&" : "?";
        anchorTag.attr("href", baseUrl + querystring + operator + "id=" + imageDataObject.imageResourceId + "&ma=" + imageDataObject.imageResourceMaID + "&name=" + imageDataObject.imageResourceName)
    };
    exports.redirectToLogin = function (url, email) {
        var loginUrl = wf.constants.STORE_URL + "/session/secure/account/login.php?url=" + (url ? url : window.location.href);
        if (email && email.length > 0) {
            loginUrl = loginUrl + "&login_email=" + encodeURIComponent(email)
        }
        window.location = loginUrl
    };
    exports.isStoreUrlSecure = function () {
        return wf.constants.STORE_URL.substr(0, 5) === "https"
    };
    exports.updateQueryParam = function (url, key, value) {
        var urlParts = url.split("?"),
            queryString = urlParts[1],
            queryStringParts;
        if (queryString) {
            queryStringParts = queryString.split("#");
            queryString = queryStringParts[0]
        } else {
            queryString = ""
        }
        var regex = new RegExp("(^|&)" + key + "=[^&]*");
        if (!regex.test(queryString)) {
            var toAdd = key + "=" + value;
            queryString += queryString.length > 0 ? "&" + toAdd : toAdd
        } else {
            queryString = queryString.replace(regex, "$1" + key + "=" + value)
        }
        var newURL = urlParts[0] + "?" + queryString;
        if (queryStringParts && queryStringParts.length > 1) {
            newURL += "#" + queryStringParts[1]
        }
        return newURL
    };
    exports.removeQueryParam = function (url, key) {
        var urlParts = url.split("?"),
            queryString = urlParts[1],
            regex = new RegExp("(^|&)" + key + "=[^&]*(&?)");
        var matches = regex.exec(queryString);
        var replaceWith = "";
        if (matches) {
            if (matches[1] === "&" && matches[2] === "&") {
                replaceWith = "&"
            }
            return urlParts[0] + "?" + queryString.replace(regex, replaceWith)
        } else {
            return url
        }
    };
    var percentEncodedRegex = /(%[a-fA-F0-9]{2})/g;
    var w2512Map = {
        0: "€",
        1: "",
        2: "‚",
        3: "ƒ",
        4: "„",
        5: "…",
        6: "†",
        7: "‡",
        8: "ˆ",
        9: "‰",
        10: "Š",
        11: "‹",
        12: "Œ",
        13: "",
        14: "Ž",
        15: "",
        16: "",
        17: "‘",
        18: "’",
        19: "“",
        20: "”",
        21: "•",
        22: "–",
        23: "—",
        24: "˜",
        25: "™",
        26: "š",
        27: "›",
        28: "œ",
        29: "",
        30: "ž",
        31: "Ÿ",
        32: " ",
        33: "¡",
        34: "¢",
        35: "£",
        36: "¤",
        37: "¥",
        38: "¦",
        39: "§",
        40: "¨",
        41: "©",
        42: "ª",
        43: "«",
        44: "¬",
        45: "­",
        46: "®",
        47: "¯",
        48: "°",
        49: "±",
        50: "²",
        51: "³",
        52: "´",
        53: "µ",
        54: "¶",
        55: "·",
        56: "¸",
        57: "¹",
        58: "º",
        59: "»",
        60: "¼",
        61: "½",
        62: "¾",
        63: "¿",
        64: "À",
        65: "Á",
        66: "Â",
        67: "Ã",
        68: "Ä",
        69: "Å",
        70: "Æ",
        71: "Ç",
        72: "È",
        73: "É",
        74: "Ê",
        75: "Ë",
        76: "Ì",
        77: "Í",
        78: "Î",
        79: "Ï",
        80: "Ð",
        81: "Ñ",
        82: "Ò",
        83: "Ó",
        84: "Ô",
        85: "Õ",
        86: "Ö",
        87: "×",
        88: "Ø",
        89: "Ù",
        90: "Ú",
        91: "Û",
        92: "Ü",
        93: "Ý",
        94: "Þ",
        95: "ß",
        96: "à",
        97: "á",
        98: "â",
        99: "ã",
        100: "ä",
        101: "å",
        102: "æ",
        103: "ç",
        104: "è",
        105: "é",
        106: "ê",
        107: "ë",
        108: "ì",
        109: "í",
        110: "î",
        111: "ï",
        112: "ð",
        113: "ñ",
        114: "ò",
        115: "ó",
        116: "ô",
        117: "õ",
        118: "ö",
        119: "÷",
        120: "ø",
        121: "ù",
        122: "ú",
        123: "û",
        124: "ü",
        125: "ý",
        126: "þ",
        127: "ÿ"
    };
    exports.decodeUri = function (url) {
        var decodedUrl;
        try {
            decodedUrl = decodeURI(url)
        } catch (e) {
            var utf8Url = url.replace(percentEncodedRegex, function filter(match, group) {
                var index = parseInt(group.substr(1), 16) - 128;
                var character = w2512Map[index];
                return character ? encodeURIComponent(character) : match
            });
            decodedUrl = decodeURI(utf8Url)
        }
        return decodedUrl
    };
    return exports
});
define("wf_dropdown_headers", ["wayfair", "jquery", "underscore", "sitespect", "event_dispatch", "wf_intent_events", "lazy!categories_dropdown_loader", "tracking", "wf_scheduler", "featuredetect", "wf_pointerevents", "wf_handle_touch"], function (wf, $, _, SiteSpect, EventDispatch, intentHandlerFactory, categoriesDropdownLoaderPromise, Tracker, Scheduler, featureDetect, pointerEvents, TouchHandler) {
    "use strict";
    var exports = {};
    categoriesDropdownLoaderPromise.done(function (categoriesDropdownLoaderModule) {
        categoriesDropdownLoaderModule.resolveCategoriesDropdowns()
    });
    if (wf.constants.ALLMODERN_ID === wf.constants.STORE_ID || wf.constants.DWELL_ID === wf.constants.STORE_ID) {
        categoriesDropdownLoaderPromise.load()
    }
    var topnavs = $(".topnav");
    if (SiteSpect.sitespectCookieContains("5562032v2a") || SiteSpect.sitespectCookieContains("5562032v2b") || SiteSpect.sitespectCookieContains("5562032v1a") || SiteSpect.sitespectCookieContains("5562032v1b") || SiteSpect.sitespectCookieContains("5562032v1c")) {
        topnavs.splice(topnavs.length - 1, 1)
    }
    var navBar = $("#primaryheader");
    var navWrapper = navBar.parent();
    var barHover = false;
    var INTENT_DELAY = 300;
    var BETWEEN_MENU_DELAY = 60;
    var MENU_DELAY_BUFFER = featureDetect.isIE() ? 400 : 60;
    var navHasShown = false;
    var lazyLoadHeaderDropdownImages = function () {
        _.each(navBar.find(".cms_drop_down_lazy, .js-nav-lazy"), function (el) {
            el.src = el.getAttribute("data-original");
            $(el).removeClass("cms_drop_down_lazy js-nav-lazy")
        })
    };

    function showHeader($nav) {
        hideActiveHeaders();
        $nav.addClass("activeheader").find(".nav_bar_dept_link").addClass("hoverlink");
        $nav.find(".headerinside").addClass("activeheader");
        if (!navHasShown) {
            navHasShown = true;
            lazyLoadHeaderDropdownImages()
        }
        var dropdownName = $nav.data("hover-event-track");
        if (dropdownName) {
            Tracker.recordEvent("ShowDropdown/" + dropdownName)
        }
        barHover = true
    }

    function hideActiveHeaders() {
        _.each(topnavs.filter(".activeheader"), function (nav) {
            hideHeader($(nav))
        })
    }

    function hideHeader($nav) {
        $nav.removeClass("activeheader").find(".nav_bar_dept_link").removeClass("hoverlink");
        $nav.find(".headerinside").removeClass("activeheader")
    }
    wf.$doc.on("click touchend", function (e) {
        if (barHover && !$(e.target).closest("#primaryheader").length) {
            hideActiveHeaders()
        }
    });
    var isInitialized = false;
    var isIe8 = $.featureDetect.isIE() && $.featureDetect.browserVersion() < 9;
    var eventNames = {
        POINTER_OUT: isIe8 ? "mouseout" : "pointerout",
        POINTER_OVER: isIe8 ? "mouseover" : "pointerover",
        POINTER_LEAVE: isIe8 ? "mouseleave" : "pointerleave"
    };

    function initializeDropDownHeaders() {
        if (!isInitialized) {
            isInitialized = true;
            var intentAwayHandler = intentHandlerFactory.getIntentHandler(function () {
                barHover = false;
                hideActiveHeaders()
            });
            navBar.on(eventNames.POINTER_OUT, function (e) {
                intentAwayHandler.startIntent(e, MENU_DELAY_BUFFER)
            });
            _.each(topnavs, function (nav) {
                var $nav = $(nav);
                if (!$nav.find(".js-dept-drop-wrap, .js-dropdowncat-defer").length) {
                    return
                }
                var intentHandler = intentHandlerFactory.getIntentHandler(function () {
                    showHeader($nav)
                });
                $nav.on(eventNames.POINTER_OVER, function (e) {
                    intentAwayHandler.stopIntent();
                    var $nav = $(this);
                    if (!$nav.hasClass("activeheader")) {
                        intentHandler.startIntent(e, barHover ? BETWEEN_MENU_DELAY : INTENT_DELAY);
                        $nav.data("pointerover-lock", true);
                        setTimeout(function () {
                            $nav.data("pointerover-lock", false)
                        }, 300)
                    }
                }).on(eventNames.POINTER_OUT, function () {
                    intentHandler.stopIntent()
                });
                $nav.on("click touchend", function (e) {
                    intentAwayHandler.stopIntent();
                    if (!$nav.hasClass("activeheader") || $nav.data("pointerover-lock")) {
                        e.preventDefault();
                        intentHandler.stopIntent();
                        showHeader($nav);
                        $nav.data("pointerover-lock", false)
                    }
                })
            });
            EventDispatch.trigger(wf.constants.eventTypes.CATEGORY_CONTENT_COMPLETE, {})
        }
    }
    navBar.one(eventNames.POINTER_OVER, initializeDropDownHeaders);
    Scheduler.queueDelayedTask(function () {
        initializeDropDownHeaders()
    });
    var $headerDropdownLinks = $(".js-links-with-drop");

    function toggleDropdownLink($link, toggleOn) {
        if (toggleOn) {
            var eventTrackData = $link.data("hover-event-track");
            if (eventTrackData) {
                Tracker.recordEvent(eventTrackData);
                SiteSpect.trackEvent(eventTrackData)
            }
        }
        $link.toggleClass("activeheader", toggleOn).find(".js-delay-content").toggleClass("activeheader", toggleOn);
        $link.find("div.contents:first").toggleClass("activeheader", toggleOn);
        $link.find(".top_bar_link").toggleClass("hoverlink", toggleOn);
        $link.find("a:first").toggleClass("hoverlink", toggleOn)
    }
    var LINKS_INTENT_DELAY = 300;
    if ($headerDropdownLinks.length > 0) {
        _.each($headerDropdownLinks, function (link) {
            var $link = $(link);
            var intentHandler = intentHandlerFactory.getIntentHandler(function () {
                toggleDropdownLink($link, true)
            });
            var intentCallback = function () {
                intentHandler.startIntent($link, LINKS_INTENT_DELAY)
            };
            var intentAwayCallback = function () {
                intentHandler.stopIntent();
                toggleDropdownLink($link, false)
            };
            var touchHandler = new TouchHandler({
                el: $link
            });
            touchHandler.showCallback = intentCallback;
            touchHandler.hideCallback = intentAwayCallback
        })
    }
    return exports
});
define("speed_index", ["logger", "wayfair"], function (logger, wf) {
    var rumSpeedIndex = function (win, debug) {
        win = win || window;
        var doc = win.document;
        var getElementViewportRect = function (el) {
            var intersect = false;
            if (el.getBoundingClientRect) {
                var elRect = el.getBoundingClientRect();
                intersect = {
                    top: Math.max(elRect.top, 0),
                    left: Math.max(elRect.left, 0),
                    bottom: Math.min(elRect.bottom, win.innerHeight || doc.documentElement.clientHeight),
                    right: Math.min(elRect.right, win.innerWidth || doc.documentElement.clientWidth)
                };
                if (intersect.bottom <= intersect.top || intersect.right <= intersect.left) {
                    intersect = false
                } else {
                    intersect.area = (intersect.bottom - intersect.top) * (intersect.right - intersect.left)
                }
            }
            return intersect
        };
        var checkElement = function (el, url) {
            if (url) {
                var rect = getElementViewportRect(el);
                if (rect) {
                    rects.push({
                        url: url,
                        area: rect.area,
                        rect: rect
                    })
                }
            }
        };
        var getRects = function () {
            var elements = doc.getElementsByTagName("*");
            var re = /url\((http.*)\)/gi;
            for (var i = 0; i < elements.length; i++) {
                var el = elements[i];
                var style = win.getComputedStyle(el);
                if (el.tagName === "IMG") {
                    checkElement(el, el.src)
                }
                if (style["background-image"]) {
                    re.lastIndex = 0;
                    var matches = re.exec(style["background-image"]);
                    if (matches && matches.length > 1) {
                        checkElement(el, matches[1])
                    }
                }
                if (el.tagName === "IFRAME") {
                    try {
                        var rect = getElementViewportRect(el);
                        if (rect) {
                            var tm = rumSpeedIndex(el.contentWindow, debug);
                            if (tm) {
                                rects.push({
                                    tm: tm,
                                    area: rect.area,
                                    rect: rect
                                })
                            }
                        }
                    } catch (e) {
                        logger.info(e)
                    }
                }
            }
        };
        var getRectTimings = function () {
            var timings = {};
            var requests = win.performance.getEntriesByType("resource");
            for (var i = 0; i < requests.length; i++) {
                timings[requests[i].name] = requests[i].responseEnd
            }
            for (var j = 0; j < rects.length; j++) {
                if (!("tm" in rects[j])) {
                    rects[j].tm = timings[rects[j].url] !== undefined ? timings[rects[j].url] : 0
                }
            }
        };
        var getFirstPaint = function () {
            if ("msFirstPaint" in win.performance.timing) {
                firstPaint = win.performance.timing.msFirstPaint - navStart
            }
            if ("chrome" in win && "loadTimes" in win.chrome) {
                var chromeTimes = win.chrome.loadTimes();
                if ("firstPaintTime" in chromeTimes && chromeTimes.firstPaintTime > 0) {
                    var startTime = chromeTimes.startLoadTime;
                    if ("requestTime" in chromeTimes) {
                        startTime = chromeTimes.requestTime
                    }
                    if (chromeTimes.firstPaintTime >= startTime) {
                        firstPaint = (chromeTimes.firstPaintTime - startTime) * 1e3
                    }
                }
            }
            if (firstPaint === undefined || firstPaint < 0 || firstPaint > 12e4) {
                firstPaint = win.performance.timing.responseStart - navStart;
                var headURLs = {};
                var headElements = doc.getElementsByTagName("head")[0].children;
                for (var i = 0; i < headElements.length; i++) {
                    var el = headElements[i];
                    if (el.tagName === "SCRIPT" && el.src && !el.async) {
                        headURLs[el.src] = true
                    }
                    if (el.tagName === "LINK" && el.rel === "stylesheet" && el.href) {
                        headURLs[el.href] = true
                    }
                }
                var requests = win.performance.getEntriesByType("resource");
                var doneCritical = false;
                for (var j = 0; j < requests.length; j++) {
                    if (!doneCritical && headURLs[requests[j].name] && (requests[j].initiatorType === "script" || requests[j].initiatorType === "link")) {
                        var requestEnd = requests[j].responseEnd;
                        if (firstPaint === undefined || requestEnd > firstPaint) {
                            firstPaint = requestEnd
                        }
                    } else {
                        doneCritical = true
                    }
                }
            }
            firstPaint = Math.max(firstPaint, 0)
        };
        var calculateVisualProgress = function () {
            var paints = {
                0: 0
            };
            var total = 0;
            for (var i = 0; i < rects.length; i++) {
                var tm = firstPaint;
                if ("tm" in rects[i] && rects[i].tm > firstPaint) {
                    tm = rects[i].tm
                }
                if (paints[tm] === undefined) {
                    paints[tm] = 0
                }
                paints[tm] += rects[i].area;
                total += rects[i].area
            }
            var pixels = Math.max(doc.documentElement.clientWidth, win.innerWidth || 0) * Math.max(doc.documentElement.clientHeight, win.innerHeight || 0);
            if (pixels > 0) {
                pixels = Math.max(pixels - total, 0) * pageBackgroundWeight;
                if (paints[firstPaint] === undefined) {
                    paints[firstPaint] = 0
                }
                paints[firstPaint] += pixels;
                total += pixels
            }
            if (total) {
                for (var time in paints) {
                    if (paints.hasOwnProperty(time)) {
                        progress.push({
                            tm: time,
                            area: paints[time]
                        })
                    }
                }
                progress.sort(function (a, b) {
                    return a.tm - b.tm
                });
                var accumulated = 0;
                for (var j = 0; j < progress.length; j++) {
                    accumulated += progress[j].area;
                    progress[j].progress = accumulated / total
                }
            }
        };
        var calculateSpeedIndex = function () {
            if (progress.length) {
                SpeedIndex = 0;
                var lastTime = 0;
                var lastProgress = 0;
                for (var i = 0; i < progress.length; i++) {
                    var elapsed = progress[i].tm - lastTime;
                    if (elapsed > 0 && lastProgress < 1) {
                        SpeedIndex += (1 - lastProgress) * elapsed
                    }
                    lastTime = progress[i].tm;
                    lastProgress = progress[i].progress
                }
            } else {
                SpeedIndex = firstPaint
            }
        };
        var rects = [];
        var progress = [];
        var firstPaint;
        var SpeedIndex;
        var pageBackgroundWeight = .1;
        try {
            var navStart = win.performance.timing.navigationStart;
            getRects();
            getRectTimings();
            getFirstPaint();
            calculateVisualProgress();
            calculateSpeedIndex()
        } catch (e) {
            logger.info(e)
        }
        if (debug) {
            var debugOutput = "";
            debugOutput += "Paint Rects\n\n";
            for (var i = 0; i < rects.length; i++) {
                debugOutput += "(" + rects[i].area + ") " + rects[i].tm + " - " + rects[i].url + "\n\n"
            }
            debugOutput += "Visual Progress\n\n";
            for (var j = 0; j < progress.length; j++) {
                debugOutput += "(" + progress[j].area + ") " + progress[j].tm + " - " + progress[j].progress + "\n\n"
            }
            debugOutput += "First Paint: " + firstPaint + "\n\n";
            debugOutput += "Speed Index: " + SpeedIndex + "\n\n";
            logger.info(debugOutput)
        }
        wf.appData.SPEED_INDEX = SpeedIndex;
        return SpeedIndex
    };
    return rumSpeedIndex
});
define("wf_storage", ["wayfair", "jquery", "underscore", "logger", "wf_storage_utils"], function (wf, $, _, Logger, storageUtils) {
    "use strict";
    var sessionStorage = null;
    var localStorage = null;
    try {
        sessionStorage = window.sessionStorage;
        localStorage = window.localStorage
    } catch (e) {}
    var _browserStorage = {
        ttlKeySuffix: "_TTL",
        storageMethod: sessionStorage,
        set: function (settings) {
            var setSuccess = false;
            this.storageMethod = settings.storageMethod;

            function _setTTL(context, settings) {
                var date = storageUtils.advanceByDays(settings.ttl);
                if (date) {
                    context.storageMethod.setItem(settings.key + context.ttlKeySuffix, date);
                    return true
                }
                return false
            }

            function _setSubKey(context, settings) {
                var parent = context._subKeyParent(settings);
                return storageUtils.setSubKey(parent, settings)
            }
            settings.value = settings.subKey ? _setSubKey(this, settings) : settings.value;
            settings.value = storageUtils.jsonEncode(settings.value, settings.json);
            _setTTL(this, settings);
            if (settings.key && settings.value) {
                this._evictExpired();
                try {
                    this.storageMethod.setItem(settings.key, settings.value);
                    setSuccess = true
                } catch (e) {
                    if (e.name === "QUOTA_EXCEEDED_ERR" || e.name === "NS_ERROR_DOM_QUOTA_REACHED") {
                        this._evictOldest()
                    } else {
                        throw e
                    }
                }
            }
            return setSuccess
        },
        get: function (settings) {
            this.storageMethod = settings.storageMethod;

            function _getSubKey(context, settings) {
                var parent = context._subKeyParent(settings);
                if (_.isObject(parent) && !_.isArray(parent) && _.has(parent, settings.subKey)) {
                    return parent[settings.subKey]
                } else {
                    return null
                }
            }
            var result = null;
            if (this._expired(settings.key)) {
                this._removeKey(settings.key)
            } else {
                if (settings.subKey) {
                    result = _getSubKey(this, settings)
                } else {
                    result = storageUtils.jsonDecode(this.storageMethod.getItem(settings.key), settings.json);
                    if (result === false) {
                        result = null
                    }
                }
            }
            return result
        },
        remove: function (settings) {
            this.storageMethod = settings.storageMethod;

            function _removeSubKey(context, settings) {
                var parent = context._subKeyParent(settings);
                if (parent) {
                    if (_.isObject(parent) && !_.isArray(parent) && _.has(parent, settings.subKey)) {
                        delete parent[settings.subKey];
                        settings.value = parent
                    } else {
                        settings.value = null
                    }
                    if (settings.value) {
                        return context.set($.extend(true, {}, settings, {
                            subKey: null
                        }))
                    }
                }
                return false
            }
            if (settings.subKey && !this._expired(settings.key)) {
                return _removeSubKey(this, settings)
            } else {
                return this._removeKey(settings.key)
            }
        },
        _evictOldest: function () {
            var oldestKey = null;
            var oldestKeyDate = new Date(0);
            for (var i = 0, len = this.storageMethod.length; i < len; i++) {
                var key = this.storageMethod.key(i);
                var ttl = this.storageMethod.getItem(key + this.ttlKeySuffix);
                if (ttl) {
                    var timeExpired = new Date(parseInt(ttl, 10));
                    if (timeExpired > oldestKeyDate) {
                        oldestKeyDate = timeExpired;
                        oldestKey = key
                    }
                }
            }
            this._removeKey(oldestKey)
        },
        _evictExpired: function () {
            var removed = false;
            for (var i = 0; i < this.storageMethod.length; i++) {
                var key = this.storageMethod.key(i);
                if (this._expired(key)) {
                    this._removeKey(key);
                    removed = true
                }
            }
        },
        _expired: function (key) {
            if (!this.storageMethod) {
                Logger.warn("wf_storage _expired called with storageMethod: " + JSON.stringify(this.storageMethod));
                return false
            }
            var ttl = this.storageMethod.getItem(key + this.ttlKeySuffix);
            if (ttl) {
                var timeNow = new Date,
                    timeExpired = new Date(parseInt(ttl, 10));
                if (timeNow > timeExpired) {
                    return true
                }
            }
            return false
        },
        _subKeyParent: function (settings) {
            var _settings = $.extend(true, {}, settings, {
                subKey: null
            });
            var subKeyParent = this.get(_settings);
            return subKeyParent
        },
        _removeKey: function (key) {
            if (key) {
                this.storageMethod.removeItem(key + this.ttlKeySuffix);
                this.storageMethod.removeItem(key);
                return true
            } else {
                return false
            }
        }
    };
    var _cookie = {
        get: function (settings) {
            function _getValue(pairs, settings) {
                var value = _splitPairs(pairs, settings.key, settings.cookie.raw);
                value = value ? storageUtils.jsonDecode(value, settings.json) : value;
                if (!value && settings.json) {
                    Logger.info("_getValue: Double check json settings for key: " + settings.key)
                }
                return value
            }

            function _getSubValue(subPairs, settings) {
                var value = null;
                if (subPairs && settings.json) {
                    value = subPairs[settings.subKey] || null
                } else if (subPairs) {
                    subPairs = subPairs.split("&");
                    value = _splitPairs(subPairs, settings.subKey, false)
                }
                return value
            }

            function _splitPairs(pairs, key, raw) {
                for (var i = 0, l = pairs.length; i < l; i++) {
                    var parts = pairs[i].split("=");
                    var name = storageUtils.decode(parts.shift(), raw);
                    var pair = storageUtils.decode(parts.join("="), raw) || null;
                    if (key === name) {
                        return pair
                    }
                }
                return null
            }
            var cookies = document.cookie.split("; ");
            var value = _getValue(cookies, settings);
            if (value && settings.subKey) {
                value = _getSubValue(value, settings)
            }
            return value
        },
        set: function (settings) {
            if (settings.subKey) {
                var parent = this.get($.extend(true, {}, settings, {
                    subKey: null
                }));
                if (settings.json) {
                    settings.value = storageUtils.setSubKey(parent, settings)
                } else {
                    var cookies = [];
                    if (parent) {
                        cookies = parent.split("&");
                        cookies = _.reject(cookies, function (cookie) {
                            return ~cookie.indexOf(settings.subKey)
                        })
                    }
                    cookies.push(settings.subKey + "=" + settings.value);
                    settings.value = cookies.join("&")
                }
            }
            return this._set(settings)
        },
        _set: function (settings) {
            settings.key = storageUtils.encode(settings.key, settings.cookie.raw);
            settings.value = storageUtils.encode(storageUtils.jsonEncode(settings.value, settings.json), settings.cookie.raw);
            if (!settings.value) {
                settings.ttl = -1
            }
            settings.ttl = settings.ttl ? new Date(storageUtils.advanceByDays(settings.ttl)) : null;
            if (settings.key) {
                var domain = "; domain=";
                if (settings.cookie.domain !== "/") {
                    var domainString = settings.cookie.domain;
                    if (settings.cookie.domain.indexOf(".") !== 0) {
                        domainString = "." + settings.cookie.domain
                    }
                    domain += domainString
                } else {
                    var cookieDomain = wf.constants.COOKIE_DOMAIN;
                    if (cookieDomain.length > 0) {
                        domain += "." + cookieDomain
                    } else {
                        domain = ""
                    }
                }
                var path = "; path =";
                if (settings.cookie.path !== "") {
                    path += settings.cookie.path
                } else {
                    path += "/"
                }
                var cookie = [settings.key, "=", settings.value || "", settings.ttl ? "; expires=" + settings.ttl.toUTCString() : "", domain, settings.cookie.secure ? "; secure" : "", path].join("");
                document.cookie = cookie;
                return true
            } else {
                return false
            }
        },
        remove: function (settings) {
            var parent = this.get($.extend({}, settings, {
                subKey: null
            }));
            if (parent) {
                if (settings.subKey) {
                    if (settings.json) {
                        if (_.isObject(parent) && _.has(parent, settings.subKey)) {
                            delete parent[settings.subKey];
                            settings.value = parent;
                            this._set(settings);
                            return true
                        }
                    } else {
                        var cookies = parent.split("&");
                        cookies = _.reject(cookies, function (cookie) {
                            var parts = cookie.split("=");
                            var key = parts[0];
                            return parts.length === 2 && ~key.indexOf(settings.subKey)
                        });
                        settings.value = cookies.join("&");
                        this._set(settings);
                        return true
                    }
                } else {
                    settings.ttl = -1;
                    this._set(settings);
                    return true
                }
            }
            return false
        }
    };
    var shared = {
        _defaults: {
            key: null,
            subKey: null,
            value: null,
            ttl: null,
            json: false,
            cookie: {
                domain: "/",
                secure: false,
                path: "",
                raw: false
            },
            browserStorage: {
                fallback: false
            },
            storageMethod: sessionStorage
        },
        _settings: function (options) {
            var settings = $.extend(true, {}, this._defaults, options);
            settings._type = this._getType(settings);
            if (settings._type === "browserStorage" && options.cookie) {
                Logger.info("Using cookie options with local storage does not do anything")
            } else if (settings._type === "cookie" && options.browserStorage) {
                Logger.info("Using browserStorage options with cookies does not do anything")
            }
            if (settings._type === "browserStorage" && this.persistant) {
                settings.storageMethod = localStorage
            } else if (settings._type === "browserStorage") {
                settings.storageMethod = sessionStorage
            }
            return settings
        },
        get: function (options) {
            if (!options || !_.isObject(options)) {
                return this._optionsError()
            }
            var settings = this._settings(options);
            settings._action = "get";
            if (settings._type) {
                return this._control(settings)
            } else {
                return null
            }
        },
        set: function (options) {
            if (!options || !_.isObject(options)) {
                return this._optionsError()
            }
            var settings = this._settings(options);
            settings._action = "set";
            if (settings._type) {
                return this._control(settings)
            } else {
                return null
            }
        },
        remove: function (options) {
            if (!options || !_.isObject(options)) {
                return this._optionsError()
            }
            var settings = this._settings(options);
            settings._action = "remove";
            if (settings._type) {
                return this._control(settings)
            } else {
                return null
            }
        },
        enabled: function () {
            if (this.persistant) {
                return storageUtils.localStorageEnabled()
            } else {
                return storageUtils.sessionStorageEnabled()
            }
        },
        _optionsError: function () {
            Logger.debug("Options hash must be used with the wf storage API");
            return null
        },
        _getType: function (settings) {
            var type = this._type;
            if (type === "browserStorage") {
                if (!this.enabled()) {
                    type = settings.browserStorage.fallback ? "cookie" : null
                }
            }
            return type
        },
        _control: function (settings) {
            var browserStorage = "browserStorage";
            if (settings.key) {
                if (settings._type === browserStorage && settings.subKey && !settings.json) {
                    Logger.debug("browserStorage subkeys must be used with JSON. Set json: true");
                    return false
                }
                if (settings.cookie.raw && settings.json) {
                    Logger.error("Subkeys and JSON and unencoded URIs do not go well together");
                    return false
                }
                if (settings._action === "set") {
                    if (settings.ttl && !_.isNumber(settings.ttl)) {
                        Logger.debug("You set cookie " + settings.key + " with a NaN Expiration. Use a number to expire in X days.");
                        return false
                    }
                    if (settings.value) {
                        if (settings._type === browserStorage) {
                            return _browserStorage.set(settings)
                        } else {
                            return _cookie.set(settings)
                        }
                    } else {
                        Logger.debug("You must use a value when setting with wf storage API");
                        return false
                    }
                } else {
                    if (settings.ttl || settings.value) {
                        Logger.info("TTL and value are ignored when getting/removing with wf storage API")
                    }
                    if (settings._action === "get") {
                        if (settings._type === browserStorage) {
                            return _browserStorage.get(settings)
                        } else {
                            return _cookie.get(settings)
                        }
                    } else if (settings._action === "remove") {
                        if (settings._type === browserStorage) {
                            return _browserStorage.remove(settings)
                        } else {
                            return _cookie.remove(settings)
                        }
                    }
                }
            } else {
                Logger.debug("You must use a key with the wf storage API");
                return false
            }
        }
    };
    return {
        cookie: $.extend({
            _type: "cookie"
        }, shared),
        session: $.extend({
            _type: "browserStorage"
        }, shared),
        local: $.extend({
            _type: "browserStorage",
            persistant: true
        }, shared)
    }
});
define("sitespect", ["jquery", "wf_storage", "underscore", "wayfair", "sitespect_core"], function ($, Storage, _, wf) {
    var cookieParts = null,
        isLoaded = false;
    $.SiteSpect = {
        isEnabled: function () {
            return typeof window.SS !== "undefined"
        },
        trackEvent: function (eventName, factor) {
            if (wf.constants.ENV === "D") {
                window.console.log("SS response point: " + eventName)
            } else if (typeof factor !== "undefined") {
                var self = this;
                factor = String(factor);
                if (!_.any(factor.split("|"), function (sub) {
                        return self.sitespectCookieContains(sub, true)
                    })) {
                    return
                }
            }
            if (window.SS) {
                window.SS.EventTrack.rp(eventName)
            }
        },
        sitespectCookieContains: function (value, partialMatch) {
            if (!isLoaded) {
                var cookieValue = window.decodeURIComponent(Storage.cookie.get({
                    key: "SSOE"
                }));
                if (cookieValue) {
                    var pipedValue = cookieValue.split("|");
                    if (pipedValue.length > 1) {
                        cookieValue = pipedValue[1]
                    }
                    cookieParts = cookieValue.split(":")
                }
                isLoaded = true
            }
            if (wf.appData.sitespectOverride && wf.appData.sitespectOverride.length > 0) {
                cookieParts = [wf.appData.sitespectOverride]
            }
            if (cookieParts !== null) {
                return _.some(cookieParts, function (e) {
                    var variations = e.split(".");
                    if (partialMatch) {
                        return _.some(variations, function (s) {
                            return s.indexOf(value) > -1
                        })
                    } else {
                        if (_.indexOf(variations, value) > -1) {
                            return true
                        }
                    }
                })
            }
            return false
        }
    };
    return $.SiteSpect
});
define("wf_scheduler", ["wayfair", "jquery", "underscore", "logger", "event_dispatch"], function (wf, $, _, Logger, EventDispatch) {
    "use strict";
    var DELAY_TIME = 5e3;
    var wfScheduler = {},
        _wfDone = [],
        _postLoad = [],
        _delayed = [],
        _wfDoneRan = false,
        _postLoadRan = false,
        _delayedRan = false;

    function _addEvent(queue, task, queueIndicator, context, priority) {
        if (typeof task !== "function") {
            Logger.warn("wf_scheduler _addEvent: Unable to queue a task that is not a function: " + task);
            return
        }
        context = context || window;
        if (queueIndicator) {
            task.apply(context)
        }
        if (priority == null) {
            priority = Infinity
        }
        queue.push({
            task: task,
            context: context,
            priority: priority
        })
    }

    function _runWfDone() {
        if (window.__phantomas != null) {
            window.__phantomas.setMetric("scheduler.WFDoneStart", window.performance.now())
        }
        _wfDoneRan = true;
        Logger.timeStamp("wf_scheduler", "wfDoneStart");
        _runTasks(_wfDone);
        Logger.timeStamp("wf_scheduler", "wfDoneEnd");
        if (window.performance) {
            if (typeof window.performance.now === "function") {
                wf.appData.WAYFAIR_DONE_END_TIME = window.performance.now()
            }
            if (typeof window.performance.mark === "function") {
                window.performance.mark("wf_done_end")
            }
            if (window.__phantomas != null) {
                window.__phantomas.setMetric("scheduler.WFDoneEnd", wf.appData.WAYFAIR_DONE_END_TIME)
            }
        }
    }

    function _runPostLoad() {
        if (window.__phantomas != null) {
            window.__phantomas.setMetric("scheduler.PostLoadStart", window.performance.now())
        }
        _postLoadRan = true;
        _runTasks(_postLoad);
        Logger.timeStamp("wf_scheduler", "postLoadEnd");
        if (window.performance) {
            if (typeof window.performance.now === "function") {
                wf.appData.WAYFAIR_POSTLOAD_END_TIME = window.performance.now()
            }
            if (typeof window.performance.mark === "function") {
                window.performance.mark("wf_postload_end")
            }
            if (window.__phantomas != null) {
                window.__phantomas.setMetric("scheduler.PostLoadEnd", wf.appData.WAYFAIR_POSTLOAD_END_TIME)
            }
        }
    }

    function _runDelayed() {
        if (window.__phantomas != null) {
            window.__phantomas.setMetric("scheduler.DelayedStart", window.performance.now())
        }
        _delayedRan = true;
        Logger.timeStamp("wf_scheduler", "delayedStart");
        _runTasks(_delayed);
        Logger.timeStamp("wf_scheduler", "delayedEnd");
        if (window.performance) {
            if (typeof window.performance.now === "function") {
                wf.appData.WAYFAIR_DELAYED_END_TIME = window.performance.now()
            }
            if (typeof window.performance.mark === "function") {
                window.performance.mark("wf_delayed_end")
            }
            if (window.__phantomas != null) {
                window.__phantomas.setMetric("scheduler.DelayedEnd", wf.appData.WAYFAIR_DELAYED_END_TIME)
            }
        }
    }

    function _runTasks(queue) {
        var item;
        queue = _.sortBy(queue, function (task) {
            return task.priority
        });
        while (queue.length) {
            item = queue.shift();
            if (wf.constants.IS_AMD_DEBUG_MODE) {
                item.task.apply(item.context)
            } else {
                try {
                    item.task.apply(item.context)
                } catch (e) {
                    if (!e.message) {
                        e.message = "TASK: " + item.task.toString().replace(/\n+/g, "").substr(0, 100)
                    }
                    Logger.error("wf_scheduler - a queued function threw an error: " + e.message)
                }
            }
        }
    }
    wfScheduler.queueWfDoneTask = function (task, context, priority) {
        _addEvent(_wfDone, task, _wfDoneRan, context, priority)
    };
    wfScheduler.queuePostLoadTask = function (task, context, priority) {
        if (document.readyState === "complete" && !_postLoadRan) {
            wfScheduler.queueWfDoneTask(task, context, priority)
        } else {
            _addEvent(_postLoad, task, _postLoadRan, context, priority)
        }
    };
    wfScheduler.queuePostLoadGetScript = function (url) {
        this.queuePostLoadTask(function () {
            $.getScript(url)
        })
    };
    wfScheduler.queueDelayedTask = function (task, context, priority) {
        _addEvent(_delayed, task, _delayedRan, context, priority)
    };
    wfScheduler.queueWfReadyTask = function (task, context, priority) {
        _addEvent(_delayed, task, _delayedRan, context, priority)
    };
    wfScheduler.getTaskCount = function () {
        return _delayed.length + _postLoad.length + _wfDone.length
    };
    wfScheduler.init = function () {
        _delayed = [];
        _postLoad = [];
        _wfDone = []
    };
    EventDispatch.on(window.wf.constants.eventTypes.WAYFAIR_DONE, {}, function () {
        _runWfDone()
    });
    wf.$win.on("load", function () {
        Logger.timeStamp("wf_scheduler", "postLoadStart");
        setTimeout(_runPostLoad, 0);
        setTimeout(_runDelayed, DELAY_TIME)
    });
    wfScheduler.init();
    return wfScheduler
});
define("tracking", ["jquery", "underscore", "logger", "browser_utils", "event_dispatch", "configuration", "wf_storage", "tracking_utils", "wayfair", "wf_scheduler", "jm_tracking", "private_utilities"], function ($, _, Logger, BrowserUtils, EventDispatch, Configuration, Storage, TrackingUtils, wf, Scheduler, jmTracking, privateUtilities) {
    "use strict";
    var exports = null;
    var pixelData = window.YUI_config.app.tp_data || {};
    var wfPixelData = wf.appData.tp_data || {};
    var NAMESPACE_ROOT = "tracking";
    var NAMESPACE_LEAF = "spvTracking";
    var NAMESPACE = NAMESPACE_ROOT + "." + NAMESPACE_LEAF;
    var EVENT_TYPE = "TRACKING";
    var EVENT_TYPES_NAMESPACE = "wf.constants.eventTypes";
    var eventTypes = Configuration.namespace(EVENT_TYPES_NAMESPACE);
    var __cmbLoaded = false;
    var trackingRoot = Configuration.namespace(NAMESPACE_ROOT);
    trackingRoot[NAMESPACE_LEAF] = wf.appData.spvTracking;
    eventTypes.TRACKING_EVENT_TYPE = EVENT_TYPE;

    function Tracker() {
        var self = this;
        this._setEventMap();
        EventDispatch.on(this.getEventType(), {
            namespace: this.getNamespace()
        }, function (wfEvent) {
            self._execute(wfEvent)
        })
    }
    Tracker.prototype.getEventType = function () {
        return EVENT_TYPE
    };
    Tracker.prototype.getNamespace = function () {
        return NAMESPACE
    };
    Tracker.prototype._setEventMap = function () {
        this._eventMap = {
            SPVTWO: {
                action: "init_spvTwo"
            },
            SEND_TELL_APART_PARTIAL_BASKET_UPDATE: {
                action: "sendTellApartPartialBasketUpdate"
            },
            LOG_OPTIONS_AND_INVENTORY: {
                action: "logOptionsAndInventory"
            },
            RUN_OIQ: {
                action: "runOIQ"
            },
            GINM_GOOGLE_ANALYTICS: {
                action: "ginmGoogleAnalytics"
            },
            TELL_APART: {
                action: "tellApart"
            },
            RECORD_CUSTOMER_REFERRER: {
                action: "recordCustomerReferrer"
            },
            APPNEXUS_TRACKING: {
                action: "appnexusTracking"
            }
        }
    };
    Tracker.prototype._execute = function (wfEvent) {
        try {
            var verb = wfEvent.verb;
            var eventDetails = verb ? this._eventMap[verb] : null;
            if (eventDetails) {
                this[eventDetails.action](wfEvent)
            }
        } catch (execErr) {
            Logger.useLogger("JS_Tracking").info("Tracker._execute() had error: " + execErr.message, {
                error: execErr,
                module: "tracking"
            })
        }
    };
    Tracker.prototype.init_spvTwo = function (wfEvent) {
        var rfLocation = wfEvent.data.rfLocation;
        var rfHTTPReferrer = wfEvent.data.rfHTTPReferrer;
        var rfCstmVars = wfEvent.data.rfCstmVars;
        if (typeof rfCstmVars === "object") {
            rfCstmVars = _flattenRfCstmVars(rfCstmVars)
        }
        _spvTwo(rfLocation, rfHTTPReferrer, rfCstmVars);
        EventDispatch.trigger(EVENT_TYPE, {
            verb: "RESPONSE:SPVTWO",
            namespace: wfEvent.namespace,
            uid: wfEvent.uid
        })
    };

    function _flattenRfCstmVars(rfCstmVars) {
        var flatRfCstmVars = "";
        for (var key in rfCstmVars) {
            if (rfCstmVars.hasOwnProperty(key)) {
                flatRfCstmVars += key + "=" + rfCstmVars[key] + ";"
            }
        }
        return flatRfCstmVars
    }

    function _unflattenRfCstmVars(rfCstmVars) {
        var rfCstmVarsObject = {};
        rfCstmVars = rfCstmVars || "";
        _.each(rfCstmVars.split(";"), function (keyValueDelimited) {
            if (keyValueDelimited) {
                var keyValueDelimitedSplit = keyValueDelimited.split("=");
                rfCstmVarsObject[keyValueDelimitedSplit[0]] = keyValueDelimitedSplit[1]
            }
        });
        return rfCstmVarsObject
    }

    function _spvTwo(rfLocation, rfHTTPReferrer, rfCstmVars) {
        if (privateUtilities.isJossAndMainStore()) {
            var jossCustomVars = {};
            if (wf.appData.spvTracking) {
                try {
                    jossCustomVars = JSON.parse(wf.appData.spvTracking.CustomVars)[0]
                } catch (e) {}
            }
            var jossInputObject = {};
            if (rfCstmVars != null) {
                if (typeof rfCstmVars === "string") {
                    rfCstmVars.replace(new RegExp("([^=;]+)(=([^;]*))", "g"), function ($0, $1, $2, $3) {
                        jossInputObject[$1] = $3
                    })
                } else if (typeof rfCstmVars === "object") {
                    jossInputObject = rfCstmVars
                }
            }
            var allVarsArray = [_.extend({}, jossCustomVars, jossInputObject)];
            return jmTracking.spv2(false, allVarsArray)
        }
        var q = "rfCSNID=" + _getCSNID();
        var i = new Image(1, 1);
        var l = window.location.protocol + "//" + wf.appData.spvTracking.CSNDomain + "?";
        var rItem = Storage.cookie.get({
            key: "CSNBrief",
            subKey: "RelatedItem"
        });
        var cstmVars = wf.appData.spvTracking.CustomVars;
        var logNode = $("#log_info:first");
        var t = new Date;
        if (!rfLocation) {
            rfLocation = document.location.href
        }
        if (!rfHTTPReferrer) {
            rfHTTPReferrer = wf.appData.spvTracking.referrer ? wf.appData.spvTracking.referrer : document.referrer
        }
        if (cstmVars.charAt(cstmVars.length - 1) !== ";") {
            cstmVars += ";"
        }
        if (rfCstmVars) {
            if (typeof rfCstmVars !== "string") {
                rfCstmVars = _flattenRfCstmVars(rfCstmVars)
            }
            if (rfCstmVars.charAt(rfCstmVars.length - 1) !== ";") {
                rfCstmVars += ";"
            }
            var customVarsArray = {};
            cstmVars.replace(new RegExp("([^=;]+)(=([^;]*))", "g"), function ($0, $1, $2, $3) {
                customVarsArray[$1] = $3
            });
            var inputArray = {};
            rfCstmVars.replace(new RegExp("([^=;]+)(=([^;]*))", "g"), function ($0, $1, $2, $3) {
                inputArray[$1] = $3
            });
            var newCustomVarsArray = {};
            $.extend(newCustomVarsArray, customVarsArray, inputArray);
            cstmVars = "";
            for (var key in newCustomVarsArray) {
                if (newCustomVarsArray.hasOwnProperty(key)) {
                    cstmVars += key + "=" + newCustomVarsArray[key] + ";"
                }
            }
        }
        if (rItem && rItem !== "") {
            wf.appData.spvTracking.CustomVars += rItem.replace(":", "=") + ";";
            Storage.cookie.remove({
                key: "CSNBrief",
                subKey: "RelatedItem"
            })
        }
        if (logNode.length > 0) {
            var data = logNode.attr("data");
            cstmVars = cstmVars + data.replace(/&/g, ";") + ";"
        }
        cstmVars += "_t=" + t.getTime() + ";" + "_tz=" + t.getTimezoneOffset() + ";";
        cstmVars += "_txid=" + wf.constants.TRANSACTION_ID + ";";
        cstmVars += "_warnCount=" + wf.logger._warnCount + ";";
        cstmVars += "_errorCount=" + wf.logger._errorCount + ";";
        cstmVars += "_fatalCount=" + wf.logger._fatalCount + ";";
        cstmVars += "_Servers=" + Storage.cookie.get({
            key: "server"
        }) + "," + Storage.cookie.get({
            key: "Server_80"
        }) + "," + Storage.cookie.get({
            key: "Server_81"
        }) + ";";
        q += "&rfHTTPReferer=" + encodeURIComponent(rfHTTPReferrer);
        q += "&rfURL=" + encodeURIComponent(rfLocation);
        q += "&rfGUID=" + encodeURIComponent(BrowserUtils.getUser());
        q += "&rfSoID=" + wf.constants.STORE_ID;
        q += "&rfCstmVars=" + encodeURIComponent(cstmVars);
        i.src = l + q
    }
    Tracker.prototype.sendTellApartPartialBasketUpdate = function (wfEvent) {
        if (wf.appData.disableTellapart) {
            return
        }
        var skuArray = wfEvent.data.skuArray;
        if (__cmbLoaded && skuArray && window.TellApartCrumb) {
            skuArray = skuArray.split("|");
            var action = window.TellApartCrumb.makeCrumbAction(window.YUI_config.app.TellApartCode, "updatecart");
            var currentSku;
            action.setActionAttr("UpdateCartType", "PartialUpdate");
            for (var i = 0; i < skuArray.length; i++) {
                currentSku = skuArray[i].split(":");
                action.beginItem();
                action.setItemAttr("SKU", currentSku[0]);
                action.setItemAttr("ProductPrice", currentSku[1]);
                action.setItemAttr("ProductCurrency", "USD");
                action.setItemAttr("ItemCount", currentSku[2]);
                action.endItem()
            }
            action.finalize();
            EventDispatch.trigger(EVENT_TYPE, {
                verb: "RESPONSE:SENT_TA_BASKETUPDATE",
                namespace: wfEvent.namespace,
                uid: wfEvent.uid
            })
        }
    };
    Tracker.prototype.setCustomVars = function (newCustomVars) {
        if (typeof newCustomVars !== "object") {
            Logger.info("Cannot update CustomVars: `newCustomVars` is not an Object");
            return
        }
        if (wf.appData.spvTracking) {
            var customVars = _unflattenRfCstmVars(wf.appData.spvTracking.CustomVars);
            _.extend(customVars, newCustomVars);
            wf.appData.spvTracking.CustomVars = _flattenRfCstmVars(customVars)
        }
    };
    Tracker.prototype.delCustomVars = function (customVarsKeys) {
        if (!_.isArray(customVarsKeys)) {
            Logger.info("Cannot delete CustomVars: `customVarsKeys` should be an Array of keys to delete");
            return
        }
        var customVars = _unflattenRfCstmVars(wf.appData.spvTracking.CustomVars);
        customVars = _.omit(customVars, customVarsKeys);
        wf.appData.spvTracking.CustomVars = _flattenRfCstmVars(customVars)
    };
    Tracker.prototype.logOptionsAndInventory = function (wfEvent) {
        var self = this;
        var inv = wfEvent.data.inventory;
        var firstTime = wfEvent.data.bFirstTime;
        var piIDs = [],
            ltIDs = [],
            displayqtyList = [],
            qtyList = [],
            qtyAtCsnList = [],
            batcList = [];
        var twoDayGuarenteeList = [],
            skuOptionCombo = "",
            hasSubGroup = false,
            hasPiIDs = false,
            key;
        for (key in inv) {
            if (inv.hasOwnProperty(key)) {
                hasSubGroup = inv[key].KitSubGroup;
                hasPiIDs = inv[key].PiIDs !== "";
                if (inv[key].PiIDs && inv[key].PiIDs.search(/\^|\-|\~/gi) === -1 || hasSubGroup) {
                    if (hasSubGroup && hasPiIDs) {
                        skuOptionCombo = /[A-Z]+[0-9]+(\-[0-9]+(\,[0-9]+)?)?/i.exec(inv[key].PiIDs)[0].replace("-", "_").replace(",", "_")
                    } else {
                        skuOptionCombo = inv[key].PrSKU;
                        if (hasPiIDs) {
                            skuOptionCombo += "_" + inv[key].PiIDs
                        }
                    }
                }
                piIDs.push(skuOptionCombo);
                ltIDs.push(inv[key].LtID);
                displayqtyList.push(inv[key].QuantityDisplay);
                qtyList.push(inv[key].Qty);
                batcList.push(inv[key].BlockATC);
                twoDayGuarenteeList.push(inv[key].Flags & 1);
                qtyAtCsnList.push(inv[key].QuantityAtCSN)
            }
        }
        var cstmVars = wf.appData.spvTracking.CustomVars;
        var cstmVarsObject = _unflattenRfCstmVars(cstmVars);
        cstmVarsObject.ID = piIDs.join(",");
        cstmVarsObject.LtID = ltIDs.join(",");
        cstmVarsObject.DisplayQty = displayqtyList.join(",");
        cstmVarsObject.Qty = qtyList.join(",");
        cstmVarsObject.BATC = batcList.join(",");
        cstmVarsObject.TwoDay = twoDayGuarenteeList.join(",");
        cstmVarsObject.QtyAtCSN = qtyAtCsnList.join(",");
        if (!firstTime) {
            wf.appData.spvTracking.CustomVars = _flattenRfCstmVars(cstmVarsObject)
        } else {
            wf.appData.spvTracking.CustomVars = _flattenRfCstmVars(cstmVarsObject);
            if (wf.appData.spvTracking.DelayCall) {
                self.init_spvTwo(wfEvent)
            }
        }
        EventDispatch.trigger(EVENT_TYPE, {
            verb: "RESPONSE:LOGOPTIONS",
            namespace: wfEvent.namespace,
            uid: wfEvent.uid
        })
    };
    Tracker.prototype.recordCustomerReferrer = function (wfEvent) {
        var referrerData;
        if (wfEvent && wfEvent.hasOwnProperty("data") && wfEvent.data.hasOwnProperty("referrerData")) {
            referrerData = wfEvent.data.referrerData
        } else {
            referrerData = {
                page: document.location.href,
                page_alias: wf.appData.pageAlias,
                referrer: document.referrer,
                sku: wf.appData.tracking.sku,
                category: wf.appData.tracking.category,
                "class": wf.appData.tracking["class"],
                collection: wf.appData.tracking.collection,
                marketing_category: wf.appData.tracking.marketingCategory
            }
        }
        referrerData.csn_utid = BrowserUtils.getUser();
        referrerData.bpss = "yes";
        var i = new Image(1, 1);
        i.src = wf.constants.STORE_URL + "/a/account/tracking/referrer" + "?" + $.param(referrerData)
    };
    Tracker.prototype.recordEvent = function (name, data) {
        var logLevel = window.isDevMode() ? "fatal" : "info";
        if (!name) {
            Logger.useLogger("JS_Tracking")[logLevel]("Tracker.prototype.recordEvent called without an event name.  Name: " + name);
            return
        }
        var newName = name.substring(0, 32);
        if (newName !== name) {
            Logger.useLogger("JS_Tracking")[logLevel]('recordEvent: Truncating name "' + name + '" to "' + newName + '".')
        }
        if (typeof data === "string") {
            data = "Event=1;EventType=" + newName + ";" + data
        } else {
            data = data || {};
            data.Event = "1";
            data.EventType = newName;
            data = _flattenRfCstmVars(data)
        }
        _spvTwo(false, false, data)
    };
    Tracker.prototype.setClickLocation = function (clickLocation, clickLocationMetadata) {
        Storage.cookie.set({
            key: "ClickLocation",
            value: clickLocation,
            ttl: 0
        });
        if (clickLocationMetadata && clickLocationMetadata.length) {
            Storage.cookie.set({
                key: "ClickLocationMetadata",
                value: clickLocationMetadata,
                ttl: 0
            })
        }
    };
    Tracker.prototype.appnexusTracking = function (wfEvent) {
        var actionType = wfEvent.data.actionType;
        var value, sku;
        if (wf.appData.product_data) {
            sku = wf.appData.product_data.sku || false;
            value = wf.appData.product_data.base_price || 0
        } else {
            if (wf.appData.pdpPrimarySku) {
                sku = wf.appData.pdpPrimarySku;
                var productDataProperty = "product_data_" + wf.appData.pdpPrimarySku;
                if (wf.appData[productDataProperty]) {
                    value = wf.appData[productDataProperty].base_price || 0
                }
            }
        }
        $.ajax({
            url: "/a/appnexus/event",
            data: {
                actionType: actionType,
                sku: sku,
                value: value
            }
        }).done(function (data) {
            if (data && data.url) {
                (new Image).src = data.url
            }
        })
    };

    function _runDotomi() {
        try {
            if (!pixelData.dotomi || pixelData.dotomi.dotomiRan) {
                return
            }
            var dtmUserId = wf.appData.session.customerID;
            if (!dtmUserId) {
                var cuid = $("#footer_orderrefcode:first");
                if (cuid) {
                    dtmUserId = cuid.getContent().replace(/-/g, "")
                }
            }
            if (dtmUserId) {
                pixelData.dotomi.dtm_user_id = dtmUserId
            }
            pixelData.dotomi.dotomiRan = true;
            var dtmSrc = window.location.protocol;
            if (pixelData.dotomi.is_receipt) {
                dtmSrc += "//login.dotomi.com/ucm/UCMController?dtm_com=29&dtm_fid=102&dtm_cid=2416&dtm_cmagic=5dec70&dtm_format=5"
            } else {
                dtmSrc += "//login.dotomi.com/ucm/UCMController?dtm_com=28&dtm_fid=101&dtm_cid=2416&dtm_cmagic=5dec70&dtm_format=5"
            }
            var dtmTimeout = 2e3;
            var dtmTag = {};
            dtmTag.cli_promo_id = pixelData.dotomi.cli_promo_id;
            dtmTag.dtm_user_id = dtmUserId;
            if (pixelData.dotomi.is_receipt) {
                dtmTimeout = 5e3;
                dtmTag.dtmc_transaction_id = pixelData.dotomi.dtmc_transaction_id;
                dtmTag.dtm_conv_val = pixelData.dotomi.dtm_conv_val;
                dtmTag.dtm_items = pixelData.dotomi.dtm_items;
                dtmTag.dtmc_source = pixelData.dotomi.dtmc_source
            } else {
                if (pixelData.dotomi.dtmc_category) {
                    dtmTag.dtmc_category = pixelData.dotomi.dtmc_category;
                    if (pixelData.dotomi.dtmc_sub_category) {
                        dtmTag.dtmc_sub_category = pixelData.dotomi.dtmc_sub_category;
                        if (pixelData.dotomi.dtmc_sub_sub_category) {
                            dtmTag.dtmc_sub_sub_category = pixelData.dotomi.dtmc_sub_sub_category
                        }
                    }
                }
                if (pixelData.dotomi.dtmc_prod_id) {
                    dtmTag.dtmc_prod_id = pixelData.dotomi.dtmc_prod_id;
                    if (pixelData.dotomi.dtmc_prod_img) {
                        dtmTag.dtmc_prod_img = pixelData.dotomi.dtmc_prod_img
                    }
                }
                dtmTag.dtmc_ref = document.referrer;
                dtmTag.dtmc_loc = document.location.href
            }
            for (var item in dtmTag) {
                if (typeof dtmTag[item] !== "function" && typeof dtmTag[item] !== "object") {
                    dtmSrc += "&" + item + "=" + window.escape(dtmTag[item])
                }
            }
            var dotomiDiv = $("#dtmdiv");
            window.setTimeout(function () {
                dotomiDiv.html("")
            }, dtmTimeout);
            if (dotomiDiv.length > 0) {
                var dotomiFrame = document.createElement("iframe");
                dotomiFrame.name = "response_frame";
                dotomiFrame.src = dtmSrc;
                dotomiDiv.append(dotomiFrame)
            }
        } catch (e) {
            Logger.useLogger("JS_Tracking").info("runDotomi failed", {
                module: "tracking",
                error: e
            })
        }
    }

    function _getCSNID() {
        var csnId = Storage.cookie.get({
            key: "CSN",
            subKey: "CSNID"
        });
        return csnId
    }

    function _naniganReg() {
        if (pixelData.nanigans_reg) {
            var i = new Image;
            i.src = "//api.nanigans.com/event.php?app_id=" + pixelData.nanigans_reg.app_id + "&type=" + pixelData.nanigans_reg.type + "&name=" + pixelData.nanigans_reg.name + "&user_id=" + wf.appData.session.customerID
        }
    }

    function _nanigansProd() {
        var nanProdViewPixel = $("#yui3-nanigans_product_view_pixel");
        var stringWithCuID = wf.appData.session && wf.appData.session.customerID ? "&user_id=" + wf.appData.session.customerID : "";
        if (nanProdViewPixel.length) {
            var nanHash = nanProdViewPixel.attr("data-nan_email_hash");
            nanHash = nanHash != null ? "&ut1=" + nanHash : "";
            var nanAppId = nanProdViewPixel.attr("data-nan_app_id");
            var nanPrSKU = nanProdViewPixel.attr("data-nan_prsku");
            var nanSrc = "//api.nanigans.com/event.php?app_id=" + nanAppId + "&type=user&name=product" + stringWithCuID + "&sku=" + nanPrSKU + nanHash;
            nanProdViewPixel.attr("src", nanSrc)
        }
    }

    function _appnexusGetUID() {
        if (wfPixelData.getuid_syncs) {
            _.each(wfPixelData.getuid_syncs, function (syncLink) {
                var i = new Image;
                i.src = syncLink
            })
        }
    }

    function _adExtent() {
        if (wfPixelData.adextent_urls) {
            _.each(wfPixelData.adextent_urls, function (url) {
                var i = new Image;
                i.src = url
            })
        }
    }
    Tracker.prototype.runOIQ = function () {
        if (wf.appData.OIQ) {
            $.ajax({
                url: document.location.protocol + wf.appData.OIQ.oiq_script_source,
                dataType: "script",
                asynch: true
            })
        }
        EventDispatch.trigger(EVENT_TYPE, {
            verb: "RESPONSE:RUNOIQ"
        })
    };
    Tracker.prototype.ginmGoogleAnalytics = function () {
        (function (i, s, o, g, r, a, m) {
            i["GoogleAnalyticsObject"] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date;
            a = s.createElement(o), m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, "script", "//www.google-analytics.com/analytics.js", "ga");
        window.ga("create", "UA-18587956-2", "auto");
        window.ga("send", "pageview");
        EventDispatch.trigger(EVENT_TYPE, {
            verb: "RESPONSE:GINM_GA_TRACKING"
        })
    };
    Tracker.prototype.tellApart = function (params) {
        if (!params || !params.hasOwnProperty("ta_breadcrumb")) {
            params = wf.appData.tp_data
        }
        if (wf.appData.disableTellapart) {
            return
        }
        var pageAlias = wf.appData.pageAlias != null ? wf.appData.pageAlias : "";
        var cacheBuster = (new Date).getTime();
        var tellapartData = {};
        var notAdmin = window.location.search.indexOf("notadmin=1") !== -1;
        var taValuesUrl = [wf.constants.STORE_URL, "/ajax/get_values_for_tellapart.php?bpss=yes", "&breadcrumb=", encodeURIComponent(params.ta_breadcrumb), "&sku=", encodeURIComponent(params.ta_sku), "&home=", encodeURIComponent(params.is_homepage), "&page_alias=", encodeURIComponent(pageAlias), "&cb=", cacheBuster].join("");
        if (notAdmin) {
            taValuesUrl += "&notadmin=1"
        }
        var taValuesSuccess = function (data) {
            var o = {};
            o.responseText = data;
            if (o.responseText != null && o.responseText.length > 0) {
                var taValues = $.parseJSON(o.responseText);
                tellapartData.ta_code = taValues.ta_code;
                tellapartData.page_type = taValues.ta_page_type;
                tellapartData.guid = taValues.guid;
                tellapartData.action_type = "pv";
                tellapartData.user_id = taValues.user_id;
                if (taValues.ta_page_type === "ProductCategory") {
                    tellapartData.product_category_path = params.ta_breadcrumb
                } else if (taValues.ta_page_type === "Product") {
                    tellapartData.sku = params.ta_sku
                } else if (wf.appData.session.loggedIn === true) {
                    tellapartData.action_type = "login"
                }
                if (taValues.customer_is_new_buyer === false) {
                    tellapartData.is_new_buyer = "false";
                    tellapartData.num_orders = taValues.customer_order_count;
                    tellapartData.last_order_time = taValues.customer_last_order_date
                } else if (taValues.customer_is_new_buyer === true) {
                    tellapartData.is_new_buyer = "true"
                } else {
                    tellapartData.is_new_buyer = "unknown"
                }
                var doTellApart = function () {
                    __cmbLoaded = false;
                    var tryDAgain = false;
                    (function () {
                        var d = function () {
                            if (window.TellApartCrumb == null) {
                                if (!tryDAgain) {
                                    Logger.useLogger("JS_Tracking").info("TellApartCrumb is undefined, will try once more in 100ms.", {
                                        module: "tracking"
                                    });
                                    window.setTimeout(function () {
                                        d()
                                    }, 100);
                                    tryDAgain = true
                                } else {
                                    Logger.useLogger("JS_Tracking").info("Tellapart tag failed. TellApartCrumb is undefined.", {
                                        module: "tracking"
                                    })
                                }
                                return
                            } else {
                                if (window.TellApartCrumb.makeCrumbAction == null) {
                                    if (!tryDAgain) {
                                        Logger.useLogger("JS_Tracking").info("TellApartCrumb.makeCrumbAction is undefined, will try once more in 100ms.", {
                                            module: "tracking"
                                        });
                                        window.setTimeout(function () {
                                            d()
                                        }, 100);
                                        tryDAgain = true
                                    } else {
                                        Logger.useLogger("JS_Tracking").info("Tellapart tag failed. TellApartCrumb != null but TellApartCrumb.makeCrumbAction is undefined.", {
                                            module: "tracking"
                                        })
                                    }
                                    return
                                }
                                try {
                                    var action = window.TellApartCrumb.makeCrumbAction(taValues.ta_code, tellapartData.action_type);
                                    action.setActionAttr("PageType", taValues.ta_page_type);
                                    if (taValues.ta_page_type === "ProductCategory") {
                                        action.setActionAttr("ProductCategoryPath", tellapartData.product_category_path)
                                    } else if (taValues.ta_page_type === "Product") {
                                        action.setActionAttr("SKU", tellapartData.sku)
                                    } else if (wf.appData.session.loggedIn === true) {
                                        action.setActionAttr("City", tellapartData.city);
                                        action.setActionAttr("ehash", tellapartData.email_hash)
                                    }
                                    if (taValues.customer_is_new_buyer === false) {
                                        action.setActionAttr("X-NumOrders", tellapartData.num_orders);
                                        action.setActionAttr("X-LastOrderTime", tellapartData.last_order_time)
                                    }
                                    action.setActionAttr("X-IsNewBuyer", tellapartData.is_new_buyer);
                                    action.setMerchantGuestId(tellapartData.guid);
                                    action.setMerchantUserId(tellapartData.user_id);
                                    action.finalize()
                                } catch (e) {
                                    Logger.useLogger("JS_Tracking").info("Tellapart tag failed.", {
                                        module: "tracking",
                                        error: e
                                    })
                                }
                            }
                        };
                        try {
                            var b = null;
                            if ("https:" === document.location.protocol) {
                                b = "https://secure.common.csnimages.com/includes/js/crumb.js"
                            } else {
                                for (var f = window.navigator.userAgent, g = 0, c = 0, h = f.length; c < h; c++) {
                                    g ^= f.charCodeAt(c)
                                }
                                b = "http://common.csnimages.com/includes/js/crumb.js"
                            }
                            var a = document.createElement("script");
                            a.src = b;
                            a.asynch = true;
                            a.onload = function () {
                                if (!__cmbLoaded) {
                                    __cmbLoaded = true;
                                    d()
                                }
                            };
                            a.onreadystatechange = function () {
                                if (/loaded|complete/.test(a.readyState) && !__cmbLoaded) {
                                    __cmbLoaded = true;
                                    d()
                                }
                            };
                            document.getElementsByTagName("head")[0].appendChild(a)
                        } catch (e) {
                            Logger.useLogger("JS_Tracking").info("Tellapart crumb failed.", {
                                module: "tracking",
                                error: e
                            })
                        }
                    })()
                };
                pixelData.tellapart = tellapartData;
                $(document).trigger("tellapartLoaded");
                EventDispatch.trigger(EVENT_TYPE, {
                    verb: "RESPONSE:TELLAPART"
                });
                __cmbLoaded = false;
                doTellApart()
            }
        };
        if (!wf.constants.blinds_page) {
            $.ajax({
                url: taValuesUrl,
                success: taValuesSuccess,
                type: "GET",
                dataType: "text",
                cancellable: false
            })
        }
    };
    Tracker.prototype.getScribeUrl = function () {
        return window.location.protocol + "//t." + wf.constants.STORE_DOMAIN + "/b.php"
    };
    Tracker.prototype.inscribe = function (data) {
        var image = new Image(1, 1);
        data.transactionId = wf.constants.TRANSACTION_ID;
        data.storeId = wf.constants.STORE_ID;
        data.timestamp = Date.now();
        image.src = this.getScribeUrl() + "?" + $.param(data)
    };
    Tracker.prototype.firePixelsIntoTrackingFooter = function (pixelMap) {
        var $trackingFooter = $("#tracking-footer");
        if ($trackingFooter.length) {
            _.each(pixelMap, function (pixel) {
                $trackingFooter.append(pixel)
            })
        }
    };
    Tracker.prototype.firePixelsFromTrackingAction = function (action, data) {
        $.ajax({
            Type: "POST",
            dataType: "json",
            url: "/a/tracking/get_pixels_from_tracking_action",
            data: {
                action: action,
                data: data
            }
        }).done(function (data) {
            Tracker.prototype.firePixelsIntoTrackingFooter(data.pixels)
        })
    };
    exports = new Tracker;
    exports.spvTwo = _spvTwo;
    exports._getCSNID = _getCSNID;
    exports.init = function () {
        try {
            if (!wf.appData.spvTracking.DelayCall) {
                _spvTwo()
            }
            _naniganReg();
            _runDotomi();
            _nanigansProd();
            _appnexusGetUID();
            _adExtent()
        } catch (err) {
            Logger.useLogger("JS_Tracking").info("Tracker window.onload(): " + err.message, {
                error: err,
                module: "tracking"
            })
        }
    };
    trackingRoot.Tracker = exports;
    window.Tracker = exports;
    Scheduler.queuePostLoadTask(exports.init);
    return exports
});
define("scroll_to_top", ["wayfair", "jquery", "underscore"], function (wf, $, _) {
    "use strict";
    var pluginName = "scrollToTop",
        defaults = {
            scrollThreshold: 800,
            widthAlignmentThreshold: 1405,
            wideAlignClass: "browseralign",
            narrowAlignClass: "prodgridalign",
            fadeOutTime: 400,
            fadeInTime: 200,
            scrollTime: 500,
            throttleTime: 100
        };

    function ScrollToTop(element, options) {
        this.$el = $(element);
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init()
    }
    var showBackToTop = wf.constants.STORE_ID !== wf.constants.JOSSANDMAIN_ID && !$.featureDetect.isTouch() || wf.constants.STORE_ID === wf.constants.JOSSANDMAIN_ID && !$.featureDetect.isPhone();
    ScrollToTop.prototype = {
        init: function () {
            if (showBackToTop) {
                this._midAnimation = this._visible = false;
                this._alignButton();
                this._attachListeners();
                this.$el.css("display", "none");
                this.$el.removeClass("hidden-node");
                this._checkScrollPosition()
            }
        },
        _attachListeners: function () {
            wf.$win.on({
                "scroll.scrollToTop": _.throttle($.proxy(this._checkScrollPosition, this), this.settings.throttleTime),
                "resize.scrollToTop": _.throttle($.proxy(this._alignButton, this), this.settings.throttleTime)
            });
            this.$el.on("click.scrollToTop", $.proxy(this._scrollToTop, this))
        },
        _fadeIn: function () {
            this._midAnimation = true;
            this.$el.css({
                display: "block",
                opacity: 0
            });
            this.$el.animate({
                opacity: 1
            }, this.settings.fadeInTime, $.proxy(function () {
                this._visible = true;
                this._midAnimation = false
            }, this));
            this.$el.trigger("fadein")
        },
        _fadeOut: function () {
            this._midAnimation = true;
            this.$el.animate({
                opacity: 0
            }, this.settings.fadeOutTime, $.proxy(function () {
                this._visible = this._midAnimation = false;
                this.$el.hide()
            }, this));
            this.$el.trigger("fadeout")
        },
        _checkScrollPosition: function () {
            if (!this._midAnimation) {
                var scrollTop = wf.$win.scrollTop();
                if (this._visible && this.settings.scrollThreshold > scrollTop) {
                    this._fadeOut()
                } else if (!this._visible && this.settings.scrollThreshold < scrollTop) {
                    this._fadeIn()
                }
            }
        },
        _scrollToTop: function () {
            if (!this.midAnimation) {
                this._midAnimation = true;
                if (window.ga) {
                    window.ga("send", "event", "ScrollTop", "Click", window.location.pathname)
                }
                this._fadeOut();
                $("html, body").animate({
                    scrollTop: 0
                }, this.settings.scrollTime, $.proxy(function () {
                    this._midAnimation = false
                }, this))
            }
        },
        _alignButton: function () {
            if (this.settings.widthAlignmentThreshold) {
                var windowWidth = wf.$win.width();
                if (windowWidth < this.settings.widthAlignmentThreshold) {
                    this.$el.removeClass(this.settings.narrowAlignClass);
                    this.$el.addClass(this.settings.wideAlignClass)
                } else if (windowWidth >= this.settings.widthAlignmentThreshold) {
                    this.$el.removeClass(this.settings.wideAlignClass);
                    this.$el.addClass(this.settings.narrowAlignClass)
                }
            }
        },
        destroy: function () {
            wf.$win.off(".scrollToTop");
            this.$el.off(".scrollToTop");
            this.$el.addClass("hidden-node")
        }
    };
    $.fn[pluginName] = function (options) {
        this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new ScrollToTop(this, options))
            }
        });
        return this
    };
    return $
});
define("init_autocomplete_v2", ["@Templates/stores/header/search/bar_view", "jquery", "underscore", "wayfair", "featuredetect", "header_search_bar_view", "header_search_bar_model", "placeholder"], function (autocompleteTemplate, $, _, wf, featureDetect, SearchBarView, SearchBarModel) {
    "use strict";
    var template = autocompleteTemplate;
    var autocomplete = $(".js-autocomplete");
    if (autocomplete.length > 0) {
        var options = wf.get("modelData.autocomplete") || {};
        new SearchBarView({
            el: autocomplete[0],
            template: template,
            model: new SearchBarModel(_.extend(options, {
                url: wf.constants.STORE_URL + "/a/search/suggestions?v=2&q=",
                minimumLength: 1,
                lnrs_brand_lower: "brand",
                lnrs_in: "in",
                isFocused: false
            }))
        })
    }
    if (!featureDetect.inputSupport("placeholder")) {
        var placeholderInputs = $("input[placeholder], textarea[placeholder]");
        placeholderInputs.placeholder()
    }
    return true
});
define("performance_timing", ["jquery", "wayfair", "featuredetect", "logger"], function ($, wf, featureDetect, Logger) {
    "use strict";
    var performanceTiming = {};
    var handleEventTarget = window;
    var handlerEventName = "load";
    var sendAjaxData = true;
    if (featureDetect.isMobile()) {
        if (typeof document.visibilityState === "undefined" || typeof document.hidden === "undefined") {
            Logger.useLogger("performance_timing").info("[rum_performance] Browser doesn't support PageVisibilityAPI")
        } else {
            wf.$doc.on("visibilitychange", function () {
                sendAjaxData = false
            })
        }
    }
    $(handleEventTarget).on(handlerEventName, function () {
        var nowTime = (new Date).getTime();
        setTimeout(function () {
            if (window.performance != null) {
                var performance = window.performance;
                var onLoadTime = nowTime - performance.timing.navigationStart;
                if (window.ga) {
                    window.ga("b.send", "timing", "PageLoad", "onload", onLoadTime);
                    window.ga("b.send", "timing", "PageLoad", "wfDone", wf.appData.WAYFAIR_DONE_TIME)
                }
                performanceTiming.connectEnd = performance.timing.connectEnd;
                performanceTiming.connectStart = performance.timing.connectStart;
                performanceTiming.secureConnectionStart = performance.timing.secureConnectionStart != null ? performance.timing.secureConnectionStart : 0;
                performanceTiming.domComplete = performance.timing.domComplete;
                performanceTiming.domContentLoadedEventEnd = performance.timing.domContentLoadedEventEnd;
                performanceTiming.domContentLoadedEventStart = performance.timing.domContentLoadedEventStart;
                performanceTiming.domInteractive = performance.timing.domInteractive;
                performanceTiming.domLoading = performance.timing.domLoading;
                performanceTiming.domainLookupEnd = performance.timing.domainLookupEnd;
                performanceTiming.domainLookupStart = performance.timing.domainLookupStart;
                performanceTiming.fetchStart = performance.timing.fetchStart;
                performanceTiming.loadEventEnd = performance.timing.loadEventEnd;
                performanceTiming.loadEventStart = performance.timing.loadEventStart;
                performanceTiming.navigationStart = performance.timing.navigationStart;
                performanceTiming.redirectEnd = performance.timing.redirectEnd;
                performanceTiming.redirectStart = performance.timing.redirectStart;
                performanceTiming.requestStart = performance.timing.requestStart;
                performanceTiming.responseEnd = performance.timing.responseEnd;
                performanceTiming.responseStart = performance.timing.responseStart;
                performanceTiming.unloadEventEnd = performance.timing.unloadEventEnd;
                performanceTiming.unloadEventStart = performance.timing.unloadEventStart
            }
            performanceTiming.page = wf.constants.PAGE;
            performanceTiming.query_string = window.YUI_config.app.queryString;
            performanceTiming.showstats = window.YUI_config.app.showStats;
            performanceTiming.transaction_id = wf.constants.TRANSACTION_ID;
            if (sendAjaxData) {
                $.ajax({
                    url: wf.constants.STORE_URL + "/a/performance_timing/log",
                    type: "POST",
                    data: performanceTiming
                })
            }
        }, 2)
    });
    return {
        stats: performanceTiming
    }
});
define("modal_quickview", ["jquery", "wayfair", "event_dispatch", "url_utils", "wf_scheduler", "sitespect", "wf_modal_view", "quickview_modal_model", "quickview_modal_view", "thankyou_modal_model", "thankyou_modal_view", "lazy!modal_quickview_lazy"], function ($, wf, EventDispatch, UrlUtils, wfScheduler, SiteSpect, ModalView, QuickviewModalModel, QuickviewModalView, ThankyouModalModel, ThankyouModalView, modalQuickviewPromise) {
    "use strict";
    var QuickViewModalView = ModalView.extend({
        _position: function (winSize) {
            this.$el.css({
                left: Math.abs((winSize.width - this.$el.width()) / 2),
                top: wf.$doc.scrollTop() + Math.abs((winSize.height - this.$el.height()) / 2)
            })
        }
    });
    var quickview = {};
    var currentModal = null;
    var quickviewEnabled = wf.features && wf.features.quickview_enabled && !SiteSpect.sitespectCookieContains("ss_pt2714596_no_quickview");
    if (quickviewEnabled) {
        modalQuickviewPromise.done(function (qv) {
            quickview = qv
        })
    }
    var loadQuickviewProduct = function (data) {
        modalQuickviewPromise.done(function () {
            var model = new QuickviewModalModel;
            if (currentModal != null) {
                currentModal.close()
            }
            quickview.Waiting("show");
            model.fetchQuickView(data).done(function () {
                quickview.Waiting("hide");
                currentModal = new QuickViewModalView({
                    TungstenView: QuickviewModalView,
                    tungstenModel: model,
                    transitionClass: "",
                    modalClass: "modal_wrapper modal_regular quickview js-quickview-modal",
                    clickOverlayToClose: true
                });
                quickview.dynamic_pricing();
                quickview.Carousel();
                EventDispatch.trigger(wf.constants.eventTypes.TRACKING_EVENT_TYPE, {
                    verb: "SPVTWO",
                    data: {
                        rfLocation: wf.constants.QUICKVIEW_URL + "?sku=" + data.sku,
                        rfHTTPReferrer: document.location.href,
                        rfCstmVars: "PageType=ProductQuickview;ID=" + data.sku
                    }
                });
                EventDispatch.on(wf.constants.eventTypes.CART_UPDATE_EVENT_TYPE, {
                    verb: wf.constants.BASKET_COUNT_VERB
                }, CartUpdated)
            })
        })
    };
    var CartUpdated = function (e) {
        if (e.verb !== "BASKET_COUNT") {
            return
        }
        if (e.data && e.data.addedCfg) {
            loadThankyou(e.data.addedCfg)
        }
    };
    var loadThankyou = function (addedCfg) {
        var model = new ThankyouModalModel;
        model.fetchThankyou(addedCfg).done(function () {
            if (currentModal != null) {
                currentModal.close()
            }
            currentModal = new QuickViewModalView({
                TungstenView: ThankyouModalView,
                tungstenModel: model,
                transitionClass: "",
                modalClass: "modal_wrapper modal_regular quickview js-quickview-modal",
                clickOverlayToClose: true
            })
        })
    };

    function initQuickviewButtonEvents() {
        wf.$body.one("mouseenter", ".jq-quickview", modalQuickviewPromise.load);
        wf.$body.one("mouseenter", ".js-qv-thumbnail", modalQuickviewPromise.load);
        wf.$body.on("click", ".jq-quickview", function (e) {
            e.preventDefault();
            SiteSpect.trackEvent("launch_quickview");
            var $quickviewSelector = $(e.currentTarget),
                productUrl = $quickviewSelector.data("product-block-url"),
                allowbrowse = $quickviewSelector.data("allow-browse"),
                sku = UrlUtils.extractParamFromUri(productUrl, "sku"),
                ds = UrlUtils.extractParamFromUri(productUrl, "ds"),
                piid = UrlUtils.extractParamFromUri(productUrl, "PiID[]");
            if (productUrl == null) {
                sku = $(e.target).data("sku")
            }
            if (sku == null && productUrl == null) {
                productUrl = $(e.target).closest(".jq-quickview").data("product-block-url");
                sku = UrlUtils.extractParamFromUri(productUrl, "sku");
                ds = UrlUtils.extractParamFromUri(productUrl, "ds");
                piid = UrlUtils.extractParamFromUri(productUrl, "PiID[]")
            }
            if (sku == null) {
                sku = UrlUtils.extractParamFromUri(e.target.href, "sku");
                piid = UrlUtils.extractParamFromUri(e.target.href, "PiID[]")
            }
            if (sku == null) {
                return
            }
            var requiredItems = UrlUtils.extractParamFromUri(e.target.href, "show_required_items");
            if ($(e.target).hasClass("ProductRequiredItemsCarousel-item-checkbox")) {
                requiredItems = true
            }
            loadQuickviewProduct({
                sku: sku,
                allowbrowse: allowbrowse,
                ds: ds,
                showRequiredItems: requiredItems,
                "piID[]": piid
            })
        });
        wf.$body.on("click", ".js-qv-thumbnail", function (e) {
            e.preventDefault();
            SiteSpect.trackEvent("launch_quickview");
            var evt = {
                preventDefault: $.noop,
                currentTarget: e.currentTarget
            };
            modalQuickviewPromise.done(function () {
                quickview.showProductImage(evt)
            });
            modalQuickviewPromise.load()
        });
        wf.$body.on("click", ".js-energy-label-btn", function (e) {
            e.preventDefault()
        });
        wf.$body.on("click", ".js-keep-shopping", function (e) {
            e.preventDefault();
            if (this.tungstenView) {
                this.tungstenView.destroy();
                this.tungstenView = null
            }
            $(".js-quickview-modal").remove();
            $(".modal_overlay").remove()
        })
    }
    if (quickviewEnabled && !($.featureDetect.isIE() && $.featureDetect.browserVersion() === 7)) {
        wfScheduler.queuePostLoadTask(initQuickviewButtonEvents)
    } else {
        $(".js-quickview-btn").addClass("hidden-node")
    }
    return {
        loadQuickviewProduct: loadQuickviewProduct
    }
});
define("gmedia", ["jquery", "afc", "dom_utils", "wf_storage", "wayfair", "event_dispatch"], function ($, afc, domUtils, storage, wf, EventDispatch) {
    "use strict";
    var exports = {},
        CSA_ID_PREFIX = "csa_",
        AD_BLOCK_PREFIX = "adsense_";
    var _addBreakHint = function (entireMatch, firstGroup, secondGroup, thirdGroup, fourthGroup) {
        var newline = firstGroup + "&shy;&#8203;" + secondGroup;
        if (typeof thirdGroup !== "undefined") {
            newline = newline + "&shy;&#8203;" + thirdGroup
        }
        if (typeof fourthGroup !== "undefined") {
            newline = newline + "&shy;&#8203;" + fourthGroup
        }
        return newline
    };
    var _insertWordBreakSuggestions = function (line, isTitle) {
        var regex = /([^\s\-]{16,20}[^(<\/\?)])([^>][^\s\-]{3,7}[^(<\/\?)])([^>][^\s\-]{3,7}[^(<\/\?)])?([^(<\/\?)>])?/g;
        if (isTitle) {
            regex = /([^\s\-]{14,18}[^(<\/\?)])([^>][^\s\-]{2,6}[^(<\/\?)])([^>][^\s\-]{3,7}[^(<\/\?)])?([^(<\/\?)>])?/g
        }
        return line.replace(regex, _addBreakHint)
    };
    var _buildHtmlForGoogleTextAd = function (ad) {
        var currentAd = '<li><div><a class="afs_ad_title emphasis secondarytextmed" href="' + ad.url + '" target="_blank">' + _insertWordBreakSuggestions(ad.line1, true) + "</a></div>";
        currentAd += '<div class="ltbodytext">' + _insertWordBreakSuggestions(ad.line2 + " " + ad.line3) + "</div>";
        var maxLinkLength = 24,
            line = ad.visible_url;
        line = line.replace(/^http:\/\//i, "");
        line = line.replace(/\/$/, "");
        if (line.length > maxLinkLength) {
            var found = false,
                startAt = 0,
                slashPosition = 0;
            while (!found && slashPosition >= 0) {
                slashPosition = line.indexOf("/", startAt);
                if (slashPosition > 0 && slashPosition !== line.indexOf("</", startAt) + 1) {
                    found = true;
                    line = line.substr(0, slashPosition)
                } else {
                    startAt = slashPosition + 1
                }
            }
        }
        if (line.length > maxLinkLength && line.indexOf("www.") === 0) {
            line = line.substr(4)
        }
        if (line.length > maxLinkLength) {
            line = _insertWordBreakSuggestions(line)
        }
        currentAd += '<div><a class="afs_ad_url cleanlink" href="' + ad.url + '"  target="_blank">';
        currentAd += line + "</a></div>";
        if (ad.formatted_address) {
            currentAd += '<div class="afsAddress">' + ad.formatted_address + "</div>"
        }
        currentAd += "</li>";
        return currentAd
    };
    var _googleCSABlock = function (googleCsaArgs, startCSABlock, endCSABlock, loc, currAdCount) {
        var config = {
            fontSizeTitle: "13px",
            fontSizeDescription: "13px",
            fontSizeDomainLink: "15px",
            colorTitleLink: "#3905FF",
            colorAdSeparator: "#D9D9D9",
            colorDomainLink: "#3905FF",
            colorText: "#9D9D9D",
            sellerRatings: true,
            siteLinks: true,
            instantPreviews: false,
            adLayout: "sellerFirst",
            backgroundColor: "#FFFFFF",
            colorAttribution: "#4D4D4F",
            verticalSpacing: "20px",
            border: "1px",
            fontFamily: "verdana"
        };
        config.width = "530px";
        var conName = CSA_ID_PREFIX + loc;
        config.container = conName;
        config.number = currAdCount + "";
        config.fontSizeAttribution = "16px";
        config.adLoadedCallback = exports.googleCSARequestDone;
        var elem = $("#" + AD_BLOCK_PREFIX + loc);
        if (elem !== null) {
            if (currAdCount > 0) {
                googleCsaArgs.push(config);
                elem.html(startCSABlock + conName + endCSABlock);
                domUtils.ajaxToggle(elem, true)
            } else {
                domUtils.ajaxToggle(elem, false)
            }
        }
    };
    var _googleCSA = function (googleCsaArgs, numAds) {
        var foundBottomAds = 0,
            startCSABlock = '<div class="afs_ad_block"><div id="',
            startCSABlockR = '<div class="afs_ad_block"><div id="',
            endCSABlock = '"></div></div>';
        for (var i = 0; i < numAds; i++) {
            if (i < wf.tracking.gmedia.BottomAdCount) {
                foundBottomAds++
            }
        }
        _googleCSABlock(googleCsaArgs, startCSABlock, endCSABlock, "bottom", foundBottomAds, wf.tracking.gmedia.BottomAdCount, 0);
        return googleCsaArgs
    };
    var _hideAllAdsense = function () {
        $(".adsensefs, .adsensefc").each(function (node) {
            domUtils.ajaxToggle(node, false)
        })
    };
    var _hideSponsoredAds = function () {
        var shouldHide = storage.cookie.get({
            key: "CSNHideSponsoredAds"
        }) === "1";
        if (shouldHide) {
            $(".adsensefs, .adsensefc").each(function (node) {
                domUtils.ajaxToggle(node, false)
            })
        }
        return shouldHide
    };
    exports.startAdsense = function () {
        $.ajax({
            url: "//www.google.com/adsense/search/ads.js",
            dataType: "script",
            cache: true
        }).done(function () {
            if (_hideSponsoredAds() || typeof google === "undefined") {
                return
            }
            switch (parseInt(wf.tracking.gmedia.adsenseLanguage, 10)) {
            case 3:
                wf.tracking.gmedia.adsenseLanguage = "de";
                break;
            default:
                wf.tracking.gmedia.adsenseLanguage = "en";
                break
            }
            var adsenseStarted = false;
            var landingChannel = "onlanding";
            var SessionCookie = storage.cookie.get({
                key: "FirstInSession"
            });
            var numAds = 0;
            if (SessionCookie) {
                landingChannel = "notonlanding"
            } else {
                storage.cookie.set({
                    key: "FirstInSession",
                    value: "1"
                });
                var pageReferrer = document.referrer;
                if (wf.constants.STORE_DOMAIN && pageReferrer !== "") {
                    pageReferrer = pageReferrer.replace(".*://", "");
                    var urlIndex = pageReferrer.indexOf("[?/]");
                    if (urlIndex >= 0) {
                        pageReferrer = pageReferrer.substring(0, urlIndex)
                    }
                    if (pageReferrer === wf.constants.STORE_DOMAIN) {
                        landingChannel = "notonlanding"
                    }
                } else {
                    SessionCookie = storage.cookie.get({
                        key: "FirstInSession"
                    });
                    if (!SessionCookie) {
                        landingChannel = "unknowniflanding"
                    }
                }
            }
            if (wf.tracking.gmedia.doAFS && wf.tracking.gmedia.doAFS !== "") {
                if (wf.tracking.gmedia.AdPositions.indexOf("B") < 0 || !document.getElementById("adsense_bottom")) {
                    wf.tracking.gmedia.BottomAdCount = 0
                }
                numAds = wf.tracking.gmedia.BottomAdCount;
                if (numAds > 0) {
                    var uselessTerms = /(^|^All|Browse\sBy\sBrand|Shop\sBy\s(Room|Item|Brand)|Featured\sBrands|Best\sSellers|Sales\sand\Promotions)\s*&#0187;\s+/gi;
                    var extraWhitespaceAroundDelimiters = /\s+\|\s+/g;
                    if (typeof window.google_csa_query !== "undefined") {
                        window.google_csa_query = $.trim(window.google_csa_query);
                        if (window.google_csa_query.length > 0) {
                            window.google_csa_query = window.google_csa_query.replace(uselessTerms, "");
                            if (typeof window.google_csa_qry_ctxt !== "undefined" && window.google_csa_qry_ctxt.length > 0) {
                                window.google_csa_qry_ctxt = window.google_csa_qry_ctxt.replace(extraWhitespaceAroundDelimiters, "|")
                            }
                            window.google_csa_ad = "n" + numAds;
                            window.google_csa_adpage = "1";
                            if (typeof window.google_csa_channel === "undefined") {
                                window.google_csa_channel = wf.tracking.gmedia.AdPositions
                            }
                            window.google_csa_adsafe = "high";
                            window.google_csa_adext = "l1";
                            var googleCsaArgs = [];
                            var verticalSpacing = "20px";
                            var pageOptions = {
                                pubId: window.google_csa_client,
                                adTest: window.google_csa_adtest,
                                hl: wf.tracking.gmedia.adsenseLanguage,
                                linkTarget: "_blank",
                                query: window.google_csa_query,
                                channel: window.google_csa_channel.replace(/,/g, "+"),
                                verticalSpacing: verticalSpacing,
                                sellerRatings: true,
                                titleBold: true,
                                siteLinks: true,
                                instantPreviews: false,
                                longerHeadlines: true,
                                oe: "latin1"
                            };
                            googleCsaArgs.push(pageOptions);
                            googleCsaArgs = _googleCSA(googleCsaArgs, numAds);
                            switch (googleCsaArgs.length) {
                            case 1:
                                new window.google.ads.search.Ads(googleCsaArgs[0]);
                                break;
                            case 2:
                                new window.google.ads.search.Ads(googleCsaArgs[0], googleCsaArgs[1]);
                                break;
                            case 3:
                                new window.google.ads.search.Ads(googleCsaArgs[0], googleCsaArgs[1], googleCsaArgs[2]);
                                break;
                            case 4:
                                new window.google.ads.search.Ads(googleCsaArgs[0], googleCsaArgs[1], googleCsaArgs[2], googleCsaArgs[3]);
                                break;
                            case 5:
                                new window.google.ads.search.Ads(googleCsaArgs[0], googleCsaArgs[1], googleCsaArgs[2], googleCsaArgs[3], googleCsaArgs[4]);
                                break;
                            default:
                                var a = [];
                                for (var i = 0; i < googleCsaArgs.length; i++) {
                                    a[i] = "google_csa_args[" + i + "]"
                                }
                                eval("new google.ads.search.Ads(" + a.join() + ")");
                                break
                            }
                            adsenseStarted = true;
                            EventDispatch.trigger(wf.constants.eventTypes.OPENX_EVENT_TYPE, {
                                verb: "AD_AVAILABLE",
                                data: {
                                    zone: "adsense_bottom"
                                }
                            })
                        }
                    }
                }
            }
            if (!adsenseStarted) {
                _hideAllAdsense(null)
            }
        })
    };
    exports.makeAdsenseBlockUnique = function () {
        var randNum = Math.floor(Math.random() * 1e6 + 1);
        $("#bottomAds").attr("id", "bottomAds_" + randNum);
        $("#adsense_bottom").attr("id", "adsense_bottom_" + randNum);
        $("#csa_bottom").attr("id", "csa_bottom_" + randNum)
    };
    wf.tracking.gmedia = $.extend(wf.tracking.gmedia, exports);
    return exports
});
define("site_feedback", ["jquery", "dom_utils", "wayfair"], function ($, domUtils, wf) {
    "use strict";
    var inlinesubmitted = false;
    var yui3InlineFeedbackPanel = $(".yui3-inline-feedback-panel"),
        inlineHandler = function (e) {
            e.preventDefault();
            var form = $(this);
            var formSubmitted = $(this).next(".js-feedback-submitted");
            form.find(".submit_button").prop("disabled", true);
            var feedbackText = form.find(".yui3-feedback-text:first").val();
            if (feedbackText && feedbackText !== "" && feedbackText !== "Detail wrong information here.") {
                $.ajax({
                    url: window.YUI_config.app.store_url + "/session/public/ajax/register_feedback.php",
                    method: "POST",
                    data: form.serialize(),
                    success: function () {
                        form.addClass("hidden-node");
                        formSubmitted.removeClass("hidden-node");
                        form.find("textarea").val("");
                        inlinesubmitted = true
                    }
                })
            }
        };
    if (yui3InlineFeedbackPanel.length > 0) {
        yui3InlineFeedbackPanel.find(".url").val(window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search);
        yui3InlineFeedbackPanel.find(".browser").val($.featureDetect.browserName() + " " + $.featureDetect.browserVersion());
        yui3InlineFeedbackPanel.find(".os").val($.featureDetect.OS());
        yui3InlineFeedbackPanel.find(".yui3-inline-feedback-form").on("submit", inlineHandler)
    }
    $(".yui3-blur-text").on("blur", domUtils.showBlurText).on("focus", domUtils.hideBlurText);
    return true
});
define("modal_utility_functions", ["jquery", "event_dispatch", "wayfair", "bootstrap-modal"], function ($, EventDispatch, wf) {
    "use strict";
    $.centeredModal = function (className, id, config) {
        var modalDiv, containerDiv;
        if (id) {
            modalDiv = $("#" + id);
            if (modalDiv.length) {
                return modalDiv
            }
        }
        modalDiv = $("<div " + (id ? 'id="' + id + '"' : "") + ' class="modal modal-centered ' + (className || "") + '">' + '<div class="modal-body"></div>' + "</div>");
        containerDiv = $('<div class="modal-container"></div>');
        modalDiv.modal($.extend({
            show: false,
            centered: true
        }, config || {}));
        wf.$body.append(containerDiv);
        containerDiv.append(modalDiv);
        if (!config || !config.persistOnHide) {
            modalDiv.on("hidden", function () {
                modalDiv.modal("setHTML", "")
            })
        }
        return modalDiv
    };
    $.modalUtils = {
        renderFacebookLikeButton: function (id) {
            var likeElement = $(id + " .socialcontainer .js-fb-like-delayed");
            if (likeElement.hasClass("hidden-node")) {
                EventDispatch.trigger(wf.constants.eventTypes.FACEBOOK_EVENT_TYPE, {
                    verb: "GET_FACEBOOK_LIKE",
                    data: {
                        elementSelector: likeElement[0]
                    }
                })
            }
        },
        pushTrackingStats: function (url, selector) {
            var trackingInfoNode = $(selector);
            if (trackingInfoNode.length > 0) {
                var accountNumber = trackingInfoNode.data("acct-num"),
                    domainName = trackingInfoNode.data("domain-name"),
                    pageType = trackingInfoNode.data("page-type"),
                    marketingCategory = trackingInfoNode.data("marketing-category"),
                    clName = trackingInfoNode.data("class-name"),
                    maName = trackingInfoNode.data("manu-name");
                if (window.ga_push) {
                    window.ga_push(accountNumber, domainName, pageType, marketingCategory, clName, maName, url)
                }
                wf.appData.spvTracking.CustomVars = trackingInfoNode.data("custom-vars")
            }
            EventDispatch.trigger(wf.constants.eventTypes.TRACKING_EVENT_TYPE, {
                verb: "SPVTWO",
                data: {
                    rfLocation: url,
                    rfHTTPReferrer: document.location.href
                }
            })
        }
    };
    $.fn.getFormData = function (selector) {
        if (!selector) {
            selector = "form"
        }
        return $(this).find(selector).serializeArray()
    };
    return $
});
define("jquery_flexsliderrotate", ["jquery", "jquery-flexslider", "flexslider_utility"], function ($) {
    "use strict";
    $.fn.flexsliderRotate = function () {
        this.each(function (index, el) {
            var animDuration = 500,
                slideDuration = 6e3,
                elObj = $(el),
                pauseOnHover = elObj.find(".pause_on_hover").length > 0,
                pauseOnClick = elObj.find(".pause_on_click").length > 0,
                isSlideShow = !elObj.hasClass("autorotateoff"),
                crossFade = elObj.hasClass("crossfade"),
                slowTransition = elObj.hasClass("slowtransition"),
                animStyle = crossFade && !$.featureDetect.isTouch() ? "fade" : "slide";
            animDuration = slowTransition ? 1500 : animDuration;
            if (animStyle === "slide") {
                elObj.find("li").css({
                    display: "block",
                    height: "" + elObj.height() + "px"
                })
            }
            elObj.addClass("flexslider").flexslider({
                animation: animStyle,
                directionNav: false,
                controlNav: true,
                slideshow: isSlideShow,
                slideshowSpeed: slideDuration,
                animationSpeed: animDuration,
                pauseOnHover: pauseOnHover,
                pauseOnAction: pauseOnClick,
                after: function (slider) {
                    if (slider.playing === false) {
                        $.flexsliderUtility.trackEvent("Banner")
                    }
                }
            })
        });
        return this
    };
    return $
});
define("visibility_tracker", ["jquery", "underscore", "wayfair", "sitespect", "tracking", "url_utils", "wf_storage", "featuredetect", "trackable_element"], function ($, _, wf, sitespect, tracker, urlUtils, storage, featureDetect, TrackableElement) {
    "use strict";
    var THROTTLE_TIME = 250,
        previousTime = (new Date).getTime(),
        trackableElements = [],
        viewportHeight = wf.$win.height(),
        viewportWidth = wf.$win.width();

    function thresholdHit(trackableElement) {
        var $elem = trackableElement.element,
            visibilityCallback = $elem.data("visibility-callback");
        if (visibilityCallback) {
            var image = new Image;
            image.src = visibilityCallback + encodeURIComponent(trackableElement.visibleTime)
        }
        var visibilityEvent = $elem.data("visibility-event");
        if (visibilityEvent) {
            var visibilityEventType = $elem.data("visibility-event-type");
            if (visibilityEventType === "ss") {
                sitespect.trackEvent(visibilityEvent)
            } else if (visibilityEventType === "spv") {
                tracker.recordEvent(visibilityEvent, {})
            }
        }
    }
    var trackVisibility = {
        canBeSeen: function () {
            var trackableElementsNew = [],
                currentTime = (new Date).getTime();
            _.each(trackableElements, function (trackableElement) {
                if (trackableElement.element.hasClass("track_visibility")) {
                    trackableElementsNew.push(trackableElement)
                }
                if (!trackableElement.isElementInViewport(viewportHeight, viewportWidth)) {
                    if (trackableElement.impressionSent) {
                        trackableElement.visibleTime = 0
                    }
                    trackableElement.isVisible = false;
                    trackableElement.impressionSent = false;
                    return
                }
                if (!trackableElement.isVisible) {
                    trackableElement.isVisible = true;
                    return
                }
                trackableElement.visibleTime += currentTime - previousTime;
                if (trackableElement.visibilityThresholdMS === undefined) {
                    trackableElement.visibilityThresholdMS = trackableElement.element.data("visibility-threshold-ms");
                    return
                }
                if (!trackableElement.impressionSent && trackableElement.visibleTime >= trackableElement.visibilityThresholdMS) {
                    thresholdHit(trackableElement);
                    var zoneId = parseInt(trackableElement.element[0].id.replace("openx_zone_", ""), 10),
                        zone = $("#openx_zone_" + zoneId),
                        bannerId = zone.data("banner-id");
                    var endemicRegex = new RegExp("^(http|https)://media.wayfair.com(.*?)(www.(wayfair|jossandmain|allmodern|birchlane|dwellstudio)).");
                    if (bannerId != null && bannerId > 0) {
                        $("#openx_zone_" + zoneId).removeClass("track_visibility");
                        var platform, deviceType;
                        if (wf.get("appData.tracking.isMobileWeb")) {
                            platform = "Mobile Web"
                        } else {
                            platform = "Desktop"
                        }
                        if (featureDetect.isPhone()) {
                            deviceType = "Phone"
                        } else if (featureDetect.isTablet()) {
                            deviceType = "Tablet"
                        } else {
                            deviceType = "Desktop"
                        }
                        $.ajax({
                            url: wf.constants.STORE_URL + "/ajax/track_open_x_ad_visibility.php",
                            type: "POST",
                            contentType: "application/json",
                            async: true,
                            data: {
                                bpss: "yes",
                                ad_id: bannerId,
                                zone_id: zoneId,
                                page_type: wf.constants.PAGE_TYPE,
                                platform: platform,
                                device_type: deviceType,
                                ad_timer: trackableElement.visibleTime,
                                so_id: wf.constants.STORE_ID,
                                browser_guid: storage.cookie.get({
                                    key: "CSNUtId"
                                })
                            }
                        });
                        trackableElement.impressionSent = true
                    }
                }
            });
            previousTime = currentTime;
            trackableElements = trackableElementsNew
        },
        registerElement: function (elem) {
            trackableElements.push(new TrackableElement.CreateTrackableElement(elem))
        }
    };
    $(".track_visibility").each(function () {
        trackVisibility.registerElement(this)
    });
    wf.$win.on("wf_resize", function (e, data) {
        viewportHeight = data.height;
        viewportWidth = data.width
    });
    wf.$win.on("DOMContentLoaded load wf_resize scroll click", _.throttle(trackVisibility.canBeSeen, THROTTLE_TIME));
    return trackVisibility
});
define("sitespect_core", ["jquery", "wayfair"], function ($, wf) {
    "use strict";
    if (!wf.constants.IS_SITESPECT_ENABLED) {
        return
    }(function (h) {
        var d = h.document,
            j = {},
            m = h.encodeURIComponent;
        j.Cookie = function () {
            return {
                get: function (h, a) {
                    if (h) {
                        var b;
                        var f = d.cookie;
                        b = " " + h + "=";
                        var f = " " + f + ";",
                            e = f.indexOf(b);
                        e >= 0 ? (e += b.length, b = decodeURIComponent(f.substring(e, f.indexOf(";", e)))) : b = "";
                        if (!b) return "";
                        a && (a = a.substr(0, 1).toLowerCase());
                        switch (a) {
                        case "s":
                            return b;
                        case "a":
                            return b.split("\x0B");
                        default:
                            return b.match("\x0B") ? b.split("\x0B") : b
                        }
                    }
                },
                set: function (k, a, b, f, e, c) {
                    if (k && !/^(?:expires|max-age|path|domain|secure|HttpOnly)$/i.test(k)) typeof a === "object" && (a = a.join("\x0B")), !b || b.toString().substr(0, 1) !== ";" ? (c || (c = "/"), e || (e = h.location.hostname.match(/^[\d.]+|(?:\.[\da-z\-]+)*[\da-z\-]+\.[\da-z\-]+$/i)[0]), e.substr(0, 1) !== "." && (e = "." + e), f = !f ? "" : ";secure", b != null && (b = parseInt(b, 10), isNaN(b) && (b = 0), b = ";expires=" + new Date(+new Date + b).toUTCString()), c = ";path=" + c + ";domain=" + e + b + f) : c = b, k = m(k) + "=" + m(a) + c, d.cookie = k
                }
            }
        }();
        j.JSEvents = function () {
            function k(a, b, f) {
                a.addEventListener ? a.addEventListener(b, f, false) : a.attachEvent && a.attachEvent("on" + b, f)
            }
            return {
                on: k,
                off: function (a, b, f) {
                    a.removeEventListener ? a.removeEventListener(b, f, false) : a.detachEvent && a.detachEvent("on" + b, f)
                },
                trgt: function (a) {
                    if (!a) a = h.event;
                    a = a.target || a.srcElement || d;
                    if (a.nodeType === 3) a = a.parentNode;
                    return a
                },
                ready: function (a) {
                    var b = false,
                        f = false,
                        e, c;
                    e = function () {
                        if (!b) {
                            if (!d.body) return setTimeout(e, 1);
                            b = true;
                            a()
                        }
                    };
                    if (d.addEventListener) c = function () {
                        d.removeEventListener("DOMContentLoaded", c, false);
                        e()
                    }, d.addEventListener("DOMContentLoaded", c, false);
                    else if (d.attachEvent) {
                        c = function () {
                            d.readyState === "complete" && (d.detachEvent("onreadystatechange", c), e())
                        };
                        d.attachEvent("onreadystatechange", c);
                        try {
                            f = h.frameElement === null
                        } catch (q) {}
                        d.documentElement.doScroll && f && function g() {
                            if (!b) {
                                try {
                                    d.documentElement.doScroll("left")
                                } catch (a) {
                                    setTimeout(g, 1);
                                    return
                                }
                                e()
                            }
                        }()
                    }
                    k(h, "load", e)
                }
            }
        }();
        j.TimerFactory = function () {
            function d() {
                var a = -1,
                    b = -1;
                return {
                    start: function (b) {
                        a = (b || new Date).getTime();
                        return a > 0
                    },
                    stop: function () {
                        b = (new Date).getTime();
                        return b > 0
                    },
                    reset: function () {
                        b = a = -1
                    },
                    diff: function () {
                        if (a <= 0) throw "Failure to Start Timer";
                        if (b <= 0) throw "Failure to Stop Timer";
                        if (a > b) throw "Failure to Reset Timer";
                        return (b - a) / 1e3
                    }
                }
            }
            return {
                get: function () {
                    return new d
                }
            }
        }();
        j.EventTrack = function () {
            function k(b) {
                b += "-1";
                var a;
                try {
                    a = h.ActiveXObject ? new h.ActiveXObject("Microsoft.XMLHTTP") : new h.XMLHttpRequest, a.open("GET", b, true)
                } catch (e) {
                    return false
                }
                try {
                    a.setRequestHeader("X-Requested-With", "XMLHttpRequest"), a.setRequestHeader("Accept", "*/*")
                } catch (d) {}
                try {
                    a.send(null)
                } catch (f) {
                    if (f.number & 1) return false
                }
                c[c.length] = a;
                return true
            }
            var a = "www." + wf.constants.STORE_DOMAIN,
                b = "" || h.location.protocol,
                f = "/__ssobj/track",
                e = Math.floor(Math.random() * 99999999),
                c = [];
            return {
                rp: function (j, n) {
                    var g;
                    g = j;
                    var i = n,
                        p = (new Date).getTime() + e,
                        o = [],
                        l;
                    if (typeof g === "object") {
                        for (l = 0; l < g.length; l++) g[l] = "event" + l + "=" + m(g[l]);
                        g = g.join("&")
                    } else g = "event=" + m(g);
                    if (i && typeof i === "object") {
                        for (l in i) i.hasOwnProperty(l) && (o[o.length] = "value_" + m(l) + "=" + m(i[l]));
                        i = o.join("&")
                    } else i = "value=" + m(i != null ? i : "");
                    g = b + "//" + a + f + "?" + g + "&" + i + "&x=" + p;
                    if (h.location.hostname !== a || !k(g)) b === "https:" ? (i = g, i += "-3", g = "SS.IMG" + e, i = '<div style="display:none;"><img src="' + i + '" height="1" width="1" border="0" id="' + g + '" /></div>', $(d.body).append(i), d.getElementById && (g = d.getElementById(g), c[c.length] = g)) : (g += "-2", i = new Image, i.src = g, c[c.length] = i)
                },
                r: c
            }
        }();
        j.PageTimer = function () {
            function d(a) {
                var c = false;
                return function () {
                    if (f && !c && (c = true, b.stop())) try {
                        var d = b.diff();
                        d <= 1795 && j.EventTrack.rp(a, d)
                    } catch (h) {}
                }
            }
            var a = j.JSEvents,
                b, f;
            return {
                time: function (e, c, m) {
                    b = j.TimerFactory.get();
                    if (f = b.start(m)) {
                        var n = d(c),
                            c = false;
                        e === "ready" ? (a.ready(n), c = true) : e === "load" ? (a.on(h, "load", n), c = true) : e === "dwell" ? (a.on(h, "unload", n), c = true) : e === "abandon" && (a.on(h, "unload", n), a.on(h, "load", function () {
                            a.off(h, "unload", n)
                        }), c = true);
                        return c
                    } else return false
                }
            }
        }();
        h.SS = j
    })(window);
    return $
});
define("init_show_page", ["jquery", "wf_storage", "tracking", "sitespect", "lazy!fixed_nav", "init_cms_lazy_load", "jquery-lazyload"], function ($, Storage, Tracker, Sitespect, fixedNavPromise) {
    "use strict";
    var fixedNavModule = {};
    fixedNavPromise.done(function (nav) {
        fixedNavModule = nav
    });

    function initLazyLoad() {
        var lazyImages = $("img.jq_lazy");
        lazyImages.removeClass("hidden-node");
        lazyImages.show().lazyload({
            threshold: 600,
            event: "scroll"
        });
        lazyImages.on("load", function (image) {
            $(image.currentTarget).removeClass("jq_lazy")
        });

        function fakeScroll() {
            $("body,html").trigger("scroll")
        }
        var carouselWaitTillScroll = 200;
        $(".js-scroll-previous, .js-scroll-next").on("click", function () {
            setTimeout(fakeScroll, carouselWaitTillScroll)
        })
    }
    initLazyLoad();
    $("body").on("click", ".js-cms-link", function () {
        var externalLinkClick = "_blank" === this.target;
        var $link = $(this);
        var clickData = createIdMap($link);
        if (externalLinkClick) {
            clickData.Event = 1;
            clickData.ClickLocation = $link.data("click-location");
            clickData.ClickLocationMetadata = $link.data("click-location-metadata");
            var rfCstmVars = "";
            $.each(clickData, function (key, value) {
                if (value) {
                    rfCstmVars += key + "=" + value + ";"
                }
            });
            Tracker.spvTwo(this.href, document.location.href, rfCstmVars)
        } else {
            $.each(clickData, function (key, value) {
                Storage.cookie.set({
                    key: key,
                    value: value,
                    ttl: 0
                })
            })
        }
    });
    var stickyHeader = $(".js-sticky-header");
    if (stickyHeader.length) {
        fixedNavPromise.done(function () {
            stickyHeader.fixedNav({
                useAnchors: true,
                navAnchorSelector: ".js-sticky-anchor"
            })
        });
        fixedNavPromise.load()
    }
    if (Sitespect.sitespectCookieContains("114777105v1")) {
        var heroSwitchContent = $(".js-nested-template");
        heroSwitchContent.on("click", function () {
            var value = $(this).attr("id");
            value = value.substring(13, value.length);
            Storage.cookie.set({
                key: "HeroBoostTest",
                value: value
            })
        })
    }

    function createIdMap($element) {
        var idMap = {};
        var cmsLinkID = $element.data("cmsLinkid");
        if (cmsLinkID) {
            idMap.CMSLinkID = cmsLinkID
        }
        var $cmsLego = $element.closest("[id^=cms_lego_]");
        var $cmsPage = $element.closest("[id^=cms_page_]");
        idMap.CMSLegoID = $cmsLego.attr("id").replace("cms_lego_", "");
        idMap.CMSLegoVersionID = $cmsLego.data("lego-version");
        idMap.CMSPageID = $cmsPage.attr("id").replace("cms_page_", "");
        return idMap
    }
});
define("configuration", [], function () {
    "use strict";
    var instance = null;
    var wf = window.wf != null ? window.wf : {};
    var devMode = false;
    var devModeSet = false;
    var Logger = null;

    function isDevMode() {
        if (!devModeSet) {
            var loc = window.location.toString();
            devMode = loc.indexOf("127.0.0.1") !== -1 || loc.indexOf("csnzoo") !== -1;
            devModeSet = true
        }
        return devMode
    }

    function Configuration() {}
    Configuration.prototype.namespace = function () {
        if (wf == null) {
            wf = window.wf
        }
        if (wf == null) {
            wf = {}
        }
        if (wf.Logger != null) {
            Logger = wf.Logger
        }
        var args = arguments;
        var names, obj = null;
        for (var i = 0, l = args.length; i < l; ++i) {
            names = args[i].split(".");
            obj = wf;
            for (var name = names[0] === "wf" ? 1 : 0, nl = names.length; name < nl; ++name) {
                obj[names[name]] = obj[names[name]] || {};
                obj = obj[names[name]]
            }
        }
        return obj
    };
    Configuration.prototype.init = function () {
        var runtime = this.namespace("runtime");
        runtime.devMode = isDevMode();
        this.namespace("appData");
        if (Logger != null) {
            Logger.enabled = devMode;
            runtime.logger = Logger;
            Logger.debug("Is dev mode? " + devMode)
        }
        if (window.YUI != null) {
            var localYui = this.namespace("legacy");
            localYui.YUI = window.YUI
        }
    };

    function getInstance() {
        if (instance === null) {
            instance = new Configuration
        }
        instance.init();
        wf.namespace = instance.namespace;
        window.wf = wf;
        return instance
    }
    return getInstance()
});
define("wf_constants", ["configuration"], function (Configuration) {
    "use strict";
    var constants = Configuration.namespace("constants");
    constants.FACEBOOK_SCRIPT_URL = "//connect.facebook.net/{locale}/sdk.js";
    constants.JM_FACEBOOK_SCRIPT_URL = "//connect.facebook.net/{locale}/all.js";
    constants.FACEBOOK_CHANNEL_URL = "/facebook/fb_xd_channel.html";
    constants.WF_FACEBOOK_SCOPE = "email, user_likes";
    constants.JM_FACEBOOK_SCOPE = constants.WF_FACEBOOK_SCOPE + ", friends_likes";
    constants.QUICKVIEW_URL = "/v/product/quick_view";
    var socialShareConstants = Configuration.namespace("constants.socialShare");
    socialShareConstants.LINKED_IN_SCRIPT_URL = "//platform.linkedin.com/in.js";
    socialShareConstants.PINTEREST_SCRIPT_URL = "//assets.pinterest.com/js/pinmarklet.js?r=";
    var eventTypes = Configuration.namespace("wf.constants.eventTypes");
    eventTypes.WAYFAIR_DONE = "WAYFAIR_DONE";
    eventTypes.ACTIVITY_FEED_EVENT_TYPE = "ACTIVITY_FEED";
    eventTypes.AMD_EVENT_TYPE = "AMD";
    eventTypes.CLIPBAR_EVENT_TYPE = "CLIPBAR";
    eventTypes.FACEBOOK_EVENT_TYPE = "FB";
    eventTypes.SOCIAL_SHARE_EVENT_TYPE = "SOCIAL_SHARE";
    eventTypes.TRACKING_EVENT_TYPE = "TRACKING";
    eventTypes.OPENX_EVENT_TYPE = "OPENX";
    eventTypes.YMAN_SHOW_INFO = "YMAN_INFO";
    eventTypes.YMAN_SHOW_DRAWER = "YMAN_DRAWER";
    eventTypes.FLEXSLIDER_EVENT_TYPE = "FLEXSLIDER";
    eventTypes.SLIDER_EVENT_TYPE = "SLIDER";
    eventTypes.INTERSTITIAL_EVENT_TYPE = "INTERSTITIAL";
    eventTypes.CART_UPDATE_EVENT_TYPE = "UPDATE_CART";
    eventTypes.REQUIRED_ITEM_OPTION_PRICE = "REQUIRED_ITEM";
    eventTypes.CATEGORY_CONTENT_COMPLETE = "CATEGORY_CONTENT_COMPLETE";
    eventTypes.INFINITE_SCROLL_READY = "INFINITE_SCROLL_READY";
    eventTypes.ADDRESS_FORM_EVENT_TYPE = "ADDRESS_FORM_EVENT_TYPE";
    eventTypes.SW_COLOR_WIDGET_EVENT_TYPE = "SW_COLOR_WIDGET";
    eventTypes.SAVE_TO_FAVORITE = "SAVE_TO_FAVORITE";
    constants.ENTER_KEY = 13;
    constants.WF_REWARDS_PERCENT = .03;
    constants.RECENTLY_VIEWED_CLASSES_KEY = "rvc";
    constants.RECENTLY_VIEWED_PRODUCTS_KEY = "rvp";
    constants.DEFAULT_SORT = 6;
    constants.DEFAULT_ITEMS_PER_PAGE = 48;
    constants.COMPARE_TOOL_DRAWER_PRODUCTS_KEY = "ctdp";
    constants.COMPARE_TOOL_DRAWER_STATUS_KEY = "ctds";
    constants.BASKET_COUNT_VERB = "BASKET_COUNT";
    return window.wf.constants
});
define("scribe_event_constants", [], function () {
    return {
        HEARTBEAT: "Heartbeat",
        PAGE_HIDDEN: "PageHidden",
        PAGE_VIEW: "PageView",
        PRERENDER: "Prerender",
        WEB_CLICK: "WebClick"
    }
});
define("scribe_event", ["underscore", "wayfair"], function (_, wf) {
    function ScribeEvent(data) {
        var error = validateEventData(data);
        if (error) {
            throw new Error("Invalid Scribe Event: " + error)
        }
        this.data = _.extend({}, data, getRequiredData())
    }
    ScribeEvent.prototype.getTimestamp = function () {
        return this.data.timestamp
    };
    ScribeEvent.prototype.toJSON = function () {
        return _.clone(this.data)
    };

    function validateEventData(data) {
        if (!_.isObject(data)) {
            return "event data is not an object"
        } else if (typeof data.eventType !== "string") {
            return 'event data must have an "eventType" property'
        }
        return false
    }

    function getRequiredData() {
        return {
            transactionId: wf.constants.TRANSACTION_ID,
            storeId: wf.constants.STORE_ID,
            timestamp: _.now()
        }
    }
    return ScribeEvent
});
define("scribe_client", ["underscore", "wayfair", "scribe_event", "scribe_stats_tracker", "scribe_pixel"], function (_, wf, ScribeEvent, ScribeStatsTracker, ScribePixel) {
    function ScribeClient(statsTracker, PixelLoader, Event) {
        this.statsTracker = statsTracker || new ScribeStatsTracker;
        this.PixelLoader = PixelLoader || ScribePixel;
        this.Event = Event || ScribeEvent
    }
    ScribeClient.prototype.sendEvent = function (eventData) {
        var event = new this.Event(eventData);
        var pixel = new this.PixelLoader(getTrackingUrl(), event);
        var promise = pixel.load();
        this.statsTracker.trackRequest(promise);
        return promise
    };

    function getTrackingUrl() {
        return window.location.protocol + "//t." + wf.constants.STORE_DOMAIN + "/b.php"
    }
    return ScribeClient
});
define("scribe_stats_tracker", ["underscore"], function (_) {
    function ScribeStatsTracker() {
        _(this).bindAll("_trackSuccess", "_trackFailure");
        this.inflightAtTimeOfReset = 0;
        this.resetStats()
    }
    ScribeStatsTracker.prototype.resetStats = function () {
        this.requestsMade = 0;
        this.requestsFailed = 0;
        this.requestsCompleted = 0;
        this.durationOfSuccessfulRequests = 0
    };
    ScribeStatsTracker.prototype.trackRequest = function (scribeRequestPromise) {
        this.requestsMade++;
        scribeRequestPromise.then(this._trackSuccess, this._trackFailure)
    };
    ScribeStatsTracker.prototype.getStats = function () {
        return {
            requestsMade: this.requestsMade,
            meanResponseTimeInMs: this._getMeanResponseTimeInMs(),
            requestsCompleted: this.requestsCompleted,
            requestsFailed: this.requestsFailed
        }
    };
    ScribeStatsTracker.prototype._getMeanResponseTimeInMs = function () {
        var meanResponseTimeInMs = Math.round(this.durationOfSuccessfulRequests / this.requestsCompleted);
        return meanResponseTimeInMs || 0
    };
    ScribeStatsTracker.prototype._trackSuccess = function (scribeEvent) {
        this.requestsCompleted++;
        this.durationOfSuccessfulRequests += _.now() - scribeEvent.getTimestamp()
    };
    ScribeStatsTracker.prototype._trackFailure = function () {
        this.requestsFailed++
    };
    return ScribeStatsTracker
});
define("scribe_heartbeat", ["underscore", "jquery", "visibility", "scribe_event_constants"], function (_, $, Visibility, SCRIBE_EVENTS) {
    var INTERVAL = 15e3;

    function ScribeHeartbeat(client, statsSource) {
        this._client = client;
        this._statsSource = statsSource;
        this._intervalId = null;
        _.bindAll(this, "_sendHeartbeat")
    }
    ScribeHeartbeat.prototype.start = function () {
        this.stop();
        this._deferred = new $.Deferred;
        this._intervalId = Visibility.every(INTERVAL, this._sendHeartbeat);
        return this._deferred.promise()
    };
    ScribeHeartbeat.prototype.stop = function () {
        if (this._intervalId) {
            Visibility.stop(this._intervalId)
        }
        if (this._deferred) {
            this._deferred.resolve()
        }
    };
    ScribeHeartbeat.prototype._sendHeartbeat = function () {
        var stats = this._statsSource.getStats();
        var eventData = _.extend({
            eventType: SCRIBE_EVENTS.HEARTBEAT
        }, stats);
        this._statsSource.resetStats();
        this._deferred.notify(this._client.sendEvent(eventData))
    };
    return ScribeHeartbeat
});
define("scribe_page_visibility_tracker", ["underscore", "wayfair", "visibility", "scribe_event_constants"], function (_, wf, Visibility, SCRIBE_EVENTS) {
    var STATE_TO_SCRIBE_EVENT = {
        prerender: SCRIBE_EVENTS.PRERENDER,
        hidden: SCRIBE_EVENTS.PAGE_HIDDEN
    };

    function ScribePageVisibilityTracker(client) {
        this._debouncedClientSendEvent = _(client.sendEvent.bind(client)).debounce(10, true)
    }
    ScribePageVisibilityTracker.prototype.trackPrerendering = function () {
        var isPrerendering = Visibility.state() === "prerender";
        if (isPrerendering) {
            this._sendVisibilityState()
        }
    };
    ScribePageVisibilityTracker.prototype.trackVisibilityChanges = function () {
        Visibility.change(this._sendVisibilityState.bind(this))
    };
    ScribePageVisibilityTracker.prototype._sendVisibilityState = function () {
        var state = Visibility.state();
        if (STATE_TO_SCRIBE_EVENT[state]) {
            this._debouncedClientSendEvent({
                eventType: STATE_TO_SCRIBE_EVENT[state]
            })
        }
    };
    return ScribePageVisibilityTracker
});
define("scribe_click_tracker", ["jquery", "underscore", "wayfair", "wf_storage", "string_utils", "dom_utils", "scribe_event_constants", "scribe_click_data_parser"], function ($, _, wf, storage, stringUtils, domUtils, SCRIBE_EVENTS, ScribeClickDataParser) {
    var TTL = 1 / 60 * (1 / 60) * (1 / 24);

    function ScribeClickTracker(client, ClickParser) {
        _(this).bindAll("_onBodyClick");
        this.client = client;
        this.ClickParser = ClickParser || ScribeClickDataParser
    }
    ScribeClickTracker.prototype.trackBodyClicks = function () {
        wf.$body.off("click.scribe");
        wf.$body.on("click.scribe", "[data-click-location]", this._onBodyClick)
    };
    ScribeClickTracker.prototype._onBodyClick = function (event) {
        var $clickedElement = $(event.target);
        var linkTargetIsNewPage = $clickedElement.prop("target") === "_blank";
        var clickData = new this.ClickParser($clickedElement).parse();
        if (linkTargetIsNewPage) {
            this._sendWebClick(clickData)
        } else {
            this._setCookies(clickData)
        }
    };
    ScribeClickTracker.prototype._sendWebClick = function (clickData) {
        var event = _.extend({
            eventType: SCRIBE_EVENTS.WEB_CLICK
        }, clickData);
        this.client.sendEvent(event)
    };
    ScribeClickTracker.prototype._setCookies = function (clickData) {
        _(clickData).mapObject(function (value, key) {
            storage.cookie.set({
                key: "cms" + stringUtils.toTitleCase(key),
                value: value,
                ttl: TTL
            })
        })
    };
    return ScribeClickTracker
});
define("wf_event", ["jquery"], function ($) {
    "use strict";

    function Event(eventType, options) {
        options = $.extend(true, {
            verb: null,
            namespace: null,
            uid: null,
            data: {},
            nativeEvent: null
        }, options);
        this.eventType = eventType;
        this.verb = options.verb;
        this.namespace = options.namespace;
        this.uid = options.uid;
        this.data = options.data;
        this.nativeEvent = options.nativeEvent
    }
    Event.prototype.toString = function () {
        try {
            var niceString = JSON.stringify({
                namespace: this.namespace,
                verb: this.verb,
                data: this.data
            });
            return niceString
        } catch (e) {
            return '{"verb": "' + this.verb + '", "data": "?"}'
        }
    };
    return Event
});
define("wf_events", ["underscore", "backbone"], function (_, Backbone) {
    "use strict";
    var WayfairEvents = _.extend({}, Backbone.Events);
    return WayfairEvents
});
define("beacon_fire_tracker", ["jquery", "underscore", "wayfair", "trackable_element"], function ($, _, wf, TrackableElement) {
    "use strict";
    var THROTTLE_TIME = 250,
        previousTime = (new Date).getTime(),
        elementsThatFireBeaconOnView = [],
        beaconList = [],
        viewportHeight = wf.$win.height();
    var fireBeacon = {
        canBeSeen: function () {
            var elementsThatFireBeaconOnViewNew = [],
                currentTime = (new Date).getTime();
            _.each(elementsThatFireBeaconOnView, function (trackableElement) {
                if (!trackableElement.beaconFired) {
                    elementsThatFireBeaconOnViewNew.push(trackableElement)
                }
                if (trackableElement.isElementPartiallyInViewport(viewportHeight)) {
                    trackableElement.isVisible = true
                } else {
                    trackableElement.isVisible = false
                }
                if (trackableElement.isVisible && trackableElement.visibleTime > 1e3) {
                    var zoneId = parseInt(trackableElement.element[0].id.replace("openx_zone_", ""), 10);
                    var beacon = beaconList[zoneId];
                    if (beacon) {
                        var $pixel = $("img", beacon);
                        $pixel.attr("src", $pixel.data("src"));
                        $("#openx_zone_" + zoneId).append(beacon)
                    }
                    trackableElement.beaconFired = true
                }
                trackableElement.visibleTime += currentTime - previousTime;
                return
            });
            previousTime = currentTime;
            elementsThatFireBeaconOnView = elementsThatFireBeaconOnViewNew
        },
        registerElement: function (elem) {
            elementsThatFireBeaconOnView.push(new TrackableElement.CreateTrackableElement(elem))
        },
        populateBeaconList: function (list) {
            beaconList = list
        }
    };
    wf.$win.on("wf_resize", function (e, data) {
        viewportHeight = data.height
    });
    wf.$win.on("DOMContentLoaded load wf_resize wf_scroll click", _.throttle(fireBeacon.canBeSeen, THROTTLE_TIME));
    return fireBeacon
});
define("wf_pixel_base", ["underscore", "jquery", "wayfair", "logger", "wf_events", "backbone"], function (_, $, wf, logger, WayfairEvents, Backbone) {
    "use strict";

    function Pixel(options) {
        options = options || {};
        this.data = options.data || {};
        this.runQueue = options.run_queue || [];
        this.priority = options.priority;
        this.is_spa = options.is_spa || false;
        this.initialize(options)
    }
    _.extend(Pixel.prototype, WayfairEvents, {
        initialize: _.noop,
        postInitialize: function () {
            var self = this;
            var deferredScripts = [];
            _.each(this.data.scripts, function (scriptUrl) {
                var deferredScript = $.Deferred();
                deferredScripts.push(deferredScript);
                $.getScript(scriptUrl, function () {
                    deferredScript.resolve()
                })
            });
            $.when.apply(null, deferredScripts).done(function () {
                _.each(self.runQueue, function (data) {
                    self.run(data)
                })
            })
        },
        run: _.noop,
        trackingFooterEl: wf.constants.STORE_ID === wf.constants.JOSSMAIN_ID ? $(".joss_tracking_hidden_elements")[0] : document.getElementById("tracking-footer"),
        addScriptElement: function (scriptEl) {
            if (this.trackingFooterEl) {
                this.trackingFooterEl.appendChild(scriptEl)
            }
        },
        appendMarkup: function (markup) {
            if (this.trackingFooterEl) {
                var fragment = document.createDocumentFragment();
                var div = document.createElement("div");
                div.innerHTML = markup;
                var scripts = _.map(div.getElementsByTagName("script"), _.identity);
                while (div.firstChild) {
                    fragment.appendChild(div.firstChild)
                }
                this.trackingFooterEl.appendChild(fragment);
                loadScripts(scripts, 0)
            }
        }
    });

    function loadScripts(scripts, index) {
        if (scripts.length <= index) {
            return
        }
        var script = scripts[index];
        if (script.src) {
            var s = document.createElement("script");
            s.setAttribute("src", script.src);
            if (script.async) {
                loadScripts(scripts, index + 1)
            } else {
                s.onload = function () {
                    loadScripts(scripts, index + 1)
                };
                s.onreadystatechange = function () {
                    if (this.readyState === "complete") {
                        loadScripts(scripts, index + 1)
                    }
                };
                s.onerror = function () {
                    loadScripts(scripts, index + 1)
                }
            }
            script.parentNode.replaceChild(s, script)
        } else if (script.textContent) {
            eval(script.textContent);
            loadScripts(scripts, index + 1)
        }
    }
    Pixel.extend = Backbone.Model.extend;
    document.write = function (markup) {
        Pixel.prototype.appendMarkup(markup);
        if (wf.features.pixel_manager_document_write) {
            logger.info("A pixel call to document.write() has been intercepted.")
        }
    };
    return Pixel
});
define("wf_intent_events", [], function () {
    "use strict";

    function getIntentHandler(method) {
        var lastEvent = null;
        var timeout = null;
        var triggerIntent = function () {
            method(lastEvent)
        };
        var startIntent = function (evt, delay) {
            lastEvent = evt;
            clearTimeout(timeout);
            timeout = setTimeout(triggerIntent, delay || 0)
        };
        var stopIntent = function () {
            lastEvent = null;
            clearTimeout(timeout)
        };
        return {
            startIntent: startIntent,
            stopIntent: stopIntent
        }
    }
    return {
        getIntentHandler: getIntentHandler
    }
});
define("wf_pointerevents", ["jquery", "lazy!pep", "featuredetect"], function ($, PepPromise, featuredetect) {
    "use strict";
    var exports = false;
    if (!(featuredetect.isIE() && featuredetect.browserVersion() < 10) && window.addEventListener != null) {
        exports = true;
        PepPromise.load()
    }
    PepPromise.done(function () {
        $.event.props.push("pointerType")
    });
    return exports
});
define("wf_handle_touch", ["jquery", "wf_view_base"], function ($, BaseView) {
    "use strict";
    var TouchHandler = BaseView.extend({
        touchStarted: false,
        touchShown: false,
        events: {
            "click .js-account-dropdown-trigger": "click",
            "click .js-header-dropdown-trigger-display": "click",
            mouseenter: "mouseenter",
            mouseleave: "mouseleave",
            touchend: "touchend"
        },
        mouseenter: function () {
            if (typeof this.showCallback === "function") {
                this.showCallback()
            }
        },
        mouseleave: function () {
            if (typeof this.hideCallback === "function") {
                this.hideCallback()
            }
        },
        touchend: function (e) {
            this.touchStarted = true;
            if (this.touchShown) {
                this.touchShown = false;
                this.hideCallback()
            } else {
                this.touchShown = true;
                this.showCallback()
            }
        },
        click: function (e) {
            if (this.touchStarted) {
                this.touchStarted = false;
                e.preventDefault()
            }
        }
    });
    return TouchHandler
});
define("wf_storage_utils", ["underscore", "logger"], function (_, Logger) {
    "use strict";
    var MS_IN_A_DAY = 1e3 * 60 * 60 * 24;
    var utils = {
        decode: function (s, raw) {
            if (s != null && s !== false) {
                if (raw) {
                    return s
                } else {
                    try {
                        return decodeURIComponent(s.replace(/\+/g, " "))
                    } catch (e) {
                        Logger.debug("Cookie could not be URI decoded", {
                            error: e
                        });
                        return false
                    }
                }
            } else {
                return false
            }
        },
        encode: function (s, raw) {
            if (s != null && s !== false) {
                if (raw) {
                    return s
                } else {
                    try {
                        return encodeURIComponent(s)
                    } catch (e) {
                        Logger.debug("Cookie could not be URI encoded", {
                            error: e
                        });
                        return false
                    }
                }
            } else {
                return false
            }
        },
        jsonDecode: function (s, useJSON) {
            if (s != null && s !== false) {
                if (!useJSON) {
                    if (s.indexOf('"') === 0) {
                        return s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\")
                    } else {
                        return s
                    }
                } else {
                    try {
                        return JSON.parse(s)
                    } catch (e) {
                        Logger.debug("Cookie/sessionStorage JSON could not be parsed", e);
                        return false
                    }
                }
            } else {
                return false
            }
        },
        jsonEncode: function (s, useJSON) {
            if (s != null && s !== false) {
                if (!useJSON) {
                    return String(s)
                } else {
                    try {
                        return JSON.stringify(s)
                    } catch (e) {
                        Logger.debug("JSON could not be encoded", {
                            error: e
                        });
                        return false
                    }
                }
            } else {
                return false
            }
        },
        advanceByDays: function (days) {
            if (days) {
                var now = new Date,
                    advance = days * MS_IN_A_DAY;
                return now.getTime() + advance
            } else {
                return null
            }
        },
        setSubKey: function (parent, settings) {
            parent = _.isObject(parent) && !_.isArray(parent) ? parent : {};
            parent[settings.subKey] = settings.value;
            return parent
        },
        sessionStorageEnabled: function () {
            try {
                window.sessionStorage.setItem("_WF_STORAGE_TEST_", true);
                window.sessionStorage.removeItem("_WF_STORAGE_TEST_");
                return true
            } catch (e) {
                return false
            }
        },
        localStorageEnabled: function () {
            try {
                window.localStorage.setItem("_WF_STORAGE_TEST_", true);
                window.localStorage.removeItem("_WF_STORAGE_TEST_");
                return true
            } catch (e) {
                return false
            }
        }
    };
    return utils
});
define("tracking_utils", ["jquery", "wf_storage"], function ($, Storage) {
    "use strict";
    return {
        siteTypeVar: function () {
            if ($.featureDetect.isPhone()) {
                var mobileOptOut = Storage.cookie.get({
                    key: "MobileOptOut"
                });
                if (mobileOptOut != null) {
                    return "MobileOptOut"
                } else {
                    return "Mobile"
                }
            } else {
                return null
            }
        }
    }
});
define("jm_tracking", ["jquery", "wayfair", "featuredetect", "wf_storage", "underscore", "browser_utils", "tracking_utils", "logger"], function ($, wf, featureDetect, storage, _, browserUtils, trackingUtils, logger) {
    "use strict";
    var JmTrack = {
        SendBeacon: function () {
            var params = [],
                urlData = "",
                getUrl = "",
                beaconUrl = "/beacon.php?",
                cfg;
            params.url = "bpss=yes&ur=" + encodeURIComponent(document.location.href) + "&page_alias=" + encodeURIComponent(wf.appData.pageAlias);
            getUrl = beaconUrl + params.url;
            if (getUrl.length > 1024) {
                cfg = {
                    method: "POST",
                    data: urlData,
                    success: JmTrack.success
                };
                $.ajax(beaconUrl, cfg)
            } else {
                cfg = {
                    method: "GET",
                    success: JmTrack.success
                };
                $.ajax(getUrl, cfg)
            }
            JmTrack.spv2(true)
        },
        spv2: function (bInitPage, customVars) {
            var x, y, baseQueryString, i, l, customQueryString, cookieValue, windowURL, bDeleteCookie = true,
                t = new Date,
                siteTypeVariable = trackingUtils.siteTypeVar(),
                pageType = window.YUI_config.app.pageType,
                httpReferer = document.referrer;
            if (wf.appData.spvTracking) {
                if (bInitPage) {
                    customVars = wf.appData.spvTracking.CustomVars;
                    customVars = _.isString(customVars) ? $.parseJSON(customVars) : customVars;
                    cookieValue = storage.cookie.get({
                        key: "JOSS",
                        subKey: "spv2",
                        cookie: {
                            raw: true
                        }
                    });
                    if (cookieValue) {
                        try {
                            cookieValue = $.parseJSON(decodeURIComponent(cookieValue));
                            if (cookieValue.ValidationTime && (new Date).getTime() - cookieValue.ValidationTime < 6e4) {
                                windowURL = window.location.pathname + window.location.search;
                                if (cookieValue && (cookieValue.ValidationLink === windowURL || cookieValue.ValidationLink === window.unescape(windowURL))) {
                                    delete cookieValue.ValidationLink;
                                    delete cookieValue.ValidationTime;
                                    if (_.isArray(customVars) && customVars[0]) {
                                        customVars[0] = $.extend(customVars[0], cookieValue)
                                    }
                                } else {
                                    bDeleteCookie = false
                                }
                            }
                        } catch (e) {}
                        if (bDeleteCookie) {
                            storage.cookie.remove({
                                key: "JOSS",
                                subKey: "spv2"
                            })
                        }
                    }
                }
                if (_.isArray(customVars)) {
                    var csnid = storage.cookie.get({
                            key: "CSNID",
                            cookie: {
                                raw: true
                            }
                        }),
                        noOp = function () {},
                        siteTypeString = "";
                    if (csnid) {
                        csnid = "{" + encodeURIComponent(csnid) + "}"
                    } else {
                        csnid = storage.cookie.get({
                            key: "JMID"
                        })
                    }
                    if (siteTypeVariable) {
                        siteTypeString = siteTypeVariable + "=1;"
                    }
                    try {
                        if (window.history && window.history.state && window.history.state.pageType) {
                            pageType = window.history.state.pageType;
                            httpReferer = window.history.state.referrerURL || httpReferer
                        }
                    } catch (e) {
                        logger.info("error accessing window.history.state in jm_tracking ", {
                            error: e
                        })
                    }
                    l = location.protocol + "//" + wf.appData.spvTracking.CSNDomain + "?";
                    baseQueryString = "rfCSNID=" + (csnid ? csnid : "");
                    baseQueryString += "&rfHTTPReferer=" + encodeURIComponent(httpReferer);
                    baseQueryString += "&rfURL=" + encodeURIComponent(document.location.href);
                    baseQueryString += "&rfGUID=" + encodeURIComponent(browserUtils.getUser());
                    baseQueryString += "&rfSoID=" + wf.constants.STORE_ID;
                    baseQueryString += "&rfCstmVars=";
                    x = customVars.length;
                    while (x--) {
                        customQueryString = "PageType=" + pageType + ";" + siteTypeString;
                        i = new Image(1, 1);
                        if (!bInitPage || !$.featureDetect.isPhone() && wf.constants.PAGE_TYPE === "Checkout") {
                            customQueryString += "Event=1;"
                        }
                        if (_.isObject(customVars[x]) && !_.isArray(customVars[x])) {
                            for (y in customVars[x]) {
                                if (customVars[x].hasOwnProperty(y)) {
                                    customQueryString += y + "=" + customVars[x][y] + ";"
                                }
                            }
                        }
                        customQueryString += "_t=" + t.getTime() + ";" + "_tz=" + t.getTimezoneOffset() + ";";
                        customQueryString += "_Servers=" + storage.cookie.get({
                            key: "server",
                            cookie: {
                                raw: true
                            }
                        }) + "," + storage.cookie.get({
                            key: "Server_80",
                            cookie: {
                                raw: true
                            }
                        }) + "," + storage.cookie.get({
                            key: "Server_81",
                            cookie: {
                                raw: true
                            }
                        }) + ";";
                        if (!_.isUndefined(wf.appData.spvTracking.SitespectVars)) {
                            customQueryString += wf.appData.spvTracking.SitespectVars
                        }
                        customQueryString += "_txid=" + wf.constants.TRANSACTION_ID + ";";
                        i.src = l + baseQueryString + encodeURIComponent(customQueryString);
                        i.onload = noOp
                    }
                }
            }
        },
        success: function () {},
        SetGACustomMobileVars: function () {
            var siteType = trackingUtils.siteTypeVar();
            if (siteType === "MobileOptOut" && window.ga) {
                window.ga("set", "dimension1", "MobileSiteOptOut")
            }
        },
        GetDivData: function (myNodes, myVarName) {
            var mylist = "",
                mytemp = "",
                myvalue = "",
                myid = "",
                mysize = "",
                mysort = "",
                myprice = "",
                myqty = "";
            if (myNodes.length > 0) {
                myNodes.each(function (index, node) {
                    if (mylist !== "") {
                        mylist += "~"
                    }
                    myvalue = "";
                    myid = "";
                    mysize = "";
                    mysort = "";
                    myprice = "";
                    myqty = "";
                    myvalue = encodeURIComponent(node.getAttribute("data-value").replace(/[~_]/g, " "));
                    if (node.getAttribute("data-id")) {
                        myid = encodeURIComponent(node.getAttribute("data-id").replace(/[~_]/g, " "))
                    } else {
                        mytemp += "_"
                    }
                    if (node.getAttribute("data-size")) {
                        mysize = encodeURIComponent(node.getAttribute("data-size").replace(/[~_]/g, " "))
                    } else {
                        mytemp += "_"
                    }
                    if (node.getAttribute("data-sort")) {
                        mysort = encodeURIComponent(node.getAttribute("data-sort").replace(/[~_]/g, " "))
                    } else {
                        mytemp += "_"
                    }
                    if (node.getAttribute("data-price")) {
                        myprice = encodeURIComponent(node.getAttribute("data-price").replace(/[~_]/g, " "))
                    }
                    if (node.getAttribute("data-qty")) {
                        myqty = encodeURIComponent(node.getAttribute("data-qty").replace(/[~_]/g, " "))
                    }
                    mylist += myvalue + "_" + myid + "_" + mysize + "_" + mysort + "_" + myprice + "_" + myqty
                });
                mylist = myVarName + "=" + mylist
            }
            return mylist
        }
    };
    return JmTrack
});
define("private_utilities", ["jquery", "wayfair", "dom_utils"], function ($, wf, domUtils) {
    "use strict";
    var exports = {};
    exports.initBackNavigation = function () {
        if (window.history && window.history.replaceState) {
            $(".js-data-sku").on("click", function (e) {
                var productBlock = $(e.target);
                if (e.target.id !== "hover_click_zone" && productBlock.parents("#hover_click_zone").size() < 1) {
                    var sku = domUtils.getDataAttr(this, "id"),
                        url = domUtils.getDataAttr(productBlock.closest(".js-eventwrap"), "url"),
                        anchorTag;
                    anchorTag = $('a[name="' + sku + '"]');
                    if (url === "" || url === undefined) {
                        url = document.location.href
                    }
                    window.history.replaceState({
                        sku: sku
                    }, "", url)
                }
            })
        }
    };
    exports.initReadMore = function () {
        $(".js-read-more").on("click", function () {
            var link = $(this),
                textElement = link.parent().find(".js-read-more-text"),
                longText = textElement.data("more"),
                shortText = textElement.data("less"),
                linkMoreText = link.data("more"),
                linkLessText = link.data("less");
            textElement.toggleClass("less more");
            link.toggleClass("less more");
            if (textElement.hasClass("more")) {
                textElement.html(longText);
                link.html(linkLessText)
            } else {
                textElement.html(shortText);
                link.html(linkMoreText)
            }
        })
    };
    exports.updateCurrentPageForSPV2 = function (pageElement, url) {
        if (window.history && window.history.replaceState) {
            window.history.replaceState({}, "", url)
        }
        var txidElement = pageElement.find(".js-txid");
        var txid = txidElement.attr("data-txid");
        if (txid) {
            wf.constants.TRANSACTION_ID = txid
        }
    };
    exports.validateCartSelection = function (formElement) {
        formElement = formElement.jquery ? formElement : $(formElement);
        exports.removeErrorText(formElement);
        var optionCategories = $(".js-option-category"),
            customizationList, customizationErrorMessage = "Please enter the required customization text",
            unselectedOptionMesssage = "Please select all options and try again.",
            validated = true,
            customizationsCount, customizationChecked = $("#jq_monogram_switch").prop("checked");
        if (customizationChecked) {
            customizationList = $(".js-customization-required, .js-customization")
        } else {
            customizationList = $(".js-customization-required")
        }
        var optionCategoriesCount = optionCategories.length;
        for (var j = 0; j < optionCategoriesCount; j++) {
            if ($(optionCategories[j]).val() === "-1") {
                exports.addErrorText(formElement, unselectedOptionMesssage);
                validated = false;
                break
            }
        }
        customizationsCount = customizationList.length;
        for (var i = 0; i < customizationsCount; i++) {
            if (customizationList[i].value === "" || customizationList[i].maxLength <= 3 && customizationList[i].value.length < customizationList[i].maxLength) {
                exports.addErrorText(formElement, customizationErrorMessage);
                validated = false;
                break
            }
        }
        return validated
    };
    exports.addErrorText = function (pageElement, errorText) {
        var $errorMessages = pageElement.find("#error_messages");
        if ($errorMessages.length === 0) {
            $errorMessages = $('<div id="error_messages" class="yui3-errortext"></div>');
            pageElement.prepend($errorMessages)
        }
        var $errorText = $("<div>" + errorText + "</div>");
        $errorMessages.append($errorText)
    };
    exports.removeErrorText = function (pageElement) {
        var $errorMessages = pageElement.find("#error_messages");
        if ($errorMessages && $errorMessages.length > 0) {
            $errorMessages.empty()
        }
    };
    exports.isJossAndMainStore = function () {
        if (wf.constants.IS_JOSS_STORE) {
            return true
        } else {
            return false
        }
    };
    return exports
});
define("@Templates/stores/header/search/bar_view", ["underscore", "tungstenjs", "@Templates/stores/partials/_wf_button_tungsten", "@Templates/stores/header/search/partials/_results"], function (_, tungstenjs) {
    var Template = tungstenjs._template,
        template = new Template(["\n", {
            t: 7,
            e: "form",
            a: {
                name: "keyword",
                action: ["", {
                    t: 2,
                    r: "action_url"
                }, ""],
                autocomplete: "off",
                "class": "SearchBox js-search-wrap search_wrap placeholder"
            },
            f: ["\n  ", {
                t: 4,
                r: "header_redesign_variations_test",
                f: ["\n    ", {
                    t: 7,
                    e: "label",
                    a: {
                        "for": "main_search_field",
                        "class": "mainsearch_label js-main-search-label"
                    },
                    f: ["\n      ", {
                        t: 3,
                        r: "lnrs_search"
                    }, "\n    "]
                }, "\n  "],
                n: 51
            }, "\n  ", {
                t: 4,
                r: "is_tabbed_trade_site",
                f: [" ", {
                    t: 9,
                    c: " ss_not_b2b_account "
                }, " "],
                n: 51
            }, "\n  ", {
                t: 7,
                e: "div",
                a: {
                    "class": ["headertable ", {
                        t: 4,
                        r: "has_results",
                        f: ["active_results"]
                    }, " ", {
                        t: 2,
                        r: "ss_autocomplete_extra_class"
                    }, " ", {
                        t: 4,
                        r: "is_tabbed_trade_site",
                        f: [" tradetab_search "]
                    }, "\n   ", {
                        t: 4,
                        r: "b_wayfair_brands_style_header",
                        f: [" js-search-border "]
                    }, " ", {
                        t: 4,
                        r: "isFocused",
                        f: [" focused "]
                    }, ""]
                },
                f: ["\n    ", {
                    t: 7,
                    e: "div",
                    a: {
                        "class": ["SearchBox-container js-autocomplete-container autocomplete_container ", {
                            t: 4,
                            r: "is_dwell",
                            f: [" search_div "]
                        }, " ", {
                            t: 4,
                            r: "is_dwell",
                            f: [" bgcolorwhite "],
                            n: 51
                        }, ""]
                    },
                    f: ["\n      ", {
                        t: 7,
                        e: "input",
                        a: {
                            type: "text",
                            id: "main_search_field",
                            "class": ["SearchBox-field  js-autocomplete-input js-search-field js-main-search mainsearch js-ss-type fl ", {
                                t: 4,
                                r: "is_dwell",
                                f: [" whitetext uppercase "]
                            }, ""],
                            autocomplete: "off",
                            name: "keyword",
                            "data-click-track": "search_bar_text",
                            "data-click-location": "search_bar_text",
                            value: ["", {
                                t: 2,
                                r: "search_val"
                            }, ""]
                        },
                        m: [{
                            t: 4,
                            r: "show_search_placeholder",
                            f: [{
                                t: 3,
                                r: "placeholder_html"
                            }]
                        }]
                    }, "\n      ", {
                        t: 7,
                        e: "input",
                        a: {
                            type: "hidden",
                            name: "command",
                            value: "dosearch"
                        }
                    }, "\n      ", {
                        t: 7,
                        e: "input",
                        a: {
                            type: "hidden",
                            name: "new_keyword_search",
                            value: "true"
                        }
                    }, "\n      ", {
                        t: 4,
                        r: "header_redesign_variations_test",
                        f: ["\n        ", {
                            t: 4,
                            r: "button_context",
                            f: ["\n          ", {
                                t: 8,
                                r: "stores/partials/_wf_button_tungsten"
                            }, "\n        "]
                        }, "\n      "],
                        n: 51
                    }, "\n      ", {
                        t: 4,
                        r: "header_redesign_variations_test",
                        f: ["\n        ", {
                            t: 7,
                            e: "button",
                            a: {
                                type: "submit",
                                "class": "SearchBox-button js-ss-click",
                                "data-click-location": "search_button_clicked",
                                "data-click-track": "search_button_clicked"
                            }
                        }, "\n      "]
                    }, "\n      ", {
                        t: 7,
                        e: "p",
                        a: {
                            "class": "c"
                        }
                    }, "\n    "]
                }, "\n    \n    ", {
                    t: 7,
                    e: "div",
                    a: {
                        "class": "SearchBox-results autocomplete_results_container pos_rel"
                    },
                    f: [{
                        t: 8,
                        r: "stores/header/search/partials/_results"
                    }]
                }, "\n  "]
            }, "\n"]
        }, "\n"]);
    template.register("stores/header/search/bar");
    var output = function (data) {
        return template.toString(data, !0)
    };
    return output.toDom = _.bind(template.toDom, template), output.toVdom = _.bind(template.toVdom, template), output.attachView = _.bind(template.attachView, template), output.wrap = _.bind(template.wrap, template), output
});
define("header_search_bar_view", ["wayfair", "wf_autocomplete_view", "cocktail", "sitespect", "wf_storage", "event_dispatch"], function (wf, AutocompleteView, Cocktail, sitespect, wfStorage, EventDispatch) {
    "use strict";
    var autocompleteOpenedYet = false;
    var headerInteraction = false;
    var stickyInteraction = false;

    function recordHeaderInteraction(self) {
        var isSticky = self.$el.hasClass("js-autocomplete-sticky");
        if (isSticky && !stickyInteraction) {
            sitespect.trackEvent("StickyHeaderSearchInteraction");
            stickyInteraction = true
        } else if (!isSticky && !headerInteraction) {
            sitespect.trackEvent("HeaderSearchInteraction");
            headerInteraction = true
        }
    }
    var SearchBarView = AutocompleteView.extend({
        debugName: "SearchBarView",
        setupTracking: function () {
            var self = this;
            this.on("selectedItem", function (originalSearchTerm, type, selectedIndex, selectedResult) {
                var clickLocation;
                if (type === "typed") {
                    clickLocation = "SearchButton"
                } else {
                    clickLocation = "autocompleteRank" + selectedIndex + "/";
                    if (selectedResult) {
                        if (selectedResult.category) {
                            clickLocation += "Category"
                        }
                        if (selectedResult.brand) {
                            clickLocation += "Brand"
                        }
                        if (selectedResult.sku) {
                            clickLocation += "SKU"
                        }
                    }
                    clickLocation += "," + originalSearchTerm
                }
                sitespect.trackEvent(clickLocation);
                recordHeaderInteraction(self);
                wfStorage.cookie.set({
                    key: "ClickLocation",
                    value: clickLocation,
                    ttl: 0
                })
            });
            this.model.on("searchEvent", function () {
                if (!autocompleteOpenedYet) {
                    recordHeaderInteraction(self);
                    sitespect.trackEvent("autocompleteOpened");
                    autocompleteOpenedYet = true
                }
            })
        }
    });
    Cocktail.mixin(SearchBarView, {
        postInitialize: function () {
            this.setupTracking();
            EventDispatch.trigger(wf.constants.eventTypes.AMD_EVENT_TYPE, {
                verb: "SEARCH_BAR:POST_INITIALIZE"
            })
        }
    });
    return SearchBarView
});
define("header_search_bar_model", ["wf_autocomplete_model"], function (AutocompleteModel) {
    "use strict";
    var SearchBarModel = AutocompleteModel.extend({
        parseResults: function (searchTerm, results) {
            for (var i = results.length; i--;) {
                this.parseAndAddPredictiveSearchInfo(searchTerm, results[i])
            }
        },
        parseAndAddPredictiveSearchInfo: function (searchTerm, result) {
            var resultText = result.value;
            var highlightClass = this.get("highlightClass");
            searchTerm = searchTerm.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
            var results = resultText.split("||");
            var highlight = function (substr, match) {
                return '<span class="' + highlightClass + '">' + match + "</span>"
            };
            var processedPossibleMatch = "";
            for (var i = 0; i < results.length; i++) {
                var possibleMatch = results[i];
                processedPossibleMatch = possibleMatch.replace(new RegExp("(" + searchTerm + ")", "i"), highlight);
                if (processedPossibleMatch !== possibleMatch) {
                    result.value = possibleMatch;
                    result.label = processedPossibleMatch;
                    return
                }
            }
            result.value = result.label = processedPossibleMatch = results[0]
        }
    });
    return SearchBarModel
});
define("placeholder", ["jquery"], function ($) {
    var isInputSupported = "placeholder" in document.createElement("input"),
        isTextareaSupported = "placeholder" in document.createElement("textarea"),
        prototype = $.fn,
        valHooks = $.valHooks,
        hooks, placeholder;
    if (isInputSupported && isTextareaSupported) {
        placeholder = prototype.placeholder = function () {
            return this
        };
        placeholder.input = placeholder.textarea = true
    } else {
        var placeholderPopulatedFilter = function (i, el) {
            return el.getAttribute("placeholder") !== ""
        };
        placeholder = prototype.placeholder = function () {
            var $this = this;
            $this.filter((isInputSupported ? "textarea" : ":input") + "[placeholder]").not('[type="password"]').not(".placeholder").filter(placeholderPopulatedFilter).bind({
                "focus.placeholder": clearPlaceholder,
                "drop.placeholder": clearPlaceholder,
                "blur.placeholder": setPlaceholder
            }).data("placeholder-enabled", true).trigger("blur.placeholder");
            var passwordFields = $this.filter((isInputSupported ? "textarea" : ":input") + '[placeholder][type="password"]').not(".placeholder").filter(placeholderPopulatedFilter);
            if (passwordFields.length) {
                var placeholders = initPasswords(passwordFields);
                passwordFields.bind({
                    "drop.placeholder": clearPasswordPlaceholder,
                    "blur.placeholder": setPasswordPlaceholder
                }).data("placeholder-enabled", true).trigger("blur.placeholder");
                placeholders.bind({
                    "focus.placeholder": clearPasswordPlaceholder,
                    "blur.placeholder": setPasswordPlaceholder
                })
            }
            return $this
        };
        placeholder.input = isInputSupported;
        placeholder.textarea = isTextareaSupported;
        hooks = {
            get: function (element) {
                var $element = $(element);
                return $element.data("placeholder-enabled") && $element.hasClass("placeholder") ? "" : element.value
            },
            set: function (element, value) {
                var $element = $(element);
                if (!$element.data("placeholder-enabled")) {
                    return element.value = value
                }
                if (value === "") {
                    element.value = value;
                    if (element != document.activeElement) {
                        setPlaceholder.call(element)
                    }
                } else if ($element.hasClass("placeholder")) {
                    clearPlaceholder.call(element, true, value) || (element.value = value)
                } else {
                    element.value = value
                }
                return $element
            }
        };
        isInputSupported || (valHooks.input = hooks);
        isTextareaSupported || (valHooks.textarea = hooks);
        $(function () {
            $(document).delegate("form", "submit.placeholder", function () {
                var $inputs = $(".placeholder", this).each(clearPlaceholder);
                setTimeout(function () {
                    $inputs.each(setPlaceholder)
                }, 10)
            })
        });
        $(window).bind("beforeunload.placeholder", function () {
            $(".placeholder").each(function () {
                this.value = ""
            })
        })
    }

    function args(elem) {
        var newAttrs = {},
            rinlinejQuery = /^jQuery\d+$/;
        $.each(elem.attributes, function (i, attr) {
            if (attr.specified && !rinlinejQuery.test(attr.name)) {
                newAttrs[attr.name] = attr.value
            }
        });
        return newAttrs
    }

    function clearPlaceholder() {
        var input = this,
            $input = $(input);
        if (input.value === $input.attr("placeholder") && $input.hasClass("placeholder")) {
            input.value = "";
            $input.removeClass("placeholder");
            input == document.activeElement && input.select()
        }
    }

    function setPlaceholder() {
        var input = this,
            $input = $(input);
        if (input.value === "") {
            $input.addClass("placeholder");
            $input[0].value = $input.attr("placeholder")
        }
    }

    function clearPasswordPlaceholder() {
        var input = this,
            $input = $(input);
        if (input.type === "text") {
            $input.next("input[type=password]").removeClass("hidden-node").trigger("focus");
            $input.addClass("hidden-node")
        }
    }

    function setPasswordPlaceholder() {
        var input = this,
            $input = $(input);
        if (input.type === "password" && input.value === "") {
            $input.prev("input[type=text]").removeClass("hidden-node");
            $input.addClass("hidden-node")
        }
    }

    function initPasswords($elements) {
        var plain, $el, newElements = [];
        for (var i = $elements.length; i--;) {
            $el = $elements.eq(i);
            plain = document.createElement("input");
            plain.type = "text";
            plain.value = $el.attr("placeholder");
            plain.className = $el.prop("className") + " placeholder hidden-node";
            plain.setAttribute("placeholder", plain.value);
            $el.before(plain);
            newElements[i] = plain
        }
        return $(newElements)
    }
    return $
});
define("wf_modal_view", ["wayfair", "jquery", "wf_popup_view", "wf_modal_model", "modal_mixin_ajax", "popup_mixin_modal", "cocktail", "wf_scheduler"], function (wf, $, PopupView, ModalModel, ajaxMixin, modalMixin, Cocktail, wfScheduler) {
    "use strict";
    var ModalView = PopupView.extend({
        defaultModel: ModalModel,
        _position: function (winSize) {
            this.$el.css({
                left: Math.abs((winSize.width - this.$el.width()) / 2),
                top: Math.abs((winSize.height - this.$el.height()) / 2)
            })
        }
    });
    Cocktail.mixin(ModalView, modalMixin);
    wfScheduler.queuePostLoadTask(function () {
        wf.$doc.on("click", ".js-auto-modal", function (evt) {
            var opts = $(evt.currentTarget).data();
            if (opts.selector) {
                opts.content = $(opts.selector).html()
            }
            new ModalView(opts)
        })
    });
    return ModalView
});
define("quickview_modal_model", ["wayfair", "jquery", "wf_model_base", "wf_model_save_to_registry"], function (wf, $, BaseModel, AddToRegistryModel) {
    "use strict";
    var QuickviewModalModel = BaseModel.extend({
        defaults: {
            active_tab: "details"
        },
        fetchQuickView: function (data) {
            if (data.showRequiredItems == null) {
                data.showRequiredItems = false
            }
            data.ajax = 1;
            var self = this;
            return $.ajax({
                url: wf.constants.STORE_URL + "/a/product/quick_view",
                method: "GET",
                dataType: "json",
                data: data
            }).done(function (response) {
                response.js_model = JSON.parse(response.js_model);
                response.product_details_data = JSON.parse(response.product_details_data);
                response.add_to_registry = new AddToRegistryModel(response.add_to_registry);
                for (var property in response) {
                    self.set(property, response[property])
                }
                wf.appData.product_data = self.get("js_model")
            })
        },
        derived: {
            is_summary_tab_active: {
                deps: ["active_tab"],
                fn: function () {
                    return this.get("active_tab") === "summary"
                }
            },
            is_details_tab_active: {
                deps: ["active_tab"],
                fn: function () {
                    return this.get("active_tab") === "details"
                }
            }
        }
    });
    return QuickviewModalModel
});
define("quickview_modal_view", ["wf_tungsten_view_base", "jquery", "@Templates/stores/product/quickview/quickview_modal_view", "wf_modal_view", "@Templates/stores/plcc/waiting_modal_view", "registry_event_bus", "wf_view_save_to_registry", "inventory", "two_day_shipping_panel"], function (BaseView, $, QuickviewModalTemplate, ModalView, waitingModalTemplate, RegEventBus, SaveToRegistryView) {
    "use strict";
    var saveToRegistry;
    var QuickviewModalView = BaseView.extend({
        compiledTemplate: QuickviewModalTemplate,
        events: {
            "click .js-tab-header": "handle_tab_change"
        },
        postInitialize: function () {
            var ele = this.$(".js-add-to-registry-wrap");
            if (ele.length) {
                saveToRegistry = new SaveToRegistryView({
                    el: ele,
                    model: this.model.get("add_to_registry")
                })
            }
        },
        handle_tab_change: function (e) {
            var tabId = $(e.currentTarget).data("tab-id");
            this.model.set("active_tab", tabId)
        },
        destroy: function () {
            if (saveToRegistry) {
                saveToRegistry.destroy()
            }
            return BaseView.prototype.destroy.apply(this)
        }
    });
    return QuickviewModalView
});
define("thankyou_modal_model", ["wayfair", "jquery", "event_dispatch", "wf_model_base", "modal_added_product"], function (wf, $, EventDispatch, BaseModel, AddedProductModal) {
    "use strict";
    var ThankYouModalModel = BaseModel.extend({
        fetchThankyou: function (cfg) {
            var data = cfg;
            data.ajax = 1;
            var self = this;
            return $.ajax({
                url: wf.constants.STORE_URL + "/a/product/quickview_thankyou",
                method: "GET",
                dataType: "json",
                data: data
            }).done(function (response) {
                for (var property in response) {
                    self.set(property, response[property])
                }
                self.getBasketCost();
                EventDispatch.trigger(wf.constants.eventTypes.TRACKING_EVENT_TYPE, {
                    verb: "SPVTWO",
                    data: {
                        rfLocation: wf.constants.STORE_URL + "/a/product/quickview_thankyou" + "?sku=" + data.sku,
                        rfHTTPReferrer: document.location.href,
                        rfCstmVars: "PageType=CheckoutUpsellModal;ID=" + data.sku
                    }
                })
            })
        },
        getBasketCost: function () {
            var self = this,
                spinnerHtml = '<div class="carwait itemwait bgloading" name="carwait" style="text-align:left;"></div>';
            $("#subtotal").html(spinnerHtml);
            $("#propricing").html(spinnerHtml);
            $("#rewardstotal").html(spinnerHtml);
            $.ajax({
                type: "GET",
                url: wf.constants.STORE_URL + "/a/checkout/basket/get_basket_cost",
                dataType: "json"
            }).done(function (data) {
                self.basketCostSuccess(data)
            })
        },
        basketCostSuccess: function (dataObj) {
            var subTotal = $("#subtotal"),
                propricing = $("#propricing"),
                rewardstotal = $("#rewardstotal"),
                respSubTotal = dataObj.subtotal,
                respTotalFloat = dataObj.totalfloat,
                respProPricing = dataObj.propricing,
                respRewardsTotal = dataObj.rewardstotal,
                respOrderId = dataObj.orderid,
                respOrderCreateDate = dataObj.createddate;
            subTotal.html(respSubTotal);
            propricing.html(respProPricing);
            rewardstotal.html(respRewardsTotal);
            EventDispatch.trigger(wf.constants.eventTypes.TRACKING_EVENT_TYPE, {
                verb: "SPVTWO",
                data: {
                    rfCstmVars: "Event=1;Click=ShowBasketPrice;BasketInfo=" + respOrderId + "-" + respTotalFloat + "-" + respOrderCreateDate + ";"
                }
            })
        }
    });
    return ThankYouModalModel
});
define("thankyou_modal_view", ["wf_tungsten_view_base", "jquery", "@Templates/stores/product/quickview/thankyou_modal_view", "wf_modal_view", "@Templates/stores/plcc/waiting_modal_view", "inventory", "two_day_shipping_panel"], function (BaseView, $, ThankyouModalTemplate, ModalView, waitingModalTemplate) {
    "use strict";
    var QuickviewModalView = BaseView.extend({
        compiledTemplate: ThankyouModalTemplate
    });
    return QuickviewModalView
});
define("afc", [], function () {
    "use strict";
    var exports = {};
    exports.insertgoogafc = function () {
        var h = true,
            i = null,
            j = false,
            aa = (new Date).getTime(),
            ba = function (a) {
                var b = (new Date).getTime() - aa;
                b = "&dtd=" + (b < 1e4 ? b : "M");
                return a + b
            };
        var k = window,
            ca = function (a, b, c) {
                a = a.split(".");
                c = c || k;
                !(a[0] in c) && c.execScript && c.execScript("var " + a[0]);
                for (var d; a.length && (d = a.shift());)
                    if (!a.length && b !== undefined) c[d] = b;
                    else c = c[d] ? c[d] : c[d] = {}
            },
            l = function (a) {
                var b = typeof a;
                if (b == "object")
                    if (a) {
                        if (a instanceof Array || !(a instanceof Object) && Object.prototype.toString.call(a) == "[object Array]" || typeof a.length == "number" && typeof a.splice != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("splice")) return "array";
                        if (!(a instanceof Object) && (Object.prototype.toString.call(a) == "[object Function]" || typeof a.call != "undefined" && typeof a.propertyIsEnumerable != "undefined" && !a.propertyIsEnumerable("call"))) return "function"
                    } else return "null";
                else if (b == "function" && typeof a.call == "undefined") return "object";
                return b
            },
            m = function (a) {
                return l(a) == "array"
            },
            da = function (a) {
                var b = l(a);
                return b == "array" || b == "object" && typeof a.length == "number"
            },
            o = function (a) {
                return typeof a == "string"
            },
            ea = function (a) {
                a = l(a);
                return a == "object" || a == "array" || a == "function"
            },
            fa = function (a) {
                var b = l(a);
                if (b == "object" || b == "array") {
                    if (a.clone) return a.clone.call(a);
                    b = b == "array" ? [] : {};
                    for (var c in a) b[c] = fa(a[c]);
                    return b
                }
                return a
            },
            p = function (a, b) {
                var c = b || k;
                if (arguments.length > 2) {
                    var d = Array.prototype.slice.call(arguments, 2);
                    return function () {
                        var e = Array.prototype.slice.call(arguments);
                        Array.prototype.unshift.apply(e, d);
                        return a.apply(c, e)
                    }
                } else return function () {
                    return a.apply(c, arguments)
                }
            },
            q = function (a, b, c) {
                ca(a, b, c)
            },
            ga = function (a, b, c) {
                a[b] = c
            };
        var r = function (a, b) {
                var c = parseFloat(a);
                return isNaN(c) || c > 1 || c < 0 ? b : c
            },
            s = function (a, b) {
                if (a == "true") return h;
                if (a == "false") return j;
                return b
            },
            ha = /^([\w-]+\.)*([\w-]{2,})(\:[0-9]+)?$/,
            t = function (a, b) {
                if (!a) return b;
                var c = a.match(ha);
                return c ? c[0] : b
            };
        var ia = function () {
                return t("", "googleads.g.doubleclick.net")
            },
            ja = function () {
                return t("", "pagead2.googlesyndication.com")
            },
            u = function () {
                return t("", "pagead2.googlesyndication.com")
            };
        var v = Array.prototype,
            ka = v.forEach ? function (a, b, c) {
                v.forEach.call(a, b, c)
            } : function (a, b, c) {
                for (var d = a.length, e = o(a) ? a.split("") : a, f = 0; f < d; f++) f in e && b.call(c, e[f], f, a)
            },
            la = function () {
                return v.concat.apply(v, arguments)
            },
            ma = function (a) {
                if (m(a)) return la(a);
                else {
                    for (var b = [], c = 0, d = a.length; c < d; c++) b[c] = a[c];
                    return b
                }
            };
        var w = function (a, b) {
            this.width = a;
            this.height = b
        };
        w.prototype.clone = function () {
            return new w(this.width, this.height)
        };
        w.prototype.ceil = function () {
            this.width = Math.ceil(this.width);
            this.height = Math.ceil(this.height);
            return this
        };
        w.prototype.floor = function () {
            this.width = Math.floor(this.width);
            this.height = Math.floor(this.height);
            return this
        };
        w.prototype.round = function () {
            this.width = Math.round(this.width);
            this.height = Math.round(this.height);
            return this
        };
        w.prototype.scale = function (a) {
            this.width *= a;
            this.height *= a;
            return this
        };
        var na = function (a, b, c) {
            for (var d in a) b.call(c, a[d], d, a)
        };
        var ta = function (a, b) {
                if (b) return a.replace(oa, "&amp;").replace(pa, "&lt;").replace(qa, "&gt;").replace(ra, "&quot;");
                else {
                    if (!sa.test(a)) return a;
                    if (a.indexOf("&") != -1) a = a.replace(oa, "&amp;");
                    if (a.indexOf("<") != -1) a = a.replace(pa, "&lt;");
                    if (a.indexOf(">") != -1) a = a.replace(qa, "&gt;");
                    if (a.indexOf('"') != -1) a = a.replace(ra, "&quot;");
                    return a
                }
            },
            oa = /&/g,
            pa = /</g,
            qa = />/g,
            ra = /\"/g,
            sa = /[&<>\"]/,
            wa = function (a) {
                if (a.indexOf("&") != -1) return "document" in k && a.indexOf("<") == -1 ? ua(a) : va(a);
                return a
            },
            ua = function (a) {
                var b = k.document.createElement("a");
                b.innerHTML = a;
                b.normalize && b.normalize();
                a = b.firstChild.nodeValue;
                b.innerHTML = "";
                return a
            },
            va = function (a) {
                return a.replace(/&([^;]+);/g, function (b, c) {
                    switch (c) {
                    case "amp":
                        return "&";
                    case "lt":
                        return "<";
                    case "gt":
                        return ">";
                    case "quot":
                        return '"';
                    default:
                        if (c.charAt(0) == "#") {
                            var d = Number("0" + c.substr(1));
                            if (!isNaN(d)) return String.fromCharCode(d)
                        }
                        return b
                    }
                })
            },
            xa = function (a, b) {
                for (var c = b.length, d = 0; d < c; d++) {
                    var e = c == 1 ? b : b.charAt(d);
                    if (a.charAt(0) == e && a.charAt(a.length - 1) == e) return a.substring(1, a.length - 1)
                }
                return a
            },
            za = function (a, b) {
                for (var c = 0, d = String(a).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), e = String(b).replace(/^[\s\xa0]+|[\s\xa0]+$/g, "").split("."), f = Math.max(d.length, e.length), g = 0; c == 0 && g < f; g++) {
                    var n = d[g] || "",
                        N = e[g] || "",
                        D = new RegExp("(\\d*)(\\D*)", "g"),
                        Lb = new RegExp("(\\d*)(\\D*)", "g");
                    do {
                        var O = D.exec(n) || ["", "", ""],
                            P = Lb.exec(N) || ["", "", ""];
                        if (O[0].length == 0 && P[0].length == 0) break;
                        c = O[1].length == 0 ? 0 : parseInt(O[1], 10);
                        var Mb = P[1].length == 0 ? 0 : parseInt(P[1], 10);
                        c = ya(c, Mb) || ya(O[2].length == 0, P[2].length == 0) || ya(O[2], P[2])
                    } while (c == 0)
                }
                return c
            },
            ya = function (a, b) {
                if (a < b) return -1;
                else if (a > b) return 1;
                return 0
            };
        var x, Aa, y, Ba, Ca, Da, Ea, Fa, Ga, Ha = function () {
                return k.navigator ? k.navigator.userAgent : i
            },
            z = function () {
                return k.navigator
            },
            Ia = function () {
                Ca = Ba = y = Aa = x = j;
                var a;
                if (a = Ha()) {
                    var b = z();
                    x = a.indexOf("Opera") == 0;
                    Aa = !x && a.indexOf("MSIE") != -1;
                    Ba = (y = !x && a.indexOf("WebKit") != -1) && a.indexOf("Mobile") != -1;
                    Ca = !x && !y && b.product == "Gecko"
                }
            };
        Ia();
        var A = x,
            B = Aa,
            Ja = Ca,
            Ka = y,
            La = Ba,
            Ma = function () {
                var a = z();
                return a && a.platform || ""
            },
            Na = Ma(),
            Oa = function () {
                Da = Na.indexOf("Mac") != -1;
                Ea = Na.indexOf("Win") != -1;
                Fa = Na.indexOf("Linux") != -1;
                Ga = !!z() && (z().appVersion || "").indexOf("X11") != -1
            };
        Oa();
        var Pa = Da,
            Qa = Ea,
            Ra = Fa,
            Sa = function () {
                var a = "",
                    b;
                if (A && k.opera) {
                    a = k.opera.version;
                    a = typeof a == "function" ? a() : a
                } else {
                    if (Ja) b = /rv\:([^\);]+)(\)|;)/;
                    else if (B) b = /MSIE\s+([^\);]+)(\)|;)/;
                    else if (Ka) b = /WebKit\/(\S+)/;
                    if (b) a = (a = b.exec(Ha())) ? a[1] : ""
                }
                return a
            },
            Ta = Sa(),
            Ua = {},
            C = function (a) {
                return Ua[a] || (Ua[a] = za(Ta, a) >= 0)
            };
        var Va = function (a) {
                return o(a) ? document.getElementById(a) : a
            },
            Wa = Va,
            Ya = function (a, b) {
                na(b, function (c, d) {
                    if (d == "style") a.style.cssText = c;
                    else if (d == "class") a.className = c;
                    else if (d == "for") a.htmlFor = c;
                    else if (d in Xa) a.setAttribute(Xa[d], c);
                    else a[d] = c
                })
            },
            Xa = {
                cellpadding: "cellPadding",
                cellspacing: "cellSpacing",
                colspan: "colSpan",
                rowspan: "rowSpan",
                valign: "vAlign",
                height: "height",
                width: "width",
                usemap: "useMap",
                frameborder: "frameBorder",
                type: "type"
            },
            Za = function (a) {
                var b = a.document;
                if (Ka && !C("500") && !La) {
                    if (typeof a.innerHeight == "undefined") a = window;
                    b = a.innerHeight;
                    var c = a.document.documentElement.scrollHeight;
                    if (a == a.top)
                        if (c < b) b -= 15;
                    return new w(a.innerWidth, b)
                }
                a = b.compatMode == "CSS1Compat" && (!A || A && C("9.50")) ? b.documentElement : b.body;
                return new w(a.clientWidth, a.clientHeight)
            },
            ab = function () {
                return $a(document, arguments)
            },
            $a = function (a, b) {
                var c = b[0],
                    d = b[1];
                if (B && d && (d.name || d.type)) {
                    c = ["<", c];
                    d.name && c.push(' name="', ta(d.name), '"');
                    if (d.type) {
                        c.push(' type="', ta(d.type), '"');
                        d = fa(d);
                        delete d.type
                    }
                    c.push(">");
                    c = c.join("")
                }
                var e = a.createElement(c);
                if (d)
                    if (o(d)) e.className = d;
                    else Ya(e, d);
                if (b.length > 2) {
                    d = function (g) {
                        if (g) e.appendChild(o(g) ? a.createTextNode(g) : g)
                    };
                    for (c = 2; c < b.length; c++) {
                        var f = b[c];
                        da(f) && !(ea(f) && f.nodeType > 0) ? ka(bb(f) ? ma(f) : f, d) : d(f)
                    }
                }
                return e
            },
            cb = function (a, b) {
                a.appendChild(b)
            },
            bb = function (a) {
                if (a && typeof a.length == "number")
                    if (ea(a)) return typeof a.item == "function" || typeof a.item == "string";
                    else if (l(a) == "function") return typeof a.item == "function";
                return j
            };
        var db = document,
            E = window;
        u();
        var F = function (a, b) {
                for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && b.call(i, a[c], c, a)
            },
            eb = function (a) {
                return !!a && typeof a == "function" && !!a.call
            },
            fb = function (a) {
                return !!a && (typeof a == "object" || typeof a == "function")
            },
            hb = function (a, b) {
                if (!a || !fb(a)) return h;
                return !gb(a, b.prototype)
            },
            gb = function (a, b) {
                if (!a) return j;
                var c = h;
                F(b, function (d, e) {
                    if (!c || !(e in a) || typeof d != typeof a[e]) c = j
                });
                return c
            },
            ib = function (a) {
                if (arguments.length < 2) return a.length;
                for (var b = 1, c = arguments.length; b < c; ++b) a.push(arguments[b]);
                return a.length
            };

        function G(a) {
            return typeof encodeURIComponent == "function" ? encodeURIComponent(a) : escape(a)
        }

        function jb(a, b, c) {
            var d = document.createElement("script");
            d.type = "text/javascript";
            if (b) d.onload = b;
            if (c) d.id = c;
            d.src = a;
            var e = document.getElementsByTagName("head")[0];
            if (!e) return j;
            window.setTimeout(function () {
                e.appendChild(d)
            }, 0);
            return h
        }

        function kb(a, b) {
            if (a.attachEvent) {
                a.attachEvent("onload", b);
                return h
            }
            if (a.addEventListener) {
                a.addEventListener("load", b, j);
                return h
            }
            return j
        }

        function lb(a, b) {
            a.google_image_requests || (a.google_image_requests = []);
            var c = new Image;
            c.src = b;
            a.google_image_requests.push(c)
        }

        function mb(a) {
            if (a in nb) return nb[a];
            return nb[a] = navigator.userAgent.toLowerCase().indexOf(a) != -1
        }
        var nb = {};

        function ob() {
            if (navigator.plugins && navigator.mimeTypes.length) {
                var a = navigator.plugins["Shockwave Flash"];
                if (a && a.description) return a.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s)+r/, ".")
            } else if (navigator.userAgent && navigator.userAgent.indexOf("Windows CE") >= 0) {
                a = 3;
                for (var b = 1; b;) try {
                    b = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + (a + 1));
                    a++
                } catch (c) {
                    b = i
                }
                return a.toString()
            } else if (mb("msie") && !window.opera) {
                b = i;
                try {
                    b = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7")
                } catch (d) {
                    a = 0;
                    try {
                        b = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
                        a = 6;
                        b.AllowScriptAccess = "always"
                    } catch (e) {
                        if (a == 6) return a.toString()
                    }
                    try {
                        b = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")
                    } catch (f) {}
                }
                if (b) {
                    a = b.GetVariable("$version").split(" ")[1];
                    return a.replace(/,/g, ".")
                }
            }
            return "0"
        }

        function pb(a) {
            var b = a.google_ad_format;
            if (b) return b.indexOf("_0ads") > 0;
            return a.google_ad_output != "html" && a.google_num_radlinks > 0
        }

        function H(a) {
            return !!a && a.indexOf("_sdo") != -1
        }

        function qb(a, b) {
            if (!(Math.random() < 1e-4)) {
                var c = Math.random();
                if (c < b) {
                    c = Math.floor(c / b * a.length);
                    return a[c]
                }
            }
            return ""
        }
        var rb = function (a) {
                a.u_tz = -(new Date).getTimezoneOffset();
                a.u_his = window.history.length;
                a.u_java = navigator.javaEnabled();
                if (window.screen) {
                    a.u_h = window.screen.height;
                    a.u_w = window.screen.width;
                    a.u_ah = window.screen.availHeight;
                    a.u_aw = window.screen.availWidth;
                    a.u_cd = window.screen.colorDepth
                }
                if (navigator.plugins) a.u_nplug = navigator.plugins.length;
                if (navigator.mimeTypes) a.u_nmime = navigator.mimeTypes.length
            },
            sb = function (a, b) {
                var c = b || E;
                if (a && c.top != c) c = c.top;
                try {
                    return c.document && !c.document.body ? new w(-1, -1) : Za(c || window)
                } catch (d) {
                    return new w(-12245933, -12245933)
                }
            },
            tb = function (a, b) {
                var c = a.length;
                if (c == 0) return 0;
                for (var d = b || 305419896, e = 0; e < c; e++) {
                    var f = a.charCodeAt(e);
                    d ^= (d << 5) + (d >> 2) + f & 4294967295
                }
                return d
            },
            ub = function (a) {
                if (a == a.top) return 0;
                var b = [];
                b.push(a.document.URL);
                a.name && b.push(a.name);
                var c = h;
                a = sb(!c, a);
                b.push(a.width.toString());
                b.push(a.height.toString());
                b = tb(b.join(""));
                return b > 0 ? b : 4294967296 + b
            };
        var vb = {
                google_ad_channel: "channel",
                google_ad_host: "host",
                google_ad_host_channel: "h_ch",
                google_ad_host_tier_id: "ht_id",
                google_ad_section: "region",
                google_ad_type: "ad_type",
                google_adtest: "adtest",
                google_allow_expandable_ads: "ea",
                google_alternate_ad_url: "alternate_ad_url",
                google_alternate_color: "alt_color",
                google_bid: "bid",
                google_city: "gcs",
                google_color_bg: "color_bg",
                google_color_border: "color_border",
                google_color_line: "color_line",
                google_color_link: "color_link",
                google_color_text: "color_text",
                google_color_url: "color_url",
                google_contents: "contents",
                google_country: "gl",
                google_cpm: "cpm",
                google_cust_age: "cust_age",
                google_cust_ch: "cust_ch",
                google_cust_gender: "cust_gender",
                google_cust_id: "cust_id",
                google_cust_interests: "cust_interests",
                google_cust_job: "cust_job",
                google_cust_l: "cust_l",
                google_cust_lh: "cust_lh",
                google_cust_u_url: "cust_u_url",
                google_disable_video_autoplay: "disable_video_autoplay",
                google_ed: "ed",
                google_encoding: "oe",
                google_feedback: "feedback_link",
                google_flash_version: "flash",
                google_font_face: "f",
                google_font_size: "fs",
                google_hints: "hints",
                google_kw: "kw",
                google_kw_type: "kw_type",
                google_language: "hl",
                google_page_url: "url",
                google_region: "gr",
                google_reuse_colors: "reuse_colors",
                google_safe: "adsafe",
                google_tag_info: "gut",
                google_targeting: "targeting",
                google_targeting_video_doc_id: "tvdi",
                google_ui_features: "ui",
                google_ui_version: "uiv",
                google_video_doc_id: "video_doc_id",
                google_video_product_type: "video_product_type"
            },
            wb = {
                google_ad_client: "client",
                google_ad_format: "format",
                google_ad_output: "output",
                google_ad_callback: "callback",
                google_ad_height: "h",
                google_ad_override: "google_ad_override",
                google_ad_slot: "slotname",
                google_ad_width: "w",
                google_ctr_threshold: "ctr_t",
                google_image_size: "image_size",
                google_last_modified_time: "lmt",
                google_max_num_ads: "num_ads",
                google_max_radlink_len: "max_radlink_len",
                google_num_radlinks: "num_radlinks",
                google_num_radlinks_per_unit: "num_radlinks_per_unit",
                google_only_ads_with_video: "only_ads_with_video",
                google_rl_dest_url: "rl_dest_url",
                google_rl_filtering: "rl_filtering",
                google_rl_mode: "rl_mode",
                google_rt: "rt",
                google_skip: "skip"
            },
            xb = {
                google_only_pyv_ads: "pyv",
                google_with_pyv_ads: "withpyv"
            };

        function yb(a, b) {
            try {
                return a.top.document.URL == b.URL
            } catch (c) {}
            return j
        }

        function zb(a, b, c, d) {
            c = c || a.google_ad_width;
            d = d || a.google_ad_height;
            if (yb(a, b)) return j;
            var e = b.documentElement;
            if (c && d) {
                var f = 1,
                    g = 1;
                if (a.innerHeight) {
                    f = a.innerWidth;
                    g = a.innerHeight
                } else if (e && e.clientHeight) {
                    f = e.clientWidth;
                    g = e.clientHeight
                } else if (b.body) {
                    f = b.body.clientWidth;
                    g = b.body.clientHeight
                }
                if (g > 2 * d || f > 2 * c) return j
            }
            return h
        }

        function Ab(a, b) {
            F(b, function (c, d) {
                a["google_" + d] = c
            })
        }

        function Bb(a, b) {
            if (!b) return a.URL;
            return a.referrer
        }

        function Cb(a, b) {
            if (!b && a.google_referrer_url == i) return "0";
            else if (b && a.google_referrer_url == i) return "1";
            else if (!b && a.google_referrer_url != i) return "2";
            else if (b && a.google_referrer_url != i) return "3";
            return "4"
        }

        function Db(a, b, c, d) {
            a.page_url = Bb(c, d);
            a.page_location = i
        }

        function Eb(a, b, c, d) {
            a.page_url = b.google_page_url;
            a.page_location = Bb(c, d) || "EMPTY"
        }

        function Fb(a, b) {
            var c = {},
                d = zb(a, b, a.google_ad_width, a.google_ad_height);
            c.iframing = Cb(a, d);
            a.google_page_url ? Eb(c, a, b, d) : Db(c, a, b, d);
            c.last_modified_time = b.URL == c.page_url ? Date.parse(b.lastModified) / 1e3 : i;
            c.referrer_url = d ? a.google_referrer_url : a.google_page_url && a.google_referrer_url ? a.google_referrer_url : b.referrer;
            return c
        }

        function Gb(a) {
            var b = {},
                c = a.URL.substring(a.URL.lastIndexOf("http"));
            b.iframing = i;
            b.page_url = c;
            b.page_location = a.URL;
            b.last_modified_time = i;
            b.referrer_url = c;
            return b
        }

        function Hb(a, b) {
            var c = Ib(a, b);
            Ab(a, c)
        }

        function Ib(a, b) {
            var c;
            return c = a.google_page_url == i && Jb[b.domain] ? Gb(b) : Fb(a, b)
        }
        var Jb = {};
        Jb["ad.yieldmanager.com"] = h;
        var Kb = r("0", 0),
            Nb = r("0", 0),
            Ob = r("1", 0),
            Pb = r("0.01", 0),
            Qb = r("0.01", 0),
            Rb = r("0.008", 0),
            Sb = r("0.01", 0),
            Tb = r("0", 0);
        var Ub = s("false", j),
            Vb = s("false", j),
            Wb = s("false", j),
            Xb = s("false", j);
        var Yb = function (a, b, c) {
            b = p(b, k, a);
            a = window.onerror;
            window.onerror = b;
            try {
                c()
            } catch (d) {
                c = d.toString();
                var e = "";
                if (d.fileName) e = d.fileName;
                var f = -1;
                if (d.lineNumber) f = d.lineNumber;
                b = b(c, e, f);
                if (!b) throw d
            }
            window.onerror = a
        };
        q("google_protectAndRun", Yb);
        var $b = function (a, b, c, d) {
            if (Math.random() < .01) {
                var e = db;
                a = ["http://", ja(), "/pagead/gen_204", "?id=jserror", "&jscb=", Ub ? 1 : 0, "&jscd=", Wb ? 1 : 0, "&context=", G(a), "&msg=", G(b), "&file=", G(c), "&line=", G(d.toString()), "&url=", G(e.URL.substring(0, 512)), "&ref=", G(e.referrer.substring(0, 512))];
                a.push(Zb());
                lb(E, a.join(""))
            }
            return !Xb
        };
        q("google_handleError", $b);
        var bc = function (a) {
                ac |= a
            },
            ac = 0,
            Zb = function () {
                var a = ["&client=", G(E.google_ad_client), "&format=", G(E.google_ad_format), "&slotname=", G(E.google_ad_slot), "&output=", G(E.google_ad_output), "&ad_type=", G(E.google_ad_type)];
                return a.join("")
            };
        var cc = "",
            fc = function () {
                if (window.google_ad_frameborder == i) window.google_ad_frameborder = 0;
                if (window.google_ad_output == i) window.google_ad_output = "html";
                if (H(window.google_ad_format)) {
                    var a = window.google_ad_format.match(/^(\d+)x(\d+)_.*/);
                    if (a) {
                        window.google_ad_width = parseInt(a[1], 10);
                        window.google_ad_height = parseInt(a[2], 10);
                        window.google_ad_output = "html"
                    }
                }
                window.google_ad_format = dc(window.google_ad_format, String(window.google_ad_output), Number(window.google_ad_width), Number(window.google_ad_height), window.google_ad_slot, !!window.google_override_format);
                cc = window.google_ad_client || "";
                window.google_ad_client = ec(window.google_ad_format, window.google_ad_client);
                Hb(window, document);
                if (window.google_flash_version == i) window.google_flash_version = ob();
                window.google_ad_section = window.google_ad_section || window.google_ad_region || "";
                window.google_country = window.google_country || window.google_gl || "";
                a = (new Date).getTime();
                if (m(window.google_color_bg)) window.google_color_bg = I(window.google_color_bg, a);
                if (m(window.google_color_text)) window.google_color_text = I(window.google_color_text, a);
                if (m(window.google_color_link)) window.google_color_link = I(window.google_color_link, a);
                if (m(window.google_color_url)) window.google_color_url = I(window.google_color_url, a);
                if (m(window.google_color_border)) window.google_color_border = I(window.google_color_border, a);
                if (m(window.google_color_line)) window.google_color_line = I(window.google_color_line, a)
            },
            gc = function (a) {
                F(vb, function (b, c) {
                    a[c] = i
                });
                F(wb, function (b, c) {
                    a[c] = i
                });
                F(xb, function (b, c) {
                    a[c] = i
                });
                a.google_container_id = i;
                a.google_eids = i;
                a.google_page_location = i;
                a.google_referrer_url = i;
                a.google_ad_region = i;
                a.google_gl = i
            },
            I = function (a, b) {
                bc(2);
                return a[b % a.length]
            },
            ec = function (a, b) {
                if (!b) return "";
                b = b.toLowerCase();
                return b = H(a) ? hc(b) : ic(b)
            },
            ic = function (a) {
                if (a && a.substring(0, 3) != "ca-") a = "ca-" + a;
                return a
            },
            hc = function (a) {
                if (a && a.substring(0, 7) != "ca-aff-") a = "ca-aff-" + a;
                return a
            },
            dc = function (a, b, c, d, e, f) {
                if (!a && b == "html") a = c + "x" + d;
                return a = jc(a, e, f) ? a.toLowerCase() : ""
            },
            jc = function (a, b, c) {
                if (!a) return j;
                if (!b) return h;
                return c
            };
        var J = document,
            K = navigator,
            L = window;

        function kc() {
            var a = J.cookie,
                b = Math.round((new Date).getTime() / 1e3),
                c = L.google_analytics_domain_name;
            c = typeof c == "undefined" ? lc("auto") : lc(c);
            var d = a.indexOf("__utma=" + c + ".") > -1,
                e = a.indexOf("__utmb=" + c) > -1,
                f = a.indexOf("__utmc=" + c) > -1,
                g = {},
                n = !!L && !!L.gaGlobal;
            if (d) {
                a = a.split("__utma=" + c + ".")[1].split(";")[0].split(".");
                g.sid = e && f ? a[3] + "" : n && L.gaGlobal.sid ? L.gaGlobal.sid : b + "";
                g.vid = a[0] + "." + a[1];
                g.from_cookie = h
            } else {
                g.sid = n && L.gaGlobal.sid ? L.gaGlobal.sid : b + "";
                g.vid = n && L.gaGlobal.vid ? L.gaGlobal.vid : (Math.round(Math.random() * 2147483647) ^ mc() & 2147483647) + "." + b;
                g.from_cookie = j
            }
            g.dh = c;
            g.hid = n && L.gaGlobal.hid ? L.gaGlobal.hid : Math.round(Math.random() * 2147483647);
            return L.gaGlobal = g
        }

        function mc() {
            var a = J.cookie ? J.cookie : "",
                b = L.history.length,
                c, d = [K.appName, K.version, K.language ? K.language : K.browserLanguage, K.platform, K.userAgent, K.javaEnabled() ? 1 : 0].join("");
            if (L.screen) d += L.screen.width + "x" + L.screen.height + L.screen.colorDepth;
            else if (L.java) {
                c = java.awt.Toolkit.getDefaultToolkit().getScreenSize();
                d += c.screen.width + "x" + c.screen.height
            }
            d += a;
            d += J.referrer ? J.referrer : "";
            for (a = d.length; b > 0;) d += b-- ^ a++;
            return nc(d)
        }

        function nc(a) {
            var b = 1,
                c = 0,
                d;
            if (!(a == undefined || a == "")) {
                b = 0;
                for (d = a.length - 1; d >= 0; d--) {
                    c = a.charCodeAt(d);
                    b = (b << 6 & 268435455) + c + (c << 14);
                    c = b & 266338304;
                    b = c != 0 ? b ^ c >> 21 : b
                }
            }
            return b
        }

        function lc(a) {
            if (!a || a == "" || a == "none") return 1;
            if ("auto" == a) {
                a = J.domain;
                if ("www." == a.substring(0, 4)) a = a.substring(4, a.length)
            }
            return nc(a.toLowerCase())
        }
        var oc = function (a) {
                var b = "google_test";
                try {
                    var c = a[b];
                    a[b] = !c;
                    if (a[b] === !c) {
                        a[b] = c;
                        return h
                    }
                } catch (d) {}
                return j
            },
            pc = function (a) {
                for (; a != a.parent && oc(a.parent);) a = a.parent;
                return a
            },
            qc = i,
            rc = function () {
                qc || (qc = pc(window));
                return qc
            },
            sc = function () {
                rc() != window && bc(4)
            };
        var M = function () {
                this.n = [];
                this.K = window;
                this.b = 0
            },
            tc = function (a, b) {
                this.fn = a;
                this.win = b
            };
        M.prototype.enqueue = function (a, b) {
            this.n.push(new tc(a, b || this.K));
            this.e()
        };
        M.prototype.g = function () {
            this.b = 1
        };
        M.prototype.o = function () {
            if (this.b == 1) this.b = 0;
            this.e()
        };
        ga(M.prototype, "nq", M.prototype.enqueue);
        ga(M.prototype, "al", M.prototype.g);
        ga(M.prototype, "rl", M.prototype.o);
        M.prototype.e = function () {
            this.K.setTimeout(p(this.I, this), 0)
        };
        M.prototype.I = function () {
            if (this.b == 0 && this.n.length) {
                var a = this.n.shift();
                this.b = 2;
                a.win.setTimeout(p(this.G, this, a), 0);
                this.e()
            }
        };
        M.prototype.G = function (a) {
            this.b = 0;
            a.fn()
        };
        var uc = function () {
            var a = rc().google_jobrunner;
            fb(a) && eb(a.nq) && eb(a.al) && eb(a.rl) && a.rl()
        };
        var vc, wc, xc, yc, zc, Ac, Bc, Cc = function () {
            Bc = Ac = zc = yc = xc = wc = vc = j;
            var a = Ha();
            if (a)
                if (a.indexOf("Firefox") != -1) vc = h;
                else if (a.indexOf("Camino") != -1) wc = h;
            else if (a.indexOf("iPhone") != -1 || a.indexOf("iPod") != -1) xc = h;
            else if (a.indexOf("iPad") != -1) yc = h;
            else if (a.indexOf("Android") != -1) zc = h;
            else if (a.indexOf("Chrome") != -1) Ac = h;
            else if (a.indexOf("Safari") != -1) Bc = h
        };
        Cc();
        var Q = !!window.google_async_iframe_id,
            Dc = Q && window.parent || window,
            Ec = function (a) {
                if (Q && a != a.parent) {
                    uc();
                    a.setTimeout(function () {
                        a.document.close()
                    }, 0)
                }
            };
        var Fc = function (a) {
            var b = "google_unique_id";
            if (a[b]) ++a[b];
            else a[b] = 1;
            return a[b]
        };
        var R = function () {
                this.defaultBucket = [];
                this.layers = {};
                for (var a = 0, b = arguments.length; a < b; ++a) this.layers[arguments[a]] = ""
            },
            Gc = function (a) {
                for (var b = new R, c = 0, d = a.defaultBucket.length; c < d; ++c) b.defaultBucket.push(a.defaultBucket[c]);
                F(a.layers, p(R.prototype.i, b));
                return b
            };
        R.prototype.i = function (a, b) {
            this.layers[b] = a
        };
        R.prototype.H = function (a, b) {
            if (a == "") return "";
            if (!b) {
                this.defaultBucket.push(a);
                return a
            }
            if (this.layers.hasOwnProperty(b)) return this.layers[b] = a;
            return ""
        };
        R.prototype.c = function (a, b, c) {
            if (!(Math.random() < 1e-4) && this.v(c)) {
                var d = Math.random();
                if (d < b) {
                    b = Math.floor(a.length * d / b);
                    if (a = a[b]) return this.H(a, c)
                }
            }
            return ""
        };
        R.prototype.v = function (a) {
            if (!a) return h;
            return this.layers.hasOwnProperty(a) && this.layers[a] == ""
        };
        R.prototype.j = function (a) {
            if (this.layers.hasOwnProperty(a)) return this.layers[a];
            return ""
        };
        R.prototype.u = function () {
            var a = [],
                b = function (c) {
                    c != "" && a.push(c)
                };
            F(this.layers, b);
            if (this.defaultBucket.length > 0 && a.length > 0) return this.defaultBucket.join(",") + "," + a.join(",");
            return this.defaultBucket.join(",") + a.join(",")
        };
        var Ic = function (a) {
                this.a = this.S = a;
                Hc(this)
            },
            Jc, S = function () {
                if (Jc) return Jc;
                if (Q) var a = Dc,
                    b = "google_persistent_state_async",
                    c = {};
                else {
                    a = window;
                    b = "google_persistent_state";
                    c = a
                }
                var d = a[b];
                if (typeof d != "object" || typeof d.S != "object") return a[b] = Jc = new Ic(c);
                return Jc = d
            },
            Hc = function (a) {
                T(a, 1, j);
                T(a, 2, j);
                T(a, 3, i);
                T(a, 4, 0);
                T(a, 5, 0);
                T(a, 6, 0);
                T(a, 7, (new Date).getTime());
                T(a, 8, {});
                T(a, 9, {});
                T(a, 10, {});
                T(a, 11, []);
                T(a, 12, 0)
            },
            Kc = function (a) {
                switch (a) {
                case 1:
                    return "google_new_domain_enabled";
                case 2:
                    return "google_new_domain_checked";
                case 3:
                    return "google_exp_persistent";
                case 4:
                    return "google_num_sdo_slots";
                case 5:
                    return "google_num_0ad_slots";
                case 6:
                    return "google_num_ad_slots";
                case 7:
                    return "google_correlator";
                case 8:
                    return "google_prev_ad_formats_by_region";
                case 9:
                    return "google_prev_ad_slotnames_by_region";
                case 10:
                    return "google_num_slots_by_channel";
                case 11:
                    return "google_viewed_host_channels";
                case 12:
                    return "google_num_slot_to_show"
                }
            },
            U = function (a, b) {
                var c = Kc(b);
                return c = a.S[c]
            },
            V = function (a, b, c) {
                return a.S[Kc(b)] = c
            },
            T = function (a, b, c) {
                a = a.S;
                b = Kc(b);
                if (a[b] === undefined) return a[b] = c;
                return a[b]
            },
            Lc = function (a) {
                if (U(a, 1)) return h;
                return V(a, 1, !!window.google_new_domain_enabled)
            },
            Mc = function (a, b) {
                return V(a, 3, b)
            };
        var Nc, Oc, W = function () {
                if (Nc) return Nc;
                var a = S(),
                    b = U(a, 3);
                if (hb(b, R)) return Nc = Mc(a, new R(1, 2, 3));
                return Nc = b
            },
            Pc = function () {
                Oc || (Oc = Gc(W()));
                return Oc
            };
        var Qc = {
            google: 1,
            googlegroups: 1,
            gmail: 1,
            googlemail: 1,
            googleimages: 1,
            googleprint: 1
        };

        function Rc(a) {
            a = a.google_page_location || a.google_page_url;
            if (!a) return j;
            a = a.toString();
            if (a.indexOf("http://") == 0) a = a.substring(7, a.length);
            else if (a.indexOf("https://") == 0) a = a.substring(8, a.length);
            var b = a.indexOf("/");
            if (b == -1) b = a.length;
            a = a.substring(0, b);
            a = a.split(".");
            b = j;
            if (a.length >= 3) b = a[a.length - 3] in Qc;
            if (a.length >= 2) b = b || a[a.length - 2] in Qc;
            return b
        }

        function Sc(a, b, c) {
            var d = S();
            if (Rc(a)) return !V(d, 2, h);
            if (!U(d, 2)) {
                a = Math.random();
                if (a <= c) {
                    c = "http://" + ia() + "/pagead/test_domain.js";
                    a = "script";
                    loadJSContent(c);
                    return V(d, 2, h)
                }
            }
            return j
        }
        var Tc = function (a) {
            var b = W();
            if (b.j(1) == "44901216") return 1 == Math.floor(a / 2) % 2;
            return j
        };

        function Uc(a, b) {
            var c = S();
            if (!Rc(a) && Lc(c)) return Tc(b) ? "http://" + t("", "googleads2.g.doubleclick.net") : "http://" + ia();
            return "http://" + ja()
        }
        var X = function (a) {
            this.J = a;
            this.m = [];
            this.l = 0;
            this.d = [];
            this.B = 0;
            this.f = [];
            this.z = j;
            this.p = this.q = "";
            this.w = j
        };
        X.prototype.D = function (a, b) {
            var c = this.J[b],
                d = this.m;
            this.J[b] = function (e) {
                if (e && e.length > 0) {
                    var f = e.length > 1 ? e[1].url : i;
                    d.push([a, wa(e[0].url), f])
                }
                c(e)
            }
        };
        X.prototype.C = function () {
            this.l++
        };
        X.prototype.F = function (a) {
            this.d.push(a)
        };
        var Vc = "http://" + u() + "/pagead/osd.js";
        X.prototype.A = function () {
            if (!this.z) {
                kb(E, Wc);
                jb(Vc);
                this.z = h
            }
        };
        X.prototype.r = function (a) {
            if (this.l > 0)
                for (var b = document.getElementsByTagName("iframe"), c = this.w ? "google_ads_iframe_" : "google_ads_frame", d = 0; d < b.length; d++) {
                    var e = b.item(d);
                    e.src && e.name && e.name.indexOf(c) == 0 && a(e, e.src)
                }
        };
        X.prototype.s = function (a) {
            var b = this.m;
            if (b.length > 0)
                for (var c = document.getElementsByTagName("a"), d = 0; d < c.length; d++)
                    for (var e = 0; e < b.length; e++)
                        if (c.item(d).href == b[e][1]) {
                            var f = c.item(d).parentNode;
                            if (b[e][2])
                                for (var g = f, n = 0; n < 4; n++) {
                                    if (g.innerHTML.indexOf(b[e][2]) > 0) {
                                        f = g;
                                        break
                                    }
                                    g = g.parentNode
                                }
                            a(f, b[e][0]);
                            b.splice(e, 1);
                            break
                        }
        };
        X.prototype.t = function (a) {
            for (var b = 0; b < this.d.length; b++) {
                var c = this.d[b],
                    d = Xc(c);
                if (d)(d = document.getElementById("google_ads_div_" + d)) && a(d, c)
            }
        };
        X.prototype.h = function (a) {
            this.s(a);
            this.t(a);
            this.r(a)
        };
        X.prototype.setupOsd = function (a, b, c) {
            this.B = a;
            this.q = b;
            this.p = c
        };
        X.prototype.getOsdMode = function () {
            return this.B
        };
        X.prototype.getEid = function () {
            return this.q
        };
        X.prototype.getCorrelator = function () {
            return this.p
        };
        X.prototype.k = function () {
            return this.m.length + this.l + this.d.length
        };
        X.prototype.setValidOutputTypes = function (a) {
            this.f = a
        };
        X.prototype.registerAdBlockByType = function (a, b, c) {
            if (this.f.length > 0) {
                for (var d = 0; d < this.f.length; d++)
                    if (this.f[d] == a) {
                        this.w = c;
                        if (a == "js") this.D(b, "google_ad_request_done");
                        else if (a == "html") this.C();
                        else a == "json_html" && this.F(b)
                    }
                this.A()
            }
        };
        var Xc = function (a) {
                if ((a = a.match(/[&\?](?:slotname)=([^&]+)/)) && a.length == 2) return a[1];
                return ""
            },
            Wc = function () {
                E.google_osd_page_loaded = h
            },
            Yc = function () {
                window.__google_ad_urls || (window.__google_ad_urls = new X(window));
                return window.__google_ad_urls
            };
        q("Goog_AdSense_getAdAdapterInstance", Yc);
        q("Goog_AdSense_OsdAdapter", X);
        q("Goog_AdSense_OsdAdapter.prototype.numBlocks", X.prototype.k);
        q("Goog_AdSense_OsdAdapter.prototype.findBlocks", X.prototype.h);
        q("Goog_AdSense_OsdAdapter.prototype.getOsdMode", X.prototype.getOsdMode);
        q("Goog_AdSense_OsdAdapter.prototype.getEid", X.prototype.getEid);
        q("Goog_AdSense_OsdAdapter.prototype.getCorrelator", X.prototype.getCorrelator);
        q("Goog_AdSense_OsdAdapter.prototype.setValidOutputTypes", X.prototype.setValidOutputTypes);
        q("Goog_AdSense_OsdAdapter.prototype.setupOsd", X.prototype.setupOsd);
        q("Goog_AdSense_OsdAdapter.prototype.registerAdBlockByType", X.prototype.registerAdBlockByType);
        var Zc = function (a, b) {
                var c = a.nodeType == 9 ? a : a.ownerDocument || a.document;
                if (c.defaultView && c.defaultView.getComputedStyle)
                    if (c = c.defaultView.getComputedStyle(a, "")) return c[b];
                return i
            },
            $c = function (a, b) {
                return Zc(a, b) || (a.currentStyle ? a.currentStyle[b] : i) || a.style[b]
            },
            ad = function (a, b, c, d) {
                if (/^\d+px?$/.test(b)) return parseInt(b, 10);
                else {
                    var e = a.style[c],
                        f = a.runtimeStyle[c];
                    a.runtimeStyle[c] = a.currentStyle[c];
                    a.style[c] = b;
                    b = a.style[d];
                    a.style[c] = e;
                    a.runtimeStyle[c] = f;
                    return b
                }
            },
            bd = function (a) {
                var b = a.nodeType == 9 ? a : a.ownerDocument || a.document,
                    c = "";
                if (b.createTextRange) {
                    c = b.body.createTextRange();
                    c.moveToElementText(a);
                    c = c.queryCommandValue("FontName")
                }
                if (!c) {
                    c = $c(a, "fontFamily");
                    if (A && Ra) c = c.replace(/ \[[^\]]*\]/, "")
                }
                a = c.split(",");
                if (a.length > 1) c = a[0];
                return xa(c, "\"'")
            },
            cd = /[^\d]+$/,
            dd = function (a) {
                return (a = a.match(cd)) && a[0] || i
            },
            ed = {
                cm: 1,
                "in": 1,
                mm: 1,
                pc: 1,
                pt: 1
            },
            fd = {
                em: 1,
                ex: 1
            },
            gd = function (a) {
                var b = $c(a, "fontSize"),
                    c = dd(b);
                if (b && "px" == c) return parseInt(b, 10);
                if (B)
                    if (c in ed) return ad(a, b, "left", "pixelLeft");
                    else if (a.parentNode && a.parentNode.nodeType == 1 && c in fd) {
                    a = a.parentNode;
                    c = $c(a, "fontSize");
                    return ad(a, b == c ? "1em" : b, "left", "pixelLeft")
                }
                c = ab("span", {
                    style: "visibility:hidden;position:absolute;line-height:0;padding:0;margin:0;border:0;height:1em;"
                });
                cb(a, c);
                b = c.offsetHeight;
                c && c.parentNode && c.parentNode.removeChild(c);
                return b
            };
        var Y = {};

        function hd(a) {
            if (a == 1) return h;
            return !Y[a]
        }

        function id(a, b) {
            if (!(!a || a == ""))
                if (b == 1)
                    if (Y[b]) Y[b] += "," + a;
                    else Y[b] = a;
            else Y[b] = a
        }

        function jd() {
            var a = [];
            F(Y, function (b) {
                a.push(b)
            });
            return a.join(",")
        }

        function kd(a, b) {
            if (m(a))
                for (var c = 0; c < a.length; c++) o(a[c]) && id(a[c], b)
        }
        var ld = j;

        function md(a, b) {
            var c = "script";
            ld = nd(a, b);
            if (!ld) a.google_allow_expandable_ads = j;
            var d = !od();
            ld && d && loadJSContent("http://" + u() + "/pagead/expansion_embed.js");
            var e = Sc(a, b, Ob);
            if ((d = d || e) && mb("msie") && !window.opera) {
                if (typeof google_protectAndRun == "function" && typeof google_handleError == "function") {
                    google_protectAndRun("render_ads.js::google_render_ad", google_handleError, google_render_ad)
                } else {
                    window.google_render_ad()
                }
            } else {
                google_protectAndRun("ads_core.google_render_ad", google_handleError, google_render_ad)
            }
        }
        var Z = function (a) {
            a = a.google_unique_id;
            if (typeof a == "number") return a;
            return 0
        };

        function $(a) {
            return a != i ? '"' + a + '"' : '""'
        }
        var pd = function (a, b) {
            var c = b.slice(-1),
                d = c == "?" || c == "#" ? "" : "&",
                e = [b];
            c = function (f, g) {
                if (f || f === 0 || f === j) {
                    if (typeof f == "boolean") f = f ? 1 : 0;
                    ib(e, d, g, "=", G(f));
                    d = "&"
                }
            };
            F(a, c);
            return e.join("")
        };

        function qd() {
            var a = B && C("6"),
                b = Ja && C("1.8.1"),
                c = Ka && C("525");
            if (Qa && (a || b || c)) return h;
            else if (Pa && (c || b)) return h;
            else if (Ra && b) return h;
            return j
        }

        function od() {
            return (typeof ExpandableAdSlotFactory == "function" || typeof ExpandableAdSlotFactory == "object") && typeof ExpandableAdSlotFactory.createIframe == "function"
        }

        function nd(a, b) {
            if (a.google_allow_expandable_ads === j || !b.body || a.google_ad_output != "html" || zb(a, b) || !rd(a) || isNaN(a.google_ad_height) || isNaN(a.google_ad_width) || !qd() || b.domain != a.location.hostname) return j;
            return h
        }

        function rd(a) {
            var b = a.google_ad_format;
            if (H(b)) return j;
            if (pb(a) && b != "468x15_0ads_al") return j;
            return h
        }

        function sd() {
            var a;
            if (E.google_ad_output == "html" && !(pb(E) || H(E.google_ad_format)) && hd(0)) {
                a = ["6083035", "6083034"];
                a = qb(a, Tb);
                id(a, 0)
            }
            return a == "6083035"
        }

        function td(a, b) {
            if (!(Q ? Z(a) == 1 : !Z(a)) || H(a.google_ad_format)) return "";
            var c = "",
                d = pb(a);
            if (b == "html" || d) c = qb(["36815001", "36815002"], Pb);
            if (c == "" && (b == "js" || d)) c = qb(["36815003", "36815004"], Qb);
            if (c == "" && (b == "html" || b == "js")) c = qb(["36813005", "36813006"], Rb);
            return c
        }

        function ud() {
            if (Q) return "";
            var a = Yc(),
                b = window.google_enable_osd,
                c;
            if (b === h) {
                c = "36813006";
                vd(c, a)
            } else if (b !== j && hd(0)) {
                c = a.getEid();
                if (c == "")(c = td(window, String(window.google_ad_output || ""))) && vd(c, a);
                else if (c != "36815001" && c != "36815002" && c != "36815003" && c != "36815004" && c != "36813005" && c != "36813006") c = ""
            }
            if (c) {
                id(c, 0);
                return c
            }
            return ""
        }

        function vd(a, b) {
            var c = b.getOsdMode(),
                d = [];
            switch (a) {
            case "36815004":
                c = 1;
                d = ["js"];
                break;
            case "36815002":
                c = 1;
                d = ["html"];
                break;
            case "36813006":
                c = 0;
                d = ["html", "js"];
                break
            }
            d.length > 0 && b.setValidOutputTypes(d);
            d = S();
            b.setupOsd(c, a, U(d, 7).toString())
        }

        function wd(a, b, c, d) {
            Q || Fc(a);
            var e = Z(a);
            c = pd({
                ifi: e
            }, c);
            c = c.substring(0, 1991);
            c = c.replace(/%\w?$/, "");
            var f = "script";
            if ((a.google_ad_output == "js" || a.google_ad_output == "json_html") && (a.google_ad_request_done || a.google_radlink_request_done)) loadJSContent($(ba(c)).replace('"', ""));
            else if (a.google_ad_output == "html")
                if (ld && od()) {
                    b = a.google_container_id || d || i;
                    a["google_expandable_ad_slot" + e] = ExpandableAdSlotFactory.createIframe("google_ads_frame" + e, ba(c), a.google_ad_width, a.google_ad_height, b)
                } else {
                    e = '<iframe name="google_ads_frame" width=' + $(String(a.google_ad_width)) + " height=" + $(String(a.google_ad_height)) + " frameborder=" + $(String(a.google_ad_frameborder == i ? "" : a.google_ad_frameborder)) + " src=" + $(ba(c)) + ' marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true" scrolling="no"></iframe>';
                    a.google_container_id ? xd(a.google_container_id, b, e) : b.write(e)
                }
            return c
        }

        function yd(a) {
            gc(a)
        }

        function zd(a) {
            var b = Pc().j(2) == "44901217";
            if (!Ad(b)) return j;
            b = sd();
            var c = Uc(window, Z(window));
            a = Bd(a);
            b = c + Cd(a.google_ad_format, b);
            window.google_ad_url = pd(a, b);
            return h
        }
        var Fd = function (a) {
                a.dt = aa;
                a.shv = "r20100422";
                var b = S(),
                    c = U(b, 8),
                    d = window.google_ad_section,
                    e = window.google_ad_format,
                    f = window.google_ad_slot;
                if (c[d]) H(e) || (a.prev_fmts = c[d]);
                var g = U(b, 9);
                if (g[d]) a.prev_slotnames = g[d].toLowerCase();
                if (e) {
                    if (!H(e))
                        if (c[d]) c[d] += "," + e;
                        else c[d] = e
                } else if (f)
                    if (g[d]) g[d] += "," + f;
                    else g[d] = f;
                a.correlator = U(b, 7);
                if (U(b, 2) && !Lc(b)) a.dblk = 1;
                if (window.google_ad_channel) {
                    c = U(b, 10);
                    d = "";
                    e = window.google_ad_channel.split(Dd);
                    for (f = 0; f < e.length; f++) {
                        g = e[f];
                        if (c[g]) d += g + "+";
                        else c[g] = h
                    }
                    a.pv_ch = d
                }
                if (window.google_ad_host_channel) {
                    b = Ed(window.google_ad_host_channel, U(b, 11));
                    a.pv_h_ch = b
                }
                if (Ub) a.jscb = 1;
                if (Wb) a.jscd = 1;
                a.frm = window.google_iframing;
                b = kc();
                a.ga_vid = b.vid;
                a.ga_sid = b.sid;
                a.ga_hid = b.hid;
                a.ga_fc = b.from_cookie;
                a.ga_wpids = window.google_analytics_uacct
            },
            Gd = function (a) {
                var b = h;
                if (b = sb(b)) {
                    a.biw = b.width;
                    a.bih = b.height
                }
            },
            Hd = function (a) {
                var b = ub(Dc);
                if (b != 0) a.ifk = b.toString()
            };

        function Ed(a, b) {
            for (var c = a.split("|"), d = -1, e = [], f = 0; f < c.length; f++) {
                var g = c[f].split(Dd);
                b[f] || (b[f] = {});
                for (var n = "", N = 0; N < g.length; N++) {
                    var D = g[N];
                    if (D != "")
                        if (b[f][D]) n += "+" + D;
                        else b[f][D] = h
                }
                n = n.slice(1);
                e[f] = n;
                if (n != "") d = f
            }
            c = "";
            if (d > -1) {
                for (f = 0; f < d; f++) c += e[f] + "|";
                c += e[d]
            }
            return c
        }

        function Id() {
            Vb ? W().c(["33895101"], 1, 3) : W().c(["33895100"], Nb, 3);
            var a = ["44901212", "44901216"];
            W().c(a, Kb, 1);
            a = ["44901218", "44901217"];
            W().c(a, Sb, 2)
        }

        function Jd() {
            sc();
            (Q ? Z(window) == 1 : !Z(window)) && Id();
            var a = ud(),
                b = i,
                c = "",
                d = Math.random() < .01;
            if (d)
                if (b = window.google_async_iframe_id) b = Dc.document.getElementById(b);
                else {
                    c = "google_temp_span";
                    b = Kd(c)
                }
            d = zd(b);
            b && b.id == c && (b && b.parentNode ? b.parentNode.removeChild(b) : i);
            if (d) {
                c = wd(window, document, window.google_ad_url);
                if (a) Yc().registerAdBlockByType(String(window.google_ad_output || ""), c, j);
                yd(window)
            }
            Ec(window)
        }
        var Ld = function (a) {
                F(wb, function (b, c) {
                    a[b] = window[c]
                });
                F(vb, function (b, c) {
                    a[b] = window[c]
                });
                F(xb, function (b, c) {
                    a[b] = window[c]
                })
            },
            Md = function (a) {
                kd(window.google_eids, 1);
                a.eid = jd();
                var b = Pc().u();
                if (a.eid.length > 0 && b.length > 0) a.eid += ",";
                a.eid += b
            };

        function Nd(a, b, c, d) {
            a = $b(a, b, c, d);
            md(window, document);
            return a
        }

        function Od() {
            fc()
        }

        function Pd(a) {
            var b = {};
            a = a.split("?");
            a = a[a.length - 1].split("&");
            for (var c = 0; c < a.length; c++) {
                var d = a[c].split("=");
                if (d[0]) try {
                    b[d[0].toLowerCase()] = d.length > 1 ? window.decodeURIComponent ? decodeURIComponent(d[1].replace(/\+/g, " ")) : unescape(d[1]) : ""
                } catch (e) {}
            }
            return b
        }

        function Qd() {
            var a = window,
                b = Pd(document.URL);
            if (b.google_ad_override) {
                a.google_ad_override = b.google_ad_override;
                a.google_adtest = "on"
            }
        }

        function xd(a, b, c) {
            if (a)
                if ((a = b.getElementById(a)) && c && c.length != "") {
                    a.style.visibility = "visible";
                    a.innerHTML = c
                }
        }
        var Cd = function (a, b) {
                var c;
                return c = H(a) ? "/pagead/sdo?" : b ? "/pagead/render_iframe_ads.html#" : "/pagead/ads?"
            },
            Rd = function (a, b) {
                b.dff = bd(a);
                b.dfs = gd(a)
            },
            Sd = function (a) {
                a.ref = window.google_referrer_url;
                a.loc = window.google_page_location
            },
            Ad = function (a) {
                var b = S(),
                    c = U(b, 8),
                    d = U(b, 9),
                    e = window.google_ad_section;
                if (H(window.google_ad_format)) {
                    if (V(b, 4, U(b, 4) + 1) > 4 && !a) return j
                } else if (pb(window)) {
                    if (V(b, 5, U(b, 5) + 1) > 3 && !a) return j
                } else {
                    var f = V(b, 6, U(b, 6) + 1);
                    if (window.google_num_slots_to_rotate) {
                        bc(1);
                        c[e] = "";
                        d[e] = "";
                        U(b, 12) || V(b, 12, (new Date).getTime() % window.google_num_slots_to_rotate + 1);
                        if (U(b, 12) != f) return j
                    } else if (!a && f > 6 && e == "") return j
                }
                return h
            },
            Bd = function (a) {
                var b = {};
                Ld(b);
                Fd(b);
                rb(b);
                a && Rd(a, b);
                Gd(b);
                Hd(b);
                Md(b);
                Sd(b);
                b.fu = ac;
                return b
            },
            Kd = function (a) {
                var b = window.google_container_id,
                    c = b && Wa(b) || Wa(a);
                if (!c && !b && a) {
                    var ref = object.createElement("span");
                    ref.setAttribute("id", a);
                    document.getElementsByTagName("body")[0].appendChild(ref);
                    c = Wa(a)
                }
                return c
            },
            Dd = /[+, ]/;
        window.google_render_ad = Jd;

        function Td() {
            if (Xb && typeof E.alternateShowAds == "function") E.alternateShowAds.call(i);
            else {
                Qd();
                var a = window.google_start_time;
                if (typeof a == "number") {
                    aa = a;
                    window.google_start_time = i
                }
                Yb("show_ads.google_init_globals", Nd, Od);
                md(window, document)
            }
        }
        Yb("show_ads.main", $b, Td)
    };
    return exports
});
define("bootstrap-modal", ["jquery", "jquery-ui-position"], function ($) {
    "use strict";
    var Modal = function (element, options) {
        this.options = options;
        this.$element = $(element).delegate('[data-dismiss="modal"]', "click.dismiss.modal", $.proxy(this.hide, this));
        this.options.remote && this.getBodyNode().load(this.options.remote)
    };
    Modal.prototype = {
        constructor: Modal,
        toggle: function () {
            return this[!this.isShown ? "show" : "hide"]()
        },
        show: function () {
            var that = this,
                e = $.Event("show");
            this.$element.trigger(e);
            if (this.isShown || e.isDefaultPrevented()) return;
            this.isShown = true;
            this.escape();
            this.backdrop(function () {
                var transition = $.support.transition && that.$element.hasClass("fade");
                if (!that.$element.parent().length) {
                    that.$element.appendTo(document.body)
                }
                that.$element.show();
                if (transition) {
                    that.$element[0].offsetWidth
                }
                that.$element.trigger($.Event("willAnimateIn"));
                that.$element.addClass("in").attr("aria-hidden", false);
                that.enforceFocus();
                transition ? that.$element.one($.support.transition.end, function () {
                    that.$element.focus().trigger("shown")
                }) : that.$element.focus().trigger("shown")
            })
        },
        hide: function (e) {
            e && e.preventDefault();
            var that = this;
            e = $.Event("hide");
            this.$element.trigger(e);
            if (!this.isShown || e.isDefaultPrevented()) return;
            this.isShown = false;
            this.escape();
            $(document).off("focusin.modal");
            this.$element.removeClass("in").attr("aria-hidden", true);
            $.support.transition && this.$element.hasClass("fade") ? this.hideWithTransition() : this.hideModal()
        },
        enforceFocus: function () {
            var that = this,
                callCount = 0;
            $(document).on("focusin.modal", function (e) {
                if (that.$element[0] !== e.target && !that.$element.has(e.target).length && callCount++ < 2) {
                    that.$element.focus()
                }
            })
        },
        escape: function () {
            var that = this;
            if (this.isShown && this.options.keyboard) {
                this.$element.on("keyup.dismiss.modal", function (e) {
                    e.which == 27 && that.hide()
                })
            } else if (!this.isShown) {
                this.$element.off("keyup.dismiss.modal")
            }
        },
        hideWithTransition: function () {
            var that = this,
                timeout = setTimeout(function () {
                    that.$element.off($.support.transition.end);
                    that.hideModal()
                }, 500);
            this.$element.one($.support.transition.end, function () {
                clearTimeout(timeout);
                that.hideModal()
            })
        },
        hideModal: function (that) {
            this.$element.hide().trigger("hidden");
            this.backdrop()
        },
        removeBackdrop: function () {
            this.$backdrop.remove();
            this.$backdrop = null
        },
        backdrop: function (callback) {
            var that = this,
                animate = this.$element.hasClass("fade") ? "fade" : "";
            if (this.isShown && this.options.backdrop) {
                var doAnimate = $.support.transition && animate;
                this.$backdrop = $('<div class="modal_overlay ' + animate + '" />').appendTo(document.body);
                var self = this;
                this.$backdrop.click(function (e) {
                    if (wf.appData.pageAlias === "ProductPage" && window.SS) {
                        window.SS.EventTrack.rp("productpage_quickview_close")
                    }
                    var func = self.options.backdrop == "static" ? $.proxy(self.$element[0].focus, self.$element[0]) : $.proxy(self.hide, self);
                    func(e)
                });
                if (doAnimate) this.$backdrop[0].offsetWidth;
                this.$backdrop.addClass("in");
                doAnimate ? this.$backdrop.one($.support.transition.end, callback) : callback()
            } else if (!this.isShown && this.$backdrop) {
                this.$backdrop.removeClass("in");
                $.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one($.support.transition.end, $.proxy(this.removeBackdrop, this)) : this.removeBackdrop()
            } else if (callback) {
                callback()
            }
        }
    };
    var old = $.fn.modal;
    $.fn.modal = function (option) {
        var args = Array.prototype.slice.call(arguments);
        return this.each(function () {
            var $this = $(this),
                data = $this.data("modal"),
                options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == "object" && option);
            if (!data) {
                $this.data("modal", data = new WFModal(this, options))
            }
            if (typeof option == "string") {
                data[option].apply(data, args.slice(1))
            } else if (options.show) {
                data.show()
            }
        })
    };
    $.fn.modal.defaults = {
        backdrop: true,
        keyboard: true,
        show: true
    };
    $.fn.modal.Constructor = Modal;
    $.fn.modal.noConflict = function () {
        $.fn.modal = old;
        return this
    };
    $(document).on("click.modal.data-api", '[data-toggle="modal"]', function (e) {
        var $this = $(this),
            href = $this.attr("href"),
            $target = $($this.attr("data-target") || href && href.replace(/.*(?=#[^\s]+$)/, "")),
            option = $target.data("modal") ? "toggle" : $.extend({
                remote: !/#/.test(href) && href
            }, $target.data(), $this.data());
        e.preventDefault();
        $target.modal(option).one("hide", function () {
            $this.focus()
        })
    });
    $.extend($.fn.modal.defaults, {
        centered: true,
        bodyNodeSelector: ".modal-body",
        fade: true
    });

    function ModalPrototype() {}
    ModalPrototype.prototype = Modal.prototype;
    WFModal.prototype = new ModalPrototype;
    WFModal.prototype.constructor = WFModal;
    WFModal.prototype.parent = Modal.prototype;

    function WFModal(element, options) {
        this.parent.constructor.call(this, element, options);
        this.init()
    }
    $.extend(WFModal.prototype, {
        init: function () {
            if (this.options.centered) {
                this.$element.on("willAnimateIn", $.proxy(this.center, this))
            }
            if (this.options.fade) {
                this.$element.addClass("fade")
            }
        },
        center: function () {
            if (this.$element.css("position") === "fixed") {
                this.$element.css({
                    top: "50%",
                    left: "50%",
                    marginTop: -(this.$element.height() / 2),
                    marginLeft: -(this.$element.width() / 2)
                })
            } else {
                this.$element.position({
                    my: "center",
                    at: "center",
                    of: window,
                    collision: "fit"
                });
                this.$element.css({
                    left: 0,
                    marginLeft: "auto",
                    marginRight: "auto"
                })
            }
        },
        waitHTML: function (title, modalStyle) {
            if (modalStyle == "drkgrheader" || modalStyle == "undefined") {
                return $("<div>" + '<div id="derp" class="modal-inner-header">' + '<span class="xltitle">' + '<a href="#">' + title + "</a>" + "</span>" + '<span class="xmodalclose fr" data-dismiss="modal">' + "&times;" + "</span>" + "</div>" + '<div class="modal-wait-container">' + '<div class="waiting"></div>' + "</div>" + "</div>")
            } else if (modalStyle == "grdotborder") {
                return $('<div class="dotcolorbox bgcolorwarm">' + '<div class="dotcolorboxin bgdot_color">' + '<div class="dotcolorbox bgcolorwarm secondarytextmed">' + '<a class="midtitle fl" href="#">' + title + "</a>" + '<span class="xmodalclose ltbodytext fr" data-dismiss="modal">' + "&times;" + "</span>" + '<p class="c"></p>' + '<div class="modal-wait-container">' + '<div class="waiting"></div>' + "</div>" + "</div>" + "</div>" + '<div class="dotcolorboxin bgdot_color">' + "</div>" + "</div>")
            } else if (modalStyle == "ltgrheader") {
                return $("<div>" + '<div class="modal-inner-header-lt bgcolormed">' + '<span class="xltitle">' + '<a href="#">' + title + "</a>" + "</span>" + '<span class="xmodalclose secondarytextmed fr" data-dismiss="modal">' + "&times;" + "</span>" + "</div>" + '<div class="modal-wait-container">' + '<div class="waiting"></div>' + "</div>" + "</div>")
            }
        },
        loadJSON: function () {},
        getBodyNode: function () {
            return this.$element.find(this.options.bodyNodeSelector).first()
        },
        loadContent: function (url, config) {
            var that = this,
                bodyNode = this.getBodyNode(),
                handleModalResponse = function (response, statusText, request) {
                    if (statusText !== "success") {
                        that.hide();
                        return
                    }
                    if (that.options.centered) {
                        that.center()
                    }
                    if (config.callback) {
                        var callbackArgs = Array.prototype.slice.call(arguments);
                        if (config.args) {
                            callbackArgs.push(config.args)
                        }
                        config.callback.apply(this, callbackArgs)
                    }
                };
            if (bodyNode.length && url) {
                if (typeof config.bShowWaitSpinner == "undefined" || config.bShowWaitSpinner) {
                    this.setHTML(this.waitHTML(config.spinnerText || "Please Wait", config.modalStyle || "drkgrheader"))
                }
                if (typeof config.dataType == "undefined" || config.dataType == "html") {
                    bodyNode.load(url, config.data, $.proxy(handleModalResponse, config.context || this))
                } else {
                    $.ajax({
                        url: url,
                        type: "POST",
                        data: config.data,
                        dataType: "json",
                        cache: false,
                        async: config.async || false
                    }).done(function (response, statusText, request) {
                        bodyNode.html(response.html);
                        handleModalResponse.apply(config.context || this, arguments)
                    })
                }
            }
        },
        setHTML: function (htmlContent) {
            this.getBodyNode().html(htmlContent)
        }
    });
    return $
});
define("jquery-flexslider", ["jquery"], function ($) {
    $.flexslider = function (el, options) {
        var slider = $(el),
            vars = $.extend({}, $.flexslider.defaults, options),
            namespace = vars.namespace,
            touch = $.featureDetect.isTouch(),
            eventType = touch ? "touchend" : "click",
            vertical = vars.direction === "vertical",
            reverse = vars.reverse,
            carousel = vars.itemWidth > 0,
            fade = vars.animation === "fade",
            asNav = vars.asNavFor !== "",
            methods = {};
        $.data(el, "flexslider", slider);
        methods = {
            init: function () {
                slider.animating = false;
                slider.currentSlide = vars.startAt;
                slider.animatingTo = slider.currentSlide;
                slider.atEnd = slider.currentSlide === 0 || slider.currentSlide === slider.last;
                slider.containerSelector = vars.selector.substr(0, vars.selector.search(" "));
                slider.slides = $(vars.selector, slider);
                slider.container = $(slider.containerSelector, slider);
                slider.count = slider.slides.length;
                slider.syncExists = $(vars.sync).length > 0;
                if (vars.animation === "slide") vars.animation = "swing";
                slider.prop = vertical ? "top" : "marginLeft";
                slider.args = {};
                slider.manualPause = false;
                slider.transitions = !vars.video && !fade && vars.useCSS && function () {
                    var obj = document.createElement("div"),
                        props = ["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"];
                    for (var i in props) {
                        if (obj.style[props[i]] !== undefined) {
                            slider.pfx = props[i].replace("Perspective", "").toLowerCase();
                            slider.prop = "-" + slider.pfx + "-transform";
                            return true
                        }
                    }
                    return false
                }();
                if (vars.controlsContainer !== "") slider.controlsContainer = $(vars.controlsContainer).length > 0 && $(vars.controlsContainer);
                if (vars.manualControls !== "") slider.manualControls = $(vars.manualControls).length > 0 && $(vars.manualControls);
                if (vars.randomize) {
                    slider.slides.sort(function () {
                        return Math.round(Math.random()) - .5
                    });
                    slider.container.empty().append(slider.slides)
                }
                slider.doMath();
                if (asNav) methods.asNav.setup();
                slider.setup("init");
                if (vars.controlNav) methods.controlNav.setup();
                if (vars.directionNav) methods.directionNav.setup();
                if (vars.keyboard && ($(slider.containerSelector).length === 1 || vars.multipleKeyboard)) {
                    $(document).bind("keyup", function (event) {
                        var keycode = event.keyCode;
                        if (!slider.animating && (keycode === 39 || keycode === 37)) {
                            var target = keycode === 39 ? slider.getTarget("next") : keycode === 37 ? slider.getTarget("prev") : false;
                            slider.flexAnimate(target, vars.pauseOnAction)
                        }
                    })
                }
                if (vars.mousewheel) {
                    slider.bind("mousewheel", function (event, delta, deltaX, deltaY) {
                        event.preventDefault();
                        var target = delta < 0 ? slider.getTarget("next") : slider.getTarget("prev");
                        slider.flexAnimate(target, vars.pauseOnAction)
                    })
                }
                if (vars.pausePlay) methods.pausePlay.setup();
                if (vars.slideshow) {
                    if (vars.pauseOnHover) {
                        slider.hover(function () {
                            if (!slider.manualPlay && !slider.manualPause) slider.pause()
                        }, function () {
                            if (!slider.manualPause && !slider.manualPlay) slider.play()
                        })
                    }
                    vars.initDelay > 0 ? setTimeout(slider.play, vars.initDelay) : slider.play()
                }
                if (touch && vars.touch) methods.touch();
                setTimeout(function () {
                    vars.start(slider)
                }, 200)
            },
            asNav: {
                setup: function () {
                    slider.asNav = true;
                    slider.animatingTo = Math.floor(slider.currentSlide / slider.move);
                    slider.currentItem = slider.currentSlide;
                    slider.slides.removeClass(namespace + "active-slide").eq(slider.currentItem).addClass(namespace + "active-slide");
                    slider.slides.click(function (e) {
                        e.preventDefault();
                        var $slide = $(this),
                            target = $slide.index();
                        if (!$(vars.asNavFor).data("flexslider").animating && !$slide.hasClass("active")) {
                            slider.direction = slider.currentItem < target ? "next" : "prev";
                            slider.flexAnimate(target, vars.pauseOnAction, false, true, true)
                        }
                    })
                }
            },
            controlNav: {
                setup: function () {
                    if (!slider.manualControls) {
                        methods.controlNav.setupPaging()
                    } else {
                        methods.controlNav.setupManual()
                    }
                },
                setupPaging: function () {
                    var type = vars.controlNav === "thumbnails" ? "control-thumbs" : "control-paging",
                        j = 1,
                        item;
                    slider.controlNavScaffold = $('<ol class="' + namespace + "control-nav " + namespace + type + '"></ol>');
                    if (slider.pagingCount > 1) {
                        for (var i = 0; i < slider.pagingCount; i++) {
                            item = vars.controlNav === "thumbnails" ? '<img src="' + slider.slides.eq(i).attr("data-thumb") + '"/>' : "<a>" + j + "</a>";
                            slider.controlNavScaffold.append("<li>" + item + "</li>");
                            j++
                        }
                    }
                    slider.controlsContainer ? $(slider.controlsContainer).append(slider.controlNavScaffold) : slider.append(slider.controlNavScaffold);
                    methods.controlNav.set();
                    methods.controlNav.active();
                    slider.controlNavScaffold.delegate("a, img", eventType, function (event) {
                        event.preventDefault();
                        var $this = $(this),
                            target = slider.controlNav.index($this);
                        if (!$this.hasClass(namespace + "active")) {
                            slider.direction = target > slider.currentSlide ? "next" : "prev";
                            slider.flexAnimate(target, vars.pauseOnAction);
                            slider.manualPause = true
                        }
                    });
                    if (touch) {
                        slider.controlNavScaffold.delegate("a", "click touchstart", function (event) {
                            event.preventDefault()
                        })
                    }
                },
                setupManual: function () {
                    slider.controlNav = slider.manualControls;
                    methods.controlNav.active();
                    slider.controlNav.on(eventType, function (event) {
                        event.preventDefault();
                        var $this = $(this),
                            target = slider.controlNav.index($this);
                        if (!$this.hasClass(namespace + "active")) {
                            target > slider.currentSlide ? slider.direction = "next" : slider.direction = "prev";
                            slider.flexAnimate(target, vars.pauseOnAction)
                        }
                    });
                    if (touch) {
                        slider.controlNav.on("click touchstart", function (event) {
                            event.preventDefault()
                        })
                    }
                },
                set: function () {
                    var selector = vars.controlNav === "thumbnails" ? "img" : "a";
                    slider.controlNav = $("." + namespace + "control-nav li " + selector, slider.controlsContainer ? slider.controlsContainer : slider)
                },
                active: function () {
                    slider.controlNav.removeClass(namespace + "active").eq(slider.animatingTo).addClass(namespace + "active")
                },
                update: function (action, pos) {
                    if (slider.pagingCount > 1 && action === "add") {
                        slider.controlNavScaffold.append($("<li><a>" + slider.count + "</a></li>"))
                    } else if (slider.pagingCount === 1) {
                        slider.controlNavScaffold.find("li").remove()
                    } else {
                        slider.controlNav.eq(pos).closest("li").remove()
                    }
                    methods.controlNav.set();
                    slider.pagingCount > 1 && slider.pagingCount !== slider.controlNav.length ? slider.update(pos, action) : methods.controlNav.active()
                }
            },
            directionNav: {
                setup: function () {
                    var directionNavScaffold = $('<ul class="' + namespace + 'direction-nav"><li><a class="' + namespace + 'prev" href="#">' + vars.prevText + '</a></li><li><a class="' + namespace + 'next" href="#">' + vars.nextText + "</a></li></ul>");
                    if (slider.controlsContainer) {
                        $(slider.controlsContainer).append(directionNavScaffold);
                        slider.directionNav = $("." + namespace + "direction-nav li a", slider.controlsContainer)
                    } else {
                        slider.append(directionNavScaffold);
                        slider.directionNav = $("." + namespace + "direction-nav li a", slider)
                    }
                    methods.directionNav.update();
                    slider.directionNav.bind(eventType, function (event) {
                        event.preventDefault();
                        var target = $(this).hasClass(namespace + "next") ? slider.getTarget("next") : slider.getTarget("prev");
                        slider.flexAnimate(target, vars.pauseOnAction)
                    });
                    if (touch) {
                        slider.directionNav.bind("click touchstart", function (event) {
                            event.preventDefault()
                        })
                    }
                },
                update: function () {
                    var disabledClass = namespace + "disabled";
                    if (slider.pagingCount === 1) {
                        slider.directionNav.addClass(disabledClass)
                    } else if (!vars.animationLoop) {
                        if (slider.animatingTo === 0) {
                            slider.directionNav.removeClass(disabledClass).filter("." + namespace + "prev").addClass(disabledClass)
                        } else if (slider.animatingTo === slider.last) {
                            slider.directionNav.removeClass(disabledClass).filter("." + namespace + "next").addClass(disabledClass)
                        } else {
                            slider.directionNav.removeClass(disabledClass)
                        }
                    } else {
                        slider.directionNav.removeClass(disabledClass)
                    }
                }
            },
            pausePlay: {
                setup: function () {
                    var pausePlayScaffold = $('<div class="' + namespace + 'pauseplay"><a></a></div>');
                    if (slider.controlsContainer) {
                        slider.controlsContainer.append(pausePlayScaffold);
                        slider.pausePlay = $("." + namespace + "pauseplay a", slider.controlsContainer)
                    } else {
                        slider.append(pausePlayScaffold);
                        slider.pausePlay = $("." + namespace + "pauseplay a", slider)
                    }
                    methods.pausePlay.update(vars.slideshow ? namespace + "pause" : namespace + "play");
                    slider.pausePlay.bind(eventType, function (event) {
                        event.preventDefault();
                        if ($(this).hasClass(namespace + "pause")) {
                            slider.manualPause = true;
                            slider.manualPlay = false;
                            slider.pause()
                        } else {
                            slider.manualPause = false;
                            slider.manualPlay = true;
                            slider.play()
                        }
                    });
                    if (touch) {
                        slider.pausePlay.bind("click touchstart", function (event) {
                            event.preventDefault()
                        })
                    }
                },
                update: function (state) {
                    state === "play" ? slider.pausePlay.removeClass(namespace + "pause").addClass(namespace + "play").text(vars.playText) : slider.pausePlay.removeClass(namespace + "play").addClass(namespace + "pause").text(vars.pauseText)
                }
            },
            touch: function () {
                var startX, startY, offset, cwidth, dx, startT, scrolling = false,
                    swiping = false;
                el.addEventListener("touchstart", onTouchStart, false);
                el.addEventListener("MSPointerDown", onTouchStart, false);
                el.addEventListener("click", onClickSlider, true);

                function touchesForEvent(e) {
                    var touches = {};
                    if (e.touches && e.touches.length === 1) {
                        touches.x = e.touches[0].pageX;
                        touches.y = e.touches[0].pageY
                    } else {
                        touches.x = e.pageX;
                        touches.y = e.pageY
                    }
                    return touches
                }

                function onClickSlider(e) {
                    if (swiping) {
                        e.stopPropagation();
                        e.preventDefault();
                        swiping = false
                    }
                }

                function onTouchStart(e) {
                    var touches;
                    if (slider.animating) {
                        e.preventDefault()
                    } else {
                        touches = touchesForEvent(e);
                        slider.pause();
                        cwidth = vertical ? slider.h : slider.w;
                        startT = Number(new Date);
                        offset = carousel && reverse && slider.animatingTo === slider.last ? 0 : carousel && reverse ? slider.limit - (slider.itemW + vars.itemMargin) * slider.move * slider.animatingTo : carousel && slider.currentSlide === slider.last ? slider.limit : carousel ? (slider.itemW + vars.itemMargin) * slider.move * slider.currentSlide : reverse ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                        startX = vertical ? touches.y : touches.x;
                        startY = vertical ? touches.x : touches.y;
                        el.addEventListener("touchmove", onTouchMove, false);
                        el.addEventListener("MSPointerMove", onTouchMove, false);
                        el.addEventListener("touchend", onTouchEnd, false);
                        el.addEventListener("MSPointerUp", onTouchEnd, false);
                        el.addEventListener("MSPointerOut", onTouchEnd, false)
                    }
                }

                function onTouchMove(e) {
                    var touches = touchesForEvent(e);
                    dx = vertical ? startX - touches.y : startX - touches.x;
                    scrolling = vertical ? Math.abs(dx) < Math.abs(touches.x - startX) : Math.abs(dx) < Math.abs(touches.y - startY);
                    swiping = swiping || dx > 40;
                    if (!scrolling || Number(new Date) - startT > 500) {
                        e.preventDefault();
                        if (!fade && slider.transitions) {
                            if (!vars.animationLoop) {
                                dx = dx / (slider.currentSlide === 0 && dx < 0 || slider.currentSlide === slider.last && dx > 0 ? Math.abs(dx) / cwidth + 2 : 1)
                            }
                            slider.setProps(offset + dx, "setTouch")
                        }
                    }
                }

                function onTouchEnd(e) {
                    el.removeEventListener("touchmove", onTouchMove, false);
                    el.removeEventListener("MSPointerMove", onTouchMove, false);
                    if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                        var updateDx = reverse ? -dx : dx,
                            target = updateDx > 0 ? slider.getTarget("next") : slider.getTarget("prev");
                        if (slider.canAdvance(target) && (Number(new Date) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth / 2)) {
                            slider.flexAnimate(target, vars.pauseOnAction)
                        } else {
                            if (!fade) slider.flexAnimate(slider.currentSlide, vars.pauseOnAction, true)
                        }
                    }
                    el.removeEventListener("touchend", onTouchEnd, false);
                    startX = null;
                    startY = null;
                    dx = null;
                    offset = null
                }
            },
            resize: function (e) {
                if (!slider.animating && slider.is(":visible")) {
                    if (!carousel) slider.doMath();
                    if (fade) {
                        methods.smoothHeight()
                    } else if (carousel) {
                        slider.slides.width(slider.computedW);
                        slider.update(slider.pagingCount);
                        slider.setProps(null, null, null, false)
                    } else if (vertical) {
                        slider.viewport.height(slider.h);
                        slider.setProps(slider.h, "setTotal")
                    } else {
                        if (vars.smoothHeight) methods.smoothHeight();
                        slider.newSlides.width(slider.computedW);
                        slider.setProps(slider.computedW, "setTotal")
                    }
                }
            },
            smoothHeight: function (dur) {
                if (!vertical || fade) {
                    var $obj = fade ? slider : slider.viewport;
                    dur ? $obj.animate({
                        height: slider.slides.eq(slider.animatingTo).height()
                    }, dur) : $obj.height(slider.slides.eq(slider.animatingTo).height())
                }
            },
            sync: function (action) {
                var $obj = $(vars.sync).data("flexslider"),
                    target = slider.animatingTo;
                switch (action) {
                case "animate":
                    $obj.flexAnimate(target, vars.pauseOnAction, true, true);
                    break;
                case "play":
                    if (!$obj.playing && !$obj.asNav) {
                        $obj.play()
                    }
                    break;
                case "pause":
                    $obj.pause();
                    break
                }
            }
        };
        slider.flexAnimate = function (target, pause, override, withSync, fromNav, skipAnimation) {
            if (asNav && slider.pagingCount === 1 && skipAnimation !== true) {
                slider.direction = slider.currentItem < target ? "next" : "prev"
            }
            slider.atEnd = slider.currentItem === 0 || slider.currentItem === slider.last;
            if (!slider.animating && (slider.canAdvance(target, fromNav) || override) && slider.is(":visible")) {
                if (asNav && withSync) {
                    var master = $(vars.asNavFor).data("flexslider");
                    slider.atEnd = target === 0 || target === slider.count - 1;
                    master.flexAnimate(target, true, false, true, fromNav);
                    if (skipAnimation !== true) {
                        slider.direction = slider.currentItem < target ? "next" : "prev";
                        master.direction = slider.direction
                    }
                    if (Math.ceil((target + 1) / slider.visible) - 1 !== slider.currentSlide && target !== 0) {
                        slider.currentItem = target;
                        slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
                        target = Math.floor(target / slider.visible)
                    } else {
                        slider.currentItem = target;
                        slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
                        return false
                    }
                }
                slider.animating = true;
                if (skipAnimation !== true) {
                    slider.animatingTo = target
                }
                vars.before(slider);
                if (pause) slider.pause();
                if (slider.syncExists && !fromNav) methods.sync("animate");
                if (vars.controlNav) methods.controlNav.active();
                if (!carousel) slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
                slider.atEnd = target === 0 || target === slider.last;
                if (vars.directionNav && skipAnimation !== true) methods.directionNav.update();
                if (target === slider.last) {
                    vars.end(slider);
                    if (!vars.animationLoop) slider.pause()
                }
                if (!fade) {
                    var dimension = vertical ? slider.slides.filter(":first").height() : slider.computedW,
                        margin, slideString, calcNext;
                    if (carousel) {
                        margin = vars.itemWidth > slider.w ? vars.itemMargin * 2 : vars.itemMargin;
                        calcNext = (slider.itemW + margin) * slider.move * slider.animatingTo;
                        slideString = calcNext > slider.limit && slider.visible !== 1 ? slider.limit : calcNext
                    } else if (slider.currentSlide === 0 && target === slider.count - 1 && vars.animationLoop && slider.direction !== "next") {
                        slideString = reverse ? (slider.count + slider.cloneOffset) * dimension : 0
                    } else if (slider.currentSlide === slider.last && target === 0 && vars.animationLoop && slider.direction !== "prev") {
                        slideString = reverse ? 0 : (slider.count + 1) * dimension
                    } else {
                        slideString = reverse ? (slider.count - 1 - target + slider.cloneOffset) * dimension : (target + slider.cloneOffset) * dimension
                    }
                    slider.setProps(slideString, "", vars.animationSpeed, skipAnimation);
                    if (slider.transitions) {
                        if (!vars.animationLoop || !slider.atEnd) {
                            slider.animating = false;
                            slider.currentSlide = slider.animatingTo
                        }
                        slider.container.unbind("webkitTransitionEnd transitionend");
                        slider.container.bind("webkitTransitionEnd transitionend", function () {
                            slider.wrapup(dimension)
                        })
                    } else {
                        slider.container.animate(slider.args, vars.animationSpeed, vars.easing, function () {
                            slider.wrapup(dimension)
                        })
                    }
                } else {
                    if (!touch) {
                        slider.slides.eq(slider.currentSlide).fadeOut(vars.animationSpeed, vars.easing);
                        slider.slides.eq(target).fadeIn(vars.animationSpeed, vars.easing, slider.wrapup)
                    } else {
                        slider.slides.eq(slider.currentSlide).css({
                            opacity: 0,
                            zIndex: 1
                        });
                        slider.slides.eq(target).css({
                            opacity: 1,
                            zIndex: 2
                        });
                        slider.slides.unbind("webkitTransitionEnd transitionend");
                        slider.slides.eq(slider.currentSlide).bind("webkitTransitionEnd transitionend", function () {
                            vars.after(slider)
                        });
                        slider.animating = false;
                        slider.currentSlide = slider.animatingTo
                    }
                }
                if (vars.smoothHeight) methods.smoothHeight(vars.animationSpeed)
            }
        };
        slider.wrapup = function (dimension) {
            if (!fade && !carousel) {
                if (slider.currentSlide === 0 && slider.animatingTo === slider.last && vars.animationLoop) {
                    slider.setProps(dimension, "jumpEnd")
                } else if (slider.currentSlide === slider.last && slider.animatingTo === 0 && vars.animationLoop) {
                    slider.setProps(dimension, "jumpStart")
                }
            }
            slider.animating = false;
            slider.currentSlide = slider.animatingTo;
            vars.after(slider)
        };
        slider.animateSlides = function () {
            if (!slider.animating) slider.flexAnimate(slider.getTarget("next"))
        };
        slider.pause = function () {
            clearInterval(slider.animatedSlides);
            slider.playing = false;
            if (vars.pausePlay) methods.pausePlay.update("play");
            if (slider.syncExists) methods.sync("pause")
        };
        slider.play = function () {
            if (!slider.playing) {
                slider.animatedSlides = setInterval(slider.animateSlides, vars.slideshowSpeed);
                slider.playing = true;
                if (vars.pausePlay) methods.pausePlay.update("pause");
                if (slider.syncExists) methods.sync("play")
            }
        };
        slider.canAdvance = function (target, fromNav) {
            var last = asNav ? slider.pagingCount - 1 : slider.last;
            return fromNav ? true : asNav && slider.currentItem === slider.count - 1 && target === 0 && slider.direction === "prev" ? true : asNav && slider.currentItem === 0 && target === slider.pagingCount - 1 && slider.direction !== "next" ? false : target === slider.currentSlide && !asNav ? false : vars.animationLoop ? true : slider.atEnd && slider.currentSlide === 0 && target === last && slider.direction !== "next" ? false : slider.atEnd && slider.currentSlide === last && target === 0 && slider.direction === "next" ? false : true
        };
        slider.getTarget = function (dir) {
            slider.direction = dir;
            if (dir === "next") {
                return slider.currentSlide === slider.last ? 0 : slider.currentSlide + 1
            } else {
                return slider.currentSlide === 0 ? slider.last : slider.currentSlide - 1
            }
        };
        slider.setProps = function (pos, special, dur, skipAnimation) {
            var target = function () {
                var posCheck = pos ? pos : (slider.itemW + vars.itemMargin) * slider.move * slider.animatingTo,
                    posCalc = function () {
                        if (carousel) {
                            return special === "setTouch" ? pos : reverse && slider.animatingTo === slider.last ? 0 : reverse ? slider.limit - (slider.itemW + vars.itemMargin) * slider.move * slider.animatingTo : slider.animatingTo === slider.last ? slider.limit : posCheck
                        } else {
                            switch (special) {
                            case "setTotal":
                                return reverse ? (slider.count - 1 - slider.currentSlide + slider.cloneOffset) * pos : (slider.currentSlide + slider.cloneOffset) * pos;
                            case "setTouch":
                                return reverse ? pos : pos;
                            case "jumpEnd":
                                return reverse ? pos : slider.count * pos;
                            case "jumpStart":
                                return reverse ? slider.count * pos : pos;
                            default:
                                return pos
                            }
                        }
                    }();
                return posCalc * -1 + "px"
            }();
            if (slider.hasClass("js-flexslider-pdp-thumbnail") && skipAnimation === true) {
                slider.animating = false
            } else {
                if (slider.transitions) {
                    target = vertical ? "translate3d(0," + target + ",0)" : "translate3d(" + target + ",0,0)";
                    dur = dur !== undefined ? dur / 1e3 + "s" : "0s";
                    slider.container.css("-" + slider.pfx + "-transition-duration", dur)
                }
                slider.args[slider.prop] = target;
                if (slider.transitions || dur === undefined) {
                    slider.container.css(slider.args)
                }
            }
        };
        slider.setup = function (type) {
            if (!fade) {
                var sliderOffset, arr;
                if (type === "init") {
                    slider.viewport = $('<div class="' + namespace + 'viewport"></div>').css({
                        overflow: "hidden",
                        position: "relative"
                    }).appendTo(slider).append(slider.container);
                    slider.cloneCount = 0;
                    slider.cloneOffset = 0;
                    if (reverse) {
                        arr = $.makeArray(slider.slides).reverse();
                        slider.slides = $(arr);
                        slider.container.empty().append(slider.slides)
                    }
                }
                if (vars.animationLoop && !carousel) {
                    slider.cloneCount = 2;
                    slider.cloneOffset = 1;
                    if (type !== "init") slider.container.find(".clone").remove();
                    slider.container.append(slider.slides.first().clone().addClass("clone")).prepend(slider.slides.last().clone().addClass("clone"))
                }
                slider.newSlides = $(vars.selector, slider);
                sliderOffset = reverse ? slider.count - 1 - slider.currentSlide + slider.cloneOffset : slider.currentSlide + slider.cloneOffset;
                if (vertical && !carousel) {
                    slider.container.height((slider.count + slider.cloneCount) * 200 + "%").css("position", "absolute").width("100%");
                    setTimeout(function () {
                        slider.newSlides.css({
                            display: "block"
                        });
                        slider.doMath();
                        slider.viewport.height(slider.h);
                        slider.setProps(sliderOffset * slider.h, "init")
                    }, type === "init" ? 100 : 0)
                } else {
                    slider.container.width((slider.count + slider.cloneCount) * 200 + "%");
                    slider.setProps(sliderOffset * slider.computedW, "init");
                    setTimeout(function () {
                        slider.doMath();
                        slider.newSlides.css({
                            width: slider.computedW,
                            "float": "left",
                            display: "block"
                        });
                        if (vars.smoothHeight) methods.smoothHeight()
                    }, type === "init" ? 100 : 0)
                }
            } else {
                slider.slides.css({
                    width: "100%",
                    "float": "left",
                    marginRight: "-100%",
                    position: "relative"
                });
                if (type === "init") {
                    if (!touch) {
                        slider.slides.eq(slider.currentSlide).fadeIn(vars.animationSpeed, vars.easing)
                    } else {
                        slider.slides.css({
                            opacity: 0,
                            display: "block",
                            webkitTransition: "opacity " + vars.animationSpeed / 1e3 + "s ease",
                            zIndex: 1
                        }).eq(slider.currentSlide).css({
                            opacity: 1,
                            zIndex: 2
                        })
                    }
                }
                if (vars.smoothHeight) methods.smoothHeight()
            }
            if (!carousel) slider.slides.removeClass(namespace + "active-slide").eq(slider.currentSlide).addClass(namespace + "active-slide")
        };
        slider.doMath = function () {
            var slide = slider.slides.first(),
                slideMargin = vars.itemMargin,
                minItems = vars.minItems,
                maxItems = vars.maxItems;
            slider.w = slider.width();
            slider.h = slide.height();
            slider.boxPadding = slide.outerWidth() - slide.width();
            if (carousel) {
                slider.itemT = vars.itemWidth + slideMargin;
                slider.minW = minItems ? minItems * slider.itemT : slider.w;
                slider.maxW = maxItems ? maxItems * slider.itemT : slider.w;
                slider.itemW = slider.minW > slider.w ? (slider.w - slideMargin * minItems) / minItems : slider.maxW < slider.w ? (slider.w - slideMargin * maxItems) / maxItems : vars.itemWidth > slider.w ? slider.w : vars.itemWidth;
                slider.visible = Math.floor(slider.w / (slider.itemW + slideMargin));
                slider.move = vars.move > 0 && vars.move < slider.visible ? vars.move : slider.visible;
                slider.pagingCount = Math.ceil((slider.count - slider.visible) / slider.move + 1);
                slider.last = slider.pagingCount - 1;
                slider.limit = slider.pagingCount === 1 ? 0 : vars.itemWidth > slider.w ? (slider.itemW + slideMargin * 2) * slider.count - slider.w - slideMargin : (slider.itemW + slideMargin) * slider.count - slider.w - slideMargin
            } else {
                slider.itemW = slider.w;
                slider.pagingCount = slider.count;
                slider.last = slider.count - 1
            }
            slider.computedW = slider.itemW - slider.boxPadding
        };
        slider.update = function (pos, action) {
            slider.doMath();
            if (!carousel) {
                if (pos < slider.currentSlide) {
                    slider.currentSlide += 1
                } else if (pos <= slider.currentSlide && pos !== 0) {
                    slider.currentSlide -= 1
                }
                slider.animatingTo = slider.currentSlide
            }
            if (vars.controlNav && !slider.manualControls) {
                if (action === "add" && !carousel || slider.pagingCount > slider.controlNav.length) {
                    methods.controlNav.update("add")
                } else if (action === "remove" && !carousel || slider.pagingCount < slider.controlNav.length) {
                    if (carousel && slider.currentSlide > slider.last) {
                        slider.currentSlide -= 1;
                        slider.animatingTo -= 1
                    }
                    methods.controlNav.update("remove", slider.last)
                }
            }
            if (vars.directionNav) methods.directionNav.update()
        };
        slider.addSlide = function (obj, pos) {
            var $obj = $(obj);
            slider.count += $obj.length;
            slider.last = slider.count - 1;
            if (vertical && reverse) {
                pos !== undefined ? slider.slides.eq(slider.count - pos).after($obj) : slider.container.prepend($obj)
            } else {
                pos !== undefined ? slider.slides.eq(pos).before($obj) : slider.container.append($obj)
            }
            slider.update(pos, "add");
            slider.slides = $(vars.selector + ":not(.clone)", slider);
            slider.setup();
            vars.added(slider)
        };
        slider.replaceSlides = function (newSlides) {
            var $newSlides = $(newSlides);
            slider.container.empty().append($newSlides);
            slider.count = $newSlides.length;
            slider.update(0, "add");
            slider.setup();
            vars.added(slider)
        };
        slider.removeSlide = function (obj) {
            var pos = isNaN(obj) ? slider.slides.index($(obj)) : obj;
            slider.count -= 1;
            slider.last = slider.count - 1;
            if (isNaN(obj)) {
                $(obj, slider.slides).remove()
            } else {
                vertical && reverse ? slider.slides.eq(slider.last).remove() : slider.slides.eq(obj).remove()
            }
            slider.doMath();
            slider.update(pos, "remove");
            slider.slides = $(vars.selector + ":not(.clone)", slider);
            slider.setup();
            vars.removed(slider)
        };
        methods.init()
    };
    $.flexslider.defaults = {
        namespace: "flex-",
        selector: ".slides > li",
        animation: "fade",
        easing: "swing",
        direction: "horizontal",
        reverse: false,
        animationLoop: true,
        smoothHeight: false,
        startAt: 0,
        slideshow: true,
        slideshowSpeed: 7e3,
        animationSpeed: 600,
        initDelay: 0,
        randomize: false,
        pauseOnAction: true,
        pauseOnHover: false,
        useCSS: true,
        touch: true,
        video: false,
        controlNav: true,
        directionNav: true,
        prevText: "Previous",
        nextText: "Next",
        keyboard: true,
        multipleKeyboard: false,
        mousewheel: false,
        pausePlay: false,
        pauseText: "Pause",
        playText: "Play",
        controlsContainer: "",
        manualControls: "",
        sync: "",
        asNavFor: "",
        itemWidth: 0,
        itemMargin: 0,
        minItems: 0,
        maxItems: 0,
        move: 0,
        start: function () {},
        before: function () {},
        after: function () {},
        end: function () {},
        added: function () {},
        removed: function () {}
    };
    $.fn.flexslider = function (options) {
        if (options === undefined) options = {};
        if (typeof options === "object") {
            return this.each(function () {
                var $this = $(this),
                    selector = options.selector ? options.selector : ".slides > li",
                    $slides = $this.find(selector);
                new $.flexslider(this, options)
            })
        } else {
            var $slider = $(this).data("flexslider");
            switch (options) {
            case "play":
                $slider.play();
                break;
            case "pause":
                $slider.pause();
                break;
            case "next":
                $slider.flexAnimate($slider.getTarget("next"), true);
                break;
            case "prev":
            case "previous":
                $slider.flexAnimate($slider.getTarget("prev"), true);
                break;
            default:
                if (typeof options === "number") $slider.flexAnimate(options, true)
            }
        }
    };
    return $
});
define("flexslider_utility", ["jquery", "jquery-flexslider"], function ($) {
    "use strict";
    $.flexsliderUtility = {
        trackEvent: function (descriptorType) {
            if (window.ga) {
                window.ga("send", "event", "flexslider", "scroll", descriptorType)
            }
        }
    };
    return $
});
define("trackable_element", ["jquery"], function ($) {
    "use strict";
    return {
        CreateTrackableElement: function (element) {
            this.element = $(element);
            this.impressionSent = false;
            this.isVisible = false;
            this.visibleTime = 0;
            this.beaconFired = false;
            this.visibilityThresholdMS = this.element.data("visibility-threshold-ms");
            this.isElementInViewport = function (viewportHeight, viewportWidth) {
                var rect = this.element[0].getBoundingClientRect(),
                    rectCenter = (rect.bottom - rect.top) / 2 + rect.top;
                return rect.top >= 0 && rect.left >= 0 && rectCenter <= viewportHeight && rectCenter <= viewportWidth
            };
            this.isElementPartiallyInViewport = function (viewportHeight) {
                var rect = this.element[0].getBoundingClientRect(),
                    rectCenter = (rect.bottom - rect.top) / 2 + rect.top;
                return rect.top >= 0 && rect.left >= 0 && rectCenter <= viewportHeight
            };
            return this
        }
    }
});
define("init_cms_lazy_load", ["cms_lazy_load_view", "featuredetect"], function (CmsLazyLoadView) {
    "use strict";
    new CmsLazyLoadView({
        el: document
    })
});
define("jquery-lazyload", ["jquery"], function ($) {
    (function ($, window, document, undefined) {
        var $window = $(window);
        $.fn.lazyload = function (options) {
            var elements = this;
            var $container;
            var settings = {
                threshold: 0,
                failure_limit: 0,
                event: "scroll",
                effect: "show",
                container: window,
                data_attribute: "original",
                skip_invisible: true,
                appear: null,
                load: null
            };
            var addedImages = [];
            this.updateHandler = function (event) {
                return update()
            };
            this.pageShowHandler = function (event) {
                if (event.originalEvent.persisted) {
                    elements.each(function () {
                        $(this).trigger("appear")
                    })
                }
            };

            function update() {
                var counter = 0;
                elements.each(function () {
                    var $this = $(this);
                    if (settings.skip_invisible && $.contains(document.documentElement, this) && !$this.is(":visible")) {
                        return
                    }
                    if ($.abovethetop(this, settings) || $.leftofbegin(this, settings)) {} else if (!$.belowthefold(this, settings)) {
                        $this.trigger("appear");
                        counter = 0
                    } else {
                        if (++counter > settings.failure_limit) {
                            return false
                        }
                    }
                })
            }
            if (options) {
                if (undefined !== options.failurelimit) {
                    options.failure_limit = options.failurelimit;
                    delete options.failurelimit
                }
                if (undefined !== options.effectspeed) {
                    options.effect_speed = options.effectspeed;
                    delete options.effectspeed
                }
                $.extend(settings, options)
            }
            $container = settings.container === undefined || settings.container === window ? $window : $(settings.container);
            if (0 === settings.event.indexOf("scroll")) {
                $container.bind(settings.event, this.updateHandler)
            }
            this.each(function () {
                var self = this;
                var $self = $(self);
                self.loaded = false;
                $self.one("appear", function () {
                    if (!this.loaded) {
                        if (settings.appear) {
                            var elements_left = elements.length;
                            settings.appear.call(self, elements_left, settings)
                        }
                        var img = $("<img />").bind("load", function () {
                            $self.hide().attr("src", $self.data(settings.data_attribute))[settings.effect](settings.effect_speed);
                            self.loaded = true;
                            var temp = $.grep(elements, function (element) {
                                return !element.loaded
                            });
                            elements = $(temp);
                            if (settings.load) {
                                var elements_left = elements.length;
                                settings.load.call(self, elements_left, settings)
                            }
                        }).attr("src", $self.data(settings.data_attribute));
                        addedImages.push(img)
                    }
                });
                if (0 !== settings.event.indexOf("scroll")) {
                    $self.bind(settings.event, function (event) {
                        if (!self.loaded) {
                            $self.trigger("appear")
                        }
                    })
                }
            });
            $window.bind("resize", this.updateHandler);
            if (/iphone|ipod|ipad.*os 5/gi.test(navigator.appVersion)) {
                $window.bind("pageshow", this.pageShowHandler)
            }
            $window.load(this.updateHandler);
            this.destroy = function () {
                $window.unbind("pageshow", this.pageShowHandler);
                $window.unbind("resize", this.updateHandler);
                $window.unbind("load", this.updateHandler);
                $container.unbind("scroll", this.updateHandler);
                elements.each(function () {
                    $(this).unbind("scroll").off("appear").remove()
                });
                for (var i = 0; i < addedImages.length; i++) {
                    addedImages[i].unbind("load").remove()
                }
                elements = null;
                $container = null
            };
            return this
        };
        $.belowthefold = function (element, settings) {
            var fold;
            if (settings.container === undefined || settings.container === window) {
                fold = $window.height() + $window.scrollTop()
            } else {
                fold = $(settings.container).offset().top + $(settings.container).height()
            }
            return fold <= $(element).offset().top - settings.threshold
        };
        $.rightoffold = function (element, settings) {
            var fold;
            if (settings.container === undefined || settings.container === window) {
                fold = $window.width() + $window.scrollLeft()
            } else {
                fold = $(settings.container).offset().left + $(settings.container).width()
            }
            return fold <= $(element).offset().left - settings.threshold
        };
        $.abovethetop = function (element, settings) {
            var fold;
            if (settings.container === undefined || settings.container === window) {
                fold = $window.scrollTop()
            } else {
                fold = $(settings.container).offset().top
            }
            return fold >= $(element).offset().top + settings.threshold + $(element).height()
        };
        $.leftofbegin = function (element, settings) {
            var fold;
            if (settings.container === undefined || settings.container === window) {
                fold = $window.scrollLeft()
            } else {
                fold = $(settings.container).offset().left
            }
            return fold >= $(element).offset().left + settings.threshold + $(element).width()
        };
        $.inviewport = function (element, settings) {
            return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings)
        };
        $.extend($.expr[":"], {
            "below-the-fold": function (a) {
                return $.belowthefold(a, {
                    threshold: 0
                })
            },
            "above-the-top": function (a) {
                return !$.belowthefold(a, {
                    threshold: 0
                })
            },
            "right-of-screen": function (a) {
                return $.rightoffold(a, {
                    threshold: 0
                })
            },
            "left-of-screen": function (a) {
                return !$.rightoffold(a, {
                    threshold: 0
                })
            },
            "in-viewport": function (a) {
                return $.inviewport(a, {
                    threshold: 0
                })
            },
            "above-the-fold": function (a) {
                return !$.belowthefold(a, {
                    threshold: 0
                })
            },
            "right-of-fold": function (a) {
                return $.rightoffold(a, {
                    threshold: 0
                })
            },
            "left-of-fold": function (a) {
                return !$.rightoffold(a, {
                    threshold: 0
                })
            }
        })
    })($, window, document)
});
define("scribe_pixel", ["jquery", "underscore", "logger"], function ($, _, logger) {
    var scribeLogger = logger.useLogger("ScribePixel");

    function ScribePixel(url, event) {
        this.url = url;
        this.event = event;
        this.image = new window.Image(1, 1)
    }
    ScribePixel.prototype.load = function () {
        var promise = wrapImageInPromise(this.image, this.event);
        var src = this.url + "?" + $.param(this.event.toJSON());
        promise.fail(logPixelLoadError.bind(this, src));
        this.image.src = src;
        return promise
    };

    function logPixelLoadError(url, error) {
        scribeLogger.error("Scribe pixel failed to load: " + url);
        return error
    }

    function wrapImageInPromise(image, scribeEvent) {
        var deferred = new $.Deferred;
        image.onload = deferred.resolve.bind(deferred, scribeEvent);
        image.onerror = deferred.reject.bind(deferred, scribeEvent);
        return deferred.promise()
    }
    return ScribePixel
});
define("string_utils", ["jquery", "underscore", "wayfair", "logger"], function ($, _, wf, Logger) {
    "use strict";
    var exports = {};
    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
        }
    }
    exports.EmailRegEx = /^[a-z0-9_\-\.+]+\@[a-z0-9_\-\.]+\.[a-z]{2,}$/i;
    var gbPoundChar = String.fromCharCode(163);
    var euroChar = String.fromCharCode(8364);
    exports.formatCurrency = function (price, hidePricePrefix) {
        hidePricePrefix = hidePricePrefix || false;
        price = price.toString().replace(new RegExp("[^0-9\\.\\-]", "g"), "");
        price = parseFloat(price).toFixed(2);
        price = exports.formatCommaSeparatedNumber(price);
        var lang = wf.constants.LANG.value;
        switch (lang) {
        case "en-GB":
            return gbPoundChar + price;
        case "de":
        case "fr":
            return price + " " + euroChar;
        default:
            if (wf.constants.STORE_ID === wf.constants.WAYFAIR_CA_ID && !hidePricePrefix) {
                return "CAD $" + price
            } else {
                return "$" + price
            }
        }
    };
    exports.formatCommaSeparatedNumber = function (val) {
        if (val == null) {
            return ""
        }
        var regex = new RegExp("(\\d+)(\\d{3})"),
            sign = val < 0 ? "-" : "";
        val = val.toString().replace(new RegExp("[^0-9\\.]", "g"), "");
        if (isNaN(val)) {
            val = 0
        }
        val = val + "";
        val = val.split(".");
        while (regex.test(val[0])) {
            val[0] = val[0].replace(regex, "$1" + "," + "$2")
        }
        var lang = wf.constants.LANG.value;
        switch (lang) {
        case "en-GB":
            if (val.length === 1) {
                return sign + val[0]
            } else if (val.length === 2) {
                return sign + val[0] + "." + val[1]
            }
            break;
        case "de":
        case "fr":
            if (val.length === 1) {
                return sign + val[0].replace(new RegExp(",", "g"), ".")
            } else if (val.length === 2) {
                return sign + val[0].replace(new RegExp(",", "g"), ".") + "," + val[1]
            }
            break;
        default:
            if (val.length === 1) {
                return sign + val[0]
            } else if (val.length === 2) {
                return sign + val[0] + "." + val[1]
            }
        }
        return ""
    };
    exports.unformatCurrency = function (currency) {
        if (currency === undefined || currency === null) {
            return 0
        }
        var regex = /[^0-9-.]/g;
        switch (wf.constants.LANG.value) {
        case "de":
        case "fr":
            currency = currency.replace(/\./g, "");
            currency = currency.replace(/,/g, ".");
            break
        }
        currency = currency.replace(regex, "");
        return parseFloat(currency)
    };
    exports.EnsureNumeric = function (e) {
        var charCode = e.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false
        }
        return true
    };
    exports.getCurrencySymbol = function (currencyId) {
        if (!currencyId) {
            return "$"
        }
        switch (currencyId.toUpperCase()) {
        case "EUR":
            return euroChar;
        case "GBP":
            return gbPoundChar;
        case "CAD":
            return "CAD $";
        default:
            return "$"
        }
    };
    var formatNumber = function formatNumber(data, config) {
        if (_.isNumber(data)) {
            config = config || {};
            var isNeg = data < 0,
                output = data + "",
                decPlaces = config.decimalPlaces,
                decSep = config.decimalSeparator || ".",
                thouSep = config.thousandsSeparator,
                decIndex, newOutput, count, i;
            if (_.isNumber(decPlaces) && decPlaces >= 0 && decPlaces <= 20) {
                output = data.toFixed(decPlaces)
            }
            if (decSep !== ".") {
                output = output.replace(".", decSep)
            }
            if (thouSep) {
                decIndex = output.lastIndexOf(decSep);
                decIndex = decIndex > -1 ? decIndex : output.length;
                newOutput = output.substring(decIndex);
                for (count = 0, i = decIndex; i > 0; i--) {
                    if (count % 3 === 0 && i !== decIndex && (!isNeg || i > 1)) {
                        newOutput = thouSep + newOutput
                    }
                    newOutput = output.charAt(i - 1) + newOutput;
                    count++
                }
                output = newOutput
            }
            output = config.prefix ? config.prefix + output : output;
            output = config.suffix ? output + config.suffix : output;
            return output
        } else {
            return data != null && !isNaN(data) && data.toString ? data.toString() : ""
        }
    };
    exports.formatCurrencyByCuyID = function (value, currencyId, configuration) {
        var config = configuration || {
                decimalPlaces: 2
            },
            isNegative = Number(value) < 0,
            formattedValue = "",
            currencySymbol = exports.getCurrencySymbol(currencyId);
        value = Math.abs(value);
        if (currencyId && currencyId.toUpperCase() === "EUR") {
            config.thousandsSeparator = ".";
            config.decimalSeparator = ",";
            config.suffix = " " + currencySymbol
        } else {
            config.prefix = currencySymbol
        }
        formattedValue = formatNumber(value, config);
        if (isNegative) {
            formattedValue = "(" + formattedValue + ")"
        }
        return formattedValue
    };
    exports.toTitleCase = function (str) {
        return str.replace(/(?:^|\s)\w/g, function (match) {
            return match.toUpperCase()
        })
    };
    exports.encodeSearchSymbols = function (inputString) {
        return inputString.replace(/&/g, "[amp]").replace(/\./g, "[dot]").replace(/,/g, "[comma]").replace(/\$/g, "[dollar]").replace(/\u20ac/g, "[euro]").replace(/\u00a3/g, "[pound]")
    };
    var htmlDecodeDiv = $("<div/>");
    exports.htmlDecode = function (text) {
        return htmlDecodeDiv.html(text).text()
    };
    exports.formatTranslated = function (str) {
        for (var i = 1; i < arguments.length; i++) {
            str = str.replace("{" + i + "}", arguments[i])
        }
        return str
    };
    exports.addDecimalPriceMarkup = function (priceString, tagName) {
        return priceString.toString().replace(new RegExp("([\\.,])([0-9]{2})$"), function (match, p1, p2) {
            return p1 + "<" + tagName + ">" + p2 + "</" + tagName + ">"
        })
    };
    exports.strEndsWith = function (str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1
    };
    exports.adjustProductName = function (string, length) {
        var displayName = "";
        if (string && length) {
            var nameArr = string.split(" ");
            for (var i = 0; i < nameArr.length; i++) {
                var str = nameArr[i];
                if (displayName.length + str.length < length) {
                    if (displayName === "") {
                        displayName = str
                    } else {
                        displayName += " " + str
                    }
                } else {
                    displayName += "&#8230;";
                    break
                }
            }
        } else {
            Logger.info("Please supply both product name string and the desired length.")
        }
        return displayName
    };
    exports.repeat = function (str, num) {
        num = Number(num);
        var result = "";
        var isRepeating = true;
        while (isRepeating) {
            if (num & 1) {
                result += str
            }
            num >>>= 1;
            if (num <= 0) {
                isRepeating = false
            }
            str += str
        }
        return result
    };
    return exports
});
define("scribe_click_data_parser", ["underscore", "dom_utils"], function (_, domUtils) {
    var CLICK_LOCATION = "click-location";
    var CLICK_METADATA = "click-location-metadata";
    var CMS_LINK_ID = "cms-linkid";
    var CMS_LINK_CLASS = "js-cms-link";
    var CMS_LEGO_VERSION = "lego-version";
    var CMS_LEGO_SELECTOR = "[id^=cms_lego_]";
    var CMS_PAGE_SELECTOR = "[id^=cms_page_]";
    var CMS_CLICK_TAG = "click-track";

    function ScribeClickDataParser($el) {
        this.$el = $el
    }
    ScribeClickDataParser.prototype.parse = function () {
        var data = {
            clickLoc: getRequiredData(this.$el, CLICK_LOCATION),
            clickLocMeta: domUtils.getDataAttr(this.$el, CLICK_METADATA)
        };
        var isCmsLink = this.$el.hasClass(CMS_LINK_CLASS);
        if (isCmsLink) {
            var $lego = this.$el.closest(CMS_LEGO_SELECTOR);
            data.pid = findCmsId(this.$el, CMS_PAGE_SELECTOR);
            data.legoId = findCmsId(this.$el, CMS_LEGO_SELECTOR);
            data.linkId = getRequiredData(this.$el, CMS_LINK_ID);
            data.legoVid = castInt(getRequiredData($lego, CMS_LEGO_VERSION), $lego);
            data.clickTag = getOptionalData(this.$el, CMS_CLICK_TAG)
        }
        return _.pick(data, _.identity)
    };

    function getOptionalData($el, attr) {
        return domUtils.getDataAttr($el, attr)
    }

    function getElementMarkup($el) {
        return $el.clone().empty().prop("outerHTML").replace(/\s+/g, " ")
    }

    function getRequiredData($el, attr) {
        var data = domUtils.getDataAttr($el, attr);
        if (!data) {
            throw new Error("Click Parser Error: Unable to parse required data " + 'attribute "data-' + attr + '" from: ' + getElementMarkup($el))
        }
        return data
    }

    function findCmsId($el, selector) {
        var $cmsEl = $el.closest(selector);
        if (!$cmsEl.length) {
            throw new Error("Click Parser Error: Unable find CMS Element using " + ' selector "' + selector + '" close to: ' + getElementMarkup($el))
        }
        var id = castInt($cmsEl.attr("id").match(/\d+/));
        if (!id) {
            throw new Error("Click Parser Error: Unable to parse required " + "attribute from CMS lego ID from: " + getElementMarkup($cmsEl))
        }
        return id
    }

    function castInt(string, $el) {
        if (_.isNaN(+string)) {
            throw new Error('Click Parser Error: expected "' + string + '" to be a ' + "number in: " + getElementMarkup($el))
        }
        return +string
    }
    return ScribeClickDataParser
});
define("wf_view_base", ["wayfair", "jquery", "underscore", "backbone", "logger", "wf_helpers_view", "cocktail", "featuredetect"], function (wf, $, _, Backbone, logger, viewHelpers, cocktail, featureDetect) {
    "use strict";
    var html = $("html");
    var BaseView = Backbone.View.extend({
        initialize: function (options) {
            options = options || {};
            this.options = options;
            if (options.router) {
                this.router = options.router;
                this.router.view = this.router.view || this
            }
            this.initializeSubviews();
            this.subviewsInitialized = true;
            this.initializeMixins();
            this.postInitialize()
        },
        initializeMixins: function () {
            var mixins = [this];
            if (this.mixins) {
                if (typeof this.mixins === "string") {
                    this.mixins = this.mixins.split(",")
                }
            } else {
                this.mixins = []
            }
            if (this.options.mixins) {
                if (typeof this.options.mixins === "string") {
                    this.mixins = this.mixins.concat(this.options.mixins.split(","))
                } else if (this.options.mixins instanceof Array) {
                    this.mixins = this.mixins.concat(this.options.mixins)
                } else {
                    logger.warn("Unexpected mixins type: " + typeof this.options.mixins)
                }
            }
            mixins = mixins.concat(this.mixins);
            cocktail.mixin.apply(cocktail, mixins);
            this.delegateEvents()
        },
        initializeSubviews: function () {
            if (this.subviews) {
                var subviews = this.subviews;
                for (var subviewName in subviews) {
                    if (subviews.hasOwnProperty(subviewName)) {
                        var subview = subviews[subviewName];
                        var ViewConstructor = subview.viewType,
                            options = {};
                        if (subview.el) {
                            if (!subview.el.jquery && this.el.id) {
                                options.el = "#" + this.el.id + " " + subview.el
                            } else if (!subview.el.jquery && this.el.className) {
                                options.el = this.el.className ? "." + this.el.className.split(" ").join(".") + " " + subview.el : subview.el
                            } else {
                                options.el = subview.el
                            }
                        }
                        if (subview.hasOwnProperty("model") && subview.model === true) {
                            options.model = this.model
                        } else if (subview.hasOwnProperty("collection") && subview.collection === true) {
                            options.collection = this.collection
                        } else if (subview.hasOwnProperty("collectionName")) {
                            options.collection = this.model.get(subview.collectionName)
                        } else if (subview.hasOwnProperty("property")) {
                            options.model = this.model.get(subview.property)
                        }
                        if (subview.hasOwnProperty("dynamicInitialize")) {
                            options.dynamicInitialize = !!subview.dynamicInitialize
                        } else if (this.subviewsInitialized && ViewConstructor.tungstenView) {
                            options.dynamicInitialize = true
                        }
                        subview.view = new ViewConstructor(options)
                    }
                }
            }
        },
        postInitialize: function () {},
        cleanSubviews: function () {
            if (this.subviews) {
                var subviews = this.subviews;
                for (var subviewName in subviews) {
                    if (subviews.hasOwnProperty(subviewName)) {
                        var subview = subviews[subviewName];
                        if (subview.view) {
                            subview.view.clean();
                            subview.view.remove();
                            subview.view = null
                        }
                    }
                }
            }
        },
        clean: function () {},
        serialize: function () {
            if (this.hasOwnProperty("model")) {
                return this.model.toJSON()
            }
            if (this.hasOwnProperty("collection")) {
                return this.collection.toJSON()
            }
            return null
        },
        getSubview: function (subviewName) {
            if (this.subviews && this.subviews.hasOwnProperty(subviewName)) {
                return this.subviews[subviewName].view
            }
            return null
        },
        handleTemplateNotFound: function (context) {
            var templateError = new Error("Expected template but it was not found. No additional information was provided."),
                mdc = {
                    stackTrace: templateError.stack,
                    deploy_info: wf.deploy,
                    template_name: this.templateName || ""
                };
            if (context != null) {
                mdc = _.extend(mdc, context)
            }
            logger.error(templateError.message, mdc);
            return false
        },
        render: function (containerEl) {
            if (!this.compiledTemplate) {
                return this.handleTemplateNotFound()
            }
            var serializedModel = this.serialize();
            if (serializedModel === null) {
                serializedModel = {}
            }
            var updatedMarkup = "";
            if (typeof this.compiledTemplate === "function") {
                updatedMarkup = this.compiledTemplate(serializedModel)
            } else if (typeof this.compiledTemplate.render === "function") {
                updatedMarkup = this.compiledTemplate.render(serializedModel)
            }
            var container = this.$el;
            if (typeof containerEl === "string" && containerEl !== "") {
                container = this.$el.find(containerEl)
            }
            container.html(updatedMarkup);
            this.trigger("rendered");
            this.postRender();
            return this
        },
        renderSubview: function (subviewName) {
            var subview = this.getSubview(subviewName);
            if (subview != null) {
                subview.render()
            }
        },
        postRender: function () {},
        getNamedInputs: function (currentTarget) {
            var $currentTarget = $(currentTarget);
            var hash = {};
            $currentTarget.find("input[name], select[name], textarea[name]").each(function (ndx, el) {
                var $el = $(el);
                var val;
                if (_.contains(["checkbox", "radio"], $el.attr("type"))) {
                    val = $el.prop("checked")
                } else {
                    val = $el.val()
                }
                if ($el.attr("name")) {
                    hash[$el.attr("name")] = val
                }
            });
            return hash
        },
        updateNamedInputsOnModel: function (currentTarget, options) {
            if (!currentTarget) {
                currentTarget = this.$el
            }
            var hash = this.getNamedInputs(currentTarget);
            this.model.set(hash, options)
        },
        toggleSpinner: function (show, target) {
            viewHelpers.toggleSpinner(show, target)
        },
        togglePageSpinner: function (show, target) {
            viewHelpers.togglePageSpinner(show, target)
        },
        show: function () {
            this.isHidden = false;
            this.$el.show()
        },
        hide: function () {
            this.isHidden = true;
            this.$el.hide()
        },
        scrollLock: function () {
            wf.$body.toggleClass("no_scroll");
            if (featureDetect.isiOS()) {
                html.toggleClass("no_scroll")
            }
        }
    });
    return BaseView
});
define("@Templates/stores/partials/_wf_button_tungsten", ["underscore", "tungstenjs"], function (_, tungstenjs) {
    var Template = tungstenjs._template,
        template = new Template(["\n", {
            t: 4,
            r: "is_form",
            f: ["\n  ", {
                t: 4,
                r: "plain",
                f: ["\n  ", {
                    t: 7,
                    e: "span",
                    a: {
                        "class": ["btn_css_arrow js-btn-wrap ", {
                            t: 4,
                            r: "btn_arrow",
                            f: ["has_arrow"]
                        }, " ", {
                            t: 2,
                            r: "input_wrap_class"
                        }, " ", {
                            t: 4,
                            r: "disabled",
                            f: ["disabled"]
                        }, ""]
                    },
                    f: ["\n    ", {
                        t: 7,
                        e: "input",
                        a: {
                            type: ["", {
                                t: 2,
                                r: "input_type"
                            }, ""],
                            value: ["", {
                                t: 3,
                                r: "title"
                            }, ""]
                        },
                        m: [{
                            t: 4,
                            r: "input_class",
                            f: ['class="', {
                                t: 2,
                                r: "input_class"
                            }, '"']
                        }, {
                            t: 3,
                            r: "extra_attributes"
                        }, {
                            t: 4,
                            r: "disabled",
                            f: ['disabled="disabled"']
                        }]
                    }, "\n  "]
                }, "\n  "],
                n: 51
            }, "\n  ", {
                t: 4,
                r: "plain",
                f: ["\n    ", {
                    t: 7,
                    e: "input",
                    a: {
                        type: ["", {
                            t: 2,
                            r: "input_type"
                        }, ""],
                        value: ["", {
                            t: 3,
                            r: "title"
                        }, ""],
                        "class": ["", {
                            t: 2,
                            r: "input_class"
                        }, " ", {
                            t: 2,
                            r: "input_wrap_class"
                        }, ""]
                    },
                    m: [{
                        t: 3,
                        r: "extra_attributes"
                    }]
                }, "\n  "]
            }, "\n"]
        }, "\n\n", {
            t: 4,
            r: "is_form",
            f: ["\n  ", {
                t: 7,
                e: "a",
                a: {
                    href: ["", {
                        t: 2,
                        r: "href"
                    }, ""],
                    "class": ["", {
                        t: 4,
                        r: "btn_arrow",
                        f: ["has_arrow"]
                    }, " ", {
                        t: 2,
                        r: "btn_class"
                    }, ""]
                },
                m: [{
                    t: 3,
                    r: "extra_attributes"
                }, {
                    t: 2,
                    r: "no_follow"
                }],
                f: ["\n    ", {
                    t: 3,
                    r: "title"
                }, "\n  "]
            }, "\n"],
            n: 51
        }]);
    template.register("stores/partials/_wf_button_tungsten");
    var output = function (data) {
        return template.toString(data, !0)
    };
    return output.toDom = _.bind(template.toDom, template), output.toVdom = _.bind(template.toVdom, template), output.attachView = _.bind(template.attachView, template), output.wrap = _.bind(template.wrap, template), output
});
define("@Templates/stores/header/search/partials/_results", ["underscore", "tungstenjs"], function (_, tungstenjs) {
    var Template = tungstenjs._template,
        template = new Template(["\n", {
            t: 4,
            r: "has_results",
            f: ["\n  ", {
                t: 7,
                e: "ul",
                a: {
                    "class": "ui-autocomplete ui-front ui-menu ui-widget ui-widget-content ui-corner-all autocomplete_content",
                    style: "width:100%;"
                },
                f: ["\n    ", {
                    t: 4,
                    r: "results",
                    f: ["\n    ", {
                        t: 7,
                        e: "li",
                        a: {
                            "class": ["js-autocomplete-track ui-menu-item js-autocomplete-item ", {
                                t: 4,
                                r: "first_in_section",
                                f: [" bordertop"]
                            }, ""]
                        },
                        f: ["\n      ", {
                            t: 7,
                            e: "a",
                            a: {
                                "class": ["ui-corner-all autocomplete_link", {
                                    t: 4,
                                    r: "selected",
                                    f: [" ui-state-focus"]
                                }, ""]
                            },
                            f: ["\n        ", {
                                t: 7,
                                e: "span",
                                a: {
                                    "class": "wf_autocomplete_value"
                                },
                                f: ["\n          ", {
                                    t: 3,
                                    r: "label"
                                }, "\n        "]
                            }, "\n        ", {
                                t: 4,
                                r: "category",
                                f: [{
                                    t: 1,
                                    r: " ",
                                    n: "&nbsp;"
                                }, {
                                    t: 7,
                                    e: "span",
                                    a: {
                                        "class": "in_text"
                                    },
                                    f: [{
                                        t: 3,
                                        r: "lnrs_in"
                                    }]
                                }, " ", {
                                    t: 7,
                                    e: "span",
                                    a: {
                                        "class": "wf_autocomplete_dept_text"
                                    },
                                    f: [{
                                        t: 3,
                                        r: "cadepartment"
                                    }]
                                }]
                            }, "\n        ", {
                                t: 4,
                                r: "brand",
                                f: [{
                                    t: 1,
                                    r: " ",
                                    n: "&nbsp;"
                                }, {
                                    t: 7,
                                    e: "span",
                                    a: {
                                        "class": "wf_autocomplete_brand_text"
                                    },
                                    f: [{
                                        t: 3,
                                        r: "lnrs_brand_lower"
                                    }]
                                }]
                            }, "\n        ", {
                                t: 4,
                                r: "sku",
                                f: [{
                                    t: 1,
                                    r: " ",
                                    n: "&nbsp;"
                                }, {
                                    t: 7,
                                    e: "span",
                                    a: {
                                        "class": "wf_autocomplete_sku_text"
                                    },
                                    f: [{
                                        t: 3,
                                        r: "skuinfo"
                                    }]
                                }]
                            }, "\n      "]
                        }, "\n    "]
                    }, "\n    "]
                }, "\n  "]
            }, "\n"]
        }]);
    template.register("stores/header/search/partials/_results");
    var output = function (data) {
        return template.toString(data, !0)
    };
    return output.toDom = _.bind(template.toDom, template), output.toVdom = _.bind(template.toVdom, template), output.attachView = _.bind(template.attachView, template), output.wrap = _.bind(template.wrap, template), output
});
define("wf_autocomplete_view", ["underscore", "wf_tungsten_view_base"], function (_, BaseView) {
    "use strict";
    var AutocompleteItemView = BaseView.extend({
        events: {
            mouseover: "focusItem",
            touchstart: "focusItem",
            mousedown: "preventFocus",
            mouseup: "selectItem",
            touchend: "selectItem"
        },
        focusItem: function () {
            this.model.trigger("focus", this.model)
        },
        preventFocus: function () {
            return false
        },
        selectItem: function (evt) {
            if (evt.type === "touchend" || evt.button === 0) {
                evt.preventDefault();
                this.model.trigger("select")
            }
        },
        highlightResult: function (searchTerm, result) {
            var highlightClass = this.get("highlightClass");
            searchTerm = searchTerm.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
            return result.replace(new RegExp("\\b(" + searchTerm + ")", "ig"), function ($1, match) {
                return '<span class="' + highlightClass + '">' + match + "</span>"
            })
        }
    });
    var AutocompleteView = BaseView.extend({
        debugName: "AutocompleteView",
        events: {
            "blur .js-autocomplete-input": "closeMenu",
            "focus .js-autocomplete-input": "openMenu",
            "keydown .js-autocomplete-input": "navigationHandler",
            "keyup .js-autocomplete-input": "keyHandler",
            "paste .js-autocomplete-input": "pasteHandler",
            submit: "handleFormSubmit"
        },
        childViews: {
            "js-autocomplete-item": AutocompleteItemView
        },
        postInitialize: function () {
            this.listenTo(this.model, "change:results change:selectedIndex", this.render);
            this.listenTo(this.model, "focus:results", this.focusItem);
            this.listenTo(this.model, "select:results", this.selectItem)
        },
        handleFormSubmit: function () {
            var originalSearchTerm = this.model.get("searchTerm");
            var selectedIndex = this.model.get("selectedIndex");
            var selectedResult = null;
            if (selectedIndex !== -1) {
                var results = this.model.get("results");
                selectedResult = results.at(selectedIndex)
            }
            this.trigger("selectedItem", originalSearchTerm, selectedIndex === -1 ? "typed" : "selected", selectedIndex, selectedResult)
        },
        navigationHandler: function (evt) {
            if (evt.which === 38 || evt.which === 40 || evt.which === 9 && this.model.get("has_results")) {
                evt.preventDefault()
            }
            this.model.set("isFocused", true)
        },
        keyHandler: function (evt) {
            if (evt.which === 27) {
                this.closeMenu()
            }
            if (evt.which === 9 || evt.which === 38 || evt.which === 40) {
                evt.preventDefault();
                var selectedIndex = this.model.get("selectedIndex");
                var results = this.model.get("results");
                var numResults = results.length + 1;
                selectedIndex += evt.which === 38 || evt.shiftKey && evt.which === 9 ? -1 : 1;
                selectedIndex = (selectedIndex + numResults + 1) % numResults - 1;
                this.model.set("selectedIndex", selectedIndex);
                if (selectedIndex > -1) {
                    if (this.model.get("is_email_entry")) {
                        var emailParts = this.model.get("searchTerm").split("@");
                        evt.currentTarget.value = emailParts[0] + "@" + results.at(selectedIndex).get("value")
                    } else {
                        evt.currentTarget.value = results.at(selectedIndex).get("value")
                    }
                } else {
                    evt.currentTarget.value = this.model.get("searchTerm")
                }
            } else {
                this.model.set("searchTerm", evt.currentTarget.value)
            }
        },
        pasteHandler: function (evt) {
            var self = this;
            setTimeout(function () {
                self.model.set("searchTerm", evt.currentTarget.value)
            }, 1)
        },
        openMenu: function () {
            this.model.set("isFocused", true);
            this.model.search()
        },
        closeMenu: function () {
            this.model.set("isFocused", false);
            this.model.setResults([])
        },
        focusItem: function (model) {
            var selectedIndex = model.collection.indexOf(model);
            this.model.set("selectedIndex", selectedIndex)
        },
        selectItem: function () {
            var originalSearchTerm = this.model.get("searchTerm");
            var selectedIndex = this.model.get("selectedIndex");
            var results = this.model.get("results");
            var selectedResult = results.at(selectedIndex);
            this.model.set("search_val", selectedResult.get("value"));
            this.model.trigger("valueSelected", selectedResult);
            this.closeMenu();
            this.listenToOnce(this, "rendered", function () {
                if (this.model.get("is_email_entry")) {
                    var emailParts = originalSearchTerm.split("@");
                    this.$el.find(".js-main-search").val(emailParts[0] + "@" + this.model.get("search_val"))
                } else {
                    this.$el.find(".js-main-search").val(this.model.get("search_val"))
                }
                this.$el.find("form").submit();
                this.trigger("selectedItem", originalSearchTerm, "clicked", selectedIndex, selectedResult)
            })
        }
    }, {
        debugName: "AutocompleteView"
    });
    return AutocompleteView
});
define("cocktail", ["backbone", "underscore", "logger"], function (Backbone, _, logger) {
    "use strict";
    var exports = {};
    (function () {
        var Cocktail = {};
        if (typeof exports !== "undefined") {
            Cocktail = exports
        } else if (typeof define === "function") {
            define(function (require) {
                return Cocktail
            })
        } else {
            this.Cocktail = Cocktail
        }
        Cocktail.mixins = {};
        Cocktail.mixin = function mixin(klass) {
            var mixins = _.chain(arguments).toArray().rest().flatten().value();
            var obj = klass.prototype || klass;
            var collisions = {};
            _(mixins).each(function (mixin) {
                if (_.isString(mixin)) {
                    mixin = Cocktail.mixins[mixin]
                }
                _(mixin).each(function (value, key) {
                    if (_.isFunction(value)) {
                        if (obj[key] === value) return;
                        if (obj[key]) {
                            collisions[key] = collisions[key] || [obj[key]];
                            collisions[key].push(value)
                        }
                        obj[key] = value
                    } else if (_.isArray(value)) {
                        obj[key] = _.union(value, obj[key] || [])
                    } else if (_.isObject(value)) {
                        obj[key] = _.extend({}, value, obj[key] || {})
                    } else if (!(key in obj)) {
                        obj[key] = value
                    }
                })
            });
            _(collisions).each(function (propertyValues, propertyName) {
                obj[propertyName] = function () {
                    var that = this,
                        args = arguments,
                        returnValue;
                    _(propertyValues).each(function (value) {
                        var returnedValue = _.isFunction(value) ? value.apply(that, args) : value;
                        returnValue = typeof returnedValue === "undefined" ? returnValue : returnedValue
                    });
                    return returnValue
                }
            });
            return klass
        };
        var originalExtend;
        Cocktail.patch = function patch(Backbone) {
            originalExtend = Backbone.Model.extend;
            var extend = function (protoProps, classProps) {
                var klass = originalExtend.call(this, protoProps, classProps);
                var mixins = klass.prototype.mixins;
                if (mixins && klass.prototype.hasOwnProperty("mixins")) {
                    Cocktail.mixin(klass, mixins)
                }
                return klass
            };
            _([Backbone.Model, Backbone.Collection, Backbone.Router, Backbone.View]).each(function (klass) {
                klass.mixin = function mixin() {
                    Cocktail.mixin(this, _.toArray(arguments))
                };
                klass.extend = extend
            })
        };
        Cocktail.unpatch = function unpatch(Backbone) {
            _([Backbone.Model, Backbone.Collection, Backbone.Router, Backbone.View]).each(function (klass) {
                klass.mixin = undefined;
                klass.extend = originalExtend
            })
        }
    })();
    exports.registerMixin = function (name, mixin) {
        if (exports.mixins[name] !== undefined) {
            logger.warn('Cocktail mixin named "' + name + '" is already defined.')
        } else {
            exports.mixins[name] = mixin
        }
    };
    return exports
});
define("wf_autocomplete_model", ["jquery", "underscore", "wf_model_base", "wf_collection_base", "email_autocomplete_mixin"], function ($, _, BaseModel, BaseCollection, EmailAutocomplete) {
    "use strict";
    var AutocompleteModel = BaseModel.extend({
        defaults: {
            searchTerm: "",
            minimumLength: 2,
            has_results: false,
            url: "",
            results: [],
            selectedIndex: -1,
            maxItems: Infinity,
            highlightClass: "wf_autocomplete_highlight"
        },
        relations: {
            results: BaseCollection.extend({
                model: BaseModel.extend({
                    idAttr: "value"
                }, {
                    debugName: "ResultModel"
                })
            }, {
                debugName: "ResultsCollection"
            })
        },
        exposedEvents: ["valueSelected", "change:searchTerm"],
        exposedFunctions: ["unsetSelected"],
        postInitialize: function () {
            var debounceSearch = _.debounce(this.search, 50);
            this.cache = new BaseModel;
            this.listenTo(this, "change:searchTerm", debounceSearch);
            this.listenTo(this, "change:results", this.setHasResults);
            this.listenTo(this, "change:selectedIndex", this.changeSelected)
        },
        search: function () {
            var searchTerm = encodeURIComponent(this.get("searchTerm"));
            var minimumLength = this.get("minimumLength");
            if (searchTerm.length < minimumLength) {
                this.setResults([]);
                return
            }
            this.trigger("searchEvent");
            var self = this;
            var cacheKey = "search_" + searchTerm;
            self.set("selectedIndex", -1, {
                silent: true
            });
            if (this.cache.has(cacheKey)) {
                self.setResults(this.cache.get(cacheKey))
            } else {
                if (this.get("is_email_entry")) {
                    var Autocomplete = new EmailAutocompleteModel;
                    var searchQueryKey = Autocomplete.get("searchQueryKey");
                    if (searchTerm.indexOf(searchQueryKey) > 0) {
                        var results = Autocomplete.getDomainSuggestions(searchTerm);
                        self.cache.set(cacheKey, results);
                        self.setResults(results)
                    }
                } else {
                    $.ajax({
                        url: this.get("url") + searchTerm
                    }).done(function (results) {
                        self.parseResults(searchTerm, results);
                        results = results.slice(0, self.get("maxItems"));
                        self.cache.set(cacheKey, results);
                        self.setResults(results)
                    })
                }
            }
        },
        unsetSelected: function () {
            this.set("selectedIndex", 0);
            this.get("results").invoke("set", "selected", false);
            this.set("search_val", "");
            this.get("results").reset();
            this.set("has_results", this.get("results").length > 0, {
                silent: true
            })
        },
        changeSelected: function (model, selectedIndex) {
            var results = this.get("results");
            for (var i = results.length; i--;) {
                results.at(i).set("selected", i === selectedIndex)
            }
        },
        setHasResults: function () {
            var results = this.get("results");
            this.set("has_results", results.length > 0, {
                silent: true
            })
        },
        setResults: function (results) {
            this.get("results").reset(results);
            this.trigger("change:results")
        },
        parseResults: function (searchTerm, results) {
            for (var i = results.length; i--;) {
                results[i].label = this.getLabelForValue(searchTerm, results[i].value)
            }
        },
        getLabelForValue: function (searchTerm, result) {
            return result
        }
    }, {
        debugName: "AutoCompleteModel"
    });
    var EmailAutocompleteModel = AutocompleteModel.extend({
        defaults: {
            searchQueryKey: "%40"
        },
        mixins: [EmailAutocomplete],
        getDomainSuggestions: function (searchTerm) {
            return EmailAutocomplete.parseInput(searchTerm)
        }
    }, {
        debugName: "EmailAutocompleteModel"
    });
    return AutocompleteModel
});
define("wf_popup_view", ["@Templates/common/modals/basic_modal_view", "jquery", "underscore", "wayfair", "wf_popup_model", "wf_view_base", "lazy!wf_router_events", "sitespect", "tracking"], function (basicModalTemplate, $, _, wf, PopupModel, BaseView, routerEventsPromise, SiteSpect, Tracker) {
    "use strict";
    if (wf.appData.isSPA) {
        routerEventsPromise.load()
    }
    var ESCAPE_KEY = 27;
    var PopupView = BaseView.extend({
        events: {
            "click .js-modal-close": "closeClicked",
            closeModal: "close"
        },
        isClosed: true,
        defaultModel: PopupModel,
        postInitialize: function () {
            this.compiledTemplate = this.compiledTemplate || this.options.template || this.template || basicModalTemplate;
            this.model = this.model || new this.defaultModel(this.options);
            var self = this;
            routerEventsPromise.done(function (RouterEvents) {
                if (wf.appData.isSPA) {
                    RouterEvents.onRouteChangeStarted(function () {
                        self.close(true)
                    })
                }
            });
            this.listenTo(this.model, "change", function () {
                if (!self.isClosed) {
                    self._setup();
                    self.render()
                }
            });
            if (this.model.get("autoOpen")) {
                this.open()
            }
            self.$el.addClass(self.model.get("transitionFinishClass"));
            self.model.set("modalClass", self.model.get("modalClass") + " " + self.model.get("transitionFinishClass"), {
                silent: true
            });
            if (!this.options.suppressPositioning) {
                wf.$win.on("wf_resize", function (e, data) {
                    self._position(data)
                })
            }
            _.bindAll(this, "escapeClose");
            wf.$doc.on("keyup", this.escapeClose)
        },
        _setup: function () {},
        render: function () {
            if (this.tungstenView) {
                this.tungstenView.render();
                return
            }
            if (this.$el.length) {
                this.$el.remove()
            }
            var $output;
            if (this.model.has("TungstenView")) {
                var View = this.model.get("TungstenView");
                var view = new View({
                    model: this.model.get("tungstenModel"),
                    dynamicInitialize: true,
                    template: this.model.get("template"),
                    className: this.model.get("modalClass") + " " + this.model.get("transitionClass")
                });
                $output = view.$el;
                this.listenTo(view, "modalClose", function () {
                    self.close()
                });
                this.tungstenView = view;
                var self = this;
                if (this.model.get("respositionOnRender")) {
                    this.listenTo(view, "rendered", function () {
                        self.reposition()
                    })
                }
            } else {
                $output = $(this.compiledTemplate(this.serialize()))
            }
            if (this.options.height) {
                $output.css({
                    height: this.options.height
                })
            }
            if (this.options.width) {
                $output.css({
                    width: this.options.width
                })
            }
            if (this.options.customWrapperClass) {
                $output.addClass(this.options.customWrapperClass)
            }
            this._initialPosition($output, this._getWinSize());
            if (this.options.overrideModalInsertionPoint) {
                $output.insertAfter(this._getTarget())
            } else {
                $output.appendTo(this._getTarget())
            }
            this.setElement($output);
            this.reposition();
            this.trigger("rendered");
            this.postRender();
            return this
        },
        reposition: function () {
            if (!this.options.suppressPositioning) {
                this._position(this._getWinSize())
            }
        },
        _getTarget: function () {
            return wf.$body
        },
        _position: function (winSize) {
            return winSize
        },
        _initialPosition: function ($elem, winSize) {
            return winSize
        },
        _getWinSize: function () {
            return {
                height: wf.$win.height(),
                width: wf.$win.width()
            }
        },
        closeClicked: function (e) {
            if (e) {
                var target = $(e.currentTarget);
                var click = target.attr("data-click-track");
                if (click) {
                    SiteSpect.trackEvent(click)
                }
                var eventName = target.attr("data-event-name");
                if (eventName) {
                    Tracker.recordEvent(eventName)
                }
            }
            this.close(false)
        },
        escapeClose: function (e) {
            if (this.model.get("escapeToClose") && e.which === ESCAPE_KEY) {
                this.close()
            }
        },
        close: function (isAuto) {
            this.trigger("close", isAuto === true);
            if (this.tungstenView) {
                this.tungstenView.destroy();
                this.tungstenView = null
            }
            if (this.model && this.model.get("autoOpen")) {
                this.remove()
            } else {
                this.$el.remove()
            }
            this.isClosed = true
        },
        open: function () {
            this._setup();
            this.render();
            this.isClosed = false
        }
    });
    return PopupView
});
define("wf_modal_model", ["wf_popup_model", "underscore", "featuredetect"], function (PopupModel, _, featureDetect) {
    "use strict";
    var ModalModel = PopupModel.extend({
        defaults: _.defaults({
            overlayClass: "",
            clickOverlayToClose: false,
            escapeToClose: true,
            scrollLock: false,
            scrollLockHTML: featureDetect.isiOS(),
            restoreScrollOnClose: false
        }, PopupModel.prototype.defaults)
    });
    return ModalModel
});
define("modal_mixin_ajax", ["jquery", "underscore", "cocktail"], function ($, _, Cocktail) {
    "use strict";
    var ModalAjaxComponent = {
        _setup: function () {
            if (this.model.has("ajaxUrl")) {
                this._doAjax({
                    url: this.model.get("ajaxUrl"),
                    method: "GET"
                })
            } else if (this.model.has("ajaxOptions")) {
                this._doAjax(this.model.get("ajaxOptions"))
            } else if (this.model.has("ajax")) {
                var ajax = this.model.get("ajax");
                if (typeof ajax === "function") {
                    this._finishAjax(ajax())
                }
            }
            var silentOption = {
                silent: true
            };
            this.model.unset("ajaxUrl", silentOption);
            this.model.unset("ajaxOptions", silentOption);
            this.model.unset("ajax", silentOption);
            var content = this.model.get("content");
            if (!content) {
                this.model.set("content", '<div class="waiting"></div>')
            }
        },
        _doAjax: function (opts) {
            this._finishAjax($.ajax(opts))
        },
        _finishAjax: function (promise) {
            if (promise.done) {
                var self = this;
                promise.done(function (response) {
                    self.model.set("content", response)
                })
            }
        }
    };
    Cocktail.registerMixin("modal_ajax", ModalAjaxComponent);
    return ModalAjaxComponent
});
define("popup_mixin_modal", ["wayfair", "jquery", "underscore", "cocktail"], function (wf, $, _, Cocktail) {
    "use strict";
    var overlay = document.createElement("div");
    overlay.className = "modal_overlay hidden-node";
    document.body.appendChild(overlay);
    var $overlay = $(overlay),
        $html = $("html");
    var ModalOverlayComponent = {
        _setup: function () {
            if (this.model.get("clickOverlayToClose")) {
                $overlay.on("click", _.bind(this.close, this))
            }
            if (this.model.get("overlayInitClass")) {
                $overlay.addClass(this.model.get("overlayInitClass"))
            }
            this.showOverlay()
        },
        showOverlay: function () {
            $overlay.removeClass("hidden-node");
            if (this.model.get("overlayClass")) {
                $overlay.addClass(this.model.get("overlayClass"))
            }
            if (this.model.get("scrollLock")) {
                if (this.model.get("restoreScrollOnClose")) {
                    this.model.set("lastScrollTop", wf.$win.scrollTop())
                }
                wf.$body.addClass("no_scroll")
            }
            if (this.model.get("scrollLockHTML")) {
                $html.addClass("no_scroll")
            }
        },
        hideOverlay: function (isAuto) {
            $overlay.addClass("hidden-node");
            if (this.model.get("overlayClass")) {
                $overlay.removeClass(this.model.get("overlayClass"))
            }
            if (this.model.get("scrollLock")) {
                wf.$body.removeClass("no_scroll");
                if (this.model.get("restoreScrollOnClose") && !isAuto) {
                    wf.$body.scrollTop(this.model.get("lastScrollTop"))
                }
            }
            if (this.model.get("scrollLockHTML")) {
                $html.removeClass("no_scroll")
            }
        },
        close: function (isAuto) {
            this.hideOverlay(isAuto);
            $overlay.off("click")
        }
    };
    Cocktail.registerMixin("modal_overlay", ModalOverlayComponent);
    return ModalOverlayComponent
});
define("wf_model_base", ["underscore", "jquery", "cocktail", "logger", "wf_utils", "tungstenjs", "wf_collection_component"], function (_, $, cocktail, logger, utils, tungstenjs, ComponentCollection) {
    "use strict";
    var Backbone = tungstenjs.Backbone;
    Backbone.emulateHTTP = true;
    var BaseModel = Backbone.Model.extend.call(tungstenjs.Model, {
        initialize: function (attributes, options) {
            this.options = options || {};
            this.initializeMixins();
            BaseModel.__super__.initialize.apply(this, arguments)
        },
        lookup: function (options) {
            if (!(options && options.forceUpdate) && typeof this.options.dataName === "string" && utils.isset("wf.appData.modelData")) {
                var globalData = window.wf.appData.modelData[this.options.dataName];
                if (globalData) {
                    if (typeof this.parse === "function") {
                        globalData = this.parse(globalData)
                    }
                    this.set(globalData);
                    globalData.lookupDataFound = true;
                    return $.Deferred().resolveWith(this, [globalData])
                } else {
                    return this.fetch()
                }
            }
            return this.fetch()
        },
        initializeMixins: function () {
            this.options = this.options || {};
            var mixins = [this];
            if (this.mixins) {
                if (typeof this.mixins === "string") {
                    this.mixins = this.mixins.split(",")
                }
            } else {
                this.mixins = []
            }
            if (this.options.mixins) {
                if (typeof this.options.mixins === "string") {
                    this.mixins = this.mixins.concat(this.options.mixins.split(","))
                } else if (this.options.mixins instanceof Array) {
                    this.mixins = this.mixins.concat(this.options.mixins)
                } else {
                    logger.warn("Unexpected mixins type: " + typeof this.options.mixins)
                }
            }
            mixins = mixins.concat(this.mixins);
            var newRelations = {};
            var dedupFn = function (v, key) {
                newRelations[key] = true
            };
            for (var i = 1; i < mixins.length; i++) {
                if (mixins[i] && mixins[i].relations) {
                    _.each(mixins[i].relations, dedupFn)
                }
            }
            cocktail.mixin.apply(cocktail, mixins);
            var self = this;
            _.each(newRelations, function (v, key) {
                self.set(key, self.get(key), {
                    silent: true
                })
            })
        },
        sync: function (method, model, options) {
            options = options || {};
            if ("urls" in model && model.urls().hasOwnProperty(method.toLowerCase())) {
                options.url = model.urls()[method.toLowerCase()]
            }
            return Backbone.sync.apply(this, [method, model, options])
        },
        preValidate: function (attrs, options) {
            options = options || {};
            options.preValidate = true;
            return this.validate(attrs, options)
        },
        validate: function (attrs, options) {
            options = options || {};
            var self = this;
            var modelValidation = {};
            _.forEach(attrs, function (attrValue, attrKey) {
                if (attrValue && attrValue.attributes && typeof attrValue.isValid === "function") {
                    if (!attrValue.isValid(options)) {
                        modelValidation[attrKey] = attrValue.validationError;
                        modelValidation.__INVALID__ = true
                    }
                } else if (attrValue && attrValue.models && attrValue.models.length) {
                    attrValue.each(function (model, i) {
                        if (!model.isValid(options)) {
                            if (typeof modelValidation[attrKey] === "undefined") {
                                modelValidation[attrKey] = []
                            }
                            modelValidation[attrKey][i] = model.validationError;
                            modelValidation.__INVALID__ = true
                        }
                    })
                } else if (attrValue && (attrValue.isComponent || attrValue.instance && attrValue.instance.isComponent) && typeof attrValue.model.isValid === "function") {
                    if (!attrValue.model.isValid(options)) {
                        modelValidation[attrKey] = attrValue.model.validationError;
                        modelValidation.__INVALID__ = true
                    }
                }
                if (self.validation && self.validation[attrKey]) {
                    _.forEach(self.validation[attrKey].validators, function (validator) {
                        var validationResult = validator.fn.call(self, attrValue);
                        var validationMessage = "";
                        if (typeof validationResult === "string") {
                            validationMessage = validationResult;
                            validationResult = false
                        }
                        if ((validator.preValidate || !options.preValidate) && !validationResult) {
                            validationMessage = validationMessage || validator.fail;
                            modelValidation.__INVALID__ = true;
                            modelValidation[attrKey] = modelValidation[attrKey] || [];
                            if (validationMessage && typeof modelValidation[attrKey] !== "string") {
                                if (_.isArray(modelValidation[attrKey])) {
                                    modelValidation[attrKey].push(validationMessage)
                                } else {
                                    var validationObj = {};
                                    validationObj[attrKey] = [validationMessage];
                                    modelValidation[attrKey] = _.defaults(modelValidation[attrKey], validationObj)
                                }
                            } else {
                                modelValidation[attrKey] = self.validation[attrKey].fail
                            }
                        }
                    })
                }
            });
            self.trigger("validated");
            return modelValidation.__INVALID__ ? modelValidation : null
        },
        setDeep: function (attr, value) {
            var properties = attr.split(":");
            var lastProp = properties.pop();
            var model = this;
            if (properties.length) {
                model = this.getDeep(properties.join(":"))
            }
            if (_.isObject(model)) {
                if (typeof model.set === "function") {
                    model.set(lastProp, value)
                } else {
                    model[lastProp] = value
                }
            }
        },
        addRelation: function (attr, Component) {
            this.relations = this.relations || {};
            if (!this.relations[attr]) {
                this.relations[attr] = Component
            }
        },
        setRelation: function (attr, val, options) {
            if (val) {
                if (!this.relations || !this.relations[attr]) {
                    if (val.is_tungsten_component) {
                        val = new tungstenjs.hydrate.tungsten(val)
                    }
                    if (_.isArray(val) && val.length > 0) {
                        var containsComponents = !!_.findWhere(val, {
                            is_tungsten_component: true
                        });
                        var containsStaticObjects = !!_.find(val, function (item) {
                            return !item || item.is_tungsten_component == null
                        });
                        if (containsComponents && !containsStaticObjects) {
                            this.addRelation(attr, ComponentCollection)
                        }
                    }
                }
                if (val.is_collection && val.models) {
                    val = val.models
                }
            }
            return tungstenjs.Model.prototype.setRelation.call(this, attr, val, options)
        },
        matchesAll: function (attributes) {
            var model = this;
            var attrArray = _.pairs(attributes);
            return !attrArray.length ? false : attrArray.reduce(function (memo, attrPair) {
                return memo && model.get(attrPair[0]) === attrPair[1]
            }, true)
        },
        matchesAny: function (attributes) {
            var model = this;
            var attrArray = _.pairs(attributes);
            return attrArray.reduce(function (memo, attrPair) {
                return memo || model.get(attrPair[0]) === attrPair[1]
            }, false)
        },
        validateProperty: _.noop
    }, {
        debugName: "BaseModel"
    });
    return BaseModel
});
define("wf_model_save_to_registry", ["jquery", "underscore", "wayfair", "wf_model_base", "wf_collection_base", "wf_model_registry", "registry_event_bus", "favorites_item_model", "wf_redirect_utils", "registry_helper"], function ($, _, wf, Model, Collection, RegistryModel, regEventBus, ItemModel, redirects, helper) {
    "use strict";
    var AppModel = Model.extend({
        defaults: {
            registries: [],
            dropdown_registry: {},
            has_dropdown: false,
            show_registry_dropdown: false,
            is_product_valid: false,
            can_add_product: false,
            productModel: null,
            registriesWithProduct: []
        },
        relations: {
            registries: Collection.extend({
                model: RegistryModel
            }),
            dropdown_registry: RegistryModel
        },
        derived: {
            is_product_in_registry: {
                deps: ["product_in_registry_url"],
                fn: function () {
                    return !!this.get("product_in_registry_url")
                }
            }
        },
        postInitialize: function () {
            var self = this;
            this.listenTo(regEventBus, regEventBus.INVALIDATED_REGISTRY_PRODUCT, function () {
                self.setProductModel(null)
            })
        },
        setProductModel: function (productModel) {
            var registriesWithProduct = [];
            var isValid = false;
            var canAddProduct = false;
            var validProductModel = null;
            if (helper.isValidRegistryProduct(productModel)) {
                var selectedOptions = productModel.get("selected_options");
                registriesWithProduct = this.get("registries").filter(function (registry) {
                    return registry.hasItem({
                        sku: productModel.get("sku"),
                        option_ids: selectedOptions && selectedOptions.length ? selectedOptions.sort().join(",") : ""
                    })
                });
                canAddProduct = true;
                validProductModel = productModel;
                isValid = true
            }
            this.set({
                can_add_product: canAddProduct,
                productModel: validProductModel,
                product_in_registry_url: registriesWithProduct.length ? registriesWithProduct[0].get("manage_url") : "",
                registriesWithProduct: registriesWithProduct
            });
            return isValid
        },
        addToRegistry: function () {
            if (this.get("registries").length === 1) {
                var registry = this.get("registries").first();
                this.addProductToList(registry, registry.get("unassigned_items_list"))
            }
        },
        addProductToList: function (registry, list) {
            var self = this;
            var productModel = this.get("productModel");
            if (typeof list === "object" && this.get("can_add_product") && productModel) {
                var selectedOptions = productModel.get("selected_options");
                var item = new ItemModel({
                    object_key: productModel.get("sku"),
                    type: ItemModel.TYPE_CONFIGURED_PRODUCT,
                    sku: productModel.get("sku"),
                    option_ids: selectedOptions && selectedOptions.length ? selectedOptions.sort().join(",") : "0",
                    image_url: productModel.get("regImageURL"),
                    image_resource_id: productModel.get("regImageIreID"),
                    fullyConfigured: true
                });
                this.set("adding_product", true);
                registry.addItemToList(list.get("id"), item).done(function (addedItem, relatedSkus) {
                    self.set("product_in_registry_url", registry.get("manage_url"));
                    if (relatedSkus && relatedSkus.length > 0) {
                        var formData = {
                            sku: addedItem.sku,
                            option_ids: addedItem.option_ids,
                            quantity: addedItem.quantity,
                            registry_id: registry.get("id"),
                            list_id: list.get("id")
                        };
                        redirects.postRedirect("/v/registry/item_added", formData)
                    }
                    helper.showAddToRegistryToast(registry, true)
                }).fail(function () {
                    helper.showAddToRegistryToast(registry, false)
                }).always(function () {
                    self.set("show_registry_dropdown", false);
                    self.set("adding_product", false)
                })
            }
        }
    }, {
        debugName: "SaveToRegistryAppModel"
    });
    return AppModel
});
define("wf_tungsten_view_base", ["tungstenjs", "cocktail", "logger", "jquery", "underscore", "wf_helpers_view", "featuredetect", "wayfair"], function (tungsten, cocktail, logger, $, _, viewHelpers, featureDetect, wf) {
    "use strict";
    var Backbone = tungsten.Backbone,
        html = $("html");
    var TungstenBaseView = Backbone.View.extend.call(tungsten.View, {
        initialize: function (options) {
            options = options || {};
            this.options = options;
            this.initializeMixins();
            if (tungsten.View.prototype.initialize.apply(this, arguments) === false) {
                return
            }
        },
        initializeMixins: function () {
            var mixins = [this];
            if (this.mixins) {
                if (typeof this.mixins === "string") {
                    this.mixins = this.mixins.split(",")
                }
            } else {
                this.mixins = []
            }
            if (this.options.mixins) {
                if (typeof this.options.mixins === "string") {
                    this.mixins = this.mixins.concat(this.options.mixins.split(","))
                } else if (this.options.mixins instanceof Array) {
                    this.mixins = this.mixins.concat(this.options.mixins)
                } else {
                    logger.warn("Unexpected mixins type: " + typeof this.options.mixins)
                }
            }
            mixins = mixins.concat(this.mixins);
            cocktail.mixin.apply(cocktail, mixins);
            this.delegateEvents()
        },
        getNamedInputs: function (currentTarget) {
            var $currentTarget = $(currentTarget);
            var hash = {};
            $currentTarget.find("input[name], select[name], textarea[name]").each(function (ndx, el) {
                var $el = $(el);
                var val;
                if (_.contains(["checkbox", "radio"], $el.attr("type"))) {
                    val = $el.prop("checked")
                } else {
                    val = $el.val()
                }
                if ($el.attr("name")) {
                    hash[$el.attr("name")] = val
                }
            });
            return hash
        },
        updateNamedInputsOnModel: function (currentTarget, options) {
            if (!currentTarget) {
                currentTarget = this.$el
            }
            var hash = this.getNamedInputs(currentTarget);
            this.model.set(hash, options)
        },
        toggleSpinner: function (show, target) {
            viewHelpers.toggleSpinner(show, target)
        },
        togglePageSpinner: function (show, target) {
            viewHelpers.togglePageSpinner(show, target)
        },
        show: function () {
            this.isHidden = false;
            this.$el.show()
        },
        hide: function () {
            this.isHidden = true;
            this.$el.hide()
        },
        scrollLock: function () {
            wf.$body.toggleClass("no_scroll");
            if (featureDetect.isiOS()) {
                html.toggleClass("no_scroll")
            }
        }
    });
    return TungstenBaseView
});
define("@Templates/stores/product/quickview/quickview_modal_view", ["underscore", "tungstenjs", "@Templates/stores/product/quickview/partials/_product_overview_tabbed", "@Templates/stores/product/quickview/partials/_carousel"], function (_, tungstenjs) {
    var Template = tungstenjs._template,
        template = new Template(["\n\n", {
            t: 7,
            e: "div",
            a: {
                "class": "modal-body"
            },
            f: ["\n  ", {
                t: 7,
                e: "span",
                a: {
                    "class": "modal_close js-modal-close wficonfont"
                },
                f: [{
                    t: 1,
                    r: "",
                    n: "&#58953;"
                }]
            }, "\n    ", {
                t: 7,
                e: "div",
                a: {
                    "class": "modal_inner js-quickview-block js-product-view-element"
                },
                f: ["\n        ", {
                    t: 7,
                    e: "div",
                    a: {
                        "class": "qv_prod_info clearfix"
                    },
                    f: ["\n            ", {
                        t: 7,
                        e: "form",
                        a: {
                            "class": "c fr js-quickview-form",
                            method: "get",
                            action: ["", {
                                t: 2,
                                r: "add_url"
                            }, ""],
                            name: "AddItem",
                            "data-ajax-post": "1",
                            id: "PopupAddToCartForm"
                        },
                        f: ["\n\n                ", {
                            t: 7,
                            e: "input",
                            a: {
                                type: "hidden",
                                name: "FromForm",
                                value: "1"
                            }
                        }, "\n                ", {
                            t: 7,
                            e: "input",
                            a: {
                                type: "hidden",
                                name: "parentPage",
                                value: ["", {
                                    t: 2,
                                    r: "parent_page"
                                }, ""]
                            }
                        }, "\n                ", {
                            t: 7,
                            e: "input",
                            a: {
                                type: "hidden",
                                name: "sku",
                                value: ["", {
                                    t: 2,
                                    r: "sku"
                                }, ""],
                                id: "quickview_sku"
                            }
                        }, "\n                ", {
                            t: 7,
                            e: "input",
                            a: {
                                type: "hidden",
                                name: "PrTrustOptionIDsOrder",
                                value: ["", {
                                    t: 2,
                                    r: "trust_option_id_order"
                                }, ""]
                            }
                        }, "\n                ", {
                            t: 7,
                            e: "input",
                            a: {
                                type: "hidden",
                                name: "PrAssignSupplierMethod",
                                value: ["", {
                                    t: 2,
                                    r: "assign_supplier_method"
                                }, ""]
                            }
                        }, "\n                ", {
                            t: 7,
                            e: "input",
                            a: {
                                type: "hidden",
                                name: "qty",
                                id: "masterqty",
                                value: ["", {
                                    t: 2,
                                    r: "min_order_qty"
                                }, ""]
                            }
                        }, "\n                ", {
                            t: 7,
                            e: "input",
                            a: {
                                type: "hidden",
                                name: "opid",
                                value: ["", {
                                    t: 2,
                                    r: "op_id"
                                }, ""]
                            }
                        }, "\n                ", {
                            t: 7,
                            e: "input",
                            a: {
                                type: "hidden",
                                name: "eventid",
                                value: ""
                            }
                        }, "\n                ", {
                            t: 7,
                            e: "input",
                            a: {
                                type: "hidden",
                                name: "eventsku",
                                value: ""
                            }
                        }, "\n                ", {
                            t: 7,
                            e: "input",
                            a: {
                                type: "hidden",
                                name: "option_list",
                                value: ""
                            }
                        }, "\n                ", {
                            t: 7,
                            e: "input",
                            a: {
                                type: "hidden",
                                name: "sri_parent_sku",
                                value: ["", {
                                    t: 2,
                                    r: "sri_parent_sku"
                                }, ""]
                            }
                        }, "\n                ", {
                            t: 7,
                            e: "input",
                            a: {
                                type: "hidden",
                                value: "",
                                name: "eventoption"
                            }
                        }, "\n                ", {
                            t: 7,
                            e: "input",
                            a: {
                                type: "hidden",
                                name: "ajax",
                                value: "1",
                                id: "atc_ajax"
                            }
                        }, "\n\n                ", {
                            t: 4,
                            r: "has_product_id",
                            f: ["\n                  ", {
                                t: 7,
                                e: "input",
                                a: {
                                    type: "hidden",
                                    name: "board_product_id",
                                    value: ["", {
                                        t: 2,
                                        r: "board_product_id"
                                    }, ""]
                                }
                            }, "\n                "]
                        }, "\n\n                ", {
                            t: 4,
                            r: "is_kit_view",
                            f: ["\n                  ", {
                                t: 8,
                                r: "stores/product/quickview/partials/_product_overview_tabbed"
                            }, "\n                "],
                            n: 51
                        }, "\n\n            "]
                    }, "\n            ", {
                        t: 3,
                        r: "image_view_html"
                    }, "\n\n            ", {
                        t: 4,
                        r: "qv_carousel",
                        f: ["\n              ", {
                            t: 4,
                            r: "allow_browse",
                            f: ["\n                ", {
                                t: 8,
                                r: "stores/product/quickview/partials/_carousel"
                            }, "\n              "]
                        }, "\n              ", {
                            t: 4,
                            r: "allow_browse",
                            f: ["\n                ", {
                                t: 7,
                                e: "div",
                                a: {
                                    "class": "js-qv-carousel"
                                }
                            }, "\n              "],
                            n: 51
                        }, "\n            "]
                    }, "\n        "]
                }, "\n    "]
            }, "\n"]
        }, "\n"]);
    template.register("stores/product/quickview/quickview_modal");
    var output = function (data) {
        return template.toString(data, !0)
    };
    return output.toDom = _.bind(template.toDom, template), output.toVdom = _.bind(template.toVdom, template), output.attachView = _.bind(template.attachView, template), output.wrap = _.bind(template.wrap, template), output
});
define("@Templates/stores/plcc/waiting_modal_view", ["underscore", "tungstenjs"], function (_, tungstenjs) {
    var Template = tungstenjs._template,
        template = new Template(["\n", {
            t: 7,
            e: "div",
            a: {
                "class": "js-waiting-modal pos_rel centertext"
            },
            f: ["\n  ", {
                t: 7,
                e: "div",
                a: {
                    "class": "waiting waiting_text_wrapper"
                },
                f: ["\n    ", {
                    t: 7,
                    e: "h1",
                    a: {
                        "class": ["", {
                            t: 2,
                            r: "waitingMainTextClasses"
                        }, ""]
                    },
                    f: [{
                        t: 3,
                        r: "waitingMainText"
                    }]
                }, "\n    ", {
                    t: 7,
                    e: "p",
                    a: {
                        "class": ["", {
                            t: 2,
                            r: "waitingSubTextClasses"
                        }, ""]
                    },
                    f: [{
                        t: 3,
                        r: "waitingSubText"
                    }]
                }, "\n  "]
            }, "\n"]
        }, "\n"]);
    template.register("stores/plcc/waiting_modal");
    var output = function (data) {
        return template.toString(data, !0)
    };
    return output.toDom = _.bind(template.toDom, template), output.toVdom = _.bind(template.toVdom, template), output.attachView = _.bind(template.attachView, template), output.wrap = _.bind(template.wrap, template), output
});
define("registry_event_bus", ["wf_events", "underscore"], function (EventBus, _) {
    "use strict";
    var RegistryEventBus = _.extend({}, EventBus);
    RegistryEventBus.PDP_ADD_TO_REGISTRY = "pdp_add_to_registry";
    RegistryEventBus.PDP_ADD_TO_REGISTRY_LIST = "pdp_add_to_registry_list";
    RegistryEventBus.PDP_SHOW_REGISTRY_DROPDOWN = "pdp_show_registry_dropdown";
    RegistryEventBus.REGISTRY_PRODUCT_ADDED = "registry_product_added";
    RegistryEventBus.REGISTRY_PRODUCT_ADD_FAILED = "registry_product_add_failed";
    RegistryEventBus.REGISTRY_PRODUCT_UPDATED = "registry_product_updated";
    RegistryEventBus.PRODUCT_IMAGE_UPDATED = "product_image_updated";
    RegistryEventBus.REGISTRY_INITIALIZED = "registry_initialized";
    RegistryEventBus.INVALIDATED_REGISTRY_PRODUCT = "invalidated_registry_product";
    RegistryEventBus.PDP_VIEW_DEACTIVATED = "pdp_view_deactivated";
    RegistryEventBus.DISPLAY_STATE_UPDATE = "display_state_update";
    RegistryEventBus.DISPLAY_STATE_CHANGE = "display_state_change";
    RegistryEventBus.COLLECTION_ADD_TO_REGISTRY = "collection_add_to_registry";
    return RegistryEventBus
});
define("wf_view_save_to_registry", ["jquery", "underscore", "wayfair", "wf_tungsten_view_base", "wf_view_registry_dropdown", "wf_modal_view", "wf_model_base", "registry_event_bus", "@Templates/stores/registry/wed_registry_add_to_registry_view"], function ($, _, wf, View, RegistryDropdownView, ModalView, Model, regEventBus, appViewTemplate) {
    "use strict";
    var AppView = View.extend({
        compiledTemplate: appViewTemplate,
        childViews: {
            "js-registry": RegistryDropdownView
        },
        postInitialize: function () {
            var self = this;
            this.listenTo(regEventBus, regEventBus.PDP_SHOW_REGISTRY_DROPDOWN, function (productModel) {
                if (self.model.setProductModel(productModel)) {
                    self.model.set("show_registry_dropdown", !self.model.get("show_registry_dropdown"))
                }
            });
            this.listenTo(regEventBus, regEventBus.PDP_ADD_TO_REGISTRY, function (productModel) {
                if (self.model.setProductModel(productModel)) {
                    self.model.addToRegistry()
                }
            });
            this.listenTo(regEventBus, regEventBus.PDP_ADD_TO_REGISTRY_LIST, function (list) {
                self.model.addProductToList(self.model.get("dropdown_registry"), list)
            });
            this.listenTo(regEventBus, regEventBus.REGISTRY_PRODUCT_UPDATED, function (productModel) {
                self.model.setProductModel(productModel)
            });
            regEventBus.trigger(regEventBus.REGISTRY_INITIALIZED)
        }
    }, {
        debugName: "SaveToRegistryAppView"
    });
    return AppView
});
define("inventory", ["wayfair", "jquery", "underscore", "event_dispatch", "notifyme_view", "pdp_event_bus", "nova_utils", "sitespect", "lazy!ships_in_time_info_view", "ready_to_ship_service", "options_event_bus", "wf_scheduler", "tracking", "string_utils", "url_utils", "two_day_shipping_panel", "product_model"], function (wf, $, _, EventDispatch, notifyMe, pdpEventBus, nova, SiteSpect, shipsInTimePromise, ReadyToShipService, OptionsEventBus, wfScheduler, Tracking, stringUtils, UrlUtils) {
    "use strict";

    function Inventory(model, expirationTime) {
        if (!model) {
            return
        }
        if (expirationTime) {
            this.expiration_time = expirationTime
        } else {
            this.expiration_time = 300
        }
        this.model = model;
        this.two_day_shipping_panel = null;
        this.el = this.model.get_view_element();
        this.model.on("change:inventory", this.inventory_callback, this);
        this.model.on("change:has_two_day", this.poll_two_day, this);
        var self = this;
        EventDispatch.on(wf.constants.eventTypes.CART_UPDATE_EVENT_TYPE, {}, function (e) {
            if (e.verb !== "UPDATE_ZIP") {
                return
            }
            if (self.model.get("postal_code") && self.model.get("postal_code") === e.data.zip_code.toString()) {
                return
            }
            self.model.set("postal_code", e.data.zip_code.toString());
            self.update(true)
        });
        this.readyToShipOptions();
        wfScheduler.queueDelayedTask(function () {
            OptionsEventBus.trigger(OptionsEventBus.UPDATE_MODEL, self.model.get("product_options_standard"))
        })
    }
    $.extend(Inventory.prototype, {
        update: function (clearCache) {
            if (!this.model) {
                return this
            }
            var inv, inventoryCache, sku = this.model.get("sku"),
                selectedOptions = this.model.get("selected_options"),
                key, isSimple = !this.model.get("is_kit") && !this.model.get("is_grid_view");
            if (!clearCache) {
                inventoryCache = this.model.get("inventory_cache")
            }
            key = this.get_inventory_key(sku, selectedOptions);
            if (!key || this.model.get("is_return") && !nova.isActive) {
                $("#ship_display", this.el).addClass("hidden-node");
                return this
            }
            if (inventoryCache && isSimple) {
                if (inventoryCache[key]) {
                    inv = {};
                    inv[key] = inventoryCache[key];
                    this.model.set({
                        inventory: inv
                    })
                }
            }
            if (!inv || this.is_expired(inv)) {
                $.ajax({
                    url: wf.constants.STORE_URL + "/a/product/get_liteship_and_inventory_data",
                    data: this.buildParameters(),
                    dataType: "json",
                    context: this,
                    success: function (inv) {
                        inv = this.buildInvCache(inv);
                        this.model.set({
                            inventory: inv
                        });
                        if (isSimple) {
                            if (!inventoryCache) {
                                inventoryCache = {}
                            }
                            inventoryCache[key] = inv[key];
                            this.model.set({
                                inventory_cache: inventoryCache
                            })
                        }
                        this.initScheduledDelivery()
                    }
                })
            }
            return this
        },
        preload_options: function (limit) {
            if (!this.model) {
                return this
            }
            var optionInfo = this.model.get("option_info");
            if (!optionInfo || !optionInfo.length) {
                this.update();
                return this
            }
            var defaultOptions = this.model.get("default_options"),
                count = 1,
                bDiscountedOptionExists = this.model.get("option_details") && this.model.get("option_details").where({
                    has_discount: true
                }).length !== 0,
                combinations, combination, options, key, defaultOptionsArray, eventSkus, previousCombinations, newCombinations;
            combinations = [];
            eventSkus = [""];
            previousCombinations = [""];
            newCombinations = [];
            optionInfo.some(function (optionCategory) {
                options = optionCategory.get("options");
                for (var i in previousCombinations) {
                    if (previousCombinations.hasOwnProperty(i)) {
                        for (var j in options) {
                            if (options.hasOwnProperty(j)) {
                                if (count > limit) {
                                    return true
                                }
                                combination = options[j];
                                if (previousCombinations[i]) {
                                    combination = previousCombinations[i] + "," + combination
                                }
                                var eventSku = this.model.get("option_details").get(options[j]).get("event_sku");
                                if (eventSku) {
                                    eventSkus.push(eventSku)
                                }
                                combinations.push(combination);
                                newCombinations.push(combination);
                                count++
                            }
                        }
                    }
                }
                previousCombinations = newCombinations;
                newCombinations = []
            }, this);
            if (defaultOptions && !bDiscountedOptionExists) {
                defaultOptionsArray = defaultOptions.split(",");
                defaultOptionsArray = _.without(defaultOptionsArray, "0", "");
                defaultOptionsArray.sort();
                defaultOptions = defaultOptionsArray.join(",");
                if (!_.contains(combinations, defaultOptions)) {
                    combinations.push(defaultOptions)
                }
                key = this.get_inventory_key(this.model.get("sku"), defaultOptionsArray)
            }
            var ajaxData = this.buildParameters(combinations, eventSkus);
            ajaxData.is_preload = true;
            $.ajax({
                url: wf.constants.STORE_URL + "/a/product/get_liteship_and_inventory_data",
                data: ajaxData,
                dataType: "json",
                context: this,
                success: function (inv) {
                    var updated = false;
                    inv = this.buildInvCache(inv);
                    var optionDetails = this.model.get("option_details");
                    var parentSku = this.model.get("sku");
                    key = parentSku;
                    _.each(combinations, function (combo) {
                        if (optionDetails.get(combo)) {
                            var eventSku = optionDetails.get(combo).get("event_sku");
                            if (eventSku) {
                                inv[parentSku + "_" + combo] = inv[eventSku]
                            }
                        }
                    });
                    this.model.set({
                        inventory_cache: inv
                    });
                    if (defaultOptionsArray && defaultOptionsArray.length) {
                        updated = this.set_default_options(defaultOptionsArray, inv[key])
                    }
                    if (!updated) {
                        this.update()
                    }
                }
            });
            return this
        },
        inventory_callback: function (model, inventory) {
            if (!model || !inventory) {
                return this
            }
            var mainInv, isOos = false,
                firstTime = false;
            if (!model.get("inventory_called")) {
                firstTime = true;
                model.set({
                    inventory_called: true
                })
            }
            mainInv = this.get_main_inventory(inventory);
            if (mainInv) {
                if (mainInv.b_block_add_to_cart && (mainInv.available_quantity === 0 || mainInv.available_quantity > 0 && (mainInv.available_quantity < model.attributes.min_qty || mainInv.available_quantity < model.attributes.qty_multiplier))) {
                    isOos = true
                }
                model.set({
                    is_out_of_stock: isOos,
                    inventory_main: mainInv
                });
                if (this.model.get("bGiftWithPurchaseExists") && !this.model.get("giftWithPurchaseModel")) {
                    var gwpInventoryBlock = $(".js-gwp-inventory-block", this.el),
                        gwpStockBlock = $(".js-gwp-stock-count", this.el),
                        gwpLeadTimeBlock = $(".js-gwp-ships-in", this.el);
                    if (this.model.get("is_out_of_stock")) {
                        gwpStockBlock.html(mainInv.quantity_available_string + "&nbsp;-&nbsp;")
                    } else {
                        gwpStockBlock.html("")
                    }
                    if (mainInv.LeadtimeDisplay) {
                        gwpLeadTimeBlock.html(mainInv.short_lead_time_string).removeClass("hidden-node")
                    } else {
                        gwpLeadTimeBlock.addClass("hidden-node")
                    }
                    gwpInventoryBlock.removeClass("hidden-node");
                    return this
                }
            }
            this.update_cart_button();
            this.display_item_inventory(inventory);
            this.two_day_shipping(inventory);
            if (!this.model.get("is_kit") || this.model.get("is_display_kit_as_simple_sku")) {
                this.display_main_inventory();
                if (wf.features.show_notify_me_popup_on_page_load) {
                    this.notify_me_popup()
                }
                this.update_snippet_status();
                if (mainInv) {
                    if (mainInv.LeadtimeDisplay && !((parseInt(mainInv.flag, 10) || 0) && mainInv.two_day_quantity < this.model.get("qty_multiplier"))) {
                        var leadtime = mainInv.short_lead_time_string;
                        $(".shipsin", this.el).html(leadtime).removeClass("hidden-node");
                        var leadtimeNodash = mainInv.short_lead_time_string;
                        $(".js-shipsin-nodash", this.el).html(leadtimeNodash).removeClass("hidden-node")
                    }
                }
            }
            EventDispatch.trigger(wf.constants.eventTypes.TRACKING_EVENT_TYPE, {
                verb: "LOG_OPTIONS_AND_INVENTORY",
                data: {
                    inventory: inventory,
                    bFirstTime: firstTime
                }
            });
            return this
        },
        update_snippet_status: function () {
            var stockStatusElem = $("#stock_status_snippet", this.el),
                stockLink = "http://schema.org/";
            if (stockStatusElem.length === 0) {
                return this
            }
            if (this.model.get("is_out_of_stock")) {
                stockStatusElem.attr("href", stockLink + "OutOfStock")
            } else {
                stockStatusElem.attr("href", stockLink + "InStock")
            }
            return this
        },
        buildInvCache: function (response) {
            var cacheObj = {};
            _.each(response.inventory, function (item) {
                if (item.option_key !== item.sku) {
                    cacheObj[item.sku] = item
                }
                cacheObj[item.option_key] = item
            });
            return cacheObj
        },
        buildParameters: function (customOptions, eventSkus) {
            var mainSku = this.getMainSku();
            var selectedOptions = this.getSelectedOptions();
            var isKit = this.model.get("is_kit");
            var childInfo = this.model.get("child_info");
            var fullyConfigured = this.model.isFullyConfigured();
            var eventId = this.model.get("event_id");
            var quantity = this.model.get("total_qty") || 1;
            var testingTime = UrlUtils.extractParamFromUri(window.location.href, "testing_time");
            var parameters = {
                postal_code: this.model.get("postal_code"),
                kitmode: isKit ? 1 : 0,
                is_fully_configured: fullyConfigured,
                event_id: eventId > 0 ? eventId : null,
                product_data: [{
                    sku: mainSku,
                    option_ids: selectedOptions,
                    qty: quantity
                }],
                quantity: quantity,
                testing_time: testingTime
            };
            if (isKit && childInfo) {
                childInfo.each(function (child) {
                    var qty = child.get("qty");
                    var selectOptionIds = child.get("selected_options");
                    var optionCategories = child.get("option_info") || [];
                    if (!qty && selectOptionIds.length === optionCategories.length) {
                        qty = 1
                    }
                    parameters.product_data.push({
                        sku: child.get("sku"),
                        option_ids: selectOptionIds,
                        qty: qty
                    })
                })
            }
            return parameters
        },
        build_url: function (customOptions, eventSkus) {
            var isKit = this.model.get("is_kit"),
                isGridView = this.model.get("is_grid_view"),
                sku = this.getMainSku(),
                postalCode = this.model.get("postal_code"),
                childInfo = this.model.get("child_info"),
                bGiftWithPurchaseExists = this.model.get("bGiftWithPurchaseExists"),
                giftWithPurchaseModel = this.model.get("giftWithPurchaseModel"),
                recordDelim = "~^~",
                kitSkuDelim = "~-~",
                kitChildSkuDelim = "^",
                kitSubgroupDelim = "~",
                eventIdDelim = "_",
                optionListDelim = ",",
                optionDelim = "-",
                querystring = "",
                kitMode = 0,
                selectedOptions, gridOptions, url;
            if (bGiftWithPurchaseExists && !giftWithPurchaseModel) {
                isKit = false;
                isGridView = false
            }
            var isEventSku = false;
            if (eventSkus && eventSkus[eventSkus.length - 1] || this.model.get("is_event_path") || this.model.getDailySalesOption() || this.model.get("daily_sale_on_all_options")) {
                isEventSku = true
            }
            if (customOptions) {
                var optionEventId = 0;
                if (_.isArray(customOptions)) {
                    var queryStrArr = [];
                    for (var i = 0; i < customOptions.length; i++) {
                        var option = customOptions[i];
                        var optionArr = option.toString().split(optionListDelim);
                        var dailySalesOption = this.model.getDailySalesOption(optionArr);
                        optionEventId = dailySalesOption != null ? dailySalesOption.get("event_id") : 0;
                        queryStrArr.push(sku + eventIdDelim + optionEventId + optionDelim + option)
                    }
                    querystring += queryStrArr.join(recordDelim)
                } else {
                    var dailySalesOptionSingle = this.model.getDailySalesOption(customOptions);
                    optionEventId = dailySalesOptionSingle != null ? dailySalesOptionSingle.get("event_id") : 0;
                    querystring += sku + eventIdDelim + optionEventId + optionDelim + customOptions
                }
            } else if (isKit && childInfo) {
                childInfo.each(function (child) {
                    if (querystring) {
                        querystring += kitChildSkuDelim
                    }
                    if (child.get("subgroup")) {
                        querystring += child.get("subgroup") + kitSubgroupDelim
                    }
                    querystring += child.get("sku");
                    selectedOptions = child.get("selected_options");
                    if (selectedOptions && selectedOptions.length !== 0) {
                        querystring += optionDelim + selectedOptions.join()
                    }
                }, this);
                querystring = sku + kitSkuDelim + querystring;
                kitMode = 1
            } else if (isGridView) {
                querystring = sku;
                gridOptions = this.model.get("grid_options");
                gridOptions.each(function (item) {
                    selectedOptions = item.get("options");
                    querystring += recordDelim + sku;
                    if (selectedOptions) {
                        querystring += kitSkuDelim + selectedOptions.join()
                    }
                }, this)
            } else {
                selectedOptions = this.model.get("selected_options");
                querystring = sku;
                if (isEventSku && this.model.get("event_id") !== 0) {
                    querystring += eventIdDelim + this.model.get("event_id")
                }
                if (selectedOptions && selectedOptions.length !== 0) {
                    querystring += optionDelim + selectedOptions.join()
                }
            }
            url = wf.constants.STORE_URL + "/a/product/get_liteship_and_inventory_data";
            url += "?zipcode=" + encodeURIComponent(postalCode);
            url += "&skulist=" + encodeURIComponent(querystring);
            url += "&sku=" + sku;
            url += "&kitmode=" + encodeURIComponent(kitMode);
            if (isEventSku) {
                url += "&isEventSku=1"
            }
            return url
        },
        set_default_options: function (defaultOptions, inventory) {
            var isPiidOnQs = decodeURI(window.location.search).match(/piid\[\d*\]=\d+/);
            if (defaultOptions) {
                if (!isPiidOnQs && (!inventory || inventory.b_block_product)) {
                    return false
                }
            } else {
                return false
            }
            var bInventoryNotUpdatedYet = false,
                selectedOptions = this.model.get("selected_options");
            if (selectedOptions && $(defaultOptions).not(selectedOptions).length === 0) {
                return false
            }
            _.each(defaultOptions, function (optionId) {
                if (this.model.get_collection("option_details", optionId, "is_visual") && this.model.get("page_type") !== "ProductQuickview" && this.model.get("page_type") !== "Superbrowse") {
                    $('.js-visual-option[data-pi-id="' + optionId + '"]', this.el).trigger("click");
                    bInventoryNotUpdatedYet = true
                } else {
                    var select = $('select[name^="PiID"]', this.el).has('option[value="' + optionId + '"]');
                    if (select.length) {
                        select.val(optionId);
                        select.attr("disabled", false);
                        select.trigger("change");
                        bInventoryNotUpdatedYet = true
                    } else {
                        var input = $('input[name^="PiID"][value="' + optionId + '"]', this.el);
                        if (input.length) {
                            input.prop("disabled", false);
                            input.prop("checked", true);
                            input.trigger("change")
                        } else {
                            bInventoryNotUpdatedYet = true
                        }
                    }
                }
            }, this);
            return !bInventoryNotUpdatedYet
        },
        notify_me_popup: function () {
            var batcbtn = $("#batcbtn", this.el),
                mainInventory = this.model.get("inventory_main"),
                customUrl, ideaboardsTooltipVisible = false;
            var favTooltip = this.model.get("favTooltip");
            if (favTooltip && !favTooltip.isClosed) {
                ideaboardsTooltipVisible = true
            }
            if (this.model.get("is_out_of_stock") && (this.model.get("page_type") === "ProductPage" || this.model.get("page_type") === "ProductQuickview") && (!this.model.get("option_details") || !this.model.get("option_details").length) && this.model.get("is_standard_layout") && !this.model.get("is_grid_view") && batcbtn.length && !ideaboardsTooltipVisible) {
                customUrl = "auto=1&sku=" + encodeURIComponent(this.model.get("sku")) + "&pagetype=" + encodeURIComponent(wf.constants.PAGE_TYPE);
                if (mainInventory) {
                    customUrl += "&shipsin=" + encodeURIComponent(mainInventory.LeadtimeDisplay)
                }
                notifyMe(batcbtn, "", customUrl)
            }
            return this
        },
        display_main_inventory: function () {
            var mainInv = this.model.get("inventory_main");
            if (mainInv !== undefined) {
                var qty = mainInv.available_quantity,
                    qtyDisplay = mainInv.quantity_available_string,
                    qtyDropdown = $('select[name="tmp_qty"], input.js-specialqty, select[name="qty"]', this.el),
                    inventoryBlock, $leadTimeBlock, stockCountBlock, sufficientStock;
                inventoryBlock = $(".js-inventory-block", this.el);
                stockCountBlock = $(".stock_count", this.el);
                $leadTimeBlock = inventoryBlock.find(".shipsin");
                var $onlyLeftBlock = $(".js-ds-only-left-wrapper", this.el);
                if ($onlyLeftBlock.length && qty > 0 && qty < 10) {
                    $(".js-ds-only-left", this.el).html(qty);
                    $onlyLeftBlock.removeClass("hidden-node")
                } else {
                    $onlyLeftBlock.addClass("hidden-node")
                }
                if (this.model.get("is_return") && nova.isActive) {
                    stockCountBlock.addClass("hidden-node");
                    $leadTimeBlock.addClass("hidden-node");
                    return this
                }
                sufficientStock = this.update_qty_dropdown(qtyDropdown, qty);
                if (!sufficientStock && mainInv.b_block_add_to_cart === "1") {
                    if (qty > 0 && qtyDisplay) {
                        qtyDisplay = "Insufficient Stock"
                    }
                    this.model.set({
                        is_out_of_stock: true
                    })
                }
                stockCountBlock.html(qtyDisplay);
                if (this.model.get("is_out_of_stock")) {
                    stockCountBlock.addClass("noticetext")
                } else {
                    stockCountBlock.removeClass("noticetext")
                }
                if (mainInv.LeadtimeDisplay && !((parseInt(mainInv.flag, 10) || 0) && mainInv.two_day_quantity < this.model.get("qty_multiplier") && mainInv.two_day_quantity !== -1)) {
                    $leadTimeBlock.html(mainInv.short_lead_time_string);
                    $leadTimeBlock.removeClass("hidden-node")
                } else {
                    $leadTimeBlock.addClass("hidden-node")
                }
                if (wf.appData && wf.appData.ships_in_time_icon_url && mainInv.guaranteed_holiday_campaign_id && mainInv.guaranteed_holiday_campaign_id >= 3) {
                    var self = this;
                    var wrapper = $("#sit", self.el);
                    if (!wrapper || !wrapper.length) {
                        wrapper = $('<span id="sit" class="sit blocklevel">').appendTo($(".js-set-ship-width", self.el));
                        shipsInTimePromise.done(function (ShipsInTimeView) {
                            if (wrapper && wrapper.length) {
                                new ShipsInTimeView({
                                    el: wrapper[0],
                                    model: new ShipsInTimeView.Model({
                                        postal_code: self.model.get("postal_code"),
                                        icon_url: wf.appData.ships_in_time_icon_url,
                                        change_link_extra_class: "js-delivery-estimate"
                                    }),
                                    dynamicInitialize: true
                                })
                            }
                        }).load()
                    } else {
                        wrapper.removeClass("hidden-node")
                    }
                } else {
                    $("#sit").addClass("hidden-node")
                }
                if (!this.model.get("is_out_of_stock") && (!this.model.get("option_info") || this.model.get("selected_options") && this.model.get("option_info").length === this.model.get("selected_options").length) && this.model.get("b_display_delivery_estimates")) {
                    inventoryBlock.addClass("hidden-node");
                    $leadTimeBlock.addClass("hidden-node")
                } else {
                    inventoryBlock.removeClass("hidden-node")
                }
                return this
            }
        },
        update_cart_button: function () {
            var atcButton = $("#atc_btn_wrap", this.el),
                blockButton = $("div.blockatc#notifybtn_wrap, .js-notify-me-button", this.el),
                deliveryEstimate = $('a[name="deliveryestimate"]', this.el),
                deliveryEstimateText = $(".delivery_estimate_text", this.el),
                buyMyselfLink = $("#buy_myself_link", this.el),
                adminOverride = $("#adminoverride", this.el);
            if (this.model.get("is_out_of_stock")) {
                atcButton.addClass("hidden-node");
                blockButton.removeClass("hidden-node");
                deliveryEstimate.addClass("hidden-node");
                deliveryEstimateText.html("Out of Stock");
                buyMyselfLink.addClass("hidden-node");
                adminOverride.val(1);
                atcButton.trigger("outOfStock")
            } else {
                atcButton.removeClass("hidden-node");
                blockButton.addClass("hidden-node");
                deliveryEstimate.removeClass("hidden-node");
                deliveryEstimateText.html("Enter your shipping zip code to calculate shipping estimates");
                buyMyselfLink.removeClass("hidden-node");
                adminOverride.val(0);
                atcButton.trigger("inStock")
            }
            nova.dispatcher.trigger("update_atc", {
                in_stock: !this.model.get("is_out_of_stock")
            });
            return this
        },
        display_item_inventory: function (inventory) {
            var itemInfo, isKit = this.model.get("is_kit"),
                isGridView = this.model.get("is_grid_view"),
                isCombinedKit = isKit ? this.model.get("is_display_kit_as_simple_sku") || this.model.get("is_combined_kit_layout") : false;
            if (isKit) {
                itemInfo = this.model.get("child_info")
            } else if (isGridView) {
                itemInfo = this.model.get("grid_options")
            }
            if (!itemInfo || !itemInfo.length) {
                return this
            }
            var key, itemInv, kitId, leadtime, qtyDisplay, qtyDropdown, stockDiv, blockButton, sufficientStock, qty, options, kitTdg = "",
                qtyValidToOrderAsKit = true,
                qtyValidToOrderAsKitComponent = true,
                sitespect = $.SiteSpect.sitespectCookieContains("ss_pt2200415_Remove_kits_comp_sku_out");
            itemInfo.each(function (product) {
                if (sitespect) {
                    if (inventory[this.get_inventory_key(product.get("sku"))].available_quantity === 0) {
                        qtyValidToOrderAsKitComponent = false;
                        qtyValidToOrderAsKit = false;
                        return false
                    }
                }
                if (product.get("is_optional") === false) {
                    if (inventory[this.get_inventory_key(product.get("sku"))].available_quantity === 0) {
                        qtyValidToOrderAsKit = false
                    }
                }
            }, this);
            if (sitespect) {
                if (!qtyValidToOrderAsKit && !qtyValidToOrderAsKitComponent) {
                    sitespect.trackEvent("ComponentSkuOutOfStock")
                }
            }
            if (isKit && !qtyValidToOrderAsKit) {
                $("#adminoverride").val(1);
                $("#notifybtn_wrap").removeClass("hidden-node");
                $("#atc_btn_wrap").addClass("hidden-node")
            }
            itemInfo.each(function (item) {
                if (isKit) {
                    key = this.get_inventory_key(item.get("sku"));
                    kitId = item.id;
                    blockButton = $('div.blockatc[data-kit-id="' + kitId + '"]', this.el);
                    qtyDropdown = $("select#XPrChildQtyReq_" + kitId + ", select#XPrChildQty_" + kitId, this.el);
                    stockDiv = $("div#inv_" + key, this.el)
                } else if (isGridView) {
                    key = this.get_inventory_key(this.model.get("sku"), item.id);
                    options = item.get("options").join(",");
                    blockButton = $('div.blockatc[data-piid="' + options + '"]', this.el);
                    qtyDropdown = $('select[name="ProdOpt_' + item.id + '"]', this.el);
                    stockDiv = $("div#inv_" + key, this.el)
                }
                itemInv = inventory[key];
                if (itemInv) {
                    item.set({
                        inventory_item: itemInv
                    });
                    leadtime = itemInv.short_lead_time_string;
                    qtyDisplay = itemInv.quantity_available_string;
                    sufficientStock = true;
                    qty = itemInv.available_quantity;
                    var childSelectedOptions = item.get("selected_options");
                    var childOptionInfo = item.get("option_info");
                    var fullyConfigured = childSelectedOptions && childOptionInfo ? !(childSelectedOptions.length < childOptionInfo.length) : true;
                    if (!leadtime) {
                        leadtime = ""
                    }
                    if (itemInv.html_delivery_estimate_text && fullyConfigured) {
                        leadtime = itemInv.html_delivery_estimate_text
                    }
                    if (!qtyDisplay) {
                        qtyDisplay = ""
                    }
                    if (itemInv.b_block_product) {
                        qty = 0
                    }
                    if (sitespect) {
                        if (!qtyValidToOrderAsKit || !qtyValidToOrderAsKitComponent) {
                            qty = 0
                        }
                    }
                    if (qtyDropdown && blockButton) {
                        sufficientStock = this.update_qty_dropdown(qtyDropdown, qty);
                        if (!sufficientStock) {
                            if (qty > 0 && qtyDisplay) {
                                qtyDisplay = "Insufficient Stock";
                                leadtime = ""
                            }
                            blockButton.removeClass("hidden-node");
                            if (isCombinedKit) {
                                nova.dispatcher.trigger("update_atc", {
                                    in_stock: false
                                })
                            }
                        } else {
                            blockButton.addClass("hidden-node")
                        }
                    }
                    stockDiv.children(".js-qty").html(qtyDisplay);
                    if (leadtime) {
                        stockDiv.children(".shipsin").html(leadtime).removeClass("hidden-node")
                    } else {
                        stockDiv.children(".shipsin").addClass("hidden-node")
                    }
                    if (isKit) {
                        if (itemInv.kit_subgroup) {
                            kitTdg = itemInv.kit_subgroup + ":" + itemInv.flag + "," + kitTdg
                        } else {
                            kitTdg = itemInv.sku + ":" + itemInv.flag + "," + kitTdg
                        }
                    }
                }
            }, this);
            if (kitTdg) {
                $("#kitTdg", this.el).val(kitTdg)
            }
        },
        two_day_shipping: function (inventory) {
            var mainInv = this.model.get("inventory_main");
            if (!mainInv) {
                return this
            }
            var hasTwoDay = false,
                hasFreeShipping = mainInv.has_free_shipping,
                showVariesWithOptions = false,
                showLeadTime = true,
                childInfo = this.model.get("child_info"),
                twoDayBlock, freeShipBlock, $leadTimeBlock, freeShipIcon, wordFree, itemOptions;
            twoDayBlock = $(".js-two-day-shipping-display", this.el);
            freeShipBlock = $(".js-free-ship-text", this.el);
            $leadTimeBlock = $(".js-arrives-by", this.el);
            freeShipIcon = $(".js-product-label", this.el);
            wordFree = $(".js-two-day-free-text", this.el);
            itemOptions = $(".js-two-day-item-text", this.el);
            if (this.model.get("option_details") && this.model.get("option_details").length && (!this.model.get("selected_options") || !this.model.get("selected_options").length)) {
                if (this.model.get("page_type") !== "HotDeals" || !this.model.get("default_options")) {
                    showVariesWithOptions = true
                }
            }
            hasTwoDay = mainInv.has_delivery_guarantee;
            showLeadTime = !mainInv.has_delivery_guarantee;
            if (this.model.get("is_kit")) {
                hasTwoDay = true;
                showLeadTime = false;
                var onlyExcludedChildren = true;
                if (childInfo) {
                    childInfo.each(function (product) {
                        if (product.get("is_optional") === false || product.get("qty") > 0) {
                            onlyExcludedChildren = false;
                            if (inventory[this.get_inventory_key(product.get("sku"))].flag === 0 || inventory[this.get_inventory_key(product.get("sku"))].two_day_quantity < product.get("qty_multiplier")) {
                                hasTwoDay = false;
                                showLeadTime = true
                            }
                        }
                    }, this)
                }
                if (onlyExcludedChildren) {
                    hasTwoDay = false
                }
            }
            this.model.set({
                has_two_day: hasTwoDay
            });
            $("#twoDayGuarantee", this.el).val(hasTwoDay);
            freeShipBlock.html(mainInv.guarantee_message);
            if (!this.model.get("two_day")) {
                this.model.set("two_day", {})
            }
            var twoDayInfo = this.model.get("two_day");
            twoDayInfo.serverTime = mainInv.time_loaded;
            if (freeShipIcon) {
                if (mainInv.guarantee_message_label) {
                    freeShipIcon.html(mainInv.guarantee_message_label);
                    freeShipIcon.removeClass("hidden-node")
                } else {
                    freeShipIcon.addClass("hidden-node")
                }
            }
            if (hasTwoDay) {
                if (twoDayInfo && mainInv.guaranteed_order_by_date) {
                    var orderbyDate = new Date(mainInv.guaranteed_order_by_date * 1e3);
                    var deliveryDay = mainInv.guaranteed_deliver_by_date_formatted;
                    var deliveryDays = mainInv.guaranteed_delivery_display_days;
                    var serverTime = twoDayInfo.serverTime;
                    twoDayInfo.orderByDate = orderbyDate;
                    twoDayInfo.cutoffHour = orderbyDate.getHours();
                    twoDayInfo.deliveryDay = deliveryDay;
                    twoDayInfo.deliveryDays = deliveryDays;
                    twoDayInfo.hasGuarantee = true;
                    twoDayInfo.serverTime = serverTime
                }
                pdpEventBus.trigger(pdpEventBus.TWO_DAY_SHIP_ICON_SHOWN);
                if (!hasFreeShipping) {
                    wordFree.addClass("hidden-node")
                }
                $("#ghc_node", this.el).addClass("hidden-node");
                if (showVariesWithOptions) {
                    itemOptions.html("Select Options")
                } else {
                    itemOptions.html("this item")
                }
                $leadTimeBlock.addClass("hidden-node");
                if (!this.two_day_shipping_panel) {
                    this.two_day_shipping_panel = new $.TwoDayShippingPanel(this.model)
                }
                twoDayBlock.removeClass("hidden-node")
            } else {
                if (twoDayInfo) {
                    twoDayInfo.hasGuarantee = false
                }
                if (twoDayBlock.length) {
                    $leadTimeBlock.html("");
                    if (mainInv.LeadtimeDisplay) {
                        $leadTimeBlock.html(mainInv.LeadtimeDisplay)
                    }
                    if (mainInv.html_delivery_estimate_text) {
                        $leadTimeBlock.html(mainInv.html_delivery_estimate_text)
                    }
                    if ($leadTimeBlock.html()) {
                        $leadTimeBlock.removeClass("hidden-node");
                        twoDayBlock.addClass("hidden-node")
                    }
                }
            }
            return this
        },
        update_qty_dropdown: function (node, qty) {
            var start = parseInt(node.attr("data-start"), 10) || 0,
                min = parseInt(node.attr("data-min"), 10) || 0,
                step = parseInt(node.attr("data-step"), 10) || 1,
                max = 30 * step,
                selectedOption = node.val();
            if (min > 0) {
                max += min - 1
            }
            if (qty === -1) {
                qty = max
            }
            if (qty <= 0 || qty < start || qty < min || qty < step) {
                node.attr("disabled", true);
                if (this.model.get("is_kit") && !this.model.get("is_combined_kit_layout")) {
                    node.addClass("hidden-node")
                }
                if (selectedOption && selectedOption > start) {
                    node.val(start);
                    node.trigger("change")
                }
                return false
            }
            node.attr("disabled", false);
            node.removeClass("hidden-node");
            if (!node.is("select")) {
                return true
            }
            var lastOption = node.children("option:last"),
                currentMax = parseInt(lastOption.val(), 10),
                i;
            if (qty > max || qty === 120) {
                qty = max
            }
            if (qty >= currentMax && qty < currentMax + step) {
                return true
            }
            if (qty >= currentMax + step) {
                var pretext = node.data("pretext") || "";
                for (i = currentMax + step; i <= qty; i += step) {
                    node.append('<option value="' + i + '" >' + pretext + i + "</option>")
                }
            } else {
                while (currentMax > qty) {
                    lastOption.remove();
                    lastOption = node.children("option:last");
                    currentMax = parseInt(lastOption.val(), 10)
                }
                if (selectedOption && selectedOption > currentMax) {
                    node.val(currentMax);
                    node.trigger("change")
                }
            }
            return true
        },
        get_main_inventory: function (inventory) {
            if (!inventory) {
                return false
            }
            var selectedOptions = this.model.get("selected_options"),
                sku = this.getMainSku(),
                mainKey, mainInv;
            mainKey = this.get_inventory_key(sku, selectedOptions);
            mainInv = inventory[mainKey];
            return mainInv
        },
        get_inventory_key: function (sku, selectedOptions) {
            if (!sku) {
                return ""
            }
            var key = sku.toUpperCase();
            if (selectedOptions && selectedOptions.length) {
                if (_.isArray(selectedOptions)) {
                    selectedOptions.sort();
                    key += "_" + selectedOptions.join("_")
                } else {
                    key += "_" + selectedOptions
                }
            }
            return key
        },
        getMainSku: function () {
            var dsOption = this.model.getDailySalesOption();
            if (dsOption && dsOption.get("event_sku")) {
                return dsOption.get("event_sku")
            }
            var eventSku = this.model.get("event_sku");
            if (eventSku && (this.model.get("is_event_path") || this.model.get("daily_sale_on_all_options"))) {
                return eventSku
            }
            return this.model.get("sku")
        },
        getSelectedOptions: function () {
            var dsOption = this.model.getDailySalesOption();
            if (dsOption) {
                var delimitedOptionList = dsOption.get("event_option_list");
                if (!delimitedOptionList) {
                    return []
                } else {
                    return delimitedOptionList.split("_")
                }
            } else {
                return this.model.get("selected_options")
            }
        },
        poll_two_day: function () {
            if (this.model.get("has_two_day") && !this.two_day_timer && this.expiration_time) {
                var interval = (this.expiration_time + 2) * 1e3,
                    that = this;
                this.two_day_timer = setInterval(function () {
                    if (that.model.get("has_two_day")) {
                        that.update()
                    } else {
                        that.stop_two_day_polling()
                    }
                }, interval)
            }
            return this
        },
        stop_two_day_polling: function () {
            if (this.two_day_timer) {
                clearInterval(this.two_day_timer);
                this.two_day_timer = false
            }
            return this
        },
        is_expired: function (inventory) {
            var mainInv = this.get_main_inventory(inventory),
                isExpired = false;
            if (mainInv && mainInv.Timestamp && this.expiration_time) {
                if ((new Date).getTime() - mainInv.Timestamp >= this.expiration_time * 1e3) {
                    isExpired = true
                }
            }
            return isExpired
        },
        readyToShipOptions: function () {
            var isReadyToShipAvailable = this.model.get("is_ready_to_ship_available");
            Tracking.setCustomVars({
                ShowReadyToShip: isReadyToShipAvailable === true ? 1 : 0
            });
            if (isReadyToShipAvailable !== true) {
                return
            }
            var self = this;
            var readyToShipTag = $(".js-ready-to-ship-options");
            readyToShipTag.addClass("hidden-node");
            var readyToShipService = new ReadyToShipService({
                product_model: self.model
            });
            readyToShipService.readyToShipOptions(function (data) {
                if (!_.isEmpty(data)) {
                    self.model.set("is_ready_to_ship_options_available", true);
                    self.model.set("ready_to_ship_options", data);
                    readyToShipTag.removeClass("hidden-node")
                }
            })
        },
        initScheduledDelivery: function () {
            var productInventory = this.model.get("inventory")[this.getMainSku()];
            var childInfo = this.model.get("child_info");
            var hasTwoDay = productInventory.has_delivery_guarantee;
            if (this.model.get("is_kit")) {
                hasTwoDay = true;
                var onlyExcludedChildren = true;
                if (childInfo) {
                    var inventory = this.model.get("inventory");
                    childInfo.each(function (product) {
                        if (product.get("is_optional") === false || product.get("qty") > 0) {
                            onlyExcludedChildren = false;
                            var kitProductKey = this.get_inventory_key(product.get("sku"));
                            var kitProductInventory = inventory[kitProductKey];
                            if (kitProductInventory.flag === 0 || kitProductInventory.two_day_quantity < product.get("qty_multiplier")) {
                                hasTwoDay = false
                            }
                        }
                    }, this)
                }
                if (onlyExcludedChildren) {
                    hasTwoDay = false
                }
            }
            var $jsScheduleDelivery = $(".js-scheduled-shipping");
            var $jsDeliveryMessaging = hasTwoDay ? $(".js-two-day-shipping-display") : $(".js-arrives-by");
            var $jsFirstDate = $(".js-first-arrival-date");
            var $jsScheduleDeliveryWithUpgrade = $(".js-scheduled-shipping-with-upgrade");
            if (productInventory) {
                if (productInventory.has_scheduled_delivery || productInventory.has_scheduled_delivery_with_upgrade) {
                    if (productInventory.has_scheduled_delivery) {
                        $jsScheduleDelivery.removeClass("hidden-node");
                        $jsDeliveryMessaging.addClass("hidden-node");
                        $jsFirstDate.removeClass("hidden-node");
                        $jsFirstDate.html(productInventory.lnrs_delivery_schedule_first_arrival_text)
                    } else if (productInventory.has_scheduled_delivery_with_upgrade) {
                        $jsScheduleDeliveryWithUpgrade.removeClass("hidden-node");
                        $jsScheduleDelivery.addClass("hidden-node");
                        $jsFirstDate.addClass("hidden-node");
                        $jsDeliveryMessaging.removeClass("hidden-node")
                    }
                    var deliveryDate = new Date(productInventory.delivery_estimate_low * 1e3);
                    var month = (deliveryDate.getMonth() + 1).toString();
                    month = month.length < 2 ? "0".concat(month) : month;
                    var day = deliveryDate.getDate().toString();
                    day = day.length < 2 ? "0".concat(day) : day;
                    var deliveryDateText = month + "-" + day + "-" + deliveryDate.getFullYear();
                    var optionDetails = this.model.get("option_details");
                    if (optionDetails) {
                        var selectedOptionDetails = optionDetails.findWhere("is_selected", true);
                        if (selectedOptionDetails != null) {
                            var PiID = optionDetails.findWhere("is_selected", true).get("id")
                        }
                    }
                    var cstmVars = "PDPScheduleDeliveryEligible=" + productInventory.has_scheduled_delivery + ";SuID=" + productInventory.lead_time_supplier_id + ";ShipSpeedId=" + productInventory.default_ship_speed_id + ";ZipCode=" + this.model.get("postal_code");
                    if (PiID) {
                        cstmVars += "PiID=" + PiID + ";"
                    }
                    if (deliveryDateText) {
                        cstmVars += ";AvailDelDate=" + deliveryDateText
                    }
                    Tracking.spvTwo(window.location.href, false, cstmVars)
                } else {
                    var $jsDeliveryMessagingToHide = !hasTwoDay ? $(".js-two-day-shipping-display") : $(".js-arrives-by");
                    $jsScheduleDelivery.addClass("hidden-node");
                    $jsFirstDate.addClass("hidden-node");
                    $jsScheduleDeliveryWithUpgrade.addClass("hidden-node");
                    $jsDeliveryMessaging.removeClass("hidden-node");
                    $jsDeliveryMessagingToHide.addClass("hidden-node")
                }
            }
        }
    });
    return Inventory
});
define("two_day_shipping_panel", ["jquery", "wayfair", "url_utils", "string_utils", "bootstrap-modal", "modal_utility_functions"], function ($, wf, UrlUtils, stringUtils) {
    "use strict";

    function TwoDayShippingPanel(model) {
        this.model = model;
        if (!this.model) {
            return
        }
        this.el = this.model.get_view_element();
        this.initialClientTime = (new Date).getTime();
        this.init()
    }
    $.extend(TwoDayShippingPanel.prototype, {
        init: function () {
            var twoDayInfo = this.model.get("two_day"),
                modalDiv;
            setInterval($.proxy(this.updateOrderBy, this, twoDayInfo), 1e3);
            this.updateOrderBy(twoDayInfo);
            if (this.model.get("page_type") !== "HotDeals") {
                modalDiv = $.centeredModal("modal-standard popform", "shipping-info");
                $(".js-two-day-more-link", this.el).on("click", function () {
                    modalDiv.modal("loadContent", wf.constants.STORE_URL + "/ajax/get_shipping_info.php", {});
                    modalDiv.modal("show")
                })
            } else {
                $(".js-two-day-more-link", this.el).addClass("hidden-node")
            }
        },
        updateOrderBy: function (twoDayInfo) {
            if (!twoDayInfo || !twoDayInfo.hasGuarantee) {
                return
            }
            var elapsedClientTime, currentTime, isBeforeCutoff, timeLeft, hoursLeft, minutesLeft = "";
            elapsedClientTime = (new Date).getTime() - this.initialClientTime;
            currentTime = twoDayInfo.serverTime + elapsedClientTime;
            var override = UrlUtils.extractParamFromUri(window.location.href, "testing_time");
            if (override != null) {
                currentTime = Date.parse(override)
            }
            timeLeft = twoDayInfo.orderByDate.getTime() - currentTime;
            var seconds = Math.floor(timeLeft / 1e3);
            var minutes = Math.floor(seconds / 60);
            hoursLeft = Math.floor(minutes / 60);
            minutesLeft = minutes % 60;
            isBeforeCutoff = minutesLeft > 0;
            var formattedTime = "";
            if (isBeforeCutoff && hoursLeft >= 24) {
                formattedTime = stringUtils.formatTranslated("Order {1}!", '<span class="emphasis">' + "Today" + "</span>")
            } else if (isBeforeCutoff) {
                var formattedHours = "";
                var formattedMinutes = "";
                if (hoursLeft > 1) {
                    formattedHours = stringUtils.formatTranslated("{1} hrs", hoursLeft)
                } else if (hoursLeft === 1) {
                    formattedHours = "1 hr"
                }
                if (minutesLeft > 1) {
                    formattedMinutes = stringUtils.formatTranslated("{1} mins", minutesLeft)
                } else if (minutesLeft === 1) {
                    formattedMinutes = "1 min"
                }
                formattedTime = stringUtils.formatTranslated("Order within {1} {2}", '<span class="emphasis">' + formattedHours + "</span>", '<span class="emphasis">' + formattedMinutes + "</span>")
            }
            var message = stringUtils.formatTranslated("{1}! {2}", twoDayInfo.deliveryDay, formattedTime);
            var jsTwoDayShippingDisplay = $(".js-two-day-shipping-display", this.el);
            jsTwoDayShippingDisplay.html(message);
            if (jsTwoDayShippingDisplay.html() && jsTwoDayShippingDisplay.hasClass("hidden-node")) {
                $(".js-arrives-by", this.el).empty()
            }
        }
    });
    $.TwoDayShippingPanel = TwoDayShippingPanel;
    return $
});
define("modal_added_product", ["jquery", "wayfair", "wf_carousel_view", "sitespect", "event_dispatch", "modal_utility_functions"], function ($, wf, CarouselView, SiteSpect, EventDispatch) {
    "use strict";
    var modalDiv = $('<div id="quickview" class="modal_wrapper modal_regular quickview js-quickview-modal">' + '<div class="modal-body"></div>' + "</div>");

    function AddedProductModal(cfg) {
        if (!(this instanceof AddedProductModal)) {
            throw new Error('AddedProductModal() not called as a constructor with "new"')
        } else {
            var customConfig = {};
            cfg.skipUpsell = SiteSpect.sitespectCookieContains("hide_quickview_upsell");
            customConfig.addedConfig = cfg
        }
        this.init(cfg);
        new CarouselView({
            el: ".js-carousel-wrapper",
            scrollBy: 3,
            slideDuration: 500,
            vertical: false
        })
    }
    $.extend(AddedProductModal.prototype, {
        init: function (cfg) {
            this.loadAddedProductModal(modalDiv.on("hidden", function () {
                $(this).modal("setHTML", "")
            }), cfg)
        },
        loadAddedProductModal: function (modalDiv, cfg) {
            var that = this,
                url = "/v/product/quickview_thankyou?ajax=1&";
            url = wf.constants.STORE_URL + url + $.param(cfg, true);
            $("#quickview").modal("hide");
            modalDiv.data("qv-url", url);
            modalDiv.modal("loadContent", url, {
                callback: that.callAddedProductModal,
                args: modalDiv,
                context: that,
                dataType: "json"
            })
        },
        callAddedProductModal: function (ioId, o, args, modalDiv) {
            var url = modalDiv.data("qv-url");
            modalDiv.modal("show");
            modalDiv.find(".carousel").not(".vertblock").flexsliderCarousel();
            $.modalUtils.renderFacebookLikeButton("#quickview");
            $.modalUtils.pushTrackingStats(url, "#added_tracking_info");
            this.getBasketCost()
        },
        getBasketCost: function () {
            var self = this,
                spinnerHtml = '<div class="carwait itemwait bgloading" name="carwait" style="text-align:left;"></div>';
            $("#subtotal").html(spinnerHtml);
            $("#propricing").html(spinnerHtml);
            $("#rewardstotal").html(spinnerHtml);
            $.ajax({
                type: "GET",
                url: wf.constants.STORE_URL + "/a/checkout/basket/get_basket_cost",
                dataType: "json"
            }).done(function (data) {
                self.basketCostSuccess(data)
            })
        },
        basketCostSuccess: function (dataObj) {
            var subTotal = $("#subtotal"),
                propricing = $("#propricing"),
                rewardstotal = $("#rewardstotal"),
                respSubTotal = dataObj.subtotal,
                respTotalFloat = dataObj.totalfloat,
                respProPricing = dataObj.propricing,
                respRewardsTotal = dataObj.rewardstotal,
                respOrderId = dataObj.orderid,
                respOrderCreateDate = dataObj.createddate;
            subTotal.html(respSubTotal);
            propricing.html(respProPricing);
            rewardstotal.html(respRewardsTotal);
            EventDispatch.trigger(wf.constants.eventTypes.TRACKING_EVENT_TYPE, {
                verb: "SPVTWO",
                data: {
                    rfCstmVars: "Event=1;Click=ShowBasketPrice;BasketInfo=" + respOrderId + "-" + respTotalFloat + "-" + respOrderCreateDate + ";"
                }
            })
        }
    });
    wf.$doc.delegate(".ty_staticquantity", "click", function (e) {
        e.preventDefault();
        $(".ty_staticquantity").addClass("hidden-node");
        $(".ty_selectquantity").removeClass("hidden-node");
        $("#update_quantity").removeClass("hidden-node")
    });
    wf.$doc.delegate("#update_quantity_trigger", "click", function (e) {
        e.preventDefault();
        $(".bgloading").removeClass("hidden-node");
        var basketForm = $("#update_quantity_form"),
            url = basketForm.attr("action");
        $(".ty_selectquantity").addClass("hidden-node");
        var failureCallback = function () {
            window.location = "basket.php"
        };
        var updateCallback = function (result) {
            var newQuantity = result.item_quantity,
                newPrice = result.item_total_price;
            $(".bgloading").addClass("hidden-node");
            $(".static_item_quantity").text(newQuantity);
            $(".price_display").text(newPrice);
            $(".ty_staticquantity").removeClass("hidden-node")
        };
        $.ajax({
            url: url,
            type: "POST",
            data: $(basketForm).serialize(),
            success: updateCallback,
            failure: failureCallback
        })
    });
    return AddedProductModal
});
define("@Templates/stores/product/quickview/thankyou_modal_view", ["underscore", "tungstenjs", "@Templates/stores/product/quickview/partials/_carousel"], function (_, tungstenjs) {
    var Template = tungstenjs._template,
        template = new Template(["\n\n", {
            t: 7,
            e: "div",
            a: {
                "class": "modal-body"
            },
            f: ["\n    ", {
                t: 7,
                e: "span",
                a: {
                    "class": "modal_close js-modal-close wficonfont",
                    "data-dismiss": "modal"
                },
                f: [{
                    t: 1,
                    r: "",
                    n: "&#58953;"
                }]
            }, "\n    ", {
                t: 7,
                e: "div",
                a: {
                    "class": "modal_inner qv_thanks lgboxcontent js-quickview-block"
                },
                f: ["\n        ", {
                    t: 7,
                    e: "input",
                    a: {
                        type: "hidden",
                        id: "basketcount"
                    }
                }, "\n        ", {
                    t: 7,
                    e: "div",
                    a: {
                        "class": "qv_thanks_title xxltitle pos_rel margin_lg_bottom"
                    },
                    f: ["\n            ", {
                        t: 7,
                        e: "span",
                        a: {
                            "class": "qv_thanks_item_added deemphasize"
                        },
                        f: [{
                            t: 3,
                            r: "lnrs_item"
                        }]
                    }, "\n            ", {
                        t: 7,
                        e: "span",
                        a: {
                            "class": "qv_thanks_added_to_cart deemphasize"
                        },
                        f: [{
                            t: 3,
                            r: "lnrs_added_to_your_cart"
                        }]
                    }, "\n        "]
                }, "\n        ", {
                    t: 7,
                    e: "div",
                    a: {
                        "class": "qv_thanks_content clearfix"
                    },
                    f: ["\n            ", {
                        t: 7,
                        e: "div",
                        a: {
                            "class": "qv_thanks_basket fr"
                        },
                        f: ["\n                ", {
                            t: 7,
                            e: "form",
                            a: {
                                action: ["", {
                                    t: 3,
                                    r: "basket_link"
                                }, ""],
                                id: "frmBasket",
                                method: "post"
                            },
                            f: ["\n                    ", {
                                t: 7,
                                e: "table",
                                a: {
                                    "class": "full_width show-when-enabled margin_md_bottom"
                                },
                                f: ["\n                        ", {
                                    t: 7,
                                    e: "tr",
                                    a: {
                                        "class": "accent_divider"
                                    },
                                    f: ["\n                            ", {
                                        t: 7,
                                        e: "td",
                                        f: [{
                                            t: 3,
                                            r: "lnrs_order_subtotal_colon"
                                        }]
                                    }, "\n                            ", {
                                        t: 7,
                                        e: "td",
                                        a: {
                                            id: "subtotal",
                                            "class": "xltitle pricetext"
                                        }
                                    }, "\n                        "]
                                }, "\n                        ", {
                                    t: 7,
                                    e: "tr",
                                    a: {
                                        "class": "accent_divider"
                                    },
                                    f: ["\n                            ", {
                                        t: 7,
                                        e: "td",
                                        f: [{
                                            t: 3,
                                            r: "lnrs_items_in_cart"
                                        }]
                                    }, "\n                            ", {
                                        t: 7,
                                        e: "td",
                                        a: {
                                            "class": "xltitle wf_primarylighttext_alt"
                                        },
                                        f: [{
                                            t: 2,
                                            r: "basket_count"
                                        }]
                                    }, "\n                        "]
                                }, "\n                        ", {
                                    t: 4,
                                    r: "plcc_rewards_enabled",
                                    f: ["\n                            ", {
                                        t: 7,
                                        e: "tr",
                                        a: {
                                            "class": "accent_divider"
                                        },
                                        f: ["\n                                ", {
                                            t: 7,
                                            e: "td",
                                            a: {
                                                colspan: "2"
                                            },
                                            f: ["\n                                    ", {
                                                t: 7,
                                                e: "p",
                                                a: {
                                                    "class": "margin_md_bottom padding_sm_top margin_sm_top"
                                                },
                                                f: ["\n                                        ", {
                                                    t: 7,
                                                    e: "span",
                                                    a: {
                                                        "class": "rewards_logo_sm wf_primarylighttext_alt"
                                                    },
                                                    f: [{
                                                        t: 3,
                                                        r: "lnrs_rewards"
                                                    }]
                                                }, "\n                                        ", {
                                                    t: 7,
                                                    e: "a",
                                                    a: {
                                                        href: "#",
                                                        "class": "js-rewards-info-btn ltbodytext note"
                                                    },
                                                    f: ["?"]
                                                }, "\n                                    "]
                                            }, "\n\n                                    ", {
                                                t: 7,
                                                e: "p",
                                                a: {
                                                    "class": "margin_sm_bottom"
                                                },
                                                f: ["\n                                        ", {
                                                    t: 3,
                                                    r: "lnrs_you_earn_points"
                                                }, "\n                                    "]
                                            }, "\n                                "]
                                        }, "\n                            "]
                                    }, "\n                        "]
                                }, "\n                    "]
                            }, "\n\n                    ", {
                                t: 7,
                                e: "div",
                                a: {
                                    "class": "qv_thanks_atc fl"
                                },
                                f: ["\n                      ", {
                                    t: 4,
                                    r: "allow_browse",
                                    f: ["\n                        ", {
                                        t: 3,
                                        r: "checkout_now_button"
                                    }, "\n                      "]
                                }, "\n                    "]
                            }, "\n                    ", {
                                t: 7,
                                e: "div",
                                a: {
                                    "class": "qv_thanks_shopping xltitle"
                                },
                                f: ["\n                        ", {
                                    t: 7,
                                    e: "span",
                                    a: {
                                        "class": "wf_primarylighttext_alt cleanlink deemphasize js-ss-click js-track-event js-modal-close pointer",
                                        "data-group-name": "QVM",
                                        "data-event-name": "keep_shopping_thankyou",
                                        "data-click-track": "keep_shopping",
                                        "data-dismiss": "modal"
                                    },
                                    f: ["\n                            ", {
                                        t: 3,
                                        r: "lnrs_keep_shopping"
                                    }, {
                                        t: 1,
                                        r: " ",
                                        n: "&nbsp;"
                                    }, {
                                        t: 1,
                                        r: "»",
                                        n: "&raquo;"
                                    }, "\n                        "]
                                }, "\n                    "]
                            }, "\n                    ", {
                                t: 7,
                                e: "span",
                                a: {
                                    "class": "hidden-node",
                                    id: "sku"
                                },
                                f: [{
                                    t: 2,
                                    r: "sku"
                                }]
                            }, "\n                "]
                        }, "\n            "]
                    }, "\n            ", {
                        t: 7,
                        e: "div",
                        a: {
                            "class": "qv_thanks_item fl"
                        },
                        f: ["\n                ", {
                            t: 7,
                            e: "img",
                            a: {
                                "class": "qv_thanks_image flimg_s",
                                src: ["", {
                                    t: 2,
                                    r: "product_image_url"
                                }, ""],
                                alt: ["", {
                                    t: 2,
                                    r: "product_image_alt"
                                }, ""]
                            }
                        }, "\n                ", {
                            t: 7,
                            e: "p",
                            a: {
                                "class": "margin_sm_bottom"
                            },
                            f: [{
                                t: 2,
                                r: "product_display_name"
                            }]
                        }, "\n\n                ", {
                            t: 4,
                            r: "has_total_added_price",
                            f: ["\n                ", {
                                t: 7,
                                e: "p",
                                f: ["\n                    ", {
                                    t: 7,
                                    e: "span",
                                    a: {
                                        "class": "pricetext midtitle margin_sm_bottom"
                                    },
                                    f: ["\n                        ", {
                                        t: 3,
                                        r: "total_added_price"
                                    }, "\n                    "]
                                }, "\n                    ", {
                                    t: 3,
                                    r: "shipping_text"
                                }, "\n                "]
                            }, "\n                "]
                        }, "\n\n                ", {
                            t: 3,
                            r: "energy_effciency_text"
                        }, "\n\n                \n                ", {
                            t: 4,
                            r: "is_kit",
                            f: ["\n                    ", {
                                t: 7,
                                e: "ul",
                                f: ["\n                        ", {
                                    t: 7,
                                    e: "li",
                                    f: ["SKU #: ", {
                                        t: 2,
                                        r: "sku"
                                    }]
                                }, "\n                        ", {
                                    t: 4,
                                    r: "rs_extra_items",
                                    f: ["\n                            ", {
                                        t: 7,
                                        e: "li",
                                        f: [{
                                            t: 2,
                                            r: "PrName"
                                        }, " Qty: ", {
                                            t: 2,
                                            r: "OpQty"
                                        }]
                                    }, "\n                        "]
                                }, "\n                    "]
                            }, "\n                "]
                        }, "\n\n                \n                ", {
                            t: 4,
                            r: "has_options",
                            f: ["\n                    ", {
                                t: 7,
                                e: "ul",
                                a: {
                                    "class": "option_list"
                                },
                                f: ["\n                        ", {
                                    t: 4,
                                    r: "options_list",
                                    f: ["\n                            ", {
                                        t: 7,
                                        e: "li",
                                        f: [{
                                            t: 3,
                                            r: "."
                                        }]
                                    }, "\n                        "]
                                }, "\n                    "]
                            }, "\n                "]
                        }, "\n\n            "]
                    }, "\n        "]
                }, "\n        ", {
                    t: 7,
                    e: "div",
                    a: {
                        "class": "c"
                    }
                }, "\n        ", {
                    t: 4,
                    r: "qv_carousel",
                    f: ["\n          ", {
                        t: 4,
                        r: "allow_browse",
                        f: ["\n            ", {
                            t: 8,
                            r: "stores/product/quickview/partials/_carousel"
                        }, "\n          "]
                    }, "\n        "]
                }, "\n\n    "]
            }, "\n    ", {
                t: 7,
                e: "input",
                a: {
                    type: "hidden",
                    id: "added_tracking_info",
                    "data-custom-vars": ["", {
                        t: 3,
                        r: "tracking_vars"
                    }, ""],
                    "data-acct-num": ["", {
                        t: 2,
                        r: "SoGASoLevelAccountNumber"
                    }, ""],
                    "data-domain-name": ["", {
                        t: 2,
                        r: "store_domain"
                    }, ""],
                    "data-page-type": "ModalAddedProduct",
                    "data-marketing-category": ["", {
                        t: 2,
                        r: "mkc_id"
                    }, ""],
                    "data-class-name": ["", {
                        t: 2,
                        r: "master_class_id"
                    }, ""],
                    "data-manu-name": ["", {
                        t: 2,
                        r: "manufacturers_name"
                    }, ""]
                }
            }, "\n    ", {
                t: 7,
                e: "div",
                a: {
                    "class": "c"
                }
            }, "\n"]
        }]);
    template.register("stores/product/quickview/thankyou_modal");
    var output = function (data) {
        return template.toString(data, !0)
    };
    return output.toDom = _.bind(template.toDom, template), output.toVdom = _.bind(template.toVdom, template), output.attachView = _.bind(template.attachView, template), output.wrap = _.bind(template.wrap, template), output
});
define("jquery-ui-position", ["jquery", "jquery-ui-core"], function ($) {
    var $ = jQuery;
    $.ui = $.ui || {};
    var cachedScrollbarWidth, max = Math.max,
        abs = Math.abs,
        round = Math.round,
        rhorizontal = /left|center|right/,
        rvertical = /top|center|bottom/,
        roffset = /[\+\-]\d+%?/,
        rposition = /^\w+/,
        rpercent = /%$/,
        _position = $.fn.position;

    function getOffsets(offsets, width, height) {
        return [parseInt(offsets[0], 10) * (rpercent.test(offsets[0]) ? width / 100 : 1), parseInt(offsets[1], 10) * (rpercent.test(offsets[1]) ? height / 100 : 1)]
    }

    function parseCss(element, property) {
        return parseInt($.css(element, property), 10) || 0
    }

    function getDimensions(elem) {
        var raw = elem[0];
        if (raw.nodeType === 9) {
            return {
                width: elem.width(),
                height: elem.height(),
                offset: {
                    top: 0,
                    left: 0
                }
            }
        }
        if ($.isWindow(raw)) {
            return {
                width: elem.width(),
                height: elem.height(),
                offset: {
                    top: elem.scrollTop(),
                    left: elem.scrollLeft()
                }
            }
        }
        if (raw.preventDefault) {
            return {
                width: 0,
                height: 0,
                offset: {
                    top: raw.pageY,
                    left: raw.pageX
                }
            }
        }
        return {
            width: elem.outerWidth(),
            height: elem.outerHeight(),
            offset: elem.offset()
        }
    }
    $.position = {
        scrollbarWidth: function () {
            if (cachedScrollbarWidth !== undefined) {
                return cachedScrollbarWidth
            }
            var w1, w2, div = $("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
                innerDiv = div.children()[0];
            $("body").append(div);
            w1 = innerDiv.offsetWidth;
            div.css("overflow", "scroll");
            w2 = innerDiv.offsetWidth;
            if (w1 === w2) {
                w2 = div[0].clientWidth
            }
            div.remove();
            return cachedScrollbarWidth = w1 - w2
        },
        getScrollInfo: function (within) {
            var overflowX = within.isWindow ? "" : within.element.css("overflow-x"),
                overflowY = within.isWindow ? "" : within.element.css("overflow-y"),
                hasOverflowX = overflowX === "scroll" || overflowX === "auto" && within.width < within.element[0].scrollWidth,
                hasOverflowY = overflowY === "scroll" || overflowY === "auto" && within.height < within.element[0].scrollHeight;
            return {
                width: hasOverflowX ? $.position.scrollbarWidth() : 0,
                height: hasOverflowY ? $.position.scrollbarWidth() : 0
            }
        },
        getWithinInfo: function (element) {
            var withinElement = $(element || window),
                isWindow = $.isWindow(withinElement[0]);
            return {
                element: withinElement,
                isWindow: isWindow,
                offset: withinElement.offset() || {
                    left: 0,
                    top: 0
                },
                scrollLeft: withinElement.scrollLeft(),
                scrollTop: withinElement.scrollTop(),
                width: isWindow ? withinElement.width() : withinElement.outerWidth(),
                height: isWindow ? withinElement.height() : withinElement.outerHeight()
            }
        }
    };
    $.fn.position = function (options) {
        if (!options || !options.of) {
            return _position.apply(this, arguments)
        }
        options = $.extend({}, options);
        var atOffset, targetWidth, targetHeight, targetOffset, basePosition, dimensions, target = $(options.of),
            within = $.position.getWithinInfo(options.within),
            scrollInfo = $.position.getScrollInfo(within),
            collision = (options.collision || "flip").split(" "),
            offsets = {};
        dimensions = getDimensions(target);
        if (target[0].preventDefault) {
            options.at = "left top"
        }
        targetWidth = dimensions.width;
        targetHeight = dimensions.height;
        targetOffset = dimensions.offset;
        basePosition = $.extend({}, targetOffset);
        $.each(["my", "at"], function () {
            var pos = (options[this] || "").split(" "),
                horizontalOffset, verticalOffset;
            if (pos.length === 1) {
                pos = rhorizontal.test(pos[0]) ? pos.concat(["center"]) : rvertical.test(pos[0]) ? ["center"].concat(pos) : ["center", "center"]
            }
            pos[0] = rhorizontal.test(pos[0]) ? pos[0] : "center";
            pos[1] = rvertical.test(pos[1]) ? pos[1] : "center";
            horizontalOffset = roffset.exec(pos[0]);
            verticalOffset = roffset.exec(pos[1]);
            offsets[this] = [horizontalOffset ? horizontalOffset[0] : 0, verticalOffset ? verticalOffset[0] : 0];
            options[this] = [rposition.exec(pos[0])[0], rposition.exec(pos[1])[0]]
        });
        if (collision.length === 1) {
            collision[1] = collision[0]
        }
        if (options.at[0] === "right") {
            basePosition.left += targetWidth
        } else if (options.at[0] === "center") {
            basePosition.left += targetWidth / 2
        }
        if (options.at[1] === "bottom") {
            basePosition.top += targetHeight
        } else if (options.at[1] === "center") {
            basePosition.top += targetHeight / 2
        }
        atOffset = getOffsets(offsets.at, targetWidth, targetHeight);
        basePosition.left += atOffset[0];
        basePosition.top += atOffset[1];
        return this.each(function () {
            var collisionPosition, using, elem = $(this),
                elemWidth = elem.outerWidth(),
                elemHeight = elem.outerHeight(),
                marginLeft = parseCss(this, "marginLeft"),
                marginTop = parseCss(this, "marginTop"),
                collisionWidth = elemWidth + marginLeft + parseCss(this, "marginRight") + scrollInfo.width,
                collisionHeight = elemHeight + marginTop + parseCss(this, "marginBottom") + scrollInfo.height,
                position = $.extend({}, basePosition),
                myOffset = getOffsets(offsets.my, elem.outerWidth(), elem.outerHeight());
            if (options.my[0] === "right") {
                position.left -= elemWidth
            } else if (options.my[0] === "center") {
                position.left -= elemWidth / 2
            }
            if (options.my[1] === "bottom") {
                position.top -= elemHeight
            } else if (options.my[1] === "center") {
                position.top -= elemHeight / 2
            }
            position.left += myOffset[0];
            position.top += myOffset[1];
            if (!$.support.offsetFractions) {
                position.left = round(position.left);
                position.top = round(position.top)
            }
            collisionPosition = {
                marginLeft: marginLeft,
                marginTop: marginTop
            };
            $.each(["left", "top"], function (i, dir) {
                if ($.ui.position[collision[i]]) {
                    $.ui.position[collision[i]][dir](position, {
                        targetWidth: targetWidth,
                        targetHeight: targetHeight,
                        elemWidth: elemWidth,
                        elemHeight: elemHeight,
                        collisionPosition: collisionPosition,
                        collisionWidth: collisionWidth,
                        collisionHeight: collisionHeight,
                        offset: [atOffset[0] + myOffset[0], atOffset[1] + myOffset[1]],
                        my: options.my,
                        at: options.at,
                        within: within,
                        elem: elem
                    })
                }
            });
            if (options.using) {
                using = function (props) {
                    var left = targetOffset.left - position.left,
                        right = left + targetWidth - elemWidth,
                        top = targetOffset.top - position.top,
                        bottom = top + targetHeight - elemHeight,
                        feedback = {
                            target: {
                                element: target,
                                left: targetOffset.left,
                                top: targetOffset.top,
                                width: targetWidth,
                                height: targetHeight
                            },
                            element: {
                                element: elem,
                                left: position.left,
                                top: position.top,
                                width: elemWidth,
                                height: elemHeight
                            },
                            horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
                            vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
                        };
                    if (targetWidth < elemWidth && abs(left + right) < targetWidth) {
                        feedback.horizontal = "center"
                    }
                    if (targetHeight < elemHeight && abs(top + bottom) < targetHeight) {
                        feedback.vertical = "middle"
                    }
                    if (max(abs(left), abs(right)) > max(abs(top), abs(bottom))) {
                        feedback.important = "horizontal"
                    } else {
                        feedback.important = "vertical"
                    }
                    options.using.call(this, props, feedback)
                }
            }
            elem.offset($.extend(position, {
                using: using
            }))
        })
    };
    $.ui.position = {
        fit: {
            left: function (position, data) {
                var within = data.within,
                    withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
                    outerWidth = within.width,
                    collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                    overLeft = withinOffset - collisionPosLeft,
                    overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
                    newOverRight;
                if (data.collisionWidth > outerWidth) {
                    if (overLeft > 0 && overRight <= 0) {
                        newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
                        position.left += overLeft - newOverRight
                    } else if (overRight > 0 && overLeft <= 0) {
                        position.left = withinOffset
                    } else {
                        if (overLeft > overRight) {
                            position.left = withinOffset + outerWidth - data.collisionWidth
                        } else {
                            position.left = withinOffset
                        }
                    }
                } else if (overLeft > 0) {
                    position.left += overLeft
                } else if (overRight > 0) {
                    position.left -= overRight
                } else {
                    position.left = max(position.left - collisionPosLeft, position.left)
                }
            },
            top: function (position, data) {
                var within = data.within,
                    withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
                    outerHeight = data.within.height,
                    collisionPosTop = position.top - data.collisionPosition.marginTop,
                    overTop = withinOffset - collisionPosTop,
                    overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
                    newOverBottom;
                if (data.collisionHeight > outerHeight) {
                    if (overTop > 0 && overBottom <= 0) {
                        newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
                        position.top += overTop - newOverBottom
                    } else if (overBottom > 0 && overTop <= 0) {
                        position.top = withinOffset
                    } else {
                        if (overTop > overBottom) {
                            position.top = withinOffset + outerHeight - data.collisionHeight
                        } else {
                            position.top = withinOffset
                        }
                    }
                } else if (overTop > 0) {
                    position.top += overTop
                } else if (overBottom > 0) {
                    position.top -= overBottom
                } else {
                    position.top = max(position.top - collisionPosTop, position.top)
                }
            }
        },
        flip: {
            left: function (position, data) {
                var within = data.within,
                    withinOffset = within.offset.left + within.scrollLeft,
                    outerWidth = within.width,
                    offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
                    collisionPosLeft = position.left - data.collisionPosition.marginLeft,
                    overLeft = collisionPosLeft - offsetLeft,
                    overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
                    myOffset = data.my[0] === "left" ? -data.elemWidth : data.my[0] === "right" ? data.elemWidth : 0,
                    atOffset = data.at[0] === "left" ? data.targetWidth : data.at[0] === "right" ? -data.targetWidth : 0,
                    offset = -2 * data.offset[0],
                    newOverRight, newOverLeft;
                if (overLeft < 0) {
                    newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
                    if (newOverRight < 0 || newOverRight < abs(overLeft)) {
                        position.left += myOffset + atOffset + offset
                    }
                } else if (overRight > 0) {
                    newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
                    if (newOverLeft > 0 || abs(newOverLeft) < overRight) {
                        position.left += myOffset + atOffset + offset
                    }
                }
            },
            top: function (position, data) {
                var within = data.within,
                    withinOffset = within.offset.top + within.scrollTop,
                    outerHeight = within.height,
                    offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
                    collisionPosTop = position.top - data.collisionPosition.marginTop,
                    overTop = collisionPosTop - offsetTop,
                    overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
                    top = data.my[1] === "top",
                    myOffset = top ? -data.elemHeight : data.my[1] === "bottom" ? data.elemHeight : 0,
                    atOffset = data.at[1] === "top" ? data.targetHeight : data.at[1] === "bottom" ? -data.targetHeight : 0,
                    offset = -2 * data.offset[1],
                    newOverTop, newOverBottom;
                if (overTop < 0) {
                    newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
                    if (position.top + myOffset + atOffset + offset > overTop && (newOverBottom < 0 || newOverBottom < abs(overTop))) {
                        position.top += myOffset + atOffset + offset
                    }
                } else if (overBottom > 0) {
                    newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
                    if (position.top + myOffset + atOffset + offset > overBottom && (newOverTop > 0 || abs(newOverTop) < overBottom)) {
                        position.top += myOffset + atOffset + offset
                    }
                }
            }
        },
        flipfit: {
            left: function () {
                $.ui.position.flip.left.apply(this, arguments);
                $.ui.position.fit.left.apply(this, arguments)
            },
            top: function () {
                $.ui.position.flip.top.apply(this, arguments);
                $.ui.position.fit.top.apply(this, arguments)
            }
        }
    };
    $.support.offsetFractions = false;
    return $
});
define("cms_lazy_load_view", ["jquery", "wf_view_base", "featuredetect"], function ($, BaseView) {
    "use strict";
    var CmsLazyLoadView = BaseView.extend({
        events: {
            cmsDropDownLazy: "handleDropDownLazy"
        },
        handleDropDownLazy: function (e) {
            $(e.target).find(".cms_drop_down_lazy").each(function () {
                this.src = this.getAttribute("data-original");
                $(this).removeClass("cms_drop_down_lazy")
            })
        }
    });
    return CmsLazyLoadView
});
define("wf_helpers_view", ["wayfair", "jquery", "underscore"], function (wf, $, _) {
    "use strict";
    var $spinner = $("#spinner");
    var $pageSpinner = $("#page-spinner");
    var addedToBody = false;
    var ViewHelpers = {
        toggleSpinner: function (show, target) {
            if (show) {
                if (!target || $spinner.hasClass("waiting-spinner-fixed")) {
                    target = "body"
                }
                var spinnerHeight = window.innerHeight;
                var targetHeight = $(target).height();
                spinnerHeight = targetHeight <= spinnerHeight ? targetHeight : spinnerHeight;
                $(target).append($spinner);
                $spinner.height(spinnerHeight);
                $spinner.removeClass("hidden-node")
            } else {
                $spinner.addClass("hidden-node")
            }
        },
        togglePageSpinner: function (show) {
            if (show) {
                if (!addedToBody) {
                    wf.$body.append($pageSpinner);
                    addedToBody = true
                }
                $pageSpinner.removeClass("hidden-node")
            } else {
                $pageSpinner.addClass("hidden-node")
            }
        },
        toggleSearchBar: function (show) {
            var $mainHeader = $("#main-header"),
                $searchIcon = $(".js-search-icon"),
                $searchBar = $(".js-search-bar"),
                isOpen = $mainHeader.hasClass("header_wrapper_open");
            if ($searchBar) {
                if (show) {
                    if (!isOpen) {
                        $mainHeader.addClass("header_wrapper_open");
                        $searchIcon.addClass("hidden-node");
                        $searchBar.addClass("is-open")
                    }
                } else {
                    if (isOpen) {
                        $mainHeader.removeClass("header_wrapper_open");
                        $searchIcon.removeClass("hidden-node");
                        $searchBar.removeClass("is-open")
                    }
                }
            }
        },
        resetPinchZoom: function () {
            var $viewport = $("#viewport");
            if ($viewport.length) {
                var originalAttributes = $viewport.attr("content");
                var newAttributes = _.chain(originalAttributes.split(",")).map(function (attr) {
                    return attr.trim().split("=")
                }).object().tap(function (obj) {
                    obj["maximum-scale"] = 1
                }).pairs().map(function (pair) {
                    return pair.join("=")
                }).join(", ").value();
                $viewport.attr("content", newAttributes);
                _.delay(function () {
                    $viewport.attr("content", originalAttributes)
                }, 1)
            }
        }
    };
    return ViewHelpers
});
define("wf_collection_base", ["jquery", "underscore", "wf_batch_dispatcher", "wf_storage", "wf_utils", "tungstenjs"], function ($, _, batchDispatcher, Storage, utils, tungstenjs) {
    "use strict";
    var Backbone = tungstenjs.Backbone;
    var BaseCollection = Backbone.Collection.extend.call(tungstenjs.Collection, {
        initialize: function (models, options) {
            this.options = options || {};
            BaseCollection.__super__.initialize.apply(this, arguments)
        },
        lookup: function () {
            if (typeof this.options.dataName === "string" && utils.isset("wf.appData.collectionData")) {
                var globalData = window.wf.appData.collectionData[this.options.dataName];
                if (globalData) {
                    return $.Deferred().resolveWith(this, [globalData])
                }
            }
            return this.fetch()
        },
        remove: function (models, options) {
            var singular = !_.isArray(models);
            models = singular ? [models] : _.clone(models);
            options = options || {};
            for (var i = 0, length = models.length; i < length; i++) {
                var model = models[i] = this.get(models[i]);
                if (!model) {
                    continue
                }
                delete this._byId[model.id];
                delete this._byId[model.cid];
                var index = this.indexOf(model);
                this.models.splice(index, 1);
                this.length--;
                if (!options.silent) {
                    options.index = index;
                    model.trigger("remove", model, this, options);
                    model.trigger("update", this, options)
                }
                if (this === model.collection) {
                    model.parent = model.collection
                }
                this._removeReference(model, options)
            }
            return singular ? models[0] : models
        },
        fetch: function (options, batch, cache) {
            var self = this,
                cacheKey;
            if (cache && self.cacheKey) {
                options = options || {};
                options.data = options.data || {};
                options.data._show_summary = true;
                cacheKey = self.cacheKey + JSON.stringify(options.data);
                var cachedObject = Storage.session.get({
                    key: cacheKey,
                    json: true
                });
                if (cachedObject != null) {
                    var deferred = $.Deferred();
                    deferred.resolve(cachedObject);
                    this.manualSet(cachedObject, options);
                    return deferred.promise()
                }
            }
            if (batch) {
                var ajaxCall = {
                    id: this.cacheKey,
                    url: this.url,
                    params: options.data,
                    method: options.type || "GET"
                };
                return batchDispatcher.registerCall(ajaxCall).done(function (result) {
                    self.manualSet(result, options)
                })
            }
            return Backbone.Collection.prototype.fetch.call(this, options).done(function (response) {
                if (cache && self.cacheKey != null) {
                    Storage.session.set({
                        key: cacheKey,
                        json: true,
                        value: {
                            response: response.response
                        }
                    })
                }
            })
        },
        manualSet: function (result, options) {
            var method = options.reset ? "reset" : "set";
            this[method](this.parse(result, options), options);
            this.trigger("sync", this, result, options)
        },
        clone: function (deep) {
            if (deep) {
                return new this.constructor(this.toJSON())
            } else {
                return tungstenjs.Collection.prototype.clone.call(this)
            }
        },
        reset: function (models, options) {
            if (models && models.constructor === Object && models.is_collection && _.isArray(models.models)) {
                models = models.models
            }
            return tungstenjs.Collection.prototype.reset.call(this, models, options)
        }
    });
    return BaseCollection
});
define("email_autocomplete_mixin", ["underscore", "cocktail"], function (_, Cocktail) {
    "use strict";
    var EmailAutocompleteComponent = {
        parseInput: function (searchTerm) {
            var domains = [{
                value: "gmail.com"
            }, {
                value: "yahoo.com"
            }, {
                value: "aol.com"
            }, {
                value: "hotmail.com"
            }, {
                value: "comcast.net"
            }];
            var searchParts = searchTerm.split("%40");
            if (searchParts.length > 0) {
                var regex = new RegExp(searchParts[1]);
                var filteredResults = _.filter(domains, function (s) {
                    return s.value.match(regex)
                });
                for (var i = filteredResults.length; i--;) {
                    filteredResults[i].label = filteredResults[i].value
                }
                return filteredResults
            }
        }
    };
    Cocktail.registerMixin("email_autocomplete", EmailAutocompleteComponent);
    return EmailAutocompleteComponent
});
define("@Templates/common/modals/basic_modal_view", ["underscore", "tungstenjs"], function (_, tungstenjs) {
    var Template = tungstenjs._template,
        template = new Template(["\n", {
            t: 7,
            e: "div",
            a: {
                "class": ["modal_wrapper ", {
                    t: 2,
                    r: "transitionClass"
                }, " ", {
                    t: 2,
                    r: "modalClass"
                }, " js-wf-modal"]
            },
            f: ["\n  ", {
                t: 7,
                e: "div",
                a: {
                    "class": ["modal_inner clearfix ", {
                        t: 2,
                        r: "modal_inner_class"
                    }, ""]
                },
                f: ["\n    ", {
                    t: 4,
                    r: "showClose",
                    f: ["\n        ", {
                        t: 7,
                        e: "span",
                        a: {
                            "class": ["modal_close js-modal-close wficonfont ", {
                                t: 4,
                                r: "spv2Tracking",
                                f: ["js-track-event"]
                            }, ""]
                        },
                        m: [{
                            t: 4,
                            r: "spv2Tracking",
                            f: ['\n            data-event-name="', {
                                t: 2,
                                r: "spv2EventName"
                            }, '"\n          ']
                        }],
                        f: [{
                            t: 1,
                            r: "",
                            n: "&#58953;"
                        }]
                    }, "\n    "]
                }, "\n    ", {
                    t: 3,
                    r: "content"
                }, "\n  "]
            }, "\n"]
        }, "\n"]);
    template.register("common/modals/basic_modal");
    var output = function (data) {
        return template.toString(data, !0)
    };
    return output.toDom = _.bind(template.toDom, template), output.toVdom = _.bind(template.toVdom, template), output.attachView = _.bind(template.attachView, template), output.wrap = _.bind(template.wrap, template), output
});
define("wf_popup_model", ["wf_model_base"], function (BaseModel) {
    "use strict";
    var PopupModel = BaseModel.extend({
        defaults: {
            content: "",
            transitionClass: "modal_transition_bottom",
            transitionFinishClass: "modal_transition_finish",
            modalClass: "wf-modal-style-1",
            showClose: true,
            autoOpen: true,
            TungstenView: null,
            tungstenModel: null,
            template: null,
            respositionOnRender: true,
            spv2Tracking: false,
            spv2GroupName: "",
            spv2EventName: ""
        }
    });
    return PopupModel
});
define("wf_utils", [], function () {
    "use strict";
    var exports = {};
    exports.isset = function isset(toCheck, scope) {
        var current = scope || window;
        var steps = toCheck.split(".");
        var isSet = true;
        for (var i = 0; i < steps.length; i++) {
            current = current[steps[i]];
            if (current == null) {
                isSet = false;
                break
            }
        }
        return isSet
    };
    exports.bound = function bound(value, min, max) {
        return Math.min(max, Math.max(min, value))
    };
    return exports
});
define("wf_collection_component", ["wf_collection_base", "wf_model_component"], function (BaseCollection, ComponentModel) {
    "use strict";
    return BaseCollection.extend({
        model: ComponentModel
    })
});
define("wf_model_registry", ["jquery", "underscore", "wayfair", "wf_ajax", "wf_model_base", "registry_event_bus", "favorites_list_collection", "favorites_list_model"], function ($, _, wf, wfAjax, Model, regEventBus, ListCollection, ListModel) {
    "use strict";
    var RegistryModel = Model.extend({
        defaults: {
            lists: [],
            adding_product: false
        },
        relations: {
            lists: ListCollection,
            unassigned_items_list: ListModel
        },
        postInitialize: function () {
            var self = this;
            this.get("lists").each(function (list) {
                list.set("registry_id", self.get("id"))
            });
            this.setDeep("unassigned_items_list:registry_id", this.get("id"))
        },
        addItemToList: function (listID, item, qty) {
            var deferred = $.Deferred();
            var list = this.get("lists").get(listID) || this.get("unassigned_items_list");
            var self = this;
            if (list && !this.get("adding_product")) {
                this.set("adding_product", true);
                var formData = {
                    objectKey: item.get("object_key"),
                    type: item.get("type"),
                    listID: list.get("id"),
                    owner_customer_id: list.get("owner_customer_id"),
                    sku: item.get("sku"),
                    qty: qty || 1,
                    PiID: item.get("option_ids").split(","),
                    image_resource_id: item.get("image_resource_id"),
                    comment: item.get("comment")
                };
                wfAjax.ajax({
                    type: "POST",
                    url: wf.constants.STORE_URL + "/a/checkout/basket/add_to_ideaboard",
                    dataType: "json",
                    data: formData
                }).done(function (response) {
                    if (response && response.success) {
                        list.get("items").add(response.item, {
                            at: 0
                        });
                        deferred.resolve(response.item, response.related_skus);
                        regEventBus.trigger(regEventBus.REGISTRY_PRODUCT_ADDED, self, true)
                    } else {
                        deferred.reject();
                        regEventBus.trigger(regEventBus.REGISTRY_PRODUCT_ADD_FAILED, self, false)
                    }
                }).fail(function () {
                    deferred.reject();
                    regEventBus.trigger(regEventBus.REGISTRY_PRODUCT_ADD_FAILED, self, false)
                }).always(function () {
                    self.set("adding_product", false)
                })
            } else {
                regEventBus.trigger(regEventBus.REGISTRY_PRODUCT_ADD_FAILED, self, false);
                deferred.reject()
            }
            return deferred.promise()
        },
        hasItem: function (item) {
            var model = [];
            var lists = this.get("lists");
            lists.add(this.get("unassigned_items_list"));
            return lists.any(function (list) {
                model = list.get("items").where({
                    sku: item.sku,
                    option_ids: item.option_ids
                });
                return model.length !== 0
            })
        }
    }, {
        debugName: "RegistryModel"
    });
    return RegistryModel
});
define("favorites_item_model", ["wf_model_base", "wayfair", "underscore", "favorites_comment_model"], function (BaseModel, wf, _, CommentModel) {
    "use strict";
    var FavoriteItemModel = BaseModel.extend({
        idAttribute: "hash",
        defaults: {
            id: 0,
            list_id: 0,
            owner_customer_id: 0,
            type: 0,
            object_key: "",
            comment: "",
            comment_id: null,
            comment_html: "",
            comment_truncated_html: "",
            comment_max_length: 54,
            image_url: "",
            image_resource_id: "",
            sku: "",
            option_ids: "",
            swatch_color: "",
            red_value: 0,
            green_value: 0,
            blue_value: 0,
            deleted: false,
            default_cache_time: .035,
            show_full_comment: false,
            show_comment_editor: false,
            comment_count: 0,
            lnrs_comment_placeholder: "Note style suggestions for yourself or your client.",
            lnrs_save: "Save",
            lnrs_cancel: "Cancel"
        },
        derived: {
            is_swatch: {
                deps: ["type"],
                fn: function () {
                    return parseInt(this.get("type"), 10) === FavoriteItemModel.TYPE_COLOR_SWATCH
                }
            },
            hash: {
                deps: ["type", "object_key", "option_ids", "sku"],
                fn: function () {
                    if (!this.isProduct()) {
                        return this.get("type") + "_" + this.get("object_key")
                    }
                    var itemHash = "p_" + this.getSku(),
                        optionIDs = this.get("option_ids"),
                        optionIDsArray, sortedOptionIDs;
                    if (optionIDs) {
                        optionIDsArray = optionIDs.split(",");
                        optionIDsArray = _.sortBy(optionIDsArray, function (a) {
                            return parseInt(a, 10)
                        });
                        sortedOptionIDs = optionIDsArray.join();
                        return itemHash + "_" + sortedOptionIDs
                    }
                    return itemHash
                }
            }
        },
        relations: {
            product_block: BaseModel.extend({
                relations: {
                    lazy_loaded_image: BaseModel.extend({}, {
                        debugName: "LazyLoadedImageModel"
                    })
                }
            }, {
                debugName: "ProductBlockModel"
            })
        },
        isProduct: function () {
            return _.contains(FavoriteItemModel.PRODUCT_TYPES, parseInt(this.get("type"), 10))
        },
        getSku: function () {
            var type = parseInt(this.get("type"), 10);
            if (type === FavoriteItemModel.TYPE_PRODUCT) {
                return this.get("object_key")
            } else if (type === FavoriteItemModel.TYPE_CONFIGURED_PRODUCT) {
                return this.get("sku")
            }
            return ""
        },
        submitCommentChange: function (newComment) {
            var self = this;
            this.set("comment", newComment);
            var action = newComment === "" ? "delete_comment" : this.get("comment_id") ? "update_comment" : "save_comment";
            var commentModel = new CommentModel({
                id: this.get("comment_id"),
                message: newComment,
                item_id: this.get("item_id"),
                list_id: this.get("list_id"),
                owner_customer_id: this.get("owner_customer_id")
            });
            return commentModel.updateOldCommentSystem(action).done(function () {
                if (newComment.length > 0) {
                    if (self.get("comment_id") === null) {
                        self.set("comment_id", commentModel.get("id"))
                    }
                    self.set("comment_html", newComment);
                    var max = self.get("comment_max_length");
                    var truncatedValue = "";
                    if (newComment.length > max) {
                        truncatedValue = newComment.substring(0, max) + "..."
                    } else {
                        truncatedValue = newComment
                    }
                    self.set("comment_truncated_html", truncatedValue)
                } else {
                    self.set("comment_id", null);
                    self.set("comment_html", "");
                    self.set("comment_truncated_html", "")
                }
                self.set("show_comment_editor", false)
            })
        }
    }, {
        debugName: "FavoritesItemModel",
        TYPE_PRODUCT: 1,
        TYPE_CONFIGURED_PRODUCT: 2,
        TYPE_PHOTO: 3,
        TYPE_CONTENT: 4,
        TYPE_COLOR_SWATCH: 5,
        TYPE_ARTICLE: 6,
        TYPE_REGISTRY_PRODUCT: 7,
        ALL_TYPES: [1, 2, 3, 4, 5, 6, 7],
        PRODUCT_TYPES: [1, 2, 7],
        ARTICLE_TYPES: [4, 6]
    });
    return FavoriteItemModel
});
define("wf_redirect_utils", ["underscore"], function (_) {
    "use strict";
    var exports = {};
    exports.postRedirect = function (url, data) {
        var form = document.createElement("form");
        if (typeof data === "object") {
            _.each(Object.keys(data), function (name) {
                var element = document.createElement("input");
                element.name = name;
                element.value = data[name];
                form.appendChild(element)
            })
        }
        form.method = "POST";
        form.action = url;
        form.submit()
    };
    return exports
});
define("registry_helper", ["wayfair", "wf_model_base", "wf_tungsten_view_base", "wf_toast_popup_view", "@Templates/stores/registry/wed_registry_toast_view"], function (wf, Model, View, ToastPopupView, toastTemplate) {
    "use strict";
    var TOAST_DURATION = 8e3;
    var exports = {};
    exports.recipient_types = {
        general: 1,
        bride: 2,
        groom: 3,
        graduate: 4,
        husband: 5,
        wife: 6,
        mother: 7
    };
    exports.registry_types = {
        general: 1,
        wedding: 2,
        baby: 3,
        bridal: 4,
        house_warming: 5,
        anniversary: 6,
        graduation: 7
    };
    exports.product_groupings = {
        PRODUCT_GROUPING_NONE: 1,
        PRODUCT_GROUPING_LISTS: 2,
        PRODUCT_GROUPING_CATEGORIES: 3
    };
    exports.display_styles = {
        DISPLAY_STYLE_GRID: 1,
        DISPLAY_STYLE_LIST: 2
    };
    exports.setInputError = function (inputModel, message) {
        if (typeof inputModel === "object") {
            if (message === "") {
                inputModel.set({
                    has_error: false,
                    error_message: ""
                })
            } else {
                inputModel.set("has_error", true);
                inputModel.set("error_message", message)
            }
        }
    };
    exports.isNoPasswordCustomer = function (customer) {
        if (customer && typeof customer === "object") {
            return (!customer.password_hash || customer.password_auto_gen === 1) && customer.cu_tu_id === 3
        }
        return null
    };
    exports.regionDropDownValidator = function (value) {
        var countryID = parseInt(value, 10);
        return !isNaN(countryID) && countryID > 0
    };
    exports.isValidRegistryProduct = function (productModel) {
        if (productModel) {
            var isKit = true;
            if (typeof productModel.isKit === "function") {
                isKit = productModel.isKit()
            } else {
                isKit = productModel.get("is_kit")
            }
            return !isKit
        }
        return false
    };
    exports.showAddToRegistryToast = function (registry, success) {
        var message = "";
        if (success) {
            message = "Added to your registry"
        } else {
            message = "Failed to add to your Registry"
        }
        if (!registry) {
            registry = new Model
        }
        new ToastPopupView({
            TungstenView: View,
            tungstenModel: new Model({
                success: success,
                lnrsMessage: message,
                registryUrl: registry.get("manage_url")
            }),
            template: toastTemplate,
            modalClass: "WedRegistryToast-wrap",
            duration: TOAST_DURATION
        })
    };
    return exports
});
define("@Templates/stores/product/quickview/partials/_product_overview_tabbed", ["underscore", "tungstenjs", "@Templates/stores/product/quickview/partials/_review_block", "@Templates/stores/product/quickview/partials/_dimensions_array", "@Templates/stores/product/quickview/partials/_add_to_cart_button"], function (_, tungstenjs) {
    var Template = tungstenjs._template,
        template = new Template(["\n\n", {
            t: 7,
            e: "div",
            a: {
                "class": ["mainproductinfo fr ", {
                    t: 4,
                    r: "is_flooring",
                    f: [" qv_flooring "]
                }, ""]
            },
            f: ["\n    ", {
                t: 7,
                e: "p",
                a: {
                    "class": "qv_prod_title midtitle"
                },
                f: ["\n      ", {
                    t: 4,
                    r: "allow_browse",
                    f: ["\n        ", {
                        t: 7,
                        e: "a",
                        a: {
                            "class": "cleanlink js-track-event",
                            href: ["", {
                                t: 2,
                                r: "product_url"
                            }, ""],
                            "data-group-name": "QVM",
                            "data-event-name": "product_name",
                            "data-click-location": "product_name"
                        },
                        f: ["\n            ", {
                            t: 3,
                            r: "product_name_html"
                        }, "\n        "]
                    }, "\n      "]
                }, "\n      ", {
                    t: 4,
                    r: "allow_browse",
                    f: ["\n        ", {
                        t: 7,
                        e: "span",
                        a: {
                            "class": "js-track-event",
                            "data-group-name": "QVM",
                            "data-event-name": "product_name"
                        },
                        f: ["\n          ", {
                            t: 3,
                            r: "product_name_html"
                        }, "\n        "]
                    }, "\n      "],
                    n: 51
                }, "\n    "]
            }, "\n\n    ", {
                t: 7,
                e: "div",
                a: {
                    "class": "js-favorites-parent pos_rel fr"
                },
                f: ["\n      ", {
                    t: 4,
                    r: "allow_browse",
                    f: ["\n        ", {
                        t: 3,
                        r: "social_block_html"
                    }, "\n      "]
                }, "\n    "]
            }, "\n\n    ", {
                t: 7,
                e: "div",
                a: {
                    "class": "pdp_review_head contentblock accent_divider js-review-head"
                },
                f: ["\n        ", {
                    t: 8,
                    r: "stores/product/quickview/partials/_review_block"
                }, "\n    "]
            }, "\n\n    ", {
                t: 7,
                e: "div",
                a: {
                    "class": "pdp_tabs_block pos_rel"
                },
                f: ["\n        ", {
                    t: 7,
                    e: "div",
                    a: {
                        "class": "parent_tab product_details_tab",
                        style: "margin-top:0;"
                    },
                    f: ["\n\n        \n        \n        ", {
                        t: 7,
                        e: "div",
                        a: {
                            "class": ["details_tab tab pos_rel midtitle\n            js-ss-click js-tab-header js-track-event accent_font_reg\n            ", {
                                t: 4,
                                r: "is_details_tab_active",
                                f: ["active_tab"]
                            }, ""],
                            id: "overview",
                            "data-click-track": "qv_details_tab",
                            "data-event-name": "qv_details_tab",
                            "data-tab-id": "details"
                        },
                        f: ["\n            ", {
                            t: 7,
                            e: "span",
                            a: {
                                "class": "tab_title deemphasize"
                            },
                            f: [{
                                t: 3,
                                r: "lnrs_item_selection"
                            }]
                        }, "\n        "]
                    }, "\n\n        \n        ", {
                        t: 7,
                        e: "div",
                        a: {
                            "class": ["summary_tab tab pos_rel midtitle\n              js-ss-click js-tab-header js-track-event accent_font_reg\n              ", {
                                t: 4,
                                r: "is_summary_tab_active",
                                f: ["active_tab"]
                            }, ""],
                            id: "overview",
                            "data-click-track": "qv_summary_tab",
                            "data-event-name": "qv_summary_tab",
                            "data-tab-id": "summary"
                        },
                        f: ["\n            ", {
                            t: 7,
                            e: "span",
                            a: {
                                "class": "tab_title deemphasize"
                            },
                            f: [{
                                t: 3,
                                r: "lnrs_summary"
                            }]
                        }, "\n        "]
                    }, "\n\n        ", {
                        t: 7,
                        e: "div",
                        a: {
                            "class": "qv_see_more_link margin_sm_top fr"
                        },
                        f: ["\n          ", {
                            t: 4,
                            r: "allow_browse",
                            f: ["\n            ", {
                                t: 7,
                                e: "a",
                                a: {
                                    "class": "cleanlink blocklevel wf_primarylighttext_alt js-track-event",
                                    href: ["", {
                                        t: 2,
                                        r: "product_url"
                                    }, ""],
                                    "data-group-name": "QVM",
                                    "data-event-name": "more_product_details"
                                },
                                f: ["\n                ", {
                                    t: 3,
                                    r: "lnrs_full_details"
                                }, {
                                    t: 1,
                                    r: " ",
                                    n: "&nbsp;"
                                }, {
                                    t: 1,
                                    r: "»",
                                    n: "&raquo;"
                                }, "\n            "]
                            }, "\n          "]
                        }, "\n        "]
                    }, "\n\n        \n        ", {
                        t: 7,
                        e: "div",
                        a: {
                            "class": ["details_body tab_body js-tab-body js-details-body\n        ", {
                                t: 4,
                                r: "is_details_tab_active",
                                f: ["hidden-node"],
                                n: 51
                            }, ""]
                        },
                        f: ["\n            ", {
                            t: 7,
                            e: "div",
                            a: {
                                "class": "qv_details_header"
                            },
                            f: ["\n                ", {
                                t: 3,
                                r: "pricing_view"
                            }, "\n            "]
                        }, "\n            ", {
                            t: 7,
                            e: "div",
                            a: {
                                "class": "qv_delivery c"
                            },
                            f: ["\n                ", {
                                t: 3,
                                r: "delivery_display_view"
                            }, "\n            "]
                        }, "\n            ", {
                            t: 7,
                            e: "div",
                            a: {
                                "class": ["", {
                                    t: 4,
                                    r: "has_options",
                                    f: ["qv_options accent_spacing_sm_top accent_divider_top"]
                                }, ""]
                            },
                            f: ["\n                ", {
                                t: 3,
                                r: "options_html"
                            }, "\n            "]
                        }, "\n        "]
                    }, "\n\n        \n        ", {
                        t: 7,
                        e: "div",
                        a: {
                            "class": ["summary_body tab_body js-tab-body js-summary-body\n        ", {
                                t: 4,
                                r: "is_summary_tab_active",
                                f: ["hidden-node"],
                                n: 51
                            }, ""]
                        },
                        f: ["\n\n            ", {
                            t: 4,
                            r: "is_romance_copy_trimmed",
                            f: ["\n                ", {
                                t: 2,
                                r: "romance_copy"
                            }, "\n                ", {
                                t: 7,
                                e: "div",
                                a: {
                                    "class": "accent_divider accent_spacing_lg_bottom"
                                },
                                f: ["\n                    ", {
                                    t: 7,
                                    e: "div",
                                    a: {
                                        "class": "read_more_box",
                                        id: "long_content_toggle"
                                    },
                                    f: ["\n                    "]
                                }, "\n                    ", {
                                    t: 7,
                                    e: "a",
                                    a: {
                                        "class": "note read_more_box yui3-toggle yui3-noclick",
                                        "data-hide-class": "expanded",
                                        "data-id": "long_content_toggle",
                                        "data-alttext": ["", {
                                            t: 2,
                                            r: "lnrs_read_less"
                                        }, ""]
                                    },
                                    f: ["\n                        ", {
                                        t: 2,
                                        r: "lnrs_more_details"
                                    }, "\n                    "]
                                }, "\n                "]
                            }, "\n            "]
                        }, "\n\n            ", {
                            t: 4,
                            r: "is_romance_copy_trimmed",
                            f: ["\n                ", {
                                t: 7,
                                e: "div",
                                a: {
                                    "class": "qv_romance_copy accent_divider accent_spacing_lg_bottom"
                                },
                                f: ["\n                    ", {
                                    t: 2,
                                    r: "romance_copy"
                                }, "\n                "]
                            }, "\n            "],
                            n: 51
                        }, "\n\n            ", {
                            t: 7,
                            e: "div",
                            a: {
                                "class": "qv_summary accent_divider accent_spacing_lg_bottom"
                            },
                            f: ["\n                ", {
                                t: 7,
                                e: "p",
                                a: {
                                    "class": "emphasis"
                                },
                                f: [{
                                    t: 3,
                                    r: "lnrs_product_features"
                                }]
                            }, "\n                ", {
                                t: 7,
                                e: "ul",
                                f: ["\n                    ", {
                                    t: 4,
                                    r: "option_name_values",
                                    f: ["\n                        ", {
                                        t: 7,
                                        e: "li",
                                        f: [{
                                            t: 7,
                                            e: "strong",
                                            f: [{
                                                t: 2,
                                                r: "name"
                                            }, ":", {
                                                t: 1,
                                                r: " ",
                                                n: "&nbsp;"
                                            }]
                                        }, {
                                            t: 2,
                                            r: "value"
                                        }]
                                    }, "\n                    "]
                                }, "\n                "]
                            }, "\n            "]
                        }, "\n\n            ", {
                            t: 7,
                            e: "div",
                            a: {
                                "class": "prod_dimensions accent_spacing_sm_bottom"
                            },
                            f: ["\n                ", {
                                t: 7,
                                e: "p",
                                a: {
                                    "class": "emphasis uppercase"
                                },
                                f: [{
                                    t: 3,
                                    r: "lnrs_dimensions_colon"
                                }, {
                                    t: 1,
                                    r: " ",
                                    n: "&nbsp;"
                                }]
                            }, "\n                ", {
                                t: 4,
                                r: "dimensions_array",
                                f: ["\n                    ", {
                                    t: 4,
                                    r: "has_header",
                                    f: ["\n                        ", {
                                        t: 7,
                                        e: "div",
                                        a: {
                                            "class": "margin_lg_top margin_lg_bottom"
                                        },
                                        f: ["\n                            ", {
                                            t: 7,
                                            e: "p",
                                            a: {
                                                "class": "emphasis textblock sub_header"
                                            },
                                            f: ["\n                                ", {
                                                t: 3,
                                                r: "header"
                                            }, "\n                            "]
                                        }, "\n                            ", {
                                            t: 8,
                                            r: "stores/product/quickview/partials/_dimensions_array"
                                        }, "\n                        "]
                                    }, "\n                    "]
                                }, "\n                    ", {
                                    t: 4,
                                    r: "has_header",
                                    f: ["\n                        ", {
                                        t: 8,
                                        r: "stores/product/quickview/partials/_dimensions_array"
                                    }, "\n                    "],
                                    n: 51
                                }, "\n                "]
                            }, "\n            "]
                        }, "\n        "]
                    }, "\n      "]
                }, "\n    "]
            }, "\n\n    ", {
                t: 7,
                e: "div",
                a: {
                    "class": "c"
                }
            }, "\n\n    ", {
                t: 8,
                r: "stores/product/quickview/partials/_add_to_cart_button"
            }, "\n"]
        }]);
    template.register("stores/product/quickview/partials/_product_overview_tabbed");
    var output = function (data) {
        return template.toString(data, !0)
    };
    return output.toDom = _.bind(template.toDom, template), output.toVdom = _.bind(template.toVdom, template), output.attachView = _.bind(template.attachView, template), output.wrap = _.bind(template.wrap, template), output
});
define("@Templates/stores/product/quickview/partials/_carousel", ["underscore", "tungstenjs"], function (_, tungstenjs) {
    var Template = tungstenjs._template,
        template = new Template(["\n\n", {
            t: 4,
            r: "has_products",
            f: ["\n    ", {
                t: 7,
                e: "div",
                a: {
                    "class": "padding_sm_top c"
                },
                f: ["\n        ", {
                    t: 7,
                    e: "p",
                    a: {
                        "class": "qv_carousel_title_wrap centertext xltitle margin_lg_bottom"
                    },
                    f: ["\n            ", {
                        t: 7,
                        e: "span",
                        a: {
                            "class": "qv_carousel_title deemphasize accent_font_reg"
                        },
                        f: ["\n                ", {
                            t: 2,
                            r: "carousel_header"
                        }, "\n            "]
                    }, "\n        "]
                }, "\n\n        ", {
                    t: 7,
                    e: "div",
                    a: {
                        "class": "js-qv-carousel qv_carousel_wrap js-carousel-wrapper pos_rel"
                    },
                    f: ["\n\n            ", {
                        t: 7,
                        e: "a",
                        a: {
                            href: "javascript:void(0)",
                            "class": "qv_prev centertext fl js-scroll-prev wficonfont js-track-event",
                            "data-group-name": "QVM",
                            "data-event-name": "carousel_prev"
                        },
                        f: ["\n            "]
                    }, "\n\n            ", {
                        t: 7,
                        e: "a",
                        a: {
                            href: "javascript:void(0)",
                            "class": "qv_next centertext fr js-scroll-next wficonfont js-track-event",
                            "data-group-name": "QVM",
                            "data-event-name": "carousel_next"
                        },
                        f: ["\n            "]
                    }, "\n\n            ", {
                        t: 7,
                        e: "div",
                        a: {
                            "class": "qv_carousel_content js-carousel-content"
                        },
                        f: ["\n                ", {
                            t: 7,
                            e: "div",
                            a: {
                                "class": "qv_carousel_slide js-carousel-slider pos_rel clearfix full_width"
                            },
                            f: ["\n                    ", {
                                t: 4,
                                r: "products",
                                f: ["\n                        ", {
                                    t: 7,
                                    e: "div",
                                    a: {
                                        "class": "qv_carousel_item centertext js-carousel-item"
                                    },
                                    f: ["\n                            ", {
                                        t: 7,
                                        e: "a",
                                        a: {
                                            href: ["/v/product/quick_view?sku=", {
                                                t: 2,
                                                r: "sku"
                                            }, "&ajax=1"],
                                            "class": "jq-quickview blocklevel cleanlink js-track-event",
                                            "data-group-name": "QVM",
                                            "data-click-location": "similar_item_skus",
                                            "data-event-name": "similar_item_skus",
                                            "data-carousel-title": ["", {
                                                t: 2,
                                                r: "carousel_title"
                                            }, ""],
                                            "data-carousel-skus": ["", {
                                                t: 2,
                                                r: "carousel_skus"
                                            }, ""]
                                        },
                                        f: ["\n                                ", {
                                            t: 7,
                                            e: "img",
                                            a: {
                                                "class": "qv_carousel_image blocklevel margin_sm_bottom",
                                                "data-sku": ["", {
                                                    t: 2,
                                                    r: "sku"
                                                }, ""],
                                                src: ["", {
                                                    t: 2,
                                                    r: "image_url"
                                                }, ""],
                                                "data-click-location": "similar_item_skus"
                                            }
                                        }, "\n\n                                ", {
                                            t: 3,
                                            r: "rating_view_html"
                                        }, "\n                                ", {
                                            t: 7,
                                            e: "p",
                                            a: {
                                                "class": "emphasis margin_sm_top"
                                            },
                                            f: ["\n                                    ", {
                                                t: 2,
                                                r: "price"
                                            }, "\n                                "]
                                        }, "\n                            "]
                                    }, "\n                        "]
                                }, "\n                    "]
                            }, "\n                "]
                        }, "\n            "]
                    }, "\n        "]
                }, "\n    "]
            }, "\n"]
        }]);
    template.register("stores/product/quickview/partials/_carousel");
    var output = function (data) {
        return template.toString(data, !0)
    };
    return output.toDom = _.bind(template.toDom, template), output.toVdom = _.bind(template.toVdom, template), output.attachView = _.bind(template.attachView, template), output.wrap = _.bind(template.wrap, template), output
});
define("wf_view_registry_dropdown", ["jquery", "underscore", "wf_tungsten_view_base", "wf_view_registry_dropdown_item", "registry_event_bus"], function ($, _, View, DropdownItemView, regEventBus) {
    "use strict";
    var DropdownView = View.extend({
        events: {
            "click .js-registry-toplevel": "handleRegistryTopLevelClick"
        },
        childViews: {
            "js-registry-product-list": DropdownItemView
        },
        handleRegistryTopLevelClick: function (e) {
            e.preventDefault();
            regEventBus.trigger(regEventBus.PDP_ADD_TO_REGISTRY, this.model)
        }
    }, {
        debugName: "RegistryDropdownView"
    });
    return DropdownView
});
define("@Templates/stores/registry/wed_registry_add_to_registry_view", ["underscore", "tungstenjs", "_t!%5B%22ViewInRegistry%22%2C%22View%20in%20Registry%22%5D", "_t!%5B%22AddingProduct%22%2C%22Adding%20Product...%22%5D", "_t!%5B%22AddToRegistry%22%2C%22Add%20to%20Registry%22%5D", "_t!%5B%22AddToRegistryMenuToggle%22%2C%22Select%20registry%20board%22%5D"], function (_, tungstenjs) {
    var Template = tungstenjs._template,
        template = new Template(["\n\n", {
            t: 4,
            r: "can_add_product",
            f: ["\n  ", {
                t: 7,
                e: "div",
                a: {
                    "class": "WedRegistryAddToRegistry"
                },
                f: ["\n    ", {
                    t: 4,
                    r: "is_product_in_registry",
                    f: ["\n      ", {
                        t: 7,
                        e: "a",
                        a: {
                            href: ["", {
                                t: 2,
                                r: "product_in_registry_url"
                            }, ""],
                            "class": "WedRegistryAddToRegistry-button btn_css_secondary btn_css_lg js-view-registry js-track-event",
                            "data-event-name": "view_registry"
                        },
                        f: ["\n        ", {
                            t: 7,
                            e: "span",
                            a: {
                                "class": "WedRegistryAddToRegistry-button-text"
                            },
                            f: ["\n          ", {
                                t: 4,
                                r: "_t",
                                f: ['{"key": "ViewInRegistry", "default": "View in Registry"}']
                            }, "\n        "]
                        }, "\n      "]
                    }, "\n    "]
                }, "\n    ", {
                    t: 4,
                    r: "is_product_in_registry",
                    f: ["\n      ", {
                        t: 4,
                        r: "adding_product",
                        f: ["\n        ", {
                            t: 7,
                            e: "button",
                            a: {
                                type: "button",
                                "class": "WedRegistryAddToRegistry-button btn_css_secondary btn_css_lg is-sending",
                                disabled: !0
                            },
                            f: ["\n          ", {
                                t: 7,
                                e: "span",
                                a: {
                                    "class": "WedRegistryAddToRegistry-button-text"
                                },
                                f: ["\n            ", {
                                    t: 4,
                                    r: "_t",
                                    f: ['{"key": "AddingProduct", "data": "", "default": "Adding Product..."}']
                                }, "\n          "]
                            }, "\n        "]
                        }, "\n      "]
                    }, "\n      ", {
                        t: 4,
                        r: "adding_product",
                        f: ["\n        ", {
                            t: 7,
                            e: "button",
                            a: {
                                type: "button",
                                "class": ["WedRegistryAddToRegistry-button", {
                                    t: 4,
                                    r: "has_dropdown",
                                    f: [" WedRegistryAddToRegistry-button--split"]
                                }, " btn_css_secondary btn_css_lg js-add-to-registry js-track-event"],
                                "data-event-name": "add_to_registry"
                            },
                            f: ["\n          ", {
                                t: 7,
                                e: "span",
                                a: {
                                    "class": "WedRegistryAddToRegistry-button-text"
                                },
                                f: ["\n              ", {
                                    t: 4,
                                    r: "_t",
                                    f: ['{"key": "AddToRegistry", "data": "", "default": "Add to Registry"}']
                                }, "\n          "]
                            }, "\n        "]
                        }, "\n        ", {
                            t: 4,
                            r: "has_dropdown",
                            f: ["\n          ", {
                                t: 7,
                                e: "button",
                                a: {
                                    type: "button",
                                    "class": ["WedRegistryAddToRegistry-button WedRegistryAddToRegistry-button--toggle btn_css_secondary btn_css_lg js-show-registry-dropdown js-track-event", {
                                        t: 4,
                                        r: "can_add_product",
                                        f: [" disabled"],
                                        n: 51
                                    }, ""],
                                    "data-event-name": "show_registry_dropdown",
                                    "aria-haspopup": "true",
                                    "aria-expanded": ["", {
                                        t: 4,
                                        r: "show_registry_dropdown",
                                        f: ["true"]
                                    }, "", {
                                        t: 4,
                                        r: "show_registry_dropdown",
                                        f: ["false"],
                                        n: 51
                                    }, ""]
                                },
                                f: ["\n            ", {
                                    t: 7,
                                    e: "span",
                                    a: {
                                        "class": "WedRegistryAddToRegistry-button-text"
                                    },
                                    f: ["\n              ", {
                                        t: 4,
                                        r: "_t",
                                        f: ['{"key": "AddToRegistryMenuToggle", "data": "", "default": "Select registry board"}']
                                    }, "\n            "]
                                }, "\n          "]
                            }, "\n        "]
                        }, "\n        ", {
                            t: 4,
                            r: "show_registry_dropdown",
                            f: ["\n          ", {
                                t: 4,
                                r: "dropdown_registry",
                                f: ["\n          ", {
                                    t: 7,
                                    e: "ul",
                                    a: {
                                        "class": "WedRegistryAddToRegistry-menu-list js-registry"
                                    },
                                    f: ["\n            ", {
                                        t: 4,
                                        r: "lists",
                                        f: ["\n              ", {
                                            t: 7,
                                            e: "li",
                                            a: {
                                                "class": "WedRegistryAddToRegistry-menu-item js-registry-product-list"
                                            },
                                            f: ["\n                ", {
                                                t: 7,
                                                e: "a",
                                                a: {
                                                    href: "#",
                                                    "class": "WedRegistryAddToRegistry-menu-link js-registry-add-to-list"
                                                },
                                                f: [{
                                                    t: 2,
                                                    r: "name"
                                                }]
                                            }, "\n              "]
                                        }, "\n            "]
                                    }, "\n          "]
                                }, "\n          "]
                            }, "\n        "]
                        }, "\n      "],
                        n: 51
                    }, "\n    "],
                    n: 51
                }, "\n  "]
            }, "\n"]
        }, "\n"]);
    template.register("stores/registry/wed_registry_add_to_registry");
    var output = function (data) {
        return template.toString(data, !0)
    };
    return output.toDom = _.bind(template.toDom, template), output.toVdom = _.bind(template.toVdom, template), output.attachView = _.bind(template.attachView, template), output.wrap = _.bind(template.wrap, template), output
});
define("notifyme_view", ["wayfair", "underscore", "jquery", "nova_utils", "wf_tooltip_view", "wf_tooltip_model", "modal_mixin_ajax", "@Templates/common/modals/blank_modal_view"], function (wf, _, $, nova, TooltipView, TooltipModel, ajaxMixin, popupTemplate) {
    "use strict";
    var tooltipEvents = _.defaults({
        submit: "submitForm"
    }, TooltipView.prototype.events);
    var NotifyMeView = TooltipView.extend({
        events: tooltipEvents,
        submitForm: function (e) {
            e.preventDefault();
            var $form = $(e.target);
            $form.find('input[type="submit"]').prop("disabled", true);
            var model = this.model;
            $.ajax({
                type: "POST",
                url: wf.constants.STORE_URL + "/session/public/ajax/notify_me.php",
                data: $form.serializeArray(),
                success: function (response) {
                    if (response) {
                        model.set("content", response)
                    }
                },
                dataType: "html"
            });
            var waitingStr = '<div class="bgloading"></div>';
            model.set("content", waitingStr, {
                silent: true
            });
            this.$(".oosblock").html(waitingStr);
            this.reposition()
        }
    });

    function getLeadtime(productModel, piid, kitid) {
        var inventory, leadtime = "";
        if (piid) {
            inventory = productModel.get_collection("grid_options", piid.replace(",", "_"), "inventory_item")
        } else if (kitid) {
            inventory = productModel.get_collection("child_info", kitid, "inventory_item")
        } else {
            inventory = productModel.get("inventory_main")
        }
        if (inventory && inventory.LeadtimeDisplay) {
            leadtime = inventory.LeadtimeDisplay
        }
        return leadtime
    }

    function buildQueryString(target, productModel) {
        if (!target || !productModel) {
            return ""
        }
        var piid = target.attr("piid"),
            kitid = target.attr("kitid"),
            sku = productModel.get("sku"),
            isKit = productModel.get("is_kit"),
            qs = "",
            childSku, options = "",
            childqs = "",
            shipsin = "",
            pagetype = "";
        if (piid) {
            qs = "sku=" + encodeURIComponent(sku) + "&optionIDs=" + encodeURIComponent(piid)
        } else if (kitid) {
            childSku = productModel.get_collection("child_info", kitid, "sku");
            options = productModel.get_collection("child_info", kitid, "selected_options");
            if (options) {
                options = options.join()
            } else {
                options = ""
            }
            qs = "sku=" + encodeURIComponent(childSku) + "&optionIDs=" + encodeURIComponent(options)
        } else {
            qs = "sku=" + encodeURIComponent(sku);
            if (isKit) {
                productModel.get("child_info").each(function (child) {
                    if (child.get("qty") > 0) {
                        if (childqs !== "") {
                            childqs += "~"
                        }
                        childqs = childqs + child.get("sku");
                        if (child.get("selected_options")) {
                            childqs += "-" + child.get("selected_options")
                        }
                    }
                });
                qs += "&child=" + encodeURIComponent(childqs)
            } else {
                options = productModel.get("selected_options");
                if (options) {
                    qs += "&optionIDs=" + encodeURIComponent(options.join())
                }
            }
        }
        shipsin = getLeadtime(productModel, piid, kitid);
        if (qs && shipsin) {
            qs += "&shipsin=" + encodeURIComponent(shipsin)
        }
        pagetype = wf.constants.PAGE_TYPE;
        if (qs && pagetype) {
            qs += "&pagetype=" + encodeURIComponent(pagetype)
        }
        return qs
    }
    return function (target, productModel, customQueryString) {
        if (!target) {
            return
        }
        var $target = target.jquery ? target : $(target);
        var $btnWrap = $target.closest("#notifybtn_wrap");
        if ($btnWrap.length) {
            $target = $btnWrap
        }
        var ajaxUrl = wf.constants.STORE_URL + "/session/public/ajax/notify_me.php?";
        if (customQueryString) {
            ajaxUrl += customQueryString
        } else {
            ajaxUrl += buildQueryString($target, productModel)
        }
        if (nova.isActive) {
            ajaxUrl += "&nova=1"
        }
        var model = new TooltipModel({
            my: "left bottom",
            at: "left bottom",
            target: $target,
            productModel: productModel,
            ajaxUrl: ajaxUrl
        });
        var view = new NotifyMeView({
            template: popupTemplate,
            model: model,
            mixins: [ajaxMixin]
        });
        view.el.style.position = "absolute";
        var activeQuickview = $("#quickview:visible");
        if (activeQuickview.length) {
            activeQuickview.one("hidden.notify", function () {
                view.close()
            });
            view.listenTo(view, "close", function () {
                activeQuickview.off("hidden.notify")
            })
        }
        return view
    }
});
define("pdp_event_bus", ["wf_events", "underscore"], function (WayfairEvents, _) {
    "use strict";
    return _.extend({
        TWO_DAY_SHIP_ICON_SHOWN: "twoDayShipIcon:shown",
        OPTION_IMAGE_LOADED: "optionImageLoaded"
    }, WayfairEvents)
});
define("nova_utils", ["jquery", "wayfair", "underscore", "wf_events"], function ($, wf, _, WayfairEvents) {
    "use strict";
    var SMOOTH_SCROLL_MS = 300;
    var EXPANDABLE_CLOSE_ENOUGH = 150;
    var isActive = !!wf.appData && !!wf.appData.isProductNova;
    var dispatcher = _.extend({}, WayfairEvents);
    wf.$doc.on("click", ".js-top_qa_link_nova", function (e) {
        e.preventDefault();
        dispatcher.trigger("scroll_to", $(this).attr("href"))
    });
    wf.$doc.on("click", ".js-ask-first-question", function (e) {
        e.preventDefault();
        $(".js-product-ask-a-question").trigger("click");
        dispatcher.trigger("scroll_to", "#questions")
    });

    function replaceImageRule(str, oldRule, newRule) {
        return str.replace("/lf/" + oldRule + "/", "/lf/" + newRule + "/")
    }

    function adjustOptionImages(response) {
        if (response.img) {
            if (response.img.main_image_url) {
                response.img.main_image_url = replaceImageRule(response.img.main_image_url, 50, 49)
            }
            response.img.main_image_urls = _.map(response.img.main_image_urls, function (str) {
                return replaceImageRule(str, 50, 49)
            })
        }
        return response
    }

    function scrollTo(y) {
        $("html,body").animate({
            scrollTop: y
        }, SMOOTH_SCROLL_MS);
        return SMOOTH_SCROLL_MS
    }
    return {
        isActive: isActive,
        scrollTo: scrollTo,
        adjustOptionImages: adjustOptionImages,
        replaceImageRule: replaceImageRule,
        dispatcher: dispatcher,
        EXPANDABLE_CLOSE_ENOUGH: EXPANDABLE_CLOSE_ENOUGH
    }
});
define("ready_to_ship_service", ["wayfair", "jquery", "underscore"], function (wf, $, _) {
    "use strict";

    function ReadyToShip(dataObj) {
        this.productModel = dataObj.product_model;
        this.sku = dataObj.product_model.get("sku");
        this.optionModel = dataObj.option_model
    }
    ReadyToShip.prototype.readyToShipOptions = function (callBack) {
        var self = this;
        $.ajax({
            url: wf.constants.STORE_URL + "/a/product/get_ready_to_ship_options",
            data: {
                postal_code: self.productModel.get("postal_code"),
                sku: this.sku,
                option_id: !_.isUndefined(self.optionModel) ? self.optionModel.get("option_id") : ""
            },
            dataType: "json"
        }).done(callBack)
    };
    return ReadyToShip
});
define("options_event_bus", ["wf_events", "underscore"], function (WayfairEvents, _) {
    "use strict";
    var OptionsEventBus = _.extend({}, WayfairEvents);
    OptionsEventBus.SHOW_OPTION_DETAIL_VIEW = "show_option_detail";
    OptionsEventBus.HIDE_OPTION_DETAIL_VIEW = "hide_option_detail";
    OptionsEventBus.SELECT_OPTION = "select_option";
    OptionsEventBus.FILTER_SWATCHES = "filter_swatches";
    OptionsEventBus.SHOW_ALL_SWATCHES = "show_all_swatches";
    OptionsEventBus.UPDATE_ORDER_SAMPLE_BUTTON = "update_order_sample_button";
    OptionsEventBus.UPDATE_MATERIAL_VIEW = "update_material_view";
    OptionsEventBus.UPDATE_ORDER_SAMPLE_BUTTON = "update_order_sample_button";
    OptionsEventBus.UPDATE_MODEL = "update_model";
    return OptionsEventBus
});
define("product_model", ["wayfair", "jquery", "backbone", "underscore", "handlebars", "option_image_collection", "order_swatches_form_model", "swatch_collection", "add_installation_service_model"], function (wf, $, Backbone, _, Handlebars, OptionImageCollection, OrderSwatchesFormModel, SwatchCollection, AddInstallationServiceModel) {
    "use strict";
    var ProductChildModel = Backbone.Model.extend({
        get_collection: function () {
            var reference = this;
            _.each(arguments, function (arg) {
                if (!reference) {
                    return false
                }
                reference = reference.get(arg)
            }, this);
            return reference
        },
        special_box_unit_text: function (plurality) {
            if (this.get("is_flooring_sku")) {
                return plurality ? "cartons" : "carton"
            } else if (this.get("is_wallpaper_sku")) {
                return plurality ? "Rolls" : "roll"
            }
        },
        set_collection: function (path, attributes, options) {
            var reference = this.get_collection.apply(this, path);
            if (reference) {
                reference.set(attributes, options)
            }
            return this
        },
        object_to_collection: function (name, type) {
            var object, collection;
            object = this.get(name);
            if (object) {
                collection = this.get_collection_from_object(object, type);
                this.set(name, collection)
            }
            return this
        },
        get_collection_from_object: function (object, type) {
            if (!_.isObject(object)) {
                return false
            }
            var collection = new Backbone.Collection;
            _.each(object, function (attributes, id) {
                attributes.id = id;
                attributes.type = type;
                collection.add(new ProductChildModel(attributes))
            }, this);
            return collection
        }
    });
    var orderSwatchesHtmlString = '<p class="secondarytextmed midtitle bodytext">{{orderSwatchesTitle}}</p>' + '<p class="emphasis textbox">{{shippingText}}</p>' + '<form class="order-swatches-form order_swatch_form" action="POST" target="{{targetUrl}}">' + '<input type="hidden" name="sw_ids" value="{{swatchIdList}}" />' + '<input type="hidden" name="sku" value="{{activeSku}}" />' + '<div><p class="js-order-swatch-error c noticetext" name="full_name_error"></p><label class="fl" for="full_name">{{fullNameLabel}}</label>' + '<input type="text" name="full_name" /></div>' + '<div><p class="js-order-swatch-error c noticetext" name="street_address_error"></p><label class="fl" for="address_1">{{addressLabel}}</label>' + '<input type="text" name="address_1" /></div>' + '<div><label class="fl" for="address_2">&nbsp;</label>' + '<input type="text" name="address_2" /></div>' + '<div><p class="js-order-swatch-error c noticetext" name="city_error"></p><label class="fl" for="city">{{cityLabel}}</label>' + '<input type="text" name="city" /></div>' + '<div><p class="js-order-swatch-error c noticetext" name="state_error"></p>' + '<p class="js-order-swatch-error c noticetext" name="postal_code_error"></p><label class="fl" for="state_id">{{stateLabel}}</label>' + '<span class="js-state-select-container state_drop fl">{{{stateSelect}}}</span>' + '<label class="zip_label fl" for="zip">{{zipLabel}}</label>' + '<input class="zip_input" type="text" name="zip" /></div>' + '<div><p class="js-order-swatch-error c noticetext" name="country_error"></p><label class="fl" for="country_id">{{countryLabel}}</label>' + '<div class="country_drop">{{{countrySelect}}}</div></div>' + '<div><p class="js-order-swatch-error c noticetext" name="phone_error"></p><label class="fl" for="phone">{{phoneLabel}}</label>' + '<input type="text" name="phone" /></div>' + '<div><label class="fl" for="email">{{emailLabel}}</label>' + '<input type="email" name="email" /></div>' + '<div class="message-container"></div>' + '<div class="textbox"><div class="btn_input order_swatch_btn fl"><span class="btn_cap_sec_med"></span>' + '<input class="js-submit-order-swatches btn_sec_med uppercase" type="submit" value="{{buttonText}}">' + '<span class="btn_arrow_med"></span></div><p class="c"></p></div>' + "</form>";
    $.wf = $.wf || {};
    $.wf.ProductModel = ProductChildModel.extend({
        defaults: {
            validator: null,
            total_price: 0,
            total_regular_price: 0,
            total_list_price: 0,
            total_qty: 1,
            display_set_quantity: 1,
            total_rollback_regular_price: 0,
            total_shipping: 0,
            shipping_upgrade: 0,
            shipping_stairs: 0,
            personalization_price: 0,
            error_count: 0,
            has_option_error: false,
            has_qty_error: false,
            has_text_error: false,
            qty_multiplier: 1,
            selected_options: [],
            is_return: false,
            bGiftWithPurchaseExists: false,
            giftWithPurchaseSku: "",
            giftWithPurchaseModel: null,
            wfModalObject: null,
            mainImgNativeWidth: 0,
            mainImgNativeHeight: 0,
            mainImgAspectRatio: null,
            activeKitChildId: null,
            activeKitSku: null,
            bZoomedIn: false,
            optionImageCollection: null,
            sortedOptionList: {},
            highlightedOptionImageIndex: 0,
            bVideoMode: false,
            videoDetails: null,
            bSwatchMode: false,
            bSwatchesFiltered: false,
            swatchDetails: null,
            swatchCollection: null,
            swatchCategories: {},
            activeSwatchCategory: null,
            highlightedSwatchIndex: 0,
            orderSwatchesFormModel: null,
            modalOptions: {
                modalStyleCustomClass: "MediaModal",
                isDynamic: true,
                isFullscreen: true,
                minHeight: 250,
                minWidth: 620,
                modalContentClass: "media-viewer-content",
                style: null
            },
            keyPressConstants: {
                space_bar: 32,
                left_arrow_key: 37,
                h_key: 72,
                right_arrow_key: 39,
                l_key: 76
            },
            initMediaViewerViewClass: "js-init-media-viewer",
            imgPanelClass: "media-viewer-img-panel",
            navPanelClass: "media-viewer-nav-panel",
            navArrowClass: "media-viewer-arrow",
            spinnerClass: "media-viewer-spinner",
            videoIframeClass: "media-viewer-video",
            spinnerHtml: '<div class="media-viewer-spinner media_spinner centertext">' + '<div id="spinner" class="bgloading"></div>' + "Loading..." + "</div>",
            minImgWidth: 150,
            minImgHeight: 150,
            vidPanelMinHeight: 700,
            vidPanelMinWidth: 650,
            imgPanelMinWidth: 620,
            imgPanelMinHeight: 250,
            thumbnail_rule: 42,
            orderSwatchesHtmlString: orderSwatchesHtmlString,
            orderSwatchesHtmlTemplate: null,
            validateRight: false,
            option_exceptions: [],
            addInstallationServiceModel: null
        },
        initialize: function () {
            this.set({
                id: _.uniqueId()
            });
            this.object_to_collection("child_info", "kit");
            this.object_to_collection("return_items", "return");
            this.object_to_collection("grid_options", "grid");
            this.object_to_collection("option_details", "option_details");
            this.object_to_collection("event_options", "event_options");
            this.set({
                orderSwatchesFormModel: new OrderSwatchesFormModel
            });
            this.set({
                addInstallationServiceModel: new AddInstallationServiceModel
            });
            this.set({
                orderSwatchesHtmlTemplate: Handlebars.compile(this.get("orderSwatchesHtmlString"))
            });
            if (typeof this.get("optionImageSet") === "string") {
                this.set({
                    optionImageSet: $.parseJSON(this.get("optionImageSet"))
                })
            }
            if (typeof this.get("videoDetails") === "string") {
                this.set({
                    videoDetails: $.parseJSON(this.get("videoDetails"))
                })
            }
            if (this.get("is_event_path")) {
                var sku = this.get("sku"),
                    eventExceptions = this.get("event_exceptions"),
                    optionExceptions = this.get("option_exceptions"),
                    optionExceptionsForSku = [];
                if (optionExceptions && optionExceptions[sku]) {
                    optionExceptionsForSku = optionExceptions[sku]
                }
                if (eventExceptions) {
                    this.set("option_exceptions", optionExceptionsForSku.concat(eventExceptions))
                }
            }
        },
        get_view_element: function () {
            return '.js-product-view-element[data-model="' + this.id + '"]'
        },
        getActiveSkus: function () {
            var skuArray = [];
            if (this.get("is_kit")) {
                if (this.get("is_combined_kit_layout")) {
                    skuArray.push(this.get("sku"));
                    $.merge(skuArray, this.get("child_info").pluck("sku"))
                } else {
                    skuArray.push(this.get("activeKitSku"))
                }
            } else if (this.get("is_return")) {
                skuArray.push(this.get("return_items").map(function (model) {
                    return model.get("id")
                })[0].split(".")[0])
            } else {
                skuArray.push(this.get("sku"))
            }
            return skuArray
        },
        getSelectedOptions: function () {
            var bIsKit = this.get("is_kit"),
                activeKitChildId = this.get("activeKitChildId"),
                kitChildren = this.get("child_info"),
                childrenSelectedOptions, selectedOptions = [];
            if (bIsKit) {
                if (activeKitChildId !== null) {
                    selectedOptions = kitChildren.where({
                        id: activeKitChildId
                    })[0].get("selected_options")
                } else {
                    childrenSelectedOptions = kitChildren.pluck("selected_options");
                    $.each(childrenSelectedOptions, function (index, optionArray) {
                        if (optionArray && optionArray.length) {
                            $.merge(selectedOptions, optionArray)
                        }
                    })
                }
            } else {
                selectedOptions = this.get("selected_options")
            }
            return selectedOptions && selectedOptions.length ? selectedOptions.join(",") : 0
        },
        getDailySalesOption: function (optionList) {
            if (typeof optionList === "undefined") {
                optionList = this.get("selected_options")
            }
            var eventOptions = this.get("event_options");
            if (eventOptions) {
                var sourceOptionList = optionList.sort(function (a, b) {
                    return a - b
                }).join("_");
                var dsOption = eventOptions.get(sourceOptionList);
                if (typeof dsOption !== "undefined" && dsOption.get("available") > 0) {
                    return dsOption
                }
            }
            return null
        },
        swapOption: function (piid) {
            var optionDetails = this.get("option_details");
            var category = optionDetails.get(piid).get("category");
            var swappedList = this.get("selected_options").filter(function (option) {
                return optionDetails.get(option).get("category") !== category
            });
            swappedList.push(piid);
            return swappedList
        },
        fetchImages: function () {
            $.when(this.fetchSwatchImages()).done($.proxy(function () {
                $.when(this.fetchOptionImages()).done($.proxy(function () {
                    this.trigger("imagesUpdated")
                }, this))
            }, this))
        },
        fetchSwatchImages: function () {
            var swatchCollection = this.get("swatchCollection"),
                optionDetailCollection = this.get("option_details"),
                bOptionsExist = typeof optionDetailCollection !== "undefined",
                activeSkuArray = this.getActiveSkus(),
                activeSkuCount = activeSkuArray.length,
                swatchCategories = this.get("swatchCategories"),
                activeSwatchCategory = this.get("activeSwatchCategory"),
                optionList = [],
                dfd = $.Deferred(),
                models, completedAjaxCounter, model;
            if (!bOptionsExist || _.isEmpty(swatchCategories)) {
                dfd.resolve()
            } else {
                if (swatchCollection === null) {
                    swatchCollection = new SwatchCollection
                }
                if (activeSwatchCategory === null) {
                    $.each(swatchCategories, function (i, cat) {
                        model = optionDetailCollection.find(function (model) {
                            return $.inArray(model.get("sku"), activeSkuArray) !== -1 && model.get("category") === cat
                        });
                        if (model) {
                            activeSwatchCategory = cat;
                            return
                        }
                    });
                    this.set({
                        activeSwatchCategory: activeSwatchCategory
                    })
                }
                optionList = optionDetailCollection.chain().filter(function (model) {
                    return $.inArray(model.get("category"), _.values(swatchCategories)) !== -1 && $.inArray(model.get("sku"), activeSkuArray) !== -1
                }).pluck("id").value();
                models = swatchCollection.filter(function (model) {
                    return $.inArray(model.get("option_id").toString(), optionList) !== -1
                });
                if (models.length) {
                    dfd.resolve()
                } else {
                    completedAjaxCounter = 0;
                    $.each(activeSkuArray, $.proxy(function (i, sku) {
                        $.ajax({
                            url: window.YUI_config.app.store_url + "/ajax/get_swatch_images.php",
                            data: {
                                sku: sku,
                                piid: optionList.join(","),
                                b_clearance_item: this.get("is_return")
                            },
                            dataType: "json",
                            context: this
                        }).done(function (response) {
                            if (response) {
                                $.each(response[optionList.join(",")], function (index, swatchObj) {
                                    if (swatchCollection.where({
                                            option_id: swatchObj.option_id
                                        }).length === 0) {
                                        swatchObj.sku = sku;
                                        swatchObj.option_category = optionDetailCollection.find(function (model) {
                                            return model.get("id") === swatchObj.option_id.toString()
                                        }).get("category");
                                        swatchCollection.add(swatchObj)
                                    }
                                });
                                this.set({
                                    swatchCollection: swatchCollection.sort()
                                });
                                completedAjaxCounter++;
                                if (completedAjaxCounter === activeSkuCount) {
                                    dfd.resolve()
                                }
                            }
                        }).fail(function () {
                            completedAjaxCounter++;
                            if (completedAjaxCounter === activeSkuCount) {
                                dfd.resolve()
                            }
                        })
                    }, this))
                }
            }
            return dfd.promise()
        },
        fetchOptionImages: function () {
            var optionImageCollection = this.get("optionImageCollection"),
                swatchCollection, activeSkuArray = this.getActiveSkus(),
                activeSkuCount = activeSkuArray.length,
                optionString = this.getSelectedOptions(),
                selectedOptionArray = optionString.toString().split(","),
                swatchCategories = this.get("swatchCategories"),
                dfd = $.Deferred(),
                optionImageModels, swatchModels, completedAjaxCounter;
            if (optionImageCollection === null) {
                optionImageCollection = new OptionImageCollection
            }
            if (swatchCategories && !_.isEmpty(swatchCategories)) {
                swatchCollection = this.get("swatchCollection")
            }
            optionImageModels = optionImageCollection.filter(function (model) {
                return model.get("option_string") === optionString && $.inArray(model.get("sku"), activeSkuArray) !== -1
            });
            if (optionImageModels.length) {
                dfd.resolve()
            } else {
                completedAjaxCounter = 0;
                $.each(activeSkuArray, $.proxy(function (i, sku) {
                    $.ajax({
                        url: window.YUI_config.app.store_url + "/ajax/get_option_images.php",
                        data: {
                            b_media_viewer: true,
                            b_clearance_item: this.get("is_return"),
                            sku: sku,
                            piid: optionString
                        },
                        dataType: "json",
                        context: this
                    }).done(function (response) {
                        $.each(response[optionString], function (index, obj) {
                            obj.sku = sku;
                            obj.option_string = optionString;
                            optionImageCollection.add(obj)
                        });
                        if (swatchCollection && swatchCollection.length) {
                            swatchModels = swatchCollection.filter(function (model) {
                                return $.inArray(model.get("option_id").toString(), selectedOptionArray) !== -1 && model.get("sw_id") !== 0
                            });
                            if (swatchModels.length) {
                                $.each(swatchModels, function (index, swatchModel) {
                                    optionImageCollection.add({
                                        small_image_url: swatchModel.get("small_image_url"),
                                        large_image_url: swatchModel.get("large_image_url"),
                                        overlayText: "",
                                        captionText: "",
                                        b_is_zoomable: swatchModel.get("b_is_zoomable"),
                                        b_use_overlay: false,
                                        b_is_swatch_image: true,
                                        sku: sku,
                                        option_string: optionString
                                    })
                                })
                            }
                        }
                        this.set({
                            optionImageCollection: optionImageCollection
                        });
                        completedAjaxCounter++;
                        if (completedAjaxCounter === activeSkuCount) {
                            dfd.resolve()
                        }
                    }).fail(function () {
                        completedAjaxCounter++;
                        if (completedAjaxCounter === activeSkuCount) {
                            dfd.resolve()
                        }
                    })
                }, this))
            }
            return dfd.promise()
        },
        getOptionComboListPrice: function () {
            var optionKey = this.get("selected_options").sort(function (a, b) {
                return a - b
            }).join("_");
            var optionComboListPriceMapping = this.get("option_combo_list_price");
            if (optionComboListPriceMapping) {
                return optionComboListPriceMapping[optionKey]
            } else {
                return false
            }
        },
        isFullyConfigured: function () {
            var isKit = this.get("is_kit");
            var childInfo = this.get("child_info");
            var selectedOptions = !this.get("selected_options") ? [this.get("default_options")] : this.get("selected_options");
            var optionInfo = this.get("option_info");
            var hasAllRequiredOptions = optionInfo == null;
            if (isKit && childInfo) {
                hasAllRequiredOptions = childInfo.every(function (child) {
                    var childOptionQty = child.get("qty");
                    if (childOptionQty > 0) {
                        var childOptionInfo = child.get("option_info");
                        var childSelectedOptions = child.get("selected_options");
                        return !childOptionInfo || childSelectedOptions && childSelectedOptions.length >= childOptionInfo.length
                    }
                    return true
                })
            } else if (selectedOptions != null && optionInfo != null) {
                hasAllRequiredOptions = !(optionInfo && selectedOptions.length < optionInfo.length)
            }
            return hasAllRequiredOptions
        }
    });
    return $.wf.ProductModel
});
define("wf_carousel_view", ["jquery", "underscore", "backbone", "wf_carousel_view_base", "wf_carousel_api", "wf_utils", "wf_scheduler", "sitespect"], function ($, _, Backbone, CarouselBaseView, wfCarouselApi, wfUtils, wfScheduler, SiteSpect) {
    "use strict";
    var MOBILE_HOT_DEALS_FACTOR = "3492588v0";
    var CarouselView = CarouselBaseView.extend({
        events: _.extend({}, CarouselBaseView.prototype.events, {
            "win-resize": "_calculateScrollBy",
            "win-scroll": "_calculateScrollBy"
        }),
        _calculateScrollBy: _.throttle(function () {
            var $carouselContent = this.$el.find(".js-carousel-content");
            var $carouselItems = $carouselContent.find(".js-carousel-item");
            var fullWidth = $carouselContent.width();
            var itemWidth = $carouselItems.width();
            var scrollBy = Math.floor(fullWidth / itemWidth);
            if (isFinite(scrollBy)) {
                this.model.set("scrollBy", scrollBy)
            }
        }, 100),
        _initializeItems: function () {
            var i;
            this.model.set("itemPositions", new Array(this.items.length));
            this.carouselSize = 0;
            var itemPositions = this.model.get("itemPositions");
            var numItemsPerPage = 0;
            for (i = 0; i < this.numItems; i++) {
                if (this.carouselSize <= this.carouselWrapperSize) {
                    this.model.set("maxIndex", this.numItems - i);
                    if (this.carouselSize !== this.carouselWrapperSize) {
                        numItemsPerPage++
                    }
                }
                itemPositions[i] = -this.carouselSize;
                this.carouselSize += this.items.eq(i)[this.itemSizeMethod](true)
            }
            this.model.set("itemPositions", itemPositions);
            this.model.set("numItemsPerPage", numItemsPerPage);
            this.setBounds();
            if (this.resetSliderWidth) {
                this.carouselSlider.css(this.wrapperSizeMethod, this.carouselSize)
            }
            this.carouselWrapperSize = this.carouselWrapper[this.wrapperSizeMethod]();
            var disabledClass = this.model.get("disabledClass"),
                alwaysDisabledClass = this.model.get("alwaysDisabledClass");
            if (this.carouselSize <= this.carouselWrapperSize) {
                this.carouselNext.addClass(disabledClass).addClass(alwaysDisabledClass);
                this.carouselPrev.addClass(disabledClass).addClass(alwaysDisabledClass);
                this.model.set("maxIndex", 0)
            } else {
                this.carouselNext.removeClass(alwaysDisabledClass);
                this.carouselPrev.removeClass(alwaysDisabledClass)
            }
            this._transformAdjustInitialItems();
            this._calculateScrollBy();
            this._scrollTo(this.model.get("scrollIndex"))
        },
        _setup: function () {
            this._initializeSettings();
            this._initializeItems();
            if (window.location.hash === "#header") {
                window.scrollBy(0, 1)
            }
            this._scrollTo(this.model.get("scrollIndex"))
        },
        _scrollTo: function (index, slideDuration) {
            var maxIndex = this.model.get("maxIndex");
            var scrollIndex = wfUtils.bound(index, 0, maxIndex);
            var scrollPos = wfUtils.bound(this.model.get("itemPositions")[scrollIndex], this.model.get("maxScroll"), 0);
            var duration = _.isUndefined(slideDuration) ? this.model.get("slideDuration") : slideDuration;
            var easing = this.model.get("easing");
            this.animateScrollTo(scrollIndex, scrollPos, maxIndex, duration, easing)
        },
        animateScrollTo: function (scrollIndex, scrollPos, maxIndex, duration, easing, track) {
            if (track || _.isUndefined(track)) {
                SiteSpect.trackEvent("carousel_slide", MOBILE_HOT_DEALS_FACTOR)
            }
            this.model.set("scrollIndex", scrollIndex);
            this.model.set("scrollPos", scrollPos);
            var disabledClass = this.model.get("disabledClass");
            this.carouselPrev.toggleClass(disabledClass, scrollIndex === 0);
            this.carouselNext.toggleClass(disabledClass, scrollIndex === maxIndex);
            var newPosition = this._transformGetNewPosition(scrollPos);
            if (duration > 0) {
                this._transformAnimate(newPosition, duration, easing)
            } else {
                this.carouselSlider.css(newPosition);
                this._doneTransition()
            }
        },
        _scrollBy: function (val) {
            var scrollBy = this.model.get("scrollBy");
            var currentIndex = this.model.get("scrollIndex");
            var maxIndex = this.model.get("maxIndex");
            var newIndex = currentIndex + scrollBy * val;
            var wrapCarousel = this.model.get("wrapCarousel");
            if (wrapCarousel) {
                if (currentIndex === maxIndex && newIndex > maxIndex) {
                    newIndex = 0
                } else if (newIndex < 0 && currentIndex === 0) {
                    newIndex = maxIndex
                }
            }
            this._scrollTo(newIndex)
        }
    });
    wfScheduler.queuePostLoadTask(function () {
        var carousels = $(".js-auto-carousel-nowrap");
        _.each(carousels, function (elem) {
            var opts = $(elem).data();
            opts.el = elem;
            new CarouselView(opts)
        })
    });
    return CarouselView
});
define("jquery-ui-core", ["jquery"], function ($) {
    var uuid = 0,
        runiqueId = /^ui-id-\d+$/;
    $.ui = $.ui || {};
    if ($.ui.version) {
        return
    }
    $.extend($.ui, {
        version: "@VERSION",
        keyCode: {
            BACKSPACE: 8,
            COMMA: 188,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            NUMPAD_ADD: 107,
            NUMPAD_DECIMAL: 110,
            NUMPAD_DIVIDE: 111,
            NUMPAD_ENTER: 108,
            NUMPAD_MULTIPLY: 106,
            NUMPAD_SUBTRACT: 109,
            PAGE_DOWN: 34,
            PAGE_UP: 33,
            PERIOD: 190,
            RIGHT: 39,
            SPACE: 32,
            TAB: 9,
            UP: 38
        }
    });
    $.fn.extend({
        _focus: $.fn.focus,
        focus: function (delay, fn) {
            return typeof delay === "number" ? this.each(function () {
                var elem = this;
                setTimeout(function () {
                    $(elem).focus();
                    if (fn) {
                        fn.call(elem)
                    }
                }, delay)
            }) : this._focus.apply(this, arguments)
        },
        scrollParent: function () {
            var scrollParent;
            if ($.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position"))) {
                scrollParent = this.parents().filter(function () {
                    return /(relative|absolute|fixed)/.test($.css(this, "position")) && /(auto|scroll)/.test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"))
                }).eq(0)
            } else {
                scrollParent = this.parents().filter(function () {
                    return /(auto|scroll)/.test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"))
                }).eq(0)
            }
            return /fixed/.test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent
        },
        zIndex: function (zIndex) {
            if (zIndex !== undefined) {
                return this.css("zIndex", zIndex)
            }
            if (this.length) {
                var elem = $(this[0]),
                    position, value;
                while (elem.length && elem[0] !== document) {
                    position = elem.css("position");
                    if (position === "absolute" || position === "relative" || position === "fixed") {
                        value = parseInt(elem.css("zIndex"), 10);
                        if (!isNaN(value) && value !== 0) {
                            return value
                        }
                    }
                    elem = elem.parent()
                }
            }
            return 0
        },
        uniqueId: function () {
            return this.each(function () {
                if (!this.id) {
                    this.id = "ui-id-" + ++uuid
                }
            })
        },
        removeUniqueId: function () {
            return this.each(function () {
                if (runiqueId.test(this.id)) {
                    $(this).removeAttr("id")
                }
            })
        }
    });

    function focusable(element, isTabIndexNotNaN) {
        var map, mapName, img, nodeName = element.nodeName.toLowerCase();
        if ("area" === nodeName) {
            map = element.parentNode;
            mapName = map.name;
            if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
                return false
            }
            img = $("img[usemap=#" + mapName + "]")[0];
            return !!img && visible(img)
        }
        return (/input|select|textarea|button|object/.test(nodeName) ? !element.disabled : "a" === nodeName ? element.href || isTabIndexNotNaN : isTabIndexNotNaN) && visible(element)
    }

    function visible(element) {
        return $.expr.filters.visible(element) && !$(element).parents().andSelf().filter(function () {
            return $.css(this, "visibility") === "hidden"
        }).length
    }
    $.extend($.expr[":"], {
        data: $.expr.createPseudo ? $.expr.createPseudo(function (dataName) {
            return function (elem) {
                return !!$.data(elem, dataName)
            }
        }) : function (elem, i, match) {
            return !!$.data(elem, match[3])
        },
        focusable: function (element) {
            return focusable(element, !isNaN($.attr(element, "tabindex")))
        },
        tabbable: function (element) {
            var tabIndex = $.attr(element, "tabindex"),
                isTabIndexNaN = isNaN(tabIndex);
            return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN)
        }
    });
    $(function () {
        var body = document.body,
            div = body.appendChild(div = document.createElement("div"));
        div.offsetHeight;
        $.extend(div.style, {
            minHeight: "100px",
            height: "auto",
            padding: 0,
            borderWidth: 0
        });
        $.support.minHeight = div.offsetHeight === 100;
        $.support.selectstart = "onselectstart" in div;
        body.removeChild(div).style.display = "none"
    });
    if (!$("<a>").outerWidth(1).jquery) {
        $.each(["Width", "Height"], function (i, name) {
            var side = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
                type = name.toLowerCase(),
                orig = {
                    innerWidth: $.fn.innerWidth,
                    innerHeight: $.fn.innerHeight,
                    outerWidth: $.fn.outerWidth,
                    outerHeight: $.fn.outerHeight
                };

            function reduce(elem, size, border, margin) {
                $.each(side, function () {
                    size -= parseFloat($.css(elem, "padding" + this)) || 0;
                    if (border) {
                        size -= parseFloat($.css(elem, "border" + this + "Width")) || 0
                    }
                    if (margin) {
                        size -= parseFloat($.css(elem, "margin" + this)) || 0
                    }
                });
                return size
            }
            $.fn["inner" + name] = function (size) {
                if (size === undefined) {
                    return orig["inner" + name].call(this)
                }
                return this.each(function () {
                    $(this).css(type, reduce(this, size) + "px")
                })
            };
            $.fn["outer" + name] = function (size, margin) {
                if (typeof size !== "number") {
                    return orig["outer" + name].call(this, size)
                }
                return this.each(function () {
                    $(this).css(type, reduce(this, size, true, margin) + "px")
                })
            }
        })
    }(function () {
        var uaMatch = /msie ([\w.]+)/.exec(navigator.userAgent.toLowerCase()) || [];
        $.ui.ie = uaMatch.length ? true : false;
        $.ui.ie6 = parseFloat(uaMatch[1], 10) === 6
    })();
    $.fn.extend({
        disableSelection: function () {
            return this.bind(($.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (event) {
                event.preventDefault()
            })
        },
        enableSelection: function () {
            return this.unbind(".ui-disableSelection")
        }
    });
    $.extend($.ui, {
        plugin: {
            add: function (module, option, set) {
                var i, proto = $.ui[module].prototype;
                for (i in set) {
                    proto.plugins[i] = proto.plugins[i] || [];
                    proto.plugins[i].push([option, set[i]])
                }
            },
            call: function (instance, name, args) {
                var i, set = instance.plugins[name];
                if (!set || !instance.element[0].parentNode || instance.element[0].parentNode.nodeType === 11) {
                    return
                }
                for (i = 0; i < set.length; i++) {
                    if (instance.options[set[i][0]]) {
                        set[i][1].apply(instance.element, args)
                    }
                }
            }
        },
        contains: $.contains,
        hasScroll: function (el, a) {
            if ($(el).css("overflow") === "hidden") {
                return false
            }
            var scroll = a && a === "left" ? "scrollLeft" : "scrollTop",
                has = false;
            if (el[scroll] > 0) {
                return true
            }
            el[scroll] = 1;
            has = el[scroll] > 0;
            el[scroll] = 0;
            return has
        },
        isOverAxis: function (x, reference, size) {
            return x > reference && x < reference + size
        },
        isOver: function (y, x, top, left, height, width) {
            return $.ui.isOverAxis(y, top, height) && $.ui.isOverAxis(x, left, width)
        }
    });
    return $
});
define("wf_batch_dispatcher", ["jquery", "underscore"], function ($, _) {
    "use strict";
    var batchControllerURL = "/b/batch?bpss=yes&_format=json";

    function BatchDispatcher() {
        this.requestQueue = [];
        this.sentRequestQueue = []
    }
    BatchDispatcher.prototype.registerCall = function (ajaxCall) {
        var deferred = $.Deferred();
        ajaxCall.deferred = deferred;
        this.requestQueue[ajaxCall.id] = ajaxCall;
        return deferred.promise()
    };
    BatchDispatcher.prototype.dispatchAll = function () {
        var self = this,
            requestsToSend = [],
            requestQueue = this.requestQueue;
        for (var requestId in requestQueue) {
            if (requestQueue.hasOwnProperty(requestId)) {
                requestsToSend.push(self.formatRequest(requestQueue[requestId]));
                self.sentRequestQueue[requestId] = requestQueue[requestId]
            }
        }
        this.requestQueue = [];
        return $.ajax({
            url: batchControllerURL,
            method: "POST",
            data: JSON.stringify(requestsToSend)
        }).done(function batchDispatcherDispatchAllDone(result) {
            self.handleBundleResponse(result)
        }).fail(function () {
            self.handleBundleFailure()
        })
    };
    BatchDispatcher.prototype.formatRequest = function (request) {
        var urlParts = request.url.split("/"),
            formattedRequest = {
                id: request.id,
                _controller: urlParts[2],
                _action: urlParts[3],
                _params: request.params,
                _method: request.method
            };
        return formattedRequest
    };
    BatchDispatcher.prototype.handleBundleResponse = function (result) {
        var self = this,
            requestQueue = this.sentRequestQueue;
        _.each(result, function iterateResult(result) {
            var request = requestQueue[result.id];
            self.resolveSingleCall(request, result);
            delete requestQueue[result.id]
        })
    };
    BatchDispatcher.prototype.handleBundleFailure = function () {
        var requestQueue = this.sentRequestQueue;
        for (var requestId in requestQueue) {
            if (requestQueue.hasOwnProperty(requestId)) {
                requestQueue[requestId].deferred.reject()
            }
        }
        this.sentRequestQueue = []
    };
    BatchDispatcher.prototype.resolveSingleCall = function (originalCall, response) {
        if (!originalCall) {
            return
        }
        if (response.hasOwnProperty("request_errors")) {
            originalCall.deferred.reject(response.request_errors)
        } else {
            originalCall.deferred.resolve(response.response_body)
        }
    };
    return new BatchDispatcher
});
define("wf_model_component", ["tungstenjs"], function (tungsten) {
    "use strict";
    return tungsten.hydrate.tungsten
});
define("wf_ajax", ["wayfair", "jquery", "underscore", "wf_storage"], function (wf, $, _, storage) {
    "use strict";
    var storageCache = {
        data: {},
        exists: function (key) {
            return storageCache.data.hasOwnProperty(key) && storageCache.data[key] !== null
        },
        get: function (key) {
            return storageCache.data[key]
        },
        set: function (key, result) {
            storageCache.data[key] = result
        },
        remove: function (key) {
            delete storageCache.data[key]
        }
    };
    var storageEnabled = storage.session.enabled();
    var storageSettings = {
        key: "ajaxCache",
        json: true
    };
    var wfAjax = {
        ajax: function (settings, config) {
            if (!config) {
                return $.ajax(settings)
            }
            if (config.bypassCache) {
                if (config.bustCache) {
                    bustCacheByKey(settings)
                }
                return $.ajax(settings)
            } else if (config.useBrowserStorage === false) {
                return ajaxCachedTemporary(settings, config)
            } else if (config.useBrowserStorage === true) {
                return ajaxCachedStorage(settings, config)
            } else {
                return $.ajax(settings)
            }
        },
        clearCache: function () {
            storageCache.data = {};
            storage.session.remove(storageSettings)
        }
    };
    var fn = wfAjax.ajax;
    wfAjax.ajax = function (settings, config) {
        return wf.Pace && config && config.track ? wf.Pace.track(fn, settings, config) : fn(settings, config)
    };

    function init() {
        storageCache.data = storage.session.get(storageSettings) || {}
    }

    function ajaxCachedTemporary(settings, config) {
        var deferred = new $.Deferred;
        var key = getCacheSubKey(settings);
        if (storageCache.exists(key) && !config.bustCache) {
            var result = storageCache.get(key) || [];
            deferred.resolveWith(settings.context, result)
        } else {
            $.ajax(settings).done(function (data) {
                if (data) {
                    storageCache.set(key, arguments)
                }
                deferred.resolveWith(settings.context, arguments)
            }).fail(function () {
                deferred.rejectWith(settings.context, arguments)
            })
        }
        return deferred.promise()
    }

    function ajaxCachedStorage(settings, config) {
        var promise = ajaxCachedTemporary(settings, config);
        var subKey = getCacheSubKey(settings);
        if (storageEnabled) {
            promise.done(function (data) {
                if (data) {
                    var settings = _.extend({
                        subKey: subKey,
                        value: Array.prototype.slice.call(arguments, 0)
                    }, storageSettings);
                    if (!storage.session.get(settings)) {
                        storage.session.set(settings)
                    }
                }
            })
        }
        return promise
    }

    function getCacheSubKey(settings) {
        return settings.url + JSON.stringify(settings.data)
    }

    function bustCacheByKey(settings) {
        var subKey = getCacheSubKey(settings);
        settings = _.extend({
            subKey: subKey
        }, storageSettings);
        storage.session.remove(settings);
        storageCache.remove(subKey)
    }
    if (storageEnabled) {
        init()
    }
    return wfAjax
});
define("favorites_list_collection", ["wf_collection_base", "favorites_list_model"], function (BaseCollection, ListModel) {
    "use strict";
    var FavoritesListCollection = BaseCollection.extend({
        model: ListModel,
        itemCount: function () {
            return this.reduce(function (total, list) {
                return total + list.get("items").length
            }, 0)
        }
    });
    return FavoritesListCollection
});
define("favorites_list_model", ["wf_model_base", "favorites_item_collection", "favorites_item_model", "favorites_event_bus", "wf_ajax", "jquery", "wayfair", "tracking", "favorites_configure_product", "sitespect"], function (BaseModel, ItemCollection, ItemModel, EventBus, wfAjax, $, wf, Tracker, configureFavoritedProduct, SiteSpect) {
    "use strict";
    var FavoriteListModel = BaseModel.extend({
        defaults: {
            id: 0,
            name: "",
            b_private: !SiteSpect.sitespectCookieContains("4995961v1", true),
            type: 1,
            url: "",
            b_default: false,
            items: [],
            collection_id: ""
        },
        idAttribute: "collection_id",
        relations: {
            items: ItemCollection
        },
        postInitialize: function () {
            if (this.get("id")) {
                this.set("collection_id", this.get("id"))
            } else {
                FavoriteListModel.newCounter = FavoriteListModel.newCounter || 0;
                FavoriteListModel.newCounter++;
                this.set("collection_id", "new_" + FavoriteListModel.newCounter)
            }
        },
        loadFrictionlessList: function () {
            var self = this,
                promise = $.Deferred(),
                src = wf.constants.STORE_URL + "/a/favorites/list/get_frictionless_list";
            wfAjax.ajax({
                type: "GET",
                url: src,
                dataType: "json"
            }).done(function (response) {
                if (response && response.success) {
                    self.set("id", response.board.id);
                    self.set("name", response.board.name);
                    self.set("url", response.board.url);
                    self.set("items", response.board.items);
                    self.success = response.success;
                    promise.resolve(self)
                } else {
                    promise.resolve(response)
                }
            }).fail(promise.reject);
            return promise.promise()
        },
        addItem: function (item) {
            var self = this,
                promise = $.Deferred(),
                src = "";
            var formData = self.getFormData(item);
            if (item.get("fullyConfigured")) {
                src = wf.constants.STORE_URL + "/a/checkout/basket/add_to_ideaboard"
            } else {
                src = wf.constants.STORE_URL + "/a/favorites/list/add_item"
            }
            formData.push({
                name: "objectKey",
                value: item.get("object_key")
            }, {
                name: "type",
                value: item.get("type")
            }, {
                name: "listID",
                value: this.get("id")
            }, {
                name: "comment",
                value: item.get("comment")
            }, {
                name: "image_resource_id",
                value: item.get("image_resource_id")
            });
            wfAjax.ajax({
                type: "POST",
                url: src,
                dataType: "json",
                data: formData
            }).done(function (response) {
                if (response && response.success) {
                    Tracker.firePixelsFromTrackingAction("AddToIdeaBoardAction");
                    if (parseInt(self.get("type"), 10) === FavoriteListModel.TYPE_REGISTRY_LIST) {
                        promise.resolve(response.item, response.related_skus)
                    } else {
                        promise.resolve(self.addItemJSON(response))
                    }
                } else {
                    promise.reject(response)
                }
            }).fail(promise.reject);
            return promise.promise()
        },
        addItemJSON: function (response, isDefault) {
            var item = new ItemModel(response.item);
            Tracker.recordEvent("FAV3", {
                favBoardId: this.get("id"),
                favKey: item.get("object_key"),
                favKeyType: item.get("type"),
                favProductType: response.tracking_product_type,
                favisdefault: !!isDefault,
                favsku: item.getSku()
            });
            if (item.get("type") === ItemModel.TYPE_COLOR_SWATCH) {
                Tracker.recordEvent("FAV_SwatchAdded")
            } else {
                SiteSpect.trackEvent("FAV_AddItem")
            }
            this.get("items").add(item, {
                at: 0
            });
            EventBus.trigger(EventBus.AJAX_ADD_ITEM, {
                item: response.item
            }, this.get("id"));
            return item
        },
        create: function (item) {
            var self = this,
                promise = $.Deferred(),
                formData = [],
                src = "";
            formData = self.getFormData(item);
            if (item.get("fullyConfigured")) {
                src = wf.constants.STORE_URL + "/a/checkout/basket/add_to_ideaboard"
            } else {
                src = wf.constants.STORE_URL + "/a/favorites/list/create_list"
            }
            formData.push({
                name: "name",
                value: this.get("name")
            }, {
                name: "description",
                value: this.get("description")
            }, {
                name: "is_private",
                value: this.get("b_private")
            }, {
                name: "object_key",
                value: item ? item.get("object_key") : null
            }, {
                name: "type",
                value: item.get("fullyConfigured") ? 2 : 1
            }, {
                name: "comment",
                value: item ? item.get("comment") : null
            });
            wfAjax.ajax({
                type: "POST",
                url: src,
                dataType: "json",
                data: formData
            }).done(function (response) {
                if (response && response.success) {
                    if (response.item && response.item.object_key) {
                        if (response.item.object_key !== item.get("object_key")) {
                            item.set("object_key", response.item.object_key)
                        }
                    }
                    Tracker.firePixelsFromTrackingAction("AddToIdeaBoardAction");
                    promise.resolve(self.createJSON(response, item))
                } else {
                    promise.reject(response)
                }
            }).fail(promise.reject);
            return promise.promise()
        },
        createJSON: function (response, item, isDefault) {
            this.set(response.board);
            this.set("collection_id", this.get("id"));
            if (item) {
                Tracker.recordEvent("FAV5", {
                    favBoardId: this.get("id"),
                    favKey: item.get("object_key"),
                    favKeyType: item.get("type"),
                    favProductType: response.tracking_product_type,
                    favisdefault: !!isDefault,
                    favsku: item.getSku()
                });
                if (item.get("type") === ItemModel.TYPE_COLOR_SWATCH) {
                    Tracker.recordEvent("FAV_SwatchAdded_NewList");
                    SiteSpect.trackEvent("FAV_SwatchAdded_NewList")
                } else {
                    SiteSpect.trackEvent("FAV_AddItem_NewList")
                }
            } else {
                Tracker.recordEvent("create_new_board", {
                    favBoardId: this.get("id")
                })
            }
            EventBus.trigger(EventBus.AJAX_CREATE_LIST, {
                board: response.board
            });
            return this
        },
        removeItem: function (item) {
            var items = new ItemCollection;
            items.add(item);
            var promise = $.Deferred();
            if (item.get("id")) {
                this.removeItems(items).done(function (itemsRemoved) {
                    promise.resolve(itemsRemoved.at(0))
                }).fail(promise.reject)
            } else {
                promise.reject("Item must have id to be removed")
            }
            return promise.promise()
        },
        removeItems: function (items) {
            var self = this,
                promise = $.Deferred(),
                itemIds = items.pluck("id");
            wfAjax.ajax({
                type: "POST",
                url: wf.constants.STORE_URL + "/a/favorites/list/delete_items",
                dataType: "json",
                data: {
                    item_id: itemIds,
                    list_id: this.get("id"),
                    owner_customer_id: this.get("customer_id")
                }
            }).done(function (response) {
                if (response && response.success) {
                    var items = self.get("items"),
                        itemsRemoved = new ItemCollection;
                    for (var i = 0; i < response.items.length; i++) {
                        Tracker.recordEvent("FAV6", {
                            favBoardId: self.get("id")
                        });
                        SiteSpect.trackEvent("FAV_RemoveItem");
                        var item = new ItemModel(response.items[i]),
                            itemRemoved = items.remove(item);
                        itemsRemoved.add(itemRemoved)
                    }
                    EventBus.trigger(EventBus.AJAX_REMOVE_ITEMS, response, self.get("id"));
                    promise.resolve(itemsRemoved)
                } else {
                    promise.reject(response)
                }
            }).fail(promise.reject);
            return promise.promise()
        },
        getFormData: function (item) {
            var formData = [];
            if (item.get("fullyConfigured")) {
                var form;
                if (wf.appData.pageAlias === "ProductPage") {
                    form = $("#AddToCartForm")
                } else if (wf.appData.pageAlias === "DailyfairPDP") {
                    form = $("#atc")
                } else {
                    form = $("#PopupAddToCartForm")
                }
                if (form && form.length > 0) {
                    formData.push({
                        name: "type",
                        value: ItemModel.TYPE_CONFIGURED_PRODUCT
                    });
                    $.each(form.serializeArray(), function (index, element) {
                        if (element.name === "PiID") {
                            formData.push({
                                name: "PiID[]",
                                value: element.value
                            })
                        } else if (element.name.substr(0, 4) === "PiID") {
                            if (Number(element.value)) {
                                formData.push(element)
                            }
                        } else {
                            formData.push(element)
                        }
                    });
                    return formData
                }
            }
            if (parseInt(item.get("type"), 10) === ItemModel.TYPE_CONFIGURED_PRODUCT) {
                item.set("fullyConfigured", false);
                item.set("object_key", item.getSku());
                item.set("type", ItemModel.TYPE_PRODUCT)
            }
            var itemOptions = item.get("option_ids").split(",");
            if (itemOptions && itemOptions.length) {
                for (var i = 0; i < itemOptions.length; i++) {
                    formData.push({
                        name: "PiID[]",
                        value: itemOptions[i]
                    })
                }
            }
            formData.push({
                name: "sku",
                value: item.getSku()
            }, {
                name: "owner_customer_id",
                value: this.get("owner_customer_id")
            });
            return formData
        }
    }, {
        TYPE_GENERAL_LIST: 1,
        TYPE_SAVED_FROM_CART_LIST: 2,
        TYPE_REGISTRY_LIST: 3
    });
    return FavoriteListModel
});
define("favorites_comment_model", ["wayfair", "wf_mobile_model_base"], function (wf, BaseModel) {
    "use strict";
    var FavoritesCommentModel = BaseModel.extend({
        defaults: {
            comment_removed: false
        },
        removeComment: function () {
            var self = this;
            var message = this.get("message");
            this.set("original_timestamp", this.get("relative_timestamp"));
            this.url = wf.constants.STORE_URL + "/a/favorites/item/delete_comment";
            return this.save().done(function () {
                self.set("message", message);
                self.set("comment_removed", true);
                self.trigger("comment_removed")
            })
        },
        undoRemoveComment: function () {
            var self = this;
            this.url = wf.constants.STORE_URL + "/a/favorites/item/undo_delete_comment";
            return this.save().done(function () {
                self.set("relative_timestamp", self.get("original_timestamp"));
                self.set("comment_removed", false);
                self.trigger("comment_added")
            })
        },
        updateOldCommentSystem: function (action) {
            this.url = wf.constants.STORE_URL + "/a/favorites/item/" + action;
            return this.save()
        }
    }, {
        debugName: "FavoritesCommentModel"
    });
    return FavoritesCommentModel
});
define("wf_toast_popup_view", ["wf_popup_view", "wf_toast_popup_model"], function (PopupView, ToastPopupModel) {
    "use strict";
    var toast;
    var ToastPopupView = PopupView.extend({
        defaultModel: ToastPopupModel,
        events: {
            click: "clicked",
            mouseenter: "hovered",
            mouseleave: "unhovered"
        },
        postInitialize: function () {
            PopupView.prototype.postInitialize.call(this);
            this.setTimer()
        },
        clicked: function (e) {
            var url = this.model.get("url");
            if (url) {
                e.preventDefault();
                window.location.href = url
            } else {
                this.close()
            }
        },
        hovered: function () {
            clearTimeout(toast)
        },
        unhovered: function () {
            this.setTimer()
        },
        setTimer: function () {
            var self = this;
            toast = setTimeout(function () {
                self.close()
            }, this.model.get("duration"))
        },
        _position: function (winSize) {
            this.$el.css({
                bottom: "5px",
                left: (winSize.width - this.$el.width()) / 2
            })
        }
    });
    return ToastPopupView
});
define("@Templates/stores/registry/wed_registry_toast_view", ["underscore", "tungstenjs", "_t!%5B%22ViewInRegistry%22%2C%22View%20in%20Registry%22%5D"], function (_, tungstenjs) {
    var Template = tungstenjs._template,
        template = new Template(["\n\n", {
            t: 7,
            e: "div",
            a: {
                "class": "WedRegistryToast"
            },
            f: ["\n  ", {
                t: 4,
                r: "success",
                f: ["\n    ", {
                    t: 7,
                    e: "a",
                    a: {
                        href: ["", {
                            t: 2,
                            r: "registryUrl"
                        }, ""],
                        "class": "WedRegistryToast-action"
                    },
                    f: ["\n      ", {
                        t: 7,
                        e: "p",
                        a: {
                            "class": "WedRegistryToast-message WedRegistryToast-message--success"
                        },
                        f: ["\n        ", {
                            t: 3,
                            r: "lnrsMessage"
                        }, " ", {
                            t: 7,
                            e: "span",
                            a: {
                                "class": "WedRegistryToast-action-text"
                            },
                            f: [{
                                t: 4,
                                r: "_t",
                                f: ['{"key": "ViewInRegistry", "default": "View in Registry"}']
                            }]
                        }, "\n      "]
                    }, "\n    "]
                }, "\n  "]
            }, "\n  ", {
                t: 4,
                r: "success",
                f: ["\n    ", {
                    t: 7,
                    e: "p",
                    a: {
                        "class": "WedRegistryToast-message WedRegistryToast-message--failure"
                    },
                    f: ["\n      ", {
                        t: 3,
                        r: "lnrsMessage"
                    }, "\n    "]
                }, "\n  "],
                n: 51
            }, "\n"]
        }]);
    template.register("stores/registry/wed_registry_toast");
    var output = function (data) {
        return template.toString(data, !0)
    };
    return output.toDom = _.bind(template.toDom, template), output.toVdom = _.bind(template.toVdom, template), output.attachView = _.bind(template.attachView, template), output.wrap = _.bind(template.wrap, template), output
});
define("@Templates/stores/product/quickview/partials/_review_block", ["underscore", "tungstenjs"], function (_, tungstenjs) {
    var Template = tungstenjs._template,
        template = new Template(["\n\n", {
            t: 4,
            r: "has_ratings",
            f: ["\n  ", {
                t: 4,
                r: "allow_browse",
                f: ["\n    ", {
                    t: 7,
                    e: "a",
                    a: {
                        "class": "review_stars_wrap cleanlink_disabled",
                        href: ["", {
                            t: 2,
                            r: "product_url"
                        }, "#js-product-reviews"]
                    },
                    f: ["\n        ", {
                        t: 3,
                        r: "empty_review_stars_html"
                    }, "\n    "]
                }, "\n  "]
            }, "\n  ", {
                t: 4,
                r: "allow_browse",
                f: ["\n    ", {
                    t: 3,
                    r: "empty_review_stars_html"
                }, "\n  "],
                n: 51
            }, "\n\n    ", {
                t: 7,
                e: "div",
                a: {
                    "class": "qv_header_link_wrap"
                },
                f: ["\n      ", {
                    t: 4,
                    r: "allow_browse",
                    f: ["\n        ", {
                        t: 7,
                        e: "a",
                        a: {
                            "class": "js-ss-click js-track-event wflink",
                            "data-click-track": "pdp_write_a_review",
                            "data-group-name": "QVM",
                            "data-event-name": "write_a_review",
                            "data-click-location": "write_a_review",
                            title: ["", {
                                t: 3,
                                r: "lnrs_write_a_review"
                            }, ""],
                            href: ["", {
                                t: 2,
                                r: "product_url"
                            }, ""]
                        },
                        f: ["\n            ", {
                            t: 3,
                            r: "lnrs_write_a_review"
                        }, "\n        "]
                    }, "\n      "]
                }, "\n      ", {
                    t: 4,
                    r: "allow_browse",
                    f: ["\n        ", {
                        t: 3,
                        r: "lnrs_write_a_review"
                    }, "\n      "],
                    n: 51
                }, "\n      ", {
                    t: 4,
                    r: "allow_browse",
                    f: ["\n        ", {
                        t: 7,
                        e: "span",
                        f: [{
                            t: 1,
                            r: " ",
                            n: "&nbsp;"
                        }, "|", {
                            t: 1,
                            r: " ",
                            n: "&nbsp;"
                        }]
                    }, "\n        ", {
                        t: 7,
                        e: "a",
                        a: {
                            href: "#",
                            "class": "inlineblock margin_sm_top js-top_qa_link js-ss-click",
                            "data-tab-target": "js-productqa-body",
                            "data-click-track": "TopQAClicked"
                        },
                        f: ["\n            ", {
                            t: 4,
                            r: "faq_count",
                            f: ["\n                ", {
                                t: 2,
                                r: "faq_count"
                            }, {
                                t: 1,
                                r: " ",
                                n: "&nbsp;"
                            }, "\n            "]
                        }, "\n            ", {
                            t: 3,
                            r: "lnrs_qampa"
                        }, "\n        "]
                    }, "\n      "]
                }, "\n    "]
            }, "\n\n"],
            n: 51
        }, "\n\n", {
            t: 4,
            r: "has_ratings",
            f: ["\n  ", {
                t: 4,
                r: "allow_browse",
                f: ["\n    ", {
                    t: 7,
                    e: "a",
                    a: {
                        "class": "review_stars_wrap cleanlink_disabled",
                        href: ["", {
                            t: 2,
                            r: "product_url"
                        }, "#js-product-reviews"]
                    },
                    f: ["\n        ", {
                        t: 3,
                        r: "review_stars_html"
                    }, "\n        ", {
                        t: 7,
                        e: "span",
                        a: {
                            "class": "indented ltbodytext"
                        },
                        f: ["(", {
                            t: 2,
                            r: "rating"
                        }, ")"]
                    }, "\n    "]
                }, "\n  "]
            }, "\n  ", {
                t: 4,
                r: "allow_browse",
                f: ["\n    ", {
                    t: 3,
                    r: "review_stars_html"
                }, "\n  "],
                n: 51
            }, "\n\n    ", {
                t: 7,
                e: "div",
                a: {
                    "class": "qv_header_link_wrap"
                },
                f: ["\n      ", {
                    t: 4,
                    r: "allow_browse",
                    f: ["\n        ", {
                        t: 7,
                        e: "a",
                        a: {
                            "class": "cleanlink_disabled",
                            href: ["", {
                                t: 2,
                                r: "product_url"
                            }, "#js-product-reviews"]
                        },
                        f: ["\n           ", {
                            t: 7,
                            e: "span",
                            a: {
                                "class": "ratingcount js-track-event wflink"
                            },
                            f: [{
                                t: 2,
                                r: "rating_count"
                            }, {
                                t: 1,
                                r: " ",
                                n: "&nbsp;"
                            }, {
                                t: 3,
                                r: "lnrs_reviews"
                            }]
                        }, "\n        "]
                    }, "\n      "]
                }, "\n      ", {
                    t: 4,
                    r: "allow_browse",
                    f: ["\n        ", {
                        t: 7,
                        e: "span",
                        a: {
                            "class": "ratingcount"
                        },
                        f: [{
                            t: 2,
                            r: "rating_count"
                        }, {
                            t: 1,
                            r: " ",
                            n: "&nbsp;"
                        }, {
                            t: 3,
                            r: "lnrs_reviews"
                        }]
                    }, "\n      "],
                    n: 51
                }, "\n      ", {
                    t: 4,
                    r: "allow_browse",
                    f: ["\n        ", {
                        t: 7,
                        e: "span",
                        f: [{
                            t: 1,
                            r: " ",
                            n: "&nbsp;"
                        }, "|", {
                            t: 1,
                            r: " ",
                            n: "&nbsp;"
                        }]
                    }, "\n        ", {
                        t: 7,
                        e: "a",
                        a: {
                            href: ["", {
                                t: 2,
                                r: "product_url"
                            }, "#questions"],
                            "class": "inlineblock margin_sm_top js-top_qa_link js-ss-click",
                            "data-tab-target": "js-productqa-body",
                            "data-click-track": "TopQAClicked"
                        },
                        f: ["\n            ", {
                            t: 4,
                            r: "faq_count",
                            f: ["\n                ", {
                                t: 2,
                                r: "faq_count"
                            }, "\n            "]
                        }, "\n            ", {
                            t: 3,
                            r: "lnrs_qampa"
                        }, "\n        "]
                    }, "\n      "]
                }, "\n    "]
            }, "\n"]
        }, "\n"]);
    template.register("stores/product/quickview/partials/_review_block");
    var output = function (data) {
        return template.toString(data, !0)
    };
    return output.toDom = _.bind(template.toDom, template), output.toVdom = _.bind(template.toVdom, template), output.attachView = _.bind(template.attachView, template), output.wrap = _.bind(template.wrap, template), output
});
define("@Templates/stores/product/quickview/partials/_dimensions_array", ["underscore", "tungstenjs"], function (_, tungstenjs) {
    var Template = tungstenjs._template,
        template = new Template(["\n\n\n", {
            t: 7,
            e: "ul",
            f: ["\n  ", {
                t: 4,
                r: "tags",
                f: ["\n    ", {
                    t: 7,
                    e: "li",
                    f: ["\n      ", {
                        t: 2,
                        r: "detail_tag_title"
                    }, " : ", {
                        t: 2,
                        r: "custom_name_string"
                    }, {
                        t: 2,
                        r: "detail_tag_value"
                    }, {
                        t: 2,
                        r: "unit_string"
                    }, "\n    "]
                }, "\n  "]
            }, "\n"]
        }]);
    template.register("stores/product/quickview/partials/_dimensions_array");
    var output = function (data) {
        return template.toString(data, !0)
    };
    return output.toDom = _.bind(template.toDom, template), output.toVdom = _.bind(template.toVdom, template), output.attachView = _.bind(template.attachView, template), output.wrap = _.bind(template.wrap, template), output
});
define("@Templates/stores/product/quickview/partials/_add_to_cart_button", ["underscore", "tungstenjs"], function (_, tungstenjs) {
    var Template = tungstenjs._template,
        template = new Template(["\n", {
            t: 7,
            e: "div",
            a: {
                "class": "qv_atc_block  yui3-scrolling-box favorites_save_modal_fk"
            },
            f: ["\n    ", {
                t: 3,
                r: "atc_button_view_html"
            }, "\n"]
        }]);
    template.register("stores/product/quickview/partials/_add_to_cart_button");
    var output = function (data) {
        return template.toString(data, !0)
    };
    return output.toDom = _.bind(template.toDom, template), output.toVdom = _.bind(template.toVdom, template), output.attachView = _.bind(template.attachView, template), output.wrap = _.bind(template.wrap, template), output
});
define("wf_view_registry_dropdown_item", ["jquery", "underscore", "wf_tungsten_view_base", "registry_event_bus"], function ($, _, View, regEventBus) {
    "use strict";
    var DropDownItemView = View.extend({
        events: {
            "click .js-registry-add-to-list": "handleRegistryAddToListClick"
        },
        handleRegistryAddToListClick: function (e) {
            e.preventDefault();
            regEventBus.trigger(regEventBus.PDP_ADD_TO_REGISTRY_LIST, this.model)
        }
    }, {
        debugName: "RegistryDropdownItemView"
    });
    return DropDownItemView
});
define("_t!%5B%22ViewInRegistry%22%2C%22View%20in%20Registry%22%5D", ['wayfair'], function (wf) {
    var k = "ViewInRegistry";
    wf.translations = wf.translations || {};
    wf.translations[k] = "View in Registry";
    return wf.translations[k]
});
define("_t!%5B%22AddingProduct%22%2C%22Adding%20Product...%22%5D", ['wayfair'], function (wf) {
    var k = "AddingProduct";
    wf.translations = wf.translations || {};
    wf.translations[k] = "Adding Product";
    return wf.translations[k]
});
define("_t!%5B%22AddToRegistry%22%2C%22Add%20to%20Registry%22%5D", ['wayfair'], function (wf) {
    var k = "AddToRegistry";
    wf.translations = wf.translations || {};
    wf.translations[k] = "Add to Registry";
    return wf.translations[k]
});
define("_t!%5B%22AddToRegistryMenuToggle%22%2C%22Select%20registry%20board%22%5D", ['wayfair'], function (wf) {
    var k = "AddToRegistryMenuToggle";
    wf.translations = wf.translations || {};
    wf.translations[k] = "Select registry board";
    return wf.translations[k]
});
define("wf_tooltip_view", ["jquery", "underscore", "wf_popup_view", "wf_tooltip_model", "@Templates/common/modals/basic_tooltip_view"], function ($, _, PopupView, TooltipModel, basicTooltipView) {
    "use strict";
    var TooltipView = PopupView.extend({
        template: basicTooltipView,
        defaultModel: TooltipModel,
        _setup: function () {
            if (this.model.has("target")) {
                if (!this.$targetElem) {
                    var target = this.model.get("target");
                    this.$targetElem = target.jquery ? target : $(target);
                    var my = this.model.get("my");
                    var at = this.model.get("at");
                    this.my = my.split(" ");
                    this.at = at.split(" ");
                    this._position = this._targetedPosition
                }
            }
            var arrowDirection = this.model.get("arrowDirection");
            if (arrowDirection && _.contains(TooltipView.VALID_DIRECTIONS, arrowDirection)) {
                this.model.set("modalClass", this.model.get("modalClass") + " Tooltip--" + arrowDirection)
            }
        },
        _targetedPosition: function () {
            var position = this.model.get("relativePosition") ? {
                top: 0,
                left: 0
            } : this.$targetElem.offset();
            var dimension;
            if (this.at[0] !== "left") {
                dimension = this.$targetElem.outerWidth();
                if (this.at[0] === "right") {
                    position.left += dimension
                } else if (this.at[0] === "center") {
                    position.left += dimension / 2
                }
            }
            if (this.at[1] !== "top") {
                dimension = this.$targetElem.outerHeight();
                if (this.at[1] === "bottom") {
                    position.top += dimension
                } else if (this.at[1] === "center") {
                    position.top += dimension / 2
                }
            }
            if (this.my[0] !== "left") {
                dimension = this.$el.outerWidth();
                if (this.my[0] === "right") {
                    position.left -= dimension
                } else if (this.my[0] === "center") {
                    position.left -= dimension / 2
                }
            }
            if (this.my[1] !== "left") {
                dimension = this.$el.outerHeight();
                if (this.my[1] === "bottom") {
                    position.top -= dimension
                } else if (this.my[1] === "center") {
                    position.top -= dimension / 2
                }
            }
            this.$el.css(position)
        },
        _position: function () {
            if (this.model && this.model.has("position")) {
                this.$el.css(this.model.get("position"))
            }
        },
        _getTarget: function () {
            if (this.model && this.model.get("relativePosition")) {
                return this.model.get("target")
            } else {
                return PopupView.prototype._getTarget.apply(this)
            }
        }
    }, {
        ARROW_TOP: "top",
        ARROW_BOTTOM: "bottom",
        ARROW_LEFT: "left",
        ARROW_RIGHT: "right",
        VALID_DIRECTIONS: ["top", "bottom", "left", "right"]
    });
    return TooltipView
});
define("wf_tooltip_model", ["wf_popup_model", "underscore"], function (PopupModel, _) {
    "use strict";
    var TooltipModel = PopupModel.extend({
        defaults: _.defaults({
            target: null,
            at: "center center",
            my: "center center",
            relativePosition: false,
            position: null,
            arrowDirection: null,
            modalClass: "Tooltip--base",
            transitionClass: ""
        }, PopupModel.prototype.defaults)
    });
    return TooltipModel
});
define("@Templates/common/modals/blank_modal_view", ["underscore", "tungstenjs"], function (_, tungstenjs) {
    var Template = tungstenjs._template,
        template = new Template(["\n", {
            t: 7,
            e: "div",
            a: {
                "class": "modal_wrapper_unstyled"
            },
            f: ["\n  ", {
                t: 3,
                r: "content"
            }, "\n"]
        }, "\n"]);
    template.register("common/modals/blank_modal");
    var output = function (data) {
        return template.toString(data, !0)
    };
    return output.toDom = _.bind(template.toDom, template), output.toVdom = _.bind(template.toVdom, template), output.attachView = _.bind(template.attachView, template), output.wrap = _.bind(template.wrap, template), output
});
define("handlebars", [], function () {
    "use strict";
    var Handlebars = {};
    (function (Handlebars, undefined) {
        Handlebars.VERSION = "1.0.0";
        Handlebars.COMPILER_REVISION = 4;
        Handlebars.REVISION_CHANGES = {
            1: "<= 1.0.rc.2",
            2: "== 1.0.0-rc.3",
            3: "== 1.0.0-rc.4",
            4: ">= 1.0.0"
        };
        Handlebars.helpers = {};
        Handlebars.partials = {};
        var toString = Object.prototype.toString,
            functionType = "[object Function]",
            objectType = "[object Object]";
        Handlebars.registerHelper = function (name, fn, inverse) {
            if (toString.call(name) === objectType) {
                if (inverse || fn) {
                    throw new Handlebars.Exception("Arg not supported with multiple helpers")
                }
                Handlebars.Utils.extend(this.helpers, name)
            } else {
                if (inverse) {
                    fn.not = inverse
                }
                this.helpers[name] = fn
            }
        };
        Handlebars.registerPartial = function (name, str) {
            if (toString.call(name) === objectType) {
                Handlebars.Utils.extend(this.partials, name)
            } else {
                this.partials[name] = str
            }
        };
        Handlebars.registerHelper("helperMissing", function (arg) {
            if (arguments.length === 2) {
                return undefined
            } else {
                throw new Error("Missing helper: '" + arg + "'")
            }
        });
        Handlebars.registerHelper("blockHelperMissing", function (context, options) {
            var inverse = options.inverse || function () {},
                fn = options.fn;
            var type = toString.call(context);
            if (type === functionType) {
                context = context.call(this)
            }
            if (context === true) {
                return fn(this)
            } else if (context === false || context == null) {
                return inverse(this)
            } else if (type === "[object Array]") {
                if (context.length > 0) {
                    return Handlebars.helpers.each(context, options)
                } else {
                    return inverse(this)
                }
            } else {
                return fn(context)
            }
        });
        Handlebars.K = function () {};
        Handlebars.createFrame = Object.create || function (object) {
            Handlebars.K.prototype = object;
            var obj = new Handlebars.K;
            Handlebars.K.prototype = null;
            return obj
        };
        Handlebars.logger = {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3,
            level: 3,
            methodMap: {
                0: "debug",
                1: "info",
                2: "warn",
                3: "error"
            },
            log: function (level, obj) {
                if (Handlebars.logger.level <= level) {
                    var method = Handlebars.logger.methodMap[level];
                    if (typeof console !== "undefined" && console[method]) {
                        console[method].call(console, obj)
                    }
                }
            }
        };
        Handlebars.log = function (level, obj) {
            Handlebars.logger.log(level, obj)
        };
        Handlebars.registerHelper("each", function (context, options) {
            var fn = options.fn,
                inverse = options.inverse;
            var i = 0,
                ret = "",
                data;
            var type = toString.call(context);
            if (type === functionType) {
                context = context.call(this)
            }
            if (options.data) {
                data = Handlebars.createFrame(options.data)
            }
            if (context && typeof context === "object") {
                if (context instanceof Array) {
                    for (var j = context.length; i < j; i++) {
                        if (data) {
                            data.index = i
                        }
                        ret = ret + fn(context[i], {
                            data: data
                        })
                    }
                } else {
                    for (var key in context) {
                        if (context.hasOwnProperty(key)) {
                            if (data) {
                                data.key = key
                            }
                            ret = ret + fn(context[key], {
                                data: data
                            });
                            i++
                        }
                    }
                }
            }
            if (i === 0) {
                ret = inverse(this)
            }
            return ret
        });
        Handlebars.registerHelper("if", function (conditional, options) {
            var type = toString.call(conditional);
            if (type === functionType) {
                conditional = conditional.call(this)
            }
            if (!conditional || Handlebars.Utils.isEmpty(conditional)) {
                return options.inverse(this)
            } else {
                return options.fn(this)
            }
        });
        Handlebars.registerHelper("unless", function (conditional, options) {
            return Handlebars.helpers["if"].call(this, conditional, {
                fn: options.inverse,
                inverse: options.fn
            })
        });
        Handlebars.registerHelper("with", function (context, options) {
            var type = toString.call(context);
            if (type === functionType) {
                context = context.call(this)
            }
            if (!Handlebars.Utils.isEmpty(context)) return options.fn(context)
        });
        Handlebars.registerHelper("log", function (context, options) {
            var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
            Handlebars.log(level, context)
        });
        var handlebars = function () {
            var parser = {
                trace: function trace() {},
                yy: {},
                symbols_: {
                    error: 2,
                    root: 3,
                    program: 4,
                    EOF: 5,
                    simpleInverse: 6,
                    statements: 7,
                    statement: 8,
                    openInverse: 9,
                    closeBlock: 10,
                    openBlock: 11,
                    mustache: 12,
                    partial: 13,
                    CONTENT: 14,
                    COMMENT: 15,
                    OPEN_BLOCK: 16,
                    inMustache: 17,
                    CLOSE: 18,
                    OPEN_INVERSE: 19,
                    OPEN_ENDBLOCK: 20,
                    path: 21,
                    OPEN: 22,
                    OPEN_UNESCAPED: 23,
                    CLOSE_UNESCAPED: 24,
                    OPEN_PARTIAL: 25,
                    partialName: 26,
                    params: 27,
                    hash: 28,
                    dataName: 29,
                    param: 30,
                    STRING: 31,
                    INTEGER: 32,
                    BOOLEAN: 33,
                    hashSegments: 34,
                    hashSegment: 35,
                    ID: 36,
                    EQUALS: 37,
                    DATA: 38,
                    pathSegments: 39,
                    SEP: 40,
                    $accept: 0,
                    $end: 1
                },
                terminals_: {
                    2: "error",
                    5: "EOF",
                    14: "CONTENT",
                    15: "COMMENT",
                    16: "OPEN_BLOCK",
                    18: "CLOSE",
                    19: "OPEN_INVERSE",
                    20: "OPEN_ENDBLOCK",
                    22: "OPEN",
                    23: "OPEN_UNESCAPED",
                    24: "CLOSE_UNESCAPED",
                    25: "OPEN_PARTIAL",
                    31: "STRING",
                    32: "INTEGER",
                    33: "BOOLEAN",
                    36: "ID",
                    37: "EQUALS",
                    38: "DATA",
                    40: "SEP"
                },
                productions_: [0, [3, 2],
                    [4, 2],
                    [4, 3],
                    [4, 2],
                    [4, 1],
                    [4, 1],
                    [4, 0],
                    [7, 1],
                    [7, 2],
                    [8, 3],
                    [8, 3],
                    [8, 1],
                    [8, 1],
                    [8, 1],
                    [8, 1],
                    [11, 3],
                    [9, 3],
                    [10, 3],
                    [12, 3],
                    [12, 3],
                    [13, 3],
                    [13, 4],
                    [6, 2],
                    [17, 3],
                    [17, 2],
                    [17, 2],
                    [17, 1],
                    [17, 1],
                    [27, 2],
                    [27, 1],
                    [30, 1],
                    [30, 1],
                    [30, 1],
                    [30, 1],
                    [30, 1],
                    [28, 1],
                    [34, 2],
                    [34, 1],
                    [35, 3],
                    [35, 3],
                    [35, 3],
                    [35, 3],
                    [35, 3],
                    [26, 1],
                    [26, 1],
                    [26, 1],
                    [29, 2],
                    [21, 1],
                    [39, 3],
                    [39, 1]
                ],
                performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
                    var $0 = $$.length - 1;
                    switch (yystate) {
                    case 1:
                        return $$[$0 - 1];
                        break;
                    case 2:
                        this.$ = new yy.ProgramNode([], $$[$0]);
                        break;
                    case 3:
                        this.$ = new yy.ProgramNode($$[$0 - 2], $$[$0]);
                        break;
                    case 4:
                        this.$ = new yy.ProgramNode($$[$0 - 1], []);
                        break;
                    case 5:
                        this.$ = new yy.ProgramNode($$[$0]);
                        break;
                    case 6:
                        this.$ = new yy.ProgramNode([], []);
                        break;
                    case 7:
                        this.$ = new yy.ProgramNode([]);
                        break;
                    case 8:
                        this.$ = [$$[$0]];
                        break;
                    case 9:
                        $$[$0 - 1].push($$[$0]);
                        this.$ = $$[$0 - 1];
                        break;
                    case 10:
                        this.$ = new yy.BlockNode($$[$0 - 2], $$[$0 - 1].inverse, $$[$0 - 1], $$[$0]);
                        break;
                    case 11:
                        this.$ = new yy.BlockNode($$[$0 - 2], $$[$0 - 1], $$[$0 - 1].inverse, $$[$0]);
                        break;
                    case 12:
                        this.$ = $$[$0];
                        break;
                    case 13:
                        this.$ = $$[$0];
                        break;
                    case 14:
                        this.$ = new yy.ContentNode($$[$0]);
                        break;
                    case 15:
                        this.$ = new yy.CommentNode($$[$0]);
                        break;
                    case 16:
                        this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1]);
                        break;
                    case 17:
                        this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1]);
                        break;
                    case 18:
                        this.$ = $$[$0 - 1];
                        break;
                    case 19:
                        this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1], $$[$0 - 2][2] === "&");
                        break;
                    case 20:
                        this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1], true);
                        break;
                    case 21:
                        this.$ = new yy.PartialNode($$[$0 - 1]);
                        break;
                    case 22:
                        this.$ = new yy.PartialNode($$[$0 - 2], $$[$0 - 1]);
                        break;
                    case 23:
                        break;
                    case 24:
                        this.$ = [
                            [$$[$0 - 2]].concat($$[$0 - 1]), $$[$0]
                        ];
                        break;
                    case 25:
                        this.$ = [
                            [$$[$0 - 1]].concat($$[$0]), null
                        ];
                        break;
                    case 26:
                        this.$ = [
                            [$$[$0 - 1]], $$[$0]
                        ];
                        break;
                    case 27:
                        this.$ = [
                            [$$[$0]], null
                        ];
                        break;
                    case 28:
                        this.$ = [
                            [$$[$0]], null
                        ];
                        break;
                    case 29:
                        $$[$0 - 1].push($$[$0]);
                        this.$ = $$[$0 - 1];
                        break;
                    case 30:
                        this.$ = [$$[$0]];
                        break;
                    case 31:
                        this.$ = $$[$0];
                        break;
                    case 32:
                        this.$ = new yy.StringNode($$[$0]);
                        break;
                    case 33:
                        this.$ = new yy.IntegerNode($$[$0]);
                        break;
                    case 34:
                        this.$ = new yy.BooleanNode($$[$0]);
                        break;
                    case 35:
                        this.$ = $$[$0];
                        break;
                    case 36:
                        this.$ = new yy.HashNode($$[$0]);
                        break;
                    case 37:
                        $$[$0 - 1].push($$[$0]);
                        this.$ = $$[$0 - 1];
                        break;
                    case 38:
                        this.$ = [$$[$0]];
                        break;
                    case 39:
                        this.$ = [$$[$0 - 2], $$[$0]];
                        break;
                    case 40:
                        this.$ = [$$[$0 - 2], new yy.StringNode($$[$0])];
                        break;
                    case 41:
                        this.$ = [$$[$0 - 2], new yy.IntegerNode($$[$0])];
                        break;
                    case 42:
                        this.$ = [$$[$0 - 2], new yy.BooleanNode($$[$0])];
                        break;
                    case 43:
                        this.$ = [$$[$0 - 2], $$[$0]];
                        break;
                    case 44:
                        this.$ = new yy.PartialNameNode($$[$0]);
                        break;
                    case 45:
                        this.$ = new yy.PartialNameNode(new yy.StringNode($$[$0]));
                        break;
                    case 46:
                        this.$ = new yy.PartialNameNode(new yy.IntegerNode($$[$0]));
                        break;
                    case 47:
                        this.$ = new yy.DataNode($$[$0]);
                        break;
                    case 48:
                        this.$ = new yy.IdNode($$[$0]);
                        break;
                    case 49:
                        $$[$0 - 2].push({
                            part: $$[$0],
                            separator: $$[$0 - 1]
                        });
                        this.$ = $$[$0 - 2];
                        break;
                    case 50:
                        this.$ = [{
                            part: $$[$0]
                        }];
                        break
                    }
                },
                table: [{
                    3: 1,
                    4: 2,
                    5: [2, 7],
                    6: 3,
                    7: 4,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 5],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    1: [3]
                }, {
                    5: [1, 17]
                }, {
                    5: [2, 6],
                    7: 18,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 19],
                    20: [2, 6],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    5: [2, 5],
                    6: 20,
                    8: 21,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 5],
                    20: [2, 5],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    17: 23,
                    18: [1, 22],
                    21: 24,
                    29: 25,
                    36: [1, 28],
                    38: [1, 27],
                    39: 26
                }, {
                    5: [2, 8],
                    14: [2, 8],
                    15: [2, 8],
                    16: [2, 8],
                    19: [2, 8],
                    20: [2, 8],
                    22: [2, 8],
                    23: [2, 8],
                    25: [2, 8]
                }, {
                    4: 29,
                    6: 3,
                    7: 4,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 5],
                    20: [2, 7],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    4: 30,
                    6: 3,
                    7: 4,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 5],
                    20: [2, 7],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    5: [2, 12],
                    14: [2, 12],
                    15: [2, 12],
                    16: [2, 12],
                    19: [2, 12],
                    20: [2, 12],
                    22: [2, 12],
                    23: [2, 12],
                    25: [2, 12]
                }, {
                    5: [2, 13],
                    14: [2, 13],
                    15: [2, 13],
                    16: [2, 13],
                    19: [2, 13],
                    20: [2, 13],
                    22: [2, 13],
                    23: [2, 13],
                    25: [2, 13]
                }, {
                    5: [2, 14],
                    14: [2, 14],
                    15: [2, 14],
                    16: [2, 14],
                    19: [2, 14],
                    20: [2, 14],
                    22: [2, 14],
                    23: [2, 14],
                    25: [2, 14]
                }, {
                    5: [2, 15],
                    14: [2, 15],
                    15: [2, 15],
                    16: [2, 15],
                    19: [2, 15],
                    20: [2, 15],
                    22: [2, 15],
                    23: [2, 15],
                    25: [2, 15]
                }, {
                    17: 31,
                    21: 24,
                    29: 25,
                    36: [1, 28],
                    38: [1, 27],
                    39: 26
                }, {
                    17: 32,
                    21: 24,
                    29: 25,
                    36: [1, 28],
                    38: [1, 27],
                    39: 26
                }, {
                    17: 33,
                    21: 24,
                    29: 25,
                    36: [1, 28],
                    38: [1, 27],
                    39: 26
                }, {
                    21: 35,
                    26: 34,
                    31: [1, 36],
                    32: [1, 37],
                    36: [1, 28],
                    39: 26
                }, {
                    1: [2, 1]
                }, {
                    5: [2, 2],
                    8: 21,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 19],
                    20: [2, 2],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    17: 23,
                    21: 24,
                    29: 25,
                    36: [1, 28],
                    38: [1, 27],
                    39: 26
                }, {
                    5: [2, 4],
                    7: 38,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 19],
                    20: [2, 4],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    5: [2, 9],
                    14: [2, 9],
                    15: [2, 9],
                    16: [2, 9],
                    19: [2, 9],
                    20: [2, 9],
                    22: [2, 9],
                    23: [2, 9],
                    25: [2, 9]
                }, {
                    5: [2, 23],
                    14: [2, 23],
                    15: [2, 23],
                    16: [2, 23],
                    19: [2, 23],
                    20: [2, 23],
                    22: [2, 23],
                    23: [2, 23],
                    25: [2, 23]
                }, {
                    18: [1, 39]
                }, {
                    18: [2, 27],
                    21: 44,
                    24: [2, 27],
                    27: 40,
                    28: 41,
                    29: 48,
                    30: 42,
                    31: [1, 45],
                    32: [1, 46],
                    33: [1, 47],
                    34: 43,
                    35: 49,
                    36: [1, 50],
                    38: [1, 27],
                    39: 26
                }, {
                    18: [2, 28],
                    24: [2, 28]
                }, {
                    18: [2, 48],
                    24: [2, 48],
                    31: [2, 48],
                    32: [2, 48],
                    33: [2, 48],
                    36: [2, 48],
                    38: [2, 48],
                    40: [1, 51]
                }, {
                    21: 52,
                    36: [1, 28],
                    39: 26
                }, {
                    18: [2, 50],
                    24: [2, 50],
                    31: [2, 50],
                    32: [2, 50],
                    33: [2, 50],
                    36: [2, 50],
                    38: [2, 50],
                    40: [2, 50]
                }, {
                    10: 53,
                    20: [1, 54]
                }, {
                    10: 55,
                    20: [1, 54]
                }, {
                    18: [1, 56]
                }, {
                    18: [1, 57]
                }, {
                    24: [1, 58]
                }, {
                    18: [1, 59],
                    21: 60,
                    36: [1, 28],
                    39: 26
                }, {
                    18: [2, 44],
                    36: [2, 44]
                }, {
                    18: [2, 45],
                    36: [2, 45]
                }, {
                    18: [2, 46],
                    36: [2, 46]
                }, {
                    5: [2, 3],
                    8: 21,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [1, 11],
                    15: [1, 12],
                    16: [1, 13],
                    19: [1, 19],
                    20: [2, 3],
                    22: [1, 14],
                    23: [1, 15],
                    25: [1, 16]
                }, {
                    14: [2, 17],
                    15: [2, 17],
                    16: [2, 17],
                    19: [2, 17],
                    20: [2, 17],
                    22: [2, 17],
                    23: [2, 17],
                    25: [2, 17]
                }, {
                    18: [2, 25],
                    21: 44,
                    24: [2, 25],
                    28: 61,
                    29: 48,
                    30: 62,
                    31: [1, 45],
                    32: [1, 46],
                    33: [1, 47],
                    34: 43,
                    35: 49,
                    36: [1, 50],
                    38: [1, 27],
                    39: 26
                }, {
                    18: [2, 26],
                    24: [2, 26]
                }, {
                    18: [2, 30],
                    24: [2, 30],
                    31: [2, 30],
                    32: [2, 30],
                    33: [2, 30],
                    36: [2, 30],
                    38: [2, 30]
                }, {
                    18: [2, 36],
                    24: [2, 36],
                    35: 63,
                    36: [1, 64]
                }, {
                    18: [2, 31],
                    24: [2, 31],
                    31: [2, 31],
                    32: [2, 31],
                    33: [2, 31],
                    36: [2, 31],
                    38: [2, 31]
                }, {
                    18: [2, 32],
                    24: [2, 32],
                    31: [2, 32],
                    32: [2, 32],
                    33: [2, 32],
                    36: [2, 32],
                    38: [2, 32]
                }, {
                    18: [2, 33],
                    24: [2, 33],
                    31: [2, 33],
                    32: [2, 33],
                    33: [2, 33],
                    36: [2, 33],
                    38: [2, 33]
                }, {
                    18: [2, 34],
                    24: [2, 34],
                    31: [2, 34],
                    32: [2, 34],
                    33: [2, 34],
                    36: [2, 34],
                    38: [2, 34]
                }, {
                    18: [2, 35],
                    24: [2, 35],
                    31: [2, 35],
                    32: [2, 35],
                    33: [2, 35],
                    36: [2, 35],
                    38: [2, 35]
                }, {
                    18: [2, 38],
                    24: [2, 38],
                    36: [2, 38]
                }, {
                    18: [2, 50],
                    24: [2, 50],
                    31: [2, 50],
                    32: [2, 50],
                    33: [2, 50],
                    36: [2, 50],
                    37: [1, 65],
                    38: [2, 50],
                    40: [2, 50]
                }, {
                    36: [1, 66]
                }, {
                    18: [2, 47],
                    24: [2, 47],
                    31: [2, 47],
                    32: [2, 47],
                    33: [2, 47],
                    36: [2, 47],
                    38: [2, 47]
                }, {
                    5: [2, 10],
                    14: [2, 10],
                    15: [2, 10],
                    16: [2, 10],
                    19: [2, 10],
                    20: [2, 10],
                    22: [2, 10],
                    23: [2, 10],
                    25: [2, 10]
                }, {
                    21: 67,
                    36: [1, 28],
                    39: 26
                }, {
                    5: [2, 11],
                    14: [2, 11],
                    15: [2, 11],
                    16: [2, 11],
                    19: [2, 11],
                    20: [2, 11],
                    22: [2, 11],
                    23: [2, 11],
                    25: [2, 11]
                }, {
                    14: [2, 16],
                    15: [2, 16],
                    16: [2, 16],
                    19: [2, 16],
                    20: [2, 16],
                    22: [2, 16],
                    23: [2, 16],
                    25: [2, 16]
                }, {
                    5: [2, 19],
                    14: [2, 19],
                    15: [2, 19],
                    16: [2, 19],
                    19: [2, 19],
                    20: [2, 19],
                    22: [2, 19],
                    23: [2, 19],
                    25: [2, 19]
                }, {
                    5: [2, 20],
                    14: [2, 20],
                    15: [2, 20],
                    16: [2, 20],
                    19: [2, 20],
                    20: [2, 20],
                    22: [2, 20],
                    23: [2, 20],
                    25: [2, 20]
                }, {
                    5: [2, 21],
                    14: [2, 21],
                    15: [2, 21],
                    16: [2, 21],
                    19: [2, 21],
                    20: [2, 21],
                    22: [2, 21],
                    23: [2, 21],
                    25: [2, 21]
                }, {
                    18: [1, 68]
                }, {
                    18: [2, 24],
                    24: [2, 24]
                }, {
                    18: [2, 29],
                    24: [2, 29],
                    31: [2, 29],
                    32: [2, 29],
                    33: [2, 29],
                    36: [2, 29],
                    38: [2, 29]
                }, {
                    18: [2, 37],
                    24: [2, 37],
                    36: [2, 37]
                }, {
                    37: [1, 65]
                }, {
                    21: 69,
                    29: 73,
                    31: [1, 70],
                    32: [1, 71],
                    33: [1, 72],
                    36: [1, 28],
                    38: [1, 27],
                    39: 26
                }, {
                    18: [2, 49],
                    24: [2, 49],
                    31: [2, 49],
                    32: [2, 49],
                    33: [2, 49],
                    36: [2, 49],
                    38: [2, 49],
                    40: [2, 49]
                }, {
                    18: [1, 74]
                }, {
                    5: [2, 22],
                    14: [2, 22],
                    15: [2, 22],
                    16: [2, 22],
                    19: [2, 22],
                    20: [2, 22],
                    22: [2, 22],
                    23: [2, 22],
                    25: [2, 22]
                }, {
                    18: [2, 39],
                    24: [2, 39],
                    36: [2, 39]
                }, {
                    18: [2, 40],
                    24: [2, 40],
                    36: [2, 40]
                }, {
                    18: [2, 41],
                    24: [2, 41],
                    36: [2, 41]
                }, {
                    18: [2, 42],
                    24: [2, 42],
                    36: [2, 42]
                }, {
                    18: [2, 43],
                    24: [2, 43],
                    36: [2, 43]
                }, {
                    5: [2, 18],
                    14: [2, 18],
                    15: [2, 18],
                    16: [2, 18],
                    19: [2, 18],
                    20: [2, 18],
                    22: [2, 18],
                    23: [2, 18],
                    25: [2, 18]
                }],
                defaultActions: {
                    17: [2, 1]
                },
                parseError: function parseError(str, hash) {
                    throw new Error(str)
                },
                parse: function parse(input) {
                    var self = this,
                        stack = [0],
                        vstack = [null],
                        lstack = [],
                        table = this.table,
                        yytext = "",
                        yylineno = 0,
                        yyleng = 0,
                        recovering = 0,
                        TERROR = 2,
                        EOF = 1;
                    this.lexer.setInput(input);
                    this.lexer.yy = this.yy;
                    this.yy.lexer = this.lexer;
                    this.yy.parser = this;
                    if (typeof this.lexer.yylloc == "undefined") this.lexer.yylloc = {};
                    var yyloc = this.lexer.yylloc;
                    lstack.push(yyloc);
                    var ranges = this.lexer.options && this.lexer.options.ranges;
                    if (typeof this.yy.parseError === "function") this.parseError = this.yy.parseError;

                    function popStack(n) {
                        stack.length = stack.length - 2 * n;
                        vstack.length = vstack.length - n;
                        lstack.length = lstack.length - n
                    }

                    function lex() {
                        var token;
                        token = self.lexer.lex() || 1;
                        if (typeof token !== "number") {
                            token = self.symbols_[token] || token
                        }
                        return token
                    }
                    var symbol, preErrorSymbol, state, action, a, r, yyval = {},
                        p, len, newState, expected;
                    while (true) {
                        state = stack[stack.length - 1];
                        if (this.defaultActions[state]) {
                            action = this.defaultActions[state]
                        } else {
                            if (symbol === null || typeof symbol == "undefined") {
                                symbol = lex()
                            }
                            action = table[state] && table[state][symbol]
                        }
                        if (typeof action === "undefined" || !action.length || !action[0]) {
                            var errStr = "";
                            if (!recovering) {
                                expected = [];
                                for (p in table[state])
                                    if (this.terminals_[p] && p > 2) {
                                        expected.push("'" + this.terminals_[p] + "'")
                                    }
                                if (this.lexer.showPosition) {
                                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'"
                                } else {
                                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1 ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'")
                                }
                                this.parseError(errStr, {
                                    text: this.lexer.match,
                                    token: this.terminals_[symbol] || symbol,
                                    line: this.lexer.yylineno,
                                    loc: yyloc,
                                    expected: expected
                                })
                            }
                        }
                        if (action[0] instanceof Array && action.length > 1) {
                            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol)
                        }
                        switch (action[0]) {
                        case 1:
                            stack.push(symbol);
                            vstack.push(this.lexer.yytext);
                            lstack.push(this.lexer.yylloc);
                            stack.push(action[1]);
                            symbol = null;
                            if (!preErrorSymbol) {
                                yyleng = this.lexer.yyleng;
                                yytext = this.lexer.yytext;
                                yylineno = this.lexer.yylineno;
                                yyloc = this.lexer.yylloc;
                                if (recovering > 0) recovering--
                            } else {
                                symbol = preErrorSymbol;
                                preErrorSymbol = null
                            }
                            break;
                        case 2:
                            len = this.productions_[action[1]][1];
                            yyval.$ = vstack[vstack.length - len];
                            yyval._$ = {
                                first_line: lstack[lstack.length - (len || 1)].first_line,
                                last_line: lstack[lstack.length - 1].last_line,
                                first_column: lstack[lstack.length - (len || 1)].first_column,
                                last_column: lstack[lstack.length - 1].last_column
                            };
                            if (ranges) {
                                yyval._$.range = [lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1]]
                            }
                            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
                            if (typeof r !== "undefined") {
                                return r
                            }
                            if (len) {
                                stack = stack.slice(0, -1 * len * 2);
                                vstack = vstack.slice(0, -1 * len);
                                lstack = lstack.slice(0, -1 * len)
                            }
                            stack.push(this.productions_[action[1]][0]);
                            vstack.push(yyval.$);
                            lstack.push(yyval._$);
                            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                            stack.push(newState);
                            break;
                        case 3:
                            return true
                        }
                    }
                    return true
                }
            };
            var lexer = function () {
                var lexer = {
                    EOF: 1,
                    parseError: function parseError(str, hash) {
                        if (this.yy.parser) {
                            this.yy.parser.parseError(str, hash)
                        } else {
                            throw new Error(str)
                        }
                    },
                    setInput: function (input) {
                        this._input = input;
                        this._more = this._less = this.done = false;
                        this.yylineno = this.yyleng = 0;
                        this.yytext = this.matched = this.match = "";
                        this.conditionStack = ["INITIAL"];
                        this.yylloc = {
                            first_line: 1,
                            first_column: 0,
                            last_line: 1,
                            last_column: 0
                        };
                        if (this.options.ranges) this.yylloc.range = [0, 0];
                        this.offset = 0;
                        return this
                    },
                    input: function () {
                        var ch = this._input[0];
                        this.yytext += ch;
                        this.yyleng++;
                        this.offset++;
                        this.match += ch;
                        this.matched += ch;
                        var lines = ch.match(/(?:\r\n?|\n).*/g);
                        if (lines) {
                            this.yylineno++;
                            this.yylloc.last_line++
                        } else {
                            this.yylloc.last_column++
                        }
                        if (this.options.ranges) this.yylloc.range[1]++;
                        this._input = this._input.slice(1);
                        return ch
                    },
                    unput: function (ch) {
                        var len = ch.length;
                        var lines = ch.split(/(?:\r\n?|\n)/g);
                        this._input = ch + this._input;
                        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
                        this.offset -= len;
                        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                        this.match = this.match.substr(0, this.match.length - 1);
                        this.matched = this.matched.substr(0, this.matched.length - 1);
                        if (lines.length - 1) this.yylineno -= lines.length - 1;
                        var r = this.yylloc.range;
                        this.yylloc = {
                            first_line: this.yylloc.first_line,
                            last_line: this.yylineno + 1,
                            first_column: this.yylloc.first_column,
                            last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
                        };
                        if (this.options.ranges) {
                            this.yylloc.range = [r[0], r[0] + this.yyleng - len]
                        }
                        return this
                    },
                    more: function () {
                        this._more = true;
                        return this
                    },
                    less: function (n) {
                        this.unput(this.match.slice(n))
                    },
                    pastInput: function () {
                        var past = this.matched.substr(0, this.matched.length - this.match.length);
                        return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "")
                    },
                    upcomingInput: function () {
                        var next = this.match;
                        if (next.length < 20) {
                            next += this._input.substr(0, 20 - next.length)
                        }
                        return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "")
                    },
                    showPosition: function () {
                        var pre = this.pastInput();
                        var c = new Array(pre.length + 1).join("-");
                        return pre + this.upcomingInput() + "\n" + c + "^"
                    },
                    next: function () {
                        if (this.done) {
                            return this.EOF
                        }
                        if (!this._input) this.done = true;
                        var token, match, tempMatch, index, col, lines;
                        if (!this._more) {
                            this.yytext = "";
                            this.match = ""
                        }
                        var rules = this._currentRules();
                        for (var i = 0; i < rules.length; i++) {
                            tempMatch = this._input.match(this.rules[rules[i]]);
                            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                                match = tempMatch;
                                index = i;
                                if (!this.options.flex) break
                            }
                        }
                        if (match) {
                            lines = match[0].match(/(?:\r\n?|\n).*/g);
                            if (lines) this.yylineno += lines.length;
                            this.yylloc = {
                                first_line: this.yylloc.last_line,
                                last_line: this.yylineno + 1,
                                first_column: this.yylloc.last_column,
                                last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
                            };
                            this.yytext += match[0];
                            this.match += match[0];
                            this.matches = match;
                            this.yyleng = this.yytext.length;
                            if (this.options.ranges) {
                                this.yylloc.range = [this.offset, this.offset += this.yyleng]
                            }
                            this._more = false;
                            this._input = this._input.slice(match[0].length);
                            this.matched += match[0];
                            token = this.performAction.call(this, this.yy, this, rules[index], this.conditionStack[this.conditionStack.length - 1]);
                            if (this.done && this._input) this.done = false;
                            if (token) return token;
                            else return
                        }
                        if (this._input === "") {
                            return this.EOF
                        } else {
                            return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
                                text: "",
                                token: null,
                                line: this.yylineno
                            })
                        }
                    },
                    lex: function lex() {
                        var r = this.next();
                        if (typeof r !== "undefined") {
                            return r
                        } else {
                            return this.lex()
                        }
                    },
                    begin: function begin(condition) {
                        this.conditionStack.push(condition)
                    },
                    popState: function popState() {
                        return this.conditionStack.pop()
                    },
                    _currentRules: function _currentRules() {
                        return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules
                    },
                    topState: function () {
                        return this.conditionStack[this.conditionStack.length - 2]
                    },
                    pushState: function begin(condition) {
                        this.begin(condition)
                    }
                };
                lexer.options = {};
                lexer.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
                    var YYSTATE = YY_START;
                    switch ($avoiding_name_collisions) {
                    case 0:
                        yy_.yytext = "\\";
                        return 14;
                        break;
                    case 1:
                        if (yy_.yytext.slice(-1) !== "\\") this.begin("mu");
                        if (yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0, yy_.yyleng - 1), this.begin("emu");
                        if (yy_.yytext) return 14;
                        break;
                    case 2:
                        return 14;
                        break;
                    case 3:
                        if (yy_.yytext.slice(-1) !== "\\") this.popState();
                        if (yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0, yy_.yyleng - 1);
                        return 14;
                        break;
                    case 4:
                        yy_.yytext = yy_.yytext.substr(0, yy_.yyleng - 4);
                        this.popState();
                        return 15;
                        break;
                    case 5:
                        return 25;
                        break;
                    case 6:
                        return 16;
                        break;
                    case 7:
                        return 20;
                        break;
                    case 8:
                        return 19;
                        break;
                    case 9:
                        return 19;
                        break;
                    case 10:
                        return 23;
                        break;
                    case 11:
                        return 22;
                        break;
                    case 12:
                        this.popState();
                        this.begin("com");
                        break;
                    case 13:
                        yy_.yytext = yy_.yytext.substr(3, yy_.yyleng - 5);
                        this.popState();
                        return 15;
                        break;
                    case 14:
                        return 22;
                        break;
                    case 15:
                        return 37;
                        break;
                    case 16:
                        return 36;
                        break;
                    case 17:
                        return 36;
                        break;
                    case 18:
                        return 40;
                        break;
                    case 19:
                        break;
                    case 20:
                        this.popState();
                        return 24;
                        break;
                    case 21:
                        this.popState();
                        return 18;
                        break;
                    case 22:
                        yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2).replace(/\\"/g, '"');
                        return 31;
                        break;
                    case 23:
                        yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2).replace(/\\'/g, "'");
                        return 31;
                        break;
                    case 24:
                        return 38;
                        break;
                    case 25:
                        return 33;
                        break;
                    case 26:
                        return 33;
                        break;
                    case 27:
                        return 32;
                        break;
                    case 28:
                        return 36;
                        break;
                    case 29:
                        yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2);
                        return 36;
                        break;
                    case 30:
                        return "INVALID";
                        break;
                    case 31:
                        return 5;
                        break
                    }
                };
                lexer.rules = [/^(?:\\\\(?=(\{\{)))/, /^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|$)))/, /^(?:[\s\S]*?--\}\})/, /^(?:\{\{>)/, /^(?:\{\{#)/, /^(?:\{\{\/)/, /^(?:\{\{\^)/, /^(?:\{\{\s*else\b)/, /^(?:\{\{\{)/, /^(?:\{\{&)/, /^(?:\{\{!--)/, /^(?:\{\{![\s\S]*?\}\})/, /^(?:\{\{)/, /^(?:=)/, /^(?:\.(?=[}\/ ]))/, /^(?:\.\.)/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}\}\})/, /^(?:\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=[}\s]))/, /^(?:false(?=[}\s]))/, /^(?:-?[0-9]+(?=[}\s]))/, /^(?:[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.]))/, /^(?:\[[^\]]*\])/, /^(?:.)/, /^(?:$)/];
                lexer.conditions = {
                    mu: {
                        rules: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                        inclusive: false
                    },
                    emu: {
                        rules: [3],
                        inclusive: false
                    },
                    com: {
                        rules: [4],
                        inclusive: false
                    },
                    INITIAL: {
                        rules: [0, 1, 2, 31],
                        inclusive: true
                    }
                };
                return lexer
            }();
            parser.lexer = lexer;

            function Parser() {
                this.yy = {}
            }
            Parser.prototype = parser;
            parser.Parser = Parser;
            return new Parser
        }();
        Handlebars.Parser = handlebars;
        Handlebars.parse = function (input) {
            if (input.constructor === Handlebars.AST.ProgramNode) {
                return input
            }
            Handlebars.Parser.yy = Handlebars.AST;
            return Handlebars.Parser.parse(input)
        };
        Handlebars.AST = {};
        Handlebars.AST.ProgramNode = function (statements, inverse) {
            this.type = "program";
            this.statements = statements;
            if (inverse) {
                this.inverse = new Handlebars.AST.ProgramNode(inverse)
            }
        };
        Handlebars.AST.MustacheNode = function (rawParams, hash, unescaped) {
            this.type = "mustache";
            this.escaped = !unescaped;
            this.hash = hash;
            var id = this.id = rawParams[0];
            var params = this.params = rawParams.slice(1);
            var eligibleHelper = this.eligibleHelper = id.isSimple;
            this.isHelper = eligibleHelper && (params.length || hash)
        };
        Handlebars.AST.PartialNode = function (partialName, context) {
            this.type = "partial";
            this.partialName = partialName;
            this.context = context
        };
        Handlebars.AST.BlockNode = function (mustache, program, inverse, close) {
            var verifyMatch = function (open, close) {
                if (open.original !== close.original) {
                    throw new Handlebars.Exception(open.original + " doesn't match " + close.original)
                }
            };
            verifyMatch(mustache.id, close);
            this.type = "block";
            this.mustache = mustache;
            this.program = program;
            this.inverse = inverse;
            if (this.inverse && !this.program) {
                this.isInverse = true
            }
        };
        Handlebars.AST.ContentNode = function (string) {
            this.type = "content";
            this.string = string
        };
        Handlebars.AST.HashNode = function (pairs) {
            this.type = "hash";
            this.pairs = pairs
        };
        Handlebars.AST.IdNode = function (parts) {
            this.type = "ID";
            var original = "",
                dig = [],
                depth = 0;
            for (var i = 0, l = parts.length; i < l; i++) {
                var part = parts[i].part;
                original += (parts[i].separator || "") + part;
                if (part === ".." || part === "." || part === "this") {
                    if (dig.length > 0) {
                        throw new Handlebars.Exception("Invalid path: " + original)
                    } else if (part === "..") {
                        depth++
                    } else {
                        this.isScoped = true
                    }
                } else {
                    dig.push(part)
                }
            }
            this.original = original;
            this.parts = dig;
            this.string = dig.join(".");
            this.depth = depth;
            this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;
            this.stringModeValue = this.string
        };
        Handlebars.AST.PartialNameNode = function (name) {
            this.type = "PARTIAL_NAME";
            this.name = name.original
        };
        Handlebars.AST.DataNode = function (id) {
            this.type = "DATA";
            this.id = id
        };
        Handlebars.AST.StringNode = function (string) {
            this.type = "STRING";
            this.original = this.string = this.stringModeValue = string
        };
        Handlebars.AST.IntegerNode = function (integer) {
            this.type = "INTEGER";
            this.original = this.integer = integer;
            this.stringModeValue = Number(integer)
        };
        Handlebars.AST.BooleanNode = function (bool) {
            this.type = "BOOLEAN";
            this.bool = bool;
            this.stringModeValue = bool === "true"
        };
        Handlebars.AST.CommentNode = function (comment) {
            this.type = "comment";
            this.comment = comment
        };
        var errorProps = ["description", "fileName", "lineNumber", "message", "name", "number", "stack"];
        Handlebars.Exception = function (message) {
            var tmp = Error.prototype.constructor.apply(this, arguments);
            for (var idx = 0; idx < errorProps.length; idx++) {
                this[errorProps[idx]] = tmp[errorProps[idx]]
            }
        };
        Handlebars.Exception.prototype = new Error;
        Handlebars.SafeString = function (string) {
            this.string = string
        };
        Handlebars.SafeString.prototype.toString = function () {
            return this.string.toString()
        };
        var escape = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;"
        };
        var badChars = /[&<>"'`]/g;
        var possible = /[&<>"'`]/;
        var escapeChar = function (chr) {
            return escape[chr] || "&amp;"
        };
        Handlebars.Utils = {
            extend: function (obj, value) {
                for (var key in value) {
                    if (value.hasOwnProperty(key)) {
                        obj[key] = value[key]
                    }
                }
            },
            escapeExpression: function (string) {
                if (string instanceof Handlebars.SafeString) {
                    return string.toString()
                } else if (string == null || string === false) {
                    return ""
                }
                string = string.toString();
                if (!possible.test(string)) {
                    return string
                }
                return string.replace(badChars, escapeChar)
            },
            isEmpty: function (value) {
                if (!value && value !== 0) {
                    return true
                } else if (toString.call(value) === "[object Array]" && value.length === 0) {
                    return true
                } else {
                    return false
                }
            }
        };
        var Compiler = Handlebars.Compiler = function () {};
        var JavaScriptCompiler = Handlebars.JavaScriptCompiler = function () {};
        Compiler.prototype = {
            compiler: Compiler,
            disassemble: function () {
                var opcodes = this.opcodes,
                    opcode, out = [],
                    params, param;
                for (var i = 0, l = opcodes.length; i < l; i++) {
                    opcode = opcodes[i];
                    if (opcode.opcode === "DECLARE") {
                        out.push("DECLARE " + opcode.name + "=" + opcode.value)
                    } else {
                        params = [];
                        for (var j = 0; j < opcode.args.length; j++) {
                            param = opcode.args[j];
                            if (typeof param === "string") {
                                param = '"' + param.replace("\n", "\\n") + '"'
                            }
                            params.push(param)
                        }
                        out.push(opcode.opcode + " " + params.join(" "))
                    }
                }
                return out.join("\n")
            },
            equals: function (other) {
                var len = this.opcodes.length;
                if (other.opcodes.length !== len) {
                    return false
                }
                for (var i = 0; i < len; i++) {
                    var opcode = this.opcodes[i],
                        otherOpcode = other.opcodes[i];
                    if (opcode.opcode !== otherOpcode.opcode || opcode.args.length !== otherOpcode.args.length) {
                        return false
                    }
                    for (var j = 0; j < opcode.args.length; j++) {
                        if (opcode.args[j] !== otherOpcode.args[j]) {
                            return false
                        }
                    }
                }
                len = this.children.length;
                if (other.children.length !== len) {
                    return false
                }
                for (i = 0; i < len; i++) {
                    if (!this.children[i].equals(other.children[i])) {
                        return false
                    }
                }
                return true
            },
            guid: 0,
            compile: function (program, options) {
                this.children = [];
                this.depths = {
                    list: []
                };
                this.options = options;
                var knownHelpers = this.options.knownHelpers;
                this.options.knownHelpers = {
                    helperMissing: true,
                    blockHelperMissing: true,
                    each: true,
                    "if": true,
                    unless: true,
                    "with": true,
                    log: true
                };
                if (knownHelpers) {
                    for (var name in knownHelpers) {
                        this.options.knownHelpers[name] = knownHelpers[name]
                    }
                }
                return this.program(program)
            },
            accept: function (node) {
                return this[node.type](node)
            },
            program: function (program) {
                var statements = program.statements,
                    statement;
                this.opcodes = [];
                for (var i = 0, l = statements.length; i < l; i++) {
                    statement = statements[i];
                    this[statement.type](statement)
                }
                this.isSimple = l === 1;
                this.depths.list = this.depths.list.sort(function (a, b) {
                    return a - b
                });
                return this
            },
            compileProgram: function (program) {
                var result = (new this.compiler).compile(program, this.options);
                var guid = this.guid++,
                    depth;
                this.usePartial = this.usePartial || result.usePartial;
                this.children[guid] = result;
                for (var i = 0, l = result.depths.list.length; i < l; i++) {
                    depth = result.depths.list[i];
                    if (depth < 2) {
                        continue
                    } else {
                        this.addDepth(depth - 1)
                    }
                }
                return guid
            },
            block: function (block) {
                var mustache = block.mustache,
                    program = block.program,
                    inverse = block.inverse;
                if (program) {
                    program = this.compileProgram(program)
                }
                if (inverse) {
                    inverse = this.compileProgram(inverse)
                }
                var type = this.classifyMustache(mustache);
                if (type === "helper") {
                    this.helperMustache(mustache, program, inverse)
                } else if (type === "simple") {
                    this.simpleMustache(mustache);
                    this.opcode("pushProgram", program);
                    this.opcode("pushProgram", inverse);
                    this.opcode("emptyHash");
                    this.opcode("blockValue")
                } else {
                    this.ambiguousMustache(mustache, program, inverse);
                    this.opcode("pushProgram", program);
                    this.opcode("pushProgram", inverse);
                    this.opcode("emptyHash");
                    this.opcode("ambiguousBlockValue")
                }
                this.opcode("append")
            },
            hash: function (hash) {
                var pairs = hash.pairs,
                    pair, val;
                this.opcode("pushHash");
                for (var i = 0, l = pairs.length; i < l; i++) {
                    pair = pairs[i];
                    val = pair[1];
                    if (this.options.stringParams) {
                        if (val.depth) {
                            this.addDepth(val.depth)
                        }
                        this.opcode("getContext", val.depth || 0);
                        this.opcode("pushStringParam", val.stringModeValue, val.type)
                    } else {
                        this.accept(val)
                    }
                    this.opcode("assignToHash", pair[0])
                }
                this.opcode("popHash")
            },
            partial: function (partial) {
                var partialName = partial.partialName;
                this.usePartial = true;
                if (partial.context) {
                    this.ID(partial.context)
                } else {
                    this.opcode("push", "depth0")
                }
                this.opcode("invokePartial", partialName.name);
                this.opcode("append")
            },
            content: function (content) {
                this.opcode("appendContent", content.string)
            },
            mustache: function (mustache) {
                var options = this.options;
                var type = this.classifyMustache(mustache);
                if (type === "simple") {
                    this.simpleMustache(mustache)
                } else if (type === "helper") {
                    this.helperMustache(mustache)
                } else {
                    this.ambiguousMustache(mustache)
                }
                if (mustache.escaped && !options.noEscape) {
                    this.opcode("appendEscaped")
                } else {
                    this.opcode("append")
                }
            },
            ambiguousMustache: function (mustache, program, inverse) {
                var id = mustache.id,
                    name = id.parts[0],
                    isBlock = program != null || inverse != null;
                this.opcode("getContext", id.depth);
                this.opcode("pushProgram", program);
                this.opcode("pushProgram", inverse);
                this.opcode("invokeAmbiguous", name, isBlock)
            },
            simpleMustache: function (mustache) {
                var id = mustache.id;
                if (id.type === "DATA") {
                    this.DATA(id)
                } else if (id.parts.length) {
                    this.ID(id)
                } else {
                    this.addDepth(id.depth);
                    this.opcode("getContext", id.depth);
                    this.opcode("pushContext")
                }
                this.opcode("resolvePossibleLambda")
            },
            helperMustache: function (mustache, program, inverse) {
                var params = this.setupFullMustacheParams(mustache, program, inverse),
                    name = mustache.id.parts[0];
                if (this.options.knownHelpers[name]) {
                    this.opcode("invokeKnownHelper", params.length, name)
                } else if (this.options.knownHelpersOnly) {
                    throw new Error("You specified knownHelpersOnly, but used the unknown helper " + name)
                } else {
                    this.opcode("invokeHelper", params.length, name)
                }
            },
            ID: function (id) {
                this.addDepth(id.depth);
                this.opcode("getContext", id.depth);
                var name = id.parts[0];
                if (!name) {
                    this.opcode("pushContext")
                } else {
                    this.opcode("lookupOnContext", id.parts[0])
                }
                for (var i = 1, l = id.parts.length; i < l; i++) {
                    this.opcode("lookup", id.parts[i])
                }
            },
            DATA: function (data) {
                this.options.data = true;
                if (data.id.isScoped || data.id.depth) {
                    throw new Handlebars.Exception("Scoped data references are not supported: " + data.original)
                }
                this.opcode("lookupData");
                var parts = data.id.parts;
                for (var i = 0, l = parts.length; i < l; i++) {
                    this.opcode("lookup", parts[i])
                }
            },
            STRING: function (string) {
                this.opcode("pushString", string.string)
            },
            INTEGER: function (integer) {
                this.opcode("pushLiteral", integer.integer)
            },
            BOOLEAN: function (bool) {
                this.opcode("pushLiteral", bool.bool)
            },
            comment: function () {},
            opcode: function (name) {
                this.opcodes.push({
                    opcode: name,
                    args: [].slice.call(arguments, 1)
                })
            },
            declare: function (name, value) {
                this.opcodes.push({
                    opcode: "DECLARE",
                    name: name,
                    value: value
                })
            },
            addDepth: function (depth) {
                if (isNaN(depth)) {
                    throw new Error("EWOT")
                }
                if (depth === 0) {
                    return
                }
                if (!this.depths[depth]) {
                    this.depths[depth] = true;
                    this.depths.list.push(depth)
                }
            },
            classifyMustache: function (mustache) {
                var isHelper = mustache.isHelper;
                var isEligible = mustache.eligibleHelper;
                var options = this.options;
                if (isEligible && !isHelper) {
                    var name = mustache.id.parts[0];
                    if (options.knownHelpers[name]) {
                        isHelper = true
                    } else if (options.knownHelpersOnly) {
                        isEligible = false
                    }
                }
                if (isHelper) {
                    return "helper"
                } else if (isEligible) {
                    return "ambiguous"
                } else {
                    return "simple"
                }
            },
            pushParams: function (params) {
                var i = params.length,
                    param;
                while (i--) {
                    param = params[i];
                    if (this.options.stringParams) {
                        if (param.depth) {
                            this.addDepth(param.depth)
                        }
                        this.opcode("getContext", param.depth || 0);
                        this.opcode("pushStringParam", param.stringModeValue, param.type)
                    } else {
                        this[param.type](param)
                    }
                }
            },
            setupMustacheParams: function (mustache) {
                var params = mustache.params;
                this.pushParams(params);
                if (mustache.hash) {
                    this.hash(mustache.hash)
                } else {
                    this.opcode("emptyHash")
                }
                return params
            },
            setupFullMustacheParams: function (mustache, program, inverse) {
                var params = mustache.params;
                this.pushParams(params);
                this.opcode("pushProgram", program);
                this.opcode("pushProgram", inverse);
                if (mustache.hash) {
                    this.hash(mustache.hash)
                } else {
                    this.opcode("emptyHash")
                }
                return params
            }
        };
        var Literal = function (value) {
            this.value = value;
        };
        JavaScriptCompiler.prototype = {
            nameLookup: function (parent, name) {
                if (/^[0-9]+$/.test(name)) {
                    return parent + "[" + name + "]"
                } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
                    return parent + "." + name
                } else {
                    return parent + "['" + name + "']"
                }
            },
            appendToBuffer: function (string) {
                if (this.environment.isSimple) {
                    return "return " + string + ";"
                } else {
                    return {
                        appendToBuffer: true,
                        content: string,
                        toString: function () {
                            return "buffer += " + string + ";"
                        }
                    }
                }
            },
            initializeBuffer: function () {
                return this.quotedString("")
            },
            namespace: "Handlebars",
            compile: function (environment, options, context, asObject) {
                this.environment = environment;
                this.options = options || {};
                Handlebars.log(Handlebars.logger.DEBUG, this.environment.disassemble() + "\n\n");
                this.name = this.environment.name;
                this.isChild = !!context;
                this.context = context || {
                    programs: [],
                    environments: [],
                    aliases: {}
                };
                this.preamble();
                this.stackSlot = 0;
                this.stackVars = [];
                this.registers = {
                    list: []
                };
                this.compileStack = [];
                this.inlineStack = [];
                this.compileChildren(environment, options);
                var opcodes = environment.opcodes,
                    opcode;
                this.i = 0;
                for (l = opcodes.length; this.i < l; this.i++) {
                    opcode = opcodes[this.i];
                    if (opcode.opcode === "DECLARE") {
                        this[opcode.name] = opcode.value
                    } else {
                        this[opcode.opcode].apply(this, opcode.args)
                    }
                }
                return this.createFunctionContext(asObject)
            },
            nextOpcode: function () {
                var opcodes = this.environment.opcodes;
                return opcodes[this.i + 1]
            },
            eat: function () {
                this.i = this.i + 1
            },
            preamble: function () {
                var out = [];
                if (!this.isChild) {
                    var namespace = this.namespace;
                    var copies = "helpers = this.merge(helpers, " + namespace + ".helpers);";
                    if (this.environment.usePartial) {
                        copies = copies + " partials = this.merge(partials, " + namespace + ".partials);"
                    }
                    if (this.options.data) {
                        copies = copies + " data = data || {};"
                    }
                    out.push(copies)
                } else {
                    out.push("")
                }
                if (!this.environment.isSimple) {
                    out.push(", buffer = " + this.initializeBuffer())
                } else {
                    out.push("")
                }
                this.lastContext = 0;
                this.source = out
            },
            createFunctionContext: function (asObject) {
                var locals = this.stackVars.concat(this.registers.list);
                if (locals.length > 0) {
                    this.source[1] = this.source[1] + ", " + locals.join(", ")
                }
                if (!this.isChild) {
                    for (var alias in this.context.aliases) {
                        if (this.context.aliases.hasOwnProperty(alias)) {
                            this.source[1] = this.source[1] + ", " + alias + "=" + this.context.aliases[alias]
                        }
                    }
                }
                if (this.source[1]) {
                    this.source[1] = "var " + this.source[1].substring(2) + ";"
                }
                if (!this.isChild) {
                    this.source[1] += "\n" + this.context.programs.join("\n") + "\n"
                }
                if (!this.environment.isSimple) {
                    this.source.push("return buffer;")
                }
                var params = this.isChild ? ["depth0", "data"] : ["Handlebars", "depth0", "helpers", "partials", "data"];
                for (var i = 0, l = this.environment.depths.list.length; i < l; i++) {
                    params.push("depth" + this.environment.depths.list[i])
                }
                var source = this.mergeSource();
                if (!this.isChild) {
                    var revision = Handlebars.COMPILER_REVISION,
                        versions = Handlebars.REVISION_CHANGES[revision];
                    source = "this.compilerInfo = [" + revision + ",'" + versions + "'];\n" + source
                }
                if (asObject) {
                    params.push(source);
                    return Function.apply(this, params)
                } else {
                    var functionSource = "function " + (this.name || "") + "(" + params.join(",") + ") {\n  " + source + "}";
                    Handlebars.log(Handlebars.logger.DEBUG, functionSource + "\n\n");
                    return functionSource
                }
            },
            mergeSource: function () {
                var source = "",
                    buffer;
                for (var i = 0, len = this.source.length; i < len; i++) {
                    var line = this.source[i];
                    if (line.appendToBuffer) {
                        if (buffer) {
                            buffer = buffer + "\n    + " + line.content
                        } else {
                            buffer = line.content
                        }
                    } else {
                        if (buffer) {
                            source += "buffer += " + buffer + ";\n  ";
                            buffer = undefined
                        }
                        source += line + "\n  "
                    }
                }
                return source
            },
            blockValue: function () {
                this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
                var params = ["depth0"];
                this.setupParams(0, params);
                this.replaceStack(function (current) {
                    params.splice(1, 0, current);
                    return "blockHelperMissing.call(" + params.join(", ") + ")"
                })
            },
            ambiguousBlockValue: function () {
                this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
                var params = ["depth0"];
                this.setupParams(0, params);
                var current = this.topStack();
                params.splice(1, 0, current);
                params[params.length - 1] = "options";
                this.source.push("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }")
            },
            appendContent: function (content) {
                this.source.push(this.appendToBuffer(this.quotedString(content)))
            },
            append: function () {
                this.flushInline();
                var local = this.popStack();
                this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
                if (this.environment.isSimple) {
                    this.source.push("else { " + this.appendToBuffer("''") + " }")
                }
            },
            appendEscaped: function () {
                this.context.aliases.escapeExpression = "this.escapeExpression";
                this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"))
            },
            getContext: function (depth) {
                if (this.lastContext !== depth) {
                    this.lastContext = depth
                }
            },
            lookupOnContext: function (name) {
                this.push(this.nameLookup("depth" + this.lastContext, name, "context"))
            },
            pushContext: function () {
                this.pushStackLiteral("depth" + this.lastContext)
            },
            resolvePossibleLambda: function () {
                this.context.aliases.functionType = '"function"';
                this.replaceStack(function (current) {
                    return "typeof " + current + " === functionType ? " + current + ".apply(depth0) : " + current
                })
            },
            lookup: function (name) {
                this.replaceStack(function (current) {
                    return current + " == null || " + current + " === false ? " + current + " : " + this.nameLookup(current, name, "context")
                })
            },
            lookupData: function (id) {
                this.push("data")
            },
            pushStringParam: function (string, type) {
                this.pushStackLiteral("depth" + this.lastContext);
                this.pushString(type);
                if (typeof string === "string") {
                    this.pushString(string)
                } else {
                    this.pushStackLiteral(string)
                }
            },
            emptyHash: function () {
                this.pushStackLiteral("{}");
                if (this.options.stringParams) {
                    this.register("hashTypes", "{}");
                    this.register("hashContexts", "{}")
                }
            },
            pushHash: function () {
                this.hash = {
                    values: [],
                    types: [],
                    contexts: []
                }
            },
            popHash: function () {
                var hash = this.hash;
                this.hash = undefined;
                if (this.options.stringParams) {
                    this.register("hashContexts", "{" + hash.contexts.join(",") + "}");
                    this.register("hashTypes", "{" + hash.types.join(",") + "}")
                }
                this.push("{\n    " + hash.values.join(",\n    ") + "\n  }")
            },
            pushString: function (string) {
                this.pushStackLiteral(this.quotedString(string))
            },
            push: function (expr) {
                this.inlineStack.push(expr);
                return expr
            },
            pushLiteral: function (value) {
                this.pushStackLiteral(value)
            },
            pushProgram: function (guid) {
                if (guid != null) {
                    this.pushStackLiteral(this.programExpression(guid))
                } else {
                    this.pushStackLiteral(null)
                }
            },
            invokeHelper: function (paramSize, name) {
                this.context.aliases.helperMissing = "helpers.helperMissing";
                var helper = this.lastHelper = this.setupHelper(paramSize, name, true);
                var nonHelper = this.nameLookup("depth" + this.lastContext, name, "context");
                this.push(helper.name + " || " + nonHelper);
                this.replaceStack(function (name) {
                    return name + " ? " + name + ".call(" + helper.callParams + ") " + ": helperMissing.call(" + helper.helperMissingParams + ")"
                })
            },
            invokeKnownHelper: function (paramSize, name) {
                var helper = this.setupHelper(paramSize, name);
                this.push(helper.name + ".call(" + helper.callParams + ")")
            },
            invokeAmbiguous: function (name, helperCall) {
                this.context.aliases.functionType = '"function"';
                this.pushStackLiteral("{}");
                var helper = this.setupHelper(0, name, helperCall);
                var helperName = this.lastHelper = this.nameLookup("helpers", name, "helper");
                var nonHelper = this.nameLookup("depth" + this.lastContext, name, "context");
                var nextStack = this.nextStack();
                this.source.push("if (" + nextStack + " = " + helperName + ") { " + nextStack + " = " + nextStack + ".call(" + helper.callParams + "); }");
                this.source.push("else { " + nextStack + " = " + nonHelper + "; " + nextStack + " = typeof " + nextStack + " === functionType ? " + nextStack + ".apply(depth0) : " + nextStack + "; }")
            },
            invokePartial: function (name) {
                var params = [this.nameLookup("partials", name, "partial"), "'" + name + "'", this.popStack(), "helpers", "partials"];
                if (this.options.data) {
                    params.push("data")
                }
                this.context.aliases.self = "this";
                this.push("self.invokePartial(" + params.join(", ") + ")")
            },
            assignToHash: function (key) {
                var value = this.popStack(),
                    context, type;
                if (this.options.stringParams) {
                    type = this.popStack();
                    context = this.popStack()
                }
                var hash = this.hash;
                if (context) {
                    hash.contexts.push("'" + key + "': " + context)
                }
                if (type) {
                    hash.types.push("'" + key + "': " + type)
                }
                hash.values.push("'" + key + "': (" + value + ")")
            },
            compiler: JavaScriptCompiler,
            compileChildren: function (environment, options) {
                var children = environment.children,
                    child, compiler;
                for (var i = 0, l = children.length; i < l; i++) {
                    child = children[i];
                    compiler = new this.compiler;
                    var index = this.matchExistingProgram(child);
                    if (index == null) {
                        this.context.programs.push("");
                        index = this.context.programs.length;
                        child.index = index;
                        child.name = "program" + index;
                        this.context.programs[index] = compiler.compile(child, options, this.context);
                        this.context.environments[index] = child
                    } else {
                        child.index = index;
                        child.name = "program" + index
                    }
                }
            },
            matchExistingProgram: function (child) {
                for (var i = 0, len = this.context.environments.length; i < len; i++) {
                    var environment = this.context.environments[i];
                    if (environment && environment.equals(child)) {
                        return i
                    }
                }
            },
            programExpression: function (guid) {
                this.context.aliases.self = "this";
                if (guid == null) {
                    return "self.noop"
                }
                var child = this.environment.children[guid],
                    depths = child.depths.list,
                    depth;
                var programParams = [child.index, child.name, "data"];
                for (var i = 0, l = depths.length; i < l; i++) {
                    depth = depths[i];
                    if (depth === 1) {
                        programParams.push("depth0")
                    } else {
                        programParams.push("depth" + (depth - 1))
                    }
                }
                return (depths.length === 0 ? "self.program(" : "self.programWithDepth(") + programParams.join(", ") + ")"
            },
            register: function (name, val) {
                this.useRegister(name);
                this.source.push(name + " = " + val + ";")
            },
            useRegister: function (name) {
                if (!this.registers[name]) {
                    this.registers[name] = true;
                    this.registers.list.push(name)
                }
            },
            pushStackLiteral: function (item) {
                return this.push(new Literal(item))
            },
            pushStack: function (item) {
                this.flushInline();
                var stack = this.incrStack();
                if (item) {
                    this.source.push(stack + " = " + item + ";")
                }
                this.compileStack.push(stack);
                return stack
            },
            replaceStack: function (callback) {
                var prefix = "",
                    inline = this.isInline(),
                    stack;
                if (inline) {
                    var top = this.popStack(true);
                    if (top instanceof Literal) {
                        stack = top.value
                    } else {
                        var name = this.stackSlot ? this.topStackName() : this.incrStack();
                        prefix = "(" + this.push(name) + " = " + top + "),";
                        stack = this.topStack()
                    }
                } else {
                    stack = this.topStack()
                }
                var item = callback.call(this, stack);
                if (inline) {
                    if (this.inlineStack.length || this.compileStack.length) {
                        this.popStack()
                    }
                    this.push("(" + prefix + item + ")")
                } else {
                    if (!/^stack/.test(stack)) {
                        stack = this.nextStack()
                    }
                    this.source.push(stack + " = (" + prefix + item + ");")
                }
                return stack
            },
            nextStack: function () {
                return this.pushStack()
            },
            incrStack: function () {
                this.stackSlot++;
                if (this.stackSlot > this.stackVars.length) {
                    this.stackVars.push("stack" + this.stackSlot)
                }
                return this.topStackName()
            },
            topStackName: function () {
                return "stack" + this.stackSlot
            },
            flushInline: function () {
                var inlineStack = this.inlineStack;
                if (inlineStack.length) {
                    this.inlineStack = [];
                    for (var i = 0, len = inlineStack.length; i < len; i++) {
                        var entry = inlineStack[i];
                        if (entry instanceof Literal) {
                            this.compileStack.push(entry)
                        } else {
                            this.pushStack(entry)
                        }
                    }
                }
            },
            isInline: function () {
                return this.inlineStack.length
            },
            popStack: function (wrapped) {
                var inline = this.isInline(),
                    item = (inline ? this.inlineStack : this.compileStack).pop();
                if (!wrapped && item instanceof Literal) {
                    return item.value
                } else {
                    if (!inline) {
                        this.stackSlot--
                    }
                    return item
                }
            },
            topStack: function (wrapped) {
                var stack = this.isInline() ? this.inlineStack : this.compileStack,
                    item = stack[stack.length - 1];
                if (!wrapped && item instanceof Literal) {
                    return item.value
                } else {
                    return item
                }
            },
            quotedString: function (str) {
                return '"' + str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029") + '"'
            },
            setupHelper: function (paramSize, name, missingParams) {
                var params = [];
                this.setupParams(paramSize, params, missingParams);
                var foundHelper = this.nameLookup("helpers", name, "helper");
                return {
                    params: params,
                    name: foundHelper,
                    callParams: ["depth0"].concat(params).join(", "),
                    helperMissingParams: missingParams && ["depth0", this.quotedString(name)].concat(params).join(", ")
                }
            },
            setupParams: function (paramSize, params, useRegister) {
                var options = [],
                    contexts = [],
                    types = [],
                    param, inverse, program;
                options.push("hash:" + this.popStack());
                inverse = this.popStack();
                program = this.popStack();
                if (program || inverse) {
                    if (!program) {
                        this.context.aliases.self = "this";
                        program = "self.noop"
                    }
                    if (!inverse) {
                        this.context.aliases.self = "this";
                        inverse = "self.noop"
                    }
                    options.push("inverse:" + inverse);
                    options.push("fn:" + program)
                }
                for (var i = 0; i < paramSize; i++) {
                    param = this.popStack();
                    params.push(param);
                    if (this.options.stringParams) {
                        types.push(this.popStack());
                        contexts.push(this.popStack())
                    }
                }
                if (this.options.stringParams) {
                    options.push("contexts:[" + contexts.join(",") + "]");
                    options.push("types:[" + types.join(",") + "]");
                    options.push("hashContexts:hashContexts");
                    options.push("hashTypes:hashTypes")
                }
                if (this.options.data) {
                    options.push("data:data")
                }
                options = "{" + options.join(",") + "}";
                if (useRegister) {
                    this.register("options", options);
                    params.push("options")
                } else {
                    params.push(options)
                }
                return params.join(", ")
            }
        };
        var reservedWords = ("break else new var" + " case finally return void" + " catch for switch while" + " continue function this with" + " default if throw" + " delete in try" + " do instanceof typeof" + " abstract enum int short" + " boolean export interface static" + " byte extends long super" + " char final native synchronized" + " class float package throws" + " const goto private transient" + " debugger implements protected volatile" + " double import public let yield").split(" ");
        var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};
        for (var i = 0, l = reservedWords.length; i < l; i++) {
            compilerWords[reservedWords[i]] = true
        }
        JavaScriptCompiler.isValidJavaScriptVariableName = function (name) {
            if (!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name)) {
                return true
            }
            return false
        };
        Handlebars.precompile = function (input, options) {
            if (input == null || typeof input !== "string" && input.constructor !== Handlebars.AST.ProgramNode) {
                throw new Handlebars.Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + input)
            }
            options = options || {};
            if (!("data" in options)) {
                options.data = true
            }
            var ast = Handlebars.parse(input);
            var environment = (new Compiler).compile(ast, options);
            return (new JavaScriptCompiler).compile(environment, options)
        };
        Handlebars.compile = function (input, options) {
            if (input == null || typeof input !== "string" && input.constructor !== Handlebars.AST.ProgramNode) {
                throw new Handlebars.Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input)
            }
            options = options || {};
            if (!("data" in options)) {
                options.data = true
            }
            var compiled;

            function compile() {
                var ast = Handlebars.parse(input);
                var environment = (new Compiler).compile(ast, options);
                var templateSpec = (new JavaScriptCompiler).compile(environment, options, undefined, true);
                return Handlebars.template(templateSpec)
            }
            return function (context, options) {
                if (!compiled) {
                    compiled = compile()
                }
                return compiled.call(this, context, options)
            }
        };
        Handlebars.VM = {
            template: function (templateSpec) {
                var container = {
                    escapeExpression: Handlebars.Utils.escapeExpression,
                    invokePartial: Handlebars.VM.invokePartial,
                    programs: [],
                    program: function (i, fn, data) {
                        var programWrapper = this.programs[i];
                        if (data) {
                            programWrapper = Handlebars.VM.program(i, fn, data)
                        } else if (!programWrapper) {
                            programWrapper = this.programs[i] = Handlebars.VM.program(i, fn)
                        }
                        return programWrapper
                    },
                    merge: function (param, common) {
                        var ret = param || common;
                        if (param && common) {
                            ret = {};
                            Handlebars.Utils.extend(ret, common);
                            Handlebars.Utils.extend(ret, param)
                        }
                        return ret
                    },
                    programWithDepth: Handlebars.VM.programWithDepth,
                    noop: Handlebars.VM.noop,
                    compilerInfo: null
                };
                return function (context, options) {
                    options = options || {};
                    var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
                    var compilerInfo = container.compilerInfo || [],
                        compilerRevision = compilerInfo[0] || 1,
                        currentRevision = Handlebars.COMPILER_REVISION;
                    if (compilerRevision !== currentRevision) {
                        if (compilerRevision < currentRevision) {
                            var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision],
                                compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
                            throw "Template was precompiled with an older version of Handlebars than the current runtime. " + "Please update your precompiler to a newer version (" + runtimeVersions + ") or downgrade your runtime to an older version (" + compilerVersions + ")."
                        } else {
                            throw "Template was precompiled with a newer version of Handlebars than the current runtime. " + "Please update your runtime to a newer version (" + compilerInfo[1] + ")."
                        }
                    }
                    return result
                }
            },
            programWithDepth: function (i, fn, data) {
                var args = Array.prototype.slice.call(arguments, 3);
                var program = function (context, options) {
                    options = options || {};
                    return fn.apply(this, [context, options.data || data].concat(args))
                };
                program.program = i;
                program.depth = args.length;
                return program
            },
            program: function (i, fn, data) {
                var program = function (context, options) {
                    options = options || {};
                    return fn(context, options.data || data)
                };
                program.program = i;
                program.depth = 0;
                return program
            },
            noop: function () {
                return ""
            },
            invokePartial: function (partial, name, context, helpers, partials, data) {
                var options = {
                    helpers: helpers,
                    partials: partials,
                    data: data
                };
                if (partial === undefined) {
                    throw new Handlebars.Exception("The partial " + name + " could not be found")
                } else if (partial instanceof Function) {
                    return partial(context, options)
                } else if (!Handlebars.compile) {
                    throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode")
                } else {
                    partials[name] = Handlebars.compile(partial, {
                        data: data !== undefined
                    });
                    return partials[name](context, options)
                }
            }
        };
        Handlebars.template = Handlebars.VM.template
    })(Handlebars);
    window.Handlebars = Handlebars;
    return Handlebars
});
define("option_image_collection", ["backbone", "option_image_model"], function (Backbone, OptionImageModel) {
    "use strict";
    var OptionImageCollection = Backbone.Collection.extend({
        model: OptionImageModel
    });
    return OptionImageCollection
});
define("order_swatches_form_model", ["jquery", "backbone", "wayfair"], function ($, Backbone, wf) {
    "use strict";
    var successMessage;
    if (wf.constants.STORE_ID === wf.constants.BIRCH_ID) {
        successMessage = "Thank you! Your order will ship out within 48 hours."
    } else {
        successMessage = "Thank you! Your order has been received."
    }
    var OrderSwatchesFormModel = Backbone.Model.extend({
        defaults: {
            successMessageText: successMessage,
            errorMessageArray: []
        },
        submit: function (formNode) {
            var dfd = $.Deferred();
            this.set({
                errorMessageArray: []
            });
            $.ajax({
                type: "post",
                url: formNode.attr("target"),
                data: formNode.serialize(),
                dataType: "json",
                context: this
            }).done(function (dataObj) {
                if (!dataObj.valid) {
                    this.set({
                        errorMessageArray: dataObj.errors
                    })
                }
                dfd.resolve()
            });
            return dfd.promise()
        }
    });
    return OrderSwatchesFormModel
});
define("swatch_collection", ["backbone", "swatch_model"], function (Backbone, SwatchModel) {
    "use strict";
    var SwatchCollection = Backbone.Collection.extend({
        model: SwatchModel,
        comparator: function (swatchModelA, swatchModelB) {
            var aFamily = swatchModelA.get("family_name"),
                bFamily = swatchModelB.get("family_name");
            if (aFamily === bFamily) {
                return 0
            } else if (aFamily === "none") {
                return 1
            } else if (bFamily === "none") {
                return -1
            } else {
                return aFamily < bFamily ? -1 : 1
            }
        }
    });
    return SwatchCollection
});
define("add_installation_service_model", ["jquery", "underscore", "wf_model_base", "validation_required", "validation_postal_code", "add_installation_event_bus"], function ($, _, Model, requiredValidator, postalCodeValidator, AddInstallationEventBus) {
    "use strict";
    var AddInstallationServiceModel = Model.extend({
        validation: {
            customer_zip_code: {
                validators: [{
                    fn: requiredValidator,
                    fail: "Zip Code Required"
                }, {
                    fn: postalCodeValidator,
                    fail: "Incorrect format. Please re-enter",
                    preValidate: true
                }]
            }
        },
        defaults: {
            installation_service: true,
            product_sku: "",
            product_name: "",
            product_sale_price: 0,
            product_ships_via_id: 0,
            price: 0,
            hidden: true,
            showMoreInfo: false,
            customer_zip_code: "",
            showServiceAvailableIcon: false,
            showServiceUnavailableMsg: false,
            showWhatsIncludedModal: true,
            show_custom_quote: false,
            serviceChecked: false,
            error_message: false
        },
        validateForm: function () {
            var self = this;
            if (!this.isValid()) {
                _.each(this.validation, function (obj, prop) {
                    if (self.validationError[prop]) {
                        self.set("error_message", self.validationError[prop][0]);
                        self.set("showServiceAvailableIcon", false);
                        self.set("showServiceUnavailableMsg", false);
                        self.set("hasGiftWithPurchase", false)
                    }
                });
                return false
            }
            return true
        },
        updateKitInstallationPrices: function (parentSku, kitId, kitChildren, isDesktop) {
            var baseMinPrice = this.get("base_price");
            var baseMaxPrice = this.get("base_max_price");
            if ($(".js-porch-checkbox-view").length > 0 || $("[data-section='porch_service']").length > 0) {
                if (kitId || kitChildren) {
                    var childInfo = [];
                    kitChildren.forEach(function (kitChild) {
                        var childQuantity = isDesktop ? kitChild.get("qty") : kitChild.get("selectedQuantity");
                        childInfo.push({
                            sku: kitChild.get("sku"),
                            quantity: childQuantity
                        })
                    });
                    this.fetch({
                        url: "/a/porch/service/get_installation_prices",
                        method: "GET",
                        data: {
                            product_sku: parentSku,
                            child_info: childInfo
                        },
                        success: function (data) {
                            if (!$.isEmptyObject(data)) {
                                var minPrice = data.get("min_price");
                                var maxPrice = data.get("max_price");
                                if (minPrice === 0 || maxPrice === 0) {
                                    minPrice = baseMinPrice;
                                    maxPrice = baseMaxPrice
                                }
                                AddInstallationEventBus.trigger(AddInstallationEventBus.UPDATE_INSTALL_PRICE_KITS, minPrice, maxPrice)
                            }
                        }
                    })
                }
            }
        }
    }, {
        debugName: "AddInstallationServiceModel"
    });
    return AddInstallationServiceModel
});
define("wf_carousel_view_base", ["jquery", "underscore", "backbone", "wf_tungsten_view_base", "wf_carousel_api", "wf_utils", "wf_scheduler", "wf_carousel_model", "featuredetect"], function ($, _, Backbone, BaseView, wfCarouselApi, wfUtils, wfScheduler, CarouselModel, featuredetect) {
    "use strict";
    var CarouselView = BaseView.extend({
        events: {
            "click .js-scroll-prev": "_scrollPrev",
            "click .js-scroll-next": "_scrollNext"
        },
        initDebug: function () {
            if (this.compiledTemplate) {
                BaseView.prototype.initDebug.call(this)
            }
        },
        positionProperty: "scrollIndex",
        mixins: [wfCarouselApi],
        postInitialize: function () {
            if (!this.model) {
                this.model = new CarouselModel(this.options)
            }
            this._setup();
            this.model.trigger("change:" + this.positionProperty);
            this.scrolling = false
        },
        targetInThisCarousel: function (targetEl) {
            var slider = $(targetEl).closest(".js-carousel-slider");
            return slider[0] === this.carouselSlider[0]
        },
        _initializeSettings: function () {
            this.useCSSTransitions = featuredetect.supportsCssTransforms3d && featuredetect.supportsCssTransitions;
            this.resetSliderWidth = this.model.get("resetSliderWidth");
            this.isVertical = this.model.get("isVertical");
            this.itemSizeMethod = this.isVertical ? "outerHeight" : "outerWidth";
            this.wrapperSizeMethod = this.isVertical ? "height" : "width";
            var self = this;
            this.carouselWrapper = this.$el.find(".js-carousel-content").first();
            this.carouselSlider = this.carouselWrapper.find(".js-carousel-slider").first();
            this.items = this.carouselSlider.find(".js-carousel-item").filter(function (i, el) {
                var slider = $(el).closest(".js-carousel-slider");
                return slider[0] === self.carouselSlider[0]
            });
            this.numItems = this.items.length;
            this.carouselWrapperSize = this.carouselWrapper[this.wrapperSizeMethod]();
            this.itemSize = this.items.eq(0)[this.itemSizeMethod](true) || this.options.width || this.carouselWrapperSize;
            this.carouselSize = this.itemSize * this.numItems;
            this.carouselWrapper.off("scroll.carousel");
            this.carouselWrapper.on("scroll.carousel", _.bind(this._preventFocusScroll, this));
            this.carouselPrev = this.$el.find(".js-scroll-prev");
            this.carouselNext = this.$el.find(".js-scroll-next")
        },
        _initializeItems: function () {
            this.model.set("itemSize", this.itemSize);
            var itemPositions = new Array(this.items.length);
            this.carouselSize = 0;
            for (var i = 0; i < this.numItems; i++) {
                itemPositions[i] = -this.carouselSize;
                this.carouselSize += this.items.eq(i)[this.itemSizeMethod](true)
            }
            this.model.set("itemPositions", itemPositions);
            this.setBounds();
            var maxScroll = this.model.get("maxScroll");
            this.model.set("maxIndex", maxScroll / -this.itemSize | 0);
            this.carouselSlider.css(this.wrapperSizeMethod, this.carouselSize);
            if (this.carouselSize <= this.carouselWrapperSize) {
                var disabledClass = this.model.get("disabledClass");
                this.carouselNext.addClass(disabledClass);
                this.carouselPrev.addClass(disabledClass);
                this.model.set("maxIndex", 0)
            }
        },
        setBounds: function () {
            var maxScroll = this.carouselWrapperSize - this.carouselSize;
            if (maxScroll > 0) {
                maxScroll = maxScroll / -2
            }
            this.model.set("maxScroll", maxScroll);
            var itemPositions = this.model.get("itemPositions");
            var touchBounds = [];
            touchBounds[1] = this.model.get("overscrollPercentage") / 50 * itemPositions[1] / -2;
            touchBounds[0] = maxScroll - touchBounds[1];
            this.model.set("touchBounds", touchBounds)
        },
        _initializeWrap: function () {
            var i, items = [],
                frontBufferItems = [],
                endBufferItems = [],
                dummyBuffer = this.model.get("dummyBuffer"),
                pageSize = Math.ceil(this.carouselWrapperSize / this.itemSize);
            this.model.set("wrapBuffer", 1);
            this.model.set("pageSize", pageSize);
            for (i = 0; i < pageSize; i++) {
                items[i] = this.items.eq(i).clone()
            }
            for (i = 0; i < dummyBuffer; i++) {
                frontBufferItems[i] = this.items.eq(this.items.length - pageSize + i).clone().removeClass("js-carousel-item");
                endBufferItems[i] = this.items.eq(i + pageSize).clone().removeClass("js-carousel-item")
            }
            this.carouselSlider.append(items);
            this.carouselSlider.prepend(frontBufferItems);
            this.carouselSlider.append(endBufferItems);
            this._initializeSettings()
        },
        _setup: function () {
            this._initializeSettings();
            if (this.numItems === 0) {
                return
            }
            if (this.model.get("wrapCarousel")) {
                this._initializeWrap()
            }
            this._initializeItems();
            this._scrollTo(this.model.get(this.positionProperty), 0)
        },
        _scrollTo: function (index, duration) {
            if (!this.scrolling) {
                this.scrolling = true;
                var wrapCarousel = this.model.get("wrapCarousel");
                var maxIndex = this.model.get("maxIndex");
                var scrollIndex = wfUtils.bound(index, 0, maxIndex);
                var scrollPos = wfUtils.bound(index * -this.model.get("itemSize"), this.model.get("maxScroll"), 0);
                scrollPos += this.model.get("dummyBuffer") * -this.model.get("itemSize");
                var easing = this.model.get("easing");
                duration = duration == null ? this.model.get("slideDuration") : duration;
                this.model.set(this.positionProperty, scrollIndex);
                this.model.set("scrollPos", scrollPos);
                if (!wrapCarousel) {
                    var disabledClass = this.model.get("disabledClass");
                    this.carouselPrev.toggleClass(disabledClass, scrollIndex === 0);
                    this.carouselNext.toggleClass(disabledClass, scrollIndex === maxIndex)
                }
                var newPosition = this._transformGetNewPosition(scrollPos);
                if (duration > 0) {
                    this._transformAnimate(newPosition, duration, easing)
                } else {
                    this.carouselSlider.css(newPosition);
                    this.scrolling = false
                }
            }
        },
        _doneTransition: function () {
            var wrapCarousel = this.model.get("wrapCarousel");
            var maxIndex = this.model.get("maxIndex");
            var currentIndex = this.model.get(this.positionProperty);
            this.scrolling = false;
            if (wrapCarousel && currentIndex === maxIndex) {
                this._scrollTo(0, 0)
            }
            var scrollIndex = this.model.get(this.positionProperty);
            var scrollBy = this.model.get("scrollBy");
            this.trigger("changedSlide", scrollIndex / scrollBy, scrollIndex)
        },
        _scrollBy: function (val) {
            if (!this.scrolling) {
                var scrollBy = this.model.get("scrollBy");
                var currentIndex = this.model.get(this.positionProperty);
                var newIndex = currentIndex + scrollBy * val;
                var maxIndex = this.model.get("maxIndex");
                var wrapCarousel = this.model.get("wrapCarousel");
                if (wrapCarousel && currentIndex === 0 && newIndex < 0) {
                    this._scrollTo(maxIndex, 0);
                    newIndex = maxIndex + scrollBy * val
                } else if (wrapCarousel && currentIndex === maxIndex && newIndex > maxIndex) {
                    this._scrollTo(0, 0);
                    newIndex = scrollBy * val
                }
                if (!wrapCarousel) {
                    if (newIndex < 0) {
                        newIndex = 0
                    }
                    if (newIndex > maxIndex) {
                        newIndex = maxIndex
                    }
                }
                if (newIndex >= 0 && newIndex <= maxIndex) {
                    var self = this;
                    setTimeout(function () {
                        self._scrollTo(newIndex)
                    })
                }
            }
        },
        _scrollNext: function (evt) {
            if (evt) {
                evt.preventDefault()
            }
            this._scrollBy(1)
        },
        _scrollPrev: function (evt) {
            if (evt) {
                evt.preventDefault()
            }
            this._scrollBy(-1)
        },
        _preventFocusScroll: function () {
            var isVertical = this.model.get("isVertical");
            var scrollProp = isVertical ? "scrollTop" : "scrollLeft";
            this.carouselWrapper.prop(scrollProp, 0)
        },
        _transformAdjustInitialItems: function () {
            if (this.useCSSTransitions) {
                var translatePosition = "translate3d(0, 0, 0)";
                this.items.css({
                    MozTransform: translatePosition,
                    WebkitTransform: translatePosition,
                    msTransform: translatePosition,
                    tranform: translatePosition
                })
            }
        },
        _transformGetNewPosition: function (scrollPos) {
            var newPosition = {};
            var isVertical = this.model.get("isVertical");
            if (this.useCSSTransitions) {
                var translatePosition = isVertical ? "translate3d(0, " + scrollPos + "px, 0)" : "translate3d(" + scrollPos + "px, 0, 0)";
                newPosition.transform = translatePosition;
                newPosition.MozTransform = translatePosition;
                newPosition.WebkitTransform = translatePosition;
                newPosition.msTransform = translatePosition;
                newPosition.WebkitTransition = "-webkit-transform 0ms";
                newPosition.transition = "transform 0ms";
                newPosition.WebkitTransitionTimingFunction = "ease-in-out";
                newPosition.transitionTimingFunction = "ease-in-out"
            } else {
                newPosition[isVertical ? "top" : "left"] = scrollPos
            }
            return newPosition
        },
        _transformAnimate: function (newPosition, duration, easing) {
            var self = this;
            if (self.useCSSTransitions) {
                newPosition.WebkitTransition = "-webkit-transform " + duration + "ms";
                newPosition.transition = "transform " + duration + "ms";
                self.carouselSlider.css(newPosition);
                setTimeout(function () {
                    self._doneTransition.call(self)
                }, duration)
            } else {
                self.carouselSlider.stop().animate(newPosition, duration, easing, _.bind(self._doneTransition, self))
            }
        }
    });
    wfScheduler.queuePostLoadTask(function () {
        var carousels = $(".js-auto-carousel");
        _.each(carousels, function (elem) {
            var opts = $(elem).data();
            opts.el = elem;
            new CarouselView(opts)
        })
    });
    return CarouselView
});
define("wf_carousel_api", [], function () {
    "use strict";
    var exports = {};
    exports.getWrapBufferPageCount = function () {
        return this.model.get("wrapBuffer") || 0
    };
    exports.getCurrentIndex = function () {
        return this.model.get("scrollIndex")
    };
    exports.getCurrentPageIndex = function () {
        return this.model.get("scrollIndex") / this.model.get("scrollBy")
    };
    exports.getMaxIndex = function () {
        return this.model.get("maxIndex")
    };
    exports.getMaxPage = function () {
        var maxIndex = this.model.get("maxIndex");
        var scrollBy = this.model.get("scrollBy");
        return Math.ceil(maxIndex / scrollBy)
    };
    exports.advanceSlide = function (val) {
        this._scrollBy(val);
        return this
    };
    exports.next = function () {
        return this.advanceSlide(1)
    };
    exports.prev = function () {
        return this.advanceSlide(-1)
    };
    exports.goToSlide = function (index) {
        this._scrollTo(index);
        return this
    };
    exports.goToPage = function (index) {
        this._scrollTo(index * this.model.get("scrollBy"));
        return this
    };
    exports.getSlides = function () {
        return this.items
    };
    exports.getSlideCount = function () {
        return this.items.length
    };
    exports.getNumberItemsPerPage = function () {
        return this.model.get("numItemsPerPage")
    };
    exports.reinit = function () {
        this._setup();
        return this
    };
    exports.disable = function () {
        this.undelegateEvents();
        this.trigger("disable");
        return this
    };
    exports.enable = function () {
        this.delegateEvents();
        this.trigger("enable");
        return this
    };
    exports.updateScrollBy = function (scrollBy) {
        this.model.set("scrollBy", scrollBy);
        return this
    };
    exports.replaceItems = function (html) {
        var self = this;
        if (html) {
            var firstItem = self.items.eq(0);
            firstItem.before(html);
            self.items.remove();
            self.reinit()
        }
        return this
    };
    exports.setSlideOwner = function (slideNumber, slideOwnerDetails) {
        var slideOwners = this.model.get("slideOwners");
        if (!slideOwners) {
            slideOwners = []
        }
        slideOwners[slideNumber] = slideOwnerDetails;
        this.model.set("slideOwners", slideOwners)
    };
    exports.getSlideOwner = function (slideNumber) {
        var slideOwners = this.model.get("slideOwners");
        if (slideOwners && slideNumber in slideOwners) {
            return slideOwners[slideNumber]
        }
        return null
    };
    return exports
});
define("favorites_item_collection", ["wf_collection_base", "favorites_item_model"], function (BaseCollection, ItemModel) {
    "use strict";
    return BaseCollection.extend({
        model: ItemModel,
        findItem: function (item) {
            var itemHash = item.get("hash");
            return this.find(function (compItem) {
                return itemHash === compItem.get("hash")
            })
        }
    })
});
define("favorites_event_bus", ["delayed_event_bus", "underscore"], function (DelayedEventBus, _) {
    "use strict";
    var FavEventBus = _.extend({}, DelayedEventBus);
    FavEventBus.AJAX_INITIAL_LOAD = "ajax_inital_load";
    FavEventBus.AJAX_ADD_ITEM = "ajax_add_item";
    FavEventBus.AJAX_CREATE_LIST = "ajax_create_list";
    FavEventBus.AJAX_REMOVE_ITEMS = "ajax_remove_items";
    FavEventBus.OTHER_MODAL_OPEN = "other_modal_open";
    FavEventBus.MODAL_OPEN = "modal_open";
    FavEventBus.BUTTON_CLICKED = "button_clicked";
    FavEventBus.OPTIONS_CHANGED = "options_changed";
    FavEventBus.ITEM_ADDED = "item_added";
    FavEventBus.LIST_CREATED = "list_created";
    FavEventBus.ITEM_REMOVED = "item_removed";
    FavEventBus.MODAL_DONE = "modal_done";
    FavEventBus.LOGIN_REDIRECT = "login_redirect";
    FavEventBus.UNFINISHED_SAVE_COMPLETE = "unfinished_save_complete";
    FavEventBus.UNFINISHED_SAVE_ACTION_NEEDED = "unfinished_save_action_needed";
    FavEventBus.REFRESH_BUTTONS = "refresh_buttons";
    FavEventBus.MODAL_PREVIOUS = "modal_previous";
    FavEventBus.MODAL_RENDERED = "modal_rendered";
    FavEventBus.MODAL_CLOSE = "modal_close";
    FavEventBus.SWITCH_TO_SAVE = "switch_to_save";
    FavEventBus.SWITCH_TO_CONFIRM = "switch_to_confirm";
    FavEventBus.SHOW_NOTIFICATIONS_BUBBLE = "show_notifications_bubble";
    FavEventBus.HIDE_NOTIFICATIONS_BUBBLE = "hide_notifications_bubble";
    FavEventBus.PASS_ITEM = "pass_item";
    FavEventBus.BOARD_FILTER_CLICK = "click_board_filter";
    FavEventBus.ADMIN_GRID_SAVE_ORDER = "admin_grid_save_order";
    FavEventBus.EDIT_ITEMS_MODE = "edit_items_mode";
    FavEventBus.CHECK_LIST_TABLE_MODE = "check_list_table_mode";
    FavEventBus.SHOW_ACTION_TOOLTIP = "show_action_tooltip";
    return FavEventBus
});
define("favorites_configure_product", ["wayfair", "jquery"], function (wf, $) {
    "use strict";

    function configureFavoritedProduct(itemID) {
        var promise = $.Deferred(),
            form;
        if (itemID) {
            if (wf.appData.pageAlias === "ProductPage") {
                form = $("#AddToCartForm")
            } else if (wf.appData.pageAlias === "DailyfairPDP") {
                form = $("#atc")
            } else {
                form = $("#PopupAddToCartForm")
            }
            if (form && form.length > 0) {
                var formData = [];
                formData.push({
                    name: "atc_type",
                    value: "board_configuration"
                }, {
                    name: "board_product_id",
                    value: itemID
                });
                $.each(form.serializeArray(), function (index, element) {
                    if (element.name === "PiID") {
                        formData.push({
                            name: "PiID[]",
                            value: element.value
                        })
                    } else {
                        formData.push(element)
                    }
                });
                $.ajax({
                    type: "POST",
                    url: wf.constants.STORE_URL + "/session/public/add_item.php",
                    data: formData,
                    dataType: "json"
                }).done(promise.resolve).fail(function (msg) {
                    promise.reject({
                        msg: msg
                    })
                })
            } else {
                promise.reject("Product Configuration Form not found")
            }
        } else {
            promise.reject("Must provide Item ID")
        }
        return promise.promise()
    }
    return configureFavoritedProduct
});
define("wf_mobile_model_base", ["wayfair", "jquery", "underscore", "wf_model_base", "wf_router_events"], function (wf, $, _, BaseModel, RouterEvents) {
    "use strict";
    var MobileModelBase = BaseModel.extend({
        incomplete: false,
        postLoadData: _.noop,
        prepareData: _.identity,
        url: function () {
            return this.targetUrl || window.location.href
        },
        postInitialize: function () {
            this.options = this.options || {};
            if (this.dataName) {
                this.options.dataName = this.dataName
            }
        },
        loadData: function (data, forceModelUpdate, targetUrl) {
            var dfd = $.Deferred(),
                self = this;
            this.targetUrl = targetUrl;
            if (data && !forceModelUpdate) {
                data = self.prepareData(data);
                self.set(data);
                dfd.resolve(self)
            } else {
                self.lookup({
                    forceUpdate: forceModelUpdate
                }).done(function (response) {
                    if (!response) {
                        self.lookupFail()
                    } else {
                        var spaData = response.spa_data || {};
                        if (spaData.tracking_data) {
                            wf.constants.TRANSACTION_ID = spaData.tracking_data.new_txid;
                            if (spaData.tracking_data.ga_data) {
                                spaData.tracking_data.gaPageType = spaData.tracking_data.ga_data.page_type
                            }
                        }
                        if (spaData.tracking_data || spaData.tracking_footer) {
                            RouterEvents.registerTrackingInfo({
                                trackingData: spaData.tracking_data,
                                shouldFire: true,
                                trackingFooter: spaData.tracking_footer
                            })
                        }
                        if (spaData.page_title) {
                            RouterEvents.triggerTitleChange(spaData.page_title)
                        }
                        dfd.resolve(self)
                    }
                }).fail(function (jqXHR) {
                    if (jqXHR.statusText === "abort") {
                        return
                    }
                    wf.logger.useLogger("JS_SPA_LOGGER").info("Could not load data for route " + document.location.href + " via SPA . Falling back to " + targetUrl, {
                        "@serverResponse": jqXHR.responseText,
                        "@status": jqXHR.status + ":" + jqXHR.statusText
                    });
                    setTimeout(function () {
                        window.location.href = targetUrl
                    }, 100)
                })
            }
            dfd.done(function () {
                self.postLoadData()
            });
            return dfd.promise()
        },
        lookupFail: function (response) {
            var self = this;
            wf.logger.useLogger("JS_SPA_LOGGER").info("Empty response. Could not load data for route " + document.location.href + " via SPA . Falling back to " + self.url, {
                "@serverResponse": response ? response.responseText : "",
                "@status": response ? response.status + ":" + response.statusText : ""
            });
            setTimeout(function () {
                window.location.href = self.url
            }, 100);
            return
        },
        parse: function (response) {
            if (!response) {
                this.lookupFail(response)
            } else {
                var spaData = response.spa_data || {};
                if (spaData.tracking_data || spaData.tracking_footer) {
                    RouterEvents.registerTrackingInfo({
                        trackingData: spaData.tracking_data,
                        trackingFooter: spaData.tracking_footer
                    })
                }
                if (spaData.page_title) {
                    RouterEvents.triggerTitleChange(spaData.page_title)
                }
                this.set("spa_data", spaData);
                return this.prepareData(response)
            }
        },
        sync: function (method, model, options) {
            return wf.Pace ? wf.Pace.track(_.bind(BaseModel.prototype.sync, this, method, model, options)) : BaseModel.prototype.sync.apply(this, [method, model, options])
        },
        getParamsObjectByArguments: function (args, paramNames) {
            var paramsObj = {},
                i = 0;
            while (args[i] && args[i].length && paramNames[i]) {
                paramsObj[paramNames[i]] = args[i];
                i++
            }
            return paramsObj
        },
        getFormattedQuerystring: function (paramsObj, extraParams) {
            var delimeter = "&";
            var params = "?_client=phone";
            if (paramsObj && !_.isEmpty(paramsObj)) {
                params += delimeter + $.param(paramsObj)
            }
            if (extraParams && extraParams.length > 0) {
                params += delimeter + extraParams
            }
            return params
        }
    });
    return MobileModelBase
});
define("wf_toast_popup_model", ["wf_popup_model", "underscore"], function (PopupModel, _) {
    "use strict";
    var ToastPopupModel = PopupModel.extend({
        defaults: _.defaults({
            duration: 3e3,
            url: "",
            transitionClass: "modal_transition_bottom",
            modalClass: "",
            showClose: false,
            autoOpen: true
        }, PopupModel.prototype.defaults)
    });
    return ToastPopupModel
});
define("@Templates/common/modals/basic_tooltip_view", ["underscore", "tungstenjs"], function (_, tungstenjs) {
    var Template = tungstenjs._template,
        template = new Template([{
            t: 7,
            e: "div",
            a: {
                "class": ["Tooltip ", {
                    t: 2,
                    r: "modalClass"
                }, ""]
            },
            f: ["\n  ", {
                t: 4,
                r: "showClose",
                f: ["\n  ", {
                    t: 7,
                    e: "span",
                    a: {
                        "class": ["Tooltip-close js-modal-close wficonfont ", {
                            t: 4,
                            r: "spv2Tracking",
                            f: ["js-track-event"]
                        }, ""]
                    },
                    m: [{
                        t: 4,
                        r: "spv2Tracking",
                        f: ['data-event-name="', {
                            t: 2,
                            r: "spv2EventName"
                        }, '"']
                    }],
                    f: [{
                        t: 1,
                        r: "",
                        n: "&#58953;"
                    }]
                }, "\n  "]
            }, "\n  ", {
                t: 7,
                e: "div",
                a: {
                    "class": "Tooltip-inner"
                },
                f: ["\n    ", {
                    t: 3,
                    r: "content"
                }, "\n  "]
            }, "\n"]
        }, "\n"]);
    template.register("common/modals/basic_tooltip");
    var output = function (data) {
        return template.toString(data, !0)
    };
    return output.toDom = _.bind(template.toDom, template), output.toVdom = _.bind(template.toVdom, template), output.attachView = _.bind(template.attachView, template), output.wrap = _.bind(template.wrap, template), output
});
define("option_image_model", ["backbone"], function (Backbone) {
    "use strict";
    var OptionImageModel = Backbone.Model.extend({
        defaults: {
            small_image_url: "",
            large_image_url: "",
            overlayText: "",
            captionText: "",
            b_is_zoomable: false,
            b_use_overlay: false,
            sku: "",
            option_string: ""
        }
    });
    return OptionImageModel
});
define("swatch_model", ["backbone"], function (Backbone) {
    "use strict";
    var SwatchModel = Backbone.Model.extend({
        defaults: {
            option_id: 0,
            sw_id: 0,
            name: "",
            family_name: "",
            large_image_url: "",
            small_image_url: "",
            b_is_zoomable: false,
            b_is_orderable: false,
            sku: "",
            option_category: "",
            preselect: false
        }
    });
    return SwatchModel
});
define("validation_required", [], function () {
    "use strict";
    var exports = function (val) {
        var valType = typeof val;
        if (val == null) {
            return false
        } else if (valType === "string") {
            return !!val.trim()
        } else if (val instanceof Date) {
            return true
        } else if (valType === "boolean") {
            return val
        } else if (Array.isArray(val)) {
            return val.length > 0
        } else if (valType === "number") {
            return !isNaN(val)
        } else if (val === Object(val)) {
            for (var attr in val) {
                return true
            }
            return false
        }
    };
    return exports
});
define("validation_postal_code", ["wayfair", "validation_regex", "validation_regex_patterns"], function (wf, validationRegex, regexPatterns) {
    "use strict";
    var exports = function (value) {
        var message;
        var store = wf.constants.STORE_ID;
        var usStoreIds = [wf.constants.WAYFAIR_ID, wf.constants.ALLMODERN_ID, wf.constants.JOSSMAIN_ID, wf.constants.WAYFAIR_SUPPLY_ID, wf.constants.DWELL_ID, wf.constants.DWELL_WS_ID, wf.constants.DWELL_RT_ID, wf.constants.BIRCH_ID, wf.constants.JOSSANDMAIN_ID];
        if (!store || usStoreIds.indexOf(store) > -1) {
            if (!validationRegex(value, regexPatterns.usPostalCode)) {
                message = "Please enter a valid 5 digit US zip code"
            }
        } else if (store === wf.constants.WAYFAIR_CA_ID) {
            if (!validationRegex(value, regexPatterns.canadianPostalCode)) {
                message = "Please enter a valid canadian postal code"
            }
        }
        return message || true
    };
    return exports
});
define("add_installation_event_bus", ["wf_events", "underscore"], function (WayfairEvents, _) {
    "use strict";
    var AddInstallationEventBus = _.extend({}, WayfairEvents);
    AddInstallationEventBus.ADD_INSTALLATION_CHECKED = "add_installation_checked";
    AddInstallationEventBus.UPDATE_ZIP_CODE = "update_zip_code";
    AddInstallationEventBus.UPDATE_INSTALL_PRICE = "update_install_price";
    AddInstallationEventBus.UPDATE_INSTALL_PRICE_KITS = "update_install_price_kits";
    AddInstallationEventBus.VALIDATE_FORM = "validate_form";
    AddInstallationEventBus.SERVICE_AVAILABILITY_CHECK_COMPLETED = "service_availability_check_completed";
    AddInstallationEventBus.WARRANTY_SELECTED = "warranty_selected";
    return AddInstallationEventBus
});
define("wf_carousel_model", ["wf_model_base"], function (BaseModel) {
    "use strict";
    var CarouselViewModel = BaseModel.extend({
        defaults: {
            scrollIndex: 0,
            scrollPos: 0,
            touchPosition: 0,
            touchBounds: [-50, 50],
            maxScroll: 0,
            maxIndex: 0,
            scrollBy: 1,
            slideDuration: 300,
            easing: "swing",
            isVertical: false,
            disabledClass: "disabled",
            alwaysDisabledClass: "always_disabled",
            wrapCarousel: false,
            wrapBuffer: 0,
            wrapBufferItems: 0,
            dummyBuffer: 0,
            startIndex: 1,
            resetSliderWidth: true,
            overscrollPercentage: 50
        }
    });
    return CarouselViewModel
});
define("delayed_event_bus", ["wf_events", "underscore", "jquery"], function (WayfairEvents, _, $) {
    "use strict";
    var DelayedEvents = _.extend({}, WayfairEvents);
    DelayedEvents._readyPromise = $.Deferred();
    DelayedEvents.immediateTrigger = DelayedEvents.trigger;
    DelayedEvents.trigger = function () {
        var self = this,
            passedArgs = arguments;
        this._readyPromise.done(function () {
            self.immediateTrigger.apply(self, passedArgs)
        })
    };
    DelayedEvents.setAsReady = function () {
        this._readyPromise.resolve()
    };
    return DelayedEvents
});
define("wf_router_events", ["jquery", "backbone", "wf_events", "underscore", "wf_router_history", "wf_router_constants", "performance_reporter"], function ($, Backbone, WayfairEvents, _, routerHistory, RouterConstants, performanceReporter) {
    "use strict";
    var routerIsReady = $.Deferred();
    var RouterEvents = _.extend({
        NO_EFFECT: RouterConstants.NO_EFFECT,
        SLIDE_FROM_RIGHT_EFFECT: RouterConstants.SLIDE_FROM_RIGHT_EFFECT,
        SLIDE_FROM_LEFT_EFFECT: RouterConstants.SLIDE_FROM_LEFT_EFFECT,
        SLIDE_UP_EFFECT: RouterConstants.SLIDE_UP_EFFECT,
        triggerNewState: function (newState, url, replaceUrl, view) {
            routerIsReady.then(_.bind(function () {
                this.trigger(RouterConstants.NEW_STATE_EVENT, {
                    state: newState,
                    url: url,
                    replaceUrl: replaceUrl,
                    view: view
                })
            }, this))
        },
        onNewState: function (callback) {
            this.on(RouterConstants.NEW_STATE_EVENT, function (event) {
                callback(event.state, event.url, event.replaceUrl, event.view)
            })
        },
        triggerStateChange: function (state) {
            routerIsReady.then(_.bind(function () {
                this.trigger(RouterConstants.STATE_CHANGE_EVENT, state)
            }, this))
        },
        onStateChange: function (object, callback) {
            object.listenTo(this, RouterConstants.STATE_CHANGE_EVENT, function () {
                callback.apply(object, arguments)
            })
        },
        triggerNewRoute: function (route, model, transitionToUse) {
            route = this.cleanUrlForRoute(route);
            routerIsReady.then(_.bind(function () {
                this.trigger(RouterConstants.ROUTE_EVENT, {
                    route: route,
                    model: model || null,
                    transitionToUse: transitionToUse
                })
            }, this))
        },
        onNewRoute: function (callback) {
            this.on(RouterConstants.ROUTE_EVENT, function (event) {
                callback(event.route, event.model, event.transitionToUse)
            })
        },
        triggerTitleChange: function (title) {
            routerIsReady.then(_.bind(function () {
                this.trigger(RouterConstants.TITLE_CHANGE_EVENT, title)
            }, this))
        },
        onTitleChange: function (callback) {
            this.on(RouterConstants.TITLE_CHANGE_EVENT, function (title) {
                callback(title)
            })
        },
        triggerRouteChangeStarted: function (newRoute) {
            routerIsReady.then(_.bind(function () {
                this.trigger(RouterConstants.ROUTE_CHANGE_STARTED_EVENT, {
                    oldRoute: routerHistory.getCurrentRoute(),
                    newRoute: newRoute
                })
            }, this))
        },
        onRouteChangeStarted: function (callback) {
            this.on(RouterConstants.ROUTE_CHANGE_STARTED_EVENT, function (event) {
                callback(event.route, event.action)
            })
        },
        onceRouteChangeStarted: function (callback) {
            this.once(RouterConstants.ROUTE_CHANGE_STARTED_EVENT, function (event) {
                callback(event.route, event.action)
            })
        },
        triggerRouteChangeCompleted: function () {
            performanceReporter.mark("wfSpaNavFinish");
            routerIsReady.then(_.bind(function () {
                var route = routerHistory.getCurrentRoute();
                var action = routerHistory.currentControllerName;
                this.trigger(RouterConstants.ROUTE_CHANGE_COMPLETED_EVENT, {
                    route: route,
                    action: action
                })
            }, this))
        },
        onRouteChangeCompleted: function (callback) {
            this.on(RouterConstants.ROUTE_CHANGE_COMPLETED_EVENT, function (event) {
                callback(event.route, event.action, event)
            })
        },
        onViewTransition: function (callback) {
            this.on(RouterConstants.VIEW_TRANSITION_EVENT, function (event) {
                callback(event.route, event.action, event)
            })
        },
        onceRouteChangeCompleted: function (callback) {
            this.once(RouterConstants.ROUTE_CHANGE_COMPLETED_EVENT, function (event) {
                callback(event.route, event.action)
            })
        },
        triggerNewSubroute: function (subroute, model) {
            routerIsReady.then(_.bind(function () {
                this.trigger(RouterConstants.SUBROUTE_EVENT, {
                    route: subroute,
                    model: model || null
                })
            }, this))
        },
        onNewSubroute: function (callback) {
            this.on(RouterConstants.SUBROUTE_EVENT, function (event) {
                callback(event.route, event.model)
            })
        },
        registerTrackingInfo: function (trackingInfo, route) {
            if (!trackingInfo || !trackingInfo.trackingData && !trackingInfo.trackingFooter) {
                return
            }
            routerIsReady.then(_.bind(function () {
                routerHistory.setTrackingInfoForRoute(trackingInfo, route)
            }, this))
        },
        triggerTrackingRequest: function () {
            routerIsReady.then(_.bind(function () {
                this.trigger(RouterConstants.TRACKING_EVENT)
            }, this))
        },
        triggerViewTransition: function () {
            routerIsReady.then(_.bind(function () {
                this.trigger(RouterConstants.VIEW_TRANSITION_EVENT, {
                    route: routerHistory.getCurrentRoute(),
                    action: routerHistory.currentControllerName
                })
            }, this))
        },
        getParamsByRoute: function (route, callback) {
            routerIsReady.then(_.bind(function () {
                callback(routerHistory.getQueryParamsByRoute(route))
            }, this))
        },
        onTrackingRequest: function (callback) {
            this.on(RouterConstants.TRACKING_EVENT, function () {
                callback()
            })
        },
        setAsReady: function () {
            routerIsReady.resolve()
        },
        onRouterReady: function (callback) {
            routerIsReady.then(callback)
        },
        cleanUrlForRoute: function (url) {
            url = url.replace("https:", "");
            url = url.replace("http:", "");
            url = url.replace(window.location.hostname.replace("secure.", ""), "");
            url = url.replace("secure.", "");
            url = url.replace("www.", "");
            url = url.replace(/^\/+/, "");
            return url
        },
        isRouteValid: function (route) {
            return _.any(Backbone.history.handlers, function (handler) {
                return handler.route.test(route)
            })
        }
    }, WayfairEvents);
    return RouterEvents
});
define("validation_regex", [], function () {
    "use strict";
    var exports = function (value, pattern) {
        return pattern instanceof RegExp && pattern.test(value)
    };
    return exports
});
define("validation_regex_patterns", [], function () {
    "use strict";
    var exports = {
        phone: /^[\d\(]+([\.\d\(\)\-\s]+)?$/,
        email: /^[a-z0-9_\-\.+]+\@[a-z0-9_\-\.]+\.[a-z]{2,}$/i,
        numeric: /^\d+(\.\d+)?$/,
        integer: /^\d+$/,
        usPostalCode: /(^\d{5}$)|(^\d{5}-\d{4}$)/,
        canadianPostalCode: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
        ukPostalCode: /(GIR 0AA)|(((A[BL]|B[ABDHLNRSTX]?|C[ABFHMORTVW]|D[ADEGHLNTY]|E[HNX]?|F[KY]|G[LUY]?|H[ADGPRSUX]|I[GMPV]|JE|K[ATWY]|L[ADELNSU]?|M[EKL]?|N[EGNPRW]?|O[LX]|P[AEHLOR]|R[GHM]|S[AEGKLMNOPRSTY]?|T[ADFNQRSW]|UB|W[ADFNRSV]|YO|ZE)[1-9]?[0-9]|((E|N|NW|SE|SW|W)1|EC[1-4]|WC[12])[A-HJKMNPR-Y]|(SW|W)([2-9]|[1-9][0-9])|EC[1-9][0-9])[\s]?[0-9][ABD-HJLNP-UW-Z]{2})/i,
        germanPostalCode: /^(D|DE)?\d{5}$/i,
        upsAccount: /^[A-Z0-9]{6}$/,
        fedexAccount: /^\d{9}$/
    };
    return exports
});
define("wf_router_history", ["url_utils", "backbone", "underscore", "wf_router_constants"], function (urlUtils, Backbone, _, RouterConstants) {
    "use strict";

    function RouterHistory() {
        this.routeHistory = [];
        this.currentRouteIndex = -1;
        this.routeStates = {};
        this.routeTitles = {};
        this.routeData = {};
        this.routeTransitions = {};
        this.routeTrackingInfo = {};
        this.views = {};
        this.isNavigatingBack = false;
        this.isNavigatingForward = false;
        this.isNavigatingFromClick = false;
        this.currentTargetUrl = window.location.href;
        this.currentControllerName = null;
        this.usingPushState = false;
        RouterHistory.prototype.updateWithRoute = function (route, fromClick) {
            this.checkBrowserBackOrFrontClicked(route, fromClick);
            if (!this.isNavigatingBack && !this.isNavigatingForward) {
                this.addRoute(route)
            }
        };
        RouterHistory.prototype.addRoute = function (route) {
            if (this.getCurrentRoute() !== route) {
                if (this.hasAtLeastTwoRoutes() && !this.isCurrentRouteTheLastRoute()) {
                    this.routeHistory.splice(this.currentRouteIndex + 1, this.routeHistory.length)
                }
                this.routeHistory.push(route);
                this.currentRouteIndex++
            }
        };
        RouterHistory.prototype.replaceRoute = function (route) {
            var oldRoute = this.getCurrentRoute();
            this.routeHistory[this.currentRouteIndex] = route;
            this.addTitle(this.getTitle(oldRoute))
        };
        RouterHistory.prototype.addState = function (state, route) {
            this.routeStates[route] = state;
            if (this.usingPushState) {
                Backbone.history.history.replaceState(state, "", "")
            }
        };
        RouterHistory.prototype.getState = function (route) {
            return this.routeStates[route] || (this.usingPushState ? Backbone.history.history.state : null)
        };
        RouterHistory.prototype.removeState = function (route) {
            this.routeStates[route] = null
        };
        RouterHistory.prototype.addTitle = function (title) {
            var currentRoute = this.getCurrentRoute();
            if (currentRoute !== undefined) {
                this.routeTitles[currentRoute] = title
            }
        };
        RouterHistory.prototype.getTitle = function (route) {
            return this.routeTitles[route]
        };
        RouterHistory.prototype.checkBrowserBackOrFrontClicked = function (route, fromClick) {
            if (this.hasAtLeastTwoRoutes()) {
                this.isNavigatingBack = false;
                this.isNavigatingForward = false;
                this.isNavigatingFromClick = fromClick;
                if (!this.isCurrentRouteTheFirstRoute() && this.isThisThePreviousRoute(route)) {
                    this.goBack();
                    this.isNavigatingBack = true
                } else if (!this.isCurrentRouteTheLastRoute() && this.isThisTheNextRoute(route)) {
                    this.advance();
                    this.isNavigatingForward = true
                } else if (!this.isCurrentRouteTheFirstRoute() && this.areTwoRoutesSimilar(this.getPreviousRoute(), route)) {
                    this.goBack();
                    this.isNavigatingBack = true
                } else if (!this.isCurrentRouteTheLastRoute() && this.areTwoRoutesSimilar(this.getNextRoute(), route)) {
                    this.advance();
                    this.isNavigatingForward = true
                } else {
                    this.deactivateActiveRouteView(route)
                }
            }
        };
        RouterHistory.prototype.deactivateActiveRouteView = function (route) {
            var routeView = this.getView(route);
            if (routeView && routeView.view && routeView.view.isActivated) {
                routeView.view.trigger(routeView.view.DEACTIVATE_EVENT);
                routeView.view.isActivated = false
            }
        };
        RouterHistory.prototype.getPreviousRoute = function () {
            return this.routeHistory[this.currentRouteIndex - 1]
        };
        RouterHistory.prototype.getCurrentRoute = function () {
            return this.routeHistory[this.currentRouteIndex]
        };
        RouterHistory.prototype.isCurrentRouteTheLastRoute = function () {
            return this.currentRouteIndex === this.routeHistory.length - 1
        };
        RouterHistory.prototype.getNextRoute = function () {
            return this.routeHistory[this.currentRouteIndex + 1]
        };
        RouterHistory.prototype.hasAtLeastTwoRoutes = function () {
            return this.routeHistory.length >= 2
        };
        RouterHistory.prototype.isThisThePreviousRoute = function (route) {
            return this.getPreviousRoute() === route
        };
        RouterHistory.prototype.isThisTheNextRoute = function (route) {
            return this.getNextRoute() === route
        };
        RouterHistory.prototype.goBack = function () {
            this.currentRouteIndex--
        };
        RouterHistory.prototype.advance = function () {
            this.currentRouteIndex++
        };
        RouterHistory.prototype.areTwoRoutesSimilar = function (thisRoute, thatRoute) {
            var self = this;
            var routesAreNotTheSame = _.any(Backbone.history.handlers, function (handler) {
                var thisRouteMatchesHandler = handler.route.test(thisRoute);
                var thatRouteMatchesHandler = handler.route.test(thatRoute);
                if (thisRouteMatchesHandler ^ thatRouteMatchesHandler) {
                    return true
                } else if (thisRouteMatchesHandler && thatRouteMatchesHandler) {
                    var thisRouteParams, thatRouteParams;
                    if (self.usingPushState) {
                        thisRouteParams = handler.route.exec(thisRoute).slice(1);
                        thatRouteParams = handler.route.exec(thatRoute).slice(1)
                    } else {
                        thisRouteParams = _.map(handler.route.exec(thisRoute).slice(1), function (param) {
                            return param ? param.split("!")[0] : param
                        });
                        thatRouteParams = _.map(handler.route.exec(thatRoute).slice(1), function (param) {
                            return param ? param.split("!")[0] : param
                        })
                    }
                    return !_.isEqual(thisRouteParams, thatRouteParams)
                }
            });
            return !routesAreNotTheSame
        };
        RouterHistory.prototype.getQueryParamsByRoute = function (route) {
            var params = "";
            _.any(Backbone.history.handlers, function (handler) {
                var routeMatch = handler.route.test(route);
                if (routeMatch) {
                    params = handler.route.exec(route).slice(1)
                }
            });
            return params
        };
        RouterHistory.prototype.isCurrentRouteTheFirstRoute = function () {
            return this.currentRouteIndex === 0
        };
        RouterHistory.prototype.addTransitionForCurrentRoute = function (transition) {
            if (!this.isNavigatingBack) {
                this.routeTransitions[this.getPreviousRoute() + "-to-" + this.getCurrentRoute()] = transition;
                this.routeTransitions[this.getCurrentRoute() + "-to-" + this.getPreviousRoute()] = transition
            }
        };
        RouterHistory.prototype.getTransitionForCurrentRoute = function () {
            if (this.transitionToUse) {
                if (this.isNavigatingBack) {
                    switch (this.transitionToUse) {
                    case RouterConstants.SLIDE_FROM_LEFT_EFFECT:
                        return RouterConstants.SLIDE_FROM_RIGHT_EFFECT;
                    case RouterConstants.SLIDE_FROM_RIGHT_EFFECT:
                        return RouterConstants.SLIDE_FROM_LEFT_EFFECT
                    }
                } else {
                    return this.transitionToUse
                }
            }
            if (this.isNavigatingBack) {
                return this.routeTransitions[this.getNextRoute() + "-to-" + this.getCurrentRoute()]
            } else {
                return this.routeTransitions[this.getPreviousRoute() + "-to-" + this.getCurrentRoute()]
            }
        };
        RouterHistory.prototype.addDataForCurrentRoute = function (data) {
            if (this.isNavigatingBack) {
                this.routeData[this.getNextRoute() + "-to-" + this.getCurrentRoute()] = data
            } else {
                this.routeData[this.getPreviousRoute() + "-to-" + this.getCurrentRoute()] = data
            }
        };
        RouterHistory.prototype.addDataForNextRoute = function (data, route) {
            this.routeData[this.getCurrentRoute() + "-to-" + route] = data
        };
        RouterHistory.prototype.getDataForCurrentRoute = function () {
            if (this.isNavigatingBack) {
                return this.routeData[this.getNextRoute() + "-to-" + this.getCurrentRoute()]
            } else {
                return this.routeData[this.getPreviousRoute() + "-to-" + this.getCurrentRoute()]
            }
        };
        RouterHistory.prototype.setTrackingInfoForRoute = function (trackingInfo, route) {
            if (typeof route !== "string") {
                route = this.getCurrentRoute()
            }
            this.routeTrackingInfo["_" + route] = trackingInfo
        };
        RouterHistory.prototype.getTrackingInfoForRoute = function (route) {
            return this.routeTrackingInfo["_" + route]
        };
        RouterHistory.prototype.getNormalizedRoute = function (routeUrl) {
            var subroute = urlUtils.extractParamFromUri(routeUrl, "subroute");
            if (subroute) {
                return subroute
            } else if (routeUrl !== undefined) {
                var dsParam = urlUtils.extractParamFromUri(routeUrl, "ds");
                var keywordParam = urlUtils.extractParamFromUri(routeUrl, "keyword");
                routeUrl = routeUrl.split("?")[0];
                if (dsParam != null) {
                    routeUrl = routeUrl + "?ds=" + dsParam
                }
                if (keywordParam) {
                    routeUrl = urlUtils.updateQueryParam(routeUrl, "keyword", keywordParam)
                }
                return routeUrl
            }
        };
        RouterHistory.prototype.hasRouteBeenVisitedSoFar = function (routeToFind) {
            var index = _.findIndex(this.routeHistory, _.bind(function (route) {
                return this.getNormalizedRoute(route) === this.getNormalizedRoute(routeToFind)
            }, this));
            return index !== -1 && index < this.currentRouteIndex
        }
    }
    RouterHistory.prototype.getView = function (route) {
        if (route === undefined) {
            return undefined
        }
        route = this.getNormalizedRoute(route);
        return this.views["_" + route]
    };
    RouterHistory.prototype.setView = function (route, view) {
        route = this.getNormalizedRoute(route);
        if (!view) {
            delete this.views["_" + route]
        } else {
            this.views["_" + route] = view;
            view.metadata.route = route
        }
    };
    return new RouterHistory
});
define("wf_router_constants", [], function () {
    "use strict";
    return {
        NEW_STATE_EVENT: "newstate",
        STATE_CHANGE_EVENT: "statechange",
        ROUTE_EVENT: "routeWithModel",
        TITLE_CHANGE_EVENT: "titleChange",
        ROUTE_CHANGE_STARTED_EVENT: "routeChangeStarted",
        ROUTE_CHANGE_COMPLETED_EVENT: "routeChangeCompleted",
        SUBROUTE_EVENT: "subrouteWithModel",
        TRACKING_EVENT: "spaTrackingRequest",
        NO_EFFECT: "noEffect",
        SLIDE_FROM_RIGHT_EFFECT: "slideFromRightEffect",
        SLIDE_FROM_LEFT_EFFECT: "slideFromLeftEffect",
        SLIDE_UP_EFFECT: "slideUpEffect",
        VIEW_TRANSITION_EVENT: "viewTransition"
    }
});
define("performance_reporter", ["wayfair", "underscore", "wf_storage"], function (wf, _, storage) {
    "use strict";
    var exports = {};
    var serviceName = "Catchpoint";
    var reportQueryParam = "crd_olt";
    var reportUrl = "http://www.catchpoint.com/wp-content/uploads/2014/02/global-node.png";
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    var isPerformanceAgent = userAgent.match(new RegExp(serviceName));
    if (isPerformanceAgent) {
        var startTime = Date.now(),
            endTime = 0;
        wf.$win.on("load", function () {
            if (window.performance != null) {
                exports.reportTime(window.performance.timing.loadEventStart - window.performance.timing.navigationStart)
            } else {
                exports.stopTimer();
                exports.reportTime()
            }
        });
        exports.reportTime = function (loadTime) {
            var time;
            if (loadTime) {
                time = loadTime
            } else {
                time = endTime - startTime
            }
            var image = new Image;
            image.src = reportUrl + "?" + reportQueryParam + "=" + time
        };
        exports.startTimer = function () {
            startTime = Date.now()
        };
        exports.stopTimer = function () {
            endTime = Date.now()
        }
    } else {
        exports.reportTime = exports.startTimer = exports.stopTimer = _.noop
    }
    exports.mark = function (key) {
        if (window.__browserPerf) {
            performance.mark(key)
        }
    };
    return exports
});
/* CB:cba6288a9ec3005b1ae RqV:cba6288a9ec3005b1ae */
/* RtV:cba6288a9ec3005b1ae */
/* Timer[finished]: 29.055119 ms */
/* lang: eng_us*/