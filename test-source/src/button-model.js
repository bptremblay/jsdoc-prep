//fixed constructor order in class
define([
  'underscore',
  'backbone',
  'button-editor-path/legacy-color-check',
  'i18n!button-editor-path/nls/button-editor',
  'galileo-lib/modules/services/url-validator-service'
], function(_, Backbone, legacyColorCheck, i18n, UrlValidator) {

  if (typeof _ === 'undefined' || _ === null) { ({ _ } = window); }

  let setColorAttr = undefined;
  class ButtonModel extends Backbone.Model {
    static initClass() {
  
      this.prototype.FONT_SIZE_MAX_VALUE = 48;
      this.prototype.defaults = {
        link: null,
        linkType: 'web',
        text: i18n.placeholder_text,
        backgroundColor: {
          global: '#494',
          local: 'transparent'
        },
        height: 24,
        alignment: 'center',
        fontColor: '',
        fontFamily: '',
        fontSize: '',
        fontWeight: 'normal',
        fontStyle: 'normal'
      };
  
      setColorAttr = function(that, colorAttr, type, newColor, options) {
        let bgColor = _.clone(that.get(colorAttr)); // ensures change event is triggered
        bgColor[type] = newColor;
        return that.set(colorAttr, bgColor, options);
      };
    }
    constructor() {
      super(...arguments);
      for (let method of _.keys(ButtonModel.prototype.defaults)) { if (this[method] == null) { this[method] = this._makeGetOrSet(method); } }
      this.fontSize = function(val, options) {
        if (val != null) {
          let newval =
          !isNaN(parseInt(val)) ?
            Math.max(0, Math.min(val, this.FONT_SIZE_MAX_VALUE)) : undefined;

          if (newval !== val) {
            this.trigger('limit:fontSize', this);
            val = newval;
          }
          return this.set('fontSize', val, options);
        } else {
          return this.get('fontSize');
        }
      };
    }

















    _makeGetOrSet(attr) {
      return function(val, options) {
        if (val != null) {
          return this.set(attr, val, options);
        } else {
          return this.get(attr, val);
        }
      };
    }

    _cleanURL(url) {
      url = url.replace(/^http:\/\//, '').trim();
      // decode first because '%20' becomes '%2520' otherwise
      if (url.indexOf(' ' === !-1)) { return encodeURI(decodeURI(url)); }
    }

    validate(attrs, options) {
      if (attrs.link != null) {
        let urlValidator = new UrlValidator(attrs.link);

        if (!urlValidator.isValid()) {
          return urlValidator.getError();
        }
      }
    }

    getError() {
      if (!this.isValid()) {
        return this.validationError;
      }
    }

    setLink(val, options) {
      if (!val) {
        this.set('link', null, options);
        return;
      }

      val = val.trim();
      if (!__guard__(options, x => x.noProtocol)) { val = this._cleanURL(val); }
      if (__guard__(options, x1 => x1.noProtocol)) {
        return this.set('link', val, options);
      } else if (/^.+:/.test(val)) {
        return this.set('link', val, options);
      } else if (/^[\w\.-]+@[\w\.-]+\.\w+/.test(val)) {
        return this.set('link', `mailto:${val}`, options);
      } else {
        return this.set('link', `http://${val}`, options);
      }
    }

    toggleBold() {
      return this._toggle('fontWeight', ['bold', 'normal']);
    }

    toggleItalic() {
      return this._toggle('fontStyle', ['italic', 'normal']);
    }

    _toggle(propertyName, options) {
      let property = this.get(propertyName);
      if (property === options[0]) {
        return this.set(propertyName, options[1]);
      } else {
        return this.set(propertyName, options[0]);
      }
    }

    usingLocalColors() {
      return this.backgroundColor().local !== 'transparent';
    }

    getBackgroundColor() {
      if (this.usingLocalColors()) {
        return this.backgroundColor().local;
      } else if (legacyColorCheck.usesLegacyGlobalColors($(this.get('markup')))) {
        return this.backgroundColor().global;
      } else { return ''; }
    }

    setGlobalBackgroundColor(newColor, options) {
      return setColorAttr(this, 'backgroundColor', 'global', newColor, options);
    }

    setLocalBackgroundColor(newColor) {
      return setColorAttr(this, 'backgroundColor', 'local', newColor);
    }
  }
  return ButtonModel.initClass();
});

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}