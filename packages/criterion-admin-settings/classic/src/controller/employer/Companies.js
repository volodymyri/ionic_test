Ext.define('criterion.controller.employer.Companies', function() {

    return {
        alias : 'controller.criterion_employer_companies',

        extend : 'criterion.controller.GridView',

        requires : [
            'criterion.view.common.GeocodeValidationWizard'
        ],

        handleRunGeocodeValidation() {
            Ext.create('criterion.view.common.GeocodeValidationWizard').show()
        }

    };

});
