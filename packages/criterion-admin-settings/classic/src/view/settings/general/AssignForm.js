Ext.define('criterion.view.settings.general.AssignForm', function() {

    return {

        alias : 'widget.criterion_settings_general_assign_form',

        extend : 'criterion.view.common.AssignBase',

        requires : [
            'criterion.controller.settings.general.AssignForm',
            'criterion.store.Workflows'
        ],

        controller : {
            type : 'criterion_settings_general_assign_form'
        },

        viewModel : {
            data : {
                workflowId : null,
                workflowEmployerId : null,
                comment : '',
                dueDate : null,
                isShare : false,
                assignedEmployeeName : null,
                assignedEmployeeId : null
            },
            stores : {
                workflows : {
                    type : 'criterion_workflows',
                    filters : [
                        {
                            property : 'workflowTypeCode',
                            value : criterion.Consts.WORKFLOW_TYPE_CODE.FORM
                        }
                    ]
                }
            },
            formulas : {
                reqEmployerId : data => data('workflowEmployerId'),
                title : data => data('selectEmployeesMode') ? i18n.gettext('Form Assignment > Select Employees') : i18n.gettext('Form Assignment'),
                allowAssign : data => {
                    return (data('employeeGroupIds').length || data('employeeIds').length) && data('workflowId') && data('comment') && data('dueDate');
                }
            }
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : '90%'
            }
        ],

        getFormFields() {
            return [
                {
                    xtype : 'combobox',
                    fieldLabel : i18n.gettext('Workflow'),
                    editable : false,
                    forceSelection : true,
                    autoSelect : true,
                    name : 'workflowId',
                    allowBlank : false,
                    bind : {
                        value : '{workflowId}',
                        store : '{workflows}'
                    },
                    displayField : 'name',
                    margin : '0 0 8 0',
                    valueField : 'id',
                    listeners : {
                        change : 'handleWorkflowChange'
                    }
                },
                {
                    xtype : 'component',
                    autoEl : 'hr',
                    margin : '0 0 8 0',
                    cls : 'criterion-horizontal-ruler'
                },
                {
                    xtype : 'criterion_tagfield',
                    fieldLabel : i18n.gettext('Employee Group'),
                    disabled : true,
                    bind : {
                        store : '{employeeGroups}',
                        value : '{employeeGroupIds}',
                        disabled : '{!workflowId}'
                    },
                    queryMode : 'local',
                    valueField : 'id',
                    growMax : 100,
                    displayField : 'name'
                },
                {
                    xtype : 'fieldcontainer',
                    layout : 'hbox',
                    fieldLabel : i18n.gettext('Employees'),
                    margin : '0 0 8 0',
                    items : [
                        {
                            xtype : 'criterion_tagfield',
                            flex : 1,
                            hideTrigger : true,
                            triggerOnClick : false,
                            disabled : true,
                            editable : false,
                            bind : {
                                store : '{employeeSelected}',
                                value : '{employeeIds}',
                                disabled : '{!workflowId}'
                            },
                            queryMode : 'local',
                            valueField : 'id',
                            growMax : 100,
                            displayField : 'name'
                        },
                        {
                            xtype : 'button',
                            scale : 'small',
                            margin : '0 0 0 3',
                            cls : 'criterion-btn-light',
                            glyph : criterion.consts.Glyph['ios7-search'],
                            handler : 'handleEmployeeSearch',
                            hidden : true,
                            bind : {
                                hidden : '{!workflowId}'
                            }
                        }
                    ]
                },
                {
                    xtype : 'fieldcontainer',
                    layout : 'hbox',
                    fieldLabel : i18n.gettext('Assigned to fill'),
                    items : [
                        {
                            xtype : 'textfield',
                            flex : 1,
                            editable : false,
                            bind : {
                                value : '{assignedEmployeeName}'
                            },
                            cls : Ext.baseCSSPrefix + 'form-readonly',
                            triggers : {
                                clear : {
                                    type : 'clear',
                                    cls : 'criterion-clear-trigger',
                                    hideWhenEmpty : true,
                                    handler : 'handleClearAssignedEmployee'
                                }
                            }
                        },
                        {
                            xtype : 'button',
                            scale : 'small',
                            margin : '0 0 0 3',
                            cls : 'criterion-btn-light',
                            glyph : criterion.consts.Glyph['ios7-search'],
                            bind : {
                                disabled : '{!workflowId}'
                            },
                            listeners : {
                                click : 'handleAssignToEmployeeSearch'
                            }
                        }
                    ]
                },
                {
                    xtype : 'component',
                    autoEl : 'hr',
                    margin : '0 0 8 0',
                    cls : 'criterion-horizontal-ruler'
                },
                {
                    xtype : 'textfield',
                    name : 'description',
                    allowBlank : false,
                    fieldLabel : i18n.gettext('Description'),
                    bind : '{comment}'
                },
                {
                    xtype : 'datefield',
                    fieldLabel : i18n.gettext('Due Date'),
                    name : 'dueDate',
                    allowBlank : false,
                    bind : {
                        value : '{dueDate}'
                    }
                },
                {
                    xtype : 'toggleslidefield',
                    inputValue : true,
                    fieldLabel : i18n.gettext('Share with employee'),
                    name : 'isShare',
                    bind : '{isShare}'
                }
            ];
        }
    };
});
