Ext.define('criterion.model.security.profile.Role', function() {

    var VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.security.profile.role.Group'
        ],

        proxy : {
            type : 'memory'
        },

        fields : [
            {
                name : 'securityProfileId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employerId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'employerName',
                type : 'string',
                persist : false
            },
            {
                name : 'roleCd',
                type : 'criterion_codedata',
                codeDataId : criterion.consts.Dict.SECURITY_ROLE,
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'roleCode',
                type : 'criterion_codedatavalue',
                referenceField : 'roleCd',
                dataProperty : 'code'
            },
            {
                name : 'groups'
            },
            {
                name : 'groupEmployeeGroupIds',
                convert : function(newValue, model) {
                    var groups = model.get('groups');

                    return groups ? Ext.Array.pluck(groups, 'employeeGroupId') : [];
                }
            },
            {
                name : 'orgType',
                type : 'int',
                allowNull : true
            },
            {
                name : 'orgLevel',
                type : 'int',
                allowNull : true
            }
        ]
    };
});
