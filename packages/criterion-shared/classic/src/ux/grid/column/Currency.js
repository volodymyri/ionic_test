/**
 * Column used to display money data.
 */
Ext.define('criterion.ux.grid.column.Currency', function () {

    return {
        alias : [
            'widget.criterion_currencycolumn'
        ],

        extend : 'Ext.grid.column.Number',

        allowNullValue : false,
        producesHTML : false,

        defaultRenderer : function(value) {
            return this.allowNullValue && value === null ? '' : criterion.LocalizationManager.currencyFormatter(value);
        },

        align : 'right'
    };

});
