define({
  name: 'LOGON_USERID_FOUND',
  bindings: {
    'passwordoption': {
      type: 'RADIO',
      field: 'logon_options_id',
      direction: 'UPSTREAM'
    },
    'userid': {
      type: 'SELECT',
      field: 'user_id',
      direction: 'UPSTREAM'
    }
  },
  triggers: {
    'exit_reset_password': {
      type: 'BUTTON',
      action: 'exit_reset_password'
    },
    'next': {
      type: 'BUTTON',
      action: 'request_logon_identification_code'
    }
  }
});