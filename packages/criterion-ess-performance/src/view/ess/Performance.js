Ext.define('criterion.view.ess.Performance', function() {

    return {
        alias : 'widget.criterion_selfservice_performance',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.ess.Performance',
            'criterion.view.ess.performance.JournalEntry',
            'criterion.view.ess.performance.TeamJournals',
            'criterion.view.ess.performance.MyJournals',
            'criterion.view.ess.performance.Reviews',
            'criterion.view.ess.performance.TeamReviews',
            'criterion.view.ess.performance.MyGoals',
            'criterion.store.employee.orgChart.AllStructures'
        ],

        controller : {
            type : 'criterion_selfservice_performance'
        },

        viewModel : {
            stores : {
                orgChartAllStructures : {
                    type : 'criterion_employee_orgchart_all_structures'
                }
            }
        },

        showHeaders : true,

        layout : {
            type : 'card',
            deferredRender : true
        },

        defaults : {
            frame : true
        },

        plugins : [
            {
                ptype : 'criterion_security_items'
            },
            {
                ptype : 'criterion_lazyitems',
                items : [
                    {
                        xtype : 'criterion_selfservice_performance_reviews',
                        itemId : 'reviews',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.REVIEWS)
                    },
                    {
                        xtype : 'criterion_selfservice_journal_entry',
                        itemId : 'journalEntry',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.JOURNAL_ENTRY),
                        frame : false
                    },
                    {
                        xtype : 'criterion_selfservice_team_journals',
                        itemId : 'teamJournals',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.TEAM_JOURNALS),
                        frame : false
                    },
                    {
                        xtype : 'criterion_selfservice_my_journals',
                        itemId : 'myJournals',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.MY_JOURNALS)
                    },
                    {
                        xtype : 'criterion_selfservice_performance_team_reviews',
                        itemId : 'teamReviews',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.TEAM_REVIEWS)
                    },
                    {
                        xtype : 'criterion_selfservice_performance_my_goals',
                        itemId : 'myGoals',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.MY_GOALS)
                    },
                    {
                        xtype : 'criterion_selfservice_performance_team_goals',
                        itemId : 'teamGoals',
                        securityAccess : criterion.SecurityManager.getSecurityESSAccessFn(criterion.SecurityManager.ESS_KEYS.TEAM_GOALS)
                    }
                ]
            }
        ]
    }
});
