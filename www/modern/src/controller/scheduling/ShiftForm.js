Ext.define('criterion.controller.scheduling.ShiftForm', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_scheduling_shift_form',

        init : function() {
            var vm = this.getViewModel();

            this.callParent(arguments);

            vm.bind({
                bindTo : '{record}'
            }, function(record) {
                vm.set({
                    startTime : record ? record.get('startTimestamp') : null,
                    endTime : record ? record.get('endTimestamp') : null
                })
            });
        }
    }
});
