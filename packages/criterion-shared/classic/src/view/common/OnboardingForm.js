Ext.define('criterion.view.common.OnboardingForm', function() {

    const ONBOARDING_TASK_TYPES = criterion.Consts.ONBOARDING_TASK_TYPES,
        SYSTEM_ATTRIBUTE = '1',
        FORM_INTERNAL_TYPE = criterion.Consts.FORM_INTERNAL_TYPE;

    return {

        alias : 'widget.criterion_common_onboarding_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.common.OnboardingForm',
            'criterion.model.employer.onboarding.Detail',

            'criterion.store.WebForms',
            'criterion.store.Workflows',
            'criterion.store.employer.Documents',
            'criterion.store.employer.Videos',
            'criterion.store.employer.Courses',
            'criterion.ux.form.FillableWebForm',
            'criterion.ux.form.FillableDataForm'
        ],

        controller : {
            type : 'criterion_common_onboarding_form'
        },

        bodyPadding : 0,

        viewModel : {
            data : {
                /**
                 * @type criterion.model.employer.onboarding.Detail
                 * @type criterion.model.employee.Onboarding
                 */
                record : undefined,
                employerId : null,
                isSystemTaskType : false,
                dueInDays : true,
                readOnly : false,
                hideDownloadDocumentIcon : false,
                showWorkflowName : false
            },

            formulas : {
                isChangeable : data => data('record.isChangeable'),
                isFormTaskType : data => data('record.onboardingTaskTypeCode') === ONBOARDING_TASK_TYPES.FORM,
                isDocumentTaskType : data => data('record.onboardingTaskTypeCode') === ONBOARDING_TASK_TYPES.DOCUMENT,
                isVideoTaskType : data => data('record.onboardingTaskTypeCode') === ONBOARDING_TASK_TYPES.VIDEO,
                isUserTaskType : data => data('record.onboardingTaskTypeCode') === ONBOARDING_TASK_TYPES.USER_TASK,
                isCourseTaskType : data => data('record.onboardingTaskTypeCode') === ONBOARDING_TASK_TYPES.COURSE,
                isFormTypeAndExists : data => data('isFormTaskType') && !data('record').phantom,
                disableSave : data => {
                    return data('blockedState') || !data('isChangeable');
                },
                formId : data => {
                    let webformId = data('record.webformId'),
                        dataformId = data('record.dataformId');

                    return webformId ? Ext.String.format('{0}-{1}', FORM_INTERNAL_TYPE.WEB, webformId) : Ext.String.format('{0}-{1}', FORM_INTERNAL_TYPE.DATA, dataformId);
                },
                canShowForm : data => criterion.Application.isAdmin() && data('isFormTaskType') && !data('isPhantom') && (data('record.webformId') || data('record.dataformId')),
                hideFillForm : data => !data('canShowForm') || !data('isChangeable'),
                displayEmployeeName : data => data('record.assignedToEmployeeName'),
                assignedToEmployeeLabel : data => data('isUserTaskType') && i18n.gettext('Employee Name') || data('isFormTaskType') && i18n.gettext('Assigned to fill') || ''
            },
            stores : {
                forms : {
                    type : 'criterion_forms',
                    autoLoad : true
                },
                workflows : {
                    type : 'criterion_workflows',
                    filters : [
                        {
                            property : 'workflowTypeCode',
                            value : criterion.Consts.WORKFLOW_TYPE_CODE.EMPLOYEE_ONBOARDING
                        }
                    ]
                },
                webforms : {
                    type : 'criterion_web_forms'
                },
                documents : {
                    type : 'criterion_employer_documents'
                },
                videos : {
                    type : 'criterion_employer_videos'
                },
                courses : {
                    type : 'criterion_employer_courses'
                }
            }
        },

        listeners : {
            show : 'onShow'
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            {
                xtype : 'form',
                ref : 'mainForm',
                bodyPadding : 0,

                items : [
                    {
                        xtype : 'criterion_panel',

                        bodyPadding : '20 20 0 20',
                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                        layout : 'hbox',

                        plugins : [
                            'criterion_responsive_column'
                        ],

                        items : [
                            {
                                items : [
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Name'),
                                        disabled : true,
                                        bind : {
                                            value : '{record.name}',
                                            readOnly : '{readOnly}',
                                            disabled : '{!isChangeable}'
                                        },
                                        allowBlank : false
                                    },
                                    {

                                        xtype : 'criterion_code_detail_field',
                                        codeDataId : criterion.consts.Dict.ONBOARDING_GROUP,
                                        fieldLabel : i18n.gettext('Group'),
                                        disabled : true,
                                        bind : {
                                            value : '{record.onboardingGroupCd}',
                                            readOnly : '{readOnly}',
                                            disabled : '{!isChangeable}'
                                        },
                                        allowBlank : false
                                    },
                                    {

                                        xtype : 'criterion_code_detail_field',
                                        codeDataId : criterion.consts.Dict.ONBOARDING_TASK_TYPE,
                                        fieldLabel : i18n.gettext('Type'),
                                        reference : 'taskTypeCombo',
                                        allowBlank : false,
                                        disabled : true,
                                        listeners : {
                                            select : 'handleTaskTypeSelect'
                                        },
                                        filterFn : item => item.get('attribute1') !== SYSTEM_ATTRIBUTE,
                                        bind : {
                                            readOnly : '{readOnly}',
                                            disabled : '{!isChangeable || isFormTypeAndExists}'
                                        }
                                    },
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Public'),
                                        hidden : true,
                                        bind : {
                                            value : '{record.isShare}',
                                            readOnly : '{readOnly || !isChangeable}',
                                            hidden : '{!isFormTaskType}',
                                            disabled : '{!isFormTaskType || !isChangeable}'
                                        }
                                    }
                                ]
                            },
                            {
                                items : [
                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('Sequence'),
                                        disabled : true,
                                        bind : {
                                            value : '{record.sequence}',
                                            hidden : '{readOnly}',
                                            disabled : '{!isChangeable}'
                                        }
                                    },
                                    {
                                        xtype : 'numberfield',
                                        fieldLabel : i18n.gettext('Due (in days)'),
                                        disabled : true,
                                        bind : {
                                            value : '{record.dueInDays}',
                                            hidden : '{!dueInDays}',
                                            readOnly : '{readOnly}',
                                            disabled : '{!isChangeable}'
                                        }
                                    },
                                    {
                                        xtype : 'datefield',
                                        fieldLabel : i18n.gettext('Due Date'),
                                        hidden : true,
                                        disabled : true,
                                        bind : {
                                            value : '{record.dueDate}',
                                            hidden : '{dueInDays}',
                                            readOnly : '{readOnly}',
                                            disabled : '{!isChangeable}'
                                        }
                                    },
                                    {
                                        xtype : 'combobox',
                                        fieldLabel : i18n.gettext('Form'),
                                        allowBlank : false,
                                        editable : true,
                                        forceSelection : true,
                                        autoSelect : true,
                                        valueField : 'id',
                                        displayField : 'name',
                                        queryMode : 'local',
                                        hidden : true,
                                        disabled : true,
                                        bind : {
                                            store : '{forms}',
                                            value : '{formId}',
                                            readOnly : '{readOnly || !isChangeable}',
                                            hidden : '{!isFormTaskType}',
                                            disabled : '{!isFormTaskType || !isChangeable}'
                                        },
                                        listeners : {
                                            change : 'handleChangeForm'
                                        }
                                    },
                                    {
                                        xtype : 'combobox',
                                        fieldLabel : i18n.gettext('Workflow'),
                                        editable : false,
                                        forceSelection : true,
                                        autoSelect : true,
                                        hidden : true,
                                        disabled : true,
                                        allowBlank : false,
                                        queryMode : 'local',
                                        bind : {
                                            value : '{record.workflowId}',
                                            store : '{workflows}',
                                            hidden : '{!isFormTaskType || showWorkflowName}',
                                            disabled : '{!isFormTaskType || readOnly || !isChangeable || isFormTypeAndExists}'
                                        },
                                        displayField : 'name',
                                        valueField : 'id'
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Workflow'),
                                        disabled : true,
                                        hidden : true,
                                        bind : {
                                            value : '{record.workflowName}',
                                            hidden : '{!showWorkflowName}'
                                        }
                                    },
                                    {
                                        xtype : 'fieldcontainer',
                                        fieldLabel : i18n.gettext('Document'),
                                        layout : 'hbox',
                                        hidden : true,
                                        bind : {
                                            hidden : '{!isDocumentTaskType}'
                                        },
                                        items : [
                                            {
                                                xtype : 'textfield',
                                                flex : 1,
                                                bind : {
                                                    value : '{record.employerDocumentName}',
                                                    disabled : '{!isDocumentTaskType || !isChangeable}'
                                                },
                                                readOnly : true,
                                                disabled : true,
                                                allowBlank : false
                                            },
                                            {
                                                xtype : 'button',
                                                scale : 'small',
                                                margin : '0 0 0 3',
                                                cls : 'criterion-btn-light',
                                                glyph : criterion.consts.Glyph['ios7-search'],
                                                listeners : {
                                                    click : 'onDocumentSearch'
                                                },
                                                bind : {
                                                    hidden : '{readOnly || !isChangeable}'
                                                }
                                            },
                                            {
                                                xtype : 'button',
                                                scale : 'small',
                                                margin : '0 0 0 3',
                                                cls : 'criterion-btn-light',
                                                glyph : criterion.consts.Glyph['ios7-download-outline'],
                                                tooltip : i18n.gettext('Download'),
                                                listeners : {
                                                    click : 'handleDocumentDownload'
                                                },
                                                hidden : true,
                                                bind : {
                                                    hidden : '{!readOnly || hideDownloadDocumentIcon}'
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        xtype : 'fieldcontainer',
                                        fieldLabel : i18n.gettext('Video'),
                                        layout : 'hbox',
                                        hidden : true,
                                        bind : {
                                            hidden : '{!isVideoTaskType}'
                                        },
                                        items : [
                                            {
                                                xtype : 'textfield',
                                                flex : 1,
                                                disabled : true,
                                                bind : {
                                                    value : '{record.employerVideoUrl}',
                                                    disabled : '{!isVideoTaskType || !isChangeable}'
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
                                                listeners : {
                                                    click : 'onVideoSearch'
                                                },
                                                bind : {
                                                    hidden : '{readOnly || !isChangeable}'
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        xtype : 'fieldcontainer',
                                        layout : 'hbox',
                                        hidden : true,
                                        bind : {
                                            fieldLabel : '{assignedToEmployeeLabel}',
                                            hidden : '{!isUserTaskType && !isFormTaskType}'
                                        },
                                        items : [
                                            {
                                                xtype : 'textfield',
                                                flex : 1,
                                                editable : false,
                                                cls : Ext.baseCSSPrefix + 'form-readonly',
                                                bind : {
                                                    value : '{displayEmployeeName}',
                                                    disabled : '{(!isUserTaskType && !isFormTaskType) || !isChangeable}',
                                                    allowBlank : '{!isUserTaskType}'
                                                },
                                                triggers : {
                                                    clear : {
                                                        type : 'clear',
                                                        cls : 'criterion-clear-trigger',
                                                        hideWhenEmpty : true,
                                                        bind : {
                                                            hidden : '{isFormTaskType}'
                                                        },
                                                        handler : 'onClearAssignedEmployee'
                                                    }
                                                }
                                            },
                                            {
                                                xtype : 'button',
                                                scale : 'small',
                                                margin : '0 0 0 3',
                                                cls : 'criterion-btn-light',
                                                glyph : criterion.consts.Glyph['ios7-search'],
                                                listeners : {
                                                    click : 'onAssignedToEmployeeSearch'
                                                },
                                                bind : {
                                                    hidden : '{readOnly || !isChangeable}'
                                                }
                                            }
                                        ]
                                    },
                                    {

                                        xtype : 'criterion_code_detail_field',
                                        codeDataId : criterion.consts.Dict.ONBOARDING_TASK_TYPE,
                                        fieldLabel : i18n.gettext('Task'),
                                        hidden : true,
                                        disabled : true,
                                        bind : {
                                            value : '{record.onboardingTaskTypeCd}',
                                            hidden : '{!isSystemTaskType}',
                                            disabled : '{!isSystemTaskType || !isChangeable}',
                                            readOnly : '{readOnly}'
                                        },
                                        allowBlank : false,
                                        filterFn : item => item.get('attribute1') === SYSTEM_ATTRIBUTE
                                    },
                                    {
                                        xtype : 'fieldcontainer',
                                        fieldLabel : i18n.gettext('Course'),
                                        layout : 'hbox',
                                        hidden : true,
                                        bind : {
                                            hidden : '{!isCourseTaskType}'
                                        },
                                        items : [
                                            {
                                                xtype : 'textfield',
                                                flex : 1,
                                                bind : {
                                                    value : '{record.courseName}',
                                                    disabled : '{!isCourseTaskType || !isChangeable}'
                                                },
                                                readOnly : true,
                                                disabled : true,
                                                allowBlank : false
                                            },
                                            {
                                                xtype : 'button',
                                                scale : 'small',
                                                margin : '0 0 0 3',
                                                cls : 'criterion-btn-light',
                                                glyph : criterion.consts.Glyph['ios7-search'],
                                                listeners : {
                                                    click : 'onCourseSearch'
                                                },
                                                bind : {
                                                    hidden : '{readOnly || !isChangeable}'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype : 'criterion_panel',
                        defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM_LIKE_TWO_COL_FORM,
                        plugins : [
                            'criterion_responsive_column'
                        ],
                        hidden : true,
                        bind : {
                            hidden : '{!isUserTaskType}'
                        },
                        items : [
                            {
                                items : [
                                    {
                                        xtype : 'htmleditor',
                                        enableAlignments : false,
                                        padding : 10,
                                        height : 300,
                                        disabled : true,
                                        bind : {
                                            value : '{record.taskDescription}',
                                            disabled : '{!isUserTaskType || !isChangeable}',
                                            hidden : '{readOnly}'
                                        },
                                        allowBlank : false
                                    },
                                    {
                                        xtype : 'displayfield',
                                        fieldLabel : i18n.gettext('Description'),
                                        hidden : true,
                                        htmlEncode : false,
                                        padding : '0 0 0 10',
                                        bind : {
                                            value : '{record.taskDescription}',
                                            hidden : '{!readOnly}'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'toggleslidefield',
                inputValue : true,
                fieldLabel : i18n.gettext('Fill Form'),
                labelWidth : 200,
                margin : '20 0 0 35',
                hidden : true,
                bind : {
                    value : '{record.isFillForm}',
                    hidden : '{hideFillForm}'
                },
                listeners : {
                    change : 'handleFillFormChange'
                }
            },

            {
                xtype : 'criterion_fillable_webform',
                border : 1,
                style : {
                    borderColor : '#EEE',
                    borderStyle : 'solid',
                    borderWidth : 0
                },
                reference : 'webform',
                scrollable : false,
                editable : true,
                hidden : true,
                bind : {
                    hidden : '{!isFormTaskType || isPhantom || !record.isFillForm || !record.webformId}',
                    editable : '{isChangeable}'
                }
            },
            {
                xtype : 'criterion_fillable_dataform',
                border : 1,
                style : {
                    borderColor : '#EEE',
                    borderStyle : 'solid',
                    borderWidth : 0
                },
                reference : 'dataform',
                scrollable : false,
                editable : true,
                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                hidden : true,
                bind : {
                    hidden : '{!isFormTaskType || isPhantom || !record.isFillForm || !record.dataformId}',
                    editable : '{isChangeable}'
                }
            }
        ],

        getForm : function() {
            if (this.destroyed) {
                return null;
            }
            // bypassing web & data form which should processing in a separate process
            return this.down('form[ref=mainForm]').getForm();
        }
    };
});
