Ext.define('criterion.view.ess.time.dashboard.timeOffHistory.TimeOffList', function() {

    return {
        alias : 'widget.criterion_selfservice_time_dashboard_time_off_history_time_off_list',

        extend : 'criterion.view.employee.benefit.TimeOffList',

        requires : [
            'criterion.controller.ess.time.dashboard.timeOffHistory.TimeOffList',
            'criterion.view.ess.time.timeOffHistory.TimeOffForm'
        ],

        useWorkflow : true,

        viewModel : {
            data : {
                managerMode : false
            }
        },

        controller : {
            type : 'criterion_selfservice_time_dashboard_time_off_history_time_off_list',
            baseRoute : criterion.consts.Route.SELF_SERVICE.TIME_TIME_OFF_DASHBOARD,
            showTitleInConnectedViewMode : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_selfservice_time_time_off_history_time_off_form'
            }
        },

        ui : 'clean',

        listeners : {
            showplanned : 'showPlanned',
            showtaken : 'showTaken',
            yearprev : 'onYearPrev',
            yearnext : 'onYearNext'
        },

        setManagerMode : function(managerMode) {
            this.getViewModel().set('managerMode', managerMode);
        }
    };

});
