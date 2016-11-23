define [
  'backbone'
], (Backbone) ->

  class ButtonEditorModel extends Backbone.Model
    defaults:
      linkWasTested: false
      doneWasClicked: false
    doneWasClicked: (val) ->
      if val?
        @set 'doneWasClicked', val
      else
        @get 'doneWasClicked'
    linkWasTested: (val) ->
      if val?
        @set 'linkWasTested', val
      else
        @get 'linkWasTested'


