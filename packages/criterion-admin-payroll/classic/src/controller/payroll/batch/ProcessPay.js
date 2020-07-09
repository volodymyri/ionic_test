Ext.define('criterion.controller.payroll.batch.ProcessPay', function() {

    const BATCH_STATUSES = criterion.Consts.BATCH_STATUSES,
          PAYMENT_PROCESS_ACTIONS = criterion.Consts.PAYMENT_PROCESS_ACTIONS;

    let payrollSettingsRecord;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_payroll_process_pay',

        requires : [
            'criterion.view.payroll.batch.PrintCheck',
            'criterion.view.payroll.batch.GenerateACH',
            'criterion.view.payroll.batch.GenerateCeridianCheck',
            'criterion.view.payroll.batch.TransmitToPTSC',
            'criterion.view.payroll.batch.ChangePayment',
            'criterion.view.payroll.batch.VoidPayment',
            'criterion.view.payroll.batch.Reverse'
        ],

        reloadBatch : function() {
            let me = this,
                batchRecord = this.getViewModel().get('batchRecord');

            batchRecord.loadWithPromise().then(function() {
                me.handleShow();
            });
        },

        handleShow : function() {
            let me = this,
                view = this.getView(),
                batchRecord = this.getViewModel().get('batchRecord'),
                vm = this.getViewModel(),
                batchId = batchRecord.getId(),
                employerBankAccounts = vm.getStore('employerBankAccounts'),
                employerPayrollSettings = vm.getStore('employerPayrollSettings'),
                payrollPaymentDeposits = vm.getStore('payrollPaymentDeposits'),
                employer;

            view.setLoading(true);

            this.lookup('payrollsGrid').getSelectionModel().deselectAll();

            employer = Ext.StoreManager.lookup('Employers').getById(batchRecord.get('employerId'));
            employer && criterion.LocalizationManager.setGlobalFormat(employer.getData());

            Ext.Deferred.all([
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMPLOYER_PAYROLL_BATCH_PAY_SUMMARY,
                    method : 'GET',
                    params : {
                        batchId : batchId
                    }
                }),
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.EMPLOYER_PAYROLL_BATCH_SUMMARY,
                    method : 'GET',
                    params : {
                        batchId : batchId
                    }
                }),
                payrollPaymentDeposits.loadWithPromise(),
                employerBankAccounts.loadWithPromise(),
                employerPayrollSettings.loadWithPromise()
            ])
                .then(
                    function(data) {
                        let payProcessMenuStore = me.lookup('payProcessMenu').getStore(),
                            filters;

                        vm.set('summaryData', data[0]);
                        vm.set('batchSummary', data[1]);

                        payProcessMenuStore.clearFilter();
                        filters = me.getFilterPayProcessMenu();
                        // block without selection
                        filters.push(PAYMENT_PROCESS_ACTIONS.CHANGE_PAYMENT_TYPE, PAYMENT_PROCESS_ACTIONS.VOID_PAYMENT, PAYMENT_PROCESS_ACTIONS.REVERSE);

                        if (filters.length) {
                            payProcessMenuStore.addFilter({
                                property : 'action',
                                value : Ext.Array.unique(filters),
                                operator : 'notin'
                            });
                        }
                    }
                )
                .always(function() {
                    view.setLoading(false);
                });
        },

        getFilterPayProcessMenu : function() {
            let me = this,
                vm = this.getViewModel(),
                filters = [],
                batchRecord = vm.get('batchRecord'),
                batchStatus = batchRecord.get('batchStatusCode'),
                employerPayrollSettings = vm.getStore('employerPayrollSettings');

            payrollSettingsRecord = employerPayrollSettings.last();

            if (payrollSettingsRecord) {
                let checkProcessingCd = payrollSettingsRecord.get('checkProcessingCd'),
                    achProcessingCd = payrollSettingsRecord.get('achProcessingCd'),
                    taxFilingCd = payrollSettingsRecord.get('taxFilingCd');

                if (me.getPTSCCode(checkProcessingCd)) {
                    filters.push(PAYMENT_PROCESS_ACTIONS.PRINT_CHECKS);
                }

                if (payrollSettingsRecord.get('checkProcessingCode') !== criterion.Consts.PTSC.CERIDIAN) {
                    filters.push(PAYMENT_PROCESS_ACTIONS.GENERATE_CERIDIAN_CHECK);
                }

                if (me.getPTSCCode(achProcessingCd)) {
                    filters.push(PAYMENT_PROCESS_ACTIONS.GENERATE_ACH);
                }

                if (!me.getPTSCCode(taxFilingCd)) {
                    filters.push(PAYMENT_PROCESS_ACTIONS.TRANSMIT_TO_PTSC);
                }
            }

            if (batchStatus === BATCH_STATUSES.COMPLETE) {
                // only reverse allow
                filters.push(
                    PAYMENT_PROCESS_ACTIONS.PRINT_CHECKS,
                    PAYMENT_PROCESS_ACTIONS.GENERATE_ACH,
                    PAYMENT_PROCESS_ACTIONS.GENERATE_CERIDIAN_CHECK,
                    PAYMENT_PROCESS_ACTIONS.CHANGE_PAYMENT_TYPE,
                    PAYMENT_PROCESS_ACTIONS.TRANSMIT_TO_PTSC,
                    PAYMENT_PROCESS_ACTIONS.VOID_PAYMENT
                );
            } else if (batchStatus === BATCH_STATUSES.REVERSAL) {
                // allow generation of ACH file with reversal amounts + print checks + generate_ceridian_check
                filters.push(
                    PAYMENT_PROCESS_ACTIONS.CHANGE_PAYMENT_TYPE,
                    PAYMENT_PROCESS_ACTIONS.VOID_PAYMENT,
                    PAYMENT_PROCESS_ACTIONS.REVERSE
                );
            } else if (batchStatus === BATCH_STATUSES.PAID) {
                // only void allow
                filters.push(
                    PAYMENT_PROCESS_ACTIONS.GENERATE_ACH,
                    PAYMENT_PROCESS_ACTIONS.GENERATE_CERIDIAN_CHECK,
                    PAYMENT_PROCESS_ACTIONS.PRINT_CHECKS,
                    PAYMENT_PROCESS_ACTIONS.CHANGE_PAYMENT_TYPE,
                    PAYMENT_PROCESS_ACTIONS.TRANSMIT_TO_PTSC,
                    PAYMENT_PROCESS_ACTIONS.REVERSE
                );
            } else {
                filters.push(PAYMENT_PROCESS_ACTIONS.REVERSE);
            }

            return filters;
        },

        handleCancel : function() {
            this.redirectTo(criterion.consts.Route.PAYROLL.PAY_PROCESSING + '/payBatch');
        },

        handleTransmitToPTSC : function() {
            let me = this,
                batchRecord = this.getViewModel().get('batchRecord');

            if (batchRecord.get('isTransmitted')) {
                criterion.Msg.confirm(i18n.gettext('This file has been already transmitted.'), i18n.gettext('Do you want to transmit again?'), function(btn) {
                    if (btn === 'yes') {
                        me.showTransmitWindow(batchRecord);
                    }
                }, this);
            } else {
                me.showTransmitWindow(batchRecord);
            }
        },

        showTransmitWindow : function(batchRecord) {
            let summaryData = this.getViewModel().get('summaryData'),
                transmitToPTSCWindow = Ext.create('criterion.view.payroll.batch.TransmitToPTSC');

            transmitToPTSCWindow.getViewModel().set({
                batchRecord : batchRecord,
                summaryData : summaryData
            });

            transmitToPTSCWindow.on('batchUpdated', this.reloadBatch, this);
            transmitToPTSCWindow.show();
        },

        handlePrintChecks : function(selectedPayrollDeposits) {
            let printCheckWindow = Ext.create('criterion.view.payroll.batch.PrintCheck'),
                vm = this.getViewModel(),
                payrollsData = {
                    numberOfChecks : selectedPayrollDeposits.length,
                    totalChecksAmount : 0
                };

            Ext.Array.each(selectedPayrollDeposits, function(payroll) {
                payrollsData.totalChecksAmount += payroll.get('netPay')
            });

            printCheckWindow.getViewModel().set({
                batchId : vm.get('batchRecord.id'),
                payrollDeposits : selectedPayrollDeposits,
                payrollsData : payrollsData,
                employerBankAccounts : vm.getStore('employerBankAccounts')
            });

            printCheckWindow.on('batchUpdated', this.reloadBatch, this);
            printCheckWindow.show();
        },

        handleGenerateACH : function() {
            let generateACHWindow = Ext.create('criterion.view.payroll.batch.GenerateACH'),
                vm = this.getViewModel();

            generateACHWindow.getViewModel().set({
                batchId : vm.get('batchRecord.id'),
                employerBankAccounts : vm.getStore('employerBankAccounts')
            });

            generateACHWindow.on('batchUpdated', this.reloadBatch, this);
            generateACHWindow.show();
        },

        handleGenerateCeridianCheck: function() {
            let generateWindow = Ext.create('criterion.view.payroll.batch.GenerateCeridianCheck'),
                vm = this.getViewModel();

            generateWindow.getViewModel().set({
                batchId : vm.get('batchRecord.id'),
                employerBankAccounts : vm.getStore('employerBankAccounts')
            });

            generateWindow.on('batchUpdated', this.reloadBatch, this);
            generateWindow.show();
        },

        handleComplete : function() {
            let batchRecord = this.getViewModel().get('batchRecord'),
                view = this.getView(),
                me = this,
                payrollPaymentDeposits = this.getViewModel().getStore('payrollPaymentDeposits'),
                taxFilingCd = payrollSettingsRecord.get('taxFilingCd');

            if (payrollPaymentDeposits.findExact('isPaid', false) > -1) {
                criterion.consts.Error.showMessage(criterion.consts.Error.RESULT_CODES.UNPROCESSED_PAYMENTS_FOUND);
            } else if (me.getPTSCCode(taxFilingCd) && !batchRecord.get('isTransmitted')) {
                criterion.consts.Error.showMessage(criterion.consts.Error.RESULT_CODES.BATCH_SHOULD_BE_TRANSMITTED);
            } else {
                view.setLoading(true);

                criterion.Api.requestWithPromise({
                    url : Ext.String.format(criterion.consts.Api.API.EMPLOYER_PAYROLL_BATCH_COMPLETE, batchRecord.getId()),
                    method : 'PUT'
                })
                    .then({
                        success : function() {
                            view.setLoading(false);
                            criterion.Utils.toast(i18n.gettext('Batch completed.'));
                            me.redirectTo(criterion.consts.Route.PAYROLL.PAY_PROCESSING + '/payBatch', null);
                        }
                    });
            }
        },

        init : function() {
            this.handleShow = Ext.Function.createDelayed(this.handleShow, 100, this);
            this.callParent(arguments);
        },

        handlePayrollSelectionChange : function(cbModel, selectedPayrollDeposits) {
            let me = this,
                payProcessMenuStore = me.lookup('payProcessMenu').getStore(),
                filters,
                hidePrintChecks;

            if (!selectedPayrollDeposits.length) {
                payProcessMenuStore.clearFilter();

                filters = me.getFilterPayProcessMenu();
                // block without selection
                filters.push(PAYMENT_PROCESS_ACTIONS.CHANGE_PAYMENT_TYPE, PAYMENT_PROCESS_ACTIONS.VOID_PAYMENT, PAYMENT_PROCESS_ACTIONS.REVERSE);

                payProcessMenuStore.addFilter({
                    property : 'action',
                    value : Ext.Array.unique(filters),
                    operator : 'notin'
                });

                return;
            }

            Ext.Array.each(selectedPayrollDeposits, function(payroll) {
                if (payroll.get('isPaid')) {
                    hidePrintChecks = true;
                }
            });

            payProcessMenuStore.clearFilter();
            filters = me.getFilterPayProcessMenu();

            if (hidePrintChecks) {
                filters.push(PAYMENT_PROCESS_ACTIONS.PRINT_CHECKS);
            }

            if (filters.length) {
                payProcessMenuStore.addFilter({
                    property : 'action',
                    value : Ext.Array.unique(filters),
                    operator : 'notin'
                });
            }
        },

        handleSelectAction : function(combo, value) {
            let me = this,
                vm = this.getViewModel(),
                payrollsGrid = this.lookup('payrollsGrid'),
                selModel = payrollsGrid.getSelectionModel(),
                selectedPayrollDeposits = selModel.getSelection(),
                batchId = vm.get('batchRecord.id');

            combo.reset();

            switch (value) {
                case PAYMENT_PROCESS_ACTIONS.PRINT_CHECKS:
                    selectedPayrollDeposits = selModel.getSelection();

                    this.handlePrintChecks(selectedPayrollDeposits);

                    break;

                case PAYMENT_PROCESS_ACTIONS.GENERATE_ACH:
                    this.handleGenerateACH();

                    break;

                case PAYMENT_PROCESS_ACTIONS.GENERATE_CERIDIAN_CHECK:
                    this.handleGenerateCeridianCheck();

                    break;

                case PAYMENT_PROCESS_ACTIONS.TRANSMIT_TO_PTSC:
                    this.handleTransmitToPTSC();

                    break;

                case PAYMENT_PROCESS_ACTIONS.CHANGE_PAYMENT_TYPE:
                    if (!selectedPayrollDeposits.length) {
                        criterion.consts.Error.showMessage(criterion.consts.Error.RESULT_CODES.PAYMENT_SELECTION_REQUIRED);

                        return;
                    }

                    let changePaymentWindow = Ext.create('criterion.view.payroll.batch.ChangePayment');

                    changePaymentWindow.getViewModel().set({
                        payrollDeposits : Ext.clone(selectedPayrollDeposits),
                        numberOfPayrolls : selectedPayrollDeposits.length,
                        batchId : batchId
                    });

                    changePaymentWindow.on('batchUpdated', this.reloadBatch, this);
                    changePaymentWindow.show();

                    break;

                case PAYMENT_PROCESS_ACTIONS.VOID_PAYMENT:
                    if (!selectedPayrollDeposits.length) {
                        criterion.consts.Error.showMessage(criterion.consts.Error.RESULT_CODES.PAYMENT_SELECTION_REQUIRED);

                        return;
                    }

                    let voidPaymentWindow = Ext.create('criterion.view.payroll.batch.VoidPayment');

                    voidPaymentWindow.getViewModel().set({
                        payrollDeposits : selectedPayrollDeposits,
                        numberOfPayrolls : selectedPayrollDeposits.length,
                        batchId : batchId
                    });

                    voidPaymentWindow.on('batchUpdated', this.reloadBatch, this);
                    voidPaymentWindow.show();

                    break;

                case PAYMENT_PROCESS_ACTIONS.REVERSE:
                    if (!selectedPayrollDeposits.length) {
                        criterion.consts.Error.showMessage(criterion.consts.Error.RESULT_CODES.PAYMENT_SELECTION_REQUIRED);

                        return;
                    }

                    let pWindow = Ext.create('criterion.view.payroll.batch.Reverse');

                    pWindow.getViewModel().set({
                        payrollDeposits : selectedPayrollDeposits,
                        numberOfPayrolls : selectedPayrollDeposits.length,
                        batchId : batchId
                    });

                    pWindow.on('batchUpdated', function(batchId) {
                        let record = Ext.create('criterion.model.employer.payroll.Batch', {
                            id : batchId
                        });

                        record.loadWithPromise().then({
                            scope : this,
                            success : function(rec) {
                                vm.set('batchRecord', rec);
                                Ext.History.add(criterion.consts.Route.PAYROLL.PAY_PROCESSING + '/payBatch/' + batchId, true);

                                me.handleShow();
                            }
                        });
                    });
                    pWindow.show();

                    break;

                case PAYMENT_PROCESS_ACTIONS.COMPLETE_BATCH:
                    this.handleComplete();

                    break;

                case PAYMENT_PROCESS_ACTIONS.CANCEL:
                    this.handleCancel();

                    break;
            }
        },

        getPTSCCode : function(value) {
            if (!value) {
                return 0
            }

            let record = criterion.CodeDataManager.getCodeDetailRecord('id', value, criterion.consts.Dict.PTSC),
                val = 0;

            if (record) {
                val = parseInt(record.get('code'), 10)
            }

            return val === parseInt(criterion.Consts.PTSC.CANADIAN_CLIENT, 10) ? 0 : val;
        }
    };
});
