Ext.define('criterion.store.ReviewCompetencies', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_review_competencies',

        model : 'criterion.model.ReviewCompetency',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.REVIEW_COMPETENCY
        }
    };
});
