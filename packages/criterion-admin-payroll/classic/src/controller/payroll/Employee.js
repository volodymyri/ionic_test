Ext.define('criterion.controller.payroll.Employee', function() {

    var PAYROLL_EMPLOYEE_ROUTE = criterion.consts.Route.PAYROLL.EMPLOYEE;

    return {
        extend : 'criterion.controller.employee.Base',

        alias : 'controller.criterion_payroll_employee',

        /**
         * @deprecated
         */
        visibleSetting: criterion.Consts.VIEW_SETTING.PAYROLL_EMPLOYER_TAB_VISIBLE,

        routePrefix: PAYROLL_EMPLOYEE_ROUTE,

        mixins : [
            'criterion.controller.mixin.ReRouting'
        ],

        init : function() {
            this.setReRouting();
            this.callParent(arguments);
        }
    };

});
