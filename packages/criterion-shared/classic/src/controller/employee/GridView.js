Ext.define('criterion.controller.employee.GridView', function() {

    return {
        alias : 'controller.criterion_employee_gridview',

        extend : 'criterion.controller.GridView',

        /**
         * @param opts
         * @returns {Ext.promise.Deferred.promise}
         */
        load : function(opts = {}) {
            let employeeId = this.getEmployeeId(),
                dfd = Ext.create('Ext.Deferred');

            if (!employeeId) {
                dfd.resolve();

                return dfd.promise;
            }

            return this.callParent([
                Ext.merge(opts || {}, {
                    params : {
                        employeeId : employeeId
                    }
                })
            ]);
        },

        /**
         * Default implementation on change identity handler.
         */
        onEmployeeChange : function() {
            this.load();
        },

        getEmptyRecord : function() {
            return{
                employeeId : this.getEmployeeId()
            };
        }

    };

});
