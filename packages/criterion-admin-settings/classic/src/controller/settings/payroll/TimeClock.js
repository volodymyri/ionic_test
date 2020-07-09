Ext.define('criterion.controller.settings.payroll.TimeClock', function() {

    return {
        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_payroll_settings_time_clock',

        handleAfterRecordLoad : function(timeClockRecord) {
            this.lookupReference('employeeGroupsCombo').loadValuesForRecord(timeClockRecord);

            if (!timeClockRecord.phantom) {
                this.lookupReference('timeClockLogo').updateLogo(timeClockRecord.get('id'), 'TIME_CLOCK');
            } else {
                this.lookupReference('timeClockLogo').setNoLogo();
            }

            this.callParent(arguments);
        },

        onAfterSave : function(view, record) {
            var me = this;

            me.lookupReference('employeeGroupsCombo').saveValuesForRecord(record).then({
                success : function() {
                    view.fireEvent('afterSave', view, record);
                    me.close();
                }
            });
        }

    };

});

