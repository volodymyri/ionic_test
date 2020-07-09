Ext.define('criterion.vm.timesheet.vertical.Task', function() {

    return {

        extend : 'Ext.app.ViewModel',

        alias : 'viewmodel.criterion_timesheet_vertical_task',

        data : {
            /**
             * @type criterion.model.employee.timesheet.vertical.TaskDetail
             */
            taskDetail : null,
            /**
             * Determine if the task is first task in store; need to set externally.
             */
            isFirstTask : false,
            /**
             * Currently selected paycode.
             * @type criterion.model.employee.timesheet.Income
             */
            selectedPaycode : null,
            /**
             * Gray out row if isApplicableToApprover is false.
             */
            isApplicableToApprover : null
        },

        formulas : {
            isPhantom : data => data('taskDetail') ? data('taskDetail').phantom : false,

            isUnits : data => data('selectedPaycode.isUnits'),
            
            isCompEarned : data => data('selectedPaycode.isCompEarned'),
            
            isNotIncome : data => data('selectedPaycode.paycode') !== criterion.Consts.PAYCODE.INCOME,

            canEditTask : data => data('canEditAction') && data('taskDetail.isUpdatable') && data('isButtonEntryType') ? (data('managerMode') || data('isPhantom') || !data('taskDetail.paycodeDetail.isTrackable')) : !data('disableInput'),

            isStartedTask : data => {
                let timesheetVertical = data('timesheetVertical'),
                    startedTask = timesheetVertical.get('startedTask'),
                    taskDetail = data('taskDetail');

                if (startedTask && taskDetail && startedTask.id === taskDetail.get('timesheetTaskId')) {
                    return true;
                }

                return false;
            },

            canEditAnyEntryType : data => data('canEditAction') && data('taskDetail.isUpdatable'),

            canDeleteTask : data => data('canEditTask') && data('taskDetail.isRemovable') && !data('taskDetail.isApprovedTimeOff'),

            taskNotApplicable : data => data('isApplicableToApprover') === false,

            isTaskDisabled : data => !data('isPhantom') || data('taskNotApplicable'),

            disablePaycodeChange : data => !(data('isPhantom') || data('taskDetail.paycodeDetail.isIncome')) || data('taskNotApplicable'),

            isShowTime : {
                bind : {
                    bindTo : '{selectedPaycode}',
                    deep : true
                },
                get : function() {
                    let timesheetVertical = this.get('timesheetVertical'),
                        timesheetType = timesheetVertical && timesheetVertical.getTimesheetType && timesheetVertical.getTimesheetType(),
                        isShowTime = timesheetType && timesheetType.get('isShowTime');

                    return isShowTime;
                }
            },

            hasInOut : data => data('isUnits') || data('isCompEarned') || data('taskDetail.isFullDayTimeOff'),

            hasHrsItems : data => data('isUnits') || data('isCompEarned'),

            currentDayCls : data => Ext.Date.isEqual(Ext.Date.clearTime(new Date(data('timesheetDay.date'))), Ext.Date.clearTime(new Date())) ? 'current-day' : ''
        }
    }
});
