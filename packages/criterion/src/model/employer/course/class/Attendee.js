Ext.define('criterion.model.employer.course.class.Attendee', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'employeeId',
                type : 'integer'
            },
            {
                name : 'courseId',
                type : 'integer'
            },
            {
                name : 'dueDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'completedDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'notes',
                type : 'string'
            },
            {
                name : 'score',
                type : 'float'
            },
            {
                name : 'courseSuccessStatusCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COURSE_SUCCESS_STATUS
            },
            {
                name : 'courseCompleteStatusCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COURSE_COMPLETE_STATUS
            },
            {
                name : 'isSelfEnrolled',
                type : 'boolean'
            },
            {
                name : 'courseClassId',
                type : 'integer'
            },
            {
                name : 'name',
                type : 'string'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_COURSE_CLASS_ATTENDEES
        }
    };
});
