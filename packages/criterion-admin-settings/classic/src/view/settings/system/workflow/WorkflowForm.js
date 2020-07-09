Ext.define('criterion.view.settings.system.workflow.WorkflowForm', function() {

    var WORKFLOW_TYPE_CODE = criterion.Consts.WORKFLOW_TYPE_CODE;

    return {
        alias : 'widget.criterion_settings_workflow_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.system.workflow.WorkflowForm',
            'criterion.view.settings.system.workflow.WorkflowSteps',
            'criterion.store.employeeGroup.Workflows'
        ],

        controller : {
            type : 'criterion_settings_workflow_form'
        },

        viewModel : {
            data : {
                isShowEscalationDays : false,
                isShowAutoActionDays : false
            },
            formulas : {
                isEmployeeGroupDisabled : function(data) {
                    return data('record.workflowTypeCode') === WORKFLOW_TYPE_CODE.FORM;
                },
                isTimeOffType : function(data) {
                    return data('record.workflowTypeCode') === WORKFLOW_TYPE_CODE.TIME_OFF
                }
            },
            stores : {
                employeeGroupWorkflows : {
                    type : 'criterion_employee_group_workflows'
                }
            }
        },

        bodyPadding : 0,

        title : i18n.gettext('Workflow Details'),

        items : [
            {
                xtype : 'container',

                layout : {
                    type : 'vbox',
                    align : 'stretch',
                    pack : 'start',
                },

                items : [
                    {
                        layout : 'hbox',

                        plugins : [
                            'criterion_responsive_column'
                        ],
                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_CONDENSED,

                        bodyPadding : '10 0',
                        bodyStyle : {
                            'border-width' : '0 0 1px 0 !important'
                        },

                        items : [
                            {
                                items : [
                                    {
                                        xtype : 'criterion_employer_combo',
                                        fieldLabel : i18n.gettext('Employer'),
                                        name : 'employerId',
                                        disabled : true,
                                        hideTrigger : true
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Name'),
                                        name : 'name',
                                        bind : '{record.name}'
                                    },
                                    {
                                        xtype : 'criterion_code_detail_field',
                                        codeDataId : criterion.consts.Dict.WORKFLOW,
                                        fieldLabel : i18n.gettext('Workflow Type'),
                                        reference : 'workflowTypeField',
                                        name : 'workflowTypeCd',
                                        bind : {
                                            value : '{record.workflowTypeCd}'
                                        },
                                        listeners : {
                                            change : 'onWorkflowTypeChange'
                                        }
                                    },
                                    {
                                        xtype : 'criterion_employee_group_combobox',
                                        reference : 'employeeGroupCombo',
                                        objectParam : 'workflowId',
                                        bind : {
                                            valuesStore : '{employeeGroupWorkflows}',
                                            hidden : '{isEmployeeGroupDisabled}',
                                            disabled : '{isEmployeeGroupDisabled}'
                                        }
                                    },
                                    {
                                        xtype : 'criterion_code_detail_field_multi_select',
                                        fieldLabel : i18n.gettext('Time Off Type'),
                                        reference : 'timeOffTypesCombo',
                                        codeDataId : criterion.consts.Dict.TIME_OFF_TYPE,
                                        editable : false,
                                        bind : {
                                            hidden : '{!isTimeOffType}',
                                            value : '{record.workflowTimeOffTypes}'
                                        },
                                        listConfig : {
                                            listeners : {
                                                show : 'onTimeOffTypeComboShow'
                                            }
                                        }
                                    },
                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('Escalation Days'),
                                        name : 'escalationDays',
                                        hidden : true,
                                        disabled : true,
                                        bind : {
                                            value : '{record.escalationDays}',
                                            hidden : '{!isShowEscalationDays}',
                                            disabled : '{!isShowEscalationDays}'
                                        },
                                        allowBlank : false
                                    },
                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('Auto Action Days'),
                                        name : 'AutoActionDays',
                                        hidden : true,
                                        disabled : true,
                                        bind : {
                                            value : '{record.autoActionDays}',
                                            hidden : '{!isShowAutoActionDays}',
                                            disabled : '{!isShowAutoActionDays}'
                                        }
                                    },
                                    {
                                        xtype : 'combobox',
                                        fieldLabel : i18n.gettext('Auto Action Type'),
                                        store : Ext.create('Ext.data.Store', {
                                            fields : ['value', 'text'],
                                            data : Ext.Object.getValues(criterion.Consts.WORKFLOW_AUTO_ACTION_TYPE)
                                        }),
                                        hidden : true,
                                        disabled : true,
                                        bind : {
                                            value : '{record.autoActionType}',
                                            hidden : '{!isShowAutoActionDays}',
                                            disabled : '{!isShowAutoActionDays}'
                                        },
                                        valueField : 'value',
                                        displayField : 'text',
                                        queryMode : 'local',
                                        editable : true,
                                        forceSelection : true
                                    }
                                ]
                            },
                            {
                                defaults : {
                                    labelWidth : 180
                                },
                                items : [
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Active'),
                                        name : 'isActive',
                                        bind : '{record.isActive}'
                                    },
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Require Signature'),
                                        bind : {
                                            bind : '{record.isSignature}'
                                        },
                                        name : 'isSignature'
                                    },
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Is Multiple Approve'),
                                        bind : {
                                            bind : '{record.isMultipleApprove}'
                                        },
                                        name : 'isMultipleApprove'
                                    },
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Email Approval'),
                                        hidden : true,
                                        bind : {
                                            bind : '{record.isEmailApproval}',
                                            hidden : '{!isTimeOffType}'
                                        },
                                        name : 'isEmailApproval'
                                    },
                                    {
                                        xtype : 'textarea',
                                        fieldLabel : i18n.gettext('Confirmation Text'),
                                        height : 100,
                                        name : 'confirmText',
                                        bind : {
                                            value : '{record.confirmText}'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype : 'criterion_settings_workflow_steps',
                        flex : 1,
                        scrollable : false,
                        reference : 'steps',
                        listeners : {
                            cancel : 'showGrid',
                            save : 'onSave',
                            trackClick : 'onTrackClick'
                        }
                    }
                ]
            }
        ]
    };

});
