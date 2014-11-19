define(function(require) {

    return function ProfileController() {
        /**
         * Function for default action
         * @function index
         * @memberOf module:ProfileController
         */
        var observable = require('blue/observable');

        this.init = function() {
            //initiate component container
            this.model = observable.Model.combine({
                'profileContainer': {},
                'profileLeftMenu': {
                    'navigation': [{
                        label: 'Personal Details',
                        divider: true,
                        active: false,
                        href: false,
                        hasNavLinks: false
                    }, {
                        label: 'The Basics',
                        divider: false,
                        active: true,
                        href: '#',
                        hasNavLinks: false,
                        domId: 'thebasics'
                    }, {
                        label: 'Phone',
                        divider: false,
                        active: false,
                        href: '#',
                        hasNavLinks: false,
                        domId: 'phone'
                    }, {
                        label: 'Email',
                        divider: false,
                        active: false,
                        href: false,
                        hasNavLinks: false
                    }, {
                        label: 'Mailing address',
                        divider: false,
                        active: false,
                        href: false,
                        hasNavLinks: false
                    }, {
                        label: 'My Settings',
                        divider: true,
                        active: false,
                        href: false,
                        hasNavLinks: false
                    }, {
                        label: 'Accounts',
                        divider: false,
                        active: false,
                        href: false,
                        hasNavLinks: false
                    }, {
                        label: 'Display',
                        divider: false,
                        active: false,
                        href: false,
                        hasNavLinks: false
                    }, {
                        label: 'Paperless',
                        divider: false,
                        active: false,
                        href: false,
                        hasNavLinks: false
                    }, {
                        label: 'Travel',
                        divider: false,
                        active: false,
                        href: false,
                        hasNavLinks: false
                    }, {
                        label: 'Alert Settings',
                        divider: false,
                        active: false,
                        href: false,
                        hasNavLinks: true
                    }, {
                        label: 'ATM',
                        divider: false,
                        active: false,
                        href: false,
                        hasNavLinks: false
                    }, {
                        label: 'External accounts',
                        divider: false,
                        active: false,
                        href: false,
                        hasNavLinks: false
                    }]
                },
                'profileTheBasics': {
                    personalFullname: {
                        value: 'Steve Warner',
                        disabled: true
                    },
                    personalFullnameNickname: {
                        value: 'Steve',
                        disabled: true
                    },
                    personalUserId: {
                        value: 'OkaySteve15',
                        disabled: true
                    },
                    personalPassword: {
                        value: '***********',
                        disabled: true
                    },
                    language: ''
                },
                'profilePhone': {
                    personalFullname: {
                        value: 'Steve Warner',
                        disabled: true
                    },
                    personalFullnameNickname: {
                        value: 'Steve',
                        disabled: true
                    },
                    personalUserId: {
                        value: 'OkaySteve15',
                        disabled: true
                    },
                    personalPassword: {
                        value: '***********',
                        disabled: true
                    },
                    language: ''
                }
            });
            this.profileMapper = {
                'PROFILECONTAINER': {
                    'spec': require('dashboard/spec/myProfile/profileContainer'),
                    'component': require('dashboard/component/myProfile/profileContainer'),
                    'view': 'myProfile/profileContainer'
                },
                'PROFILEMENU': {
                    'spec': require('dashboard/spec/myProfile/profileLeftMenu'),
                    'component': require('dashboard/component/myProfile/profileLeftMenu'),
                    'view': 'myProfile/profileLeftMenu'
                },
                'PROFILETHEBASICS': {
                    'spec': require('dashboard/spec/myProfile/profileTheBasics'),
                    'component': require('dashboard/component/myProfile/profileTheBasics'),
                    'view': 'myProfile/profileTheBasics'
                },
                'PROFILEPHONE': {
                    'spec': require('dashboard/spec/myProfile/profilePhone'),
                    'component': require('dashboard/component/myProfile/profilePhone'),
                    'view': 'myProfile/profilePhone'
                }
            };

            // register all components
            this.register.components(this, [{
                name: 'profileContainer',
                model: this.model.lens('profileContainer'),
                spec: this.profileMapper.PROFILECONTAINER.spec,
                methods: this.profileMapper.PROFILECONTAINER.component
            }, {
                name: 'profileLeftMenu',
                model: this.model.lens('profileLeftMenu'),
                spec: this.profileMapper.PROFILEMENU.spec,
                methods: this.profileMapper.PROFILEMENU.component
            }, {
                name: 'profileTheBasics',
                model: this.model.lens('profileTheBasics'),
                spec: this.profileMapper.PROFILETHEBASICS.spec,
                methods: this.profileMapper.PROFILETHEBASICS.component
            }, {
                name: 'profilePhone',
                model: this.model.lens('profilePhone'),
                spec: this.profileMapper.PROFILEPHONE.spec,
                methods: this.profileMapper.PROFILEPHONE.component
            }]);


        };

        this.index = function() {
            var componentCollection = [];

            componentCollection.push([this.components.profileContainer, this.profileMapper.PROFILECONTAINER.view, {
                'target': '#content',
                react: true
            }]);
            componentCollection.push([this.components.profileLeftMenu, this.profileMapper.PROFILEMENU.view, {
                'target': '#left-menu',
                react: true
            }]);
            // default
            componentCollection.push([this.components.profileTheBasics, this.profileMapper.PROFILETHEBASICS.view, {
                'target': '#main-content',
                react: true
            }]);

            this.appChannel.emit('setProfileHeader', {
                headerLabel: 'My Profile'
            });

            this.executeCAV(componentCollection);

        };

        this.setProfileContent = function(selection) {
            var navigationModel = this.model.get().profileLeftMenu.navigation;
            // activate the model selected
            navigationModel.forEach(function(itemObj) {
                if (itemObj.active === true) {
                    itemObj.active = false;
                }

                if (itemObj.domId && itemObj.domId === selection) {
                    itemObj.active = true;
                }
            });
            // update the profile left menu
            this.model.lens('profileLeftMenu.navigation').set(navigationModel);

            // paint the main container
            switch (selection) {
                case 'thebasics':
                    this.executeCAV([
                        [this.components.profileLeftMenu, this.profileMapper.PROFILEMENU.view, {
                            'target': '#left-menu',
                            react: true
                        }],
                        [this.components.profileTheBasics, this.profileMapper.PROFILETHEBASICS.view, {
                            'target': '#main-content',
                            react: true
                        }]
                    ]);
                    break;

                case 'phone':
                    this.executeCAV([
                        [this.components.profileLeftMenu, this.profileMapper.PROFILEMENU.view, {
                            'target': '#left-menu',
                            react: true
                        }],
                        [this.components.profilePhone, this.profileMapper.PROFILEPHONE.view, {
                            'target': '#main-content',
                            react: true
                        }]
                    ]);
                    break;
            }
        };
    };
});