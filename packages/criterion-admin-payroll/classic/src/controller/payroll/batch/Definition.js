Ext.define('criterion.controller.payroll.batch.Definition', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_payroll_batch_definition',

        requires : [
            'criterion.model.employer.payroll.Batch'
        ],

        mixins : [
            'criterion.controller.mixin.ControlDeferredProcess'
        ],

        _inloadState : false,

        beforeLoadActions : function() {
            let vm = this.getViewModel(),
                view = this.getView(),
                dfd = Ext.create('Ext.Deferred');

            vm.set({
                batchRecord : null,
                periodRecord : null
            });

            view.setLoading(true);
            this._inloadState = true;

            Ext.defer(function() {
                dfd.resolve();
            });

            return dfd.promise;
        },

        /**
         * @param batchId
         */
        load : function(batchId) {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                batchRecord,
                payGroups = vm.getStore('payGroups'),
                employerPayrollPeriodSchedule = vm.getStore('employerPayrollPeriodSchedule');

            if (!this._inloadState) {
                this._inloadState = false;
                this.beforeLoadActions();
            }

            this.lookupReference('payGroup').reset();

            payGroups.clearFilter();
            employerPayrollPeriodSchedule.clearFilter();

            Ext.promise.Promise.all([
                payGroups.loadWithPromise(),
                employerPayrollPeriodSchedule.loadWithPromise(),
                vm.get('payrollSettings').loadWithPromise({
                    skipIfLoaded : true
                })
            ])
                .then(function() {
                    let dfdBatch = Ext.create('Ext.Deferred');

                    if (typeof batchId === 'undefined') {
                        let employers = web.getApplication().getEmployersStore();

                        criterion.CodeDataManager.getCodeDetailRecordStrict('code', criterion.Consts.BATCH_STATUSES.PENDING_APPROVAL, criterion.consts.Dict.BATCH_STATUS)
                            .then(function(batchStatusRecord) {
                                batchRecord = Ext.create('criterion.model.employer.payroll.Batch', {
                                    batchStatusCd : batchStatusRecord.getId()
                                });

                                if (!employers.isLoaded()) {
                                    employers.on('load', function() {
                                        if (employers.count() === 1) {
                                            batchRecord.set('employerId', employers.getAt(0).getId());
                                        }

                                        dfdBatch.resolve();
                                    }, this);
                                } else {
                                    if (employers.count() === 1) {
                                        batchRecord.set('employerId', employers.getAt(0).getId());
                                    }

                                    dfdBatch.resolve();
                                }
                            });
                    } else {
                        criterion.model.employer.payroll.Batch.load(parseInt(batchId, 10), {
                            scope : this,
                            success : function(record) {
                                batchRecord = record;
                                dfdBatch.resolve();
                            },
                            failure : function() {
                                dfdBatch.reject();
                            }
                        });
                    }

                    return dfdBatch.promise;
                })
                .then({
                    scope : this,
                    success : function() {
                        let employerId = batchRecord.get('employerId');

                        vm.set('batchRecord', batchRecord);

                        Ext.defer(() => {
                            me.fireViewEvent('payrollBatchNotes', batchRecord.get('payrollNotes'), vm.get('readOnlyMode'));
                        }, 100);

                        if (batchRecord.get('employerId')) {
                            payGroups.filter({
                                property : 'employerId',
                                value : [employerId, undefined],
                                operator : 'in'
                            });

                            employerPayrollPeriodSchedule.filter({
                                property : 'employerId',
                                value : [employerId, undefined],
                                operator : 'in'
                            });
                        }

                        payGroups.sort('name', 'ASC');

                        if (batchRecord.get('isCalculationInProgress')) {
                            me.checkCalculationProcess(batchRecord.get('calculationProcessId'));
                        }

                        view.setLoading(false);
                    },
                    failure : function() {
                        view.setLoading(false);
                    }
                });
        },

        setNewNotes : function(notes) {
            let vm = this.getViewModel(),
                readOnlyMode = vm.get('readOnlyMode');

            if (!readOnlyMode) {
                vm.set('batchRecord.payrollNotes', notes);
                this.fireViewEvent('payrollBatchNotes', notes, readOnlyMode);
            }
        },

        checkCalculationProcess : function(calculationProcessId) {
            this.controlDeferredProcess(
                i18n.gettext('Calculation'),
                i18n.gettext('Calculation in progress'),
                calculationProcessId
            );
        },

        onCycleButtonToggle : function(container, button) {
            let vm = this.getViewModel();

            vm.set('batchRecord.isOffCycle', button.isOffCycle);
        },

        handleManualCycleChange : function(button) {
            let me = this;

            Ext.defer(function() {
                me.filterPayPeriodList();
            }, 500);
        },

        onPayDateChange : function(field, newValue) {
            let vm = this.getViewModel();

            if (Ext.isDate(newValue) || !newValue) {
                vm.set('batchRecord.payDate', newValue);
            }
        },

        onPeriodSelect : function(combo, val) {
            let vm = this.getViewModel(),
                batchRecord = vm.get('batchRecord');

            if (!batchRecord || !batchRecord.isModel) {
                return;
            }

            if (val === null) {
                vm.set('periodRecord', null);
                batchRecord.set('payDate', null);
            } else {
                let periodRecord = vm.getStore('periods').getById(val);

                if (vm.get('periodRecord') || !batchRecord.get('payDate')) {
                    // set payDate only if user manually changed period
                    batchRecord.set('payDate', periodRecord.get('payDate'));
                }
                vm.set('periodRecord', periodRecord);
            }
        },

        onPayrollScheduleChange : function(combo, value) {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                periods = vm.getStore('periods'),
                batchRecord = vm.get('batchRecord'),
                currentPayPeriodRecord;

            if (!value || !batchRecord || !batchRecord.isModel) {
                return;
            }

            view.setLoading(true);

            periods.loadWithPromise({
                params : {
                    payrollScheduleId : value
                }
            }).then(function() {
                me.filterPayPeriodList();

                currentPayPeriodRecord = periods.getById(batchRecord.get('payrollPeriodId'));

                if (!currentPayPeriodRecord || currentPayPeriodRecord.get('payrollScheduleId') !== value) {
                    batchRecord.set('payrollPeriodId', null);
                }

                view.setLoading(false);
            })
        },

        filterPayPeriodList : function() {
            let me = this,
                vm = this.getViewModel(),
                periods = vm.getStore('periods'),
                batchRecord = vm.get('batchRecord'),
                isOffCycle = vm.get('batchRecord.isOffCycle'),
                payrollPeriodId = vm.get('batchRecord.payrollPeriodId'),
                payrollPeriod = periods.getById(payrollPeriodId),
                scheduledPayDate = Ext.Date.clearTime(new Date());

            periods.clearFilter();

            if (!batchRecord || !batchRecord.isModel) {
                return;
            }

            let i = 0,
                firstShowIndex;

            periods.each(function(rec, index) {
                let showFlag = rec.get('payDate') >= scheduledPayDate;

                if (showFlag) {
                    firstShowIndex = firstShowIndex || index;
                    i++;
                }
                rec.set('isForShow', showFlag && i <= 3);
            });

            // show already selected period
            if (payrollPeriodId && payrollPeriod) {
                payrollPeriod.set({
                    'list-cls' : 'old-value',
                    'isForShow' : true
                });
            }

            // show previous 3 records, if isOffCycle == true;
            if (isOffCycle && firstShowIndex) {
                for (let j = firstShowIndex - 1; j >= firstShowIndex - 3; j--) {
                    if (j >= 0) {
                        periods.getAt(j).set('isForShow', true);
                    }
                }
            }

            periods.addFilter({
                property : 'isForShow',
                value : true
            });

            if (payrollPeriodId && payrollPeriod) {
                Ext.defer(function() {
                    me.lookup('payPeriodCombo').setValue(payrollPeriodId)
                }, 100);
            }
        },

        onSave : function() {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                payGroupId = this.lookupReference('payGroup').getValue(),
                batchRecord = vm.get('batchRecord');

            if (this.lookupReference('form').isValid()) {

                if (batchRecord.dirty) {
                    let criticalFields = ['specialPayPeriodCd', 'taxCalcMethodCd', 'payrollPeriodId', 'payDate'],
                        changes = Ext.Object.getKeys(batchRecord.getChanges()),
                        recalculate = batchRecord.phantom || Ext.Array.intersect(criticalFields, changes).length > 0;

                    view.setLoading(true, null);

                    batchRecord.save({
                        callback : function(record, operation, success) {
                            if (success) {
                                if (payGroupId && recalculate) {
                                    me._recalculate(batchRecord, payGroupId, view);
                                } else {
                                    view.fireEvent('batchSaved', record);
                                    view.setLoading(false, null);
                                }
                            }
                        },
                        scope : this
                    });
                } else {
                    view.fireEvent('batchSaved', batchRecord);
                }
            }
        },

        _recalculate : function(batchRecord, payGroupId, view) {
            let me = this;

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYER_PAYROLL_BATCH_CALCULATE,
                method : 'POST',
                jsonData : {
                    batchId : batchRecord.getId(),
                    payGroupId : payGroupId
                }
            })
                .then({
                    scope : this,
                    success : function(res) {
                        if (me.isDelayedResponse(res)) {
                            me.controlDeferredProcess(
                                i18n.gettext('Calculation'),
                                i18n.gettext('Calculation in progress'),
                                res.processId
                            );
                        } else {
                            me.processingCheckResult(res);
                        }
                    },
                    failure : function() {
                        criterion.Utils.toast(i18n.gettext('Something went wrong.'));
                        view.setLoading(false, null);
                    }
                });
        },

        processingCheckResult : function(res) {
            let me = this,
                view = this.getView(),
                batchRecord = this.getViewModel().get('batchRecord'),
                fn = function() {
                    if (batchRecord.get('isCalculationInProgress')) {
                        me.resetLockedBatch(batchRecord);
                    } else {
                        view.fireEvent('batchSaved', batchRecord);
                    }
                };

            if (res.errors && res.errors.length) {
                let errors;

                errors = Ext.Array.map(res.errors, function(error) {
                    let errorInfo = criterion.consts.Error.getErrorInfo(error);

                    return error.employeeName + ': ' + errorInfo.description;
                });

                criterion.Msg.error({
                    title : i18n.gettext('Errors in the calculation'),
                    message : errors.join('<br>'),
                    fn : fn
                });
            } else {
                fn();
            }

            view.setLoading(false);
        },

        resetLockedBatch : function(batchRecord) {
            batchRecord.set({
                isCalculationInProgress : false,
                calculationProcessId : null
            });

            this.getView().fireEvent('resetLockedBatch');
        },

        onClose : function() {
            let batchRecord = this.getViewModel().get('batchRecord');
            if (!batchRecord || batchRecord.phantom) {
                this.redirectTo(criterion.consts.Route.PAYROLL.PAYROLL, null);
            }
        },

        onBackClick : function() {
            let vm = this.getViewModel(),
                batchRecord = vm.get('batchRecord');

            batchRecord && batchRecord.isModel && batchRecord.reject();
            vm.set({
                batchRecord : null,
                periodRecord : null
            });

            this.redirectTo(criterion.consts.Route.PAYROLL.PAYROLL, null);
        },

        handleDeleteClick : function() {
            let batchRecord = this.getViewModel().get('batchRecord'),
                me = this;

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Delete record'),
                    message : i18n.gettext('Do you want to delete the record?')
                },
                function(btn) {
                    if (btn === 'yes') {
                        batchRecord.erase({
                            success : function() {
                                me.redirectTo(criterion.consts.Route.PAYROLL.PAYROLL, null);
                            }
                        });
                    }
                }
            );
        },

        handleUnapprove : function() {
            let batchRecord = this.getViewModel().get('batchRecord'),
                me = this;

            if (!batchRecord.get('canUnapprove')) {
                return;
            }

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Unapprove'),
                    message : i18n.gettext('Do you want to unapprove this batch?')
                },
                function(btn) {
                    if (btn === 'yes') {
                        criterion.Api.requestWithPromise({
                            url : Ext.String.format(criterion.consts.Api.API.EMPLOYER_PAYROLL_BATCH_UNAPPROVE, batchRecord.getId()),
                            method : 'PUT'
                        }).then(function() {
                            me.redirectTo(criterion.consts.Route.PAYROLL.PAYROLL, null);
                        });
                    }
                }
            );
        },

        handlePayGroupChange : function(combo, newValue) {
            let vm = this.getViewModel(),
                payrollSchedule = this.lookupReference('payrollSchedule'),
                psDisabled = vm.get('readOnlyMode') || !vm.get('activateFieldsCreatingBatch');

            if (!payrollSchedule.getStore()) {
                return;
            }

            if (newValue) {
                payrollSchedule.setValue(combo.getStore().getById(newValue).get('payrollScheduleId'));
                payrollSchedule.setDisabled(true);
            } else {
                combo.lastSelectedRecords = [];

                if (!psDisabled) {
                    payrollSchedule.setDisabled(false);
                }
            }
        },

        handleEmployerChange : function(combo, newValue) {
            let vm = this.getViewModel(),
                employerPayrollPeriodSchedule = vm.getStore('employerPayrollPeriodSchedule'),
                employer = combo.getSelection(),
                taxEngine,
                taxEngineCode;

            employer && criterion.LocalizationManager.setGlobalFormat(employer.getData());

            if (newValue && !combo.isDisabled()) {
                vm.getStore('payGroups').filter({
                    property : 'employerId',
                    value : [newValue, undefined],
                    operator : 'in'
                });

                employerPayrollPeriodSchedule.filter({
                    property : 'employerId',
                    value : [newValue, undefined],
                    operator : 'in'
                });

                taxEngine = vm.get('payrollSettings').findRecord('employerId', newValue, 0, false, false, true);
                taxEngineCode = taxEngine && taxEngine.get('taxEngineCode');

                if (taxEngineCode === criterion.Consts.TAX_ENGINE_CODE.INTRNL_TE) {
                    vm.get('batchRecord').set('taxCalcMethodCd', criterion.CodeDataManager.getStore(criterion.consts.Dict.TAX_CALC_METHOD).findRecord('code', criterion.Consts.TAX_CALC_METHOD_CODE.ANNUALIZED).getId());
                    vm.set('lockCalculationMethod', true);
                } else {
                    vm.set('lockCalculationMethod', false);
                }
            }
        }
    };
});
