Ext.define('criterion.view.payroll.Employee', function() {

    return {

        alias : [
            'widget.criterion_payroll_employee'
        ],

        extend : 'criterion.view.employee.Base',

        requires: [
            'criterion.controller.payroll.Employee'
        ],

        controller: {
            type: 'criterion_payroll_employee'
        }

    };
});
