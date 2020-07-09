Ext.define('criterion.controller.ess.time.dashboard.timeOffHistory.TimeOffCharts', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_selfservice_time_dashboard_time_off_history_time_off_charts',

        requires : [
            'criterion.view.ess.time.dashboard.timeOffHistory.Chart'
        ],

        load : function() {
            var me = this,
                vm = this.getViewModel(),
                timeBalances = vm.getStore('timeBalances'),
                employeeId = vm.get('employeeId'),
                promises;

            promises = [
                vm.getStore('employeeTimeOffType').loadWithPromise({
                    params : {
                        employeeId : employeeId
                    }
                }),

                this.loadTimeBalances()
            ];

            Ext.Deferred.all(promises).then(function() {
                me.onTimeBalancesLoad();
            });
        },

        onDateSelect : function(date) {
            var me = this,
                vm = this.getViewModel();

            vm.set('date', date);

            this.loadTimeBalances()
                .then(function() {
                    me.onTimeBalancesLoad();
                });
        },

        loadTimeBalances : function() {
            var vm = this.getViewModel(),
                date = vm.get('date');

            return vm.getStore('timeBalances').loadWithPromise({
                params : {
                    employeeId : vm.get('employeeId'),
                    date : Ext.Date.format(date, criterion.consts.Api.DATE_FORMAT)
                }
            });
        },

        onTimeBalancesLoad : function() {
            var charts = this.lookup('charts'),
                timeBalances = this.getStore('timeBalances');

            charts.removeAll();

            timeBalances.each(function(timeBalance) {
                var chart = charts.add({
                        xtype : 'criterion_selfservice_time_dashboard_time_off_history_chart'
                    }),
                    chartEl = chart.getEl();

                chartEl.setOpacity(0);

                chart.getController().setChartRecord(timeBalance);

                Ext.defer(function() {
                    chartEl.setOpacity(1, true);
                }, 50);
            });
        }
    }
});
