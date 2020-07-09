Ext.define('criterion.view.ess.time.timeOffHistory.TimeOffCalendar', function() {

    return {
        alias : 'widget.criterion_selfservice_time_time_off_history_time_off_calendar',

        extend : 'criterion.view.employee.benefit.TimeOffCalendar',

        requires : [
            'criterion.controller.ess.time.timeOffHistory.TimeOffCalendar'
        ],

        controller : {
            type : 'criterion_selfservice_time_time_off_history_time_off_calendar',
            showTitleInConnectedViewMode : true
        }
    };

});
