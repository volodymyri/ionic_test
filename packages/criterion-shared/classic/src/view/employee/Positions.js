Ext.define('criterion.view.employee.Positions', {

    alias : 'widget.criterion_employee_positions',

    extend : 'criterion.view.GridView',

    requires : [
        'criterion.store.assignment.Additional',
        'criterion.controller.employee.Positions'
    ],

    viewModel : {

        data : {
            isTerminated : false
        },

        stores : {
            assignments : {
                type : 'criterion_assignment_additional'
            }
        }
    },

    listeners : {
        scope : 'controller',
        activate : 'handleActivate'
    },

    bind : {
        store : '{assignments}'
    },

    controller : {
        type : 'criterion_employee_positions'
    },

    useDefaultTbar : false,
    useDefaultActionColumn : false,
    rowEditing : false,
    bodyPadding : 0,
    sortableColumns : false,

    tbar : {
        bind : {
            hidden : '{isTerminated}'
        },
        items : [
            {
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                scale : 'small',
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getComplexSecurityFormula({
                        append : 'isTerminated ||',
                        rules : [
                            {
                                key : criterion.SecurityManager.HR_KEYS.EMPLOYEE_ADDITIONAL_POSITIONS,
                                actName : criterion.SecurityManager.CREATE,
                                reverse : true
                            }
                        ]
                    })
                },
                listeners : {
                    click : 'handleAddClick'
                }
            }
        ]
    },

    columns : [
        {
            xtype : 'gridcolumn',
            text : i18n.gettext('Title'),
            dataIndex : 'assignmentDetailTitle',
            flex : 2
        },
        {
            xtype : 'gridcolumn',
            dataIndex : 'employmentStatus',
            text : i18n.gettext('Employment Status'),
            flex : 2
        },
        {
            xtype : 'datecolumn',
            text : i18n.gettext('Start Date'),
            dataIndex : 'effectiveDate',
            flex : 1
        }
    ]

});
