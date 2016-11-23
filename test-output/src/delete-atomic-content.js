export default {
  /**
   * @param layoutEditor
   * @param eventChannel
   * @param name
   */
  triggerRemoveBlock(layoutEditor, eventChannel, name) {
    /**
     * The layout instance id.
     * @constant Layout instance id
     */
    const layoutInstanceId = layoutEditor._getInstanceId();
    eventChannel.trigger('remove-block', layoutInstanceId, name);
  }
};