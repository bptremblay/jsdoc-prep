/**
 * DataBinding
 * 
 * @module DataBinding
 */

define(
    'data-binding',
    [ 'logger', 'jquery' ],
    function(Logger, $, _, Backbone) {
      var _instance = null;

      function DataBinding() {
        DataBinding.prototype.dataBind = dataBind;
        DataBinding.prototype.renderDataBoundChanges = renderDataBoundChanges;
      }

      function dataBind(objectMap, map) {
        var sourceObject = objectMap.source;
        return function() {
          for ( var index = 0; index < map.length; index++) {
            var item = map[index];
            var propName = item.propName;
            var fieldName = item.fieldName;
            var componentId = item.componentId;
            var componentSelector = item.componentSelector;
            var redrawOnUpdate = item.redrawOnUpdate;
            var textTransform = item.textTransform;
            var value = null;

            if (sourceObject[propName] != null) {
              if (typeof sourceObject[propName] === 'function') {
                value = sourceObject[propName]();
              } else {
                value = sourceObject[propName];
              }
            } else if (typeof sourceObject['get'] === 'function') {
              value = sourceObject.get(propName);
            } else {
              Logger.warn("Could not get value of '" + propName + "'.");
            }

            if (textTransform != null) {
              if (typeof value === 'string'
                  || (typeof value === 'object' && value.length != null)) {
                value = transformText(value, textTransform);
              } else {
                Logger
                    .warn("textTransform field passed in with non-merge value");
              }
            }

            var targetComponent = null;

            if (componentSelector != null) {
              targetComponent = $(componentSelector);
            } else {
              targetComponent = objectMap[componentId];
            }

            var fieldPath = fieldName.split('.');

            var targetComponentField = targetComponent;
            fieldName = fieldPath.pop();

            for ( var pathWalker = 0; pathWalker < fieldPath.length; pathWalker++) {
              var pathChunk = fieldPath[pathWalker];

              if (pathChunk === 'el'
                  && (targetComponentField[pathChunk] == null)) {
                targetComponentField = targetComponentField[0];
              } else {
                targetComponentField = targetComponentField[pathChunk];
              }
            }

            if (redrawOnUpdate) {
              if (targetComponentField[fieldName] != null) {
                if (typeof targetComponentField[fieldName] === 'function') {
                  targetComponentField[fieldName](value);
                } else {
                  targetComponentField[fieldName] = value;
                }
              } else if (typeof targetComponentField['set'] === 'function') {
                targetComponentField.set(fieldName, value);
              } else {
                Logger.warn("Could not set value of '" + componentId + '.'
                    + fieldName + "' to " + value);
              }
            } else {
              var databoundChanges = $(targetComponent)
                  .data('databoundChanges');

              if (databoundChanges == null) {
                databoundChanges = {};
              }
              databoundChanges[item.fieldName] = value;
              $(targetComponent).data('databoundChanges', databoundChanges);
              // Logger.info("cached prop " + item.fieldName);
            }

            // propName
            // componentSelector
            // fieldName
            // options
            // componentPart
            // componentId
            // redrawOnUpdate
            // textTransform
          }
        };
      }

      function transformText(stringValues, template) {
        if (typeof stringValues === 'string') {
          var newArray = [];
          stringValues = [ stringValues ];
        }

        for ( var index = 0; index < stringValues.length; index++) {
          var templateExpression = "{" + index + "}";
          template = template.split(templateExpression);
          template = template.join(stringValues[index]);
        }
        return template;
      }

      function renderDataBoundChanges(component) {
        var databoundChanges = $(component).data('databoundChanges');

        if (databoundChanges != null) {
          for ( var fieldName in databoundChanges) {
            var value = databoundChanges[fieldName];

            var fieldPath = fieldName.split('.');

            var targetComponentField = component;
            fieldName = fieldPath.pop();

            for ( var pathWalker = 0; pathWalker < fieldPath.length; pathWalker++) {
              var pathChunk = fieldPath[pathWalker];

              if (pathChunk === 'el'
                  && (targetComponentField[pathChunk] == null)) {
                targetComponentField = targetComponentField[0];
              } else {
                targetComponentField = targetComponentField[pathChunk];
              }
            }

            if (targetComponentField[fieldName] != null) {
              if (typeof targetComponentField[fieldName] === 'function') {
                targetComponentField[fieldName](value);
              } else {
                targetComponentField[fieldName] = value;
              }
            } else if (typeof targetComponentField['set'] === 'function') {
              targetComponentField.set(fieldName, value);
            } else {
              Logger.warn("Could not set value of '" + componentId + '.'
                  + fieldName + "' to " + value);
            }
          }
        }
      }

      function quoteIfString(input) {
        if (typeof input === 'string') {
          return "'" + input + "'";
        } else if (typeof input === 'object' && input.length != null) {
          var output = [];

          for ( var index = 0; index < input.length; index++) {
            output[index] = quoteIfString(input[index]);
          }
          return output;
        }
        return input;
      }

      /**
       * Get instance.
       * 
       * @method _getInstance
       * @private
       */

      function _getInstance() {
        if (_instance === null) {
          _instance = new DataBinding();
        }
        window.DataBinding = _instance;
        return _instance;
      }

      return _getInstance();
    });