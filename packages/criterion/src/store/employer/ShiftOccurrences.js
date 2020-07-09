Ext.define('criterion.store.employer.ShiftOccurrences', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employer.ShiftOccurrence',
        alias : 'store.criterion_employer_shift_occurrences',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_SHIFT_OCCURRENCE
        }
    };
});
