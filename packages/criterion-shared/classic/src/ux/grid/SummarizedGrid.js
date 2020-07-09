Ext.define('criterion.ux.grid.SummarizedGrid', function() {

    return {
        alias : [
            'widget.criterion_summarized_grid'
        ],

        requires : [
            'Ext.grid.feature.Summary'
        ],

        extend : 'criterion.ux.grid.Panel',

        features : [{
            ftype : 'summary'
        }],

        disableGrouping : true,

        hideHeaders : true,
        disableSelection : true,
        padding : '0 0 20 0'

    };

});
