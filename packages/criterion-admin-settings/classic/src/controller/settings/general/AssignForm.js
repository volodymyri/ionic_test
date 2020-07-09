Ext.define('criterion.controller.settings.general.AssignForm', function() {

    return {
        alias : 'controller.criterion_settings_general_assign_form',

        extend : 'criterion.controller.common.AssignBase',

        requires : [
            'criterion.view.employee.EmployeePicker'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        switchFormToEmployeeSearchMode() {
            let plugin = this.getView().getPlugins()[0];

            plugin.changeWidth(criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH);
        },

        switchFormBackFromEmployeeSearchMode() {
            let plugin = this.getView().getPlugins()[0];

            plugin.changeWidth(criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH);
        },

        handleWorkflowChange(cmp, val) {
            if (val) {
                this.getViewModel().set({
                    workflowEmployerId : cmp.getSelection().get('employerId'),
                    employeeGroupIds : [],
                    employeeIds : []
                });
            }
        },

        handleAssign() {
            let vm = this.getViewModel(),
                form = this.lookup('form'),
                view = this.getView(),
                isWebForm = vm.get('isWebForm'),
                employeeGroupIds = vm.get('employeeGroupIds'),
                employeeIds = vm.get('employeeIds'),
                assignedEmployeeId = vm.get('assignedEmployeeId'),
                params = {
                    comment : vm.get('comment'),
                    dueDate : Ext.Date.format(vm.get('dueDate'), criterion.consts.Api.DATE_FORMAT),
                    isShare : vm.get('isShare'),
                    workflowId : vm.get('workflowId')
                };

            if (form.isValid()) {
                params[isWebForm ? 'webformId' : 'dataformId'] = vm.get('formId');

                if (employeeGroupIds && employeeGroupIds.length) {
                    params['employeeGroupIds'] = employeeGroupIds;
                }

                if (employeeIds && employeeIds.length) {
                    params['employeeIds'] = employeeIds;
                }

                if (assignedEmployeeId) {
                    params['assignedEmployeeId'] = assignedEmployeeId;
                }

                view.setLoading(true);

                criterion.Api.requestWithPromise({
                    url : isWebForm ? criterion.consts.Api.API.WEBFORM_ASSIGN : criterion.consts.Api.API.DATAFORM_ASSIGN,
                    method : 'POST',
                    jsonData : params
                }).then(() => {
                    criterion.Utils.toast(i18n.gettext('The form is successfully assigned'));
                    view.setLoading(false);
                    view.destroy();
                }, () => {
                    criterion.Utils.toast(i18n.gettext('Something went wrong'));
                    view.setLoading(false);
                });
            }
        },

        handleAssignToEmployeeSearch() {
            let me = this,
                vm = me.getViewModel(),
                picker = Ext.create('criterion.view.employee.EmployeePicker', {
                    isActive : true,
                    employerId : vm.get('workflowEmployerId')
                });

            picker.on('select', function(employee) {
                vm.set({
                    assignedEmployeeId : employee.get('employeeId'),
                    assignedEmployeeName : employee.get('fullName')
                });

            });

            picker.on('destroy', function() {
                me.setCorrectMaskZIndex(false);
            });

            picker.show();
            this.setCorrectMaskZIndex(true);
        },

        handleClearAssignedEmployee (){
            this.getViewModel().set({
                assignedEmployeeName : null,
                assignedEmployeeId : null
            });
        },

        getInternalEmployerId() {
            return this.getViewModel().get('workflowEmployerId')
        }
    }
});
