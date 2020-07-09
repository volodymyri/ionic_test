Ext.define('criterion.view.employee.task.CodeTableDetails', function() {

    return {
        alias : 'widget.criterion_employee_task_code_table_details',

        extend : 'Ext.form.FieldContainer',

        mixins : [
            'Ext.util.StoreHolder'
        ],

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        viewModel : {
            data : {
                values : {}
            }
        },

        bodyPadding : 10,

        codeTableIds : [],

        setStore(store) {
            this.bindStore(store);
        },

        setCodeTableIds(codeTableIds) {
            let me = this;

            if (Ext.isArray(codeTableIds) && codeTableIds.length) {
                this.codeTableIds = codeTableIds;

                Ext.defer(_ => {
                    me.reconstruct();
                }, 100);
            } else {
                this.codeTableIds = [];
            }
        },

        reconstruct() {
            if (this.destroyed) {
                return;
            }

            this.removeAll();
            this.add(this.createItems());
        },

        createItems() {
            let store = this.getStore(),
                vm = this.getViewModel(),
                values = {},
                items = []

            Ext.Array.each(this.codeTableIds, codeTableId => {
                let codeTable = criterion.CodeDataManager.getCodeTableById(codeTableId),
                    rec;

                if (!codeTable) {
                    return;
                }

                rec = store.findRecord('codeTableId', codeTableId, 0, false, true, true);

                values[codeTableId] = rec ? rec.get('value') : '';

                items.push({
                    xtype : 'criterion_code_detail_field_multi_select',
                    fieldLabel : codeTable.get('name'),
                    allowSetDefault : false,
                    codeDataId : codeTable.getId(),

                    bind : {
                        value : '{values.' + codeTableId + '}'
                    }
                });
            });

            vm.set('values', values);

            return {
                xtype : 'container',
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                layout : 'hbox',
                plugins : [
                    'criterion_responsive_column'
                ],

                items : [
                    {
                        xtype : 'container',
                        items : items
                    },
                    {
                        xtype : 'container',
                        items : []
                    }
                ]
            }

        },

        getValue() {
            let res = {},
                values = this.getViewModel().get('values');

            Ext.Object.each(values, (key, val) => {
               res[key] = Ext.isArray(val) ? val.join(',') : val
            });

            return res;
        }
    }
});
