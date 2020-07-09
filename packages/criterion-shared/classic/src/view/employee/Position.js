Ext.define('criterion.view.employee.Position', function() {

    const DICT = criterion.consts.Dict;
    
    return {
        alias : 'widget.criterion_employee_position',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.employee.Position',
            'criterion.view.positions.PositionReporting',
            'criterion.store.Employees',
            'criterion.store.SalaryGradesGradeStep',
            'criterion.store.employer.WorkPeriods',
            'criterion.ux.form.trigger.Clear',
            'criterion.ux.form.CurrencyField',
            'criterion.ux.form.field.ToggleSlide',
            'criterion.view.CustomFieldsContainer',
            'criterion.store.employer.CertifiedRates'
        ],

        allowDelete : false,

        config : {
            /**
             * If set, will show given detail. Otherwise it will try to get active or last detail.
             * Used in {@see criterion.controller.employee.PositionsView}
             */
            activeDetailId : null
        },

        viewModel : {
            data : {
                employerId : null,
                assignmentId : null,
                assignment : null,
                activeDetail : null,
                /**
                 * @deprecated
                 */
                positionId : null,
                /**
                 * @deprecated remove and refactor, use assignment.position
                 */
                position : null,
                editMode : false,
                isPrimary : true,

                showCustomfields : true,
                employee : null,
                salaryGroup : null,
                remainingFTE : null,
                payRateEditable : true,

                isPositionControl : false,
                showPositionReporting : false,

                /**
                 * Flag for ESS to hide edit controls.
                 */
                viewOnly : false,

                blockPositionChange : false,
                disableByWorkflow : false,

                skipActionFilter : false,

                blockedState : true
            },

            formulas : {
                isEditable : data => {
                    let rec = data('assignment');

                    return rec && !rec.phantom && !data('isPendingWorkflow') && !data('viewOnly');
                },

                isDisabled : data => !!data('isTerminated') || data('disableByWorkflow'),

                isTerminated : {
                    bind : {
                        bindTo : '{assignment}',
                        deep : true
                    },
                    get : assignment => assignment && assignment.get('isTerminated')
                },
                isActiveDetailPhantom : {
                    bind : {
                        bindTo : '{activeDetail}',
                        deep : true
                    },
                    get : activeDetail => activeDetail && activeDetail.phantom
                },

                hideTerminate : data => data('isPrimary') || data('isTerminated') || data('editMode'),

                isSalaryGroupStep : data => {
                    let salaryGroup = data('salaryGroup');

                    if (salaryGroup) {
                        return !parseInt(salaryGroup.get('attribute1'), 10);
                    }

                    return null;
                },

                hideCancel : data => data('isPrimary') && (!data('editMode') || (data('assignment') && data('assignment').phantom)),

                hideSave : data => data('isPendingWorkflow') || !data('editMode') || data('isTerminated'),

                hideDelete : data => data('isPendingWorkflow') || !data('editMode') || data('isTerminated') || data('isActiveDetailPhantom') || !data('activeDetail.isDeletable'),

                hideEdit : data => {
                    let isEditable = data('isEditable'),
                        editMode = data('editMode');

                    return editMode || !isEditable || data('isTerminated') || data('disableByWorkflow');
                },

                titleEditable : data => !data('isPositionControl') && data('editMode'),

                hidePayDetails : data => {
                    let security = data('payRateSecurity');

                    return data('editMode') || security && !security.view;
                },

                isPayRateEditable : data => data('editMode') && data('payRateEditable'),

                payRateSecurity : criterion.SecurityManager.generateSecurityFormula('activeDetail', 'assignment_detail.pay_rate'),

                isPendingWorkflow : function(data) {
                    let assignment = data('assignment'),
                        workflowLog = assignment && assignment.getWorkflowLog(),
                        request = workflowLog && workflowLog.get('request'),
                        workflowDetailId = request && request.assignmentDetails && request.assignmentDetails.length && request.assignmentDetails[0].id,
                        disableEdit = workflowLog && Ext.Array.contains(['PENDING_APPROVAL', 'VERIFIED'], workflowLog.get('stateCode'));

                    if (workflowDetailId && workflowDetailId !== this.get('activeDetail.id') && disableEdit) {
                        this.set({
                            disableByWorkflow : true,
                            editMode : true
                        });

                        return false;
                    }

                    return workflowLog && disableEdit;
                }
            },

            stores : {
                employees : {
                    type : 'criterion_employees'
                },
                salaryGradesStore : {
                    type : 'criterion_salary_grades_grade_step',
                    sorters : 'sequence'
                },
                employerWorkPeriods : {
                    type : 'criterion_employer_work_periods'
                },
                certifiedRates : {
                    type : 'employer_certified_rates'
                }
            }
        },

        modelValidation : true,

        controller : {
            type : 'criterion_employee_position'
        },

        listeners : {
            scope : 'controller',
            activate : 'handleActivate'
        },

        hideDeleteBind : '{hideDelete}',
        hideNewActionBtnBind : criterion.SecurityManager.getComplexSecurityFormula({
            append : 'hideEdit ||',
            rules : [
                {
                    key : criterion.SecurityManager.HR_KEYS.EMPLOYEE_PRIMARY_POSITION_NEW_ACTION,
                    actName : criterion.SecurityManager.ACT,
                    reverse : true
                }
            ]
        }),
        hideEditBtnBind : criterion.SecurityManager.getComplexSecurityFormula({
            append : 'hideEdit ||',
            rules : [
                {
                    key : criterion.SecurityManager.HR_KEYS.EMPLOYEE_PRIMARY_POSITION,
                    actName : criterion.SecurityManager.UPDATE,
                    reverse : true
                }
            ]
        }),
        hideTerminateBtnBind : '{hideTerminate}',

        setButtonConfig : function() {
            if (this.getNoButtons()) {
                return;
            }

            let buttons = [];

            buttons.push(
                {
                    xtype : 'button',
                    reference : 'delete',
                    text : i18n.pgettext('employment/position', 'Delete'),
                    cls : 'criterion-btn-remove',
                    listeners : {
                        click : 'handleDeleteClick'
                    },
                    hidden : true,
                    bind : {
                        hidden : this.hideDeleteBind
                    }
                },
                {
                    xtype : 'component',
                    cls : 'criterion-workflow-pending-changes-tooltip',
                    html : '<span>&nbsp;</span> ' + i18n.pgettext('employment/position', 'Highlighted fields were recently changed and being reviewed.'),
                    hidden : true,
                    bind : {
                        hidden : '{!isPendingWorkflow}'
                    }
                },
                '->',
                {
                    xtype : 'button',
                    reference : 'cancel',
                    cls : 'criterion-btn-light',
                    listeners : {
                        click : 'handleCancelClick'
                    },
                    bind : {
                        text : '{cancelBtnText}',
                        disabled : '{blockedState}',
                        hidden : '{hideCancel}'
                    }
                },
                {
                    xtype : 'button',
                    reference : 'submit',
                    cls : 'criterion-btn-primary',
                    listeners : {
                        click : 'handleSubmitClick'
                    },
                    bind : {
                        disabled : '{blockedState}',
                        hidden : '{hideSave || disableByWorkflow}'
                    },
                    hidden : true,
                    text : i18n.pgettext('employment/position', 'Submit')
                }
            );

            this.buttons = buttons;
        },

        bodyPadding : 0,
        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        recordIds : [
            'assignment',
            'activeDetail',
            'position'
        ],

        initComponent : function() {
            this.items = [
                {
                    xtype : 'criterion_form',
                    reference : 'assignmentForm',

                    bodyPadding : '10 0 0 0',

                    defaultType : 'container',
                    flex : 1,

                    dockedItems : [
                        {
                            xtype : 'container',
                            dock : 'top',
                            margin : '10 25',
                            bind : {
                                hidden : '{!isEditable}'
                            },
                            hidden : true,
                            items : [
                                {
                                    xtype : 'button',
                                    text : i18n.pgettext('employment/position', 'New Action'),
                                    cls : 'criterion-btn-feature',
                                    hidden : true,
                                    bind : {
                                        hidden : this.hideNewActionBtnBind
                                    },
                                    margin : '0 10 0 0',
                                    itemId : 'btnNewAction',
                                    handler : 'handleNewAction'
                                },
                                {
                                    xtype : 'button',
                                    text : i18n.pgettext('employment/position', 'Edit'),
                                    cls : 'criterion-btn-feature',
                                    hidden : true,
                                    bind : {
                                        hidden : this.hideEditBtnBind
                                    },
                                    itemId : 'btnEdit',
                                    handler : 'handleSwitchToEdit'
                                },
                                {
                                    xtype : 'button',
                                    itemId : 'btnTerminate',
                                    margin : '0 0 0 10',
                                    cls : 'criterion-btn-remove',
                                    text : i18n.pgettext('employment/position', 'Terminate'),
                                    hidden : true,
                                    bind : {
                                        hidden : this.hideTerminateBtnBind
                                    },
                                    handler : 'handleTerminate'
                                }
                            ]
                        }
                    ],

                    scrollable : 'vertical',

                    items : [
                        {
                            xtype : 'criterion_panel',
                            layout : 'hbox',
                            defaultType : 'container',

                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                            plugins : [
                                'criterion_responsive_column'
                            ],

                            margin : '0 0 10 0',
                            padding : '0 10',

                            items : [
                                {
                                    items : [
                                        {
                                            xtype : 'fieldcontainer',
                                            layout : 'hbox',
                                            fieldLabel : i18n.pgettext('employment/position', 'Position'),
                                            items : [
                                                {
                                                    xtype : 'textfield',
                                                    flex : 1,
                                                    readOnly : true,
                                                    bind : {
                                                        disabled : '{isDisabled}',
                                                        value : '{activeDetail.positionCode}',
                                                        clearTriggerHidden : '{!editMode}'
                                                    },
                                                    readOnlyCls : criterion.Application.isAdmin() ? '' : (Ext.baseCSSPrefix + 'form-readonly'),

                                                    cls : 'criterion-hide-default-clear',
                                                    triggers : {
                                                        clear : {
                                                            type : 'clear',
                                                            cls : 'criterion-clear-trigger',
                                                            handler : 'onPositionClear',
                                                            hideOnReadOnly : false,
                                                            hideWhenEmpty : true
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
                                                        click : 'onPositionSearch'
                                                    },
                                                    bind : {
                                                        hidden : '{!isPositionEditable}',
                                                        disabled : '{!editMode}'
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.pgettext('employment/position', 'Title'),
                                            bind : {
                                                readOnly : '{!titleEditable}',
                                                value : '{activeDetail.title}',
                                                disabled : '{isDisabled}'
                                            }
                                        }
                                    ]
                                },
                                {
                                    items : [
                                        {
                                            xtype : 'datefield',
                                            reference : 'effectiveDate',
                                            fieldLabel : i18n.pgettext('employment/position', 'Effective Date'),
                                            bind : {
                                                value : '{activeDetail.effectiveDate}',
                                                readOnly : '{!editMode}',
                                                disabled : '{isDisabled}'
                                            }
                                        },
                                        {
                                            xtype : 'datefield',
                                            reference : 'expirationDate',
                                            fieldLabel : i18n.pgettext('employment/position', 'Expiration Date'),
                                            bind : {
                                                value : '{activeDetail.expirationDate}',
                                                readOnly : '{!editMode}',
                                                disabled : '{isDisabled}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype : 'criterion_panel',
                            layout : 'hbox',
                            defaultType : 'container',
                            padding : '0 10',

                            margin : '10 0 0 0',

                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                            border : true,
                            bodyStyle : {
                                'border-width' : '1px 0 0 0 !important'
                            },

                            plugins : [
                                'criterion_responsive_column'
                            ],

                            items : [
                                {
                                    items : [
                                        {
                                            xtype : 'criterion_code_detail_field',
                                            fieldLabel : i18n.pgettext('employment/position', 'Action'),
                                            codeDataId : DICT.ASSIGNMENT_ACTION,
                                            bind : {
                                                value : '{activeDetail.assignmentActionCd}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            },
                                            filterFn : function(item) {
                                                let main = this.up('criterion_employee_position'),
                                                    vm = main.getViewModel && main.getViewModel();

                                                if (vm && (vm.get('skipActionFilter') || !vm.get('editMode') || vm.get('isDisabled'))) {
                                                    return true;
                                                }

                                                // hide any option that is correlated to the action T
                                                return item.get('attribute1') !== criterion.Consts.ASSIGNMENT_ACTIONS_FLAGS.T;
                                            }
                                        },
                                        {
                                            xtype : 'combo',
                                            fieldLabel : i18n.pgettext('employment/position', 'Salary Grade'),
                                            reference : 'salaryGradeCombo',
                                            displayField : 'gradeName',
                                            valueField : 'id',
                                            allowBlank : true,
                                            queryMode : 'local',
                                            forceSelection : true,
                                            visible : false,
                                            store : {
                                                model : 'criterion.model.SalaryGradeGradeStep',
                                                sorters : 'sequence'
                                            },
                                            bind : {
                                                value : '{activeDetail.salaryGradeId}',
                                                visible : '{!isSalaryGroupStep}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            },
                                            listeners : {
                                                change : 'handleSalaryGroupSelect'
                                            },
                                            tpl : Ext.create('Ext.XTemplate',
                                                '<ul class="x-list-plain"><tpl for=".">',
                                                '<li role="option" class="x-boundlist-item">{gradeName} ({ratesPerPeriod})</li>',
                                                '</tpl></ul>'),
                                            displayTpl : Ext.create('Ext.XTemplate',
                                                '<tpl for=".">',
                                                '{gradeName} ({ratesPerPeriod})',
                                                '</tpl>')
                                        },
                                        {
                                            xtype : 'combo',
                                            fieldLabel : i18n.pgettext('employment/position', 'Salary Grade'),
                                            reference : 'salaryGradeStepCombo',
                                            allowBlank : true,
                                            editable : false,
                                            forceSelection : true,
                                            displayField : 'stepName',
                                            valueField : 'id',
                                            store : {
                                                fields : [
                                                    {name : 'id', type : 'integer'},
                                                    {name : 'stepName', type : 'string'},
                                                    {name : 'rate', type : 'float'}
                                                ],
                                                sorters : 'sequence'
                                            },
                                            bind : {
                                                visible : '{isSalaryGroupStep}',
                                                value : '{activeDetail.salaryGradeId}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            },
                                            queryMode : 'local',
                                            visible : false,
                                            listeners : {
                                                change : 'handleSalaryStepSelect'
                                            }
                                        },
                                        {
                                            xtype : 'container',
                                            layout : 'hbox',
                                            margin : '0 0 20 0',
                                            items : [
                                                {
                                                    xtype : 'criterion_currencyfield',
                                                    fieldLabel : i18n.pgettext('employment/position', 'Pay Rate'),
                                                    reference : 'payRate',
                                                    isRatePrecision : true,
                                                    labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                                                    bind : {
                                                        value : '{activeDetail.payRate}',
                                                        disabled : '{isDisabled}',
                                                        readOnly : '{!isPayRateEditable}'
                                                    },
                                                    flex : 1
                                                },
                                                {
                                                    xtype : 'button',
                                                    cls : 'criterion-btn-like-link',
                                                    text : i18n.pgettext('employment/position', 'Details'),
                                                    scale : 'small',
                                                    width : 120,
                                                    hidden : true,
                                                    bind : {
                                                        disabled : '{isDisabled}',
                                                        hidden : '{hidePayDetails}'
                                                    },
                                                    handler : 'showPayDetails'
                                                }
                                            ]
                                        },
                                        {
                                            xtype : 'criterion_code_detail_field',
                                            reference : 'payRateUnitCombo',
                                            fieldLabel : i18n.pgettext('employment/position', 'Pay Rate Unit'),
                                            codeDataId : DICT.RATE_UNIT,
                                            bind : {
                                                value : '{activeDetail.rateUnitCd}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        }
                                    ]
                                },
                                {
                                    items : [
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.pgettext('employment/position', 'Exempt'),
                                            bind : {
                                                value : '{activeDetail.isExempt}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        },
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.pgettext('employment/position', 'Salary'),
                                            name : 'isSalary',
                                            bind : {
                                                value : '{activeDetail.isSalary}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        },
                                        {
                                            xtype : 'criterion_code_detail_field',
                                            fieldLabel : i18n.pgettext('employment/position', 'Type'),
                                            codeDataId : DICT.POSITION_TYPE,
                                            bind : {
                                                value : '{activeDetail.positionTypeCd}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        },
                                        {
                                            xtype : 'criterion_form_high_precision_field',
                                            namePrecision : 'amountPrecision',
                                            fieldLabel : i18n.pgettext('employment/position', 'Full Time Equivalency'),
                                            reference : 'fteField',
                                            bind : {
                                                value : '{activeDetail.fullTimeEquivalency}',
                                                readOnly : '{!editMode}',
                                                disabled : '{isDisabled}',
                                                maxValue : '{remainingFTE}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },

                        {
                            xtype : 'criterion_panel',
                            layout : 'hbox',
                            defaultType : 'container',
                            padding : '0 10',

                            margin : '10 0 0 0',

                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                            border : true,
                            bodyStyle : {
                                'border-width' : '1px 0 0 0 !important'
                            },

                            plugins : [
                                'criterion_responsive_column'
                            ],

                            items : [
                                {
                                    items : [
                                        {
                                            xtype : 'criterion_code_detail_field',
                                            fieldLabel : i18n.pgettext('employment/position', 'Department'),
                                            codeDataId : DICT.DEPARTMENT,
                                            bind : {
                                                value : '{activeDetail.departmentCd}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        },
                                        {
                                            xtype : 'criterion_code_detail_field',
                                            fieldLabel : i18n.pgettext('employment/position', 'Cost Center'),
                                            codeDataId : DICT.COST_CENTER,
                                            bind : {
                                                value : '{activeDetail.costCenterCd}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        },
                                        {
                                            xtype : 'criterion_code_detail_field',
                                            fieldLabel : i18n.pgettext('employment/position', 'Division'),
                                            codeDataId : DICT.DIVISION,
                                            bind : {
                                                value : '{activeDetail.divisionCd}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        },
                                        {
                                            xtype : 'criterion_code_detail_field',
                                            fieldLabel : i18n.pgettext('employment/position', 'Section'),
                                            codeDataId : DICT.SECTION,
                                            bind : {
                                                value : '{activeDetail.sectionCd}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        }
                                    ]
                                },
                                {
                                    items : [
                                        {
                                            xtype : 'criterion_code_detail_field',
                                            fieldLabel : i18n.pgettext('employment/position', 'EEO Category'),
                                            codeDataId : DICT.EEOC,
                                            bind : {
                                                value : '{activeDetail.eeocCd}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        },
                                        {
                                            xtype : 'combobox',
                                            fieldLabel : i18n.pgettext('employment/position', 'Work Period'),
                                            valueField : 'id',
                                            displayField : 'name',
                                            queryMode : 'local',
                                            editable : true,
                                            bind : {
                                                value : '{activeDetail.workPeriodId}',
                                                store : '{employerWorkPeriods}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        },
                                        {
                                            xtype : 'criterion_code_detail_field',
                                            fieldLabel : i18n.pgettext('employment/position', 'Category'),
                                            codeDataId : DICT.POSITION_CATEGORY,
                                            bind : {
                                                value : '{activeDetail.categoryCd}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        },
                                        {
                                            xtype : 'criterion_code_detail_field',
                                            fieldLabel : i18n.pgettext('employment/position', 'Workers Compensation'),
                                            codeDataId : DICT.WORKERS_COMPENSATION,
                                            bind : {
                                                value : '{activeDetail.workersCompensationCd}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        },
                                        {
                                            xtype : 'combobox',
                                            fieldLabel : i18n.pgettext('employment/position', 'Certified Rate'),
                                            valueField : 'id',
                                            displayField : 'name',
                                            queryMode : 'local',
                                            editable : true,
                                            hidden : !criterion.Api.hasCertifiedRate(),
                                            bind : {
                                                value : '{activeDetail.certifiedRateId}',
                                                store : '{certifiedRates}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },

                        {
                            xtype : 'criterion_positions_position_reporting',
                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                            plugins : [
                                'criterion_responsive_column'
                            ],
                            hidden : true,
                            bind : {
                                displayOnly : '{!editMode}',
                                disabled : '{isDisabled}',
                                employerId : '{employerId}',
                                recordName : 'assignment',
                                hidden : '{!showPositionReporting}'
                            }
                        },
                        {
                            xtype : 'criterion_panel',
                            layout : 'hbox',
                            defaultType : 'container',
                            padding : '0 10',

                            margin : '10 0 0 0',

                            border : true,
                            bodyStyle : {
                                'border-width' : '1px 0 0 0 !important'
                            },

                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                            plugins : [
                                'criterion_responsive_column'
                            ],

                            items : [
                                {
                                    items : [
                                        {
                                            xtype : 'numberfield',
                                            fieldLabel : i18n.pgettext('employment/position', 'Hours per Day'),
                                            bind : {
                                                value : '{activeDetail.averageHours}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        },
                                        {
                                            xtype : 'numberfield',
                                            fieldLabel : i18n.pgettext('employment/position', 'Days per Week'),
                                            bind : {
                                                value : '{activeDetail.averageDays}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        },
                                        {
                                            xtype : 'numberfield',
                                            fieldLabel : i18n.pgettext('employment/position', 'Weeks per Year'),
                                            bind : {
                                                value : '{activeDetail.averageWeeks}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        },
                                        {
                                            xtype : 'criterion_code_detail_field',
                                            fieldLabel : i18n.pgettext('employment/position', 'Officer Code'),
                                            codeDataId : DICT.OFFICER_CODE,
                                            bind : {
                                                value : '{activeDetail.officerCodeCd}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        }
                                    ]
                                },
                                {
                                    items : [
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.pgettext('employment/position', 'HCE'),
                                            bind : {
                                                value : '{activeDetail.isHighSalary}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        },
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.pgettext('employment/position', 'Seasonal'),
                                            bind : {
                                                value : '{activeDetail.isSeasonal}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        },
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.pgettext('employment/position', 'Officer'),
                                            bind : {
                                                value : '{activeDetail.isOfficer}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        },
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.pgettext('employment/position', 'Manager'),
                                            bind : {
                                                value : '{activeDetail.isManager}',
                                                disabled : '{isDisabled}',
                                                readOnly : '{!editMode}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype : 'criterion_customfields_container',
                            reference : 'customFields',
                            padding : '0 10',
                            entityType : criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_ASSIGNMENT_DETAIL,
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                            bind : {
                                hidden : '{!showCustomfields}',
                                disabled : '{isDisabled || !editMode}'
                            }
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        },

        loadRecord : function(record) {
            let controller = this.getController();

            controller && controller.load(record);
        },

        /**
         * Fix for https://perfecthr.atlassian.net/browse/CRITERION-4298
         * Should be removed after https://perfecthr.atlassian.net/browse/CRITERION-4306
         */
        setActive : Ext.emptyFn
    };

});
