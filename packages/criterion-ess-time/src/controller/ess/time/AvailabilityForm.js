Ext.define('criterion.controller.ess.time.AvailabilityForm', function() {

    return {
        alias : 'controller.criterion_selfservice_time_availability_form',

        extend : 'criterion.controller.WeekFormView',

        requires : [
            'criterion.model.employee.UnavailableBlock'
        ],

        updateRecord : function(record, handler) {
            var newRec,
                startTimestamp = this.lookupReference('startDate').getValue(),
                endTimestamp = this.lookupReference('endDate').getValue(),
                fullDay;

            this.getView().updateRecord(record);
            if (!record.phantom) {
                fullDay = record.get('fullDay');

                newRec = Ext.create('criterion.model.employee.UnavailableBlock', {
                    id : record.getId(),
                    fullDay : !fullDay
                });
                newRec.phantom = false;

                newRec.set({
                    employeeId : record.get('employeeId'),
                    name : record.get('name'),
                    timezoneCd : record.get('timezoneCd'),
                    startTimestamp : fullDay ? Ext.Date.clearTime(startTimestamp) : startTimestamp,
                    endTimestamp : fullDay ? criterion.Utils.addDateAndTime(Ext.Date.clearTime(endTimestamp), Ext.Date.parse('23:59:59', criterion.consts.Api.TIME_FORMAT_FULL)) : endTimestamp,
                    fullDay : fullDay,
                    recurringEndDate : record.get('recurringEndDate'),
                    recurring : record.get('recurring')
                });
            } else {
                newRec = record;
            }

            handler.call(this, newRec);
        },

        handleRecordUpdate : function(record) {
            var vm = this.getViewModel();

            if (!record.get('recurring')) {
                record.set('recurringEndDate', null);
            }

            record.getProxy().setExtraParam('notify', vm.get('managerMode') && vm.get('notifyEmployee'));
            this.callParent(arguments);
        },

        timeIntervalInValid : function() {
            var vm = this.getViewModel(),
                res = false,
                start = vm.get('record.startTimestamp'),
                end = vm.get('record.endTimestamp'),
                recurring = vm.get('record.recurring'),
                MAX_RECURRING_MINUTES = 60 * 168;

            if (start > end) {
                res = i18n.gettext('Start date should be less than an end date');
            } else if (recurring && Ext.Date.diff(start, end, Ext.Date.MINUTE) > MAX_RECURRING_MINUTES) {
                res = i18n.gettext('Wrong recurring block format. Recurring block can\'t be more than 168 hours.');
            }

            return res;
        }
    };


});
