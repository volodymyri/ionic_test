Ext.define('criterion.controller.employee.SubmitConfirm', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_employee_submit_confirm',

        handleShow : function() {
            Ext.Function.defer(function() {
                this.getView().getPlugins()[0].reCenter();
                this.lookup('closeBtn').focus();
            }, 200, this);
        },

        onCancel : function() {
            let view = this.getView();

            view.fireEvent('cancelSubmit');
            Ext.defer(function() {
                view.destroy();
            }, 100);
        },

        onSubmit : function() {
            let view = this.getView(),
                vm = this.getViewModel();

            view.fireEvent('confirmSubmit', vm.get('isSignature') ? this.lookup('signaturePad').getValue() : null, vm.getData());
        }
    }
});
