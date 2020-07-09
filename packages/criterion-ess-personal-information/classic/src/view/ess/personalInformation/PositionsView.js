Ext.define('criterion.view.ess.personalInformation.PositionsView', function() {

    return {
        alias : 'widget.criterion_selfservice_personal_information_positions_view',

        extend : 'criterion.view.employee.PositionsView',

        cls : 'criterion-ess-panel',

        showCustomfields : false,

         controller : {
            suppressIdentity : ['employeeContext'],
            padding : '5 25 25 25',
            cls : 'criterion-ess-panel',
            showCustomfields : false
        }

    }
});
