Ext.define('criterion.controller.employee.GridView', function() {

    return {
        alias : 'controller.criterion_employee_gridview',

        extend : 'criterion.controller.GridView',

        listen : {
            global : {
                employeeChanged : 'handleEmployeeChanged'
            }
        },

        load : function(opts) {
            var employeeId = this.getEmployeeId();

            if (!employeeId) {
                return false;
            }

            this.callParent([
                {
                    params : Ext.apply({
                        employeeId : employeeId
                    }, opts || {})
                }
            ]);
        },

        getEmployeeId : function() {
            return this.getViewModel().get('employeeId');
        },

        handleEmployeeChanged : function() {
            if (this.checkViewIsActive()) {
                this.load();
            }
        },

        getEmptyRecord : function() {
            return Ext.apply(this.callParent(arguments), {
                employeeId : this.getEmployeeId()
            });
        }

    };

});
