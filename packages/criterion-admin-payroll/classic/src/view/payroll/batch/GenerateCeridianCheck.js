Ext.define('criterion.view.payroll.batch.GenerateCeridianCheck', function() {

    const API = criterion.consts.Api.API;

    return {

        alias : 'widget.criterion_payroll_batch_generate_ceridian_check',

        extend : 'criterion.view.payroll.batch.GenerateBase',

        controller : {
            countApiUrl : API.EMPLOYER_PAYROLL_BATCH_CERIDIAN_CHECK_PAYMENTS,
            generateUrl : API.EMPLOYER_PAYROLL_BATCH_GENERATE_CERIDIAN_CHECK
        },

        viewModel : {
            data : {
                title : i18n.gettext('Generate Ceridian Check')
            }
        }
    }
});
