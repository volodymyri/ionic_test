Ext.define('criterion.view.settings.payroll.GLAccounts', function() {

    return {

        alias : 'widget.criterion_payroll_settings_gl_accounts',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.store.employer.GLAccounts',
            'criterion.view.settings.payroll.GLAccount'
        ],

        controller : {
            type : 'criterion_employer_gridview',
            connectParentView : false,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_payroll_settings_gl_account',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                        height : 'auto'
                    }
                ],
                controller : {
                    externalUpdate : false
                },
                draggable : true,
                modal : true
            }
        },

        title : i18n.gettext('GL Accounts'),

        store : {
            type : 'employer_gl_accounts'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Number'),
                flex : 1,
                dataIndex : 'accountNumber'
            },
            {
                xtype : 'gridcolumn',
                flex : 2,
                text : i18n.gettext('Name'),
                dataIndex : 'accountName'
            }
        ]
    };

});
