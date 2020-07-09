Ext.define('criterion.view.hr.Toolbar', function() {

    var ROUTES = criterion.consts.Route,
        HR = ROUTES.HR;

    return {
        alias : 'widget.criterion_hr_toolbar',

        extend : 'criterion.view.ModuleToolbar',

        moduleId : HR.MAIN,
        moduleName : i18n.gettext('HR'),

        plugins : [
            {
                ptype : 'criterion_security_items',
                secureByDefault : true
            },
            {
                ptype : 'criterion_lazyitems',
                items : [
                    {
                        text : i18n.gettext('Dashboard'),
                        reference : 'dashboard',
                        href : ROUTES.getDirect(HR.DASHBOARD),
                        toggleGroup : 'hr-mainmenu',
                        cls : 'criterion-moduletoolbar-btn-primary',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.DASHBOARD, criterion.SecurityManager.READ)
                    },
                    {
                        text : i18n.gettext('Employees'),
                        reference : 'employees',
                        href : ROUTES.getDirect(HR.EMPLOYEES),
                        toggleGroup : 'hr-mainmenu',
                        cls : 'criterion-moduletoolbar-btn-primary',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE, criterion.SecurityManager.READ)
                    },
                    {
                        text : i18n.gettext('Positions'),
                        reference : 'positions',
                        href : ROUTES.getDirect(HR.POSITIONS),
                        toggleGroup : 'hr-mainmenu',
                        cls : 'criterion-moduletoolbar-btn-primary',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.POSITION, criterion.SecurityManager.READ)
                    },
                    {
                        text : i18n.gettext('Organization'),
                        reference : 'organization',
                        href : ROUTES.getDirect(HR.ORGANIZATION),
                        toggleGroup : 'hr-mainmenu',
                        cls : 'criterion-moduletoolbar-btn-primary',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.ORGANIZATION, criterion.SecurityManager.READ)
                    },
                    {
                        text : i18n.gettext('Reports'),
                        reference : 'reports',
                        href : ROUTES.getDirect(HR.REPORTS.MAIN),
                        toggleGroup : 'hr-mainmenu',
                        cls : 'criterion-moduletoolbar-btn-primary',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.REPORTS, criterion.SecurityManager.READ)
                    },
                    '->',
                    {
                        xtype : 'criterion_moduletoolbar_support'
                    },
                    {
                        xtype : 'criterion_moduletoolbar_settings',
                        href : ROUTES.getDirect(HR.MAIN + '/' + HR.SETTINGS.MAIN),
                        toggleGroup : 'hr-mainmenu',
                        securityAccess : function() {
                            var SM = criterion.SecurityManager,
                                READ = SM.READ;

                            return SM.getSecurityHRAccessFn(SM.HR_KEYS.SETTINGS_HRADMIN, READ)()
                                || SM.getSecurityHRAccessFn(SM.HR_KEYS.SETTINGS_PAYADMIN, READ)()
                                || SM.getSecurityHRAccessFn(SM.HR_KEYS.SETTINGS_RECADMIN, READ)()
                                || SM.getSecurityHRAccessFn(SM.HR_KEYS.SETTINGS_SCHEDADMIN, READ)()
                                || SM.getSecurityHRAccessFn(SM.HR_KEYS.SETTINGS_GEN, READ)()
                                || SM.getSecurityHRAccessFn(SM.HR_KEYS.SETTINGS_LEARNMAN, READ)()
                                || SM.getSecurityHRAccessFn(SM.HR_KEYS.SETTINGS_PERF, READ)()
                                || SM.getSecurityHRAccessFn(SM.HR_KEYS.SETTINGS_ENGAGE, READ)()
                                || SM.getSecurityHRAccessFn(SM.HR_KEYS.SYSTEM_CONFIGURATION, READ)()
                        }
                    }
                ]
            }
        ]

    };
});
