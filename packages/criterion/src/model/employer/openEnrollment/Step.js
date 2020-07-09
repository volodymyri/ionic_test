Ext.define('criterion.model.employer.openEnrollment.Step', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_OPEN_ENROLLMENT_STEP
        },

        fields : [
            {
                name : 'openEnrollmentId',
                type : 'int',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'name',
                type : 'string',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'benefitTypeCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.BENEFIT_TYPE
            },
            {
                name : 'benefitName',
                type : 'criterion_codedatavalue',
                referenceField : 'benefitTypeCd',
                dataProperty : 'description'
            },
            {
                name : 'sequenceNumber',
                type : 'integer',
                defaultValue : 0
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.employer.BenefitPlan',
                name : 'benefits',
                associationKey : 'benefits'
            }
        ]
    };
});
