Ext.define('ess.view.dashboard.PositionForm', function() {

    var DICT = criterion.consts.Dict;

    return {

        alias : 'widget.ess_modern_dashboard_position_form',

        extend : 'Ext.Panel',

        requires : [
            'criterion.store.employer.WorkPeriods',
            'criterion.store.employer.WorkersCompensations',
            'criterion.ux.field.CurrencyField',
            'ess.view.dashboard.PositionSkills'
        ],

        cls : 'ess-modern-dashboard-position-form',

        viewModel : {
            data : {
                showSkills : false
            },

            stores : {
                employerWorkPeriods : {
                    type : 'criterion_employer_work_periods'
                },
                workersCompensations : {
                    type : 'criterion_employer_worker_compensations'
                }
            }
        },

        defaults : {
            labelWidth : '50%',
            labelAlign : 'left',
            width : '100%',
            disabled : true
        },

        bodyPadding : 20,

        items : [
            {
                xtype : 'component',
                html : i18n.gettext('Position Details'),
                cls : 'section-title'
            },
            {
                xtype : 'textfield',
                name : 'code',
                label : i18n.gettext('Code'),
                bind : '{requestData.code}'
            },
            {
                xtype : 'textfield',
                name : 'jobDescription',
                label : i18n.gettext('Job'),
                bind : '{requestData.jobDescription}'
            },
            {
                xtype : 'textfield',
                name : 'title',
                label : i18n.gettext('Title'),
                bind : '{requestData.title}'
            },
            {
                xtype : 'textfield',
                name : 'employerWorkLocation',
                label : i18n.gettext('Location'),
                bind : '{requestData.employerWorkLocation}'
            },
            {
                xtype : 'criterion_code_detail_select',
                name : 'departmentCd',
                codeDataId : DICT.DEPARTMENT,
                label : i18n.gettext('Department'),
                bind : '{requestData.departmentCd}'
            },
            {
                xtype : 'criterion_code_detail_select',
                label : i18n.gettext('Division'),
                codeDataId : DICT.DIVISION,
                bind : '{requestData.divisionCd}'
            },
            {
                xtype : 'criterion_code_detail_select',
                label : i18n.gettext('Section'),
                codeDataId : DICT.SECTION,
                bind : '{requestData.sectionCd}'
            },
            {
                xtype : 'criterion_code_detail_select',
                name : 'costCenterCd',
                codeDataId : DICT.COST_CENTER,
                label : i18n.gettext('Cost Center'),
                bind : '{requestData.costCenterCd}'
            },
            {
                xtype : 'textfield',
                name : 'fullTimeEquivalency',
                label : i18n.gettext('Full Time Equivalency'),
                bind : '{requestData.fullTimeEquivalency}'
            },
            {
                xtype : 'togglefield',
                name : 'isActive',
                label : i18n.gettext('Active'),
                bind : '{requestData.isActive}'
            },
            {
                xtype : 'togglefield',
                name : 'isExempt',
                label : i18n.gettext('Exempt'),
                bind : '{requestData.isExempt}'
            },
            {
                xtype : 'criterion_code_detail_select',
                name : 'positionTypeCd',
                codeDataId : DICT.POSITION_TYPE,
                label : i18n.gettext('Type'),
                bind : '{requestData.positionTypeCd}'
            },
            {
                xtype : 'criterion_code_detail_select',
                name : 'eeocCd',
                codeDataId : DICT.EEOC,
                label : i18n.gettext('EEO Category'),
                bind : '{requestData.eeocCd}'
            },
            {
                xtype : 'criterion_combobox',
                label : i18n.gettext('Work Period'),
                bind : {
                    store : '{employerWorkPeriods}',
                    value : '{requestData.workPeriodId}'
                },
                displayField : 'name',
                valueField : 'id',
                autoSelect : false
            },
            {
                xtype : 'criterion_code_detail_select',
                name : 'categoryCd',
                codeDataId : DICT.POSITION_CATEGORY,
                label : i18n.gettext('Category'),
                bind : '{requestData.categoryCd}'
            },
            {
                xtype : 'criterion_code_detail_select',
                name : 'workersCompensationCd',
                codeDataId : DICT.WORKERS_COMPENSATION,
                label : i18n.gettext('Worker Compensation'),
                bind : '{requestData.workersCompensationCd}'
            },
            // WAGE
            {
                xtype : 'component',
                html : i18n.gettext('Wage Information'),
                margin : '20 0 10 0',
                cls : 'section-title'
            },
            {
                xtype : 'criterion_code_detail_select',
                name : 'salaryGroupCd',
                codeDataId : DICT.SALARY_GROUP,
                label : i18n.gettext('Salary Group'),
                bind : '{requestData.minSalaryGroupCd || requestData.maxSalaryGroupCd}'
            },
            {
                xtype : 'textfield',
                name : 'minSalaryGrade',
                label : i18n.gettext('Salary Grade (Min)'),
                bind : '{requestData.minSalaryGrade}'
            },
            {
                xtype : 'textfield',
                name : 'maxSalaryGrade',
                label : i18n.gettext('Salary Grade (Max)'),
                bind : '{requestData.maxSalaryGrade}'
            },
            {
                xtype : 'togglefield',
                name : 'isSalary',
                label : i18n.gettext('Salary'),
                bind : '{requestData.isSalary}'
            },
            {
                xtype : 'criterion_code_detail_select',
                name : 'rateUnitCd',
                codeDataId : DICT.RATE_UNIT,
                label : i18n.gettext('Pay Rate Unit'),
                bind : '{requestData.rateUnitCd}'
            },
            {
                xtype : 'criterion_field_currency_field',
                name : 'payRate',
                label : i18n.gettext('Target Pay Rate'),
                isRatePrecision : true,
                useGlobalFormat : false,
                currencySymbol : '$',
                thousandSeparator : ',',
                decimalSeparator : '.',
                decimalPrecision : 0,
                currencySymbolPos : false,
                bind : '{requestData.payRate}'
            },

            // Classification
            {
                xtype : 'component',
                html : i18n.gettext('Classification'),
                margin : '20 0 10 0',
                cls : 'section-title'
            },
            {
                xtype : 'numberfield',
                name : 'averageHours',
                label : i18n.gettext('Hours per Day'),
                bind : '{requestData.averageHours}'
            },
            {
                xtype : 'numberfield',
                name : 'averageDays',
                label : i18n.gettext('Days per Week'),
                bind : '{requestData.averageDays}'
            },
            {
                xtype : 'numberfield',
                name : 'averageWeeks',
                label : i18n.gettext('Weeks per Year'),
                bind : '{requestData.averageWeeks}'
            },
            {
                xtype : 'togglefield',
                name : 'isHighSalary',
                label : i18n.gettext('HCE'),
                bind : '{requestData.isHighSalary}'
            },
            {
                xtype : 'togglefield',
                name : 'isSeasonal',
                label : i18n.gettext('Seasonal'),
                bind : '{requestData.isSeasonal}'
            },
            {
                xtype : 'togglefield',
                name : 'isOfficer',
                label : i18n.gettext('Officer'),
                bind : '{requestData.isOfficer}'
            },
            {
                xtype : 'togglefield',
                name : 'isManager',
                label : i18n.gettext('Manager'),
                bind : '{requestData.isManager}'
            },
            {
                xtype : 'criterion_code_detail_select',
                name : 'officerCodeCd',
                codeDataId : DICT.OFFICER_CODE,
                label : i18n.gettext('Officer Code'),
                bind : '{requestData.officerCodeCd}'
            },

            // Recruiting
            {
                xtype : 'component',
                html : i18n.gettext('Recruiting'),
                margin : '20 0 10 0',
                cls : 'section-title'
            },
            {
                xtype : 'criterion_code_detail_select',
                name : 'educationCd',
                codeDataId : DICT.EDUCATION,
                label : i18n.gettext('Education'),
                bind : '{requestData.educationCd}'
            },
            {
                xtype : 'criterion_code_detail_select',
                name : 'experienceCd',
                codeDataId : DICT.EXPERIENCE,
                label : i18n.gettext('Experience'),
                bind : '{requestData.experienceCd}'
            },
            {
                xtype : 'criterion_code_detail_select',
                name : 'securityClearanceCd',
                codeDataId : DICT.SECURITY_CLEARANCE,
                label : i18n.gettext('Security Clearance'),
                bind : '{requestData.securityClearanceCd}'
            },
            {
                xtype : 'criterion_code_detail_select',
                name : 'travelRequirementsCd',
                codeDataId : DICT.TRAVEL_REQUIREMENTS,
                label : i18n.gettext('Travel Requirements'),
                bind : '{requestData.travelRequirementsCd}'
            },
            {
                xtype : 'criterion_code_detail_select',
                name : 'workFromHomeCd',
                codeDataId : DICT.WORK_FROM_HOME,
                label : i18n.gettext('Work from Home'),
                bind : '{requestData.workFromHomeCd}'
            },
            {
                xtype : 'criterion_code_detail_select',
                name : 'dressCd',
                codeDataId : DICT.DRESS,
                label : i18n.gettext('Dress / Attire'),
                bind : '{requestData.dressCd}'
            },
            {
                xtype : 'container',
                items : [
                    {
                        xtype : 'component',
                        margin : '20 0 0 0',
                        html : i18n.gettext('Description')
                    },
                    {
                        xtype : 'component',
                        bind : {
                            html : '{requestData.description}'
                        }
                    }
                ]
            },

            // Skills
            {
                xtype : 'component',
                html : i18n.gettext('Skills'),
                margin : '20 0 10 0',
                cls : 'section-title',
                hidden : true,
                bind : {
                    hidden : '{!showSkills}'
                }
            },
            {
                xtype : 'ess_modern_dashboard_position_skills',
                hidden : true,
                bind : {
                    skills : '{skillsData}',
                    hidden : '{!showSkills}'
                }
            }
        ],

        setSkills : function(aSkillsValues) {
            var vm = this.getViewModel();

            vm.set({
                showSkills : Ext.isArray(aSkillsValues) && aSkillsValues.length,
                skillsData : aSkillsValues
            });
        },

        setRequestData : function(requestData) {
            var vm = this.getViewModel(),
                employerWorkPeriods = vm.get('employerWorkPeriods'),
                workersCompensations = vm.get('workersCompensations'),
                employer,
                employerConfig,
                payRateField = this.down('[name=payRate]'),
                delegatedByEmployeeId;

            if (vm.get('workflowLog.workflowTypeCode') !== criterion.Consts.WORKFLOW_TYPE_CODE.POSITION) {
                vm.set('requestData', requestData);
                return;
            }

            vm.set('requestData', null);

            employer = Ext.StoreManager.lookup('Employers').getById(requestData['employerId']);

            if (employer) {
                employerConfig = employer.getData();

                // reset employer settings to fields
                payRateField.currencySymbol = employerConfig['currencySign'] || '$';
                payRateField.thousandSeparator = employerConfig['thousandSeparator'] || ',';
                payRateField.decimalSeparator = employerConfig['decimalSeparator'] || '.';
                payRateField.decimalPrecision = employerConfig['ratePrecision'] || 0;
                payRateField.currencySymbolPos = employerConfig['currencyAtEnd'] || false ? 'right' : 'left';
            }

            if (!employerWorkPeriods.isLoaded() || !workersCompensations.isLoaded()) {
                delegatedByEmployeeId = vm.get('workflowLog.delegatedByEmployeeId');

                Ext.promise.Promise.all([
                    employerWorkPeriods.loadWithPromise({
                        params : (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                    }),
                    workersCompensations.loadWithPromise({
                        params : (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                    })
                ]).then(function() {
                    vm.set('requestData', requestData);
                });
            } else {
                vm.set('requestData', requestData);
            }
        }
    };
});
