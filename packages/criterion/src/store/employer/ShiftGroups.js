Ext.define('criterion.store.employer.ShiftGroups', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employer.ShiftGroup',
        alias : 'store.criterion_employer_shift_groups',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_SHIFT_GROUP
        }
    };
});
