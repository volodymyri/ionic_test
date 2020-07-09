Ext.define('criterion.store.employer.PopulationCounts', function() {

    return {
        alias : 'store.criterion_employer_population_counts',

        extend : 'criterion.store.AbstractStore',

        model : 'criterion.model.employer.PopulationCount',

        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER_POPULATION_COUNT
        }
    };
});
