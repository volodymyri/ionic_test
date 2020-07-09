Ext.define('criterion.store.employer.shift.occurrence.PreviousShifts', function() {

    return {
        extend : 'criterion.store.AbstractStore',
        model : 'criterion.model.employer.shift.occurrence.PreviousShift',
        alias : 'store.criterion_employer_shift_occurrence_previous_shifts',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_SHIFT_OCCURRENCE_PREVIOUS_SHIFTS
        }
    };
});
