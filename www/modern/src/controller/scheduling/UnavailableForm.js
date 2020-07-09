Ext.define('criterion.controller.scheduling.UnavailableForm', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_scheduling_unavailable_form',

        init : function() {
            var vm = this.getViewModel();

            this.callParent(arguments);

            vm.bind({
                bindTo : '{record}'
            }, function(record) {
                vm.set({
                    startTime : record ? record.get('startTimestamp') : null,
                    endTime : record ? record.get('endTimestamp') : null
                })
            });
        },

        handleSave : function() {
            let record = this.getRecord(),
                view = this.getView(),
                vm = this.getViewModel(),
                current = new Date(),
                changes,
                startTimeVal = vm.get('startTime'),
                endTimeVal = vm.get('endTime'),
                startTime,
                endTime;

            if (!view.isValid()) {
                return;
            }

            startTime = Ext.isDate(startTimeVal) ? startTimeVal : Ext.Date.parse(startTimeVal, criterion.consts.Api.TIME_FORMAT);
            endTime = Ext.isDate(endTimeVal) ? endTimeVal : Ext.Date.parse(endTimeVal, criterion.consts.Api.TIME_FORMAT);

            if (!record.get('fullDay')) {
                if (!startTime && !endTime) {
                    criterion.Utils.toast(i18n.gettext('Please check start and end time'));
                    return;
                }

                record.set({
                    startTimestamp : criterion.Utils.addDateAndTime(record.get('startTimestamp'), startTime),
                    endTimestamp : criterion.Utils.addDateAndTime(record.get('endTimestamp'), endTime)
                })
            }

            if (!record.get('recurring')) {
                record.set('recurringEndDate', null);
            }

            if (record.get('startTimestamp') > record.get('endTimestamp')) {
                criterion.Utils.toast(i18n.gettext('End date must be later than start date.'));
                return;
            }

            if (record.get('recurring')) {
                changes = record.getChanges();

                if (changes.recurringEndDate &&
                    (
                        changes.recurringEndDate < record.get('startTimestamp')
                    )
                ) {
                    criterion.consts.Error.showMessage(criterion.consts.Error.RESULT_CODES.RECURRING_END_DATE_BEFORE_START);
                    return;
                }

                if (changes.recurringEndDate &&
                    (
                        changes.recurringEndDate > Ext.Date.add(current, Ext.Date.YEAR, 1)
                    )
                ) {
                    criterion.consts.Error.showMessage(criterion.consts.Error.RESULT_CODES.RECURRING_END_DATE_TOO_LATE);
                    return;
                }

                if (changes.recurringEndDate &&
                    (
                        changes.recurringEndDate < Ext.Date.add(current, Ext.Date.DAY, 1)
                    )
                ) {
                    criterion.consts.Error.showMessage(criterion.consts.Error.RESULT_CODES.RECURRING_END_DATE_TOO_EARLY);
                    return;
                }
            }

            this.callParent(arguments);
        }

    };

});
