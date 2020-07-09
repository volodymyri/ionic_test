Ext.define('criterion.view.hr.dashboard.ValuesPanel', function() {

    return {
        alias : 'widget.criterion_hr_dashboard_values_panel',

        extend : 'criterion.view.hr.dashboard.Panel',

        requires : [
            'criterion.view.hr.dashboard.ValuesPanelItem'
        ],

        maxCount : 7,

        defaultType : 'criterion_hr_dashboard_values_panel_item'
    };

});
