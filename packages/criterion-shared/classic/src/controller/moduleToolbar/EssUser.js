Ext.define('criterion.controller.moduleToolbar.EssUser', function() {

    function isCurrentEmployment (record) {
        return record.get('employeeId') === criterion.Api.getEmployeeId();
    }

    return {
        extend : 'criterion.controller.moduleToolbar.User',

        alias : 'controller.criterion_moduletoolbar_ess_user',

        listen : {
            global : {
                baseStoresLoaded : 'onBaseStoresLoaded',
                employeeChanged : 'onEmployeeChange'
            }
        },

        onBaseStoresLoaded : function(employers, employees) {
            var employments = this.getStore('employments'),
                vm = this.getViewModel();

            employees.each(function(employee) {
                var assignment = employee.getAssignment();

                var data = {
                    employeeId : employee.getId(),
                    employerId : employee.get('employerId'),
                    positionTitle : assignment ? assignment.get('title') : 'Unemployed',
                    employerTitle : employers.getById(employee.get('employerId')).get('legalName')
                };

                data['title'] = data['positionTitle'] + ' - ' + data['employerTitle'];

                employments.add(data);
            });

            vm.set('multipleEmployments', employments.count() > 1);
            this.updateSwitcher();
        },

        onEmployeeChange : function() {
            this.updateSwitcher();
        },

        updateSwitcher : function() {
            var employments = this.getStore('employments'),
                selectedEmployment = employments.findRecord('employeeId', criterion.Api.getEmployeeId(), 0, false, false, true);

            selectedEmployment && this.getViewModel().set({
                selectedEmployment : selectedEmployment,
                selectedEmploymentId : selectedEmployment.getId(),
                personName : criterion.Api.getCurrentPerson().firstName + ' ' + criterion.Api.getCurrentPerson().lastName
            });
        },

        onEmploymentChange : function(combo, employmentId) {
            var employment = this.getStore('employments').getById(employmentId),
                employerId = employment.get('employerId'),
                employeeId = employment.get('employeeId'),
                vm = this.getViewModel();

            if (!isCurrentEmployment(employment)) {
                criterion.Application.setEmployer(employerId);
                criterion.Application.setEmployee(employeeId);
                this.getViewModel().set('showEmploymentsCombo', false);

                criterion.Utils.setCookie(criterion.Consts.COOKIE.CURRENT_EMPLOYER_ID, employerId);
                criterion.Utils.setCookie(criterion.Consts.COOKIE.CURRENT_EMPLOYEE_ID, employeeId);
            }

            vm.set('employer', criterion.Application.getEmployer());
        },

        onEmploymentCollapse : function() {
            this.getViewModel().set('showEmploymentsCombo', false);
        },

        onChangeEmploymentClick : function() {
            var menu = this.getView().menu;

            menu.preventBlur = true;

            this.getViewModel().set('showEmploymentsCombo', true);

            Ext.defer(function() {
                menu.preventBlur = false;
            }, 100)
        },

        onMenuShow: function() {
            this.getViewModel().set('showEmploymentsCombo', false);
        }
    };

});
