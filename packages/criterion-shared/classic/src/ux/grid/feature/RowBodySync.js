Ext.define('criterion.ux.grid.feature.RowBodySync', {

    extend : 'Ext.grid.feature.RowBody',

    alias : 'feature.criterion_row_body_sync',

    extraRowTpl : [
        '{%',
            'if(this.rowBody.bodyBefore) {',
                // MUST output column sizing elements because the first row in this table
                // contains one colspanning TD, and that overrides subsequent column width settings.
                'values.view.renderColumnSizer(values, out);',
            '} else {',
                'this.nextTpl.applyOut(values, out, parent);',
            '}',
            'values.view.rowBodyFeature.setupRowData(values.record, values.recordIndex, values);',
        '%}',
        '<tr class="criterion-row-body-sync ' + Ext.baseCSSPrefix + 'grid-rowbody-tr {rowBodyCls} {rowIdCls}" {ariaRowAttr}>',
            '<tpl if="addSpacerCell">',
                '<td class="{spacerCellCls}"></td>',
            '</tpl>',
            '<td class="' + Ext.baseCSSPrefix + 'grid-td ' + Ext.baseCSSPrefix + 'grid-cell-rowbody" colspan="{rowBodyColspan}" {ariaCellAttr}>',
                '<div class="' + Ext.baseCSSPrefix + 'grid-rowbody {rowBodyDivCls}" {ariaCellInnerAttr}>{rowBody}</div>',
            '</td>',
        '</tr>',
        '{%',
            'if(this.rowBody.bodyBefore) {',
                'this.nextTpl.applyOut(values, out, parent);',
            '}',
        '%}', {
            priority: 100,

            beginRowSync: function (rowSync) {
                rowSync.add('rowBody', this.owner.eventSelector);
            },

            syncContent: function(destRow, sourceRow, columnsToUpdate) {
                if (this.doSync) {
                    var owner = this.owner,
                        destRowBody = Ext.fly(destRow).down(owner.eventSelector, true),
                        sourceRowBody;

                    // Sync the heights of row body elements in each row if they need it.
                    if (destRowBody && (sourceRowBody = Ext.fly(sourceRow).down(owner.eventSelector, true))) {
                        Ext.fly(destRowBody).syncContent(sourceRowBody);
                    }
                }
            }
        }
    ],

    init : function(grid) {
        var me = this,
            view = me.view = grid.getView();

        this.callParent(arguments);

        view.headerCt.on({
            columnresize : me.onColumnsResize,
            scope : me
        });
    },

    onColumnsResize : function(ct) {
        this.rowExpander.grid && this.rowExpander._syncColumnState();
    }

});
