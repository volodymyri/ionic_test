Ext.define('ess.controller.time.TimeOffsGrid', function() {

    return {

        extend : 'criterion.controller.employee.GridView',

        alias : 'controller.ess_modern_time_timeoffs_grid',

        getEmptyRecord : function() {
            var timezoneCd,
                timezoneDescription;

            timezoneCd = ess.Application.getEmployeeTimezoneCd();
            timezoneDescription = timezoneCd ? criterion.CodeDataManager.getCodeDetailRecord('id', timezoneCd, criterion.consts.Dict.TIME_ZONE).get('description') : '';

            return {
                employeeId : this.getViewModel().get('employeeId'),
                statusCd : criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.WORKFLOW_STATUSES.NOT_SUBMITTED, criterion.consts.Dict.WORKFLOW_STATE).getId(),
                timeOffStatusCode : criterion.Consts.WORKFLOW_STATUSES.NOT_SUBMITTED,
                timezoneCd : timezoneCd,
                timezoneDescription : timezoneDescription
            };
        },

        onAddSpecificType : function(timeOffTypeCd) {
            var me = this,
                record = this.getEmptyRecord();

            this.toggleAutoSync(false);
            record['timeOffTypeCd'] = timeOffTypeCd;

            me.getView().fireEvent('doAdd', me.addRecord(record));
        }
    };
});
