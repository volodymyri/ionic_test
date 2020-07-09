Ext.define('criterion.model.learning.CourseForEnroll', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.LEARNING_COURSE_FOR_ENROLL
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
                name : 'employerName',
                type : 'string',
                persist : false
            },
            {
                name : 'description',
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
                type : 'criterion_codedatavalue',
                name : 'courseType',
                referenceField : 'courseTypeCd',
                dataProperty : 'description',
                persist : false
            },
            {
                name : 'creationDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
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
                name : 'openSpots',
                type : 'int',
                allowNull : true
            }
        ]
    };
});
