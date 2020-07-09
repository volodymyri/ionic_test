Ext.define('criterion.controller.ess.time.timeOffHistory.TimeOffCalendar', function() {

    return {
        extend : 'criterion.controller.employee.benefit.TimeOffCalendar',

        alias : 'controller.criterion_selfservice_time_time_off_history_time_off_calendar',

        requires : [
            'criterion.view.ess.time.timeOffHistory.TimeOffForm'
        ],

        editorClass : 'criterion.view.ess.time.timeOffHistory.TimeOffForm',

        _dateSelected : function(input) {
            var editorVm,
                editorRecord;

            this.callParent(arguments);
            editorVm = this.editor.getViewModel();
            editorVm.set('employeeId', this.getViewModel().get('employeeId'));
            editorRecord = editorVm.get('record');

            if (editorRecord && editorRecord.phantom) {
                editorRecord.set('timeOffStatusCode', criterion.Consts.WORKFLOW_STATUSES.NOT_SUBMITTED);
            }
            this.editor.on('submitted', this.load, this);
        }
    }
});
