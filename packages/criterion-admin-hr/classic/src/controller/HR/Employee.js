Ext.define('criterion.controller.hr.Employee', function() {

    var HR_EMPLOYEE_ROUTE = criterion.consts.Route.HR.EMPLOYEE;

    return {
        extend : 'criterion.controller.employee.Base',

        alias : 'controller.criterion_hr_employee',

        mixins : [
            'criterion.controller.mixin.ReRouting'
        ],

        /**
         * @deprecated
         */
        visibleSetting : criterion.Consts.VIEW_SETTING.HR_EMPLOYER_TAB_VISIBLE,

        routePrefix : HR_EMPLOYEE_ROUTE,

        init : function() {
            this.setReRouting();
            this.callParent(arguments);
        }
    };

});
