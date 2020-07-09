Ext.define('criterion.view.settings.payroll.BankInformations', function() {

    return {

        alias : 'widget.criterion_payroll_settings_bank_informations',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.store.employer.BankAccounts',
            'criterion.view.settings.payroll.BankInformation'
        ],

        controller : {
            type : 'criterion_employer_gridview',
            showTitleInConnectedViewMode : true,
            connectParentView : {
                parentForSpecified : true
            },
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_payroll_settings_bank_information',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        title : i18n.gettext('Bank Information'),

        store : {
            type : 'employer_bank_accounts'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Account Name'),
                flex : 1,
                dataIndex : 'name',
                sortable : false
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
                text : i18n.gettext('Bank Name'),
                dataIndex : 'bankName'
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Routing Number'),
                dataIndex : 'routingNumber'
            }
        ]
    };

});

