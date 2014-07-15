/**
 * @author Ben Tremblay
 * @fileoverview Copyright(c) 2013 Ben Tremblay., All Rights Reserved.
 */
define(function(){
    "use strict";
    var _instance = null;
    /**
     * Instantiates a new Logger.
     * 
     * @public
     */
    function Logger(){
        // hand-rolled extend
        for (var e in base){
            if (base.hasOwnProperty(e)){
                Logger.prototype[e] = base[e];
            }
        }
    }
    /**
     * Log.
     * 
     * @public
     * @param logLevel
     * @param message
     */
    Logger.prototype.log = function(logLevel, message){
        if (this.enabled){
            var text = "";
            var levelName = this.getLevelName(logLevel);

            if (this.logLevel === this.level.ALL){
                text = log(message, levelName);
            } else if (logLevel >= this.logLevel){
                text = log(message, levelName);
            }
            this.writeToConsole(text);
        }
    };
    /**
     * Log.
     * 
     * @private
     * @param msg
     * @param level
     * @type String
     */
    var log = function(msg, level){
        if (msg === null){
            msg = "null";
        }

        if (window.console !== undefined){
            if (window.console.log !== undefined){
                if (typeof (msg) === "string"){
                    msg = msg.split("<br />").join("\r\n");
                }

                if (level === "ERROR"){
                    if (window.console.error !== undefined){
                        window.console.error(level + ": " + msg);
                    } else{
                        window.console.log(level + ": " + msg);
                    }
                } else if (level === "WARN"){
                    if (window.console.warn !== undefined){
                        window.console.warn(level + ": " + msg);
                    } else{
                        window.console.log(level + ": " + msg);
                    }
                } else{
                    window.console.log(level + ": " + msg);
                }
            }
        }
        return level + ": " + msg;
    };
    /**
     * Get level name.
     * 
     * @public
     * @param levelNum
     * @type Object
     * @return The level name.
     */
    Logger.prototype.getLevelName = function(levelNum){
        for (var l in this.level){
            var level = this.level[l];

            if (level === levelNum){
                return l;
            }
        }
    };
    /**
     * Show console.
     * 
     * @public
     * @type Object
     */
    Logger.prototype.showConsole = function(){
        if (this.USE_CONSOLE){
            var doc = document;
            var console = this.CONSOLE_DIV;

            if (console === null || console === undefined){
                console = doc.createElement("div");
                console.id = "DEBUG_CONSOLE";
                console.style.position = "absolute";
                console.style.left = "30px";
                console.style.top = "20px";
                console.style.width = "630px";
                console.style.height = "400px";
                console.style.visibility = "visible";
                console.style.display = "block";
                console.style.color = "yellow";
                console.style.fontFamily = "Courier";
                console.style.backgroundColor = "#222222";
                console.style.overflow = "auto";
                console.style.fontSize = "10pt";
                console.style.zIndex = "100000";
                doc.body.appendChild(console);
                this.CONSOLE_DIV = console;
            } else{
                console.style.display = "block";
            }
            return console;
        }
        return null;
    };
    /**
     * Hide console.
     * 
     * @public
     */
    Logger.prototype.hideConsole = function(){
        if (this.CONSOLE_DIV !== null){
            this.CONSOLE_DIV.style.display = "none";
        }
    };
    /**
     * Write to console.
     * 
     * @public
     * @param msg
     */
    Logger.prototype.writeToConsole = function(msg){
        var console = this.showConsole();

        try{
            if (console !== null){
                var text = console.innerHTML;

                if (this.trim(text) !== ""){
                    text += "<br />";
                }
                text += msg;
                text += "<hr />";
                console.innerHTML = text;
                console.scrollTop = 1000000;
            }
        /**
         * Catch.
         * 
         * @param e
         * @type String
         */
        }
        catch (e)
        {
        }
    };
    /**
     * Trim.
     * 
     * @public
     * @param input
     * @type String
     */
    Logger.prototype.trim = function(input){
        return input.replace(/^\s*(\S*(\s+\S+)*)\s*$/, "$1");
    };
    /**
     * Clear console.
     * 
     * @public
     */
    Logger.prototype.clearConsole = function(){
        if (window.isFireBugInstalled() !== true){
            var console = this.showConsole();

            if (console !== null){
                console.innerText = "";
            }
        }
    };
    var base =
        {
        USE_CONSOLE: false,
        enabled: true,
        level:
            {
            NONE: -1,
            // NONE is intended to turn off all logging.
            ALL: 0,
            // The ALL has the lowest possible rank and is intended to turn on
            // all logging.
            DEBUG: 2,
            // The DEBUG Level designates fine-grained informational events that
            // are most useful to debug an application.
            ERROR: 5,
            // The ERROR level designates error events that might still allow
            // the application to continue running.
            FATAL: 6,
            // The FATAL level designates very severe error events that will
            // presumably lead the application to abort.
            INFO: 3,
            // The INFO level designates informational messages that highlight
            // the progress of the application at coarse-grained level.
            TRACE: 1,
            // The TRACE Level designates finer-grained informational events
            // than the DEBUG
            WARN: 4
            // The WARN level designates potentially harmful situations.
            },
        logLevel: 3
        };
    /**
     * Get instance.
     * 
     * @type Object
     * @return The instance.
     */
    function getInstance(){
        if (_instance === null){
            _instance = new Logger();
        }
        window.top.Logger = _instance;
        return _instance;
    }
    return getInstance();
});