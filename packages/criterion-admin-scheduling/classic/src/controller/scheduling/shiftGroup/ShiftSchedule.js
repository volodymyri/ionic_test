Ext.define('criterion.controller.scheduling.shiftGroup.ShiftSchedule', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_scheduling_shift_group_shift_schedule',

        onShow() {
            let cancelBtn = this.lookup('cancelBtn');

            Ext.defer(_ => {
                cancelBtn.focus();
            }, 100);
        },

        handleCancel() {
            this.fireViewEvent('cancel');
        },

        handleChange() {
            let vm = this.getViewModel(),
                view = this.getView();

            if (view.isValid() && this.validateIntervals()) {
                this.fireViewEvent('changeState', vm.get('shiftSchedule'));
            }
        },

        validateIntervals() {
            let me = this,
                vm = this.getViewModel(),
                shiftSchedule = vm.get('shiftSchedule'),
                res = true;

            shiftSchedule.each(schedule => {
                if (schedule.get('title')) {
                    return;
                }

                let sId = schedule.getId(),
                    start = me.convertTimeToCurrentDate(schedule.get('startTime')),
                    end = me.convertTimeToCurrentDate(schedule.get('endTime')),
                    endIsMidnight = end ? end.getHours() === 0 && end.getMinutes() === 0 : true;

                if (Ext.Date.isEqual(start, end) && !endIsMidnight) {
                    me.lookup(`start_${sId}`).setError(i18n.gettext('Dates of interval should be different'));
                    res = false;
                    return;
                }

                if (end < start && !endIsMidnight) {
                    me.lookup(`start_${sId}`).setError(i18n.gettext('Start time should be less than end time'));
                    res = false;
                    return;
                }

                shiftSchedule.each(inSchedule => {
                    if (inSchedule.get('title') || inSchedule.getId() === sId) {
                        return;
                    }

                    let inStart = me.convertTimeToCurrentDate(inSchedule.get('startTime')),
                        inEnd = me.convertTimeToCurrentDate(inSchedule.get('endTime'));

                    if (Ext.Date.between(start, inStart, inEnd)) {
                        me.lookup(`start_${sId}`).setError(i18n.gettext('Value crosses an existing interval'));
                        res = false;
                    }

                    if ((end !== inStart && !endIsMidnight ) && Ext.Date.between(end, inStart, inEnd)) {
                        me.lookup(`end_${sId}`).setError(i18n.gettext('Value crosses an existing interval'));
                        res = false;
                    }
                });
            });

            return res;
        },

        convertTimeToCurrentDate(value) {
            return Ext.Date.parse(Ext.Date.format(value, criterion.consts.Api.TIME_FORMAT), criterion.consts.Api.TIME_FORMAT);
        },

        handleAddSchedule() {
            let vm = this.getViewModel(),
                shiftSchedule = vm.get('shiftSchedule');

            shiftSchedule.add({
                day : vm.get('day'),
                shiftId : vm.get('shiftId')
            });
        },

        handleRemoveSchedule(cmp) {
            let vm = this.getViewModel(),
                shiftSchedule = vm.get('shiftSchedule');

            criterion.Msg.confirmDelete({
                    title : i18n.gettext('Delete'),
                    message : i18n.gettext('Do you want to delete this time interval?')
                }, btn => {
                    if (btn === 'yes') {
                        shiftSchedule.remove(cmp.$record);
                    }
                }
            );
        }
    }
});
