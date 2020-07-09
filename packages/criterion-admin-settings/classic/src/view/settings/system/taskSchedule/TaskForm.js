Ext.define('criterion.view.settings.system.taskSchedule.TaskForm', function() {

    const SCHEDULE_TASK_RECIPIENT_TYPES = criterion.Consts.SCHEDULE_TASK_RECIPIENT_TYPES,
        SCHEDULE_TASK_TYPE = criterion.Consts.SCHEDULE_TASK_TYPE,
        SYSTEM_LEVEL_TASKS = criterion.Consts.SYSTEM_LEVEL_TASKS;

    return {
        alias : 'widget.criterion_settings_task_schedule_task_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.system.taskSchedule.TaskForm',
            'criterion.store.ExternalSystems',
            'criterion.model.codeTable.Detail',
            'criterion.store.Apps'
        ],

        bodyPadding : 20,

        title : i18n.gettext('Task Detail'),

        modal : true,
        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                modal : true
            }
        ],
        draggable : true,

        allowDelete : true,

        controller : {
            type : 'criterion_settings_task_schedule_task_form',
            showDeleteConfirm : false
        },

        listeners : {
            show : 'handleShow'
        },

        viewModel : {
            formulas : {
                isReport : data => data('record.type') === SCHEDULE_TASK_TYPE.REPORT.value,
                isTransfer : data => data('record.type') === SCHEDULE_TASK_TYPE.TRANSFER.value,
                isSystemTask : data => data('record.type') === SCHEDULE_TASK_TYPE.SYSTEM.value,
                isApp : data => data('record.type') === SCHEDULE_TASK_TYPE.APP.value,

                isEmployeeGroupAsRecipients : data => !data('hideRecipients') && data('record.recipientType') === SCHEDULE_TASK_RECIPIENT_TYPES.EMPLOYEE_GROUP.value,
                isEmployeeListAsRecipients : data => !data('hideRecipients') && data('record.recipientType') === SCHEDULE_TASK_RECIPIENT_TYPES.EMPLOYEE_LIST.value,
                isEmailListAsRecipients : data => !data('hideRecipients') && data('record.recipientType') === SCHEDULE_TASK_RECIPIENT_TYPES.EMAIL_LIST.value,
                isOrgListAsRecipients : data => !data('hideRecipients') && data('record.recipientType') === SCHEDULE_TASK_RECIPIENT_TYPES.ORG_LIST.value,

                isExternalSystem : data => data('record.recipientType') === SCHEDULE_TASK_RECIPIENT_TYPES.SFTP.value,

                filterTaskType : data => {
                    if (data('isTransfer')) {
                        return [SCHEDULE_TASK_RECIPIENT_TYPES.ORG_LIST.value];
                    } else if (data('isSystemTask')) {
                        return [SCHEDULE_TASK_RECIPIENT_TYPES.SFTP.value];
                    } else {
                        return [
                            SCHEDULE_TASK_RECIPIENT_TYPES.ORG_LIST.value,
                            SCHEDULE_TASK_RECIPIENT_TYPES.SFTP.value
                        ];
                    }
                },

                employeeGroupList : {
                    get : function(data) {
                        return (data('record.employeeGroupList') || '').split(';');
                    },
                    set : function(value) {
                        this.set('record.employeeGroupList', value.join(';'));
                    }
                },

                orgList : {
                    get : function(data) {
                        return (data('record.orgList') || '').split(';');
                    },
                    set : function(value) {
                        this.set('record.orgList', value.join(';'));
                    }
                },

                systemTaskHasOptions : data => Ext.Array.contains([SYSTEM_LEVEL_TASKS.TIME_OFF_PLAN_ACCRUALS, SYSTEM_LEVEL_TASKS.BENEFIT_PLAN_CALCULATION], data('record.systemTaskCode')),
                isSystemTimesheetAlertsTask : data => data('isSystemTask') && data('record.systemTaskCode') === criterion.Consts.SYSTEM_LEVEL_TASKS.TIMESHEET_ALERTS,

                hideRecipients : data => (data('isSystemTask') && !data('isSystemTimesheetAlertsTask')) || data('isApp')
            },
            stores : {
                searchData : {
                    proxy : {
                        type : 'memory'
                    },
                    fields : [
                        {
                            name : 'id',
                            type : 'string'
                        },
                        {
                            name : 'personId',
                            type : 'integer'
                        },
                        {
                            name : 'firstName',
                            type : 'string'
                        },
                        {
                            name : 'lastName',
                            type : 'string'
                        },
                        {
                            name : 'middleName',
                            type : 'string'
                        },
                        {
                            name : 'positionTitle',
                            type : 'string'
                        },
                        {
                            name : 'employerId',
                            type : 'integer'
                        },
                        {
                            name : 'employerName',
                            type : 'string'
                        }
                    ]
                },
                recipientTypes : {
                    fields : ['value', 'text'],
                    data : Ext.Object.getValues(SCHEDULE_TASK_RECIPIENT_TYPES),
                    filters : [{
                        property : 'value',
                        value : '{filterTaskType}',
                        operator : 'notin'
                    }]
                },
                externalSystems : {
                    type : 'criterion_external_systems',
                    autoLoad : true
                },
                apps : {
                    type : 'criterion_apps',
                    autoLoad : true,
                    proxy : {
                        extraParams : {
                            invocationType : criterion.Consts.APP_INVOCATION_TYPES.SCHEDULER
                        }
                    }
                },
                orgStructure : {
                    proxy : {
                        type : 'memory'
                    },
                    model : 'criterion.model.codeTable.Detail',
                    sorters : [
                        {
                            property : 'attribute1',
                            direction : 'ASC'
                        }
                    ],
                    filters : [
                        {
                            property : 'isActive',
                            value : true
                        }
                    ]
                }
            }
        },

        disabled : false,

        bind : {
            disabled : '{blockedState}'
        },

        items : [
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Type'),
                valueField : 'value',
                sortByDisplayField : false,
                allowBlank : false,
                editable : false,
                store : Ext.create('Ext.data.Store', {
                    fields : ['value', 'text'],
                    data : Ext.Object.getValues(SCHEDULE_TASK_TYPE)
                }),
                bind : {
                    value : '{record.type}'
                },
                listeners : {
                    change : 'handleChangeTaskType'
                }
            },
            // Report
            {
                xtype : 'container',
                layout : 'hbox',
                margin : '0 0 10 0',
                hidden : true,
                bind : {
                    hidden : '{!isReport}'
                },
                items : [
                    {
                        xtype : 'textfield',
                        flex : 1,
                        fieldLabel : i18n.gettext('Report'),
                        bind : {
                            value : '{record.reportName}',
                            disabled : '{!isReport}'
                        },
                        readOnly : true,
                        allowBlank : false
                    },
                    {
                        xtype : 'button',
                        scale : 'small',
                        margin : '0 0 0 3',
                        cls : 'criterion-btn-light',
                        glyph : criterion.consts.Glyph['ios7-search'],
                        handler : 'handleReportSearch'
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Options'),
                        margin : '0 0 0 5',
                        cls : 'criterion-btn-feature',
                        hidden : true,
                        disabled : true,
                        bind : {
                            hidden : '{!record.reportId}',
                            disabled : '{!reportOptionsLoaded}'
                        },
                        handler : 'handleOpenReportOptions'
                    }
                ]
            },
            // Transfer
            {
                xtype : 'container',
                layout : 'hbox',
                margin : '0 0 10 0',
                hidden : true,
                bind : {
                    hidden : '{!isTransfer}'
                },
                items : [
                    {
                        xtype : 'textfield',
                        flex : 1,
                        fieldLabel : i18n.gettext('Transfer'),
                        bind : {
                            value : '{record.transferName}',
                            disabled : '{!isTransfer}'
                        },
                        readOnly : true,
                        allowBlank : false
                    },
                    {
                        xtype : 'button',
                        scale : 'small',
                        margin : '0 0 0 3',
                        cls : 'criterion-btn-light',
                        glyph : criterion.consts.Glyph['ios7-search'],
                        handler : 'handleTransferSearch'
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Options'),
                        margin : '0 0 0 5',
                        cls : 'criterion-btn-feature',
                        hidden : true,
                        bind : {
                            hidden : '{!record.transferId}'
                        },
                        handler : 'handleOpenTransferOptions'
                    }
                ]
            },
            // System
            {
                xtype : 'container',
                layout : 'hbox',
                margin : '0 0 10 0',
                hidden : true,
                bind : {
                    hidden : '{!isSystemTask}'
                },
                items : [
                    {
                        xtype : 'criterion_code_detail_field',
                        codeDataId : criterion.consts.Dict.SYSTEM_LEVEL_TASK,
                        fieldLabel : i18n.gettext('Task'),
                        flex : 1,
                        bind : {
                            value : '{record.systemTaskCd}',
                            disabled : '{!isSystemTask}'
                        },
                        allowBlank : false
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Options'),
                        margin : '0 0 0 5',
                        cls : 'criterion-btn-feature',
                        hidden : true,
                        width : 100,
                        bind : {
                            hidden : '{!systemTaskHasOptions}'
                        },
                        handler : 'handleOpenSystemTaskOptions'
                    }
                ]
            },
            // App
            {
                xtype : 'container',
                layout : 'hbox',
                margin : '0 0 10 0',
                hidden : true,
                bind : {
                    hidden : '{!isApp}'
                },
                items : [
                    {
                        xtype : 'textfield',
                        flex : 1,
                        fieldLabel : i18n.gettext('App'),
                        bind : {
                            value : '{record.appName}',
                            disabled : '{!isApp}'
                        },
                        readOnly : true,
                        allowBlank : false
                    },
                    {
                        xtype : 'button',
                        scale : 'small',
                        margin : '0 0 0 3',
                        cls : 'criterion-btn-light',
                        glyph : criterion.consts.Glyph['ios7-search'],
                        handler : 'handleAppSearch'
                    }
                ]
            },

            // Recipients
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Recipient Type'),
                valueField : 'value',
                sortByDisplayField : false,
                allowBlank : false,
                editable : false,
                hidden : true,
                bind : {
                    store : '{recipientTypes}',
                    value : '{record.recipientType}',
                    hidden : '{hideRecipients}',
                    disabled : '{hideRecipients}'
                }
            },

            // Employee Groups
            {
                xtype : 'tagfield',
                fieldLabel : i18n.gettext('Employee Groups'),
                hidden : true,
                bind : {
                    store : '{employeeGroups}',
                    value : '{employeeGroupList}',
                    hidden : '{!isEmployeeGroupAsRecipients}',
                    disabled : '{!isEmployeeGroupAsRecipients}'
                },
                allowBlank : false,
                delimiter : ';',
                queryMode : 'local',
                valueField : 'id',
                displayField : 'name'
            },

            // Employee List
            {
                xtype : 'container',
                layout : 'hbox',
                margin : '0 0 10 0',
                hidden : true,
                bind : {
                    hidden : '{!isEmployeeListAsRecipients}'
                },
                items : [
                    {
                        xtype : 'textfield',
                        flex : 1,
                        fieldLabel : i18n.gettext('Recipients'),
                        bind : {
                            value : '{record.employeeListNames}',
                            disabled : '{!isEmployeeListAsRecipients}'
                        },
                        readOnly : true,
                        allowBlank : false
                    },
                    {
                        xtype : 'button',
                        scale : 'small',
                        margin : '0 0 0 3',
                        cls : 'criterion-btn-light',
                        glyph : criterion.consts.Glyph['ios7-search'],
                        handler : 'handleEmployeeSearch'
                    }
                ]
            },

            // Email list
            {
                xtype : 'textfield',
                flex : 1,
                fieldLabel : i18n.gettext('Recipients'),
                hidden : true,
                disabled : true,
                bind : {
                    value : '{record.emailList}',
                    hidden : '{!isEmailListAsRecipients}',
                    disabled : '{!isEmailListAsRecipients}'
                },
                allowBlank : false
            },

            // External System
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('External System'),
                valueField : 'id',
                displayField : 'externalSystemName',
                allowBlank : false,
                editable : false,
                hidden : true,
                queryMode : 'local',
                forceSelection : true,
                autoSelect : true,
                bind : {
                    store : '{externalSystems}',
                    value : '{record.externalSystemId}',
                    hidden : '{!isExternalSystem}',
                    disabled : '{!isExternalSystem}'
                }
            },

            // Org Structure List
            {
                xtype : 'tagfield',
                fieldLabel : i18n.gettext('Org Structure'),
                hidden : true,
                bind : {
                    store : '{orgStructure}',
                    value : '{orgList}',
                    hidden : '{!isOrgListAsRecipients}',
                    disabled : '{!isOrgListAsRecipients}'
                },
                allowBlank : false,
                delimiter : ';',
                queryMode : 'local',
                valueField : 'id',
                displayField : 'description'
            }
        ]
    };

});
