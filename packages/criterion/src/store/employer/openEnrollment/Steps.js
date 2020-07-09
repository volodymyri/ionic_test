Ext.define('criterion.store.employer.openEnrollment.Steps', function() {

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_employer_open_enrollment_steps',

        model : 'criterion.model.employer.openEnrollment.Step',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE
    };

});
