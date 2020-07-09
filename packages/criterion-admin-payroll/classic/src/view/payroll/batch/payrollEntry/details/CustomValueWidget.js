Ext.define('criterion.view.payroll.batch.payrollEntry.details.CustomValueWidget', function() {

    return {

        alias : 'widget.criterion_payroll_batch_payroll_entry_details_custom_value_widget',

        extend : 'Ext.container.Container',

        viewModel : {
            data : {
                sXtype : '',
                rawValue : null
            },

            formulas : {
                value : function(data) {
                    var rawValue = data('rawValue');

                    return data('sXtype') === 'datefield' ? (rawValue ? new Date(rawValue) : null) : rawValue;
                }
            }
        },

        layout : 'fit',

        items : [],

        defaultBindProperty : 'value',

        initComponent : function() {
            this.callParent(arguments);
        },

        setViewMode : function() {
            if (this.destroyed) {
                return;
            }

            this.removeAll();
            this.add({
                xtype : 'component',
                margin : '12 0 0 20',
                html : '...'
            })
        },

        setCustomValueConfig : function(config) {
            if (this.destroyed) {
                return;
            }

            var cfg = Ext.apply({
                bind : {
                    value : '{value}'
                },
                isCustomField : true,
                listeners : {
                    blur : 'handleFieldBlur',
                    change : 'handleFieldChange',
                    scope : this
                }
            }, criterion.Utils.getCustomFieldEditorConfig(config));

            this.getViewModel().set('sXtype', cfg.xtype);
            this.removeAll();
            this.add(cfg);
        },

        handleFieldBlur : function(field) {
            this.fireEvent('blur', this, field);
        },

        handleFieldChange : function(field) {
            this.fireEvent('change', field);
        },

        setValue : function(val) {
            if (this.destroyed) {
                return;
            }

            var vm = this.getViewModel();

            vm && vm.set('rawValue', val);
        },

        getValue : function() {},

        setDisabled : function(flag) {
            if (this.destroyed) {
                return;
            }

            this.down('[isCustomField]').setDisabled(flag);
        },

        privates : {
            detachFromBody : function() {}
        }
    }
});
