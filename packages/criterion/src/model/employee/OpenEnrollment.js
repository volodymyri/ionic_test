Ext.define('criterion.model.employee.OpenEnrollment', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_OPEN_ENROLLMENT
        },

        fields : [
            {
                name : 'employeeId',
                type : 'int',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'openEnrollmentId',
                type : 'int',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'statusCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.WORKFLOW_STATE,
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'openEnrollmentStatusCode',
                type : 'criterion_codedatavalue',
                referenceField : 'statusCd',
                dataProperty : 'code'
            },
            {
                name : 'startDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT,
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            },
            {
                name : 'endDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            }
        ],
        hasMany : [
            {
                model : 'criterion.model.employee.openEnrollment.Step',
                name : 'steps',
                associationKey : 'steps'
            }
        ]
    };
});
