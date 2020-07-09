Ext.define('criterion.view.ess.payroll.Incomes', function() {

    return {

        alias : 'widget.criterion_selfservice_payroll_incomes',

        extend : 'criterion.view.employee.payroll.Incomes',

        controller : {
            editor : undefined,

            suppressIdentity : ['EmployeeContext']
        },

        header : {
            title : i18n.gettext('Incomes'),

            items : [
                {
                    xtype : 'tbfill'
                },
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
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'button',
                    reference : 'refreshButton',
                    cls : 'criterion-btn-glyph-only',
                    glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                    scale : 'medium',
                    listeners : {
                        click : 'handleRefreshClick'
                    }
                }
            ]
        },

        tbar : null,
        cls : 'criterion-grid-panel-simple-list',

        columns : [
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
                width : 150
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Expiration Date'),
                dataIndex : 'expirationDate',
                width : 160
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Amount'),
                renderer : criterion.LocalizationManager.currencyFormatter,
                dataIndex : 'amount',
                width : 160
            }
        ]
    }
});
