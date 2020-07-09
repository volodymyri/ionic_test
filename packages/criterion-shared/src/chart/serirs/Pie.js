Ext.define('criterion.chart.series.Pie', {

    extend : 'Ext.chart.series.Pie',

    type : 'criterion_pie',

    alias : 'series.criterion_pie',

    config : {
        legendField : null
    },

    colors : criterion.consts.Colors.CHART_COLORS,

    provideLegendInfo : function(target) {
        let me = this,
            store = me.getStore();

        if (store) {
            let items = store.getData().items,
                legendField = me.getLegendField(),
                labelField = me.getLabel().getTemplate().getField(),
                xField = me.getXField(),
                hidden = me.getHidden(),
                i, style, fill,
                displayField = legendField || labelField;

            for (i = 0; i < items.length; i++) {
                style = me.getStyleByIndex(i);
                fill = style.fillStyle;

                if (Ext.isObject(fill)) {
                    fill = fill.stops && fill.stops[0].color;
                }

                target.push({
                    name : displayField ? String(items[i].get(displayField)) : xField + ' ' + i,
                    mark : fill || style.strokeStyle || 'black',
                    disabled : hidden[i],
                    series : me.getId(),
                    index : i
                });
            }
        }
    }
});
