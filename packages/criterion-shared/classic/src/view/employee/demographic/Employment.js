Ext.define('criterion.view.employee.demographic.Employment', function() {

    const DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_employee_demographic_employment',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.employee.demographic.Employment',
            'criterion.view.CustomFieldsContainer',
            'criterion.view.employee.demographic.SelectWorkLocations',
            'criterion.store.WorkLocations',
            'criterion.store.employer.WorkLocations',
            'criterion.store.employee.WorkLocations'

        ],

        cls : 'criterion-form',

        controller : {
            type : 'criterion_employee_demographic_employment'
        },

        config : {
            requireWorkLocation : false
        },

        viewModel : {
            data : {
                showCustomfields : true
            },
            stores : {
                workLocations : {
                    type : 'work_locations'
                },
                employerWorkLocations : {
                    type : 'employer_work_locations'
                },
                employeeWorkLocations : {
                    type : 'criterion_employee_work_locations'
                }
            },
            formulas : {
                isReadOnly : data => !!data('isPendingTerminationWorkflow'),
                isPendingWorkflow : data => data('isPendingRelationshipWorkflow') || data('isPendingTerminationWorkflow'),
                isTerminated : data => !!data('employee.terminationDate'),
                isRejected : data => data('employee.assignment.statusCode') === criterion.Consts.WORKFLOW_STATUSES.REJECTED,
                isPositionReporting : function(data) {
                    let employee = data('employee'),
                        employer;

                    if (!employee || !employee.isModel) {
                        return;
                    }

                    employer = Ext.StoreManager.lookup('Employers').getById(employee.get('employerId'));

                    return employer.get('isPositionReporting');
                },
                canDeleteEmployee : function(data) {
                    return !!data('employee.canBeDeleted') && this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE, criterion.SecurityManager.DELETE, false, true));
                },
                canTerminateEmployee : function(data) {
                    return !data('isRejected') && !data('isPendingWorkflow') && !data('isTerminated') && this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TERMINATION, criterion.SecurityManager.ACT, false, true));
                },
                showSingleTerminateButton : data => data('canTerminateEmployee') && !data('canDeleteEmployee'),
                showTerminateDeleteButton : data => data('canTerminateEmployee') && data('canDeleteEmployee'),
                showUnterminateDeleteButton : function(data) {
                    return data('isTerminated') && this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_UNDO_TERMINATION, criterion.SecurityManager.ACT, false, true));
                }
            }
        },

        listeners : {
            scope : 'controller',
            activate : 'handleActivate'
        },

        title : i18n._('Employment Information'),

        buttons : [
            {
                xtype : 'button',
                cls : 'criterion-btn-remove',
                text : i18n._('Terminate'),
                scale : 'small',
                handler : 'handleTerminate',
                hidden : true,
                bind : {
                    hidden : '{!showSingleTerminateButton}'
                }
            },
            {
                xtype : 'criterion_splitbutton',
                cls : 'criterion-btn-remove',
                text : i18n._('Terminate'),
                handler : 'handleTerminate',
                hidden : true,
                bind : {
                    hidden : '{!showTerminateDeleteButton}'
                },
                menu : [
                    {
                        text : i18n._('Delete'),
                        listeners : {
                            click : 'handleDelete'
                        }
                    }
                ]
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                text : i18n._('Unterminate'),
                scale : 'small',
                handler : 'handleUnterminate',
                hidden : true,
                bind : {
                    hidden : '{!showUnterminateDeleteButton}'
                }
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                text : i18n._('Resubmit'),
                scale : 'small',
                handler : 'handleResubmit',
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getComplexSecurityFormula({
                        append : '!isRejected ||',
                        rules : [
                            {
                                key : criterion.SecurityManager.HR_KEYS.EMPLOYEE_RESUBMIT,
                                actName : criterion.SecurityManager.ACT,
                                reverse : true
                            }
                        ]
                    })
                }
            },
            {
                xtype : 'component',
                cls : 'criterion-workflow-pending-changes-tooltip',
                margin : '10 0 0 0',
                html : '<span>&nbsp;</span> ' + i18n._('Highlighted fields were recently changed and being reviewed.'),
                hidden : true,
                bind : {
                    hidden : '{!isPendingWorkflow}'
                }
            },
            '->',
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                text : i18n._('Save'),
                scale : 'small',
                handler : 'handleSave',
                bind : {
                    hidden : criterion.SecurityManager.getComplexSecurityFormula({
                        append : 'isPendingTerminationWorkflow ||',
                        rules : [
                            {
                                key : criterion.SecurityManager.HR_KEYS.EMPLOYEE,
                                actName : criterion.SecurityManager.UPDATE,
                                reverse : true
                            }
                        ]
                    })
                }
            }
        ],

        modelValidation : true,

        recordIds : [
            'employee'
        ],

        initComponent : function() {
            this.items = [
                {
                    xtype : 'container',
                    layout : 'hbox',
                    defaultType : 'container',

                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                    plugins : [
                        'criterion_responsive_column'
                    ],

                    items : [
                        {
                            items : [
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n._('Employee Number'),
                                    allowBlank : false,
                                    bind : {
                                        value : '{employee.employeeNumber}',
                                        readOnly : '{isReadOnly}'
                                    }
                                },
                                {
                                    xtype : 'fieldcontainer',
                                    fieldLabel : i18n._('Work Location'),
                                    layout : 'hbox',
                                    anchor : '100%',
                                    items : [
                                        {
                                            xtype : 'combobox',
                                            valueField : 'id',
                                            displayField : 'description',
                                            queryMode : 'local',
                                            bind : {
                                                store : '{employerWorkLocations}',
                                                value : '{employee.employerWorkLocationId}'
                                            },
                                            flex : 1,
                                            editable : false,
                                            readOnly : true
                                        },
                                        {
                                            xtype : 'button',
                                            reference : 'selectWorkLocation',
                                            margin : '0 0 0 5',
                                            cls : 'criterion-btn-primary',
                                            text : i18n._('Select'),
                                            scale : 'small',
                                            listeners : {
                                                click : 'handleSelectWorkLocation'
                                            },
                                            bind : {
                                                disabled : '{isReadOnly}',
                                                hidden : '{isReadOnly}'
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype : 'datefield',
                                    fieldLabel : i18n._('Hire Date'),
                                    allowBlank : false,
                                    bind : {
                                        value : '{employee.hireDate}',
                                        readOnly : '{isReadOnly}'
                                    }
                                },
                                {
                                    xtype : 'datefield',
                                    fieldLabel : i18n._('Original Hire Date'),
                                    bind : {
                                        value : '{employee.hireDateOriginal}',
                                        readOnly : '{isReadOnly}'
                                    }
                                },
                                {
                                    xtype : 'datefield',
                                    fieldLabel : i18n._('Adjusted Hire Date'),
                                    bind : {
                                        value : '{employee.hireDateAdjusted}',
                                        readOnly : '{isReadOnly}'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n._('Badge Number'),
                                    bind : {
                                        value : '{employee.badgeNumber}',
                                        readOnly : '{isReadOnly}'
                                    }
                                }
                            ]
                        },
                        {
                            items : [
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n._('Eligible for Rehire'),
                                    bind : {
                                        value : '{employee.eligibleForRehire}',
                                        readOnly : '{isReadOnly}'
                                    },
                                    allowBlank : true
                                },
                                {
                                    xtype : 'container',
                                    margin : '0 0 18 0',
                                    layout : {
                                        type : 'vbox',
                                        align : 'stretch'
                                    },

                                    items : [
                                        {
                                            xtype : 'datefield',
                                            reference : 'terminationDate',
                                            fieldLabel : i18n._('Termination Date'),
                                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                                            margin : 0,
                                            bind : {
                                                value : '{employee.terminationDate}'
                                            },
                                            readOnly : true
                                        },
                                        {
                                            xtype : 'label',
                                            hidden : true,
                                            cls : 'approval-pending',
                                            margin : '0 0 0 205',
                                            html : i18n._('Approval Pending'),
                                            bind : {
                                                hidden : '{!isPendingTerminationWorkflow}'
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype : 'container',
                                    margin : '0 0 18 0',
                                    layout : {
                                        type : 'vbox',
                                        align : 'stretch'
                                    },

                                    items : [
                                        {
                                            xtype : 'criterion_code_detail_field',
                                            fieldLabel : i18n._('Termination Reason'),
                                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                                            reference : 'terminationReason',
                                            codeDataId : DICT.TERMINATION,
                                            margin : 0,
                                            bind : {
                                                value : '{employee.terminationCd}'
                                            },
                                            readOnly : true,
                                            allowBlank : true
                                        },
                                        {
                                            xtype : 'label',
                                            hidden : true,
                                            cls : 'approval-pending',
                                            margin : '0 0 0 205',
                                            html : i18n._('Approval Pending'),
                                            bind : {
                                                hidden : '{!isPendingTerminationWorkflow}'
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n._('Union Number'),
                                    bind : {
                                        value : '{employee.unionNumber}',
                                        readOnly : '{isReadOnly}'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n._('Payroll Number'),
                                    bind : {
                                        value : '{employee.payrollNumber}',
                                        readOnly : '{isReadOnly}'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n._('Payroll Notes'),
                                    bind : {
                                        value : '{employee.payrollNotes}',
                                        readOnly : '{isReadOnly}'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype : 'criterion_employee_reporting_structures',
                    reference : 'reportingStructures',

                    layout : 'hbox',
                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                    defaultType : 'container',

                    bind : {
                        employerId : '{employee.employerId}',
                        employeeId : '{employee.id}',
                        isPositionReporting : '{isPositionReporting}',
                        disabled : '{isReadOnly || isPositionReporting}'
                    },

                    plugins : [
                        'criterion_responsive_column'
                    ]
                },
                {
                    xtype : 'criterion_customfields_container',
                    reference : 'customfieldsEmployee',
                    entityType : criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_EMPLOYEE,
                    labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                    bind : {
                        hidden : '{!showCustomfields}',
                        readOnly : '{isReadOnly}'
                    }
                }
            ];

            this.callParent(arguments);
        }

    };

});
