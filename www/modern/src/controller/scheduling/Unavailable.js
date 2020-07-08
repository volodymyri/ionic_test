Ext.define('ess.controller.scheduling.Unavailable', function() {

    return {

        extend : 'ess.controller.scheduling.Base',

        alias : 'controller.ess_modern_scheduling_unavailable',

        getEmptyRecord() {
            let timezoneCd,
                timezoneDescription;

            timezoneCd = ess.Application.getEmployeeTimezoneCd();
            timezoneDescription = timezoneCd ? criterion.CodeDataManager.getCodeDetailRecord('id', timezoneCd, criterion.consts.Dict.TIME_ZONE).get('description') : '';

            return {
                employeeId : this.getViewModel().get('employeeId'),
                timezoneCd : timezoneCd,
                timezoneDescription : timezoneDescription
            };
        },

        load(opts) {
            let store = this.getView().getStore(),
                view = this.getView(),
                vm = this.getViewModel(),
                timezoneCd = ess.Application.getEmployeeTimezoneCd(),
                timezoneRec = ess.Application.getEmployeeTimezoneRecord(),
                employeeId = vm.get('employeeId');

            vm.set('timezone', (timezoneRec ? timezoneRec.get('description') : ''));

            if (Ext.isFunction(view.getPreventStoreLoad) && view.getPreventStoreLoad()) {
                return;
            }

            if (store) {
                store.loadWithPromise({
                    params : Ext.apply({
                        employeeId : employeeId
                    }, opts || {})
                }).then(function(recs) {
                    Ext.each(recs, function(rec) {
                        rec.set('timezoneCd', timezoneCd);
                    });
                });
            }
        }
    };
});
