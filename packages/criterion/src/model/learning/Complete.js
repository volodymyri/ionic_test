Ext.define('criterion.model.learning.Complete', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.LEARNING_COMPLETE
        },

        fields : [
            {
                name : 'name',
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
                name : 'isInstructorCourse',
                type : 'boolean'
            },
            {
                name : 'type',
                type : 'string',

                persist : false,
                calculate : function(data) {
                    return data.isInstructorCourse ? i18n.gettext('Classroom') : i18n.gettext('On Demand');
                }
            },
            {
                name : 'completedDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'courseSuccessStatusCd',
                type : 'criterion_codedata',
                codeDataId : DICT.COURSE_SUCCESS_STATUS
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
            }
        ]
    };
});
