Ext.define('criterion.controller.scheduling.shift.AssignmentDetailForm', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_scheduling_shift_assignment_detail_form',

        onShow() {
            this.load();
        },

        load() {
            let view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true);

            vm.getStore('previousShifts').loadWithPromise({
                params : {
                    shiftOccurrenceId : vm.get('shiftOccurrenceId')
                }
            }).always(function() {
                view.setLoading(false);

                view.fireEvent('afterLoad');
            })
        },

        handleCancel() {
            this.getView().destroy();
        },

        handleCopyShiftAssignmentDetails() {
            let vm = this.getViewModel(),
                view = this.getView();

            if (view.isValid()) {
                view.fireEvent('copy', {
                    previousShiftId : vm.get('previousShiftId'),
                    isClearExisting : vm.get('isClearExisting')
                });
            }
        }
    }
});
