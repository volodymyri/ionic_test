Ext.define('criterion.controller.employee.timesheet.Dashboard', function() {

    const TEAM_TIMESHEET_VIEW_TYPE = criterion.Consts.TEAM_TIMESHEET_VIEW_TYPE,
        TEAM_TIMESHEET_PUNCH_TYPE = criterion.Consts.TEAM_TIMESHEET_PUNCH_TYPE,
        DICT = criterion.consts.Dict,
        API = criterion.consts.Api.API,
        EMPLOYEES_MAX_COUNT = 10,
        IMPORT_APP_ACTION_PREFIX = 'IMPORT_APP_ID_';

    let currentInterval,
        AGGREGATED_DATES_RANGES;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_timesheet_dashboard',

        requires : [
            'criterion.view.employee.timesheet.dashboard.Options',
            'criterion.view.employee.timesheet.dashboard.TeamPunch',
            'criterion.view.employee.timesheet.dashboard.Submit'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal',
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        init : function() {
            // for init vm stores
            this.onActivate = Ext.Function.createBuffered(this.onActivate, 100, this);
            this.load = Ext.Function.createBuffered(this.load, 100, this);
            this.callParent(arguments);

            new Ext.util.KeyNav({
                target : Ext.getBody(),
                right : {
                    ctrl : true,
                    fn : this.handlePagingNavRight
                },
                left : {
                    ctrl : true,
                    fn : this.handlePagingNavLeft
                },
                scope : this
            });
        },

        onEmployeeChange : function() {
            this.load();
        },

        onActivate : function() {
            if (this.checkViewIsActive()) {
                this.load();
            }
        },

        onSearch : function() {
            this.loadTimesheets();
        },

        onPrevInterval : function() {
            this.prepareGridStore(currentInterval - 1);
        },

        onNextInterval : function() {
            this.prepareGridStore(currentInterval + 1);
        },

        onShowOptions : function() {
            this.showOptions();
        },

        showOptions : function() {
            var me = this,
                vm = this.getViewModel();

            if (this._optionsWindow || !criterion.Application.getEmployee() || !this.checkViewIsActive()) {
                return;
            }

            Ext.create('criterion.view.employee.timesheet.dashboard.Options', {
                initialOptions : Ext.clone(vm.get('options')),

                viewModel : {
                    data : vm.getData()
                },

                listeners : {
                    select : options => {
                        let gridStore = vm.getStore('gridDetails');

                        me.lookup('employeeSelect').reset();

                        gridStore.removeAll();

                        vm.set({
                            viewMode : TEAM_TIMESHEET_VIEW_TYPE.LIST.value,
                            options : options
                        });

                        me.loadTimesheets();

                        criterion.Utils.setRuntimeValue(criterion.Consts.RUNTIME_VALUES.TEAM_TIMESHEET_OPTIONS, options);
                    },

                    cancel : initialOptions => {
                        vm.set('options', initialOptions);
                    },

                    destroy : _ => {
                        me._optionsWindow = null;
                    },

                    updateOptionDescription : description => {
                        vm.set('optionDescription', description);
                        criterion.Utils.setRuntimeValue(criterion.Consts.RUNTIME_VALUES.TEAM_TIMESHEET_OPTIONS_DESCRIPTIONS, description);
                    }
                }
            }).show();

            this._optionsWindow = true;
        },

        isOptionsValid : function() {
            let vm = this.getViewModel(),
                result;

            if (vm.get('options.isCustomPeriod') && vm.get('options.startDate') && vm.get('options.endDate')) {
                result = true;
            } else {
                result = !!vm.get('options.payrollPeriodId');
            }

            return result;
        },

        handleSelectAction : function(combo, value) {
            const TEAM_TIMESHEET_ACTIONS = criterion.Consts.TEAM_TIMESHEET_ACTIONS;

            combo.reset();

            switch (value) {
                case TEAM_TIMESHEET_ACTIONS.TEAM_PUNCH.action:
                    this.handleTeamPunch();
                    break;

                case TEAM_TIMESHEET_ACTIONS.IMPORT.action:
                    this.handleShowImport();
                    break;

                case TEAM_TIMESHEET_ACTIONS.DOWNLOAD.action:
                    this.handleDownload();
                    break;

                case TEAM_TIMESHEET_ACTIONS.MASS_SUBMIT.action:
                    this.handleShowSubmit();
                    break;

                default:
                    this.handleImportAppAction(value);
            }
        },

        handleImportAppAction : function(action) {
            let match = action && action.match(new RegExp('^' + IMPORT_APP_ACTION_PREFIX + '(.+)'));

            if (match) {
                let me = this,
                    view = me.getView(),
                    vm = this.getViewModel(),
                    payrollPeriodId = vm.get('options.payrollPeriodId'),
                    employeeGroupIds = vm.get('options.employeeGroupIds'),
                    params = {
                        timesheetTypeId : vm.get('options.timesheetTypeId')
                    };

                params.appId = match[1];

                if (vm.get('options.isCustomPeriod')) {
                    params.startDate = Ext.Date.format(vm.get('options.startDate'), criterion.consts.Api.DATE_FORMAT);
                    params.endDate = Ext.Date.format(vm.get('options.endDate'), criterion.consts.Api.DATE_FORMAT);
                } else if (payrollPeriodId) {
                    params.payrollPeriodId = payrollPeriodId;
                }

                if (employeeGroupIds.length) {
                    params.employeeGroups = employeeGroupIds.join(', ')
                }

                view.setLoading(true);
                criterion.Api.requestWithPromise({
                    method : 'GET',
                    url : API.DASHBOARD_SUBORDINATE_TIMESHEETS_IMPORT_FROM_EXTERNAL_SYSTEM,
                    urlParams : params
                }).then(function() {
                    criterion.Utils.toast(i18n.gettext('Successfully imported.'));
                    me.load();
                }).always(function() {
                    view.setLoading(false);
                });

                return true;
            } else {
                return false;
            }
        },

        handleEmployeeSearch : function(cmp, value) {
            criterion.Utils.setRuntimeValue(criterion.Consts.RUNTIME_VALUES.TEAM_TIMESHEET_EMPLOYEE_NAME, value);

            this.loadTimesheets(this.getViewModel().get('viewMode'));
        },

        handleRefreshClick : function() {
            let vm = this.getViewModel(),
                gridStore = vm.getStore('gridDetails');

            if (this.isOptionsValid()) {
                gridStore.clearFilter();
                gridStore.removeAll();
                this.lookup('employeeSelect').reset();

                this.loadTimesheets(vm.get('viewMode'));
            }
        },

        handleChangeViewType : function(combo, value, prevValue) {
            let me = this,
                vm = this.getViewModel(),
                employeeSearch = this.lookup('employeeSearch'),
                employeeSelect = this.lookup('employeeSelect'),
                gridStore = vm.getStore('gridDetails');

            me.getView().prepareGridColumns(value);

            if (prevValue) {
                if (value === TEAM_TIMESHEET_VIEW_TYPE.GRID.value) {
                    // bind hidden leads to layout fault (fix me)
                    employeeSearch.hide();
                    employeeSelect.show();
                    employeeSelect.reset();
                } else {
                    employeeSearch.show();
                    employeeSelect.hide();
                }
            }

            Ext.defer(() => {
                vm.set('firstBtnId', null);
                gridStore.removeAll();
                gridStore.clearFilter();

                if (prevValue) {
                    me.loadTimesheets(value);
                }
            });
        },

        handleSelectGridEmployee : function(combo, value) {
            let me = this,
                vm = this.getViewModel(),
                gridStore = vm.getStore('gridDetails');

            vm.set('firstBtnId', null);
            gridStore.clearFilter();
            me.prepareGridStore(0);

            if (value) {
                vm.set('employeesPageIndex', null);
                gridStore.setFilters([
                    {
                        property : 'employeeId',
                        value : value,
                        exactMatch : true
                    }
                ]);
            } else {
                if (this.internalEmployeePagingIsNeed()) {
                    this.setEmployeesFilter(0);
                } else {
                    vm.set('employeesPageIndex', null);
                }
            }
        },

        getOptionParams : function() {
            let vm = this.getViewModel(),
                timesheetTypeId = vm.get('options.timesheetTypeId'),
                payrollPeriodId = vm.get('options.payrollPeriodId'),
                employeeGroupIds = vm.get('options.employeeGroupIds'),
                params = [],
                startDate,
                endDate;

            if (vm.get('options.isCustomPeriod')) {
                startDate = Ext.Date.format(vm.get('options.startDate'), criterion.consts.Api.DATE_FORMAT);
                endDate = Ext.Date.format(vm.get('options.endDate'), criterion.consts.Api.DATE_FORMAT);

                params.push('startDate=' + startDate);
                params.push('endDate=' + endDate);
            } else if (payrollPeriodId) {
                params.push('payrollPeriodId=' + payrollPeriodId);
            }

            if (employeeGroupIds.length) {
                params.push('employeeGroups=' + employeeGroupIds.join(','));
            }

            params.push('timesheetTypeId=' + timesheetTypeId);

            return params;
        },

        handleShowImport : function() {
            var me = this,
                vm = this.getViewModel(),
                timesheetTypeId = vm.get('options.timesheetTypeId'),
                payrollPeriodId = vm.get('options.payrollPeriodId'),
                employeeGroupIds = vm.get('options.employeeGroupIds'),
                importDialog,
                templateParams = this.getOptionParams(),
                extraFields = [
                    {
                        xtype : 'hiddenfield',
                        name : 'timesheetTypeId',
                        value : timesheetTypeId
                    }
                ];

            if (vm.get('options.isCustomPeriod')) {
                extraFields.push({
                    xtype : 'hiddenfield',
                    name : 'startDate',
                    value : Ext.Date.format(vm.get('options.startDate'), criterion.consts.Api.DATE_FORMAT)
                });
                extraFields.push({
                    xtype : 'hiddenfield',
                    name : 'endDate',
                    value : Ext.Date.format(vm.get('options.endDate'), criterion.consts.Api.DATE_FORMAT)
                });
            } else if (payrollPeriodId) {
                extraFields.push({
                    xtype : 'hiddenfield',
                    name : 'payrollPeriodId',
                    value : payrollPeriodId
                });
            }

            if (employeeGroupIds.length) {
                extraFields.push({
                    xtype : 'hiddenfield',
                    name : 'employeeGroups',
                    value : employeeGroupIds.join(', ')
                });
            }

            extraFields.unshift({
                xtype : 'button',
                glyph : criterion.consts.Glyph['ios7-download-outline'],
                cls : 'criterion-btn-primary',
                width : 60,
                margin : '0 0 0 10',
                listeners : {
                    click : () => {
                        window.open(criterion.Api.getSecureResourceUrl(Ext.String.format(
                            "{0}?{1}",
                            API.DASHBOARD_SUBORDINATE_TIMESHEETS_IMPORT_DOWNLOAD_TEMPLATE,
                            templateParams.join('&')
                        )));
                    }
                }
            });

            me._templateParamsStr = templateParams.join('&');

            importDialog = Ext.create('criterion.view.common.FileAttachForm', {
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : 600,
                        height : 'auto',
                        modal : true
                    }
                ],
                title : i18n.gettext('Import Timesheets'),
                attachButtonText : i18n.gettext('Import'),
                uploadUrl : API.DASHBOARD_SUBORDINATE_TIMESHEETS_IMPORT_UPLOAD,
                maxFileSizeUrl : API.DASHBOARD_SUBORDINATE_TIMESHEETS_IMPORT_MAXFILESIZE,
                fileFieldName : 'teamTimesheetFile',
                extraFields : extraFields,
                layout : 'hbox',
                callback : {
                    scope : me,
                    fn : me.load
                },
                success : {
                    scope : me,
                    fn : me._onSuccessImportFile
                }
            });

            importDialog.on('close', function() {
                me.setCorrectMaskZIndex(false);
            });

            importDialog.show();

            me.setCorrectMaskZIndex(true);
        },

        handleDownload : function() {
            var params = this.getOptionParams();

            window.open(criterion.Api.getSecureResourceUrl(API.DASHBOARD_SUBORDINATE_TIMESHEETS_DOWNLOAD + '?' + params.join('&')));
        },

        _onSuccessImportFile : function(result) {
            var me = this;

            if (result.hasErrors) {
                criterion.Msg.confirm(
                    i18n.gettext('Import Timesheets'),
                    i18n.gettext('The file has been validated and errors were found. Would you like to look through them?'),
                    function(btn) {
                        if (btn === 'yes') {
                            window.open(
                                criterion.Api.getSecureResourceUrl(
                                    Ext.String.format(
                                        API.DASHBOARD_SUBORDINATE_TIMESHEETS_IMPORT_ERRORS,
                                        result.fileId
                                    )
                                ), '_blank'
                            );
                        } else {
                            me.deleteImportFile(result.fileId);
                        }
                    }
                );
            } else {
                criterion.Msg.confirm(
                    i18n.gettext('Import Timesheets'),
                    i18n.gettext('The file has been validated and no errors were found. Would you like to import the file?'),
                    function(btn) {
                        if (btn === 'yes') {
                            criterion.Api.request({
                                url : Ext.String.format(API.DASHBOARD_SUBORDINATE_TIMESHEETS_IMPORT, result.fileId) + '?' + me._templateParamsStr,
                                method : 'PUT',
                                callback : function() {
                                    criterion.Utils.toast(i18n.gettext('Successfully imported.'));
                                    me.load();
                                }
                            });
                        } else {
                            me.deleteImportFile(result.fileId);
                        }
                    }
                );
            }
        },

        deleteImportFile : function(fileId) {
            criterion.Api.request({
                url : Ext.String.format(API.DASHBOARD_SUBORDINATE_TIMESHEETS_IMPORT, fileId),
                method : 'DELETE',
                scope : this
            });
        },

        load : function() {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                employerId = this.getEmployerId(),
                payrollSchedules = this.getStore('payrollSchedules'),
                promises = [],
                currentOptions = criterion.Utils.getRuntimeValue(criterion.Consts.RUNTIME_VALUES.TEAM_TIMESHEET_OPTIONS),
                optionsDescriptions = criterion.Utils.getRuntimeValue(criterion.Consts.RUNTIME_VALUES.TEAM_TIMESHEET_OPTIONS_DESCRIPTIONS);

            if (!employerId || !payrollSchedules) {
                return;
            }

            if (currentOptions) {
                vm.set('options', currentOptions);
            }

            if (optionsDescriptions) {
                vm.set('optionDescription', optionsDescriptions);
            }

            promises.push(
                () => {
                    return me.getStore('timesheetSyncApps').loadWithPromise({
                        params : {
                            buttonCd : criterion.Consts.APP_BUTTON_TYPES.TIMESHEET_SYNC
                        }
                    });
                },
                () => {
                    return criterion.CodeDataManager.loadIfEmpty(DICT.ENTITY_TYPE);
                },
                () => {
                    return me.getStore('timesheetTypes').loadWithPromise();
                },
                () => {
                    return payrollSchedules.loadWithPromise();
                },
                () => {
                    return me.getStore('employeeGroups').loadWithPromise();
                },
                () => {
                    return me.getStore('customData').loadWithPromise({
                        params : {
                            entityTypeCd : criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.getCustomizableEntities().CUSTOMIZABLE_ENTITY_TIMESHEET_DETAIL.code, DICT.ENTITY_TYPE).getId()
                        }
                    })
                },
                () => {
                    let codeTables = [];

                    me.getStore('customData').each(data => {
                        let codeTableId = data.get('codeTableId');

                        if (codeTableId) {
                            codeTables.push(criterion.CodeDataManager.getCodeTableNameById(codeTableId))
                        }
                    });

                    return criterion.CodeDataManager.load(Ext.Array.clean(Ext.Array.unique(codeTables)));
                }
            );

            view.setLoading(true);

            Ext.Deferred.sequence(promises).then(() => {
                me.updateActions();
                if (me.isOptionsValid()) {
                    me.loadTimesheets();
                } else {
                    me.showOptions();
                }
            }).always(() => {
                view.setLoading(false);
            });
        },

        updateActions : function() {
            let me = this,
                apps = me.getStore('timesheetSyncApps'),
                actions = me.getStore('actions'),
                newActions = Ext.Object.getValues(criterion.Consts.TEAM_TIMESHEET_ACTIONS);

            apps.each(function(app) {
                newActions.push({
                    text : i18n.gettext('Import') + ' ' + app.get('name'),
                    action : IMPORT_APP_ACTION_PREFIX + app.getId()
                });
            });

            actions.loadRawData(newActions);
        },

        loadTimesheets : function(viewTypeIn) {
            let me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                payrollPeriodId = vm.get('options.payrollPeriodId'),
                employeeGroupIds = vm.get('options.employeeGroupIds'),
                employee = this.lookup('employeeSearch').getValue(),
                viewType = viewTypeIn || TEAM_TIMESHEET_VIEW_TYPE.LIST.value,
                isList = viewType === TEAM_TIMESHEET_VIEW_TYPE.LIST.value,
                store = vm.getStore(isList ? 'subordinateTimesheets' : 'subordinateTimesheetsGrid'),
                timesheetTypeInfo = this.getTimesheetTypeInfo(),
                params = {};

            vm.set({
                isManualDay : timesheetTypeInfo.isManualDay,
                firstBtnId : null
            });

            if (!this.isOptionsValid()) {
                Ext.Logger.warn('Options are not valid.');

                return;
            }

            if (vm.get('options.isCustomPeriod')) {
                params = {
                    startDate : Ext.Date.format(vm.get('options.startDate'), criterion.consts.Api.DATE_FORMAT),
                    endDate : Ext.Date.format(vm.get('options.endDate'), criterion.consts.Api.DATE_FORMAT)
                }
            } else if (payrollPeriodId) {
                params = {
                    payrollPeriodId : payrollPeriodId
                }
            }

            if (timesheetTypeInfo.timesheetTypeId) {
                params['timesheetTypeId'] = timesheetTypeInfo.timesheetTypeId;
            }

            if (employee && isList) {
                params['employeeName'] = employee;
            }

            if (employeeGroupIds && employeeGroupIds.length) {
                params['employeeGroups'] = employeeGroupIds.join(', ')
            }

            view.setLoading(true);

            store.loadWithPromise({
                params : params
            }).then({
                scope : this,
                success : () => {
                    AGGREGATED_DATES_RANGES = null;

                    if (!isList && vm.get('options.isAggregateTimesheet')) {
                        criterion.Api.requestWithPromise({
                            method : 'GET',
                            url : API.DASHBOARD_SUBORDINATE_TIMESHEETS_GRID_DATES_RANGES,
                            params : params
                        }).then(function(result) {
                            if (result) {
                                AGGREGATED_DATES_RANGES = result.availableDatesRanges;
                            }

                            me.lastLoadParams = Ext.clone(params);
                            me.initStateDateInterval();

                            if (!isList) {
                                me.initStateGridStore(store);
                            }
                        })
                    } else {
                        me.lastLoadParams = Ext.clone(params);
                        me.initStateDateInterval();

                        if (!isList) {
                            me.initStateGridStore(store);
                        }
                    }
                }
            }).always(() => {
                view.setLoading(false);
            })
        },

        initStateDateInterval : function() {
            let vm = this.getViewModel(),
                initStartDate, endDate,
                payrollPeriodId = vm.get('options.payrollPeriodId');

            if (vm.get('options.isAggregateTimesheet') && AGGREGATED_DATES_RANGES && AGGREGATED_DATES_RANGES.length) {
                initStartDate = AGGREGATED_DATES_RANGES[0]['startDate'];
                endDate = AGGREGATED_DATES_RANGES[0]['endDate'];
            } else {
                if (vm.get('options.isCustomPeriod')) {
                    initStartDate = vm.get('options.startDate');
                    endDate = vm.get('options.endDate');
                } else if (payrollPeriodId) {
                    let payrollPeriod = this.getStore('payrollPeriods').getById(payrollPeriodId);

                    initStartDate = payrollPeriod.get('periodStartDate');
                    endDate = payrollPeriod.get('periodEndDate');
                }

                for (let i = 0; i < Ext.Date.DAYS_IN_WEEK; i++) {
                    let date = Ext.Date.add(initStartDate, Ext.Date.DAY, i);

                    vm.set(Ext.String.format('day{0}label', i + 1), Ext.Date.format(date, 'm/d'));
                }
            }

            vm.set({
                initStartDate : initStartDate,
                startDate : initStartDate,
                endDate : endDate
            });
        },

        initStateGridStore : function(store) {
            let vm = this.getViewModel(),
                employeesStore = vm.getStore('employeesStore'),
                newStore = Ext.create('Ext.data.Store', {
                    proxy : {
                        type : 'memory'
                    },
                    model : 'criterion.model.dashboard.subordinateTimesheet.GridDetail'
                }),
                gridStore = vm.getStore('gridDetails');

            employeesStore.removeAll();

            store.each((subordinate) => {
                let employeeId = subordinate.get('employeeId'),
                    details = subordinate.get('details'),
                    paycodes = subordinate.get('availablePaycodes'),
                    projects = subordinate.get('availableProjects'),
                    tasks = subordinate.get('availableTasks'),
                    workLocations = subordinate.get('availableWorkLocations'),
                    workLocationAreas = subordinate.get('availableWorkAreas'),
                    assignments = subordinate.get('availableAssignments'),
                    firstDetail,
                    availableDates = [];

                employeesStore.add({
                    id : employeeId,
                    firstName : subordinate.get('firstName'),
                    lastName : subordinate.get('lastName'),
                    employeeNumber : subordinate.get('employeeNumber')
                });

                if (!details.length) {
                    details.push({
                        paycodeId : null,
                        paycodeDetail : null,
                        projectId : null,
                        taskId : null,
                        employerWorkLocationId : null,
                        workLocationAreaId : null,
                        assignmentId : null,

                        customValue1 : null,
                        customValue2 : null,
                        customValue3 : null,
                        customValue4 : null,
                        dateHours : [],
                        dateStatuses : []
                    });
                }

                Ext.Array.each(details, detail => {
                    detail.paycodeId = detail.paycodeDetail ? detail.paycodeDetail.id : null
                });

                firstDetail = details[0];

                if (firstDetail.paycodeId) {
                    Ext.each(paycodes, (pc) => {
                        if (pc.id === firstDetail.paycodeId) {
                            availableDates = pc.availableDates;

                            return false;
                        }
                    });
                }

                newStore.add({
                    sorter : 0,
                    firstName : subordinate.get('firstName'),
                    lastName : subordinate.get('lastName'),
                    employeeNumber : subordinate.get('employeeNumber'),
                    employeeId : employeeId,
                    totalHours : subordinate.get('totalHours'),
                    totalDays : subordinate.get('totalDays'),

                    paycodes : paycodes,
                    projects : projects,
                    tasks : tasks,
                    assignments : assignments,
                    workLocations : workLocations,
                    workLocationAreas : workLocationAreas,

                    paycodeId : firstDetail.paycodeId,
                    paycodeDetail : firstDetail.paycodeDetail,
                    projectId : firstDetail.projectId,
                    taskId : firstDetail.taskId,
                    employerWorkLocationId : firstDetail.employerWorkLocationId,
                    workLocationAreaId : firstDetail.workLocationAreaId,
                    assignmentId : firstDetail.assignmentId,

                    customValue1 : firstDetail.customValue1,
                    customValue2 : firstDetail.customValue2,
                    customValue3 : firstDetail.customValue3,
                    customValue4 : firstDetail.customValue4,

                    availableDates : availableDates,
                    dateHours : firstDetail.dateHours,
                    dateStatuses : firstDetail.dateStatuses
                });

                Ext.Array.each(details, (detail, index) => {
                    if (index) {
                        let availableDates = [];

                        if (detail.paycodeId) {
                            Ext.each(paycodes, (pc) => {
                                if (pc.id === detail.paycodeId) {
                                    availableDates = pc.availableDates;

                                    return false;
                                }
                            });
                        }

                        newStore.add({
                            sorter : index,
                            employeeId : employeeId,

                            paycodes : paycodes,
                            projects : projects,
                            tasks : tasks,
                            assignments : assignments,
                            workLocations : workLocations,
                            workLocationAreas : workLocationAreas,

                            paycodeId : detail.paycodeId,
                            paycodeDetail : detail.paycodeDetail,
                            projectId : detail.projectId,
                            taskId : detail.taskId,
                            employerWorkLocationId : detail.employerWorkLocationId,
                            workLocationAreaId : detail.workLocationAreaId,
                            assignmentId : detail.assignmentId,

                            customValue1 : detail.customValue1,
                            customValue2 : detail.customValue2,
                            customValue3 : detail.customValue3,
                            customValue4 : detail.customValue4,

                            availableDates : availableDates,
                            dateHours : detail.dateHours,
                            dateStatuses : detail.dateStatuses

                        });
                    }
                });
            });
            newStore.cloneToStore(gridStore);

            gridStore.clearFilter();

            if (this.internalEmployeePagingIsNeed()) {
                this.setEmployeesFilter(0, true);
            } else {
                vm.set('employeesPageIndex', null);
            }

            this.prepareGridStore(0);
        },

        internalEmployeePagingIsNeed : function() {
            let vm = this.getViewModel(),
                employeesStore = vm.getStore('employeesStore');

            return employeesStore.count() > EMPLOYEES_MAX_COUNT;
        },

        handleNext : function() {
            let vm = this.getViewModel(),
                employeesPageIndex = vm.get('employeesPageIndex');

            vm.set('firstBtnId', null);
            this.setEmployeesFilter(employeesPageIndex + 1);
        },

        handlePrev : function() {
            let vm = this.getViewModel(),
                employeesPageIndex = vm.get('employeesPageIndex');

            vm.set('firstBtnId', null);
            this.setEmployeesFilter(employeesPageIndex - 1);
        },

        handlePagingNavRight : function() {
            let vm = this.getViewModel();

            if (this.checkViewIsActive() && !vm.get('hideNextBtn')) {
                this.handleNext();
            }
        },

        handlePagingNavLeft : function() {
            let vm = this.getViewModel();

            if (this.checkViewIsActive() && vm.get('employeesPageIndex')) {
                this.handlePrev();
            }
        },

        setEmployeesFilter : function(index, blockPreparingGrid) {
            let vm = this.getViewModel(),
                employeesStore = vm.getStore('employeesStore'),
                gridStore = vm.getStore('gridDetails'),
                employees = Ext.Array.map(employeesStore.getRange(index * EMPLOYEES_MAX_COUNT, index * EMPLOYEES_MAX_COUNT + (EMPLOYEES_MAX_COUNT - 1)), (arr) => arr.getId());

            vm.set({
                employeesPageIndex : index,
                maxEmployeesCount : EMPLOYEES_MAX_COUNT,
                maxEmployeesPage : Math.ceil(employeesStore.count() / EMPLOYEES_MAX_COUNT)
            });

            gridStore.setFilters([
                {
                    property : 'employeeId',
                    operator : 'in',
                    value : employees
                }
            ]);

            if (!blockPreparingGrid) {
                this.prepareGridStore(currentInterval);
            }
        },

        /**
         * Converts model's data to be compatible with a grid.
         */
        prepareGridStore : function(interval) {
            let me = this,
                vm = this.getViewModel(),
                initStartDate, startDate, endDate,
                gridStore = vm.getStore('gridDetails'),
                payrollPeriodId = vm.get('options.payrollPeriodId'),
                isAggregateTimesheet = vm.get('options.isAggregateTimesheet'),
                isFTE = isAggregateTimesheet && vm.get('options.isFTE'),
                timesheetTypeInfo = this.getTimesheetTypeInfo();

            if (!interval || interval < 0) {
                interval = 0;
            }

            if (isAggregateTimesheet && AGGREGATED_DATES_RANGES && AGGREGATED_DATES_RANGES.length) {
                initStartDate = Ext.Date.parse(AGGREGATED_DATES_RANGES[interval]['startDate'], criterion.consts.Api.DATE_FORMAT);
                endDate = Ext.Date.parse(AGGREGATED_DATES_RANGES[interval]['endDate'], criterion.consts.Api.DATE_FORMAT);
            } else if (vm.get('options.isCustomPeriod')) {
                initStartDate = vm.get('options.startDate');
                endDate = vm.get('options.endDate');
            } else if (payrollPeriodId) {
                let payrollPeriod = this.getStore('payrollPeriods').getById(payrollPeriodId);

                initStartDate = payrollPeriod.get('periodStartDate');
                endDate = payrollPeriod.get('periodEndDate');
            } else {
                Ext.Logger.error('Can not identify grid interval.');

                return;
            }

            startDate = isAggregateTimesheet ? initStartDate : Ext.Date.add(
                Ext.Date.add(initStartDate, Ext.Date.HOUR, 1), // correction for Daylight Saving Time (DST)
                Ext.Date.DAY,
                interval * Ext.Date.DAYS_IN_WEEK
            );

            currentInterval = interval;

            vm.set({
                isFirstInterval : interval === 0,
                isLastInterval : isAggregateTimesheet ? (AGGREGATED_DATES_RANGES && interval === AGGREGATED_DATES_RANGES.length - 1) :
                    Ext.Date.diff(startDate, endDate, Ext.Date.DAY) < 7,

                initStartDate : initStartDate,
                startDate : startDate,
                endDate : endDate,
                weekEndDate : isAggregateTimesheet ? startDate : Ext.Date.add(startDate, Ext.Date.DAY, Ext.Date.DAYS_IN_WEEK - 1)
            });

            if (isAggregateTimesheet) {
                vm.set('day1label', Ext.Date.format(startDate, 'm/d'));
            } else {
                for (let i = 0; i < Ext.Date.DAYS_IN_WEEK; i++) {
                    let date = Ext.Date.add(startDate, Ext.Date.DAY, i);

                    vm.set(Ext.String.format('day{0}label', i + 1), Ext.Date.format(date, 'm/d'));
                }
            }

            gridStore.each(function(rec) {
                for (let i = 0; i < Ext.Date.DAYS_IN_WEEK; i++) {
                    let date = Ext.Date.format(Ext.Date.add(startDate, Ext.Date.DAY, i), criterion.consts.Api.DATE_FORMAT),
                        dateHours = rec.get('dateHours'),
                        hData = null,
                        dData = null,
                        fteData = null;

                    Ext.Array.each(dateHours, (dateHour) => {
                        if (dateHour.date === date) {
                            hData = dateHour.hours;
                            dData = dateHour.days;
                            if (isAggregateTimesheet && isFTE) {
                                fteData = {
                                    fte : dateHour.fte,
                                    fteMultiplier : dateHour.fteMultiplier
                                };
                            }

                            return false;
                        }
                    });

                    if (timesheetTypeInfo.isManualDay) {
                        rec.set(
                            Ext.String.format('day{0}days', i + 1),
                            (dData !== null) ? dData : null
                        );
                    } else {
                        rec.set(
                            Ext.String.format('day{0}hours', i + 1),
                            (hData !== null) ? criterion.Utils.dateTimeObjToStr(criterion.Utils.hoursToDuration(hData)) : null
                        );
                    }

                    if (isFTE) {
                        rec.set(
                            Ext.String.format('day{0}fte', i + 1),
                            (fteData !== null) ? fteData.fte : null
                        );
                        rec.set(
                            Ext.String.format('day{0}fteMultiplier', i + 1),
                            (fteData !== null) ? fteData.fteMultiplier : null
                        );
                    }

                    rec.set(
                        Ext.String.format('_{0}day', i + 1),
                        date
                    );
                }

                // up disability
                Ext.defer(() => {
                    me.getView().fireEvent('setNewAvailableDates', rec);
                }, 100);
            }, this, {
                filtered : true
            });

            vm.set('showWeekIterationButtons', true);
        },

        onAddNewTaskLine : function(rec) {
            let vm = this.getViewModel(),
                view = this.getView(),
                gridStore = vm.getStore('gridDetails'),
                timesheetTypeInfo = this.getTimesheetTypeInfo(),
                employeeId = rec.get('employeeId'),
                startDate = vm.get('startDate'),
                newSorter = 0,
                data;

            gridStore.each((gridRec) => {
                let sorter = gridRec.get('sorter');

                if (gridRec.get('employeeId') === employeeId && sorter && sorter > newSorter) {
                    newSorter = sorter;
                }
            });

            data = {
                sorter : newSorter + 1,
                employeeId : employeeId,

                paycodes : rec.get('paycodes'),
                projects : rec.get('projects'),
                tasks : rec.get('tasks'),
                assignments : rec.get('assignments'),
                workLocations : rec.get('workLocations'),
                workLocationAreas : rec.get('workLocationAreas'),
                paycodeId : null,
                paycodeDetail : null,
                projectId : null,
                taskId : null,
                employerWorkLocationId : null,
                workLocationAreaId : null,
                assignmentId : null,
                customValue1 : null,
                customValue2 : null,
                customValue3 : null,
                customValue4 : null,
                dateHours : [],

                _markNew : true
            };

            Ext.Array.each(criterion.Utils.range(0, Ext.Date.DAYS_IN_WEEK - 1), (i) => {
                let date = Ext.Date.add(
                    startDate,
                    Ext.Date.DAY,
                    i
                );

                if (timesheetTypeInfo.isManualDay) {
                    data[Ext.String.format('day{0}days', i + 1)] = null;
                } else {
                    data[Ext.String.format('day{0}hours', i + 1)] = null;
                }
                data[Ext.String.format('_{0}day', i + 1)] = Ext.Date.format(date, criterion.consts.Api.DATE_FORMAT);
            });

            gridStore.add(data);

            Ext.defer(() => {
                Ext.each(['paycodeId', 'assignmentId', 'employerWorkLocationId', 'workLocationAreaId', 'projectId', 'taskId'], (el) => {
                    let aAearch = view.query(Ext.util.Format.format('combobox[__{0}_{1}_{2}]', el, employeeId, data.sorter));

                    if (aAearch.length) {
                        aAearch[0].focus();
                        return false;
                    }
                });
            }, 500);
        },

        getTimesheetTypeInfo : function() {
            let vm = this.getViewModel(),
                timesheetTypeId = vm.get('options.timesheetTypeId'),
                timesheetType = timesheetTypeId && vm.getStore('timesheetTypes').getById(timesheetTypeId),
                isManualDay = timesheetType && (timesheetType.get('entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL_DAY);

            return {
                timesheetTypeId,
                timesheetType,
                isManualDay
            };
        },

        onRecalculateTotalHours : function(employeeId) {
            let gridStore = this.getViewModel().getStore('gridDetails'),
                fRec,
                total = 0;

            gridStore.each((rec) => {
                if (rec.get('employeeId') === employeeId) {
                    let dayHours = rec.get('dateHours');

                    Ext.Array.each(dayHours, (dayHour) => {
                        total += dayHour.hours;
                    });

                    if (rec.get('sorter') === 0) {
                        fRec = rec;
                    }
                }
            });

            fRec && fRec.set('totalHours', total);
        },

        onRecalculateTotalDays : function(employeeId) {
            let gridStore = this.getViewModel().getStore('gridDetails'),
                fRec,
                total = 0;

            gridStore.each((rec) => {
                if (rec.get('employeeId') === employeeId) {
                    let dayHours = rec.get('dateHours');

                    Ext.Array.each(dayHours, (dayHour) => {
                        total += dayHour.days;
                    });

                    if (rec.get('sorter') === 0) {
                        fRec = rec;
                    }
                }
            });

            fRec && fRec.set('totalDays', total);
        },

        onTaskRecordChanges : function(recId, classificationCodesAndValues) {
            criterion.Utils.fillCustomFieldsDefaultValuesFromCodes(this.getView(), classificationCodesAndValues, 'criterion_code_detail_field[__task_' + recId + '][codeTableId=');
        },

        onProjectChange : function(recId, projectId) {
            Ext.each(this.getView().query('[__employeeTask_' + recId + ']'), cmp => {
                let selectedTask = cmp.getSelection(),
                    taskProjectId = selectedTask && selectedTask.get('projectId');

                if ((!projectId && !!taskProjectId) || (projectId !== taskProjectId)) {
                    cmp.reset();
                }
            });
        },

        onSetNewAvailableDates : function(rec) {
            let employeeId = rec.get('employeeId'),
                sorter = rec.get('sorter'),
                availableDates = Ext.Array.map(rec.get('availableDates') || [], dt => dt.date),
                disabledDates = Ext.Array.map(Ext.Array.filter(rec.get('dateStatuses') || [], dt => !dt.isUpdatable), dt => dt.date),
                isFTE = this.getViewModel().get('options.isFTE');

            availableDates = Ext.Array.difference(availableDates, disabledDates);

            if (isFTE) {
                Ext.each(this.getView().query('numberfield[__fteField_' + employeeId + '_' + sorter + ']'), (cmp) => {
                    let date = rec.get('_' + cmp.fteIndex + 'day');

                    cmp.setDisabled(!Ext.Array.contains(availableDates, date));
                });
            } else {
                Ext.each(this.getView().query('textfield[__timeField_' + employeeId + '_' + sorter + ']'), (cmp) => {
                    let date = rec.get('_' + cmp.dayIndex + 'day');

                    cmp.setDisabled(!Ext.Array.contains(availableDates, date));
                });
            }

        },

        timesheetPeriodRenderer : function(value, cell, subordinate) {
            let html = '';

            subordinate.timesheets().each(function(timesheet, index) {
                html += Ext.String.format(
                    '<p class="{3}"><a href="{0}" class="ts-link">{1} to {2}</a></p>',
                    criterion.consts.Route.getDirect(criterion.consts.Route.SELF_SERVICE.TIME_TIMESHEETS) + '/' + timesheet.getId() + '-manager',
                    Ext.Date.format(timesheet.get('startDate'), 'm/d/Y'),
                    Ext.Date.format(timesheet.get('endDate'), 'm/d/Y'),
                    index ? '' : 'ts-first-el'
                );
            });

            return html === '' ? '&mdash;' : html;
        },

        timesheetTotalHoursRenderer : function(value, cell, subordinate) {
            let html = '';

            subordinate.timesheets().each(function(timesheet, index) {
                html += Ext.String.format(
                    '<p class="{0}">{1}</p>',
                    index ? '' : 'ts-first-el',
                    criterion.Utils.timeObjToStr(criterion.Utils.hourStrParse((timesheet.get('totalHours') || 0) + '', true))
                );
            });

            return html === '' ? '&mdash;' : html;
        },

        timesheetTotalDaysRenderer : function(value, cell, subordinate) {
            let html = '';

            subordinate.timesheets().each(function(timesheet, index) {
                html += Ext.String.format(
                    '<p class="{0}">{1}</p>',
                    index ? '' : 'ts-first-el',
                    timesheet.get('totalDays') || 0
                );
            });

            return html === '' ? '&mdash;' : html;
        },

        timesheetStatusRenderer : function(value, cell, subordinate) {
            let html = '';

            subordinate.timesheets().each(function(timesheet, index) {
                html += Ext.String.format(
                    '<p class="{0}">{1}</p>',
                    index ? '' : 'ts-first-el',
                    timesheet.get('status')
                );
            });

            return html === '' ? '&mdash;' : html;
        },

        timesheetMarkRenderer : function(value, cell, subordinate) {
            let html = '';

            cell.innerCls = cell.innerCls + ' no-padding';

            subordinate.timesheets().each(function() {
                html += '<p>&nbsp;</p>';
            });

            return '<div class="type_cls ' + value + '">' + html + '</div>';
        },

        onDashboardAddTimesheet : function(btn) {
            let record = btn.getWidgetRecord(),
                employeeId = record.get('employeeId'),
                offset = new Date().getTimezoneOffset(),
                initiatorId = this.getEmployeeId();

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYEE_TIMESHEET,
                method : 'POST',
                urlParams : {
                    employeeId : employeeId,
                    initiatorId : initiatorId,
                    isNext : true,
                    timezoneOffset : offset
                },
                jsonData : {
                    employeeId : employeeId
                }
            }).then({
                scope : this,
                success : function(result) {
                    this.redirectTo(criterion.consts.Route.SELF_SERVICE.TIME_TIMESHEETS + '/' + result.id + '-manager');
                }
            });
        },

        handleTeamPunch : function() {
            let popup,
                me = this,
                vm = this.getViewModel(),
                gridStore = vm.getStore('gridDetails'),
                startDate = vm.get('startDate'),
                timesheetType = vm.getStore('timesheetTypes').getById(vm.get('options.timesheetTypeId')),
                timesheetTypeTypeIsManual = timesheetType && (timesheetType.get('entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL),
                timesheetTypeTypeIsManualDay = timesheetType && (timesheetType.get('entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.MANUAL_DAY),
                punchType = timesheetTypeTypeIsManualDay ? TEAM_TIMESHEET_PUNCH_TYPE.DAYS.value : (timesheetTypeTypeIsManual ? TEAM_TIMESHEET_PUNCH_TYPE.HOURS.value : TEAM_TIMESHEET_PUNCH_TYPE.IN.value);

            popup = Ext.create('criterion.view.employee.timesheet.dashboard.TeamPunch', {
                viewModel : {
                    data : {
                        timesheetsCount : vm.getStore('subordinateTimesheets').count(),
                        loadParams : this.lastLoadParams,

                        date : startDate,
                        startDate : startDate,
                        endDate : vm.get('endDate'),
                        punchType : punchType,
                        timesheetType : timesheetType,
                        timesheetTypeTypeIsManual : timesheetTypeTypeIsManual,
                        timesheetTypeTypeIsManualDay : timesheetTypeTypeIsManualDay
                    }
                }
            });

            popup.on({
                cancel : function() {
                    popup.destroy();
                },
                afterExecute : function() {
                    gridStore.removeAll();
                    gridStore.clearFilter();

                    me.loadTimesheets(vm.get('viewMode'));
                    popup.destroy();
                }
            });

            popup.show();
        },

        handleShowSubmit : function() {
            let popup,
                me = this,
                vm = this.getViewModel(),
                gridStore = vm.getStore('gridDetails');

            popup = Ext.create('criterion.view.employee.timesheet.dashboard.Submit', {
                viewModel : {
                    data : {
                        loadParams : this.lastLoadParams
                    }
                }
            });

            popup.on({
                cancel : function() {
                    popup.destroy();
                },
                afterSubmit : function() {
                    gridStore.removeAll();
                    gridStore.clearFilter();

                    me.loadTimesheets(vm.get('viewMode'));
                    popup.destroy();
                }
            });

            popup.show();
        },

        onGridStoreFilterChange : function() {
            let vm = this.getViewModel();

            Ext.defer(() => {
                let firstBtnId = vm.get('firstBtnId'),
                    btn;

                if (firstBtnId) {
                    btn = Ext.ComponentQuery.query('#' + firstBtnId);

                    btn && btn.length && btn[0].focus();
                }
            }, 500);
        },

        /**
         *
         * POST /dashboard/subordinateTimesheets/grid
         Query parameters: timesheetTypeId: Int
         payload
         {
                    "details": [
                        {
                            "employeeId": 32,
                            "projectId" : 1,
                            "taskId": 2,
                            "customValue1": 4386,
                            "customValue2": 'false',
                            "customValue3": null,
                            "customValue4": '',
                            "dateHours": [
                                {
                                    "date": "2018.01.02",
                                    "hours": 10
                                },
                                {
                                    "date": "2018.01.03",
                                    "hours": 8.2
                                }
                            ]
                        }
                    ]
                }
         */
        handleSave : function() {
            let me = this,
                vm = this.getViewModel(),
                gridStore = vm.getStore('gridDetails'),
                res = {
                    details : []
                };

            vm.set('blockedState', true);
            gridStore.clearFilter();
            gridStore.each((rec) => {
                let data = rec.getData(),
                    paycodeDetail = data.paycodeDetail,
                    detailEl = {
                        dateHours : []
                    };

                if (data.paycodeId && data.paycodes) {
                    Ext.each(data.paycodes, paycodeV => {
                        if (paycodeV.id === data.paycodeId) {
                            paycodeDetail = {
                                paycode : paycodeV.paycode,
                                entityRef : paycodeV.entityRef
                            };

                            return false;
                        }
                    });
                }

                detailEl = Ext.Object.merge(detailEl, {
                    employeeId : data.employeeId,
                    paycodeId : data.paycodeId,
                    paycodeDetail : paycodeDetail,
                    projectId : data.projectId,
                    taskId : data.taskId,
                    employerWorkLocationId : data.employerWorkLocationId,
                    workLocationAreaId : data.workLocationAreaId,
                    assignmentId : data.assignmentId,
                    customValue1 : data.customValue1,
                    customValue2 : data.customValue2,
                    customValue3 : data.customValue3,
                    customValue4 : data.customValue4
                });

                Ext.Array.each(data.dateHours, (dh) => {
                    if (dh.hours !== null || dh.days !== null) {
                        let data = {
                            id : dh.id,
                            date : dh.date,
                            hours : dh.hours,
                            days : dh.days
                        };

                        if (dh.fte) {
                            data.fte = dh.fte;
                        }

                        detailEl.dateHours.push(data);
                    }
                });

                if (!detailEl.dateHours.length) {
                    return;
                }

                res.details.push(detailEl);
            });

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.DASHBOARD_SUBORDINATE_TIMESHEETS_GRID + '?' + Ext.Object.toQueryString(this.lastLoadParams),
                method : 'POST',
                jsonData : res
            }).then((result) => {
                criterion.Utils.toast(i18n.gettext('Timesheets successfully updated'));
                me.lookup('employeeSelect').reset();

                gridStore.clearFilter();
                gridStore.removeAll();
                me.loadTimesheets(TEAM_TIMESHEET_VIEW_TYPE.GRID.value);

            }, (response) => {
                let data = response && (Ext.decode(response.responseText, true) || response.responseText || response.responseJson),
                    errors;

                errors = Ext.Array.map(data.errors, function(error) {
                    let errorInfo = criterion.consts.Error.getErrorInfo(error);

                    return error.employeeName + ': ' + errorInfo.description;
                });

                criterion.Msg.error({
                    title : i18n.gettext('Errors'),
                    message : errors.join('<br>')
                });

            }).always(() => {
                vm.set('blockedState', false);
            });
        },

        handlePaycodeChange : function(cmp, value) {

            if (!cmp || cmp.destroyed || !cmp.getWidgetRecord || !value) {
                return;
            }

            this.setupRowByPayCode(cmp, value);
        },

        setupRowByPayCode : function(cmp, value) {
            let view = this.getView(),
                wr = cmp.getWidgetRecord();

            wr.set(cmp.getWidgetColumn().dataIndex, value);

            if (cmp.getSelection()) {
                Ext.defer(() => {
                    if (cmp.getSelection()) {
                        wr.set('availableDates', Ext.clone(cmp.getSelection().get('availableDates')));
                        view.fireEvent('setNewAvailableDates', wr);
                    }
                }, 100);
            }

        },

        onSetupRowByPayCode : function(cmp, value) {
            this.setupRowByPayCode(cmp, value);
        }
    };

});
