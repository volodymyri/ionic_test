Ext.define('criterion.controller.ess.time.dashboard.timeOffHistory.TimeOffList', function() {

    return {

        extend : 'criterion.controller.employee.benefit.TimeOffList',

        alias : 'controller.criterion_selfservice_time_dashboard_time_off_history_time_off_list',

        suppressIdentity : ['employeeContext'],

        onTimeOffsLoad : function() {
            var vm = this.getViewModel(),
                timeOffs = vm.getStore('timeOffs'),
                showTaken = vm.get('showTaken');

            timeOffs.clearFilter();
            timeOffs.filter(function(timeOff) {
                var date = timeOff.get('endDate'),
                    now = new Date();

                if (date) {
                    return !showTaken ? date > now : date < now;
                }

                return false;
            });
        },

        onYearNext : function() {
            let vm = this.getViewModel(),
                view = this.getView(),
                year = vm.get('year'),
                showTaken = vm.get('showTaken'),
                currentYear = (new Date()).getFullYear();

            if (currentYear === year && showTaken) {
                view.fireEvent('switchToPlanned');
                this.showPlanned(true);
            } else {
                vm.set('year', year + 1);
                this.load();
            }
        },

        onYearPrev : function() {
            let vm = this.getViewModel(),
                view = this.getView(),
                year = vm.get('year'),
                showTaken = vm.get('showTaken'),
                currentYear = (new Date()).getFullYear();

            if (currentYear === year && !showTaken) {
                view.fireEvent('switchToTaken');
                this.showTaken(true);
            } else {
                vm.set('year', year - 1);
                this.load();
            }
        },

        createEditor : function(editor, record) {
            var vm = this.getViewModel(),
                editorEx = this.callParent(arguments);

            editorEx.getViewModel().set({
                employeeId : vm.get('employeeId'),
                managerMode : vm.get('managerMode')
            });
            editorEx.on('submitted', this.load, this);

            return editorEx;
        },

        showTaken : function(shiftYear = false) {
            let vm = this.getViewModel(),
                year = (new Date()).getFullYear();

            vm.set({
                year : shiftYear === true ? year - 1 : year,
                showTaken : true
            });

            this.load();
        },

        showPlanned : function(shiftYear = false) {
            let vm = this.getViewModel(),
                year = (new Date()).getFullYear();

            vm.set({
                year : shiftYear === true ? year + 1 : year,
                showTaken : false
            });

            this.load();
        },

        permissionAction : function(record) {
            return record && (record.get('timeOffStatusCode') === criterion.Consts.WORKFLOW_STATUSES.NOT_SUBMITTED ||
                record.get('timeOffStatusCode') === criterion.Consts.WORKFLOW_STATUSES.REJECTED);
        },

        handleSubmitAction : function(rec) {
            var me = this;

            if (!this.permissionAction(rec)) {
                criterion.Utils.toast(i18n.gettext('You can\'t submit in this status'));
                return;
            }

            criterion.Msg.confirm(
                i18n.gettext('Submit record'),
                Ext.String.format(i18n.gettext('Do you want to submit {0} record?'), rec.get(me.getRecordTitleField()) || 'the'),
                function(btn) {
                    if (btn === 'yes') {
                        criterion.Api.requestWithPromise({
                                url : criterion.consts.Api.API.EMPLOYEE_TIME_OFF_SUBMIT + '?timeOffId=' + rec.getId() + '&employeeId=' + me.getViewModel().get('employeeId'),
                                method : 'PUT'
                            }
                        )
                        .then(function() {
                            me.load();
                        });
                    }
                    rec.underAction = false;
                }
            );
        },

        handleRemoveAction : function(rec) {
            if (!this.permissionAction(rec)) {
                criterion.Utils.toast(i18n.gettext('You can\'t remove in this status'));
                return;
            }

            this.callParent(arguments);
        }
    }
});
