Ext.define('criterion.model.candidate.Education', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.CANDIDATE_EDUCATION
        },

        fields : [
            {
                name : 'candidateId',
                type : 'int',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'school',
                type : 'string'
            },
            {
                name : 'location',
                type : 'string'
            },
            {
                name : 'startDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'endDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'degreeCd',
                type : 'criterion_codedata',
                codeDataId : DICT.DEGREE
            },
            {
                name : 'degreeDescription',
                type : 'criterion_codedatavalue',
                depends : 'degreeCd',
                referenceField : 'degreeCd',
                dataProperty : 'description'
            },
            {
                name : 'additionalDegreeInformation',
                type : 'string'
            },
            {
                name : 'fieldOfStudy',
                type : 'string'
            },
            {
                name : 'gpa',
                type : 'string'
            },
            {
                name : 'activities',
                type : 'string'
            }
        ]
    };
});
