Ext.define('criterion.view.settings.payroll.GLAccountMap', function() {

    var GL_ACCOUNT_TYPE = criterion.Consts.GL_ACCOUNT_TYPE;
    return {

        alias : 'widget.criterion_payroll_settings_gl_account_map',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.payroll.GLAccountMap'
        ],

        allowDelete : true,

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : false
            }
        ],

        controller : {
            type : 'criterion_payroll_settings_gl_account_map',
            externalUpdate : false
        },

        viewModel : {
            formulas : {
                showIncomes : function(get) {
                    return get('record.glAccountTypeCode') === GL_ACCOUNT_TYPE.INCOME;
                },
                showDeductions : function(get) {
                    return Ext.Array.indexOf([GL_ACCOUNT_TYPE.DEDUCTION_EE, GL_ACCOUNT_TYPE.DEDUCTION_ER], get('record.glAccountTypeCode')) !== -1;
                },
                showTimeOffs : function(get) {
                    return get('record.glAccountTypeCode') === GL_ACCOUNT_TYPE.TIME_OFF;
                },
                showTaxes : function(get) {
                    return Ext.Array.indexOf([GL_ACCOUNT_TYPE.TAX_EE, GL_ACCOUNT_TYPE.TAX_ER], get('record.glAccountTypeCode')) !== -1;
                },
                taxName : function(get) {
                    return get('record.taxName') || get('record.taxId')
                },
                isRoundingOrSuspenseAccount : function(get) {
                    return Ext.Array.contains([GL_ACCOUNT_TYPE.ROUNDING, GL_ACCOUNT_TYPE.SUSPENSE_ACCOUNT], get('record.glAccountTypeCode'));
                },
                isCreditNotRequired : function(get) {
                    return get('record.glAccountTypeCode') === GL_ACCOUNT_TYPE.INCOME;
                },
                hideDebitAccount : function(get) {
                    return Ext.Array.indexOf([GL_ACCOUNT_TYPE.DEDUCTION_EE, GL_ACCOUNT_TYPE.TAX_EE, GL_ACCOUNT_TYPE.NET_PAY], get('record.glAccountTypeCode')) !== -1;
                }
            }
        },

        bodyPadding : 0,

        title : i18n.gettext('GL Account Map Details'),

        defaults : {
            bodyPadding : '0 10'
        },

        items : [
            {
                xtype : 'criterion_panel',

                layout : 'hbox',

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                plugins : [
                    'criterion_responsive_column'
                ],

                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_employer_combo',
                                fieldLabel : i18n.gettext('Employer'),
                                name : 'employerId',
                                disabled : true,
                                hideTrigger : true
                            }
                        ]
                    },
                    {}
                ]
            },
            {
                xtype : 'criterion_panel',

                layout : 'hbox',

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                plugins : [
                    'criterion_responsive_column'
                ],

                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Type'),
                                codeDataId : criterion.consts.Dict.GL_ACCOUNT_TYPE,
                                allowBlank : false,
                                name : 'glAccountTypeCd',
                                bind : {
                                    value : '{record.glAccountTypeCd}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'combobox',

                                bind : {
                                    store : '{employerIncomeLists}',
                                    disabled : '{!showIncomes}',
                                    hidden : '{!showIncomes}'
                                },
                                fieldLabel : i18n.gettext('Income'),
                                name : 'incomeListId',
                                displayField : 'description',

                                valueField : 'id',
                                queryMode : 'local',

                                emptyText : i18n.gettext('All'),
                                editable : true
                            },
                            {
                                xtype : 'combobox',

                                bind : {
                                    store : '{employerDeductions}',
                                    disabled : '{!showDeductions}',
                                    hidden : '{!showDeductions}'
                                },
                                fieldLabel : i18n.gettext('Deduction'),
                                name : 'deductionId',
                                displayField : 'description',

                                valueField : 'id',
                                queryMode : 'local',

                                emptyText : i18n.gettext('All'),
                                editable : true
                            },
                            {
                                xtype : 'combobox',

                                bind : {
                                    store : '{employerTimeOffPlans}',
                                    disabled : '{!showTimeOffs}',
                                    hidden : '{!showTimeOffs}'
                                },
                                fieldLabel : i18n.gettext('Time Off Plan'),
                                name : 'timeOffPlanId',
                                displayField : 'name',

                                valueField : 'id',
                                queryMode : 'local',

                                emptyText : i18n.gettext('All'),
                                editable : true
                            },
                            {
                                xtype : 'fieldcontainer',
                                layout : 'hbox',
                                hidden : true,
                                bind : {
                                    hidden : '{!showTaxes}'
                                },
                                items : [
                                    {
                                        xtype : 'textfield',
                                        readOnly : true,
                                        flex : 1,
                                        bind : {
                                            disabled : '{!showTaxes}',
                                            value : '{taxName}'
                                        },
                                        fieldLabel : i18n.gettext('Tax'),
                                        name : 'taxName',

                                        emptyText : i18n.gettext('All'),

                                        triggers : {
                                            clear : {
                                                type : 'clear',
                                                cls : 'criterion-clear-trigger-transparent',
                                                hideWhenEmpty : true,
                                                hideOnReadOnly : false
                                            }
                                        }
                                    },
                                    {
                                        xtype : 'button',
                                        cls : 'criterion-btn-light',
                                        glyph : criterion.consts.Glyph['ios7-search'],
                                        listeners : {
                                            click : 'onTaxSearch'
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_panel',

                layout : 'hbox',

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                plugins : [
                    'criterion_responsive_column'
                ],

                items : [
                    {
                        items : [
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Credit Account'),
                                layout : {
                                    type : 'hbox',
                                    align : 'stretch'
                                },
                                requiredMark : true,
                                reference : 'creditAccountFieldContainer',
                                bind : {
                                    hideRequiredMark : '{isCreditNotRequired}'
                                },
                                items : [
                                    {
                                        xtype : 'combobox',
                                        reference : 'creditAccountField',
                                        flex : 1,
                                        bind : {
                                            store : '{employerGLAccounts}'
                                        },
                                        name : 'creditGlAccountId',
                                        tpl : Ext.create('Ext.XTemplate',
                                            '<tpl for=".">',
                                            '<div class="x-boundlist-item">{accountNumber} / {accountName}</div>',
                                            '</tpl>'
                                        ),
                                        displayTpl : Ext.create('Ext.XTemplate',
                                            '<tpl for=".">',
                                            '{accountNumber} / {accountName}',
                                            '</tpl>'
                                        ),

                                        validateOnChange : false,
                                        listeners : {
                                            change : 'validateAccount'
                                        },

                                        valueField : 'id',
                                        queryMode : 'local',
                                        allowBlank : true,
                                        editable : true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Debit Account'),
                                layout : {
                                    type : 'hbox',
                                    align : 'stretch'
                                },
                                requiredMark : true,
                                hidden : true,
                                reference : 'debitAccountFieldContainer',
                                bind : {
                                    hidden : '{hideDebitAccount}'
                                },
                                items : [
                                    {
                                        xtype : 'combobox',
                                        reference : 'debitAccountField',
                                        flex : 1,
                                        hidden : true,
                                        bind : {
                                            store : '{employerGLAccounts}',
                                            disabled : '{hideDebitAccount}',
                                            hidden : '{hideDebitAccount}'
                                        },
                                        name : 'debitGlAccountId',
                                        tpl : Ext.create('Ext.XTemplate',
                                            '<tpl for=".">',
                                            '<div class="x-boundlist-item">{accountNumber} / {accountName}</div>',
                                            '</tpl>'
                                        ),
                                        displayTpl : Ext.create('Ext.XTemplate',
                                            '<tpl for=".">',
                                            '{accountNumber} / {accountName}',
                                            '</tpl>'
                                        ),

                                        validateOnChange : false,
                                        listeners : {
                                            change : 'validateAccount'
                                        },

                                        valueField : 'id',
                                        queryMode : 'local',
                                        allowBlank : true,
                                        editable : true
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'component',
                autoEl : 'hr',
                cls : 'criterion-horizontal-ruler',
                bind : {
                    hidden : '{isRoundingOrSuspenseAccount}'
                }
            },
            {
                xtype : 'criterion_panel',

                layout : 'hbox',

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                plugins : [
                    'criterion_responsive_column'
                ],

                items : [
                    {
                        items : [
                            {
                                xtype : 'combobox',

                                fieldLabel : i18n.gettext('Location'),
                                bind : {
                                    store : '{employerWorkLocations}',
                                    hidden : '{isRoundingOrSuspenseAccount}',
                                    value : '{record.employerWorkLocationId}'
                                },
                                name : 'employerWorkLocationId',
                                displayField : 'description',

                                valueField : 'id',
                                queryMode : 'local',
                                allowBlank : true,
                                editable : true
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Department'),
                                codeDataId : criterion.consts.Dict.DEPARTMENT,
                                name : 'departmentCd',
                                bind : {
                                    value : '{record.departmentCd}',
                                    hidden : '{isRoundingOrSuspenseAccount}'
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Cost Center'),
                                codeDataId : criterion.consts.Dict.COST_CENTER,
                                name : 'costCenterCd',
                                bind : {
                                    value : '{record.costCenterCd}',
                                    hidden : '{isRoundingOrSuspenseAccount}'
                                }
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Project'),
                                bind : {
                                    store : '{employerProjects}',
                                    hidden : '{isRoundingOrSuspenseAccount}',
                                    value : '{record.projectId}'
                                },
                                name : 'projectId',
                                displayField : 'name',

                                valueField : 'id',
                                queryMode : 'local',
                                allowBlank : true,
                                editable : true
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Task'),
                                bind : {
                                    store : '{employerTasks}',
                                    hidden : '{isRoundingOrSuspenseAccount}',
                                    value : '{record.taskId}'
                                },
                                name : 'taskId',
                                displayField : 'name',

                                valueField : 'id',
                                queryMode : 'local',
                                allowBlank : true,
                                editable : true
                            }
                        ]
                    }
                ]
            }
        ]
    };

});
