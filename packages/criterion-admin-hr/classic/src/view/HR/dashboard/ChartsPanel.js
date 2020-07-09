Ext.define('criterion.view.hr.dashboard.ChartsPanel', function() {

    return {
        extend : 'criterion.view.hr.dashboard.Panel',

        requires : [
            'Ext.chart.*',
            'criterion.view.hr.dashboard.ChartsPanelItem'
        ],

        alias : 'widget.criterion_hr_dashboard_charts_panel',

        defaultType : 'criterion_hr_dashboard_charts_panel_item'
    };

});
