Ext.define('criterion.model.security.Profile', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.security.profile.Role',
            'criterion.model.security.profile.Field',
            'criterion.model.security.profile.Report',
            'criterion.model.security.profile.EssFunction',
            'criterion.model.security.profile.Function',
            'criterion.model.security.profile.DocumentLocation'
        ],

        proxy : {
            type : 'criterion_rest',
            url : API.SECURITY_PROFILE
        },

        fields : [
            {
                name : 'name',
                type : 'string',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'module',
                type : 'int'
            },
            {
                name : 'accessTypeCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.ACCESS_TYPE
            },
            {
                type : 'criterion_codedatavalue',
                dataProperty : 'code',
                name : 'accessTypeCode',
                referenceField : 'accessTypeCd'
            },
            {
                name : 'hasFullAccess',
                depends : 'accessTypeCd',
                convert : function(value, record) {
                    return record.get('accessTypeCode') === criterion.Consts.ACCESS_TYPES.FULL_ACCESS
                }
            },
            {
                name : 'isSystemAdministrator',
                type : 'boolean',
                persist : false
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.security.profile.Role',
                name : 'roles',
                associationKey : 'roles'
            },
            {
                model : 'criterion.model.security.profile.Field',
                name : 'fields',
                associationKey : 'fields'
            },
            {
                model : 'criterion.model.security.profile.Report',
                name : 'reports',
                associationKey : 'reports'
            },
            {
                model : 'criterion.model.security.profile.EssFunction',
                name : 'essFunctions',
                associationKey : 'essFunctions'
            },
            {
                model : 'criterion.model.security.profile.Function',
                name : 'adminFunctions',
                associationKey : 'adminFunctions'
            },
            {
                model : 'criterion.model.security.profile.DocumentLocation',
                name : 'documentLocations',
                associationKey : 'documentLocations'
            }
        ]
    };
});
