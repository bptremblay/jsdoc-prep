define(
  /**
   * @exports src/constants
   */
  function () {
    return /**@alias module:src/constants */ {
      TYPES: {
        LAYOUT: 'layout',
        BLOCK: 'block',
        IMAGE: 'image'
      },
      SELECTORS: {
        COLUMNS: '[data-layout-column]',
        BLOCKS: '[data-gl-layout-block]',
        CONTENT: '[data-editor-type]',
        PADDING_ELEMENT: '[data-gl-padding-element]',
        REMOVE_ON_PUBLISH: '[data-gl-remove-on-publish]',
        CONTENT_DECORATOR: '[data-gl-content-decorator]',
        NEST_CHILD_CONTENT: '[data-gl-nest-child-content]',
        IMAGE_CONTAINER: '.image-container'
      },
      DATA_ATTRS: {
        COLUMN: 'data-layout-column',
        BLOCK: 'data-gl-layout-block',
        CONTENT_DECORATOR: 'data-gl-content-decorator',
        PROTO_LAYOUT: 'data-gl-proto-layout',
        REMOVE_ON_PUBLISH: 'data-gl-remove-on-publish'
      },
      CLASSES: {
        COLUMN_DEFAULT: 'column',
        COLUMN_LEFT: 'column-left',
        COLUMN_RIGHT: 'column-right',
        CONTENT_VSPACE: 'editor-image-vspace-on'
      },
      CONTENT_VSPACE: {
        SUPPORT: ['image']
      },
      DRAG_DROP: {
        SETTINGS: {
          LAYOUT_PASSTHROUGH_PCT: 0.15,
          LAYOUT_PASSTHROUGH_CAP: 8,
          STACKING_PASSTHROUGH_PCT: 0.15
        },
        ACTIONS: {
          INSERT_BLOCK: 'insert-block',
          INSERT_COLUMN: 'insert-column',
          MOVE_BLOCK: 'move-block',
          MOVE_COLUMN: 'move-column',
          REORDER_BLOCK: 'reorder-block',
          REORDER_COLUMN: 'reorder-column',
          NULL: 'null'
        },
        DIRECTIONS: {
          LEFT: 'left',
          RIGHT: 'right',
          ABOVE: 'above',
          BELOW: 'below'
        }
      },
      COLUMN_WIDTH: {
        MAX_DECIMAL: 0.75,
        MIN_DECIMAL: 0.25,
        MAX_PERCENT: 75,
        MIN_PERCENT: 25,
        INTERVAL: 0.05
      },
      EVENTS: {
        TRACK_USAGE: 'track-usage',
        ADD_PLATFORM_ATTRIBUTES: 'add-platform-attributes',
        STATE_UPDATED: 'state-updated',
        STATE_REPLACED: 'state-replaced',
        EDITOR_STATE_UPDATED: 'editor-state-updated',
        DEACTIVATE_EDITOR: 'deactivate-editor',
        CONTENT_EDITOR_CREATED: 'content-editor-created',
        REMOVE_LAYOUT: 'remove-layout',
        LAYOUT_EMPTY: 'layout-empty',
        INSERT_COLUMN: 'insert-column',
        COLUMN_EMPTY: 'column-empty',
        INSERT_BLOCK: 'insert-block',
        INSERT_CHILD_CONTENT: 'insert-child-content',
        INSERT_CHILD_BLOCK: 'insert-child-block',
        REMOVE_BLOCK: 'remove-block',
        MOVE_COLUMN: 'move-column',
        MOVE_BLOCK: 'move-block',
        REORDER_COLUMN: 'reorder-column',
        REORDER_BLOCK: 'reorder-block',
        ADD_AT: 'add-at',
        REMOVE_FROM: 'remove-from',
        ELEMENT_CREATED: 'element-created',
        INSERT_DESCRIPTOR: 'insert-descriptor',
        CONTENT_INSERTED: 'content-inserted',
        CHILD_REMOVED: 'child-removed',
        CHILD_CREATED: 'child-created',
        LAYOUT_CHANGED: 'layout-changed',
        COLUMN_MOUSEOVER: 'column-mouseover',
        COLUMN_MOUSEOUT: 'column-mouseout',
        TOGGLE_CONTENT_VSPACE: 'toggle-content-vspace'
      },
      DOWNSTREAM_EVENTS: {
        INSERTED_INTO_BLOCK: 'inserted-into-block',
        INSERTED_INTO_BLOCK_AS_CHILD: 'inserted-into-block-as-child',
        INITIALIZE_AS_CHILD: 'initialize-as-child'
      }
    };
  });