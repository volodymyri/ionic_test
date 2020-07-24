Ext.define('ess.controller.time.timeOff.Detail', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.ess_modern_time_timeoff_detail',

        getTimeOffDate : function(record, timeOffDateIn) {
            var startTime = record.get('startTime'),
                timeOffDate = timeOffDateIn || record.get('timeOffDate');

            return Ext.Date.parse(
                Ext.Date.format(timeOffDate, 'Y-m-d') + ' ' + (startTime ? Ext.Date.format(startTime, 'g:i A') : '12:00 AM'),
                'Y-m-d g:i A'
            );
        },

        handleCancel : function() {
            var me = this,
                record = this.getRecord();

            if (record.dirty) {
                Ext.Msg.show({
                    ui : 'rounded',
                    title : i18n.gettext('Save'),
                    message : i18n.gettext('Do you want to save this Time Off Detail before closing it?'),
                    buttons : [
                        {text : i18n.gettext('Don\'t Save'), itemId : 'no', cls : 'cancel-btn'},
                        {
                            text : i18n.gettext('Save'),
                            itemId : 'yes'
                        }
                    ],
                    prompt : false,
                    scope : this,
                    fn : function(btn) {
                        if (btn === 'yes') {
                            me.handleSave();
                        } else {
                            me.lookup('allDayDetailToggler').setDisabled(false);
                            me.superclass.handleCancel.apply(me, arguments);
                        }
                    }
                });
            } else {
                me.callParent(arguments);
            }
        },

        handleSave : function() {
            var me = this,
                form = me.getView(),
                record = me.getRecord();

            if (record && form.isValid()) {
                record.getProxy().setUrl(criterion.consts.Api.API.MOBILE_EMPLOYEE_TIME_OFF_DETAIL);
                record.set('timeOffDate', this.getTimeOffDate(record));
                me.callParent(arguments);
            }
        }
    };
});
