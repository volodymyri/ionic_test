Ext.define('criterion.view.payroll.Batch', function() {

    return {

        alias : 'widget.criterion_payroll_batch',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.ux.StatusBreadcrumb',
            'criterion.view.payroll.batch.Definition',
            'criterion.view.payroll.batch.PayrollEntry',
            'criterion.view.payroll.batch.Approval',
            'criterion.controller.payroll.Batch',
            'criterion.store.employer.payroll.payrollSchedule.PayrollPeriods',
            'criterion.store.employer.payroll.Settings'
        ],

        controller : {
            type : 'criterion_payroll_batch'
        },

        layout : 'border',

        viewModel : {
            data : {
                activeViewIndex : 0,
                enableImport : true,
                notes : null,
                readOnlyMode : null
            },

            stores : {
                payrollSettings : {
                    type : 'criterion_employer_payroll_settings'
                }
            },

            formulas : {
                extraInfo : function(data) {
                    let notes = data('notes'),
                        symbol = notes ? '&#61722;' : '&#61723;',
                        css = notes ? 'filled' : '';

                    return data('readOnlyMode') && !notes ? '' : '<span '
                        + ' alt=""'
                        + ' class="notes-icon ' + css + '"'
                        + ' style="font-family:' + (Ext._glyphFontFamily) + '"'
                        + ' data-qtip="' + i18n.gettext('Notes') + '"' + '>'
                        + symbol
                        + '</span>';
                }
            }
        },

        listeners : {},

        plugins : {
            ptype : 'criterion_lazyitems',
            items : [
                {
                    xtype : 'panel',
                    region : 'center',
                    bodyPadding : 0,
                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },

                    items : [
                        {
                            xtype : 'criterion_status_breadcrumb',
                            bind : {
                                data : {
                                    statuses : [
                                        i18n.gettext('Batch'),
                                        i18n.gettext('Payroll Entry'),
                                        i18n.gettext('Approval')
                                    ],
                                    activeIdx : '{activeViewIndex}',
                                    extraInfo : '{extraInfo}'
                                },
                                hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                    rules : {
                                        OR : [
                                            {
                                                key : criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH,
                                                actName : criterion.SecurityManager.READ,
                                                reverse : true
                                            },
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
                            },
                            hidden : true,
                            margin : '0 0 3 0',
                            listeners : {
                                click : 'onClickNotes'
                            }
                        },
                        {
                            xtype : 'container',
                            reference : 'cardContainer',
                            layout : {
                                type : 'card'
                            },
                            flex : 1,
                            bind : {
                                hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.PAYROLL_BATCH, criterion.SecurityManager.READ, true)
                            },
                            hidden : true,
                            items : [
                                {
                                    xtype : 'criterion_payroll_batch_definition',
                                    reference : 'definition',
                                    listeners : {
                                        scope : 'controller',
                                        batchSaved : 'onBatchCreate',
                                        payrollBatchNotes : 'onGetPayrollBatchNotes'
                                    }
                                },
                                {
                                    xtype : 'criterion_payroll_batch_payrollentry',
                                    reference : 'payrollEntry',
                                    itemId : 'payrollEntry',
                                    listeners : {
                                        scope : 'controller',
                                        detailsSaved : 'onBatchDetailsSave',
                                        showBatchDetails : 'onShowBatchDetails',
                                        batchDetailStoreChange : 'onBatchDetailStoreChange'
                                    }
                                },
                                {
                                    xtype : 'criterion_payroll_batch_approval',
                                    reference : 'payrollApproval',
                                    itemId : 'payrollApproval',
                                    listeners : {
                                        scope : 'controller',
                                        batchSaved : 'onBatchCreate'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    };
});
