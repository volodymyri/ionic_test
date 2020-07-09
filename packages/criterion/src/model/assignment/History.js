Ext.define('criterion.model.assignment.History', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.ASSIGNMENT_HISTORY
        },

        fields : [
            {
                name : 'payRate',
                type : 'float'
            },
            {
                name : 'rateUnitCd',
                type : 'criterion_codedata',
                codeDataId : DICT.RATE_UNIT
            },
            {
                name : 'positionId',
                type : 'int'
            },
            {
                name : 'assignmentId',
                type : 'int'
            },
            {
                name : 'assignmentDetailTitle',
                type : 'string'
            },
            {
                name : 'positionTitle',
                type : 'string'
            },
            {
                name : 'assignmentAction',
                type : 'string'
            },
            {
                name : 'isPrimary',
                type : 'boolean'
            },
            {
                name : 'effectiveDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'expirationDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            }
        ]
    };
});
