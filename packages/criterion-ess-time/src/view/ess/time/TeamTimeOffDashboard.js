Ext.define('criterion.view.ess.time.TeamTimeOffDashboard', function() {

    return {

        alias : 'widget.criterion_selfservice_team_time_time_off_dashboard',

        extend : 'criterion.view.ess.time.TimeOffDashboard',

        requires : [
            'criterion.controller.ess.time.TeamTimeOffDashboard',
            'criterion.view.ess.time.dashboard.timeOffHistory.TimeOffList',
            'criterion.view.ess.time.dashboard.TimeOffCalendar',

            'criterion.controller.ess.time.dashboard.timeOffHistory.TimeOffList',
            'criterion.view.ess.time.timeOffHistory.TimeOffForm'
        ],

        controller : {
            type : 'criterion_selfservice_team_time_time_off_dashboard'
        },

        cls : 'criterion-selfservice-team-time-time-off-dashboard',

        initComponent() {
            let controller = this.getController();

            this.items = [
                {
                    xtype : 'criterion_selfservice_time_dashboard_time_off_history_time_off_list',
                    reference : 'history',
                    controller : {
                        type : 'criterion_selfservice_time_dashboard_time_off_history_time_off_list',
                        baseRoute : null,
                        showTitleInConnectedViewMode : true,
                        reloadAfterEditorSave : true,
                        reloadAfterEditorDelete : true,
                        editor : {
                            xtype : 'criterion_selfservice_time_time_off_history_time_off_form'
                        }
                    },
                    listeners : {
                        editorShow : () => controller.setOpacityEditorShow(),
                        editorDestroy : () => controller.setOpacityEditorDestroy()
                    }
                },
                {
                    xtype : 'criterion_selfservice_time_dashboard_time_off_calendar',
                    reference : 'calendar'
                },
                {
                    html : Ext.util.Format.format('<p>{0}</p>', i18n.gettext('No assignments found. Assign employee to a position before manage Time Offs.')),
                    margin : 10
                }
            ];

            this.callParent(arguments);
        }
    }

});
