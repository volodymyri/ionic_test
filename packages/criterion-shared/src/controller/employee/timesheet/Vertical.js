Ext.define('criterion.controller.employee.timesheet.Vertical', function() {

    const WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES,
        COL_PADDING = 10,
        DETAILS_COUNT_TERMINATOR = 20; // if count ts details will be > this value, in the week selector will be selected the first week. In other cases will be selected the option "all"

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_timesheet_vertical',

        requires : [
            'criterion.store.employee.timesheet.Incomes',
            'criterion.view.employee.SubmitConfirm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.employee.timesheet.mixin.SummaryHandler',
            'criterion.controller.employee.timesheet.mixin.NotesHandler',
            'criterion.controller.employee.timesheet.mixin.ManagerOptionsHandler',
            'criterion.controller.mixin.WorkflowConfirmation'
        ],

        config : {
            closeAfterSave : true
        },

        listen : {
            global : {
                timeEntryInOut : 'load',
                resizeMainView : 'onResizeEmptySpace'
            }
        },

        init() {
            let view = this.getView(),
                vm = this.getViewModel();

            this.fixEmptySpace = Ext.Function.createBuffered(this.fixEmptySpace, 200, this);
            this.createDays = Ext.Function.createBuffered(this.createDays, 100, this);

            this.callParent(arguments);

            if (!vm.get('viewDetailOnly')) {
                Ext.GlobalEvents.on('beforeHideForm', function() {
                    if (view) {
                        view._preventReRoute = true;
                        view.destroy();
                    }
                }, this, {
                    buffer : 1,
                    single : true
                });
            }

            if (this.getCloseAfterSave()) {
                view.on('afterSave', function() {
                    view.close();
                }, view);
            } else {
                view.on('afterSave', function() {
                    this.load();
                }, this);
            }
        },

        onToggleDetails() {
            let vm = this.getViewModel(),
                showExtraColumns = vm.get('showExtraColumns'),
                fillUXColWidth = vm.get('sizes.fillUXCol.width');

            if (!showExtraColumns) {
                vm.set(
                    'sizes.fillUXCol.width',
                    fillUXColWidth - (vm.get('sizes.regIncomeCol.width') + vm.get('sizes.overtimeCol.width')) - COL_PADDING * 2
                );
            } else {
                vm.set(
                    'sizes.fillUXCol.width',
                    fillUXColWidth + (vm.get('sizes.regIncomeCol.width') + vm.get('sizes.overtimeCol.width')) + COL_PADDING * 2
                );
            }

            vm.set('showExtraColumns', !showExtraColumns);
        },

        onFieldsContainerWrapResize() {
            let fieldsContainer = this.lookup('fieldsContainer'),
                fieldsContainerWrap = this.lookup('fieldsContainerWrap'),
                fieldsContainerWrapWidth = fieldsContainerWrap.getWidth(),
                domEl, clientWidth, offsetWidth;

            if (!fieldsContainer.el) {
                return;
            }
            domEl = fieldsContainer.el.dom;
            clientWidth = domEl.clientWidth;
            offsetWidth = domEl.offsetWidth;

            if (clientWidth !== offsetWidth) {
                fieldsContainerWrapWidth += offsetWidth - clientWidth;
            }

            fieldsContainer.setWidth(fieldsContainerWrapWidth);
        },

        onAfterRenderTimesheet() {
            let fieldColContainer = this.lookup('fieldColContainer'),
                fieldsContainer = this.lookup('fieldsContainer'),
                detailsContainerWrap = this.lookup('detailsContainerWrap'),
                fieldsScroll = fieldsContainer.getScrollable(),
                detailsScroll = detailsContainerWrap.getScrollable();

            fieldsScroll.on('scroll', (cmp, x, y) => {
                if (y >= 0) {
                    detailsScroll.suspendEvent('scroll');
                    detailsContainerWrap.scrollTo(null, y, false);
                    Ext.defer(() => {
                        detailsScroll.resumeEvent('scroll');
                    }, 50);
                }
                if (x >= 0) {
                    fieldColContainer.scrollTo(x, null, false);
                }
            });

            detailsScroll.on('scroll', (cmp, x, y) => {
                if (y >= 0) {
                    fieldsScroll.suspendEvent('scroll');

                    fieldsContainer.scrollTo(null, y, false);

                    Ext.defer(() => {
                        fieldsScroll.resumeEvent('scroll');
                    }, 50);
                }
            });
        },

        getEmployeeId() {
            return this.getViewModel().get('timesheetRecord.employeeId');
        },

        load(useRecordTasks) {
            let me = this,
                view = me.getView(),
                vm = me.getViewModel(),
                fieldsContainer = me.lookup('fieldsContainer'),
                detailsContainer = me.lookup('detailsContainer'),
                timesheetId,
                timesheetRecord = vm.get('timesheetRecord'), // used in approving
                codeDataStore = criterion.CodeDataManager.getStore(criterion.consts.Dict.DATA_TYPE),
                promises = [],
                viewDetailOnly = vm.get('viewDetailOnly'),
                incomeCodes = vm.getStore('incomeCodes'),
                availableTasks = vm.getStore('availableTasks'),
                availableProjects = vm.getStore('availableProjects'),
                timesheet,
                delegatedByEmployeeId = vm.get('delegatedByEmployeeId'),
                dfd = Ext.create('Ext.Deferred'),
                timesheetWeeks = vm.get('timesheetWeeks'),
                weekSelector = this.lookup('weekSelector'),
                ALL_WEEKS_NUMBER = vm.get('ALL_WEEKS_NUMBER'),
                weekSummary;

            //Prevent quick browser's back button clicks
            if (this.destroyed) {
                return;
            }

            vm.set({
                showExtraColumns : false,
                isWorkflowView : view.isWorkflowView
            });

            fieldsContainer.removeAll();
            detailsContainer.removeAll();

            timesheetId = vm.get('timesheetId') || (timesheetRecord && timesheetRecord.getId());

            if (!timesheetId) {
                dfd.resolve();

                return dfd.promise;
            }

            view.setLoading(true);
            vm.set('blockedState', true);
            vm.set('sizes.fillUXCol.width', 0);

            timesheet = Ext.create('criterion.model.employee.timesheet.Vertical', {
                id : timesheetId
            });

            if (vm.get('managerMode')) {
                // override for support editing by manager
                incomeCodes.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_SUBORDINATE_TIMESHEET_AVAILABLE_INCOME_CODES);
                availableTasks.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_SUBORDINATE_TIMESHEET_AVAILABLE_TASKS);
                timesheet.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_SUBORDINATE_TIMESHEET_VERTICAL);
                availableProjects.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_SUBORDINATE_TIMESHEET_AVAILABLE_PROJECTS);
            } else {
                // default mode
                incomeCodes.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_TIMESHEET_INCOME_CODES);
                availableTasks.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_TIMESHEET_AVAILABLE_TASKS);
                timesheet.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_TIMESHEET_VERTICAL);
                availableProjects.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_TIMESHEET_AVAILABLE_PROJECTS);
            }

            timesheet.loadWithPromise({
                params : Ext.Object.merge(
                    {
                        timesheetId : timesheetId,
                        timezoneOffset : new Date().getTimezoneOffset()
                    },
                    (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                )
            }).then({
                scope : this,
                success : function(timesheetVertical) {
                    vm.set('timesheetVertical', timesheetVertical);

                    weekSummary = timesheetVertical.get('weekSummary')
                    if (weekSummary) {
                        let wData = Ext.clone(weekSummary);

                        wData.push({
                            number : ALL_WEEKS_NUMBER,
                            startDate : timesheetVertical.get('startDate'),
                            endDate : timesheetVertical.get('endDate')
                        })

                        timesheetWeeks.loadData(wData);

                        if (!vm.get('timesheetWeek') || vm.get('timesheetIdWeek') !== timesheetVertical.getId()) {
                            weekSelector && weekSelector.setValue(me.getDetailsCount(timesheetVertical) > DETAILS_COUNT_TERMINATOR ? 1 : ALL_WEEKS_NUMBER);
                        }
                    }

                    let employeeId = this.getEmployeeId();

                    !viewDetailOnly && promises.push(
                        me.loadWorkflowData(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.TIMESHEET),
                        vm.getStore('workLocations').loadWithPromise({
                            params : {
                                employeeId : employeeId
                            }
                        }),
                        availableTasks.loadWithPromise({
                            params : {
                                timesheetId : timesheetId
                            }
                        }),
                        availableProjects.loadWithPromise({
                            params : {
                                timesheetId : timesheetId
                            }
                        }),
                        vm.getStore('availableAssignments').loadWithPromise({
                            params : Ext.Object.merge(
                                {
                                    timesheetId : timesheetId
                                },
                                (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                            )
                        }),
                        vm.getStore('workLocationAreas').loadWithPromise()
                    );

                    promises.push(
                        incomeCodes.loadWithPromise({
                            params : Ext.Object.merge(
                                {
                                    timesheetId : timesheetId
                                },
                                (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                            )
                        })
                    );

                    if (!codeDataStore.isLoaded() && !codeDataStore.isLoading()) {
                        promises.push(criterion.CodeDataManager.load([criterion.consts.Dict.DATA_TYPE]));
                    }

                    Ext.promise.Promise.all(promises).then({
                        success : function() {
                            vm.set('ts', +new Date()); // actualize vm formulas instead notify
                            me.prepareCustomFields();
                            me.getWorkflowRelatedParams(timesheetVertical);
                            me.prepareTotals();
                            me.createDays(useRecordTasks ? timesheetRecord.timesheetTasks() : null);

                            me.fixEmptySpace(this.getView());

                            vm.set('blockedState', false);
                            view.setLoading(false);
                        },
                        scope : this
                    }).otherwise(function() {
                        vm.set('blockedState', false);
                        view.setLoading(false);
                    })
                }
            });

            return dfd.promise;
        },

        getDetailsCount(timesheet) {
            let count = 0;

            timesheet.days().each(day => {
                count += day.details().count();
            });

            return count;
        },

        getWorkflowRelatedParams(timesheet) {
            if (!this.getView().isWorkflowView) {
                return;
            }

            this.getViewModel().set({
                overrideHasMultiAssignments : !timesheet.get('hasOneAssignment'),
                overrideHasMultiLocations : !timesheet.get('hasOneEmployeeWorkLocation')
            });
        },

        prepareCustomFields() {
            let me = this,
                vm = this.getViewModel(),
                customFieldsTitlesCleaner = {};

            // clean custom fields titles
            Ext.Array.each(criterion.Utils.range(1, 4), function(index) {
                customFieldsTitlesCleaner[Ext.String.format('customField{0}Title', index)] = '';
            });
            vm.set(customFieldsTitlesCleaner);

            Ext.Array.each(vm.get('timesheetVertical').get('customFields'), (customField, index) => {
                if (!customField) {
                    return;
                }

                let label = customField.label,
                    customCol = me.lookup(Ext.String.format('customCol{0}', index + 1)),
                    customColWidthBinding = Ext.String.format('sizes.customCol{0}.width', index + 1),
                    customColWidth = vm.get(customColWidthBinding),
                    customColTitleWidth = Ext.util.TextMetrics.measure(customCol.getEl(), label).width + 15;

                vm.set(Ext.String.format('customField{0}Title', index + 1), customField.isHidden ? '' : label);

                if (customColTitleWidth && customColWidth) {
                    vm.set(customColWidthBinding, Math.max(customColWidth, customColTitleWidth));
                }
            });
        },

        prepareTotals() {
            let vm = this.getViewModel(),
                timesheetVertical = vm.get('timesheetVertical');

            timesheetVertical.days().each((day, index) => {
                day.details().each(taskDetail => {
                    let payCode = taskDetail.getPaycodeDetail() ? taskDetail.getPaycodeDetail().getData() : taskDetail.getData()['paycodeDetail'];

                    taskDetail.calculateEndTime();

                    if (payCode['isCompEarned']) {
                        let hoursString = criterion.Utils.minutesToTimeStr(taskDetail.get('hours') * 60 + taskDetail.get('minutes'));

                        taskDetail.set('hoursString', hoursString);
                    }
                });
            });
        },

        handleWeekChange(cmp, val, oldValue) {
            let me = this,
                vm = this.getViewModel();

            vm.set({
                timesheetWeek : val,
                timesheetIdWeek : vm.get('timesheetVertical.id')
            });

            if (!oldValue) {
                return;
            }

            Ext.defer(() => {
                me.createDays();
            }, 100);
        },

        getWeekSelected() {
            let vm = this.getViewModel(),
                timesheetWeeks = vm.get('timesheetWeeks'),
                weekVal = this.lookup('weekSelector').getValue(),
                weekRange = weekVal && timesheetWeeks.findRecord('number', weekVal, 0, false, false, true),
                weekStart = weekRange && weekRange.get('startDate'),
                weekEnd = weekRange && weekRange.get('endDate');

            return {
                weekStart, weekEnd
            };
        },

        createDays(tasks) {
            let me = this,
                vm = this.getViewModel(),
                fieldsContainer = this.lookup('fieldsContainer'),
                detailsContainer = this.lookup('detailsContainer'),
                timesheetVertical = vm.get('timesheetVertical'),
                timesheetType = timesheetVertical && timesheetVertical['getTimesheetType'] && timesheetVertical.getTimesheetType(),
                isButtonEntryType = timesheetType && (timesheetType.get('entryType') === criterion.Consts.TIMESHEET_LAYOUT_ENTRY_TYPE.BUTTON),
                incomes = vm.get('incomeCodes'),
                allowWeekSelector = vm.get('allowWeekSelector'),
                startDayOfWeek = timesheetVertical.getTimesheetType().get('startDayOfWeek'),
                elDays = [],
                buildMessage;

            let {weekStart, weekEnd} = this.getWeekSelected();

            fieldsContainer.removeAll();
            detailsContainer.removeAll();

            fieldsContainer.add({
                xtype : 'container',
                layout : 'center',
                reference : 'buildMessage',
                padding : 20,
                items : [
                    {
                        xtype : 'component',
                        html : '<span class="criterion-darken-gray fs-09">' + i18n.gettext('Building timesheet...') + '</span>'
                    }
                ]
            });

            timesheetVertical.days().each((day, index) => {
                let incomeStore = Ext.create('criterion.store.employee.timesheet.Incomes'),
                    res = [],
                    date = day.get('date');

                if (allowWeekSelector && !Ext.Date.between(date, weekStart, weekEnd)) {
                    return;
                }

                incomes.each(income => {
                    if (income.isDateAvailable(date) || income.get('isBreak') || isButtonEntryType) {
                        res.push(income.getData());
                    }
                });
                incomeStore.setData(res);

                elDays.push({
                    xtype : 'criterion_employee_timesheet_day',

                    viewModel : {
                        data : {
                            timesheetDay : day,
                            timesheetTasks : tasks,
                            dayIndex : index + 1,
                            startDayOfWeek : startDayOfWeek,

                            parentController : me, // support not good way, temporary, possible
                            fieldsContainer : fieldsContainer,
                            detailsContainer : detailsContainer
                        },

                        stores : {
                            incomes : incomeStore
                        }
                    }
                });
            });

            if (elDays.length) {
                Ext.suspendLayouts();
                fieldsContainer.add(elDays);
                Ext.resumeLayouts();
            }

            Ext.defer(function() {
                buildMessage = me.lookup('buildMessage');

                if (buildMessage) {
                    buildMessage.destroy();
                }

                if (fieldsContainer) {
                    fieldsContainer.detectTaskChanges = true;
                }
            }, 1);
        },

        afterLayoutDaysContainer(cmp) {
            let parent = cmp.up('criterion_employee_timesheet_vertical');

            if (!parent) {
                return;
            }

            let fieldsContainerWrap = parent.lookup('fieldsContainerWrap'),
                bbarDetailsCol = parent.lookup('bbarDetailsCol'),
                tbarDetailsCol = parent.lookup('tbarDetailsCol'),
                fieldsContainerWidth = fieldsContainerWrap.getWidth(),
                cmpBodyWidth = cmp.body.getWidth();

            bbarDetailsCol.setWidth(cmpBodyWidth - fieldsContainerWidth);
            tbarDetailsCol.setWidth(cmpBodyWidth - fieldsContainerWidth);
        },

        fixEmptySpace(parent) {
            const START_PADDING = 0;

            let allColWidth = 0,
                colWidth = START_PADDING,
                vm = this.getViewModel(),
                fieldColContainer = parent && parent.lookup('fieldColContainer');

            if (!fieldColContainer) {
                return;
            }

            let fieldColContainerWidth = fieldColContainer.getWidth(),
                fieldColContainerInnerCt = fieldColContainer.getEl('innerCt');

            if (!fieldColContainerInnerCt) {
                return;
            }

            let cont = fieldColContainer.el.dom,
                fieldsContainerWrap = parent.lookup('fieldsContainerWrap'),
                detailsContainerWrap = parent.lookup('detailsContainerWrap');

            let fieldColContainerInnerCtFullWidth = Ext.fly(fieldColContainerInnerCt.id + '-innerCt').getWidth(),
                fillUXColWidth = vm.get('sizes.fillUXCol.width');

            parent.lookup('fieldColContainer').items.each((item) => {
                let width = item.getWidth();

                if (width > 0) {
                    allColWidth = allColWidth + width;
                    colWidth = colWidth + width + COL_PADDING;
                }
            });

            if (fieldColContainerInnerCtFullWidth > colWidth && fillUXColWidth === 0) {
                // without scrolling
                let nWidth = fieldColContainerInnerCtFullWidth - colWidth;

                vm.set('sizes.fillUXCol.width', nWidth > 0 ? nWidth : 0);
            } else if (fieldColContainerInnerCtFullWidth > colWidth && fillUXColWidth > 0) {
                // without scrolling + filler
                vm.set('sizes.fillUXCol.width', fillUXColWidth + (fieldColContainerWidth - colWidth) - 30);
            } else if (fieldColContainerWidth < fieldColContainerInnerCtFullWidth && fillUXColWidth > 0) {
                // with scrolling
                let newFillUXColWidth = fillUXColWidth - (fieldColContainerInnerCtFullWidth - fieldColContainerWidth) - 30;

                vm.set('sizes.fillUXCol.width', newFillUXColWidth > 0 ? newFillUXColWidth : 0);
            }

            Ext.defer(_ => {
                if (cont.scrollWidth > cont.clientWidth && fieldsContainerWrap.down('[isTaskWrapper]')) {
                    // at least one detail entry must be present
                    // set horiz scroll for correct sync scrolling ()
                    detailsContainerWrap.setStyle('overflow-x', 'scroll');
                } else {
                    detailsContainerWrap.setStyle('overflow-x', 'hidden');
                }
            }, 100);
        },

        onResizeEmptySpace() {
            if (this.checkViewIsActive()) {
                this.fixEmptySpace(this.getView());
            }
        },

        onCancel() {
            this.getViewModel().get('timesheetVertical').reject();
            this.fireViewEvent('editorCancel');
            this.getView().close();
        },

        /**
         * @protected
         * @return {Ext.promise.Promise}
         */
        saveTimesheet() {
            let vm = this.getViewModel(),
                timesheetVertical = vm.get('timesheetVertical'),
                timesheetType = timesheetVertical && timesheetVertical['getTimesheetType'] && timesheetVertical.getTimesheetType(),
                isShowTime = timesheetType && timesheetType.get('isShowTime'),
                timesheetForSave = Ext.create('criterion.model.employee.timesheet.VerticalForSave', {id : timesheetVertical.getId()}),
                isManagerMode = vm.get('managerMode'),
                promise;

            if (isManagerMode) {
                timesheetForSave.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_SUBORDINATE_TIMESHEET_VERTICAL);
            } else {
                // default mode
                timesheetForSave.getProxy().setUrl(criterion.consts.Api.API.EMPLOYEE_TIMESHEET_VERTICAL);
            }

            timesheetForSave.commit(); // marking as already saved

            timesheetVertical.days().each(function(timesheetDay) {
                let details = timesheetDay.details(),
                    replacedTaskDetails = [];

                details.each(function(taskDetail) {
                    let time = criterion.Utils.hourStrParse(taskDetail.get('taskHoursString') || '0');

                    taskDetail.set({
                        hours : time.hours,
                        minutes : time.minutes
                    });

                    taskDetail.set('isShowTime', isShowTime);
                    taskDetail.set({
                        date : timesheetDay.get('date'),
                        timesheetId : timesheetVertical.getId() // can be removed as we de transactional save
                    });

                    if (taskDetail.get('paycodeChanged')) {
                        let replacedTaskDetail = taskDetail.copy(null);

                        replacedTaskDetail.setPaycodeDetail(taskDetail.getPaycodeDetail());

                        replacedTaskDetails.push(replacedTaskDetail);

                        taskDetail.drop();
                    }
                });

                details.add(replacedTaskDetails);

                details.cloneToStore(timesheetForSave.timesheetTaskDetails());
            });

            timesheetForSave.timesheetTaskDetails().each(function(taskDetail) {
                if (taskDetail.phantom && taskDetail.skipSave()) { // removing auto-created empty details
                    timesheetForSave.timesheetTaskDetails().remove(taskDetail);
                }
            });

            if (timesheetForSave.timesheetTaskDetails().needSync()) { // BE doesn't like empty details
                promise = timesheetForSave.saveWithPromise();
            } else {
                let dfd = Ext.create('Ext.promise.Deferred');
                promise = dfd.promise;
                dfd.resolve();
            }

            return promise;
        },

        onSave() {
            if (this.hasInvalidFields()) {
                return
            }

            let me = this,
                view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true);
            vm.set('blockedState', true);

            this.saveTimesheet()
                .then(() => {
                    vm.set('blockedState', false);
                    view.setLoading(false);

                    me.load();
                }, () => {
                    vm.set('blockedState', false);
                    view.setLoading(false);
                });
        },

        handleSaveAndClose() {
            if (this.hasInvalidFields()) {
                return
            }

            let view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true);
            vm.set('blockedState', true);

            this.saveTimesheet()
                .then({
                    scope : this,
                    success : function() {
                        view.setLoading(false);
                        vm.set('blockedState', false);
                        this.fireViewEvent('afterSave');
                    },
                    failure : function() {
                        view.setLoading(false);
                        criterion.Utils.toast(i18n.gettext('Something went wrong.'));
                        vm.set('blockedState', false);
                    }
                });
        },

        onSubmitTimesheet() {
            let vm = this.getViewModel(),
                timesheetVertical = vm.get('timesheetVertical'),
                me = this,
                employeeId = me.getEmployeeId();

            if (this.hasInvalidFields()) {
                return
            }

            // delay for correct find the mask element
            Ext.defer(function() {
                me.setCorrectMaskZIndex(true);
            }, 10);

            this.actWorkflowConfirm(employeeId, criterion.Consts.WORKFLOW_TYPE_CODE.TIMESHEET).then(function(signature) {
                let jsonData;

                me.setCorrectMaskZIndex(false);

                if (signature) {
                    jsonData = {
                        signature : signature
                    };
                }

                vm.set('blockedState', true);

                me.saveTimesheet().then(function() {
                    criterion.Api.requestWithPromise({
                        url : criterion.consts.Api.API.EMPLOYEE_TIMESHEET_SUBMIT + '?timesheetId=' + timesheetVertical.getId() + '&employeeId=' + employeeId,
                        method : 'PUT',
                        jsonData : jsonData
                    })
                        .then({
                            success : function() {
                                vm.set('blockedState', false);
                                me.fireViewEvent('afterSave');
                            },
                            failure : function() {
                                criterion.Utils.toast(i18n.gettext('Something went wrong.'));
                                vm.set('blockedState', false);
                            }
                        })
                });
            });
        },

        handleRecallRequest() {
            let me = this,
                vm = this.getViewModel(),
                record = vm.get('timesheetVertical'),
                employeeId = record.get('employeeId'),
                view = me.getView();

            // delay for correct find the mask element
            Ext.defer(function() {
                me.setCorrectMaskZIndex(true);
            }, 10);

            this.actWorkflowConfirm(
                employeeId,
                criterion.Consts.WORKFLOW_TYPE_CODE.TIMESHEET,
                false,
                i18n.gettext('Do you want to recall this timesheet?'),
                i18n.gettext('Recall'),
                {
                    noSignature : record.get('timesheetStatusCode') !== WORKFLOW_STATUSES.APPROVED
                }
            ).then(function(signature) {
                let jsonData;

                me.setCorrectMaskZIndex(false);

                if (signature) {
                    jsonData = {
                        signature : signature
                    };
                }

                view.setLoading(true);
                vm.set('blockedState', true);

                criterion.Api.requestWithPromise({
                    url : Ext.util.Format.format(
                        criterion.consts.Api.API.EMPLOYEE_TIMESHEET_RECALL,
                        record.getId()
                    ) + '?employeeId=' + employeeId,
                    method : 'PUT',
                    jsonData : jsonData
                }).then({
                    success : function(result) {
                        vm.set('blockedState', false);
                        me.fireViewEvent('afterSave');
                        view.close();
                    },
                    failure : function() {
                        criterion.Utils.toast(i18n.gettext('Something went wrong.'));
                        vm.set('blockedState', false);
                    }
                }).always(function() {
                    view.setLoading(false);
                });
            });
        },

        hasInvalidFields() {
            return criterion.Utils.hasInvalidFields(this.getView().query('field'));
        },

        onInOutClick() {
            let me = this,
                vm = me.getViewModel(),
                isStarted = vm.get('isStarted'),
                attestationMessage = vm.get('timesheetVertical.timesheetType.attestationMessage'),
                availableAssignments = vm.get('availableAssignments');

            if (isStarted && attestationMessage) {
                criterion.Msg.confirm(
                    {
                        icon : criterion.Msg.QUESTION,
                        message : attestationMessage,
                        buttons : criterion.Msg.OKCANCEL,
                        closable : false,
                        callback : btn => {
                            if (btn === 'ok') {
                                me.actInOut(isStarted);
                            }
                        }
                    }
                );
            } else {
                if (!isStarted && Ext.Array.filter(availableAssignments.getRange(), rec => new Date() >= rec.get('effectiveDate')).length > 1) {
                    Ext.create('criterion.ux.form.Panel', {
                        title : i18n.gettext('Select Assignment'),
                        modal : true,
                        draggable : true,
                        cls : 'criterion-modal',
                        plugins : [
                            {
                                ptype : 'criterion_sidebar',
                                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                                height : 'auto',
                                modal : true
                            }
                        ],

                        layout : 'hbox',
                        bodyPadding : 20,

                        items : [
                            {
                                xtype : 'combo',
                                fieldLabel : i18n.gettext('Assignment'),
                                reference : 'assignment',
                                store : vm.get('availableAssignments'),
                                valueField : 'id',
                                displayField : 'title',
                                queryMode : 'local',
                                editable : false,
                                allowBlank : false,
                                tpl : Ext.create(
                                    'Ext.XTemplate',
                                    '<ul class="x-list-plain"><tpl for=".">',
                                    '<li role="option" class="x-boundlist-item {[this.isHiddenClass(values)]}">{title}</li>',
                                    '</tpl>' +
                                    '</ul>',
                                    {
                                        isHiddenClass : values => (new Date() >= values.effectiveDate) ? '' : 'hidden'
                                    }
                                )
                            }
                        ],

                        buttons : [
                            '->',
                            {
                                xtype : 'button',
                                cls : 'criterion-btn-light',
                                handler : function() {
                                    me.setCorrectMaskZIndex(false);
                                    this.up('criterion_form').close();
                                },
                                text : i18n.gettext('Cancel')
                            },
                            {
                                xtype : 'button',
                                cls : 'criterion-btn-primary',
                                handler : function() {
                                    var form = this.up('criterion_form');

                                    if (form.isValid()) {
                                        me.actInOut(isStarted, form.getViewModel().get('assignment.selection.assignmentId'));
                                        me.setCorrectMaskZIndex(false);
                                        form.close();
                                    }
                                },
                                text : i18n.gettext('Select')
                            }
                        ]
                    }).show();

                    me.setCorrectMaskZIndex(true);

                    return;
                }

                this.actInOut(isStarted);
            }
        },

        actInOut(isStarted, assignmentId) {
            let me = this,
                view = this.getView(),
                offset = new Date().getTimezoneOffset(),
                params = {
                    employeeId : me.getEmployeeId(),
                    timezoneOffset : offset
                };

            if (assignmentId) {
                params['assignmentId'] = assignmentId;
            }

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : isStarted ? criterion.consts.Api.API.EMPLOYEE_TIMESHEET_OUT : criterion.consts.Api.API.EMPLOYEE_TIMESHEET_IN,
                method : 'GET',
                params : params
            }).then(() => {
                Ext.GlobalEvents.fireEvent('timeEntryInOut');
            }).otherwise(() => {
                view.setLoading(false);
            })
        }
    };

});
