Ext.define('criterion.view.ess.time.dashboard.timeOffHistory.TimeOffCharts', function() {

    return {

        alias : 'widget.criterion_selfservice_time_dashboard_time_off_history_time_off_charts',

        requires : [
            'criterion.vm.time.TimeOffs',
            'criterion.controller.ess.time.dashboard.timeOffHistory.TimeOffCharts'
        ],

        extend : 'Ext.container.Container',

        controller : {
            type : 'criterion_selfservice_time_dashboard_time_off_history_time_off_charts'
        },

        viewModel : {
            type : 'criterion_time_timeoffs',
            data : {
                date : new Date()
            },
            formulas : {
                balanceHeight : {
                    bind : {
                        bindTo : '{timeBalances}',
                        deep : true
                    },
                    get : timeBalances => timeBalances.count() ? 120 : 0
                }
            }
        },

        flex : 1,

        bind : {
            height : '{balanceHeight}'
        },

        listeners : {
            changedate : 'onDateSelect'
        },

        items : [
            {
                xtype : 'toolbar',

                reference : 'charts',

                layout : {
                    type : 'hbox',
                    align : 'middle',
                    pack : 'center',

                    overflowHandler : {
                        type : 'scroller',
                        scrollIncrement : 255,
                        enableAnimation : true
                    }
                },

                items : []
            }
        ]
    };

});
