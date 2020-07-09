Ext.define('criterion.model.employer.QuestionSet', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },

            {
                name : 'description',
                type : 'criterion_localization_string',
                validators : [VALIDATOR.NON_EMPTY]
            },

            {
                name : 'isEnabled',
                type : 'boolean'
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.Question',
                name : 'questions',
                associationKey : 'questions'
            },
            {
                model : 'criterion.model.employer.JobPosting',
                name : 'jobPostings',
                associationKey : 'jobPostings'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_QUESTION_SET
        }
    };
});
