Ext.define('criterion.model.security.Field', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.security.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.SECURITY_FIELD
        },

        serializeAccessLevelFn : function(value, record) {
            return [0, +record.get('accessView'), +record.get('accessEdit'), 0].join('');
        },

        fields : [
            {
                name : 'securityProfileId',
                type : 'integer'
            },
            {
                name : 'metaFieldId',
                type : 'integer'
            },
            {
                name : 'fieldName',
                type : 'string',
                persist : false
            },
            {
                name : 'tableName',
                type : 'string',
                persist : false
            },
            {
                name : 'accessView',
                type : 'criterion_status_bit',
                bitMask : parseInt('0100', 2)
            },
            {
                name : 'accessEdit',
                type : 'criterion_status_bit',
                bitMask : parseInt('0010', 2)
            }
        ]
    };
});
