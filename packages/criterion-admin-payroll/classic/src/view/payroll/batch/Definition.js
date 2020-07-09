Ext.define('criterion.view.payroll.batch.Definition', function() {

    const DICT = criterion.consts.Dict,
        BATCH_STATUSES = criterion.Consts.BATCH_STATUSES;

    return {

        alias : 'widget.criterion_payroll_batch_definition',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.payroll.batch.Definition',
            'criterion.model.employer.payroll.Batch',
            'criterion.store.employer.payroll.payrollSchedule.PayrollPeriods',
            'criterion.store.employer.PayGroups'
        ],

        viewModel : {
            data : {
                /**
                 * @see criterion.model.employer.payroll.Batch
                 */
                batchRecord : null,
                periodRecord : null,
                lockCalculationMethod : false
            },

            stores : {
                employerPayrollPeriodSchedule : {
                    type : 'criterion_employer_payroll_schedules'
                },
                periods : {
                    type : 'criterion_employer_payroll_payroll_schedule_payroll_periods'
                },
                payGroups : {
                    type : 'criterion_employer_pay_groups'
                }
            },

            formulas : {
                batchRecordIsPhantom : function(get) {
                    let rec = get('batchRecord');

                    return rec && rec.phantom;
                },
                activateFields : function(get) {
                    return !!get('batchRecord.employerId');
                },
                activateFieldsCreatingBatch : function(get) {
                    return !!get('batchRecord.employerId') && get('batchRecordIsPhantom');
                },
                activateFieldsOnCycle : function(get) {
                    return !!get('batchRecord.employerId') && !get('batchRecord.isOffCycle');
                },
                minPayDate : function(get) {
                    return !!get('batchRecord.employerId') && get('batchRecord.isOffCycle') && get('batchRecord.offCycleStartDate');
                },
                isOffCycle : {
                    get : function(vmget) {
                        return vmget('batchRecord.isOffCycle');
                    },
                    set : Ext.emptyFn
                },
                readOnlyMode : function(get) {
                    return get('batchRecord.batchStatusCode') !== BATCH_STATUSES.PENDING_APPROVAL;
                },
                isPendingApproval : function(get) {
                    return get('batchRecord.batchStatusCode') === BATCH_STATUSES.PENDING_APPROVAL;
                }
            }
        },

        controller : {
            type : 'criterion_payroll_batch_definition'
        },

        padding : 0,

        listeners : {
            close : 'onClose'
        },

        modelValidation : true,

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Delete'),
                cls : 'criterion-btn-remove',
                listeners : {
                    click : 'handleDeleteClick'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getComplexSecurityFormula({
                        append : 'readOnlyMode || batchRecordIsPhantom || batchRecord.isCalculationInProgress ||',
                        rules : [
                            {
                                key : criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH,
                                actName : criterion.SecurityManager.DELETE,
                                reverse : true
                            }
                        ]
                    })
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Unapprove'),
                cls : 'criterion-btn-remove',
                listeners : {
                    click : 'handleUnapprove'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getComplexSecurityFormula({
                        append : '!readOnlyMode || !batchRecord.canUnapprove ||',
                        rules : [
                            {
                                key : criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH_UNAPPROVE,
                                actName : criterion.SecurityManager.ACT,
                                reverse : true
                            }
                        ]
                    })
                }
            },
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Back'),
                cls : 'criterion-btn-light',
                listeners : {
                    click : 'onBackClick'
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Next'),
                listeners : {
                    click : 'onSave'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getComplexSecurityFormula({
                        rules : {
                            OR : [
                                {
                                    key : criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH,
                                    actName : criterion.SecurityManager.CREATE,
                                    reverse : true
                                },
                                {
                                    key : criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH,
                                    actName : criterion.SecurityManager.UPDATE,
                                    reverse : true
                                }
                            ]
                        }
                    })
                }
            }
        ],

        initComponent : function() {
            this.items = [
                {
                    xtype : 'criterion_form',
                    reference : 'form',

                    skipDirtyConfirmation : true,

                    padding : 0,

                    items : [
                        {
                            xtype : 'segmentedbutton',
                            width : 100,
                            layout : 'hbox',
                            margin : '15 20 25 20',
                            defaults : {
                                height : 35,
                                width : 110
                            },
                            listeners : {
                                toggle : 'onCycleButtonToggle'
                            },
                            items : [
                                {
                                    text : i18n.gettext('On Cycle'),
                                    isOffCycle : false,
                                    bind : {
                                        pressed : '{!isOffCycle}',
                                        disabled : '{readOnlyMode}'
                                    },
                                    listeners : {
                                        click : 'handleManualCycleChange'
                                    }
                                },
                                {
                                    text : i18n.gettext('Off Cycle'),
                                    isOffCycle : true,
                                    bind : {
                                        pressed : '{isOffCycle}',
                                        disabled : '{readOnlyMode}'
                                    },
                                    listeners : {
                                        click : 'handleManualCycleChange'
                                    }
                                }
                            ]
                        },
                        {
                            xtype : 'container',

                            defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM,
                            plugins : [
                                'criterion_responsive_column'
                            ],
                            layout : 'hbox',

                            items : [
                                {
                                    items : [
                                        {
                                            xtype : 'criterion_employer_combo',
                                            fieldLabel : i18n.gettext('Employer'),
                                            name : 'employerId',
                                            allowBlank : false,
                                            bind : {
                                                value : '{batchRecord.employerId}',
                                                disabled : '{readOnlyMode || !batchRecordIsPhantom}'
                                            },
                                            listeners : {
                                                change : 'handleEmployerChange'
                                            }
                                        },
                                        {
                                            xtype : 'textfield',
                                            fieldLabel : i18n.gettext('Name'),
                                            bind : {
                                                value : '{batchRecord.name}',
                                                disabled : '{readOnlyMode || !activateFields}'
                                            }
                                        },
                                        {
                                            xtype : 'extended_combo',
                                            fieldLabel : i18n.gettext('Pay Group'),
                                            reference : 'payGroup',
                                            store : this.getViewModel().getStore('payGroups'),
                                            bind : {
                                                value : '{batchRecord.payGroupId}',
                                                disabled : '{readOnlyMode || !activateFieldsCreatingBatch}'
                                            },
                                            displayField : 'name',
                                            valueField : 'id',
                                            editable : true,
                                            allowBlank : true,
                                            queryMode : 'local',
                                            listeners : {
                                                change : 'handlePayGroupChange'
                                            }
                                        },
                                        {
                                            xtype : 'criterion_code_detail_field',
                                            fieldLabel : i18n.gettext('Special Pay Period'),
                                            bind : {
                                                value : '{batchRecord.specialPayPeriodCd}',
                                                disabled : '{readOnlyMode || !activateFields}'
                                            },
                                            codeDataId : DICT.SPECIAL_PAY_PERIOD,
                                            editable : false
                                        },
                                        {
                                            xtype : 'criterion_code_detail_field',
                                            fieldLabel : i18n.gettext('Calculation Method'),
                                            bind : {
                                                value : '{batchRecord.taxCalcMethodCd}',
                                                disabled : '{readOnlyMode || !activateFields || lockCalculationMethod}'
                                            },
                                            codeDataId : DICT.TAX_CALC_METHOD,
                                            editable : false
                                        }
                                    ]
                                },
                                {
                                    items : [
                                        {
                                            xtype : 'extended_combo',
                                            fieldLabel : i18n.gettext('Payroll Schedule'),
                                            name : 'payrollScheduleId',
                                            reference : 'payrollSchedule',
                                            bind : {
                                                store : '{employerPayrollPeriodSchedule}',
                                                value : '{batchRecord.payrollScheduleId}',
                                                disabled : '{readOnlyMode || !activateFieldsCreatingBatch}'
                                            },
                                            listeners : {
                                                change : 'onPayrollScheduleChange'
                                            },
                                            displayField : 'name',
                                            valueField : 'id',
                                            editable : false,
                                            allowBlank : false,
                                            queryMode : 'local',
                                            emptyText : i18n.gettext('Not Selected')
                                        },
                                        {
                                            xtype : 'combo',
                                            reference : 'payPeriodCombo',
                                            fieldLabel : i18n.gettext('Pay Period'),
                                            bind : {
                                                store : '{periods}',
                                                value : '{batchRecord.payrollPeriodId}',
                                                disabled : '{readOnlyMode || !activateFieldsCreatingBatch}'
                                            },
                                            listeners : {
                                                change : 'onPeriodSelect'
                                            },
                                            tpl : Ext.create(
                                                'Ext.XTemplate',
                                                '<tpl for=".">',
                                                '<div class="x-boundlist-item {list-cls}">{number}, {periodStartDate:date("m/d/Y")} to {periodEndDate:date("m/d/Y")}</div>',
                                                '</tpl>'
                                            ),
                                            displayTpl : Ext.create(
                                                'Ext.XTemplate',
                                                '<tpl for=".">',
                                                '{number}, {periodStartDate:date("m/d/Y")} to {periodEndDate:date("m/d/Y")}',
                                                '</tpl>'
                                            ),
                                            valueField : 'id',
                                            editable : false,
                                            allowBlank : true,
                                            queryMode : 'local'
                                        },
                                        {
                                            xtype : 'datefield',
                                            fieldLabel : i18n.gettext('Pay Date'),
                                            bind : {
                                                value : '{batchRecord.payDate}',
                                                minValue : '{minPayDate}',
                                                disabled : '{readOnlyMode || !activateFields}'
                                            },
                                            listeners : {
                                                change : 'onPayDateChange'
                                            },
                                            allowBlank : false
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        }
    };
});
