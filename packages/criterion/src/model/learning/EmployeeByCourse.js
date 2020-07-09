Ext.define('criterion.model.learning.EmployeeByCourse', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.LEARNING_EMPLOYEE_BY_COURSE
        },

        fields : [
            {
                name : 'personId',
                type : 'integer'
            },
            {
                name : 'employeeName',
                type : 'string'
            },
            {
                name : 'employerName',
                type : 'string',
                persist : false
            },
            {
                name : 'courseName',
                type : 'string'
            },
            {
                name : 'completedDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'dueDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'courseTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COURSE_DELIVERY
            },
            {
                type : 'criterion_codedatavalue',
                name : 'courseTypeCode',
                referenceField : 'courseTypeCd',
                dataProperty : 'code',
                persist : false
            },
            {
                name : 'courseCompleteStatusCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COURSE_COMPLETE_STATUS,
                allowNull : true
            },
            {
                type : 'criterion_codedatavalue',
                name : 'courseCompleteStatusCode',
                referenceField : 'courseCompleteStatusCd',
                dataProperty : 'code',
                persist : false
            },
            {
                name : 'isInWaitlist',
                type : 'boolean'
            },
            {
                name : 'waitingEmployeesCount',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'waitingEmployeePlace',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'jobTitle',
                type : 'string'
            }
        ]
    };
});
