Ext.define('criterion.controller.employee.benefit.TimeOffCalendar', function() {

    return {
        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_employee_benefit_time_off_calendar',

        requires : [
            'criterion.view.employee.benefit.TimeOffForm',
            'criterion.model.employee.TimeOff'
        ],

        availableColorStore : null,
        colorStore : null,
        editorClass : 'criterion.view.employee.benefit.TimeOffForm',
        editor : null,

        doFilterTimeOffTypeIds : function(filterTimeOffTypeIds) {
            this.clearTimeOffTypeFilters(true);

            if (this.colorStore && filterTimeOffTypeIds && filterTimeOffTypeIds.length) {
                var me = this,
                    timeOffDetails = me.getStore('timeOffDetails'),
                    filters = timeOffDetails.getFilters();

                me.currentTimeOffTypeFilter = filters.add({
                    filterFn : function(record) {
                        return Ext.Array.indexOf(filterTimeOffTypeIds, record.getEmployeeTimeOff().get('timeOffTypeCd')) >= 0;
                    }
                });

                me.currentColorsFilter = me.colorStore.getFilters().add({
                    property : 'id',
                    value : filterTimeOffTypeIds,
                    operator : 'in'
                });

                me.updateLegend();
                me.createCalendars();
            }
        },

        clearTimeOffTypeFilters : function(silent) {
            var me = this,
                colorStore = me.colorStore,
                timeOffDetails = me.getStore('timeOffDetails');

            if (me.currentTimeOffTypeFilter) {
                timeOffDetails.getFilters().remove(me.currentTimeOffTypeFilter);
            }

            if (me.currentColorsFilter) {
                colorStore.getFilters().remove(me.currentColorsFilter);
            }

            if (!silent) {
                me.updateLegend();
                me.createCalendars();
            }
        },

        load : function() {
            var me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                employeeId = vm.get('employeeId'),
                store = vm.get('timeOffDetails'),
                holidays = vm.getStore('holidays'),
                filterTimeOffTypeIds = view.getFilterTimeOffTypeIds();

            me.availableColorStore = Ext.create('Ext.data.ChainedStore', {
                source : criterion.CodeDataManager.getStore(criterion.consts.Dict.TIME_OFF_TYPE),
                sorters : [{
                    property : 'description',
                    direction : 'ASC'
                }]
            });

            me.colorStore = Ext.create('Ext.data.ChainedStore', {
                source : me.availableColorStore
            });

            if (filterTimeOffTypeIds && filterTimeOffTypeIds.length) {
                me.currentColorsFilter = me.colorStore.getFilters().add({
                    property : 'id',
                    value : filterTimeOffTypeIds,
                    operator : 'in'
                });
            }

            if (!employeeId || !vm.get('timezoneCd') || !store) {
                return;
            }

            view.setLoading(true);
            this.timezoneCd = vm.get('timezoneCd');
            this.timezoneDescription = vm.get('timezoneDescription');

            store.suspendEvents(true);

            Ext.Deferred.all([
                store.loadWithPromise({
                    params : {
                        employeeId : employeeId,
                        showApproved : vm.get('showApproved')
                    },
                    callback : function(recs) {
                        Ext.each(recs, function(rec) {
                            rec.set({
                                timezoneCd : me.timezoneCd,
                                timezoneDescription : me.timezoneDescription
                            });

                            rec.modified = {};
                        });
                        store.resumeEvents();
                    }
                }),
                holidays.loadWithPromise({
                    params : {
                        employeeId : employeeId
                    }
                })
            ]).then(function() {
                me.updateLegend();
                me.createCalendars();
                view.setLoading(false);
            });
        },

        updateLegend : function() {
            var legendVals = [],
                vm = this.getViewModel();

            this.colorStore.each(function(record) {
                legendVals.push({
                    color : record.get('attribute1'),
                    label : record.get('description')
                })
            });

            vm.set('legendValues', legendVals);
        },

        getDatasByYear : function(year) {
            var result = [[], [], [], [], [], [], [], [], [], [], [], []],
                vm = this.getViewModel();

            vm.get('timeOffDetails').each(function(record) {
                var date = record.get('timeOffDate');

                if (date.getFullYear() == year) {
                    result[date.getMonth()].push(record);
                }
            });

            return result;
        },

        createCalendars : function() {
            var view = this.getView(),
                vm = this.getViewModel(),
                rows = [],
                year = vm.get('year'),
                timeOffDetails = this.getDatasByYear(year),
                calendars = this.lookupReference('calendars'),
                holidays = vm.getStore('holidays'),
                holidaysByMonth = {};

            this.monthTimeOffs = [];

            holidays.each(function(holiday) {
                var date = holiday.get('date'),
                    month = date.getMonth();

                if (!date.getYear() == year) {
                    return
                }

                if (!holidaysByMonth[month]) {
                    holidaysByMonth[month] = [];
                }

                holidaysByMonth[month].push({
                    date : date,
                    tooltip : holiday.get('description')
                });
            });

            for (var i = 0; i < 12; i++) {
                if (i % view.getItemsInRow() === 0) {
                    rows.push({
                        xtype : 'container',
                        layout : 'hbox',
                        items : []
                    });
                }

                var row = rows[rows.length - 1].items;

                for (var j = 0; j < timeOffDetails[i].length; j++) {
                    var timeOffDetailRecord = timeOffDetails[i][j],
                        dayData = this.colorStore.getById(timeOffDetailRecord.getEmployeeTimeOff().get('timeOffTypeCd'));

                    if (dayData) {
                        this.monthTimeOffs.push({
                            timeOffDetailRecordId : timeOffDetailRecord.getId(),
                            date : Ext.Date.clearTime(timeOffDetailRecord.get('timeOffDate'), true),
                            color : dayData.get('attribute1'),
                            tooltip : dayData.get('description')
                        });
                    }
                }

                row.push({
                    xtype : 'criterion_picker_date',
                    showToday : false,
                    margin : 10,
                    value : new Date(year, i),
                    highlightedDates : this.monthTimeOffs,
                    highlightedHolidays : holidaysByMonth[i] || [],
                    fixedMonth : true,
                    hideSelectedDay : true,
                    listeners : {
                        select : 'onDateSelected'
                    }
                });
            }

            calendars.removeAll();
            calendars.add(rows);
        },

        findMonthTimeOffs : function(date) {
            return Ext.Array.filter(this.monthTimeOffs, function(val) {
                return +(Ext.Date.clearTime(val.date, true)) == +date;
            });
        },

        onDateSelected : function(picker, date) {
            var dateRecords = this.findMonthTimeOffs(date),
                items = [],
                me = this,
                menu;

            if (dateRecords.length > 1) {
                Ext.each(dateRecords, function(val) {
                    items.push({
                        text : val.tooltip,
                        padding : 5,
                        timeOffDetailRecordId : val.timeOffDetailRecordId,
                        cls : ''
                    });
                });

                menu = Ext.create('Ext.menu.Menu', {
                    floating : true,
                    renderTo : Ext.getBody(),
                    alignTarget : picker.getCellByDate(date),
                    items : items
                });
                menu.on('click', function(cont, menuItem) {
                    me._dateSelected(menuItem.timeOffDetailRecordId);
                });
                menu.show();
            } else {
                this._dateSelected(date);
            }
        },

        _dateSelected : function(input) {
            var me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                store = vm.get('timeOffDetails'),
                timeOffDetailRecord,
                timeOffRecord,
                dateRecords,
                date,
                managerMode = vm.get('managerMode');

            if (Ext.isDate(input)) {
                date = input;
                dateRecords = this.findMonthTimeOffs(date);
                timeOffDetailRecord = dateRecords.length ? store.getById(dateRecords[0]['timeOffDetailRecordId']) : null;

                if (timeOffDetailRecord) {
                    timeOffRecord = timeOffDetailRecord.getEmployeeTimeOff();
                } else {
                    timeOffRecord = Ext.create('criterion.model.employee.TimeOff', {
                        timeOffDate : date,
                        startDateForCreate : date,
                        employeeId : vm.get('employeeId'),
                        timeOffStatusCode : criterion.Consts.WORKFLOW_STATUSES.NOT_SUBMITTED,
                        statusCd : criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.WORKFLOW_STATUSES.NOT_SUBMITTED, criterion.consts.Dict.WORKFLOW_STATE).getId()
                    });
                }
            } else {
                timeOffRecord = store.getById(input).getEmployeeTimeOff();
            }

            if (managerMode && timeOffRecord.phantom) {
                this.editor = null;
                return;
            }

            this.editor = Ext.create(this.editorClass, {
                externalUpdate : false,
                viewModel : {
                    data : {
                        employeeId : vm.get('employeeId'),
                        timezoneCd : this.timezoneCd,
                        timezoneDescription : this.timezoneDescription,
                        managerMode : managerMode
                    }
                }
            });

            this.editor._connectedView = view.up();
            this.editor.shadow = false;
            this.editor.draggable = false;
            !this.showTitleInConnectedViewMode ? this.editor.setTitle(null) : null;
            if (timeOffRecord.phantom) {
                this.editor.loadRecord(timeOffRecord);
            } else {
                var timeOffRecordBuffer = new criterion.model.employee.TimeOff({
                    id : timeOffRecord.getId()
                });
                timeOffRecordBuffer.loadWithPromise().then(function() {
                    me.editor.loadRecord(timeOffRecordBuffer);
                });
            }
            this.editor.getController().handleRecordLoad(timeOffRecord);

            this.editor.on('afterSave', function() {
                this.load();
            }, this);

            this.editor.on('afterDelete', function() {
                this.load();
            }, this);

            this.editor.show();
        }
    }
});
