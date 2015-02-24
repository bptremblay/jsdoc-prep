(function() {
  
  
  // jslint.js
  // 2007-04-28
  /*
   * Copyright (c) 2002 Douglas Crockford (www.JSLint.com) Permission is hereby
   * granted, free of charge, to any person obtaining a copy of this software
   * and associated documentation files (the "Software"), to deal in the
   * Software without restriction, including without limitation the rights to
   * use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions: The above
   * copyright notice and this permission notice shall be included in all copies
   * or substantial portions of the Software. The Software shall be used for
   * Good, not Evil. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
   * KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
   * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
   * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
   * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
   * USE OR OTHER DEALINGS IN THE SOFTWARE.
   */

  /*
   * JSLINT is a global function. It takes two parameters. var myResult =
   * JSLINT(source, option); The first parameter is either a string or an array
   * of strings. If it is a string, it will be split on '\n' or '\r'. If it is
   * an array of strings, it is assumed that each string represents one line.
   * The source can be a JavaScript text, or HTML text, or a Konfabulator text.
   * The second parameter is an optional object of options which control the
   * operation of JSLINT. All of the options are booleans. All are optional and
   * have a default value of false. If it checks out, JSLINT returns true.
   * Otherwise, it returns false. If false, you can inspect JSLINT.errors to
   * find out the problems. JSLINT.errors is an array of objects containing
   * these members: { line : The line (relative to 0) at which the lint was
   * found character : The character (relative to 0) at which the lint was found
   * reason : The problem evidence : The text line in which the problem occurred
   * raw : The raw message before the details were inserted a : The first detail
   * b : The second detail c : The third detail d : The fourth detail } If a
   * fatal error was found, a null will be the last element of the JSLINT.errors
   * array. You can request a Function Report, which shows all of the functions
   * and the parameters and vars that they use. This can be used to find implied
   * global variables and other problems. The report is in HTML and can be
   * inserted in a <body>. var myReport = JSLINT.report(option); If the option
   * is true, then the report will be limited to only errors.
   */

  /* jslint evil: true */

  Object.prototype.beget = function() {
    function F() {
    }
    F.prototype = this;
    return new F();
  };

  String.prototype.entityify = function() {
    return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g,
        '&gt;');
  };

  String.prototype.isAlpha = function() {
    return (this >= 'a' && this <= 'z\uffff')
        || (this >= 'A' && this <= 'Z\uffff');
  };

  String.prototype.isDigit = function() {
    return (this >= '0' && this <= '9');
  };

  String.prototype.supplant = function(o) {
    var i, j, s = this, v;
    for (;;) {
      i = s.lastIndexOf('{');
      if (i < 0) {
        break;
      }
      j = s.indexOf('}', i);
      if (i + 1 >= j) {
        break;
      }
      v = o[s.substring(i + 1, j)];
      if (typeof v !== 'string' && typeof v !== 'number') {
        break;
      }
      s = s.substring(0, i) + v + s.substring(j + 1);
    }
    return s;
  };

  // We build the application inside a function so that we produce only a single
  // global variable. The function will be invoked, its return value is the
  // JSLINT
  // function itself.

  var JSLINT;
  JSLINT = function() {

    // These are words that should not be permitted in third party ads.

    var adsafe = {
      alert : true,
      back : true,
      close : true,
      confirm : true,
      constructor : true,
      createpopup : true,
      defaultstatus : true,
      document : true,
      execScript : true,
      external : true,
      forms : true,
      forward : true,
      frameelement : true,
      fromcharcode : true,
      history : true,
      home : true,
      location : true,
      moveby : true,
      moveto : true,
      navigate : true,
      opener : true,
      parent : true,
      print : true,
      prompt : true,
      prototype : true,
      resizeby : true,
      resizeto : true,
      self : true,
      showhelp : true,
      showmodaldialog : true,
      status : true,
      stop : true,
      top : true,
      window : true
    };

    // These are all of the JSLint options.

    var allOptions = {
      adsafe : true, // if use of some browser features should be restricted
      bitwise : true, // if bitwise operators should not be allowed
      browser : true, // if the standard browser globals should be predefined
      cap : true, // if upper case HTML should be allowed
      debug : true, // if debugger statements should be allowed
      eqeqeq : true, // if === should be required
      evil : true, // if eval should be allowed
      fragment : true, // if HTML fragments should be allowed
      laxbreak : true, // if line breaks should not be checked
      nomen : true, // if names should be checked
      passfail : true, // if the scan should stop on first error
      plusplus : true, // if increment/decrement should not be allowed
      rhino : true, // if the Rhino environment globals should be predefined
      undef : true, // if undefined variables are errors
      white : true, // if strict whitespace rules apply
      widget : true
    // if the Yahoo Widgets globals should be predefined
    };

    var anonname; // The guessed name for anonymous functions.

    // browser contains a set of global names which are commonly provided by a
    // web browser environment.

    var browser = {
      alert : true,
      blur : true,
      clearInterval : true,
      clearTimeout : true,
      close : true,
      closed : true,
      confirm : true,
      console : true,
      Debug : true,
      defaultStatus : true,
      document : true,
      event : true,
      focus : true,
      frames : true,
      history : true,
      Image : true,
      length : true,
      location : true,
      moveBy : true,
      moveTo : true,
      name : true,
      navigator : true,
      onblur : true,
      onerror : true,
      onfocus : true,
      onload : true,
      onresize : true,
      onunload : true,
      open : true,
      opener : true,
      opera : true,
      parent : true,
      print : true,
      prompt : true,
      resizeBy : true,
      resizeTo : true,
      screen : true,
      scroll : true,
      scrollBy : true,
      scrollTo : true,
      self : true,
      setInterval : true,
      setTimeout : true,
      status : true,
      top : true,
      window : true,
      XMLHttpRequest : true
    };
    var funlab;
    var funstack;
    var functions;
    var globals;
    var inblock;
    var indent;

    // konfab contains the global names which are provided to a Yahoo
    // (fna Konfabulator) widget.

    var konfab = {
      alert : true,
      appleScript : true,
      animator : true,
      appleScript : true,
      beep : true,
      bytesToUIString : true,
      chooseColor : true,
      chooseFile : true,
      chooseFolder : true,
      convertPathToHFS : true,
      convertPathToPlatform : true,
      closeWidget : true,
      CustomAnimation : true,
      escape : true,
      FadeAnimation : true,
      focusWidget : true,
      form : true,
      include : true,
      isApplicationRunning : true,
      iTunes : true,
      konfabulatorVersion : true,
      log : true,
      MoveAnimation : true,
      openURL : true,
      play : true,
      popupMenu : true,
      print : true,
      prompt : true,
      reloadWidget : true,
      resolvePath : true,
      resumeUpdates : true,
      RotateAnimation : true,
      runCommand : true,
      runCommandInBg : true,
      saveAs : true,
      savePreferences : true,
      showWidgetPreferences : true,
      sleep : true,
      speak : true,
      suppressUpdates : true,
      tellWidget : true,
      unescape : true,
      updateNow : true,
      yahooCheckLogin : true,
      yahooLogin : true,
      yahooLogout : true,
      COM : true,
      filesystem : true,
      preferenceGroups : true,
      preferences : true,
      screen : true,
      system : true,
      URL : true,
      XMLDOM : true,
      XMLHttpRequest : true
    };
    var lines;
    var lookahead;
    var member;
    var nexttoken;
    var noreach;
    var option;
    var prevtoken;
    var quit;
    var rhino = {
      defineClass : true,
      deserialize : true,
      gc : true,
      help : true,
      load : true,
      loadClass : true,
      print : true,
      quit : true,
      readFile : true,
      readUrl : true,
      runCommand : true,
      seal : true,
      serialize : true,
      spawn : true,
      sync : true,
      toint32 : true,
      version : true
    };
    var stack;

    // standard contains the global names that are provided by standard
    // JavaScript.

    var standard = {
      Array : true,
      Boolean : true,
      Date : true,
      decodeURI : true,
      decodeURIComponent : true,
      encodeURI : true,
      encodeURIComponent : true,
      Error : true,
      escape : true,
      'eval' : true,
      EvalError : true,
      Function : true,
      isFinite : true,
      isNaN : true,
      Math : true,
      Number : true,
      Object : true,
      parseInt : true,
      parseFloat : true,
      RangeError : true,
      ReferenceError : true,
      RegExp : true,
      String : true,
      SyntaxError : true,
      TypeError : true,
      unescape : true,
      URIError : true
    };
    var syntax = {};
    var token;
    var verb;
    var warnings;
    var wmode;

    // xmode is used to adapt to the exceptions in XML parsing.
    // It can have these states:
    // false .js script file
    // " A " attribute
    // ' A ' attribute
    // content The content of a script tag
    // CDATA A CDATA block

    var xmode;

    // xtype identifies the type of document being analyzed.
    // It can have these states:
    // false .js script file
    // html .html file
    // widget .kon Konfabulator file

    var xtype;
    // token
    var tx = /^\s*([(){}[.,:;'"~]|\](\]>)?|\?>?|==?=?|\/(\*(global|extern|jslint)?|=|\/)?|\*[\/=]?|\+[+=]?|-[-=]?|%[=>]?|&[&=]?|\|[|=]?|>>?>?=?|<([\/=%\?]|\!(\[|--)?|<=?)?|\^=?|\!=?=?|[a-zA-Z_$][a-zA-Z0-9_$]*|[0-9]+([xX][0-9a-fA-F]+|\.[0-9]*)?([eE][+-]?[0-9]+)?)/;
    // regular expression
    var rx = /^(\\[^\x00-\x1f]|\[(\\[^\x00-\x1f]|[^\x00-\x1f\\\/])*\]|[^\x00-\x1f\\\/\[])+\/[gim]*/;
    // star slash
    var lx = /\*\/|\/\*/;
    // global identifier
    var gx = /^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)/;
    // identifier
    var ix = /^([a-zA-Z_$][a-zA-Z0-9_$]*$)/;
    // global separators
    var hx = /^[\x00-\x20]*(,|\*\/)/;
    // boolean
    var bx = /^\s*(true|false)/;
    // colon
    var cx = /^\s*(:)/;
    // javascript url
    var jx = /(javascript|jscript|ecmascript)\s*:/i;

    // Produce an error warning.

    function warning(m, t, a, b, c, d) {
      var ch, l, w;
      t = t || nexttoken;
      if (t.id === '(end)') {
        t = token;
      }
      l = t.line || 0;
      ch = t.from || 0;
      w = {
        id : '(error)',
        raw : m,
        evidence : lines[l] || '',
        line : l,
        character : ch,
        a : a,
        b : b,
        c : c,
        d : d
      };
      w.reason = m.supplant(w);
      JSLINT.errors.push(w);
      if (option.passfail) {
        quit('Stopping. ', l, ch);
      }
      warnings += 1;
      if (warnings === 4096) {
        quit("Too many errors.", l, ch);
      }
      return w;
    }

    function warningAt(m, l, ch, a, b, c, d) {
      var w = warning(m, {
        line : l,
        from : ch
      }, a, b, c, d);
      return w;
    }

    function error(m, t, a, b, c, d) {
      var w = warning(m, t, a, b, c, d);
      alert("parser aborted in file " + top.shortName + "\r\n" + w.evidence
          + "\r\n" + w.line);
      quit("Stopping, unable to continue.", w.line, w.character);
    }

    function errorAt(m, l, ch, a, b, c, d) {
      return error(m, {
        line : l,
        from : ch
      }, a, b, c, d);
    }

    quit = function(m, l, ch) {
      // alert("parser aborted in file "+ top.shortName);
      warningAt("{a} ({b}% scanned).", l, ch, m, Math
          .floor((l / lines.length) * 100));
      JSLINT.errors.push(null);
      // alert("parser aborted in file " + top.shortName + "\r\n" + w.evidence +
      // "\r\n" + w.line);

      throw null;
    };

    // lexical analysis

    var lex = function() {
      var character;
      var from;
      var line;
      var s;

      // Private lex methods

      function nextLine() {
        line += 1;
        if (line >= lines.length) {
          return false;
        }
        character = 0;
        s = lines[line];
        return true;
      }

      // Produce a token object. The token inherits from a syntax symbol.

      function it(type, value) {
        var t;
        if (option.adsafe && adsafe.hasOwnProperty(value.toLowerCase())) {
          warning("Adsafe restricted word '{a}'.", {
            line : line,
            from : character
          }, value);
        }
        if (type === '(punctuator)') {
          t = syntax[value];
        } else if (type === '(identifier)') {
          t = syntax[value];
          if (!t || typeof t !== 'object') {
            t = syntax[type];
          }
        } else {
          t = syntax[type];
        }
        t = t.beget();
        if (value || type === '(string)') {
          if (/(javascript|jscript|ecmascript)\s*:/i.test(value)) {
            warningAt("JavaScript URL.", line, from);
          }
          t.value = value;
        }
        t.line = line;
        t.character = character;
        t.from = from;
        return t;
      }

      // Public lex methods

      return {
        init : function(source) {
          if (typeof source === 'string') {
            lines = source.split('\r\n');
            if (lines.length === 1) {
              lines = lines[0].split('\n');
              if (lines.length === 1) {
                lines = lines[0].split('\r');
              }
            }
          } else {
            lines = source;
          }
          line = 0;
          character = 0;
          from = 0;
          s = lines[0];
        },

        // token -- this is called by advance to get the next token.

        token : function() {
          var c;
          var i;
          var l;
          var r;
          var t;

          function match(x) {
            var r = x.exec(s), r1;
            if (r) {
              l = r[0].length;
              r1 = r[1];
              c = r1.charAt(0);
              s = s.substr(l);
              character += l;
              from = character - r1.length;
              return r1;
            }
          }

          function more() {
            while (!s) {
              if (!nextLine()) {
                errorAt("Unclosed comment.", line, character);
              }
            }
          }

          function string(x) {
            var c, j, r = '';

            if (xmode === x || xmode === 'string') {
              return it('(punctuator)', x);
            }

            function esc(n) {
              var i = parseInt(s.substr(j + 1, n), 16);
              j += n;
              if (i >= 32 && i <= 127) {
                warningAt("Unnecessary escapement.", line, character);
              }
              character += n;
              c = String.fromCharCode(i);
            }

            for (j = 0; j < s.length; j += 1) {
              c = s.charAt(j);
              if (c === x) {
                character += 1;
                s = s.substr(j + 1);
                return it('(string)', r);
              }
              if (c < ' ') {
                if (c === '\n' || c === '\r') {
                  break;
                }
                warningAt("Control character in string: {a}.", line, character
                    + j, s.substring(0, j));
              }
              if (c === '\\') {
                j += 1;
                character += 1;
                c = s.charAt(j);
                switch (c) {
                  case '\\':
                  case '\'':
                  case '"':
                  case '/':
                    break;
                  case 'b':
                    c = '\b';
                    break;
                  case 'f':
                    c = '\f';
                    break;
                  case 'n':
                    c = '\n';
                    break;
                  case 'r':
                    c = '\r';
                    break;
                  case 't':
                    c = '\t';
                    break;
                  case 'u':
                    esc(4);
                    break;
                  case 'v':
                    c = '\v';
                    break;
                  case 'x':
                    esc(2);
                    break;
                  default:
                    warningAt("Bad escapement.", line, character);
                }
              }
              r += c;
              character += 1;
            }
            errorAt("Unclosed string.", line, from);
          }

          for (;;) {
            if (!s) {
              return it(nextLine() ? '(endline)' : '(end)', '');
            }
            t = match(tx);
            if (!t) {
              t = '';
              c = '';
              while (s && s < '!') {
                s = s.substr(1);
              }
              if (s) {
                errorAt("Unexpected '{a}'.", line, character, s.substr(0, 1));
              }
            }

            // identifier

            if (c.isAlpha() || c === '_' || c === '$') {
              return it('(identifier)', t);
            }

            // number

            if (c.isDigit()) {
              if (!isFinite(Number(t))) {
                warningAt("Bad number '{a}'.", line, character, t);
              }
              if (s.substr(0, 1).isAlpha()) {
                warningAt("Missing space after '{a}'.", line, character, t);
              }
              if (c === '0' && t.substr(1, 1).isDigit()) {
                warningAt("Don't use extra leading zeros '{a}'.", line,
                    character, t);
              }
              if (t.substr(t.length - 1) === '.') {
                warningAt(
                    "A trailing decimal point can be confused with a dot '{a}'.",
                    line, character, t);
              }
              return it('(number)', t);
            }

            // string

            switch (t) {
              case '"':
              case "'":
                return string(t);

                // // comment

              case '//':
                s = '';
                break;

              // /* comment

              case '/*':
                for (;;) {
                  i = s.search(lx);
                  if (i >= 0) {
                    break;
                  }
                  if (!nextLine()) {
                    errorAt("Unclosed comment.", line, character);
                  }
                }
                character += i + 2;
                if (s.substr(i, 1) === '/') {
                  errorAt("Nested comment.", line, character);
                }
                s = s.substr(i + 2);
                break;

              // /*extern

              case '/*extern':
              case '/*global':
                for (;;) {
                  more();
                  r = match(hx);
                  if (r === '*/') {
                    break;
                  }
                  if (r !== ',') {
                    more();
                    r = match(gx);
                    if (r) {
                      globals[r] = true;
                    } else {
                      errorAt("Bad extern identifier '{a}'.", line, character,
                          s);
                    }
                  }
                }
                return this.token();

                // /*jslint

              case '/*jslint':
                if (option.adsafe) {
                  errorAt("Adsafe restriction.", line, character);
                }
                for (;;) {
                  more();
                  r = match(hx);
                  if (r === '*/') {
                    break;
                  }
                  if (r !== ',') {
                    more();
                    r = match(gx);
                    if (r) {
                      if (!allOptions.hasOwnProperty(r)) {
                        errorAt("Bad jslint option '{a}'.", line, character, r);
                      }
                      more();
                      if (!match(cx)) {
                        errorAt("Missing ':' after '{a}'.", line, character, r);
                      }
                      more();
                      t = match(bx);
                      if (!t) {
                        errorAt("Missing boolean after '{a}'.", line,
                            character, r);
                      }
                      option[r] = t === 'true';
                    } else {
                      errorAt("Bad jslint option '{a}'.", line, character, s);
                    }
                  }
                }
                break;

              // */

              case '*/':
                errorAt("Unbegun comment.", line, character);
                break;

              case '':
                break;

              // punctuator

              default:
                return it('(punctuator)', t);
            }
          }
        },

        // skip -- skip past the next occurrence of a particular string.
        // If the argument is empty, skip to just before the next '<' character.
        // This is used to ignore HTML content. Return false if it isn't found.

        skip : function(p) {
          var i, t = p;
          if (nexttoken.id) {
            if (!t) {
              t = '';
              if (nexttoken.id.substr(0, 1) === '<') {
                lookahead.push(nexttoken);
                return true;
              }
            } else if (nexttoken.id.indexOf(t) >= 0) {
              return true;
            }
          }
          token = nexttoken;
          nexttoken = syntax['(end)'];
          for (;;) {
            i = s.indexOf(t || '<');
            if (i >= 0) {
              character += i + t.length;
              s = s.substr(i + t.length);
              return true;
            }
            if (!nextLine()) {
              break;
            }
          }
          return false;
        },

        // regex -- this is called by parse when it sees '/' being used as a
        // prefix.

        regex : function() {
          var l;
          var r = rx.exec(s);
          var x;
          if (r) {
            l = r[0].length;
            character += l;
            s = s.substr(l);
            x = r[1];
            return it('(regex)', x);
          }
          errorAt("Bad regular expression.", line, character);
        }
      };
    }();

    function builtin(name) {
      return standard[name] === true || globals[name] === true
          || (option.rhino && rhino[name] === true)
          || ((xtype === 'widget' || option.widget) && konfab[name] === true)
          || ((xtype === 'html' || option.browser) && browser[name] === true);
    }

    function addlabel(t, type) {
      if (t) {
        if (typeof funlab[t] === 'string') {
          switch (funlab[t]) {
            case 'var':
            case 'var*':
              if (type === 'global') {
                funlab[t] = 'var*';
                return;
              }
              break;
            case 'global':
              if (type === 'var') {
                warning("Variable {a} was used before it was declared.", token,
                    t);
                return;
              }
              if (type === 'var*' || type === 'global') {
                return;
              }
              break;
            case 'function':
            case 'parameter':
              if (type === 'global') {
                return;
              }
              break;
          }
          warning("Identifier {a} already declared as {b}.", token, t,
              funlab[t]);
        }
        funlab[t] = type;
      }
    }

    // We need a peek function. If it has an argument, it peeks that much
    // farther
    // ahead. It is used to distinguish
    // for ( var i in ...
    // from
    // for ( var i = ...

    function peek(p) {
      var i = p || 0, j = 0;
      var t;

      while (j <= i) {
        t = lookahead[j];
        if (!t) {
          t = lookahead[j] = lex.token();
        }
        j += 1;
      }
      return t;
    }

    var badbreak = {
      ')' : true,
      ']' : true,
      '++' : true,
      '--' : true
    };

    // Produce the next token. It looks for programming errors.

    function advance(id, t) {
      var l;
      switch (token.id) {
        case '(number)':
          if (nexttoken.id === '.') {
            warning(
                "A dot following a number can be confused with a decimal point.",
                token);
          }
          break;
        case '-':
          if (nexttoken.id === '-' || nexttoken.id === '--') {
            warning("Confusing minusses.");
          }
          break;
        case '+':
          if (nexttoken.id === '+' || nexttoken.id === '++') {
            warning("Confusing plusses.");
          }
          break;
      }
      if (token.type === '(string)' || token.identifier) {
        anonname = token.value;
      }

      if (id && nexttoken.value !== id) {
        if (t) {
          if (nexttoken.id === '(end)') {
            warning("Unmatched '{a}'.", t, t.id);
          } else {
            warning(
                "Expected '{a}' to match '{b}' from line {c} and instead saw '{d}'.",
                nexttoken, id, t.id, t.line + 1, nexttoken.value);
          }
        } else {
          warning("Expected '{a}' and instead saw '{b}'.", nexttoken, id,
              nexttoken.value);
        }
      }
      prevtoken = token;
      token = nexttoken;
      for (;;) {
        nexttoken = lookahead.shift() || lex.token();
        if (nexttoken.id === '<![') {
          if (xtype === 'html') {
            error("Unexpected '{a}'.", nexttoken, '<![');
          }
          if (xmode === 'script') {
            nexttoken = lex.token();
            if (nexttoken.value !== 'CDATA') {
              error("Missing '{a}'.", nexttoken, 'CDATA');
            }
            nexttoken = lex.token();
            if (nexttoken.id !== '[') {
              error("Missing '{a}'.", nexttoken, '[');
            }
            xmode = 'CDATA';
          } else if (xmode === 'xml') {
            lex.skip(']]>');
          } else {
            error("Unexpected '{a}'.", nexttoken, '<![');
          }
        } else if (nexttoken.id === ']]>') {
          if (xmode === 'CDATA') {
            xmode = 'script';
          } else {
            error("Unexpected '{a}'.", nexttoken, ']]>');
          }
        } else if (nexttoken.id !== '(endline)') {
          break;
        }
        if (xmode === '"' || xmode === "'") {
          error("Missing '{a}'.", token, xmode);
        }
        l = !xmode
            && !option.laxbreak
            && (token.type === '(string)' || token.type === '(number)'
                || token.type === '(identifier)' || badbreak[token.id]);
      }
      if (l) {
        switch (nexttoken.id) {
          case '{':
          case '}':
          case ']':
            break;
          case ')':
            switch (token.id) {
              case ')':
              case '}':
              case ']':
                break;
              default:
                warning("Line breaking error '{a}'.", token, ')');
            }
            break;
          default:
            warning("Line breaking error '{a}'.", token, token.value);
        }
      }
      if (xtype === 'widget' && xmode === 'script' && nexttoken.id) {
        l = nexttoken.id.charAt(0);
        if (l === '<' || l === '&') {
          nexttoken.nud = nexttoken.led = null;
          nexttoken.lbp = 0;
          nexttoken.reach = true;
        }
      }
    }

    function advanceregex() {
      nexttoken = lex.regex();
    }

    function beginfunction(i) {
      var f = {
        '(name)' : i,
        '(line)' : nexttoken.line + 1,
        '(context)' : funlab
      };
      funstack.push(funlab);
      funlab = f;
      functions.push(funlab);
    }

    function endfunction() {
      funlab = funstack.pop();
    }

    // This is the heart of JSLINT, the Pratt parser. In addition to parsing, it
    // is looking for ad hoc lint patterns. We add to Pratt's model .fud, which
    // is
    // like nud except that it is only used on the first token of a statement.
    // Having .fud makes it much easier to define JavaScript. I retained Pratt's
    // nomenclature.

    // .nud Null denotation
    // .fud First null denotation
    // .led Left denotation
    // lbp Left binding power
    // rbp Right binding power

    // They are key to the parsing method called Top Down Operator Precedence.

    function parse(rbp, initial) {
      var l;
      var left;
      var o;
      if (nexttoken.id && nexttoken.id === '/') {
        if ('(=:,!?[&|'.indexOf(token.id.charAt(0)) < 0) {
          warning(
              "Expected to see a '(' or '=' or ':' or ',' or '[' preceding a regular expression literal, and instead saw '{a}'.",
              token, token.value);
        }
        advanceregex();
      }
      if (nexttoken.id === '(end)') {
        error("Unexpected early end of program.", token);
      }
      advance();
      if (initial) {
        anonname = '"anonymous"';
        verb = token.value;
      }
      if (initial && token.fud) {
        token.fud();
      } else {
        if (token.nud) {
          o = token.exps;
          left = token.nud();
        } else {
          if (nexttoken.type === '(number)' && token.id === '.') {
            warning(
                "A leading decimal point can be confused with a dot: '.{a}'.",
                token, nexttoken.value);
            advance();
            return token;
          } else {
            error("Expected an identifier and instead saw '{a}'.", token,
                token.id);
          }
        }
        while (rbp < nexttoken.lbp) {
          o = nexttoken.exps;
          advance();
          if (token.led) {
            left = token.led(left);
          } else {
            error("Expected an operator and instead saw '{a}'.", token,
                token.id);
          }
        }
        if (initial && !o) {
          warning(
              "Expected an assignment or function call and instead saw an expression.",
              token);
        }
      }
      if (l) {
        funlab[l] = 'label';
      }
      if (!option.evil && left && left.value === 'eval') {
        warning("eval is evil.", left);
      }
      return left;
    }

    // Functions for conformance of style.

    function adjacent(left, right) {
      if (option.white) {
        if (left.character !== right.from) {
          warning("Unexpected space after '{a}'.", nexttoken, left.value);
        }
      }
    }

    function nonadjacent(left, right) {
      if (option.white) {
        if (left.character === right.from) {
          warning("Missing space after '{a}'.", nexttoken, left.value);
        }
      }
    }

    function indentation(bias) {
      var i;
      if (option.white && nexttoken.id !== '(end)') {
        i = indent + (bias || 0);
        if (nexttoken.from !== i) {
          warning(
              "Expected '{a}' to have an indentation of {b} instead of {c}.",
              nexttoken, nexttoken.value, i, nexttoken.from);
        }
      }
    }

    // Parasitic constructors for making the symbols that will be inherited by
    // tokens.

    function symbol(s, p) {
      return syntax[s] || (syntax[s] = {
        id : s,
        lbp : p,
        value : s
      });
    }

    function delim(s) {
      return symbol(s, 0);
    }

    function stmt(s, f) {
      var x = delim(s);
      x.identifier = x.reserved = true;
      x.fud = f;
      return x;
    }

    function blockstmt(s, f) {
      var x = stmt(s, f);
      x.block = true;
      return x;
    }

    function reserveName(x) {
      var c = x.id.charAt(0);
      if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
        x.identifier = x.reserved = true;
      }
      return x;
    }

    function prefix(s, f) {
      var x = symbol(s, 150);
      reserveName(x);
      x.nud = (typeof f === 'function') ? f : function() {
        if (option.plusplus && (this.id === '++' || this.id === '--')) {
          warning("Unexpected use of '{a}'.", this, this.id);
        }
        parse(150);
        return this;
      };
      return x;
    }

    function type(s, f) {
      var x = delim(s);
      x.type = s;
      x.nud = f;
      return x;
    }

    function reserve(s, f) {
      var x = type(s, f);
      x.identifier = x.reserved = true;
      return x;
    }

    function reservevar(s) {
      return reserve(s, function() {
        return this;
      });
    }

    function infix(s, f, p) {
      var x = symbol(s, p);
      reserveName(x);
      x.led = (typeof f === 'function') ? f : function(left) {
        nonadjacent(prevtoken, token);
        nonadjacent(token, nexttoken);
        return [ this.id, left, parse(p) ];
      };
      return x;
    }

    function relation(s, f) {
      var x = symbol(s, 100);
      x.led = function(left) {
        nonadjacent(prevtoken, token);
        nonadjacent(token, nexttoken);
        var right = parse(100);
        if ((left && left.id === 'NaN') || (right && right.id === 'NaN')) {
          warning("Use the isNaN function to compare with NaN.", this);
        } else if (f) {
          f.apply(this, [ left, right ]);
        }
        return [ this.id, left, right ];
      };
      return x;
    }

    function isPoorRelation(node) {
      return (node.type === '(number)' && !+node.value)
          || (node.type === '(string)' && !node.value) || node.type === 'true'
          || node.type === 'false' || node.type === 'undefined'
          || node.type === 'null';
    }

    function assignop(s, f) {
      symbol(s, 20).exps = true;
      return infix(
          s,
          function(left) {
            nonadjacent(prevtoken, token);
            nonadjacent(token, nexttoken);
            if (left) {
              if (left.id === '.' || left.id === '['
                  || (left.identifier && !left.reserved)) {
                parse(19);
                return left;
              }
              if (left === syntax['function']) {
                warning(
                    "Expected an identifier in an assignment and instead saw a function invocation.",
                    token);
              }
            }
            error("Bad assignment.", this);
          }, 20);
    }

    function bitwise(s, f, p) {
      var x = symbol(s, p);
      reserveName(x);
      x.led = (typeof f === 'function') ? f : function(left) {
        if (option.bitwise) {
          warning("Unexpected use of '{a}'.", this, this.id);
        }
        nonadjacent(prevtoken, token);
        nonadjacent(token, nexttoken);
        return [ this.id, left, parse(p) ];
      };
      return x;
    }

    function bitwiseassignop(s) {
      symbol(s, 20).exps = true;
      return infix(
          s,
          function(left) {
            if (option.bitwise) {
              warning("Unexpected use of '{a}'.", this, this.id);
            }
            nonadjacent(prevtoken, token);
            nonadjacent(token, nexttoken);
            if (left) {
              if (left.id === '.' || left.id === '['
                  || (left.identifier && !left.reserved)) {
                parse(19);
                return left;
              }
              if (left === syntax['function']) {
                warning(
                    "Expected an identifier in an assignment, and instead saw a function invocation.",
                    token);
              }
            }
            error("Bad assignment.", this);
          }, 20);
    }

    function suffix(s, f) {
      var x = symbol(s, 150);
      x.led = function(left) {
        if (option.plusplus) {
          warning("Unexpected use of '{a}'.", this, this.id);
        }
        return [ f, left ];
      };
      return x;
    }

    function optionalidentifier() {
      if (nexttoken.reserved) {
        warning(
            "Expected an identifier and instead saw '{a}' (a reserved word).",
            nexttoken, nexttoken.id);
      }
      if (nexttoken.identifier) {
        if (option.nomen) {
          if (nexttoken.value.charAt(0) === '_'
              || nexttoken.value.indexOf('$') >= 0) {
            warning("Unexpected characters in '{a}'.", nexttoken,
                nexttoken.value);
          }
        }
        advance();
        return token.value;
      }
    }

    function identifier() {
      var i = optionalidentifier();
      if (i) {
        return i;
      }
      if (token.id === 'function' && nexttoken.id === '(') {
        warning("Missing name in function statement.");
      } else {
        error("Expected an identifier and instead saw '{a}'.", nexttoken,
            nexttoken.value);
      }
    }

    function reachable(s) {
      var i = 0;
      var t;
      if (nexttoken.id !== ';' || noreach) {
        return;
      }
      for (;;) {
        t = peek(i);
        if (t.reach) {
          return;
        }
        if (t.id !== '(endline)') {
          if (t.id === 'function') {
            warning(
                "Inner functions should be listed at the top of the outer function.",
                t);
            break;
          }
          warning("Unreachable '{a}' after '{b}'.", t, t.value, s);
          break;
        }
        i += 1;
      }
    }

    function statement() {
      var t = nexttoken;
      if (t.id === ';') {
        warning("Unnecessary semicolon.", t);
        advance(';');
        return;
      }
      if (t.identifier && !t.reserved && peek().id === ':') {
        advance();
        advance(':');
        addlabel(t.value, 'live*');
        if (!nexttoken.labelled) {
          warning("Label '{a}' on {b} statement.", nexttoken, t.value,
              nexttoken.value);
        }
        if (jx.test(t.value + ':')) {
          warning("Label '{a}' looks like a javascript url.", t, t.value);
        }
        nexttoken.label = t.value;
        t = nexttoken;
      }
      parse(0, true);
      if (!t.block) {
        if (nexttoken.id !== ';') {
          warningAt("Missing semicolon.", token.line, token.from
              + token.value.length);
        } else {
          adjacent(token, nexttoken);
          advance(';');
          nonadjacent(token, nexttoken);
        }
      }
    }

    function statements() {
      while (!nexttoken.reach && nexttoken.id !== '(end)') {
        indentation();
        statement();
      }
    }

    function block(f) {
      var b = inblock;
      inblock = f;
      nonadjacent(token, nexttoken);
      var t = nexttoken;
      if (nexttoken.id === '{') {
        advance('{');
        if (nexttoken.id !== '}' || token.line !== nexttoken.line) {
          indent += 4;
          statements();
          indent -= 4;
          indentation();
        }
        advance('}', t);
      } else {
        warning("Expected '{a}' and instead saw '{b}'.", nexttoken, '{',
            nexttoken.value);
        noreach = true;
        statement();
        noreach = false;
      }
      verb = null;
      inblock = b;
    }

    // An identity function, used by string and number tokens.

    function idValue() {
      return this;
    }

    function countMember(m) {
      if (typeof member[m] === 'number') {
        member[m] += 1;
      } else {
        member[m] = 1;
      }
    }

    function isFunction(symbol, functions) {
      var i = 0;
      for (i = 0; i < functions.length; i += 1) {
        f = functions[i];
        if (f[symbol] != null) {
          return true;
        }
      }
      return false;
    }

    // Common HTML attributes that carry scripts.

    var scriptstring = {
      onblur : true,
      onchange : true,
      onclick : true,
      ondblclick : true,
      onfocus : true,
      onkeydown : true,
      onkeypress : true,
      onkeyup : true,
      onload : true,
      onmousedown : true,
      onmousemove : true,
      onmouseout : true,
      onmouseover : true,
      onmouseup : true,
      onreset : true,
      onselect : true,
      onsubmit : true,
      onunload : true
    };

    // XML types. Currently we support html and widget.

    var xmltype = {
      HTML : {
        doBegin : function(n) {
          if (!option.cap) {
            warning("HTML case error.");
          }
          xmltype.html.doBegin();
        }
      },
      html : {
        doBegin : function(n) {
          xtype = 'html';
          xmltype.html.script = false;
        },
        doTagName : function(n, p) {
          var i;
          var t = xmltype.html.tag[n];
          var x;
          if (!t) {
            error("Unrecognized tag '<{a}>'.", nexttoken,
                n === n.toLowerCase() ? n : n + ' (capitalization error)');
          }
          x = t.parent;
          if (x) {
            if (x.indexOf(' ' + p + ' ') < 0) {
              error("A '<{a}>' must be within '<{b}>'.", token, n, x);
            }
          } else {
            i = stack.length;
            do {
              if (i <= 0) {
                error("A '<{a}>' must be within '<{b}>'.", token, n, 'body');
              }
              i -= 1;
            } while (stack[i].name !== 'body');
          }
          xmltype.html.script = n === 'script';
          return t.empty;
        },
        doAttribute : function(n, a) {
          if (n === 'script') {
            if (a === 'src') {
              xmltype.html.script = false;
              return 'string';
            } else if (a === 'language') {
              warning("The 'language' attribute is deprecated.", token);
              return false;
            }
          }
          if (a === 'href') {
            return 'href';
          }
          return scriptstring[a] && 'script';
        },
        doIt : function(n) {
          return xmltype.html.script ? 'script' : n !== 'html'
              && xmltype.html.tag[n].special && 'special';
        },
        tag : {
          a : {},
          abbr : {},
          acronym : {},
          address : {},
          applet : {},
          area : {
            empty : true,
            parent : ' map '
          },
          b : {},
          base : {
            empty : true,
            parent : ' head '
          },
          bdo : {},
          big : {},
          blockquote : {},
          body : {
            parent : ' html noframes '
          },
          br : {
            empty : true
          },
          button : {},
          canvas : {
            parent : ' body p div th td '
          },
          caption : {
            parent : ' table '
          },
          center : {},
          cite : {},
          code : {},
          col : {
            empty : true,
            parent : ' table colgroup '
          },
          colgroup : {
            parent : ' table '
          },
          dd : {
            parent : ' dl '
          },
          del : {},
          dfn : {},
          dir : {},
          div : {},
          dl : {},
          dt : {
            parent : ' dl '
          },
          em : {},
          embed : {},
          fieldset : {},
          font : {},
          form : {},
          frame : {
            empty : true,
            parent : ' frameset '
          },
          frameset : {
            parent : ' html frameset '
          },
          h1 : {},
          h2 : {},
          h3 : {},
          h4 : {},
          h5 : {},
          h6 : {},
          head : {
            parent : ' html '
          },
          html : {},
          hr : {
            empty : true
          },
          i : {},
          iframe : {},
          img : {
            empty : true
          },
          input : {
            empty : true
          },
          ins : {},
          kbd : {},
          label : {},
          legend : {
            parent : ' fieldset '
          },
          li : {
            parent : ' dir menu ol ul '
          },
          link : {
            empty : true,
            parent : ' head '
          },
          map : {},
          menu : {},
          meta : {
            empty : true,
            parent : ' head noscript '
          },
          noframes : {
            parent : ' html body '
          },
          noscript : {
            parent : ' applet blockquote body button center dd del div fieldset form frameset head html iframe ins li map noframes noscript object td th '
          },
          object : {},
          ol : {},
          optgroup : {
            parent : ' select '
          },
          option : {
            parent : ' optgroup select '
          },
          p : {},
          param : {
            empty : true,
            parent : ' applet object '
          },
          pre : {},
          q : {},
          samp : {},
          script : {
            parent : ' head body p div span abbr acronym address bdo blockquote cite code del dfn em ins kbd pre samp strong table tbody td th tr var '
          },
          select : {},
          small : {},
          span : {},
          strong : {},
          style : {
            parent : ' head ',
            special : true
          },
          sub : {},
          sup : {},
          table : {},
          tbody : {
            parent : ' table '
          },
          td : {
            parent : ' tr '
          },
          textarea : {},
          tfoot : {
            parent : ' table '
          },
          th : {
            parent : ' tr '
          },
          thead : {
            parent : ' table '
          },
          title : {
            parent : ' head '
          },
          tr : {
            parent : ' table tbody thead tfoot '
          },
          tt : {},
          u : {},
          ul : {},
          'var' : {}
        }
      },
      widget : {
        doBegin : function(n) {
          xtype = 'widget';
        },
        doTagName : function(n, p) {
          var t = xmltype.widget.tag[n];
          if (!t) {
            error("Unrecognized tag '<{a}>'.", nexttoken, n);
          }
          var x = t.parent;
          if (x.indexOf(' ' + p + ' ') < 0) {
            error("A '<{a}>' must be within '<{b}>'.", token, n, x);
          }
        },
        doAttribute : function(n, a) {
          var t = xmltype.widget.tag[a];
          if (!t) {
            error("Unrecognized attribute '<{a} {b}>'.", nexttoken, n, a);
          }
          var x = t.parent;
          if (x.indexOf(' ' + n + ' ') < 0) {
            error("Attribute '{a}' does not belong in '<{b}>'.", nexttoken, a,
                n);
          }
          return t.script ? 'script' : a === 'name' ? 'define' : 'string';
        },
        doIt : function(n) {
          var x = xmltype.widget.tag[n];
          return x && x.script && 'script';
        },
        tag : {
          "about-box" : {
            parent : ' widget '
          },
          "about-image" : {
            parent : ' about-box '
          },
          "about-text" : {
            parent : ' about-box '
          },
          "about-version" : {
            parent : ' about-box '
          },
          action : {
            parent : ' widget ',
            script : true
          },
          alignment : {
            parent : ' image text textarea window '
          },
          author : {
            parent : ' widget '
          },
          autoHide : {
            parent : ' scrollbar '
          },
          bgColor : {
            parent : ' text textarea '
          },
          bgOpacity : {
            parent : ' text textarea '
          },
          checked : {
            parent : ' image menuItem '
          },
          clipRect : {
            parent : ' image '
          },
          color : {
            parent : ' about-text about-version shadow text textarea '
          },
          contextMenuItems : {
            parent : ' frame image text textarea window '
          },
          colorize : {
            parent : ' image '
          },
          columns : {
            parent : ' textarea '
          },
          company : {
            parent : ' widget '
          },
          copyright : {
            parent : ' widget '
          },
          data : {
            parent : ' about-text about-version text textarea '
          },
          debug : {
            parent : ' widget '
          },
          defaultValue : {
            parent : ' preference '
          },
          defaultTracking : {
            parent : ' widget '
          },
          description : {
            parent : ' preference '
          },
          directory : {
            parent : ' preference '
          },
          editable : {
            parent : ' textarea '
          },
          enabled : {
            parent : ' menuItem '
          },
          extension : {
            parent : ' preference '
          },
          file : {
            parent : ' action preference '
          },
          fillMode : {
            parent : ' image '
          },
          font : {
            parent : ' about-text about-version text textarea '
          },
          frame : {
            parent : ' frame window '
          },
          group : {
            parent : ' preference '
          },
          hAlign : {
            parent : ' frame image scrollbar text textarea '
          },
          height : {
            parent : ' frame image scrollbar text textarea window '
          },
          hidden : {
            parent : ' preference '
          },
          hLineSize : {
            parent : ' frame '
          },
          hOffset : {
            parent : ' about-text about-version frame image scrollbar shadow text textarea window '
          },
          hotkey : {
            parent : ' widget '
          },
          hRegistrationPoint : {
            parent : ' image '
          },
          hslAdjustment : {
            parent : ' image '
          },
          hslTinting : {
            parent : ' image '
          },
          hScrollBar : {
            parent : ' frame '
          },
          icon : {
            parent : ' preferenceGroup '
          },
          id : {
            parent : ' canvas frame hotkey image preference text textarea timer scrollbar widget '
          },
          image : {
            parent : ' about-box frame window widget '
          },
          interval : {
            parent : ' action timer '
          },
          key : {
            parent : ' hotkey '
          },
          kind : {
            parent : ' preference '
          },
          level : {
            parent : ' window '
          },
          lines : {
            parent : ' textarea '
          },
          loadingSrc : {
            parent : ' image '
          },
          max : {
            parent : ' scrollbar '
          },
          maxLength : {
            parent : ' preference '
          },
          menuItem : {
            parent : ' contextMenuItems '
          },
          min : {
            parent : ' scrollbar '
          },
          minimumVersion : {
            parent : ' widget '
          },
          minLength : {
            parent : ' preference '
          },
          missingSrc : {
            parent : ' image '
          },
          modifier : {
            parent : ' hotkey '
          },
          name : {
            parent : ' frame hotkey image preference preferenceGroup scrollbar text textarea timer widget window '
          },
          notSaved : {
            parent : ' preference '
          },
          onClick : {
            parent : ' canvas frame image text textarea scrollbar ',
            script : true
          },
          onContextMenu : {
            parent : ' frame image text textarea window ',
            script : true
          },
          onDragDrop : {
            parent : ' frame image text textarea ',
            script : true
          },
          onDragEnter : {
            parent : ' frame image text textarea ',
            script : true
          },
          onDragExit : {
            parent : ' frame image text textarea ',
            script : true
          },
          onFirstDisplay : {
            parent : ' window ',
            script : true
          },
          onGainFocus : {
            parent : ' textarea window ',
            script : true
          },
          onKeyDown : {
            parent : ' hotkey text textarea ',
            script : true
          },
          onKeyPress : {
            parent : ' textarea ',
            script : true
          },
          onKeyUp : {
            parent : ' hotkey text textarea ',
            script : true
          },
          onImageLoaded : {
            parent : ' image ',
            script : true
          },
          onLoseFocus : {
            parent : ' textarea window ',
            script : true
          },
          onMouseDown : {
            parent : ' frame image text textarea ',
            script : true
          },
          onMouseDrag : {
            parent : ' canvas frame image scrollbar text textArea window ',
            script : true
          },
          onMouseEnter : {
            parent : ' frame image text textarea ',
            script : true
          },
          onMouseExit : {
            parent : ' frame image text textarea ',
            script : true
          },
          onMouseMove : {
            parent : ' frame image text ',
            script : true
          },
          onMouseUp : {
            parent : ' frame image text textarea ',
            script : true
          },
          onMouseWheel : {
            parent : ' frame ',
            script : true
          },
          onMultiClick : {
            parent : ' frame image text textarea window ',
            script : true
          },
          onSelect : {
            parent : ' menuItem ',
            script : true
          },
          onTimerFired : {
            parent : ' timer ',
            script : true
          },
          onValueChanged : {
            parent : ' scrollbar ',
            script : true
          },
          opacity : {
            parent : ' frame image scrollbar shadow text textarea window '
          },
          option : {
            parent : ' preference widget '
          },
          optionValue : {
            parent : ' preference '
          },
          order : {
            parent : ' preferenceGroup '
          },
          orientation : {
            parent : ' scrollbar '
          },
          pageSize : {
            parent : ' scrollbar '
          },
          preference : {
            parent : ' widget '
          },
          preferenceGroup : {
            parent : ' widget '
          },
          remoteAsync : {
            parent : ' image '
          },
          requiredPlatform : {
            parent : ' widget '
          },
          rotation : {
            parent : ' image '
          },
          scrollX : {
            parent : ' frame '
          },
          scrollY : {
            parent : ' frame '
          },
          secure : {
            parent : ' preference textarea '
          },
          scrollbar : {
            parent : ' text textarea window '
          },
          scrolling : {
            parent : ' text '
          },
          shadow : {
            parent : ' about-text about-version text window '
          },
          size : {
            parent : ' about-text about-version text textarea '
          },
          spellcheck : {
            parent : ' textarea '
          },
          src : {
            parent : ' image '
          },
          srcHeight : {
            parent : ' image '
          },
          srcWidth : {
            parent : ' image '
          },
          style : {
            parent : ' about-text about-version canvas frame image preference scrollbar text textarea window '
          },
          text : {
            parent : ' frame window '
          },
          textarea : {
            parent : ' frame window '
          },
          timer : {
            parent : ' widget '
          },
          thumbColor : {
            parent : ' scrollbar '
          },
          ticking : {
            parent : ' timer '
          },
          ticks : {
            parent : ' preference '
          },
          tickLabel : {
            parent : ' preference '
          },
          tileOrigin : {
            parent : ' image '
          },
          title : {
            parent : ' menuItem preference preferenceGroup window '
          },
          tooltip : {
            parent : ' image text textarea '
          },
          tracking : {
            parent : ' image '
          },
          trigger : {
            parent : ' action '
          },
          truncation : {
            parent : ' text '
          },
          type : {
            parent : ' preference '
          },
          url : {
            parent : ' about-box about-text about-version '
          },
          useFileIcon : {
            parent : ' image '
          },
          vAlign : {
            parent : ' frame image scrollbar text textarea '
          },
          value : {
            parent : ' preference scrollbar '
          },
          version : {
            parent : ' widget '
          },
          visible : {
            parent : ' frame image scrollbar text textarea window '
          },
          vLineSize : {
            parent : ' frame '
          },
          vOffset : {
            parent : ' about-text about-version frame image scrollbar shadow text textarea window '
          },
          vRegistrationPoint : {
            parent : ' image '
          },
          vScrollBar : {
            parent : ' frame '
          },
          width : {
            parent : ' frame image scrollbar text textarea window '
          },
          window : {
            parent : ' widget '
          },
          zOrder : {
            parent : ' frame image scrollbar text textarea '
          }
        }
      }
    };

    function xmlword(tag) {
      var w = nexttoken.value;
      if (!nexttoken.identifier) {
        if (nexttoken.id === '<') {
          if (tag) {
            error("Expected '{a}' and instead saw '{b}'.", token, '&lt;', '<');
          } else {
            error("Missing '{a}'.", token, '>');
          }
        } else if (nexttoken.id === '(end)') {
          error("Bad structure.");
        } else {
          warning("Missing quote.", token);
        }
      }
      advance();
      while (nexttoken.id === '-' || nexttoken.id === ':') {
        w += nexttoken.id;
        advance();
        if (!nexttoken.identifier) {
          error("Bad name '{a}'.", nexttoken, w + nexttoken.value);
        }
        w += nexttoken.value;
        advance();
      }
      return w;
    }

    function closetag(n) {
      return '</' + n + '>';
    }

    function xml() {
      var a;
      var e;
      var n;
      var q;
      var t;
      var v;
      xmode = 'xml';
      stack = null;
      for (;;) {
        switch (nexttoken.value) {
          case '<':
            if (!stack) {
              stack = [];
            }
            advance('<');
            t = nexttoken;
            n = xmlword(true);
            t.name = n;
            if (!xtype) {
              if (xmltype[n]) {
                xmltype[n].doBegin();
                n = xtype;
                e = false;
              } else {
                if (option.fragment) {
                  xmltype.html.doBegin();
                  stack = [ {
                    name : 'body'
                  } ];
                  e = xmltype[xtype].doTagName(n, 'body');
                } else {
                  error("Unrecognized tag '<{a}>'.", nexttoken, n);
                }
              }
            } else {
              if (option.cap && xtype === 'html') {
                n = n.toLowerCase();
              }
              if (stack.length === 0) {
                error("What the hell is this?");
              }
              e = xmltype[xtype].doTagName(n, stack[stack.length - 1].name);
            }
            t.type = n;
            for (;;) {
              if (nexttoken.id === '/') {
                advance('/');
                e = true;
                break;
              }
              if (nexttoken.id && nexttoken.id.substr(0, 1) === '>') {
                break;
              }
              a = xmlword();
              switch (xmltype[xtype].doAttribute(n, a)) {
                case 'script':
                  xmode = 'string';
                  advance('=');
                  q = nexttoken.id;
                  if (q !== '"' && q !== "'") {
                    error("Missing quote.");
                  }
                  xmode = q;
                  wmode = option.white;
                  option.white = false;
                  advance(q);
                  statements();
                  option.white = wmode;
                  if (nexttoken.id !== q) {
                    error("Missing close quote on script attribute.");
                  }
                  xmode = 'xml';
                  advance(q);
                  break;
                case 'value':
                  advance('=');
                  if (!nexttoken.identifier && nexttoken.type !== '(string)'
                      && nexttoken.type !== '(number)') {
                    error("Bad value '{a}'.", nexttoken, nexttoken.value);
                  }
                  advance();
                  break;
                case 'string':
                case 'href':
                  advance('=');
                  if (nexttoken.type !== '(string)') {
                    error("Bad value '{a}'.", nexttoken, nexttoken.value);
                  }
                  advance();
                  break;
                case 'define':
                  advance('=');
                  if (nexttoken.type !== '(string)') {
                    error("Bad value '{a}'.", nexttoken, nexttoken.value);
                  }
                  addlabel(nexttoken.value, 'var*');
                  advance();
                  break;
                default:
                  if (nexttoken.id === '=') {
                    advance('=');
                    if (!nexttoken.identifier && nexttoken.type !== '(string)'
                        && nexttoken.type !== '(number)') {
                    }
                    advance();
                  }
              }
            }
            switch (xmltype[xtype].doIt(n)) {
              case 'script':
                xmode = 'script';
                advance('>');
                indent = nexttoken.from;
                statements();
                if (nexttoken.id !== '</' && nexttoken.id !== '(end)') {
                  warning("Unexpected '{a}'.", nexttoken, nexttoken.id);
                }
                xmode = 'xml';
                break;
              case 'special':
                e = true;
                n = closetag(t.name);
                if (!lex.skip(n)) {
                  error("Missing '{a}'.", t, n);
                }
                break;
              default:
                lex.skip('>');
            }
            if (!e) {
              stack.push(t);
            }
            break;
          case '</':
            advance('</');
            n = xmlword(true);
            t = stack.pop();
            if (!t) {
              error("Unexpected '{a}'.", nexttoken, closetag(n));
            }
            if (t.name !== n) {
              error("Expected '{a}' and instead saw '{b}'.", nexttoken,
                  closetag(t.name), closetag(n));
            }
            if (t.value !== n) {
              error("Unexpected '{a}'.", nexttoken, closetag(n));
            }
            if (nexttoken.id !== '>') {
              error("Missing '{a}'.", nexttoken, '>');
            }
            if (stack.length > 0) {
              lex.skip('>');
            } else {
              advance('>');
            }
            break;
          case '<!':
            for (;;) {
              advance();
              if (nexttoken.id === '>') {
                break;
              }
              if (nexttoken.id === '<' || nexttoken.id === '(end)') {
                error("Missing '{a}'.", token, '>');
              }
            }
            lex.skip('>');
            break;
          case '<!--':
            lex.skip('-->');
            break;
          case '<%':
            lex.skip('%>');
            break;
          case '<?':
            for (;;) {
              advance();
              if (nexttoken.id === '?>') {
                break;
              }
              if (nexttoken.id === '<?' || nexttoken.id === '<'
                  || nexttoken.id === '>' || nexttoken.id === '(end)') {
                error("Missing '{a}'.", token, '?>');
              }
            }
            lex.skip('?>');
            break;
          case '<=':
          case '<<':
          case '<<=':
            error("Missing '{a}'.", nexttoken, '&lt;');
            break;
          case '(end)':
            return;
        }
        if (stack && stack.length === 0) {
          return;
        }
        if (!lex.skip('')) {
          t = stack.pop();
          if (t.value) {
            error("Missing '{a}'.", t, closetag(t.name));
          } else {
            return;
          }
        }
        advance();
      }
    }

    // Build the syntax table by declaring the syntactic elements of the
    // language.

    type('(number)', idValue);
    type('(string)', idValue);

    syntax['(identifier)'] = {
      type : '(identifier)',
      lbp : 0,
      identifier : true,
      nud : function() {
        var c;
        if (option.undef && !builtin(this.value) && xmode !== '"'
            && xmode !== "'") {
          c = funlab;
          while (!c[this.value]) {
            c = c['(context)'];
            if (!c) {
              warning("Undefined {b} '{a}'.", token, this.value,
                  nexttoken.id === '(' ? "function" : "variable");
              break;
            }
          }
        }
        addlabel(this.value, 'global');
        return this;
      },
      led : function() {
        error("Expected an operator and instead saw '{a}'.", nexttoken,
            nexttoken.value);
      }
    };

    type('(regex)', function() {
      return [ this.id, this.value, this.flags ];
    });

    delim('(endline)');
    delim('(begin)');
    delim('(end)').reach = true;
    delim('</').reach = true;
    delim('<![').reach = true;
    delim('<%');
    delim('<?');
    delim('<!');
    delim('<!--');
    delim('%>');
    delim('?>');
    delim('(error)').reach = true;
    delim('}').reach = true;
    delim(')');
    delim(']');
    delim(']]>').reach = true;
    delim('"').reach = true;
    delim("'").reach = true;
    delim(';');
    delim(':').reach = true;
    delim(',');
    reserve('else');
    reserve('case').reach = true;
    reserve('catch');
    reserve('default').reach = true;
    reserve('finally');
    reservevar('arguments');
    reservevar('eval');
    reservevar('false');
    reservevar('Infinity');
    reservevar('NaN');
    reservevar('null');
    reservevar('this');
    reservevar('true');
    reservevar('undefined');
    assignop('=', 'assign', 20);
    assignop('+=', 'assignadd', 20);
    assignop('-=', 'assignsub', 20);
    assignop('*=', 'assignmult', 20);
    assignop('/=', 'assigndiv', 20).nud = function() {
      warning("A regular expression literal can be confused with '/='.");
    };
    assignop('%=', 'assignmod', 20);
    bitwiseassignop('&=', 'assignbitand', 20);
    bitwiseassignop('|=', 'assignbitor', 20);
    bitwiseassignop('^=', 'assignbitxor', 20);
    bitwiseassignop('<<=', 'assignshiftleft', 20);
    bitwiseassignop('>>=', 'assignshiftright', 20);
    bitwiseassignop('>>>=', 'assignshiftrightunsigned', 20);
    infix('?', function(left) {
      parse(10);
      advance(':');
      parse(10);
    }, 30);

    infix('||', 'or', 40);
    infix('&&', 'and', 50);
    bitwise('|', 'bitor', 70);
    bitwise('^', 'bitxor', 80);
    bitwise('&', 'bitand', 90);
    relation('==', function(left, right) {
      if (option.eqeqeq) {
        warning("Expected '{a}' and instead saw '{b}'.", this, '===', '==');
      } else if (isPoorRelation(left)) {
        warning("Use '{a}' to compare with '{b}'.", this, '===', left.value);
      } else if (isPoorRelation(right)) {
        warning("Use '{a}' to compare with '{b}'.", this, '===', right.value);
      }
      return [ '==', left, right ];
    });
    relation('===');
    relation('!=', function(left, right) {
      var t = nexttoken;
      if (option.eqeqeq) {
        warning("Expected '{a}' and instead saw '{b}'.", this, '!==', '!=');
      } else if (isPoorRelation(left)) {
        warning("Use '{a}' to compare with '{b}'.", this, '!==', left.value);
      } else if (isPoorRelation(right)) {
        warning("Use '{a}' to compare with '{b}'.", this, '!==', right.value);
      }
      return [ '!=', left, right ];
    });
    relation('!==');
    relation('<');
    relation('>');
    relation('<=');
    relation('>=');
    bitwise('<<', 'shiftleft', 120);
    bitwise('>>', 'shiftright', 120);
    bitwise('>>>', 'shiftrightunsigned', 120);
    infix('in', 'in', 120);
    infix('instanceof', 'instanceof', 120);
    infix('+', function(left) {
      nonadjacent(prevtoken, token);
      nonadjacent(token, nexttoken);
      var right = parse(130);
      if (left && right && left.id === '(string)' && right.id === '(string)') {
        left.value += right.value;
        left.character = right.character;
        if (option.adsafe && adsafe.hasOwnProperty(left.value.toLowerCase())) {
          warning("Adsafe restricted word '{a}'.", left, left.value);
        }
        if (jx.test(left.value)) {
          warning("JavaScript URL.", left);
        }
        return left;
      }
      return [ this.id, left, right ];
    }, 130);
    prefix('+', 'num');
    infix('-', 'sub', 130);
    prefix('-', 'neg');
    infix('*', 'mult', 140);
    infix('/', 'div', 140);
    infix('%', 'mod', 140);

    suffix('++', 'postinc');
    prefix('++', 'preinc');
    syntax['++'].exps = true;

    suffix('--', 'postdec');
    prefix('--', 'predec');
    syntax['--'].exps = true;
    prefix('delete', function() {
      parse(0);
    }).exps = true;

    prefix('~', function() {
      if (option.bitwise) {
        warning("Unexpected '{a}'.", this, '~');
      }
      parse(150);
      return this;
    });
    prefix('!', 'not');
    prefix('typeof', 'typeof');
    prefix(
        'new',
        function() {
          var c = parse(155), i;
          if (c) {
            if (c.identifier) {
              c['new'] = true;
              switch (c.value) {
                case 'Object':
                  warning("Use the object literal notation {}.", token);
                  break;
                case 'Array':
                  warning("Use the array literal notation [].", token);
                  break;
                case 'Number':
                case 'String':
                case 'Boolean':
                  warning("Do not use the {a} function as a constructor.",
                      token, c.value);
                  break;
                case 'Function':
                  if (!option.evil) {
                    warning("The Function constructor is eval.");
                  }
                  break;
                default:
                  if (c.id !== 'function') {
                    i = c.value.substr(0, 1);
                    if (i < 'A' || i > 'Z') {
                      warning(
                          "A constructor name should start with an uppercase letter.",
                          token);
                    }
                  }
              }
            } else {
              if (c.id !== '.' && c.id !== '[' && c.id !== '(') {
                warning("Bad constructor.", token);
              }
            }
          } else {
            warning("Weird construction. Delete 'new'.", this);
          }
          adjacent(token, nexttoken);
          if (nexttoken.id === '(') {
            advance('(');
            if (nexttoken.id !== ')') {
              for (;;) {
                parse(10);
                if (nexttoken.id !== ',') {
                  break;
                }
                advance(',');
              }
            }
            advance(')');
          } else {
            warning("Missing '()' invoking a constructor.");
          }
          return syntax['function'];
        });
    syntax['new'].exps = true;

    infix('.', function(left) {
      adjacent(prevtoken, token);
      var m = identifier();
      if (typeof m === 'string') {
        countMember(m);
      }
      if (!option.evil && left && left.value === 'document'
          && (m === 'write' || m === 'writeln')) {
        warning("document.write can be a form of eval.", left);
      }
      this.left = left;
      this.right = m;
      return this;
    }, 160);

    infix(
        '(',
        function(left) {
          adjacent(prevtoken, token);
          var n = 0;
          var p = [];
          if (left && left.type === '(identifier)') {
            if (left.value.match(/^[A-Z](.*[a-z].*)?$/)) {
              if (left.value !== 'Number' && left.value !== 'String'
                  && left.value !== 'Date') {
                warning("Missing 'new' prefix when invoking a constructor.",
                    left);
              }
            }
          }
          if (nexttoken.id !== ')') {
            for (;;) {
              p[p.length] = parse(10);
              n += 1;
              if (nexttoken.id !== ',') {
                break;
              }
              advance(',');
            }
          }
          advance(')');
          if (typeof left === 'object') {
            if (left.value === 'parseInt' && n === 1) {
              warning("Missing radix parameter.", left);
            }
            if (!option.evil) {
              if (left.value === 'eval' || left.value === 'Function') {
                warning("eval is evil.", left);
              } else if (p[0]
                  && p[0].id === '(string)'
                  && (left.value === 'setTimeout' || left.value === 'setInterval')) {
                warning(
                    "Implied eval is evil. Pass a function instead of a string.",
                    p[0]);
              }
            }
            if (!left.identifier && left.id !== '.' && left.id !== '['
                && left.id !== '(') {
              warning("Bad invocation.", left);
            }

          }
          return syntax['function'];
        }, 155).exps = true;

    prefix('(', function() {
      var v = parse(0);
      advance(')', this);
      return v;
    });

    infix('[', function(left) {
      var e = parse(0), s;
      if (e && e.type === '(string)') {
        countMember(e.value);
        if (ix.test(e.value)) {
          s = syntax[e.value];
          if (!s || !s.reserved) {
            warning("['{a}'] is better written in dot notation.", e, e.value);
          }
        }
      }
      advance(']', this);
      this.left = left;
      this.right = e;
      return this;
    }, 160);

    prefix('[', function() {
      if (nexttoken.id === ']') {
        advance(']');
        return;
      }
      var b = token.line !== nexttoken.line;
      if (b) {
        indent += 4;
      }
      for (;;) {
        if (b && token.line !== nexttoken.line) {
          indentation();
        }
        parse(10);
        if (nexttoken.id === ',') {
          adjacent(token, nexttoken);
          advance(',');
          if (nexttoken.id === ',' || nexttoken.id === ']') {
            warning("Extra comma.", token);
          }
          nonadjacent(token, nexttoken);
        } else {
          if (b) {
            indent -= 4;
            indentation();
          }
          advance(']', this);
          return;
        }
      }
    }, 160);

    (function(x) {
      x.nud = function() {
        var i, s;
        if (nexttoken.id === '}') {
          advance('}');
          return;
        }
        var b = token.line !== nexttoken.line;
        if (b) {
          indent += 4;
        }
        for (;;) {
          if (b) {
            indentation();
          }
          i = optionalidentifier(true);
          if (!i) {
            if (nexttoken.id === '(string)') {
              i = nexttoken.value;
              if (ix.test(i)) {
                s = syntax[i];
                if (!s || !s.reserved) {
                  warning("'{a}' is better written without quotes.", nexttoken,
                      i);
                }
              }
              advance();
            } else if (nexttoken.id === '(number)') {
              i = nexttoken.value.toString();
              advance();
            }
          }
          if (!i) {
            error("Expected '{a}' and instead saw '{b}'.", nexttoken, '}',
                nexttoken.value);
          }
          countMember(i);
          advance(':');
          nonadjacent(token, nexttoken);
          parse(10);
          if (nexttoken.id === ',') {
            adjacent(token, nexttoken);
            advance(',');
            if (nexttoken.id === ',' || nexttoken.id === '}') {
              warning("Extra comma.", token);
            }
            nonadjacent(token, nexttoken);
          } else {
            if (b) {
              indent -= 4;
              indentation();
            }
            advance('}', this);
            return;
          }
        }
      };
      x.fud = function() {
        error("Expected to see a statement and instead saw a block.");
      };
    })(delim('{'));

    function varstatement() {

      // JavaScript does not have block scope. It only has function scope. So,
      // declaring a variable in a block can have unexpected consequences. We
      // will keep an inblock flag, which will be set when we enter a block, and
      // cleared when we enter a function.

      var c, i, n, v;
      if (inblock) {
        warning("{b} {a} declared in a block.", nexttoken, nexttoken.value,
            'variable');
      }
      for (;;) {
        nonadjacent(token, nexttoken);
        n = identifier();
        addlabel(n, 'var');
        if (nexttoken.id === '=') {
          v = token;
          nonadjacent(token, nexttoken);
          advance('=');
          nonadjacent(token, nexttoken);
          parse(20);
        }
        if (nexttoken.id !== ',') {
          return;
        }
        adjacent(token, nexttoken);
        advance(',');
        nonadjacent(token, nexttoken);
        c = true;
      }
    }

    stmt('var', varstatement);

    stmt('new', function() {
      error("'new' should not be used as a statement.");
    });

    function functionparams() {
      var t = nexttoken;
      advance('(');
      if (nexttoken.id === ')') {
        advance(')');
        return;
      }
      for (;;) {
        addlabel(identifier(), 'parameter');
        if (nexttoken.id === ',') {
          advance(',');
        } else {
          advance(')', t);
          return;
        }
      }
    }

    blockstmt(
        'function',
        function() {
          var i = identifier();
          if (inblock) {
            warning("{b} {a} declared in a block.", token, i, 'function');
          }
          addlabel(i, 'var*');
          beginfunction(i);
          addlabel(i, 'function');
          adjacent(token, nexttoken);
          functionparams();
          block(false);
          endfunction();
          if (nexttoken.id === '(' && nexttoken.line === token.line) {
            error("Function statements are not invocable. Wrap the function expression in parens.");
          }
        });

    prefix('function', function() {
      var i = optionalidentifier();
      if (i) {
        adjacent(token, nexttoken);
      } else {
        nonadjacent(token, nexttoken);
        i = '"' + anonname + '"';
      }
      beginfunction(i);
      addlabel(i, 'function');
      functionparams();
      block(false);
      endfunction();
    });

    blockstmt('if', function() {
      var t = nexttoken;
      advance('(');
      nonadjacent(this, t);
      parse(20);
      if (nexttoken.id === '=') {
        warning("Assignment in control part.");
        advance('=');
        parse(20);
      }
      advance(')', t);
      block(true);
      if (nexttoken.id === 'else') {
        nonadjacent(token, nexttoken);
        advance('else');
        if (nexttoken.id === 'if' || nexttoken.id === 'switch') {
          statement();
        } else {
          block(true);
        }
      }
    });

    blockstmt('try', function() {
      var b;
      block(true);
      if (nexttoken.id === 'catch') {
        advance('catch');
        beginfunction('"catch"');
        functionparams();
        block(true);
        endfunction();
        b = true;
      }
      if (nexttoken.id === 'finally') {
        advance('finally');
        beginfunction('"finally"');
        block(true);
        endfunction();
        return;
      } else if (!b) {
        error("Expected '{a}' and instead saw '{b}'.", nexttoken, 'catch',
            nexttoken.value);
      }
    });

    blockstmt('while', function() {
      var t = nexttoken;
      advance('(');
      nonadjacent(this, t);
      parse(20);
      if (nexttoken.id === '=') {
        warning("Assignment in control part.");
        advance('=');
        parse(20);
      }
      advance(')', t);
      block(true);
    }).labelled = true;

    reserve('with');

    blockstmt('switch',
        function() {
          var t = nexttoken;
          var g = false;
          advance('(');
          nonadjacent(this, t);
          this.condition = parse(20);
          advance(')', t);
          nonadjacent(token, nexttoken);
          t = nexttoken;
          advance('{');
          nonadjacent(token, nexttoken);
          indent += 4;
          this.cases = [];
          for (;;) {
            switch (nexttoken.id) {
              case 'case':
                switch (verb) {
                  case 'break':
                  case 'case':
                  case 'continue':
                  case 'return':
                  case 'switch':
                  case 'throw':
                    break;
                  default:
                    warning("Expected a 'break' statement before 'case'.",
                        token);
                }
                indentation(-4);
                advance('case');
                this.cases.push(parse(20));
                g = true;
                advance(':');
                verb = 'case';
                break;
              case 'default':
                switch (verb) {
                  case 'break':
                  case 'continue':
                  case 'return':
                  case 'throw':
                    break;
                  default:
                    warning("Expected a 'break' statement before 'default'.",
                        token);
                }
                indentation(-4);
                advance('default');
                g = true;
                advance(':');
                break;
              case '}':
                indent -= 4;
                indentation();
                advance('}', t);
                if (this.cases.length === 1 || this.condition.id === 'true'
                    || this.condition.id === 'false') {
                  warning("This 'switch' should be an 'if'.", this);
                }
                return;
              case '(end)':
                error("Missing '{a}'.", nexttoken, '}');
                return;
              default:
                if (g) {
                  switch (token.id) {
                    case ',':
                      error("Each value should have its own case label.");
                      return;
                    case ':':
                      statements();
                      break;
                    default:
                      error("Missing ':' on a case clause.", token);
                  }
                } else {
                  error("Expected '{a}' and instead saw '{b}'.", nexttoken,
                      'case', nexttoken.value);
                }
            }
          }
        }).labelled = true;

    stmt('debugger', function() {
      if (!option.debug) {
        warning("All 'debugger' statements should be removed.");
      }
    });

    stmt('do', function() {
      block(true);
      advance('while');
      var t = nexttoken;
      nonadjacent(token, t);
      advance('(');
      parse(20);
      advance(')', t);
    }).labelled = true;

    blockstmt('for', function() {
      var t = nexttoken;
      advance('(');
      nonadjacent(this, t);
      if (peek(nexttoken.id === 'var' ? 1 : 0).id === 'in') {
        if (nexttoken.id === 'var') {
          advance('var');
          addlabel(identifier(), 'var');
        } else {
          advance();
        }
        advance('in');
        parse(20);
        advance(')', t);
        block(true);
        return;
      } else {
        if (nexttoken.id !== ';') {
          if (nexttoken.id === 'var') {
            advance('var');
            varstatement();
          } else {
            for (;;) {
              parse(0);
              if (nexttoken.id !== ',') {
                break;
              }
              advance(',');
            }
          }
        }
        advance(';');
        if (nexttoken.id !== ';') {
          parse(20);
        }
        advance(';');
        if (nexttoken.id === ';') {
          error("Expected '{a}' and instead saw '{b}'.", nexttoken, ')', ';');
        }
        if (nexttoken.id !== ')') {
          for (;;) {
            parse(0);
            if (nexttoken.id !== ',') {
              break;
            }
            advance(',');
          }
        }
        advance(')', t);
        block(true);
      }
    }).labelled = true;

    function nolinebreak(t) {
      if (t.line !== nexttoken.line) {
        warning("Line breaking error '{a}'.", t, t.id);
      }
    }

    stmt('break', function() {
      nolinebreak(this);
      if (funlab[nexttoken.value] === 'live*') {
        advance();
      }
      reachable('break');
    });

    stmt('continue', function() {
      nolinebreak(this);
      if (funlab[nexttoken.value] === 'live*') {
        advance();
      }
      reachable('continue');
    });

    stmt('return', function() {
      nolinebreak(this);
      if (nexttoken.id !== ';' && !nexttoken.reach) {
        nonadjacent(token, nexttoken);
        parse(20);
      }
      reachable('return');
    });

    stmt('throw', function() {
      nolinebreak(this);
      nonadjacent(token, nexttoken);
      parse(20);
      reachable('throw');
    });

    // Superfluous reserved words

    reserve('abstract');
    reserve('boolean');
    reserve('byte');
    reserve('char');
    reserve('class');
    reserve('const');
    reserve('double');
    reserve('enum');
    reserve('export');
    reserve('extends');
    reserve('final');
    reserve('float');
    reserve('goto');
    reserve('implements');
    reserve('import');
    reserve('int');
    reserve('interface');
    reserve('long');
    reserve('native');
    reserve('package');
    reserve('private');
    reserve('protected');
    reserve('public');
    reserve('short');
    reserve('static');
    reserve('super');
    reserve('synchronized');
    reserve('throws');
    reserve('transient');
    reserve('void');
    reserve('volatile');

    // The actual JSLINT function itself.

    var itself = function(s, o) {
      option = o || {};
      JSLINT.errors = [];
      globals = {};
      functions = [];
      xmode = false;
      xtype = '';
      stack = null;
      funlab = {};
      member = {};
      funstack = [];
      lookahead = [];
      inblock = false;
      indent = 0;
      warnings = 0;
      lex.init(s);

      prevtoken = token = nexttoken = syntax['(begin)'];
      try {
        advance();
        if (nexttoken.value.charAt(0) === '<') {
          xml();
        } else {
          statements();
        }
        advance('(end)');
      } catch (e) {
        if (e) {
          JSLINT.errors.push({
            reason : "JSLint error: " + e.description,
            line : nexttoken.line,
            character : nexttoken.from,
            evidence : nexttoken.value
          });
        }
      }
      return JSLINT.errors.length === 0;
    };

    // Report generator.

    itself.report = function(option) {
      var a = [];
      var c;
      var cc;
      var f;
      var i;
      var k;
      var o = [];
      var s;
      var v;
      var errorLog = "";

      var keebler = {};
      keebler.methods = {};
      keebler.members = {};
      keebler.globals = {};

      function detail(h) {
        if (s.length) {
          o.push('<div>' + h + ':&nbsp; ' + s.sort().join(', ') + '</div>');
        }
      }

      k = JSLINT.errors.length;
      if (k) {
        o.push('<div id=errors>Error:<blockquote>');
        for (i = 0; i < k; i += 1) {
          c = JSLINT.errors[i];
          if (c) {
            o.push('<p>Problem at line '
                + (c.line + 1)
                + ' character '
                + (c.character + 1)
                + ': '
                + c.reason.entityify()
                + '</p><p><tt>'
                + (c.evidence && (c.evidence.length > 80 ? c.evidence
                    .substring(0, 77)
                    + '...' : c.evidence).entityify()) + '</tt></p>');
          }
        }
        o.push('</blockquote></div>');
        if (!c) {
          errorLog = o.join('');
          // document.write( o.join(''));
        }
      }

      if (!option) {
        for (k in member) {
          if (typeof member[k] === 'number') {
            a.push(k);
          }
        }

        if (a.length) {
          a = a.sort();
          o.push('<table><tbody><tr><th>Members</th><th>Occurrences</th></tr>');
          for (i = 0; i < a.length; i += 1) {
            o.push('<tr><td><tt>', a[i], '</tt></td><td>', member[a[i]],
                '</td></tr>');
            keebler.members[a[i]] = member[a[i]];

          }
          o.push('</tbody></table>');
        }
        for (i = 0; i < functions.length; i += 1) {
          f = functions[i];
          for (k in f) {
            if (f.hasOwnProperty(k) && f[k] === 'global') {
              c = f['(context)'];
              for (;;) {
                cc = c['(context)'];
                if (!cc) {
                  if ((!funlab[k] || funlab[k] === 'var?') && !builtin(k)) {
                    funlab[k] = 'var?';
                    f[k] = 'global?';
                  }
                  break;
                }
                if (c[k] === 'parameter!' || c[k] === 'var!') {
                  f[k] = 'var.';
                  break;
                }
                if (c[k] === 'var' || c[k] === 'var*' || c[k] === 'var!') {
                  f[k] = 'var.';
                  c[k] = 'var!';
                  break;
                }
                if (c[k] === 'parameter') {
                  f[k] = 'var.';
                  c[k] = 'parameter!';
                  break;
                }
                c = cc;
              }
            }
          }
        }
        s = [];
        var globalVariables = [];
        for (k in funlab) {
          if (funlab.hasOwnProperty(k)) {
            c = funlab[k];
            if (isFunction(k, functions) == false) {
              globalVariables.push(k);
            }
            if (typeof c === 'string' && c.substr(0, 3) === 'var') {
              if (c === 'var?') {
                s.push('<tt>' + k + '</tt><small>&nbsp;(?)</small>');
              } else {
                s.push('<tt>' + k + '</tt>');
              }
            } else {
              if (c === 'global' && !builtin(k)) {
                s.push('<tt>' + k + '</tt><small>&nbsp;(?)</small>');
              }
            }
          }
        }
        keebler.globals = globalVariables;
        detail('Global');
        if (functions.length) {
          o.push('<br>Function:<ol style="padding-left:0.5in">');
        }
        for (i = 0; i < functions.length; i += 1) {
          f = functions[i];
          // o.push('<li value=' +
          // f['(line)'] + '><tt>' + (f['(name)'] || '') + '</tt>');
          s = [];
          var fName = f['(name)'];
          var fLine = f['(line)'];
          var kName = fName + "_" + fLine;
          keebler.methods[kName] = f;
          keebler.methods[kName].name = fName;
          keebler.methods[kName].line = fLine;
          /*
           * for (k in f) { if (f.hasOwnProperty(k) && k.charAt(0) !== '(') {
           * keebler.methods[k] = {}; switch (f[k]) { case 'parameter':
           * keebler.methods[k].closure = false; s.push('<tt>' + k + '</tt>');
           * break; case 'parameter!': keebler.methods[k].closure = true;
           * s.push('<tt>' + k + '</tt><small>&nbsp;(closure)</small>');
           * break; } } } detail('Parameter'); s = []; for (k in f) { if
           * (f.hasOwnProperty(k) && k.charAt(0) !== '(') { switch (f[k]) { case
           * 'var': s.push('<tt>' + k + '</tt><small>&nbsp;(unused)</small>');
           * break; case 'var*': s.push('<tt>' + k + '</tt>'); break; case
           * 'var!': s.push('<tt>' + k + '</tt><small>&nbsp;(closure)</small>');
           * break; case 'var.': s.push('<tt>' + k + '</tt><small>&nbsp;(outer)</small>');
           * break; } } } detail('Var'); s = []; c = f['(context)']; for (k in
           * f) { v = f[k]; if (f.hasOwnProperty(k) && k.charAt(0) !== '(' &&
           * v.substr(0, 6) === 'global') { if (v === 'global?') { s.push('<tt>' +
           * k + '</tt><small>&nbsp;(?)</small>'); } else { s.push('<tt>' +
           * k + '</tt>'); } } } detail('Global'); s = []; for (k in f) { if
           * (f.hasOwnProperty(k) && k.charAt(0) !== '(' && f[k] === 'label') {
           * s.push(k); } } detail('Label'); o.push('</li>');
           */
        }
        if (functions.length) {
          o.push('</ol>');
        }
      }
      return keebler;
    };

    return itself;

  }();

  // JScript File

  function isMemberVariable(methods, report, funcName) {
    if (isMethod(methods, funcName) == true) {
      return false;
    }

    return true;
    var mInd = 0;

    for (mInd = 0; mInd < methods.length; mInd++) {
      var meth = methods[mInd];

      for (var m in meth) {
        if (m == funcName) {
          // if (meth[m] == "var*")
          // {
          return true;
        // }
        }
      }
    }

    return false;
  }

  function isMethod(methods, funcName) {
    var mInd = 0;

    for (mInd = 0; mInd < methods.length; mInd++) {
      var m = methods[mInd].name;

      if (m == null) {
        continue;
      }

      if (funcName == m.split('"').join("")) {
        return true;
      }
    }

    return false;
  }

  var toDoList = [];

  var IMPLEMENTED_TESTS = null;

  function fixIt(js, fName) {
    shortName = fName;

    /*
     * js = stripJSDocComments(js); var edit = generateDoc(js, shortName); edit =
     * convertOneLineComments(edit);
     */
    // var javaDocs = getJSDocComments(js);
    var documentation = getJSDocComments(js);
    js = stripJSDocComments(js);
    var edit = "";

    edit = generateDoc(js, shortName, documentation);
    // outputFld.value = convertOneLineComments(edit);

    return edit;
  }

  function convertOneLineComments(input) {
    input = input.split("\r\n").join("\n");
    var lines = input.split("\n");
    var L = 0;
    var lastLineLen = -1;
    var output = [];

    for (L = 0; L < lines.length; L++) {
      var commentCheck = lines[L].split("//");

      if (commentCheck.length > 1) {
        var nonComment = commentCheck[0];
        commentCheck.shift();
        var comment = commentCheck.join(' ');
      // lines[L] = (nonComment) + " /* " + trim(comment) + " */";
      }

      if (lines[L] == "*/") {
        lines[L] = " */";
      }

      if (trim(lines[L]).length == 0) {
        if (lastLineLen != 0) {
          output.push(lines[L]);
        }
      } else {
        output.push(lines[L]);
      }

      lastLineLen = trim(lines[L]).length;
    }

    return output.join("\r\n");
  }

  function stripOneLineComments(input) {
    var lines = input.split("\r\n");
    var L = 0;

    for (L = 0; L < lines.length; L++) {
      var commentCheck = lines[L].split("//");
      lines[L] = commentCheck[0];
    }

    return lines.join("\r\n");
  }

  function getJSDocComments(input) {
    var output = {};

    if (input.indexOf("/**") != -1) {
      while (true) {
        var splitter = input.split("/**");

        if (splitter.length == 1) {
          break;
        }

        var beforeComment = splitter[0];
        splitter.shift();
        var comment = splitter[0];
        comment = comment.split("*/")[0];
        var id = "";

        var afterCommentBody = splitter.join("/**");
        var afterComment = afterCommentBody.split("*/");
        afterComment.shift();

        if (comment.indexOf("Name:") != -1 || comment.indexOf("@author") != -1)
          {
          id = "header";
        } else {
          var funcLine = trim(afterComment[0]).split("\r\n")[0];
          id = funcLine;
        }

        id = id.split("(")[0];
        id = trim(id);

        if (id.indexOf("{") != -1) {
          continue;
        } else if (id.indexOf("}") != -1) {
          continue;
        } else if (id == "") {
          continue;
        }

        var idSplit = id.split(" ");

        if (idSplit[0] == "function") {
          id = idSplit[1];
        } else {
          id = idSplit[0];
          id = id.split(".").join("___");
        }

        output[id] = chunkComment(comment);

        input = beforeComment + afterComment.join("*/");
      }
    }

    delete output.beget;
    return output;
  }

  function chunkComment(input) {
    var output = {};

    output.params = [];
    var comments = [];
    var txt = input;
    input = input.split("@");
    var i = 0;

    for (i = 1; i < input.length; i++) {
      var chunk = trim(input[i].split("\r\n")[0]);
      var split = chunk.split(" ");
      var tag = split.shift();
      var value = trim(split.join(" "));

      if (value == "") {
        value = true;
      }

      if (tag == "param") {
        var param = {};

        var paramChunk = value.split(" ");
        param.name = paramChunk[0];
        paramChunk.shift();
        param.comment = paramChunk.join(" ");
        output.params.push(param);
      } else {
        output[tag] = value;
      }
    }

    input = txt;
    input = input.split("\r\n");

    for (i = 1; i < input.length; i++) {
      var line = trim(input[i]);

      if (line.charAt(0) == "*") {
        line = line.split("*");
        line.shift();
        line = line.join("*");
        line = trim(line);
      }

      if (line.length > 0) {
        if (line.charAt(0) != "@") {
          // it's some kind of comment?

          comments.push(line);
        }
      }
    }

    output.comments = comments;
    return output;
  }

  function __getJSDocComments(input) {
    var output = {};

    if (input.indexOf("/**") != -1) {
      while (true) {
        var splitter = input.split("/**");

        if (splitter.length == 1) {
          return output;
        }

        var beforeComment = splitter[0];
        splitter.shift();
        var afterCommentBody = splitter.join("/**");
        var afterComment = afterCommentBody.split("*/");
        afterComment.shift();
        input = beforeComment + afterComment.join("*/");
      }
    } else {
      return output;
    }
  }

  function stripJSDocComments(input) {
    if (input.indexOf("/**") != -1) {
      while (true) {
        var splitter = input.split("/**");

        if (splitter.length == 1) {
          return input;
        }

        var beforeComment = splitter[0];
        splitter.shift();
        var afterCommentBody = splitter.join("/**");
        var afterComment = afterCommentBody.split("*/");
        afterComment.shift();
        input = beforeComment + afterComment.join("*/");
      }
    } else {
      return input;
    }
  }

  function stripCComments(input) {
    if (input.indexOf("/*") != -1) {
      while (true) {
        var splitter = input.split("/*");

        if (splitter.length == 1) {
          return input;
        }

        var beforeComment = splitter[0];
        splitter.shift();
        var afterCommentBody = splitter.join("/*");
        var afterComment = afterCommentBody.split("*/");
        afterComment.shift();
        input = beforeComment + afterComment.join("*/");
      }
    } else {
      return input;
    }
  }

  function scanFunction(lines, line) {
    // replace "//" with "/* */"
    // ignore comments
    lines = copyArray(lines);
    var k = 0;
    var corpus = [];
    var buffer = "";

    for (k = line; k < lines.length; k++) {
      corpus.push(stripOneLineComments(lines[k]));
    }

    corpus = corpus.join("\r\n");

    corpus = stripCComments(corpus);

    var c = 0;
    var braceCount = 0;
    var lastChar = '';

    for (c = 0; c < corpus.length; c++) {
      var test = corpus.charAt(c);

      if (test == '{') {
        braceCount++;
      } else if (test == '}') {
        braceCount--;

        if (braceCount == 0) {
          buffer += test;

          if (buffer.indexOf("function") == -1) {
            // alert(lines[line] + "\r\n" + buffer);
            return null;
          }

          return buffer;
        }
      }

      buffer += test;
      lastChar = test;
    }

    return null;
  }

  function getparentMeth(stack, name) {
    stack = copyArray(stack);
    name = name.split('"').join('');

    while (stack.length > 0) {
      var pMeth = stack.pop();

      if (pMeth.methods != null) {
        for (var m in pMeth.methods) {
          if (m == name) {
            return pMeth;
          }
        }

        if (pMeth[name] != null) {
          return pMeth;
        }
      }
    }

    return null;
  }

  function copyArray(array) {
    var output = new Array();
    var i = 0;

    for (i = 0; i < array.length; i++) {
      output.push(copyObject(array[i]));
    }

    return output;
  }

  function copyObject(obj) {
    if (typeof (obj) != "object") {
      return obj;
    }

    var output = new Object();

    for (var p in obj) {
      var plow = p.toLowerCase();

      // if a variable name begins with "_" it's private...
      if (plow.charAt(0) == "_") {
        continue;
      }

      var prop = obj[p];

      if (prop != null) {
        if (prop.currentStyle != null) {
          continue;
        }
      }

      if (prop == null) {
        output[p] = null;
      } else {
        if (prop.pop != null) {
          output[p] = copyArray(prop);
        } else {
          output[p] = copyObject(prop);
        }
      }
    }

    return output;
  }

  function sortByLine(a, b) {
    if (a.line > b.line) {
      return 1;
    } else if (b.line > a.line) {
      return -1;
    } else {
      return 0;
    }
  }

  function findMethod(methods, name) {
    for (var m in methods) {
      if (methods[m].name == name) {
        return methods[m];
      }
    }

    return null;
  }

  var methodCount = 0;

  function generateDoc(input, fName, documentation) {
    input = input.split('Ôªø').join('');
    input = trim(input);

    var baseClassStr = input.split("inherits:");
    var foundBaseClass = null;

    if (baseClassStr.length > 1) {
      baseClassStr = (baseClassStr[1]);
      // alert(baseClassStr);
      baseClassStr = baseClassStr.split("\"");
      // alert(baseClassStr);
      baseClassStr = (baseClassStr[1]);
      // alert(baseClassStr);
      foundBaseClass = trim(baseClassStr);

    // if (foundBaseClass == null ||foundBaseClass == ""){
    // alert(fName);
    // }

    // alert(baseClassStr);
    }

    // //JSLINT is a global function. It takes two parameters.
    var myResult = JSLINT(input, {
      passfail: false,
      stupid: true,
      maxerr: 100000,
      sloppy: true,
      browser: true,
      vars: true
    });

    // window.data = JSLINT.data();
    // doLogging(JSON.stringify(data.tokens, null, 2));
    var myReport = JSLINT.report();

    // doLogging(JSON.stringify(JSLINT.tree, null, 2));

    // doLogging(JSON.stringify(JSLINT.tree, [
    // 'string', 'arity', 'name', 'first',
    // 'second', 'third', 'block', 'else'], 4));

    // outputFld.value = dumpObject(myReport);

    var slicer = input.split("\r\n");

    var jsDocBlock = {};

    // jsDocBlock.foundBaseClass = foundBaseClass;
    jsDocBlock.parameters = [];
    jsDocBlock.comments = "";

    var editCount = 0;
    var hasReturnValue = false;
    var retVal = "void";
    // is it a constructor?
    // does it have a return statement?
    var isConstructor = false;
    var isClass = false;
    var fileClassName = fName.split(".")[0];
    var foundClassName = "";
    var methStack = [];
    var methods = [];
    var fields = [];
    var globals = [];

    jsDocBlock.fileClassName = fileClassName;
    var maudit = {};

    var mr = [];

    for (var e in myReport.methods) {
      if (myReport.methods[e].name != null) {
        myReport.methods[e].doc_methodName = myReport.methods[e].name;
        var realName = myReport.methods[e].name;
        realName = realName.split('"').join('');
        methods.push(myReport.methods[e]);
        maudit[realName] = e;
        mr.push(realName);
      }
    }
    // alert(mr.join("\r\n"));

    for (var e in myReport.members) {
      // if (myReport.members[e].name != null) {
      // myReport.members[e].doc_methodName = myReport.members[e].name;
      // fields.push(myReport.members[e]);
      if (maudit[e] == null) {
        fields.push(myReport.members[e]);
      }
    // }
    }
    // alert(fields.join("\r\n"));

    // for (var e in myReport.globals) {
    // if (myReport.globals[e].name != null) {
    // myReport.globals[e].doc_methodName = myReport.globals[e].name;
    // globals.push(myReport.globals[e]);
    // }
    // globals.push(e);
    // }

    // alert(globals.join("\r\n"));
    // add field support? /** The priority. */

    methodCount += methods.length;
    // methods.sort(sortByLine);

    var x = 0;

    for (x = 0; x < methods.length; x++) {
      jsDocBlock = {};

      jsDocBlock.fileClassName = fileClassName;
      jsDocBlock.parameters = [];
      jsDocBlock.comments = "";
      var e = methods[x].doc_methodName;
      jsDocBlock.name = e;
      var meth = methods[x];
      retVal = "void";
      meth.doc_methodName = e;
      methStack.push(meth);
      var protoTest = e + ".prototype";
      jsDocBlock.meth = meth;

      if (input.indexOf(protoTest) != -1) {
        isConstructor = true;
        isClass = true;
        foundClassName = e;
      } else {
        isConstructor = false;
      }

      if (meth.line != null) {
        if (meth.name.indexOf("_fooElement") != -1) {
          var breakpoint = true;
        }

        var line = meth.line - 1;
        var text = (scanFunction(slicer, line + editCount));

        if (text == null) {
          continue;
        }

        var functions = text.split("function");

        var functionIsMethodOf = "";

        if (functions.length > 2) {
          var n = 0;

          for (n = 1; n < functions.length; n++) {
            var funcDef = functions[n].split(".");

            var fchunk = funcDef.pop();
            var precedingWord = '';

            if (funcDef.length > 0) {
              // keep funcDef...
              var previous = funcDef.pop().split('\t').join(' ');
              previous = trim(previous.split('\r').join(' '));
              previous = trim(previous.split('\n').join(' '));
              funcDef = previous.split(' ');
              precedingWord = trim(funcDef.pop());

              if (precedingWord == "this") {
                functionIsMethodOf = "this";
              } else {
                functionIsMethodOf = precedingWord;
              }

              meth.functionIsMethodOf = functionIsMethodOf;
            }

            fchunk = trim(fchunk.split("=")[0]);

            if (fchunk.indexOf(")") == -1) {
              if (functionIsMethodOf != "") {
                if (functionIsMethodOf != "this") {
                  meth.isConstructor = false;
                  isClass = false;
                  isConstructor = false;
                } else {
                  meth.isConstructor = true;
                  isClass = true;
                  isConstructor = true;
                }
              } else {
                meth.isConstructor = true;
                isClass = true;
                isConstructor = true;
              }

              foundClassName = e;

              if (meth.methods == null) {
                meth.methods = {};
              }

              meth.methods[fchunk] = "instance";
            } else {
              if (isConstructor != true) {
                funcDef = functions[n].split("(");
                fchunk = trim(funcDef[0]);

                foundClassName = e;

                if (meth.methods == null) {
                  meth.methods = {};
                }

                meth.methods[fchunk] = "local";
              }
            }
          }
        }

        var className = null;
        var leftOfFunc = trim(functions[0]);

        meth.leftOfFunc = leftOfFunc;

        if (leftOfFunc.indexOf("=") != -1) {
          if (leftOfFunc.indexOf("this.") != -1) {
            // getMeth(myReport.methods, className);
            // it's a member of... this?
            // alert(text);
            var parentMeth = getparentMeth(methStack, e);

            if (parentMeth != null) {
              className = parentMeth.doc_methodName;

              if (parentMeth.methods == null) {
                parentMeth.methods = {};
              }

              parentMeth.methods[e] = "method";
            } else {
            // alert("could not find parent class for method '" + e + "'.");
            }
          } else if (leftOfFunc.indexOf("prototype.") != -1) {
            var dots = leftOfFunc.split(".");
            className = dots[0];

            var parentMeth = findMethod(myReport.methods, className);

            if (parentMeth != null) {
              parentMeth.isConstructor = true;
              isClass = true;
              foundClassName = className;

              if (parentMeth.methods == null) {
                parentMeth.methods = {};
              }

              parentMeth.methods[e] = "prototype";
            }
          }
        } else {
          var parentMeth = getparentMeth(methStack, e);

          if (parentMeth != null) {
            className = parentMeth.doc_methodName;
          } else {
            // alert("could not find parent class for method '" + e + "'.");

            jsDocBlock.type = "function";

          // wass heree
          }
        }

        var desc = "Please give brief description of " + trim(e) + ".";
        // block = "/**";
        // block += "\r\n * " + desc;
        // block += "\r\n * ";

        if (className != null) {
          var strippedFunc = trim(e).split('"').join('');
          strippedFunc = strippedFunc.split("'").join('');
          var parentMeth = findMethod(myReport.methods, className);

          if (trim(strippedFunc).charAt(0) == '_') {
            jsDocBlock.scope = "private";
          } else {
            if (parentMeth != null) {
              if (parentMeth.methods != null) {
                if (parentMeth.methods[e] == "local") {
                  // block += "\r\n * @private";
                  jsDocBlock.scope = "private";
                } else if (parentMeth.methods[e] == "prototype") {
                  // block += "\r\n * @public";
                  jsDocBlock.scope = "public";
                } else if (parentMeth.methods[e] == "method") {
                  jsDocBlock.scope = "public";
                } else if (parentMeth.methods[e] == "instance") {
                  jsDocBlock.scope = "public";
                } else if (parentMeth.methods[strippedFunc] == "local") {
                  jsDocBlock.scope = "private";
                } else if (parentMeth.methods[strippedFunc] == "prototype") {
                  jsDocBlock.scope = "public";
                } else if (parentMeth.methods[strippedFunc] == "method") {
                  jsDocBlock.scope = "public";
                } else if (parentMeth.methods[strippedFunc] == "instance") {
                  jsDocBlock.scope = "public";
                }
              }
            }
          }

          // block += "\r\n * @method";
          jsDocBlock.type = "method";
          jsDocBlock.memberOf = className;
        // block += "\r\n * @memberOf " + className;
        } else {
          var strippedFunc = trim(e).split('"').join('');
          strippedFunc = strippedFunc.split("'").join('');

          if (trim(strippedFunc).charAt(0) == '_') {
            jsDocBlock.scope = "private";
          } else {
            jsDocBlock.scope = "public";
          }
        }

        for (var p in meth) {
          if (typeof (meth[p]) == "string") {
            if (meth[p] == "parameter") {
              var param = {};

              param.name = p;
              param.comment = "";
              jsDocBlock.parameters.push(param);
            // block += "\r\n * @param " + p;
            }
          }
        }

        if (isConstructor == false) {
          var retChunk = text.split("return ");

          if (retChunk.length > 1) {
            retVal = retChunk[1].split(";")[0];
            retVal = trim(retVal);

            if (retVal == "true" || retVal == "false") {
              retVal = "boolean";
            } else if (retVal.indexOf("\"") != -1) {
              retVal = "String";
            } else if (retVal.indexOf("'") != -1) {
              retVal = "String";
            } else if (isNaN(Number(retVal)) == false) {
              retVal = "Number";
            } else if (isNaN(Number(retVal)) == false) {
              // retVal = "value " + retVal
              retVal = "Object";
            } else {
              retVal = "Object";
            }

            // block += "\r\n * @return " + retVal;
            jsDocBlock.returnType = retVal;
          }
        } else {
          // block += "\r\n * @constructor";
          jsDocBlock.type = "constructor";

          jsDocBlock.scope = "public";
          // jsDocBlock.type = "function";

          if (foundBaseClass != null) {
            // jsDocBlock.inherits = foundBaseClass;
            // jsDocBlock.augments = foundBaseClass;
            jsDocBlock.base = foundBaseClass;
            jsDocBlock.fileClassName = fileClassName;

          // jsDocBlock["extends"] = foundBaseClass;
          }
        }

        // block += "\r\n*/";

        if (e.indexOf("hasNext") != -1) {
          var breakpoint = 1;
        }

        if (jsDocBlock.base == null && foundBaseClass != null) {
          jsDocBlock.base = foundBaseClass;
        }

        if (jsDocBlock.memberOf == null) {
          var funcDecl = meth.leftOfFunc;

          if (funcDecl.indexOf("APOLLO.ObjectFactory.interfaces[") != -1) {
            jsDocBlock.ignore = true;
          // alert("got one " + funcDecl);
          // return;
          // continue;
          }

          if (funcDecl.indexOf("APOLLO.Core") != -1) {
            jsDocBlock.ignore = true;
            continue;
          // alert("got one " + funcDecl);
          // return;
          // continue;
          }
        }

        if (jsDocBlock.type != "constructor") {
          if (jsDocBlock.memberOf == null) {
            var funcDecl = meth.leftOfFunc;

            if (funcDecl.indexOf("APOLLO.ObjectFactory.interfaces[") != -1) {
              jsDocBlock.ignore = true;
            // alert("got one " + funcDecl);
            // return;
            // continue;
            }

            if (funcDecl.indexOf("APOLLO.Core") != -1) {
              jsDocBlock.ignore = true;
            // alert("got one " + funcDecl);
            // return;
            // continue;
            }

            var hasDot = funcDecl.indexOf(".") != -1;

            var ownedByThisClass = (funcDecl.indexOf("this.") != -1);
            var ownedBySomeoneElse = null;

            if (hasDot == true) {
              ownedBySomeoneElse = funcDecl.split('.')[0];

              if (funcDecl.indexOf('=') == -1) {
                // it's some weird JS voodoo....
                var maybeMethod = funcDecl.split('.')[1];

                if (maybeMethod.indexOf("(") != -1) {
                  // alert(ownedBySomeoneElse + "|" + maybeMethod);
                  var realName = trim(maybeMethod.split("(")[0]);
                  // LAMBDA FUNTION: Ignore.
                  jsDocBlock.name = realName;
                  jsDocBlock.meth.name = realName;
                  jsDocBlock.ignore = true;
                  jsDocBlock["function"] = true;
                }
              }
            }

            if (ownedByThisClass == true) {
              jsDocBlock.memberOf = fileClassName;
            // jsDocBlock.explicitMemberOf = fileClassName;
            } else if (ownedBySomeoneElse != null) {
              jsDocBlock.memberOf = ownedBySomeoneElse;
              jsDocBlock.explicitMemberOf = ownedBySomeoneElse;
            } else {
              if (meth["(context)"]["(name)"] != null) {
                jsDocBlock.scope = "inner";
                jsDocBlock.enclosedBy = meth["(context)"]["(name)"];

                if (jsDocBlock.enclosedBy.charAt(0) == '"') {
                  jsDocBlock.enclosedBy = jsDocBlock.enclosedBy.split('"')
                    .join('');
                }

                jsDocBlock.memberOf = fileClassName;
              } else {
                jsDocBlock.scope = "public";
              }
            }
          }
        }

        var block = generateDocBlock(jsDocBlock, documentation);

        slicer.splice(line + editCount, 0, block);
        editCount++;
      }
    }

    jsDocBlock = {};

    // jsDocBlock.foundBaseClass = foundBaseClass;
    jsDocBlock.fileClassName = fileClassName;

    // block = "/**";
    // block += "\r\n * " + "Name: " + fName;
    jsDocBlock.name = fName;
    // block += "\r\n * ";
    // SkeletonView.prototype = new View ();
    // block += "\r\n * @author Apollo Group";
    jsDocBlock.author = "btremblay@me.com LLC";

    // jsDocBlock.type = "header";
    jsDocBlock.fileoverview = '';

    // block += "\r\n * @projectDescription " + "";
    if (isClass == true) {
      var testForInheritance = fileClassName + ".prototype =";
      var baseClass = "";

      if (input.indexOf(testForInheritance) != -1) {
        var inheritance = input.split(testForInheritance);
        var chunks = inheritance[1].split(' ');
        var ch = 0;

        for (ch = 0; ch < chunks.length; ch++) {
          if (chunks[ch] == "new") {
            baseClass = chunks[ch + 1];
            baseClass = baseClass.split('(')[0];
            break;
          }
        }

      // block += "\r\n * @inherits " + baseClass;
      // jsDocBlock.inherits = baseClass;
      } else {
        testForInheritance = foundClassName + ".prototype =";

        if (input.indexOf(testForInheritance) != -1) {
          var inheritance = input.split(testForInheritance);
          var chunks = inheritance[1].split(' ');
          var ch = 0;

          for (ch = 0; ch < chunks.length; ch++) {
            if (chunks[ch] == "new") {
              baseClass = chunks[ch + 1];
              baseClass = baseClass.split('(')[0];
              break;
            }
          }

        // block += "\r\n * @inherits " + baseClass;
        // jsDocBlock.inherits = baseClass;
        }
      }

    // fileClassName
    // foundClassName
    // @inherits x
    // block += "\r\n * @classDescription Please describe this class.";
    // jsDocBlock.classDescription = "Please describe this class.";

    // jsDocBlock["namespace"] = "edu.apollogrp.classroom.client.ui";
    }

    if (foundBaseClass != null) {
      // jsDocBlock.inherits = foundBaseClass;
      // jsDocBlock.requires = foundBaseClass;
      // jsDocBlock.augments = foundBaseClass;
      jsDocBlock["extends"] = foundBaseClass;
    }

    // jsDocBlock["namespace"] = "framework";

    // block += "\r\n*/\r\n";

    var block = generateDocBlock(jsDocBlock, documentation);

    //slicer.splice(0, 0, block);
    return slicer.join("\r\n");
  }

  /**
   * Gets the channel matrix.
   * 
   * @param modApp
   *          the mod app
   * @param channelsArray
   *          the channels array
   * @param from
   *          the from
   * @param to
   *          the to
   * @param REGION_ID
   *          the rEGIO n_ id
   * @return the channel matrix
   */

  function generateDocBlock(docBlock, previousDocs) {
    var output = "/**";
    var previousDocsFeature = previousDocs[docBlock.name];

    previousDocsFeature = null;

    doLogging(docBlock.name);

    if (docBlock.memberOf != null) {
      delete docBlock.memberOf;
    }

    if (previousDocsFeature == null) {
      // MulticastListenerService___prototype___
      var memberOfObj = docBlock.memberOf;
      var dockBlockName = docBlock.name;
      dockBlockName = dockBlockName.split("\"").join("");

      if (memberOfObj != null) {
        previousDocsFeature = previousDocs[memberOfObj + "___prototype___"
          + dockBlockName];

        if (previousDocsFeature == null) {
          previousDocsFeature = previousDocs[memberOfObj + "___"
            + dockBlockName];
        }

        if (previousDocsFeature != null) {
          for (var p in previousDocsFeature) {
            if (p != "beget" && p != "params") {
              docBlock[p] = previousDocsFeature[p];
            }
          }

          for (var p = 0; p < previousDocsFeature.params.length; p++) {
            if (docBlock.parameters.length > p) {
              if (docBlock.parameters[p].name
                == previousDocsFeature.params[p].name) {
                docBlock.parameters[p].comment
                  = previousDocsFeature.params[p].comment;
              } else {
                alert(docBlock.parameters[p].name + ","
                  + previousDocsFeature.params[p].comment);
              }
            }
          }
        }
      }
    }

/**
 * @ parameters [object Object],[object Object],[object Object],[object
 * Object],[object Object] @ comments Gets the channel matrix. @ name
 * "getRatings" @ scope public @ type method @ memberOf
 * MulticastListenerService @ returnType Object @ return the channel matrix @ modApp
 * the mod app @ channelsArray the channels array @ from the from @ to the to @ REGION_ID
 *                          the rEGIO n_ id
 */

    var comments = docBlock.comments;
    var thisClassName = docBlock.memberOf;

    if (thisClassName == null) {
      thisClassName = docBlock.fileClassName;
    }

    if (docBlock.name == thisClassName) {
      docBlock.type = "constructor";
    }

    var type = docBlock.type;

    docBlock.name = docBlock.name.split('"').join('');
    var robotDescription = decamelize(docBlock.name);

    var returnDescription = null;

    if (type != "constructor") {
      if (docBlock.base != null) {
        delete docBlock.base;
      }
    }

    if (type == "method") {
      // docBlock["namespace"] = "";
      // docBlock["namespace"] = "edu.apollogrp.classroom.client";

      var splitDesc = robotDescription.split(' ');
      var verb = splitDesc.shift();

      if (verb.length > 0) {
        var q = false;
        verb = capitalize(verb);

        if (verb == "Is") {
          q = true;
        }

        if (splitDesc.length > 0) {
          robotDescription = verb + " " + splitDesc.join(' ');
        } else {
          robotDescription = verb
        }

        robotDescription += q ? '?' : '.';
        docBlock.comments = robotDescription;
        // alert(docBlock.name + "," + robotDescription);
        comments = robotDescription;
      }

      if (comments.indexOf("Get ") == 0 || comments.indexOf("Is ") == 0) {
        var words = comments.split(' ');
        words.shift();

        if (comments.indexOf("Get ") == 0) {
          words.unshift("The ");
        } else if (comments.indexOf("Is ") == 0) {
          if (words.length == 1) {
            words.unshift("Is it");
          } else {
            words.unshift("Is the");
          }
        }

        returnDescription = words.join(' ');
      // alert(returnDescription);
      }
    } else if (type == "constructor") {
      // docBlock["namespace"] = "";
      // docBlock["namespace"] = "edu.apollogrp.classroom.client";
      /**
       * Instantiates a new super chug.
       */
      // public SuperChug() {
      // }
      comments = "Instantiates a new " + docBlock.name + ".";
    } else if (type == "function") {
      // alert(robotDescription);
      var splitDesc = robotDescription.split(' ');
      var verb = splitDesc.shift();

      if (verb.length > 0) {
        var q = false;
        verb = capitalize(verb);

        if (verb == "Is") {
          q = true;
        }

        if (splitDesc.length > 0) {
          robotDescription = verb + " " + splitDesc.join(' ');
        } else {
          robotDescription = verb
        }

        robotDescription += q ? '?' : '.';
        docBlock.comments = robotDescription;
        // alert(docBlock.name + "," + robotDescription);
        comments = robotDescription;
      }

      if (comments.indexOf("Get ") == 0 || comments.indexOf("Is ") == 0) {
        var words = comments.split(' ');
        words.shift();

        if (comments.indexOf("Get ") == 0) {
          words.unshift("The ");
        } else if (comments.indexOf("Is ") == 0) {
          if (words.length == 1) {
            words.unshift("Is it");
          } else {
            words.unshift("Is the");
          }
        }

        returnDescription = words.join(' ');
      // alert(returnDescription);
      }

      // docBlock.scope = "static";
      if (docBlock.enclosedBy != null) {
        docBlock.scope = "private";
        docBlock.type = "inner";
        type = "inner";
      } else {
        delete docBlock.scope;
        docBlock.type = "static";

        if (docBlock.memberOf != null) {
          docBlock.see = docBlock.memberOf;
        }

        // else{
        // docBlock.see = "source file " + docBlock.fileClassName + ".js";
        // }
        // {@link Printer}
        type = "static";
      }
    } else {
    // doLogging(docBlock);
    }

    if (comments != null) {
      if (trim(comments) != "") {
        output += "\r\n * " + comments + "\r\n *";
      }
    }

    var scope = docBlock.scope;

    if (scope != null) {
      output += "\r\n * @" + scope;
    }

    /** The control data types. */
    // public static ObjectHash controlDataTypes = null;
    /**
     * Generate field type.
     * 
     * @param parent
     *          the parent
     * @param specifier
     *          the specifier
     * @return the string
     */
    // public static String generateFieldType(ObjectHash parent,
    // ObjectHash specifier) {
    if (type != null) {
      if (type != "method") {
        output += "\r\n * @" + type;
      }
    }

    for (var p in docBlock) {
      // p != "explicitMemberOf" &&
      if (p != "enclosedBy" && p != "meth" && p != "beget" && p != "params"
        && p != "parameters" && p != "comments" && p != "type" && p != "name"
        && p != "scope" && p != "returnType" && p != "return"
        && p != "fileClassName") {
        if (p == "explicitMemberOf") {
          var fName = "memberOf";
          output += "\r\n * @" + fName + " " + docBlock[p];
          continue;
        }

        if (docBlock[p] == true || docBlock[p] == false) {
          output += "\r\n * @" + p;
        } else {
          output += "\r\n * @" + p + " " + docBlock[p];
        }
      }
    }

    if (docBlock.parameters != null && docBlock.parameters.length > 0) {
      output += "\r\n * ";

      for (var p = 0; p < docBlock.parameters.length; p++) {
        output += "\r\n * @param " + docBlock.parameters[p].name + " "
          + docBlock.parameters[p].comment;
      }
    }

    var returnType = docBlock.returnType;

    if (returnType != null) {
      if (docBlock["return"] != null) {
      // returnType += " " + docBlock["return"];
      }

      output += "\r\n * @type " + returnType;
    }

    if (returnDescription != null) {
      output += "\r\n * @return " + returnDescription;
    }

    output += "\r\n */";

    return output;
  }

  function capitalize(input) {
    input = input.split('');
    input[0] = input[0].toUpperCase();
    return input.join('');
  }

  function decamelize(input) {
    // BEGIN_LOADING_FOO
    var test = input.split('_');

    if (test.length > 1 && (input.indexOf('_') > 0)) {
      // do a different kind of split here
      return trim(test.join(' ')).toLowerCase();
    }

    var words = [];
    var word = "";

    for (var c = 0; c < input.length; c++) {
      var chararcter = input.charAt(c);

      if (chararcter == '_') {
        chararcter = ' ';
      }

      if (isUpperCase(chararcter)) {
        // break it
        chararcter = chararcter.toLowerCase();

        words.push(trim(word));
        word = "";
        word += chararcter;
      } else {
        word += chararcter;
      }
    }

    if (trim(word).length > 0) {
      words.push(trim(word));
    }

    return words.join(' ');
  }

  /**
   * @public
   * @param aCharacter
   * @return String
   */
  function isUpperCase(aCharacter) {
    return(aCharacter >= 'A') && (aCharacter <= 'Z')
  };

  function java_onclick() {
    var path = "";
    path = "Y:\\appshell\\WebContent";
    //path = "C:\\Documents and Settings\\btremblay\\My
    //Documents\\livingroom\\includes";
    //path = "C:\\Documents and Settings\\btremblay\\My
    //Documents\\livingroom\\skins\\skin1";
    //path = "C:\\Documents and Settings\\btremblay\\Desktop\\TEST";
    //path = "C:\\Program Files\\Apache Software Foundation\\Tomcat
    //5.5\\webapps\\ROOT\\testbed\\tests";
    //path = "C:\\PROJECTS\\testbed\\includes\\framework";

    //path = "C:\\PROJECTS\\testbed\\skins\\skin1";

    //path = "C:\\PROJECTS\\NectarineGalio";
    //path = "C:\\PROJECTS\\testbed\\tests\\s";
    //path = "C:\\Documents and Settings\\btremblay\\My
    //Documents\\livingroom\\includes\\stb";
    fixIt(path, null, true);
  }

  function trim(input) {
    return input.replace(/^\s*(\S*(\s+\S+)*)\s*$/, '$1');
  }

  function doLogging(msg) {
  }

  // singleFileProcessor.js
  // ========
  module.exports = {
    'generateJsDoc': fixIt
  };
}());