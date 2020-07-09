Ext.define('criterion.view.person.BankAccounts', function() {

    return {
        alias : 'widget.criterion_person_bank_accounts',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.view.person.BankAccount',
            'criterion.store.person.BankAccounts'
        ],

        title : i18n.gettext('Bank Accounts'),

        store : {
            type : 'criterion_person_bank_accounts',
            proxy : {
                extraParams : {
                    showApproved : true
                }
            }
        },

        controller : {
            type : 'criterion_person_gridview',
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_person_bank_account',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ]
            }
        },

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_BANK_ACCOUNTS, criterion.SecurityManager.CREATE, true)
                }
            },
            '->',
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
                flex : 1,
                text : i18n.gettext('Bank Name'),
                dataIndex : 'bankName'
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Routing Number'),
                dataIndex : 'routingNumber'
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Account Type'),
                dataIndex : 'accountTypeCd',
                flex : 1,
                codeDataId : criterion.consts.Dict.ACCOUNT_TYPE
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Account Number'),
                dataIndex : 'accountNumber'
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Deposit Order'),
                dataIndex : 'depositOrder'
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Deposit Type'),
                dataIndex : 'depositTypeCd',
                flex : 1,
                codeDataId : criterion.consts.Dict.DEPOSIT_TYPE
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Amount / Percent'),
                dataIndex : 'value',
                renderer : function(value, metaData, record) {
                    switch (record.get('depositTypeCode')) {
                        case criterion.Consts.DEPOSIT_TYPE.PERCENT:
                            return Ext.util.Format.percent(value / 100, '0.##');
                            break;
                        case criterion.Consts.DEPOSIT_TYPE.AMOUNT:
                            return Ext.util.Format.currency(value);
                            break;
                        case criterion.Consts.DEPOSIT_TYPE.BALANCE:
                            return '';
                            break;
                    }
                }
            }
        ]
    };
});

