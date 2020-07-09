Ext.define('criterion.model.learning.CourseByEmployee', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.LEARNING_COURSE_BY_EMPLOYEE
        },

        fields : [

            {
                name : 'courseName',
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
                name : 'courseType',
                type : 'integer',
                persist : false,
                depends : 'courseTypeCode',
                calculate : function(data) {
                    if (!data) {
                        return null;
                    }

                    return data.courseTypeCode === criterion.Consts.COURSE_DELIVERY.CLASSROOM ? criterion.Consts.COURSE_TYPE.CLASSROOM : criterion.Consts.COURSE_TYPE.ON_DEMAND;
                }
            }
        ]
    };
});
