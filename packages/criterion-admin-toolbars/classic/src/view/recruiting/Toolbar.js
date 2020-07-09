Ext.define('criterion.view.recruiting.Toolbar', function() {

    var ROUTES = criterion.consts.Route,
        RECRUITING = ROUTES.RECRUITING;

    return {
        alias : 'widget.criterion_recruiting_toolbar',

        extend : 'criterion.view.ModuleToolbar',

        moduleId : RECRUITING.MAIN,
        moduleName : i18n.gettext('Recruiting'),

        plugins : [
            {
                ptype : 'criterion_security_items',
                secureByDefault : true
            },
            {
                ptype : 'criterion_lazyitems',
                items : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Jobs'),
                        reference : 'jobs',
                        href : ROUTES.getDirect(RECRUITING.JOBS),
                        toggleGroup : 'recruiting-mainmenu',
                        cls : 'criterion-moduletoolbar-btn-primary',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_JOB, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Candidates'),
                        reference : 'candidates',
                        href : ROUTES.getDirect(RECRUITING.CANDIDATES),
                        toggleGroup : 'recruiting-mainmenu',
                        cls : 'criterion-moduletoolbar-btn-primary',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE, criterion.SecurityManager.READ)
                    },
                    {
                        text : i18n.gettext('Positions'),
                        reference : 'positions',
                        href : ROUTES.getDirect(RECRUITING.POSITIONS),
                        toggleGroup : 'recruiting-mainmenu',
                        cls : 'criterion-moduletoolbar-btn-primary',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.POSITION, criterion.SecurityManager.READ)
                    },
                    {
                        text : i18n.gettext('Reports'),
                        reference : 'reports',
                        href : ROUTES.getDirect(RECRUITING.REPORTS.MAIN),
                        toggleGroup : 'recruiting-mainmenu',
                        cls : 'criterion-moduletoolbar-btn-primary',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.REPORTS, criterion.SecurityManager.READ)
                    },
                    '->',
                    {
                        xtype : 'criterion_moduletoolbar_support'
                    },
                    {
                        xtype : 'criterion_moduletoolbar_settings',
                        href : ROUTES.getDirect(RECRUITING.MAIN + '/' + RECRUITING.SETTINGS.MAIN),
                        toggleGroup : 'recruiting-mainmenu',
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
