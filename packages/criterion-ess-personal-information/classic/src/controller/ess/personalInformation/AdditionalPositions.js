Ext.define('criterion.controller.ess.personalInformation.AdditionalPositions', function() {

    return {
        extend : 'criterion.controller.employee.Positions',

        alias : 'controller.criterion_selfservice_personal_information_additional_positions',

        requires : [
            'criterion.view.ess.personalInformation.AdditionalPosition'
        ],

        suppressIdentity : ['employeeContext'],

        editor : {
            xtype : 'criterion_selfservice_personal_information_additional_position'
        }
    };
});
