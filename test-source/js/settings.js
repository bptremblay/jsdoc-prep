define(function() {
    return {
        'defaultAuthSiteId': 'C30',
        'authLOB': 'RBGLogon',
        'logonUrl': '/logon',
        'smartAdminStyle1': envConfig.ASSETS_INDEX + 'css/smartadmin-production_unminified.css',
        'smartAdminStyle2': envConfig.ASSETS_INDEX + 'css/smartadmin-skins.css',
        'rememberMeCookieName': '_tmprememberme',
        'usernameCookieName': '_rememberme',
		'maxLoginFailureCount': 5,
		'maxLoginFailureCode': 'loc'
    };
});
