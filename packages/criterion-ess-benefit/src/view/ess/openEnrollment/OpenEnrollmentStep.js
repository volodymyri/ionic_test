Ext.define('criterion.view.ess.openEnrollment.OpenEnrollmentStep', function() {

    const UI_DEFAULTS = criterion.Consts.UI_DEFAULTS,
          API = criterion.consts.Api.API,
          DEDUCTION_CALC_METHOD_CODES = criterion.Consts.DEDUCTION_CALC_METHOD_CODES;

    return {
        alias : 'widget.criterion_selfservice_open_enrollment_step',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.ess.openEnrollment.OpenEnrollmentStep',
            'criterion.view.ess.openEnrollment.BenefitForm',
            'criterion.store.person.Contacts',
            'criterion.model.employee.benefit.Beneficiary',
            'criterion.model.employee.benefit.Dependent',
            'criterion.view.common.EmployeeBenefitDocuments',
            'Ext.grid.plugin.CellEditing',
            'criterion.store.employee.openEnrollment.Documents'
        ],

        controller : {
            type : 'criterion_selfservice_open_enrollment_step'
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        viewModel : {
            data : {
                employerStep : null,
                employeeStep : null,
                currentPlan : null,
                allowDependent : null,
                allowBeneficiary : null,
                hasContacts : false,
                beneficiaryPercent : null,
                selectedBeneficiariesCount : null
            },
            stores : {
                contacts : {
                    type : 'criterion_person_contacts'
                },
                dependents : {
                    model : 'criterion.model.employee.benefit.Dependent'
                },
                beneficiaries : {
                    model : 'criterion.model.employee.benefit.Beneficiary',
                    listeners : {
                        update : 'onBeneficiaryChanges',
                        datachanged : 'onBeneficiaryChanges'
                    }
                },
                contingentBeneficiaries : {
                    model : 'criterion.model.employee.benefit.Beneficiary'
                }
            },
            formulas : {
                hideDependents : function(get) {
                    return !get('hasContacts') || (!get('employeeStep.isEnroll') || !get('allowDependent') && !get('allowBeneficiary'))
                },
                showContingents : function(data) {
                    var beneficiariesTotal = data('beneficiariesTotal'),
                        contacts = data('contacts'),
                        selectedBeneficiariesCount = data('selectedBeneficiariesCount');

                    if (selectedBeneficiariesCount === contacts.getCount()) {
                        return false;
                    }

                    return beneficiariesTotal === 100 && contacts.getTotalCount() > 1 ;
                },
                amountIsPercentEnabled : function(get) {
                    let deductionCalcMethodCode = get('currentPlan.deductionCalcMethodCode');

                    return deductionCalcMethodCode && Ext.Array.contains([
                        DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS,
                        DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS_MATCH,
                        DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_PERCENT
                    ], deductionCalcMethodCode);
                }
            }
        },

        isEnrollmentStep : true,

        ui : 'clean',

        bodyPadding : 25,

        defaults : {
            margin : 10
        },

        initComponent : function() {
            var me = this;

            me.items = [
                {
                    xtype : 'container',
                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },

                    items : [
                        {
                            xtype : 'container',
                            layout : 'hbox',

                            items : [
                                {
                                    xtype : 'component',

                                    html : i18n.gettext('Benefit Type'),
                                    cls : 'strong',
                                    width : UI_DEFAULTS.LABEL_WIDER_ESS_WIDTH
                                },
                                {
                                    xtype : 'component',

                                    bind : {
                                        html : '{employerStep.benefitName}'
                                    }
                                }
                            ]
                        },
                        {
                            xtype : 'component',

                            padding : '20 0',
                            cls : 'step-description',
                            bind : {
                                html : '{employerStep.description}',
                                hidden : '{!employerStep.description}'
                            }
                        }
                    ]
                },
                {
                    layout : {
                        type : 'hbox',
                        align : 'stretch'
                    },

                    ui : 'clean',

                    defaults : {
                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },

                        flex : 1,
                        maxWidth : 400,
                        minHeight : 400,
                        margin : '0 20 0 0',

                        border : true,
                        cls : 'plan-panel',

                        defaults : {
                            margin : '5 20',
                            labelWidth : UI_DEFAULTS.LABEL_WIDTH
                        }
                    },

                    items : [
                        // Current
                        {
                            xtype : 'criterion_panel',

                            ui : 'clean',

                            items : [

                                {
                                    xtype : 'label',
                                    text : i18n.gettext('Current'),
                                    margin : '15 20',
                                    cls : 'panel-title'
                                },
                                {
                                    xtype : 'container',
                                    flex : 1,
                                    layout : {
                                        type : 'vbox',
                                        align : 'center',
                                        pack : 'center'
                                    },
                                    items : {
                                        html : i18n.gettext('No Current Plan')
                                    },
                                    bind : {
                                        hidden : '{currentPlan}'
                                    }
                                },
                                {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Plan'),

                                    bind : {
                                        value : '{currentPlan.benefitPlan.name}',
                                        hidden : '{!currentPlan}'
                                    },
                                    readOnly : true
                                },
                                {
                                    xtype : 'container',
                                    reference : 'currentOptions',

                                    layout : {
                                        type : 'vbox',
                                        align : 'stretch'
                                    },

                                    bind : {
                                        hidden : '{!currentPlan}'
                                    },

                                    margin : 0,

                                    defaults : {
                                        margin : '5 20',
                                        padding : 0,
                                        labelWidth : UI_DEFAULTS.LABEL_WIDTH
                                    }
                                },
                                {
                                    xtype : 'component',
                                    flex : 1
                                },
                                {
                                    xtype : 'container',

                                    layout : {
                                        type : 'vbox',
                                        align : 'stretch'
                                    },
                                    cls : 'bottom-container',

                                    margin : '10 0',
                                    padding : '10 0 0',

                                    defaults : {
                                        margin : '10 20',
                                        labelWidth : UI_DEFAULTS.LABEL_WIDTH * 2
                                    },

                                    items : [
                                        {
                                            xtype : 'container',

                                            layout : 'hbox',

                                            hidden : true,

                                            bind : {
                                                hidden : '{!currentPlan.showEmployeeCost}'
                                            },

                                            items : [
                                                {
                                                    xtype : 'label',
                                                    margin : '5 0 0 0',
                                                    flex : 1,
                                                    text : i18n.gettext('Employee Contribution')
                                                },
                                                {
                                                    xtype : 'criterion_currencyfield',
                                                    width : 100,
                                                    readOnly : true,
                                                    hidden : true,
                                                    bind : {
                                                        value : '{currentPlan.employeeContribution}',
                                                        hidden : '{amountIsPercentEnabled}',
                                                        disabled : '{amountIsPercentEnabled}'
                                                    }
                                                },
                                                {
                                                    xtype : 'criterion_percentagefield',
                                                    width : 100,
                                                    readOnly : true,
                                                    hidden : true,
                                                    bind : {
                                                        value : '{currentPlan.employeeContribution}',
                                                        hidden : '{!amountIsPercentEnabled}',
                                                        disabled : '{!amountIsPercentEnabled}'
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype : 'container',

                                            layout : 'hbox',

                                            hidden : true,

                                            bind : {
                                                hidden : '{!currentPlan.showEmployerCost}'
                                            },

                                            items : [
                                                {
                                                    xtype : 'label',
                                                    margin : '5 0 0 0',
                                                    flex : 1,
                                                    text : i18n.gettext('Employer Contribution')
                                                },
                                                {
                                                    xtype : 'criterion_currencyfield',
                                                    width : 100,
                                                    readOnly : true,
                                                    hidden : true,
                                                    bind : {
                                                        value : '{currentPlan.employerContribution}',
                                                        hidden : '{amountIsPercentEnabled}',
                                                        disabled : '{amountIsPercentEnabled}'
                                                    }
                                                },
                                                {
                                                    xtype : 'criterion_percentagefield',
                                                    width : 100,
                                                    readOnly : true,
                                                    hidden : true,
                                                    bind : {
                                                        value : '{currentPlan.employerContribution}',
                                                        hidden : '{!amountIsPercentEnabled}',
                                                        disabled : '{!amountIsPercentEnabled}'
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype : 'container',
                                            layout : 'hbox',
                                            items : [
                                                {
                                                    xtype : 'label',
                                                    margin : '5 0 0 0',
                                                    flex : 1,
                                                    text : i18n.gettext('Period')
                                                },
                                                {
                                                    xtype : 'textfield',
                                                    width : 100,
                                                    readOnly : true,
                                                    bind : '{currentPlan.planRateDescription}'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        // Next Year
                        {
                            xtype : 'criterion_selfservice_open_enrollment_benefit_form',
                            reference : 'planForm',

                            ui : 'clean',

                            viewModel : {
                                data : {
                                    benefitTitle : i18n.gettext('Next Year')
                                }
                            },

                            listeners : {
                                afterOptionChange : 'onAfterOptionChange',
                                planChange : 'onNextYearPlanChange'
                            }
                        },

                        {
                            xtype : 'criterion_panel',

                            ui : 'clean',

                            bodyPadding : '0 10 0 0',

                            items : [
                                // Dependents
                                {
                                    xtype : 'container',

                                    bind : {
                                        hidden : '{hideDependents}'
                                    },

                                    items : [
                                        {
                                            xtype : 'criterion_gridpanel',
                                            margin : 0,
                                            bind : {
                                                hidden : '{!allowDependent}',
                                                store : '{dependents}'
                                            },
                                            hideHeaders : true,
                                            tbar : [
                                                {
                                                    xtype : 'tbtext',
                                                    text : i18n.gettext('Dependents'),
                                                    margin : '0 10'
                                                },
                                                '->',
                                                {
                                                    xtype : 'button',
                                                    glyph : criterion.consts.Glyph['plus-round'],
                                                    ui : 'feature',
                                                    tooltip : i18n.gettext('Add'),
                                                    handler : 'addDependents',
                                                    bind : {
                                                        hidden : '{editDisabled}'
                                                    }
                                                }
                                            ],
                                            columns : [
                                                {
                                                    xtype : 'gridcolumn',
                                                    flex : 1,
                                                    dataIndex : 'personContactId',
                                                    renderer : 'renderContact'
                                                },
                                                {
                                                    xtype : 'criterion_actioncolumn',
                                                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                                                    items : [
                                                        {
                                                            glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                                            tooltip : i18n.gettext('Delete'),
                                                            handler : 'removeContact',
                                                            isActionDisabled : function(view, rowIndex, colIndex, item, rec) {
                                                                return view.up('criterion_selfservice_open_enrollment_step').getViewModel().get('editDisabled');
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            xtype : 'criterion_gridpanel',
                                            margin : 0,
                                            bind : {
                                                hidden : '{!allowBeneficiary}',
                                                store : '{beneficiaries}'
                                            },
                                            hideHeaders : true,
                                            selModel : 'cellmodel',

                                            viewConfig : {
                                                markDirty : false
                                            },

                                            plugins : {
                                                ptype : 'cellediting',
                                                clicksToEdit : 1
                                            },

                                            tbar : [
                                                {
                                                    xtype : 'tbtext',
                                                    text : i18n.gettext('Beneficiaries'),
                                                    margin : '0 10'
                                                },
                                                '->',
                                                {
                                                    xtype : 'button',
                                                    glyph : criterion.consts.Glyph['plus-round'],
                                                    ui : 'feature',
                                                    handler : 'addBeneficiaries',
                                                    tooltip : i18n.gettext('Add'),
                                                    bind : {
                                                        hidden : '{editDisabled}'
                                                    }
                                                }
                                            ],
                                            columns : [
                                                {
                                                    xtype : 'gridcolumn',
                                                    flex : 1,
                                                    dataIndex : 'personContactId',
                                                    renderer : 'renderContact'
                                                },
                                                {
                                                    xtype : 'gridcolumn',
                                                    dataIndex : 'beneficiaryPercent',
                                                    renderer : function(value) {
                                                        return Ext.util.Format.format('{0}%', value);
                                                    },
                                                    editor : {
                                                        xtype : 'numberfield',
                                                        minValue : 0,
                                                        maxValue : 100,
                                                        allowBlank : false,
                                                        bind : {
                                                            disabled : '{editDisabled}'
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype : 'criterion_actioncolumn',
                                                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                                                    items : [
                                                        {
                                                            glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                                            tooltip : i18n.gettext('Delete'),
                                                            handler : 'removeContact',
                                                            isActionDisabled : function(view, rowIndex, colIndex, item, rec) {
                                                                return view.up('criterion_selfservice_open_enrollment_step').getViewModel().get('editDisabled');
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        },

                                        {
                                            xtype : 'criterion_gridpanel',
                                            margin : 0,
                                            hidden : true,
                                            bind : {
                                                hidden : '{!allowBeneficiary || !showContingents}',
                                                store : '{contingentBeneficiaries}'
                                            },
                                            hideHeaders : true,
                                            selModel : 'cellmodel',

                                            viewConfig : {
                                                markDirty : false
                                            },

                                            plugins : {
                                                ptype : 'cellediting',
                                                clicksToEdit : 1
                                            },

                                            tbar : [
                                                {
                                                    xtype : 'tbtext',
                                                    text : i18n.gettext('Contingent Beneficiaries'),
                                                    margin : '0 10',
                                                    bind : {
                                                        hidden : '{editDisabled && !hasContingents}'
                                                    }
                                                },
                                                '->',
                                                {
                                                    xtype : 'button',
                                                    glyph : criterion.consts.Glyph['plus-round'],
                                                    ui : 'feature',
                                                    handler : 'addContingentBeneficiaries',
                                                    tooltip : i18n.gettext('Add'),
                                                    bind : {
                                                        hidden : '{editDisabled}'
                                                    }
                                                }
                                            ],
                                            columns : [
                                                {
                                                    xtype : 'gridcolumn',
                                                    flex : 1,
                                                    dataIndex : 'personContactId',
                                                    renderer : 'renderContact'
                                                },
                                                {
                                                    xtype : 'gridcolumn',
                                                    dataIndex : 'beneficiaryPercent',
                                                    renderer : function(value) {
                                                        return Ext.util.Format.format('{0}%', value);
                                                    },
                                                    editor : {
                                                        xtype : 'numberfield',
                                                        minValue : 0,
                                                        maxValue : 100,
                                                        allowBlank : false,
                                                        bind : {
                                                            disabled : '{editDisabled}'
                                                        }
                                                    }
                                                },
                                                {
                                                    xtype : 'criterion_actioncolumn',
                                                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                                                    items : [
                                                        {
                                                            glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                                            tooltip : i18n.gettext('Delete'),
                                                            handler : 'removeContact',
                                                            isActionDisabled : function(view, rowIndex, colIndex, item, rec) {
                                                                return view.up('criterion_selfservice_open_enrollment_step').getViewModel().get('editDisabled');
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },

                                // documents
                                {
                                    xtype : 'container',

                                    hidden : true,
                                    bind : {
                                        hidden : '{!employeeStep.isEnroll || !nextYearPlan || editDisabled}'
                                    },

                                    items : [
                                        {
                                            xtype : 'criterion_common_employee_benefit_documents',
                                            reference : 'benefitDocuments',
                                            margin : 0,
                                            hideHeaders : true,
                                            tbar : [
                                                {
                                                    xtype : 'tbtext',
                                                    text : i18n.gettext('Documents'),
                                                    margin : '0 10'
                                                },
                                                '->',
                                                {
                                                    xtype : 'button',
                                                    glyph : criterion.consts.Glyph['plus-round'],
                                                    ui : 'feature',
                                                    tooltip : i18n.gettext('Add'),
                                                    handler : 'handleAddDocument',
                                                    bind : {
                                                        hidden : '{editDisabled}'
                                                    }
                                                }
                                            ],
                                            columns : [
                                                {
                                                    xtype : 'gridcolumn',
                                                    dataIndex : 'documentName',
                                                    text : i18n.gettext('Name'),
                                                    flex : 1
                                                },
                                                {
                                                    xtype : 'criterion_actioncolumn',
                                                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                                                    items : [
                                                        {
                                                            glyph : criterion.consts.Glyph['ios7-trash-outline'],
                                                            tooltip : i18n.gettext('Delete'),
                                                            action : 'removeaction'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                // documents (read only)
                                {
                                    xtype : 'container',

                                    hidden : true,
                                    bind : {
                                        hidden : '{!editDisabled && !isRejected}'
                                    },

                                    items : [
                                        {
                                            xtype : 'criterion_common_employee_benefit_documents',
                                            reference : 'benefitViewDocuments',
                                            downloadURL : API.EMPLOYEE_OPEN_ENROLLMENT_DOCUMENT_DOWNLOAD,
                                            store : {
                                                type : 'criterion_employee_open_enrollment_documents'
                                            },
                                            margin : 0,
                                            hideHeaders : true,
                                            tbar : {
                                                hidden : true,
                                                bind : {
                                                    hidden : '{isRejected}'
                                                },
                                                items : [
                                                    {
                                                        xtype : 'tbtext',
                                                        text : i18n.gettext('Documents'),
                                                        margin : '0 10'
                                                    }
                                                ]
                                            },
                                            columns : [
                                                {
                                                    xtype : 'gridcolumn',
                                                    dataIndex : 'documentName',
                                                    text : i18n.gettext('Name'),
                                                    flex : 1
                                                },
                                                {
                                                    xtype : 'criterion_actioncolumn',
                                                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                                                    items : [
                                                        {
                                                            glyph : criterion.consts.Glyph['ios7-download-outline'],
                                                            tooltip : i18n.gettext('Download'),
                                                            action : 'downloadAction'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ];

            me.callParent(arguments);
        }
    }
});
