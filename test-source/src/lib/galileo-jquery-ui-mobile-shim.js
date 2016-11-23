import $ from 'jquery';
import _ from 'underscore';
import 'jquery-ui';

// Can't redefine module values, they are const!! _ ?= window._
let debounce = (delay, fn) => _.debounce((function () {
  return fn.apply(this, arguments);
}), delay);

let DEVICE_WIDTH_THRESHOLD_PX = 769;

// Public: Make the shim available as a jQuery plugin. This plugin is 'meta'
//         in that it modifies another plugin. Currently it only supports
//         jquery.ui.spinner
//
// pluginName - unique identifier of the plugin to be shimmed, e.g. 'spinner'
// options - the options that would normally be passed directly to the
//           plugin's init method
//
// Returns this
$.fn.mobileFriendly = function (pluginName, options) {
  createShim(this, pluginName, options);
  return this;
};

// Internal: Do the actual setting up of the shim based on `pluginName`
//
// $input - a jquery object
// pluginName - unique identifier of the plugin to be shimmed, e.g. 'spinner'
// options - the options that would normally be passed directly to the
//           plugin's init method
//
// Returns $input
var createShim = function ($input, pluginName, options = {}) {
  if (options.isMobile == null) {
    options.isMobile = screen.availWidth <= DEVICE_WIDTH_THRESHOLD_PX;
  }
  if (options.isMobile) {
    let view =
      (() => {
        switch (pluginName) {
          case 'spinner':
            return new SpinnerView($input, options);
        }
      })();
    view.render();
    return $input;
  } else {
    options.spin = options.valueChanged;
    $input[pluginName](options);
    let callValueChanged = e => options.valueChanged(e, {
      value: $input.val()
    });
    $input.keyup(debounce(1500, callValueChanged));
    $input.on('focusout blur', callValueChanged);
    return $input.keypress(function (e) {
      if ((e.keyCode || e.which || e.charCode) === 13) {
        return callValueChanged(e);
      }
    });
  }
};

let allViewInstances = [];
$(document).on('tap taphold click vclick', event =>
  (() => {
    let result = [];
    for (let instance of allViewInstances) {
      let item;
      if ($(event.target).parents().filter(instance.$el).size() === 0) {
        item = instance.onFocusOut(event);
      }
      result.push(item);
    }
    return result;
  })()
);

// Creates and manages the shim for a jquery.ui.spinner
class SpinnerView {
  constructor($input, options = {}) {
    this.$input = $input;
    this.options = options;
    this.$el = this.$input.parent();
    if (this.options.min == null) {
      this.options.min = parseInt(this.$input.attr('aria-valuemin'));
    }
    if (this.options.max == null) {
      this.options.max = parseInt(this.$input.attr('aria-valuemax'));
    }
    this.cssClasses = {
      dropDownClass: this.options.dropDownClass || 'mobile-dropdown',
      dropDownOptionClass: this.options.dropDownOptionClass || 'mobile-option'
    };

    this.$input._jqueryVal = this.$input.val;
    // Public: get or set the current value of the input
    //
    // val - if defined, will become the new value
    //
    // Returns either `this` when setting or a String when getting.
    this.$input.val = val => {
      if (val != null) {
        this.val(val);
        return this.$input._jqueryVal(val);
      } else {
        return this.$input._jqueryVal();
      }
    };
    this.$input.__view__ = this;
    allViewInstances.push(this);
  }

  // Internal: call the init method of the plugin
  constructPlugin(options) {
    return this.$input.spinner(options);
  }

  // Internal: Template for the "dropdown" markup
  //
  // Returns a String of HTML
  dropdownTemplate() {
    let options = (__range__(this.options.min, this.options.max, true).map((i) => this.optionTemplate(i)));
    return `<div
  class='${this.cssClasses.dropDownClass} numselect-container'
  style='width: ${this.$input.width()}px;'
  >
  ${options.join('')}
</div>`;
  }

