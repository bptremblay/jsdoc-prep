/**
 * @module position-affix-jquery
 * @requires ./jquery
 * @requires ./position
 * @requires ./function
 */
import $ from './jquery';
import PositionLib from './position';
import FunctionUtils from './function';
const {
  PositionInfo
} = PositionLib;
let config = {
  $container: $(window),
  $target: $('body'),
  toolbarEl: '#g-main-toolbar',
  offset: 0,
  events: 'scroll resize'
};
let initialized = false;
const $document = $(document);
const {
  debounce
} = FunctionUtils;
/**
 * @param $elem  
 * @return {Object} NewExpression
 */
function getPositionInfo($elem) {
  const isWindow = $elem[0] === window;
  const offsets = isWindow ? $('body').offset() : $elem.offset();
  const scrollTop = $elem.scrollTop();
  const scrollLeft = $elem.scrollLeft();
  const {
    top
  } = offsets;
  const {
    left
  } = offsets;
  const width = $elem.outerWidth(true);
  const height = $elem.outerHeight(true);
  const scrollWidth = isWindow ? $document.width() : $elem.prop('scrollWidth');
  const scrollHeight = isWindow ? $document.height() : $elem.prop('scrollHeight');
  return new PositionInfo(
    width,
    height,
    top,
    left,
    scrollTop,
    scrollLeft,
    scrollWidth,
    scrollHeight
  );
}
/**
 * @param theDimension  
 * @param thePos  
 * @param undefined  
 * @param undefined  
 * @return {Object} ConditionalExpression
 */
function applyCustomOffset(theDimension, thePos, negative = false, customOffset = config.offset) {
  let offset;
  if (typeof customOffset === 'function') {
    offset = customOffset(thePos);
  } else {
    offset = customOffset;
  }
  return negative ? theDimension - offset : theDimension + offset;
}
/**
 * @param $this
 */
function getPosition($this) {
  const ABOVE = 'above';
  const OVER = 'over';
  const HIDDEN = 'hidden';
  const MAIN_BAR_BOTTOM = 118;
  const elementPosition = getPositionInfo($this);
  const targetPosition = getPositionInfo(config.$target);
  const containerPosition = getPositionInfo(config.$container);
  const toolbarPosition = config.$toolbar.length ? config.$toolbar.position().top + config.$toolbar.outerHeight() : MAIN_BAR_BOTTOM;
  const horizontalCenter = parseInt((targetPosition.width / 2) - (elementPosition.width / 2), 10);
  const adjustedHeight = applyCustomOffset(elementPosition.height, ABOVE);
  const leftPosition = targetPosition.left + horizontalCenter;
  const canBeAbove = targetPosition.top - adjustedHeight > containerPosition.scrollTop + toolbarPosition;
  let shouldBeHidden = containerPosition.scrollTop > (targetPosition.top + targetPosition.height - toolbarPosition);
  let position;
  if (canBeAbove) {
    position = {
      pos: ABOVE,
      top: applyCustomOffset(targetPosition.top - elementPosition.height - $this.parent().offset().top,
        ABOVE, true),
      left: leftPosition,
    };
  } else if (shouldBeHidden) {
    position = {
      pos: 'HIDDEN',
      top: toolbarPosition,
      left: leftPosition,
    };
  } else {
    position = {
      pos: OVER,
      top: toolbarPosition,
      left: leftPosition,
    };
  }
  return position;
}
/**
 * @param $this
 */
function applyPosition($this) {
  if (!$this.length) {
    return {};
  }
  if ($this.css('display') === 'none') {
    return {};
  }
  const newPosition = getPosition($this);
  $this.removeClass('over above hidden');
  $this.addClass(newPosition.pos);
  $this.css(newPosition);
  const elementPosition = getPositionInfo($this);
  if (typeof config.onUpdate === 'function') {
    config.onUpdate();
  }
  return newPosition;
}
const onUpdate = debounce(applyPosition, 10);
const methods = {
  /**
   * @param opts  
   * @return {Object} ThisExpression
   */
  init(opts) {
    config = $.extend(config, opts);
    config.$container.bind(config.events, () => onUpdate(this));
    config.$toolbar = $(config.toolbarEl);
    initialized = true;
    return this;
  },
  /**
   * @return {Object} ThisExpression
   */
  update() {
    applyPosition(this);
    return this;
  },
  /**
   * @param $elem  
   * @return {Object} ThisExpression
   */
  updateTarget($elem) {
    config.$target = $elem;
    applyPosition(this);
    return this;
  }
};
/**
 * @param method  
 * @param {...*} args
 */
$.fn.positionAffix = function positionAffix(method, ...args) {
  let returnMethod;
  if (methods[method]) {
    if (!initialized) {
      $.error('not initialized');
    }
    returnMethod = methods[method].apply(this, Array.prototype.slice.call([method, ...args], 1));
  } else if (typeof method === 'object' || !method) {
    returnMethod = methods.init.apply(this, [method, ...args]);
  } else {
    returnMethod = $.error('Missing method in positionAffix plugin');
  }
  return returnMethod;
};
$.fn.positionAffix.getPositionInfo = getPositionInfo;
export default $.fn.positionAffix;