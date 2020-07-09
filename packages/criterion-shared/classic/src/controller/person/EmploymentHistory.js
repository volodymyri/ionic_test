Ext.define('criterion.controller.person.EmploymentHistory', function() {

    return {

        alias : 'controller.criterion_person_employment_history',

        extend : 'criterion.controller.GridView',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext'
        ],

        onEmployeeChange : function() {
            this.load();
        },

        load : function() {
            if (this.getPersonId()) {
                this.callParent([
                    {
                        params : {
                            personId : this.getPersonId()
                        }
                    }
                ]);
            }
        },

        handleEmployeeSelectAction : function(record) {
            this.redirectTo(Ext.String.format(criterion.consts.Route.HR.EMPLOYEE_BASIC_DEMOGRAPHICS, record.getId()), null);
        }
    };
});
