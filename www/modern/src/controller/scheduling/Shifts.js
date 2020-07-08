Ext.define('ess.controller.scheduling.Shifts', function() {

    return {

        extend : 'ess.controller.scheduling.Base',

        alias : 'controller.ess_modern_scheduling_shifts',

        load(opts) {
            let view = this.getView(),
                parent = view.up(view.mainXtype),
                vm = parent.getViewModel(),
                timezoneRec = ess.Application.getEmployeeTimezoneRecord();

            vm.set('timezone', (timezoneRec ? timezoneRec.get('description') : ''));

            return this.callParent(arguments);
        },

        getEmptyRecord() {
            return {
                employeeId : this.getViewModel().get('employeeId')
            };
        },

        handleGoPrevWeek() {
            let view = this.getView(),
                parent = view.up(view.mainXtype),
                vm = parent.getViewModel(),
                viewStart = vm.get('viewStart');

            vm.set({
                viewStart : Ext.Date.add(viewStart, Ext.Date.DAY, -7),
                viewEnd : Ext.Date.add(viewStart, Ext.Date.DAY, -1)
            });
        },

        handleGoNextWeek() {
            let view = this.getView(),
                parent = view.up(view.mainXtype),
                vm = parent.getViewModel(),
                viewEnd = vm.get('viewEnd');

            vm.set({
                viewStart : Ext.Date.add(viewEnd, Ext.Date.DAY, 1),
                viewEnd : Ext.Date.add(viewEnd, Ext.Date.DAY, 7)
            });
        }
    };
});
