Ext.define('criterion.model.employee.Course', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employee.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_COURSE
        },

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'courseId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'courseClassId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'dueDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'employerName',
                type : 'string',
                persist : false
            },
            {
                name : 'employeeId',
                type : 'integer'
            },
            {
                name : 'completedDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'creationDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                persist : false
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
                name : 'courseSuccessStatusCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COURSE_SUCCESS_STATUS,
                allowNull : true
            },
            {
                name : 'courseCompleteStatusCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COURSE_COMPLETE_STATUS,
                allowNull : true
            },
            {
                name : 'notes',
                type : 'string'
            },
            {
                name : 'score',
                type : 'float',
                allowNull : true
            },
            {
                name : 'isSelfEnrolled',
                type : 'boolean'
            },
            {
                name : 'waitList', // is not being stored in DB. send true on POST if max enrollment limit is reached
                type : 'boolean'
            },
            {
                name : 'hasAttachment',
                type : 'boolean',
                persist : false
            },
            {
                name : 'attachmentTypeCd',
                type : 'integer',
                // attachmentTypeCd, attachmentName are sent with attachment, here we prevent extra put request
                persist : false
            },
            {
                name : 'attachmentName',
                type : 'string',
                persist : false
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.employer.Course',
                name : 'employerCourse',
                associationKey : 'employerCourse'
            }
        ]
    };
});
