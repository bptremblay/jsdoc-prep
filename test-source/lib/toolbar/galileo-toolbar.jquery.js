(function() {

  define(['jquery', 'utils', 'template-engine', 'galileo-lib/modules/events', 'root/engine/editor-events', 'i18n!galileo-lib/modules/nls/engine', 'text!root/templates/editor-tools.html',
      'plugins/position-affix.jquery'
    ],
    /**
     * @exports src/lib/toolbar/galileo-toolbar.jquery
     * @requires jquery
     * @requires utils
     * @requires template-engine
     * @requires galileo-lib/modules/events
     * @requires root/engine/editor-events
     * @requires i18n!galileo-lib/modules/nls/engine
     * @requires text!root/templates/editor-tools.html
     * @requires plugins/position-affix.jquery
     */
    function($, utils, Mustache, galileoEvents, events, i18n, template) {
      var $title, $toolbar, activeTools, bindToWindowEvents, eventClickWasToolbarRelated, hide, registerToolbarEventCondition, renderTemplate, renderToolbar, runShow, setTitle, show, showTools,
        titles, toolbarEventConditions;
      $toolbar = [];
      $title = [];
      toolbarEventConditions = [];
      titles = {};
      activeTools = '';
      /**
       * @function
       */
      renderTemplate = function() {
        return $(Mustache.render(template, i18n));
      };
      /**
       * @function
       */
      renderToolbar = function() {
        var $pointer;
        $toolbar = $toolbar.length ? $toolbar : renderTemplate();
        $title = $toolbar.find('#galileo-tools-label');
        $pointer = $toolbar.find('.editor-pointer');
        $toolbar.hide().appendTo('#galileo').positionAffix({
          /**
           * @param pos
           */
          offset: function(pos) {
            var re;
            re = /\babove\b|\bbelow\b/g;
            if (pos === 'below') {
              $title.hide();
            }
            if (re.test(pos)) {
              return $pointer.outerHeight();
            } else {
              return $pointer.outerWidth();
            }
          },
          /**
           * @function
           */
          onUpdate: function() {
            return setTitle();
          }
        });
        bindToWindowEvents();
        return $toolbar;
      };
      registerToolbarEventCondition = function(condition) {
        if ($.isFunction(condition) && $.inArray(condition, toolbarEventConditions) < 0) {
          return toolbarEventConditions.push(condition);
        }
      };
      /**
       * @param evt
       * @return {Boolean}
       */
      eventClickWasToolbarRelated = function(evt) {
        var clickTarget, wasToolbar;
        clickTarget = evt.originalEvent.target;
        wasToolbar = false;
        if (!clickTarget) {
          return false;
        }
        $.each(toolbarEventConditions, function(idx, condition) {
          if (condition(evt)) {
            return wasToolbar = true;
          }
        });
        return wasToolbar;
      };
      /**
       * @return {Boolean}
       */
      bindToWindowEvents = function() {
        var clickedMainToolbar;
        /**
         * @param evt
         * @return {Boolean}
         */
        clickedMainToolbar = function(evt) {
          var clickTarget;
          clickTarget = evt.originalEvent.target;
          if ($(clickTarget).closest('#galileo-tools').length) {
            return true;
          } else {
            return false;
          }
        };
        registerToolbarEventCondition(clickedMainToolbar);
        return $('html').mousedown(function(evt) {
          if (window.Aloha) {
            window.Aloha.eventHandled = true;
          }
          if (!eventClickWasToolbarRelated(evt) && $toolbar.is(':visible')) {
            hide();
          }
          return true;
        });
      };
      setTitle = function(theTitle) {
        theTitle = theTitle || titles[activeTools];
        titles[activeTools] = theTitle;
        if (theTitle && !$toolbar.hasClass('below')) {
          return $title.html(theTitle).attr('title', theTitle).show();
        } else {
          return $title.hide();
        }
      };
      /**
       * @param theToolsClass
       */
      showTools = function(theToolsClass) {
        $toolbar.trigger('showTools', theToolsClass);
        $('.editor').removeClass('active');
        return $toolbar.find("." + theToolsClass).addClass('active');
      };
      /**
       * @function
       */
      runShow = function() {
        $toolbar.trigger('beforeShow');
        if (!$toolbar.is(':visible')) {
          $toolbar.show();
          $toolbar.css('display', '');
          $toolbar.attr('data-test-state', 'galileo-tools-visible');
          return $toolbar.trigger('show');
        }
      };
      show = utils.debounce(runShow, 100);
      hide = function(callback) {
        $toolbar.trigger('beforeHide');
        $toolbar.hide();
        $toolbar.removeAttr('data-test-state');
        $title.hide();
        $toolbar.trigger('hide');
        return typeof callback === "function" ? callback() : void 0;
      };
      galileoEvents.on(events.EDITOR_REINIT, function() {
        return $toolbar = [];
      });
      if (Galileo.toolbar) {
        return Galileo.toolbar;
      }
      return Galileo.toolbar = {
        /**
         * @param condition
         */
        registerToolbarEventCondition: function(condition) {
          return registerToolbarEventCondition(condition);
        },
        /**
         * @function
         */
        getTitle: function() {
          return $title.html();
        },
        /**
         * @param theTitle
         */
        setTitle: function(theTitle) {
          return setTitle(theTitle);
        },
        /**
         * @function
         */
        getToolbar: function() {
          if ($toolbar.length && $toolbar.parent().length) {
            return $toolbar;
          } else {
            return renderToolbar();
          }
        },
        /**
         * @param theToolsClass
         * @param theTemplateHTML
         */
        getTools: function(theToolsClass, theTemplateHTML) {
          var $template, $toolbars, $tools;
          $toolbar = this.getToolbar();
          $toolbars = $toolbar.find('#editor-toolbars');
          $tools = $toolbars.find("." + theToolsClass);
          if (!$tools.length) {
            $tools = $("<div class=\"br-all-5 editor " + theToolsClass + "\"/>");
            if (theTemplateHTML) {
              $template = $(theTemplateHTML);
              if ($template.length) {
                $template.appendTo($tools);
              }
            }
            $tools.appendTo($toolbars);
          }
          return $tools.get(0);
        },
        /**
         * @param theToolsClass
         * @param theTitle
         * @param callback
         * @return {Object} ConditionalExpression
         */
        show: function(theToolsClass, theTitle, callback) {
          if (theToolsClass) {
            activeTools = theToolsClass;
            showTools(theToolsClass);
          }
          setTitle(theTitle);
          show();
          this.updatePosition();
          return typeof callback === "function" ? callback() : void 0;
        },
        /**
         * @param $theTarget
         * @param theToolsClass
         * @param theTitle
         * @param callback
         * @return {Object} ConditionalExpression
         */
        updateAndShow: function($theTarget, theToolsClass, theTitle, callback) {
          if (theToolsClass) {
            activeTools = theToolsClass;
            showTools(theToolsClass);
          }
          setTitle(theTitle);
          show();
          this.updateTarget($theTarget);
          return typeof callback === "function" ? callback() : void 0;
        },
        /**
         * @param callback
         */
        hide: function(callback) {
          return hide(callback);
        },
        /**
         * @param preferredPosition
         */
        updatePosition: function(preferredPosition) {
          this.setTitle();
          return $toolbar.positionAffix('update', preferredPosition);
        },
        /**
         * @param $target
         */
        updateTarget: function($target) {
          if ($target.length) {
            return $toolbar.positionAffix('updateTarget', $target);
          }
        }
      };
    });
}).call(this);
