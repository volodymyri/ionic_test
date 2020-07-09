Ext.define('criterion.model.learning.Active', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.LEARNING_ACTIVE
        },

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'code',
                type : 'string'
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'courseClassName',
                type : 'string'
            },
            {
                name : 'employerName',
                type : 'string',
                persist : false
            },
            {
                name : 'employerId',
                type : 'integer',
                persist : false
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
                type : 'criterion_codedatavalue',
                name : 'courseType',
                referenceField : 'courseTypeCd',
                dataProperty : 'description',
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
                name : 'courseContentTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COURSE_CONTENT_TYPE,
                allowNull : true
            },
            {
                name : 'courseContentType',
                type : 'criterion_codedatavalue',
                depends : 'courseContentTypeCd',
                referenceField : 'courseContentTypeCd',
                dataProperty : 'description'
            },
            {
                name : 'location',
                type : 'string'
            },
            {
                name : 'courseDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'courseTime',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'courseDateTime',
                calculate : function(data) {
                    if (!data) {
                        return;
                    }

                    return Ext.String.format('{0} {1}', Ext.Date.format(data.courseDate, criterion.consts.Api.SHOW_DATE_FORMAT), Ext.Date.format(data.courseTime, criterion.consts.Api.SHOW_TIME_FORMAT));
                }
            },
            {
                name : 'dueDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'isSelfEnrolled',
                type : 'boolean'
            },
            {
                name : 'hasPin',
                type : 'boolean',
                persist : false
            },
            {
                name : 'isCourseClass',
                type : 'boolean'
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
                name : 'hasClasses',
                type : 'boolean',
                persist : false
            }
        ]
    };
});
