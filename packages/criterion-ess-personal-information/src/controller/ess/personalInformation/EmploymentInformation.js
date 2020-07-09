Ext.define('criterion.controller.ess.personalInformation.EmploymentInformation', function() {

    return {
        alias : 'controller.criterion_selfservice_personal_information_employment_information',

        extend : 'criterion.controller.employee.demographic.Employment',

        handleEmployeeSet : function(data, contextView) {
            var employeeWorkLocation,
                employee = data.employee;

            employeeWorkLocation = employee && employee.getEmployeeWorkLocation();
            employeeWorkLocation && this.getViewModel().set('workLocationId', employee.getEmployeeWorkLocation().getId());

            this.load();
        }
    }

});
