  define [
    'jquery'
  ], ($) ->
    # TODO: This should be removed in favor of jasmine jquery
    ->
      if $('#galileo').length is 0
        $('body').append '<div id="galileo"></div>'
      for: (editor) ->
        wrapper = $("##{editor}-wrapper")
        if wrapper.length is 0
          wrapper = $("<div id='#{editor}-wrapper' class='clearfix'></div>")
          $('#galileo').append wrapper
        wrapper


