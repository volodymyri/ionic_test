Ext.define('criterion.view.settings.payroll.CertifiedRate', function() {

    return {

        alias : 'widget.criterion_payroll_settings_certified_rate',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.payroll.CertifiedRate',
            'criterion.view.settings.payroll.CertifiedRateDetail',
            'criterion.store.Positions',
            'criterion.store.employer.certifiedRate.Deductions',
            'criterion.store.employer.IncomeLists'
        ],

        controller : {
            type : 'criterion_payroll_settings_certified_rate',
            externalUpdate : false
        },

        viewModel : {
            stores : {
                employerPositions : {
                    type : 'positions'
                },
                certifiedRateDeductions : {
                    type : 'employer_certified_rate_deductions'
                },
                incomes : {
                    type : 'employer_income_lists'
                }
            },

            formulas : {
                firstPayrollDates : function(get) {
                    var firstPayrollPeriodStartDate = get('record.firstPayrollPeriodStartDate'),
                        firstPayrollPeriodEndDate = get('record.firstPayrollPeriodEndDate');

                    if (firstPayrollPeriodStartDate && firstPayrollPeriodEndDate) {
                        return Ext.String.format('{0} - {1}',
                            Ext.util.Format.date(firstPayrollPeriodStartDate, criterion.consts.Api.SHOW_DATE_FORMAT),
                            Ext.util.Format.date(firstPayrollPeriodEndDate, criterion.consts.Api.SHOW_DATE_FORMAT)
                        );
                    } else {
                        return '';
                    }
                },
                finalPayrollDates : function(get) {
                    var finalPayrollPeriodStartDate = get('record.finalPayrollPeriodStartDate'),
                        finalPayrollPeriodEndDate = get('record.finalPayrollPeriodEndDate');

                    if (finalPayrollPeriodStartDate && finalPayrollPeriodEndDate) {
                        return Ext.String.format('{0} - {1}',
                            Ext.util.Format.date(finalPayrollPeriodStartDate, criterion.consts.Api.SHOW_DATE_FORMAT),
                            Ext.util.Format.date(finalPayrollPeriodEndDate, criterion.consts.Api.SHOW_DATE_FORMAT)
                        );
                    } else {
                        return '';
                    }
                }
            }
        },

        title : i18n.gettext('Certified Rate'),

        bodyPadding : 0,

        modelValidation : true,

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            {
                xtype : 'criterion_panel',
                layout : 'hbox',

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,
                plugins : [
                    'criterion_responsive_column'
                ],
                bodyPadding : 10,

                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_employer_combo',
                                fieldLabel : i18n.gettext('Employer'),
                                name : 'employerId',
                                disabled : true,
                                hideTrigger : true
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Name'),
                                name : 'name',
                                allowBlank : false
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Union'),
                                name : 'union'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Local'),
                                name : 'local'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Project Number'),
                                name : 'projectNumber'
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Contractor'),
                                name : 'isContractor'
                            },
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('First Payroll'),
                                layout : 'hbox',
                                requiredMark : true,
                                items : [
                                    {
                                        xtype : 'textfield',
                                        reference : 'firstPayroll',
                                        flex : 1,
                                        readOnlyCls : '',
                                        readOnly : true,
                                        allowBlank : false,
                                        bind : {
                                            value : '{firstPayrollDates}'
                                        },
                                        triggers : {
                                            clear : {
                                                type : 'clear',
                                                cls : 'criterion-clear-trigger',
                                                handler : 'onFirstPayrollClear',
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
                                        listeners : {
                                            click : 'onFirstPayrollSelectClick'
                                        }
                                    }
                                ]
                            },
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Final Payroll'),
                                layout : 'hbox',
                                items : [
                                    {
                                        xtype : 'textfield',
                                        reference : 'finalPayroll',
                                        flex : 1,
                                        readOnlyCls : '',
                                        readOnly : true,
                                        bind : {
                                            value : '{finalPayrollDates}'
                                        },
                                        triggers : {
                                            clear : {
                                                type : 'clear',
                                                cls : 'criterion-clear-trigger',
                                                handler : 'onFinalPayrollClear',
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
                                        listeners : {
                                            click : 'onFinalPayrollSelectClick'
                                        }
                                    }
                                ]
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Rate Effective Date'),
                                name : 'rateEffectiveDate',
                                allowBlank : false
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Rate Expiration Date'),
                                name : 'rateExpirationDate'
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_gridview',

                controller : {
                    connectParentView : false,
                    loadRecordOnEdit : false,
                    editor : {
                        xtype : 'criterion_payroll_settings_certified_rate_detail',
                        allowDelete : true
                    }
                },

                bodyPadding : 0,

                tbar : [
                    {
                        xtype : 'button',
                        reference : 'addButton',
                        text : i18n.gettext('Add'),
                        cls : 'criterion-btn-feature',
                        listeners : {
                            click : 'handleAddClick'
                        }
                    },
                    {
                        xtype : 'filebutton',
                        text : i18n.gettext('Import'),
                        cls : 'criterion-btn-feature',
                        listeners : {
                            change : function(cmp, e) {
                                if (!e.target.files || !e.target.files.length) {
                                    return
                                }

                                var view = cmp.up('criterion_payroll_settings_certified_rate'),
                                    record = view.getViewModel().get('record');

                                view.setLoading(true);

                                criterion.Api.submitFakeForm([
                                        {
                                            name : 'employerId',
                                            value : record.get('employerId')
                                        },
                                        {
                                            name : 'certifiedRateId',
                                            value : record.getId()
                                        }
                                    ],
                                    {
                                        url : criterion.consts.Api.API.CERTIFIED_RATE_IMPORT,
                                        extraData : {
                                            certifiedRatesFile : e.target.files[0]
                                        },

                                        success : function(details) {
                                            view.setLoading(false);
                                            cmp.reset();

                                            details && Ext.isArray(details) && record.details().add(Ext.Array.map(details, function(detail) {
                                                delete detail.id;
                                                return detail;
                                            }));
                                        },
                                        failure : function() {
                                            view.setLoading(false);
                                            cmp.reset();
                                        }
                                    });
                            }
                        }
                    },
                    {
                        xtype : 'button',
                        glyph : criterion.consts.Glyph['ios7-cloud-download'],
                        tooltip : i18n.gettext('Download Template'),
                        cls : 'criterion-btn-primary',
                        handler : function(cmp) {
                            window.open(
                                criterion.Api.getSecureResourceUrl(
                                    Ext.String.format(
                                        criterion.consts.Api.API.CERTIFIED_RATE_DOWNLOAD_TEMPLATE,
                                        cmp.up('criterion_payroll_settings_certified_rate').getViewModel().get('record').get('employerId')
                                    )
                                ), '_blank');
                        }
                    }
                ],

                bind : {
                    store : '{record.details}'
                },

                columns : [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Position Code'),
                        flex : 1,
                        dataIndex : 'positionCode'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Title'),
                        flex : 1,
                        dataIndex : 'positionTitle'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Type'),
                        flex : 1,
                        dataIndex : 'rateType',
                        renderer : function(val) {
                            return Ext.Array.findBy(Ext.Object.getValues(criterion.Consts.CERTIFIED_RATE_DETAIL_TYPE), function(item) {
                                return item.value === val;
                            })['text'];
                        }
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Income'),
                        flex : 1,
                        dataIndex : 'incomeListName'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Deduction'),
                        flex : 1,
                        dataIndex : 'deductionName'
                    },
                    {
                        xtype : 'numbercolumn',
                        renderer : function(value) {
                            return value !== null ? criterion.LocalizationManager.currencyFormatter(value) : '';
                        },
                        text : i18n.gettext('Rate'),
                        flex : 1,
                        dataIndex : 'rate'
                    },
                    {
                        xtype : 'gridcolumn',
                        renderer : function(value, metaData, record) {
                            if (value) {
                                return record.get('deductionCalcMethodIsPercent') ? Ext.util.Format.percent(value) : criterion.LocalizationManager.currencyFormatter(value);
                            } else {
                                return '';
                            }
                        },
                        text : i18n.gettext('Employee Amount'),
                        flex : 1,
                        dataIndex : 'employeeAmount'
                    },
                    {
                        xtype : 'gridcolumn',
                        renderer : function(value, metaData, record) {
                            if (value) {
                                return record.get('deductionCalcMethodIsPercent') ? Ext.util.Format.percent(value) : criterion.LocalizationManager.currencyFormatter(value);
                            } else {
                                return '';
                            }
                        },
                        text : i18n.gettext('Employer Amount'),
                        flex : 1,
                        dataIndex : 'employerAmount'
                    }
                ]
            }
        ]
    };

});