  // Internal: Template for each option element in the "dropdown" markup
  //
  // Returns a String of HTML
  optionTemplate(optionValue) {
    let shouldBeSelected = () => {
      return optionValue === parseInt(this.$input._jqueryVal());
    };
    return `<div
  class='${this.cssClasses.dropDownOptionClass} numselect-option ${shouldBeSelected() ? 'selected' : ''}'
  data-value='${optionValue}'>
    ${optionValue}
</div>`;
  }

  // Public: Manifest the shim in the DOM and rig up all necessary event
  //         handlers.
  //
  // Returns this
  render() {
    this.constructPlugin(this.options);

    // The top level element needs to be relatively positioned so that the
    // dropdown and hotspot can be positioned against it.
    this.$el.css({
      'position': 'relative'
    });

    this.$hotspot = $('<div class="mobile-hotspot" style="height: 100%; width: 100%;"></div>');
    this.$hotspot
      .append(this.$dropDown = $(this.dropdownTemplate()));
    this.$el.prepend(this.$hotspot);

    this.positionDropdown();

    this.val(this.$input._jqueryVal());

    // Event Handlers
    this.$hotspot.on('tap taphold click vclick', e => {
      // prevent the click event that mobile browsers
      // send after touch events
      e.preventDefault();
      this.val(this.$input._jqueryVal());
      return this.showDropdown();
    });

    // Don't listen on 'tap' events because those are fired even when the user
    // attempts to scroll/drag
    this.$dropDown.on('click vclick', '.numselect-option', e => {
      e.stopImmediatePropagation();
      let value = $(e.target).data('value');
      if (value !== this.$input._jqueryVal()) {
        this.$input.trigger('change', {
          value
        });
      }
      this.$input._jqueryVal(value);
      return this.hideDropdown();
    });

    this.$input.change((event, o) => {
      if (typeof o === 'undefined' || o === null) {
        o = {
          value: this.$input._jqueryVal()
        };
      }
      __guardMethod__(this.options, 'valueChanged', o1 => o1.valueChanged(event, o));
      return __guardMethod__(this.options, 'spin', o2 => o2.spin(event, o));
    });
    return this;
  }

  // Internal: Cause the argued element to be the "selected" option
  //
  // element - a DOMElement
  //
  // Returns this
  selectOptionElement(element) {
    __guard__(this.$selectedOption, x => x.removeClass('selected'));
    this.$selectedOption = $(element);
    this.$selectedOption.addClass('selected');
    this.scrollToSelectOption();
    return this;
  }

  // Internal: Get or set which value is displayed as selected in the shim but
  //           do not change the value of the underlying input. If a `val` is
  //           argued the method acts as a setter, otherwise it acts as a
  //           getter.
  //
  // val - a String, if given
  //
  // Returns this or a String
  val(val) {
    if (val != null) {
      let $element = this.$dropDown.find(`[data-value='${val}']`);
      if ($element.size() > 0) {
        return this.selectOptionElement($element);
      }
    } else {
      return this.$selectedOption.data('value');
    }
  }

  // Internal: set the position of the "dropdown" element relative to the
  //           underlying input element.
  //
  // Returns this
  positionDropdown() {
    this.$dropDown.css({
      top: -(this.$dropDown.height() / 2) + (this.$input.height() / 2),
      left: 0
    });
    return this;
  }

  // Internal: Scroll the "dropdown" so that the selected option is at the top
  //           of its visible area
  //
  // Returns this
  scrollToSelectOption() {
    this.$dropDown.scrollTop(this.$selectedOption.index() * this.$selectedOption.outerHeight());
    return this;
  }

  // Internal: Self-explanatory.
  //
  // Returns this
  showDropdown(element) {
    this.$dropDown.show();
    this.scrollToSelectOption();
    return this;
  }

  // Internal: Self-explanatory.
  //
  // Returns this
  hideDropdown() {
    this.$dropDown.hide();
    return this;
  }

  onFocusOut() {
    return this.hideDropdown();
  }
}

export default {
  create: createShim,
  SpinnerView: SpinnerView
};

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}

function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
