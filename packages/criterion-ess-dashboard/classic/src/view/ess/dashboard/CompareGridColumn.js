Ext.define('criterion.view.ess.dashboard.CompareGridColumn', function() {

    return {

        alias : 'widget.criterion_selfservice_dashboard_compare_grid_column',

        extend : 'Ext.grid.column.Column',

        tdCls : 'criterion-selfservice-dashboard-compare-grid-column',

        encodeHtml : false,

        renderer : function(value) {
            if (/National Identifier/.test(value)) {
                var ssnVal = value.replace('<strong> National Identifier</strong>:', '');

                return '<strong> National Identifier</strong>: <span class="mask">·········</span><span class="value">' + ssnVal + '</span><i class="showBtn"></i>';
            } else {
                return value;
            }
        }
    }
});
