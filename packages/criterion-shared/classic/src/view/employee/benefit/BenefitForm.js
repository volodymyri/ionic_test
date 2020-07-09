Ext.define('criterion.view.employee.benefit.BenefitForm', function() {

    const DEDUCTION_CALC_METHOD_CODES = criterion.Consts.DEDUCTION_CALC_METHOD_CODES;

    return {
        alias : 'widget.criterion_employee_benefit_benefit_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.employee.benefit.BenefitForm',
            'criterion.store.employer.BenefitPlans',
            'criterion.view.employee.benefit.PersonsList',
            'criterion.store.employee.benefit.Options',
            'criterion.store.employee.benefit.Dependents',
            'criterion.store.employee.benefit.Beneficiaries',
            'criterion.view.employee.benefit.BeneficiariesList',
            'criterion.store.person.Contacts',
            'criterion.ux.form.CurrencyField',
            'criterion.view.CustomFieldsContainer',
            'criterion.view.common.EmployeeBenefitDocuments',
            'criterion.ux.form.FillableWebForm'
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : false
            }
        ],

        viewModel : {
            data : {
                readOnly : false,

                /**
                 * @type criterion.model.employee.Benefit
                 */
                record : null,
                /**
                 * @type criterion.model.employer.BenefitPlan
                 */
                planRecord : null,
                allowDependents : false,
                allowBeneficiaries : false,
                hasContingents : false,
                selectedPersonContactsIds : null,
                beneficiariesTotal : null,

                hideEmployeeCost : false,
                hideEmployerCost : false,

                hideManualOverride : false,
                hideCustomFields : false,
                isOptionsReadOnly : false
            },
            formulas : {
                isPhantom : {
                    bind : {
                        bindTo : '{record}',
                        deep : true
                    },
                    get : record => record ? record.phantom : true
                },

                calcButtonText : data => !data('isPhantom') ? i18n.gettext('Recalc') : i18n.gettext('Calc'),
                canChangePlan : data => data('isPhantom') && !data('readOnly'),

                isParamsReadOnly : data => !data('record.isManualOverride'),
                showQualifyingEvent : data => data('record.deduction.expirationDate') && data('record.isManualOverride'),

                showContingents : data => {
                    let beneficiariesTotal = data('beneficiariesTotal'),
                        personContacts = data('personContacts'),
                        selectedPersonContactsIds = data('selectedPersonContactsIds');

                    if (selectedPersonContactsIds && selectedPersonContactsIds.length === personContacts.getCount()) {
                        return false;
                    }

                    return beneficiariesTotal === 100 && personContacts.getCount() > 1;
                },

                amountIsPercentEnabled : data => {
                    let deductionCalcMethodCode = data('record.deduction.deductionCalcMethodCode');

                    return deductionCalcMethodCode && Ext.Array.contains([
                        DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS,
                        DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS_MATCH,
                        DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_PERCENT
                    ], deductionCalcMethodCode);
                }
            },

            stores : {
                benefitPlans : {
                    type : 'employer_benefit_plans'
                },
                employeeBenefitOptions : {
                    type : 'criterion_employee_benefit_options'
                },
                personContacts : {
                    type : 'criterion_person_contacts'
                },
                personContactsContingent : {
                    type : 'criterion_person_contacts',
                    proxy : 'memory'
                }
            }
        },

        controller : {
            type : 'criterion_employee_benefit_benefit_form'
        },

        disableAutoSetLoadingState : true,

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        noButtons : true,

        buttons : [
            {
                xtype : 'button',
                reference : 'delete',
                text : i18n.gettext('Delete'),
                cls : 'criterion-btn-remove',
                listeners : {
                    click : 'handleDeleteClick'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getComplexSecurityFormula({
                        append : 'isPhantom ||',
                        rules : [
                            {
                                key : criterion.SecurityManager.HR_KEYS.EMPLOYEE_BENEFIT_PLANS,
                                actName : criterion.SecurityManager.DELETE,
                                reverse : true
                            }
                        ]
                    })
                }
            },
            '->',
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                scale : 'small',
                text : i18n.gettext('Cancel'),
                handler : 'handleCancelClick'
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                handler : 'handleRecalc',
                scale : 'small',
                disabled : true,
                hidden : true,
                bind : {
                    text : '{calcButtonText}',
                    disabled : '{record.isManualOverride}',
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_BENEFIT_PLANS, criterion.SecurityManager.UPDATE, true)
                }
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                scale : 'small',
                text : i18n.gettext('Save'),
                handler : 'handleSaveAll',
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_BENEFIT_PLANS, criterion.SecurityManager.UPDATE, true)
                }
            }
        ],

        getRecord : function() {
            let vm = this.getViewModel();

            return vm ? vm.get('record') : null;
        },

        items : [
            {
                plugins : [
                    'criterion_responsive_column'
                ],

                xtype : 'container',
                layout : 'hbox',
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                items : [
                    {
                        xtype : 'container',
                        layout : 'hbox',
                        items : [
                            {
                                xtype : 'combobox',
                                reference : 'benefitPlanCombo',
                                width : '100%',
                                fieldLabel : i18n.gettext('Plan'),
                                allowBlank : false,
                                name : 'benefitPlanId',
                                editable : false,
                                valueField : 'id',
                                displayField : 'name',
                                queryMode : 'local',
                                bind : {
                                    readOnly : '{!canChangePlan}',
                                    value : '{record.benefitPlanId}',
                                    store : '{benefitPlans}'
                                },
                                listeners : {
                                    change : 'handleBenefitPlanChange'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        items : [
                            {}
                        ]
                    }
                ]
            },
            {
                xtype : 'container',
                layout : 'hbox',
                reference : 'optionsContainer',
                plugins : [
                    'criterion_responsive_column'
                ],
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                items : [
                    {
                        xtype : 'container',
                        items : []
                    },
                    {
                        xtype : 'container',
                        items : []
                    }
                ]
            },
            {
                xtype : 'component',
                autoEl : 'hr',
                cls : 'criterion-horizontal-ruler'
            },
            // params
            {
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                xtype : 'container',
                layout : 'hbox',

                plugins : [
                    'criterion_responsive_column'
                ],

                items : [
                    {
                        xtype : 'container',

                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Manual Override'),
                                name : 'isManualOverride',
                                hidden : true,
                                bind : {
                                    value : '{record.isManualOverride}',
                                    readOnly : '{readOnly}',
                                    hidden : '{hideManualOverride}'
                                }
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                name : 'employeeCoverage',
                                bind : {
                                    value : '{record.employeeCoverage}',
                                    readOnly : '{isParamsReadOnly}'
                                },
                                fieldLabel : i18n.gettext('Employee Coverage')
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                name : 'dependentCoverage',
                                bind : {
                                    value : '{record.dependentCoverage}',
                                    readOnly : '{isParamsReadOnly}'
                                },
                                fieldLabel : i18n.gettext('Dependent Coverage')
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Frequency'),
                                disabled : true,
                                bind : {
                                    value : '{benefitPlanCombo.selection.rateUnitDesc}'
                                    // see CRITERION-7686
                                }
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                name : 'premium',
                                hidden : true,
                                bind : {
                                    value : '{record.premium}',
                                    readOnly : '{isParamsReadOnly || amountIsPercentEnabled}',
                                    fieldLabel : i18n.gettext('Premium'),
                                    hidden : '{hideEmployerCost || amountIsPercentEnabled}'
                                },
                                fieldLabel : i18n.gettext('Premium')
                            }
                        ]
                    },
                    {
                        xtype : 'container',

                        items : [
                            {
                                xtype : 'criterion_placeholder_field'
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Effective Date'),
                                bind : {
                                    value : '{record.deduction.effectiveDate}',
                                    readOnly : '{isParamsReadOnly}',
                                    disabled : '{!record.isManualOverride}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Expiration Date'),
                                reference : 'dateExpired',
                                bind : {
                                    value : '{record.deduction.expirationDate}',
                                    readOnly : '{isParamsReadOnly}',
                                    disabled : '{!record.isManualOverride}'
                                }
                            },

                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Qualifying Event'),
                                name : 'stateCd',
                                hidden : true,
                                codeDataId : criterion.consts.Dict.QUALIFYING_EVENT,
                                bind : {
                                    value : '{record.deduction.qualifyingEventCd}',
                                    readOnly : '{isParamsReadOnly}',
                                    disabled : '{!record.isManualOverride}',
                                    hidden : '{!showQualifyingEvent}'
                                }
                            },

                            {
                                xtype : 'criterion_currencyfield',
                                name : 'employeeContribution',
                                hidden : true,
                                bind : {
                                    value : '{record.employeeContribution}',
                                    readOnly : '{isParamsReadOnly}',
                                    hidden : '{hideEmployeeCost || amountIsPercentEnabled}',
                                    disabled : '{amountIsPercentEnabled}'
                                },
                                fieldLabel : i18n.gettext('Employee Contribution')
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                name : 'employerContribution',
                                disabled : true,
                                hidden : true,
                                bind : {
                                    value : '{record.employerContribution}',
                                    readOnly : '{isParamsReadOnly}',
                                    hidden : '{hideEmployerCost || amountIsPercentEnabled}',
                                    disabled : '{amountIsPercentEnabled}'
                                },
                                fieldLabel : i18n.gettext('Employer Contribution')
                            },

                            {
                                xtype : 'criterion_percentagefield',
                                name : 'employeeContribution',
                                hidden : true,
                                bind : {
                                    value : '{record.employeeContribution}',
                                    readOnly : '{isParamsReadOnly}',
                                    hidden : '{hideEmployeeCost || !amountIsPercentEnabled}',
                                    disabled : '{!amountIsPercentEnabled}'
                                },
                                fieldLabel : i18n.gettext('Employee Contribution')
                            },
                            {
                                xtype : 'criterion_percentagefield',
                                name : 'employerContribution',
                                disabled : true,
                                hidden : true,
                                bind : {
                                    value : '{record.employerContribution}',
                                    readOnly : '{isParamsReadOnly}',
                                    hidden : '{hideEmployerCost || !amountIsPercentEnabled}',
                                    disabled : '{!amountIsPercentEnabled}'
                                },
                                fieldLabel : i18n.gettext('Employer Contribution')
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
            // dependents & beneficiaries
            {
                xtype : 'container',
                layout : 'hbox',
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                margin : '20 0 0 0',
                items : [
                    {
                        xtype : 'container',
                        bind : {
                            hidden : '{!allowDependents}'
                        },
                        items : [
                            {
                                xtype : 'component',
                                html : i18n.gettext('Dependents'),
                                margin : '0 0 10 0'
                            },
                            {
                                xtype : 'criterion_employee_benefit_persons_list',
                                reference : 'dependentsList',
                                bind : {
                                    readOnly : '{readOnly || isOptionsReadOnly}',
                                    store : '{personContacts}'
                                }
                            }
                        ]
                    },
                    // ===
                    {
                        xtype : 'container',
                        bind : {
                            hidden : '{!allowBeneficiaries}'
                        },
                        items : [
                            {
                                xtype : 'component',
                                html : i18n.gettext('Beneficiaries'),
                                margin : '0 0 10 0'
                            },
                            {
                                xtype : 'criterion_employee_benefit_beneficiaries_list',
                                reference : 'beneficiariesList',
                                nameField : 'beneficiaries',
                                bind : {
                                    readOnly : '{readOnly || isOptionsReadOnly}',
                                    store : '{personContacts}'
                                },
                                listeners : {
                                    changeTotal : 'handleChangeBeneficiariesTotal',
                                    changeSelectedPersons : 'handleChangeSelectedPersons'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Choose Contingents'),
                                reference : 'hasContingentField',
                                hidden : true,
                                bind : {
                                    readOnly : '{readOnly || isOptionsReadOnly}',
                                    value : '{hasContingents}',
                                    hidden : '{!showContingents}'
                                }
                            },
                            {
                                xtype : 'criterion_employee_benefit_beneficiaries_list',
                                reference : 'contingentBeneficiariesList',
                                nameField : 'contingentBeneficiaries',
                                hidden : true,
                                bind : {
                                    readOnly : '{readOnly || isOptionsReadOnly}',
                                    hidden : '{!hasContingents || !showContingents}',
                                    store : '{personContactsContingent}'
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
                hidden : true,
                bind : {
                    hidden : '{!record.benefitPlanId || isPhantom || (!allowDependents && !allowBeneficiaries)}'
                }
            },
            {
                xtype : 'criterion_common_employee_benefit_documents',
                reference : 'benefitDocuments',
                hidden : true,
                header : {
                    title : i18n.gettext('Documents'),
                    padding : '10 0 10 15',
                    margin : 0,
                    items : [
                        {
                            xtype : 'tbfill'
                        },
                        {
                            xtype : 'button',
                            text : i18n.gettext('Add'),
                            handler : 'handleAddDocument',
                            bind : {
                                hidden : '{readOnlyMode}' // without default set in current class!
                            }
                        }
                    ]
                },
                bind : {
                    hidden : '{!record.benefitPlanId}',
                    readOnlyMode : '{readOnlyMode}'
                }
            },
            {
                xtype : 'criterion_fillable_webform',
                header : {
                    title : i18n.gettext('Form'),
                    padding : '10 0 10 15',
                    margin : 0,
                    items : [
                        {
                            xtype : 'tbfill'
                        },
                        {
                            xtype : 'button',
                            text : i18n._('Save and Download'),
                            disabled : true,
                            bind : {
                                disabled : '{isPhantom}'
                            },
                            listeners : {
                                click : 'handleDownloadFormClick'
                            }
                        }
                    ]
                },
                margin : '20 0 20 0',
                border : 1,
                style : {
                    borderColor : '#EEE',
                    borderStyle : 'solid',
                    borderWidth : 0
                },
                correctHeightValue : 45,
                reference : 'webform',
                scrollable : true,
                editable : true,
                mainUrl : criterion.consts.Api.API.EMPLOYEE_BENEFIT_WEBFORM_FIELDS,
                allowBlanksIfAdmin : true,
                hidden : true,
                bind : {
                    hidden : '{!record.benefitPlanId || !webformId}'
                }
            },
            {
                xtype : 'criterion_customfields_container',
                reference : 'customfieldsEmployeeBenefit',
                entityType : criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_EMPLOYEE_BENEFIT,
                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH,
                bind : {
                    hidden : '{hideCustomFields}'
                }
            }
        ]
    };
});

