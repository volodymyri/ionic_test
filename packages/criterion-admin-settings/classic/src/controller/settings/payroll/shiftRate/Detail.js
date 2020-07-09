Ext.define('criterion.controller.settings.payroll.shiftRate.Detail', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_shift_rate_detail',

        requires : [
            'criterion.view.MultiRecordPicker'
        ],

        loadRecord : function(record) {
            var weekDaysCombo = this.lookupReference('weekDaysCombo'),
                weekDaysStore = weekDaysCombo.getStore(),
                weekDaysValues = [];

            weekDaysStore.each(function(wdRecord) {
                var wdValue = wdRecord.get('value');

                if (!(~record.get('weekPattern') & wdValue)) {
                    weekDaysValues.push(wdValue)
                }
            });

            weekDaysCombo.setValue(weekDaysValues);
        },

        handleRecordUpdate : function(record) {
            var hours = record.get('hours'),
                minutes = record.get('minutes'),
                selectedWeekDays = this.lookupReference('weekDaysCombo').getValue(),
                value = Ext.Array.reduce(selectedWeekDays, function(prev, val) {
                    return prev + val;
                }, 0);

            if (hours * 60 + minutes < 0) {
                criterion.Msg.warning({
                    title : i18n.gettext('Invalid Time'),
                    message : i18n.gettext('Start Time must less or equal End Time.')
                });
                return false;
            }

            record.set('weekPattern', value);

            this.callParent(arguments);
        },

        onBeforeSelectEndTime : function(field, dateRecord) {
            var vm = this.getViewModel(),
                endTime = dateRecord.get('date'),
                startTime = vm.get('record.startTime');

            if (!Ext.isDate(startTime) && Ext.isDate(endTime)) {
                vm.set('record.startTime', new Date(endTime.getTime() - vm.get('record.hours') * 1000 * 60 * 60 - vm.get('record.minutes') * 1000 * 60));
            }
        }

    };
});
