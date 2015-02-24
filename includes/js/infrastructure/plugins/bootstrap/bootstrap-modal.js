/* =========================================================
 * bootstrap-modal.js v2.2.2
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

/*
 * btremblay@me.com custom modifications of this plugin. Please commit any changes to this file to the btremblay@me.com github fork for bootstrap:
 * https://github.com/btremblay@me.com/bootstrap
 */

YUI().add('bootstrap-modal', function (Y) {

  !function ($) {

    "use strict"; // jshint ;_;


   /* MODAL CLASS DEFINITION
    * ====================== */

    var Modal = function (element, options) {
      this.options = options
      this.$element = $(element)
        .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
      this.options.remote && this.getBodyNode().load(this.options.remote)
    }

    Modal.prototype = {

        constructor: Modal

      , toggle: function () {
          return this[!this.isShown ? 'show' : 'hide']()
        }

      , show: function () {
          var that = this
            , e = $.Event('show')

          this.$element.trigger(e)

          if (this.isShown || e.isDefaultPrevented()) return

          this.isShown = true

          this.escape()

          this.backdrop(function () {
            var transition = $.support.transition && that.$element.hasClass('fade')

            if (!that.$element.parent().length) {
              that.$element.appendTo(document.body) //don't move modals dom position
            }

            that.$element
              .show()

            if (transition) {
              that.$element[0].offsetWidth // force reflow
            }

            // event to allow specific fixes for browsers that behave strangely when manipulating the modal at the point when 'shown' is triggered.
            that.$element.trigger($.Event('willAnimateIn'));

            that.$element
              .addClass('in')
              .attr('aria-hidden', false)

            that.enforceFocus()

            transition ?
              that.$element.one($.support.transition.end, function () { that.$element.focus().trigger('shown') }) :
              that.$element.focus().trigger('shown')

          })
        }

      , hide: function (e) {
          e && e.preventDefault()

          var that = this

          e = $.Event('hide')

          this.$element.trigger(e)

          if (!this.isShown || e.isDefaultPrevented()) return

          this.isShown = false

          this.escape()

          $(document).off('focusin.modal')

          this.$element
            .removeClass('in')
            .attr('aria-hidden', true)

          $.support.transition && this.$element.hasClass('fade') ?
            this.hideWithTransition() :
            this.hideModal()
        }

      , enforceFocus: function () {
          var that = this
          $(document).on('focusin.modal', function (e) {
            if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
              that.$element.focus()
            }
          })
        }

      , escape: function () {
          var that = this
          if (this.isShown && this.options.keyboard) {
            this.$element.on('keyup.dismiss.modal', function ( e ) {
              e.which == 27 && that.hide()
            })
          } else if (!this.isShown) {
            this.$element.off('keyup.dismiss.modal')
          }
        }

      , hideWithTransition: function () {
          var that = this
            , timeout = setTimeout(function () {
                that.$element.off($.support.transition.end)
                that.hideModal()
              }, 500)

          this.$element.one($.support.transition.end, function () {
            clearTimeout(timeout)
            that.hideModal()
          })
        }

      , hideModal: function (that) {
          this.$element
            .hide()
            .trigger('hidden')

          this.backdrop()
        }

      , removeBackdrop: function () {
          this.$backdrop.remove()
          this.$backdrop = null
        }

      , backdrop: function (callback) {
          var that = this
            , animate = this.$element.hasClass('fade') ? 'fade' : ''

          if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate

            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
              .appendTo(document.body)

            this.$backdrop.click(
              this.options.backdrop == 'static' ?
                $.proxy(this.$element[0].focus, this.$element[0])
              : $.proxy(this.hide, this)
            )

            if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

            this.$backdrop.addClass('in')

            doAnimate ?
              this.$backdrop.one($.support.transition.end, callback) :
              callback()

          } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass('in')

            $.support.transition && this.$element.hasClass('fade')?
              this.$backdrop.one($.support.transition.end, $.proxy(this.removeBackdrop, this)) :
              this.removeBackdrop()

          } else if (callback) {
            callback()
          }
        }
    }


   /* MODAL PLUGIN DEFINITION
    * ======================= */

    var old = $.fn.modal

    $.fn.modal = function (option) {
      var args = Array.prototype.slice.call(arguments);
      return this.each(function () {
        var $this = $(this)
          , data = $this.data('modal')
          , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)

        if (!data) {
          //Changed to WFModal so we could extend the native function
          $this.data('modal', (data = new WFModal(this, options)));
        }

        //Extending options here so that we call the function with any supplied arguments
        if (typeof option == 'string') {
          data[option].apply(data, args.slice(1));
        } else if (options.show) {
          data.show();
        }
      })
    }

    $.fn.modal.defaults = {
        backdrop: true
      , keyboard: true
      , show: true
    }

    $.fn.modal.Constructor = Modal


   /* MODAL NO CONFLICT
    * ================= */

    $.fn.modal.noConflict = function () {
      $.fn.modal = old
      return this
    }


   /* MODAL DATA-API
    * ============== */

    $(document).on('click.modal.data-api', '[data-toggle="modal"]', function (e) {
      var $this = $(this)
        , href = $this.attr('href')
        , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        , option = $target.data('modal') ? 'toggle' : $.extend({ remote:!/#/.test(href) && href }, $target.data(), $this.data())

      e.preventDefault()

      $target
        .modal(option)
        .one('hide', function () {
          $this.focus()
        })
    });

    /******************** btremblay@me.com MODAL ADDITIONS ************************/

    $.extend($.fn.modal.defaults, {
        centered : true,
        bodyNodeSelector : '.modal-body',
        fade : true
    });


    //Dummy function to use as a basis for our extended class -- avoid calling new Modal()
    function ModalPrototype (){};
    ModalPrototype.prototype = Modal.prototype;

    //Extend the Modal object
    WFModal.prototype = new ModalPrototype();

    //Fix the constructor to point to the correct function
    WFModal.prototype.constructor = WFModal;

    //Add in a parent property for easy access if overriding functions
    WFModal.prototype.parent = Modal.prototype;

    function WFModal (element, options) {
      this.parent.constructor.call(this, element, options);
      this.init();
    }

    $.extend(WFModal.prototype, {

      /**
       * Perform any common set up functions
       *
       */
      init : function () {
        if (this.options.centered) {
          this.$element.on('willAnimateIn', $.proxy(this.center, this));
        }

        if (this.options.fade) {
          this.$element.addClass('fade');
        }
      },

      /**
       * Centering functionality -- will require appropriate CSS classes to be in place
       *
       */
      center: function() {

        //Note CSS here is controlled with css... should make it part of the options
        if (this.$element.css('position') === 'fixed') {
          this.$element.css({
            top: '50%',
            left: '50%',
            marginTop: -(this.$element.height() / 2),
            marginLeft: -(this.$element.width() / 2)
          });
        } else {
          this.$element.position({my: 'center', at: 'center', of: window, collision: 'fit'});
          this.$element.css({
            left : 0,
            marginLeft : 'auto',
            marginRight : 'auto'
          }); // reset margins, we want the modal to stay centered if the window is resized.
        }
      },

      /**
       * Show the spinner indicating we are waiting for an AJAX call to complete
       *
       */
      waitHTML : function (title) {
        return $(
            '<div>' +
              '<div class="modal-inner-header">' +
                '<span class="xltitle">' +
                  '<a href="#">' +
                    title +
                  '</a>' +
                '</span>' +
                '<span class="xmodalclose fr" data-dismiss="modal">' +
                  '&times;' +
                '</span>' +
              '</div>' +
              '<div class="jq-modal-wait-container ">' +
                '<div class="waiting"></div>' +
              '</div>' +
            '</div>'
        );
      },

      //TODO translate from YUI
      loadJSON : function () {

      },

      /**
       * Gets the main body node for this modal
       *
       */
      getBodyNode: function() {
        return this.$element.find(this.options.bodyNodeSelector).first();
      },

      /**
       * Makes an Ajax call and update the modal to display the result. In HTML mode, updates modal to display all HTML returned.
       * in json mode, looks for an "html" element in the json returned and displays this html in the modal. When using json mode,
       * this HTML must exist, or else the modal will be empty.
       * 
       * Takes a url to load and a config object containing any of the following options:
       *
       * bShowWaitSpinner -- Should we show the wait spinner and content? (defaults to true)
       * spinnerText -- Text to display with the wait spinner (defaults to "Please Wait")
       * callback -- callback function to call after loading (with the response, statusText and request parameters passed from load function)
       * args -- extra arguments to pass to the callback function (after response, statusText and request)
       * context -- context for the callback function (defaults to this)
       * data -- data to pass when loading the url, usually form data
       * dataType -- return datatype of ajax call, html or json (defaults to html)
       *
       */
      loadContent: function (url, config) {
        // show the waiting content while we wait for the ajax request to come back
        var that = this,
          bodyNode = this.getBodyNode(),
          handleModalResponse = function (response, statusText, request) {
                  if (statusText !== 'success') {
                    that.hide();
                    return;
                  }
                  //Center since the size of the modal content may have changed. Using that since this is arbitrary
                  if (that.options.centered) {
                    that.center();
                  }
                  // Apply callback function if set
                  if (config.callback) {
                    // Put response, statusText, request into an array
                    var callbackArgs = Array.prototype.slice.call(arguments);
                    // Add args if set
                    if (config.args) {
                      callbackArgs.push(config.args);
                    }
                    config.callback.apply(this, callbackArgs);
                  }
                };

        if (bodyNode.length && url) {

          // Set the wait content if necessary, default to show
          if (typeof config.bShowWaitSpinner == 'undefined' || config.bShowWaitSpinner) {
            this.setHTML(this.waitHTML(config.spinnerText  || Y.Translator.lnrs('PleaseWait', '', 'Please Wait' )));
          }

          //Load new content into the modal body, apply callback function
          if (typeof config.dataType == 'undefined' || config.dataType == 'html') {
            // Use JQuery load, process response as HTML
            bodyNode.load(
              url,
              config.data,
              $.proxy(
                handleModalResponse,
                (config.context || this)
              )
            );
          } else {
            // Use Ajax, parse result as json
            $.ajax({
              url: url,
              type: "POST",
              data: config.data,
              dataType: "json",
              cache: false,
              async: false
            }).done(function(response, statusText, request) {
              bodyNode.html(response.html);
              handleModalResponse.apply((config.context || this), arguments);
            });
          }
        }
      },
      setHTML: function (htmlContent) {
        this.getBodyNode().html(htmlContent);
      }
    });
  }(window.jQuery);
}, '0.0.1', {requires: ['jquery-ui-position', 'translator']});