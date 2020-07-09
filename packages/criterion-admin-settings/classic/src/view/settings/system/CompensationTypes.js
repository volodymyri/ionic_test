Ext.define('criterion.view.settings.system.CompensationTypes', function() {

    var DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_payroll_settings_system_compensation_types',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.store.TeIncomes',
            'criterion.view.settings.system.CompensationType'
        ],

        title : i18n.gettext('Compensation Type'),

        layout : 'fit',

        viewModel : {
            stores : {
                teIncomes : {
                    type : 'criterion_te_incomes'
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
                xtype : 'criterion_payroll_settings_system_compensation_type',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        bind : {
            store : '{teIncomes}'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Code'),
                width : 150,
                dataIndex : 'code'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                flex : 2,
                dataIndex : 'compensationType'
            },
            {
                xtype : 'codedatacolumn',
                text : i18n.gettext('Type'),
                flex : 1,
                dataIndex : 'compTypeCd',
                codeDataId : DICT.COMP_TYPE_CD
            }
        ]
    };

});
