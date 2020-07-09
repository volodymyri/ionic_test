Ext.define('criterion.controller.settings.hr.Screenings', function() {

    return {
        alias : 'controller.criterion_settings_screenings',

        extend : 'criterion.controller.employer.GridView',

        requires : [
            'criterion.controller.mixin.ControlMaskZIndex',

            'criterion.view.MultiRecordPicker',
            'criterion.store.EmployeeGroups',
            'criterion.store.employeeBackground.Search',
            'criterion.ux.form.field.EmployeeGroupComboBox',
            'criterion.view.settings.hr.screening.Form'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        getHandleRoute() {
            return null;
        },

        handleEditAction() {},

        handleSync() {
            let view = this.getView();

            view.setLoading(true);
            criterion.Api.requestWithPromise({
                url : Ext.String.format(criterion.consts.Api.API.EMPLOYEE_BACKGROUND_SYNC, this.getEmployerId()),
                method : 'POST'
            }).then(() => {
                criterion.Utils.toast(i18n.gettext('Successfully.'));
            }).always(() => {
                view.setLoading(false);
            });
        },

        handleAddClick() {
            let me = this,
                form,
                vm = this.getViewModel();

            form = Ext.create('criterion.view.settings.hr.screening.Form', {
                viewModel : {
                    data : {
                        webForms : vm.getStore('webForms')
                    }
                }
            });
            form.show();
            form.on({
                cancel : () => {
                    form.destroy();
                    me.setCorrectMaskZIndex(false);
                },
                ordered : () => {
                    form.destroy();
                    me.setCorrectMaskZIndex(false);
                    me.load();
                }
            });

            this.setCorrectMaskZIndex(true);
        }
    };

});
