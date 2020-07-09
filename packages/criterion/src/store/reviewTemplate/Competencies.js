Ext.define('criterion.store.reviewTemplate.Competencies', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.data.Store',

        alias : 'store.criterion_review_template_competencies',

        model : 'criterion.model.reviewTemplate.Competency',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.REVIEW_TEMPLATE_COMPETENCY
        }
    };
});
