Ext.define('criterion.store.employer.shift.occurrence.StartData', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.employer.shift.occurrence.StartData',
        alias : 'store.criterion_employer_shift_occurrence_start_data',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_SHIFT_OCCURRENCE_START_DATA
        }
    };
});
