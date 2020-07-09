Ext.define('criterion.view.employee.timesheet.dashboard.Submit', function() {

    return {

        extend : 'Ext.form.Panel',

        alias : 'widget.criterion_employee_timesheet_dashboard_submit',

        requires : [
            'criterion.controller.employee.timesheet.dashboard.Submit',
            'criterion.store.dashboard.subordinateTimesheet.MassSubmit'
        ],

        cls : 'criterion-employee-timesheet-dashboard-submit',

        title : i18n.gettext('Mass submission'),

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_2_WIDTH,
                modal : true
            }
        ],

        controller : {
            type : 'criterion_employee_timesheet_dashboard_submit'
        },

        listeners : {
            show : 'handleShow'
        },

        viewModel : {
            data : {
                isManualDay : true
            },
            stores : {
                massSubmit : {
                    type : 'criterion_dashboard_subordinate_timesheet_mass_submit'
                }
            },
            formulas : {
                hideHours : data => data('isManualDay')
            }
        },

        draggable : true,

        bodyPadding : 20,

        items : [

            {
                xtype : 'criterion_gridpanel',
                reference : 'massSubmitGrid',
                bind : {
                    store : '{massSubmit}'
                },
                height : 300,
                cls : 'employees-grid',

                selModel : {
                    selType : 'checkboxmodel',
                    mode : 'MULTI'
                },

                columns : {
                    items : [
                        {
                            xtype : 'gridcolumn',
                            flex : 1,
                            text : i18n.gettext('Last Name'),
                            dataIndex : 'lastName'
                        },
                        {
                            xtype : 'gridcolumn',
                            flex : 1,
                            text : i18n.gettext('First Name'),
                            dataIndex : 'firstName'
                        },
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Hours'),
                            dataIndex : 'totalHours',
                            menuDisabled : true,
                            sortable : false,
                            width : 150,
                            hidden : false,
                            bind : {
                                hidden : '{hideHours}'
                            },
                            renderer : function(value) {
                                return criterion.Utils.timeObjToStr(criterion.Utils.hourStrParse((value || 0) + '', true));
                            }
                        },
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Days'),
                            dataIndex : 'totalDays',
                            menuDisabled : true,
                            sortable : false,
                            width : 150,
                            hidden : true,
                            bind : {
                                hidden : '{!hideHours}'
                            }
                        }
                    ]
                }
            }
        ],

        buttons : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                ui : 'light',
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Submit'),
                handler : 'handleMassSubmit',
                disabled : true,
                bind : {
                    disabled : '{!massSubmitGrid.selection}'
                }
            }
        ]
    }
});
