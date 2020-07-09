Ext.define('criterion.view.payroll.Toolbar', function() {

    var ROUTES = criterion.consts.Route,
        PAYROLL = ROUTES.PAYROLL;

    return {
        alias : 'widget.criterion_payroll_toolbar',

        extend : 'criterion.view.ModuleToolbar',

        moduleId : PAYROLL.MAIN,
        moduleName : i18n.gettext('Payroll'),

        plugins : [
            {
                ptype : 'criterion_security_items',
                secureByDefault : true
            },
            {
                ptype : 'criterion_lazyitems',
                items : [
                    {
                        text : i18n.gettext('Employees'),
                        reference : 'employees',
                        toggleGroup : 'payroll-mainmenu',
                        href : ROUTES.getDirect(PAYROLL.EMPLOYEES),
                        cls : 'criterion-moduletoolbar-btn-primary',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE, criterion.SecurityManager.READ)
                    },
                    {
                        text : i18n.gettext('Payroll'),
                        reference : 'payroll',
                        href : ROUTES.getDirect(PAYROLL.PAYROLL),
                        toggleGroup : 'payroll-mainmenu',
                        cls : 'criterion-moduletoolbar-btn-primary',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH, criterion.SecurityManager.READ)
                    },
                    {
                        text : i18n.gettext('Pay Processing'),
                        reference : 'payProcessing',
                        href : ROUTES.getDirect(PAYROLL.PAY_PROCESSING),
                        toggleGroup : 'payroll-mainmenu',
                        cls : 'criterion-moduletoolbar-btn-primary',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.PAY_PROCESSING, criterion.SecurityManager.READ)
                    },
                    {
                        text : i18n.gettext('Reports'),
                        reference : 'reports',
                        href : ROUTES.getDirect(PAYROLL.REPORTS.MAIN),
                        toggleGroup : 'payroll-mainmenu',
                        cls : 'criterion-moduletoolbar-btn-primary',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.REPORTS, criterion.SecurityManager.READ)
                    },
                    '->',
                    {
                        xtype : 'criterion_moduletoolbar_support'
                    },
                    {
                        xtype : 'criterion_moduletoolbar_settings',
                        href : ROUTES.getDirect(PAYROLL.MAIN + '/' + PAYROLL.SETTINGS.MAIN),
                        toggleGroup : 'payroll-mainmenu',
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
