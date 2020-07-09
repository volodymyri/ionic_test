Ext.define('criterion.view.Scheduling', function () {

    var ROUTES = criterion.consts.Route;

    return {
        extend : 'criterion.view.Module',

        alias : 'widget.criterion_scheduling',

        requires : [
            'criterion.view.scheduling.*',
            'criterion.view.Reports',
            'criterion.view.scheduling.Toolbar',
            'criterion.view.scheduling.Settings'
        ],

        controller : {
            type : 'criterion_module',
            baseCardToken : ROUTES.SCHEDULING.MAIN
        },

        tbar : {
            xtype : 'criterion_scheduling_toolbar'
        },

        layout : {
            type : 'card',
            deferredRender : true
        },

        title : i18n.gettext('Scheduling'),

        plugins : [
            {
                ptype : 'criterion_security_items',
                secureByDefault : true
            },
            {
                ptype : 'criterion_lazyitems',
                items : [
                    {
                        xtype : 'criterion_scheduling_shifts',
                        reference : 'shift',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.SCHEDULING_SHIFT, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_scheduling_assignments',
                        reference : 'assignment',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.SCHEDULING_ASSIGNMENT, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_scheduling_populations',
                        reference : 'population',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.SCHEDULING_POPULATION, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_reports',
                        title : i18n.gettext('Reports'),
                        reference : 'reports',
                        mainRoute : ROUTES.SCHEDULING.REPORTS,
                        controller : {
                            moduleId : criterion.Consts.REPORT_MODULE.SCHEDULING
                        },
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.REPORTS, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_settings',
                        reference : 'settings',
                        moduleId : ROUTES.SCHEDULING.MAIN
                    }
                ]
            }
        ]
    }
});
