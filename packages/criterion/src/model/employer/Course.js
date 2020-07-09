Ext.define('criterion.model.employer.Course', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        requires : [
            'criterion.model.employer.course.Skill'
        ],

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employerName',
                type : 'string',
                persist : false
            },
            {
                name : 'courseTypeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COURSE_DELIVERY,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                type : 'criterion_codedatavalue',
                name : 'courseType',
                referenceField : 'courseTypeCd',
                dataProperty : 'description',
                persist : false
            },
            {
                type : 'criterion_codedatavalue',
                name : 'courseTypeCode',
                referenceField : 'courseTypeCd',
                dataProperty : 'code'
            },
            {
                name : 'courseTypeInt',
                type : 'integer',
                persist : false,
                depends : 'courseTypeCode',
                calculate : function(data) {
                    if (!data) {
                        return null;
                    }

                    return data.courseTypeCode === criterion.Consts.COURSE_DELIVERY.CLASSROOM ? criterion.Consts.COURSE_TYPE.CLASSROOM : criterion.Consts.COURSE_TYPE.ON_DEMAND;
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
                dataProperty : 'code'
            },
            {
                name : 'duration',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'contentFileName',
                type : 'string',
                persist : false
            },
            {
                name : 'contentFileType',
                type : 'string',
                persist : false
            },
            {
                name : 'code',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'isActive',
                type : 'boolean',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'completeBy',
                type : 'integer'
            },
            {
                name : 'notification',
                type : 'string',
                allowNull : true
            },
            {
                name : 'retake',
                type : 'integer',
                defaultValue : 0,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'recurrence',
                type : 'integer'
            },
            {
                name : 'recurrenceDay',
                type : 'integer',
                persist : false,
                calculate : function(data) {
                    var recurrenceDate = data.recurrenceDate;
                    return recurrenceDate ? recurrenceDate.getDate() : null;
                }
            },
            {
                name : 'recurrenceMonth',
                type : 'integer',
                persist : false,
                calculate : function(data) {
                    var recurrenceDate = data.recurrenceDate;
                    return recurrenceDate ? recurrenceDate.getMonth() + 1 : null;
                }
            },
            {
                name : 'recurrenceDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_MONTH_DAY
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
                name : 'courseContentSourceCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COURSE_CONTENT_SOURCE,
                allowNull : true
            },
            {
                name : 'maxEnrollmentLimit',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'creationDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'enrollment',
                type : 'string',
                allowNull : true
            },
            {
                name : 'filename',
                type : 'string'
            },
            {
                name : 'isInstructorCourse',
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
                name : 'url',
                type : 'string',
                persist : false
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.course.Skill',
                name : 'skills',
                associationKey : 'skills'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_COURSE
        }
    };
});
