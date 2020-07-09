Ext.define('criterion.model.learning.MyTeam', function() {

    var DICT = criterion.consts.Dict,
        API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.LEARNING_MY_TEAM
        },

        idProperty : {
            name : 'id',
            type : 'string'
        },

        fields : [
            {
                name : 'employeeId',
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
                name : 'courseId',
                type : 'integer'
            },
            {
                name : 'courseClassId',
                type : 'integer'
            },
            {
                name : 'courseName',
                type : 'string'
            },
            {
                name : 'courseClassName',
                type : 'string'
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
            }
        ]
    };
});
