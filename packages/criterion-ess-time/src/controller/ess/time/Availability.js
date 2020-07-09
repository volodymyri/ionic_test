Ext.define('criterion.controller.ess.time.Availability', function() {

    return {

        extend : 'criterion.controller.WeekView',

        alias : 'controller.criterion_selfservice_time_availability',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        listen : {
            global : {
                employeeTimezone : 'onEmployeeTimezoneUpdate'
            }
        },

        onEmployeeTimezoneUpdate : function(timezoneCd, timezoneRec) {
            this.getViewModel().set('timezone', (timezoneRec ? timezoneRec.get('description') : ''));
            if (this.checkViewIsActive()) {
                this.load();
            }
        },

        onEmployeeChange : function() {
        },

        convertRules : {
            'EventId' : 'id',
            'Recurrence' : 'recurring',
            'Title' : 'name',
            'StartDate' : 'adjustedStartTimestamp',
            'EndDate' : 'adjustedEndTimestamp',
            'IsAllDay' : 'fullDay'
        },

        loadByWeek : true,

        convertFromCalendar : function(record) {
            var result = this.callParent(arguments),
                data = record.isModel ? record.getData() : record;

            result['startTimestamp'] = data['StartDate'];
            result['endTimestamp'] = data['EndDate'];

            return result;
        },

        onShow : function() {
            var vm = this.getViewModel(),
                employerWorkLocations = vm.getStore('employerWorkLocations');

            if (this.getViewModel().get('managerMode')) {
                vm.set('timezone', '');

                if (!employerWorkLocations.isLoaded() && !employerWorkLocations.isLoading()) {
                    employerWorkLocations.loadWithPromise();
                }
            }
        },

        onEmployeeComboChange : function(cmp, value) {
            var vm = this.getViewModel(),
                employerWorkLocationId,
                employerWorkLocation,
                timezoneCd,
                timezoneCdDefaultRecord = criterion.CodeDataManager.getCodeDetailRecord('id', criterion.Utils.getCurrentTimezoneCode(), criterion.consts.Dict.TIME_ZONE),
                employerWorkLocations = vm.getStore('employerWorkLocations');

            if (value && Ext.isNumeric(value)) {
                employerWorkLocationId = cmp.getStore().findRecord('employeeId', value, 0, false, false, true).get('employerWorkLocationId');

                if (employerWorkLocationId) {
                    employerWorkLocation = employerWorkLocations.getById(employerWorkLocationId);
                    if (employerWorkLocation) {
                        timezoneCd = employerWorkLocation.getWorkLocation().get('timezoneCd')
                    }
                }
                timezoneCd = timezoneCd || (timezoneCdDefaultRecord ? timezoneCdDefaultRecord.getId() : null);

                this.timezoneCd = timezoneCd;
                this.timezoneRec = criterion.CodeDataManager.getCodeDetailRecord('id', timezoneCd, criterion.consts.Dict.TIME_ZONE);
                vm.set('timezone', (this.timezoneRec ? this.timezoneRec.get('description') : ''));
            } else {
                this.timezoneCd = (timezoneCdDefaultRecord ? timezoneCdDefaultRecord.getId() : null);
                vm.set('timezone', '');
            }

            this.load();
        },

        load : function(opts) {
            var vm = this.getViewModel(),
                me = this,
                managerMode = vm.get('managerMode'),
                employeeId = this.getEmployeeId(),
                timezoneCd = managerMode ? this.timezoneCd : ess.Application.getEmployeeTimezoneCd(),
                timezoneRec = managerMode ? this.timezoneRec : ess.Application.getEmployeeTimezoneRecord();

            if (!employeeId) {
                me.getView().getStore().loadData([]);
                me.calendarRefresh();
                return;
            }

            vm.set('timezone', (timezoneRec ? timezoneRec.get('description') : ''));

            return this.callParent([
                {
                    callback : function(recs) {
                        Ext.each(recs, function(rec) {
                            rec.set('timezoneCd', timezoneCd);
                        });

                        me.calendarRefresh();
                    },
                    params : Ext.apply({
                        employeeId : employeeId
                    }, opts || {})
                }
            ]);
        },

        createEditor : function(editorCfg, record) {
            editorCfg.viewModel = {
                data : {
                    timezone : this.getViewModel().get('timezone')
                }
            };
            return this.callParent([editorCfg, record]);
        },

        getEmptyRecord : function() {
            return Ext.apply(this.callParent(arguments), {
                employeeId : this.getEmployeeId(),
                timezoneCd : this.getViewModel().get('managerMode') ? this.timezoneCd : ess.Application.getEmployeeTimezoneCd()
            });
        },

        getEmployeeId : function() {
            var vm = this.getViewModel(),
                employeesCombo = this.lookupReference('employeesCombo'),
                employeeId;

            if (vm.get('managerMode')) {
                employeeId = employeesCombo.getValue();
            } else {
                employeeId = vm.get('employeeId');
            }

            return Ext.isNumeric(employeeId) ? employeeId : null;
        },

        onCalendarEventClick : function(cmp, calendarRecord) {
            if (!this.getViewModel().get('allowAddButton')) {
                return;
            }

            this.callParent(arguments);
        },

        onCalendarDayClick : function(vw, startDate, isAllDay) {
            if (!this.getViewModel().get('allowAddButton')) {
                return;
            }

            this.callParent(arguments);
        }

    };
});
