Ext.define('criterion.overrides.chart.legend.LegendBase', {

    override : 'Ext.chart.legend.LegendBase',

    onChildTap : function(view, context) {
        this.toggleItem((context && context.viewIndex) || view.viewIndex);
    }

});
