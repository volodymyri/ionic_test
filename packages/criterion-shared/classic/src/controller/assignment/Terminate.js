Ext.define('criterion.controller.assignment.Terminate', function () {
    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_assignment_terminate',

        onTerminate: function () {
            var view = this.getView(),
                vm = this.getViewModel(),
                record = vm.get('record'),
                form = this.lookupReference('form');

            if (form.isValid()) {
                view.fireEvent('terminate', form.getValues());
                view.close();
            }
        }
    };
});