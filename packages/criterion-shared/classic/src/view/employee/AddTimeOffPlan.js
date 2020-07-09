Ext.define('criterion.view.employee.AddTimeOffPlan', function() {

    return {
        alias : 'widget.employee_add_time_off_plan',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.employee.TimeOffPlansAvailable',
            'criterion.controller.employee.AddTimeOffPlan'
        ],

        controller : {
            type : 'employee_add_time_off_plan'
        },

        cls : 'criterion-grid-panel criterion-modal',

        modal : true,

        title : i18n.gettext('Add Time Off Plan to Employee'),

        viewModel : {
            data : {
                employeeId : null
            },
            stores : {
                availablePlans : {
                    type : 'criterion_employee_time_off_plans_available',
                    proxy : {
                        extraParams : {
                            employeeId : '{employeeId}'
                        }
                    }
                }
            }
        },

        bind : {
            store : '{availablePlans}'
        },

        selType : 'checkboxmodel',

        tbar : null,

        buttons : [
            {
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                listeners : {
                    click : 'onCancel'
                }
            },
            '->',
            {
                text : i18n.gettext('Add Plans to Employee'),
                reference : 'addButton',
                listeners : {
                    click : 'onAdd'
                },
                disabled : true
            }
        ],

        listeners : {
            selectionchange : 'onSelectionChange'
        },

        columns : [
            {
                text : i18n.gettext('Code'),
                dataIndex : 'code',
                flex : 1
            },
            {
                text : i18n.gettext('Name'),
                dataIndex : 'name',
                flex : 1
            },
            {
                xtype : 'widgetcolumn',
                text : i18n.gettext('Start Date'),
                width : 130,
                widget : {
                    xtype : 'datefield',
                    bind : {
                        value : '{record.startDate}'
                    }
                }
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('End Date'),
                dataIndex : 'endDate',
                width : 130
            }
        ]
    };

});
