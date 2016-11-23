define [
  'jquery'
], ($) ->
  class LegacyColorCheck
    usesLegacyGlobalColors: ($markup) ->
      legacyStyleAttributeSelectors = [
        # After Init Dom Node Markup
        '[data-style-background-color]'
        '[data-style-color]'
        # On Import Markup
        '[color]'
        '[background-color]'
      ]
      match = false
      for selector in legacyStyleAttributeSelectors
        if $markup.is(selector) or $markup.find(selector).length > 0
          match = true
          break
      match
  new LegacyColorCheck
