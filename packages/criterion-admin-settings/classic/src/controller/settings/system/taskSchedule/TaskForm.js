Ext.define('criterion.controller.settings.system.taskSchedule.TaskForm', function() {

    let currentReportOptions;

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_task_schedule_task_form',

        requires : [
            'criterion.store.search.Employees',
            'criterion.view.MultiRecordPickerRemoteAlt',
            'criterion.view.MultiRecordPicker',
            'criterion.view.RecordPicker',
            'criterion.store.Reports',
            'criterion.store.Transfers',
            'criterion.model.reports.Options',
            'criterion.model.reports.AvailableOptions',
            'criterion.view.reports.ReportOptions',
            'criterion.store.employer.TimeOffPlans',
            'criterion.store.employer.BenefitPlans',
            'criterion.view.reports.DataTransferOptions'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleShow : function() {
            let vm = this.getViewModel(),
                reportId = vm.get('record.reportId'),
                reportOptionsRecord = Ext.create('criterion.model.reports.Options', {id : reportId}),
                optionsAvailRecord = Ext.create('criterion.model.reports.AvailableOptions', {id : reportId}),
                reportStoredOptions = vm.get('record.options') || '';

            criterion.CodeDataManager.getStore(criterion.consts.Dict.ORG_STRUCTURE).cloneToStore(vm.getStore('orgStructure'));

            if (reportId) {
                currentReportOptions = reportStoredOptions === '' ? null : JSON.parse(reportStoredOptions);

                reportOptionsRecord.getProxy().setUrl(criterion.consts.Api.API.REPORT_OPTIONS);
                optionsAvailRecord.getProxy().setUrl(criterion.consts.Api.API.REPORT_AVAILABLE_OPTIONS);

                Ext.promise.Promise.all([
                    reportOptionsRecord.loadWithPromise(),
                    optionsAvailRecord.loadWithPromise()
                ]).then(function() {
                    vm.set({
                        reportOptionsRecord : reportOptionsRecord,
                        availOptionsRecord : optionsAvailRecord,
                        reportOptionsLoaded : true,
                        activeReportId : reportId,
                        activeReportName : vm.get('record.reportName')
                    });
                });
            }
        },

        handleReportSearch : function() {
            let me = this,
                vm = me.getViewModel();

            let picker = Ext.create('criterion.view.RecordPicker', {
                title : i18n.gettext('Select Report'),
                searchFields : [
                    {
                        fieldName : 'name', displayName : i18n.gettext('Name')
                    }
                ],
                columns : [
                    {
                        text : i18n.gettext('Name'),
                        dataIndex : 'name',
                        flex : 1
                    }
                ],
                store : Ext.create('criterion.store.Reports'),
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT
                    }
                ],
                cls : 'criterion-modal'
            });

            picker.on('select', function(record) {
                let activeReportId = vm.get('activeReportId'),
                    reportId = record.getId(),
                    reportName = record.get('name'),
                    reportOptionsRecord = Ext.create('criterion.model.reports.Options', {id : reportId}),
                    optionsAvailRecord = Ext.create('criterion.model.reports.AvailableOptions', {id : reportId});

                reportOptionsRecord.getProxy().setUrl(criterion.consts.Api.API.REPORT_OPTIONS);
                optionsAvailRecord.getProxy().setUrl(criterion.consts.Api.API.REPORT_AVAILABLE_OPTIONS);

                vm.set('reportOptionsLoaded', false);

                Ext.promise.Promise.all([
                    reportOptionsRecord.loadWithPromise(),
                    optionsAvailRecord.loadWithPromise()
                ]).then(function() {
                    reportOptionsRecord.set('isExternalLoaded', true);

                    let options = reportOptionsRecord.getData();

                    if (activeReportId && activeReportId !== reportId || !activeReportId) {
                        currentReportOptions = Ext.clone(options);
                    }

                    vm.set({
                        reportOptionsRecord : reportOptionsRecord,
                        availOptionsRecord : optionsAvailRecord,
                        reportOptionsLoaded : true,
                        activeReportId : reportId,
                        activeReportName : reportName
                    });

                    vm.get('record').set('options', JSON.stringify(options));

                    if (options.showOnLaunch) {
                        me.createOptionsWindow(true);
                    }
                });

                vm.get('record').set({
                    reportId : reportId,
                    reportName : reportName
                });
            });

            picker.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });

            picker.show();
            this.setCorrectMaskZIndex(true);
        },

        createOptionsWindow : function(firstTimeRun) {
            let me = this,
                vm = this.getViewModel(),
                activeReportId = vm.get('activeReportId'),
                activeReportName = vm.get('activeReportName'),
                optionsWindow;

            vm.set('blockedState', true);

            optionsWindow = Ext.create('criterion.view.reports.ReportOptions', {
                y : 50,
                title : activeReportName,
                viewModel : {
                    data : {
                        reportId : activeReportId,
                        isMemorized : false,
                        currentOptions : currentReportOptions,
                        optionsRecord : vm.get('reportOptionsRecord'),
                        availOptionsRecord : vm.get('availOptionsRecord'),
                        reportPeriod : currentReportOptions && currentReportOptions.reportPeriod || 'payDate',
                        payDateValue : currentReportOptions && currentReportOptions.payDateValue || null,
                        firstTimeRun : Ext.isDefined(firstTimeRun) ? firstTimeRun : false,
                        showFormats : true
                    }
                },
                parentView : this.getView(),
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : '90%'
                    }
                ],
                cls : 'criterion-modal'
            });

            optionsWindow.getController().load(true);

            optionsWindow.on('show', function() {
                me.setCorrectMaskZIndex(true);
            });

            optionsWindow.on('saved', function(options) {
                options.isExternalLoaded = true;
                currentReportOptions = Ext.clone(options);
                vm.set('reportOptionsRecord', Ext.create('criterion.model.reports.Options', Ext.clone(options)));
                vm.get('record').set('options', JSON.stringify(currentReportOptions));
            });

            optionsWindow.on('destroy', function() {
                vm.set('blockedState', false);
                me.setCorrectMaskZIndex(false);
            });
        },

        handleOpenReportOptions : function() {
            this.createOptionsWindow();
        },

        handleTransferSearch : function() {
            let me = this,
                vm = me.getViewModel();

            let picker = Ext.create('criterion.view.RecordPicker', {
                title : i18n.gettext('Select Transfer'),
                searchFields : [
                    {
                        fieldName : 'name', displayName : i18n.gettext('Name')
                    }
                ],
                columns : [
                    {
                        text : i18n.gettext('Name'),
                        dataIndex : 'name',
                        flex : 1
                    }
                ],
                store : Ext.create('criterion.store.Transfers'),
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT
                    }
                ],
                cls : 'criterion-modal'
            });

            picker.on('select', function(record) {
                vm.get('record').set({
                    transferId : record.getId(),
                    transferName : record.get('name')
                });
            });
            picker.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });

            picker.show();
            this.setCorrectMaskZIndex(true);
        },

        handleEmployeeSearch : function() {
            let me = this,
                vm = this.getViewModel(),
                employees = Ext.create('criterion.store.search.Employees', {
                    pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
                }),
                employeeIds = Ext.Array.clean((vm.get('record.employeeList') || '').split(';')) || [],
                employeeNames = (vm.get('record.employeeListNames') || '').split(','),
                selectEmployeesWindow,
                selectedEmployees = Ext.create('criterion.store.search.Employees'),
                employeeListData = vm.get('record.employeeListData'),
                searchData = vm.getStore('searchData'),
                hasSearchData;

            searchData.loadData([]);

            if (employeeListData) {
                searchData.loadData(employeeListData);

                hasSearchData = !!searchData.count();
            }

            Ext.Array.each(employeeIds, function(employeeId, index) {
                let employeeNameData,
                    rec = searchData.findRecord('employeeId', employeeId, 0, false, false, true);

                if (hasSearchData && rec) {
                    selectedEmployees.add(
                        Ext.clone(rec.getData())
                    );
                } else {
                    employeeNameData = Ext.String.trim(employeeNames[index]).split(' ');
                    selectedEmployees.add({
                        id : employeeId,
                        firstName : employeeNameData[0],
                        lastName : employeeNameData[1],
                        middleName : '-',
                        positionTitle : '-',
                        employerName : '-'
                    });
                }
            });

            selectEmployeesWindow = Ext.create('criterion.view.MultiRecordPickerRemoteAlt', {
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
                                text : i18n.gettext('Middle Name'),
                                dataIndex : 'middleName',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Employer'),
                                dataIndex : 'employerName',
                                flex : 1,
                                excludeFromFilters : true
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Title'),
                                dataIndex : 'positionTitle',
                                flex : 1,
                                excludeFromFilters : true
                            }
                        ],
                        storeParams : {
                            employerId : vm.get('employerId')
                        },
                        excludedIds : []
                    },
                    stores : {
                        inputStore : employees,
                        selectedStore : selectedEmployees
                    }
                },
                allowEmptySelect : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : '85%',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ],
                cls : 'criterion-modal'
            });

            selectEmployeesWindow.show();
            this.setCorrectMaskZIndex(true);

            selectEmployeesWindow.on('selectRecords', function(records) {
                let newEmployeeIds = [],
                    newEmployeeNames = [],
                    newData = [];

                Ext.Array.each(records, function(rec) {
                    let empIds = rec.getId().split('-'),
                        employeeId = empIds.length === 1 ? empIds[0] : empIds[1];

                    newEmployeeIds.push(employeeId);
                    newEmployeeNames.push(rec.get('firstName') + ' ' + rec.get('lastName'));

                    newData.push({
                        id : rec.get('personId') + '-' + employeeId,
                        employeeId : parseInt(employeeId, 10),
                        personId : rec.get('personId'),
                        firstName : rec.get('firstName'),
                        lastName : rec.get('lastName'),
                        middleName : rec.get('middleName'),
                        positionTitle : rec.get('positionTitle'),
                        employerId : rec.get('employerId'),
                        employerName : rec.get('employerName')
                    });
                });

                vm.get('record').set({
                    employeeList : newEmployeeIds.join(';'),
                    employeeListNames : newEmployeeNames.join(', '),
                    employeeListData : newData
                })
            });

            selectEmployeesWindow.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });
        },

        handleAppSearch : function() {
            let me = this,
                vm = me.getViewModel();

            let picker = Ext.create('criterion.view.RecordPicker', {
                title : i18n.gettext('Select App'),
                searchFields : [
                    {
                        fieldName : 'name', displayName : i18n.gettext('Name')
                    },
                    {
                        fieldName : 'vendor', displayName : i18n.gettext('Vendor')
                    }
                ],
                columns : [
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Name'),
                        flex : 2,
                        dataIndex : 'name'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Vendor'),
                        flex : 2,
                        dataIndex : 'vendor'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Version'),
                        flex : 1,
                        dataIndex : 'version'
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Endpoint'),
                        flex : 2,
                        dataIndex : 'endpoint'
                    }
                ],
                store : Ext.create('criterion.store.Apps', {
                    proxy : {
                        extraParams : {
                            invocationType : criterion.Consts.APP_INVOCATION_TYPES.SCHEDULER
                        }
                    }
                }),
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT
                    }
                ],
                cls : 'criterion-modal'
            });

            picker.on('select', function(record) {
                vm.get('record').set({
                    appId : record.getId(),
                    appName : record.get('name')
                });
            });
            picker.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });

            picker.show();
            this.setCorrectMaskZIndex(true);
        },

        handleChangeTaskType : function(cmp, value, oldValue) {
            let vm = this.getViewModel();

            if (oldValue) {
                vm.get('record').set({
                    recipientType : null,
                    employeeGroupList : null,
                    employeeListNames : null,
                    emailList : null,
                    options : null,
                    externalSystemId : null
                });
            }
        },

        handleOpenTransferOptions : function() {
            let me = this,
                vm = this.getViewModel(),
                transferId = vm.get('record.transferId'),
                optionValues = vm.get('record.options') || '',
                currentOptionValues = optionValues === '' ? null : JSON.parse(optionValues),
                optionsWindow;

            optionsWindow = Ext.create('criterion.view.reports.DataTransferOptions', {
                title : i18n.gettext('Transfer Options'),

                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : 500,
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ],

                scrollable : 'vertical',
                alwaysOnTop : true,

                buttons : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Close'),
                        cls : 'criterion-btn-light',
                        handler : function() {
                            optionsWindow.close();
                            me.setCorrectMaskZIndex(false);
                        }
                    },
                    ' ',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Set'),
                        handler : function(cmp) {
                            optionsWindow.fireEvent('optionsSet');
                            optionsWindow.close();
                            me.setCorrectMaskZIndex(false);
                        }
                    }
                ]
            });

            optionsWindow.on('optionsSet', function() {
                let reportParams = optionsWindow.getReportParams(),
                    formItems = optionsWindow.getFormItems(),
                    options = [];

                Ext.Array.each(reportParams, function(parameter) {
                    options.push({
                        name : parameter.get('name'),
                        value : parameter.get('value')
                    });
                });

                Ext.Array.each(formItems, function(item) {
                    options.push({
                        name : item.name,
                        value : item.getValue()
                    })
                });

                vm.get('record').set('options', JSON.stringify(options));
            });

            optionsWindow.show();
            optionsWindow.loadTransferOptions(transferId, currentOptionValues);

            me.setCorrectMaskZIndex(true);
        },

        handleOpenSystemTaskOptions : function() {
            let vm = this.getViewModel(),
                options = vm.get('record.options') || '',
                currentSystemTaskOptions = options === '' ? null : JSON.parse(options),
                systemTaskCode = vm.get('record.systemTaskCode');

            if (systemTaskCode === criterion.Consts.SYSTEM_LEVEL_TASKS.TIME_OFF_PLAN_ACCRUALS) {
                this.timeOffPlansOptions(currentSystemTaskOptions)
            }

            switch (systemTaskCode) {
                case criterion.Consts.SYSTEM_LEVEL_TASKS.TIME_OFF_PLAN_ACCRUALS:
                    this.timeOffPlansOptions(currentSystemTaskOptions);
                    break;

                case criterion.Consts.SYSTEM_LEVEL_TASKS.BENEFIT_PLAN_CALCULATION:
                    this.benefitPlansOptions(currentSystemTaskOptions);
                    break;
            }
        },

        timeOffPlansOptions(currentSystemTaskOptions) {
            let me = this,
                vm = this.getViewModel(),
                timeOffPlans = Ext.create('criterion.store.employer.TimeOffPlans'),
                pickerWnd,
                selectedTimeOffPlanIds = [];

            Ext.Array.each(currentSystemTaskOptions || [], timeOffPlanId => {
                selectedTimeOffPlanIds.push(timeOffPlanId)
            });

            pickerWnd = Ext.create('criterion.view.MultiRecordPicker', {
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Time Off Plans'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Code'),
                                dataIndex : 'code',
                                flex : 1,
                                filter : 'string',
                                defaultSearch : true
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Name'),
                                dataIndex : 'name',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                xtype : 'criterion_codedatacolumn',
                                flex : 1,
                                text : i18n.gettext('Accrual Method'),
                                dataIndex : 'accrualMethodTypeCd',
                                codeDataId : criterion.consts.Dict.ACCRUAL_METHOD_TYPE,
                                excludeFromFilters : true
                            },
                            {
                                xtype : 'gridcolumn',
                                width : 120,
                                text : i18n.gettext('Year End'),
                                dataIndex : 'yearEndYear',
                                filter : 'string'
                            }
                        ],
                        storeParams : {
                            isActive : true,
                            employerId : vm.get('employerId'),
                            isAccrual : true
                        },
                        selectedRecords : selectedTimeOffPlanIds,
                        excludedIds : []
                    },
                    stores : {
                        inputStore : timeOffPlans
                    }
                },
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : '85%',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ],
                cls : 'criterion-modal'
            });

            pickerWnd.show();

            this.setCorrectMaskZIndex(true);

            pickerWnd.on('selectRecords', function(records) {
                let resultArray = [];

                Ext.Array.each(records, record => {
                    resultArray.push(record.getId());
                });

                vm.get('record').set('options', JSON.stringify(resultArray));
            });

            pickerWnd.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });
        },

        benefitPlansOptions(currentSystemTaskOptions) {
            let me = this,
                vm = this.getViewModel(),
                benefitPlans = Ext.create('criterion.store.employer.BenefitPlans'),
                pickerWnd,
                selectedPlanIds = [];

            Ext.Array.each(currentSystemTaskOptions || [], timeOffPlanId => {
                selectedPlanIds.push(timeOffPlanId)
            });

            pickerWnd = Ext.create('criterion.view.MultiRecordPicker', {
                viewModel : {
                    data : {
                        title : i18n.gettext('Select Benefit Plans'),
                        gridColumns : [
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Code'),
                                dataIndex : 'code',
                                flex : 1,
                                filter : 'string',
                                defaultSearch : true
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Name'),
                                dataIndex : 'name',
                                flex : 1,
                                filter : 'string'
                            },
                            {
                                xtype : 'gridcolumn',
                                text : i18n.gettext('Carrier Name'),
                                dataIndex : 'carrierName',
                                flex : 1,
                                excludeFromFilters : true
                            }
                        ],
                        storeParams : {
                            isActive : true,
                            employerId : vm.get('employerId')
                        },
                        selectedRecords : selectedPlanIds,
                        excludedIds : []
                    },
                    stores : {
                        inputStore : benefitPlans
                    }
                },
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : '85%',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ],
                cls : 'criterion-modal'
            });

            pickerWnd.show();

            this.setCorrectMaskZIndex(true);

            pickerWnd.on('selectRecords', function(records) {
                let resultArray = [];

                Ext.Array.each(records, record => {
                    resultArray.push(record.getId());
                });

                vm.get('record').set('options', JSON.stringify(resultArray));
            });

            pickerWnd.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });
        },

        updateRecord(record) {
            let view = this.getView();

            view.updateRecord(record);
            record.$relatedPhantom = true;
            view.close();
        }

    };

});
