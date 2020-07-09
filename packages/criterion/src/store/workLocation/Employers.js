Ext.define('criterion.store.workLocation.Employers', function() {

    return {
        extend : 'criterion.store.AbstractStore',

        alias : 'store.work_location_employers',

        model : 'criterion.model.workLocation.Employer',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.WORK_LOCATION_EMPLOYER
        }
    };
});
