Ext.define('criterion.view.recruiting.jobs.Position', function() {

    return {
        alias : 'widget.criterion_recruiting_jobs_position',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.recruiting.jobs.Position',
            'criterion.model.SalaryGradeGradeStep',
            'criterion.store.SalaryGradesGradeStep',
            'criterion.store.employer.WorkLocations',
            'criterion.store.employer.WorkPeriods'
        ],

        viewModel : {
            data : {
                //jobPosting : @see criterion.model.employer.JobPosting,

                /**
                 * @see criterion.model.Position
                 */
                position : null,

                salaryGroup : null
            },
            formulas : {
                isSalaryGroupStep : function(get) {
                    var salaryGroup = get('salaryGroup');
                    if (!salaryGroup) {
                        return null;
                    } else {
                        return !parseInt(salaryGroup.get('attribute1'));
                    }
                }
            },
            stores : {
                employerWorkLocations : {
                    type : 'employer_work_locations'
                },
                salaryGradesStore : {
                    type : 'criterion_salary_grades_grade_step',
                    sorters : 'sequence'
                },
                salaryGradesStepsStore : {
                    type : 'store',
                    fields : [
                        {name : 'id', type : 'integer'},
                        {name : 'stepName', type : 'string'},
                        {name : 'rate', type : 'float'}
                    ]
                },
                employerWorkPeriods : {
                    type : 'criterion_employer_work_periods'
                }
            }
        },

        controller : {
            type : 'criterion_recruiting_jobs_position'
        },

        listeners : {
            activate : 'onActivate'
        },

        defaults : Ext.Object.merge({}, criterion.Consts.UI_CONFIG.TWO_COL_ACCORDION_WIDER, {
            defaults : {
                defaults : {
                    readOnly : true
                }
            }
        }),

        modelValidation : false,
        scrollable : 'vertical',

        items : [
            {
                layout : 'hbox',
                plugins : [
                    'criterion_responsive_column'
                ],

                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Desired Experience'),
                                codeDataId : criterion.consts.Dict.EXPERIENCE,
                                allowBlank : true,
                                bind : {
                                    value : '{position.experienceCd}'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Desired Education'),
                                codeDataId : criterion.consts.Dict.EDUCATION,
                                allowBlank : true,
                                bind : {
                                    value : '{position.educationCd}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Exempt'),
                                bind : '{position.isExempt}'
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('EEO Category'),
                                codeDataId : criterion.consts.Dict.EEOC,
                                allowBlank : true,
                                bind : {
                                    value : '{position.eeocCd}'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'component',
                autoEl : 'hr',
                cls : 'criterion-horizontal-ruler'
            },
            {
                layout : 'hbox',
                plugins : [
                    'criterion_responsive_column'
                ],
                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Type'),
                                codeDataId : criterion.consts.Dict.POSITION_TYPE,
                                allowBlank : true,
                                bind : {
                                    value : '{position.positionTypeCd}'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Department'),
                                codeDataId : criterion.consts.Dict.DEPARTMENT,
                                allowBlank : true,
                                bind : {
                                    value : '{position.departmentCd}'
                                }
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Location'),
                                valueField : 'id',
                                displayField : 'code',
                                queryMode : 'local',
                                bind : {
                                    value : '{position.employerWorkLocationId}',
                                    store : '{employerWorkLocations}'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Security Clearance'),
                                codeDataId : criterion.consts.Dict.SECURITY_CLEARANCE,
                                allowBlank : true,
                                bind : {
                                    value : '{position.securityClearanceCd}'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Work Authorization'),
                                codeDataId : criterion.consts.Dict.WORK_AUTHORIZATION,
                                allowBlank : true,
                                bind : {
                                    value : '{position.workAuthorizationCd}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Work Period'),
                                valueField : 'id',
                                displayField : 'name',
                                queryMode : 'local',
                                bind : {
                                    value : '{position.workPeriodId}',
                                    store : '{employerWorkPeriods}'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Travel Requirements'),
                                codeDataId : criterion.consts.Dict.TRAVEL_REQUIREMENTS,
                                allowBlank : true,
                                bind : {
                                    value : '{position.travelRequirementsCd}'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Work from Home'),
                                codeDataId : criterion.consts.Dict.WORK_FROM_HOME,
                                allowBlank : true,
                                bind : {
                                    value : '{position.workFromHomeCd}'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Dress / Attire'),
                                codeDataId : criterion.consts.Dict.DRESS,
                                allowBlank : true,
                                bind : {
                                    value : '{position.dressCd}'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'component',
                autoEl : 'hr',
                cls : 'criterion-horizontal-ruler'
            },
            {
                layout : 'hbox',
                plugins : [
                    'criterion_responsive_column'
                ],
                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_currencyfield',
                                fieldLabel : i18n.gettext('Target Pay Rate'),
                                isRatePrecision : true,
                                bind : '{position.payRate}'
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Pay Rate Unit'),
                                codeDataId : criterion.consts.Dict.RATE_UNIT,
                                allowBlank : true,
                                bind : {
                                    value : '{position.rateUnitCd}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Salary'),
                                name : 'isSalary',
                                bind : '{position.isSalary}'
                            },
                            {
                                xtype : 'combo',
                                fieldLabel : i18n.gettext('Salary Grade (Min)'),
                                reference : 'salaryGradeCombo1',
                                allowBlank : true,
                                editable : false,
                                displayField : 'gradeName',
                                valueField : 'id',
                                disableDirtyCheck : true,
                                bind : {
                                    store : '{salaryGradesStore}',
                                    visible : '{!isSalaryGroupStep}',
                                    value : '{position.minSalaryGradeId}'
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
                                )
                            },
                            {
                                xtype : 'combo',
                                reference : 'salaryGradeStepCombo1',
                                fieldLabel : i18n.gettext('Salary Grade (Min)'),
                                allowBlank : true,
                                editable : false,
                                displayField : 'stepName',
                                valueField : 'id',
                                disableDirtyCheck : true,
                                bind : {
                                    visible : '{isSalaryGroupStep}',
                                    store : '{salaryGradesStepsStore}',
                                    value : '{position.minSalaryGradeId}'
                                },
                                queryMode : 'local',
                                visible : false,
                                tpl : Ext.create('Ext.XTemplate',
                                    '<ul class="x-list-plain"><tpl for=".">',
                                    '<li role="option" class="x-boundlist-item">{stepName} ({rate:currency})</li>',
                                    '</tpl></ul>'),
                                displayTpl : Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    "{stepName} ({rate:currency})",
                                    '</tpl>'
                                )
                            },
                            {
                                xtype : 'combo',
                                fieldLabel : i18n.gettext('Salary Grade (Max)'),
                                reference : 'salaryGradeCombo2',
                                allowBlank : true,
                                editable : false,
                                displayField : 'gradeName',
                                valueField : 'id',
                                disableDirtyCheck : true,
                                bind : {
                                    store : '{salaryGradesStore}',
                                    visible : '{!isSalaryGroupStep}',
                                    value : '{position.maxSalaryGradeId}'
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
                                )
                            },
                            {
                                xtype : 'combo',
                                fieldLabel : i18n.gettext('Salary Grade (Max)'),
                                reference : 'salaryGradeStepCombo2',
                                allowBlank : true,
                                editable : false,
                                displayField : 'stepName',
                                valueField : 'id',
                                disableDirtyCheck : true,
                                bind : {
                                    visible : '{isSalaryGroupStep}',
                                    store : '{salaryGradesStepsStore}',
                                    value : '{position.maxSalaryGradeId}'
                                },
                                queryMode : 'local',
                                visible : false,
                                tpl : Ext.create('Ext.XTemplate',
                                    '<ul class="x-list-plain"><tpl for=".">',
                                    '<li role="option" class="x-boundlist-item">{stepName} ({rate:currency})</li>',
                                    '</tpl></ul>'),
                                displayTpl : Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '{stepName} ({rate:currency})',
                                    '</tpl>'
                                )
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Cost Center'),
                                codeDataId : criterion.consts.Dict.COST_CENTER,
                                allowBlank : true,
                                bind : {
                                    value : '{position.costCenterCd}'
                                }
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Avg. Days / Week'),
                                bind : '{position.averageDays}'
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Avg. Hours / Day'),
                                bind : '{position.averageHours}'
                            },
                            {
                                xtype : 'criterion_form_high_precision_field',
                                namePrecision : 'amountPrecision',
                                fieldLabel : i18n.gettext('Full Time Equivalency'),
                                bind : '{position.fullTimeEquivalency}'
                            }
                        ]
                    }
                ]
            }
        ]
    };

});
