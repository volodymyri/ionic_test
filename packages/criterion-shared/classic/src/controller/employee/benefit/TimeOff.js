Ext.define('criterion.controller.employee.benefit.TimeOff', function() {

    return {
        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_benefit_time_off',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext',
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        onBeforeEmployeeChange : function() {
            let vm = this.getViewModel();

            if (!vm) {
                return;
            }

            vm.set('employeeId', this.getEmployeeId());
        },

        onEmployeeChange : function() {
            this.load();
        },

        handleActivate : function() {
            this.load();
        },

        load : function() {
            var me = this,
                vm = this.getViewModel(),
                employeeId = vm.get('employeeId'),
                employerWorkLocations = vm.getStore('employerWorkLocations');

            if (!employeeId || !this.identity.employee) {
                return
            }

            if (!employerWorkLocations.isLoaded() && !employerWorkLocations.isLoading()) {
                employerWorkLocations.loadWithPromise().then(function() {
                    me._setTimezoneData();
                    vm.set('activeViewIdx', 0);
                    me.loadChildPages();
                });
            } else {
                me._setTimezoneData();
                me.loadChildPages();
            }
        },

        _setTimezoneData : function() {
            var me = this,
                vm = this.getViewModel(),
                employerWorkLocations = vm.getStore('employerWorkLocations'),
                employee = me.identity.employee,
                employerWorkLocationId,
                employerLocation,
                timezoneCd,
                timezoneDescription,
                timezoneCdDefaultRecord = criterion.CodeDataManager.getCodeDetailRecord('id', criterion.Utils.getCurrentTimezoneCode(), criterion.consts.Dict.TIME_ZONE);

            employerWorkLocationId = employee ? employee.getEmployeeWorkLocation().get('employerWorkLocationId') : null;
            if (employerWorkLocationId) {
                employerLocation = employerWorkLocations.getById(employerWorkLocationId);
                if (employerLocation) {
                    timezoneCd = employerLocation.getWorkLocation().get('timezoneCd');
                }
            }

            timezoneCd = timezoneCd || (timezoneCdDefaultRecord ? timezoneCdDefaultRecord.getId() : null);
            timezoneDescription = timezoneCd ? criterion.CodeDataManager.getCodeDetailRecord('id', timezoneCd, criterion.consts.Dict.TIME_ZONE).get('description') : '';

            vm.set({
                timezoneCd : timezoneCd,
                timezoneDescription : timezoneDescription
            });
        },

        loadChildPages : function() {
            var vm = this.getViewModel();

            if (!vm.get('employeeId')) {
                return;
            }

            var activeViewIdx = vm.get('activeViewIdx');

            if (activeViewIdx === 0) {
                this.lookup('list').fireEvent('loadAction');
            } else if (activeViewIdx === 1) {
                this.lookup('calendar').fireEvent('loadAction');
            }
        },

        handleAddClick : function() {
            this.lookup('list').fireEvent('addNewAction');
        },

        handleSwitchToGridView : function() {
            this.getViewModel().set('activeViewIdx', 0);
            this.loadChildPages();
        },

        handleSwitchToCalendarView : function() {
            this.getViewModel().set('activeViewIdx', 1);
            this.loadChildPages();
        },

        onYearNext : function() {
            var vm = this.getViewModel();

            vm.set('year', vm.get('year') + 1);

            if (vm.get('isList')) {
                this.lookup('list').fireEvent('loadAction');
            } else {
                this.lookup('calendar').fireEvent('updateCalendar');
            }

        },

        onYearPrev : function() {
            var vm = this.getViewModel();

            vm.set('year', vm.get('year') - 1);

            if (vm.get('isList')) {
                this.lookup('list').fireEvent('loadAction');
            } else {
                this.lookup('calendar').fireEvent('updateCalendar');
            }
        }
    }
});
