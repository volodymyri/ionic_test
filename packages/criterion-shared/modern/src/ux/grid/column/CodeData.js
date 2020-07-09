Ext.define('criterion.ux.grid.column.CodeData', function() {

    return {

        alias : [
            'widget.criterion_codedatacolumn',
            // Backward compatibility
            'widget.codedatacolumn'
        ],

        extend : 'Ext.grid.column.Column',

        requires : [
            'criterion.ux.field.CodeDetail',
            'criterion.ux.grid.cell.CodeData'
        ],

        mixins : [
            'criterion.ux.mixin.CodeDataOwner'
        ],

        config : {

            sortParam : null,

            unselectedText : null,

            codeDataDisplayField : null,

            /**
             * @cfg {String} undefinedText
             * The string returned by the renderer when the column value is undefined.
             */
            undefinedText : null,

            defaultEditor : {
                xtype : 'criterion_code_detail_select'
            },

            cell : {
                xtype : 'codetabledetailcell'
            }
        },

        initialize : function() {
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
                editor : Ext.merge(this.editor || {}, {
                    xtype : 'criterion_code_detail_field',
                    codeDataId : codeDataId
                })
            });

            me.callParent(arguments);

            me.bindStore(me.store, true, true);
        },

        getSortParam: function() {
            return this.sortParam || this.dataIndex;
        }
    };

});
