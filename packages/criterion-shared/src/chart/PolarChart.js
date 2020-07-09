Ext.define('criterion.chart.PolarChart', {

    extend : 'Ext.chart.PolarChart',

    requires : [
        'Ext.chart.interactions.Rotate',
        'Ext.chart.interactions.ItemHighlight',
        'criterion.chart.series.Pie'
    ],

    alias : 'widget.criterion_polar',

    cls : 'criterion-polar',

    userCls : 'light-grey-bg',

    downloadServerUrl : '-',

    legend : {
        type : 'dom',
        docked : 'bottom',
        userCls : 'chart-legend',
        toggleable : false
    }

});
