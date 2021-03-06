/*! http://mths.be/placeholder v2.0.7 by @mathias */
YUI().add('placeholder', function(Y) {
  (function(window, document, $) {

    var isInputSupported = 'placeholder' in document.createElement('input'),
        isTextareaSupported = 'placeholder' in document.createElement('textarea'),
        prototype = $.fn,
        valHooks = $.valHooks,
        hooks,
        placeholder;

    if (isInputSupported && isTextareaSupported) {

      placeholder = prototype.placeholder = function() {
        return this;
      };

      placeholder.input = placeholder.textarea = true;

    } else {

      placeholder = prototype.placeholder = function() {
        var $this = this;

        $this
          .filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
          // filtering out passwords so this is a bit safer
          .not('[type="password"]')
          .not('.placeholder')
          .bind({
            'focus.placeholder': clearPlaceholder,
            'drop.placeholder' : clearPlaceholder,
            'blur.placeholder': setPlaceholder
          })
          .data('placeholder-enabled', true)
          .trigger('blur.placeholder');
        return $this;
      };

      placeholder.input = isInputSupported;
      placeholder.textarea = isTextareaSupported;

      hooks = {
        'get': function(element) {
          var $element = $(element);
          return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
        },
        'set': function(element, value) {
          var $element = $(element);
          if (!$element.data('placeholder-enabled')) {
            return element.value = value;
          }
          if (value == '') {
            element.value = value;
            // Issue #56: Setting the placeholder causes problems if the element continues to have focus.
            if (element != document.activeElement) {
              // We can't use `triggerHandler` here because of dummy text/password inputs :(
              setPlaceholder.call(element);
            }
          } else if ($element.hasClass('placeholder')) {
            clearPlaceholder.call(element, true, value) || (element.value = value);
          } else {
            element.value = value;
          }
          // `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
          return $element;
        }
      };

      isInputSupported || (valHooks.input = hooks);
      isTextareaSupported || (valHooks.textarea = hooks);

      $(function() {
        // Look for forms
        $(document).delegate('form', 'submit.placeholder', function() {
          // Clear the placeholder values so they don't get submitted
          var $inputs = $('.placeholder', this).each(clearPlaceholder);
          setTimeout(function() {
            $inputs.each(setPlaceholder);
          }, 10);
        });
      });

      // Clear placeholder values upon page reload
      $(window).bind('beforeunload.placeholder', function() {
        $('.placeholder').each(function() {
          this.value = '';
        });
      });

    }

    function args(elem) {
      // Return an object of element attributes
      var newAttrs = {},
          rinlinejQuery = /^jQuery\d+$/;
      $.each(elem.attributes, function(i, attr) {
        if (attr.specified && !rinlinejQuery.test(attr.name)) {
          newAttrs[attr.name] = attr.value;
        }
      });
      return newAttrs;
    }

    function clearPlaceholder(event, value) {
      var input = this,
          $input = $(input);
      if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
        input.value = '';
        $input.removeClass('placeholder');
        input == document.activeElement && input.select();
      }
    }

    function setPlaceholder() {
      var $replacement,
          input = this,
          $input = $(input),
          $origInput = $input,
          id = this.id;
      if (input.value == '') {
        $input.addClass('placeholder');
        $input[0].value = $input.attr('placeholder');
      } else {
        $input.removeClass('placeholder');
      }
    }

  }(this, document, jQuery));
}, '0.0.1', {requires: ['jquery']});