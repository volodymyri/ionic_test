Ext.define('criterion.store.employer.QuestionSets', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_question_sets',

        model : 'criterion.model.employer.QuestionSet',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_QUESTION_SET
        }
    };
});
