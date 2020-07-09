Ext.define('criterion.ux.chart.theme.Criterion', function() {

    return {
        extend : 'Ext.chart.theme.Base',

        alias : 'chart.theme.criterion',

        config : {
            colors : criterion.consts.Dashboard.CHART_COLORS,

            axis : {
                defaults : {
                    grid : {
                        strokeStyle : '#eee',
                        lineWidth : 2
                    },
                    style : {
                        strokeStyle : '#e5e5e5'
                    },
                    label : {
                        fontFamily : 'Open Sans',
                        fontSize : 12,
                        fontWeight : '600',
                        fillStyle : '#3c3c3c'
                    }
                }
            },

            series : {
                defaults : {
                    label : {
                        fillStyle : 'white',
                        fontFamily : 'Open Sans',
                        fontWeight : '700',
                        fontSize : '12'
                    },

                    style : {
                        strokeStyle : 'white',
                        minGapWidth : 1
                    }
                }
            },

            legend : {
                label : {
                    fontFamily : 'Open Sans',
                    fontSize : 12,
                    fontWeight : 600,
                    fillStyle : '#3c3c3c'
                }
            }
        }
    }
});