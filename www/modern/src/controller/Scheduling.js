Ext.define('ess.controller.Scheduling', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.ess_modern_scheduling',

        handleActivate() {
            this.getView().setActiveItem(this.lookup('subMenu'));

            this.lookup('unavailable')._getController().resetCardState();
            this.lookup('shifts')._getController().resetCardState();
        },

        handleAddUnavailable() {
            this.lookup('unavailable').addUnavailable();
        },

        handleEditUnavailable() {
            this.getViewModel().set('unavailableEdit', true);
        },

        handleFinishEditUnavailable() {
            this.getViewModel().set('unavailableEdit', false);
        },

        handleEditShift() {
            this.getViewModel().set('shiftEdit', true);
        },

        handleFinishEditShift() {
            this.getViewModel().set('shiftEdit', false);
        }
    };
});
