Ext.define('criterion.controller.person.GridView', function() {

    return {
        alias : 'controller.criterion_person_gridview',

        extend : 'criterion.controller.GridView',

        mixins : [
            'criterion.controller.mixin.identity.EmployeeContext',
            'criterion.controller.mixin.identity.EmployeeGlobal'
        ],

        suppressIdentity : ['employeeGlobal'],

        onEmployeeChange : function() {
            this.load();
        },

        load : function() {
            if (this.getPersonId() && this.getEmployerId()) {
                this.callParent([
                    {
                        params : {
                            personId : this.getPersonId(),
                            employerId : this.getEmployerId()
                        }
                    }
                ]);
            }
        },

        getEmptyRecord : function() {
            return {
                personId : this.getPersonId()
            }
        }

    };

});
