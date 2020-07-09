Ext.define('criterion.view.ess.payroll.BankAccounts', {

    alias : 'widget.criterion_selfservice_payroll_bank_accounts',

    extend : 'criterion.view.person.BankAccounts',

    requires : [
        'criterion.view.ess.payroll.BankAccount',
        'criterion.controller.ess.person.GridView'
    ],

    viewModel : {
        data : {}
    },

    store : {
        type : 'criterion_person_bank_accounts',
        proxy : {
            extraParams : {
                joinWorkflowLog : true
            }
        }
    },

    controller : {
        type : 'criterion_selfservice_person_gridview',
        baseRoute : criterion.consts.Route.SELF_SERVICE.PAYROLL_BANK_ACCOUNTS,
        showTitleInConnectedViewMode : true,
        reloadAfterEditorDelete : true,

        editor : {
            xtype : 'criterion_selfservice_payroll_bank_account',
            plugins : [
                {
                    ptype : 'criterion_sidebar',
                    width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                }
            ]
        }
    },

    header : {
        items : [
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-glyph-only',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            },
            {
                xtype : 'tbspacer'
            },
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                ui : 'feature',
                listeners : {
                    click : 'handleAddClick'
                }
            }
        ]
    },

    tbar : null,

    columns : [
        {
            xtype : 'gridcolumn',
            flex : 1,
            text : i18n.gettext('Routing Number'),
            dataIndex : 'routingNumber'
        },
        {
            xtype : 'gridcolumn',
            flex : 1,
            text : i18n.gettext('Account Number'),
            dataIndex : 'accountNumber'
        },
        {
            xtype : 'gridcolumn',
            flex : 2,
            text : i18n.gettext('Description'),
            dataIndex : 'description'
        },
        {
            xtype : 'gridcolumn',
            flex : 1,
            text : i18n.gettext('Deposit Order'),
            dataIndex : 'depositOrder'
        },
        {
            xtype : 'gridcolumn',
            flex : 1,
            text : i18n.gettext('Deposit Type'),
            dataIndex : 'depositTypeDescription'
        },
        {
            xtype : 'gridcolumn',
            flex : 1,
            text : i18n.gettext('Amount / Percent'),
            dataIndex : 'value',
            renderer : (value, metaData, record) => {
                return record.get('depositTypeCode') === criterion.Consts.DEPOSIT_TYPE.PERCENT ?
                    Ext.util.Format.percent(value / 100, '0.##') : Ext.util.Format.currency(value);
            }
        },
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Status'),
            dataIndex : 'status',
            flex : 1
        }
    ]
});
