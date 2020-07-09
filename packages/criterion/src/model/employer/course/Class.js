Ext.define('criterion.model.employer.course.Class', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.employer.course.class.ClassAttachment'
        ],

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'courseId',
                type : 'integer'
            },
            {
                name : 'employerId',
                type : 'integer',
                persist : false
            },
            {
                name : 'courseName',
                type : 'string',
                persist : false
            },
            {
                name : 'employerName',
                type : 'string',
                persist : false
            },
            {
                name : 'courseCode',
                type : 'string',
                persist : false
            },
            {
                name : 'location',
                type : 'string',
                allowNull : true
            },
            {
                name : 'instructorId',
                type : 'int',
                allowNull : false
            },
            {
                name : 'instructorName',
                type : 'string',
                persist : false
            },
            {
                name : 'pin',
                type : 'string',
                allowNull : false
            },
            {
                name : 'cost',
                type : 'float'
            },
            {
                name : 'courseDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                allowNull : true
            },
            {
                name : 'courseTime',
                type : 'date',
                dateFormat : criterion.consts.Api.RAW_DATE_TIME_FORMAT,
                allowNull : true
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
                name : 'registrationOpen',
                type : 'date',
                dateFormat : criterion.consts.Api.RAW_DATE_TIME_FORMAT,
                allowNull : false
            },
            {
                name : 'maxEnrollmentLimit',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'courseReviewId',
                type : 'integer'
            },
            {
                name : 'isActive',
                type : 'boolean'
            },
            {
                name : 'link',
                type : 'string',
                allowNull : true
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_COURSE_CLASS
        },

        hasMany : [
            {
                model : 'criterion.model.employer.course.class.ClassAttachment',
                name : 'attachments',
                associationKey : 'attachments'
            }
        ]
    };
});
