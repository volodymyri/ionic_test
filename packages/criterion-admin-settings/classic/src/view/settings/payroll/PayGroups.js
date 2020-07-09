Ext.define('criterion.view.settings.payroll.PayGroups', function() {

    return {
        alias : 'widget.criterion_settings_pay_groups',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.controller.settings.payroll.PayGroups',
            'criterion.view.settings.payroll.PayGroup',
            'criterion.store.employer.PayGroups'
        ],

        title : i18n.gettext('Pay Groups'),

        layout : 'fit',

        controller : {
            type : 'criterion_settings_pay_groups',
            showTitleInConnectedViewMode : true,
            connectParentView : {
                parentForSpecified : true
            },
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_pay_group',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        store : {
            type : 'criterion_employer_pay_groups'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                dataIndex : 'payrollScheduleName',
                text : i18n.gettext('Schedule'),
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                flex : 1,
                dataIndex : 'name'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Description'),
                flex : 1,
                dataIndex : 'description'
            }
        ]
    };

});
