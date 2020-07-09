Ext.define('criterion.store.employer.DeductionLabels', function() {

    return {
        extend : 'criterion.data.Store',
        model : 'criterion.model.employer.DeductionLabel',
        alias : 'store.criterion_employer_deduction_labels',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});
