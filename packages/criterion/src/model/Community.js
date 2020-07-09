Ext.define('criterion.model.Community', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.COMMUNITY
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'iconId',
                type : 'int',
                allowNull : true
            },
            {
                name : 'creationDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_TIME_FORMAT
            },
            {
                name : 'isActive',
                type : 'boolean'
            },
            {
                name : 'employers',
                type : 'string',
                persist : false
            },
            {
                name : 'totalEmployees',
                type : 'int',
                persist : false
            },
            {
                name : 'imageUrl',
                convert : function(value, record) {
                    return record.phantom ? null : criterion.Api.getSecureResourceUrl(API.COMMUNITY_ICON_IMAGE + '/' + record.get('iconId'))
                },
                persist : false
            },
            {
                name : 'canPost',
                type : 'boolean',
                persist : false
            }
        ]
    };
});
