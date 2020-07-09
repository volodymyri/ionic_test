Ext.define('criterion.controller.ManagerSelectorPopup', function() {

    return {

        alias : 'controller.criterion_manager_selector_popup',

        extend : 'criterion.app.ViewController',

        handleSelectManager : function() {
            let form = this.getView();

            if (form.isValid()) {
                form.fireEvent('afterManagerSelect', form.getValues()['managerId']);
            }
        },

        handleCancel : function() {
            this.getView().close();
        }
    }
});