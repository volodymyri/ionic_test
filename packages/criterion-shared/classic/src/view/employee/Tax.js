Ext.define('criterion.view.employee.Tax', function() {

    const SUPPL_METH = criterion.Consts.SUPPL_METH,
        TAX_NUMBERS = criterion.Consts.TAX_NUMBERS,
        CANADIAN_TAX_NUMBERS = criterion.Consts.TAX_NUMBERS.CANADIAN,
        CANADIAN_FEDERAL_PROVINCIAL_TAXES = [CANADIAN_TAX_NUMBERS.FEDERAL, CANADIAN_TAX_NUMBERS.PROVINCIAL];

    return {
        alias : 'widget.criterion_employee_tax',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.employee.Tax',
            'criterion.store.TeReciprocities',
            'criterion.store.TeAlternateCalculations',
            'criterion.ux.HorizontalDivider'
        ],

        allowDelete : true,

        controller : {
            type : 'criterion_employee_tax',
            externalUpdate : false
        },

        listeners : {
            scope : 'controller'
        },

        viewModel : {
            data : {
                readOnly : false,
                blockedState : false,
                /**
                 * @link {criterion.model.employee.Tax}
                 */
                record : null,
                hasFilingStatuses : false,
                hasAlternateCalculations : false,

                records : [],
                currentRecordIndex : 0,
                intrnlTe : false
            },
            stores : {
                reciprocities : {
                    type : 'criterion_te_reciprocities'
                },
                filingStatuses : {
                    type : 'criterion_vertex_filing_status_values'
                },
                alternateCalculations : {
                    type : 'criterion_te_alternate_calculations'
                }
            },
            formulas : {
                hideSave : function(data) {
                    return (data('currentRecordIndex') !== data('records').length - 1) ||
                        !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TAXES, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || data('notAllowDelete') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TAXES, criterion.SecurityManager.DELETE, false, true));
                },

                effectiveDateEditable : data => data('isPhantom'),
                isNotLastTax : data => !data('record.isLastTax'),
                notAllowDelete : data => data('isNotLastTax'),
                notAllowExpire : data => data('isNotLastTax') || !!data('record.expirationDate'),
                isCanadianTax : function(data) {
                    // geo codes start with "70", it's Canada
                    return /^70/.test(data('record.geocode'));
                },
                isCanadianFederalProvincialTaxes : data => data('isCanadianTax') && Ext.Array.contains(CANADIAN_FEDERAL_PROVINCIAL_TAXES, data('record.taxNumber')),
                isFederalWH : data => data('record.taxNumber') === TAX_NUMBERS.US.FEDERAL_WH,
                // see https://criteriondev1.atlassian.net/wiki/spaces/SPEC/pages/381550866/W-4+2020+Changes
                before01012020 : data => data('record.effectiveDate') < new Date('01/01/2020'),
                showW4set2020 : data => !data('before01012020')
            }
        },

        recordIds : [
            'record'
        ],

        bind : {
            title : '{record.taxName}'
        },

        bodyPadding : 0,
        scrollable : 'y',

        defaults : {
            layout : 'hbox',
            defaultType : 'container'
        },

        setButtonConfig : function() {
            if (this.getNoButtons()) {
                return;
            }

            let buttons = [];

            if (this.getAllowDelete()) {
                buttons.push(
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
                            hidden : '{hideDelete}'
                        }
                    }
                )
            }

            buttons.push(
                {
                    xtype : 'button',
                    text : i18n.gettext('Expire'),
                    cls : 'criterion-btn-primary',
                    listeners : {
                        click : 'handleExpireTax'
                    },
                    hidden : true,
                    bind : {
                        hidden : '{notAllowExpire}'
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
                    hidden : true,
                    bind : {
                        text : '{cancelBtnText}',
                        disabled : '{blockedState}',
                        hidden : '{hideCancel}'
                    }
                },
                {
                    xtype : 'button',
                    reference : 'prev',
                    text : i18n.gettext('Prev'),
                    glyph : criterion.consts.Glyph['chevron-left'],
                    cls : 'criterion-btn-primary',
                    listeners : {
                        click : 'handlePrevClick'
                    },
                    hidden : true,
                    bind : {
                        visible : '{currentRecordIndex > 0}'
                    }
                },
                {
                    xtype : 'button',
                    reference : 'next',
                    text : i18n.gettext('Next'),
                    glyph : criterion.consts.Glyph['chevron-right'],
                    iconAlign : 'right',
                    cls : 'criterion-btn-primary',
                    listeners : {
                        click : 'handleNextClick'
                    },
                    hidden : true,
                    bind : {
                        visible : '{currentRecordIndex < records.length - 1}'
                    }
                },
                {
                    xtype : 'button',
                    reference : 'submit',
                    cls : 'criterion-btn-primary',
                    listeners : {
                        click : {
                            fn : 'handleSubmitClick',
                            // Add delay for handleSubmitClick to let viewModel sync with fields
                            delay : 10
                        }
                    },
                    hidden : true,
                    bind : {
                        disabled : '{disableSave}',
                        text : '{submitBtnText}',
                        hidden : '{hideSave}'
                    }
                }
            );

            this.buttons = buttons;
        },

        items : [
            {
                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                hidden : true,
                bind : {
                    hidden : '{isCanadianTax}'
                },
                xtype : 'container',
                items : [
                    {
                        items : [
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Effective Date'),
                                bind : {
                                    value : '{record.effectiveDate}',
                                    readOnly : '{!effectiveDateEditable}',
                                    disabled : '{isCanadianTax}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Expiration Date'),
                                readOnly : true,
                                bind : '{record.expirationDate}'
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Filing Status'),
                                displayField : 'description',
                                valueField : 'id',
                                bind : {
                                    value : '{record.teFilingStatusId}',
                                    store : '{filingStatuses}',
                                    hidden : '{!hasFilingStatuses && !intrnlTe}',
                                    readOnly : '{readOnly}',
                                    disabled : '{isCanadianTax}',
                                    filters : [
                                        {
                                            property : 'isForBefore01012020',
                                            value : '{before01012020}',
                                            exactMatch : true,
                                            disabled : '{!isFederalWH}'
                                        }
                                    ]
                                },
                                listeners : {
                                    change : 'handleChangeFilingStatus'
                                },
                                queryMode : 'local',
                                forceSelection : true,
                                editable : true
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Exemptions'),
                                hidden : true,
                                bind : {
                                    value : '{record.priExemption}',
                                    readOnly : '{readOnly}',
                                    hidden : '{intrnlTe || (isFederalWH && !before01012020)}',
                                    disabled : '{isCanadianTax || intrnlTe || (isFederalWH && !before01012020)}'
                                }
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                fieldLabel : i18n.gettext('Dependents'),
                                hidden : true,
                                bind : {
                                    value : '{record.dependents}',
                                    readOnly : '{readOnly}',
                                    disabled : '{!isFederalWH || !showW4set2020}',
                                    hidden : '{!isFederalWH || !showW4set2020}'
                                }
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                fieldLabel : i18n.gettext('Deductions'),
                                hidden : true,
                                bind : {
                                    value : '{record.deductions}',
                                    readOnly : '{readOnly}',
                                    disabled : '{!isFederalWH || !showW4set2020}',
                                    hidden : '{!isFederalWH || !showW4set2020}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                hidden : true,
                                bind : {
                                    value : '{record.isOverrideTax}',
                                    readOnly : '{readOnly}',
                                    disabled : '{isCanadianTax}',
                                    hidden : '{!intrnlTe}'
                                },
                                fieldLabel : i18n.gettext('Override Tax')
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Exempt'),
                                bind : {
                                    value : '{record.taxExempt}',
                                    readOnly : '{readOnly}',
                                    disabled : '{isCanadianTax}'
                                }
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                fieldLabel : i18n.gettext('Exemption Amount'),
                                bind : {
                                    value : '{record.priExemptionAmount}',
                                    readOnly : '{readOnly}',
                                    hidden : '{intrnlTe || (isFederalWH && !before01012020)}',
                                    disabled : '{isCanadianTax || intrnlTe || (isFederalWH && !before01012020)}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Multiple Jobs'),
                                hidden : true,
                                bind : {
                                    value : '{record.isMultipleJobs}',
                                    readOnly : '{readOnly}',
                                    disabled : '{!isFederalWH || !showW4set2020}',
                                    hidden : '{!isFederalWH || !showW4set2020}'
                                }
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                fieldLabel : i18n.gettext('Other Income'),
                                hidden : true,
                                bind : {
                                    value : '{record.otherIncome}',
                                    readOnly : '{readOnly}',
                                    disabled : '{!isFederalWH || !showW4set2020}',
                                    hidden : '{!isFederalWH || !showW4set2020}'
                                }
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                fieldLabel : i18n.gettext('Additional Tax'),
                                bind : {
                                    value : '{record.additionalTax}',
                                    readOnly : '{readOnly}',
                                    hidden : '{intrnlTe}',
                                    disabled : '{isCanadianTax || intrnlTe}'
                                }
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Alternate Calculation'),
                                displayField : 'jurisdictionDescription',
                                valueField : 'id',
                                bind : {
                                    value : '{record.teAlternateCalculationId}',
                                    hidden : '{!hasAlternateCalculations || intrnlTe}',
                                    store : '{alternateCalculations}',
                                    readOnly : '{readOnly}',
                                    disabled : '{isCanadianTax}'
                                },
                                editable : false,
                                queryMode : 'local'
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_horizontal_divider',
                hidden : true,
                bind : {
                    hidden : '{isCanadianTax || intrnlTe}'
                }
            },
            {
                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                hidden : true,
                bind : {
                    hidden : '{isCanadianTax || intrnlTe}'
                },
                xtype : 'container',
                items : [
                    {
                        items : [
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Secondary Exemptions'),
                                bind : {
                                    value : '{record.secExemption}',
                                    readOnly : '{readOnly}',
                                    disabled : '{isCanadianTax || intrnlTe}'
                                }
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                fieldLabel : i18n.gettext('Secondary Exemption Amount'),
                                bind : {
                                    value : '{record.secExemptionAmount}',
                                    readOnly : '{readOnly}',
                                    disabled : '{isCanadianTax || intrnlTe}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Tax Type'),
                                bind : {
                                    value : '{record.taxTypeCd}',
                                    readOnly : '{readOnly}',
                                    disabled : '{isCanadianTax || intrnlTe}'
                                },
                                codeDataId : criterion.consts.Dict.TAX_TYPE,
                                editable : false
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_horizontal_divider',
                hidden : true,
                bind : {
                    hidden : '{isCanadianTax || intrnlTe}'
                }
            },
            {
                xtype : 'container',

                plugins : [
                    'criterion_responsive_column'
                ],

                hidden : true,
                bind : {
                    hidden : '{isCanadianTax}'
                },

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                items : [
                    {
                        items : [
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Calculation Method (Regular & Supplemental)'),
                                layout : 'hbox',
                                bind : {
                                    hidden : '{intrnlTe}'
                                },
                                items : [
                                    {
                                        xtype : 'textfield',
                                        codeDataRef : 'regsupTaxCalcMethodCd',
                                        bind : {
                                            value : '{record.regsupTaxCalcMethodDescription}',
                                            clearTriggerHidden : '{readOnly}',
                                            disabled : '{isCanadianTax || intrnlTe}'
                                        },
                                        flex : 1,
                                        readOnly : true,

                                        clearTriggerHiddenCls : Ext.baseCSSPrefix + 'form-readonly',
                                        readOnlyCls : '',
                                        cls : 'criterion-hide-default-clear',
                                        triggers : {
                                            clear : {
                                                type : 'clear',
                                                cls : 'criterion-clear-trigger',
                                                handler : 'onTaxMethodClear',
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
                                            click : {
                                                fn : 'onTaxMethodSearch',
                                                args : [SUPPL_METH.REGULAR_AND_SUPPLEMENTAL]
                                            }
                                        },
                                        bind : {
                                            hidden : '{readOnly}',
                                            disabled : '{isCanadianTax || intrnlTe}'
                                        }
                                    }
                                ]
                            },
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Calculation Method (Regular Only)'),
                                layout : 'hbox',
                                bind : {
                                    hidden : '{intrnlTe}'
                                },
                                items : [
                                    {
                                        xtype : 'textfield',
                                        codeDataRef : 'regTaxCalcMethodCd',
                                        bind : {
                                            value : '{record.regTaxCalcMethodDescription}',
                                            clearTriggerHidden : '{readOnly}',
                                            disabled : '{isCanadianTax || intrnlTe}'
                                        },
                                        flex : 1,
                                        readOnly : true,

                                        clearTriggerHiddenCls : Ext.baseCSSPrefix + 'form-readonly',
                                        readOnlyCls : '',
                                        cls : 'criterion-hide-default-clear',
                                        triggers : {
                                            clear : {
                                                type : 'clear',
                                                cls : 'criterion-clear-trigger',
                                                handler : 'onTaxMethodClear',
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
                                            click : {
                                                fn : 'onTaxMethodSearch',
                                                args : [SUPPL_METH.REGULAR]
                                            }
                                        },
                                        bind : {
                                            hidden : '{readOnly}',
                                            disabled : '{isCanadianTax || intrnlTe}'
                                        }
                                    }
                                ]
                            },
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Calculation Method (Supplemental Only)'),
                                layout : 'hbox',
                                bind : {
                                    hidden : '{intrnlTe}'
                                },
                                items : [
                                    {
                                        xtype : 'textfield',
                                        codeDataRef : 'supTaxCalcMethodCd',
                                        bind : {
                                            value : '{record.supTaxCalcMethodDescription}',
                                            clearTriggerHidden : '{readOnly}',
                                            disabled : '{isCanadianTax || intrnlTe}'
                                        },
                                        flex : 1,
                                        readOnly : true,

                                        clearTriggerHiddenCls : Ext.baseCSSPrefix + 'form-readonly',
                                        readOnlyCls : '',
                                        cls : 'criterion-hide-default-clear',
                                        triggers : {
                                            clear : {
                                                type : 'clear',
                                                cls : 'criterion-clear-trigger',
                                                handler : 'onTaxMethodClear',
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
                                            click : {
                                                fn : 'onTaxMethodSearch',
                                                args : [SUPPL_METH.SUPPLEMENTAL]
                                            }
                                        },
                                        bind : {
                                            hidden : '{readOnly}',
                                            disabled : '{isCanadianTax || intrnlTe}'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                hidden : true,
                                bind : {
                                    value : '{record.isOverrideTax}',
                                    readOnly : '{readOnly}',
                                    disabled : '{isCanadianTax}',
                                    hidden : '{intrnlTe}'
                                },
                                fieldLabel : i18n.gettext('Override Tax')
                            },
                            {
                                xtype : 'toggleslidefield',
                                bind : {
                                    value : '{record.nonResidentAlien}',
                                    readOnly : '{readOnly}',
                                    disabled : '{isCanadianTax || intrnlTe}',
                                    hidden : '{intrnlTe}'
                                },
                                fieldLabel : i18n.gettext('Non-Resident Alien')
                            },
                            {
                                xtype : 'toggleslidefield',
                                bind : {
                                    value : '{record.isNonResidentCertificate}',
                                    readOnly : '{readOnly}'
                                },
                                fieldLabel : i18n.gettext('Non-Resident Certificate')
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Reciprocity'),
                                displayField : 'jurisdictionDescription',
                                valueField : 'id',
                                bind : {
                                    value : '{record.teReciprocityId}',
                                    store : '{reciprocities}',
                                    readOnly : '{readOnly}',
                                    disabled : '{isCanadianTax || intrnlTe}',
                                    hidden : '{intrnlTe}'
                                },
                                queryMode : 'local',
                                editable : false
                            }
                        ]
                    }
                ]
            },

            // Canadian
            {
                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                hidden : true,
                bind : {
                    hidden : '{!isCanadianTax || intrnlTe}'
                },
                xtype : 'container',
                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_currencyfield',
                                fieldLabel : i18n.gettext('Claim Amount'),
                                hidden : true,
                                bind : {
                                    value : '{record.claimAmount}',
                                    readOnly : '{readOnly}',
                                    hidden : '{!isCanadianFederalProvincialTaxes}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Effective Date'),
                                bind : {
                                    value : '{record.effectiveDate}',
                                    readOnly : '{!effectiveDateEditable}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Expiration Date'),
                                readOnly : true,
                                bind : '{record.expirationDate}'
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                fieldLabel : i18n.gettext('Additional Tax'),
                                bind : {
                                    value : '{record.additionalTax}',
                                    readOnly : '{readOnly}'
                                }
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                fieldLabel : i18n.gettext('Annual Deductions'),
                                hidden : true,
                                bind : {
                                    value : '{record.annualDeductions}',
                                    readOnly : '{readOnly}',
                                    hidden : '{!isCanadianFederalProvincialTaxes}'
                                }
                            }

                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Exempt'),
                                bind : {
                                    value : '{record.taxExempt}',
                                    readOnly : '{readOnly}'
                                }
                            },
                            {
                                xtype : 'criterion_placeholder_field'
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                fieldLabel : i18n.gettext('Other Tax Credits'),
                                hidden : true,
                                bind : {
                                    value : '{record.otherTaxCredits}',
                                    readOnly : '{readOnly}',
                                    hidden : '{!isCanadianFederalProvincialTaxes}'
                                }
                            },
                            {
                                xtype : 'criterion_currencyfield',
                                fieldLabel : i18n.gettext('Designated Area Deductions'),
                                hidden : true,
                                bind : {
                                    value : '{record.designatedAreaDeductions}',
                                    readOnly : '{readOnly}',
                                    hidden : '{!isCanadianFederalProvincialTaxes}'
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };
});
