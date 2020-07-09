Ext.define('criterion.model.employer.WorkersCompensation', function() {

    const API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.employer.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.WORKERS_COMPENSATION
        },

        fields : [
            {
                name : 'workersCompensationCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.WORKERS_COMPENSATION
            },
            {
                name : 'effectiveDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'rate',
                type : 'float'
            },
            {
                name : 'employeeContribution',
                type : 'float'
            },
            {
                name : 'limitYear',
                type : 'float',
                serialize : criterion.Utils.emptyToNull,
                allowNull : true
            },
            {
                name : 'experienceModifier',
                type : 'float'
            }
        ]
    };
});
