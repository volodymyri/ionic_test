Ext.define('criterion.model.PublishSite', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.PublishSiteSetting'
        ],

        fields : [
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'isEnabled',
                type : 'boolean'
            },
            {
                name : 'isPortal',
                type : 'boolean'
            },
            {
                name : 'isDefault',
                type : 'boolean'
            },
            {
                name : 'attribute1',
                type : 'string'
            },
            {
                name : 'attribute2',
                type : 'string'
            },
            {
                name : 'attribute1Label',
                type : 'string'
            },
            {
                name : 'attribute2Label',
                type : 'string'
            },
            {
                name : 'jobPortalUrl',
                type : 'string'
            }
        ],

        hasOne : [
            {
                model : 'criterion.model.PublishSiteSetting',
                name : 'publishSiteSetting',
                associationKey : 'publishSiteSetting'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.PUBLISH_SITE
        }
    };
});

