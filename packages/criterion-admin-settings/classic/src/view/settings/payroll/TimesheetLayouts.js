Ext.define('criterion.view.settings.payroll.TimesheetLayouts', function() {

    return {
        alias : 'widget.criterion_settings_timesheet_layouts',

        extend : 'criterion.view.settings.employer.GridView',

        requires : [
            'criterion.view.settings.payroll.TimesheetLayout',

            'criterion.store.TimesheetTypes',
            'criterion.store.EmployeeGroups',

            'Ext.grid.filters.Filters'
        ],

        title : i18n.gettext('Timesheet Layouts'),

        layout : 'fit',

        controller : {
            type : 'criterion_employer_gridview',
            externalUpdate : false,
            showTitleInConnectedViewMode : true,
            connectParentView : {
                parentForSpecified : true
            },
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_timesheet_layout',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ]
            }
        },

        plugins : [
            'gridfilters'
        ],

        store : {
            type : 'criterion_timesheet_types',
            autoSync : false
        },

        viewModel : {
            stores : {
                employeeGroups : {
                    type : 'criterion_employee_groups',
                    autoLoad : true
                }
            }
        },

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                dataIndex : 'name',
                filter : false,
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                dataIndex : 'employeeGroups',
                flex : 2,
                text : i18n.gettext('Employee Groups'),
                filter : true,
                renderer : function(value) {
                    return Ext.isArray(value) ? value.join(', ') : '';
                }
            },
            {
                xtype : 'criterion_codedatacolumn',
                dataIndex : 'frequencyCd',
                codeDataId : criterion.consts.Dict.PAY_FREQUENCY,
                text : i18n.gettext('Frequency'),
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                filter : false
            },
            {
                xtype : 'criterion_codedatacolumn',
                dataIndex : 'timesheetFormatCd',
                codeDataId : criterion.consts.Dict.TIMESHEET_FORMAT,
                text : i18n.gettext('Format'),
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                filter : false
            }
        ]
    };

});
