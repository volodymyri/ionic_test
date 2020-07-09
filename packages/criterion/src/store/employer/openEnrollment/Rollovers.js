Ext.define('criterion.store.employer.openEnrollment.Rollovers', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_open_enrollment_rollovers',

        model : 'criterion.model.employer.openEnrollment.Rollover',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_OPEN_ENROLLMENT_ROLLOVER
        }
    };

});
