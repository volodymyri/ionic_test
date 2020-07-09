Ext.define('criterion.view.common.positions.PositionForm', function() {

    const WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES,
        DICT = criterion.consts.Dict,
        buttons = [
            {
                text : i18n.pgettext('position/form', 'Delete'),
                cls : 'criterion-btn-remove',
                listeners : {
                    click : 'handleRemoveAction'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getComplexSecurityFormula({
                        append : 'hideDeleteButton ||',
                        rules : [
                            {
                                key : criterion.SecurityManager.HR_KEYS.POSITION,
                                actName : criterion.SecurityManager.DELETE,
                                reverse : true
                            }
                        ]
                    })
                }
            },
            {
                xtype : 'component',
                cls : 'criterion-workflow-pending-changes-tooltip',
                html : '<span>&nbsp;</span> ' + i18n.pgettext('position/form', 'Highlighted fields were recently changed and being reviewed.'),
                hidden : true,
                bind : {
                    hidden : '{!isPendingWorkflow}'
                }
            },
            '->',
            {
                xtype : 'button',
                text : i18n.pgettext('position/form', 'Cancel'),
                cls : 'criterion-btn-light',
                listeners : {
                    click : 'onCancel'
                }
            },
            {
                xtype : 'button',
                text : i18n.pgettext('position/form', 'Submit'),
                cls : 'criterion-btn-primary',
                listeners : {
                    click : 'onPositionSubmit'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getComplexSecurityFormula({
                        append : 'isPendingWorkflow ||',
                        rules : [
                            {
                                key : criterion.SecurityManager.HR_KEYS.POSITION,
                                actName : criterion.SecurityManager.UPDATE,
                                reverse : true
                            }
                        ]
                    })
                }
            }
        ];

    let codeDataFieldTpl = Ext.create('Ext.XTemplate',
        '<ul class="x-list-plain">',
        '<tpl for=".">',
        '<li role="option" class="x-boundlist-item item-enab-{isActive}">{description:htmlEncode} [{code:htmlEncode}]</li>',
        '</tpl>',
        '</ul>'
        ),
        codeDataFieldDisplayTpl = Ext.create('Ext.XTemplate',
            '<tpl for=".">',
            '{description} [{code}]',
            '</tpl>'
        );

    return {
        alias : 'widget.criterion_positions_position_form',

        extend : 'criterion.ux.tab.Panel',

        cls : 'criterion-tabpanel',

        requires : [
            'criterion.controller.common.positions.PositionForm',
            'criterion.controller.settings.hr.PositionSkillsGrid',

            'criterion.view.common.positions.Assignments',
            'criterion.view.positions.PositionReporting',
            'criterion.view.settings.common.SkillForm',

            'criterion.store.employer.WorkLocations',
            'criterion.store.Assignments',
            'criterion.store.Employers',
            'criterion.store.codeTable.Details',
            'criterion.store.SalaryGradesGradeStep',
            'criterion.store.employer.position.Skills',
            'criterion.store.employer.WorkPeriods',
            'criterion.store.Positions',
            'criterion.model.SalaryGradeStep',
            'criterion.view.CustomFieldsContainer'
        ],

        viewModel : {
            data : {
                positionRecord : null,
                positionId : null,
                employerName : '',
                selectedEmployer : null,
                employerId : null,

                salaryGroup : null,
                selectedGrade1 : null,
                selectedGrade2 : null,
                positionRecordCodeHidden : null
            },

            formulas : {
                isPhantom : data => data('positionRecord') ? data('positionRecord').phantom : true,

                hideDeleteButton : data => data('isPendingWorkflow') || data('isPhantom'),

                selectedStep1 : {
                    get : Ext.emptyFn,
                    set : function(value) {
                        let salaryGroup = this.get('salaryGroup');
                        salaryGroup && !parseInt(salaryGroup.get('attribute1')) && this.set('salaryGradeMinimum', value.get('rate'));
                    }
                },
                selectedStep2 : {
                    get : Ext.emptyFn,
                    set : function(value) {
                        let salaryGroup = this.get('salaryGroup');
                        salaryGroup && !parseInt(salaryGroup.get('attribute1')) && this.set('salaryGradeMaximum', value.get('rate'));
                    }
                },
                isSalaryGroupStep : function(get) {
                    let salaryGroup = get('salaryGroup');
                    if (!salaryGroup) {
                        return null;
                    } else {
                        return !parseInt(salaryGroup.get('attribute1'));
                    }
                },

                positionRecordCode : {
                    get : function(get) {
                        let isPendingWorkflow = this.get('isPendingWorkflow'),
                            positionRecordCode,
                            positionRecordCodeHidden = this.get('positionRecordCodeHidden'),
                            positionRecord = this.get('positionRecord'),
                            workflowLog = {},
                            requestData = {},
                            workflowKeys = [];

                        if (!positionRecordCodeHidden) {
                            positionRecordCode = get('positionRecord.code');
                        } else {
                            positionRecord && positionRecord.set('code', positionRecordCodeHidden);

                            positionRecordCode = positionRecordCodeHidden;

                            if (isPendingWorkflow) {
                                workflowLog = positionRecord && Ext.isFunction(positionRecord.getWorkflowLog) && positionRecord.getWorkflowLog();

                                if (workflowLog) {
                                    requestData = workflowLog.get('request');
                                    workflowKeys = Ext.Object.getAllKeys(requestData);

                                    if (workflowKeys && Ext.Array.contains(workflowKeys, 'code')) {
                                        positionRecordCode = requestData['code'];
                                    }
                                }
                            }
                        }

                        return positionRecordCode;
                    },
                    set : function(value) {
                        this.set('positionRecordCodeHidden', value);
                        this.get('positionRecord').set('code', value);
                    }
                },

                isPendingWorkflow : {
                    bind : {
                        bindTo : '{positionRecord}',
                        deep : true
                    },
                    get : function(record) {
                        let wf = record && Ext.isFunction(record.getWorkflowLog) && record.getWorkflowLog(),
                            stateCode = wf ? wf.get('stateCode') : null;

                        return stateCode && Ext.Array.contains([WORKFLOW_STATUSES.PENDING_APPROVAL, WORKFLOW_STATUSES.VERIFIED], stateCode);
                    }
                },

                readOnly : data => data('isPendingWorkflow')
            },
            stores : {
                employerWorkLocations : {
                    type : 'employer_work_locations'
                },
                assignments : {
                    type : 'criterion_assignments',
                    sorters : [{
                        property : 'effectiveDate',
                        direction : 'DESC'
                    }]
                },
                employers : {
                    type : 'criterion_employers',
                    autoLoad : true
                },
                positionSkills : {
                    type : 'employer_position_skills'
                },
                salaryGradesStore : {
                    type : 'criterion_salary_grades_grade_step',
                    sorters : 'sequence',
                    listeners : {
                        load : 'onSalaryGradesStoreLoad'
                    }
                },
                employerWorkPeriods : {
                    type : 'criterion_employer_work_periods'
                },
                positions : {
                    type : 'positions',
                    remoteSort : true,
                    remoteFilter : true,
                    proxy : {
                        extraParams : {
                            employerId : '{employerId}'
                        }
                    }
                }
            }
        },

        setHideAssignments : function(hideAssignments) {
            if (hideAssignments) {
                this.down('#details').remove(this.down('#list'));
            }
        },

        modelValidation : true,

        controller : {
            type : 'criterion_positions_position_form'
        },

        listeners : {
            scope : 'controller',
            childTabChange : 'onChildTabChange'
        },

        minTabWidth : 300,

        bodyPadding : 0,

        defaults : {
            bodyPadding : 0
        },

        items : [
            {
                xtype : 'criterion_form',
                reference : 'form',
                itemId : 'details',
                collapsible : false,
                title : i18n.pgettext('position/form', 'Positions'),
                layout : {
                    type : 'card'
                },
                defaults : {
                    header : false,
                    scrollable : 'vertical'
                },
                isSubMenu : true,
                plugins : [
                    {
                        ptype : 'criterion_security_items',
                        secureByDefault : true
                    }
                ],
                items : [
                    {
                        title : i18n.pgettext('position/form', 'Position Details'),
                        itemId : 'information',

                        isSubMenuItem : true,

                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },

                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_ACCORDION_WIDER,

                        items : [
                            {
                                dockedItems : [
                                    {
                                        xtype : 'panel',
                                        dock : 'top',
                                        header : {
                                            bind : {
                                                title : '{positionRecord.title}'
                                            }
                                        }
                                    }
                                ],

                                plugins : [
                                    'criterion_responsive_column'
                                ],
                                items : [
                                    {
                                        items : [
                                            {
                                                xtype : 'criterion_employer_combo',
                                                fieldLabel : i18n.pgettext('position/form', 'Employer'),
                                                bind : {
                                                    selection : '{selectedEmployer}',
                                                    value : '{employerId}',
                                                    disabled : '{!isPhantom}'
                                                },
                                                listeners : {
                                                    change : 'handlePEmployerChange'
                                                },
                                                allowBlank : false
                                            },
                                            {
                                                xtype : 'textfield',
                                                fieldLabel : i18n.pgettext('position/form', 'Code'),
                                                bind : {
                                                    value : '{positionRecordCode}',
                                                    readOnly : '{readOnly}'
                                                },
                                                allowBlank : false
                                            },
                                            {
                                                xtype : 'fieldcontainer',
                                                fieldLabel : i18n.pgettext('position/form', 'Job'),
                                                layout : 'hbox',
                                                items : [
                                                    {
                                                        xtype : 'textfield',
                                                        bind : {
                                                            value : '{positionRecord.job}',
                                                            readOnly : '{readOnly}'
                                                        },
                                                        readOnly : true,
                                                        flex : 1,

                                                        cls : 'criterion-hide-default-clear',
                                                        triggers : {
                                                            clear : {
                                                                type : 'clear',
                                                                cls : 'criterion-clear-trigger-transparent',
                                                                handler : 'onJobCodeClear',
                                                                hideOnReadOnly : true,
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
                                                            click : 'onJobCodeSearch'
                                                        },
                                                        bind : {
                                                            disabled : '{readOnly}'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        items : [
                                            {
                                                xtype : 'criterion_placeholder_field'
                                            },
                                            {
                                                xtype : 'toggleslidefield',
                                                fieldLabel : i18n.pgettext('position/form', 'Active'),
                                                bind : {
                                                    value : '{positionRecord.isActive}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'toggleslidefield',
                                                fieldLabel : i18n.pgettext('position/form', 'Exempt'),
                                                bind : {
                                                    value : '{positionRecord.isExempt}',
                                                    readOnly : '{readOnly}'
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
                                margin : '0 10'
                            },
                            {
                                plugins : [
                                    'criterion_responsive_column'
                                ],
                                items : [
                                    {
                                        items : [
                                            {
                                                xtype : 'textfield',
                                                fieldLabel : i18n.pgettext('position/form', 'Title'),
                                                bind : {
                                                    value : '{positionRecord.title}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'combobox',
                                                fieldLabel : i18n.pgettext('position/form', 'Location'),
                                                valueField : 'id',
                                                displayTpl : codeDataFieldDisplayTpl,
                                                tpl : codeDataFieldTpl,
                                                queryMode : 'local',
                                                bind : {
                                                    value : '{positionRecord.employerWorkLocationId}',
                                                    store : '{employerWorkLocations}',
                                                    disabled : '{!employerId}',
                                                    readOnly : '{readOnly}'
                                                },
                                                allowBlank : false
                                            }
                                        ]
                                    },
                                    {
                                        items : [
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.pgettext('position/form', 'Type'),
                                                codeDataId : DICT.POSITION_TYPE,
                                                bind : {
                                                    value : '{positionRecord.positionTypeCd}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'criterion_form_high_precision_field',
                                                namePrecision : 'amountPrecision',
                                                fieldLabel : i18n.pgettext('position/form', 'Full Time Equivalency'),
                                                bind : {
                                                    value : '{positionRecord.fullTimeEquivalency}',
                                                    readOnly : '{readOnly}'
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
                                margin : '0 10'
                            },
                            {
                                plugins : [
                                    'criterion_responsive_column'
                                ],
                                items : [
                                    {
                                        items : [
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.pgettext('position/form', 'Department'),
                                                codeDataId : DICT.DEPARTMENT,
                                                displayTpl : codeDataFieldDisplayTpl,
                                                tpl : codeDataFieldTpl,
                                                allowBlank : false,
                                                bind : {
                                                    value : '{positionRecord.departmentCd}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.pgettext('position/form', 'Cost Center'),
                                                codeDataId : DICT.COST_CENTER,
                                                allowBlank : true,
                                                bind : {
                                                    value : '{positionRecord.costCenterCd}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },

                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.pgettext('position/form', 'Division'),
                                                codeDataId : DICT.DIVISION,
                                                allowBlank : true,
                                                bind : {
                                                    value : '{positionRecord.divisionCd}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.pgettext('position/form', 'Section'),
                                                codeDataId : DICT.SECTION,
                                                allowBlank : true,
                                                bind : {
                                                    value : '{positionRecord.sectionCd}',
                                                    readOnly : '{readOnly}'
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        items : [
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.pgettext('position/form', 'EEO Category'),
                                                codeDataId : DICT.EEOC,
                                                bind : {
                                                    value : '{positionRecord.eeocCd}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'combobox',
                                                fieldLabel : i18n.pgettext('position/form', 'Work Period'),
                                                valueField : 'id',
                                                displayField : 'name',
                                                queryMode : 'local',
                                                bind : {
                                                    value : '{positionRecord.workPeriodId}',
                                                    store : '{employerWorkPeriods}',
                                                    disabled : '{!employerId}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.pgettext('position/form', 'Category'),
                                                codeDataId : DICT.POSITION_CATEGORY,
                                                allowBlank : true,
                                                bind : {
                                                    value : '{positionRecord.categoryCd}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.pgettext('position/form', 'Workers Compensation'),
                                                codeDataId : DICT.WORKERS_COMPENSATION,
                                                allowBlank : true,
                                                bind : {
                                                    value : '{positionRecord.workersCompensationCd}',
                                                    readOnly : '{readOnly}'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },

                            {
                                title : i18n.pgettext('position/form', 'Wage Information'),
                                plugins : [
                                    'criterion_responsive_column'
                                ],
                                items : [
                                    {
                                        items : [
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.pgettext('position/form', 'Salary Group'),
                                                codeDataId : DICT.SALARY_GROUP,
                                                allowBlank : true,
                                                editable : false,
                                                disableDirtyCheck : true,
                                                bind : {
                                                    value : '{salaryGradeGroup}',
                                                    selection : '{salaryGroup}',
                                                    readOnly : '{readOnly}'
                                                },
                                                listeners : {
                                                    change : 'onSalaryGroupChange'
                                                }
                                            },
                                            {
                                                xtype : 'combo',
                                                fieldLabel : i18n.pgettext('position/form', 'Salary Grade (Min)'),
                                                reference : 'salaryGradeCombo1',
                                                allowBlank : true,
                                                editable : false,
                                                displayField : 'gradeName',
                                                valueField : 'id',
                                                disableDirtyCheck : true,
                                                forceSelection : true,
                                                bind : {
                                                    store : '{salaryGradesStore}',
                                                    selection : '{selectedGrade1}',
                                                    visible : '{!isSalaryGroupStep}',
                                                    value : '{positionRecord.minSalaryGradeId}',
                                                    disabled : '{!salaryGroup}',
                                                    readOnly : '{readOnly}'
                                                },
                                                visible : false,
                                                queryMode : 'local',
                                                tpl : Ext.create('Ext.XTemplate',
                                                    '<ul class="x-list-plain"><tpl for=".">',
                                                    '<li role="option" class="x-boundlist-item">{gradeName} ({ratesPerPeriod})</li>',
                                                    '</tpl></ul>'),
                                                displayTpl : Ext.create('Ext.XTemplate',
                                                    '<tpl for=".">',
                                                    '{gradeName} ({ratesPerPeriod})',
                                                    '</tpl>'
                                                ),
                                                listeners : {
                                                    change : function(cmp, value) {
                                                        if (value && cmp.isVisible()) {
                                                            this.up('criterion_positions_position_form').lookup('payRate').setMinValue(cmp.getSelection().get('minRate'))
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                xtype : 'combo',
                                                reference : 'salaryGradeStepCombo1',
                                                fieldLabel : i18n.pgettext('position/form', 'Salary Grade (Min)'),
                                                allowBlank : true,
                                                editable : false,
                                                displayField : 'stepName',
                                                valueField : 'id',
                                                disableDirtyCheck : true,
                                                forceSelection : true,
                                                bind : {
                                                    visible : '{isSalaryGroupStep}',
                                                    store : {
                                                        fields : [
                                                            {name : 'id', type : 'integer'},
                                                            {name : 'stepName', type : 'string'},
                                                            {name : 'rate', type : 'string'}
                                                        ]
                                                    },
                                                    value : '{positionRecord.minSalaryGradeId}',
                                                    selection : '{selectedStep1}',
                                                    disabled : '{!salaryGroup}',
                                                    readOnly : '{readOnly}'
                                                },
                                                queryMode : 'local',
                                                visible : false,
                                                tpl : Ext.create('Ext.XTemplate',
                                                    '<ul class="x-list-plain"><tpl for=".">',
                                                    '<li role="option" class="x-boundlist-item">{stepName} ({rate})</li>',
                                                    '</tpl></ul>'),
                                                displayTpl : Ext.create('Ext.XTemplate',
                                                    '<tpl for=".">',
                                                    "{stepName} ({rate})",
                                                    '</tpl>'
                                                ),
                                                listeners : {
                                                    change : function(cmp, value) {
                                                        if (value && cmp.isVisible()) {
                                                            this.up('criterion_positions_position_form').lookup('payRate').setMinValue(cmp.getSelection().get('rate'))
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                xtype : 'combo',
                                                fieldLabel : i18n.pgettext('position/form', 'Salary Grade (Max)'),
                                                reference : 'salaryGradeCombo2',
                                                allowBlank : true,
                                                editable : false,
                                                displayField : 'gradeName',
                                                valueField : 'id',
                                                disableDirtyCheck : true,
                                                forceSelection : true,
                                                bind : {
                                                    store : '{salaryGradesStore}',
                                                    selection : '{selectedGrade2}',
                                                    visible : '{!isSalaryGroupStep}',
                                                    value : '{positionRecord.maxSalaryGradeId}',
                                                    disabled : '{!salaryGroup}',
                                                    readOnly : '{readOnly}'
                                                },
                                                visible : false,
                                                queryMode : 'local',
                                                tpl : Ext.create('Ext.XTemplate',
                                                    '<ul class="x-list-plain"><tpl for=".">',
                                                    '<li role="option" class="x-boundlist-item">{gradeName} ({ratesPerPeriod})</li>',
                                                    '</tpl></ul>'),
                                                displayTpl : Ext.create('Ext.XTemplate',
                                                    '<tpl for=".">',
                                                    '{gradeName} ({ratesPerPeriod})',
                                                    '</tpl>'
                                                ),
                                                listeners : {
                                                    change : function(cmp, value) {
                                                        if (value && cmp.isVisible()) {
                                                            this.up('criterion_positions_position_form').lookup('payRate').setMaxValue(cmp.getSelection().get('maxRate'))
                                                        }
                                                    }
                                                }
                                            },
                                            {
                                                xtype : 'combo',
                                                fieldLabel : i18n.pgettext('position/form', 'Salary Grade (Max)'),
                                                reference : 'salaryGradeStepCombo2',
                                                allowBlank : true,
                                                editable : false,
                                                displayField : 'stepName',
                                                valueField : 'id',
                                                disableDirtyCheck : true,
                                                forceSelection : true,
                                                bind : {
                                                    visible : '{isSalaryGroupStep}',
                                                    store : {
                                                        fields : [
                                                            {name : 'id', type : 'integer'},
                                                            {name : 'stepName', type : 'string'},
                                                            {name : 'rate', type : 'string'}
                                                        ]
                                                    },
                                                    value : '{positionRecord.maxSalaryGradeId}',
                                                    selection : '{selectedStep2}',
                                                    disabled : '{!salaryGroup}',
                                                    readOnly : '{readOnly}'
                                                },
                                                queryMode : 'local',
                                                visible : false,
                                                tpl : Ext.create('Ext.XTemplate',
                                                    '<ul class="x-list-plain"><tpl for=".">',
                                                    '<li role="option" class="x-boundlist-item">{stepName} ({rate})</li>',
                                                    '</tpl></ul>'),
                                                displayTpl : Ext.create('Ext.XTemplate',
                                                    '<tpl for=".">',
                                                    '{stepName} ({rate})',
                                                    '</tpl>'
                                                ),
                                                listeners : {
                                                    change : function(cmp, value) {
                                                        if (value && cmp.isVisible()) {
                                                            this.up('criterion_positions_position_form').lookup('payRate').setMaxValue(cmp.getSelection().get('rate'))
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        items : [
                                            {
                                                xtype : 'toggleslidefield',
                                                fieldLabel : i18n.pgettext('position/form', 'Salary'),
                                                name : 'isSalary',
                                                bind : {
                                                    value : '{positionRecord.isSalary}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.pgettext('position/form', 'Pay Rate Unit'),
                                                reference : 'payRateUnitCombo',
                                                codeDataId : DICT.RATE_UNIT,
                                                disabledCls : 'x-form-readonly',
                                                bind : {
                                                    value : '{positionRecord.rateUnitCd}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'criterion_currencyfield',
                                                fieldLabel : i18n.pgettext('position/form', 'Target Pay Rate'),
                                                isRatePrecision : true,
                                                useGlobalFormat : false,
                                                currencySymbol : '$',
                                                thousandSeparator : ',',
                                                decimalSeparator : '.',
                                                decimalPrecision : 0,
                                                currencySymbolPos : false,
                                                reference : 'payRate',
                                                bind : {
                                                    value : '{positionRecord.payRate}',
                                                    readOnly : '{readOnly}'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                items : [
                                    {
                                        xtype : 'criterion_customfields_container',
                                        reference : 'customFields',
                                        entityType : criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_POSITION,
                                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                                        padding : 0,
                                        bodyPadding : 0,
                                        margin : 0,
                                        bind : {
                                            readOnly : '{readOnly}',
                                            disabled : '{readOnly}'
                                        }
                                    }
                                ]
                            }
                        ],

                        dockedItems : [{
                            xtype : 'toolbar',
                            dock : 'bottom',
                            ui : 'footer',
                            automationId : 'positions-details-bottom-toolbar',
                            defaults : {
                                minWidth : criterion.Consts.UI_DEFAULTS.MIN_BUTTON_WIDTH
                            },
                            items : buttons
                        }]
                    },

                    {
                        title : i18n.pgettext('position/form', 'Classification'),
                        itemId : 'classification',
                        isSubMenuItem : true,

                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },

                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_ACCORDION_WIDER,
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.POSITION_CLASSIFICATION, criterion.SecurityManager.READ),
                        items : [
                            {
                                dockedItems : [
                                    {
                                        xtype : 'panel',
                                        dock : 'top',
                                        header : {
                                            bind : {
                                                title : '{positionRecord.title}'
                                            }
                                        }
                                    }
                                ],

                                plugins : [
                                    'criterion_responsive_column'
                                ],
                                items : [
                                    {
                                        items : [
                                            {
                                                xtype : 'numberfield',
                                                fieldLabel : i18n.pgettext('position/form', 'Hours per Day'),
                                                bind : {
                                                    value : '{positionRecord.averageHours}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'numberfield',
                                                fieldLabel : i18n.pgettext('position/form', 'Days per Week'),
                                                bind : {
                                                    value : '{positionRecord.averageDays}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'numberfield',
                                                fieldLabel : i18n.pgettext('position/form', 'Weeks per Year'),
                                                bind : {
                                                    value : '{positionRecord.averageWeeks}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.pgettext('position/form', 'Officer Code'),
                                                codeDataId : DICT.OFFICER_CODE,
                                                allowBlank : true,
                                                bind : {
                                                    value : '{positionRecord.officerCodeCd}',
                                                    readOnly : '{readOnly}'
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        items : [
                                            {
                                                xtype : 'toggleslidefield',
                                                fieldLabel : i18n.pgettext('position/form', 'HCE'),
                                                bind : {
                                                    value : '{positionRecord.isHighSalary}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'toggleslidefield',
                                                fieldLabel : i18n.pgettext('position/form', 'Seasonal'),
                                                bind : {
                                                    value : '{positionRecord.isSeasonal}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'toggleslidefield',
                                                fieldLabel : i18n.pgettext('position/form', 'Officer'),
                                                bind : {
                                                    value : '{positionRecord.isOfficer}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'toggleslidefield',
                                                fieldLabel : i18n.pgettext('position/form', 'Manager'),
                                                bind : {
                                                    value : '{positionRecord.isManager}',
                                                    readOnly : '{readOnly}'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                title : i18n.pgettext('position/form', 'Reporting Structure'),
                                reference : 'reportingPositions',
                                plugins : [
                                    'criterion_responsive_column'
                                ],
                                layout : 'hbox',
                                hidden : true,
                                bind : {
                                    hidden : '{!selectedEmployer.isPositionReporting}'
                                },
                                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                                items : []
                            }
                        ],
                        dockedItems : [{
                            xtype : 'toolbar',
                            ui : 'footer',
                            dock : 'bottom',
                            automationId : 'positions-wage-information-bottom-toolbar',
                            defaults : {
                                minWidth : criterion.Consts.UI_DEFAULTS.MIN_BUTTON_WIDTH
                            },
                            items : buttons
                        }]
                    },
                    {
                        title : i18n.pgettext('position/form', 'Recruiting'),
                        itemId : 'recruiting',
                        isSubMenuItem : true,

                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },

                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_ACCORDION_WIDER,
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.POSITION_RECRUTING, criterion.SecurityManager.READ),
                        items : [
                            {
                                dockedItems : [
                                    {
                                        xtype : 'panel',
                                        dock : 'top',
                                        header : {
                                            bind : {
                                                title : '{positionRecord.title}'
                                            }
                                        }
                                    },
                                    {
                                        xtype : 'container',
                                        dock : 'bottom',
                                        flex : 4,
                                        layout : 'fit',
                                        items : [
                                            {
                                                xtype : 'htmleditor',
                                                fieldLabel : i18n.pgettext('position/form', 'Description'),
                                                name : 'description',
                                                cls : 'descriptionField',
                                                enableAlignments : false,
                                                padding : '20 50 25 25',
                                                labelWidth : 160,
                                                disableDirtyCheck : true,
                                                bind : {
                                                    value : '{positionRecord.description}',
                                                    readOnly : '{readOnly}'
                                                }
                                            }
                                        ]
                                    }
                                ],

                                plugins : [
                                    'criterion_responsive_column'
                                ],
                                items : [
                                    {
                                        items : [
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.pgettext('position/form', 'Education'),
                                                codeDataId : DICT.EDUCATION,
                                                name : 'educationCd',
                                                bind : {
                                                    value : '{positionRecord.educationCd}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.pgettext('position/form', 'Experience'),
                                                codeDataId : DICT.EXPERIENCE,
                                                name : 'experienceCd',
                                                bind : {
                                                    value : '{positionRecord.experienceCd}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.pgettext('position/form', 'Security Clearance'),
                                                codeDataId : DICT.SECURITY_CLEARANCE,
                                                allowBlank : true,
                                                bind : {
                                                    value : '{positionRecord.securityClearanceCd}',
                                                    readOnly : '{readOnly}'
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        items : [
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.pgettext('position/form', 'Travel Requirements'),
                                                codeDataId : DICT.TRAVEL_REQUIREMENTS,
                                                allowBlank : true,
                                                sortByDisplayField : false,
                                                bind : {
                                                    value : '{positionRecord.travelRequirementsCd}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.pgettext('position/form', 'Work from Home'),
                                                codeDataId : DICT.WORK_FROM_HOME,
                                                allowBlank : true,
                                                bind : {
                                                    value : '{positionRecord.workFromHomeCd}',
                                                    readOnly : '{readOnly}'
                                                }
                                            },
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.pgettext('position/form', 'Dress / Attire'),
                                                codeDataId : DICT.DRESS,
                                                allowBlank : true,
                                                bind : {
                                                    value : '{positionRecord.dressCd}',
                                                    readOnly : '{readOnly}'
                                                }
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                title : i18n.pgettext('position/form', 'Skills'),

                                items : [
                                    {
                                        xtype : 'criterion_gridview',
                                        reference : 'skillsGrid',

                                        padding : '0 0 30',

                                        controller : {
                                            type : 'criterion_settings_hr_position_skills_grid',
                                            editor : {
                                                xtype : 'criterion_settings_common_skill_form',
                                                allowDelete : true,
                                                plugins : [
                                                    {
                                                        ptype : 'criterion_sidebar',
                                                        modal : true,
                                                        height : 'auto',
                                                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                                                    }
                                                ],
                                                draggable : true
                                            },
                                            connectParentView : false
                                        },

                                        viewModel : {
                                            stores : {
                                                allSkills : {
                                                    type : 'criterion_skills',
                                                    autoLoad : true
                                                }
                                            }
                                        },

                                        tbar : [
                                            {
                                                xtype : 'button',
                                                reference : 'addButton',
                                                text : i18n.pgettext('position/form', 'Add'),
                                                cls : 'criterion-btn-feature',
                                                listeners : {
                                                    click : 'handleAddClick'
                                                },
                                                bind : {
                                                    disabled : '{readOnly}',
                                                    hidden : '{isPendingWorkflow}'
                                                }
                                            }
                                        ],

                                        bind : {
                                            store : '{isPendingWorkflow ? positionSkills : positionRecord.skills}',
                                            disabled : '{readOnly}'
                                        },

                                        width : '100%',
                                        columns : [
                                            {
                                                xtype : 'codedatacolumn',
                                                dataIndex : 'skillCategoryCd',
                                                codeDataId : DICT.SKILL_CATEGORY,
                                                reference : 'skillCategory',
                                                text : i18n.pgettext('position/form', 'Category'),
                                                flex : 1
                                            },
                                            {
                                                xtype : 'gridcolumn',
                                                text : i18n.pgettext('position/form', 'Skill'),
                                                flex : 1,
                                                dataIndex : 'skillId',
                                                renderer : function(value, metaData, record) {
                                                    let skill = record && record.getSkill && record.getSkill() || record.get('skill');

                                                    if (!value && !record.phantom && skill) {
                                                        return skill.get('name');
                                                    } else {
                                                        return (value) ? this.getViewModel().get('allSkills').getById(record.get('skillId')).get('name') : '';
                                                    }
                                                }
                                            },
                                            {
                                                xtype : 'codedatacolumn',
                                                dataIndex : 'skillLevelCd',
                                                codeDataId : DICT.SKILL_LEVEL,
                                                text : i18n.pgettext('position/form', 'Level'),
                                                flex : 1
                                            },
                                            {
                                                xtype : 'criterion_actioncolumn',
                                                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                                                bind : {
                                                    hidden : '{isPendingWorkflow}'
                                                },
                                                items : [
                                                    {
                                                        glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                                        tooltip : i18n.pgettext('position/form', 'Delete'),
                                                        text : '',
                                                        action : 'removeaction',
                                                        disabled : false,
                                                        bind : {
                                                            disabled : '{readOnly}'
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        dockedItems : [{
                            xtype : 'toolbar',
                            ui : 'footer',
                            dock : 'bottom',
                            automationId : 'positions-wage-information-bottom-toolbar',
                            defaults : {
                                minWidth : criterion.Consts.UI_DEFAULTS.MIN_BUTTON_WIDTH
                            },
                            items : buttons
                        }]
                    },
                    {
                        title : i18n.pgettext('position/form', 'Assignments'),

                        itemId : 'list',
                        isSubMenuItem : true,
                        scrollable : 'vertical',
                        layout : 'fit',
                        securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.POSITION_ASSIGNMENTS, criterion.SecurityManager.READ),
                        dockedItems : [
                            {
                                xtype : 'panel',
                                dock : 'top',
                                header : {
                                    bind : {
                                        title : '{positionRecord.title}'
                                    }
                                }
                            }
                        ],

                        items : [
                            {
                                xtype : 'criterion_positions_assignments',
                                bind : {
                                    store : '{assignments}'
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };

});
