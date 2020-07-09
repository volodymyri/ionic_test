Ext.define('criterion.view.ess.time.dashboard.TimeOffHistory', function() {

    return {
        alias : 'widget.criterion_selfservice_time_dashboard_time_off_history',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.ess.time.dashboard.TimeOffHistory',
            'criterion.view.ess.time.dashboard.timeOffHistory.TimeOffList'
        ],

        mixins : [
            'criterion.ux.mixin.TitleReplaceable'
        ],

        replaceTitle : true,

        controller : {
            type : 'criterion_selfservice_time_dashboard_time_off_history',
            showTitleInConnectedViewMode : true
        },

        items : [
            {
                xtype : 'criterion_selfservice_time_dashboard_time_off_history_time_off_list',
                reference : 'list'
            }
        ]
    };

});
