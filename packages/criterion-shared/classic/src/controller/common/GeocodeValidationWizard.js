Ext.define('criterion.controller.common.GeocodeValidationWizard', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_common_geocode_validation_wizard',

        handleShow() {
            let vm = this.getViewModel();

            vm.set('isInLoading', true)

            Ext.promise.Promise.all([
                this.lookup('validationEmployee').load(),
                this.lookup('validationEmployer').load()
            ]).always(_ => {
                vm.set('isInLoading', false)
            });
        },

        handleCancel() {
            this.getView().destroy();
        },

        handleNext() {
            this.getViewModel().set('activeViewIdx', 1);
        },

        handlePrev() {
            this.getViewModel().set('activeViewIdx', 0);
        },

        handleUpdate() {
            let view = this.getView();

            view.setLoading(true);

            Ext.promise.Promise.all([
                this.lookup('validationEmployee').handleUpdate(),
                this.lookup('validationEmployer').handleUpdate()
            ]).then(_ => {
                Ext.defer(_ => {
                    view.destroy()
                }, 100);
            }).always(_ => {
                view.setLoading(false);
            })
        }

    };
});
