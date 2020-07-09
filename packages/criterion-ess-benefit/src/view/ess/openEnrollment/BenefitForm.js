Ext.define('criterion.view.ess.openEnrollment.BenefitForm', function() {

    const UI_DEFAULTS = criterion.Consts.UI_DEFAULTS,
          DEDUCTION_CALC_METHOD_CODES = criterion.Consts.DEDUCTION_CALC_METHOD_CODES;

    return {
        alias : 'widget.criterion_selfservice_open_enrollment_benefit_form',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.ess.openEnrollment.BenefitForm'
        ],

        controller : {
            type : 'criterion_selfservice_open_enrollment_benefit_form'
        },

        viewModel : {
            data : {
                calculated : null
            },
            stores : {
                enroll : {
                    proxy : {
                        type : 'memory'
                    },
                    fields : [
                        {
                            name : 'value',
                            type : 'boolean'
                        },
                        {
                            name : 'text',
                            type : 'string'
                        }
                    ],
                    data : [
                        {
                            value : true,
                            text : i18n.gettext('Enroll')
                        },
                        {
                            value : false,
                            text : i18n.gettext('Waive')
                        }
                    ]
                }
            },
            formulas : {
                employeeContribution : function(get) {
                    let contribution = get('calculated.employeeContribution'),
                        amountIsPercentEnabled = get('amountIsPercentEnabled'),
                        contributionStr = amountIsPercentEnabled ? Ext.util.Format.percent(contribution) : criterion.LocalizationManager.currencyFormatter(contribution);

                    return contribution && contributionStr || '-';
                },
                employerContribution : function(get) {
                    let contribution = get('calculated.employerContribution'),
                        amountIsPercentEnabled = get('amountIsPercentEnabled'),
                        contributionStr = amountIsPercentEnabled ? Ext.util.Format.percent(contribution) : criterion.LocalizationManager.currencyFormatter(contribution);

                    return contribution && contributionStr || '-';
                },
                documentDownloadUrl : function(get) {
                    return criterion.Api.getSecureResourceUrl(Ext.String.format(criterion.consts.Api.API.EMPLOYER_BENEFIT_PLAN_DOWNLOAD, get('planSelect.selection.id')));
                },
                amountIsPercentEnabled : function(get) {
                    let deductionCalcMethodCode = get('calculated.deductionCalcMethodCode');

                    return deductionCalcMethodCode && Ext.Array.contains([
                        DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS,
                        DEDUCTION_CALC_METHOD_CODES.PERCENT_OF_GROSS_MATCH,
                        DEDUCTION_CALC_METHOD_CODES.CERTIFIED_RATE_PERCENT
                    ], deductionCalcMethodCode);
                }
            }
        },

        listeners : {
            optionChange : 'onOptionChange'
        },

        bodyPadding : 0,

        items : [
            {
                xtype : 'container',
                layout : 'hbox',
                margin : '10 20 5',
                items : [
                    {
                        xtype: 'label',
                        margin : '5 0 0 0',
                        width : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
                        bind : {
                            text : '{benefitTitle}'
                        },
                        cls : 'panel-title'
                    },
                    {
                        xtype : 'combobox',
                        queryMode : 'local',
                        flex : 1,
                        valueField : 'value',
                        editable : false,
                        bind : {
                            store : '{enroll}',
                            value : '{employeeStep.isEnroll}',
                            readOnly : '{editDisabled}'
                        },
                        listeners : {
                            change : 'onIsEnrollChange'
                        }
                    }
                ]
            },
            {
                xtype : 'combobox',
                reference : 'planSelect',
                queryMode : 'local',
                fieldLabel : i18n.gettext('Plan'),
                allowBlank : false,
                editable : false,

                displayField : 'name',
                valueField : 'id',

                listeners : {
                    change : 'onPlanChange'
                },

                bind : {
                    store : '{employerStep.benefits}',
                    value : '{employeeStep.benefitPlanId}',
                    readOnly : '{editDisabled}',
                    disabled : '{!employeeStep.isEnroll}',
                    hidden : '{!employeeStep.isEnroll}'
                }
            },
            {
                xtype : 'component',
                hidden : true,
                cls : 'documentLink',
                bind : {
                    hidden : '{!employeeStep.isEnroll || !planSelect.selection.documentName}',
                    html : '<label class="documentLink-label x-form-item-label x-form-item-label-default x-unselectable">' +
                        '<span class="x-form-item-label-inner x-form-item-label-inner-default"><span class="x-form-item-label-text">Document&nbsp;</span></span></label>' +
                        '<a href="{documentDownloadUrl}" target="_blank">{planSelect.selection.documentName}</a>'
                }
            },
            {
                xtype : 'container',
                reference : 'planOptions',

                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                bind : {
                    disabled : '{!employeeStep.isEnroll}',
                    hidden : '{!employeeStep.isEnroll}'
                },

                margin : 0,

                defaults : {
                    margin : '5 20',
                    labelWidth : UI_DEFAULTS.LABEL_WIDTH
                },

                items : [

                ]
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

                bind : {
                    hidden : '{!employeeStep.isEnroll}'
                },

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
                            hidden : '{!planSelect.selection.showEmployeeCost}'
                        },

                        items : [
                            {
                                xtype: 'label',
                                margin : '5 0 0 0',
                                flex : 1,
                                text : i18n.gettext('Employee Contribution')
                            },
                            {
                                xtype : 'textfield',
                                width : 100,
                                readOnly : true,
                                bind : '{employeeContribution}'
                            }
                        ]
                    },
                    {
                        xtype : 'container',

                        layout : 'hbox',

                        hidden : true,

                        bind : {
                            hidden : '{!planSelect.selection.showEmployerCost}'
                        },

                        items : [
                            {
                                xtype: 'label',
                                margin : '5 0 0 0',
                                flex : 1,
                                text : i18n.gettext('Employer Contribution')
                            },
                            {
                                xtype : 'textfield',
                                width : 100,
                                readOnly : true,
                                bind : '{employerContribution}'
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
                                bind : '{calculated.planRateDescription}'
                            }
                        ]
                    }
                ]
            }
        ]
    }
});
