module.exports = {
    has: {
        'cookies': true,
        'dom': true,
        'host-browser': true,
        'native-navigator': true,
        'xhr': true
    },
    logLevel: 1,
    'paths': {
        'blue': 'empty:',
        'common': 'empty:',
        'stately': 'empty:',
        'handlebars': 'empty:',
        'bluespec': 'blue-spec/dist/spec'
    },
    modules: [{
        name: 'logon/main',
        exclude: [
            // "blue"
        ],
        include: [
            'logon/config',
            'logon/main',
            'logon/settings',
            'logon/controller/scenario',
            'logon/controller/logon',
            'logon/controller/menu',
            'logon/controller/mfa',
            'logon/controller/passwordReset',
            'logon/component/logon',
            'logon/component/logonIdentification',
            'logon/component/logonPasswordReset',
            'logon/component/topMenu',
            'logon/shared/cookieManager',
            'logon/shared/authClientApi',
            'logon/shared/otpClient',
			'logon/shared/storeLens',
            'bluespec/logon',
            'bluespec/logon_identification',
            'bluespec/logon_password_reset',
            'logon/spec/topMenu',
            'logon/view/webspec/logon',
            'logon/view/webspec/logonIdentification',
            'logon/view/webspec/logonPasswordReset',
            'logon/view/webspec/topMenu',
            'logon/view/scenario',
            'logon/view/logon',
            'logon/view/mfa',
            'logon/view/mfaOptions',
            'logon/view/mfaSubmit',
            'logon/view/logonPasswordReset',
            'logon/view/menu',
            'logon/view/success', /* Temporary landing page */
        ]
    }]
};
