Ext.define('criterion.controller.ess.time.dashboard.timeOffHistory.Chart', function() {

    var extractChartRecord = function(field, record) {
        return {
            name : field,
            value : Ext.util.Format.round(record.get(field), 2)
        }
    };

    var isPointOutsideCircle = function(r, center, point) {
        var d = Math.pow(point[0] - center[0], 2) +
            Math.pow(point[1] - center[1], 2);

        return d > Math.pow(r, 2);
    };

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_selfservice_time_dashboard_time_off_history_chart',

        onBeforeEmployerChange : function(employer) {
            var vm = this.getViewModel(),
                view = this.getView();

            vm.set('colors', {
                taken : "#A7AfC1",
                balance : Ext.String.format('#{0}', employer.get('essColor6')),
                planned : "#F5F6F8"
            });

            view.renderChart();
        },

        setChartRecord : function(record) {
            var vm = this.getViewModel(),
                chartStore = vm.getStore('pieChart'),
                chartData = record.get('isEmpty') ? [
                        {
                            name : 'accrued',
                            value : 0
                        },
                        {
                            name : 'taken',
                            value : 0
                        },
                        {
                            name : 'planned',
                            value : 1
                        }
                    ] : [
                        extractChartRecord('accrued', record),
                        extractChartRecord('taken', record),
                        extractChartRecord('planned', record)
                    ];

            vm.set('record', record);
            chartStore.loadData(chartData);
        },

        onMouseChartLeave : function(chart, data, e) {
            var radius = chart.getRadius(),
                center = chart.getCenter(),
                chartXY = chart.getSurface('series').el.getXY(),
                centerPoint = [center[0] + chartXY[0], center[1] + chartXY[1]],
                eventPoint = [e.clientX, e.clientY];

            var tip = chart.getTooltip();

            tip.inside = !isPointOutsideCircle(radius, centerPoint, eventPoint);
        },

        onMouseChartOver : function(chart, data, e) {
            this.showChartTip();
        },

        showChartTip : function() {
            this.getView().down('polar')
                .getChart().showTooltip();
        }
    }
});
