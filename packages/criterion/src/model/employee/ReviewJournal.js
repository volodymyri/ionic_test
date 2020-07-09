Ext.define('criterion.model.employee.ReviewJournal', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employee.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_REVIEW_JOURNAL
        },

        fields : [
            {
                name : 'title',
                type : 'string',
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'journalGroupCd',
                type : 'criterion_codedata',
                codeDataId : DICT.JOURNAL_GROUP,
                validators : [ VALIDATOR.NON_EMPTY ]
            },
            {
                name : 'createdDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT,
                persist : false
            },
            {
                name : 'attachmentName',
                type : 'string',
                persist : false
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'isPrivate',
                type : 'boolean'
            }
        ]
    };
});
