Ext.define('criterion.view.settings.system.DeductionTypes', function() {

    return {
        alias : 'widget.criterion_payroll_settings_system_deduction_types',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.store.TeDeductions',
            'criterion.view.settings.system.DeductionType'
        ],

        title : i18n.gettext('Deduction Type'),

        layout : 'fit',

        viewModel : {
            stores : {
                teDeductions : {
                    type : 'criterion_te_deductions'
                }
            }
        },

        controller : {
            connectParentView : {
                parentForSpecified : true
            },
            showTitleInConnectedViewMode : true,
            loadRecordOnEdit : false,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_payroll_settings_system_deduction_type',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        bind : {
            store : '{teDeductions}'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Code Regular'),
                width : 150,
                dataIndex : 'codeRegular'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Code Supplemental'),
                width : 200,
                dataIndex : 'codeSupplemental'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                flex : 2,
                dataIndex : 'plan'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Maximum Amount'),
                width : 200,
                dataIndex : 'maxAmount',
                renderer : function(value) {
                    return value ? criterion.LocalizationManager.currencyFormatter(value) : '';
                }
            }
        ]
    };

});
