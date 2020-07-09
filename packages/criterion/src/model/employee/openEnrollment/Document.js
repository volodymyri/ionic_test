Ext.define('criterion.model.employee.openEnrollment.Document', function() {

    const API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYEE_OPEN_ENROLLMENT_DOCUMENT
        },

        fields : [
            {
                name : 'documentName',
                type : 'string'
            }
        ]
    };
});
