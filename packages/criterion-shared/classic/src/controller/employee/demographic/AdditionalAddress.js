Ext.define('criterion.controller.employee.demographic.AdditionalAddress', function() {

    return {
        alias : 'controller.criterion_employee_demographic_additional_address',

        extend : 'criterion.controller.person.GridView',

        requires : [
            'criterion.model.person.Address'
        ],

        getEmptyRecord : function() {
            return Ext.apply(this.callParent(arguments), {
                personId : this.getPersonId(),
                isPrimary : false
            });
        }

    };

});
