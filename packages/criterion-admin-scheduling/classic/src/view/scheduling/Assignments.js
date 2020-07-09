Ext.define('criterion.view.scheduling.Assignments', {

    extend : 'criterion.view.GridView',

    alias : 'widget.criterion_scheduling_assignments',

    requires : [
        'criterion.controller.scheduling.Assignments',
        'criterion.view.scheduling.shift.AssignmentDetail',
        'criterion.store.employer.ShiftOccurrences'
    ],

    viewModel : {
        data : {
            employerId : null
        },
        stores : {
            shiftOccurrences : {
                type : 'criterion_employer_shift_occurrences'
            }
        }
    },

    tbar : null,

    controller : {
        type : 'criterion_scheduling_assignments',
        baseRoute : criterion.consts.Route.SCHEDULING.ASSIGNMENT,
        reloadAfterEditorSave : true,
        reloadAfterEditorDelete : true,
        editor : {
            xtype : 'criterion_scheduling_shift_assignment_detail',
            allowDelete : false,
            plugins : [
                {
                    ptype : 'criterion_sidebar'
                }
            ]
        }
    },

    bind : {
        store : '{shiftOccurrences}'
    },

    dockedItems : [
        {
            xtype : 'panel',
            dock : 'left',

            cls : 'criterion-side-panel',

            width : 300,

            layout : {
                type : 'vbox',
                align : 'stretch'
            },
            autoScroll : true,

            items : [
                {
                    layout : 'hbox',
                    cls : 'criterion-side-field',
                    padding : '26 20',

                    items : [
                        {
                            xtype : 'button',
                            flex : 1,
                            text : i18n.gettext('Add Shift Assignment'),
                            textAlign : 'left',
                            handler : 'handleAddAssignmentClick',
                            cls : 'criterion-btn-side-add',
                            hidden : true,
                            bind : {
                                hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.SCHEDULING_ASSIGNMENT, criterion.SecurityManager.CREATE, true)
                            }
                        }
                    ]
                },
                {
                    xtype : 'form',
                    reference : 'searchForm',

                    defaults : {
                        labelAlign : 'top',
                        width : '100%',
                        cls : 'criterion-side-field'
                    },

                    items : [
                        {
                            xtype : 'criterion_employer_combo',
                            fieldLabel : i18n.gettext('Employer'),
                            name : 'employerId',
                            autoSetFirst : true,
                            reference : 'employerCombo',
                            listeners : {
                                change : 'handleSearchComboChange'
                            },
                            listConfig : {
                                cls : 'criterion-side-list',
                                shadow : false
                            },
                            bind : {
                                value : '{employerId}'
                            }
                        },
                        {
                            xtype : 'textfield',
                            fieldLabel : i18n.gettext('Shift Group'),
                            name : 'groupName',
                            enableKeyEvents : true,
                            listeners : {
                                keypress : 'onKeyPress'
                            }
                        },
                        {
                            xtype : 'datefield',
                            fieldLabel : i18n.gettext('Start Date')
                        }
                    ]
                },
                {
                    layout : 'hbox',
                    padding : 20,
                    items : [
                        {
                            flex : 1
                        },
                        {
                            xtype : 'button',
                            text : i18n.gettext('Search'),
                            cls : 'criterion-btn-primary',
                            listeners : {
                                click : 'handleSearchButtonClick'
                            }
                        }
                    ]
                }
            ]
        }
    ],

    columns : [
        {
            text : i18n.gettext('Employer'),
            dataIndex : 'employerName',
            flex : 1
        },
        {
            text : i18n.gettext('Shift Group'),
            dataIndex : 'shiftGroupName',
            flex : 1
        },
        {
            xtype : 'datecolumn',
            text : i18n.gettext('Start Date'),
            dataIndex : 'startDate',
            flex : 1
        },
        {
            text : i18n.gettext('Employee Count'),
            dataIndex : 'employeesCount',
            flex : 1
        }
    ]

});
