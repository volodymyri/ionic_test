Ext.define('criterion.controller.settings.payroll.Schedule', function() {

    return {
        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_payroll_schedule',

        handleAfterRecordLoad : function() {
            this.lookupReference('periodsList').getController().load();
        },

        onAfterSave : function(view, record) {
            var vm = this.getViewModel();

            view.fireEvent('afterSave', view, record);

            if (!this.isNewRecord) {
                this.close();
            } else {
                vm.set('record', null);
                // notify() doesn't want to work in this case
                Ext.defer(function() {
                    vm.set('record', record);
                }, 100);
            }
        },

        onLoadSchedulePayrollPeriods : function(store, data) {
            var years = {},
                me = this,
                vm = this.getViewModel(),
                yearsStore = vm.getStore('years'),
                periodEndDateRec,
                last;

            yearsStore.removeAll();
            vm.set('currentYear', null);

            Ext.each(data, function(periodRec) {
                var year = periodRec.get('year');

                years[year] = {
                    id : year,
                    title : year.toString()
                };
            });

            yearsStore.add(Ext.Object.getValues(years));
            last = yearsStore.last();
            Ext.defer(function() {
                last && vm.set('currentYear', last.getId());
                Ext.defer(function() {
                    me.lookupReference('periodsList').lookupReference('yearCombo').resetOriginalValue();
                }, 100);
            }, 200);

            periodEndDateRec = Ext.Array.max(data, function(a, b) {
                return a.get('periodEndDate') > b.get('periodEndDate') ? 1 : -1;
            });

            periodEndDateRec && vm.set('maxEndDate', periodEndDateRec.get('periodEndDate'));
        }
    };
});
