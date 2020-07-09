Ext.define('criterion.model.learning.CourseClassForEnroll', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {

        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.LEARNING_COURSE_CLASS_FOR_ENROLL
        },

        fields : [
            {
                name : 'code',
                type : 'string'
            },
            {
                name : 'cost',
                type : 'float'
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
                name : 'courseDateTime',
                calculate : function(data) {
                    if (!data) {
                        return;
                    }

                    return Ext.String.format('{0} {1}', Ext.Date.format(data.courseDate, criterion.consts.Api.SHOW_DATE_FORMAT), Ext.Date.format(data.courseTime, criterion.consts.Api.SHOW_TIME_FORMAT));
                }
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
            },
            {
                name : 'courseId',
                type : 'integer'
            },
            {
                name : 'courseName',
                type : 'string'
            },
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'dueDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'location',
                type : 'string'
            },
            {
                name : 'openSpots',
                type : 'int',
                allowNull : true
            },
            {
                name : 'registrationOpen',
                type : 'date',
                dateFormat : criterion.consts.Api.RAW_DATE_TIME_FORMAT
            },
            {
                name : 'maxEnrollmentLimit',
                type : 'integer',
                allowNull : true
            }
        ]
    };
});
