Ext.define('criterion.model.Abstract', function() {

    return {
        extend : 'criterion.data.Model',

        requires : [
            'Ext.data.identifier.Negative',
            'criterion.data.schema.Namer',
            'criterion.data.proxy.Rest',
            'criterion.data.field.*',
            'criterion.Utils'
        ],

        idProperty : 'id',

        schema : {
            namespace: 'criterion.model',
            namer : 'criterion_default',
            urlPrefix : criterion.consts.Api.API.ROOT,
            defaultIdentifier : 'negative',
            proxy : {
                type : 'criterion_rest'
            }
        },

        fields : [
            {
                name : 'securityFields',
                persist : false
            }
        ]
    };
});
