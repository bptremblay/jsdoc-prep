export default {
  triggerRemoveBlock(layoutEditor, eventChannel, name) {
    const layoutInstanceId = layoutEditor._getInstanceId();
    eventChannel.trigger('remove-block', layoutInstanceId, name);
  }
};

