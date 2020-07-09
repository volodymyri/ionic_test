Ext.define('criterion.view.settings.payroll.BankInformation', function() {

    return {

        alias : 'widget.criterion_payroll_settings_bank_information',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.store.Transfers',
            'criterion.store.Reports',
            'criterion.controller.settings.payroll.BankInformation'
        ],

        controller : {
            type : 'criterion_settings_payroll_bank_information',
            externalUpdate : false
        },

        viewModel : {
            stores : {
                transfers : {
                    type : 'criterion_transfers'
                },
                checkLayouts : {
                    type : 'criterion_reports'
                }
            }
        },

        listeners : {
            afterSave : 'onAfterSaveBankAccount',
            afterrender : 'onAfterRender'
        },

        bodyPadding : 0,

        header : {
            title : i18n._('Account Details'),

            defaults : {
                margin : '0 10 0 0'
            },

            items : [
                {
                    xtype : 'button',
                    text : i18n._('Generate Pre Note'),
                    handler : 'handleGeneratePreNote',
                    cls : 'criterion-btn-feature',
                    bind : {
                        disabled : '{!record.transferId}'
                    }
                }
            ]
        },

        defaults : {
            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,
            bodyPadding : '0 10',
            layout : 'hbox',
            plugins : [
                'criterion_responsive_column'
            ]
        },

        items : [
            {

                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_employer_combo',
                                fieldLabel : i18n._('Employer'),
                                name : 'employerId',
                                disabled : true,
                                hideTrigger : true
                            },
                            {
                                xtype : 'textfield',
                                maxLength : 50,
                                fieldLabel : i18n._('Account Name'),
                                name : 'name',
                                allowBlank : false
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n._('Account Number'),
                                maxLength : 50,
                                name : 'accountNumber',
                                allowBlank : false
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n._('Bank Name'),
                                name : 'bankName',
                                allowBlank : false
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n._('Bank Address'),
                                name : 'bankAddress'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n._('Routing Number'),
                                name : 'routingNumber',
                                allowBlank : false
                            }
                        ]
                    }
                ]
            },
            {
                title : i18n._('Check Information'),

                items : [
                    {
                        items : [
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n._('Check Style'),
                                name : 'reportId',
                                valueField : 'id',
                                displayField : 'name',
                                queryMode : 'local',
                                editable : false,
                                forceSelection : true,
                                bind : {
                                    store : '{checkLayouts}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n._('Next Check No.'),
                                name : 'nextCheckNo'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n._('Horizontal Offset'),
                                name : 'horizontalOffset'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n._('Vertical Offset'),
                                maxLength : 50,
                                name : 'verticalOffset'
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n._('Account Offset'),
                                minValue : 1,
                                maxValue : 10,
                                name : 'accountOffset',
                                allowBlank : false,
                                allowDecimals : false
                            },
                            {
                                xtype : 'filefield',
                                fieldLabel : i18n._('Signature'),
                                name : 'signatureFile',
                                reference : 'signatureFile',
                                buttonText : i18n._('Browse'),
                                buttonMargin : 6,
                                emptyText : i18n._('Drop File here or browse'),
                                buttonOnly : false,
                                allowBlank : true,
                                listeners : {
                                    change : function(fld, value) {
                                        var newValue = value.replace(/C:\\fakepath\\/g, '');

                                        fld.setRawValue(newValue);
                                    },
                                    afterrender : function(cmp) {
                                        cmp.fileInputEl.on('change', function(event) {
                                            cmp.fireEvent('onselectfile', event, cmp);
                                        });
                                    },
                                    onselectfile : 'handleSelectFile'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n._('Show Identifier'),
                                name : 'showIdentifier'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n._('Show Background'),
                                name : 'showBackground'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n._('Show YTD Earnings Section'),
                                name : 'showYtd'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n._('Show Benefits Section'),
                                name : 'showBenefits'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n._('Show Time Off Section'),
                                name : 'showTimeOff'
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n._('Show Notes'),
                                name : 'showNotes'
                            }
                        ]
                    }
                ]
            },
            {
                title : i18n._('ACH Information'),

                items : [
                    {
                        items : [
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n._('File Format'),
                                name : 'transferId',
                                valueField : 'id',
                                displayField : 'name',
                                queryMode : 'local',
                                editable : false,
                                forceSelection : true,
                                bind : {
                                    store : '{transfers}'
                                }
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n._('Security Record'),
                                name : 'securityRecord'
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n._('Company Identifier'),
                                name : 'companyIdentifier',
                                maxLength : 20,
                                enforceMaxLength : true,
                                allowBlank : false
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n._('Enable Offset'),
                                name : 'enableOffset'
                            }
                        ]
                    }
                ]
            }
        ]
    };

});
