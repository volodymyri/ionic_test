Ext.define('criterion.view.employee.Task', function() {

    return {
        alias : 'widget.criterion_employee_task',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.employee.Task',
            'criterion.view.employee.task.CodeTableDetails',
            'criterion.model.employee.task.CodeTableDetail'
        ],

        allowDelete : true,

        title : i18n.gettext('Task'),

        controller : {
            type : 'criterion_employee_task',
            externalUpdate : false
        },
        
        viewModel : {
            data : {
                percentSum : 0
            },
            stores : {
                codeTableDetails : {
                    type : 'store',
                    proxy : {
                        type : 'memory'
                    },

                    model : 'criterion.model.employee.task.CodeTableDetail'
                }
            },
            formulas : {
                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TASKS, criterion.SecurityManager.UPDATE, false, true));
                },

                hasCodeTableIds : data => !!data('record.codeTableIds').length,
                isProject : data => !!data('record.projectId'),
                isGroup : data => !!data('record.taskGroupId')
            }
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : 20,

        items : [
            {
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                xtype : 'container',
                layout : 'hbox',

                plugins : [
                    'criterion_responsive_column'
                ],

                items : [
                    {
                        xtype : 'container',

                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Task Name'),
                                readOnly : true,
                                hidden : true,
                                bind : {
                                    hidden : '{isProject || isGroup}',
                                    value : '{record.taskName}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Task Group Name'),
                                readOnly : true,
                                hidden : true,
                                bind : {
                                    hidden : '{!isGroup}',
                                    value : '{record.taskName}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Project Name'),
                                readOnly : true,
                                hidden : true,
                                bind : {
                                    hidden : '{!isProject}',
                                    value : '{record.projectName}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Start Date'),
                                name : 'startDate',
                                hidden : true,
                                bind : {
                                    value : '{record.startDate}',
                                    hidden : '{record.taskGroupId}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('End Date'),
                                name : 'endDate',
                                hidden : true,
                                bind : {
                                    value : '{record.endDate}',
                                    hidden : '{record.taskGroupId}'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'container',

                        items : [
                            {
                                xtype : 'criterion_placeholder_field'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Auto Allocate'),
                                name : 'autoAllocate',
                                hidden : true,
                                bind : {
                                    value : '{record.autoAllocate}',
                                    hidden : '{record.taskGroupId || record.projectId}'
                                },
                                inputValue : true
                            },
                            {
                                xtype : 'criterion_percentage_precision_field',
                                fieldLabel : i18n.gettext('Allocation'),
                                name : 'allocation',
                                minValue : 0.0001,
                                hidden : true,
                                allowBlank : false,
                                bind : {
                                    disabled : '{!record.autoAllocate}',
                                    hidden : '{record.taskGroupId || record.projectId || (!record.taskGroupId && !record.projectId && !record.autoAllocate)}',
                                    value : '{record.allocation}'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'component',
                autoEl : 'hr',
                cls : 'criterion-horizontal-ruler',
                hidden : true,
                bind : {
                    hidden : '{!hasCodeTableIds}'
                }
            },
            {
                xtype : 'criterion_employee_task_code_table_details',
                reference : 'employee_task_code_table_details',
                hidden : true,
                bind : {
                    store : '{codeTableDetails}',
                    codeTableIds : '{record.codeTableIds}',
                    hidden : '{!hasCodeTableIds}'
                }
            }
        ]
    };

});
