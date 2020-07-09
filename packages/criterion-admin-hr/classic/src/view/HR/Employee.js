Ext.define('criterion.view.hr.Employee', function() {

    return {

        alias : [
            'widget.criterion_hr_employee'
        ],

        extend : 'criterion.view.employee.Base',

        requires : [
            'criterion.controller.hr.Employee'
        ],

        controller : {
            type : 'criterion_hr_employee'
        }

    };
});
