Ext.define('criterion.view.employee.Timesheets', function() {

    return {
        alias : 'widget.criterion_employee_timesheets',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.controller.employee.Timesheets',
            'criterion.store.employee.Timesheets'
        ],

        viewModel : {
            data : {
                hideHours : false
            },
            stores : {
                employeeTimesheets : {
                    type : 'criterion_employee_timesheets'
                }
            }
        },

        bind : {
            store : '{employeeTimesheets}'
        },

        controller : {
            type : 'criterion_employee_timesheets',
            reloadAfterEditorSave : true
        },

        header : {

            title : i18n.gettext('Timesheets'),

            items : [
                {
                    xtype : 'tbfill'
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
                },
                {
                    xtype : 'tbspacer'
                },
                {
                    xtype : 'criterion_splitbutton',
                    text : i18n.gettext('Add New'),
                    ui : 'feature',
                    width : 150,
                    listeners : {
                        click : 'handleAddClick'
                    },
                    menu : [
                        {
                            text : i18n.gettext('Prior Timesheet'),
                            listeners : {
                                click : 'handleCreatePriorTimesheet'
                            }
                        }
                    ]
                }
            ]
        },

        tbar : null,

        viewConfig : {
            getRowClass : record => record.get('isCurrent') && 'active'
        },

        columns : [
            {
                xtype : 'datecolumn',
                flex : 1,
                text : i18n.gettext('Start Date'),
                dataIndex : 'startDate'
            },
            {
                xtype : 'datecolumn',
                flex : 1,
                text : i18n.gettext('End Date'),
                dataIndex : 'endDate'
            },
            {
                xtype : 'gridcolumn',
                flex : 3,
                text : i18n.gettext('Total Hours'),
                dataIndex : 'formattedTotalHours',
                hidden : false,
                bind : {
                    hidden : '{hideHours}'
                }
            },
            {
                xtype : 'gridcolumn',
                flex : 3,
                text : i18n.gettext('Total Days'),
                dataIndex : 'totalDays',
                hidden : true,
                bind : {
                    hidden : '{!hideHours}'
                }
            },
            {
                xtype : 'criterion_codedatacolumn',
                codeDataId : criterion.consts.Dict.WORKFLOW_STATE,
                text : i18n.gettext('Status'),
                dataIndex : 'statusCd',
                flex : 1
            }//<debug>
            // for dev purposes
            , {
                xtype : 'gridcolumn',
                text : i18n.gettext('Type'),
                dataIndex : 'formatCode',
                width : 100
            }
            //</debug>
        ]
    };
});
