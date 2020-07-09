Ext.define('criterion.controller.employee.benefit.TimeOffList', function() {

    return {
        extend : 'criterion.controller.employee.GridView',

        alias : 'controller.criterion_employee_benefit_time_off_list',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext',
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        suppressIdentity : ['employeeGlobal'],
        loadRecordOnEdit : false,

        getEmptyRecord : function() {
            var status = criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.WORKFLOW_STATUSES.NOT_SUBMITTED, criterion.consts.Dict.WORKFLOW_STATE);
            if (status) {
                return {
                    employeeId : this.getViewModel().get('employeeId'),
                    statusCd : status.getId(),
                    timeOffStatusCode : criterion.Consts.WORKFLOW_STATUSES.NOT_SUBMITTED,
                    timezoneCd : this.timezoneCd
                };
            } else {
                // Prevent crash while there is can be call before CodeDetail store is initialized
                return null;
            }
        },

        createEditor : function(editorCfg, record) {
            var vm = this.getViewModel();

            this.setConnectedView(this.getView().up());

            editorCfg.viewModel = {
                data : {
                    timezoneCd : this.timezoneCd,
                    timezoneDescription : this.timezoneDescription,
                    managerMode : vm.get('managerMode')
                }
            };

            return this.callParent(arguments);
        },

        load : function() {
            var me = this,
                vm = this.getViewModel(),
                view = this.getView(),
                store = this.getView().getStore();

            if (!vm.get('employeeId') || !this.identity.employee || !vm.get('timezoneCd')) {
                return;
            }

            view.setLoading(true);
            this.timezoneCd = vm.get('timezoneCd');
            this.timezoneDescription = vm.get('timezoneDescription');

            store.suspendEvents(true);

            return store.loadWithPromise({
                params : {
                    year : vm.get('year'),
                    employeeId : vm.get('employeeId'),
                    showApproved : vm.get('showApproved')
                }
            }).then(function(recs) {
                Ext.each(recs, function(rec) {
                    rec.set({
                        timezoneCd : me.timezoneCd,
                        timezoneDescription : me.timezoneDescription
                    });

                    rec.details().each(function(detail) {
                        detail.set({
                            timezoneCd : me.timezoneCd,
                            timezoneDescription : me.timezoneDescription
                        });
                    });
                });

                store.resumeEvents();
                view.setLoading(false);
            });
        },

        handleSubmitAction : Ext.emptyFn,

        onTimeOffsLoad : Ext.emptyFn,

        handleAfterEdit : function(argument) {
            var me = this;
            this.callParent(arguments);
            Ext.defer(function() {
                me.load();
            }, 100);
        }
    }
});
