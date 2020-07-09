Ext.define('criterion.view.settings.payroll.Schedules', function() {

    return {

        alias : 'widget.criterion_payroll_settings_payroll_schedules',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.controller.settings.payroll.Schedules',
            'criterion.store.employer.payroll.Schedules',
            'criterion.view.settings.payroll.Schedule'
        ],

        controller : {
            type : 'criterion_payroll_settings_payroll_schedules',
            showTitleInConnectedViewMode : true,
            connectParentView : {
                parentForSpecified : true
            },
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_payroll_settings_payroll_schedule',
                allowDelete : true,
                deleteConfirmMessage : i18n.gettext('Do you want to delete this payroll schedule?'),
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        listeners : {
            payrollPeriods : 'handleControlPayrollPeriods'
        },

        title : i18n.gettext('Payroll Schedules'),

        store : {
            type : 'criterion_employer_payroll_schedules'
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                flex : 1,
                dataIndex : 'name',
                sortable : false
            },
            {
                xtype : 'criterion_codedatacolumn',
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                text : i18n.gettext('Frequency'),
                dataIndex : 'payFrequencyCd',
                codeDataId : criterion.consts.Dict.PAY_FREQUENCY
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Pay Date (Days After)'),
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                dataIndex : 'payDateDaysAfter'
            }
        ]
    };

});
