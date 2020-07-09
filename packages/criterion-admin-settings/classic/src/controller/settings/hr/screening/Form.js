Ext.define('criterion.controller.settings.hr.screening.Form', function() {

    return {

        alias : 'controller.criterion_settings_screening_form',

        extend : 'criterion.app.ViewController',

        onActivateSelectEmployees() {
            this.lookup('selectEmployees').getController().onShow()
        },

        selectEmployees(employees) {
            let vm = this.getViewModel(),
                employeeIds = Ext.Array.map(employees, employee => employee.get('employeeId')),
                length = employeeIds.length;

            vm.set({
                activeViewIdx : 1,
                titleForm : i18n.gettext('Order Background Check'),
                employeesCountMessage : Ext.String.format('{0} {1}', length, length === 1 ? i18n.gettext('Employee selected') : i18n.gettext('Employees selected'))
            });
            vm.set('requestData.employees', employeeIds);
        },

        handleCancel() {
            this.fireViewEvent('cancel');
        },

        handlePrevious() {
            let vm = this.getViewModel();

            vm.set({
                activeViewIdx : 0,
                titleForm : i18n.gettext('Select Employees')
            });
            this.lookup('selectEmployees').getViewModel().set('selectedRecords', vm.get('requestData.employees'));
        },

        handleOrder() {
            let me = this,
                vm = me.getViewModel(),
                view = me.getView();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYEE_BACKGROUND,
                method : 'POST',
                jsonData : vm.get('requestData')
            }).then(() => {
                criterion.Utils.toast(i18n.gettext('Successfully.'));
                me.fireViewEvent('ordered');
            }).always(() => {
                view.setLoading(false);
            });
        }
    };

});
