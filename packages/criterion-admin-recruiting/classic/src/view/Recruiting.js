Ext.define('criterion.view.Recruiting', function() {

    var ROUTES = criterion.consts.Route,
        RECRUITING = ROUTES.RECRUITING;

    return {
        alias : 'widget.criterion_recruiting',

        extend : 'criterion.view.Module',

        requires : [
            'criterion.view.recruiting.Jobs',
            'criterion.view.recruiting.Candidates',
            'criterion.view.common.Positions',
            'criterion.view.Reports',
            'criterion.view.recruiting.Settings',
            'criterion.view.recruiting.Toolbar',
            'criterion.view.Help'
        ],

        controller : {
            type : 'criterion_module',
            baseCardToken : RECRUITING.MAIN
        },

        tbar : {
            xtype : 'criterion_recruiting_toolbar'
        },

        layout : {
            type : 'card',
            deferredRender : true
        },

        title : i18n.gettext('Recruiting'),

        plugins : [
            {
                ptype : 'criterion_security_items',
                secureByDefault : true
            },
            {
                ptype : 'criterion_lazyitems',
                items : [
                    {
                        xtype : 'criterion_recruiting_jobs',
                        reference : 'jobs',
                        title : i18n.gettext('Jobs'),
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_JOB, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_recruiting_candidates',
                        reference : 'candidates',
                        title : i18n.gettext('Candidates'),
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_positions',
                        title : i18n.gettext('Positions'),
                        reference : 'positions',
                        positionsGridStateId : 'recruiting_positionsGrid',
                        mainRoute : criterion.consts.Route.RECRUITING.POSITIONS,
                        viewModel : {
                            data : {
                                hideAssignments : false
                            }
                        },
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.POSITION, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_reports',
                        title : i18n.gettext('Reports'),
                        reference : 'reports',
                        mainRoute : criterion.consts.Route.RECRUITING.REPORTS,
                        controller : {
                            moduleId : criterion.Consts.REPORT_MODULE.RECRUITING
                        },
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.REPORTS, criterion.SecurityManager.READ)
                    },
                    {
                        xtype : 'criterion_help',
                        reference : 'support'
                    },
                    {
                        xtype : 'criterion_settings',
                        reference : 'settings',
                        moduleId : RECRUITING.MAIN
                    }
                ]
            }
        ]
    }
});
