Ext.define('ess.controller.time.timeOff.Details', function() {

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.ess_modern_time_timeoff_details',

        getTzData : function() {
            var timezoneCd,
                timezoneDescription;

            timezoneCd = ess.Application.getEmployeeTimezoneCd();
            timezoneDescription = timezoneCd ? criterion.CodeDataManager.getCodeDetailRecord('id', timezoneCd, criterion.consts.Dict.TIME_ZONE).get('description') : '';

            return {
                timezoneCd : timezoneCd,
                timezoneDescription : timezoneDescription
            }
        },

        getEmptyRecord : function() {
            var tzData = this.getTzData();

            return {
                timezoneCd : tzData.timezoneCd,
                timezoneDescription : tzData.timezoneDescription,
                employeeTimeOffId : this.getViewModel().get('record').getId()
            };
        },

        load : function() {
            var timeOffRecord = this.getViewModel().get('record'),
                tzData = this.getTzData();

            if (!timeOffRecord || !timeOffRecord.isModel || timeOffRecord.phantom) {
                return;
            }

            this.getView().getStore().getProxy().setUrl(criterion.consts.Api.API.MOBILE_EMPLOYEE_TIME_OFF_DETAIL);

            this.callParent([
                {
                    params : {
                        employeeTimeOffId : timeOffRecord.getId()
                    },
                    callback : function(recs) {
                        Ext.each(recs, function(rec) {
                            rec.set({
                                timezoneCd : tzData.timezoneCd,
                                timezoneDescription : tzData.timezoneDescription
                            });
                        });
                    }
                }
            ]);
        },

        handleActivate : function() {
            if (this.checkViewIsActive()) {
                Ext.Function.defer(this.load, 50, this);
            }
        }
    };
});
