Ext.define('criterion.store.employer.IncomeListLabels', function() {

    return {
        extend : 'criterion.data.Store',
        model : 'criterion.model.employer.IncomeListLabel',
        alias : 'store.criterion_employer_income_list_labels',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };
});
