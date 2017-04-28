import $ from './lib/jquery';

class DocumentService {
  constructor() {
    this.config = {};
  }
  configure(options) {}
  get(documentId) {
    return new Promise(function (resolve) {
      resolve({
        "template": {
          "canonical-name": "",
          "template_version": "",
          "locale": {
            "name": "en_US",
            "title": "Basic Newsletter",
            "preheader": "You don't want to miss this.",
            "date": "Volume XX  |  Month Day 20XX",
            "headline": "Your monthly news &amp; updates",
            "text": "Get readers excited about your newsletter with a quick introduction that highlights your main topic, and let the rest of the email cover the details.",
            "text-long": "Get readers excited about your newsletter with a quick introduction that highlights your main topic, and let the rest of the email cover the details. Get readers excited about your newsletter with a quick introduction that highlights your main topic, and let the rest of the email cover the details. Get readers excited about your newsletter with a quick introduction that highlights your main topic, and let the rest of the email cover the details.",
            "button": "Visit our Website",
            "article1-heading-text": "Upcoming Events",
            "article1-text": "Keep your message brief, friendly, and to the point. If readers need to know more than you can fit here, add a link to an outside resource that covers the rest.<br /><br /><a href=\"#\">Link to Additional Resources</a>",
            "article2-heading-text": "Service Spotlight",
            "article2-text": "Think about the purpose of your email: You want readers to respond in a certain way, so use specific call-to-actions such as visit our website, shop the sale now, or sign up for specials.<br /><br /><a href=\"#\">Link to Additional Resources</a>",
            "coupon-heading": "25% OFF",
            "coupon-subheading": "your entire purchase",
            "coupon-text": "Be sure to enter code<br />[<a href=\"#\" style=\"font-weight: bold;\">SALE</a>] at checkout to save!",
            "coupon-button": "BUY NOW",
            "about-text": "Name | Company | Phone | Fax | Email | Website"
          },
          "theme": {
            "name": "basic-newsletter",
            "colors": {
              "primary": "#999999",
              "primary-fore": "#292929",
              "secondary": "#ffffff",
              "secondary-fore": "#292929",
              "tertiary": "#403F42",
              "tertiary-fore": "#ffffff",
              "accent1": "#09A3BA",
              "accent1-fore": "#292929",
              "accent2": "#403F42",
              "accent2-fore": "#ffffff"
            },
            "images": {
              "logo": "",
              "outer-background": "https://static.ctctcdn.com/letters/images/PT1631/bg-69009202.png",
              "hero": "",
              "accent-image-1": "",
              "accent-image-2": ""
            },
            "fonts": {
              "base": "Arial, Verdana, Helvetica, sans-serif",
              "h1": "Georgia, 'Times New Roman', Times, serif",
              "h2": "Arial, Verdana, Helvetica, sans-serif"
            }
          },
          "styles": {
            "shell": {
              "outer-background": "{{theme.colors.primary}}",
              "outer-background-image": "{{theme.images.outer-background}}",
              "outer-border": "{{theme.colors.tertiary}}",
              "inner-background": "{{theme.colors.secondary}}",
              "padding-top": "15",
              "padding-right": "5",
              "padding-bottom": "15",
              "padding-left": "5",
              "border-top": "10",
              "border-right": "10",
              "border-bottom": "10",
              "border-left": "10"
            },
            "layout": {
              "background": "{{theme.colors.secondary}}",
              "feature-background": "{{theme.colors.accent2}}",
              "feature-text": "{{theme.colors.accent2-fore}}"
            },
            "layout-margin": {
              "background": "{{theme.colors.secondary}}",
              "padding": "20"
            },
            "layout-border": {
              "border-color": "{{theme.colors.accent2}}",
              "border-width": "2",
              "border-style": "dashed",
              "background": "{{theme.colors.secondary}}"
            },
            "col": {
              "content-padding-outer": "20",
              "content-padding-inner": "10"
            },
            "text": {
              "font-family": "{{theme.fonts.base}}",
              "size": "14px",
              "weight": "normal",
              "decoration": "none",
              "style": "normal",
              "color": "{{theme.colors.secondary-fore}}"
            },
            "button": {
              "width": "auto",
              "color": "{{theme.colors.tertiary}}",
              "text-font-family": "{{theme.fonts.base}}",
              "text-size": "14px",
              "text-weight": "bold",
              "text-decoration": "none",
              "text-style": "",
              "text-color": "{{theme.colors.tertiary-fore}}",
              "padding-vertical": "10",
              "padding-horizontal": "20",
              "corner-radius": "10"
            },
            "button-border": {
              "width": "auto",
              "color": "{{theme.colors.tertiary-fore}}",
              "text-font-family": "{{theme.fonts.base}}",
              "text-size": "14px",
              "text-weight": "bold",
              "text-decoration": "none",
              "text-style": "",
              "text-color": "{{theme.colors.tertiary}}",
              "border-color": "{{theme.colors.tertiary}}",
              "border-width": "2",
              "padding-vertical": "10",
              "padding-horizontal": "20",
              "corner-radius": "12",
              "corner-radius-inner": "10"
            },
            "divider": {
              "color": "{{theme.colors.tertiary}}",
              "width": "94",
              "padding-top": "10",
              "padding-bottom": "10",
              "height-solid": "1",
              "height-dashed": "0"
            },
            "spacer": {
              "height": "30"
            }
          },
          "globals": {},
          "files": {
            "button": {
              "html": "<table class=\"button{{#modifiers}} button--{{{.}}}{{/modifiers}}\" data-content-type=\"button\" data-content-name=\"Button\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"button_container content_padding\" align=\"{{align}}\"><table class=\"button_content\" style=\"{{#width}}width: {{.}}; {{/width}}{{#corner-radius}}moz-border-radius: {{.}}px; {{/corner-radius}}{{#corner-radius}}border-radius: {{.}}px; {{/corner-radius}}{{#color}}background-color: {{.}}; {{/color}}\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"button_content_inner\" style=\"{{#padding-vertical}}padding-top: {{.}}px; {{/padding-vertical}}{{#padding-horizontal}}padding-right: {{.}}px; {{/padding-horizontal}}{{#padding-vertical}}padding-bottom: {{.}}px; {{/padding-vertical}}{{#padding-horizontal}}padding-left: {{.}}px; {{/padding-horizontal}}{{#text-font-family}}font-family: {{.}}; {{/text-font-family}}{{#text-size}}font-size: {{.}}; {{/text-size}}{{#text-weight}}font-weight: {{.}}; {{/text-weight}}{{#text-decoration}}text-decoration: {{.}}; {{/text-decoration}}{{#text-style}}font-style: {{.}}; {{/text-style}}{{#text-color}}color: {{.}}; {{/text-color}}\" align=\"center\"><a href=\"{{link}}\" style=\"{{#text-font-family}}font-family: {{.}}; {{/text-font-family}}{{#text-size}}font-size: {{.}}; {{/text-size}}{{#text-weight}}font-weight: {{.}}; {{/text-weight}}{{#text-decoration}}text-decoration: {{.}}; {{/text-decoration}}{{#text-style}}font-style: {{.}}; {{/text-style}}{{#text-color}}color: {{.}}; {{/text-color}}\">{{{content}}}</a></td></tr></table></td></tr></table>",
              "css": ".button .button_container { padding-top: 10px; padding-bottom: 10px; } .button .button_content { width: {{styles.button.width}}; border: none; moz-border-radius: {{styles.button.corner-radius}}px; border-radius: {{styles.button.corner-radius}}px; border-spacing: 0; background-color: {{styles.button.color}}; } .button .button_content_inner { padding-top: {{styles.button.padding-vertical}}px; padding-right: {{styles.button.padding-horizontal}}px; padding-bottom: {{styles.button.padding-vertical}}px; padding-left: {{styles.button.padding-horizontal}}px; } .button .button_content_inner, .button .button_content_inner a { color: {{styles.button.text-color}}; font-family: {{styles.button.text-font-family}}; font-size: {{styles.button.text-size}}; {{#styles.button.text-weight}}font-weight: {{.}};{{/styles.button.text-weight}} {{#styles.button.text-decoration}}text-decoration: {{.}};{{/styles.button.text-decoration}} {{#styles.button.text-style}}font-style: {{.}};{{/styles.button.text-style}} }"
            },
            "button-border": {
              "html": "<table class=\"button-border{{#modifiers}} button--{{{.}}}{{/modifiers}}\" data-content-type=\"button\" data-content-name=\"Button\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"button_container content_padding\" align=\"{{align}}\"><table class=\"button_border\" style=\"{{#width}}width: {{.}}; {{/width}}{{#corner-radius}}moz-border-radius: {{.}}px; {{/corner-radius}}{{#corner-radius}}border-radius: {{.}}px; {{/corner-radius}}{{#border-color}}background-color: {{.}}; {{/border-color}}\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"button_border_width\" style=\"{{#border-width}}padding: {{.}}px; {{/border-width}}\"><table class=\"button_content\" style=\"{{#width}}width: {{.}}; {{/width}}{{#corner-radius-inner}}moz-border-radius: {{.}}px; {{/corner-radius-inner}}{{#corner-radius-inner}}border-radius: {{.}}px; {{/corner-radius-inner}}{{#color}}background-color: {{.}}; {{/color}}\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"button_content_inner\" style=\"{{#padding-vertical}}padding-top: {{.}}px; {{/padding-vertical}}{{#padding-horizontal}}padding-right: {{.}}px; {{/padding-horizontal}}{{#padding-vertical}}padding-bottom: {{.}}px; {{/padding-vertical}}{{#padding-horizontal}}padding-left: {{.}}px; {{/padding-horizontal}}{{#text-font-family}}font-family: {{.}}; {{/text-font-family}}{{#text-size}}font-size: {{.}}; {{/text-size}}{{#text-weight}}font-weight: {{.}}; {{/text-weight}}{{#text-decoration}}text-decoration: {{.}}; {{/text-decoration}}{{#text-style}}font-style: {{.}}; {{/text-style}}{{#text-color}}color: {{.}}; {{/text-color}}\" align=\"center\"><a href=\"{{link}}\" style=\"{{#text-font-family}}font-family: {{.}}; {{/text-font-family}}{{#text-size}}font-size: {{.}}; {{/text-size}}{{#text-weight}}font-weight: {{.}}; {{/text-weight}}{{#text-decoration}}text-decoration: {{.}}; {{/text-decoration}}{{#text-style}}font-style: {{.}}; {{/text-style}}{{#text-color}}color: {{.}}; {{/text-color}}\">{{{content}}}</a></td></tr></table></td></tr></table></td></tr></table>",
              "css": ".button-border .button_container { padding-top: 10px; padding-bottom: 10px; } .button-border .button_border { width: {{styles.button-border.width}}; border: none; moz-border-radius: {{styles.button-border.corner-radius}}px; border-radius: {{styles.button-border.corner-radius}}px; border-spacing: 0; background-color: {{styles.button-border.border-color}}; } .button-border .button_border_width { padding: {{styles.button-border.border-width}}px; } .button-border .button_content { width: {{styles.button-border.width}}; border: none; moz-border-radius: {{styles.button-border.corner-radius-inner}}px; border-radius: {{styles.button-border.corner-radius-inner}}px; border-spacing: 0; background-color: {{styles.button-border.color}}; } .button-border .button_content_inner { padding-top: {{styles.button.padding-vertical}}px; padding-right: {{styles.button.padding-horizontal}}px; padding-bottom: {{styles.button.padding-vertical}}px; padding-left: {{styles.button.padding-horizontal}}px; } .button-border .button_content_inner, .button-border .button_content_inner a { color: {{styles.button-border.text-color}}; font-family: {{styles.button-border.text-font-family}}; font-size: {{styles.button-border.text-size}}; {{#styles.button-border.text-weight}}font-weight: {{.}};{{/styles.button-border.text-weight}} {{#styles.button-border.text-decoration}}text-decoration: {{.}};{{/styles.button-border.text-decoration}} {{#styles.button-border.text-style}}font-style: {{.}};{{/styles.button-border.text-style}} }"
            },
            "col": {
              "html": "<td class=\"col{{#modifiers}} col--{{{.}}}{{/modifiers}} scale stack\"{{#width}} width=\"{{.}}\"{{/width}} align=\"{{align}}\" valign=\"{{valign}}\">{{#children}}{{{.}}}{{/children}}</td>",
              "css": "/* Column Padding */ .col .content_padding { padding-left: {{styles.col.content-padding-outer}}px; padding-right: {{styles.col.content-padding-outer}}px; } .col.col--left .content_padding { padding-left: {{styles.col.content-padding-outer}}px; padding-right: {{styles.col.content-padding-inner}}px; } .col.col--right .content_padding { padding-left: {{styles.col.content-padding-inner}}px; padding-right: {{styles.col.content-padding-outer}}px; } /* Feature Layout */ .col.col--feature { background-color: {{styles.layout.feature-background}}; }",
              "css-media": ".col .content_padding, .col--left .content_padding, .col--right .content_padding { padding-left: {{styles.col.content-padding-outer}}px!important; padding-right: {{styles.col.content-padding-outer}}px!important; }"
            },
            "col-split": {
              "html": "<td class=\"col-split{{#modifiers}} col-split--{{{.}}}{{/modifiers}} scale stack\"{{#width}} width=\"{{.}}\"{{/width}} align=\"{{align}}\" valign=\"{{valign}}\"><table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr>{{#children}}{{{.}}}{{/children}}</tr></table></td>",
              "css": ".col-split.col-split--left { padding: 0px 10px 0px 0px; } .col-split.col-split--right { padding: 0px 0px 0px 10px; }",
              "css-media": ".col-split.col-split--left { padding: 0px 0px 5px 0px !important; } .col-split.col-split--right { padding: 5px 0px 0px 0px !important; } .col-split.scale { width: auto !important; }"
            },
            "divider": {
              "html": "<table class=\"divider{{#modifiers}} divider--{{{.}}}{{/modifiers}}\" data-content-type=\"divider\" data-content-name=\"Divider\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"divider_container\" style=\"{{#padding-top}}padding-top: {{.}}px; {{/padding-top}}{{#padding-bottom}}padding-bottom: {{.}}px; {{/padding-bottom}}\" width=\"100%\" align=\"center\" valign=\"top\"><table class=\"divider_content\" style=\"{{#width}}width: {{.}}%;{{/width}}\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"divider_content_inner\" style=\"{{#height-solid}}padding-bottom: {{.}}px; {{/height-solid}}{{#height-dashed}}border-bottom-width: {{.}}px; {{/height-dashed}}{{#color-solid}}background-color: {{.}}; {{/color-solid}}{{#color-dashed}}border-color: {{.}}; {{/color-dashed}}\" height=\"1\" align=\"center\"><img alt=\"\" width=\"5\" height=\"1\" border=\"0\" hspace=\"0\" vspace=\"0\" src=\"https://static.ctctcdn.com/letters/images/1101116784221/S.gif\"/></td></tr></table></td></tr></table>",
              "css": ".divider .divider_container { padding-top: {{styles.divider.padding-top}}px; padding-bottom: {{styles.divider.padding-bottom}}px; } .divider .divider_content { height: 1px; width: {{styles.divider.width}}%; } .divider .divider_content_inner { height: 1px; line-height: 1px; } .divider .divider_content_inner img { display: block; height: 1px; width: 5px; } .divider.divider--solid .divider_content_inner { padding-bottom: {{styles.divider.height-solid}}px; border-bottom-style: none; background-color: {{styles.divider.color}}; } .divider.divider--dashed .divider_content { border-collapse: separate; } .divider.divider--dashed .divider_content_inner { border-bottom-width: {{styles.divider.height-dashed}}px; border-bottom-style: dashed; border-color: {{styles.divider.color}}; }"
            },
            "image": {
              "html": "<table class=\"image{{#modifiers}} image--{{{.}}}{{/modifiers}}\" data-content-type=\"image\" data-content-name=\"Image\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"image_container\" align=\"{{align}}\" valign=\"{{valign}}\"><div>{{#link}}<a href=\"{{{.}}}\">{{/link}}<img class=\"image_content\" width=\"{{width}}\" src=\"{{src}}\" alt=\"{{alt}}\"/>{{#link}}</a>{{/link}}</div></td></tr></table>",
              "css": ".image .image_container { padding-top: 0px; padding-bottom: 0px; } .image.image--padding-vertical .image_container { padding-top: 10px; padding-bottom: 10px; } .image .image_content { display: block; height: auto; max-width: 100%; } .image.image--float .image_spacer { height: 1px; line-height: 1px; padding: 0px 0px; } .image.image--float .image_spacer_bottom { height: 5px; line-height: 1px; padding: 0px 0px; }"
            },
            "image-float-left": {
              "html": "<table class=\"image{{#modifiers}} image--{{{.}}}{{/modifiers}} scale\" data-content-type=\"image\" data-content-name=\"Image Float Left\" align=\"left\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"image_container scale stack\" align=\"{{align}}\" valign=\"{{valign}}\"><div>{{#link}}<a href=\"{{{.}}}\">{{/link}}<img class=\"image_content\" width=\"{{width}}\" src=\"{{src}}\" alt=\"{{alt}}\"/>{{#link}}</a>{{/link}}</div></td><td class=\"image_spacer hide\" width=\"15\" height=\"1\" align=\"center\" valign=\"top\"><img alt=\"\" width=\"15\" height=\"1\" border=\"0\" hspace=\"0\" vspace=\"0\" src=\"https://static.ctctcdn.com/letters/images/sys/S.gif\"/></td></tr><tr><td class=\"image_spacer_bottom\" height=\"5\" align=\"center\" valign=\"top\"><img alt=\"\" width=\"1\" height=\"5\" border=\"0\" hspace=\"0\" vspace=\"0\" src=\"https://static.ctctcdn.com/letters/images/sys/S.gif\"/></td><td class=\"image_spacer hide\" width=\"5\" height=\"5\" align=\"center\" valign=\"top\"><img alt=\"\" width=\"5\" height=\"1\" border=\"0\" hspace=\"0\" vspace=\"0\" src=\"https://static.ctctcdn.com/letters/images/sys/S.gif\"/></td></tr></table>",
              "css": ".image .image_container { padding-top: 0px; padding-bottom: 0px; } .image.image--padding-vertical .image_container { padding-top: 10px; padding-bottom: 10px; } .image .image_content { display: block; height: auto; max-width: 100%; } .image.image--float .image_spacer { height: 1px; line-height: 1px; padding: 0px 0px; } .image.image--float .image_spacer_bottom { height: 5px; line-height: 1px; padding: 0px 0px; } .image.image--float.image--left { mso-table-rspace: 5.75pt; }"
            },
            "image-float-right": {
              "html": "<table class=\"image{{#modifiers}} image--{{{.}}}{{/modifiers}} scale\" data-content-type=\"image\" data-content-name=\"Image Float Right\" align=\"right\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"image_spacer hide\" width=\"15\" height=\"1\" align=\"center\" valign=\"top\"><img alt=\"\" width=\"15\" height=\"1\" border=\"0\" hspace=\"0\" vspace=\"0\" src=\"https://static.ctctcdn.com/letters/images/sys/S.gif\"/></td><td class=\"image_container scale stack\" align=\"{{align}}\" valign=\"{{valign}}\"><div>{{#link}}<a href=\"{{{.}}}\">{{/link}}<img class=\"image_content\" width=\"{{width}}\" src=\"{{src}}\" alt=\"{{alt}}\"/>{{#link}}</a>{{/link}}</div></td></tr><tr><td class=\"image_spacer hide\" width=\"5\" height=\"5\" align=\"center\" valign=\"top\"><img alt=\"\" width=\"5\" height=\"1\" border=\"0\" hspace=\"0\" vspace=\"0\" src=\"https://static.ctctcdn.com/letters/images/sys/S.gif\"/></td><td class=\"image_spacer_bottom\" height=\"5\" align=\"center\" valign=\"top\"><img alt=\"\" width=\"1\" height=\"5\" border=\"0\" hspace=\"0\" vspace=\"0\" src=\"https://static.ctctcdn.com/letters/images/sys/S.gif\"/></td></tr></table>",
              "css": ".image .image_container { padding-top: 0px; padding-bottom: 0px; } .image.image--padding-vertical .image_container { padding-top: 10px; padding-bottom: 10px; } .image .image_content { display: block; height: auto; max-width: 100%; } .image.image--float .image_spacer { height: 1px; line-height: 1px; padding: 0px 0px; } .image.image--float .image_spacer_bottom { height: 5px; line-height: 1px; padding: 0px 0px; } .image.image--float.image--right { mso-table-lspace: 5.75pt; }"
            },
            "layout": {
              "html": "<table class=\"layout{{#modifiers}} layout--{{{.}}}{{/modifiers}}\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr>{{#children}}{{{.}}}{{/children}}</tr></table>",
              "css": ".layout .col { background-color: {{styles.layout.background}}; } .layout.layout--feature .col { background-color: {{styles.layout.feature-background}}; } .layout.layout--feature .text_content { color: {{styles.layout.feature-text}}; }",
              "css-head": ".layout { min-width: 100%; }"
            },
            "layout-border": {
              "html": "<table class=\"layout-border{{#modifiers}} layout-border--{{{.}}}{{/modifiers}}\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"layout_border\" align=\"center\" valign=\"top\">{{#children}}{{{.}}}{{/children}}</td></tr></table>",
              "css": ".layout-border.layout-border--solid .layout_border { padding: {{styles.layout-border.border-width}}px; background-color: {{styles.layout-border.border-color}}; } .layout-border .layout_border .col { background-color: {{styles.layout-border.background}}; } .layout-border.layout-border--dashed { border-width: {{styles.layout-border.border-width}}px; border-style: {{styles.layout-border.border-style}}; border-color: {{styles.layout-border.border-color}}; }"
            },
            "layout-margin": {
              "html": "<table class=\"layout-margin{{#modifiers}} layout-margin--{{{.}}}{{/modifiers}}\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"layout_margin\" align=\"center\" valign=\"top\">{{#children}}{{{.}}}{{/children}}</td></tr></table>",
              "css": ".layout_margin { padding: 0px {{styles.layout-margin.padding}}px; background-color: {{styles.layout-margin.background}}; }"
            },
            "shell": {
              "html": "<div class=\"shell{{#modifiers}} shell--{{{.}}}{{/modifiers}} shell_bgcolor\"> {{#styles.shell.outer-background-image}}<!--[if gte mso 9]><v:background xmlns:v=\"urn:schemas-microsoft-com:vml\" fill=\"t\"><v:fill type=\"tile\" src=\"{{styles.shell.outer-background-image}}\" color=\"{{styles.shell.outer-background}}\"/></v:background><![endif]-->{{/styles.shell.outer-background-image}} <table class=\"shell_bgimage\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td data-header-container=\"\">{{#preheader}}<div id=\"preheader\" data-entity-ref=\"preheader\">{{{.}}}</div>{{/preheader}}</td></tr><tr><td align=\"center\" data-document-body-container=\"\"><table class=\"shell_main-width scale\" width=\"{{width}}\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"shell_padding\" align=\"center\" valign=\"top\"><table width=\"100%\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"shell_border\" align=\"center\" valign=\"top\"><table width=\"100%\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"shell_layout_container\" align=\"center\" valign=\"top\"><div data-layout-container=\"\">{{#children}}{{{.}}}{{/children}}</div></td></tr></table></td></tr></table></td></tr></table></td></tr></table></div>",
              "css": "#preheader { color: transparent; display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; } .shell .shell_main_width { width: {{width}}px; } .shell .shell_max_main_width { max-width: {{width}}px; } .shell.shell_bgcolor { background-color: {{styles.shell.outer-background}}; } {{#styles.shell.outer-background-image}} .shell .shell_bgimage { background-image: url('{{styles.shell.outer-background-image}}'); background-position: top left; background-repeat: repeat; } {{/styles.shell.outer-background-image}} .shell .shell_padding { padding: {{styles.shell.padding-top}}px {{styles.shell.padding-right}}px {{styles.shell.padding-bottom}}px {{styles.shell.padding-left}}px; } .shell .shell_border { padding: {{styles.shell.border-top}}px {{styles.shell.border-right}}px {{styles.shell.border-bottom}}px {{styles.shell.border-left}}px; background-color: {{styles.shell.outer-border}}; } .shell .shell_layout_container {padding: 0; background-color: {{styles.shell.inner-background}}; }"
            },
            "social": {
              "html": "<table class=\"social{{#modifiers}} social--{{{.}}}{{/modifiers}}\" data-content-type=\"social\" data-content-name=\"Social\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"social_container content_padding\"width=\"100%\" align=\"{{align}}\" valign=\"top\">{{#icon}}<a href=\"{{link}}\" class=\"social_link\"><img class=\"social_icon\" data-social-type=\"{{id}}\" alt=\"{{name}}\" width=\"{{width}}\" border=\"0\" src=\"{{src}}\"/> &nbsp;</a>{{/icon}}</td></tr></table>",
              "css": ".social .social_container { padding-top: 0px; padding-bottom: 10px; } .social .social_link { display: inline-block; text-decoration: none; } .social .social_icon { display: inline-block; padding: 0; margin: 0; }"
            },
            "spacer": {
              "html": "<table class=\"spacer{{#modifiers}} spacer--{{{.}}}{{/modifiers}}\" data-content-type=\"spacer\" data-content-name=\"Spacer\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"spacer_content\" style=\"{{#height}}padding-bottom: {{.}}px;{{/height}}\" width=\"100%\" align=\"center\" valign=\"top\"><img alt=\"\" width=\"5\" height=\"1\" border=\"0\" hspace=\"0\" vspace=\"0\" src=\"https://static.ctctcdn.com/letters/images/1101116784221/S.gif\"/></td></tr></table>",
              "css": ".spacer .spacer_content { padding-bottom: {{styles.spacer.height}}px; height: 1px; line-height: 1px; } .spacer .spacer_content img { display: block; height: 1px; width: 5px; }"
            },
            "template": {
              "html": "<!DOCTYPE HTML><head lang=\"{{{locale.name}}}\"><title>{{locale.title}}</title><meta http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\"/><meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1\"/><style type=\"text/css\">{{{css}}}</style><style type=\"text/css\" data-premailer=\"ignore\">{{{css-head}}}</style><style type=\"text/css\">@media only screen and (min-width: 320px) and (max-width:480px) { {{{css-media}}} }</style></head><body class=\"template template-{{{theme.name}}} template-{{{locale.name}}}\" align=\"center\" topmargin=\"0\" leftmargin=\"0\" marginheight=\"0\" marginwidth=\"0\" data-template-version=\"{{data-template-version}}\">{{#children}}{{{.}}}{{/children}}</body></html>",
              "css": "",
              "css-media": ".scale { width: 100% !important; height: auto !important; } .stack { display: block !important; } .hide { display: none !important; }",
              "css-head": "a[x-apple-data-detectors] { text-decoration: underline !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; color: inherit !important; } .editor-text { -webkit-font-smoothing: antialiased; }"
            },
            "text": {
              "html": "<table class=\"text{{#modifiers}} text--{{{.}}}{{/modifiers}}\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"{{align}}\" valign=\"{{valign}}\">{{#children}}{{{.}}}{{/children}}{{{content}}}</td></tr></table>",
              "css": ".text .text_content { padding-top: 10px; padding-bottom: 10px; } .text .text_content { color: {{styles.text.color}}; font-family: {{styles.text.font-family}}; font-size: {{styles.text.size}}; display: block; word-wrap: break-word; text-align: left; } .text .text_content a { color: #428bca; } .text.text--center .text_content { text-align: center; } /* Headlines */ .text.text--headline .text_content { font-size: 24px; } /* Feature */ .text.text--feature .text_content { color: {{styles.layout.feature-text}}; } .text.text--feature.text--headline .text_content { font-size: 20px; } .text.text--feature .text_content { font-size: 16px; } /* Article */ .text.text--article.text--headline .text_content { font-size: 20px; } .text.text--article .text_content { font-size: 16px; } /* Coupon */ .text.text--coupon.text--headline .text_content { font-size: 46px; } .text.text--coupon .text_content { font-size: 16px; }"
            }
          },
          "components": {
            "template": {
              "data-template-version": "4.0.0",
              "canonical-name": "",
              "component": "template",
              "modifiers": [],
              "children": [
          "<div class=\"shell shell_bgcolor\"> <!--[if gte mso 9]><v:background xmlns:v=\"urn:schemas-microsoft-com:vml\" fill=\"t\"><v:fill type=\"tile\" src=\"https://static.ctctcdn.com/letters/images/PT1631/bg-69009202.png\" color=\"#999999\"/></v:background><![endif]--> <table class=\"shell_bgimage\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td data-header-container=\"\"><div id=\"preheader\" data-entity-ref=\"preheader\">You don't want to miss this.</div></td></tr><tr><td align=\"center\" data-document-body-container=\"\"><table class=\"shell_main-width scale\" width=\"630\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"shell_padding\" align=\"center\" valign=\"top\"><table width=\"100%\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"shell_border\" align=\"center\" valign=\"top\"><table width=\"100%\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"shell_layout_container\" align=\"center\" valign=\"top\"><div data-layout-container=\"\"><table class=\"layout layout--feature\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"text text--center\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>Volume XX  |  Month Day 20XX</div></td></tr></table></td></tr></table><table class=\"layout\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"image image--logo\" data-content-type=\"image\" data-content-name=\"Image\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"image_container\" align=\"center\" valign=\"top\"><div><img class=\"image_content\" width=\"559.156626506024\" src=\"https://mlsvc01-prod.s3.amazonaws.com/32d181df501/d522aff4-7379-45b7-8aa2-5399aa4775ba.jpg?ver=1468356632000\" alt=\"\"/></div></td></tr></table></td></tr></table><table class=\"layout layout--headline\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"text text--headline\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>Your monthly news & updates</div></td></tr></table></td></tr></table><table class=\"layout\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"text\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>Get readers excited about your newsletter with a quick introduction that highlights your main topic, and let the rest of the email cover the details.</div></td></tr></table></td></tr></table><table class=\"layout\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"button\" data-content-type=\"button\" data-content-name=\"Button\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"button_container content_padding\" align=\"center\"><table class=\"button_content\" style=\"background-color: #DE9DCC; \" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"button_content_inner\" style=\"font-weight: bold; font-style: normal; color: #3661BD; \" align=\"center\"><a href=\"\" style=\"font-weight: bold; font-style: normal; color: #3661BD; \">Visit our Website</a></td></tr></table></td></tr></table></td></tr></table><table class=\"layout\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"divider divider--solid\" data-content-type=\"divider\" data-content-name=\"Divider\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"divider_container\" style=\"\" width=\"100%\" align=\"center\" valign=\"top\"><table class=\"divider_content\" style=\"\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"divider_content_inner\" style=\"\" height=\"1\" align=\"center\"><img alt=\"\" width=\"5\" height=\"1\" border=\"0\" hspace=\"0\" vspace=\"0\" src=\"https://static.ctctcdn.com/letters/images/1101116784221/S.gif\"/></td></tr></table></td></tr></table></td></tr></table><table class=\"layout layout--right\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"50%\" align=\"left\" valign=\"top\"><table class=\"text text--headline text--headline\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>Upcoming Events</div></td></tr></table><table class=\"text\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>\n  Keep your message brief, friendly, and to the point. If readers need to know more than you can fit here, add a link to an outside resource that covers the rest.<br>\n  <br>\n  <a href=\"#\">Link to Additional Resources</a>\n</div></td></tr></table></td><td class=\"col scale stack\" width=\"50%\" align=\"left\" valign=\"top\"><table class=\"image\" data-content-type=\"image\" data-content-name=\"Image\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"image_container\" align=\"center\" valign=\"top\"><div><img class=\"image_content\" width=\"260\" src=\"https://mlsvc01-prod.s3.amazonaws.com/32d181df501/f5296337-a139-405d-adfd-67c6443f6575.jpg?ver=1468356632000\" alt=\"\"/></div></td></tr></table></td></tr></table><table class=\"layout\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"divider divider--solid\" data-content-type=\"divider\" data-content-name=\"Divider\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"divider_container\" style=\"\" width=\"100%\" align=\"center\" valign=\"top\"><table class=\"divider_content\" style=\"\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"divider_content_inner\" style=\"\" height=\"1\" align=\"center\"><img alt=\"\" width=\"5\" height=\"1\" border=\"0\" hspace=\"0\" vspace=\"0\" src=\"https://static.ctctcdn.com/letters/images/1101116784221/S.gif\"/></td></tr></table></td></tr></table></td></tr></table><table class=\"layout layout--right\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"50%\" align=\"left\" valign=\"top\"><table class=\"text text--headline text--headline\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>Service Spotlight</div></td></tr></table><table class=\"text\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>\n  Think about the purpose of your email: You want readers to respond in a certain way, so use specific call-to-actions such as visit our website, shop the sale now, or sign up for specials.<br>\n  <br>\n  <a href=\"#\">Link to Additional Resources</a>\n</div></td></tr></table></td><td class=\"col scale stack\" width=\"50%\" align=\"left\" valign=\"top\"><table class=\"image\" data-content-type=\"image\" data-content-name=\"Image\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"image_container\" align=\"center\" valign=\"top\"><div><img class=\"image_content\" width=\"260\" src=\"https://mlsvc01-prod.s3.amazonaws.com/32d181df501/7642d960-7370-4bbe-a538-c9158d6f47c0.jpg?ver=1468356967000\" alt=\"\"/></div></td></tr></table></td></tr></table><table class=\"layout\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"spacer\" data-content-type=\"spacer\" data-content-name=\"Spacer\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"spacer_content\" style=\"padding-bottom: 20px;\" width=\"100%\" align=\"center\" valign=\"top\"><img alt=\"\" width=\"5\" height=\"1\" border=\"0\" hspace=\"0\" vspace=\"0\" src=\"https://static.ctctcdn.com/letters/images/1101116784221/S.gif\"/></td></tr></table></td></tr></table><table class=\"layout layout--feature\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"text text--feature text--center\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>Name | Company | Phone | Fax | Email | Website</div></td></tr></table></td></tr></table><table class=\"layout layout--center layout--social layout--feature\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"text text--center text--social text--feature\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>STAY CONNECTED</div></td></tr></table><table class=\"social social--center social--social social--feature\" data-content-type=\"social\" data-content-name=\"Social\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"social_container content_padding\"width=\"100%\" align=\"center\" valign=\"top\"><a href=\"http://facebook.com\" class=\"social_link\"><img class=\"social_icon\" data-social-type=\"facebook\" alt=\"Facebook\" width=\"32\" border=\"0\" src=\"https://static.ctctcdn.com/galileo/images/templates/Galileo-SocialMedia/facebook-visit-default.png\"/>  </a><a href=\"https://twitter.com/blakealbion\" class=\"social_link\"><img class=\"social_icon\" data-social-type=\"twitter\" alt=\"Twitter\" width=\"32\" border=\"0\" src=\"https://static.ctctcdn.com/galileo/images/templates/Galileo-SocialMedia/twitter-visit-default.png\"/>  </a><a href=\"\" class=\"social_link\"><img class=\"social_icon\" data-social-type=\"youtube\" alt=\"Youtube\" width=\"32\" border=\"0\" src=\"https://static.ctctcdn.com/galileo/images/templates/Galileo-SocialMedia/youtube-visit-default.png\"/>  </a></td></tr></table></td></tr></table></div></td></tr></table></td></tr></table></td></tr></table></td></tr></table></div>"
        ]
            },
            "shell": {
              "modifiers": [],
              "width": "630",
              "preheader": "You don't want to miss this.",
              "component": "shell",
              "children": [
          "<table class=\"layout layout--feature\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"text text--center\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>Volume XX  |  Month Day 20XX</div></td></tr></table></td></tr></table>",
          "<table class=\"layout\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"image image--logo\" data-content-type=\"image\" data-content-name=\"Image\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"image_container\" align=\"center\" valign=\"top\"><div><img class=\"image_content\" width=\"559.156626506024\" src=\"https://mlsvc01-prod.s3.amazonaws.com/32d181df501/d522aff4-7379-45b7-8aa2-5399aa4775ba.jpg?ver=1468356632000\" alt=\"\"/></div></td></tr></table></td></tr></table>",
          "<table class=\"layout layout--headline\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"text text--headline\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>Your monthly news & updates</div></td></tr></table></td></tr></table>",
          "<table class=\"layout\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"text\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>Get readers excited about your newsletter with a quick introduction that highlights your main topic, and let the rest of the email cover the details.</div></td></tr></table></td></tr></table>",
          "<table class=\"layout\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"button\" data-content-type=\"button\" data-content-name=\"Button\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"button_container content_padding\" align=\"center\"><table class=\"button_content\" style=\"background-color: #DE9DCC; \" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"button_content_inner\" style=\"font-weight: bold; font-style: normal; color: #3661BD; \" align=\"center\"><a href=\"\" style=\"font-weight: bold; font-style: normal; color: #3661BD; \">Visit our Website</a></td></tr></table></td></tr></table></td></tr></table>",
          "<table class=\"layout\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"divider divider--solid\" data-content-type=\"divider\" data-content-name=\"Divider\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"divider_container\" style=\"\" width=\"100%\" align=\"center\" valign=\"top\"><table class=\"divider_content\" style=\"\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"divider_content_inner\" style=\"\" height=\"1\" align=\"center\"><img alt=\"\" width=\"5\" height=\"1\" border=\"0\" hspace=\"0\" vspace=\"0\" src=\"https://static.ctctcdn.com/letters/images/1101116784221/S.gif\"/></td></tr></table></td></tr></table></td></tr></table>",
          "<table class=\"layout layout--right\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"50%\" align=\"left\" valign=\"top\"><table class=\"text text--headline text--headline\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>Upcoming Events</div></td></tr></table><table class=\"text\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>\n  Keep your message brief, friendly, and to the point. If readers need to know more than you can fit here, add a link to an outside resource that covers the rest.<br>\n  <br>\n  <a href=\"#\">Link to Additional Resources</a>\n</div></td></tr></table></td><td class=\"col scale stack\" width=\"50%\" align=\"left\" valign=\"top\"><table class=\"image\" data-content-type=\"image\" data-content-name=\"Image\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"image_container\" align=\"center\" valign=\"top\"><div><img class=\"image_content\" width=\"260\" src=\"https://mlsvc01-prod.s3.amazonaws.com/32d181df501/f5296337-a139-405d-adfd-67c6443f6575.jpg?ver=1468356632000\" alt=\"\"/></div></td></tr></table></td></tr></table>",
          "<table class=\"layout\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"divider divider--solid\" data-content-type=\"divider\" data-content-name=\"Divider\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"divider_container\" style=\"\" width=\"100%\" align=\"center\" valign=\"top\"><table class=\"divider_content\" style=\"\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"divider_content_inner\" style=\"\" height=\"1\" align=\"center\"><img alt=\"\" width=\"5\" height=\"1\" border=\"0\" hspace=\"0\" vspace=\"0\" src=\"https://static.ctctcdn.com/letters/images/1101116784221/S.gif\"/></td></tr></table></td></tr></table></td></tr></table>",
          "<table class=\"layout layout--right\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"50%\" align=\"left\" valign=\"top\"><table class=\"text text--headline text--headline\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>Service Spotlight</div></td></tr></table><table class=\"text\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>\n  Think about the purpose of your email: You want readers to respond in a certain way, so use specific call-to-actions such as visit our website, shop the sale now, or sign up for specials.<br>\n  <br>\n  <a href=\"#\">Link to Additional Resources</a>\n</div></td></tr></table></td><td class=\"col scale stack\" width=\"50%\" align=\"left\" valign=\"top\"><table class=\"image\" data-content-type=\"image\" data-content-name=\"Image\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"image_container\" align=\"center\" valign=\"top\"><div><img class=\"image_content\" width=\"260\" src=\"https://mlsvc01-prod.s3.amazonaws.com/32d181df501/7642d960-7370-4bbe-a538-c9158d6f47c0.jpg?ver=1468356967000\" alt=\"\"/></div></td></tr></table></td></tr></table>",
          "<table class=\"layout\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"spacer\" data-content-type=\"spacer\" data-content-name=\"Spacer\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"spacer_content\" style=\"padding-bottom: 20px;\" width=\"100%\" align=\"center\" valign=\"top\"><img alt=\"\" width=\"5\" height=\"1\" border=\"0\" hspace=\"0\" vspace=\"0\" src=\"https://static.ctctcdn.com/letters/images/1101116784221/S.gif\"/></td></tr></table></td></tr></table>",
          "<table class=\"layout layout--feature\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"text text--feature text--center\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>Name | Company | Phone | Fax | Email | Website</div></td></tr></table></td></tr></table>",
          "<table class=\"layout layout--center layout--social layout--feature\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"text text--center text--social text--feature\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>STAY CONNECTED</div></td></tr></table><table class=\"social social--center social--social social--feature\" data-content-type=\"social\" data-content-name=\"Social\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"social_container content_padding\"width=\"100%\" align=\"center\" valign=\"top\"><a href=\"http://facebook.com\" class=\"social_link\"><img class=\"social_icon\" data-social-type=\"facebook\" alt=\"Facebook\" width=\"32\" border=\"0\" src=\"https://static.ctctcdn.com/galileo/images/templates/Galileo-SocialMedia/facebook-visit-default.png\"/>  </a><a href=\"https://twitter.com/blakealbion\" class=\"social_link\"><img class=\"social_icon\" data-social-type=\"twitter\" alt=\"Twitter\" width=\"32\" border=\"0\" src=\"https://static.ctctcdn.com/galileo/images/templates/Galileo-SocialMedia/twitter-visit-default.png\"/>  </a><a href=\"\" class=\"social_link\"><img class=\"social_icon\" data-social-type=\"youtube\" alt=\"Youtube\" width=\"32\" border=\"0\" src=\"https://static.ctctcdn.com/galileo/images/templates/Galileo-SocialMedia/youtube-visit-default.png\"/>  </a></td></tr></table></td></tr></table>"
        ]
            },
            "layout": {
              "modifiers": [
          "center",
          "social",
          "feature"
        ],
              "component": "layout",
              "children": [
          "<td class=\"col scale stack\" width=\"100%\" align=\"left\" valign=\"top\"><table class=\"text text--center text--social text--feature\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>STAY CONNECTED</div></td></tr></table><table class=\"social social--center social--social social--feature\" data-content-type=\"social\" data-content-name=\"Social\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"social_container content_padding\"width=\"100%\" align=\"center\" valign=\"top\"><a href=\"http://facebook.com\" class=\"social_link\"><img class=\"social_icon\" data-social-type=\"facebook\" alt=\"Facebook\" width=\"32\" border=\"0\" src=\"https://static.ctctcdn.com/galileo/images/templates/Galileo-SocialMedia/facebook-visit-default.png\"/>  </a><a href=\"https://twitter.com/blakealbion\" class=\"social_link\"><img class=\"social_icon\" data-social-type=\"twitter\" alt=\"Twitter\" width=\"32\" border=\"0\" src=\"https://static.ctctcdn.com/galileo/images/templates/Galileo-SocialMedia/twitter-visit-default.png\"/>  </a><a href=\"\" class=\"social_link\"><img class=\"social_icon\" data-social-type=\"youtube\" alt=\"Youtube\" width=\"32\" border=\"0\" src=\"https://static.ctctcdn.com/galileo/images/templates/Galileo-SocialMedia/youtube-visit-default.png\"/>  </a></td></tr></table></td>"
        ]
            },
            "col": {
              "modifiers": [],
              "width": "100%",
              "align": "left",
              "valign": "top",
              "padding-outer": false,
              "padding-inner": false,
              "component": "col",
              "class": "social",
              "columnWidth": 1,
              "children": [
          "<table class=\"text text--center text--social text--feature\" data-content-type=\"text\" data-content-name=\"Text\" width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td class=\"text_content content_padding\" align=\"center\" valign=\"top\"><div>STAY CONNECTED</div></td></tr></table>",
          "<table class=\"social social--center social--social social--feature\" data-content-type=\"social\" data-content-name=\"Social\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"social_container content_padding\"width=\"100%\" align=\"center\" valign=\"top\"><a href=\"http://facebook.com\" class=\"social_link\"><img class=\"social_icon\" data-social-type=\"facebook\" alt=\"Facebook\" width=\"32\" border=\"0\" src=\"https://static.ctctcdn.com/galileo/images/templates/Galileo-SocialMedia/facebook-visit-default.png\"/>  </a><a href=\"https://twitter.com/blakealbion\" class=\"social_link\"><img class=\"social_icon\" data-social-type=\"twitter\" alt=\"Twitter\" width=\"32\" border=\"0\" src=\"https://static.ctctcdn.com/galileo/images/templates/Galileo-SocialMedia/twitter-visit-default.png\"/>  </a><a href=\"\" class=\"social_link\"><img class=\"social_icon\" data-social-type=\"youtube\" alt=\"Youtube\" width=\"32\" border=\"0\" src=\"https://static.ctctcdn.com/galileo/images/templates/Galileo-SocialMedia/youtube-visit-default.png\"/>  </a></td></tr></table>"
        ]
            },
            "text": {
              "modifiers": [
          "center",
          "social",
          "feature"
        ],
              "align": "center",
              "valign": "top",
              "content": "<div>STAY CONNECTED</div>",
              "component": "text",
              "children": null
            },
            "image": {
              "modifiers": [],
              "align": "center",
              "valign": "top",
              "src": "https://mlsvc01-prod.s3.amazonaws.com/32d181df501/7642d960-7370-4bbe-a538-c9158d6f47c0.jpg?ver=1468356967000",
              "width": "260",
              "alt": "",
              "link": null,
              "component": "image",
              "name": "Image-1489089893230",
              "type": "image",
              "imageType": "",
              "externalUrl": "https://files.constantcontact.com/32d181df501/7642d960-7370-4bbe-a538-c9158d6f47c0.jpg",
              "imageAlt": "",
              "imageWidth": 360,
              "imageHeight": 180,
              "linkType": "web",
              "source": "MyComputer",
              "height": 205,
              "magnification": 0.722,
              "offsetX": 0,
              "offsetY": 0,
              "cdnUrl": null,
              "container": {},
              "image": {
                "hasHeight": false
              },
              "children": null
            },
            "button": {
              "modifiers": [],
              "align": "center",
              "link": null,
              "content": "Visit our Website",
              "width": false,
              "color": "#DE9DCC",
              "text-font-family": false,
              "text-size": false,
              "text-weight": "bold",
              "text-decoration": false,
              "text-style": "normal",
              "text-color": "#3661BD",
              "padding-vertical": false,
              "padding-horizontal": false,
              "corner-radius": false,
              "component": "button",
              "fontFamily": "",
              "fontSize": "",
              "linkWasTested": false,
              "doneWasClicked": false,
              "linkType": "web",
              "height": 24,
              "children": null
            },
            "divider": {
              "modifiers": [
          "solid"
        ],
              "color-solid": false,
              "color-dashed": false,
              "width": "",
              "padding-top": false,
              "padding-divider": false,
              "height-solid": false,
              "height-dashed": false,
              "component": "divider",
              "borderColor": {
                "global": "",
                "local": ""
              },
              "borderStyle": "solid",
              "height": "",
              "marginTop": "20px",
              "marginBottom": "10px",
              "align": "center",
              "children": null
            },
            "spacer": {
              "modifiers": [],
              "height": "20",
              "component": "spacer",
              "editorName": "Spacer-1489089893233",
              "editorType": "spacer",
              "children": null
            },
            "social": {
              "modifiers": [
          "center",
          "social",
          "feature"
        ],
              "align": "center",
              "icon": [
                {
                  "id": "facebook",
                  "link": "http://facebook.com",
                  "name": "Facebook",
                  "width": 32,
                  "src": "https://static.ctctcdn.com/galileo/images/templates/Galileo-SocialMedia/facebook-visit-default.png"
          },
                {
                  "id": "twitter",
                  "link": "https://twitter.com/blakealbion",
                  "name": "Twitter",
                  "width": 32,
                  "src": "https://static.ctctcdn.com/galileo/images/templates/Galileo-SocialMedia/twitter-visit-default.png"
          },
                {
                  "id": "youtube",
                  "link": "",
                  "name": "Youtube",
                  "width": 32,
                  "src": "https://static.ctctcdn.com/galileo/images/templates/Galileo-SocialMedia/youtube-visit-default.png"
          }
        ],
              "component": "social",
              "editorName": "social-1489089893236",
              "editorType": "social-button",
              "children": null
            }
          },
          "palettes": {
            "build": {
              "quick-layouts": [
                {
                  "component": "layout",
                  "modifiers": [
              "headline"
            ],
                  "children": [
                    {
                      "component": "col",
                      "modifiers": [],
                      "children": [
                        {
                          "component": "text",
                          "modifiers": [
                      "headline",
                      "center"
                    ],
                          "content": "{{{locale.headline}}}"
                  }
                ]
              }
            ]
          },
                {
                  "component": "layout",
                  "modifiers": [
              "section"
            ],
                  "children": [
                    {
                      "component": "col",
                      "modifiers": [],
                      "children": [
                        {
                          "component": "text",
                          "modifiers": [
                      "headline",
                      "center"
                    ],
                          "content": "{{{locale.headline}}}"
                  }
                ]
              }
            ]
          },
                {
                  "component": "layout",
                  "modifiers": [
              "article"
            ],
                  "children": [
                    {
                      "component": "col",
                      "width": "60%",
                      "modifiers": [
                  "left"
                ],
                      "children": [
                        {
                          "component": "text",
                          "modifiers": [
                      "heading"
                    ],
                          "content": "{{{locale.article1-heading-text}}}"
                  },
                        {
                          "component": "text",
                          "modifiers": [],
                          "content": "{{{locale.article1-text}}}"
                  }
                ]
              },
                    {
                      "component": "col",
                      "width": "40%",
                      "modifiers": [
                  "right"
                ],
                      "children": [
                        {
                          "component": "image"
                  }
                ]
              }
            ]
          },
                {
                  "component": "layout",
                  "modifiers": [
              "feature"
            ],
                  "children": [
                    {
                      "component": "col",
                      "width": "60%",
                      "modifiers": [
                  "left"
                ],
                      "children": [
                        {
                          "component": "text",
                          "modifiers": [
                      "heading"
                    ],
                          "content": "{{{locale.article2-heading-text}}}"
                  },
                        {
                          "component": "text",
                          "modifiers": [],
                          "content": "{{{locale.article2-text}}}"
                  }
                ]
              },
                    {
                      "component": "col",
                      "width": "40%",
                      "modifiers": [
                  "right"
                ],
                      "children": [
                        {
                          "component": "image"
                  }
                ]
              }
            ]
          },
                {
                  "component": "layout",
                  "modifiers": [],
                  "children": [
                    {
                      "component": "col",
                      "width": "50%",
                      "modifiers": [
                  "left"
                ],
                      "children": [
                        {
                          "component": "image"
                  },
                        {
                          "component": "text",
                          "modifiers": [],
                          "content": "{{{locale.article1-text}}}"
                  }
                ]
              },
                    {
                      "component": "col",
                      "width": "50%",
                      "modifiers": [
                  "right"
                ],
                      "children": [
                        {
                          "component": "image"
                  },
                        {
                          "component": "text",
                          "modifiers": [],
                          "content": "{{{locale.article1-text}}}"
                  }
                ]
              }
            ]
          },
                {
                  "component": "layout-border",
                  "modifiers": [
              "coupon"
            ],
                  "children": [
                    {
                      "component": "col",
                      "width": "50%",
                      "modifiers": [
                  "left"
                ],
                      "children": [
                        {
                          "component": "text",
                          "modifiers": [
                      "headline",
                      "center"
                    ],
                          "content": "{{{locale.coupon-heading}}}"
                  },
                        {
                          "component": "text",
                          "modifiers": [
                      "center"
                    ],
                          "content": "{{{locale.coupon-subheading}}}"
                  }
                ]
              },
                    {
                      "component": "col",
                      "width": "50%",
                      "modifiers": [
                  "right"
                ],
                      "children": [
                        {
                          "component": "text",
                          "modifiers": [
                      "center"
                    ],
                          "content": "{{{locale.coupon-text}}}"
                  },
                        {
                          "component": "button",
                          "content": "{{{locale.coupon-button}}}"
                  }
                ]
              }
            ]
          }
        ]
            }
          }
        }
      });
    });
  }
  save(document) {
    return new Promise(function (resolve) {
      resolve({
        fake: true
      });
    });
  }
  saveIncremental(documentId, fragment) {
    return new Promise(function (resolve) {
      resolve({
        fake: true
      });
    });
  }
}

export default DocumentService;
