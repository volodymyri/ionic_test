Ext.define('criterion.store.employer.QuestionValues', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.store.AbstractStore',
        alias : 'store.criterion_question_values',

        model : 'criterion.model.employer.QuestionValue',
        autoLoad : false,
        autoSync : false,
        pageSize : criterion.Consts.PAGE_SIZE.NONE,

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_QUESTION_VALUE
        }
    };
});
