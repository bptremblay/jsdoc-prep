(function() {

  define(['jquery', 'toolbar', 'template-engine', 'text!root/templates/link-editor-tools.html', 'i18n!galileo-lib/modules/nls/engine'],
    /**
     * @exports src/lib/toolbar/galileo-insert-link-tool
     * @requires jquery
     * @requires toolbar
     * @requires template-engine
     * @requires text!root/templates/link-editor-tools.html
     * @requires i18n!galileo-lib/modules/nls/engine
     */
    function($, galileoToolbar, Mustache, template, i18n) {
      var GalileoInsertLinkTool;
      return GalileoInsertLinkTool = (function() {
        /**
         * @function
         */
        GalileoInsertLinkTool.prototype.get$Toolbar = function() {
          return this.toolbar;
        };
        /**
         * @constructor
         */
        function GalileoInsertLinkTool() {
          this.galileoToolbar = galileoToolbar;
          this.$toolbar = $('.link-tools');
          if (!this.$toolbar.length) {
            this.$toolbar = $(this.galileoToolbar.getTools('link-tools', Mustache.render(template, i18n)));
          }
        }
        /**
         * @param href
         */
        GalileoInsertLinkTool.prototype.freeMarkerFormatUrl = function(href) {
          if (/^mailto:/.test(href)) {
            return href;
          } else {
            return "${trackedURL('" + href + "')}";
          }
        };
        return GalileoInsertLinkTool;
      })();
    });
}).call(this);
