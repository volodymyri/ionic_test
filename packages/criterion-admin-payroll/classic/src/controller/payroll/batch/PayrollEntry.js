Ext.define('criterion.controller.payroll.batch.PayrollEntry', function() {

     const INCOME_CALC_METHOD = criterion.Consts.INCOME_CALC_METHOD;

     let gridStore;

    function hoursFormatter(value) {
        return typeof value !== 'undefined' ? value : '&mdash;';
    }

    function unitsFormatter(value) {
        return typeof value !== 'undefined' ? value : '&mdash;';
    }

    function currencyFormatter(value) {
        return typeof value !== 'undefined' ? criterion.LocalizationManager.currencyFormatter(value) : '&mdash;'
    }

    function getIncomeAlias(income, isHours) {
        return 'income' + (income.isModel ? income.get('incomeListId') : income.incomeListId) + (isHours ? 'hours' : 'amount');
    }

    function detailToGridRecordData(detailData, batchIncomes) {
        let payroll = detailData.payroll,
            gridRecordData = {
                id : payroll.id,
                personName : detailData['personName'],
                employeeNumber : detailData['employeeNumber'],
                assignment : detailData['positionCode'],
                rate : detailData['assignmentPayRate'],
                rateFrequency : detailData['assignmentPayRateUnitCd'],
                grossIncomeTotal : payroll['grossIncomeTotal'],
                nonCashTotal : payroll['nonCashTotal'],
                employeeTaxTotal : payroll['employeeTaxTotal'],
                isCalculated : payroll['isCalculated'],
                employeeDeductionTotal : payroll['employeeDeductionTotal'],
                net : payroll['netPay'],
                employeeId : payroll['employeeId'],
                canEdit : detailData['canEdit'],
                isActive : detailData['isActive']
            },
            incomeIds = [];

        batchIncomes && batchIncomes.each(function(batchIncome) {
            incomeIds.push(batchIncome.getId());
        });

        Ext.Array.each(detailData.payrollIncomes, function(income) {
            Ext.Array.remove(incomeIds, income['incomeListId']);

            gridRecordData[getIncomeAlias(income)] = income['amount'] || 0;
            gridRecordData[getIncomeAlias(income, true)] = income['hours'] || 0;
        });

        if (incomeIds.length) {
            Ext.Array.each(incomeIds, function(incomeId) {
                // adding missing incomes for consistency
                gridRecordData[getIncomeAlias({incomeListId : incomeId})] = 0;
                gridRecordData[getIncomeAlias({incomeListId : incomeId}, true)] = 0;
            })
        }

        return gridRecordData;
    }

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_payroll_batch_payrollentry',

        requires : [
            'criterion.store.assignment.History',
            'criterion.store.employer.IncomeLists',
            'criterion.view.payroll.batch.payrollEntry.Details',
            'criterion.view.MultiRecordPickerRemote',
            'criterion.view.payroll.batch.Import',
            'criterion.view.MultiRecordPicker'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.ControlDeferredProcess'
        ],

        handleRowSelect : function(record) {
            this.lookup('details').setEnabled(!!record);
        },

        handleImportClick : function() {
            let wnd = Ext.create('criterion.view.payroll.batch.Import', {
                viewModel : {
                    data : {
                        batchId : this.getViewModel().get('batchRecord').getId()
                    }
                }
            });

            wnd.show();
            wnd.on('save', this.load, this);
        },

        handleCalculateClick : function() {
            let me = this,
                view = this.getView();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYER_PAYROLL_BATCH_RECALCULATE,
                method : 'POST',
                jsonData : {
                    batchId : me.getViewModel().get('batchRecord').getId()
                }
            })
            .then({
                scope : me,
                success : function(res) {
                    me._isBatchCalculation = true;

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
                failure : me.load
            }).always(function() {
                view.setLoading(false);
            });
        },

        processingCheckResult : function(res) {
            let errors;

            // calculations
            if (this._isBatchCalculation && res && res.errors && res.errors.length) {
                errors = Ext.Array.map(res.errors, function(error) {
                    let errorInfo = criterion.consts.Error.getErrorInfo(error);

                    return error.employeeName + ': ' + errorInfo.description;
                });

                criterion.Msg.error({
                    title : i18n.gettext('Errors in the calculation'),
                    message : errors.join('<br>')
                });
            }

            // adding employees
            if (this._isAddingEmployee && res && res.errors && res.errors.length) {
                errors = Ext.Array.map(res.errors, function(error) {
                    let errorInfo = criterion.consts.Error.getErrorInfo(error);

                    return errorInfo && Ext.String.format('<p>{0}</p>', errorInfo.description);
                });

                criterion.Msg.warning('<p>' + i18n.gettext('Some employees were not added to the batch') + '</p>' + errors.join('<br>'));
            }

            // change income lists
            if (this._isChangeIncomeLists && res && res.errors && res.errors.length) {
                errors = Ext.Array.map(res.errors, function(error) {
                    let errorInfo = criterion.consts.Error.getErrorInfo(error);

                    return errorInfo && Ext.String.format('<p>{0}</p>', errorInfo.description);
                });

                criterion.Msg.warning('<p>' + i18n.gettext('Errors in changing income lists') + '</p>' + errors.join('<br>'));
            }

            this._isBatchCalculation = null;
            this._isAddingEmployee = null;
            this._isChangeIncomeLists = null;

            this.getViewModel().get('batchRecord').set({
                isCalculationInProgress : false,
                calculationProcessId : null
            });

            this.load();
        },

        handleViewDetailsClick() {
            this.viewDetails();
        },

        viewDetails(employeesSelection) {
            let vm = this.getViewModel(),
                detailForm,
                employees = employeesSelection || this.lookup('grid').getSelection(),
                employeesData = new Ext.util.Collection();

            Ext.Array.each(employees, employee => employeesData.add(employee));

            detailForm = Ext.create('criterion.view.payroll.batch.payrollEntry.Details', {
                payrollBatchDetails : vm.getStore('payrolls'),
                payrollBatchRecord : vm.get('batchRecord'),
                employees : employeesData.length ? employeesData : gridStore.getData(),
                viewModel : {
                    data : {
                        employerId : vm.get('batchRecord.employerId'),
                        payrollSettings : vm.get('payrollSettings'),
                        batchIncomesStore : vm.get('batchIncomes'),
                        payrollBatchDetails : vm.getStore('payrolls'),
                        readOnlyMode : vm.get('readOnlyMode')
                    }
                }
            });

            detailForm.show();
            detailForm.on('close', this.load, this);
        },

        onShow : Ext.emptyFn,

        load : function() {
            let me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                grid = this.lookup('grid'),
                batchId = vm.get('batchRecord').getId();

            view.setLoading(true);
            vm.set('isCalculated', false);

            grid.getSelectionModel().deselectAll();

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYER_PAYROLL_BATCH_DETAIL + '/' + batchId,
                method : 'GET'
            }).then(function(details) {
                let payrolls = vm.getStore('payrolls'),
                    batchIncomes = vm.getStore('batchIncomes');

                payrolls.loadData(details['payrolls']);

                batchIncomes.loadData(details['batchIncomes']);

                me.handleStoreChanged(payrolls);

                me.configureGridStore();

                me.lookup('pagingToolbar').resetPageSize();

                if (vm.get('batchRecord.isCalculationInProgress')) {
                    me.checkCalculationProcess(vm.get('batchRecord.calculationProcessId'));
                }

            }).always(function() {
                view.setLoading(false);
            });
        },

        checkCalculationProcess : function(calculationProcessId) {
            this._isBatchCalculation = true;
            this.controlDeferredProcess(
                i18n.gettext('Calculation'),
                i18n.gettext('Calculation in progress'),
                calculationProcessId
            );
        },

        configureGridStore : function() {
            let vm = this.getViewModel(),
                view = this.getView(),
                gridStoreFields = ['id', 'personName', 'employeeNumber', 'assignment', 'employeeId', 'canEdit',
                    {name : 'rate', type : 'number'}, {name : 'totalIncome', type : 'number'},
                    {name : 'totalDeduction', type : 'number'}, {name : 'net', type : 'number'},
                    {name : 'isActive', type : 'boolean'}
                ],
                showExtraColumns = this.getViewModel().get('showExtraColumns'),
                isCalculated = true,
                incomeFields = [],
                incomeColumns = [],
                batchIncomes = this.getStore('batchIncomes'),
                data = [];

            showExtraColumns && batchIncomes.each(function(batchIncome) {
                let incomeList = batchIncome.getData();

                incomeList.incomeListId = incomeList.id; // compatibility

                let incomeColumn = {
                    xtype : 'widgetcolumn',
                    text : incomeList['name'],
                    sortable : false,
                    menuDisabled : true,
                    summaryType : 'sum',
                    summaryRenderer : criterion.LocalizationManager.currencyFormatter,
                    align : 'right',
                    widget : {
                        xtype : 'criterion_currencyfield',
                        isRatePrecision : true,
                        fieldStyle : {
                            'text-align' : 'right'
                        },
                        listeners : {
                            blur : 'updateRecordFromWidget'
                        }
                    },
                    onWidgetAttach : function(col, widget, record) {
                        let readOnlyMode = widget.up('criterion_payroll_batch_payrollentry').getViewModel().get('readOnlyMode');

                        widget.setDisabled(readOnlyMode || !record.get('canEdit'));
                    }
                };

                switch (incomeList['method']) {
                    case INCOME_CALC_METHOD.AMOUNT:
                        incomeColumn.dataIndex = getIncomeAlias(incomeList);
                        incomeColumn.widget.dataIndex = getIncomeAlias(incomeList);
                        incomeColumn.summaryRenderer = currencyFormatter;
                        break;
                    case INCOME_CALC_METHOD.HOURLY:
                        incomeColumn.dataIndex = getIncomeAlias(incomeList, true);
                        incomeColumn.widget.dataIndex = getIncomeAlias(incomeList, true);
                        incomeColumn.summaryRenderer = hoursFormatter;
                        incomeColumn.text = incomeList['name'] + ' (hrs.)';
                        incomeColumn.widget.xtype = 'numberfield';
                        break;
                    case INCOME_CALC_METHOD.UNIT:
                        incomeColumn.dataIndex = getIncomeAlias(incomeList, true);
                        incomeColumn.widget.dataIndex = getIncomeAlias(incomeList, true);
                        incomeColumn.summaryRenderer = unitsFormatter;
                        incomeColumn.text = incomeList['name'] + ' (units)';
                        incomeColumn.widget.xtype = 'numberfield';
                        break;
                    case INCOME_CALC_METHOD.SALARY:
                        incomeColumn.xtype = 'criterion_currencycolumn';
                        incomeColumn.dataIndex = getIncomeAlias(incomeList);
                        incomeColumn.widget = null;
                        break;
                    case INCOME_CALC_METHOD.FTE:
                        incomeColumn.dataIndex = getIncomeAlias(incomeList, true);
                        incomeColumn.widget.dataIndex = getIncomeAlias(incomeList, true);
                        incomeColumn.summaryRenderer = unitsFormatter;
                        incomeColumn.text = incomeList['name'] + ' (FTE)';
                        incomeColumn.widget.xtype = 'numberfield';
                        break;
                }

                incomeFields.push(getIncomeAlias(incomeList, true));
                incomeFields.push(getIncomeAlias(incomeList));
                incomeColumns.push(incomeColumn);
            });

            this.getStore('payrolls').each(function(detail) {
                let detailData = detail.getData({associated : true});

                isCalculated = isCalculated && detailData.payroll['isCalculated'];
                data.push(detailToGridRecordData(detailData, batchIncomes));
            });

            gridStore = Ext.create('Ext.data.Store', {
                fields : [].concat(gridStoreFields, incomeFields),
                data : data,
                remoteSort : true,
                proxy : {
                    type : 'memory',
                    enablePaging : true,
                    reader : {
                        totalProperty : 'count'
                    }
                }
            });

            vm.set('isCalculated', isCalculated);
            view.constructGrid(gridStore, incomeColumns);
            this.calculateSummary(view.getColumnsCfg(gridStore, incomeColumns), data);
            Ext.defer(() => {
                gridStore.setSorters({
                    property : 'employeeNumber',
                    direction : 'ASC',
                    transform : value => parseInt(value, 10) || Number.MAX_VALUE
                });
                gridStore.sort();
            }, 100)
        },

        _summaryData : null,

        calculateSummary : function(columns, data) {
            let summaryData = [],
                clCfg = {};

            Ext.each(columns, function(column) {
                if (column.summaryType === 'sum') {
                    clCfg[column.dataIndex] = {
                        value : 0,
                        name : column.text,
                        renderer : column.summaryRenderer
                    }
                }
            });

            Ext.each(data, function(dat) {
                Ext.Object.each(dat, function(key, val) {
                    if (clCfg[key]) {
                        clCfg[key]['value'] += val;
                    }
                })
            });

            summaryData.push({
                name : i18n.gettext('Employee count'),
                value : data.length
            });
            Ext.Object.each(clCfg, function(key, vals) {
                summaryData.push({
                    name : vals.name,
                    value : vals.renderer ? vals.renderer(vals.value) : vals.value
                });
            });

            this._summaryData = summaryData;
        },

        handleSelectEmployees : function() {
            let selectEmployeesWindow,
                employees = Ext.create('criterion.store.employer.payrollBatch.AvailableEmployees'),
                batchRecord = this.getViewModel().get('batchRecord'),
                batchId = batchRecord.getId(),
                employerId = batchRecord.get('employerId');

            selectEmployeesWindow = Ext.create('criterion.view.MultiRecordPickerRemote', {
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Employees'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Last Name'),
                                dataIndex : 'lastName',
                                flex : 1,
                                filter : 'string',
                                defaultSearch : true
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('First Name'),
                                dataIndex : 'firstName',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Employee Number'),
                                dataIndex : 'employeeNumber',
                                flex : 1,
                                excludeFromFilters : true
                            },
                            {
                                xtype : 'booleancolumn',
                                text : i18n.gettext('Status'),
                                dataIndex : 'isActive',
                                trueText : i18n.gettext('Active'),
                                falseText : i18n.gettext('Inactive'),
                                width : 150,
                                excludeFromFilters : true
                            }
                        ],
                        additionalFilters : [
                            {
                                xtype : 'container',
                                width : '100%',
                                layout : {
                                    type : 'hbox',
                                    align : 'stretch'
                                },
                                items : [
                                    {
                                        xtype : 'component',
                                        flex : 1
                                    },
                                    {
                                        xtype : 'toggleslidefield',
                                        fieldLabel : i18n.gettext('Show Inactive'),
                                        value : false,
                                        name : 'isActive',
                                        filterType : criterion.controller.MultiRecordPickerRemote.FILTER_TYPE_BOOLEAN_REVERSED,
                                        listeners : {
                                            change : 'additionalFilterHandler'
                                        }
                                    }
                                ]
                            }
                        ],
                        storeParams : {
                            batchId : batchId,
                            employerId : employerId,
                            isActive : true
                        },
                        excludedIds : Ext.Array.map(gridStore.getRange(), function(item) {
                            return item.get('employeeId');
                        })
                    },
                    stores : {
                        inputStore : employees
                    }
                }
            });

            selectEmployeesWindow.show();
            selectEmployeesWindow.on('selectRecords', this.selectEmployees, this);
        },

        selectEmployees : function(employees) {
            let me = this,
                view = this.getView(),
                ids = [];

            view.setLoading(true);

            Ext.Array.each(employees, function(employee) {
                ids.push(employee.get('id'));
            });

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYER_PAYROLL_BATCH_ADD_EMPLOYEE,
                method : 'POST',
                jsonData : {
                    batchId : me.getViewModel().get('batchRecord').getId(),
                    employeeIds : ids
                }
            })
            .then({
                scope : me,
                success : function(res) {
                    me._isAddingEmployee = true;

                    if (me.isDelayedResponse(res)) {
                        me.controlDeferredProcess(
                            i18n.gettext('Add Employees'),
                            i18n.gettext('Adding in progress'),
                            res.processId
                        );
                    } else {
                        me.processingCheckResult(res);
                    }
                },
                failure : me.load
            }).always(function() {
                view.setLoading(false);
            });

        },

        handleIncomeManage : function() {
            let me = this,
                payrolls = this.getStore('payrolls'),
                payrollBatchIncomeLists = this.getStore('payrollBatchIncomeLists'),
                incomeSelector,
                val = [],
                vm = this.getViewModel();

            if (!payrolls.count()) {
                criterion.Msg.warning({
                    title : i18n.gettext('Cannot add Income'),
                    message : i18n.gettext('Add at least one Employee first.')
                });
            } else {

                payrollBatchIncomeLists.loadWithPromise({
                    params : {
                        batchId : me.getViewModel().get('batchRecord').getId()
                    }
                }).then(function() {

                    payrollBatchIncomeLists.each(income => {
                        val.push(income.get('incomeListId'));
                    });

                    incomeSelector = Ext.create('criterion.view.MultiRecordPicker', {
                        viewModel : {
                            data : {
                                title : i18n.gettext('Select Incomes'),
                                gridColumns : [
                                    {
                                        xtype : 'gridcolumn',
                                        text : i18n.gettext('Code'),
                                        dataIndex : 'code',
                                        flex : 1,
                                        filter : 'string'
                                    },
                                    {
                                        xtype : 'gridcolumn',
                                        text : i18n.gettext('Name'),
                                        dataIndex : 'description',
                                        flex : 1,
                                        filter : 'string'
                                    },
                                    {
                                        xtype : 'numbercolumn',
                                        renderer : function(value, metaData, record) {
                                            let incomeCalcMethodCode = record && record.get('incomeCalcMethodCode');

                                            return incomeCalcMethodCode !== criterion.Consts.INCOME_CALC_METHOD.FORMULA ? criterion.LocalizationManager.currencyFormatter(value) : Ext.util.Format.percent(value, '0.##');
                                        },
                                        text : i18n.gettext('Rate'),
                                        dataIndex : 'rate',
                                        flex : 1,
                                        filter : 'string'
                                    }
                                ],
                                storeParams : {
                                    employerId : vm.get('batchRecord.employerId'),
                                    isActive : true
                                },
                                selectedRecords : val
                            },
                            stores : {
                                inputStore : Ext.create('criterion.store.employer.IncomeLists', {
                                    autoSync : false
                                })
                            }
                        },
                        allowEmptySelect : true
                    });

                    incomeSelector.on('selectRecords', me.selectIncomes, me);
                    incomeSelector.on('close', function() {
                        me.setCorrectMaskZIndex(false);
                    });

                    incomeSelector.show();

                    me.setCorrectMaskZIndex(true);
                })

            }
        },

        selectIncomes : function(selectedRecords) {
            let updatedIncomeLists = Ext.create('criterion.store.employer.IncomeLists', {
                autoSync : false
            });

            updatedIncomeLists.loadRecords(selectedRecords, null);
            this.updateIncomes(updatedIncomeLists);
        },

        updateIncomes : function(updatedIncomeLists) {
            let me = this,
                payrollIncomes = this.getStore('payrollBatchIncomeLists'),
                batchId = this.getViewModel().get('batchRecord').getId(),
                view = this.getView(),
                toAdd = [],
                toRemove = [];

            if (payrollIncomes) {
                payrollIncomes.each(function(existingIncome) {
                    let incomeListId = existingIncome.get('incomeListId');

                    if (!updatedIncomeLists.getById(incomeListId)) {
                        toRemove.push(incomeListId);
                    }
                }, this)
            }

            if (updatedIncomeLists.count()) {
                updatedIncomeLists.each(function(updatedIncomeList) {
                    let incomeListId = updatedIncomeList.getId();

                    if (!payrollIncomes || !payrollIncomes.findRecord('incomeListId', incomeListId, 0, false, false, true)) {
                        toAdd.push(incomeListId);
                    }
                }, this)
            }

            if (!toAdd.length && !toRemove.length) {
                return;
            }

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYER_PAYROLL_BATCH_CHANGE_INCOME_LISTS,
                method : 'POST',
                jsonData : {
                    batchId : batchId,
                    toAdd : toAdd,
                    toRemove : toRemove
                }
            }).then({
                scope : me,
                success : function(res) {
                    me._isChangeIncomeLists = true;

                    if (me.isDelayedResponse(res)) {
                        me.controlDeferredProcess(
                            i18n.gettext('Change income list'),
                            i18n.gettext('Changing in progress'),
                            res.processId
                        );
                    } else {
                        me.processingCheckResult(res);
                    }
                },
                failure : me.load
            }).always(function() {
                view.setLoading(false);
            });
        },

        handleNextClick : function() {
            this.getView().fireEvent('detailsSaved', this.getViewModel().get('batchRecord'));
        },

        updateRecordFromWidget : function(field) {
            let record = field.getWidgetRecord && field.getWidgetRecord();

            if (record && !field.hasFocus) {
                record.set(field.dataIndex, field.getValue());

                if (record.dirty) {
                    Ext.defer(function() {
                        this.afterEdit(record);
                    }, 1, this);
                }
            }
        },

        afterEdit : function(record) {
            let me = this,
                vm = this.getViewModel(),
                payload = {
                    payrollId : record.getId(),
                    calculateTaxes : false,
                    payrollDeductIns : [],
                    persist : true,
                    splitTasks : false
                },
                batchIncomes = this.getStore('batchIncomes'),
                recId = record.getId(),
                payroll;

            let payrolls = this.getStore('payrolls');

            payroll = payrolls.getAt(payrolls.findBy(function(p) {
                return p.get('payroll')['id'] === recId
            }, this));

            Ext.Array.each(payroll.get('payrollIncomes'), function(income) {
                switch (me.getStore('batchIncomes').getById(income.incomeListId).get('method')) {
                    case INCOME_CALC_METHOD.AMOUNT:
                        income.amount = record.get(getIncomeAlias(income));
                        break;

                    case INCOME_CALC_METHOD.HOURLY:
                        income.hours = record.get(getIncomeAlias(income, true));
                        break;

                    case INCOME_CALC_METHOD.SALARY:
                        income.amount = record.get(getIncomeAlias(income));
                        break;

                    case INCOME_CALC_METHOD.UNIT:
                        income.hours = record.get(getIncomeAlias(income, true));
                        break;

                    case INCOME_CALC_METHOD.FTE:
                        income.hours = record.get(getIncomeAlias(income, true));
                        break;
                }
            });

            payload.payrollIncomes = payroll.get('payrollIncomes');

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.PAYROLL_RECALCULATE,
                method : 'POST',
                jsonData : payload,
                persist : true
            }).then({
                scope : this,
                success : function(response) {
                    let gridRecordData = detailToGridRecordData(response, batchIncomes);

                    criterion.Utils.filterObject(gridRecordData, function(key, value) {
                        return typeof value !== 'undefined'
                    });

                    if (!gridRecordData['isCalculated']) {
                        vm.set('isCalculated', false);
                    }

                    record.set(gridRecordData);
                }
            })
        },

        remove : function(record) {
            let me = this,
                vm = this.getViewModel();

            criterion.Msg.confirm(
                i18n.gettext('Remove Employee'),
                Ext.util.Format.format(i18n.gettext('Do you want to remove {0} from batch?'), record.get('personName')),
                btn => {
                    if (btn === 'yes') {
                        criterion.Api.requestWithPromise({
                            url : criterion.consts.Api.API.EMPLOYER_PAYROLL_BATCH_REMOVE_EMPLOYEE,
                            method : 'POST',
                            jsonData : {
                                batchId : vm.get('batchRecord').getId(),
                                employeeId : record.get('employeeId')
                            }
                        }).then(() => {
                            me.load();
                        })
                    }
                });
        },

        handlePrevClick : function() {
            this.getView().fireEvent('showBatchDetails', this.getViewModel().get('batchRecord').getId());
        },

        handleStoreChanged : function(store) {
            this.getView().fireEvent('batchDetailStoreChange', store);
        },

        init : function() {
            this.handleStoreChanged = Ext.Function.createBuffered(this.handleStoreChanged, 100, this);

            this.callParent(arguments);
        },

        onToggleExtraColumns : function() {
            let vm = this.getViewModel();

            vm.set('showExtraColumns', !vm.get('showExtraColumns'));

            this.load();
        },

        handleShowSummary : function() {
            let summaryWnd;

            summaryWnd = Ext.create('criterion.ux.form.Panel', {
                title : i18n.gettext('Summary'),
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : '70%',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
                    }
                ],
                layout : 'fit',
                bodyPadding : 0,
                items : [
                    {
                        xtype : 'criterion_gridpanel',
                        tbar : null,
                        store : Ext.create('Ext.data.Store', {
                            fields : ['name', 'value'],
                            data : this._summaryData || []
                        }),
                        columns : [
                            {
                                xtype : 'gridcolumn',
                                flex : 1,
                                text : '',
                                dataIndex : 'name'
                            },
                            {
                                xtype : 'gridcolumn',
                                flex : 1,
                                text : '',
                                align : 'right',
                                dataIndex : 'value'
                            }
                        ]
                    }
                ],
                buttons : [
                    '->',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Close'),
                        cls : 'criterion-btn-light',
                        listeners : {
                            click : function() {
                                summaryWnd.destroy();
                            }
                        }
                    }
                ]
            });
            summaryWnd.show();
        },

        onSelectionDetails(cbm, selection) {
            this.getViewModel().set('countSelectionDetail', selection.length);
        },

        handleViewDetail(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
            let cbModelClick = (grid.getSelectionModel() && grid.getSelectionModel().type === 'checkboxmodel' && cellIndex === 0),
                isExpanderClick = !!e.getTarget('.' + Ext.baseCSSPrefix + 'grid-row-expander'),
                preventEdit = (e.position && e.position.column && (
                    e.position.column.xtype === 'criterion_actioncolumn' ||
                    e.position.column.xtype === 'widgetcolumn' ||
                    e.position.column.xtype === 'criterion_widgetcolumn' || !!e.position.column.preventEdit || isExpanderClick
                ));

            if (!preventEdit && !cbModelClick) {
                this.viewDetails([record]);

                return false;
            } else {
                return true;
            }
        }
    };
});
