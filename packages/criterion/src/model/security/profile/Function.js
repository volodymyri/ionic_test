Ext.define('criterion.model.security.profile.Function', function() {

    return {
        extend : 'criterion.model.security.Abstract',

        proxy : {
            type : 'memory'
        },

        serializeAccessLevelFn : function(value, record) {
            return [+record.get('accessAct'), +record.get('accessCreate'), +record.get('accessView'), +record.get('accessEdit'), +record.get('accessDelete')].join('');
        },

        fields : [
            {
                name : 'securityProfileId',
                type : 'integer'
            },
            {
                name : 'securityFunctionCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.SECURITY_FUNCTION
            },
            {
                name : 'securityFunctionName',
                type : 'string'
            },
            {
                name : 'accessAct',
                type : 'criterion_status_bit',
                bitMask : parseInt('10000', 2)
            },
            {
                name : 'accessCreate',
                type : 'criterion_status_bit',
                bitMask : parseInt('01000', 2)
            },
            {
                name : 'accessView',
                type : 'criterion_status_bit',
                bitMask : parseInt('00100', 2)
            },
            {
                name : 'accessEdit',
                type : 'criterion_status_bit',
                bitMask : parseInt('00010', 2)
            },
            {
                name : 'accessDelete',
                type : 'criterion_status_bit',
                bitMask : parseInt('00001', 2)
            },

            // acrud fields
            {
                name : 'acrud',
                type : 'int',
                defaultValue : '00000',
                persist : false,
                convert : function(value) {
                    return parseInt(value, 2)
                }
            },
            {
                name : 'hasAct',
                type : 'criterion_status_bit',
                referenceField : 'acrud',
                depends : ['acrud'],
                bitMask : parseInt('10000', 2)
            },
            {
                name : 'hasCreate',
                type : 'criterion_status_bit',
                referenceField : 'acrud',
                depends : ['acrud'],
                bitMask : parseInt('01000', 2)
            },
            {
                name : 'hasView',
                type : 'criterion_status_bit',
                referenceField : 'acrud',
                depends : ['acrud'],
                bitMask : parseInt('00100', 2)
            },
            {
                name : 'hasEdit',
                type : 'criterion_status_bit',
                referenceField : 'acrud',
                depends : ['acrud'],
                bitMask : parseInt('00010', 2)
            },
            {
                name : 'hasDelete',
                type : 'criterion_status_bit',
                referenceField : 'acrud',
                depends : ['acrud'],
                bitMask : parseInt('00001', 2)
            }
        ]
    };
});
