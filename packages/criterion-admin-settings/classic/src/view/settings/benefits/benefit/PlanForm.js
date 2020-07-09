Ext.define('criterion.view.settings.benefits.benefit.PlanForm', function() {

    var DICT = criterion.consts.Dict,
        TEXT_AREA_HEIGHT = 70;

    return {
        alias : 'widget.criterion_settings_benefit_plan_form',

        extend : 'criterion.ux.BreadcrumbPanel',

        requires : [
            'criterion.ux.BreadcrumbPanel',
            'criterion.controller.settings.benefits.benefit.PlanForm',
            'criterion.view.settings.benefits.benefit.OptionsGrid',
            'criterion.view.settings.benefits.benefit.RatesGrid',
            'criterion.store.employer.benefit.Types',
            'criterion.model.employer.BenefitPlan',
            'criterion.model.employer.benefit.Rate',
            'criterion.store.employer.Deductions',
            'criterion.store.employer.Carriers',
            'criterion.store.employer.benefit.Options',
            'criterion.view.settings.benefits.benefit.OptionGroup',
            'criterion.view.CustomFieldsContainer'
        ],

        allowDelete : true,
        modelValidation : true,

        cls : 'criterion-form',

        bodyPadding : 0,

        disableAutoSetLoadingState : true,

        viewModel : {
            data : {
                /**
                 * @link criterion.model.employer.BenefitPlan
                 */
                plan : null,
                isPhantom : true,
                submitBtnText : i18n.gettext('Save'),
                cancelBtnText : i18n.gettext('Cancel'),
                prevBtnText : i18n.gettext('Previous'),
                nextBtnText : i18n.gettext('Next')
            },
            stores : {
                employerDeductions : {
                    type : 'employer_deductions',
                    filters : [
                        {
                            property : 'isUsedInPlans',
                            value : false,
                            disabled : '{!isPhantom}'
                        }
                    ]
                },
                employerCarriers : {
                    type : 'criterion_employer_carriers'
                }
            },
            formulas : {
                optionGroup1Hidden : function(get) {
                    var plan = get('plan');
                    return plan && plan.isModel && !(!plan.get('optionGroup1IsManual') && plan.get('optionGroup1'));
                },
                optionGroup2Hidden : function(get) {
                    var plan = get('plan');
                    return plan && plan.isModel && !(!plan.get('optionGroup2IsManual') && plan.get('optionGroup2'));
                },
                optionGroup3Hidden : function(get) {
                    var plan = get('plan');
                    return plan && plan.isModel && !(!plan.get('optionGroup3IsManual') && plan.get('optionGroup3'));
                },
                optionGroup4Hidden : function(get) {
                    var plan = get('plan');
                    return plan && plan.isModel && !(!plan.get('optionGroup4IsManual') && plan.get('optionGroup4'));
                },
                isFirstCard : function(get) {
                    return get('activeViewIndex') === 0;
                },
                extraInfo : function (get) {
                    return get('plan.name');
                }
            }
        },

        controller : {
            type : 'criterion_settings_benefit_plan_form'
        },

        header : {
            title : i18n.gettext('Benefit Plan'),

            defaults : {
                margin : '0 10 0 0'
            },

            items : [
                {
                    xtype : 'button',
                    cls : 'criterion-btn-primary',
                    text : i18n.gettext('Clone'),
                    handler : 'handleClone',
                    hidden : true,
                    bind : {
                        disabled : '{disableSave}',
                        hidden : '{isPhantom}'
                    }
                }
            ]
        },

        initComponent : function() {
            criterion.detectDirtyForms && Ext.GlobalEvents.on('beforeHideForm', this.onBeforeHideForm, this);

            this.callParent(arguments);
            this.setKeyNavigation();
        },

        destroy() {
            Ext.destroy(this.keyNav);
            this.callParent();
        },

        setKeyNavigation() {
            let controller = this.getController();

            this.keyNav = new Ext.util.KeyMap({
                target : window,
                binding : [
                    {
                        key : Ext.event.Event.ESC,
                        handler : controller.navCancelHandler,
                        scope : controller
                    },
                    {
                        key : Ext.event.Event.DELETE,
                        handler : controller.navDeleteHandler,
                        scope : controller
                    }
                ]
            });
        },

        loadRecord : Ext.emptyFn,

        onBeforeHideForm : function() {
            this.getController().handleCancelClick();

            return false;
        },

        getRecord : function() {
            return this.getViewModel().get('plan');
        },

        getDeleteConfirmMessage : function(record) {
            return Ext.util.Format.format(i18n.gettext('Do you want to delete the record?'));
        },

        dockedItems : [
            {
                dock : 'bottom',
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                items : [
                    {
                        xtype : 'container',
                        cls : 'buttons-container',
                        layout : {
                            type : 'hbox',
                            align : 'stretch'
                        },
                        flex : 1,
                        padding : '5 10',
                        items : [
                            {
                                xtype : 'button',
                                reference : 'delete',
                                text : i18n.gettext('Delete'),
                                cls : 'criterion-btn-remove',
                                listeners : {
                                    click : 'handleDeleteClick'
                                },
                                minWidth : 100,
                                bind : {
                                    disabled : '{blockedState}'
                                }
                            },
                            {
                                flex : 1
                            },
                            {
                                xtype : 'button',
                                reference : 'previous',
                                cls : 'criterion-btn-primary',
                                minWidth : 100,
                                listeners : {
                                    click : 'handlePrevClick'
                                },
                                margin : '0 0 0 10',
                                bind : {
                                    hidden : '{isFirstCard}',
                                    text : '{prevBtnText}'
                                }
                            },
                            {
                                xtype : 'button',
                                reference : 'cancel',
                                cls : 'criterion-btn-light',
                                minWidth : 100,
                                listeners : {
                                    click : 'handleCancelClick'
                                },
                                margin : '0 0 0 10',
                                bind : {
                                    text : '{cancelBtnText}',
                                    disabled : '{blockedState}',
                                    hidden : '{hideCancel}'
                                }
                            },
                            {
                                xtype : 'button',
                                reference : 'next',
                                cls : 'criterion-btn-primary',
                                minWidth : 100,
                                listeners : {
                                    click : 'handleNextClick'
                                },
                                margin : '0 0 0 10',
                                bind : {
                                    text : '{nextBtnText}',
                                    hidden : '{isLastCard}'
                                }
                            },
                            {
                                xtype : 'button',
                                reference : 'submit',
                                cls : 'criterion-btn-primary',
                                minWidth : 100,
                                listeners : {
                                    click : 'handleRecordUpdate'
                                },
                                margin : '0 0 0 10',
                                bind : {
                                    disabled : '{blockedState}',
                                    text : '{submitBtnText}',
                                    hidden : '{!isLastCard || hideDelete}'
                                }
                            }
                        ]
                    }
                ]
            }
        ],

        items : [
            {
                xtype : 'criterion_form',
                itemId : 'planDefinition',
                title : i18n.gettext('Plan'),

                defaults : {
                    defaults : {
                        defaults : {
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
                        }
                    }
                },

                items : [
                    {
                        xtype : 'container',
                        layout : 'hbox',
                        padding : '10 25 0',
                        items : [
                            {
                                xtype : 'button',
                                text : i18n.gettext('Enroll'),
                                width : 100,
                                cls : 'criterion-btn-feature',
                                listeners : {
                                    click : 'handleEnroll'
                                },
                                bind : {
                                    disabled: '{isPhantom}'
                                },
                                margin : '0 20 0 0'
                            },
                            {
                                xtype : 'button',
                                text : i18n.gettext('Recalc'),
                                width : 100,
                                cls : 'criterion-btn-feature',
                                listeners : {
                                    click : 'handleUpdatePremiums'
                                },
                                bind : {
                                    disabled: '{isPhantom}'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'panel',
                        bodyPadding : 10,
                        layout : 'hbox',
                        defaultType : 'container',
                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                        cls : 'panel-transparent-tbar',

                        items : [
                            {
                                items : [
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Plan Code'),
                                        bind : '{plan.code}',
                                        name : 'code'
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Plan Name'),
                                        bind : '{plan.name}',
                                        name : 'name',
                                        listeners : {
                                            change : 'handlePlanTitleChange'
                                        }
                                    },
                                    {
                                        xtype : 'combo',
                                        fieldLabel : i18n.gettext('Carrier Name'),
                                        valueField : 'id',
                                        displayField : 'name',
                                        bind : {
                                            store : '{employerCarriers}',
                                            value : '{plan.carrierId}'
                                        },
                                        queryMode : 'local',
                                        editable : false,
                                        name : 'carrierId'
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Carrier Account No'),
                                        bind : '{plan.carrierAccountNumber}',
                                        name : 'carrierAccountNumber'
                                    },
                                    {
                                        xtype : 'criterion_code_detail_field',
                                        fieldLabel : i18n.gettext('Benefit Type'),
                                        bind : '{plan.benefitTypeCd}',
                                        codeDataId : DICT.BENEFIT_TYPE,
                                        reference : 'benefitTypeCombo',
                                        name : 'benefitTypeCd'
                                    },
                                    {
                                        xtype : 'datefield',
                                        fieldLabel : i18n.gettext('Year End'),
                                        bind : '{plan.yearEnd}',
                                        name : 'yearEnd'
                                    },
                                    {
                                        xtype : 'criterion_code_detail_field',
                                        fieldLabel : i18n.gettext('Rate'),
                                        bind : '{plan.rateUnitCd}',
                                        codeDataId : DICT.RATE_UNIT,
                                        name : 'rateUnitCd'
                                    },
                                    {
                                        xtype : 'combo',
                                        fieldLabel : i18n.gettext('Deduction'),
                                        valueField : 'id',
                                        displayField : 'code',
                                        bind : {
                                            store : '{employerDeductions}',
                                            value : '{plan.deductionId}',
                                            readOnly : '{!isPhantom}'
                                        },
                                        editable : false,
                                        queryMode : 'local',
                                        name : 'deductionId'
                                    },
                                    {
                                        xtype : 'combobox',
                                        fieldLabel : i18n.gettext('Form'),
                                        allowBlank : true,
                                        editable : true,
                                        forceSelection : true,
                                        autoSelect : true,
                                        valueField : 'formId',
                                        displayField : 'name',
                                        queryMode : 'local',
                                        bind : {
                                            store : '{webForms}',
                                            value : '{plan.webformId}'
                                        }
                                    }
                                ]
                            },
                            {
                                items : [
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Active'),
                                        bind : '{plan.isActive}',
                                        name : 'isActive'
                                    },
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('COBRA'),
                                        bind : '{plan.isCobra}',
                                        name : 'isCobra'
                                    },
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Elective'),
                                        bind : '{plan.isElective}',
                                        name : 'isElective'
                                    },
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Self Insured'),
                                        bind : '{plan.isSelfInsured}',
                                        name : 'isSelfInsured'
                                    },
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('ACA'),
                                        bind : '{plan.isAca}',
                                        name : 'isAca'
                                    },
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Cafe'),
                                        bind : '{plan.isCafe}',
                                        name : 'isCafe'
                                    },
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Allow Changes in ESS'),
                                        bind : '{plan.isAllowChangeEss}',
                                        name : 'isAllowChangeEss'
                                    },
                                    {
                                        xtype : 'filefield',
                                        fieldLabel : i18n.gettext('Document'),
                                        name : 'document',
                                        reference : 'document',
                                        buttonText : i18n.gettext('Browse'),
                                        buttonMargin : 6,
                                        buttonOnly : false,
                                        allowBlank : true,
                                        listeners : {
                                            change : function(fld, value) {
                                                var newValue = value.replace(/C:\\fakepath\\/g, '');
                                                fld.setRawValue(newValue);
                                            },
                                            afterrender : function(cmp) {
                                                var me = cmp;
                                                cmp.fileInputEl.on('change', function(event) {
                                                    me.fireEvent('onselectfile', event);
                                                });
                                            },
                                            onselectfile : 'handleSelectFile'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype : 'panel',
                        title : i18n.gettext('Description'),

                        bodyPadding : 10,
                        layout : 'hbox',
                        defaultType : 'container',
                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                        items : [
                            {
                                xtype : 'criterion_htmleditor',
                                hideLabel : true,
                                allowBlank : false,
                                width: '100%',
                                bind : {
                                    value : '{plan.description}'
                                },
                                name : 'description'
                            }
                        ]
                    },
                    {
                        xtype : 'panel',
                        title : i18n.gettext('Contact Info'),

                        bodyPadding : 10,
                        layout : 'hbox',
                        defaultType : 'container',
                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                        items : [
                            {
                                items : [
                                    {
                                        xtype : 'textfield',
                                        bind : '{plan.contactName}',
                                        fieldLabel : i18n.gettext('Name'),
                                        name : 'contactName'
                                    },
                                    {
                                        xtype : 'textfield',
                                        bind : '{plan.contactTitle}',
                                        fieldLabel : i18n.gettext('Title'),
                                        name : 'contactTitle'
                                    }
                                ]
                            },
                            {
                                items : [
                                    {
                                        xtype : 'criterion_person_phone_number',
                                        fieldLabel : i18n.gettext('Phone'),
                                        bind : {
                                            rawNumber : '{plan.contactPhone}',
                                            displayNumber : '{plan.contactPhoneInternational}'
                                        }
                                    },
                                    {
                                        xtype : 'textfield',
                                        bind : '{plan.contactAddress}',
                                        fieldLabel : i18n.gettext('Address'),
                                        name : 'contactAddress'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype : 'criterion_customfields_container',
                        reference : 'customfieldsBenefitPlan',
                        entityType : criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_BENEFIT_PLAN,
                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
                    }
                ]
            },
            {
                xtype : 'criterion_form',
                title : i18n.gettext('Formulas'),
                itemId : 'formulas',

                items : [
                    {
                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                        layout : 'hbox',
                        bodyPadding : 10,

                        items : [
                            {
                                items : [
                                    {
                                        xtype : 'textarea',
                                        reference : 'expCalcEmployeeCoverage',
                                        bind : '{plan.expCalcEmployeeCoverage}',
                                        fieldLabel : i18n.gettext('Employee Coverage'),
                                        height : TEXT_AREA_HEIGHT
                                    },
                                    {
                                        xtype : 'textarea',
                                        reference : 'expCalcDependentCoverage',
                                        bind : '{plan.expCalcDependentCoverage}',
                                        fieldLabel : i18n.gettext('Dependent Coverage'),
                                        height : TEXT_AREA_HEIGHT
                                    },
                                    {
                                        xtype : 'textarea',
                                        reference : 'expCalcPlanPremium',
                                        bind : '{plan.expCalcPlanPremium}',
                                        fieldLabel : i18n.gettext('Plan Premium'),
                                        height : TEXT_AREA_HEIGHT
                                    },
                                    {
                                        xtype : 'textarea',
                                        reference : 'expCalcEmployeeContribution',
                                        bind : '{plan.expCalcEmployeeContribution}',
                                        fieldLabel : i18n.gettext('Employee Contribution'),
                                        height : TEXT_AREA_HEIGHT
                                    }
                                ]
                            },
                            {
                                items : [
                                    {
                                        xtype : 'textarea',
                                        reference : 'expCalcEligibility',
                                        bind : '{plan.expCalcEligibility}',
                                        fieldLabel : i18n.gettext('Eligibility'),
                                        height : TEXT_AREA_HEIGHT
                                    },
                                    {
                                        xtype : 'textarea',
                                        reference : 'expCalcEffectiveDate',
                                        bind : '{plan.expCalcEffectiveDate}',
                                        fieldLabel : i18n.gettext('Effective Date'),
                                        height : TEXT_AREA_HEIGHT
                                    },
                                    {
                                        xtype : 'textarea',
                                        reference : 'expCalcExpirationDate',
                                        bind : '{plan.expCalcExpirationDate}',
                                        fieldLabel : i18n.gettext('Expire Date'),
                                        height : TEXT_AREA_HEIGHT
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_form',
                title : i18n.gettext('Options'),
                itemId : 'options',

                items : [
                    {
                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },

                        reference : 'options',

                        items : [
                            {
                                xtype : 'criterion_settings_benefits_benefit_optiongroup',
                                reference : 'optionGroup1',
                                optionGroupId : 1
                            },
                            {
                                xtype : 'criterion_settings_benefits_benefit_optiongroup',
                                reference : 'optionGroup2',
                                optionGroupId : 2
                            },
                            {
                                xtype : 'criterion_settings_benefits_benefit_optiongroup',
                                reference : 'optionGroup3',
                                optionGroupId : 3
                            },
                            {
                                xtype : 'criterion_settings_benefits_benefit_optiongroup',
                                reference : 'optionGroup4',
                                optionGroupId : 4
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_form',
                title : i18n.gettext('Rates'),
                itemId : 'rates',
                layout : 'fit',

                items : [
                    {
                        xtype : 'criterion_settings_benefit_rates_grid',
                        reference : 'ratesGrid'
                    }
                ]
            }
        ]

    };

});
