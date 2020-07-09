Ext.define('criterion.view.scheduling.Toolbar', function() {

    var ROUTES = criterion.consts.Route,
        SCHEDULING = ROUTES.SCHEDULING;

    return {
        alias : 'widget.criterion_scheduling_toolbar',

        extend : 'criterion.view.ModuleToolbar',

        moduleId : SCHEDULING.MAIN,
        moduleName : i18n.gettext('Scheduling'),

        plugins : [
            {
                ptype : 'criterion_security_items',
                secureByDefault : true
            },
            {
                ptype : 'criterion_lazyitems',
                items : [
                    {
                        text : i18n.gettext('Shift'),
                        reference : 'shift',
                        href : ROUTES.getDirect(SCHEDULING.SHIFT),
                        toggleGroup : 'scheduling-mainmenu',
                        cls : 'criterion-moduletoolbar-btn-primary',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.SCHEDULING_SHIFT, criterion.SecurityManager.READ)
                    },
                    {
                        text : i18n.gettext('Assignments'),
                        reference : 'assignment',
                        href : ROUTES.getDirect(SCHEDULING.ASSIGNMENT),
                        toggleGroup : 'scheduling-mainmenu',
                        cls : 'criterion-moduletoolbar-btn-primary',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.SCHEDULING_ASSIGNMENT, criterion.SecurityManager.READ)
                    },
                    {
                        text : i18n.gettext('Population'),
                        reference : 'population',
                        href : ROUTES.getDirect(SCHEDULING.POPULATION),
                        toggleGroup : 'scheduling-mainmenu',
                        cls : 'criterion-moduletoolbar-btn-primary',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.SCHEDULING_POPULATION, criterion.SecurityManager.READ)
                    },
                    {
                        text : i18n.gettext('Reports'),
                        reference : 'reports',
                        href : ROUTES.getDirect(SCHEDULING.REPORTS.MAIN),
                        toggleGroup : 'scheduling-mainmenu',
                        cls : 'criterion-moduletoolbar-btn-primary',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.REPORTS, criterion.SecurityManager.READ)
                    },
                    '->',
                    {
                        xtype : 'criterion_moduletoolbar_support'
                    },
                    {
                        xtype : 'criterion_moduletoolbar_settings',
                        href : ROUTES.getDirect(SCHEDULING.MAIN + '/' + SCHEDULING.SETTINGS.MAIN),
                        toggleGroup : 'scheduling-mainmenu',
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
