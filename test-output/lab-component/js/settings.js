define(function() {
  return {
    'logonUrl': '/logon',
    'dashboardUrl': '/dashboard',
    'dashboardSetScenario': '/dashboard/scenario/index/',
    'authTargetSeriveUrl': '/svc/wl/auth/accept',
    'authSiteId': 'MON',
    'authContextId': 'login',
    'authResponseType': 'json',
    'authDeviceId': '',
    'authTokenCode': '',
    'authNextTokenCode': '',
    'authExternalData': '',
    'authDeviceSignature': {
      'navigator': {
        'platform': 'Win32',
        'userAgent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:17.0) Gecko/20100101 Firefox/17.0',
        'appName': 'Netscape',
        'appCodeName': 'Mozilla',
        'appVersion': '5.0 (Windows)',
        'language': 'en-US',
        'oscpu': 'Windows NT 6.1; WOW64',
        'vendor': '',
        'vendorSub': '',
        'product': 'Gecko',
        'productSub': '20100101',
        'cookieEnabled': true,
        'onLine': true,
        'buildID': '20130307074601',
        'doNotTrack': 'unspecified'
      },
      'plugins': [{
        'name': 'Adobe Acrobat Plugin',
        'version': '10.1.4'
      }, {
        'name': 'Macromedia Director',
        'version': '12.0'
      }, {
        'name': 'Macromedia Shockwave Flash',
        'version': '13.0'
      }, {
        'name': 'Java Virtual Machine',
        'version': '1.6.0'
      }],
      'screen': {
        'availHeight': 1200,
        'availWidth': 1920,
        'colorDepth': 24,
        'height': 1200,
        'pixelDepth': 24,
        'width': 1920
      },
      'extra': {
        'javascript_ver': '2.0',
        'timezone': 300
      }
    },
    // 'smartAdminStyle1': envConfig.ASSETS_INDEX + 'css/smartadmin-production_unminified.css',
    // 'smartAdminStyle2': envConfig.ASSETS_INDEX + 'css/smartadmin-skins.css'
  };
});