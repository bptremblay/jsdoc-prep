/**
 * @module jquery.parsecss
 */
(function ($) {
  /**
   * @param selector
   */
  $.fn.findandfilter = function (selector) {
    const ret = this.filter(selector).add(this.find(selector));
    ret.prevObject = ret.prevObject.prevObject; // maintain the filter/end chain correctly (the filter and the find both push onto the chain). 
    return ret;
  };
  $.fn.parsecss = function (callback, parseAttributes) {
    /**
     * @param str
     */
    const parse = function (str) {
      $.parsecss(str, callback)
    }; // bind the callback
    this
      .findandfilter('style').each(function () {
        parse(this.innerHTML);
      })
      .end()
      .findandfilter('link[type="text/css"]').each(function () {
        if (!this.disabled && !/^\w+:/.test($(this).attr('href')) && $.parsecss.mediumApplies(this.media)) $.get(this.href, parse);
      })
      .end();
    if (parseAttributes) {
      $.get(location.pathname + location.search, function (HTMLtext) {
        styleAttributes(HTMLtext, callback);
      }, 'text');
    }
    return this;
  };
  /**
   * @param str  
   * @param callback  
   * @return {String}
   */
  $.parsecss = function (str, callback) {
    const ret = {};
    str = munge(str).replace(/@(([^;`]|`[^b]|`b[^%])*(`b%)?);?/g, function (s, rule) {
      processAtRule($.trim(rule), callback);
      return '';
    });
    $.each(str.split('`b%'), function (i, css) { // split on the end of a block 
      css = css.split('%b`'); // css[0] is the selector; css[1] is the index in munged for the cssText
      if (css.length < 2) return; // invalid css
      css[0] = restore(css[0]);
      ret[css[0]] = $.extend(ret[css[0]] || {}, parsedeclarations(css[1]));
    });
    callback(ret);
  };
  /**
   * @param str  
   * @return {Boolean}
   */
  $.parsecss.mediumApplies = (window.media && window.media.query) || function (str) {
    if (!str) return true; // if no descriptor, everything applies
    if (str in media) return media[str];
    const style = $(`<style media="${str}">body {position: relative; z-index: 1;}</style>`).appendTo('head');
    return media[str] = [$('body').css('z-index') == 1, style.remove()][0]; // the [x,y][0] is a silly hack to evaluate two expressions and return the first
  };
  /**
   * Returns true if is valid selector.
   * @param str  
   * @return {Object} boolean
   */
  $.parsecss.isValidSelector = function (str) {
    const s = $(`<style>${str}{}</style>`).appendTo('head')[0];
    return [s.styleSheet ? !/UNKNOWN/i.test(s.styleSheet.cssText) : !!s.sheet.cssRules.length, $(s).remove()][0]; // the [x,y][0] is a silly hack to evaluate two expressions and return the first
  };
  /**
   * @param str  
   * @return {array}
   */
  $.parsecss.parseArguments = function (str) {
    if (!str) return [];
    const ret = [],
      mungedArguments = munge(str, true).split(/\s+/); // can't use $.map because it flattens arrays !
    for (let i = 0; i < mungedArguments.length; ++i) {
      const a = restore(mungedArguments[i]);
      try {
        ret.push(eval(`(${a})`));
      } catch (err) {
        ret.push(a);
      }
    }
    return ret;
  };
  /**
   * @param css
   */
  $.parsecss.jquery = function (css) {
    for (let selector in css) {
      for (let property in css[selector]) {
        const match = /^-jquery(-(.*))?/.exec(property);
        if (!match) continue;
        const value = munge(css[selector][property]).split('!'); // exclamation point separates the parts of livequery actions
        const which = match[2];
        dojQuery(selector, which, restore(value[0]), restore(value[1]));
      }
    }
  };
  $.parsecss.styleAttributes = styleAttributes;
  var media = {}; // media description strings
  const munged = {}; // strings that were removed by the parser so they don't mess up searching for specific characters
  /**
   * @param index
   */
  function parsedeclarations(index) { // take a string from the munged array and parse it into an object of property: value pairs
    let str = munged[index].replace(/^{|}$/g, ''); // find the string and remove the surrounding braces
    str = munge(str); // make sure any internal braces or strings are escaped
    const parsed = {};
    $.each(str.split(';'), function (i, decl) {
      decl = decl.split(':');
      if (decl.length < 2) return;
      parsed[restore(decl[0])] = restore(decl.slice(1).join(':'));
    });
    return parsed;
  }
  const REbraces = /{[^{}]*}/;
  const REfull = /\[[^\[\]]*\]|{[^{}]*}|\([^()]*\)|function(\s+\w+)?(\s*%b`\d+`b%){2}/; // match pairs of parentheses, brackets, and braces and function definitions.
  const REatcomment = /\/\*@((?:[^\*]|\*[^\/])*)\*\//g; // comments of the form /*@ text */ have text parsed 
  const REcomment_string =
    /(?:\/\*(?:[^\*]|\*[^\/])*\*\/)|(\\.|"(?:[^\\\"]|\\.|\\\n)*"|'(?:[^\\\']|\\.|\\\n)*')/g;
  const REmunged = /%\w`(\d+)`\w%/;
  let uid = 0; // unique id number
  /**
   * @param str  
   * @param full  
   * @return {String}
   */
  function munge(str, full) {
    str = str
      .replace(REatcomment, '$1') // strip /*@ comments but leave the text (to let invalid CSS through)
      .replace(REcomment_string, function (s, string) { // strip strings and escaped characters, leaving munged markers, and strip comments
        if (!string) return '';
        const replacement = `%s\`${++uid}\`s%`;
        munged[uid] = string.replace(/^\\/, ''); // strip the backslash now
        return replacement;
      });
    const RE = full ? REfull : REbraces;
    while (match = RE.exec(str)) {
      replacement = `%b\`${++uid}\`b%`;
      munged[uid] = match[0];
      str = str.replace(RE, replacement);
    }
    return str;
  }
  /**
   * @param str
   */
  function restore(str) {
    if (str === undefined) return str;
    while (match = REmunged.exec(str)) {
      str = str.replace(REmunged, munged[match[1]]);
    }
    return $.trim(str);
  }
  /**
   * @param rule  
   * @param callback
   */
  function processAtRule(rule, callback) {
    const split = rule.split(/\s+/); // split on whitespace
    const type = split.shift(); // first word
    if (type == 'media') {
      const css = restore(split.pop()).slice(1, -1); // last word is the rule; need to strip the outermost braces
      if ($.parsecss.mediumApplies(split.join(' '))) {
        $.parsecss(css, callback);
      }
    } else if (type == 'import') {
      let url = restore(split.shift());
      if ($.parsecss.mediumApplies(split.join(' '))) {
        url = url.replace(/^url\(|\)$/gi, '').replace(/^["']|["']$/g, ''); // remove the url('...') wrapper
        $.get(url, function (str) {
          $.parsecss(str, callback)
        });
      }
    }
  }
  /**
   * @param selector  
   * @param which  
   * @param value  
   * @param value2  
   * @return {Function}
   */
  function dojQuery(selector, which, value, value2) { // value2 is the value for the livequery no longer match
    if (/show|hide/.test(which)) which += 'Default'; // -jquery-show is a shortcut for -jquery-showDefault
    if (value2 !== undefined && $.livequery) {
      var mode = 2;
    } else {
      mode = /\bthis\b/.test(value) ? 1 : 0;
    }
    if (which && $.fn[which]) {
      /**
       * @param str  
       * @return {Function}
       */
      function p(str) {
        return function () {
          return $.fn[which].apply($(this), $.parsecss.parseArguments.call(this, str))
        }
      };
      switch (mode) {
      case 0:
        return $.fn[which].apply($(selector), $.parsecss.parseArguments(value));
      case 1:
        return $(selector).each(p(value));
      case 2:
        return (new $.livequery(selector, document, undefined, p(value), value2 === '' ? undefined : p(value2))).run();
      }
    } else if (which) {
      return undefined;
    } else {
      switch (mode) {
      case 0:
        return eval(value);
      case 1:
        return $(selector).each(Function(value));
      case 2:
        return (new $.livequery(selector, document, undefined, Function(value), value2 === '' ? undefined : Function(value2))).run();
      }
    }
  }
  const _show = {
    show: $.fn.show,
    hide: $.fn.hide
  }; // save the originals
  $.each(['show', 'hide'], function () {
    const which = this,
      show = _show[which],
      plugin = which + 'Default';
    /**
     * @function
     */
    $.fn[which] = function () {
      if (arguments.length > 0) return show.apply(this, arguments);
      return this.each(function () {
        const fn = $.data(this, plugin),
          $this = $(this);
        if (fn) {
          $.removeData(this, plugin); // prevent the infinite loop
          fn.call($this);
          $this.queue(function () {
            $this.data(plugin, fn).dequeue()
          }); // put the function back at the end of the animation
        } else {
          show.call($this);
        }
      });
    };
    /**
     * @function
     */
    $.fn[plugin] = function () {
      const args = $.makeArray(arguments),
        name = args[0];
      if ($.fn[name]) { // a plugin
        args.shift();
        var fn = $.fn[name];
      } else if ($.effects && $.effects[name]) { // a jQuery UI effect. They require an options object as the second argument
        if (typeof args[1] != 'object') args.splice(1, 0, {});
        fn = _show[which];
      } else { // regular show/hide
        fn = _show[which];
      }
      return this.data(plugin, function () {
        fn.apply(this, args)
      });
    };
  });
  const RESGMLcomment = /<!--([^-]|-[^-])*-->/g; // as above, a simplification of real comments. Don't put -- in your HTML comments!
  const REnotATag = /(>)[^<]*/g;
  const REtag = /<(\w+)([^>]*)>/g;
  /**
   * @param HTMLtext  
   * @param callback
   */
  function styleAttributes(HTMLtext, callback) {
    let ret = '',
      style, tags = {}; //  keep track of tags so we can identify elements unambiguously
    HTMLtext = HTMLtext.replace(RESGMLcomment, '').replace(REnotATag, '$1');
    munge(HTMLtext).replace(REtag, function (s, tag, attrs) {
      tag = tag.toLowerCase();
      if (tags[tag]) ++tags[tag];
      else tags[tag] = 1;
      if (style = /\bstyle\s*=\s*(%s`\d+`s%)/i.exec(attrs)) { // style attributes must be of the form style = "a: bc" ; they must be in quotes. After munging, they are marked with numbers. Grab that number
        let id = /\bid\s*=\s*(\S+)/i.exec(attrs); // find the id if there is one.
        if (id) id = `#${restore(id[1]).replace(/^['"]|['"]$/g, '')}`;
        else id = tag + ':eq(' + (tags[tag] - 1) + ')';
        ret += [id, '{', restore(style[1]).replace(/^['"]|['"]$/g, ''), '}'].join('');
      }
    });
    $.parsecss(ret, callback);
  }
})(jQuery);