Ext.define('criterion.ux.grid.column.CodeData', function() {

    /**
     * @memberOf criterion.ux.grid.column.CodeData
     */
    function defaultRenderer(value) {
        var record = this.getStore().getById(value);

        return record ? record.get(this.codeDataDisplayField) : this.unselectedText;
    }

    return {
        alternateClassName : [
            'criterion.grid.column.CodeData',
            // Backward compatibility
            'criterion.ux.CodeDataColumn'
        ],

        alias : [
            'widget.criterion_codedatacolumn',
            // Backward compatibility
            'widget.codedatacolumn'
        ],

        extend : 'Ext.grid.column.Column',

        mixins : [
            'criterion.ux.mixin.CodeDataOwner'
        ],

        sortParam : null,

        unselectedText : i18n.gettext('<unselected>'),

        codeDataDisplayField : 'description',

        defaultRenderer : defaultRenderer,

        initComponent : function() {
            var me = this,
                codeDataId = me.getCodeDataId(),
                codeDataStore = criterion.CodeDataManager.getStore(codeDataId);

            if (!codeDataStore.isLoaded() && !codeDataStore.isLoading()) {
                criterion.CodeDataManager.load([
                    codeDataId
                ])
            }

            Ext.apply(me, {
                store : codeDataStore,
                editor : this.editor !== false ? Ext.Object.merge(this.editor || {}, {
                    xtype : 'criterion_code_detail_field',
                    codeDataId : codeDataId
                }) : undefined
            });

            me.callParent(arguments);

            me.bindStore(me.store, true, true);
        },

        getSortParam : function() {
            return this.sortParam || this.dataIndex;
        }
    };

});
