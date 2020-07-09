Ext.define('criterion.model.workLocation.Employer', function() {

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.WORK_LOCATION_EMPLOYER
        },

        fields : [
            {
                name : 'nationalIdentifier',
                type : 'string'
            },
            {
                name : 'legalName',
                type : 'string'
            },
            {
                name : 'alternativeName',
                type : 'string'
            },
            {
                name : 'website',
                type : 'string'
            },
            {
                name : 'organizationName',
                type : 'string'
            },
            {
                name : 'isActive',
                type : 'boolean'
            },
            {
                name : 'hasLogo',
                type : 'boolean'
            }
        ]
    };
});
