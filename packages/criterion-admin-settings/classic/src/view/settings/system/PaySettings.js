Ext.define('criterion.view.settings.system.PaySettings', function() {

    const DICT = criterion.consts.Dict,
        PAYROLL_SETTINGS_TYPE_CRITERION_ID = criterion.Consts.PAYROLL_SETTINGS_TYPE_CRITERION_ID;

    return {

        alias : 'widget.criterion_payroll_settings_pay_settings',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.settings.payroll.PaySettings',
            'criterion.store.employer.payroll.Settings',
            'criterion.store.app.PayrollTimesheetImport'
        ],

        controller : {
            type : 'criterion_payroll_settings_pay_settings'
        },

        viewModel : {
            data : {
                payrollSettingRecord : null
            },
            stores : {
                settings : {
                    type : 'criterion_employer_payroll_settings'
                },
                employerBankAccounts : {
                    type : 'employer_bank_accounts'
                },
                payrollTimesheetImportApps : {
                    type : 'criterion_app_payroll_timesheet_import'
                }
            },
            formulas : {
                isACHProcessingCeridian : data => data('payrollSettingRecord.achProcessingCode') === criterion.Consts.PTSC.CERIDIAN,

                attribute2Val : {
                    get : function(data) {
                        return data('isACHProcessingCeridian') ? parseInt(data('payrollSettingRecord.attribute2'), 10) : null;
                    },
                    set : function(value) {
                        this.set('payrollSettingRecord.attribute2', value);
                    }
                },
                appId : {
                    get : function(get) {
                        let appId = get('payrollSettingRecord.appId');

                        return appId ? appId : PAYROLL_SETTINGS_TYPE_CRITERION_ID;
                    },
                    set : function(value) {
                        this.get('payrollSettingRecord').set('appId', value === PAYROLL_SETTINGS_TYPE_CRITERION_ID ? null : value);
                    }
                }
            }
        },

        listeners : {
            scope : 'controller',
            activate : 'handleActivate'
        },

        title : i18n.gettext('Payroll Settings'),

        bodyPadding : 0,

        scrollable : 'vertical',

        tbar : {
            padding : 0,
            items : [
                {
                    xtype : 'criterion_settings_employer_bar',
                    context : 'criterion_settings',
                    padding : '20 25',
                    labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH
                }
            ]
        },

        items : [
            {
                xtype : 'container',
                flex : 1,
                items : [
                    {
                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_ACCORDION_WIDE,
                        style : {
                            'border-top' : '1px solid #e8e8e8 !important'
                        },
                        items : [
                            {
                                plugins : [
                                    'criterion_responsive_column'
                                ],
                                items : [
                                    {
                                        items : [
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.gettext('Check Processing'),
                                                bind : {
                                                    value : '{payrollSettingRecord.checkProcessingCd}'
                                                },
                                                codeDataId : DICT.PTSC,
                                                allowBlank : true
                                            },
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.gettext('ACH Processing'),
                                                bind : {
                                                    value : '{payrollSettingRecord.achProcessingCd}'
                                                },
                                                codeDataId : DICT.PTSC,
                                                allowBlank : true
                                            },
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.gettext('Tax Filing'),
                                                bind : {
                                                    value : '{payrollSettingRecord.taxFilingCd}'
                                                },
                                                codeDataId : DICT.PTSC,
                                                allowBlank : true
                                            },
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.gettext('New Hire Reporting'),
                                                bind : {
                                                    value : '{payrollSettingRecord.newHireReportingCd}'
                                                },
                                                codeDataId : DICT.PTSC,
                                                allowBlank : true
                                            },
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.gettext('Employer Type'),
                                                bind : {
                                                    value : '{payrollSettingRecord.employerTypeCd}'
                                                },
                                                codeDataId : DICT.EMPLOYER_TYPE,
                                                allowBlank : true
                                            },
                                            {
                                                xtype : 'criterion_code_detail_field',
                                                fieldLabel : i18n.gettext('Tax Engine'),
                                                bind : {
                                                    value : '{payrollSettingRecord.taxEngineCd}'
                                                },
                                                codeDataId : DICT.TAX_ENGINE,
                                                valueCode : criterion.Consts.TAX_ENGINE_CODE.US_CANADA_TE,
                                                allowBlank : false
                                            },
                                            {
                                                xtype : 'combobox',
                                                fieldLabel : i18n.gettext('Load Timesheets From'),
                                                valueField : 'id',
                                                displayField : 'name',
                                                allowBlank : false,
                                                editable : false,
                                                queryMode : 'local',
                                                bind : {
                                                    store : '{payrollTimesheetImportApps}',
                                                    value : '{appId}'
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        items : [
                                            {
                                                xtype : 'toggleslidefield',
                                                bind : {
                                                    value : '{payrollSettingRecord.isOverrideTax}'
                                                },
                                                fieldLabel : i18n.gettext('Override Tax')
                                            },
                                            {
                                                xtype : 'toggleslidefield',
                                                bind : {
                                                    value : '{payrollSettingRecord.isOverrideRate}'
                                                },
                                                fieldLabel : i18n.gettext('Override Rate')
                                            },
                                            {
                                                xtype : 'toggleslidefield',
                                                bind : {
                                                    value : '{payrollSettingRecord.isPieceratePay}'
                                                },
                                                fieldLabel : i18n.gettext('Piece Rate Pay')
                                            },
                                            {
                                                xtype : 'toggleslidefield',
                                                bind : {
                                                    value : '{payrollSettingRecord.isSplitByWeek}'
                                                },
                                                fieldLabel : i18n.gettext('Split Time by Week')
                                            },
                                            {
                                                xtype : 'toggleslidefield',
                                                bind : {
                                                    value : '{payrollSettingRecord.isWcOnOvertime}'
                                                },
                                                fieldLabel : i18n.gettext('WC on Overtime')
                                            },
                                            {
                                                xtype : 'textfield',
                                                fieldLabel : i18n.gettext('Attribute 1'),
                                                bind : {
                                                    value : '{payrollSettingRecord.attribute1}'
                                                }
                                            },
                                            {
                                                xtype : 'textfield',
                                                fieldLabel : i18n.gettext('Attribute 2'),
                                                hidden : true,
                                                bind : {
                                                    value : '{payrollSettingRecord.attribute2}',
                                                    hidden : '{isACHProcessingCeridian}'
                                                }
                                            },
                                            {
                                                xtype : 'combo',
                                                reference : 'bankAccountCombo',
                                                fieldLabel : i18n.gettext('Bank Account'),
                                                hidden : true,
                                                bind : {
                                                    store : '{employerBankAccounts}',
                                                    hidden : '{!isACHProcessingCeridian}',
                                                    disabled : '{!isACHProcessingCeridian}',
                                                    value : '{attribute2Val}'
                                                },
                                                displayField : 'name',
                                                valueField : 'id',
                                                queryMode : 'local',
                                                allowBlank : true,
                                                editable : false
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        flex : 1,
                        layout : {
                            type : 'hbox',
                            align : 'stretch'
                        },
                        style : {
                            'border-top' : '1px solid #e8e8e8 !important'
                        },
                        plugins : [
                            'criterion_responsive_column'
                        ],
                        items : [
                            {
                                xtype : 'container',
                                flex : 4,
                                layout : {
                                    type : 'vbox',
                                    align : 'stretch'
                                },
                                items : [
                                    {
                                        xtype : 'textarea',
                                        enableAlignments : false,
                                        reference : 'importLayout',
                                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH,
                                        fieldLabel : i18n.gettext('Import File Layout'),
                                        padding : '20 50 25 25',
                                        minHeight : 200,
                                        bind : {
                                            value : '{payrollSettingRecord.importFileFormat}'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Update'),
                cls : 'criterion-btn-primary',
                listeners : {
                    click : 'handleUpdate'
                }
            }
        ]
    };

});
