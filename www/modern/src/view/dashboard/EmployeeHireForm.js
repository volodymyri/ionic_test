Ext.define('ess.view.dashboard.EmployeeHireForm', function() {

    const DICT = criterion.consts.Dict;

    return {

        alias : 'widget.ess_modern_dashboard_employee_hire_form',

        extend : 'Ext.Container',

        requires : [
            'criterion.model.Person',
            'criterion.model.person.Address',
            'criterion.model.Employee',
            'criterion.model.Employer',
            'criterion.model.assignment.Detail',
            'criterion.model.Position',
            'criterion.store.employee.Onboardings',

            'criterion.store.employer.WorkLocations',
            'criterion.store.employeeGroup.Available'
        ],

        cls : 'ess-modern-dashboard-employee-hire-form',

        margin : '0 0 20 0',

        viewModel : {
            stores : {
                employerWorkLocations : {
                    type : 'employer_work_locations'
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
                employeeOnboardings : {
                    type : 'criterion_employee_onboardings',
                    sorters : [{
                        property : 'sequence',
                        direction : 'ASC'
                    }]
                }
            },
            formulas : {
                schoolDistrict : function(data) {
                    let schdistName = data('address.schdistName'),
                        schdist = data('address.schdist');

                    if (schdistName) {
                        schdistName += schdist ? Ext.util.Format.format(' ({0})', schdist) : '';
                    } else {
                        schdistName = schdist;
                    }

                    return schdistName;
                }
            }
        },

        items : [
            // Demographics
            {
                xtype : 'container',
                margin : '10 20 0 20',
                flex : 1,

                defaults : {
                    labelAlign : 'left',
                    width : '100%',
                    readOnly : true
                },

                items : [
                    {
                        xtype : 'component',
                        cls : 'bold',
                        html : i18n.gettext('DEMOGRAPHICS'),
                        margin : '0 0 5 0'
                    },

                    {
                        xtype : 'criterion_code_detail_select',
                        codeDataId : DICT.SALUTATION,
                        label : i18n.gettext('Prefix'),
                        readOnly : true,
                        bind : {
                            value : '{person.prefixCd}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('First Name'),
                        bind : {
                            value : '{person.firstName}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('Middle Name'),
                        bind : {
                            value : '{person.middleName}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('Last Name'),
                        bind : {
                            value : '{person.lastName}'
                        }
                    },
                    {
                        xtype : 'criterion_code_detail_select',
                        codeDataId : DICT.GENERATION,
                        label : i18n.gettext('Suffix'),
                        bind : {
                            value : '{person.suffixCd}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('Nickname'),
                        bind : {
                            value : '{person.nickName}'
                        }
                    },
                    {
                        xtype : 'datefield',
                        label : i18n.gettext('Date of Birth'),
                        bind : {
                            value : '{person.dateOfBirth}'
                        }
                    },
                    {
                        xtype : 'criterion_code_detail_select',
                        codeDataId : DICT.GENDER,
                        label : i18n.gettext('Gender'),
                        bind : {
                            value : '{person.genderCd}'
                        }
                    },
                    {
                        xtype : 'criterion_code_detail_select',
                        codeDataId : DICT.MARITAL_STATUS,
                        label : i18n.gettext('Marital Status'),
                        bind : {
                            value : '{person.maritalStatusCd}'
                        }
                    },
                    {
                        xtype : 'criterion_code_detail_select',
                        codeDataId : DICT.COUNTRY,
                        label : i18n.gettext('Citizenship'),
                        bind : {
                            value : '{person.citizenshipCountryCd}'
                        }
                    },
                    {
                        xtype : 'criterion_code_detail_select',
                        codeDataId : DICT.ETHNICITY,
                        label : i18n.gettext('Ethnicity'),
                        bind : {
                            value : '{person.ethnicityCd}'
                        }
                    },
                    {
                        xtype : 'criterion_field_ssn',
                        label : i18n.gettext('Social Security Number'),
                        readOnly : true,
                        name : 'nationalIdentifier_',
                        bind : {
                            value : '{person.nationalIdentifier}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('Work Phone'),
                        bind : {
                            value : '{person.workPhone}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('Home Phone'),
                        bind : {
                            value : '{person.homePhone}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('Mobile Phone'),
                        bind : {
                            value : '{person.mobilePhone}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('Email'),
                        bind : {
                            value : '{person.email}'
                        }
                    }
                ]
            },

            // Address
            {
                xtype : 'container',
                margin : '10 20 0 20',
                flex : 1,
                defaults : {
                    labelAlign : 'left',
                    width : '100%',
                    readOnly : true
                },

                items : [
                    {
                        xtype : 'component',
                        cls : 'bold',
                        html : i18n.gettext('ADDRESS'),
                        margin : '20 0 10 0'
                    },

                    {
                        xtype : 'criterion_code_detail_select',
                        codeDataId : DICT.ADDRESS_LOCATION,
                        label : i18n.gettext('Location type'),
                        bind : {
                            value : '{address.addressLocationCd}'
                        }
                    },
                    {
                        xtype : 'criterion_code_detail_select',
                        codeDataId : DICT.COUNTRY,
                        label : i18n.gettext('Country'),
                        bind : {
                            value : '{address.countryCd}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('Address 1'),
                        bind : {
                            value : '{address.address1}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('Address 2'),
                        bind : {
                            value : '{address.address2}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('City'),
                        bind : {
                            value : '{address.city}'
                        }
                    },
                    {
                        xtype : 'criterion_code_detail_select',
                        codeDataId : DICT.STATE,
                        label : i18n.gettext('State'),
                        bind : {
                            value : '{address.stateCd}'
                        }
                    },
                    {
                        xtype : 'togglefield',
                        label : i18n.gettext('Mailing Address'),
                        bind : {
                            value : '{address.isMailingAddress}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('County'),
                        name : 'county',
                        bind : {
                            value : '{address.county}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('Zip Code'),
                        bind : {
                            value : '{address.postalCode}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('Geocode / GNIS'),
                        name : 'geocode',
                        padding : '0 5 0 0',
                        flex : 1,
                        bind : {
                            value : '{address.geocode}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('School District'),
                        bind : {
                            value : '{schoolDistrict}'
                        }
                    }
                ]
            },

            // Employment Information
            {
                xtype : 'container',
                margin : '20 20 0 20',
                flex : 1,
                defaults : {
                    labelAlign : 'left',
                    width : '100%',
                    readOnly : true
                },

                items : [
                    {
                        xtype : 'component',
                        cls : 'bold',
                        html : i18n.gettext('EMPLOYMENT INFORMATION'),
                        margin : '10 0 10 0'
                    },

                    {
                        xtype : 'textfield',
                        label : i18n.gettext('Employer'),
                        bind : {
                            value : '{employer.legalName}'
                        }
                    },
                    {
                        xtype : 'datefield',
                        label : i18n.gettext('Hire Date'),
                        bind : {
                            value : '{employee.hireDate}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('Position'),
                        bind : {
                            value : '{assignmentDetail.positionCode}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('Title'),
                        bind : {
                            value : '{assignmentDetail.title}'
                        }
                    },
                    {
                        xtype : 'criterion_code_detail_select',
                        label : i18n.gettext('Action'),
                        codeDataId : DICT.ASSIGNMENT_ACTION,
                        bind : {
                            value : '{assignmentDetail.assignmentActionCd}'
                        }
                    },

                    {
                        xtype : 'criterion_combobox',
                        label : i18n.gettext('Location'),
                        bind : {
                            store : '{employerWorkLocations}',
                            value : '{assignmentDetail.employerWorkLocationId}'
                        },
                        valueField : 'id',
                        displayField : 'description',
                        autoSelect : true
                    },
                    {
                        xtype : 'criterion_code_detail_select',
                        label : i18n.gettext('Department'),
                        codeDataId : criterion.consts.Dict.DEPARTMENT,
                        allowBlank : false,
                        bind : {
                            value : '{assignmentDetail.departmentCd}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('Salary Grade'),
                        hidden : true,
                        bind : {
                            value : '{salaryGradeName}',
                            hidden : '{!salaryGradeName}'
                        }
                    },
                    {
                        xtype : 'criterion_field_currency_field',
                        label : i18n.gettext('Pay Rate'),
                        isRatePrecision : true,
                        useGlobalFormat : false,
                        currencySymbol : '$',
                        thousandSeparator : ',',
                        decimalSeparator : '.',
                        decimalPrecision : 0,
                        currencySymbolPos : false,
                        bind : {
                            value : '{assignmentDetail.payRate}'
                        }
                    },
                    {
                        xtype : 'criterion_code_detail_select',
                        label : i18n.gettext('Pay Rate Unit'),
                        codeDataId : DICT.RATE_UNIT,
                        allowBlank : false,
                        bind : {
                            value : '{assignmentDetail.rateUnitCd}'
                        }
                    },

                    {
                        xtype : 'togglefield',
                        label : i18n.gettext('Exempt'),
                        bind : {
                            value : '{assignmentDetail.isExempt}'
                        }
                    },
                    {
                        xtype : 'togglefield',
                        label : i18n.gettext('Salary'),
                        bind : {
                            value : '{assignmentDetail.isSalary}'
                        }
                    },
                    {
                        xtype : 'criterion_code_detail_select',
                        label : i18n.gettext('Cost Center'),
                        codeDataId : criterion.consts.Dict.COST_CENTER,
                        bind : {
                            value : '{assignmentDetail.costCenterCd}'
                        }
                    },
                    {
                        xtype : 'criterion_code_detail_select',
                        label : i18n.gettext('Type'),
                        codeDataId : criterion.consts.Dict.POSITION_TYPE,
                        allowBlank : true,
                        bind : {
                            value : '{assignmentDetail.positionTypeCd}'
                        }
                    },
                    {
                        xtype : 'numberfield',
                        label : i18n.gettext('Full Time Equivalency'),
                        bind : {
                            value : '{assignmentDetail.fullTimeEquivalency}'
                        }
                    },
                    {
                        xtype : 'textfield',
                        label : i18n.gettext('Employee Number'),
                        bind : {
                            value : '{employee.employeeNumber}'
                        }
                    },
                    {
                        xtype : 'criterion_field_tagfield',
                        multiSelect : true,
                        displayField : 'name',
                        valueField : 'id',
                        label : 'Employee Groups',
                        disabled : true,
                        bind : {
                            store : '{availableEmployeeGroups}',
                            value : '{employeeGroupIds}'
                        }
                    },

                    {
                        xtype : 'numberfield',
                        label : i18n.gettext('Hours per Day'),
                        bind : {
                            value : '{assignmentDetail.averageHours}'
                        }
                    },
                    {
                        xtype : 'numberfield',
                        label : i18n.gettext('Days per Week'),
                        bind : {
                            value : '{assignmentDetail.averageDays}'
                        }
                    },
                    {
                        xtype : 'numberfield',
                        label : i18n.gettext('Weeks per Year'),
                        bind : {
                            value : '{assignmentDetail.averageWeeks}'
                        }
                    },

                    {
                        xtype : 'container',
                        ref : 'positionReport',
                        defaults : {
                            labelAlign : 'left',
                            width : '100%',
                            readOnly : true
                        },
                        items : [
                            // dynamic
                        ]
                    }
                ]
            },

            {
                xtype : 'container',
                margin : '20 20 0 20',
                ref : 'organizationReporting',
                flex : 1,
                defaults : {
                    labelAlign : 'left',
                    width : '100%',
                    readOnly : true
                },

                items : [
                    {
                        xtype : 'component',
                        cls : 'bold',
                        html : i18n.gettext('Organization Reporting'),
                        margin : '10 0 10 0'
                    },


                ]
            },

            // Onboarding
            {
                xtype : 'container',
                margin : '10 0 0 0',
                flex : 1,

                items : [
                    {
                        xtype : 'component',
                        cls : 'bold',
                        html : i18n.gettext('ONBOARDING'),
                        margin : '20 0 10 20'
                    },

                    {
                        xtype : 'criterion_grid',
                        bind : {
                            store : '{employeeOnboardings}'
                        },
                        height : 200,
                        columns : [
                            {
                                xtype : 'criterion_codedatacolumn',
                                text : i18n.gettext('Group'),
                                dataIndex : 'onboardingGroupCd',
                                flex : 2,
                                codeDataId : DICT.ONBOARDING_GROUP
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Sequence'),
                                dataIndex : 'sequence'
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Name'),
                                dataIndex : 'name',
                                flex : 1
                            },
                            {
                                xtype : 'criterion_codedatacolumn',
                                text : i18n.gettext('Type'),
                                dataIndex : 'onboardingTaskTypeCd',
                                flex : 1,
                                codeDataId : DICT.ONBOARDING_TASK_TYPE
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Workflow'),
                                dataIndex : 'workflowName',
                                flex : 1
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Assigned To'),
                                dataIndex : 'assignedToEmployeeName',
                                flex : 1
                            }
                        ]
                    }
                ]
            }
        ],

        setWorkflowLog : function(workflowLog) {
            if (!workflowLog || workflowLog.workflowTypeCode !== criterion.Consts.WORKFLOW_TYPE_CODE.ASSIGNMENT || workflowLog.requestType !== criterion.Consts.WORKFLOW_REQUEST_TYPE.EMPLOYEE_HIRE) {
                return;
            }

            this.load(workflowLog['requestData']);
        },

        load : function(requestData) {
            let vm = this.getViewModel(),
                positionReport = this.down('[ref=positionReport]'),
                organizationReporting = this.down('[ref=organizationReporting]');

            Ext.promise.Promise.all([
                vm.getStore('employerWorkLocations').loadWithPromise({
                    params : {
                        employerId : requestData.employee.employerId
                    }
                }),
                vm.getStore('availableEmployeeGroups').loadWithPromise({
                    params : {
                        employerId : requestData.employee.employerId
                    }
                }),
                criterion.CodeDataManager.load([DICT.WF_STRUCTURE, DICT.ORG_STRUCTURE])
            ]).then(() => {
                vm.set({
                    person : Ext.create('criterion.model.Person', requestData.person),
                    address : Ext.create('criterion.model.person.Address', requestData.address),

                    employer : Ext.create('criterion.model.Employer', requestData.additionalData.employerData),
                    employee : Ext.create('criterion.model.Employee', requestData.employee),
                    assignmentDetail : Ext.create('criterion.model.assignment.Detail', requestData.assignmentDetail),
                    salaryGradeName : requestData.additionalData.salaryGradeName !== "" ? requestData.additionalData.salaryGradeName : null,
                    employeeGroupIds : Ext.Array.map(requestData.groups || [], (val) => val.employeeGroupId)
                });

                criterion.CodeDataManager.getStore(DICT.WF_STRUCTURE).each(function(codeDetail, idx) {
                    positionReport.add({
                        xtype : 'textfield',
                        label : codeDetail.get('description'),
                        bind : {
                            value : '{assignmentDetail.wf' + (idx + 1) + 'EmployeeName}'
                        }
                    })
                });

                criterion.CodeDataManager.getStore(DICT.ORG_STRUCTURE).each(function(codeDetail, idx) {
                    if (!codeDetail.get('isActive')) {
                        return;
                    }

                    organizationReporting.add({
                        xtype : 'textfield',
                        label : codeDetail.get('description'),
                        value : requestData.additionalData.orgStructureNames['org' + codeDetail.get('attribute1') + 'PersonName']
                    })
                });
            });

            vm.getStore('employeeOnboardings').loadData(requestData.onboarding);
        }
    }
});
