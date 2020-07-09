Ext.define('criterion.model.employer.recruiting.Setting', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_RECRUITING_SETTINGS
        },

        fields : [
            {
                name : 'employerId',
                type : 'integer'
            },
            {
                name : 'questionSetId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'employmentApplicationWebformId',
                type : 'integer',
                allowNull : true
            },
            {
                name : 'isShowEaJobPortal',
                type : 'boolean'
            },
            {
                name : 'backgroundVerificationAppId',
                type : 'integer',
                allowNull : true
            }
        ]
    };
});
