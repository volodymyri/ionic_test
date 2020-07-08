Ext.define('ess.controller.time.TimeOffs', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_time_timeoffs',

        init : function() {
            var me = this;

            me.handleActivate = Ext.Function.createBuffered(me.handleActivate, 100, me);
            this.callParent(arguments);
        },

        handleActivate : function() {
            var vm = this.getViewModel(),
                view = this.getView(),
                employeeId,
                promises;

            if (this.checkViewIsActive()) {
                employeeId = vm.get('employeeId');

                promises = [
                    vm.getStore('employeeTimeOffType').loadWithPromise({
                        params : {
                            employeeId : employeeId
                        }
                    }),
                    vm.getStore('timeBalances').loadWithPromise({
                        params : {
                            employeeId : employeeId
                        }
                    })
                ];

                Ext.Deferred.all(promises).then(function() {
                    vm.set('blockAdd', false);
                });
            }

            view.setActiveItem(view.down('#timeOffsGridWrapper'));
        },

        handleAdd : function() {
            this.lookup('timeoffsGrid').getController().handleAddClick();
        },

        handleTimeBalanceClick : function(item, index, target, record) {
            this.lookup('timeoffsGrid').getController().onAddSpecificType(record.getId());
        },

        onTimeOffEdit : function(record) {
            var view = this.getView(),
                timeoffForm = view.down('criterion_time_timeoff');

            record.getProxy().setUrl(criterion.consts.Api.API.MOBILE_EMPLOYEE_TIME_OFF);
            timeoffForm.getViewModel().set('record', record);
            view.getLayout().setAnimation({
                    type: 'slide',
                    direction: 'left'
                }
            );

            view.setActiveItem(timeoffForm);
        },

        onTimeOffEditFinish : function() {
            var view = this.getView(),
                timeoffForm = view.down('criterion_time_timeoff');

            timeoffForm.getViewModel().set('record', null);
            view.getLayout().setAnimation({
                    type: 'slide',
                    direction: 'right'
                }
            );

            view.setActiveItem(view.down('#timeOffsGridWrapper'));
            view.getViewModel().set('modificationMode', false);
        },

        onTimeOffDetailEditFinish : function() {
            var view = this.getView();

            view.getLayout().setAnimation({
                    type : 'slide',
                    direction : 'right'
                }
            );

            view.setActiveItem(view.down('criterion_time_timeoff'));
        }
    };
});
