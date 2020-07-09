Ext.define('criterion.controller.settings.hr.WorkPeriod', function() {

    return {
        alias : 'controller.criterion_settings_work_period',

        extend : 'criterion.controller.FormView',

        handleAfterRecordLoad : function(record) {
            let daysContainer = this.lookup('daysContainer'),
                workPeriodId = record.getId(),
                days = record.days();

            Ext.Array.each(criterion.Consts.DAYS_OF_WEEK_ARRAY, (dayName, index) => {
                let day;

                day = days.findRecord('dayOfWeek', index + 1);

                if (!day) {
                    day = days.add({
                        workPeriodId : workPeriodId,
                        dayOfWeek : index + 1
                    })[0];
                }

                if (day.details().count() === 0) {
                    day.details().add({
                        workPeriodDayId : day.getId()
                    });
                }
            });

            days.sort('dayOfWeek', 'ASC');

            Ext.defer(() => {
                daysContainer.fireEvent('ready');
            }, 100);
        },

        handleSubmitClick() {
            let record = this.getRecord(),
                days = record.days();

            if (!days.findRecord('isActive', true)) {
                criterion.Msg.error({
                    title : i18n.gettext('Error'),
                    message : i18n.gettext('There must be at least one active day of the week in the period.')
                })

                return;
            }

            if (!this.lookup('daysContainer').validate()) {
                return;
            }

            days.each(day => {
                let details = day.details();

                if (day.get('isActive') && (details.getModifiedRecords().length || details.getRemovedRecords().length)) {
                    day.set('_upDetails_', true);
                }

                if (!day.get('isActive')) {
                    details.removeAll();
                }
            });

            this.callParent(arguments);
        }
    };

});
