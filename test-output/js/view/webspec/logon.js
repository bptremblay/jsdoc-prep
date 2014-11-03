define({
  name: 'LOGON',
  bindings: {
    'user_id': {
      type: 'TEXT',
      field: 'user_id',
      direction: 'BOTH'
    },
    'password': {
      type: 'PASSWORD',
      field: 'password',
      direction: 'BOTH'
    },
    'remember_my_user_id': {
      type: 'CHECKBOX',
      field: 'remember_my_user_id',
      direction: 'BOTH'
    }
  },
  triggers: {
    'logon_button': {
      type: 'BUTTON',
      action: 'logon_to_landing_page'
    },
    'remember_my_user_id': {
      type: 'CHECKBOX',
      action: 'select_remember_my_user_id'
    },
    'forgot_password': {
      type: 'ANCHOR',
      action: 'forgot_password',
      event: 'click'
    }
  }
});