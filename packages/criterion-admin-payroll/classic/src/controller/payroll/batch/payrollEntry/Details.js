Ext.define('criterion.controller.payroll.batch.payrollEntry.Details', function() {

    const DICT = criterion.consts.Dict,
        STATE = 'colVisible';

    let scrollY = 0;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_payroll_batch_payroll_entry_details',

        requires : [
            'criterion.view.payroll.batch.payrollEntry.GrossUpCalculate',
            'criterion.model.payroll.Income'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.payroll.batch.payrollEntry.NotesHandler'
        ],

        handleLeftEmployeeSwitch : function() {
            let vm = this.getViewModel();

            vm.set('currentIndex', vm.get('currentIndex') - 1);
            this.load();
        },

        handleRightEmployeeSwitch : function() {
            let vm = this.getViewModel();

            vm.set('currentIndex', vm.get('currentIndex') + 1);
            this.load();
        },

        init() {
            this.lstorage = Ext.util.LocalStorage.get({
                _users : 1,
                id : 'payrollEntryDetails',
                session : true
            });

            this.callParent(arguments);
        },

        load : function() {
            let view = this.getView(),
                vm = view.getViewModel(),
                cEmployee = view.getEmployees().getAt(vm.get('currentIndex')),
                employeeId = cEmployee.data['employeeId'],
                payrollId = cEmployee.getId(),
                payrollSettings = vm.get('payrollSettings');

            view.clearIncomeListItems();

            vm.get('payrollBatchDetails').each(function(payrollBatchDetail) {
                if (payrollBatchDetail.get('payroll')['id'] === payrollId) {
                    let assignmentPayRateUnitCd = payrollBatchDetail.get('assignmentPayRateUnitCd');

                    assignmentPayRateUnitCd && vm.set(
                        'payRate',
                        Ext.util.Format.currency(payrollBatchDetail.get('assignmentPayRate')) + ' (' +
                        criterion.CodeDataManager.getCodeDetailRecord('id', assignmentPayRateUnitCd, criterion.consts.Dict.RATE_UNIT).get('description') + ')'
                    )
                }
            });

            view.setLoading(true);

            Ext.promise.Promise.all([
                criterion.Api.requestWithPromise({
                    url : criterion.consts.Api.API.PAYROLL_DETAILS,
                    params : {
                        payrollId : payrollId
                    },
                    method : 'GET'
                }),
                vm.getStore('assignments').loadWithPromise({
                    params : {
                        payrollId : payrollId
                    }
                }),
                vm.getStore('projects').loadWithPromise({
                    params : {
                        payrollId : payrollId
                    }
                }),
                vm.getStore('tasks').loadWithPromise({
                    params : {
                        payrollId : payrollId
                    }
                }),
                vm.getStore('employeeWorkLocations').loadWithPromise({
                    params : {
                        employeeId : employeeId
                    }
                }),
                vm.getStore('workLocationAreas').loadWithPromise(),
                payrollSettings.loadWithPromise({
                    skipIfLoaded : true
                })
            ]).then({
                scope : this,
                success : function(results) {
                    vm.set('payrollSetting', payrollSettings.findRecord('employerId', vm.get('employerId'), 0, false, false, true));

                    return this.processResponse(results[0]);
                }
            }).always(function() {
                Ext.defer(view.setLoading, 300, view, [false]); // wait data processing
            });
        },

        handleAddIncome : function() {
            let view = this.getView(),
                vm = view.getViewModel(),
                addIncomeWindow,
                assignments = this.getStore('assignments'),
                employeeWorkLocations = this.getStore('employeeWorkLocations');

            addIncomeWindow = Ext.create('criterion.view.payroll.batch.payrollEntry.AddIncome', {
                viewModel : {
                    data : {
                        incomesStore : vm.get('batchIncomesStore'),
                        tasksStore : this.getStore('tasks'),
                        projectsStore : this.getStore('projects'),
                        assignmentsStore : assignments,
                        employeeWorkLocationsStore : employeeWorkLocations,
                        workLocationAreasStore : this.getStore('workLocationAreas'),
                        labelWorkLocation : vm.get('labelWorkLocation'),
                        labelWorkArea : vm.get('labelWorkArea'),
                        labelAssignment : vm.get('labelAssignment'),
                        labelTask : vm.get('labelTask'),
                        labelProject : vm.get('labelProject'),

                        isShowWorkLocation : vm.get('isShowWorkLocation') || employeeWorkLocations.count() > 1,
                        isShowAssignment : vm.get('isShowAssignment') || assignments.count() > 1,
                        isShowWorkArea : vm.get('isShowWorkArea'),
                        isShowTasks : vm.get('isShowTasks'),
                        isShowProject : vm.get('isShowProject')
                    }
                }
            });

            addIncomeWindow.on('addIncome', function(data) {
                let me = this,
                    newIncome,
                    matchedRecordIdx;

                matchedRecordIdx = this.getStore('payrollIncomes').findBy(function(record) {
                    let match = true;

                    Ext.Object.each(data, function(key, value) {
                        match = match && record.get(key) === value;
                    });

                    return match;
                });

                if (matchedRecordIdx !== -1) {
                    criterion.Msg.warning(i18n.gettext('Current user already has that income.'));
                } else {
                    newIncome = Ext.create('criterion.model.payroll.Income', Ext.apply({
                        payrollId : view.getEmployees().getAt(vm.get('currentIndex')).getId()
                    }, data));

                    this.getStore('payrollIncomes').add(newIncome);

                    this.recalculate(true, null, null, null, false).then({
                        scope : this,
                        failure : function() {
                            me.getStore('payrollIncomes').remove(newIncome);
                        }
                    });
                }

            }, this);

            addIncomeWindow.show();
        },

        handleGrossUp : function() {
            let me = this,
                view = this.getView(),
                vm = view.getViewModel(),
                grossUpWindow,
                payrollIncomes,
                income;

            grossUpWindow = Ext.create('criterion.view.payroll.batch.payrollEntry.GrossUpCalculate', {
                viewModel : {
                    data : {
                        incomesStore : vm.get('batchIncomesStore'),
                        payrollId : view.getEmployees().getAt(vm.get('currentIndex')).getId()
                    }
                }
            });

            grossUpWindow.on('grossUp', function(data) {
                payrollIncomes = this.getStore('payrollIncomes');

                payrollIncomes.each((rec) => {
                    rec.set('grossUpAmount', null);
                });
                income = payrollIncomes.findRecord('incomeListId', data.incomeId, 0, false, false, true);
                income && income.set('grossUpAmount', data.amount);

                this.recalculate(true, null, null, true);
            }, this);

            grossUpWindow.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            grossUpWindow.show();

            me.setCorrectMaskZIndex(true);
        },

        onShowNotes : function() {
            let vm = this.getViewModel();

            this.showNotesPopup(
                {
                    employee : vm.get('employeePayrollNotes'),
                    payroll : vm.get('payrollNotes')
                },
                vm.get('readOnlyMode')
            );
        },

        changeNotes : function(notes) {
            this.getViewModel().set('payrollNotes', notes);
        },

        handleShow : function() {
            this.getViewModel().set('employees', this.getView().getEmployees());
            this.load();
        },

        handleCancel : function() {
            this.getView().fireEvent('close');
            this.getView().destroy();
        },

        processResponse : function(response) {
            let me = this,
                vm = this.getViewModel();

            vm.set({
                employeePayrollNotes : response.employeePayrollNotes,
                payrollNotes : response.payroll.payrollNotes
            });

            return this.prepareCustomData(response.customData).then(function() {
                me.processFillStores(response);
            });
        },

        prepareCustomData : function(customData) {
            let vm = this.getViewModel(),
                dfd = Ext.create('Ext.Deferred'),
                sCustomData = vm.getStore('customData'),
                codeTableCodes = [
                    DICT.DATA_TYPE
                ];

            if (!vm) {
                // if view already destroyed
                return;
            }

            vm.set({
                'customData_1_label' : '',
                'customData_2_label' : '',
                'customData_3_label' : '',
                'customData_4_label' : '',

                'customData_1_isHidden' : true,
                'customData_2_isHidden' : true,
                'customData_3_isHidden' : true,
                'customData_4_isHidden' : true
            });

            sCustomData.loadRawData(Ext.clone(customData));

            sCustomData.each(function(customField) {
                let codeTableId = customField.get('codeTableId');

                if (codeTableId) {
                    codeTableCodes.push(
                        criterion.CodeDataManager.getCodeTableNameById(codeTableId)
                    );
                }

                vm.set('customData_' + customField.getId() + '_label', customField.get('label'));
                vm.set('customData_' + customField.getId() + '_isHidden', customField.get('isHidden'));
            });

            if (codeTableCodes.length) {
                criterion.CodeDataManager.load(codeTableCodes, function() {
                    dfd.resolve();
                });
            } else {
                dfd.resolve();
            }

            return dfd.promise;
        },

        _getStateValue(key) {
            let val = this.lstorage.getItem(STATE + '-' + key);

            return val ? parseInt(val, 10) : null;
        },

        processFillStores : function(response) {
            let vm = this.getViewModel(),
                view = this.getView();

            if (!vm) {
                // if view already destroyed
                return;
            }

            let employeeTaxes = vm.getStore('employeeTaxes'),
                employerTaxes = vm.getStore('employerTaxes'),
                deductions = vm.getStore('deductions'),
                employeeTaxesArr,
                employerTaxesArr,
                employeeTaxesAndDeductionsData,
                employerTaxesAndDeductionsData,
                payrollSummaryIncomes = vm.getStore('payrollSummaryIncomes');

            vm.set({
                personName : response.personName,
                personNumber : response.employeeNumber,
                payDate : response.payDate && Ext.Date.parse(response.payDate, 'Y.m.d'),
                isCalculated : response.payroll && response.payroll.isCalculated,
                labelWorkLocation : response.labelWorkLocation || i18n.gettext('Location'),
                labelWorkArea : response.labelWorkArea || i18n.gettext('Area'),
                labelAssignment : response.labelAssignment || i18n.gettext('Title'),
                labelTask : response.labelTask || i18n.gettext('Task'),
                labelProject : response.labelProject || i18n.gettext('Project'),

                isShowWorkLocation : response.isShowWorkLocation || vm.getStore('employeeWorkLocations').count() > 1,
                isShowAssignment : response.isShowAssignment || vm.getStore('assignments').count() > 1,
                isShowWorkArea : response.isShowWorkArea,
                isShowTasks : response.isShowTasks,
                isShowProject : response.isShowProject,

                isShowWorkLocationOverride : this._getStateValue('employerWorkLocation'),
                isShowAssignmentOverride : this._getStateValue('title'),
                isShowWorkAreaOverride : this._getStateValue('workLocationArea'),
                isShowTasksOverride : this._getStateValue('employeeTask'),
                isShowProjectOverride : this._getStateValue('Project')
            });

            vm.getStore('payrollIncomes').setData(response.payrollIncomes);
            payrollSummaryIncomes.loadRawData(Ext.clone(response.payrollSummaryIncomes));
            vm.getStore('payrollTotals').setData(response.payrollTotals);
            employerTaxes.setData(response.employerTaxes);
            employeeTaxes.setData(response.employeeTaxes);

            deductions.setData(response.payrollDeductIns);

            employeeTaxesArr = employeeTaxes.getDataAsArray();
            employerTaxesArr = employerTaxes.getDataAsArray();

            deductions.filter('isEmployee', true);
            employeeTaxesAndDeductionsData = Ext.Array.insert(employeeTaxesArr, employeeTaxesArr.length, deductions.getDataAsArray());
            deductions.filter('isEmployee', false);
            employerTaxesAndDeductionsData = Ext.Array.insert(employerTaxesArr, employerTaxesArr.length, deductions.getDataAsArray());

            // removing id duplicates
            Ext.Array.each(employeeTaxesAndDeductionsData, function(employeeTaxesAndDeduction, index) {
                employeeTaxesAndDeduction['id'] = index + 1;
            });
            Ext.Array.each(employerTaxesAndDeductionsData, function(employerTaxesAndDeductions, index) {
                employerTaxesAndDeductions['id'] = index + 1;
            });

            vm.getStore('employeeTaxesAndDeductions').setData(employeeTaxesAndDeductionsData);
            vm.getStore('employerTaxesAndDeductions').setData(employerTaxesAndDeductionsData);
            deductions.clearFilter();

            payrollSummaryIncomes.each(function(payrollSummaryIncome) {
                let innerIncomes = payrollSummaryIncome.innerIncomes(),
                    firstIncome = innerIncomes.getAt(0),
                    count = innerIncomes.count(),
                    isOne = count === 1,
                    isFixedRate = isOne ? firstIncome.get('isFixedRate') : false;

                payrollSummaryIncome.set({
                    projectName : isOne ? firstIncome.get('projectName') : '...',
                    employeeTask : isOne ? firstIncome.get('employeeTask') : '...',
                    employerWorkLocation : isOne ? firstIncome.get('employerWorkLocation') : '...',
                    workLocationArea : isOne ? firstIncome.get('workLocationArea') : '...',

                    customValue1 : firstIncome.get('customValue1'),
                    customValue2 : firstIncome.get('customValue2'),
                    customValue3 : firstIncome.get('customValue3'),
                    customValue4 : firstIncome.get('customValue4'),

                    isFixedRate : isFixedRate,
                    __rate : payrollSummaryIncome.get('rate'),
                    __isFixedRate : isFixedRate,

                    rate : payrollSummaryIncome.get('adjustedRate') !== null ? payrollSummaryIncome.get('adjustedRate') : payrollSummaryIncome.get('rate')
                });

                innerIncomes.each(innerIncome => {
                    innerIncome.set({
                        __rate : innerIncome.get('rate'),
                        __isFixedRate : innerIncome.get('isFixedRate'),

                        rate : innerIncome.get('adjustedRate') !== null ? innerIncome.get('adjustedRate') : innerIncome.get('rate')
                    });
                });
            });

            view.addIncomeListItems();

            scrollY && view.setScrollY(scrollY);
        },

        getRequestPayload : function(includeIncomes, includeDeductions, persist, calculateTaxes, splitTasks) {
            let vm = this.getViewModel(),
                payroll = this.getView().getEmployees().getAt(vm.get('currentIndex')),
                payload = {
                    payrollId : payroll.getId(),
                    persist : !!persist,
                    splitTasks : !!splitTasks,
                    calculateTaxes : calculateTaxes,
                    payrollNotes : vm.get('payrollNotes')
                },
                employeeTaxesAndDeductions = vm.getStore('employeeTaxesAndDeductions').getDataAsArray(),
                deductions = vm.getStore('deductions'),
                employerTaxes = vm.getStore('employerTaxes'),
                employeeTaxes = vm.getStore('employeeTaxes');

            if (includeIncomes) {
                payload.payrollIncomes = vm.getStore('payrollIncomes').getDataAsArray(false, true);
            }

            // deductions
            if (includeDeductions) {
                Ext.Array.each(Ext.Array.insert(employeeTaxesAndDeductions, employeeTaxesAndDeductions.length, vm.getStore('employerTaxesAndDeductions').getDataAsArray()),
                    function(data) {
                        if (!data['taxId']) { // sync deductions
                            let deduction = deductions.getAt(
                                deductions.findBy(function(rec) {
                                    return rec.get('deductionId') === data.deductionId && rec.get('isEmployee') === data.isEmployee
                                })
                            );

                            deduction && deduction.get('amount') !== data.amount && deduction.set({
                                overriddenAmount : data.amount
                            });

                            deduction && deduction.set({
                                isOverride : data.isOverride
                            });
                        }
                    }
                );

                payload.payrollDeductIns = vm.getStore('deductions').getDataAsArray();
            } else {
                payload.payrollDeductIns = [];
            }

            // taxes
            Ext.Array.each(Ext.Array.insert(employeeTaxesAndDeductions, employeeTaxesAndDeductions.length, vm.getStore('employerTaxesAndDeductions').getDataAsArray()),
                function(data) {
                    let employerTax,
                        employeeTax;

                    if (data['taxId']) {
                        employerTax = employerTaxes.getAt(
                            employerTaxes.findBy(function(rec) {
                                return rec.get('taxId') === data.taxId;
                            })
                        );
                        employeeTax = employeeTaxes.getAt(
                            employeeTaxes.findBy(function(rec) {
                                return rec.get('taxId') === data.taxId;
                            })
                        );

                        employerTax && employerTax.get('amount') !== data.amount && employerTax.set({
                            overriddenAmount : data.amount
                        });
                        employeeTax && employeeTax.get('amount') !== data.amount && employeeTax.set({
                            overriddenAmount : data.amount
                        });

                        employerTax && employerTax.set({
                            isOverride : data.isOverride
                        });
                        employeeTax && employeeTax.set({
                            isOverride : data.isOverride
                        });
                    }
                }
            );

            payload.employerTaxes = employerTaxes.getDataAsArray();
            payload.employeeTaxes = employeeTaxes.getDataAsArray();

            return payload;
        },

        recalculate : function(includeIncomes, includeDeductions, persist, calculateTaxes, splitTasks) {
            let vm = this.getViewModel(),
                view = this.getView(),
                canRecalcDeductions = true;

            if (typeof splitTasks === 'undefined') {
                splitTasks = true;
            }

            scrollY = view.getScrollY();
            view.clearIncomeListItems();

            if (vm.getStore('payrollIncomes').needSync()) {
                canRecalcDeductions = false; // income change will override any manual deductions
            }

            return criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.PAYROLL_RECALCULATE,
                method : 'POST',
                jsonData : this.getRequestPayload(
                    includeIncomes,
                    canRecalcDeductions && includeDeductions,
                    persist,
                    calculateTaxes || false,
                    splitTasks
                )
            }).then({
                scope : this,
                success : this.processResponse,
                failure : function() {
                    // restore grid of old data
                    view.addIncomeListItems();
                }
            });
        },

        handleSave : function() {
            let vm = this.getViewModel(),
                view = this.getView(),
                me = this,
                employees = vm.get('employees');

            view.setLoading(true);

            this.recalculate(true, true, true, vm.get('isCalculated')).then({
                success : function() {
                    if (employees.length === 1) {
                        me.handleCancel();
                    }
                }
            }).always(function() {
                view.setLoading(false);
            });
        },

        handleCalculateClick : function() {
            let view = this.getView();

            view.setLoading(true);

            this.recalculate(true, true, false, true).always(function() {
                view.setLoading(false);
            });
        },

        /**
         * @private
         */
        _upInnerIncome(linkRecordId, value, record, widgetColumn) {
            let vm = this.getViewModel(),
                payrollIncomes = vm.getStore('payrollIncomes'),
                incomeRec = payrollIncomes.getById(linkRecordId);

            incomeRec.set(widgetColumn.dataIndex, value);
            record.set(widgetColumn.dataIndex, value);

            if (widgetColumn.dataIndex === 'rate') {
                if (value === null && incomeRec.get('isFixedRate')) {
                    incomeRec.set('isFixedRate', false);
                    record.set('isFixedRate', false);
                    incomeRec.set(widgetColumn.dataIndex, record.get('__rate')); // restore
                } else if (value !== null) {
                    let changed = record.get('__isFixedRate') || value !== record.get('__rate');

                    incomeRec.set('isFixedRate', changed);
                    record.set('isFixedRate', changed);
                }
            }
        },

        updateRecordFromWidget : function(field) {
            let record = field.getWidgetRecord && field.getWidgetRecord(),
                widgetColumn = field.getWidgetColumn(),
                vm = this.getViewModel(),
                linkRecordId,
                value = field.getValue();

            if (record && widgetColumn && !field.hasFocus) {
                if (record.innerIncomes) {
                    linkRecordId = record.innerIncomes().getAt(0).getId();

                    if (linkRecordId) {
                        this._upInnerIncome(linkRecordId, value, record, widgetColumn);
                    }
                } else {
                    if (value === null && record.get('isOverride')) {
                        record.set('isOverride', false);
                    }
                    record.set(widgetColumn.dataIndex, value);
                }

                if (record.dirty) {
                    Ext.defer(function() {
                        vm.set('isCalculated', false);
                    }, 0, this);
                }
            }
        },

        updateRecordSubGridFromWidget : function(field) {
            let record = field.getWidgetRecord && field.getWidgetRecord(),
                widgetColumn = field.getWidgetColumn(),
                vm = this.getViewModel(),
                linkRecordId,
                value = field.getValue();

            if (record && widgetColumn && !field.hasFocus) {
                linkRecordId = record.getId();

                if (linkRecordId) {
                    this._upInnerIncome(linkRecordId, value, record, widgetColumn);
                }

                if (record.dirty) {
                    Ext.defer(function() {
                        vm.set('isCalculated', false);
                    }, 0, this);
                }
            }
        },

        updateRecordFromCustomValueWidget : function(field, innerField) {
            let record = field.getWidgetRecord && field.getWidgetRecord(),
                widgetColumn = field.getWidgetColumn(),
                vm = this.getViewModel(),
                payrollIncomes = vm.getStore('payrollIncomes'),
                linkRecordId,
                val = innerField.getValue();

            if (record && widgetColumn && !field.hasFocus) {
                linkRecordId = record.innerIncomes().getAt(0).getId();
                linkRecordId && payrollIncomes.getById(linkRecordId).set(widgetColumn.dataIndex, (val !== null ? val.toString() : val));

                if (record.dirty) {
                    Ext.defer(function() {
                        vm.set('isCalculated', false);
                    }, 0, this);
                }
            }
        },

        updateRecordSubGridFromCustomValueWidget : function(field, innerField) {
            let record = field.getWidgetRecord && field.getWidgetRecord(),
                widgetColumn = field.getWidgetColumn(),
                vm = this.getViewModel(),
                payrollIncomes = vm.getStore('payrollIncomes'),
                linkRecordId,
                val = innerField.getValue();

            if (record && widgetColumn && !field.hasFocus) {
                linkRecordId = record.getId();
                linkRecordId && payrollIncomes.getById(linkRecordId).set(widgetColumn.dataIndex, (val !== null ? val.toString() : val));

                if (record.dirty) {
                    Ext.defer(function() {
                        vm.set('isCalculated', false);
                    }, 0, this);
                }
            }
        },

        removeSummaryPayrollIncome : function(record) {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                payrollIncomes = vm.getStore('payrollIncomes');

            criterion.Msg.confirm(
                i18n.gettext('Remove Income'),
                i18n.gettext('Do you want to remove income: ') + record.get('name') + '?',
                function(btn) {
                    if (btn === 'yes') {
                        record.innerIncomes().each(function(rec) {
                            payrollIncomes.remove(payrollIncomes.getById(rec.getId()), null, null);
                        });

                        Ext.defer(function() {
                            vm.set('isCalculated', false);

                            view.setLoading(true);

                            me.recalculate(true, true, false, vm.get('isCalculated'), false).always(function() {
                                view.setLoading(false);
                            });
                        }, 0);
                    }
                }
            );
        },

        removePayrollIncome : function(record) {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                payrollIncomes = vm.getStore('payrollIncomes');

            criterion.Msg.confirm(
                i18n.gettext('Remove Income'),
                i18n.gettext('Do you want to remove income: ') + record.get('name') + '?',
                function(btn) {
                    if (btn === 'yes') {
                        payrollIncomes.remove(payrollIncomes.getById(record.getId()), null, null);

                        Ext.defer(function() {
                            vm.set('isCalculated', false);

                            view.setLoading(true);

                            me.recalculate(true, true, false, vm.get('isCalculated'), false).always(function() {
                                view.setLoading(false);
                            });
                        }, 0);
                    }
                }
            );
        },

        onPayrollIncomeColumnHide(cont, column) {
            this.lstorage.setItem(STATE + '-' + column.dataIndex, 0);
        },

        onPayrollIncomeColumnShow(cont, column) {
            this.lstorage.setItem(STATE + '-' + column.dataIndex, 1);
        }

    };
});

