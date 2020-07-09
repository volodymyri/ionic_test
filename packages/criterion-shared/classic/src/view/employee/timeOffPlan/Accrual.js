Ext.define('criterion.view.employee.timeOffPlan.Accrual', function() {

    return {
        alias : 'widget.criterion_employee_timeoffplan_accrual',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.store.employer.TimeOffPlans',
            'criterion.controller.employee.timeOffPlan.Accrual'
        ],

        controller : {
            type : 'criterion_employee_timeoffplan_accrual',
            externalUpdate : false
        },

        title : i18n.gettext('Time Off Plan'),

        autoScroll : true,

        allowDelete : true,

        viewModel : {
            data : {
                isPlanActive : true,
                isShowDownloadAccrualLogButton : false
            },

            formulas : {
                readOnlyMode : function(data) {
                    return data('record.isClosed');
                },
                hideSave : function(data) {
                    return data('readOnlyMode') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TIMEOFF_PLANS, criterion.SecurityManager.UPDATE, false, true));
                },
                hideDelete : function(data) {
                    return data('readOnlyMode') || data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TIMEOFF_PLANS, criterion.SecurityManager.DELETE, false, true));
                },
                hideAccrue : function(data) {
                    var endDate = data('record.endDate');

                    return data('readOnlyMode') || data('isPhantom') ||
                        (endDate != null && data('record.accrualDate') > data('record.endDate')) || data('isNonAccruing');
                },
                isNonAccruing : function(data) {
                    var value = criterion.CodeDataManager.getValue(data('record.accrualMethodTypeCd'), criterion.consts.Dict.ACCRUAL_METHOD_TYPE, 'code');

                    return value ? value === criterion.Consts.ACCRUAL_METHOD_TYPE_CODE.NA : false;
                },

                unit : function(data) {
                    return data('record.planIsAccrualInDays') ? i18n.gettext('days') : i18n.gettext('hours');
                }
            }
        },

        dockedItems : [
            {
                xtype : 'toolbar',
                hidden : true,
                bind : {
                    hidden : '{hideAccrue}',
                    disabled : '{!isPlanActive}'
                },
                items : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Accrue'),
                        cls : 'criterion-btn-feature',
                        listeners : {
                            click : 'handleAccrue'
                        },
                        hidden : true,
                        bind : {
                            hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TIMEOFF_PLANS, criterion.SecurityManager.UPDATE, true)
                        }
                    },

                    {
                        xtype : 'button',
                        text : i18n.gettext('Adjustment'),
                        cls : 'criterion-btn-feature',
                        listeners : {
                            click : 'handleAdjustment'
                        },
                        hidden : true,
                        bind : {
                            hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_TIMEOFF_PLANS, criterion.SecurityManager.UPDATE, true)
                        }
                    },
                    '->',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Accrual Log'),
                        cls : 'criterion-btn-feature',
                        listeners : {
                            click : 'handleDownloadAccrualLog'
                        },
                        hidden : true,
                        bind : {
                            hidden : '{!isShowDownloadAccrualLogButton}'
                        }
                    }

                ]
            }
        ],

        items : [
            {
                xtype : 'panel',

                items : [
                    {
                        xtype : 'component',
                        autoEl : 'hr',
                        cls : 'criterion-horizontal-ruler',
                        margin : '10 25'
                    },

                    {
                        xtype : 'container',

                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                        layout : 'hbox',

                        items : [
                            {
                                xtype : 'container',

                                items : [
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Plan Code'),
                                        bind : '{record.planCode}',
                                        name : 'planCode',
                                        disabled : true
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Plan Name'),
                                        bind : '{record.planName}',
                                        name : 'planName',
                                        disabled : true
                                    }
                                ]
                            },
                            {
                                items : [
                                    {
                                        xtype : 'datefield',
                                        fieldLabel : i18n.gettext('Start Date'),
                                        margin : '0 40 20 0',
                                        name : 'startDate',
                                        disabled : true,
                                        bind : {
                                            value : '{record.startDate}',
                                            disabled : '{record.accrualDate}'
                                        }
                                    },
                                    {
                                        xtype : 'datefield',
                                        fieldLabel : i18n.gettext('End Date'),
                                        margin : '0 40 20 0',
                                        bind : {
                                            value : '{record.endDate}',
                                            hidden : '{isNonAccruing}',
                                            disabled : '{record.isActive || record.isClosed}'
                                        },
                                        name : 'endDate',
                                        disabled : true
                                    }
                                ]
                            }
                        ]
                    },

                    {
                        xtype : 'component',
                        autoEl : 'hr',
                        cls : 'criterion-horizontal-ruler',
                        margin : '10 25'
                    },

                    {
                        xtype : 'container',

                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                        layout : 'hbox',

                        items : [
                            {
                                xtype : 'container',

                                items : [
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Manually Override Calculation'),
                                        labelWidth : 230,
                                        name : 'isManualOverride',
                                        bind : {
                                            value : '{record.isManualOverride}',
                                            readOnly : '{readOnlyMode}',
                                            disabled : '{record.isClosed}'
                                        }
                                    }
                                ]
                            },
                            {
                                items : [
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Active'),
                                        name : 'isActive',
                                        bind : {
                                            value : '{record.isActive}',
                                            readOnly : '{readOnlyMode}'
                                        },
                                        handler : function(field, value) {
                                            var vm = this.lookupViewModel(),
                                                record = vm.get('record'),
                                                originalEndDate = record && record.getModified('endDate');

                                            if (value && originalEndDate) {
                                                record.set('endDate', originalEndDate);
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        xtype : 'container',

                        defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,

                        layout : 'hbox',

                        items : [
                            {
                                xtype : 'container',

                                items : [
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : i18n.gettext('Units'),
                                        name : 'potential',
                                        margin : '0 0 20 0',
                                        flex : 1,
                                        readOnly : true,
                                        disabled : true,
                                        bind : {
                                            value : '{unit}'
                                        }
                                    },

                                    {
                                        xtype : 'criterion_form_high_precision_field',
                                        namePrecision : 'amountPrecision',
                                        fieldLabel : i18n.gettext('Potential'),
                                        name : 'potential',
                                        margin : '0 0 20 0',
                                        flex : 1,
                                        bind : {
                                            value : '{record.potential}',
                                            disabled : '{!record.isManualOverride}',
                                            readOnly : '{readOnlyMode}',
                                            hidden : '{isNonAccruing || !record.showPotential}'
                                        }
                                    },

                                    {
                                        xtype : 'criterion_form_high_precision_field',
                                        namePrecision : 'amountPrecision',
                                        fieldLabel : i18n.gettext('Carryover'),
                                        name : 'carryover',
                                        margin : '0 0 20 0',
                                        flex : 1,
                                        bind : {
                                            value : '{record.carryover}',
                                            disabled : '{!record.isManualOverride}',
                                            readOnly : '{readOnlyMode}',
                                            hidden : '{isNonAccruing}'
                                        }
                                    },

                                    {
                                        xtype : 'criterion_form_high_precision_field',
                                        namePrecision : 'amountPrecision',
                                        fieldLabel : i18n.gettext('Carryover Expired'),
                                        name : 'carryoverExpired',
                                        margin : '0 0 20 0',
                                        flex : 1,
                                        bind : {
                                            value : '{record.carryoverExpired}',
                                            disabled : '{!record.isManualOverride}',
                                            readOnly : '{readOnlyMode}',
                                            hidden : '{isNonAccruing}'
                                        }
                                    }
                                ]
                            },
                            {
                                items : [

                                    {
                                        xtype : 'datefield',
                                        fieldLabel : i18n.gettext('Accrual Date'),
                                        name : 'accrualDate',
                                        margin : '0 40 20 0',
                                        bind : {
                                            value : '{record.accrualDate}',
                                            disabled : '{!record.isManualOverride}',
                                            hidden : '{isNonAccruing}'

                                        },
                                        disabled : true
                                    },

                                    {
                                        xtype : 'criterion_form_high_precision_field',
                                        namePrecision : 'amountPrecision',
                                        fieldLabel : i18n.gettext('Net Carryover'),
                                        name : 'carryoverNet',
                                        margin : '0 40 20 0',
                                        flex : 1,
                                        bind : {
                                            value : '{record.carryoverNet}',
                                            hidden : '{isNonAccruing}'
                                        },
                                        disabled : true
                                    },

                                    {
                                        xtype : 'criterion_form_high_precision_field',
                                        namePrecision : 'amountPrecision',
                                        fieldLabel : i18n.gettext('Accrued'),
                                        name : 'accrued',
                                        margin : '0 40 20 0',
                                        disabled : true,
                                        flex : 1,
                                        bind : {
                                            value : '{record.accrued}',
                                            readOnly : '{readOnlyMode}',
                                            hidden : '{isNonAccruing}'
                                        }
                                    },

                                    {
                                        xtype : 'criterion_form_high_precision_field',
                                        namePrecision : 'amountPrecision',
                                        fieldLabel : i18n.gettext('Used'),
                                        name : 'totalUsed',
                                        margin : '0 40 20 0',
                                        flex : 1,
                                        bind : {
                                            value : '{record.totalUsed}'
                                        },
                                        disabled : true
                                    },

                                    {
                                        xtype : 'component',
                                        autoEl : 'hr',
                                        cls : 'criterion-horizontal-ruler',
                                        margin : '0 15 20 15',
                                        bind : {
                                            hidden : '{isNonAccruing}'
                                        }
                                    },

                                    {
                                        xtype : 'criterion_form_high_precision_field',
                                        namePrecision : 'amountPrecision',
                                        fieldLabel : i18n.gettext('Net'),
                                        labelStyle : 'font-weight: bold;',
                                        name : 'totalNet',
                                        margin : '0 40 20 0',
                                        flex : 1,
                                        bind : {
                                            value : '{record.totalNet}',
                                            hidden : '{isNonAccruing}'
                                        },
                                        disabled : true
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],

        loadRecord : function(record) {
            this.callParent(arguments);
            record.dirty = false;
            this.fireEvent('loadRecord', record);
        }
    };

});
