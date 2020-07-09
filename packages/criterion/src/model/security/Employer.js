/**
 * @deprecated
 */
Ext.define('criterion.model.security.Employer', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.SECURITY_EMPLOYER
        },

        fields : [
            {
                name : 'employerId',
                type : 'integer'
            },
            {
                name : 'personId',
                type : 'integer'
            },
            {
                name : 'employerName',
                type : 'string'
            }
        ]
    };
});
