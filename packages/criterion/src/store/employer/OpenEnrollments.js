Ext.define('criterion.store.employer.OpenEnrollments', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.criterion_employer_open_enrollments',

        model : 'criterion.model.employer.OpenEnrollment',

        autoSync : false,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_OPEN_ENROLLMENT
        }
    };

});
