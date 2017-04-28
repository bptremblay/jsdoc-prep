/**
 * @module position
 * @requires ./jquery
 */
import jquery from './jquery';
const BUFFER = 40;
const ABOVE = 'above';
const BELOW = 'below';
const RIGHT = 'right';
const LEFT = 'left';
const OVER = 'over';
/*
 * Normalized rectangle object dimension and position info
 *
 * @constructor
 * @param {Number} width
 * @param {Number} height
 * @param {Number} top
 * @param {Number} left
 * @param {Number} scrollTop
 * @param {Number} scrollLeft
 * @param {Number} scrollWidth
 * @param {Number} scrollHeight
 * @return {Object} normalized properties
 */
/**
 * The class PositionInfo.
 */
class PositionInfo {
  /**
   * @param width  
   * @param height  
   * @param top  
   * @param left  
   * @param scrollTop  
   * @param scrollLeft  
   * @param scrollWidth  
   * @param scrollHeight
   */
  constructor(width, height, top, left, scrollTop, scrollLeft, scrollWidth, scrollHeight) {
      this.width = width;
      this.height = height;
      this.top = top;
      this.left = left;
      this.scrollTop = scrollTop;
      this.scrollLeft = scrollLeft;
      this.scrollWidth = scrollWidth;
      this.scrollHeight = scrollHeight;
    }
    /**
     * @function
     */
  toJSON() {
    let data = {};
    data.left = this.left;
    data.top = this.top;
    data.width = this.width;
    data.height = this.height;
    return JSON.stringify(data, null, 2);
  }
}
/**
 * The class Position.
 */
class Position {
  /*
   * Accepts rectangle object positions for objects to be positioned around another
   * object within a given space and returns the top and left position for the object and a string 'position'
   *
   * @param {PositionInfo} positioned - The square to be positioned
   * @param {PositionInfo} fixed - The fixed square the positioned object will be calculated around
   * @param {PositionInfo} bounds - The container positioned and fixed are positioned within,
   *   whose scroll offsets will be accounted for
   * @return {Object} An object with properties top {Number}, left {Number},
   *   pos {string ('above', 'below', 'left', 'right')}
   */
  /**
   * @param positioned  
   * @param fixed  
   * @param bounds  
   * @param customOffset  
   * @param preferredPosition
   */
  getAvailablePerimeterPosition(positioned, fixed, bounds, customOffset, preferredPosition) {
    if (preferredPosition == null) {
      preferredPosition = ABOVE;
    }
    let ptop = positioned.top;
    let pleft = positioned.left;
    let pwidth = positioned.width;
    let pheight = positioned.height;
    let isFunc = jQuery.isFunction(customOffset);
    /**
     * @param theDimension  
     * @param thePos
     */
    let getAdjustedDimension = function (theDimension, thePos) {
      if (isFunc) {
        return theDimension + customOffset(thePos);
      } else {
        return theDimension + customOffset;
      }
    };
    let adjustedHeight = {
      above: getAdjustedDimension(pheight, ABOVE),
      below: getAdjustedDimension(pheight, BELOW)
    };
    let adjustedWidth = {
      right: getAdjustedDimension(pwidth, RIGHT),
      left: getAdjustedDimension(pwidth, LEFT)
    };
    let {
      top
    } = fixed;
    let {
      left
    } = fixed;
    let {
      width
    } = fixed;
    let {
      height
    } = fixed;
    let hCenter = parseInt((width / 2) - (pwidth / 2), 10);
    let vCenter = parseInt((height / 2) - (pheight / 2), 10);
    let aboveTop = parseInt(top - pheight, 10);
    let aboveLeft = parseInt(left + hCenter, 10);
    let belowTop = parseInt(top + height, 10);
    let belowLeft = parseInt(left + hCenter, 10);
    let leftTop = parseInt(top + vCenter, 10);
    let leftLeft = parseInt(left - pwidth, 10);
    let rightTop = parseInt(top + vCenter, 10);
    let rightLeft = parseInt(left + width, 10);
    let hasHorizontalSpace = (aboveLeft >= bounds.scrollLeft) && ((aboveLeft + pwidth) <= (bounds.scrollLeft + bounds.width));
    let canBeAbove = ((top - bounds.scrollTop) >= adjustedHeight.above) && hasHorizontalSpace;
    let canBeBelow = (((bounds.height + bounds.scrollTop) - (top + height)) >= adjustedHeight.below) && hasHorizontalSpace;
    let canBeLeft = (left - bounds.scrollLeft) >= adjustedWidth.left;
    let canBeRight = ((bounds.width + bounds.scrollLeft) - (left + width)) >= adjustedWidth.right;
    let positions = [];
    if (canBeAbove) {
      positions.push({
        pos: ABOVE,
        top: aboveTop,
        left: aboveLeft
      });
    }
    if (canBeBelow) {
      positions.push({
        pos: BELOW,
        top: belowTop,
        left: belowLeft
      });
    }
    if (canBeLeft) {
      positions.push({
        pos: LEFT,
        top: leftTop,
        left: leftLeft
      });
    }
    if (canBeRight) {
      positions.push({
        pos: RIGHT,
        top: rightTop,
        left: rightLeft
      });
    }
    if (!positions.length) {
      positions.push({
        pos: OVER,
        top: top + vCenter,
        left: left + hCenter
      });
    }
    let currentPositionIsValid = (theTop, theLeft) => (Math.abs(theTop - ptop) < BUFFER) && (Math.abs(theLeft - pleft) < BUFFER);
    jQuery.each(positions, function (idx, pos) {
      pos.top = parseInt(pos.top, 10);
      pos.left = parseInt(pos.left, 10);
      if (currentPositionIsValid(pos.top, pos.left) || (pos.pos === preferredPosition)) {
        return positions = [pos];
      }
    });
    return positions[0];
  }
}
export default {
  Position,
  PositionInfo
};