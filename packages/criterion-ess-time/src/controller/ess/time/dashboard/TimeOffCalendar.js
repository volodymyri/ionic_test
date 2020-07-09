Ext.define('criterion.controller.ess.time.dashboard.TimeOffCalendar', function() {

    return {
        extend : 'criterion.controller.employee.benefit.TimeOffCalendar',

        alias : 'controller.criterion_selfservice_time_dashboard_time_off_calendar',

        requires : [
            'criterion.view.ess.time.timeOffHistory.TimeOffForm'
        ],

        editorClass : 'criterion.view.ess.time.timeOffHistory.TimeOffForm',
        
        _dateSelected : function(input) {
            var vm = this.getViewModel(),
                editorVm,
                editorRecord,
                view = this.getView(),
                parentView = view.up('criterion_selfservice_time_time_off_dashboard');

            this.callParent(arguments);
            if (!this.editor) {
                return;
            }

            editorVm = this.editor.getViewModel();
            editorVm.set({
                employeeId : vm.get('employeeId'),
                managerMode : vm.get('managerMode')
            });
            editorRecord = editorVm.get('record');

            if (editorRecord && editorRecord.phantom) {
                editorRecord.set('timeOffStatusCode', criterion.Consts.WORKFLOW_STATUSES.NOT_SUBMITTED);
            }

            parentView && parentView.el.setOpacity(0);

            this.editor.on('submitted', this.load, this);

            this.editor.on('close', function() {
                parentView && parentView.el.setOpacity(1);
            }, this);
        },

        onYearNext : function() {
            var vm = this.getViewModel();

            vm.set('year', vm.get('year') + 1);
            this.createCalendars(); 
        },

        onYearPrev : function() {
            var vm = this.getViewModel();

            vm.set('year', vm.get('year') - 1);
            this.createCalendars(); 
        }
    }
});
