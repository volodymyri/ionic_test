Ext.define('criterion.controller.WeekFormView', function() {

    return {
        alias : 'controller.criterion_week_form_view',

        extend : 'criterion.controller.FormView',

        getRecord : function() {
            return this.getViewModel().get('record');
        },

        /**
         * Check a time interval
         * @returns {boolean|string}
         */
        timeIntervalInValid : function() {
            var vm = this.getViewModel(),
                res = false,
                start = vm.get('record.startTimestamp'),
                end = vm.get('record.endTimestamp');

            if (start > end) {
                res = i18n.gettext('End date must be later than start date.');
            }

            return res;
        },

        handleSubmitClick : function() {
            var me = this,
                form = me.getView(),
                record = this.getRecord(),
                timeIntervalInValid = this.timeIntervalInValid();

            if (timeIntervalInValid) {
                me.lookupReference('endDate').markInvalid(timeIntervalInValid);
                return;
            } else {
                me.lookupReference('endDate').clearInvalid();
            }

            if (form.isValid()) {
                me.updateRecord(record, this.handleRecordUpdate);
            } else {
                me.focusInvalidField();
            }
        }
    };

});
