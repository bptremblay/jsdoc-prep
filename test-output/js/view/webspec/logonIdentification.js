/**
 * @module js/view/webspec/logonIdentification
 */
define({
  name: 'LOGON_IDENTIFICATION',
  bindings: {},
  triggers: {
    'request_delivery_devices': {
      type: 'BUTTON',
      action: 'request_delivery_devices'
    },
    'exit_identification': {
      type: 'BUTTON',
      action: 'exit_identification'
    },
    'request_identification_advisory_message': {
      type: 'ANCHOR',
      action: 'request_identification_advisory_message',
      event: 'click'
    },
    'close_identification_advisory': {
      type: 'ANCHOR',
      action: 'close_identification_advisory',
      event: 'click'
    },
  }
});