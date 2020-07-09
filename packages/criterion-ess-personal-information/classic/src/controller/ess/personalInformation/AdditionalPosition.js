Ext.define('criterion.controller.ess.personalInformation.AdditionalPosition', function() {

    return {
        extend : 'criterion.controller.employee.Position',

        alias : 'controller.criterion_selfservice_personal_information_additional_position',

        suppressIdentity : ['employeeContext'],

        load : function(record) {
            if (this.getViewModel().get('isPrimary')) {
                // block incorrect state
                return;
            }
            this.callParent(arguments);
        }
    };
});
