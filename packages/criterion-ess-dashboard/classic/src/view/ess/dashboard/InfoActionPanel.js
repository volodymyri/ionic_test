Ext.define('criterion.view.ess.dashboard.InfoActionPanel', function() {

    return {

        extend : 'Ext.container.Container',

        alias : 'widget.criterion_selfservice_dashboard_info_action_panel',

        requires : [
            'criterion.controller.ess.dashboard.InfoActionPanel',
            'criterion.view.ess.dashboard.infoActionPanel.*',
            'criterion.store.workflowLogs.PendingLogs',
            'criterion.store.dashboard.OnboardingTasks',
            'criterion.store.employee.TimeOffPlanActive',
            'criterion.store.employer.EssLinks'
        ],

        cls : 'criterion-selfservice-dashboard-info-action-panel',

        controller : {
            type : 'criterion_selfservice_dashboard_info_action_panel'
        },

        layout : 'vbox',

        viewModel : {
            data : {
                myTaskCount : 0,
                showEssLinks : false
            },

            stores : {
                onboardingTasks : {
                    type : 'criterion_dashboard_onboarding_tasks'
                },
                timeOffs : {
                    type : 'criterion_employee_time_off_plans_active'
                },
                essLinks : {
                    type : 'criterion_employer_ess_links'
                }
            }
        },

        items : [
            {
                xtype : 'criterion_selfservice_dashboard_info_action_panel_tasks',
                reference : 'myTasks',
                margin : '5 0 12 0',
                hidden : true,
                bind : {
                    hidden : '{!myTasksEnabled}'
                }
            },
            {
                xtype : 'criterion_selfservice_dashboard_info_action_panel_time_off',
                reference : 'timeOff',
                margin : '0 0 12 0',
                hidden : true,
                bind : {
                    hidden : '{!myTimeOffsEnabled}'
                }
            },
            {
                xtype : 'criterion_selfservice_dashboard_info_action_panel_external_links',
                reference : 'externalLinks',
                hidden : true,
                bind : {
                    hidden : '{!linksEnabled}'
                }
            }
        ],

        setCls : function(cls) {
            this.addCls(cls);
        }
    }

});
