Ext.define('criterion.view.employee.wizard.Employment', function() {

    const DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_employee_wizard_employment',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.employee.wizard.Employment',
            'criterion.store.WorkLocations',
            'criterion.store.employer.WorkLocations',
            'criterion.model.employee.WorkLocation',
            'criterion.view.employee.ReportingStructures',
            'criterion.view.positions.PositionReporting',
            'criterion.ux.form.trigger.Clear',
            'criterion.ux.form.CurrencyField',
            'criterion.ux.form.field.ToggleSlide',
            'criterion.ux.form.field.Tag',
            'criterion.store.employeeGroup.Available',
            'criterion.store.employeeGroup.Members',
            'criterion.store.employer.WorkPeriods',
            'criterion.store.employer.CertifiedRates'
        ],

        controller : {
            type : 'criterion_employee_wizard_employment'
        },

        viewModel : {
            data : {
                readOnly : false,
                employerId : null,
                employer : null,
                position : null,
                assignmentDetail : null,
                remainingFTE : null,
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
                },
                availableEmployeeGroups : {
                    type : 'criterion_employee_group_available',
                    filters : [
                        {
                            property : 'isDynamic',
                            value : false
                        }
                    ]
                },
                employeeGroupMember : {
                    type : 'criterion_employee_group_members'
                },
                employerWorkPeriods : {
                    type : 'criterion_employer_work_periods'
                },
                certifiedRates : {
                    type : 'employer_certified_rates'
                }
            },
            formulas : {
                isPositionEditable : data => !data('employer.isPositionControl'),
                titleEditable : data => !data('position') && !data('employer.isPositionControl'),
                isPositionReporting : data => data('employer.isPositionReporting')
            }
        },

        listeners : {
            scope : 'controller',
            activate : 'handleActivate'
        },

        title : i18n.pgettext('employee/wizard', 'Employment Information'),

        cls : 'criterion-form',

        modelValidation : true,

        recordIds : [
            'employee'
        ],

        initComponent : function() {
            this.items = [
                {
                    layout : 'hbox',
                    defaultType : 'container',

                    border : true,
                    bodyStyle : {
                        'border-width' : '0 0 1px 0 !important'
                    },

                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                    plugins : [
                        'criterion_responsive_column'
                    ],

                    items : [
                        {
                            items : [
                                {
                                    xtype : 'criterion_employer_combo',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Employer'),
                                    name : 'employerId',
                                    allowBlank : false,
                                    disabled : true,
                                    hidden : true,
                                    autoSetSingleEmployer : true,
                                    bind : {
                                        hidden : '{employersCount < 2 || readOnly}'
                                    },
                                    listeners : {
                                        change : 'handleEmployerSet'
                                    }
                                },
                                {
                                    xtype : 'criterion_employer_combo',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Employer'),
                                    disabled : true,
                                    hidden : true,
                                    bind : {
                                        hidden : '{!readOnly}',
                                        value : '{employee.employerId}'
                                    }
                                },
                                {
                                    xtype : 'fieldcontainer',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Position'),
                                    layout : 'hbox',
                                    bind : {
                                        hidden : '{readOnly}'
                                    },
                                    items : [
                                        {
                                            xtype : 'textfield',
                                            reference : 'positionCode',
                                            flex : 1,
                                            readOnlyCls : '',
                                            readOnly : true,
                                            bind : {
                                                value : '{position.code}',
                                                clearTriggerHidden : '{!isPositionEditable}'
                                            },
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
                                            glyph : criterion.consts.Glyph['ios7-search'],
                                            cls : 'criterion-btn-primary',
                                            margin : '0 0 0 5',
                                            bind : {
                                                disabled : '{!employerId}'
                                            },
                                            listeners : {
                                                click : 'onPositionSearch'
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype : 'textfield',
                                    flex : 1,
                                    readOnly : true,
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Position'),
                                    hidden : true,
                                    bind : {
                                        value : '{assignmentDetail.positionCode}',
                                        hidden : '{!readOnly}'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    flex : 1,
                                    allowBlank : false,
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Title'),
                                    bind : {
                                        value : '{assignmentDetail.title}',
                                        readOnly : '{!titleEditable}',
                                        disabled : '{readOnly}'
                                    }
                                }
                            ]
                        },
                        {
                            items : [
                                {
                                    xtype : 'datefield',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Hire Date'),
                                    bind : {
                                        value : '{employee.hireDate}',
                                        readOnly : '{readOnly}',
                                        minValue : '{minHireDate}'
                                    }
                                },
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Exempt'),
                                    bind : {
                                        value : '{assignmentDetail.isExempt}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'toggleslidefield',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Salary'),
                                    name : 'isSalary',
                                    bind : {
                                        value : '{assignmentDetail.isSalary}',
                                        readOnly : '{readOnly}'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
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
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Action'),
                                    codeDataId : DICT.ASSIGNMENT_ACTION,
                                    bind : {
                                        value : '{assignmentDetail.assignmentActionCd}',
                                        readOnly : '{readOnly}'
                                    },
                                    filterFn : function(item) {
                                        // hide any option that is correlated to the action T
                                        return item.get('attribute1') !== criterion.Consts.ASSIGNMENT_ACTIONS_FLAGS.T;
                                    }
                                },
                                {
                                    xtype : 'combo',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Salary Grade'),
                                    reference : 'salaryGradeCombo',
                                    allowBlank : true,
                                    displayField : 'gradeName',
                                    valueField : 'id',
                                    disableDirtyCheck : true,
                                    preventDefaultSorter : true,
                                    bind : {
                                        store : {
                                            fields : [
                                                {name : 'id', type : 'integer'},
                                                {name : 'sequence', type : 'integer'},
                                                {name : 'payRateCd', type : 'integer'},
                                                {name : 'gradeName', type : 'string'},
                                                {name : 'minRate', type : 'float'},
                                                {name : 'maxRate', type : 'float'},
                                                {name : 'rates', type : 'string'},
                                                {name : 'isGradeStep', type : 'boolean'}
                                            ],
                                            sorters : 'sequence'
                                        },
                                        value : '{assignmentDetail.salaryGradeId}',
                                        hidden : '{!position}',
                                        readOnly : '{readOnly}'
                                    },
                                    queryMode : 'local',
                                    tpl : Ext.create('Ext.XTemplate',
                                        '<ul class="x-list-plain"><tpl for=".">',
                                        '<li role="option" class="x-boundlist-item">{gradeName} ({rates})</li>',
                                        '</tpl></ul>'),
                                    displayTpl : Ext.create('Ext.XTemplate',
                                        '<tpl for=".">',
                                        '{gradeName} ({rates})',
                                        '</tpl>'
                                    ),
                                    listeners : {
                                        change : 'onSalaryGradeChange'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    readOnly : true,
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Salary Grade'),
                                    hidden : true,
                                    bind : {
                                        value : '{salaryGradeName}',
                                        hidden : '{!salaryGradeName}'
                                    }
                                },
                                {
                                    xtype : 'criterion_currencyfield',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Pay Rate'),
                                    reference : 'payRate',
                                    allowBlank : false,
                                    isRatePrecision : true,
                                    useGlobalFormat : false,
                                    currencySymbol : '$',
                                    thousandSeparator : ',',
                                    decimalSeparator : '.',
                                    decimalPrecision : 0,
                                    currencySymbolPos : false,
                                    bind : {
                                        value : '{assignmentDetail.payRate}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    reference : 'payRateUnitCombo',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Pay Rate Unit'),
                                    disabledCls : 'x-form-readonly',
                                    codeDataId : DICT.RATE_UNIT,
                                    allowBlank : false,
                                    bind : {
                                        value : '{assignmentDetail.rateUnitCd}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Department'),
                                    codeDataId : DICT.DEPARTMENT,
                                    allowBlank : false,
                                    bind : {
                                        value : '{assignmentDetail.departmentCd}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Cost Center'),
                                    codeDataId : DICT.COST_CENTER,
                                    bind : {
                                        value : '{assignmentDetail.costCenterCd}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Division'),
                                    codeDataId : DICT.DIVISION,
                                    bind : {
                                        value : '{assignmentDetail.divisionCd}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Section'),
                                    codeDataId : DICT.SECTION,
                                    bind : {
                                        value : '{assignmentDetail.sectionCd}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Officer Code'),
                                    codeDataId : DICT.OFFICER_CODE,
                                    bind : {
                                        value : '{assignmentDetail.officerCodeCd}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'combobox',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Certified Rate'),
                                    valueField : 'id',
                                    displayField : 'name',
                                    queryMode : 'local',
                                    editable : true,
                                    hidden : !criterion.Api.hasCertifiedRate(),
                                    bind : {
                                        value : '{assignmentDetail.certifiedRateId}',
                                        store : '{certifiedRates}',
                                        readOnly : '{readOnly}'
                                    }
                                }
                            ]
                        },
                        {
                            items : [
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Employee Number'),
                                    allowBlank : false,
                                    bind : {
                                        value : '{employee.employeeNumber}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'fieldcontainer',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Location'),
                                    layout : 'hbox',
                                    anchor : '100%',
                                    items : [
                                        {
                                            xtype : 'combobox',
                                            reference : 'workLocationCombobox',
                                            valueField : 'id',
                                            displayField : 'description',
                                            queryMode : 'local',
                                            bind : {
                                                store : '{employerWorkLocations}',
                                                value : '{assignmentDetail.employerWorkLocationId}'
                                            },
                                            flex : 1,
                                            editable : false,
                                            readOnly : true,
                                            allowBlank : false
                                        },
                                        {
                                            xtype : 'button',
                                            reference : 'selectWorkLocation',
                                            margin : '0 0 0 5',
                                            cls : 'criterion-btn-primary',
                                            glyph : criterion.consts.Glyph['ios7-search'],
                                            scale : 'small',
                                            listeners : {
                                                click : 'handleSelectWorkLocation'
                                            },
                                            bind : {
                                                hidden : '{readOnly}'
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Type'),
                                    codeDataId : DICT.POSITION_TYPE,
                                    allowBlank : true,
                                    bind : {
                                        value : '{assignmentDetail.positionTypeCd}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_form_high_precision_field',
                                    namePrecision : 'amountPrecision',
                                    reference : 'fteField',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Full Time Equivalency'),
                                    allowBlank : false,
                                    bind : {
                                        value : '{assignmentDetail.fullTimeEquivalency}',
                                        maxValue : '{remainingFTE}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'EEO Category'),
                                    codeDataId : DICT.EEOC,
                                    bind : {
                                        value : '{assignmentDetail.eeocCd}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'combobox',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Work Period'),
                                    valueField : 'id',
                                    displayField : 'name',
                                    queryMode : 'local',
                                    editable : true,
                                    bind : {
                                        value : '{assignmentDetail.workPeriodId}',
                                        store : '{employerWorkPeriods}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Category'),
                                    codeDataId : DICT.POSITION_CATEGORY,
                                    bind : {
                                        value : '{assignmentDetail.categoryCd}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'criterion_code_detail_field',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Workers Compensation'),
                                    codeDataId : DICT.WORKERS_COMPENSATION,
                                    bind : {
                                        value : '{assignmentDetail.workersCompensationCd}',
                                        readOnly : '{readOnly}'
                                    }
                                },

                                {
                                    xtype : 'criterion_tagfield',
                                    reference : 'employeeGroups',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Employee Groups'),
                                    bind : {
                                        store : '{availableEmployeeGroups}',
                                        valuesStore : '{employeeGroupMember}',
                                        hidden : '{!isEmployeePhantom}',
                                        disabled : '{!isEmployeePhantom}',
                                        readOnly : '{readOnly}'
                                    },
                                    queryMode : 'local',
                                    linkField : 'employeeGroupId',
                                    valueField : 'id',
                                    displayField : 'name'
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
                                    xtype : 'container',
                                    layout : 'hbox',
                                    padding : '0 0 20 0',
                                    items : [
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.pgettext('employee/wizard', 'HCE'),
                                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                                            flex : 1,
                                            bind : {
                                                value : '{assignmentDetail.isHighSalary}',
                                                readOnly : '{readOnly}'
                                            }
                                        },
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.pgettext('employee/wizard', 'Officer'),
                                            flex : 1,
                                            bind : {
                                                value : '{assignmentDetail.isOfficer}',
                                                readOnly : '{readOnly}'
                                            }
                                        }
                                    ]
                                },
                                {
                                    xtype : 'container',
                                    layout : 'hbox',
                                    padding : '0 0 20 0',
                                    items : [
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.pgettext('employee/wizard', 'Seasonal'),
                                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                                            flex : 1,
                                            bind : {
                                                value : '{assignmentDetail.isSeasonal}',
                                                readOnly : '{readOnly}'
                                            }
                                        },
                                        {
                                            xtype : 'toggleslidefield',
                                            fieldLabel : i18n.pgettext('employee/wizard', 'Manager'),
                                            flex : 1,
                                            bind : {
                                                value : '{assignmentDetail.isManager}',
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
                                    xtype : 'numberfield',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Hours per Day'),
                                    bind : {
                                        value : '{assignmentDetail.averageHours}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'numberfield',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Days per Week'),
                                    bind : {
                                        value : '{assignmentDetail.averageDays}',
                                        readOnly : '{readOnly}'
                                    }
                                },
                                {
                                    xtype : 'numberfield',
                                    fieldLabel : i18n.pgettext('employee/wizard', 'Weeks per Year'),
                                    bind : {
                                        value : '{assignmentDetail.averageWeeks}',
                                        readOnly : '{readOnly}'
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype : 'criterion_positions_position_reporting',
                    bind : {
                        employerId : '{employerId}',
                        recordName : 'assignmentDetail',
                        hidden : '{!employer.isPositionWorkflow}',
                        displayOnly : '{readOnly}'
                    },
                    containerPadding : null,
                    oneColumn : false,
                    title : null,
                    hidden : true,

                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                    plugins : [
                        'criterion_responsive_column'
                    ]
                },
                {
                    xtype : 'criterion_employee_reporting_structures',
                    reference : 'reportingStructures',

                    title : i18n.pgettext('employee/wizard', 'Organization Reporting'),

                    header : {
                        margin : 0
                    },

                    layout : 'hbox',
                    defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                    viewModel : {
                        data : {
                            isPendingRelationshipWorkflow : false
                        }
                    },

                    bind : {
                        employerId : '{employerId}',
                        isPositionReporting : '{isPositionReporting}',
                        disabled : '{isPositionReporting}'
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
                    withDescription : true,
                    bind : {
                        hidden : '{!showCustomfields}',
                        readOnly : '{isReadOnly}'
                    }
                },
                {
                    xtype : 'criterion_customfields_container',
                    reference : 'customfieldsAssignmentDetail',
                    entityType : criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_ASSIGNMENT_DETAIL,
                    labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                    withDescription : true,
                    bind : {
                        hidden : '{!showCustomfields}',
                        readOnly : '{isReadOnly}'
                    }
                }
            ];

            this.callParent(arguments);
        },

        getCustomfieldsEmployeeContainer : function() {
            return this.lookup('customfieldsEmployee');
        },

        getCustomfieldsAssignmentDetailContainer : function() {
            return this.lookup('customfieldsAssignmentDetail');
        },

        getOrgStructureValues : function() {
            return this.down('[reference=reportingStructures]').getOrgStructureValues();
        },

        getSalaryGradeName : function() {
            return this.down('[reference=salaryGradeCombo]').getRawValue();
        },

        setGroupValue : function(value) {
            this.down('[reference=employeeGroups]').setValue(value);
        },

        initPositionReporting : function() {
            return this.down('criterion_positions_position_reporting').init();
        },

        initReportingStructures : function(employerId, readOnly, values) {
            let reportingStructures = this.down('criterion_employee_reporting_structures');

            return reportingStructures.setEmployerId(employerId).then(() => {
                reportingStructures.getViewModel().set('readOnly', readOnly);
            });
        }
    };

});
