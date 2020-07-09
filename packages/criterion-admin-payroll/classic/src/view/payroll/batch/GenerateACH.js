Ext.define('criterion.view.payroll.batch.GenerateACH', function() {

    const API = criterion.consts.Api.API;

    return {

        alias : 'widget.criterion_payroll_batch_generate_ach',

        extend : 'criterion.view.payroll.batch.GenerateBase',

        controller : {
            countApiUrl : API.EMPLOYER_PAYROLL_BATCH_ACH_PAYMENTS,
            generateUrl : API.EMPLOYER_PAYROLL_BATCH_GENERATE_ACH,

            totalAmountName : 'totalACHAmount',
        },

        viewModel : {
            data : {
                title : i18n.gettext('Generate ACH'),
                countPaymentsTitle : i18n.gettext('ACH Payments')
            }
        }

    }
});
