Ext.define('criterion.view.settings.incomes.Incomes', function() {

    var DICT = criterion.consts.Dict,
        INCOME_CALC_METHOD = criterion.Consts.INCOME_CALC_METHOD;

    return {
        alias : 'widget.criterion_payroll_settings_incomes',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.controller.settings.incomes.Incomes',
            'criterion.view.settings.incomes.Income',
            'criterion.store.employer.IncomeLists',
            'criterion.store.TeIncomes'
        ],

        title : i18n.gettext('Incomes'),

        layout : 'fit',

        viewModel : {
            stores : {
                teIncomes : {
                    type : 'criterion_te_incomes'
                }
            }
        },

        controller : {
            type : 'criterion_payroll_settings_incomes',
            connectParentView : {
                parentForSpecified : true
            },
            showTitleInConnectedViewMode : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_payroll_settings_payroll_income',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        store : {
            type : 'employer_income_lists'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Code'),
                flex : 1,
                dataIndex : 'code',
                editor : {
                    allowBlank : false
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Description'),
                flex : 1,
                dataIndex : 'description',
                editor : {
                    allowBlank : false
                }
            },
            {
                xtype : 'codedatacolumn',
                text : i18n.gettext('Calculation Method'),
                flex : 1,
                dataIndex : 'incomeCalcMethodCd',
                codeDataId : DICT.INCOME_CALC_METHOD
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Priority'),
                dataIndex : 'priority',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                hidden : true,
                renderer : function(value, metaData, record) {
                    return record.get('incomeCalcMethodCode') === INCOME_CALC_METHOD.FORMULA ? value : '—';
                }
            }
        ]
    };

});
