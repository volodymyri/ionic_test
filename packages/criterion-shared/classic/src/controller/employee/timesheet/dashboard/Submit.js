Ext.define('criterion.controller.employee.timesheet.dashboard.Submit', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_timesheet_dashboard_submit',

        init : function() {
            this.load = Ext.Function.createBuffered(this.load, 500, this);

            this.callParent(arguments);
        },

        handleShow : function() {
            this.load();
        },

        handleCancel : function() {
            this.getView().fireEvent('cancel')
        },

        load : function() {
            let view = this.getView(),
                vm = this.getViewModel(),
                store = vm.getStore('massSubmit');

            view.setLoading(true);

            store.loadWithPromise({
                params : vm.get('loadParams')
            }).then(() => {
                let isManualDay = store.find('isManualDay', true, 0, false, false, true) !== -1;

                vm.set('isManualDay', isManualDay);
            }).always(() => {
                view.setLoading(false);
            });
        },

        handleMassSubmit : function() {
            let view = this.getView(),
                selections = this.lookup('massSubmitGrid').getSelection(),
                timesheetIds;

            timesheetIds = Ext.Array.map(Ext.Array.flatten(Ext.Array.map(selections, function(val) {
                return val.get('timesheetIds').split(',');
            })), function(value) {
                return parseInt(value, 10);
            });

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.DASHBOARD_SUBORDINATE_TIMESHEETS_MASS_SUBMIT,
                method : 'PUT',
                jsonData : {
                    timesheetIds : timesheetIds
                }
            }).then(function(count) {
                criterion.Msg.showMsg(
                    i18n.gettext('Success'),
                    count + ' ' + i18n.gettext(i18n.gettext('timesheets submitted')),
                    criterion.Msg.INFO,
                    function() {
                        view.fireEvent('afterSubmit');
                    }
                );
            }, function() {
                criterion.Utils.toast(i18n.gettext('Something went wrong'));
            });
        }
    }
});
