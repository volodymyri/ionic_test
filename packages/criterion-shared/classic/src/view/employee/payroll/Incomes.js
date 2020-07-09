Ext.define('criterion.view.employee.payroll.Incomes', {

    alias : 'widget.criterion_employee_payroll_incomes',

    extend : 'criterion.view.GridView',

    requires : [
        'criterion.controller.employee.Incomes',
        'criterion.store.employee.Incomes',
        'criterion.view.employee.payroll.form.IncomeForm'
    ],

    title : i18n.gettext('Incomes'),

    listeners : {
        scope : 'controller',
        expand : 'handleActivate'
    },

    controller : {
        type : 'criterion_employee_payroll_incomes',
        reloadAfterEditorSave : true,
        reloadAfterEditorDelete : true,
        editor : {
            xtype : 'criterion_employee_payroll_income_form',
            allowDelete : true
        }
    },

    store : {
        type : 'criterion_employee_incomes'
    },

    tbar : [
        {
            xtype : 'button',
            text : i18n.gettext('Add'),
            cls : 'criterion-btn-feature',
            handler : 'handleAddClick',
            hidden : true,
            bind : {
                hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_INCOMES, criterion.SecurityManager.CREATE, true)
            }
        },
        '->',
        {
            xtype : 'toggleslidefield',
            labelWidth : 100,
            fieldLabel : i18n.gettext('Show inactive'),
            reference : 'showInactive',
            inputValue : '1',
            listeners : {
                change : 'handleChangeShowInactive'
            }
        },
        {
            xtype : 'button',
            reference : 'refreshButton',
            cls : 'criterion-btn-transparent',
            glyph : criterion.consts.Glyph['ios7-refresh-empty'],
            scale : 'medium',
            listeners : {
                click : 'handleRefreshClick'
            }
        }
    ],

    columns : [
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Code'),
            dataIndex : 'incomeListCode',
            flex : 1
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Description'),
            dataIndex : 'incomeListDescription',
            flex : 1
        },
        {
            xtype : 'datecolumn',
            text : i18n.gettext('Effective Date'),
            dataIndex : 'effectiveDate',
            width : 140
        },
        {
            xtype : 'datecolumn',
            text : i18n.gettext('Expiration Date'),
            dataIndex : 'expirationDate',
            width : 140
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Amount'),
            renderer : function(value, metaData, record) {
                var incomeCalcMethodCode = record && record.getIncomeList() && record.getIncomeList().get('incomeCalcMethodCode');

                return incomeCalcMethodCode !== criterion.Consts.INCOME_CALC_METHOD.FORMULA ? criterion.LocalizationManager.currencyFormatter(value) : Ext.util.Format.percent(value, '0.##');
            },
            dataIndex : 'amount',
            flex : 1
        }
    ]

});
