Ext.define('criterion.view.settings.payroll.ShiftRates', function() {

    return {
        alias : 'widget.criterion_payroll_settings_shift_rates',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.controller.employer.GridView',

            'criterion.view.settings.payroll.ShiftRate',

            'criterion.store.EmployeeGroups',
            'criterion.store.employeeGroup.ShiftRates',
            'criterion.store.employer.ShiftRates'
        ],

        title : i18n.gettext('Shift Rates'),

        store : {
            type : 'employer_shift_rates'
        },

        controller : {
            type : 'criterion_employer_gridview',
            connectParentView : {
                parentForSpecified : true
            },
            showTitleInConnectedViewMode : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            loadRecordOnEdit : true,
            editor : {
                xtype : 'criterion_payroll_settings_shift_rate',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : '60%'
                    }
                ]
            }
        },

        columns : [
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Name'),
                dataIndex : 'name'
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Employee Groups'),
                dataIndex : 'employeeGroups',
                renderer : function(value) {
                    return Ext.isArray(value) ? value.join(', ') : '';
                }
            }
        ]

    };

});
